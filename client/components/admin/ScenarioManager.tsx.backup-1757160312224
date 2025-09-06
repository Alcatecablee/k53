import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  getScenarioStats,
  getScenarios,
  searchScenarios,
  type ScenarioStats,
  type ScenarioFilters,
} from "@/services/scenarioService";
import { showError, showInfo } from "@/services/notificationService";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"];

export function ScenarioManager() {
  const [stats, setStats] = useState<ScenarioStats | null>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ScenarioFilters>({
    limit: 50,
    offset: 0,
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadStats();
    loadScenarios();
  }, []);

  const loadStats = async () => {
    try {
      const scenarioStats = await getScenarioStats();
      setStats(scenarioStats);
    } catch (error) {
      showError("Failed to load scenario statistics", "Error");
    }
  };

  const loadScenarios = async () => {
    try {
      setLoading(true);
      const scenarioList = await getScenarios(filters);
      setScenarios(scenarioList);
    } catch (error) {
      showError("Failed to load scenarios", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      loadScenarios();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await searchScenarios(searchTerm);
      setScenarios(searchResults);
    } catch (error) {
      showError("Search failed", "Error");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof ScenarioFilters, value: any) => {
    const newFilters = { ...filters, [key]: value, offset: 0 };
    setFilters(newFilters);
    loadScenarios();
  };

  const categoryData = stats ? [
    { name: "Controls", value: stats.byCategory.controls },
    { name: "Signs", value: stats.byCategory.signs },
    { name: "Rules", value: stats.byCategory.rules },
    { name: "Mixed", value: stats.byCategory.mixed },
  ] : [];

  const difficultyData = stats ? [
    { name: "Basic", value: stats.byDifficulty.basic },
    { name: "Intermediate", value: stats.byDifficulty.intermediate },
    { name: "Advanced", value: stats.byDifficulty.advanced },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Scenario Management</h1>
        <div className="flex gap-2">
          <Button onClick={loadStats} variant="outline">
            Refresh Stats
          </Button>
          <Button onClick={loadScenarios} variant="outline">
            Refresh Scenarios
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Scenarios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">City Specific</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byLocation.citySpecific}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Regional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byLocation.regional}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">National</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.byLocation.national}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scenarios by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scenarios by Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={difficultyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={filters.category || ""}
                onValueChange={(value) => handleFilterChange("category", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  <SelectItem value="controls">Controls</SelectItem>
                  <SelectItem value="signs">Signs</SelectItem>
                  <SelectItem value="rules">Rules</SelectItem>
                  <SelectItem value="mixed">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select
                value={filters.difficulty || ""}
                onValueChange={(value) => handleFilterChange("difficulty", value || undefined)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Difficulties</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search scenarios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleSearch} className="w-full">
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scenarios ({scenarios.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading scenarios...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Difficulty</TableHead>
                  <TableHead>Context</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scenarios.map((scenario) => (
                  <TableRow key={scenario.id}>
                    <TableCell className="font-mono text-sm">{scenario.id}</TableCell>
                    <TableCell className="max-w-xs truncate">{scenario.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{scenario.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          scenario.difficulty === "basic"
                            ? "default"
                            : scenario.difficulty === "intermediate"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {scenario.difficulty}
                      </Badge>
                    </TableCell>
                    <TableCell>{scenario.context}</TableCell>
                    <TableCell>
                      {scenario.location?.specificity || "None"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
