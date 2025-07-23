import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BookOpen,
  Search,
  HelpCircle,
  PlayCircle,
  Settings,
  Shield,
  Users,
  FileText,
  MapPin,
  Clock,
  Award,
  Car,
  Layers,
  CheckCircle,
  AlertTriangle,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Lightbulb,
  Target,
  BarChart3,
  CreditCard,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import { StudyMaterials } from "@/components/StudyMaterials";
import { SEO, BreadcrumbSEO, FAQSEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";

interface DocSection {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  sections: DocSubSection[];
}

interface DocSubSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function Documentation() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("getting-started");

  const documentationSections: DocSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: PlayCircle,
      sections: [
        {
          id: "overview",
          title: "Platform Overview",
          content: (
            <div className="space-y-6">
              <div className="bg-slate-100 border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-3 uppercase tracking-wide">
                  Welcome to SuperK53
                </h4>
                <p className="text-slate-700 mb-4">
                  SuperK53 is the official digital K53 learner's license preparation platform authorized by the Department of Transport, Republic of South Africa. Our comprehensive system provides everything you need to successfully pass your learner's license examination.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">🎯 Purpose</h5>
                    <p className="text-sm text-slate-700">Prepare candidates for official K53 learner's license examinations through comprehensive practice tests and scenarios.</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">🏛️ Authority</h5>
                    <p className="text-sm text-slate-700">Certified by the Department of Transport and aligned with current K53 regulations and testing standards.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "account-setup",
          title: "Account Setup",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Creating Your Account
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-slate-800 border border-black text-white flex items-center justify-center font-bold">1</div>
                    <div>
                      <h5 className="font-bold text-slate-800">Registration</h5>
                      <p className="text-slate-700">Navigate to any practice section and click "Sign In" to access the registration form. Provide your email, password, full name, and location.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-slate-800 border border-black text-white flex items-center justify-center font-bold">2</div>
                    <div>
                      <h5 className="font-bold text-slate-800">Email Verification</h5>
                      <p className="text-slate-700">Check your email for a verification link. Click the link to activate your account and gain access to all platform features.</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-slate-800 border border-black text-white flex items-center justify-center font-bold">3</div>
                    <div>
                      <h5 className="font-bold text-slate-800">Location Setup</h5>
                      <p className="text-slate-700">Set your location to receive scenario-based questions tailored to your specific area and local driving conditions.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "first-test",
          title: "Taking Your First Test",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Practice Test Guide
                </h4>
                <div className="grid gap-4">
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Practice Mode (12 Questions)
                    </h5>
                    <p className="text-slate-700 text-sm">Quick 5-minute assessment covering all categories. Perfect for daily practice and skill building.</p>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Official Test (64 Questions)
                    </h5>
                    <p className="text-slate-700 text-sm">Complete 25-minute simulation matching Department of Transport examination standards.</p>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <Car className="h-4 w-4 mr-2" />
                      Scenario Assessment
                    </h5>
                    <p className="text-slate-700 text-sm">Location-aware real-world driving scenarios (5 daily scenarios free, unlimited with premium).</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "k53-information",
      title: "K53 Test Information",
      icon: FileText,
      sections: [
        {
          id: "test-structure",
          title: "Official Test Structure",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  K53 Examination Categories
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                        <Settings className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 uppercase">Vehicle Controls</h5>
                        <p className="text-sm text-slate-600">8 Questions • Minimum Pass: 6/8 (75%)</p>
                      </div>
                    </div>
                    <p className="text-slate-700">Assessment of clutch operation, steering mechanisms, braking systems, and indicator controls.</p>
                  </div>
                  <div className="border border-black p-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                        <Layers className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 uppercase">Road Signs & Markings</h5>
                        <p className="text-sm text-slate-600">28 Questions • Minimum Pass: 23/28 (82%)</p>
                      </div>
                    </div>
                    <p className="text-slate-700">Regulatory signs, warning indicators, prohibition notices, and road surface markings.</p>
                  </div>
                  <div className="border border-black p-4">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="w-12 h-12 bg-slate-800 border border-black flex items-center justify-center">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 uppercase">Traffic Regulations</h5>
                        <p className="text-sm text-slate-600">28 Questions • Minimum Pass: 22/28 (79%)</p>
                      </div>
                    </div>
                    <p className="text-slate-700">Speed limitations, following distances, parking regulations, and traffic law compliance.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "passing-requirements",
          title: "Passing Requirements",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Official Pass Requirements
                </h4>
                <div className="bg-slate-100 border border-black p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <h5 className="font-bold text-slate-800">Overall Pass Requirement</h5>
                  </div>
                  <p className="text-slate-700">You must pass ALL three categories to receive your learner's license.</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 border border-black">
                    <span className="font-bold text-slate-800">Vehicle Controls</span>
                    <span className="text-slate-700">6 out of 8 correct (75%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-black">
                    <span className="font-bold text-slate-800">Road Signs & Markings</span>
                    <span className="text-slate-700">23 out of 28 correct (82%)</span>
                  </div>
                  <div className="flex justify-between items-center p-3 border border-black">
                    <span className="font-bold text-slate-800">Traffic Regulations</span>
                    <span className="text-slate-700">22 out of 28 correct (79%)</span>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "test-tips",
          title: "Test Preparation Tips",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Success Strategies
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="border border-black p-4">
                      <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Study Strategy
                      </h5>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Practice daily with our platform</li>
                        <li>• Focus on weak categories</li>
                        <li>• Review explanations thoroughly</li>
                        <li>• Take full-length practice tests</li>
                      </ul>
                    </div>
                    <div className="border border-black p-4">
                      <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Time Management
                      </h5>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Allocate 25 minutes for full test</li>
                        <li>• Don't spend too long on one question</li>
                        <li>• Review answers if time permits</li>
                        <li>• Stay calm and focused</li>
                      </ul>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-black p-4">
                      <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Test Day Tips
                      </h5>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Get adequate sleep before the test</li>
                        <li>• Arrive early at the DLTC</li>
                        <li>• Bring required documents</li>
                        <li>• Stay positive and confident</li>
                      </ul>
                    </div>
                    <div className="border border-black p-4">
                      <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Common Mistakes
                      </h5>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• Not reading questions carefully</li>
                        <li>• Rushing through the test</li>
                        <li>• Ignoring road sign details</li>
                        <li>• Not practicing scenarios</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "platform-features",
      title: "Platform Features",
      icon: Settings,
      sections: [
        {
          id: "assessment-types",
          title: "Assessment Types",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Available Assessments
                </h4>
                <div className="grid gap-4">
                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-slate-800 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Practice Assessment
                      </h5>
                      <Badge className="bg-slate-800 text-white">FREE</Badge>
                    </div>
                    <p className="text-slate-700 mb-3">Quick 12-question assessment covering all categories (5 minutes).</p>
                    <div className="text-sm text-slate-600">
                      <strong>Format:</strong> 2 Vehicle Controls + 5 Road Signs + 5 Traffic Rules
                    </div>
                  </div>
                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-slate-800 flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Official Assessment
                      </h5>
                      <Badge className="bg-slate-800 text-white">FREE</Badge>
                    </div>
                    <p className="text-slate-700 mb-3">Complete 64-question simulation matching official standards (25 minutes).</p>
                    <div className="text-sm text-slate-600">
                      <strong>Format:</strong> 8 Vehicle Controls + 28 Road Signs + 28 Traffic Rules
                    </div>
                  </div>
                  <div className="border border-black p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-bold text-slate-800 flex items-center">
                        <Car className="h-4 w-4 mr-2" />
                        Scenario Assessment
                      </h5>
                      <Badge className="bg-orange-600 text-white">FREEMIUM</Badge>
                    </div>
                    <p className="text-slate-700 mb-3">Location-aware real-world driving scenarios (220+ scenarios available).</p>
                    <div className="text-sm text-slate-600">
                      <strong>Limit:</strong> 5 scenarios daily (free) • Unlimited (premium)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "progress-tracking",
          title: "Progress Tracking",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Track Your Progress
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Performance Analytics
                    </h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Category-wise performance tracking</li>
                      <li>• Historical test results</li>
                      <li>• Improvement trends</li>
                      <li>• Weakness identification</li>
                    </ul>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <Award className="h-4 w-4 mr-2" />
                      Achievement System
                    </h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Milestone achievements</li>
                      <li>• Streak tracking</li>
                      <li>• Performance badges</li>
                      <li>• Progress levels</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "location-features",
          title: "Location-Based Features",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Location-Aware Learning
                </h4>
                <div className="space-y-4">
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      Scenario Customization
                    </h5>
                    <p className="text-slate-700">Receive driving scenarios tailored to your specific city and province, reflecting local road conditions and regulations.</p>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-2" />
                      DLTC Directory
                    </h5>
                    <p className="text-slate-700">Find nearby DLTC testing centers with contact information, operating hours, and current wait times.</p>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Local Information
                    </h5>
                    <p className="text-slate-700">Access location-specific testing requirements, local traffic patterns, and regional driving regulations.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "premium-features",
      title: "Premium Features",
      icon: CreditCard,
      sections: [
        {
          id: "subscription-plans",
          title: "Subscription Plans",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  SuperK53 Premium Access
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
                      Free Access
                      <Badge className="bg-slate-800 text-white">R0</Badge>
                    </h5>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Unlimited practice tests</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Unlimited official tests</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />5 scenarios daily</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Basic progress tracking</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />DLTC directory</li>
                    </ul>
                  </div>
                  <div className="border-2 border-orange-500 bg-orange-50 p-4">
                    <h5 className="font-bold text-slate-800 mb-3 flex items-center justify-between">
                      Premium Access
                      <Badge className="bg-orange-600 text-white">R49/month</Badge>
                    </h5>
                    <ul className="text-sm text-slate-700 space-y-2">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Everything in Free</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Unlimited scenarios</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Advanced analytics</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Priority support</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-600 mr-2" />Offline study materials</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "study-materials",
          title: "Study Materials",
          content: <StudyMaterials />,
        },
        {
          id: "payment-options",
          title: "Payment Options",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Available Payment Methods
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Monthly Subscription</h5>
                    <p className="text-slate-700 mb-2">R49 per month - Cancel anytime</p>
                    <div className="text-sm text-slate-600">Automatic renewal, cancel anytime through your profile.</div>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Scenario Packs</h5>
                    <p className="text-slate-700 mb-2">One-time purchases for additional scenarios</p>
                    <div className="text-sm text-slate-600">
                      • 50 Scenarios: R19<br/>
                      • 100 Scenarios: R35<br/>
                      • 200 Scenarios: R65
                    </div>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Payment Security</h5>
                    <p className="text-slate-700 text-sm">All payments processed securely through PayPal with 256-bit SSL encryption.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "technical-requirements",
      title: "Technical Requirements",
      icon: Shield,
      sections: [
        {
          id: "system-requirements",
          title: "System Requirements",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Minimum System Requirements
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-3">Desktop/Laptop</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Windows 10+ / macOS 10.14+ / Linux</li>
                      <li>• Chrome 90+ / Firefox 88+ / Safari 14+</li>
                      <li>• 4GB RAM minimum</li>
                      <li>• Stable internet connection</li>
                      <li>• 1024x768 screen resolution</li>
                    </ul>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-3">Mobile/Tablet</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• iOS 13+ / Android 8+</li>
                      <li>• Chrome Mobile / Safari Mobile</li>
                      <li>• 2GB RAM minimum</li>
                      <li>• Stable internet connection</li>
                      <li>• Touch screen support</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-slate-100 border border-black p-4 mt-4">
                  <h5 className="font-bold text-slate-800 mb-2">Recommended</h5>
                  <p className="text-slate-700 text-sm">For optimal experience, use Chrome browser on desktop with high-speed internet connection.</p>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "connectivity",
          title: "Internet & Connectivity",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Connectivity Requirements
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Internet Speed</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Minimum: 1 Mbps download</li>
                      <li>• Recommended: 5+ Mbps download</li>
                      <li>• Mobile data compatible</li>
                      <li>• Wi-Fi or cellular connection</li>
                    </ul>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Offline Capability</h5>
                    <ul className="text-sm text-slate-700 space-y-1">
                      <li>• Limited offline mode available</li>
                      <li>• Basic practice tests work offline</li>
                      <li>• Progress syncs when reconnected</li>
                      <li>• Scenarios require internet connection</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Connection Issues
                    </h5>
                    <p className="text-slate-700 text-sm">If experiencing connectivity issues, the platform will automatically switch to offline mode with basic functionality.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "faq",
      title: "FAQ",
      icon: HelpCircle,
      sections: [
        {
          id: "general-questions",
          title: "General Questions",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Frequently Asked Questions
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Is SuperK53 officially recognized?</h5>
                    <p className="text-slate-700 text-sm">Yes, SuperK53 is certified by the Department of Transport and aligned with current K53 regulations and testing standards.</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">How accurate are the practice tests?</h5>
                    <p className="text-slate-700 text-sm">Our tests are based on official K53 curriculum and updated regularly to match current examination standards. The question format and difficulty match the actual test.</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Can I use this on my mobile phone?</h5>
                    <p className="text-slate-700 text-sm">Yes, SuperK53 is fully responsive and works on smartphones, tablets, and desktop computers with modern web browsers.</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">How many times can I take practice tests?</h5>
                    <p className="text-slate-700 text-sm">Unlimited! You can take as many practice and official simulation tests as you want. Only scenario tests have a daily limit (5 free, unlimited with premium).</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Do I need to create an account?</h5>
                    <p className="text-slate-700 text-sm">An account is required to access tests and track progress. Registration is free and includes email verification for security.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "technical-support",
          title: "Technical Support",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Technical Support
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Platform not loading properly?</h5>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p>Try these steps:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        <li>Clear your browser cache and cookies</li>
                        <li>Disable browser extensions temporarily</li>
                        <li>Try a different browser or incognito mode</li>
                        <li>Check your internet connection</li>
                      </ul>
                    </div>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Tests not saving progress?</h5>
                    <p className="text-slate-700 text-sm">Ensure you're logged in and have a stable internet connection. Progress is automatically saved to your account upon test completion.</p>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Email verification not received?</h5>
                    <div className="text-slate-700 text-sm space-y-1">
                      <p>Check these locations:</p>
                      <ul className="list-disc ml-4 space-y-1">
                        <li>Spam/junk folder</li>
                        <li>Promotions tab (Gmail)</li>
                        <li>Wait up to 10 minutes for delivery</li>
                        <li>Request new verification email from profile</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Need More Help?</h5>
                    <div className="text-slate-700 text-sm">
                      <p className="mb-2">Contact our support team:</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          <span>0800 123 456</span>
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          <span>support@superk53.co.za</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
    {
      id: "support",
      title: "Support & Contact",
      icon: Phone,
      sections: [
        {
          id: "contact-information",
          title: "Contact Information",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Get in Touch
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      Support Hotline
                    </h5>
                    <div className="text-slate-700 space-y-2">
                      <p><strong>Phone:</strong> 0800 123 456</p>
                      <p><strong>Hours:</strong> Mon-Fri 8:00-17:00</p>
                      <p><strong>Language:</strong> English, Afrikaans</p>
                      <p className="text-sm">Free call from any South African network</p>
                    </div>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-3 flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Support
                    </h5>
                    <div className="text-slate-700 space-y-2">
                      <p><strong>General:</strong> support@superk53.co.za</p>
                      <p><strong>Technical:</strong> tech@superk53.co.za</p>
                      <p><strong>Billing:</strong> billing@superk53.co.za</p>
                      <p className="text-sm">Response within 24 hours</p>
                    </div>
                  </div>
                </div>
                <div className="border border-black p-4 mt-4">
                  <h5 className="font-bold text-slate-800 mb-2 flex items-center">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Additional Services
                  </h5>
                  <div className="flex items-center space-x-4 text-slate-700">
                    <Link to="/dltc" className="flex items-center hover:text-slate-900">
                      <MapPin className="h-4 w-4 mr-1" />
                      DLTC Centers
                    </Link>
                    <a href="https://taxfy.co.za" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-slate-900">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Tax Services
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
        {
          id: "feedback",
          title: "Feedback & Suggestions",
          content: (
            <div className="space-y-6">
              <div className="border border-black p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                  Help Us Improve
                </h4>
                <div className="space-y-4">
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Platform Feedback</h5>
                    <p className="text-slate-700 text-sm mb-3">Share your experience and suggestions to help us improve the platform for all users.</p>
                    <div className="text-slate-700 text-sm">
                      <p><strong>Email:</strong> feedback@superk53.co.za</p>
                      <p><strong>Subject:</strong> Include "Platform Feedback" in subject line</p>
                    </div>
                  </div>
                  <div className="border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Question Database</h5>
                    <p className="text-slate-700 text-sm mb-3">Help us maintain accuracy by reporting any errors in questions or answers.</p>
                    <div className="text-slate-700 text-sm">
                      <p><strong>Email:</strong> questions@superk53.co.za</p>
                      <p><strong>Include:</strong> Question ID, category, and description of issue</p>
                    </div>
                  </div>
                  <div className="bg-slate-100 border border-black p-4">
                    <h5 className="font-bold text-slate-800 mb-2">Feature Requests</h5>
                    <p className="text-slate-700 text-sm">Suggest new features or improvements that would enhance your learning experience.</p>
                  </div>
                </div>
              </div>
            </div>
          ),
        },
      ],
    },
  ];

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.sections.some(subsection =>
      subsection.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const currentSection = documentationSections.find(section => section.id === activeSection);

  const breadcrumbItems = [
    { name: 'Home', url: 'https://superk53.co.za' },
    { name: 'Documentation', url: 'https://superk53.co.za/docs' },
    { name: currentSection?.title || 'Getting Started', url: `https://superk53.co.za/docs#${activeSection}` }
  ];

  // FAQ data for structured data
  const faqData = [
    { question: 'Is SuperK53 officially recognized?', answer: 'Yes, SuperK53 is certified by the Department of Transport and aligned with current K53 regulations and testing standards.' },
    { question: 'How accurate are the practice tests?', answer: 'Our tests are based on official K53 curriculum and updated regularly to match current examination standards.' },
    { question: 'Can I use this on my mobile phone?', answer: 'Yes, SuperK53 is fully responsive and works on smartphones, tablets, and desktop computers.' },
    { question: 'How many times can I take practice tests?', answer: 'Unlimited! You can take as many practice and official simulation tests as you want.' }
  ];

  return (
    <>
      <SEO {...SEO_CONFIGS.documentation} />
      <BreadcrumbSEO items={breadcrumbItems} />
      {activeSection === 'faq' && <FAQSEO faqs={faqData} />}
      <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-black sticky top-0 z-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Button
                asChild
                variant="ghost"
                className="text-slate-300 hover:text-white font-medium uppercase tracking-wide"
              >
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to Portal
                </Link>
              </Button>
              <div className="border-l border-black pl-6">
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
                  <BookOpen className="h-6 w-6 mr-3" />
                  SUPERK53 DOCUMENTATION
                </h1>
                <p className="text-sm text-slate-400 font-medium uppercase tracking-wide">
                  Official Platform Documentation
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Quick Access Section */}
          <Card className="border border-black bg-slate-800 mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-wide">
                Quick Access
              </h2>
              <div className="grid md:grid-cols-4 gap-4">
                <Button
                  onClick={() => setActiveSection("getting-started")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-medium uppercase tracking-wide py-3"
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Getting Started
                </Button>
                <Button
                  onClick={() => setActiveSection("k53-information")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-medium uppercase tracking-wide py-3"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  K53 Info
                </Button>
                <Button
                  onClick={() => setActiveSection("faq")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-medium uppercase tracking-wide py-3"
                >
                  <HelpCircle className="h-4 w-4 mr-2" />
                  FAQ
                </Button>
                <Button
                  onClick={() => setActiveSection("support")}
                  className="bg-white text-slate-900 hover:bg-slate-100 font-medium uppercase tracking-wide py-3"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Support
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search documentation..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border border-black bg-white"
                    />
                  </div>
                </div>

                {/* Navigation Menu */}
                <Card className="border border-black bg-slate-800">
                  <CardContent className="p-4">
                    <nav className="space-y-2">
                      {filteredSections.map((section) => {
                        const IconComponent = section.icon;
                        return (
                          <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full text-left p-3 border border-black transition-colors flex items-center space-x-3 ${
                              activeSection === section.id
                                ? "bg-white text-slate-900"
                                : "bg-slate-700 text-white hover:bg-slate-600"
                            }`}
                          >
                            <IconComponent className="h-4 w-4" />
                            <span className="font-medium text-sm uppercase tracking-wide">
                              {section.title}
                            </span>
                          </button>
                        );
                      })}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentSection && (
                <div className="space-y-8">
                  {/* Breadcrumb Navigation */}
                  <div className="flex items-center space-x-2 text-sm text-slate-400">
                    <Link to="/" className="hover:text-white">Home</Link>
                    <ChevronRight className="h-4 w-4" />
                    <Link to="/docs" className="hover:text-white">Documentation</Link>
                    <ChevronRight className="h-4 w-4" />
                    <span className="text-white">{currentSection.title}</span>
                  </div>

                  {/* Section Header */}
                  <Card className="border border-black bg-slate-800">
                    <CardHeader className="bg-slate-700 text-white p-8">
                      <CardTitle className="text-3xl font-bold uppercase tracking-wide flex items-center">
                        <currentSection.icon className="h-8 w-8 mr-4" />
                        {currentSection.title}
                      </CardTitle>
                    </CardHeader>
                  </Card>

                  {/* Subsection Navigation */}
                  <Card className="border border-black bg-white">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-bold text-slate-800 mb-4 uppercase tracking-wide">
                        Section Contents
                      </h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {currentSection.sections.map((subsection) => (
                          <a
                            key={subsection.id}
                            href={`#${subsection.id}`}
                            className="flex items-center p-3 border border-black hover:bg-slate-100 transition-colors"
                          >
                            <ChevronRight className="h-4 w-4 mr-2 text-slate-600" />
                            <span className="font-medium text-slate-800 text-sm uppercase tracking-wide">
                              {subsection.title}
                            </span>
                          </a>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Section Content */}
                  {currentSection.sections.map((subsection) => (
                    <Card key={subsection.id} id={subsection.id} className="border border-black bg-white">
                      <CardHeader className="bg-slate-800 text-white p-6">
                        <CardTitle className="text-xl font-bold uppercase tracking-wide">
                          {subsection.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {subsection.content}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
