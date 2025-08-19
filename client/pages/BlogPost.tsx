import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Share2,
  BookOpen,
  CheckCircle,
  AlertTriangle,
  Info,
  ExternalLink,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  Eye,
  ThumbsUp,
  Tag,
  FileText,
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { blogService, type BlogPost } from "@/services/blogService";



export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      
      try {
        const foundPost = await blogService.getPostBySlug(slug);
        setPost(foundPost);

        if (foundPost) {
          // Increment view count
          await blogService.incrementViews(slug);
          
          // Get related posts
          const related = await blogService.getRelatedPosts(foundPost, 3);
          setRelatedPosts(related);
        }
      } catch (error) {
        console.error('Failed to load blog post:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-slate-700 rounded mb-4 mx-auto w-64"></div>
            <div className="h-4 bg-slate-700 rounded mb-6 mx-auto w-96"></div>
            <div className="h-10 bg-slate-700 rounded mx-auto w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-6">The article you're looking for doesn't exist.</p>
          <Button asChild className="bg-white text-white hover:bg-slate-100">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Create dynamic SEO config for this specific post
  const postSEO = blogService.generateSEOMetadata(post);

  return (
    <>
      <SEO {...postSEO} />
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
                    to="/blog"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Blog
                  </Link>
                  <Link
                    to="/pricing"
                    className="text-slate-400 hover:text-white text-xs font-normal transition-colors"
                  >
                    Premium
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

        {/* Article Content */}
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Breadcrumb */}
              <nav className="mb-8">
                <ol className="flex items-center space-x-2 text-sm text-slate-400">
                  <li>
                    <Link to="/" className="hover:text-white transition-colors">
                      Home
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li>
                    <Link to="/blog" className="hover:text-white transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <ChevronRight className="h-4 w-4" />
                  </li>
                  <li className="text-white">{post.title}</li>
                </ol>
              </nav>

              {/* Article Header */}
              <div className="bg-slate-800 border border-black p-8 mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Badge className="bg-slate-700 text-white border-0">
                    {post.category}
                  </Badge>
                  {post.featured && (
                    <Badge className="bg-slate-600 text-white border-0">
                      Featured
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-slate-300 mb-6 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-400">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(post.publishedDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      {post.views.toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      {post.likes}
                    </div>
                    <Button variant="outline" size="sm" className="border-black text-slate-300 hover:bg-slate-700 hover:text-white">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              {/* Article Image */}
              <div className="bg-slate-800 border border-black p-8 mb-8">
                <div className="relative h-64 bg-slate-700 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-24 w-24 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-300 text-lg">Article Featured Image</p>
                      <p className="text-slate-400 text-sm mt-2">{post.title}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-slate-800 border border-black p-8 mb-8">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* External Links */}
              {post.externalLinks.length > 0 && (
                <div className="bg-slate-800 border border-black p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    External Resources
                  </h3>
                  <div className="space-y-3">
                    {post.externalLinks.map((link, index) => (
                      <div key={index} className="bg-slate-700 border border-black p-4 rounded">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-slate-300 font-medium flex items-center"
                        >
                          {link.title}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                        <p className="text-slate-400 text-sm mt-1">{link.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Internal Links */}
              {post.internalLinks.length > 0 && (
                <div className="bg-slate-800 border border-black p-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2" />
                    Related Resources
                  </h3>
                  <div className="space-y-3">
                    {post.internalLinks.map((link, index) => (
                      <div key={index} className="bg-slate-700 border border-black p-4 rounded">
                        <Link
                          to={link.url}
                          className="text-white hover:text-slate-300 font-medium flex items-center"
                        >
                          {link.title}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                        <p className="text-slate-400 text-sm mt-1">{link.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div className="bg-slate-800 border border-black p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Tag className="h-5 w-5 mr-2" />
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Related Articles */}
              {relatedPosts.length > 0 && (
                <div className="bg-slate-800 border border-black p-8 mb-8">
                  <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <Card
                        key={relatedPost.id}
                        className="bg-slate-700 border border-black hover:border-white transition-colors"
                      >
                        <CardHeader className="pb-3">
                          <Badge className="bg-slate-600 text-white border-0 w-fit mb-2">
                            {relatedPost.category}
                          </Badge>
                          <CardTitle className="text-white text-lg leading-tight">
                            {relatedPost.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                            {relatedPost.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {relatedPost.readTime}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(relatedPost.publishedDate).toLocaleDateString()}
                            </div>
                          </div>
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="border-black text-slate-300 hover:bg-slate-600 hover:text-white w-full"
                          >
                            <Link to={`/blog/${relatedPost.slug}`}>
                              Read Article
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <div className="bg-slate-800 border border-black p-8 text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Ready to Practice What You've Learned?
                </h2>
                <p className="text-slate-300 mb-6">
                  Put your knowledge to the test with our comprehensive K53 practice platform. 
                  Access 1000+ questions and 426+ scenarios to ensure you're fully prepared.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-white hover:bg-slate-100 font-medium"
                  >
                    <Link to="/practice">Start Practicing Now</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-black text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Link to="/blog">More Articles</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
