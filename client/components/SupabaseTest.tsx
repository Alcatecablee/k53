'use client';
import React, { useState, useEffect } from 'react';
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Button  } from '@/components/ui/button';
import {  Badge  } from '@/components/ui/badge';
import {  useToast  } from '@/hooks/use-toast';
import {  flashcardService, searchService, exportService, mobileService, getCurrentUserId, isAuthenticated  } from '@/services/k53ImageFeaturesService';

export function SupabaseTest() {
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await isAuthenticated();
        setIsAuthenticated(authenticated);

        if (authenticated) {
          const currentUserId = await getCurrentUserId();
          setUserId(currentUserId);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    checkAuth();
  }, []);

  // Test flashcard service
  const testFlashcardService = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Test getting progress
      const progress = await flashcardService.getProgress(userId);

      // Test creating a sample progress entry
      const testProgress = await flashcardService.updateProgress({
        user_id: userId,
        image_id: 'test-image-123',
        difficulty: 3,
        review_count: 1,
        correct_count: 1,
        mastered: false
      });

      setTestResults((prev) => ({
        ...prev,
        flashcard: {
          progressCount: progress.length,
          testProgressCreated: !!testProgress,
          success: true
        }
      }));

      toast({
        title: "Flashcard Service Test",
        description: `Success! Found ${progress.length} progress records`
      });
    } catch (error) {
      console.error('Flashcard service test failed:', error);
      setTestResults((prev) => ({
        ...prev,
        flashcard: { success: false, error: error.message }
      }));
      toast({
        title: "Flashcard Service Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Test search service
  const testSearchService = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Test recording a search
      const searchRecord = await searchService.recordSearch({
        user_id: userId,
        search_text: 'test search',
        filters: { category: 'signs' },
        results_count: 10,
        search_type: 'text'
      });

      // Test getting search history
      const history = await searchService.getSearchHistory(userId, 5);

      setTestResults((prev) => ({
        ...prev,
        search: {
          searchRecorded: !!searchRecord,
          historyCount: history.length,
          success: true
        }
      }));

      toast({
        title: "Search Service Test",
        description: `Success! Recorded search and found ${history.length} history items`
      });
    } catch (error) {
      console.error('Search service test failed:', error);
      setTestResults((prev) => ({
        ...prev,
        search: { success: false, error: error.message }
      }));
      toast({
        title: "Search Service Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Test export service
  const testExportService = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Test creating a collection
      const collection = await exportService.createCollection({
        user_id: userId,
        name: 'Test Collection',
        description: 'Test collection for integration testing',
        category: 'signs',
        difficulty: 'basic',
        tags: ['test'],
        is_public: false
      });

      setTestResults((prev) => ({
        ...prev,
        export: {
          collectionCreated: !!collection,
          collectionId: collection?.id,
          success: true
        }
      }));

      toast({
        title: "Export Service Test",
        description: `Success! Created collection: ${collection?.name}`
      });
    } catch (error) {
      console.error('Export service test failed:', error);
      setTestResults((prev) => ({
        ...prev,
        export: { success: false, error: error.message }
      }));
      toast({
        title: "Export Service Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Test mobile service
  const testMobileService = async () => {
    if (!userId) return;

    try {
      setLoading(true);

      // Test getting mobile settings
      const settings = await mobileService.getMobileSettings(userId);

      // Test updating mobile settings
      const updatedSettings = await mobileService.updateMobileSettings({
        user_id: userId,
        touch_gestures: true,
        voice_commands: false,
        offline_caching: true,
        image_compression: true,
        lazy_loading: true,
        progressive_loading: true,
        cache_management: true,
        mobile_ui: true,
        swipe_navigation: true,
        pinch_zoom: true,
        haptic_feedback: true,
        auto_rotate: true,
        battery_optimization: true,
        data_saver: false,
        compression_level: 70,
        cache_size_mb: 100,
        lazy_load_threshold: 200
      });

      setTestResults((prev) => ({
        ...prev,
        mobile: {
          settingsRetrieved: !!settings,
          settingsUpdated: !!updatedSettings,
          success: true
        }
      }));

      toast({
        title: "Mobile Service Test",
        description: "Success! Mobile settings retrieved and updated"
      });
    } catch (error) {
      console.error('Mobile service test failed:', error);
      setTestResults((prev) => ({
        ...prev,
        mobile: { success: false, error: error.message }
      }));
      toast({
        title: "Mobile Service Test Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Run all tests
  const runAllTests = async () => {
    await testFlashcardService();
    await testSearchService();
    await testExportService();
    await testMobileService();
  };

  if (!isAuthenticated) {
    return (
      <Card className="w-full max-w-4xl mx-auto bg-slate-800 border-slate-600">
        <CardHeader>
          <CardTitle className="text-white">Supabase Integration Test</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Badge variant="destructive" className="mb-4">Supabase Not Configured</Badge>
            <p className="text-slate-300 mb-4">
              Supabase is not properly configured. Please set up your environment variables:
            </p>
            <div className="text-left bg-slate-700 p-4 rounded-lg mb-4">
              <p className="text-slate-300 text-sm mb-2">Required environment variables:</p>
              <code className="text-green-400 text-xs block mb-1">VITE_SUPABASE_URL</code>
              <code className="text-green-400 text-xs block">VITE_SUPABASE_ANON_KEY</code>
            </div>
            <p className="text-slate-400 text-sm">
              User ID: {userId || 'Not available'}
            </p>
          </div>
        </CardContent>
      </Card>);

  }

  return (
    <Card className="w-full max-w-4xl mx-auto bg-slate-800 border-slate-600">
      <CardHeader>
        <CardTitle className="text-white">Supabase Integration Test</CardTitle>
        <p className="text-slate-300 text-sm">
          Testing all 4 phases of K53 Image Features with Supabase
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Authentication Status */}
        <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
          <div>
            <h3 className="text-white font-medium">Authentication Status</h3>
            <p className="text-slate-300 text-sm">User ID: {userId}</p>
          </div>
          <Badge variant="default" className="bg-green-600">
            Authenticated
          </Badge>
        </div>

        {/* Test Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Phase 1: Core Learning Features */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Phase 1: Core Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Flashcard Service</span>
                <Badge
                  variant={testResults.flashcard?.success ? "default" : "destructive"}
                  className={testResults.flashcard?.success ? "bg-green-600" : ""}>
                  
                  {testResults.flashcard?.success ? "✅ Pass" : "❌ Fail"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Search Service</span>
                <Badge
                  variant={testResults.search?.success ? "default" : "destructive"}
                  className={testResults.search?.success ? "bg-green-600" : ""}>
                  
                  {testResults.search?.success ? "✅ Pass" : "❌ Fail"}
                </Badge>
              </div>
              <Button
                onClick={testFlashcardService}
                disabled={loading}
                className="w-full">
                
                Test Phase 1
              </Button>
            </CardContent>
          </Card>

          {/* Phase 2: Advanced Learning Features */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Phase 2: Advanced Learning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Scenario Service</span>
                <Badge variant="secondary" className="bg-slate-600">
                  ⏳ Pending
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Location Service</span>
                <Badge variant="secondary" className="bg-slate-600">
                  ⏳ Pending
                </Badge>
              </div>
              <Button
                disabled={true}
                className="w-full bg-slate-600">
                
                Test Phase 2 (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Phase 3: Analytics & Personalization */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Phase 3: Analytics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Analytics Service</span>
                <Badge variant="secondary" className="bg-slate-600">
                  ⏳ Pending
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Learning Paths</span>
                <Badge variant="secondary" className="bg-slate-600">
                  ⏳ Pending
                </Badge>
              </div>
              <Button
                disabled={true}
                className="w-full bg-slate-600">
                
                Test Phase 3 (Coming Soon)
              </Button>
            </CardContent>
          </Card>

          {/* Phase 4: Export & Sharing */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-lg">Phase 4: Export & Mobile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Export Service</span>
                <Badge
                  variant={testResults.export?.success ? "default" : "destructive"}
                  className={testResults.export?.success ? "bg-green-600" : ""}>
                  
                  {testResults.export?.success ? "✅ Pass" : "❌ Fail"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300">Mobile Service</span>
                <Badge
                  variant={testResults.mobile?.success ? "default" : "destructive"}
                  className={testResults.mobile?.success ? "bg-green-600" : ""}>
                  
                  {testResults.mobile?.success ? "✅ Pass" : "❌ Fail"}
                </Badge>
              </div>
              <Button
                onClick={testExportService}
                disabled={loading}
                className="w-full">
                
                Test Phase 4
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Run All Tests Button */}
        <div className="flex justify-center">
          <Button
            onClick={runAllTests}
            disabled={loading}
            className="px-8 py-3 text-lg">
            
            {loading ? "Running Tests..." : "Run All Tests"}
          </Button>
        </div>

        {/* Detailed Results */}
        {Object.keys(testResults).length > 0 &&
        <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Test Results Details</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-slate-300 text-sm overflow-auto max-h-64">
                {JSON.stringify(testResults, null, 2)}
              </pre>
            </CardContent>
          </Card>
        }
      </CardContent>
    </Card>);

}
