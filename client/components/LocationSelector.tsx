import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, X, AlertCircle, CheckCircle } from "lucide-react";
import {
  getCurrentLocation,
  reverseGeocode,
  SOUTH_AFRICAN_LOCATIONS,
  storeLocation,
  type UserLocation,
} from "@/services/locationService";

interface LocationSelectorProps {
  onLocationSelected: (location: UserLocation) => void;
  onClose: () => void;
  currentLocation?: UserLocation | null;
}

export function LocationSelector({
  onLocationSelected,
  onClose,
  currentLocation,
}: LocationSelectorProps) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionError, setDetectionError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<UserLocation | null>(
    currentLocation || null,
  );

  const handleAutoDetect = async () => {
    setIsDetecting(true);
    setDetectionError(null);

    try {
      const coords = await getCurrentLocation();
      const location = reverseGeocode(coords);
      setSelectedLocation(location);
      setDetectionError(null);
    } catch (error) {
      setDetectionError(
        error instanceof Error ? error.message : "Failed to detect location",
      );
    } finally {
      setIsDetecting(false);
    }
  };

  const handleManualSelect = (cityRegion: string) => {
    const location = SOUTH_AFRICAN_LOCATIONS.find(
      (loc) => `${loc.city}, ${loc.region}` === cityRegion,
    );
    if (location) {
      setSelectedLocation(location);
      setDetectionError(null);
    }
  };

  const handleConfirm = () => {
    if (selectedLocation) {
      storeLocation(selectedLocation);
      onLocationSelected(selectedLocation);
      onClose();
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl border-2 border-black-800 bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-slate-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-6 w-6" />
              <CardTitle className="text-xl font-bold uppercase tracking-wide">
                Choose Your Location
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <p className="text-slate-200 mt-2">
            Get K53 scenarios tailored to your area - from Johannesburg taxi
            ranks to Cape Town's coastal roads!
          </p>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Auto-detect Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
              Auto-Detect Location
            </h3>
            <div className="bg-slate-100 p-4 rounded border-2 border-black-300">
              <p className="text-slate-700 text-sm mb-4">
                Enable location services to automatically find scenarios for
                your area, like load shedding in Pretoria or potholes on the N2.
              </p>
              <Button
                onClick={handleAutoDetect}
                disabled={isDetecting}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wide"
              >
                {isDetecting ? (
                  <>
                    <Navigation className="h-4 w-4 mr-2 animate-spin" />
                    Detecting Location...
                  </>
                ) : (
                  <>
                    <Navigation className="h-4 w-4 mr-2" />
                    Auto-Detect My Location
                  </>
                )}
              </Button>

              {detectionError && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded flex items-start space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{detectionError}</p>
                </div>
              )}
            </div>
          </div>

          {/* Manual Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
              Or Select Manually
            </h3>
            <div className="bg-slate-100 p-4 rounded border-2 border-black-300">
              <Select onValueChange={handleManualSelect}>
                <SelectTrigger className="w-full border-2 border-black-300 bg-white">
                  <SelectValue placeholder="Choose your city..." />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {Object.entries(groupedLocations).map(([region, cities]) => (
                    <div key={region}>
                      <div className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {region}
                      </div>
                      {cities.map((location) => (
                        <SelectItem
                          key={`${location.city}, ${location.region}`}
                          value={`${location.city}, ${location.region}`}
                        >
                          {location.displayName}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Location Display */}
          {selectedLocation && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 uppercase tracking-wide">
                Selected Location
              </h3>
              <div className="bg-green-50 p-4 rounded border-2 border-green-200 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <Badge className="bg-green-600 text-white mb-2">
                    {selectedLocation.displayName}
                  </Badge>
                  <p className="text-green-700 text-sm">
                    You'll get scenarios like navigating {selectedLocation.city}
                    's roads, local traffic conditions, and{" "}
                    {selectedLocation.region}-specific driving challenges.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-black-200">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-black-300 text-slate-700 hover:bg-slate-100 font-semibold uppercase tracking-wide"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedLocation}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold uppercase tracking-wide disabled:opacity-50"
            >
              Confirm Location
            </Button>
          </div>

          {/* Privacy Note */}
          <div className="text-xs text-slate-500 text-center pt-2 border-t border-black-200">
            Your location is only used to provide relevant scenarios and is
            stored locally on your device.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
