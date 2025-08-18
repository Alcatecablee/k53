import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Home,
  Search,
  Phone,
  Clock,
  Navigation,
  Star,
  Users,
  Car,
  CheckCircle,
  AlertCircle,
  Info,
  BookOpen,
  Loader2,
  Shield,
  FileText,
  Database,
} from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { SEO_CONFIGS } from "@/hooks/useSEO";
import { useToast } from "@/hooks/use-toast";
import { 
  getAllDLTCCenters, 
  searchDLTCCenters, 
  getProvinces, 
  getCities,
  getNearestDLTCCenters,
  type DLTCCenter 
} from "@/services/dltcService";
import { getCurrentLocation } from "@/services/locationService";

export default function DLTCPage() {
  const { toast } = useToast();
  const [dltcCenters, setDltcCenters] = useState<DLTCCenter[]>([]);
  const [filteredCenters, setFilteredCenters] = useState<DLTCCenter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    const loadDLTCData = async () => {
      try {
        setLoading(true);
        
        // Load DLTC centers
        const centers = getAllDLTCCenters();
        setDltcCenters(centers);
        setFilteredCenters(centers);
        
        // Load provinces and cities
        setProvinces(getProvinces());
        setCities(getCities());
        
        // Try to get user location for nearest centers
        try {
          const coords = await getCurrentLocation();
          setUserLocation({ lat: coords.latitude, lng: coords.longitude });
        } catch (error) {
          console.warn("Could not get user location:", error);
        }
        
      } catch (error) {
        console.error("Error loading DLTC data:", error);
        toast({
          title: "Error",
          description: "Failed to load DLTC centers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadDLTCData();
  }, [toast]);

  // Filter centers based on search and filters
  useEffect(() => {
    let filtered = dltcCenters;

    // Apply search filter
    if (searchQuery) {
      filtered = searchDLTCCenters(searchQuery);
    }

    // Apply province filter
    if (selectedProvince) {
      filtered = filtered.filter(center => center.province === selectedProvince);
    }

    // Apply city filter
    if (selectedCity) {
      filtered = filtered.filter(center => center.city === selectedCity);
    }

    setFilteredCenters(filtered);
  }, [dltcCenters, searchQuery, selectedProvince, selectedCity]);

  const handleSearch = () => {
    if (searchQuery) {
      setFilteredCenters(searchDLTCCenters(searchQuery));
    } else {
      setFilteredCenters(dltcCenters);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedProvince("");
    setSelectedCity("");
    setFilteredCenters(dltcCenters);
  };

  const handleNavigate = (center: DLTCCenter) => {
    if (center.coordinates) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.lat},${center.coordinates.lng}`;
      window.open(url, '_blank');
    } else {
      toast({
        title: "Navigation Unavailable",
        description: "GPS coordinates not available for this center.",
        variant: "destructive",
      });
    }
  };

  const handleContact = (center: DLTCCenter) => {
    if (center.phone) {
      window.open(`tel:${center.phone}`, '_self');
    } else {
      toast({
        title: "Contact Unavailable",
        description: "Phone number not available for this center.",
        variant: "destructive",
      });
    }
  };

  const testRequirements = [
    {
      icon: CheckCircle,
      title: "Valid South African ID",
      description: "Original ID document or passport",
    },
    {
      icon: CheckCircle,
      title: "Passport Photos",
      description: "Two recent passport-sized photos",
    },
    {
      icon: CheckCircle,
      title: "Proof of Residence",
      description: "Not older than 3 months",
    },
    {
      icon: CheckCircle,
      title: "Eye Test Certificate",
      description: "If required by examiner",
    },
  ];

  const testTips = [
    "Arrive 30 minutes early to complete paperwork",
    "Bring exact change for test fees",
    "Study road signs the night before your test",
    "Get a good night's sleep before test day",
    "Practice with our K53 simulator beforehand",
  ];

  if (loading) {
    return (
      <>
        <SEO {...SEO_CONFIGS.dltc} />
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-300 font-semibold uppercase tracking-wide">
              Loading DLTC Directory...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO {...SEO_CONFIGS.dltc} />
      <div className="min-h-screen bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-gray-800 border-b-2 border-gray-700 shadow-lg mb-8 -mx-4 px-4 py-6">
            <div className="flex items-center justify-between">
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-white font-semibold uppercase tracking-wide"
              >
                <Link to="/">
                  <Home className="h-5 w-5 mr-2" />
                  Return to Portal
                </Link>
              </Button>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white uppercase tracking-wide">
                  DLTC Directory
                </h1>
                <p className="text-gray-400 uppercase text-sm tracking-wide">
                  Official Testing Center Locator
                </p>
              </div>
              <Button
                asChild
                variant="ghost"
                className="text-gray-300 hover:text-white font-semibold uppercase tracking-wide"
              >
                <Link to="/docs">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Help
                </Link>
              </Button>
              <div></div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            {/* Search Section */}
            <Card className="border-2 border-gray-700 bg-gray-800 mb-8">
              <CardHeader className="bg-gray-700 text-white p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-600 border-2 border-gray-500 flex items-center justify-center mx-auto mb-6">
                    <MapPin className="h-10 w-10" />
                  </div>
                  <CardTitle className="text-3xl font-bold mb-4 uppercase tracking-wide">
                    Official DLTC Network
                  </CardTitle>
                  <p className="text-gray-300 text-lg">
                    Department of Transport Licensed Testing Centers - Republic
                    of South Africa
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-8 bg-gray-800">
                <div className="space-y-4">
                  {/* Search Input */}
                  <div className="flex gap-4 max-w-lg mx-auto">
                    <Input
                      placeholder="Search centers by name, city, or province..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-200 placeholder:text-gray-400 focus:border-gray-500"
                    />
                    <Button 
                      onClick={handleSearch}
                      className="bg-gray-700 hover:bg-gray-600 font-semibold uppercase tracking-wide px-8"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  {/* Filter Options */}
                  <div className="flex gap-4 max-w-lg mx-auto">
                    <select
                      value={selectedProvince}
                      onChange={(e) => setSelectedProvince(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-200 px-3 py-2 rounded-md"
                    >
                      <option value="">All Provinces</option>
                      {provinces.map(province => (
                        <option key={province} value={province}>{province}</option>
                      ))}
                    </select>
                    
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="flex-1 bg-gray-700 border-gray-600 text-gray-200 px-3 py-2 rounded-md"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Reset Filters */}
                  <div className="text-center">
                    <Button
                      variant="outline"
                      onClick={handleResetFilters}
                      className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold uppercase tracking-wide"
                    >
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Notice */}
            <div className="bg-gray-800 border-2 border-gray-700 p-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-700 flex items-center justify-center">
                  <Info className="h-6 w-6 text-gray-300" />
                </div>
                <div className="text-gray-300">
                  <div className="font-bold uppercase tracking-wide mb-1">
                    System Enhancement Notice
                  </div>
                  <div className="text-sm leading-relaxed">
                    Advanced features in development: Real-time capacity
                    monitoring, digital appointment scheduling, and integrated
                    GPS navigation system for all registered DLTC facilities
                    nationwide.
                  </div>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm uppercase tracking-wide">
                Found {filteredCenters.length} DLTC center{filteredCenters.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* DLTC Directory */}
            <div className="grid lg:grid-cols-1 gap-6 mb-8">
              {filteredCenters.map((dltc) => (
                <Card
                  key={dltc.id}
                  className="border-2 border-gray-700 bg-gray-800 hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="bg-gray-700 text-white p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl font-bold uppercase tracking-wide mb-2">
                          {dltc.name}
                        </CardTitle>
                        <p className="text-gray-300">
                          {dltc.city}, {dltc.province} • License Code: DT-
                          {dltc.id.toString().padStart(3, "0")}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="bg-gray-600 border border-gray-500 px-4 py-2 mb-2">
                          <div className="text-lg font-bold">
                            {dltc.rating || 4.5}/5.0
                          </div>
                          <div className="text-xs uppercase tracking-wide">
                            Rating
                          </div>
                        </div>
                        <Badge
                          className="font-semibold uppercase tracking-wide bg-gray-600 text-gray-300 border-gray-500"
                        >
                          {dltc.busyLevel || "Moderate"} Activity
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 bg-gray-800">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-300 text-sm uppercase tracking-wide mb-1">
                              Physical Address
                            </div>
                            <p className="text-gray-400">{dltc.address}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-300 text-sm uppercase tracking-wide mb-1">
                              Contact Number
                            </div>
                            <p className="text-gray-400">{dltc.phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <Clock className="h-5 w-5 text-gray-400 mt-1 flex-shrink-0" />
                          <div>
                            <div className="font-semibold text-gray-300 text-sm uppercase tracking-wide mb-1">
                              Operating Hours
                            </div>
                            <p className="text-gray-400">{dltc.hours}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="bg-gray-700 border-2 border-gray-600 p-4 mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-300 uppercase tracking-wide text-sm">
                              Current Wait Time
                            </span>
                            <span className="text-lg font-bold text-gray-200">
                              {dltc.waitTime || "2-3 hours"}
                            </span>
                          </div>
                          <div className="space-y-2">
                            <div className="font-semibold text-gray-300 text-sm uppercase tracking-wide mb-2">
                              Available Services
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {dltc.services.map((service, index) => (
                                <Badge
                                  key={index}
                                  className="bg-gray-600 text-gray-300 text-xs uppercase tracking-wide"
                                >
                                  {service}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            variant="outline"
                            onClick={() => handleNavigate(dltc)}
                            className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold uppercase tracking-wide"
                          >
                            <Navigation className="h-4 w-4 mr-2" />
                            Navigate
                          </Button>
                          <Button 
                            onClick={() => handleContact(dltc)}
                            className="bg-gray-700 hover:bg-gray-600 font-semibold uppercase tracking-wide"
                          >
                            <Phone className="h-4 w-4 mr-2" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Information Sections */}
            <div className="grid lg:grid-cols-2 gap-8 mb-8">
              {/* Test Requirements */}
              <Card className="border-2 border-gray-700 bg-gray-800">
                <CardHeader className="bg-gray-700 text-white p-6">
                  <CardTitle className="flex items-center space-x-2 text-xl font-bold uppercase tracking-wide">
                    <CheckCircle className="h-6 w-6" />
                    <span>Required Documentation</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-gray-800">
                  <div className="space-y-4">
                    {testRequirements.map((req, index) => {
                      const IconComponent = req.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-start space-x-4 p-4 border-2 border-gray-600 bg-gray-700"
                        >
                          <div className="w-8 h-8 bg-gray-600 border-2 border-gray-500 flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-gray-300" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-200 mb-1 uppercase tracking-wide">
                              {req.title}
                            </h3>
                            <p className="text-gray-400">{req.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Test Day Guidelines */}
              <Card className="border-2 border-gray-700 bg-gray-800">
                <CardHeader className="bg-gray-700 text-white p-6">
                  <CardTitle className="flex items-center space-x-2 text-xl font-bold uppercase tracking-wide">
                    <Info className="h-6 w-6" />
                    <span>Assessment Guidelines</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-gray-800">
                  <div className="space-y-4">
                    {testTips.map((tip, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-6 h-6 bg-gray-700 flex items-center justify-center mt-0.5 flex-shrink-0">
                          <div className="w-2 h-2 bg-gray-300" />
                        </div>
                        <span className="text-gray-300 leading-relaxed">
                          {tip}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assessment Preparation */}
            <Card className="bg-gray-700 text-white">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 bg-gray-600 border-2 border-gray-500 flex items-center justify-center mx-auto mb-6">
                  <Car className="h-10 w-10" />
                </div>
                <h3 className="text-3xl font-bold mb-4 uppercase tracking-wide">
                  Pre-Assessment Preparation
                </h3>
                <p className="mb-8 text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto">
                  Ensure optimal assessment performance through comprehensive
                  preparation using our Department of Transport certified
                  practice examination system.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="bg-gray-600 text-white hover:bg-gray-500 font-semibold uppercase tracking-wide px-8 py-4 text-lg"
                >
                  <Link to="/practice">
                    Access Assessment Portal
                    <CheckCircle className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
