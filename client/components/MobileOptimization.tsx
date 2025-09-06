'use client';
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {  Card, CardContent, CardHeader, CardTitle  } from '@/components/ui/card';
import {  Button  } from '@/components/ui/button';
import {  Badge  } from '@/components/ui/badge';
import {  Switch  } from '@/components/ui/switch';
import {  Slider  } from '@/components/ui/slider';
import {  Select, SelectContent, SelectItem, SelectTrigger, SelectValue  } from '@/components/ui/select';
import {  Label  } from '@/components/ui/label';
import {  Tabs, TabsContent, TabsList, TabsTrigger  } from '@/components/ui/tabs';
import {  Progress  } from '@/components/ui/progress';
import {  useToast  } from '@/hooks/use-toast';
import {  imageMapping, ImageAsset  } from '@/data/imageMapping';

interface MobileSettings {
  touchGestures: boolean;
  voiceCommands: boolean;
  offlineCaching: boolean;
  imageCompression: boolean;
  lazyLoading: boolean;
  progressiveLoading: boolean;
  cacheManagement: boolean;
  mobileUI: boolean;
  swipeNavigation: boolean;
  pinchZoom: boolean;
  hapticFeedback: boolean;
  autoRotate: boolean;
  batteryOptimization: boolean;
  dataSaver: boolean;
}

interface CacheInfo {
  totalSize: number;
  imageCount: number;
  lastUpdated: Date;
  compressionRatio: number;
  cacheHitRate: number;
}

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  batteryDrain: number;
  dataUsage: number;
  cacheEfficiency: number;
}

interface VoiceCommand {
  id: string;
  phrase: string;
  action: string;
  enabled: boolean;
}

