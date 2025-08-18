import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  User,
  MapPin,
  Mail,
  Calendar,
  Settings,
  LogOut,
  Edit,
  Save,
  X,
  Award,
  Target,
  Clock,
  Shield,
  Bell,
  Globe,
  BookOpen,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Crown,
  FileText,
  Database,
  BarChart3,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthenticatedRoute } from "@/components/AuthenticatedRoute";
import {
  getUserProfile,
  updateUserProfile,
  getUserStats,
  getUserProgress,
} from "@/services/databaseService";
import { LocationSelector } from "@/components/LocationSelector";
import {
  getStoredLocation,
  getCurrentLocation,
  reverseGeocode,
  storeLocation,
  type UserLocation,
} from "@/services/locationService";
import { useToast } from "@/hooks/use-toast";
import { getUserSubscription, hasPremiumAccess, hasPaidSubscription } from "@/services/subscriptionService";
import { getUserProgress as getAchievementProgress, ACHIEVEMENTS } from "@/services/achievementService";

function ProfileComponent() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showLocationSelector, setShowLocationSelector] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    bio: "",
    preferences: {
      notifications: true,
      darkMode: false,
      autoLocation: true,
      practiceReminders: true,
    },
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user) {
          const [profileData, statsData, subscriptionData] = await Promise.all([
            getUserProfile().catch(() => null),
            getUserStats().catch(() => null),
            getUserSubscription().catch(() => null),
          ]);

          // Get achievement data synchronously since it's not a Promise
          let achievementData = null;
          try {
            achievementData = getAchievementProgress();
          } catch (error) {
            console.warn("Error loading achievement data:", error);
            achievementData = null;
          }

          setProfile(profileData);
          setStats(statsData);
          setSubscription(subscriptionData);
          setAchievements(achievementData?.achievements || []);

          // Initialize edit form with current data
          if (profileData) {
            setEditForm({
              full_name: profileData.full_name || "",
              phone: profileData.phone || "",
              bio: profileData.bio || "",
              preferences: {
                notifications: profileData.preferences?.notifications ?? true,
                darkMode: profileData.preferences?.darkMode ?? false,
                autoLocation: profileData.preferences?.autoLocation ?? true,
                practiceReminders: profileData.preferences?.practiceReminders ?? true,
              },
            });
          }

          // Load location - try multiple sources in order of preference
          let locationSet = false;

          // 1. First try to get location from user profile
          if (profileData?.location_city && profileData?.location_region) {
            setUserLocation({
              city: profileData.location_city,
              region: profileData.location_region,
              displayName: `${profileData.location_city}, ${profileData.location_region}`,
            });
            locationSet = true;
          }

          // 2. If no profile location, try stored location
          if (!locationSet) {
            const storedLocation = getStoredLocation();
            if (storedLocation) {
              setUserLocation(storedLocation);
              locationSet = true;
            }
          }

          // 3. If no stored location, try to auto-detect current location
          if (!locationSet && editForm.preferences.autoLocation) {
            try {
              const coords = await getCurrentLocation();
              const detectedLocation = reverseGeocode(coords);
              setUserLocation(detectedLocation);
              locationSet = true;
              
              // Save detected location to profile and storage
              if (user) {
                try {
                  await updateUserProfile({
                    location_city: detectedLocation.city,
                    location_region: detectedLocation.region,
                  });
                  storeLocation(detectedLocation);
                } catch (error) {
                  console.warn("Failed to save detected location:", error);
                }
              }
            } catch (detectionError) {
              console.warn("Location detection failed:", detectionError);
            }
          }

          // 4. If no location found, don't set anything - let user choose
          if (!locationSet) {
            console.warn("No location available, user will need to set location manually");
          }
        }
      } catch (error) {
        console.warn("Error loading profile data:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [user, editForm.preferences.autoLocation, toast]);

  const handleLocationSelected = async (location: UserLocation) => {
    setUserLocation(location);

    if (user) {
      try {
        await updateUserProfile({
          location_city: location.city,
          location_region: location.region,
        });
        toast({
          title: "Location Updated",
          description: "Your location has been successfully updated.",
        });
      } catch (error) {
        console.warn("Error updating location:", error);
        toast({
          title: "Error",
          description: "Failed to update location. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfile(editForm);
      setProfile({ ...profile, ...editForm });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.warn("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditForm({
      full_name: profile?.full_name || "",
      phone: profile?.phone || "",
      bio: profile?.bio || "",
      preferences: {
        notifications: profile?.preferences?.notifications ?? true,
        darkMode: profile?.preferences?.darkMode ?? false,
        autoLocation: profile?.preferences?.autoLocation ?? true,
        practiceReminders: profile?.preferences?.practiceReminders ?? true,
      },
    });
    setIsEditing(false);
  };

  const getSubscriptionStatus = () => {
    if (!subscription) {
      return {
        type: "Free",
        status: "Active",
        expiresAt: null,
        features: ["Basic Practice", "Limited Scenarios", "Standard Support"],
      };
    }

    const planNames = {
      free: "Free",
      basic: "Basic",
      standard: "Standard", 
      premium: "Premium"
    };

    const planFeatures = {
      free: ["Basic Practice", "Limited Scenarios", "Standard Support"],
      basic: ["Unlimited Practice", "Basic Analytics", "Email Support"],
      standard: ["Unlimited Practice", "Advanced Analytics", "Priority Support"],
      premium: ["Unlimited Practice", "Advanced Analytics", "Priority Support", "Personalized Recommendations"]
    };

    return {
      type: planNames[subscription.plan_type] || "Free",
      status: subscription.status === "active" ? "Active" : subscription.status,
      expiresAt: subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : null,
      features: planFeatures[subscription.plan_type] || planFeatures.free,
    };
  };

  const getAchievementData = () => {
    if (!achievements || achievements.length === 0) {
      return ACHIEVEMENTS.map(achievement => ({
        id: achievement.id,
        name: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        earned: false,
        progress: 0,
        requirement: achievement.requirement
      }));
    }

    return achievements.map(achievement => {
      const iconMap: { [key: string]: string } = {
        target: "Target",
        trophy: "Award", 
        "map-pin": "MapPin",
        flame: "Clock",
        zap: "TrendingUp",
        "gamepad-2": "Target",
        "traffic-cone": "Shield",
        clipboard: "FileText",
        "dice-1": "Database"
      };

      return {
        id: achievement.id,
        name: achievement.title,
        description: achievement.description,
        icon: iconMap[achievement.icon] || "Target",
        earned: achievement.unlocked,
        progress: achievement.progress,
        requirement: achievement.requirement
      };
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      Target,
      Award,
      BookOpen,
      MapPin,
      Clock,
      Database,
      BarChart3,
      FileText,
      Shield,
      TrendingUp,
    };
    return iconMap[iconName] || Target;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-600 border-t-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300 font-semibold uppercase tracking-wide">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  const subscriptionStatus = getSubscriptionStatus();
  const achievementData = getAchievementData();

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b-2 border-gray-700 shadow-lg mb-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <Button
              asChild
              variant="ghost"
              className="text-gray-300 hover:text-white font-semibold uppercase tracking-wide"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Portal
              </Link>
            </Button>

            <div className="text-center">
              <h1 className="text-3xl font-bold text-white uppercase tracking-wide">
                User Profile
              </h1>
              <p className="text-gray-400 uppercase text-sm tracking-wide">
                Manage Your Account & Preferences
              </p>
            </div>

            <Button
              variant="ghost"
              onClick={signOut}
              className="text-gray-300 hover:text-white font-semibold uppercase tracking-wide"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Info */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Account Information</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      size="sm"
                      className="border-gray-400 text-gray-300 hover:bg-gray-600 hover:text-white"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        size="sm"
                        className="bg-white text-slate-900 hover:bg-slate-100"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        {saving ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="outline"
                        size="sm"
                        className="border-gray-400 text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Email Address
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-200">{user?.email}</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Full Name
                        </Label>
                        <div className="mt-1">
                          <span className="text-gray-200">
                            {profile?.full_name || "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Phone Number
                        </Label>
                        <div className="mt-1">
                          <span className="text-gray-200">
                            {profile?.phone || "Not provided"}
                          </span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Member Since
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-200">
                            {user?.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {profile?.bio && (
                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Bio
                        </Label>
                        <div className="mt-1 p-3 bg-gray-700 rounded-md">
                          <span className="text-gray-200">{profile.bio}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-gray-300 font-semibold">
                          Email Address
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-200">{user?.email}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                      </div>

                      <div>
                        <Label htmlFor="full_name" className="text-gray-300 font-semibold">
                          Full Name
                        </Label>
                        <Input
                          id="full_name"
                          value={editForm.full_name}
                          onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                          className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone" className="text-gray-300 font-semibold">
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                          placeholder="Enter your phone number"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-300 font-semibold">
                          Member Since
                        </Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-200">
                            {user?.created_at
                              ? new Date(user.created_at).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio" className="text-gray-300 font-semibold">
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        className="mt-1 bg-gray-700 border-gray-600 text-gray-200"
                        placeholder="Tell us about yourself..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Settings */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>Location Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-300 font-semibold">
                      Current Location
                    </Label>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-200">
                          {userLocation?.displayName || "No location set - Click 'Change' to set your location"}
                        </span>
                      </div>
                      <Button
                        onClick={() => setShowLocationSelector(true)}
                        variant="outline"
                        size="sm"
                        className="border-gray-400 text-gray-300 hover:bg-gray-600 hover:text-white"
                      >
                        <Settings className="h-4 w-4 mr-1" />
                        Change
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400">
                    Your location helps us provide relevant driving scenarios for your area.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4 text-gray-400" />
                      <div>
                        <Label className="text-gray-300 font-semibold">Push Notifications</Label>
                        <p className="text-sm text-gray-400">Receive practice reminders and updates</p>
                      </div>
                    </div>
                    <Switch
                      checked={editForm.preferences.notifications}
                      onCheckedChange={(checked) =>
                        setEditForm({
                          ...editForm,
                          preferences: { ...editForm.preferences, notifications: checked },
                        })
                      }
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-gray-400" />
                      <div>
                        <Label className="text-gray-300 font-semibold">Auto-Detect Location</Label>
                        <p className="text-sm text-gray-400">Automatically detect your location</p>
                      </div>
                    </div>
                    <Switch
                      checked={editForm.preferences.autoLocation}
                      onCheckedChange={(checked) =>
                        setEditForm({
                          ...editForm,
                          preferences: { ...editForm.preferences, autoLocation: checked },
                        })
                      }
                    />
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div>
                        <Label className="text-gray-300 font-semibold">Practice Reminders</Label>
                        <p className="text-sm text-gray-400">Get reminded to practice regularly</p>
                      </div>
                    </div>
                    <Switch
                      checked={editForm.preferences.practiceReminders}
                      onCheckedChange={(checked) =>
                        setEditForm({
                          ...editForm,
                          preferences: { ...editForm.preferences, practiceReminders: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white">
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievementData.map((achievement) => {
                    const IconComponent = getIconComponent(achievement.icon);
                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 ${
                          achievement.earned
                            ? "border-green-600 bg-gray-700"
                            : "border-gray-600 bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <IconComponent className={`h-5 w-5 ${
                            achievement.earned ? "text-green-400" : "text-gray-500"
                          }`} />
                          <h4 className={`font-semibold ${
                            achievement.earned ? "text-green-400" : "text-gray-400"
                          }`}>
                            {achievement.name}
                          </h4>
                        </div>
                        <p className={`text-sm ${
                          achievement.earned ? "text-gray-300" : "text-gray-500"
                        }`}>
                          {achievement.description}
                        </p>
                        {achievement.earned ? (
                          <div className="flex items-center space-x-1 mt-2">
                            <CheckCircle className="h-4 w-4 text-green-400" />
                            <span className="text-xs text-green-400 font-semibold">Earned</span>
                          </div>
                        ) : (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Progress</span>
                              <span>{achievement.progress}/{achievement.requirement}</span>
                            </div>
                            <Progress 
                              value={(achievement.progress / achievement.requirement) * 100} 
                              className="h-1 bg-gray-600" 
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white text-center">
                <CardTitle>Practice Statistics</CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-200">
                      {stats?.totalTests || 0}
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      Total Tests
                    </div>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-400">
                      {stats?.passRate ? Math.round(stats.passRate) : 0}%
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      Pass Rate
                    </div>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-400">
                      {stats?.averageScore ? Math.round(stats.averageScore) : 0}%
                    </div>
                    <div className="text-sm text-gray-400 uppercase tracking-wide">
                      Average Score
                    </div>
                  </div>

                  {stats?.totalTests > 0 && (
                    <>
                      <Separator className="bg-gray-600" />
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-gray-200 font-semibold">
                            {Math.min((stats.totalTests / 50) * 100, 100).toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={Math.min((stats.totalTests / 50) * 100, 100)} className="h-2 bg-gray-700" />
                        <p className="text-xs text-gray-500 text-center">
                          {stats.totalTests}/50 tests completed
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Subscription Status */}
            <Card className="border-2 border-gray-600 bg-gray-800 shadow-lg">
              <CardHeader className="bg-gray-700 text-white text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Subscription Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 bg-gray-800">
                <div className="text-center space-y-4">
                  <div>
                    <Badge className={`mb-2 ${
                      subscriptionStatus.status === "Active" 
                        ? "bg-slate-600 text-white" 
                        : "bg-slate-600 text-white"
                    }`}>
                      {subscriptionStatus.status}
                    </Badge>
                    <h3 className="text-xl font-bold text-gray-200">
                      {subscriptionStatus.type} Plan
                    </h3>
                    {subscriptionStatus.expiresAt && (
                      <p className="text-sm text-gray-400">
                        Expires: {subscriptionStatus.expiresAt}
                      </p>
                    )}
                  </div>

                  <Separator className="bg-gray-600" />

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-300">Features:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {subscriptionStatus.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <CheckCircle className="h-3 w-3 text-white" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    asChild
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    <Link to="/pricing">Manage Subscription</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="border-2 border-gray-700 bg-gray-800 shadow-lg">
              <CardContent className="p-6 bg-gray-800">
                <h3 className="font-bold text-gray-200 mb-4 text-center">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-white text-slate-900 hover:bg-slate-100"
                  >
                    <Link to="/practice">
                      <Target className="h-4 w-4 mr-2" />
                      Start Practice
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Link to="/progress">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Progress
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  >
                    <Link to="/study-materials">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Study Materials
                    </Link>
                  </Button>
                </div>
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
