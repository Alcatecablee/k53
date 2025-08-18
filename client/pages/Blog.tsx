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
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedDate: string;
  readTime: string;
  category: string;
  tags: string[];
  featured: boolean;
  slug: string;
  imageUrl?: string;
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Complete K53 Learner's Licence Test Guide 2025",
    excerpt: "Everything you need to know about passing your K53 learner's licence test in South Africa. Expert tips, study strategies, and test preparation advice.",
    content: "Complete guide content here...",
    author: "SuperK53 Team",
    publishedDate: "2025-08-18",
    readTime: "8 min read",
    category: "Study Guide",
    tags: ["K53 test", "learner's licence", "study guide", "test preparation"],
    featured: true,
    slug: "complete-k53-learners-licence-test-guide-2025",
  },
  {
    id: "2",
    title: "Top 10 Most Common K53 Test Questions You Must Know",
    excerpt: "Discover the most frequently asked questions in K53 learner's licence tests and learn how to answer them correctly every time.",
    content: "Top questions content here...",
    author: "Driving Instructor",
    publishedDate: "2025-08-17",
    readTime: "6 min read",
    category: "Test Questions",
    tags: ["K53 questions", "common questions", "test tips", "road signs"],
    featured: true,
    slug: "top-10-most-common-k53-test-questions",
  },
  {
    id: "3",
    title: "K53 Road Signs: Complete Guide to Understanding Traffic Signs",
    excerpt: "Master all the road signs you need to know for your K53 test. Visual guide with explanations and memory techniques.",
    content: "Road signs content here...",
    author: "Traffic Safety Expert",
    publishedDate: "2025-08-16",
    readTime: "10 min read",
    category: "Road Signs",
    tags: ["road signs", "traffic signs", "K53", "learner's licence"],
    featured: false,
    slug: "k53-road-signs-complete-guide",
  },
  {
    id: "4",
    title: "How to Pass Your K53 Test on the First Try",
    excerpt: "Proven strategies and techniques to ensure you pass your K53 learner's licence test on your first attempt.",
    content: "First try content here...",
    author: "K53 Specialist",
    publishedDate: "2025-08-15",
    readTime: "7 min read",
    category: "Test Tips",
    tags: ["pass first time", "test strategy", "K53 tips", "success"],
    featured: false,
    slug: "how-to-pass-k53-test-first-try",
  },
  {
    id: "5",
    title: "K53 Vehicle Controls: Essential Knowledge for Your Test",
    excerpt: "Learn all about vehicle controls, their functions, and how to demonstrate them correctly during your K53 test.",
    content: "Vehicle controls content here...",
    author: "Vehicle Expert",
    publishedDate: "2025-08-14",
    readTime: "9 min read",
    category: "Vehicle Controls",
    tags: ["vehicle controls", "K53", "driving test", "car controls"],
    featured: false,
    slug: "k53-vehicle-controls-essential-knowledge",
  },
  {
    id: "6",
    title: "K53 Test Requirements: What You Need to Bring and Know",
    excerpt: "Complete checklist of documents, requirements, and preparations needed before taking your K53 learner's licence test.",
    content: "Requirements content here...",
    author: "DLTC Advisor",
    publishedDate: "2025-08-13",
    readTime: "5 min read",
    category: "Requirements",
    tags: ["test requirements", "documents", "K53", "preparation"],
    featured: false,
    slug: "k53-test-requirements-checklist",
  },
  {
    id: "7",
    title: "K53 Traffic Rules: Understanding South African Traffic Laws",
    excerpt: "Comprehensive guide to South African traffic rules and regulations you need to know for your K53 test.",
    content: "Traffic rules content here...",
    author: "Traffic Law Expert",
    publishedDate: "2025-08-12",
    readTime: "12 min read",
    category: "Traffic Rules",
    tags: ["traffic rules", "traffic laws", "K53", "South Africa"],
    featured: false,
    slug: "k53-traffic-rules-south-african-laws",
  },
  {
    id: "8",
    title: "K53 Test Anxiety: How to Stay Calm and Confident",
    excerpt: "Practical tips and techniques to overcome test anxiety and perform your best during your K53 learner's licence test.",
    content: "Test anxiety content here...",
    author: "Psychology Expert",
    publishedDate: "2025-08-11",
    readTime: "6 min read",
    category: "Mental Preparation",
    tags: ["test anxiety", "confidence", "K53", "mental preparation"],
    featured: false,
    slug: "k53-test-anxiety-stay-calm-confident",
  },
];

const CATEGORIES = [
  "All",
  "Study Guide",
  "Test Questions",
  "Road Signs",
  "Vehicle Controls",
  "Test Tips",
  "Requirements",
  "Traffic Rules",
  "Mental Preparation",
];

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(BLOG_POSTS);

  useEffect(() => {
    let filtered = BLOG_POSTS;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    setFilteredPosts(filtered);
  }, [searchTerm, selectedCategory]);

  const featuredPosts = BLOG_POSTS.filter((post) => post.featured);
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

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
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
                      className="bg-slate-800 border border-black hover:border-white transition-colors"
                    >
                      <CardHeader className="bg-slate-700 border-b border-black">
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-slate-600 text-white border-0">
                            {post.category}
                          </Badge>
                          <Badge className="bg-yellow-600 text-white border-0">
                            Featured
                          </Badge>
                        </div>
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
                      className="bg-slate-800 border border-black hover:border-white transition-colors"
                    >
                      <CardHeader className="bg-slate-700 border-b border-black">
                        <Badge className="bg-slate-600 text-white border-0 w-fit mb-2">
                          {post.category}
                        </Badge>
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