// Enhanced image mapping for K53 application with relevant content
export interface ImageAsset {
  filename: string;
  path: string;
  id: string;
  description?: string;
  context?: readonly string[];
  difficulty?: "basic" | "intermediate" | "advanced";
}

// Enhanced image mapping with K53-specific content
export const imageMapping = {
  "controls": [
    // Vehicle Controls - Basic
    {
      "filename": "clutch-pedal.jpg",
      "path": "/images/controls/clutch-pedal.jpg",
      "id": "clutch-pedal",
      "description": "Clutch pedal for gear changes",
      "context": ["gear-change", "manual-transmission"],
      "difficulty": "basic"
    },
    {
      "filename": "brake-pedal.jpg",
      "path": "/images/controls/brake-pedal.jpg",
      "id": "brake-pedal",
      "description": "Service brake pedal",
      "context": ["braking", "stopping"],
      "difficulty": "basic"
    },
    {
      "filename": "accelerator-pedal.jpg",
      "path": "/images/controls/accelerator-pedal.jpg",
      "id": "accelerator-pedal",
      "description": "Accelerator pedal for speed control",
      "context": ["speed-control", "acceleration"],
      "difficulty": "basic"
    },
    {
      "filename": "steering-wheel.jpg",
      "path": "/images/controls/steering-wheel.jpg",
      "id": "steering-wheel",
      "description": "Steering wheel with proper hand position",
      "context": ["steering", "hand-position"],
      "difficulty": "basic"
    },
    {
      "filename": "gear-stick.jpg",
      "path": "/images/controls/gear-stick.jpg",
      "id": "gear-stick",
      "description": "Manual gear stick",
      "context": ["gear-change", "manual-transmission"],
      "difficulty": "basic"
    },
    {
      "filename": "parking-brake.jpg",
      "path": "/images/controls/parking-brake.jpg",
      "id": "parking-brake",
      "description": "Parking brake lever",
      "context": ["parking", "stationary"],
      "difficulty": "basic"
    },
    {
      "filename": "indicators.jpg",
      "path": "/images/controls/indicators.jpg",
      "id": "indicators",
      "description": "Indicator controls",
      "context": ["signaling", "turning"],
      "difficulty": "basic"
    },
    {
      "filename": "rear-view-mirror.jpg",
      "path": "/images/controls/rear-view-mirror.jpg",
      "id": "rear-view-mirror",
      "description": "Rear view mirror",
      "context": ["mirrors", "awareness"],
      "difficulty": "basic"
    },
    {
      "filename": "side-mirrors.jpg",
      "path": "/images/controls/side-mirrors.jpg",
      "id": "side-mirrors",
      "description": "Side mirrors",
      "context": ["mirrors", "lane-changes"],
      "difficulty": "basic"
    },
    {
      "filename": "dashboard-instruments.jpg",
      "path": "/images/controls/dashboard-instruments.jpg",
      "id": "dashboard-instruments",
      "description": "Dashboard with speedometer and instruments",
      "context": ["monitoring", "speed"],
      "difficulty": "basic"
    }
  ],
  "signs": [
    // Traffic Signs - Regulatory
    {
      "filename": "stop-sign.jpg",
      "path": "/images/signs/stop-sign.jpg",
      "id": "stop-sign",
      "description": "Stop sign",
      "context": ["regulatory", "intersection"],
      "difficulty": "basic"
    },
    {
      "filename": "yield-sign.jpg",
      "path": "/images/signs/yield-sign.jpg",
      "id": "yield-sign",
      "description": "Yield sign",
      "context": ["regulatory", "intersection"],
      "difficulty": "basic"
    },
    {
      "filename": "no-entry.jpg",
      "path": "/images/signs/no-entry.jpg",
      "id": "no-entry",
      "description": "No entry sign",
      "context": ["regulatory", "restricted"],
      "difficulty": "basic"
    },
    {
      "filename": "speed-limit-60.jpg",
      "path": "/images/signs/speed-limit-60.jpg",
      "id": "speed-limit-60",
      "description": "Speed limit 60 km/h",
      "context": ["regulatory", "speed"],
      "difficulty": "basic"
    },
    {
      "filename": "speed-limit-120.jpg",
      "path": "/images/signs/speed-limit-120.jpg",
      "id": "speed-limit-120",
      "description": "Speed limit 120 km/h",
      "context": ["regulatory", "speed", "highway"],
      "difficulty": "basic"
    },
    {
      "filename": "one-way.jpg",
      "path": "/images/signs/one-way.jpg",
      "id": "one-way",
      "description": "One way sign",
      "context": ["regulatory", "direction"],
      "difficulty": "basic"
    },
    {
      "filename": "no-parking.jpg",
      "path": "/images/signs/no-parking.jpg",
      "id": "no-parking",
      "description": "No parking sign",
      "context": ["regulatory", "parking"],
      "difficulty": "basic"
    },
    {
      "filename": "no-overtaking.jpg",
      "path": "/images/signs/no-overtaking.jpg",
      "id": "no-overtaking",
      "description": "No overtaking sign",
      "context": ["regulatory", "overtaking"],
      "difficulty": "intermediate"
    },
    // Traffic Signs - Warning
    {
      "filename": "pedestrian-crossing.jpg",
      "path": "/images/signs/pedestrian-crossing.jpg",
      "id": "pedestrian-crossing",
      "description": "Pedestrian crossing warning",
      "context": ["warning", "pedestrians"],
      "difficulty": "basic"
    },
    {
      "filename": "school-crossing.jpg",
      "path": "/images/signs/school-crossing.jpg",
      "id": "school-crossing",
      "description": "School crossing warning",
      "context": ["warning", "school", "children"],
      "difficulty": "basic"
    },
    {
      "filename": "sharp-bend.jpg",
      "path": "/images/signs/sharp-bend.jpg",
      "id": "sharp-bend",
      "description": "Sharp bend warning",
      "context": ["warning", "curve"],
      "difficulty": "basic"
    },
    {
      "filename": "road-works.jpg",
      "path": "/images/signs/road-works.jpg",
      "id": "road-works",
      "description": "Road works warning",
      "context": ["warning", "construction"],
      "difficulty": "basic"
    },
    {
      "filename": "slippery-road.jpg",
      "path": "/images/signs/slippery-road.jpg",
      "id": "slippery-road",
      "description": "Slippery road warning",
      "context": ["warning", "weather"],
      "difficulty": "basic"
    },
    {
      "filename": "animals-crossing.jpg",
      "path": "/images/signs/animals-crossing.jpg",
      "id": "animals-crossing",
      "description": "Animals crossing warning",
      "context": ["warning", "animals"],
      "difficulty": "basic"
    },
    // Traffic Signs - Information
    {
      "filename": "hospital.jpg",
      "path": "/images/signs/hospital.jpg",
      "id": "hospital",
      "description": "Hospital information sign",
      "context": ["information", "services"],
      "difficulty": "basic"
    },
    {
      "filename": "fuel-station.jpg",
      "path": "/images/signs/fuel-station.jpg",
      "id": "fuel-station",
      "description": "Fuel station information sign",
      "context": ["information", "services"],
      "difficulty": "basic"
    },
    {
      "filename": "rest-area.jpg",
      "path": "/images/signs/rest-area.jpg",
      "id": "rest-area",
      "description": "Rest area information sign",
      "context": ["information", "services"],
      "difficulty": "basic"
    }
  ],
  "rules": [
    // Road Rules - Basic
    {
      "filename": "right-of-way.jpg",
      "path": "/images/rules/right-of-way.jpg",
      "id": "right-of-way",
      "description": "Right of way at intersection",
      "context": ["intersection", "priority"],
      "difficulty": "basic"
    },
    {
      "filename": "roundabout.jpg",
      "path": "/images/rules/roundabout.jpg",
      "id": "roundabout",
      "description": "Roundabout rules",
      "context": ["roundabout", "circulation"],
      "difficulty": "intermediate"
    },
    {
      "filename": "traffic-light.jpg",
      "path": "/images/rules/traffic-light.jpg",
      "id": "traffic-light",
      "description": "Traffic light sequence",
      "context": ["traffic-light", "intersection"],
      "difficulty": "basic"
    },
    {
      "filename": "parking-rules.jpg",
      "path": "/images/rules/parking-rules.jpg",
      "id": "parking-rules",
      "description": "Parking rules and restrictions",
      "context": ["parking", "restrictions"],
      "difficulty": "basic"
    },
    {
      "filename": "overtaking.jpg",
      "path": "/images/rules/overtaking.jpg",
      "id": "overtaking",
      "description": "Overtaking rules",
      "context": ["overtaking", "safety"],
      "difficulty": "intermediate"
    },
    {
      "filename": "following-distance.jpg",
      "path": "/images/rules/following-distance.jpg",
      "id": "following-distance",
      "description": "Safe following distance",
      "context": ["safety", "distance"],
      "difficulty": "basic"
    },
    {
      "filename": "emergency-vehicle.jpg",
      "path": "/images/rules/emergency-vehicle.jpg",
      "id": "emergency-vehicle",
      "description": "Emergency vehicle priority",
      "context": ["emergency", "priority"],
      "difficulty": "basic"
    },
    {
      "filename": "school-zone.jpg",
      "path": "/images/rules/school-zone.jpg",
      "id": "school-zone",
      "description": "School zone rules",
      "context": ["school", "speed"],
      "difficulty": "basic"
    },
    {
      "filename": "construction-zone.jpg",
      "path": "/images/rules/construction-zone.jpg",
      "id": "construction-zone",
      "description": "Construction zone rules",
      "context": ["construction", "speed"],
      "difficulty": "basic"
    },
    {
      "filename": "pedestrian-priority.jpg",
      "path": "/images/rules/pedestrian-priority.jpg",
      "id": "pedestrian-priority",
      "description": "Pedestrian priority at crossings",
      "context": ["pedestrians", "priority"],
      "difficulty": "basic"
    }
  ],
  "scenarios": [
    // Urban Scenarios
    {
      "filename": "johannesburg-traffic.jpg",
      "path": "/images/scenarios/johannesburg-traffic.jpg",
      "id": "johannesburg-traffic",
      "description": "Johannesburg CBD traffic",
      "context": ["urban", "johannesburg", "traffic"],
      "difficulty": "intermediate"
    },
    {
      "filename": "cape-town-intersection.jpg",
      "path": "/images/scenarios/cape-town-intersection.jpg",
      "id": "cape-town-intersection",
      "description": "Cape Town intersection",
      "context": ["urban", "cape-town", "intersection"],
      "difficulty": "basic"
    },
    {
      "filename": "durban-taxi-rank.jpg",
      "path": "/images/scenarios/durban-taxi-rank.jpg",
      "id": "durban-taxi-rank",
      "description": "Durban taxi rank area",
      "context": ["urban", "durban", "public-transport"],
      "difficulty": "intermediate"
    },
    {
      "filename": "pretoria-government.jpg",
      "path": "/images/scenarios/pretoria-government.jpg",
      "id": "pretoria-government",
      "description": "Pretoria government district",
      "context": ["urban", "pretoria", "government"],
      "difficulty": "basic"
    },
    // Highway Scenarios
    {
      "filename": "n1-highway.jpg",
      "path": "/images/scenarios/n1-highway.jpg",
      "id": "n1-highway",
      "description": "N1 highway",
      "context": ["highway", "n1", "long-distance"],
      "difficulty": "intermediate"
    },
    {
      "filename": "n3-highway.jpg",
      "path": "/images/scenarios/n3-highway.jpg",
      "id": "n3-highway",
      "description": "N3 highway",
      "context": ["highway", "n3", "long-distance"],
      "difficulty": "intermediate"
    },
    {
      "filename": "n2-highway.jpg",
      "path": "/images/scenarios/n2-highway.jpg",
      "id": "n2-highway",
      "description": "N2 highway",
      "context": ["highway", "n2", "long-distance"],
      "difficulty": "intermediate"
    },
    // Rural Scenarios
    {
      "filename": "rural-road.jpg",
      "path": "/images/scenarios/rural-road.jpg",
      "id": "rural-road",
      "description": "Rural road with animals",
      "context": ["rural", "animals", "gravel"],
      "difficulty": "basic"
    },
    {
      "filename": "farm-access.jpg",
      "path": "/images/scenarios/farm-access.jpg",
      "id": "farm-access",
      "description": "Farm access road",
      "context": ["rural", "farm", "access"],
      "difficulty": "basic"
    },
    // Weather Scenarios
    {
      "filename": "rainy-conditions.jpg",
      "path": "/images/scenarios/rainy-conditions.jpg",
      "id": "rainy-conditions",
      "description": "Wet road conditions",
      "context": ["weather", "rain", "slippery"],
      "difficulty": "intermediate"
    },
    {
      "filename": "foggy-conditions.jpg",
      "path": "/images/scenarios/foggy-conditions.jpg",
      "id": "foggy-conditions",
      "description": "Foggy driving conditions",
      "context": ["weather", "fog", "visibility"],
      "difficulty": "advanced"
    },
    {
      "filename": "night-driving.jpg",
      "path": "/images/scenarios/night-driving.jpg",
      "id": "night-driving",
      "description": "Night driving conditions",
      "context": ["night", "visibility", "headlights"],
      "difficulty": "intermediate"
    },
    // Special Situations
    {
      "filename": "emergency-response.jpg",
      "path": "/images/scenarios/emergency-response.jpg",
      "id": "emergency-response",
      "description": "Emergency vehicle approach",
      "context": ["emergency", "priority", "response"],
      "difficulty": "basic"
    },
    {
      "filename": "construction-work.jpg",
      "path": "/images/scenarios/construction-work.jpg",
      "id": "construction-work",
      "description": "Road construction work",
      "context": ["construction", "work-zone", "speed"],
      "difficulty": "basic"
    },
    {
      "filename": "school-zone-traffic.jpg",
      "path": "/images/scenarios/school-zone-traffic.jpg",
      "id": "school-zone-traffic",
      "description": "School zone during drop-off",
      "context": ["school", "children", "speed"],
      "difficulty": "basic"
    },
    {
      "filename": "pedestrian-crossing-busy.jpg",
      "path": "/images/scenarios/pedestrian-crossing-busy.jpg",
      "id": "pedestrian-crossing-busy",
      "description": "Busy pedestrian crossing",
      "context": ["pedestrians", "crossing", "priority"],
      "difficulty": "basic"
    }
  ]
} as const;

