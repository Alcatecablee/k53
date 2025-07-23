import React, { useState, useCallback, useRef } from "react";
import {
  Upload,
  X,
  FileText,
  Image,
  AlertCircle,
  CheckCircle,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in MB
  maxFiles?: number;
  onUpload?: (files: File[]) => Promise<any>;
  onComplete?: (results: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface UploadFile extends File {
  id: string;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  result?: any;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  accept = "*/*",
  multiple = false,
  maxSize = 10, // 10MB default
  maxFiles = 5,
  onUpload,
  onComplete,
  onError,
  className = "",
  disabled = false,
}) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createFileWithId = (file: File): UploadFile => ({
    ...file,
    id: Math.random().toString(36).substr(2, 9),
    progress: 0,
    status: "pending",
  });

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size exceeds ${maxSize}MB limit`;
    }

    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((type) => type.trim());
      const fileType = file.type;
      const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return type === fileExtension;
        }
        if (type.includes("*")) {
          const baseType = type.split("/")[0];
          return fileType.startsWith(baseType);
        }
        return type === fileType;
      });

      if (!isAccepted) {
        return `File type not accepted. Accepted types: ${accept}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const fileArray = Array.from(newFiles);

      if (files.length + fileArray.length > maxFiles) {
        onError?.(`Maximum ${maxFiles} files allowed`);
        return;
      }

      const validatedFiles: UploadFile[] = [];

      for (const file of fileArray) {
        const error = validateFile(file);
        if (error) {
          onError?.(error);
          continue;
        }
        validatedFiles.push(createFileWithId(file));
      }

      setFiles((prev) => [...prev, ...validatedFiles]);
    },
    [files.length, maxFiles, maxSize, accept, onError],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      handleFiles(droppedFiles);
    },
    [disabled, handleFiles],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFiles(e.target.files);
      }
    },
    [handleFiles],
  );

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (!onUpload || files.length === 0) return;

    setIsUploading(true);
    const results: any[] = [];

    for (const file of files) {
      if (file.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, status: "uploading" as const, progress: 0 }
            : f,
        ),
      );

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id === file.id && f.progress < 90) {
                return { ...f, progress: f.progress + Math.random() * 10 };
              }
              return f;
            }),
          );
        }, 200);

        const result = await onUpload([file]);
        clearInterval(progressInterval);

        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: "completed" as const,
                  progress: 100,
                  result,
                }
              : f,
          ),
        );

        results.push(result);
      } catch (error) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                  ...f,
                  status: "error" as const,
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : f,
          ),
        );
      }
    }

    setIsUploading(false);
    onComplete?.(results);
  };

  const getFileIcon = (file: UploadFile) => {
    if (file.type.startsWith("image/")) {
      return <Image className="w-6 h-6 text-blue-500" />;
    }
    return <FileText className="w-6 h-6 text-gray-500" />;
  };

  const getStatusIcon = (file: UploadFile) => {
    switch (file.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const completedFiles = files.filter((f) => f.status === "completed");
  const hasErrors = files.some((f) => f.status === "error");

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-gray-400"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />

        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            isDragOver ? "text-blue-500" : "text-gray-400"
          }`}
        />

        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            {isDragOver ? "Drop files here" : "Drag and drop files here"}
          </p>
          <p className="text-sm text-gray-500">or click to browse files</p>
          <p className="text-xs text-gray-400">
            Max {maxFiles} files, {maxSize}MB each. Accepted: {accept}
          </p>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Files ({files.length})
            </h3>
            <div className="flex space-x-2">
              {onUpload && (
                <Button
                  onClick={uploadFiles}
                  disabled={
                    isUploading ||
                    disabled ||
                    files.every((f) => f.status !== "pending")
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isUploading ? "Uploading..." : "Upload Files"}
                </Button>
              )}
              <Button
                onClick={() => setFiles([])}
                variant="outline"
                className="border-gray-300"
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div className="flex-shrink-0">{getFileIcon(file)}</div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(file)}
                      {file.status === "pending" && (
                        <Button
                          onClick={() => removeFile(file.id)}
                          size="sm"
                          variant="ghost"
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                    <span>{formatFileSize(file.size)}</span>
                    <span className="capitalize">{file.status}</span>
                  </div>

                  {file.status === "uploading" && (
                    <Progress value={file.progress} className="h-2" />
                  )}

                  {file.status === "error" && file.error && (
                    <p className="text-xs text-red-600 mt-1">{file.error}</p>
                  )}

                  {file.status === "completed" && file.result && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-green-600">
                        Upload successful
                      </p>
                      {file.result.downloadUrl && (
                        <Button
                          onClick={() =>
                            window.open(file.result.downloadUrl, "_blank")
                          }
                          size="sm"
                          variant="outline"
                          className="border-gray-300"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      {files.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-4 text-sm">
            <span className="text-gray-600">Total: {files.length} files</span>
            {completedFiles.length > 0 && (
              <span className="text-green-600">
                ✓ {completedFiles.length} completed
              </span>
            )}
            {hasErrors && (
              <span className="text-red-600">
                ✗ {files.filter((f) => f.status === "error").length} failed
              </span>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {formatFileSize(
              files.reduce((total, file) => total + file.size, 0),
            )}{" "}
            total
          </div>
        </div>
      )}
    </div>
  );
};

// CSV Upload Component with preview
interface CSVUploadProps {
  onComplete?: (data: any[]) => void;
  onError?: (error: string) => void;
  className?: string;
}

export const CSVUpload: React.FC<CSVUploadProps> = ({
  onComplete,
  onError,
  className = "",
}) => {
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);

  const handleCSVUpload = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      throw new Error("Please select a CSV file");
    }

    const text = await file.text();
    const lines = text.split("\n").filter((line) => line.trim());

    if (lines.length === 0) {
      throw new Error("CSV file is empty");
    }

    const parsedData = lines.map((line) => {
      // Simple CSV parsing - in production, use a proper CSV parser
      const values = [];
      let current = "";
      let inQuotes = false;

      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else {
          current += char;
        }
      }
      values.push(current.trim());

      return values.map((val) => val.replace(/^"|"$/g, ""));
    });

    setHeaders(parsedData[0] || []);
    setCsvData(parsedData.slice(1));
    setPreview(true);

    return { success: true, rows: parsedData.length - 1 };
  };

  const processData = () => {
    const processed = csvData.map((row) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || "";
      });
      return obj;
    });

    onComplete?.(processed);
    setPreview(false);
  };

  return (
    <div className={className}>
      {!preview ? (
        <FileUpload
          accept=".csv,text/csv"
          multiple={false}
          maxSize={5}
          maxFiles={1}
          onUpload={handleCSVUpload}
          onError={onError}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              CSV Preview ({csvData.length} rows)
            </h3>
            <div className="flex space-x-2">
              <Button
                onClick={processData}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Import Data
              </Button>
              <Button
                onClick={() => setPreview(false)}
                variant="outline"
                className="border-gray-300"
              >
                Cancel
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {headers.map((header, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {csvData.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {csvData.length > 10 && (
              <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500 text-center">
                ... and {csvData.length - 10} more rows
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
