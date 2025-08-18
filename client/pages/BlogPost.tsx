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
} from "lucide-react";
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
    content: `
      <h2>Introduction to the K53 Learner's Licence Test</h2>
      <p>The K53 learner's licence test is the first step towards obtaining your driver's licence in South Africa. This comprehensive guide will walk you through everything you need to know to pass your test successfully.</p>

      <h2>What is the K53 Test?</h2>
      <p>The K53 test is the official driving test system used in South Africa. It consists of three main components:</p>
      <ul>
        <li><strong>Vehicle Controls Test:</strong> Demonstrating your knowledge of vehicle controls and their functions</li>
        <li><strong>Road Signs Test:</strong> Identifying and understanding traffic signs and signals</li>
        <li><strong>Traffic Rules Test:</strong> Understanding South African traffic laws and regulations</li>
      </ul>

      <h2>Test Structure and Requirements</h2>
      <h3>Test Format</h3>
      <p>The K53 learner's licence test consists of 64 questions total:</p>
      <ul>
        <li>Vehicle Controls: 21 questions</li>
        <li>Road Signs: 23 questions</li>
        <li>Traffic Rules: 20 questions</li>
      </ul>

      <h3>Passing Requirements</h3>
      <p>To pass the K53 test, you must:</p>
      <ul>
        <li>Score at least 77% overall (49 out of 64 questions correct)</li>
        <li>Pass each section individually with at least 70%</li>
        <li>Complete the test within the allocated time</li>
      </ul>

      <h2>Preparation Strategies</h2>
      <h3>Study Plan</h3>
      <p>Create a structured study plan:</p>
      <ol>
        <li><strong>Week 1-2:</strong> Focus on vehicle controls and their functions</li>
        <li><strong>Week 3-4:</strong> Study road signs and their meanings</li>
        <li><strong>Week 5-6:</strong> Learn traffic rules and regulations</li>
        <li><strong>Week 7:</strong> Practice tests and review weak areas</li>
      </ol>

      <h3>Practice Techniques</h3>
      <ul>
        <li>Take regular practice tests to identify weak areas</li>
        <li>Use visual aids to memorize road signs</li>
        <li>Create flashcards for vehicle controls</li>
        <li>Study in short, focused sessions</li>
      </ul>

      <h2>Test Day Preparation</h2>
      <h3>What to Bring</h3>
      <ul>
        <li>Valid South African ID document or passport</li>
        <li>Proof of residence (not older than 3 months)</li>
        <li>Two passport-sized photographs</li>
        <li>Test fee payment</li>
        <li>Pen for any written components</li>
      </ul>

      <h3>Mental Preparation</h3>
      <ul>
        <li>Get adequate sleep the night before</li>
        <li>Eat a healthy breakfast</li>
        <li>Arrive at least 30 minutes early</li>
        <li>Stay calm and focused during the test</li>
      </ul>

      <h2>Common Mistakes to Avoid</h2>
      <ul>
        <li><strong>Rushing through questions:</strong> Take your time to read each question carefully</li>
        <li><strong>Not reviewing answers:</strong> Use any remaining time to review your answers</li>
        <li><strong>Ignoring weak areas:</strong> Focus extra study time on topics you find difficult</li>
        <li><strong>Test anxiety:</strong> Practice relaxation techniques before the test</li>
      </ul>

      <h2>After the Test</h2>
      <p>If you pass:</p>
      <ul>
        <li>You'll receive your learner's licence immediately</li>
        <li>Keep it safe and carry it when driving</li>
        <li>Start preparing for your driver's licence test</li>
      </ul>

      <p>If you don't pass:</p>
      <ul>
        <li>Don't be discouraged - many people need multiple attempts</li>
        <li>Review your weak areas and study more</li>
        <li>You can retake the test after 7 days</li>
        <li>Consider additional practice with our platform</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Passing your K53 learner's licence test requires preparation, practice, and patience. Use this guide along with our comprehensive practice platform to ensure you're fully prepared for test day.</p>
    `,
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
    content: `
      <h2>Introduction</h2>
      <p>Understanding the most common K53 test questions can significantly improve your chances of passing. Here are the top 10 questions that appear most frequently in K53 learner's licence tests.</p>

      <h2>1. What is the primary function of the clutch pedal?</h2>
      <p><strong>Answer:</strong> To disengage the engine from the transmission for gear changes</p>
      <p><strong>Why it's important:</strong> This is fundamental knowledge for manual transmission vehicles and appears in almost every test.</p>

      <h2>2. When should you use your indicators?</h2>
      <p><strong>Answer:</strong> When turning, changing lanes, or pulling over</p>
      <p><strong>Why it's important:</strong> Proper use of indicators is crucial for road safety and is heavily tested.</p>

      <h2>3. What does a red traffic light mean?</h2>
      <p><strong>Answer:</strong> Stop completely and wait for the light to turn green</p>
      <p><strong>Why it's important:</strong> Traffic light rules are essential knowledge for all drivers.</p>

      <h2>4. How often should you check your mirrors while driving?</h2>
      <p><strong>Answer:</strong> Every 5 to 8 seconds</p>
      <p><strong>Why it's important:</strong> Regular mirror checking is a key safety practice.</p>

      <h2>5. What should you do when approaching a stop sign?</h2>
      <p><strong>Answer:</strong> Come to a complete stop and yield to other traffic</p>
      <p><strong>Why it's important:</strong> Stop signs are common and their rules are strictly enforced.</p>

      <h2>6. What is the correct hand position on the steering wheel?</h2>
      <p><strong>Answer:</strong> 10 and 2 o'clock or quarter to 3 position</p>
      <p><strong>Why it's important:</strong> Proper hand positioning is essential for safe driving.</p>

      <h2>7. When should you apply the parking brake?</h2>
      <p><strong>Answer:</strong> When the vehicle is parked or stopped for any length of time</p>
      <p><strong>Why it's important:</strong> Parking brake usage prevents vehicle rolling.</p>

      <h2>8. What does a yellow traffic light mean?</h2>
      <p><strong>Answer:</strong> Prepare to stop unless it's unsafe to do so</p>
      <p><strong>Why it's important:</strong> Yellow light interpretation is crucial for safe driving.</p>

      <h2>9. How should you apply the service brake?</h2>
      <p><strong>Answer:</strong> Timeously, smoothly and progressively</p>
      <p><strong>Why it's important:</strong> Proper braking technique ensures safety and passenger comfort.</p>

      <h2>10. What is the speed limit in a built-up area unless otherwise indicated?</h2>
      <p><strong>Answer:</strong> 60 km/h</p>
      <p><strong>Why it's important:</strong> Speed limits are fundamental traffic rules.</p>

      <h2>Study Tips for These Questions</h2>
      <ul>
        <li>Understand the reasoning behind each answer</li>
        <li>Practice these questions regularly</li>
        <li>Learn the related concepts, not just the answers</li>
        <li>Use our practice tests to reinforce your knowledge</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Mastering these common questions will give you a solid foundation for your K53 test. Remember to study the underlying principles, not just memorize answers.</p>
    `,
    author: "Driving Instructor",
    publishedDate: "2025-08-17",
    readTime: "6 min read",
    category: "Test Questions",
    tags: ["K53 questions", "common questions", "test tips", "road signs"],
    featured: true,
    slug: "top-10-most-common-k53-test-questions",
  },
];

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const foundPost = BLOG_POSTS.find((p) => p.slug === slug);
    setPost(foundPost || null);

    if (foundPost) {
      // Find related posts based on tags and category
      const related = BLOG_POSTS.filter(
        (p) =>
          p.id !== foundPost.id &&
          (p.category === foundPost.category ||
            p.tags.some((tag) => foundPost.tags.includes(tag)))
      ).slice(0, 3);
      setRelatedPosts(related);
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-6">The article you're looking for doesn't exist.</p>
          <Button asChild className="bg-white text-slate-900 hover:bg-slate-100">
            <Link to="/blog">Back to Blog</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...SEO_CONFIGS.blogPost} />
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
                    <Badge className="bg-yellow-600 text-white border-0">
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
                  <Button variant="outline" size="sm" className="border-black text-slate-300 hover:bg-slate-700 hover:text-white">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>

              {/* Article Content */}
              <div className="bg-slate-800 border border-black p-8 mb-8">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              </div>

              {/* Tags */}
              <div className="bg-slate-800 border border-black p-6 mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Tags</h3>
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