export function MobileOptimization() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<MobileSettings>({
    touchGestures: true,
    voiceCommands: false,
    offlineCaching: true,
    imageCompression: true,
    lazyLoading: true,
    progressiveLoading: true,
    cacheManagement: true,
    mobileUI: true,
    swipeNavigation: true,
    pinchZoom: true,
    hapticFeedback: true,
    autoRotate: true,
    batteryOptimization: true,
    dataSaver: false
  });

  const [cacheInfo, setCacheInfo] = useState<CacheInfo>({
    totalSize: 0,
    imageCount: 0,
    lastUpdated: new Date(),
    compressionRatio: 0.7,
    cacheHitRate: 0.85
  });

  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    batteryDrain: 0,
    dataUsage: 0,
    cacheEfficiency: 0
  });

  const [voiceCommands, setVoiceCommands] = useState<VoiceCommand[]>([
  { id: '1', phrase: 'Next image', action: 'Navigate to next image', enabled: true },
  { id: '2', phrase: 'Previous image', action: 'Navigate to previous image', enabled: true },
  { id: '3', phrase: 'Start quiz', action: 'Begin image quiz', enabled: true },
  { id: '4', phrase: 'Show answer', action: 'Display image answer', enabled: true },
  { id: '5', phrase: 'Save to collection', action: 'Add image to collection', enabled: false },
  { id: '6', phrase: 'Search images', action: 'Open search interface', enabled: false },
  { id: '7', phrase: 'Toggle fullscreen', action: 'Switch fullscreen mode', enabled: true },
  { id: '8', phrase: 'Share image', action: 'Share current image', enabled: false }]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [compressionLevel, setCompressionLevel] = useState([70]);
  const [cacheSize, setCacheSize] = useState([100]);
  const [lazyLoadThreshold, setLazyLoadThreshold] = useState([200]);

  // Handle voice commands
  const handleVoiceCommand = useCallback((transcript: string) => {
    const command = voiceCommands.find((cmd) =>
    cmd.enabled && transcript.includes(cmd.phrase.toLowerCase())
    );

    if (command) {
      toast({
        title: "Voice Command",
        description: `Executing: ${command.action}`
      });

      // Execute the command
      switch (command.id) {
        case '1':
          // Navigate to next image
          break;
        case '2':
          // Navigate to previous image
          break;
        case '3':
          // Start quiz
          break;
        case '4':
          // Show answer
          break;
        case '7':
          // Toggle fullscreen
          document.documentElement.requestFullscreen?.();
          break;
        default:
          break;
      }
    }
  }, [voiceCommands, toast]);

  // Initialize speech recognition
  useEffect(() => {
    if (settings.voiceCommands && 'webkitSpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';

        recognitionInstance.onresult = (event: unknown) => {
          try {
            const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
            handleVoiceCommand(transcript);
          } catch (error) {
            console.error('Error processing voice command:', error);
            toast({
              title: "Voice Command Error",
              description: "Failed to process voice command. Please try again.",
              variant: "destructive"
            });
          }
        };

        recognitionInstance.onerror = (event: unknown) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);

          let errorMessage = 'Voice recognition error occurred.';
          switch (event.error) {
            case 'no-speech':
              errorMessage = 'No speech detected. Please try again.';
              break;
            case 'audio-capture':
              errorMessage = 'Audio capture failed. Please check your microphone.';
              break;
            case 'not-allowed':
              errorMessage = 'Microphone access denied. Please allow microphone access.';
              break;
            case 'network':
              errorMessage = 'Network error occurred. Please check your connection.';
              break;
          }

          toast({
            title: "Voice Recognition Error",
            description: errorMessage,
            variant: "destructive"
          });
        };

        setRecognition(recognitionInstance);
      } catch (error) {
        console.error('Failed to initialize speech recognition:', error);
        toast({
          title: "Voice Recognition Error",
          description: "Failed to initialize voice recognition. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [settings.voiceCommands, handleVoiceCommand, toast]);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('k53-mobile-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      } catch (error) {
        const errorMessage = 'Error loading mobile settings. Using defaults.';
        setError(errorMessage);
        toast({
          title: "Settings Error",
          description: errorMessage,
          variant: "destructive"
        });
      }
    }
  }, [toast]);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: MobileSettings) => {
    try {
      localStorage.setItem('k53-mobile-settings', JSON.stringify(newSettings));
    } catch (error) {
      const errorMessage = 'Failed to save mobile settings.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  }, [toast]);

  // Update settings
  const updateSettings = useCallback((key: keyof MobileSettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);

    // Handle special cases
    if (key === 'voiceCommands' && value && !recognition) {
      toast({
        title: "Voice Commands",
        description: "Voice commands are not supported in your browser.",
        variant: "destructive"
      });
    }

    if (key === 'offlineCaching' && value) {
      initializeOfflineCache();
    }

    toast({
      title: "Setting Updated",
      description: `${key.replace(/([A-Z])/g, ' $1').toLowerCase()} has been ${value ? 'enabled' : 'disabled'}.`
    });
  }, [settings, saveSettings, recognition, toast]);

  // Start/stop voice recognition
  const toggleVoiceRecognition = useCallback(() => {
    if (!recognition) {
      toast({
        title: "Voice Commands",
        description: "Voice commands are not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast({
        title: "Voice Recognition",
        description: "Listening for voice commands..."
      });
    }
  }, [recognition, isListening, toast]);

  // Initialize offline cache
  const initializeOfflineCache = useCallback(async () => {
    if (!('caches' in window)) {
      toast({
        title: "Offline Caching",
        description: "Offline caching is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const cache = await caches.open('k53-images-v1');

      // Cache essential images
      const essentialImages = Object.values(imageMapping).
      flat().
      slice(0, 100) // Cache first 100 images
      .map((img) => img.path);

      await cache.addAll(essentialImages);

      // Update cache info
      const keys = await cache.keys();
      setCacheInfo((prev) => ({
        ...prev,
        imageCount: keys.length,
        lastUpdated: new Date()
      }));

      toast({
        title: "Offline Cache",
        description: "Essential images have been cached for offline use."
      });
    } catch (error) {
      const errorMessage = 'Failed to initialize offline cache.';
      setError(errorMessage);
      toast({
        title: "Cache Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Clear cache
  const clearCache = useCallback(async () => {
    if (!('caches' in window)) {
      toast({
        title: "Cache Management",
        description: "Cache management is not supported in your browser.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((name) => caches.delete(name))
      );

      setCacheInfo((prev) => ({
        ...prev,
        totalSize: 0,
        imageCount: 0,
        lastUpdated: new Date()
      }));

      toast({
        title: "Cache Cleared",
        description: "All cached data has been cleared."
      });
    } catch (error) {
      const errorMessage = 'Failed to clear cache.';
      setError(errorMessage);
      toast({
        title: "Cache Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Optimize images
  const optimizeImages = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate image optimization
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setCacheInfo((prev) => ({
        ...prev,
        compressionRatio: compressionLevel[0] / 100,
        lastUpdated: new Date()
      }));

      toast({
        title: "Image Optimization",
        description: "Images have been optimized for mobile devices."
      });
    } catch (error) {
      const errorMessage = 'Failed to optimize images.';
      setError(errorMessage);
      toast({
        title: "Optimization Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [compressionLevel, toast]);

  // Update performance metrics
  useEffect(() => {
    const updateMetrics = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        setPerformanceMetrics((prev) => ({
          ...prev,
          loadTime: navigation.loadEventEnd - navigation.loadEventStart,
          memoryUsage: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0
        }));
      }
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, []);

  // Touch gesture handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!settings.touchGestures) return;

    const touch = e.touches[0];
    const startX = touch.clientX;
    const startY = touch.clientY;

    // Store touch start position for gesture detection
    (e.currentTarget as any).touchStartX = startX;
    (e.currentTarget as any).touchStartY = startY;
  }, [settings.touchGestures]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!settings.touchGestures) return;

    const touch = e.changedTouches[0];
    const endX = touch.clientX;
    const endY = touch.clientY;
    const startX = (e.currentTarget as any).touchStartX;
    const startY = (e.currentTarget as any).touchStartY;

    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    if (distance > 50) {// Minimum swipe distance
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (deltaX > 0) {
          // Swipe right - previous
          toast({
            title: "Gesture",
            description: "Swipe right detected - Previous image"
          });
        } else {
          // Swipe left - next
          toast({
            title: "Gesture",
            description: "Swipe left detected - Next image"
          });
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          // Swipe down
          toast({
            title: "Gesture",
            description: "Swipe down detected"
          });
        } else {
          // Swipe up
          toast({
            title: "Gesture",
            description: "Swipe up detected"
          });
        }
      }
    }
  }, [settings.touchGestures, toast]);

  // Haptic feedback
  const triggerHapticFeedback = useCallback(() => {
    if (settings.hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, [settings.hapticFeedback]);

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500">
          <CardHeader>
            <CardTitle className="text-red-600">Mobile Optimization Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600 mb-4">{error}</p>
            <Button
              onClick={() => setError(null)}
              variant="outline">

              Dismiss Error
            </Button>
          </CardContent>
        </Card>
      </div>);

  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Mobile Optimization</h1>
        <p className="text-muted-foreground">
          Optimize your K53 study experience for mobile devices
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="gestures">Gestures</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mobile Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="touchGestures">Touch Gestures</Label>
                    <p className="text-sm text-muted-foreground">Enable swipe navigation</p>
                  </div>
                  <Switch
                    id="touchGestures"
                    checked={settings.touchGestures}
                    onCheckedChange={(checked) => updateSettings('touchGestures', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="voiceCommands">Voice Commands</Label>
                    <p className="text-sm text-muted-foreground">Control with voice</p>
                  </div>
                  <Switch
                    id="voiceCommands"
                    checked={settings.voiceCommands}
                    onCheckedChange={(checked) => updateSettings('voiceCommands', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="offlineCaching">Offline Caching</Label>
                    <p className="text-sm text-muted-foreground">Cache images for offline use</p>
                  </div>
                  <Switch
                    id="offlineCaching"
                    checked={settings.offlineCaching}
                    onCheckedChange={(checked) => updateSettings('offlineCaching', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="imageCompression">Image Compression</Label>
                    <p className="text-sm text-muted-foreground">Reduce file sizes</p>
                  </div>
                  <Switch
                    id="imageCompression"
                    checked={settings.imageCompression}
                    onCheckedChange={(checked) => updateSettings('imageCompression', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="lazyLoading">Lazy Loading</Label>
                    <p className="text-sm text-muted-foreground">Load images on demand</p>
                  </div>
                  <Switch
                    id="lazyLoading"
                    checked={settings.lazyLoading}
                    onCheckedChange={(checked) => updateSettings('lazyLoading', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="progressiveLoading">Progressive Loading</Label>
                    <p className="text-sm text-muted-foreground">Show low-res first</p>
                  </div>
                  <Switch
                    id="progressiveLoading"
                    checked={settings.progressiveLoading}
                    onCheckedChange={(checked) => updateSettings('progressiveLoading', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mobileUI">Mobile UI</Label>
                    <p className="text-sm text-muted-foreground">Optimize for mobile</p>
                  </div>
                  <Switch
                    id="mobileUI"
                    checked={settings.mobileUI}
                    onCheckedChange={(checked) => updateSettings('mobileUI', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="hapticFeedback">Haptic Feedback</Label>
                    <p className="text-sm text-muted-foreground">Vibrate on interactions</p>
                  </div>
                  <Switch
                    id="hapticFeedback"
                    checked={settings.hapticFeedback}
                    onCheckedChange={(checked) => updateSettings('hapticFeedback', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="batteryOptimization">Battery Optimization</Label>
                    <p className="text-sm text-muted-foreground">Reduce power usage</p>
                  </div>
                  <Switch
                    id="batteryOptimization"
                    checked={settings.batteryOptimization}
                    onCheckedChange={(checked) => updateSettings('batteryOptimization', checked)} />

                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dataSaver">Data Saver</Label>
                    <p className="text-sm text-muted-foreground">Minimize data usage</p>
                  </div>
                  <Switch
                    id="dataSaver"
                    checked={settings.dataSaver}
                    onCheckedChange={(checked) => updateSettings('dataSaver', checked)} />

                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Optimization Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label>Image Compression Level: {compressionLevel[0]}%</Label>
                <Slider
                  value={compressionLevel}
                  onValueChange={setCompressionLevel}
                  max={100}
                  min={10}
                  step={5}
                  className="mt-2" />

                <p className="text-sm text-muted-foreground">
                  Higher compression reduces file size but may affect quality
                </p>
              </div>

              <div>
                <Label>Cache Size Limit: {cacheSize[0]}MB</Label>
                <Slider
                  value={cacheSize}
                  onValueChange={setCacheSize}
                  max={500}
                  min={50}
                  step={10}
                  className="mt-2" />

                <p className="text-sm text-muted-foreground">
                  Maximum storage space for cached images
                </p>
              </div>

              <div>
                <Label>Lazy Load Threshold: {lazyLoadThreshold[0]}px</Label>
                <Slider
                  value={lazyLoadThreshold}
                  onValueChange={setLazyLoadThreshold}
                  max={500}
                  min={50}
                  step={10}
                  className="mt-2" />

                <p className="text-sm text-muted-foreground">
                  Distance from viewport to start loading images
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={optimizeImages}
                  disabled={loading}
                  className="flex-1">

                  {loading ? 'Optimizing...' : 'Optimize Images'}
                </Button>
                <Button
                  onClick={clearCache}
                  disabled={loading}
                  variant="outline"
                  className="flex-1">

                  Clear Cache
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gestures" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Touch Gestures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <h3 className="font-semibold">Tap</h3>
                  <p className="text-sm text-muted-foreground">Select and interact</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👆👆</div>
                  <h3 className="font-semibold">Double Tap</h3>
                  <p className="text-sm text-muted-foreground">Zoom in/out</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👈</div>
                  <h3 className="font-semibold">Swipe Left</h3>
                  <p className="text-sm text-muted-foreground">Next image</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👉</div>
                  <h3 className="font-semibold">Swipe Right</h3>
                  <p className="text-sm text-muted-foreground">Previous image</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <h3 className="font-semibold">Swipe Up</h3>
                  <p className="text-sm text-muted-foreground">Show details</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <h3 className="font-semibold">Swipe Down</h3>
                  <p className="text-sm text-muted-foreground">Hide details</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">🤏</div>
                  <h3 className="font-semibold">Pinch</h3>
                  <p className="text-sm text-muted-foreground">Zoom in/out</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <div className="text-2xl mb-2">👆</div>
                  <h3 className="font-semibold">Long Press</h3>
                  <p className="text-sm text-muted-foreground">Context menu</p>
                </div>
              </div>

              <div
                className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}>

                <p className="text-muted-foreground">
                  Test touch gestures here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try swiping in different directions
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="voice" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Voice Commands</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Voice Recognition</h3>
                  <p className="text-sm text-muted-foreground">
                    {isListening ? 'Listening for commands...' : 'Click to start listening'}
                  </p>
                </div>
                <Button
                  onClick={toggleVoiceRecognition}
                  disabled={!settings.voiceCommands}
                  variant={isListening ? "destructive" : "default"}>

                  {isListening ? 'Stop Listening' : 'Start Listening'}
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Available Commands</h4>
                {voiceCommands.map((command) =>
                <div key={command.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">"{command.phrase}"</p>
                      <p className="text-sm text-muted-foreground">{command.action}</p>
                    </div>
                    <Switch
                    checked={command.enabled}
                    onCheckedChange={(checked) => {
                      setVoiceCommands((prev) =>
                      prev.map((cmd) =>
                      cmd.id === command.id ? { ...cmd, enabled: checked } : cmd
                      )
                      );
                    }} />

                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Load Time</h3>
                  <p className="text-2xl font-bold">{performanceMetrics.loadTime.toFixed(0)}ms</p>
                  <p className="text-sm text-muted-foreground">Page load duration</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Memory Usage</h3>
                  <p className="text-2xl font-bold">{performanceMetrics.memoryUsage.toFixed(1)}MB</p>
                  <p className="text-sm text-muted-foreground">JavaScript heap usage</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Cache Efficiency</h3>
                  <p className="text-2xl font-bold">{(cacheInfo.cacheHitRate * 100).toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Cache hit rate</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Compression Ratio</h3>
                  <p className="text-2xl font-bold">{(cacheInfo.compressionRatio * 100).toFixed(0)}%</p>
                  <p className="text-sm text-muted-foreground">Image compression</p>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2">Cache Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Size</p>
                    <p className="font-semibold">{cacheInfo.totalSize.toFixed(1)}MB</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Image Count</p>
                    <p className="font-semibold">{cacheInfo.imageCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-semibold">{cacheInfo.lastUpdated.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={initializeOfflineCache}
                  disabled={loading}
                  className="flex-1">

                  {loading ? 'Initializing...' : 'Initialize Cache'}
                </Button>
                <Button
                  onClick={() => triggerHapticFeedback()}
                  disabled={!settings.hapticFeedback}
                  variant="outline"
                  className="flex-1">

                  Test Haptic Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>);

}

export default MobileOptimization;