// Enhanced image selection functions
export const getImagesByCategory = (category: keyof typeof imageMapping): ImageAsset[] => {
  const images = imageMapping[category];
  return images ? [...images] : [];
};

export const getRandomImageByCategory = (category: keyof typeof imageMapping): ImageAsset | null => {
  const images = getImagesByCategory(category);
  if (images.length > 0) {
    return images[Math.floor(Math.random() * images.length)];
  }
  return null;
};

// Context-aware image selection
export const getImageByContext = (
  category: keyof typeof imageMapping,
  context: string[]
): ImageAsset | null => {
  const images = getImagesByCategory(category);
  const matchingImages = images.filter(img => 
    img.context && img.context.some(ctx => context.includes(ctx))
  );
  
  if (matchingImages.length > 0) {
    return matchingImages[Math.floor(Math.random() * matchingImages.length)];
  }
  
  // Fallback to random image from category
  return getRandomImageByCategory(category);
};

// Difficulty-based image selection
export const getImageByDifficulty = (
  category: keyof typeof imageMapping,
  difficulty: "basic" | "intermediate" | "advanced"
): ImageAsset | null => {
  const images = getImagesByCategory(category);
  const matchingImages = images.filter(img => img.difficulty === difficulty);
  
  if (matchingImages.length > 0) {
    return matchingImages[Math.floor(Math.random() * matchingImages.length)];
  }
  
  // Fallback to random image from category
  return getRandomImageByCategory(category);
};

