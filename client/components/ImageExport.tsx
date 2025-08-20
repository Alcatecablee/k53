import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, ImageAsset } from '@/data/imageMapping';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportCollection {
  id: string;
  name: string;
  description: string;
  images: ImageAsset[];
  category: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  createdAt: Date;
  lastModified: Date;
  tags: string[];
  isPublic: boolean;
}

interface ExportSettings {
  format: 'pdf' | 'png' | 'jpg';
  quality: 'low' | 'medium' | 'high';
  includeMetadata: boolean;
  includeProgress: boolean;
  includeNotes: boolean;
  pageSize: 'a4' | 'letter' | 'a3';
  orientation: 'portrait' | 'landscape';
  imagesPerPage: number;
  includeAnswers: boolean;
  includeExplanations: boolean;
}

interface ShareSettings {
  platform: 'email' | 'whatsapp' | 'telegram' | 'copy-link';
  includeProgress: boolean;
  includeNotes: boolean;
  message: string;
  recipientEmail?: string;
}

export function ImageExport() {
  const { toast } = useToast();
  const [collections, setCollections] = useState<ExportCollection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<ExportCollection | null>(null);
  const [exportSettings, setExportSettings] = useState<ExportSettings>({
    format: 'pdf',
    quality: 'high',
    includeMetadata: true,
    includeProgress: true,
    includeNotes: true,
    pageSize: 'a4',
    orientation: 'portrait',
    imagesPerPage: 4,
    includeAnswers: true,
    includeExplanations: true
  });
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    platform: 'copy-link',
    includeProgress: true,
    includeNotes: true,
    message: 'Check out my K53 study progress!'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('collections');
  const exportRef = useRef<HTMLDivElement>(null);

  // Load collections from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('k53-export-collections');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const collectionsWithDates = parsed.map((collection: any) => ({
          ...collection,
          createdAt: new Date(collection.createdAt),
          lastModified: new Date(collection.lastModified)
        }));
        setCollections(collectionsWithDates);
      } catch (error) {
        const errorMessage = 'Error loading export collections. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-export-collections');
      }
    }
  }, [toast]);

  // Save collections to localStorage
  const saveCollections = useCallback((updatedCollections: ExportCollection[]) => {
    try {
      localStorage.setItem('k53-export-collections', JSON.stringify(updatedCollections));
    } catch (error) {
      const errorMessage = 'Failed to save collections. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Create new collection
  const createCollection = useCallback((name: string, description: string, images: ImageAsset[], category: string, difficulty: 'basic' | 'intermediate' | 'advanced', tags: string[]) => {
    if (!name.trim()) {
      toast({
        title: "Validation Error",
        description: "Collection name is required.",
        variant: "destructive",
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one image is required for a collection.",
        variant: "destructive",
      });
      return;
    }

    const newCollection: ExportCollection = {
      id: `collection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      images,
      category,
      difficulty,
      createdAt: new Date(),
      lastModified: new Date(),
      tags: tags.filter(tag => tag.trim()),
      isPublic: false
    };

    const updatedCollections = [...collections, newCollection];
    setCollections(updatedCollections);
    saveCollections(updatedCollections);

    toast({
      title: "Collection Created",
      description: `Collection "${name}" has been created successfully.`,
    });
  }, [collections, saveCollections, toast]);

  // Update collection
  const updateCollection = useCallback((id: string, updates: Partial<ExportCollection>) => {
    const updatedCollections = collections.map(collection =>
      collection.id === id
        ? { ...collection, ...updates, lastModified: new Date() }
        : collection
    );
    setCollections(updatedCollections);
    saveCollections(updatedCollections);

    toast({
      title: "Collection Updated",
      description: "Collection has been updated successfully.",
    });
  }, [collections, saveCollections, toast]);

  // Delete collection
  const deleteCollection = useCallback((id: string) => {
    const updatedCollections = collections.filter(collection => collection.id !== id);
    setCollections(updatedCollections);
    saveCollections(updatedCollections);

    if (selectedCollection?.id === id) {
      setSelectedCollection(null);
    }

    toast({
      title: "Collection Deleted",
      description: "Collection has been deleted successfully.",
    });
  }, [collections, selectedCollection, saveCollections, toast]);

  // Export to PDF
  const exportToPDF = useCallback(async () => {
    if (!selectedCollection) {
      toast({
        title: "No Collection Selected",
        description: "Please select a collection to export.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setExportProgress(0);
    setError(null);

    try {
      const pdf = new jsPDF(exportSettings.orientation, 'mm', exportSettings.pageSize);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      const contentHeight = pageHeight - (2 * margin);

      // Add title page
      pdf.setFontSize(24);
      pdf.text(selectedCollection.name, pageWidth / 2, 40, { align: 'center' });
      
      pdf.setFontSize(12);
      pdf.text(selectedCollection.description, pageWidth / 2, 60, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`Category: ${selectedCollection.category}`, pageWidth / 2, 80, { align: 'center' });
      pdf.text(`Difficulty: ${selectedCollection.difficulty}`, pageWidth / 2, 90, { align: 'center' });
      pdf.text(`Created: ${selectedCollection.createdAt.toLocaleDateString()}`, pageWidth / 2, 100, { align: 'center' });
      pdf.text(`Images: ${selectedCollection.images.length}`, pageWidth / 2, 110, { align: 'center' });

      setExportProgress(10);

      // Add images
      const imagesPerPage = exportSettings.imagesPerPage;
      const totalPages = Math.ceil(selectedCollection.images.length / imagesPerPage);

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage();
        }

        const startIndex = page * imagesPerPage;
        const endIndex = Math.min(startIndex + imagesPerPage, selectedCollection.images.length);
        const pageImages = selectedCollection.images.slice(startIndex, endIndex);

        let yPosition = margin;

        for (let i = 0; i < pageImages.length; i++) {
          const image = pageImages[i];
          
          try {
            // Load image
            const img = new Image();
            img.crossOrigin = 'anonymous';
            
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = image.path;
            });

            // Calculate image dimensions
            const maxImageWidth = contentWidth / 2 - 10;
            const maxImageHeight = 60;
            const aspectRatio = img.width / img.height;
            
            let imageWidth = maxImageWidth;
            let imageHeight = imageWidth / aspectRatio;
            
            if (imageHeight > maxImageHeight) {
              imageHeight = maxImageHeight;
              imageWidth = imageHeight * aspectRatio;
            }

            // Add image to PDF with error handling
            const xPosition = margin + (i % 2) * (contentWidth / 2 + 10);
            try {
              pdf.addImage(img, 'PNG', xPosition, yPosition, imageWidth, imageHeight);
            } catch (pdfError) {
              console.error(`Failed to add image to PDF: ${image.path}`, pdfError);
              // Add placeholder text for failed images
              pdf.setFontSize(10);
              pdf.text(`[Image not available: ${image.filename}]`, xPosition, yPosition + 30);
            }

            // Add image metadata
            if (exportSettings.includeMetadata) {
              try {
                pdf.setFontSize(8);
                const description = image.description || image.filename;
                const truncatedDescription = description.length > 50 ? description.substring(0, 47) + '...' : description;
                pdf.text(truncatedDescription, xPosition, yPosition + imageHeight + 5);
                
                if (image.context && image.context.length > 0) {
                  const contextText = `Context: ${image.context.join(', ')}`;
                  const truncatedContext = contextText.length > 40 ? contextText.substring(0, 37) + '...' : contextText;
                  pdf.text(truncatedContext, xPosition, yPosition + imageHeight + 12);
                }
                
                if (image.difficulty) {
                  pdf.text(`Difficulty: ${image.difficulty}`, xPosition, yPosition + imageHeight + 19);
                }
              } catch (metadataError) {
                console.error('Failed to add metadata to PDF:', metadataError);
              }
            }

            // Move to next row if needed
            if (i % 2 === 1) {
              yPosition += Math.max(imageHeight + (exportSettings.includeMetadata ? 30 : 10), 80);
            }

            setExportProgress(10 + ((page + 1) / totalPages) * 80);

          } catch (imageError) {
            console.error(`Failed to load image: ${image.path}`, imageError);
            // Add placeholder text for failed images
            pdf.setFontSize(10);
            pdf.text(`[Image not available: ${image.filename}]`, margin + (i % 2) * (contentWidth / 2 + 10), yPosition + 30);
          }
        }
      }

      // Save PDF
      const filename = `${selectedCollection.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);

      setExportProgress(100);
      toast({
        title: "Export Successful",
        description: `PDF "${filename}" has been downloaded successfully.`,
      });

    } catch (error) {
      const errorMessage = 'Failed to generate PDF. Please try again.';
      setError(errorMessage);
      toast({
        title: "Export Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setExportProgress(0);
    }
  }, [selectedCollection, exportSettings, toast]);

  // Export to images
  const exportToImages = useCallback(async () => {
    if (!selectedCollection) {
      toast({
        title: "No Collection Selected",
        description: "Please select a collection to export.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setExportProgress(0);
    setError(null);

    try {
      for (let i = 0; i < selectedCollection.images.length; i++) {
        const image = selectedCollection.images[i];
        
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = image.path;
          });

          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            throw new Error('Failed to get canvas context');
          }

          // Set canvas size
          canvas.width = img.width;
          canvas.height = img.height;

          // Draw image
          ctx.drawImage(img, 0, 0);

          // Convert to blob
          const blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((blob) => {
              resolve(blob!);
            }, `image/${exportSettings.format}`, exportSettings.quality === 'high' ? 1 : exportSettings.quality === 'medium' ? 0.7 : 0.5);
          });

          // Download
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${image.filename.replace(/\.[^/.]+$/, '')}.${exportSettings.format}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);

          setExportProgress(((i + 1) / selectedCollection.images.length) * 100);

        } catch (imageError) {
          console.error(`Failed to export image: ${image.path}`, imageError);
        }
      }

      toast({
        title: "Export Successful",
        description: `All images have been exported successfully.`,
      });

    } catch (error) {
      const errorMessage = 'Failed to export images. Please try again.';
      setError(errorMessage);
      toast({
        title: "Export Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setExportProgress(0);
    }
  }, [selectedCollection, exportSettings, toast]);

  // Share collection
  const shareCollection = useCallback(async () => {
    if (!selectedCollection) {
      toast({
        title: "No Collection Selected",
        description: "Please select a collection to share.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const shareData = {
        title: selectedCollection.name,
        text: shareSettings.message,
        url: window.location.href,
        collection: {
          name: selectedCollection.name,
          description: selectedCollection.description,
          category: selectedCollection.category,
          difficulty: selectedCollection.difficulty,
          imageCount: selectedCollection.images.length,
          tags: selectedCollection.tags
        }
      };

      switch (shareSettings.platform) {
        case 'email':
          if (shareSettings.recipientEmail) {
            const subject = encodeURIComponent(`K53 Study Collection: ${selectedCollection.name}`);
            const body = encodeURIComponent(`${shareSettings.message}\n\nCollection: ${selectedCollection.name}\nDescription: ${selectedCollection.description}\nCategory: ${selectedCollection.category}\nDifficulty: ${selectedCollection.difficulty}\nImages: ${selectedCollection.images.length}\n\nView at: ${window.location.href}`);
            window.open(`mailto:${shareSettings.recipientEmail}?subject=${subject}&body=${body}`);
          } else {
            toast({
              title: "Email Required",
              description: "Please enter a recipient email address.",
              variant: "destructive",
            });
            return;
          }
          break;

        case 'whatsapp':
          const whatsappText = encodeURIComponent(`${shareSettings.message}\n\nCollection: ${selectedCollection.name}\nImages: ${selectedCollection.images.length}\n\nView at: ${window.location.href}`);
          window.open(`https://wa.me/?text=${whatsappText}`);
          break;

        case 'telegram':
          const telegramText = encodeURIComponent(`${shareSettings.message}\n\nCollection: ${selectedCollection.name}\nImages: ${selectedCollection.images.length}\n\nView at: ${window.location.href}`);
          window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${telegramText}`);
          break;

        case 'copy-link':
          const shareUrl = `${window.location.href}?collection=${selectedCollection.id}`;
          await navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link Copied",
            description: "Collection link has been copied to clipboard.",
          });
          break;
      }

    } catch (error) {
      const errorMessage = 'Failed to share collection. Please try again.';
      setError(errorMessage);
      toast({
        title: "Share Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [selectedCollection, shareSettings, toast]);

  // Print collection
  const printCollection = useCallback(() => {
    if (!selectedCollection) {
      toast({
        title: "No Collection Selected",
        description: "Please select a collection to print.",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Print Error",
        description: "Please allow pop-ups to print collections.",
        variant: "destructive",
      });
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedCollection.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .image-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
            .image-item { border: 1px solid #ccc; padding: 10px; text-align: center; }
            .image-item img { max-width: 100%; height: auto; }
            .metadata { font-size: 12px; margin-top: 10px; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${selectedCollection.name}</h1>
            <p>${selectedCollection.description}</p>
            <p>Category: ${selectedCollection.category} | Difficulty: ${selectedCollection.difficulty}</p>
            <p>Images: ${selectedCollection.images.length} | Created: ${selectedCollection.createdAt.toLocaleDateString()}</p>
          </div>
          <div class="image-grid">
            ${selectedCollection.images.map(image => `
              <div class="image-item">
                <img src="${image.path}" alt="${image.description || image.filename}" />
                <div class="metadata">
                  <p><strong>${image.description || image.filename}</strong></p>
                  ${image.context ? `<p>Context: ${image.context.join(', ')}</p>` : ''}
                  ${image.difficulty ? `<p>Difficulty: ${image.difficulty}</p>` : ''}
                </div>
              </div>
            `).join('')}
          </div>
          <div class="no-print">
            <button onclick="window.print()">Print</button>
            <button onclick="window.close()">Close</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  }, [selectedCollection, toast]);

  // Get all available images for collection creation
  const allImages = useMemo(() => {
    return Object.values(imageMapping).flat();
  }, []);

  // Filter images by category
  const getImagesByCategory = useCallback((category: string) => {
    return imageMapping[category] || [];
  }, []);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Export Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button 
              onClick={() => setError(null)}
              variant="outline"
            >
              Dismiss Error
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Image Export & Sharing</h1>
        <p className="text-muted-foreground">
          Export your study collections as PDFs, images, or share them with others
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="collections">Collections</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
          <TabsTrigger value="share">Share</TabsTrigger>
          <TabsTrigger value="print">Print</TabsTrigger>
        </TabsList>

        <TabsContent value="collections" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Study Collections</CardTitle>
                                  <Button 
                    onClick={() => {
                      // Create a sample collection for demonstration
                      const sampleImages = Object.values(imageMapping).flat().slice(0, 10) as ImageAsset[];
                      createCollection(
                        'Sample Collection',
                        'A sample collection for testing export features',
                        sampleImages,
                        'signs',
                        'basic',
                        ['sample', 'test', 'demo']
                      );
                    }}
                  variant="outline"
                  size="sm"
                >
                  Create Sample Collection
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {collections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">No collections created yet.</p>
                  <Button onClick={() => {
                    const sampleImages = Object.values(imageMapping).flat().slice(0, 10) as ImageAsset[];
                    createCollection(
                      'Sample Collection',
                      'A sample collection for testing export features',
                      sampleImages,
                      'signs',
                      'basic',
                      ['sample', 'test', 'demo']
                    );
                  }}>
                    Create Your First Collection
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {collections.map((collection) => (
                    <Card 
                      key={collection.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedCollection?.id === collection.id ? 'border-primary' : ''
                      }`}
                      onClick={() => setSelectedCollection(collection)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{collection.name}</h3>
                          <Badge variant={collection.isPublic ? 'default' : 'secondary'}>
                            {collection.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {collection.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {collection.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {collection.difficulty}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {collection.images.length} images
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>Created: {collection.createdAt.toLocaleDateString()}</span>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteCollection(collection.id);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="format">Export Format</Label>
                  <Select
                    value={exportSettings.format}
                    onValueChange={(value: 'pdf' | 'png' | 'jpg') =>
                      setExportSettings(prev => ({ ...prev, format: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="png">PNG Images</SelectItem>
                      <SelectItem value="jpg">JPG Images</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quality">Quality</Label>
                  <Select
                    value={exportSettings.quality}
                    onValueChange={(value: 'low' | 'medium' | 'high') =>
                      setExportSettings(prev => ({ ...prev, quality: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (Smaller file)</SelectItem>
                      <SelectItem value="medium">Medium (Balanced)</SelectItem>
                      <SelectItem value="high">High (Best quality)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pageSize">Page Size</Label>
                  <Select
                    value={exportSettings.pageSize}
                    onValueChange={(value: 'a4' | 'letter' | 'a3') =>
                      setExportSettings(prev => ({ ...prev, pageSize: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a4">A4</SelectItem>
                      <SelectItem value="letter">Letter</SelectItem>
                      <SelectItem value="a3">A3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="orientation">Orientation</Label>
                  <Select
                    value={exportSettings.orientation}
                    onValueChange={(value: 'portrait' | 'landscape') =>
                      setExportSettings(prev => ({ ...prev, orientation: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portrait">Portrait</SelectItem>
                      <SelectItem value="landscape">Landscape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="imagesPerPage">Images per Page</Label>
                  <Select
                    value={exportSettings.imagesPerPage.toString()}
                    onValueChange={(value) =>
                      setExportSettings(prev => ({ ...prev, imagesPerPage: parseInt(value) }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1</SelectItem>
                      <SelectItem value="2">2</SelectItem>
                      <SelectItem value="4">4</SelectItem>
                      <SelectItem value="6">6</SelectItem>
                      <SelectItem value="8">8</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMetadata"
                    checked={exportSettings.includeMetadata}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeMetadata: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeMetadata">Include image metadata</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeProgress"
                    checked={exportSettings.includeProgress}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeProgress: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeProgress">Include study progress</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeNotes"
                    checked={exportSettings.includeNotes}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeNotes: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeNotes">Include personal notes</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeAnswers"
                    checked={exportSettings.includeAnswers}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeAnswers: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeAnswers">Include answers</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeExplanations"
                    checked={exportSettings.includeExplanations}
                    onCheckedChange={(checked) =>
                      setExportSettings(prev => ({ ...prev, includeExplanations: checked as boolean }))
                    }
                  />
                  <Label htmlFor="includeExplanations">Include explanations</Label>
                </div>
              </div>

              {loading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={exportSettings.format === 'pdf' ? exportToPDF : exportToImages}
                  disabled={!selectedCollection || loading}
                  className="flex-1"
                >
                  {loading ? 'Exporting...' : `Export as ${exportSettings.format.toUpperCase()}`}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="share" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Share Collection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Share Platform</Label>
                  <Select
                    value={shareSettings.platform}
                    onValueChange={(value: 'email' | 'whatsapp' | 'telegram' | 'copy-link') =>
                      setShareSettings(prev => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telegram">Telegram</SelectItem>
                      <SelectItem value="copy-link">Copy Link</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {shareSettings.platform === 'email' && (
                  <div>
                    <Label htmlFor="recipientEmail">Recipient Email</Label>
                    <Input
                      id="recipientEmail"
                      type="email"
                      placeholder="Enter email address"
                      value={shareSettings.recipientEmail || ''}
                      onChange={(e) =>
                        setShareSettings(prev => ({ ...prev, recipientEmail: e.target.value }))
                      }
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter your message..."
                  value={shareSettings.message}
                  onChange={(e) =>
                    setShareSettings(prev => ({ ...prev, message: e.target.value }))
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shareProgress"
                    checked={shareSettings.includeProgress}
                    onCheckedChange={(checked) =>
                      setShareSettings(prev => ({ ...prev, includeProgress: checked as boolean }))
                    }
                  />
                  <Label htmlFor="shareProgress">Include study progress</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="shareNotes"
                    checked={shareSettings.includeNotes}
                    onCheckedChange={(checked) =>
                      setShareSettings(prev => ({ ...prev, includeNotes: checked as boolean }))
                    }
                  />
                  <Label htmlFor="shareNotes">Include personal notes</Label>
                </div>
              </div>

              <Button
                onClick={shareCollection}
                disabled={!selectedCollection || loading}
                className="w-full"
              >
                {loading ? 'Sharing...' : `Share via ${shareSettings.platform}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="print" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Print Collection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Print your collection for offline study. The print layout is optimized for paper.
              </p>
              
              <Button
                onClick={printCollection}
                disabled={!selectedCollection}
                className="w-full"
              >
                Print Collection
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Collection Preview */}
      {selectedCollection && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Collection: {selectedCollection.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {selectedCollection.images.slice(0, 8).map((image, index) => (
                <div key={index} className="border rounded-lg p-2">
                  <img
                    src={image.path}
                    alt={image.description || image.filename}
                    className="w-full h-24 object-cover rounded"
                  />
                  <p className="text-xs mt-1 truncate">
                    {image.description || image.filename}
                  </p>
                </div>
              ))}
              {selectedCollection.images.length > 8 && (
                <div className="border rounded-lg p-2 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">
                    +{selectedCollection.images.length - 8} more
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 