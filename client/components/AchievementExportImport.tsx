import React, { useState, useRef } from "react";
import { 
  Download, 
  Upload, 
  FileText, 
  FileSpreadsheet, 
  File,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { AchievementDatabaseService } from "@/services/achievementDatabaseService";
import type { Achievement } from "@/types";

interface AchievementExportImportProps {
  className?: string;
  userId?: string;
  achievements?: Achievement[];
}

export default function AchievementExportImport({ 
  className = "",
  userId,
  achievements = []
}: AchievementExportImportProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv' | 'pdf'>('json');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!userId) {
      setMessage({ type: 'error', text: 'User ID required for export' });
      return;
    }

    setExporting(true);
    setMessage(null);

    try {
      const result = await AchievementDatabaseService.exportAchievements(userId, exportFormat);
      
      if (result.success && result.data) {
        // Create and download file
        const fileName = `achievements_${new Date().toISOString().split('T')[0]}.${exportFormat}`;
        
        if (exportFormat === 'json') {
          downloadJSON(result.data, fileName);
        } else if (exportFormat === 'csv') {
          downloadCSV(result.data, fileName);
        } else if (exportFormat === 'pdf') {
          downloadPDF(result.data, fileName);
        }
        
        setMessage({ type: 'success', text: 'Achievements exported successfully!' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Export failed' });
      }
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
    }
  };

  const downloadJSON = (data: any, fileName: string) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (data: any, fileName: string) => {
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = (data: any, fileName: string) => {
    // Simple PDF generation using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Achievement Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .achievement { margin: 10px 0; padding: 10px; border: 1px solid #ccc; }
              .unlocked { background-color: #f0f0f0; }
              .locked { opacity: 0.6; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Achievement Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>User: ${data.user.name}</p>
            </div>
            <div>
              ${data.achievements.map((achievement: Achievement) => `
                <div class="achievement ${achievement.unlocked ? 'unlocked' : 'locked'}">
                  <h3>${achievement.title}</h3>
                  <p>${achievement.description}</p>
                  <p>Category: ${achievement.category}</p>
                  <p>Progress: ${achievement.progress}/${achievement.requirement}</p>
                  <p>Status: ${achievement.unlocked ? 'Unlocked' : 'Locked'}</p>
                </div>
              `).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const convertToCSV = (data: any): string => {
    const headers = ['Title', 'Description', 'Category', 'Progress', 'Requirement', 'Status', 'Unlocked At'];
    const rows = data.achievements.map((achievement: Achievement) => [
      achievement.title,
      achievement.description,
      achievement.category,
      achievement.progress,
      achievement.requirement,
      achievement.unlocked ? 'Unlocked' : 'Locked',
      achievement.unlockedAt || ''
    ]);
    
    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      let importData;

      try {
        importData = JSON.parse(text);
      } catch {
        setMessage({ type: 'error', text: 'Invalid file format. Please use a valid JSON file.' });
        setImporting(false);
        return;
      }

      const result = await AchievementDatabaseService.importAchievements(userId, importData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `Successfully imported ${result.imported} achievements!` 
        });
        
        // Refresh the page to show updated achievements
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Import failed' });
      }
    } catch (error) {
      console.error('Import error:', error);
      setMessage({ type: 'error', text: 'Import failed. Please try again.' });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div className="bg-slate-800 border border-slate-600 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Export & Import Achievements</h3>
        
        {/* Message Display */}
        {message && (
          <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' 
              ? 'bg-slate-700 border border-slate-500 text-white' 
              : 'bg-slate-700 border border-red-500 text-red-300'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Export Section */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-white mb-3">Export Achievements</h4>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={exportFormat}
              onChange={(e) => setExportFormat(e.target.value as any)}
              className="bg-slate-700 text-white border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
            
            <button
              onClick={handleExport}
              disabled={exporting || !userId}
              className="bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded font-medium flex items-center space-x-2"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span>{exporting ? 'Exporting...' : 'Export'}</span>
            </button>
          </div>
          
                     <div className="mt-2 text-sm text-slate-400">
             {exportFormat === 'json' && <FileText className="h-4 w-4 inline mr-1" />}
             {exportFormat === 'csv' && <FileSpreadsheet className="h-4 w-4 inline mr-1" />}
             {exportFormat === 'pdf' && <File className="h-4 w-4 inline mr-1" />}
             Export your achievements as {exportFormat.toUpperCase()}
           </div>
        </div>

        {/* Import Section */}
        <div>
          <h4 className="text-md font-medium text-white mb-3">Import Achievements</h4>
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <button
              onClick={triggerFileInput}
              disabled={importing || !userId}
              className="bg-white text-slate-900 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2 rounded font-medium flex items-center space-x-2"
            >
              {importing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              <span>{importing ? 'Importing...' : 'Import JSON'}</span>
            </button>
          </div>
          
          <div className="mt-2 text-sm text-slate-400">
            <FileText className="h-4 w-4 inline mr-1" />
            Import achievements from a JSON file
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
          <h5 className="text-sm font-medium text-white mb-2">About Export/Import</h5>
          <ul className="text-xs text-slate-300 space-y-1">
            <li>• Export includes all your achievement progress and unlock dates</li>
            <li>• Import will merge with existing achievements (won't overwrite)</li>
            <li>• Only JSON format is supported for import</li>
            <li>• Data is stored securely in your browser and database</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 