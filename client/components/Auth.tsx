import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import {
  SOUTH_AFRICAN_LOCATIONS,
  type UserLocation,
} from "@/services/locationService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuthProps {
  onAuthSuccess: () => void;
}

export function Auth({ onAuthSuccess }: AuthProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    location: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              location: formData.location,
            },
          },
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          setSuccess("Check your email for the confirmation link!");
        } else {
          onAuthSuccess();
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;
        onAuthSuccess();
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const groupedLocations = SOUTH_AFRICAN_LOCATIONS.reduce(
    (acc, location) => {
      if (!acc[location.region]) {
        acc[location.region] = [];
      }
      acc[location.region].push(location);
      return acc;
    },
    {} as Record<string, UserLocation[]>,
  );

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-slate-800 bg-white">
        <CardHeader className="bg-slate-800 text-white p-6">
          <CardTitle className="text-2xl font-bold uppercase tracking-wide text-center">
            {isSignUp ? "Create Account" : "Sign In"}
          </CardTitle>
          <p className="text-slate-200 text-center text-sm">
            {isSignUp
              ? "Join thousands practicing for their K53 license"
              : "Welcome back to your K53 practice"}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-semibold text-slate-700 uppercase tracking-wide"
                >
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="pl-10 border-2 border-slate-300"
                    required={isSignUp}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-slate-700 uppercase tracking-wide"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="pl-10 border-2 border-slate-300"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-slate-700 uppercase tracking-wide"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={
                    isSignUp
                      ? "Create a password (min 6 characters)"
                      : "Enter your password"
                  }
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="pl-10 pr-10 border-2 border-slate-300"
                  minLength={isSignUp ? 6 : undefined}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Location (Sign Up Only) */}
            {isSignUp && (
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-semibold text-slate-700 uppercase tracking-wide"
                >
                  Your Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                  <Select
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, location: value }))
                    }
                  >
                    <SelectTrigger className="pl-10 border-2 border-slate-300">
                      <SelectValue placeholder="Choose your city..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {Object.entries(groupedLocations).map(
                        ([region, cities]) => (
                          <div key={region}>
                            <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                              {region}
                            </div>
                            {cities.map((location) => (
                              <SelectItem
                                key={`${location.city}, ${location.region}`}
                                value={location.displayName}
                              >
                                {location.displayName}
                              </SelectItem>
                            ))}
                          </div>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-slate-500">
                  This helps us provide scenarios relevant to your area
                </p>
              </div>
            )}

            {/* Error/Success Messages */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wide py-3"
            >
              {loading
                ? "Please wait..."
                : isSignUp
                  ? "Create Account"
                  : "Sign In"}
            </Button>
          </form>

          {/* Toggle Sign In/Up */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button
                variant="link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError(null);
                  setSuccess(null);
                  setFormData({
                    email: "",
                    password: "",
                    fullName: "",
                    location: "",
                  });
                }}
                className="p-0 text-slate-800 font-semibold uppercase tracking-wide"
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Button>
            </p>
          </div>

          {/* Privacy Note */}
          <div className="mt-4 text-xs text-slate-500 text-center">
            By signing up, you agree to our privacy policy. Your location is
            used only for relevant driving scenarios.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