// Scenario-specific image selection
export const getScenarioImage = (
  scenario: {
    category: "controls" | "signs" | "rules" | "mixed";
    context?: string;
    difficulty?: "basic" | "intermediate" | "advanced";
    location?: {
      cities?: string[];
      regions?: string[];
    };
  }
): ImageAsset | null => {
  // For mixed scenarios, prioritize scenarios category
  const category = scenario.category === "mixed" ? "scenarios" : scenario.category;
  
  if (category === "scenarios") {
    // Use context and location for scenario images
    const contextArray = scenario.context ? [scenario.context] : [];
    if (scenario.location?.cities) {
      contextArray.push(...scenario.location.cities.map(city => city.toLowerCase()));
    }
    
    return getImageByContext("scenarios", contextArray);
  }
  
  // For other categories, use difficulty-based selection
  if (scenario.difficulty) {
    return getImageByDifficulty(category as keyof typeof imageMapping, scenario.difficulty);
  }
  
  return getRandomImageByCategory(category as keyof typeof imageMapping);
};

// Question-specific image selection
export const getQuestionImage = (
  question: {
    category: "controls" | "signs" | "rules";
    question: string;
  }
): ImageAsset | null => {
  // Safety check for undefined question
  if (!question || !question.question) {
    return getRandomImageByCategory(question?.category || "controls");
  }
  
  // Extract context from question text
  const questionText = question.question.toLowerCase();
  const context: string[] = [];
  
  // Add context based on question content
  if (questionText.includes("clutch") || questionText.includes("gear")) {
    context.push("gear-change");
  }
  if (questionText.includes("brake") || questionText.includes("stop")) {
    context.push("braking");
  }
  if (questionText.includes("speed") || questionText.includes("accelerator")) {
    context.push("speed-control");
  }
  if (questionText.includes("steering") || questionText.includes("wheel")) {
    context.push("steering");
  }
  if (questionText.includes("mirror")) {
    context.push("mirrors");
  }
  if (questionText.includes("indicator") || questionText.includes("signal")) {
    context.push("signaling");
  }
  if (questionText.includes("parking")) {
    context.push("parking");
  }
  
  if (context.length > 0) {
    return getImageByContext(question.category, context);
  }
  
  return getRandomImageByCategory(question.category);
};
