import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, MapPin, Mail, Calendar, Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import { getUserProfile, updateUserProfile, getUserStats } from "@/services/databaseService";
import { LocationSelector } from "@/components/LocationSelector";
import { getStoredLocation, type UserLocation } from "@/services/locationService";

function ProfileComponent() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user) {
          const [profileData, statsData] = await Promise.all([
            getUserProfile().catch(() => null),
            getUserStats().catch(() => null)
          ]);
          
          setProfile(profileData);
          setStats(statsData);

          // Load location
          if (profileData?.location) {
            const locationParts = profileData.location.split(', ');
            if (locationParts.length >= 2) {
              setUserLocation({
                city: locationParts[0],
                region: locationParts[1],
                displayName: profileData.location
              });
            }
          } else {
            const storedLocation = getStoredLocation();
            if (storedLocation) {
              setUserLocation(storedLocation);
            }
          }
        }
      } catch (error) {
        console.warn('Error loading profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  const handleLocationSelected = async (location: UserLocation) => {
    setUserLocation(location);
    
    if (user) {
      try {
        await updateUserProfile({
          location_city: location.city,
          location_region: location.region,
        });
      } catch (error) {
        console.warn('Error updating location:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-semibold uppercase tracking-wide">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b-2 border-slate-800 shadow-sm mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>
            
            <div className="text-center">
              <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-wide">
                User Profile
              </h1>
              <p className="text-slate-600 uppercase text-sm tracking-wide">
                Manage Your Account & Preferences
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={signOut}
              className="text-slate-700 hover:text-slate-900 font-semibold uppercase tracking-wide"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          
          {/* Profile Info */}
          <div className="md:col-span-2 space-y-6">
            <Card className="border-2 border-slate-800">
              <CardHeader className="bg-slate-800 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Account Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-semibold">Email Address</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Mail className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-800">{user?.email}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-slate-700 font-semibold">Full Name</Label>
                    <div className="mt-1">
                      <span className="text-slate-800">
                        {profile?.full_name || 'Not provided'}
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-700 font-semibold">Member Since</Label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-800">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card className="border-2 border-slate-800">
              <CardHeader className="bg-slate-800 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-slate-700 font-semibold">Current Location</Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-800">
                          {userLocation?.displayName || 'No location set'}
                        </span>
                      </div>
                      <Button
                        onClick={() => setShowLocationSelector(true)}
                        variant="outline"
                        size="sm"
                        className="border-slate-800 text-slate-800 hover:bg-slate-800 hover:text-white"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">
                    Your location helps us provide relevant driving scenarios for your area.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border-2 border-slate-800">
              <CardHeader className="bg-slate-800 text-white text-center">
                <CardTitle>Practice Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-slate-800">
                      {stats?.totalTests || 0}
                    </div>
                    <div className="text-sm text-slate-600 uppercase tracking-wide">
                      Total Tests
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-3xl font-bold text-green-600">
                      {stats?.passRate || 0}%
                    </div>
                    <div className="text-sm text-slate-600 uppercase tracking-wide">
                      Pass Rate
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {stats?.averageScore || 0}%
                    </div>
                    <div className="text-sm text-slate-600 uppercase tracking-wide">
                      Average Score
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-300 bg-orange-50">
              <CardContent className="p-6 text-center">
                <h3 className="font-bold text-orange-800 mb-2">🚀 Ready to Practice?</h3>
                <p className="text-orange-700 text-sm mb-4">
                  Continue improving your K53 skills with location-aware scenarios.
                </p>
                <Button 
                  asChild
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  <Link to="/practice">Start Practice</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Location Selector Modal */}
      {showLocationSelector && (
        <LocationSelector
          onLocationSelected={handleLocationSelected}
          onClose={() => setShowLocationSelector(false)}
          currentLocation={userLocation}
        />
      )}
    </div>
  );
}

export default function Profile() {
  return (
    <AuthenticatedRoute>
      <ProfileComponent />
    </AuthenticatedRoute>
  );
}
