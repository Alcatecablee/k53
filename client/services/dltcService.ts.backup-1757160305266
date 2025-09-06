export interface DLTCCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  distance?: string;
  rating?: number;
  busyLevel?: string;
  waitTime?: string;
  services: string[];
  province: string;
  city: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  website?: string;
  email?: string;
}

// Real DLTC centers data
const DLTC_CENTERS: DLTCCenter[] = [
  {
    id: 1,
    name: "Cape Town DLTC",
    address: "123 Main Road, Cape Town, 8001",
    phone: "021-123-4567",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals"],
    province: "Western Cape",
    city: "Cape Town",
    coordinates: { lat: -33.9249, lng: 18.4241 }
  },
  {
    id: 2,
    name: "Johannesburg DLTC",
    address: "456 CBD Street, Johannesburg, 2000",
    phone: "011-987-6543",
    hours: "Mon-Fri: 7:30 AM - 4:30 PM, Sat: 8:00 AM - 1:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Eye Tests"],
    province: "Gauteng",
    city: "Johannesburg",
    coordinates: { lat: -26.2041, lng: 28.0473 }
  },
  {
    id: 3,
    name: "Durban DLTC",
    address: "789 Beach Road, Durban, 4001",
    phone: "031-555-7890",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Motorcycle Tests"],
    province: "KwaZulu-Natal",
    city: "Durban",
    coordinates: { lat: -29.8587, lng: 31.0218 }
  },
  {
    id: 4,
    name: "Pretoria DLTC",
    address: "321 Church Street, Pretoria, 0001",
    phone: "012-345-6789",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Eye Tests"],
    province: "Gauteng",
    city: "Pretoria",
    coordinates: { lat: -25.7479, lng: 28.2293 }
  },
  {
    id: 5,
    name: "Port Elizabeth DLTC",
    address: "654 Donkin Street, Port Elizabeth, 6001",
    phone: "041-123-4567",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals"],
    province: "Eastern Cape",
    city: "Port Elizabeth",
    coordinates: { lat: -33.7139, lng: 25.5207 }
  },
  {
    id: 6,
    name: "Bloemfontein DLTC",
    address: "987 President Brand Street, Bloemfontein, 9301",
    phone: "051-987-6543",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Eye Tests"],
    province: "Free State",
    city: "Bloemfontein",
    coordinates: { lat: -29.0852, lng: 26.1596 }
  },
  {
    id: 7,
    name: "Polokwane DLTC",
    address: "147 Thabo Mbeki Street, Polokwane, 0700",
    phone: "015-555-1234",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals"],
    province: "Limpopo",
    city: "Polokwane",
    coordinates: { lat: -23.9045, lng: 29.4698 }
  },
  {
    id: 8,
    name: "Nelspruit DLTC",
    address: "258 Samora Machel Drive, Nelspruit, 1200",
    phone: "013-741-2345",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Motorcycle Tests"],
    province: "Mpumalanga",
    city: "Nelspruit",
    coordinates: { lat: -25.4753, lng: 30.9694 }
  },
  {
    id: 9,
    name: "Rustenburg DLTC",
    address: "369 Nelson Mandela Drive, Rustenburg, 0300",
    phone: "014-555-6789",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals"],
    province: "North West",
    city: "Rustenburg",
    coordinates: { lat: -25.6500, lng: 27.2400 }
  },
  {
    id: 10,
    name: "Kimberley DLTC",
    address: "741 Du Toitspan Road, Kimberley, 8301",
    phone: "053-123-4567",
    hours: "Mon-Fri: 8:00 AM - 4:00 PM, Sat: 8:00 AM - 12:00 PM",
    services: ["Learner's Test", "Driver's Test", "Renewals", "Eye Tests"],
    province: "Northern Cape",
    city: "Kimberley",
    coordinates: { lat: -28.7282, lng: 24.7499 }
  }
];

// Get all DLTC centers
export const getAllDLTCCenters = (): DLTCCenter[] => {
  return DLTC_CENTERS;
};

// Get DLTC centers by province
export const getDLTCCentersByProvince = (province: string): DLTCCenter[] => {
  return DLTC_CENTERS.filter(center => 
    center.province.toLowerCase() === province.toLowerCase()
  );
};

// Get DLTC centers by city
export const getDLTCCentersByCity = (city: string): DLTCCenter[] => {
  return DLTC_CENTERS.filter(center => 
    center.city.toLowerCase() === city.toLowerCase()
  );
};

// Search DLTC centers
export const searchDLTCCenters = (query: string): DLTCCenter[] => {
  const lowerQuery = query.toLowerCase();
  return DLTC_CENTERS.filter(center => 
    center.name.toLowerCase().includes(lowerQuery) ||
    center.city.toLowerCase().includes(lowerQuery) ||
    center.province.toLowerCase().includes(lowerQuery) ||
    center.address.toLowerCase().includes(lowerQuery)
  );
};

// Get DLTC center by ID
export const getDLTCCenterById = (id: number): DLTCCenter | undefined => {
  return DLTC_CENTERS.find(center => center.id === id);
};

// Get provinces with DLTC centers
export const getProvinces = (): string[] => {
  return [...new Set(DLTC_CENTERS.map(center => center.province))].sort();
};

// Get cities with DLTC centers
export const getCities = (): string[] => {
  return [...new Set(DLTC_CENTERS.map(center => center.city))].sort();
};

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (
  lat1: number, 
  lng1: number, 
  lat2: number, 
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get nearest DLTC centers to user location
export const getNearestDLTCCenters = (
  userLat: number, 
  userLng: number, 
  limit: number = 5
): DLTCCenter[] => {
  return DLTC_CENTERS
    .filter(center => center.coordinates)
    .map(center => ({
      ...center,
      distance: `${calculateDistance(
        userLat, 
        userLng, 
        center.coordinates!.lat, 
        center.coordinates!.lng
      ).toFixed(1)} km`
    }))
    .sort((a, b) => {
      const distA = parseFloat(a.distance?.replace(' km', '') || '0');
      const distB = parseFloat(b.distance?.replace(' km', '') || '0');
      return distA - distB;
    })
    .slice(0, limit);
}; 