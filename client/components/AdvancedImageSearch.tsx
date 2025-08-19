import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface SearchFilters {
  text: string;
  categories: string[];
  colors: string[];
  shapes: string[];
  contexts: string[];
  difficulties: string[];
  tags: string[];
  dateRange?: { start: Date; end: Date };
}

interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
  lastUsed: Date;
}

export function AdvancedImageSearch() {
  const { toast } = useToast();
  const [filters, setFilters] = useState<SearchFilters>({
    text: '',
    categories: [],
    colors: [],
    shapes: [],
    contexts: [],
    difficulties: [],
    tags: []
  });
  
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'difficulty' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Available filter options
  const filterOptions = {
    categories: Object.keys(imageMapping),
    colors: ['red', 'yellow', 'blue', 'green', 'brown', 'white', 'black'],
    shapes: ['circular', 'triangular', 'rectangular', 'diamond', 'octagonal', 'square'],
    contexts: ['regulatory', 'warning', 'information', 'tourism', 'highway', 'urban', 'school-zone', 'pedestrian', 'emergency'],
    difficulties: ['basic', 'intermediate', 'advanced'],
    tags: ['stop', 'yield', 'speed', 'parking', 'overtaking', 'intersection', 'crossing', 'construction', 'weather']
  };

  // Load saved searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('k53-saved-searches');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const searchesWithDates = parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: new Date(search.lastUsed)
        }));
        setSavedSearches(searchesWithDates);
      } catch (error) {
        const errorMessage = 'Error loading saved searches. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-saved-searches');
      }
    }
  }, [toast]);

  // Save searches to localStorage
  const saveSearches = useCallback((searches: SavedSearch[]) => {
    try {
      localStorage.setItem('k53-saved-searches', JSON.stringify(searches));
    } catch (error) {
      const errorMessage = 'Failed to save searches. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Apply filters to images
  const filteredImages = useMemo(() => {
    try {
      const allImages = Object.values(imageMapping).flat();
      
      return allImages.filter(image => {
        // Text search
        if (filters.text) {
          const searchText = filters.text.toLowerCase();
          const matchesText = 
            image.description?.toLowerCase().includes(searchText) ||
            image.filename.toLowerCase().includes(searchText) ||
            image.context?.some(ctx => ctx.toLowerCase().includes(searchText));
          
          if (!matchesText) return false;
        }

        // Category filter
        if (filters.categories.length > 0) {
          const imageCategory = Object.keys(imageMapping).find(cat => 
            imageMapping[cat as keyof typeof imageMapping]?.includes(image)
          );
          if (!imageCategory || !filters.categories.includes(imageCategory)) {
            return false;
          }
        }

        // Color filter
        if (filters.colors.length > 0) {
          const imageColors = image.colors || [];
          const hasMatchingColor = filters.colors.some(color => 
            imageColors.includes(color)
          );
          if (!hasMatchingColor) return false;
        }

        // Shape filter
        if (filters.shapes.length > 0) {
          const imageShape = image.shape || '';
          if (!filters.shapes.includes(imageShape)) return false;
        }

        // Context filter
        if (filters.contexts.length > 0) {
          const imageContexts = image.context || [];
          const hasMatchingContext = filters.contexts.some(context => 
            imageContexts.includes(context)
          );
          if (!hasMatchingContext) return false;
        }

        // Difficulty filter
        if (filters.difficulties.length > 0) {
          const imageDifficulty = image.difficulty || 'basic';
          if (!filters.difficulties.includes(imageDifficulty)) return false;
        }

        // Tag filter
        if (filters.tags.length > 0) {
          const imageTags = image.tags || [];
          const hasMatchingTag = filters.tags.some(tag => 
            imageTags.includes(tag)
          );
          if (!hasMatchingTag) return false;
        }

        return true;
      });
    } catch (error) {
      const errorMessage = 'Error filtering images. Please try again.';
      setError(errorMessage);
      toast({
        title: "Filter Error",
        description: errorMessage,
        variant: "destructive",
      });
      return [];
    }
  }, [filters, toast]);

  // Sort filtered images
  const sortedImages = useMemo(() => {
    const sorted = [...filteredImages].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.filename;
          bValue = b.filename;
          break;
        case 'category':
          aValue = Object.keys(imageMapping).find(cat => 
            imageMapping[cat as keyof typeof imageMapping]?.includes(a)
          ) || '';
          bValue = Object.keys(imageMapping).find(cat => 
            imageMapping[cat as keyof typeof imageMapping]?.includes(b)
          ) || '';
          break;
        case 'difficulty':
          aValue = a.difficulty || 'basic';
          bValue = b.difficulty || 'basic';
          break;
        case 'date':
          aValue = a.createdAt || new Date(0);
          bValue = b.createdAt || new Date(0);
          break;
        default:
          aValue = a.filename;
          bValue = b.filename;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return sorted;
  }, [filteredImages, sortBy, sortOrder]);

  // Save current search
  const saveCurrentSearch = useCallback(() => {
    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;

    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: searchName,
      filters: { ...filters },
      createdAt: new Date(),
      lastUsed: new Date()
    };

    const updatedSearches = [newSearch, ...savedSearches];
    setSavedSearches(updatedSearches);
    saveSearches(updatedSearches);

    toast({
      title: "Search Saved",
      description: `Search "${searchName}" has been saved.`,
      variant: "default",
    });
  }, [filters, savedSearches, saveSearches, toast]);

  // Load saved search
  const loadSavedSearch = useCallback((search: SavedSearch) => {
    setFilters(search.filters);
    
    // Update last used
    const updatedSearches = savedSearches.map(s => 
      s.id === search.id 
        ? { ...s, lastUsed: new Date() }
        : s
    );
    setSavedSearches(updatedSearches);
    saveSearches(updatedSearches);

    toast({
      title: "Search Loaded",
      description: `Loaded search "${search.name}".`,
      variant: "default",
    });
  }, [savedSearches, saveSearches, toast]);

  // Delete saved search
  const deleteSavedSearch = useCallback((searchId: string) => {
    const updatedSearches = savedSearches.filter(s => s.id !== searchId);
    setSavedSearches(updatedSearches);
    saveSearches(updatedSearches);

    toast({
      title: "Search Deleted",
      description: "Search has been deleted.",
      variant: "default",
    });
  }, [savedSearches, saveSearches, toast]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({
      text: '',
      categories: [],
      colors: [],
      shapes: [],
      contexts: [],
      difficulties: [],
      tags: []
    });

    toast({
      title: "Filters Cleared",
      description: "All filters have been cleared.",
      variant: "default",
    });
  }, [toast]);

  // Update filter
  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Advanced Image Search</h2>
          <p className="text-slate-300 text-sm sm:text-base">
            Search and filter through 2,251 K53 images
          </p>
        </div>
        
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="text-red-400 text-lg font-medium">
                {error}
              </div>
              <Button 
                onClick={() => setError(null)}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wide">Advanced Image Search</h2>
        <p className="text-slate-300 text-sm sm:text-base">
          Search and filter through 2,251 K53 images
        </p>
      </div>

      {/* Search Interface */}
      <Card className="bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Search */}
          <div className="space-y-2">
            <Label htmlFor="text-search" className="text-slate-300">Text Search</Label>
            <Input
              id="text-search"
              placeholder="Search by description, filename, or context..."
              value={filters.text}
              onChange={(e) => updateFilter('text', e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400"
            />
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear All
              </Button>
              <Button
                variant="outline"
                onClick={saveCurrentSearch}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Save Search
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Categories */}
              <div className="space-y-3">
                <Label className="text-slate-300">Categories</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.categories.map(category => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category}`}
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('categories', [...filters.categories, category]);
                          } else {
                            updateFilter('categories', filters.categories.filter(c => c !== category));
                          }
                        }}
                      />
                      <Label htmlFor={`category-${category}`} className="text-slate-300 text-sm">
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="space-y-3">
                <Label className="text-slate-300">Colors</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.colors.map(color => (
                    <div key={color} className="flex items-center space-x-2">
                      <Checkbox
                        id={`color-${color}`}
                        checked={filters.colors.includes(color)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('colors', [...filters.colors, color]);
                          } else {
                            updateFilter('colors', filters.colors.filter(c => c !== color));
                          }
                        }}
                      />
                      <Label htmlFor={`color-${color}`} className="text-slate-300 text-sm capitalize">
                        {color}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shapes */}
              <div className="space-y-3">
                <Label className="text-slate-300">Shapes</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.shapes.map(shape => (
                    <div key={shape} className="flex items-center space-x-2">
                      <Checkbox
                        id={`shape-${shape}`}
                        checked={filters.shapes.includes(shape)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('shapes', [...filters.shapes, shape]);
                          } else {
                            updateFilter('shapes', filters.shapes.filter(s => s !== shape));
                          }
                        }}
                      />
                      <Label htmlFor={`shape-${shape}`} className="text-slate-300 text-sm capitalize">
                        {shape}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contexts */}
              <div className="space-y-3">
                <Label className="text-slate-300">Contexts</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.contexts.map(context => (
                    <div key={context} className="flex items-center space-x-2">
                      <Checkbox
                        id={`context-${context}`}
                        checked={filters.contexts.includes(context)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('contexts', [...filters.contexts, context]);
                          } else {
                            updateFilter('contexts', filters.contexts.filter(c => c !== context));
                          }
                        }}
                      />
                      <Label htmlFor={`context-${context}`} className="text-slate-300 text-sm capitalize">
                        {context.replace('-', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulties */}
              <div className="space-y-3">
                <Label className="text-slate-300">Difficulties</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.difficulties.map(difficulty => (
                    <div key={difficulty} className="flex items-center space-x-2">
                      <Checkbox
                        id={`difficulty-${difficulty}`}
                        checked={filters.difficulties.includes(difficulty)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('difficulties', [...filters.difficulties, difficulty]);
                          } else {
                            updateFilter('difficulties', filters.difficulties.filter(d => d !== difficulty));
                          }
                        }}
                      />
                      <Label htmlFor={`difficulty-${difficulty}`} className="text-slate-300 text-sm capitalize">
                        {difficulty}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <Label className="text-slate-300">Tags</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {filterOptions.tags.map(tag => (
                    <div key={tag} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={filters.tags.includes(tag)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            updateFilter('tags', [...filters.tags, tag]);
                          } else {
                            updateFilter('tags', filters.tags.filter(t => t !== tag));
                          }
                        }}
                      />
                      <Label htmlFor={`tag-${tag}`} className="text-slate-300 text-sm capitalize">
                        {tag}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="flex justify-between items-center">
        <div className="text-slate-300">
          <span className="font-medium">{sortedImages.length}</span> images found
        </div>
        
        <div className="flex gap-4 items-center">
          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Label htmlFor="sort-by" className="text-slate-300 text-sm">Sort by:</Label>
            <Select value={sortBy} onValueChange={(value: 'name' | 'category' | 'difficulty' | 'date') => setSortBy(value)}>
              <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
                <SelectItem value="date">Date</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Label className="text-slate-300 text-sm">View:</Label>
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className={viewMode === 'grid' ? 'bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              Grid
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'bg-blue-600' : 'border-slate-600 text-slate-300 hover:bg-slate-700'}
            >
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card className="bg-slate-800 border-slate-600">
          <CardHeader>
            <CardTitle className="text-white">Saved Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSearches.map(search => (
                <div key={search.id} className="p-4 bg-slate-700 rounded-lg border border-slate-600">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-medium">{search.name}</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSavedSearch(search.id)}
                      className="border-red-600 text-red-400 hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">
                    Last used: {search.lastUsed.toLocaleDateString()}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadSavedSearch(search)}
                    className="w-full border-slate-600 text-slate-300 hover:bg-slate-600"
                  >
                    Load Search
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {sortedImages.length > 0 ? (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' : 'space-y-4'}>
          {sortedImages.map((image, index) => (
            <Card key={image.id || index} className="bg-slate-800 border-slate-600 hover:border-slate-500 transition-colors">
              <CardContent className="p-4">
                <div className="aspect-square relative overflow-hidden rounded-lg border border-slate-600 mb-3">
                  <img
                    src={image.path}
                    alt={image.description || image.filename}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-white text-sm font-medium truncate">
                    {image.description || image.filename}
                  </h4>
                  
                  <div className="flex flex-wrap gap-1">
                    {image.difficulty && (
                      <Badge variant="outline" className="text-xs">
                        {image.difficulty}
                      </Badge>
                    )}
                    {image.context?.slice(0, 2).map((ctx, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
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
        <Card className="bg-slate-800 border-slate-600">
          <CardContent className="p-12">
            <div className="text-center space-y-4">
              <p className="text-slate-300 text-lg">
                No images found matching your criteria.
              </p>
              <p className="text-slate-400 text-sm">
                Try adjusting your filters or search terms.
              </p>
              <Button
                onClick={clearFilters}
                variant="outline"
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
