// Location service for handling geolocation and South African location data

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface UserLocation {
  city: string;
  region: string;
  coordinates?: LocationCoords;
  displayName: string;
}

// South African cities and regions
export const SOUTH_AFRICAN_LOCATIONS: UserLocation[] = [
  // Gauteng
  {
    city: "Johannesburg",
    region: "Gauteng",
    displayName: "Johannesburg, Gauteng",
  },
  { city: "Pretoria", region: "Gauteng", displayName: "Pretoria, Gauteng" },
  { city: "Centurion", region: "Gauteng", displayName: "Centurion, Gauteng" },
  { city: "Sandton", region: "Gauteng", displayName: "Sandton, Gauteng" },
  { city: "Randburg", region: "Gauteng", displayName: "Randburg, Gauteng" },
  { city: "Soweto", region: "Gauteng", displayName: "Soweto, Gauteng" },
  { city: "Benoni", region: "Gauteng", displayName: "Benoni, Gauteng" },

  // Western Cape
  {
    city: "Cape Town",
    region: "Western Cape",
    displayName: "Cape Town, Western Cape",
  },
  {
    city: "Stellenbosch",
    region: "Western Cape",
    displayName: "Stellenbosch, Western Cape",
  },
  { city: "Paarl", region: "Western Cape", displayName: "Paarl, Western Cape" },
  {
    city: "George",
    region: "Western Cape",
    displayName: "George, Western Cape",
  },
  {
    city: "Knysna",
    region: "Western Cape",
    displayName: "Knysna, Western Cape",
  },
  {
    city: "Hermanus",
    region: "Western Cape",
    displayName: "Hermanus, Western Cape",
  },
  {
    city: "Worcester",
    region: "Western Cape",
    displayName: "Worcester, Western Cape",
  },

  // KwaZulu-Natal
  {
    city: "Durban",
    region: "KwaZulu-Natal",
    displayName: "Durban, KwaZulu-Natal",
  },
  {
    city: "Pietermaritzburg",
    region: "KwaZulu-Natal",
    displayName: "Pietermaritzburg, KwaZulu-Natal",
  },
  {
    city: "Newcastle",
    region: "KwaZulu-Natal",
    displayName: "Newcastle, KwaZulu-Natal",
  },
  {
    city: "Richards Bay",
    region: "KwaZulu-Natal",
    displayName: "Richards Bay, KwaZulu-Natal",
  },
  {
    city: "Ladysmith",
    region: "KwaZulu-Natal",
    displayName: "Ladysmith, KwaZulu-Natal",
  },

  // Eastern Cape
  {
    city: "Port Elizabeth",
    region: "Eastern Cape",
    displayName: "Port Elizabeth, Eastern Cape",
  },
  {
    city: "East London",
    region: "Eastern Cape",
    displayName: "East London, Eastern Cape",
  },
  {
    city: "Uitenhage",
    region: "Eastern Cape",
    displayName: "Uitenhage, Eastern Cape",
  },
  {
    city: "Grahamstown",
    region: "Eastern Cape",
    displayName: "Grahamstown, Eastern Cape",
  },

  // Free State
  {
    city: "Bloemfontein",
    region: "Free State",
    displayName: "Bloemfontein, Free State",
  },
  { city: "Welkom", region: "Free State", displayName: "Welkom, Free State" },
  {
    city: "Kroonstad",
    region: "Free State",
    displayName: "Kroonstad, Free State",
  },

  // Limpopo
  { city: "Polokwane", region: "Limpopo", displayName: "Polokwane, Limpopo" },
  { city: "Tzaneen", region: "Limpopo", displayName: "Tzaneen, Limpopo" },
  {
    city: "Thohoyandou",
    region: "Limpopo",
    displayName: "Thohoyandou, Limpopo",
  },

  // Mpumalanga
  {
    city: "Nelspruit",
    region: "Mpumalanga",
    displayName: "Nelspruit, Mpumalanga",
  },
  { city: "Witbank", region: "Mpumalanga", displayName: "Witbank, Mpumalanga" },
  { city: "Secunda", region: "Mpumalanga", displayName: "Secunda, Mpumalanga" },

  // North West
  {
    city: "Rustenburg",
    region: "North West",
    displayName: "Rustenburg, North West",
  },
  {
    city: "Klerksdorp",
    region: "North West",
    displayName: "Klerksdorp, North West",
  },
  {
    city: "Potchefstroom",
    region: "North West",
    displayName: "Potchefstroom, North West",
  },

  // Northern Cape
  {
    city: "Kimberley",
    region: "Northern Cape",
    displayName: "Kimberley, Northern Cape",
  },
  {
    city: "Upington",
    region: "Northern Cape",
    displayName: "Upington, Northern Cape",
  },
];

