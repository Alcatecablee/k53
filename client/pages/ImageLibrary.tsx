'use client';
import React, { useState } from 'react';
import {  Button  } from '@/components/ui/button';
import {  Badge  } from '@/components/ui/badge';
import {  Link  } from 'react-router-dom';
import {  useAuth  } from '@/contexts/AuthContext';
import {  useIsMobile  } from '@/hooks/use-mobile';
import {  MobileNavigation  } from '@/components/MobileNavigation';
import {  AccessibilityEnhancer  } from '@/components/AccessibilityEnhancer';
import {  SEO  } from '@/components/SEO';
import {  SEO_CONFIGS  } from '@/hooks/useSEO';
import {  User, LogOut  } from 'lucide-react';
import {  ImageGallery  } from '@/components/ImageGallery';
import {  ImageQuiz  } from '@/components/ImageQuiz';
import {  AdvancedImageSearch  } from '@/components/AdvancedImageSearch';
import {  Tabs, TabsContent, TabsList, TabsTrigger  } from '@/components/ui/tabs';
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger  } from '@/components/ui/dialog';

export default function ImageLibrary() {
  const [activeTab, setActiveTab] = useState('search');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  // Safe useAuth call with error handling for HMR issues
  let user = null;
  let signOut = async () => {};

  try {
    const auth = useAuth();
    user = auth.user;
    signOut = auth.signOut;
  } catch (error) {
    console.warn(
      "Auth context not available, continuing without authentication:",
      error
    );
  }

  return (
    <AccessibilityEnhancer>
      <SEO {...SEO_CONFIGS.images} />
      <div className="min-h-screen bg-slate-900">
        {/* Header */}
        <header id="navigation" className="bg-slate-800 border-b border-black sticky top-0 z-50 transition-all duration-300">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 sm:space-x-6">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-700 border border-black flex items-center justify-center transition-all duration-200 hover:bg-slate-600">
                    <div className="text-white font-bold text-xs sm:text-sm tracking-wider">
                      K53
                    </div>
                  </div>
                  <div className="border-l border-black pl-2 sm:pl-4">
                    <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                      SUPERK53
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium uppercase tracking-wide">
                      Official Learner's License Portal
                    </p>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6" role="navigation" aria-label="Main navigation">
                <Link
                  to="/"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Home page">
                  
                  Home
                </Link>
                <Link
                  to="/practice"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Practice assessments">
                  
                  Practice
                </Link>
                <Link
                  to="/image-library"
                  className="text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Browse K53 images and tools">
                  
                  Images
                </Link>
                <Link
                  to="/progress"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="View progress and results">
                  
                  Results
                </Link>
                <Link
                  to="/pricing"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Premium access options">
                  
                  Premium
                </Link>
                <Link
                  to="/dltc"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Find testing centers">
                  
                  Centers
                </Link>
                <Link
                  to="/docs"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Platform documentation">
                  
                  Docs
                </Link>
                <Link
                  to="/blog"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Blog articles">
                  
                  Blog
                </Link>
                <Link
                  to="/admin"
                  className="text-slate-400 hover:text-white text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Admin panel">
                  
                  Admin
                </Link>
                <a
                  href="https://taxfy.co.za"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-500 hover:text-slate-400 text-xs font-normal transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800 rounded"
                  aria-label="Tax services (opens in new tab)">
                  
                  Tax
                </a>
              </nav>

              <div className="flex items-center space-x-2 border-l border-black pl-4">
                {user ?
                <>
                    <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="User profile">
                    
                      <Link to="/profile">
                        <User className="h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                    aria-label="Sign out">
                    
                      <LogOut className="h-5 w-5" />
                    </Button>
                  </> :

                <Button
                  asChild
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-700 font-medium text-sm uppercase tracking-wide transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  aria-label="Sign in to access practice">
                  
                    <Link to="/practice">
                      <User className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Sign In</span>
                      <span className="sm:hidden">Sign In</span>
                    </Link>
                  </Button>
                }

                {/* Mobile Navigation Component */}
                <MobileNavigation
                  isOpen={mobileMenuOpen}
                  onToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
                  onClose={() => setMobileMenuOpen(false)} />
                
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Page Header */}
          <div className="bg-slate-800 border border-black p-6 sm:p-8 mb-6 sm:mb-8 transition-all duration-300 hover:shadow-lg">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="w-1 sm:w-2 h-12 sm:h-16 bg-white mr-4 sm:mr-6 transition-all duration-300"></div>
                <div>
                  <div className="flex items-center justify-center space-x-3 mb-2 sm:mb-3">
                    <Badge className="bg-slate-700 text-white border-0 text-xs sm:text-sm transition-all duration-200 hover:bg-slate-600">
                      IMAGE LIBRARY
                    </Badge>
                  </div>
                  <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 tracking-tight text-white transition-all duration-300">
                    K53 IMAGE RESOURCES
                  </h1>
                  <h2 className="text-lg sm:text-2xl md:text-3xl text-slate-300 font-normal transition-all duration-300">
                    Comprehensive Visual Learning Tools
                  </h2>
                </div>
              </div>
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto transition-all duration-300">
                Access {Object.values({ signs: 1727, controls: 6, scenarios: 11, locations: 44, landmarks: 30 }).reduce((sum, count) => sum + count, 0)} authentic South African K53 images with search, quiz, and gallery tools.
              </p>
            </div>
          </div>

          {/* Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="bg-slate-800 border border-black p-4 transition-all duration-300 hover:shadow-lg">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-3 bg-slate-700 border border-black">
                <TabsTrigger
                  value="search"
                  className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600 transition-all duration-200 hover:bg-slate-600 hover:text-white">
                  
                  Search
                </TabsTrigger>

                <TabsTrigger
                  value="quiz"
                  className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600 transition-all duration-200 hover:bg-slate-600 hover:text-white">
                  
                  Quiz
                </TabsTrigger>

                <TabsTrigger
                  value="gallery"
                  className="text-slate-300 data-[state=active]:text-white data-[state=active]:bg-slate-600 transition-all duration-200 hover:bg-slate-600 hover:text-white">
                  
                  Gallery
                </TabsTrigger>



              </TabsList>
            </div>

            {/* Tab Content */}
            <TabsContent value="gallery" className="space-y-6">
              <Card className="bg-slate-800 border border-black transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-slate-700 border-b border-black">
                  <CardTitle className="text-white uppercase tracking-wide">Browse Images</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ImageGallery mode="reference" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="search" className="space-y-6">
              <Card className="bg-slate-800 border border-black transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-slate-700 border-b border-black">
                  <CardTitle className="text-white uppercase tracking-wide">Advanced Search</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <AdvancedImageSearch />
                </CardContent>
              </Card>
            </TabsContent>



            <TabsContent value="quiz" className="space-y-6">
              <Card className="bg-slate-800 border border-black transition-all duration-300 hover:shadow-lg">
                <CardHeader className="bg-slate-700 border-b border-black">
                  <CardTitle className="text-white uppercase tracking-wide">Image-Based Quiz</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <ImageQuiz
                    category="signs"
                    difficulty="basic"
                    questionCount={10}
                    onComplete={(results) => {
                      console.log('Quiz completed:', results);
                    }} />
                  
                </CardContent>
              </Card>
            </TabsContent>


          </Tabs>
        </div>
      </div>
    </AccessibilityEnhancer>);

}
