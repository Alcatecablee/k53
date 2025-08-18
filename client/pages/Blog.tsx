import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Award,
  MapPin,
  Car,
  Shield,
  FileText,
  Users,
  Star,
  Filter,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Tag,
  Eye,
  ThumbsUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { blogService, BlogPost, BlogSearchFilters } from "@/services/blogService";



export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const CATEGORIES = ["All", ...categories];

  useEffect(() => {
    const loadBlogData = async () => {
      try {
        const posts = await blogService.getAllPosts();
        const cats = await blogService.getCategories();
        setAllPosts(posts);
        setCategories(cats);
        setFilteredPosts(posts);
      } catch (error) {
        console.error('Failed to load blog data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBlogData();
  }, []);

  useEffect(() => {
    const filterPosts = async () => {
      const filters: BlogSearchFilters = {};
      
      if (searchTerm) {
        filters.searchTerm = searchTerm;
      }
      
      if (selectedCategory !== "All") {
        filters.category = selectedCategory;
      }

      try {
        const filtered = await blogService.searchPosts(filters);
        setFilteredPosts(filtered);
      } catch (error) {
        console.error('Failed to filter posts:', error);
      }
    };

    if (!loading) {
      filterPosts();
    }
  }, [searchTerm, selectedCategory, loading]);

  const featuredPosts = allPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <>
      <SEO {...SEO_CONFIGS.blog} />
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header className="bg-slate-800 border-b border-black sticky top-0 z-50">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-slate-700 border border-black flex items-center justify-center">
                    <div className="text-white font-bold text-sm tracking-wider">
                      K53
                    </div>
                  </div>
                  <div className="border-l border-black pl-4">
                    <h1 className="text-xl font-bold text-white tracking-tight">
                      SUPERK53
                    </h1>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                      Official Learner's Licence Portal
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    to="/"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/practice"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Practice
                  </Link>
                  <Link
                    to="/progress"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Results
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Premium
                  </Link>
                  <Link
                    to="/dltc"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Centers
                  </Link>
                  <Link
                    to="/docs"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Docs
                  </Link>
                </nav>

                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-sm uppercase tracking-wide"
                >
                  <Link to="/practice">
                    <User className="h-4 w-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-slate-900 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="bg-slate-800 border border-black p-12 mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-2 h-16 bg-white mr-6"></div>
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <Badge className="bg-slate-700 text-white border-0">
                        K53 BLOG
                      </Badge>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white">
                      K53 LEARNER'S LICENCE
                    </h1>
                    <h2 className="text-2xl md:text-3xl text-slate-300 font-normal">
                      Expert Tips & Study Guides
                    </h2>
                  </div>
                </div>
                <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  Latest news, study tips, and expert advice to help you pass your K53 learner's licence test. 
                  Comprehensive guides written by driving instructors and traffic safety experts.
                </p>
              </div>

              {/* Search and Filters */}
              <div className="bg-slate-800 border border-black p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search articles, tips, and guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-black text-white placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-black text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                    {showFilters ? (
                      <ChevronUp className="h-4 w-4 ml-2" />
                    ) : (
                      <ChevronDown className="h-4 w-4 ml-2" />
                    )}
                  </Button>
                </div>

                {showFilters && (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={
                          selectedCategory === category
                            ? "bg-white text-slate-900 hover:bg-slate-100"
                            : "border-black text-slate-300 hover:bg-slate-700 hover:text-white"
                        }
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto text-center">
                <div className="animate-pulse">
                  <div className="h-8 bg-slate-700 rounded mb-8 mx-auto w-64"></div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {[1, 2].map((i) => (
                      <div key={i} className="bg-slate-800 border border-black p-6">
                        <div className="h-48 bg-slate-700 rounded mb-4"></div>
                        <div className="h-6 bg-slate-700 rounded mb-2"></div>
                        <div className="h-4 bg-slate-700 rounded mb-4"></div>
                        <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Featured Posts */}
        {!loading && featuredPosts.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8">
                  <div className="w-1 h-8 bg-white mr-4"></div>
                  <h2 className="text-2xl font-bold text-white">
                    Featured Articles
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  {featuredPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-slate-800 border border-black hover:border-white transition-colors overflow-hidden"
                    >
                      <div className="relative h-48 bg-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-2" />
                            <p className="text-slate-300 text-sm">Article Image</p>
                          </div>
                        </div>
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-slate-600 text-white border-0">
                            {post.category}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-slate-600 text-white border-0">
                            Featured
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="bg-slate-700 border-b border-black">
                        <CardTitle className="text-white text-xl leading-tight">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="text-slate-300 mb-4 leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.publishedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {post.readTime}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {post.views.toLocaleString()}
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-3 w-3 mr-1" />
                              {post.likes}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          asChild
                          className="bg-white text-slate-900 hover:bg-slate-100 font-medium"
                        >
                          <Link to={`/blog/${post.slug}`}>
                            Read Article
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Regular Posts */}
        {!loading && (
          <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <div className="w-1 h-8 bg-white mr-4"></div>
                  <h2 className="text-2xl font-bold text-white">
                    Latest Articles
                  </h2>
                </div>
                <div className="text-slate-400 text-sm">
                  {filteredPosts.length} articles found
                </div>
              </div>

              {regularPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <Card
                      key={post.id}
                      className="bg-slate-800 border border-black hover:border-white transition-colors overflow-hidden"
                    >
                      <div className="relative h-32 bg-slate-700">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                          <div className="text-center">
                            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-1" />
                            <p className="text-slate-300 text-xs">Article Image</p>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-slate-600 text-white border-0 text-xs">
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader className="bg-slate-700 border-b border-black pb-3">
                        <CardTitle className="text-white text-lg leading-tight">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {post.author}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {post.readTime}
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                          <div className="flex items-center">
                            <Eye className="h-3 w-3 mr-1" />
                            {post.views.toLocaleString()}
                          </div>
                          <div className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            {post.likes}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {post.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-slate-600 text-slate-300"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-black text-slate-300 hover:bg-slate-700 hover:text-white w-full"
                        >
                          <Link to={`/blog/${post.slug}`}>
                            Read More
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    No articles found
                  </h3>
                  <p className="text-slate-400">
                    Try adjusting your search terms or filters.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        )}

        {/* CTA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-slate-800 border border-black p-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Ready to Pass Your K53 Test?
                </h2>
                <p className="text-xl text-slate-300 mb-8">
                  Start practicing with our comprehensive K53 learner's licence platform. 
                  Access 1000+ questions and 220+ scenarios to ensure you're fully prepared.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-slate-900 hover:bg-slate-100 font-medium"
                  >
                    <Link to="/practice">Start Practicing Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-black text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Link to="/pricing">View Premium Plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}