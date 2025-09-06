'use client';
import React, { useState, useEffect } from "react";
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Button  } from '@/components/ui/button';
import {  Input  } from '@/components/ui/input';
import {  Badge  } from '@/components/ui/badge';
import {  Tabs, TabsContent, TabsList, TabsTrigger  } from '@/components/ui/tabs';
import {  BookOpen, FileText, Plus, Search, Filter, Download, Upload, Edit, Trash2, Eye, BarChart3  } from 'lucide-react';
import {  DataTable, DataTableColumn  } from './DataTable';
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from '@/components/ui/select';
import {  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger  } from '@/components/ui/dialog';
import {  Label  } from '@/components/ui/label';
import {  Textarea  } from '@/components/ui/textarea';
import {  useToast  } from '@/hooks/use-toast';

interface ContentStats {
  questions: number;
  scenarios: number;
  totalContent: number;
  categories: Record<string, number>;
  difficultyLevels: Record<string, number>;
}

interface ContentItem {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  created_at: string;
  updated_at: string;
  status: string;
  usage_count?: number;
}

interface ContentManagerProps {
  type: "questions" | "scenarios";
}

export function ContentManager({ type }: ContentManagerProps) {
  const { toast } = useToast();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [stats, setStats] = useState<ContentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newContent, setNewContent] = useState({
    title: '',
    category: '',
    difficulty: 'medium',
    status: 'active'
  });

  useEffect(() => {
    loadContent();
    loadStats();
  }, [type]);

  const loadContent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/content/${type}`);
      if (response.ok) {
        const data = await response.json();
        console.log(`Content API response for ${type}:`, data); // Debug log
        // Handle different possible response structures
        const contentData = data.data || data.questions || data.scenarios || data || [];
        setContent(Array.isArray(contentData) ? contentData : []);
      } else {
        console.warn(`${type} endpoint not available, using empty data`);
        setContent([]);
      }
    } catch (error) {
      console.error(`Failed to load ${type}:`, error);
      setContent([]);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch("/api/content/stats");
      if (response.ok) {
        const data = await response.json();
        // Handle different possible response structures
        if (data && typeof data === 'object') {
          // If the API returns a simple object with total, categories, difficulties
          if (data.total !== undefined) {
            setStats({
              questions: type === "questions" ? data.total : 0,
              scenarios: type === "scenarios" ? data.total : 0,
              totalContent: data.total || 0,
              categories: data.categories || {},
              difficultyLevels: data.difficulties || {}
            });
          } else {
            // If it returns the expected structure
            setStats({
              questions: data.questions || 0,
              scenarios: data.scenarios || 0,
              totalContent: data.totalContent || 0,
              categories: data.categories || {},
              difficultyLevels: data.difficultyLevels || {}
            });
          }
        } else {
          // Fallback if data is not an object
          setStats({
            questions: type === "questions" ? content.length : 0,
            scenarios: type === "scenarios" ? content.length : 0,
            totalContent: content.length,
            categories: {},
            difficultyLevels: {}
          });
        }
      } else {
        // Fallback stats if endpoint doesn't exist
        console.warn("Content stats endpoint not available, using fallback data");
        setStats({
          questions: type === "questions" ? content.length : 0,
          scenarios: type === "scenarios" ? content.length : 0,
          totalContent: content.length,
          categories: {},
          difficultyLevels: {}
        });
      }
    } catch (error) {
      console.error("Failed to load content stats:", error);
      // Set fallback stats
      setStats({
        questions: type === "questions" ? content.length : 0,
        scenarios: type === "scenarios" ? content.length : 0,
        totalContent: content.length,
        categories: {},
        difficultyLevels: {}
      });
    }
  };

  const filteredContent = content.filter((item) => {
    if (!item || typeof item !== 'object') return false;

    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || item.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const categories = [...new Set(content.map((item) => item.category).filter(Boolean))];
  const difficulties = [...new Set(content.map((item) => item.difficulty).filter(Boolean))];

  const columns: DataTableColumn<ContentItem>[] = [
  {
    key: "title",
    title: "Title",
    sortable: true,
    filterable: true
  },
  {
    key: "category",
    title: "Category",
    sortable: true,
    filterable: true,
    render: (value) =>
    <Badge variant="outline" className="text-xs">
          {typeof value === 'string' ? value : typeof value === 'object' ? JSON.stringify(value) : String(value || '')}
        </Badge>

  },
  {
    key: "difficulty",
    title: "Difficulty",
    sortable: true,
    filterable: true,
    render: (value) => {
      const colors = {
        easy: "bg-green-100 text-green-800",
        medium: "bg-yellow-100 text-yellow-800",
        hard: "bg-red-100 text-red-800"
      };
      const stringValue = typeof value === 'string' ? value : String(value || '');
      return (
        <Badge className={colors[stringValue as keyof typeof colors] || "bg-gray-100 text-gray-800"}>
            {stringValue}
          </Badge>);

    }
  },
  {
    key: "status",
    title: "Status",
    sortable: true,
    filterable: true,
    render: (value) =>
    <Badge className={value === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
          {typeof value === 'string' ? value : String(value || '')}
        </Badge>

  },
  {
    key: "usage_count",
    title: "Usage",
    sortable: true,
    render: (value) => value || 0
  },
  {
    key: "created_at",
    title: "Created",
    sortable: true,
    render: (value) => new Date(value).toLocaleDateString()
  }];


  const exportContent = () => {
    const headers = ["ID", "Title", "Category", "Difficulty", "Status", "Usage", "Created"];
    const rows = filteredContent.map((item) => [
    item.id,
    item.title,
    item.category,
    item.difficulty,
    item.status,
    item.usage_count || 0,
    new Date(item.created_at).toLocaleDateString()]
    );

    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${type}_export_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Real add content function
  const handleAddContent = async () => {
    if (!newContent.title || !newContent.category) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await fetch(`/api/content/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContent)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type.slice(0, -1)} added successfully!`
        });
        setShowAddModal(false);
        setNewContent({ title: '', category: '', difficulty: 'medium', status: 'active' });
        loadContent(); // Refresh content
      } else {
        toast({
          title: "Error",
          description: `Failed to add ${type.slice(0, -1)}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error adding ${type}:`, error);
      toast({
        title: "Error",
        description: `Error adding ${type.slice(0, -1)}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Real import content function
  const handleImportContent = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.json')) {
      toast({
        title: "Error",
        description: "Please select a CSV or JSON file",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`/api/content/${type}/import`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: `Successfully imported ${result.count} ${type}!`
        });
        setShowImportModal(false);
        loadContent(); // Refresh content
      } else {
        toast({
          title: "Error",
          description: `Failed to import ${type}. Please check your file format.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error importing ${type}:`, error);
      toast({
        title: "Error",
        description: `Error importing ${type}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Real delete content function
  const handleDeleteContent = async (item: ContentItem) => {
    if (!confirm(`Are you sure you want to delete "${item.title}"?`)) return;

    try {
      const response = await fetch(`/api/content/${type}/${item.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type.slice(0, -1)} deleted successfully!`
        });
        loadContent(); // Refresh content
      } else {
        toast({
          title: "Error",
          description: `Failed to delete ${type.slice(0, -1)}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Error deleting ${type.slice(0, -1)}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  // Real edit content function
  const handleEditContent = async (item: ContentItem) => {
    const newTitle = prompt('Enter new title:', item.title);
    if (!newTitle || newTitle === item.title) return;

    try {
      const response = await fetch(`/api/content/${type}/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, title: newTitle })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `${type.slice(0, -1)} updated successfully!`
        });
        loadContent(); // Refresh content
      } else {
        toast({
          title: "Error",
          description: `Failed to update ${type.slice(0, -1)}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
      toast({
        title: "Error",
        description: `Error updating ${type.slice(0, -1)}. Please try again.`,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-2 border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total {type}</p>
                <p className="text-2xl font-bold text-white">
                  {(() => {
                    if (!stats) return content.length;
                    const value = type === "questions" ? stats.questions : stats.scenarios;
                    return typeof value === 'number' ? value : content.length;
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-2 border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Categories</p>
                <p className="text-2xl font-bold text-white">
                  {categories.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-2 border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <p className="text-2xl font-bold text-white">
                  {content.filter((item) => item.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-2 border-black">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Download className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-sm text-gray-400">Total Usage</p>
                <p className="text-2xl font-bold text-white">
                  {content.reduce((sum, item) => sum + (item.usage_count || 0), 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="bg-slate-800 border-2 border-black">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              {type.charAt(0).toUpperCase() + type.slice(1)} Management
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportContent}
                className="border-black bg-slate-700 text-white hover:bg-slate-600">

                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowImportModal(true)}
                className="border-black bg-slate-700 text-white hover:bg-slate-600">

                <Upload className="w-4 h-4 mr-2" />
                Import
              </Button>
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white hover:bg-blue-700">

                <Plus className="w-4 h-4 mr-2" />
                Add {type.slice(0, -1)}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder={`Search ${type}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-black bg-slate-700 text-white" />

            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40 border-black bg-slate-700 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) =>
                <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40 border-black bg-slate-700 text-white">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                {difficulties.map((difficulty) =>
                <SelectItem key={difficulty} value={difficulty}>
                    {difficulty}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <DataTable
            data={filteredContent}
            columns={columns}
            searchable={false}
            exportable={false}
            pageSize={10}
            loading={loading}
            onView={(item) => console.log("View item:", item)}
            onEdit={handleEditContent}
            onDelete={handleDeleteContent} />

        </CardContent>
      </Card>

      {/* Add Content Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="bg-slate-800 border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-white">Add New {type.slice(0, -1)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-white">Title</Label>
              <Input
                id="title"
                value={newContent.title}
                onChange={(e) => setNewContent({ ...newContent, title: e.target.value })}
                className="border-black bg-slate-700 text-white"
                placeholder={`Enter ${type.slice(0, -1)} title`} />

            </div>
            <div>
              <Label htmlFor="category" className="text-white">Category</Label>
              <Input
                id="category"
                value={newContent.category}
                onChange={(e) => setNewContent({ ...newContent, category: e.target.value })}
                className="border-black bg-slate-700 text-white"
                placeholder="Enter category" />

            </div>
            <div>
              <Label htmlFor="difficulty" className="text-white">Difficulty</Label>
              <Select
                value={newContent.difficulty}
                onValueChange={(value) => setNewContent({ ...newContent, difficulty: value })}>

                <SelectTrigger className="border-black bg-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status" className="text-white">Status</Label>
              <Select
                value={newContent.status}
                onValueChange={(value) => setNewContent({ ...newContent, status: value })}>

                <SelectTrigger className="border-black bg-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowAddModal(false)}
                className="border-black bg-slate-700 text-white hover:bg-slate-600">

                Cancel
              </Button>
              <Button
                onClick={handleAddContent}
                className="bg-blue-600 text-white hover:bg-blue-700">

                Add {type.slice(0, -1)}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Content Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="bg-slate-800 border-2 border-black">
          <DialogHeader>
            <DialogTitle className="text-white">Import {type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="import-file" className="text-white">Select File</Label>
              <Input
                id="import-file"
                type="file"
                accept=".csv,.json"
                onChange={handleImportContent}
                className="border-black bg-slate-700 text-white" />

              <p className="text-sm text-gray-400 mt-1">
                Supported formats: CSV, JSON
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowImportModal(false)}
                className="border-black bg-slate-700 text-white hover:bg-slate-600">

                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>);

}

export default ContentManager;
