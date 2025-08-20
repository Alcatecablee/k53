import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { imageMapping, getImagesByCategory, getImageByContext, getImageByDifficulty } from '@/data/imageMapping';

interface ImageGalleryProps {
  mode?: 'practice' | 'study' | 'reference';
  onImageSelect?: (image: any) => void;
}

export function ImageGallery({ mode = 'reference', onImageSelect }: ImageGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('signs');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = Object.keys(imageMapping);
  const difficulties = ['all', 'basic', 'intermediate', 'advanced'];

  const filteredImages = imageMapping[selectedCategory as keyof typeof imageMapping]?.filter(image => {
    const matchesSearch = !searchTerm || 
      image.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.filename.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDifficulty = selectedDifficulty === 'all' || image.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesDifficulty;
  }) || [];

  const handleImageClick = (image: any) => {
    if (mode === 'practice') {
      onImageSelect?.(image);
    } else {
      setSelectedImage(image);
    }
  };

  const getCategoryStats = () => {
    const stats: Record<string, { total: number; basic: number; intermediate: number; advanced: number }> = {};
    
    categories.forEach(category => {
      const images = imageMapping[category as keyof typeof imageMapping] || [];
      stats[category] = {
        total: images.length,
        basic: images.filter(img => img.difficulty === 'basic').length,
        intermediate: images.filter(img => img.difficulty === 'intermediate').length,
        advanced: images.filter(img => img.difficulty === 'advanced').length
      };
    });
    
    return stats;
  };

  const stats = getCategoryStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">K53 Image Gallery</h2>
          <p className="text-slate-300">Browse {Object.values(stats).reduce((sum, stat) => sum + stat.total, 0)} K53 images</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            List
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map(category => (
          <Card key={category} className="bg-slate-800 border border-black transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <h3 className="font-semibold text-white capitalize mb-2">{category}</h3>
                <p className="text-2xl font-bold text-white mb-3">{stats[category].total}</p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                    {stats[category].basic} Basic
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                    {stats[category].intermediate} Int
                  </Badge>
                  <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                    {stats[category].advanced} Adv
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)} ({stats[category].total})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Select difficulty" />
          </SelectTrigger>
          <SelectContent>
            {difficulties.map(difficulty => (
              <SelectItem key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Image Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <Card 
              key={index} 
              className="bg-slate-800 border border-black hover:border-black cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleImageClick(image)}
            >
              <div className="aspect-square overflow-hidden rounded-t-lg">
                <img
                  src={image.path}
                  alt={image.description || image.filename}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <CardContent className="p-3">
                <div className="space-y-2">
                  <p className="text-sm text-white font-medium truncate">
                    {image.description || image.filename}
                  </p>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                      {image.difficulty}
                    </Badge>
                    {image.context?.map((ctx, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                        {ctx}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredImages.map((image, index) => (
            <Card 
              key={index} 
              className="bg-slate-800 border border-black hover:border-black cursor-pointer transition-all duration-300 hover:shadow-lg"
              onClick={() => handleImageClick(image)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 overflow-hidden rounded">
                    <img
                      src={image.path}
                      alt={image.description || image.filename}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {image.description || image.filename}
                    </h3>
                    <p className="text-sm text-slate-300">{image.filename}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                        {image.difficulty}
                      </Badge>
                      {image.context?.map((ctx, i) => (
                        <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                          {ctx}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Image Detail Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedImage?.description || selectedImage?.filename}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={selectedImage?.path}
                alt={selectedImage?.description || selectedImage?.filename}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-300">
                <strong>Filename:</strong> {selectedImage?.filename}
              </p>
              <p className="text-sm text-slate-300">
                <strong>Category:</strong> {selectedImage?.category}
              </p>
              <p className="text-sm text-slate-300">
                <strong>Difficulty:</strong> {selectedImage?.difficulty}
              </p>
              {selectedImage?.context && selectedImage.context.length > 0 && (
                <div>
                  <p className="text-sm text-slate-300 font-medium">Context:</p>
                  <div className="flex gap-1 mt-1">
                    {selectedImage.context.map((ctx: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs border-slate-600 text-slate-300 bg-slate-700">
                        {ctx}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">No images found matching your criteria.</p>
        </div>
      )}
    </div>
  );
} 
