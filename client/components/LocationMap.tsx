import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { imageMapping, getImagesByCategory } from '@/data/imageMapping';

interface Location {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  region: string;
  province: string;
  images: any[];
  drivingConditions: string[];
  specialRules: string[];
  difficulty: 'basic' | 'intermediate' | 'advanced';
  population: number;
  description: string;
}

interface LocationSession {
  id: string;
  selectedLocation: Location;
  currentImageIndex: number;
  startTime: Date;
  endTime?: Date;
  completed: boolean;
  score: number;
  totalQuestions: number;
}

export function LocationMap() {
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [session, setSession] = useState<LocationSession | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<'basic' | 'intermediate' | 'advanced' | 'all'>('all');
  const [mapMode, setMapMode] = useState<'explore' | 'learn' | 'quiz'>('explore');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize South African locations
  useEffect(() => {
    const southAfricanLocations: Location[] = [
      {
        id: 'johannesburg',
        name: 'Johannesburg',
        coordinates: { lat: -26.2041, lng: 28.0473 },
        region: 'Gauteng',
        province: 'Gauteng',
        images: [],
        drivingConditions: ['heavy-traffic', 'urban', 'high-density'],
        specialRules: ['taxi-rank-priority', 'school-zone-times', 'parking-restrictions'],
        difficulty: 'intermediate',
        population: 9574419,
        description: 'South Africa\'s largest city with complex urban driving conditions.'
      },
      {
        id: 'cape-town',
        name: 'Cape Town',
        coordinates: { lat: -33.9249, lng: 18.4241 },
        region: 'Western Cape',
        province: 'Western Cape',
        images: [],
        drivingConditions: ['tourist-traffic', 'mountain-roads', 'coastal-weather'],
        specialRules: ['table-mountain-parking', 'v&a-waterfront-rules', 'chapmans-peak-toll'],
        difficulty: 'intermediate',
        population: 4336886,
        description: 'Coastal city with unique mountain and coastal driving challenges.'
      },
      {
        id: 'durban',
        name: 'Durban',
        coordinates: { lat: -29.8587, lng: 31.0218 },
        region: 'KwaZulu-Natal',
        province: 'KwaZulu-Natal',
        images: [],
        drivingConditions: ['tropical-weather', 'beach-traffic', 'port-area'],
        specialRules: ['beachfront-parking', 'port-access', 'weather-warnings'],
        difficulty: 'intermediate',
        population: 3120282,
        description: 'Coastal city with tropical weather and beach tourism traffic.'
      },
      {
        id: 'pretoria',
        name: 'Pretoria',
        coordinates: { lat: -25.7479, lng: 28.2293 },
        region: 'Gauteng',
        province: 'Gauteng',
        images: [],
        drivingConditions: ['government-district', 'diplomatic-traffic', 'jacaranda-season'],
        specialRules: ['government-priority', 'diplomatic-lanes', 'jacaranda-parking'],
        difficulty: 'basic',
        population: 741651,
        description: 'Administrative capital with government and diplomatic traffic.'
      },
      {
        id: 'port-elizabeth',
        name: 'Port Elizabeth',
        coordinates: { lat: -33.7139, lng: 25.5207 },
        region: 'Eastern Cape',
        province: 'Eastern Cape',
        images: [],
        drivingConditions: ['industrial-area', 'port-traffic', 'windy-conditions'],
        specialRules: ['port-access', 'industrial-zones', 'wind-warnings'],
        difficulty: 'basic',
        population: 1152115,
        description: 'Industrial port city with strong coastal winds.'
      },
      {
        id: 'bloemfontein',
        name: 'Bloemfontein',
        coordinates: { lat: -29.0852, lng: 26.1596 },
        region: 'Free State',
        province: 'Free State',
        images: [],
        drivingConditions: ['flat-terrain', 'agricultural-traffic', 'central-location'],
        specialRules: ['agricultural-vehicles', 'central-corridor', 'flat-land-driving'],
        difficulty: 'basic',
        population: 556000,
        description: 'Central city with flat terrain and agricultural traffic.'
      },
      {
        id: 'kimberley',
        name: 'Kimberley',
        coordinates: { lat: -28.7282, lng: 24.7499 },
        region: 'Northern Cape',
        province: 'Northern Cape',
        images: [],
        drivingConditions: ['desert-climate', 'mining-traffic', 'sparse-population'],
        specialRules: ['mining-vehicles', 'desert-driving', 'water-conservation'],
        difficulty: 'intermediate',
        population: 225160,
        description: 'Diamond mining city with desert climate conditions.'
      },
      {
        id: 'nelspruit',
        name: 'Nelspruit',
        coordinates: { lat: -25.4753, lng: 30.9694 },
        region: 'Mpumalanga',
        province: 'Mpumalanga',
        images: [],
        drivingConditions: ['tropical-climate', 'agricultural-area', 'tourist-gateway'],
        specialRules: ['agricultural-traffic', 'kruger-park-access', 'tropical-weather'],
        difficulty: 'basic',
        population: 221474,
        description: 'Gateway to Kruger National Park with tropical climate.'
      },
      {
        id: 'polokwane',
        name: 'Polokwane',
        coordinates: { lat: -23.9045, lng: 29.4698 },
        region: 'Limpopo',
        province: 'Limpopo',
        images: [],
        drivingConditions: ['semi-arid', 'agricultural-traffic', 'provincial-capital'],
        specialRules: ['agricultural-vehicles', 'provincial-priority', 'semi-arid-driving'],
        difficulty: 'basic',
        population: 628999,
        description: 'Provincial capital with semi-arid climate and agricultural focus.'
      },
      {
        id: 'mbombela',
        name: 'Mbombela',
        coordinates: { lat: -25.4753, lng: 30.9694 },
        region: 'Mpumalanga',
        province: 'Mpumalanga',
        images: [],
        drivingConditions: ['tropical-weather', 'tourist-traffic', 'mountain-roads'],
        specialRules: ['panorama-route', 'tourist-priority', 'mountain-driving'],
        difficulty: 'intermediate',
        population: 588794,
        description: 'Tourist destination with scenic mountain routes.'
      }
    ];

    // Load location-specific images
    const locationsWithImages = southAfricanLocations.map(location => {
      const locationImages = getImagesByCategory('scenarios').filter(img => 
        img.context?.some(ctx => 
          ctx.toLowerCase().includes(location.name.toLowerCase()) ||
          ctx.toLowerCase().includes(location.region.toLowerCase()) ||
          ctx.toLowerCase().includes(location.province.toLowerCase())
        )
      );
      
      return {
        ...location,
        images: locationImages.length > 0 ? locationImages : getImagesByCategory('scenarios').slice(0, 10)
      };
    });

    setLocations(locationsWithImages);
  }, []);

  // Load saved location progress from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('k53-location-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Process saved progress if needed
      } catch (error) {
        const errorMessage = 'Error loading location progress. Data has been reset.';
        setError(errorMessage);
        toast({
          title: "Data Error",
          description: errorMessage,
          variant: "destructive",
        });
        localStorage.removeItem('k53-location-progress');
      }
    }
  }, [toast]);

  // Save location progress to localStorage
  const saveLocationProgress = useCallback((progress: any) => {
    try {
      localStorage.setItem('k53-location-progress', JSON.stringify(progress));
    } catch (error) {
      const errorMessage = 'Failed to save location progress. Please check your browser storage.';
      setError(errorMessage);
      toast({
        title: "Save Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  // Start location learning session
  const startLocationSession = useCallback((location: Location) => {
    const session: LocationSession = {
      id: `location-session-${Date.now()}`,
      selectedLocation: location,
      currentImageIndex: 0,
      startTime: new Date(),
      completed: false,
      score: 0,
      totalQuestions: location.images.length
    };

    setSession(session);
    setMapMode('learn');
    
    toast({
      title: "Location Session Started",
      description: `Learning session for ${location.name} started.`,
    });
  }, [toast]);

  // Handle location selection
  const handleLocationSelect = useCallback((location: Location) => {
    setSelectedLocation(location);
    setMapMode('explore');
    
    toast({
      title: "Location Selected",
      description: `${location.name} selected. Explore driving conditions and rules.`,
    });
  }, [toast]);

  // Filter locations by province and difficulty
  const filteredLocations = locations.filter(location => {
    const provinceMatch = selectedProvince === 'all' || location.province === selectedProvince;
    const difficultyMatch = selectedDifficulty === 'all' || location.difficulty === selectedDifficulty;
    return provinceMatch && difficultyMatch;
  });

  // Get unique provinces
  const provinces = ['all', ...Array.from(new Set(locations.map(loc => loc.province)))];

  if (error) {
    return (
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => setError(null)}
              className="mt-4"
            >
              Dismiss Error
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold">Location-Based Learning</h1>
        <p className="text-muted-foreground">
          Explore South African cities and regions with location-specific driving scenarios and rules.
        </p>
      </div>

      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Learning Mode</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={mapMode === 'explore' ? 'default' : 'outline'}
              onClick={() => setMapMode('explore')}
            >
              Explore Locations
            </Button>
            <Button
              variant={mapMode === 'learn' ? 'default' : 'outline'}
              onClick={() => setMapMode('learn')}
            >
              Learn Location Rules
            </Button>
            <Button
              variant={mapMode === 'quiz' ? 'default' : 'outline'}
              onClick={() => setMapMode('quiz')}
            >
              Location Quiz
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Location Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="province-filter">Province</Label>
              <Select
                value={selectedProvince}
                onValueChange={setSelectedProvince}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map((province) => (
                    <SelectItem key={province} value={province}>
                      {province === 'all' ? 'All Provinces' : province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="difficulty-filter">Difficulty</Label>
              <Select
                value={selectedDifficulty}
                onValueChange={(value: 'basic' | 'intermediate' | 'advanced' | 'all') => 
                  setSelectedDifficulty(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Explore Mode - Location Map */}
      {mapMode === 'explore' && (
        <div className="space-y-6">
          {/* Interactive Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>South Africa - Interactive Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-slate-800 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-white mb-4">
                    Interactive map showing {filteredLocations.length} locations
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredLocations.map((location) => (
                      <div
                        key={location.id}
                        className="cursor-pointer p-4 border border-black bg-slate-700 rounded-lg hover:bg-slate-600 text-white"
                        onClick={() => handleLocationSelect(location)}
                      >
                        <h4 className="font-semibold text-sm text-white">{location.name}</h4>
                        <p className="text-xs text-slate-300">{location.province}</p>
                        <Badge variant="outline" className="mt-2 text-xs bg-slate-600 text-white border-black">
                          {location.difficulty}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Selected Location Details */}
          {selectedLocation && (
            <Card>
              <CardHeader>
                <CardTitle>{selectedLocation.name} - Driving Information</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">{selectedLocation.province}</Badge>
                  <Badge variant="outline">{selectedLocation.difficulty}</Badge>
                  <span className="text-sm text-muted-foreground">
                    Population: {selectedLocation.population.toLocaleString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Description</h4>
                    <p className="text-muted-foreground">{selectedLocation.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Driving Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedLocation.drivingConditions.map((condition, index) => (
                        <Badge key={index} variant="secondary">
                          {condition.replace('-', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Special Rules</h4>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      {selectedLocation.specialRules.map((rule, index) => (
                        <li key={index}>{rule.replace('-', ' ')}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Available Images</h4>
                    <p className="text-muted-foreground">
                      {selectedLocation.images.length} location-specific images available
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => startLocationSession(selectedLocation)}
                      className="flex-1"
                    >
                      Start Learning Session
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setSelectedLocation(null)}
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Learn Mode - Location Session */}
      {mapMode === 'learn' && session && (
        <Card>
          <CardHeader>
            <CardTitle>Learning: {session.selectedLocation.name}</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex justify-between text-sm text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{session.currentImageIndex + 1} / {session.totalQuestions}</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((session.currentImageIndex + 1) / session.totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {session.currentImageIndex < session.totalQuestions ? (
              <div className="space-y-6">
                {/* Current Image */}
                <div className="text-center">
                  <img
                    src={session.selectedLocation.images[session.currentImageIndex].path}
                    alt={session.selectedLocation.images[session.currentImageIndex].description}
                    className="mx-auto max-w-full max-h-96 object-contain rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <p className="mt-4 text-lg font-medium">
                    {session.selectedLocation.images[session.currentImageIndex].description}
                  </p>
                </div>

                {/* Location Context */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Location Context</h4>
                  <p className="text-muted-foreground">
                    This scenario is specific to {session.selectedLocation.name} and its unique driving conditions.
                  </p>
                  <div className="mt-2">
                    <Badge variant="outline" className="mr-2">
                      {session.selectedLocation.province}
                    </Badge>
                    <Badge variant="outline">
                      {session.selectedLocation.difficulty}
                    </Badge>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (session.currentImageIndex > 0) {
                        setSession({
                          ...session,
                          currentImageIndex: session.currentImageIndex - 1
                        });
                      }
                    }}
                    disabled={session.currentImageIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={() => {
                      if (session.currentImageIndex < session.totalQuestions - 1) {
                        setSession({
                          ...session,
                          currentImageIndex: session.currentImageIndex + 1
                        });
                      } else {
                        // Session completed
                        setSession({
                          ...session,
                          endTime: new Date(),
                          completed: true
                        });
                      }
                    }}
                  >
                    {session.currentImageIndex < session.totalQuestions - 1 ? 'Next' : 'Complete'}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <h3 className="text-xl font-semibold mb-4">Location Learning Completed!</h3>
                <p className="text-muted-foreground mb-4">
                  You have completed the learning session for {session.selectedLocation.name}.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={() => {
                      setSession(null);
                      setMapMode('explore');
                    }}
                  >
                    Explore Other Locations
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSession({
                        ...session,
                        currentImageIndex: 0,
                        completed: false
                      });
                    }}
                  >
                    Review Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quiz Mode */}
      {mapMode === 'quiz' && (
        <Card>
          <CardHeader>
            <CardTitle>Location-Based Quiz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Test your knowledge of location-specific driving rules and conditions.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredLocations.slice(0, 6).map((location) => (
                  <Card key={location.id} className="cursor-pointer hover:bg-muted/50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold">{location.name}</h4>
                      <p className="text-sm text-muted-foreground">{location.province}</p>
                      <Badge variant="outline" className="mt-2">
                        {location.difficulty}
                      </Badge>
                      <Button
                        onClick={() => startLocationSession(location)}
                        className="mt-3 w-full"
                      >
                        Start Quiz
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 