// Get user's current location using browser geolocation
export const getCurrentLocation = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    );
  });
};

// Simple reverse geocoding for major South African cities
export const reverseGeocode = (coords: LocationCoords): UserLocation => {
  // Major South African city coordinates (approximate city centers)
  const cityCoordinates = [
    { city: "Johannesburg", region: "Gauteng", lat: -26.2041, lng: 28.0473 },
    { city: "Cape Town", region: "Western Cape", lat: -33.9249, lng: 18.4241 },
    { city: "Durban", region: "KwaZulu-Natal", lat: -29.8587, lng: 31.0218 },
    { city: "Pretoria", region: "Gauteng", lat: -25.7479, lng: 28.2293 },
    {
      city: "Port Elizabeth",
      region: "Eastern Cape",
      lat: -33.9608,
      lng: 25.6022,
    },
    { city: "Bloemfontein", region: "Free State", lat: -29.0852, lng: 26.1596 },
    {
      city: "East London",
      region: "Eastern Cape",
      lat: -33.0153,
      lng: 27.9116,
    },
    { city: "Polokwane", region: "Limpopo", lat: -23.9045, lng: 29.4689 },
    { city: "Nelspruit", region: "Mpumalanga", lat: -25.4753, lng: 30.9696 },
    { city: "Kimberley", region: "Northern Cape", lat: -28.7282, lng: 24.7499 },
    { city: "Rustenburg", region: "North West", lat: -25.6672, lng: 27.2424 },
    {
      city: "Pietermaritzburg",
      region: "KwaZulu-Natal",
      lat: -29.6196,
      lng: 30.3794,
    },
  ];

  // Calculate distance to each city and find the closest one
  let closestCity = cityCoordinates[0];
  let minDistance = calculateDistance(coords, {
    latitude: closestCity.lat,
    longitude: closestCity.lng,
  });

  for (const city of cityCoordinates.slice(1)) {
    const distance = calculateDistance(coords, {
      latitude: city.lat,
      longitude: city.lng,
    });
    if (distance < minDistance) {
      minDistance = distance;
      closestCity = city;
    }
  }

  // If more than 100km away, use region-based location
  if (minDistance > 100) {
    // Determine region based on general area
    if (coords.latitude > -26 && coords.longitude > 27) {
      return {
        city: "General Area",
        region: "Gauteng",
        displayName: "Gauteng Province",
      };
    } else if (coords.latitude < -30 && coords.longitude < 20) {
      return {
        city: "General Area",
        region: "Western Cape",
        displayName: "Western Cape Province",
      };
    } else if (coords.latitude < -28 && coords.longitude > 30) {
      return {
        city: "General Area",
        region: "KwaZulu-Natal",
        displayName: "KwaZulu-Natal Province",
      };
    }
  }

  return {
    city: closestCity.city,
    region: closestCity.region,
    coordinates: coords,
    displayName: `${closestCity.city}, ${closestCity.region}`,
  };
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (
  coord1: LocationCoords,
  coord2: LocationCoords,
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  const lat1 = toRadians(coord1.latitude);
  const lat2 = toRadians(coord2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Get location from local storage
export const getStoredLocation = (): UserLocation | null => {
  try {
    const stored = localStorage.getItem("userLocation");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

// Store location in local storage
export const storeLocation = (location: UserLocation): void => {
  try {
    localStorage.setItem("userLocation", JSON.stringify(location));
  } catch {
    // Ignore storage errors
  }
};

// Clear stored location
export const clearStoredLocation = (): void => {
  try {
    localStorage.removeItem("userLocation");
  } catch {
    // Ignore storage errors
  }
};
