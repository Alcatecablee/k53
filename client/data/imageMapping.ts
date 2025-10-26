// Auto-generated image mapping from organize-k53-images.js
export interface ImageAsset {
  filename: string;
  path: string;
  id: string;
  description?: string;
  context?: readonly string[];
  tags?: string[]; // New: Specific tags for each image (optional for backward compatibility)
  difficulty?: "basic" | "intermediate" | "advanced";
  colors?: string[]; // Color properties for filtering
  shape?: string; // Shape property for filtering
  createdAt?: Date; // Creation date for sorting
}

// Comprehensive tag system for K53 images
export const IMAGE_TAGS = {
  // Sign Types
  signTypes: {
    'no-entry': 'No Entry signs',
    'stop': 'Stop signs',
    'yield': 'Yield/Give Way signs',
    'speed-limit': 'Speed limit signs',
    'parking': 'Parking signs',
    'no-parking': 'No Parking signs',
    'overtaking': 'Overtaking signs',
    'pedestrian': 'Pedestrian crossing signs',
    'school': 'School zone signs',
    'traffic-light': 'Traffic lights',
    'one-way': 'One way signs',
    'roundabout': 'Roundabout signs',
    'emergency': 'Emergency vehicle signs',
    'construction': 'Construction signs',
    'weather': 'Weather warning signs',
    'time-restriction': 'Time restriction signs',
    'vehicle-type': 'Vehicle type signs',
    'weight-limit': 'Weight limit signs',
    'height-limit': 'Height limit signs',
    'width-limit': 'Width limit signs',
    'bridge': 'Bridge/Tunnel signs',
    'railway': 'Railway crossing signs',
    'animals': 'Animal warning signs',
    'sharp-curve': 'Sharp curve signs',
    'steep-hill': 'Steep hill signs',
    'slippery': 'Slippery road signs',
    'falling-rocks': 'Falling rocks signs',
    'narrow-road': 'Narrow road signs',
    'two-way': 'Two way traffic signs',
    'merge': 'Merge signs',
    'diverging': 'Diverging signs',
    't-intersection': 'T-intersection signs',
    'y-intersection': 'Y-intersection signs',
    'priority-road': 'Priority road signs',
    'dead-end': 'Dead end signs',
    'cul-de-sac': 'Cul-de-sac signs',
    'speed-bump': 'Speed bump signs',
    'speed-camera': 'Speed camera signs',
    'toll': 'Toll signs',
    'border': 'Border signs',
    'quarantine': 'Quarantine signs',
    'weighbridge': 'Weighbridge signs',
    'inspection': 'Inspection signs'
  },
  
  // Contexts
  contexts: {
    'urban': 'Urban areas',
    'highway': 'Highways',
    'rural': 'Rural areas',
    'intersection': 'Intersections',
    'school-zone': 'School zones',
    'residential': 'Residential areas',
    'commercial': 'Commercial areas',
    'industrial': 'Industrial areas',
    'parking-area': 'Parking areas',
    'taxi-rank': 'Taxi ranks',
    'bus-stop': 'Bus stops',
    'shopping-center': 'Shopping centers',
    'hospital': 'Hospitals',
    'police-station': 'Police stations',
    'fire-station': 'Fire stations',
    'gas-station': 'Gas stations',
    'restaurant': 'Restaurants',
    'hotel': 'Hotels',
    'airport': 'Airports',
    'train-station': 'Train stations',
    'bus-terminal': 'Bus terminals'
  },
  
  // Vehicle Types
  vehicles: {
    'car': 'Cars',
    'truck': 'Trucks',
    'bus': 'Buses',
    'motorcycle': 'Motorcycles',
    'bicycle': 'Bicycles',
    'taxi': 'Taxis',
    'emergency-vehicle': 'Emergency vehicles',
    'construction-vehicle': 'Construction vehicles',
    'agricultural-vehicle': 'Agricultural vehicles'
  },
  
  // Conditions
  conditions: {
    'weather': 'Weather conditions',
    'construction': 'Construction zones',
    'emergency': 'Emergency situations',
    'hazard': 'Hazards',
    'maintenance': 'Maintenance work',
    'accident': 'Accident scenes',
    'breakdown': 'Vehicle breakdowns',
    'traffic-jam': 'Traffic jams',
    'road-closure': 'Road closures'
  },
  
  // Time of Day
  timeOfDay: {
    'day': 'Daytime',
    'night': 'Nighttime',
    'dawn': 'Dawn',
    'dusk': 'Dusk',
    'rush-hour': 'Rush hour'
  },
  
  // Weather Conditions
  weather: {
    'clear': 'Clear weather',
    'rain': 'Rainy weather',
    'fog': 'Foggy conditions',
    'snow': 'Snowy conditions',
    'ice': 'Icy conditions',
    'wind': 'Windy conditions',
    'storm': 'Stormy conditions'
  }
} as const;

// Helper function to get all available tags
export const getAllTags = (): string[] => {
  const tags: string[] = [];
  Object.values(IMAGE_TAGS).forEach(category => {
    Object.keys(category).forEach(tag => tags.push(tag));
  });
  return tags;
};

// Helper function to validate tags
export const isValidTag = (tag: string): boolean => {
  return getAllTags().includes(tag);
};

// Utility function to add tags to an image manually
export const addTagsToImage = (imageId: string, tags: string[]): void => {
  // This would typically update a database, but for now we'll just validate
  const validTags = tags.filter(tag => isValidTag(tag));
  console.log(`Adding tags to image ${imageId}:`, validTags);
};

// Utility function to get tag suggestions for an image
export const getTagSuggestions = (image: ImageAsset): string[] => {
  const generatedTags = generateImageTags(image);
  const suggestions: string[] = [];
  
  // Add generated tags as suggestions
  suggestions.push(...generatedTags);
  
  // Add category-specific suggestions
  if (image.description?.toLowerCase().includes('sign')) {
    suggestions.push('signs');
  }
  if (image.description?.toLowerCase().includes('control')) {
    suggestions.push('controls');
  }
  if (image.description?.toLowerCase().includes('scenario')) {
    suggestions.push('scenarios');
  }
  
  // Remove duplicates and return
  return [...new Set(suggestions)];
};

// Utility function to get all images that need manual tagging
export const getImagesNeedingTags = (): ImageAsset[] => {
  const allImages = Object.values(imageMapping).flat();
  return allImages.filter(image => !image.tags || image.tags.length === 0);
};

// Utility function to get tag statistics
export const getTagStatistics = (): { [tag: string]: number } => {
  const allImages = Object.values(imageMapping).flat();
  const stats: { [tag: string]: number } = {};
  
  allImages.forEach(image => {
    const tags = image.tags || generateImageTags(image);
    tags.forEach(tag => {
      stats[tag] = (stats[tag] || 0) + 1;
    });
  });
  
  return stats;
};

// Function to automatically generate tags for an image based on its description and context
export const generateImageTags = (image: {
  description?: string;
  context?: readonly string[];
  filename: string;
}): string[] => {
  const tags: string[] = [];
  const text = `${image.description || ''} ${image.filename || ''}`.toLowerCase();
  const context = image.context || [];

  // Sign type detection
  if (text.includes('no entry') || text.includes('prohibited') || text.includes('forbidden')) {
    tags.push('no-entry');
  }
  if (text.includes('stop') || text.includes('halt')) {
    tags.push('stop');
  }
  if (text.includes('yield') || text.includes('give way')) {
    tags.push('yield');
  }
  if (text.includes('speed') || text.includes('km/h') || text.includes('limit')) {
    tags.push('speed-limit');
  }
  if (text.includes('parking') && !text.includes('no parking')) {
    tags.push('parking');
  }
  if (text.includes('no parking')) {
    tags.push('no-parking');
  }
  if (text.includes('overtaking') || text.includes('passing')) {
    tags.push('overtaking');
  }
  if (text.includes('pedestrian') || text.includes('crossing')) {
    tags.push('pedestrian');
  }
  if (text.includes('school') || text.includes('children')) {
    tags.push('school');
  }
  if (text.includes('traffic light') || text.includes('signal')) {
    tags.push('traffic-light');
  }
  if (text.includes('one way') || text.includes('single direction')) {
    tags.push('one-way');
  }
  if (text.includes('roundabout') || text.includes('circle')) {
    tags.push('roundabout');
  }
  if (text.includes('emergency') || text.includes('ambulance') || text.includes('fire') || text.includes('police')) {
    tags.push('emergency');
  }
  if (text.includes('construction') || text.includes('road work') || text.includes('maintenance')) {
    tags.push('construction');
  }
  if (text.includes('weather') || text.includes('fog') || text.includes('rain') || text.includes('snow')) {
    tags.push('weather');
  }
  if (text.includes('time') || text.includes('hour') || text.includes('semana') || text.includes('sábado')) {
    tags.push('time-restriction');
  }
  if (text.includes('vehicle') || text.includes('truck') || text.includes('bus') || text.includes('motorcycle')) {
    tags.push('vehicle-type');
  }
  if (text.includes('weight') || text.includes('ton') || text.includes('load')) {
    tags.push('weight-limit');
  }
  if (text.includes('height') || text.includes('clearance')) {
    tags.push('height-limit');
  }
  if (text.includes('width') || text.includes('narrow')) {
    tags.push('width-limit');
  }
  if (text.includes('bridge') || text.includes('tunnel')) {
    tags.push('bridge');
  }
  if (text.includes('railway') || text.includes('train') || text.includes('level crossing')) {
    tags.push('railway');
  }
  if (text.includes('animal') || text.includes('cattle') || text.includes('wildlife')) {
    tags.push('animals');
  }
  if (text.includes('curve') || text.includes('bend') || text.includes('sharp')) {
    tags.push('sharp-curve');
  }
  if (text.includes('hill') || text.includes('steep') || text.includes('gradient')) {
    tags.push('steep-hill');
  }
  if (text.includes('slippery') || text.includes('wet') || text.includes('oil')) {
    tags.push('slippery');
  }
  if (text.includes('rocks') || text.includes('falling') || text.includes('debris')) {
    tags.push('falling-rocks');
  }
  if (text.includes('narrow') || text.includes('single lane')) {
    tags.push('narrow-road');
  }
  if (text.includes('two way') || text.includes('dual carriageway')) {
    tags.push('two-way');
  }
  if (text.includes('merge') || text.includes('lane ends')) {
    tags.push('merge');
  }
  if (text.includes('diverging') || text.includes('split')) {
    tags.push('diverging');
  }
  if (text.includes('t-intersection') || text.includes('t-junction')) {
    tags.push('t-intersection');
  }
  if (text.includes('y-intersection') || text.includes('y-junction')) {
    tags.push('y-intersection');
  }
  if (text.includes('priority') || text.includes('main road')) {
    tags.push('priority-road');
  }
  if (text.includes('dead end') || text.includes('no through road')) {
    tags.push('dead-end');
  }
  if (text.includes('cul de sac') || text.includes('no exit')) {
    tags.push('cul-de-sac');
  }
  if (text.includes('speed bump') || text.includes('hump') || text.includes('ramp')) {
    tags.push('speed-bump');
  }
  if (text.includes('speed camera') || text.includes('radar')) {
    tags.push('speed-camera');
  }
  if (text.includes('toll') || text.includes('payment')) {
    tags.push('toll');
  }
  if (text.includes('border') || text.includes('customs')) {
    tags.push('border');
  }
  if (text.includes('quarantine') || text.includes('inspection')) {
    tags.push('quarantine');
  }
  if (text.includes('weighbridge') || text.includes('weigh station')) {
    tags.push('weighbridge');
  }
  if (text.includes('inspection') || text.includes('checkpoint')) {
    tags.push('inspection');
  }

  // Context detection
  if (text.includes('urban') || text.includes('city') || context.includes('urban')) {
    tags.push('urban');
  }
  if (text.includes('highway') || text.includes('freeway') || context.includes('highway')) {
    tags.push('highway');
  }
  if (text.includes('rural') || text.includes('country') || text.includes('wilderness') || 
      text.includes('camp') || text.includes('kieliekrankie') || text.includes('farm') || 
      text.includes('nature') || text.includes('forest') || text.includes('mountain') || 
      context.includes('rural')) {
    tags.push('rural');
  }
  if (text.includes('intersection') || text.includes('junction') || context.includes('intersection')) {
    tags.push('intersection');
  }
  if (text.includes('school') || text.includes('children') || context.includes('school')) {
    tags.push('school-zone');
  }
  if (text.includes('residential') || text.includes('housing') || context.includes('residential')) {
    tags.push('residential');
  }
  if (text.includes('commercial') || text.includes('business') || context.includes('commercial')) {
    tags.push('commercial');
  }
  if (text.includes('industrial') || text.includes('factory') || context.includes('industrial')) {
    tags.push('industrial');
  }
  if (text.includes('parking') || text.includes('park') || context.includes('parking')) {
    tags.push('parking-area');
  }
  if (text.includes('taxi') || text.includes('rank') || context.includes('taxi')) {
    tags.push('taxi-rank');
  }
  if (text.includes('bus') || text.includes('stop') || context.includes('bus')) {
    tags.push('bus-stop');
  }
  if (text.includes('shopping') || text.includes('mall') || context.includes('shopping')) {
    tags.push('shopping-center');
  }
  if (text.includes('hospital') || text.includes('medical') || context.includes('hospital')) {
    tags.push('hospital');
  }
  if (text.includes('police') || text.includes('law') || context.includes('police')) {
    tags.push('police-station');
  }
  if (text.includes('fire') || text.includes('emergency') || context.includes('fire')) {
    tags.push('fire-station');
  }
  if (text.includes('gas') || text.includes('fuel') || context.includes('gas')) {
    tags.push('gas-station');
  }
  if (text.includes('restaurant') || text.includes('food') || context.includes('restaurant')) {
    tags.push('restaurant');
  }
  if (text.includes('hotel') || text.includes('accommodation') || context.includes('hotel')) {
    tags.push('hotel');
  }
  if (text.includes('airport') || text.includes('plane') || context.includes('airport')) {
    tags.push('airport');
  }
  if (text.includes('train') || text.includes('railway') || context.includes('train')) {
    tags.push('train-station');
  }
  if (text.includes('bus terminal') || text.includes('depot') || context.includes('bus')) {
    tags.push('bus-terminal');
  }

  // Vehicle type detection
  if (text.includes('car') || text.includes('automobile')) {
    tags.push('car');
  }
  if (text.includes('truck') || text.includes('lorry')) {
    tags.push('truck');
  }
  if (text.includes('bus') || text.includes('coach')) {
    tags.push('bus');
  }
  if (text.includes('motorcycle') || text.includes('bike')) {
    tags.push('motorcycle');
  }
  if (text.includes('bicycle') || text.includes('cycle')) {
    tags.push('bicycle');
  }
  if (text.includes('taxi') || text.includes('cab')) {
    tags.push('taxi');
  }
  if (text.includes('emergency') || text.includes('ambulance') || text.includes('fire') || text.includes('police')) {
    tags.push('emergency-vehicle');
  }
  if (text.includes('construction') || text.includes('excavator') || text.includes('bulldozer')) {
    tags.push('construction-vehicle');
  }
  if (text.includes('agricultural') || text.includes('tractor') || text.includes('farm')) {
    tags.push('agricultural-vehicle');
  }

  // Condition detection
  if (text.includes('weather') || text.includes('storm') || text.includes('fog')) {
    tags.push('weather');
  }
  if (text.includes('construction') || text.includes('work zone')) {
    tags.push('construction');
  }
  if (text.includes('emergency') || text.includes('accident')) {
    tags.push('emergency');
  }
  if (text.includes('hazard') || text.includes('danger')) {
    tags.push('hazard');
  }
  if (text.includes('maintenance') || text.includes('repair')) {
    tags.push('maintenance');
  }
  if (text.includes('accident') || text.includes('crash')) {
    tags.push('accident');
  }
  if (text.includes('breakdown') || text.includes('disabled')) {
    tags.push('breakdown');
  }
  if (text.includes('traffic jam') || text.includes('congestion')) {
    tags.push('traffic-jam');
  }
  if (text.includes('road closure') || text.includes('closed')) {
    tags.push('road-closure');
  }

  // Time of day detection
  if (text.includes('day') || text.includes('daytime')) {
    tags.push('day');
  }
  if (text.includes('night') || text.includes('nighttime')) {
    tags.push('night');
  }
  if (text.includes('dawn') || text.includes('sunrise')) {
    tags.push('dawn');
  }
  if (text.includes('dusk') || text.includes('sunset')) {
    tags.push('dusk');
  }
  if (text.includes('rush hour') || text.includes('peak')) {
    tags.push('rush-hour');
  }

  // Weather detection
  if (text.includes('clear') || text.includes('sunny')) {
    tags.push('clear');
  }
  if (text.includes('rain') || text.includes('rainy')) {
    tags.push('rain');
  }
  if (text.includes('fog') || text.includes('foggy')) {
    tags.push('fog');
  }
  if (text.includes('snow') || text.includes('snowy')) {
    tags.push('snow');
  }
  if (text.includes('ice') || text.includes('icy')) {
    tags.push('ice');
  }
  if (text.includes('wind') || text.includes('windy')) {
    tags.push('wind');
  }
  if (text.includes('storm') || text.includes('stormy')) {
    tags.push('storm');
  }

  // Remove duplicates and return
  return [...new Set(tags)];
};

// Tag-based image matching function that works with existing image data
export const getImagesByTags = (
  requiredTags: string[],
  category?: "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc"
): ImageAsset[] => {
  if (!requiredTags || requiredTags.length === 0) {
    return [];
  }

  // Get images from the specified category or all categories
  const images = category ? getImagesByCategory(category) : Object.values(imageMapping).flat();
  
  if (images.length === 0) {
    return [];
  }

  // Score each image based on tag matches
  const scoredImages = images.map(image => {
    let score = 0;
    const imageTags = image.tags || generateImageTags(image);
    
    // Check for exact tag matches with higher priority for specific signs
    for (const requiredTag of requiredTags) {
      if (imageTags.includes(requiredTag)) {
        // Give higher priority to specific sign types mentioned in scenario
        if (requiredTag === 'no-entry' || requiredTag === 'stop' || requiredTag === 'yield') {
          score += 20; // Very high score for specific sign matches
        } else {
          score += 10; // High score for other exact matches
        }
      }
    }
    
    // Check for partial matches in description and context
    const text = `${image.description || ''} ${image.filename || ''}`.toLowerCase();
    const context = image.context || [];
    
    for (const requiredTag of requiredTags) {
      if (text.includes(requiredTag.replace('-', ' '))) {
        // Give higher priority to specific sign types in text
        if (requiredTag === 'no-entry' || requiredTag === 'stop' || requiredTag === 'yield') {
          score += 10; // Higher score for specific sign text matches
        } else {
          score += 5; // Medium score for other text matches
        }
      }
      if (context.some(ctx => ctx.toLowerCase().includes(requiredTag.replace('-', ' ')))) {
        score += 3; // Lower score for context matches
      }
    }
    
    return { image, score };
  });

  // Filter images with at least one match and sort by score
  const matchingImages = scoredImages
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.image);

  return matchingImages.slice(0, 5); // Return top 5 matches
};

// Enhanced scenario matching using tag-based approach with context validation
export const getScenarioMatchingImagesByTags = (
  scenario: {
    title: string;
    scenario: string;
    question: string;
    category: "controls" | "signs" | "rules" | "mixed";
    context?: string;
    difficulty?: "basic" | "intermediate" | "advanced";
  }
): ImageAsset[] => {
  if (!scenario) {
    return [];
  }

  // Combine all text content for analysis
  const allText = `${scenario.title} ${scenario.scenario} ${scenario.question}`.toLowerCase();
  
  // Extract required tags from scenario text
  const requiredTags: string[] = [];
  
  // Context detection for better filtering
  const isUrban = allText.includes('cbd') || allText.includes('city') || allText.includes('urban') || 
                  allText.includes('johannesburg') || allText.includes('pretoria') || allText.includes('cape town') ||
                  allText.includes('taxi') || allText.includes('traffic') || allText.includes('intersection');
  
  const isHighway = allText.includes('highway') || allText.includes('freeway') || allText.includes('motorway') ||
                   allText.includes('n1') || allText.includes('n2') || allText.includes('n3') || allText.includes('n4');
  
  const isRural = allText.includes('rural') || allText.includes('farm') || allText.includes('countryside') ||
                 allText.includes('wilderness') || allText.includes('camp') || allText.includes('nature') ||
                 allText.includes('kieliekrankie') || allText.includes('forest') || allText.includes('mountain');
  
  // Sign type detection with context validation - prioritize specific signs mentioned
  if (allText.includes('no entry') || allText.includes('prohibited') || allText.includes('forbidden')) {
    requiredTags.push('no-entry');
  }
  if (allText.includes('stop') || allText.includes('halt')) {
    requiredTags.push('stop');
  }
  if (allText.includes('yield') || allText.includes('give way')) {
    requiredTags.push('yield');
  }
  if (allText.includes('speed') || allText.includes('km/h') || allText.includes('limit')) {
    requiredTags.push('speed-limit');
  }
  if (allText.includes('parking') && !allText.includes('no parking')) {
    requiredTags.push('parking');
  }
  if (allText.includes('no parking')) {
    requiredTags.push('no-parking');
  }
  if (allText.includes('overtaking') || allText.includes('passing')) {
    requiredTags.push('overtaking');
  }
  if (allText.includes('pedestrian') || allText.includes('crossing')) {
    requiredTags.push('pedestrian');
  }
  if (allText.includes('school') || allText.includes('children')) {
    requiredTags.push('school');
  }
  if (allText.includes('traffic light') || allText.includes('signal')) {
    requiredTags.push('traffic-light');
  }
  if (allText.includes('one way') || allText.includes('single direction')) {
    requiredTags.push('one-way');
  }
  if (allText.includes('roundabout') || allText.includes('circle')) {
    requiredTags.push('roundabout');
  }
  if (allText.includes('emergency') || allText.includes('ambulance') || allText.includes('fire') || allText.includes('police')) {
    requiredTags.push('emergency');
  }
  if (allText.includes('construction') || allText.includes('road work') || allText.includes('maintenance')) {
    requiredTags.push('construction');
  }
  if (allText.includes('weather') || allText.includes('fog') || allText.includes('rain') || allText.includes('snow')) {
    requiredTags.push('weather');
  }
  if (allText.includes('time') || allText.includes('hour') || allText.includes('semana') || allText.includes('sábado')) {
    requiredTags.push('time-restriction');
  }
  if (allText.includes('vehicle') || allText.includes('truck') || allText.includes('bus') || allText.includes('motorcycle')) {
    requiredTags.push('vehicle-type');
  }
  if (allText.includes('weight') || allText.includes('ton') || allText.includes('load')) {
    requiredTags.push('weight-limit');
  }
  if (allText.includes('height') || allText.includes('clearance')) {
    requiredTags.push('height-limit');
  }
  if (allText.includes('width') || allText.includes('narrow')) {
    requiredTags.push('width-limit');
  }
  if (allText.includes('bridge') || allText.includes('tunnel')) {
    requiredTags.push('bridge');
  }
  if (allText.includes('railway') || allText.includes('train') || allText.includes('level crossing')) {
    requiredTags.push('railway');
  }
  if (allText.includes('animal') || allText.includes('cattle') || allText.includes('wildlife')) {
    requiredTags.push('animals');
  }
  if (allText.includes('curve') || allText.includes('bend') || allText.includes('sharp')) {
    requiredTags.push('sharp-curve');
  }
  if (allText.includes('hill') || allText.includes('steep') || allText.includes('gradient')) {
    requiredTags.push('steep-hill');
  }
  if (allText.includes('slippery') || allText.includes('wet') || allText.includes('oil')) {
    requiredTags.push('slippery');
  }
  if (allText.includes('rocks') || allText.includes('falling') || allText.includes('debris')) {
    requiredTags.push('falling-rocks');
  }
  if (allText.includes('narrow') || allText.includes('single lane')) {
    requiredTags.push('narrow-road');
  }
  if (allText.includes('two way') || allText.includes('dual carriageway')) {
    requiredTags.push('two-way');
  }
  if (allText.includes('merge') || allText.includes('lane ends')) {
    requiredTags.push('merge');
  }
  if (allText.includes('diverging') || allText.includes('split')) {
    requiredTags.push('diverging');
  }
  if (allText.includes('t-intersection') || allText.includes('t-junction')) {
    requiredTags.push('t-intersection');
  }
  if (allText.includes('y-intersection') || allText.includes('y-junction')) {
    requiredTags.push('y-intersection');
  }
  if (allText.includes('priority') || allText.includes('main road')) {
    requiredTags.push('priority-road');
  }
  if (allText.includes('dead end') || allText.includes('no through road')) {
    requiredTags.push('dead-end');
  }
  if (allText.includes('cul de sac') || allText.includes('no exit')) {
    requiredTags.push('cul-de-sac');
  }
  if (allText.includes('speed bump') || allText.includes('hump') || allText.includes('ramp')) {
    requiredTags.push('speed-bump');
  }
  if (allText.includes('speed camera') || allText.includes('radar')) {
    requiredTags.push('speed-camera');
  }
  if (allText.includes('toll') || allText.includes('payment')) {
    requiredTags.push('toll');
  }
  if (allText.includes('border') || allText.includes('customs')) {
    requiredTags.push('border');
  }
  if (allText.includes('quarantine') || allText.includes('inspection')) {
    requiredTags.push('quarantine');
  }
  if (allText.includes('weighbridge') || allText.includes('weigh station')) {
    requiredTags.push('weighbridge');
  }
  if (allText.includes('inspection') || allText.includes('checkpoint')) {
    requiredTags.push('inspection');
  }

  // Context detection
  if (allText.includes('urban') || allText.includes('city')) {
    requiredTags.push('urban');
  }
  if (allText.includes('highway') || allText.includes('freeway')) {
    requiredTags.push('highway');
  }
  if (allText.includes('rural') || allText.includes('country')) {
    requiredTags.push('rural');
  }
  if (allText.includes('intersection') || allText.includes('junction')) {
    requiredTags.push('intersection');
  }
  if (allText.includes('school') || allText.includes('children')) {
    requiredTags.push('school-zone');
  }
  if (allText.includes('residential') || allText.includes('housing')) {
    requiredTags.push('residential');
  }
  if (allText.includes('commercial') || allText.includes('business')) {
    requiredTags.push('commercial');
  }
  if (allText.includes('industrial') || allText.includes('factory')) {
    requiredTags.push('industrial');
  }
  if (allText.includes('parking') || allText.includes('park')) {
    requiredTags.push('parking-area');
  }
  if (allText.includes('taxi') || allText.includes('rank')) {
    requiredTags.push('taxi-rank');
  }
  if (allText.includes('bus') || allText.includes('stop')) {
    requiredTags.push('bus-stop');
  }
  if (allText.includes('shopping') || allText.includes('mall')) {
    requiredTags.push('shopping-center');
  }
  if (allText.includes('hospital') || allText.includes('medical')) {
    requiredTags.push('hospital');
  }
  if (allText.includes('police') || allText.includes('law')) {
    requiredTags.push('police-station');
  }
  if (allText.includes('fire') || allText.includes('emergency')) {
    requiredTags.push('fire-station');
  }
  if (allText.includes('gas') || allText.includes('fuel')) {
    requiredTags.push('gas-station');
  }
  if (allText.includes('restaurant') || allText.includes('food')) {
    requiredTags.push('restaurant');
  }
  if (allText.includes('hotel') || allText.includes('accommodation')) {
    requiredTags.push('hotel');
  }
  if (allText.includes('airport') || allText.includes('plane')) {
    requiredTags.push('airport');
  }
  if (allText.includes('train') || allText.includes('railway')) {
    requiredTags.push('train-station');
  }
  if (allText.includes('bus terminal') || allText.includes('depot')) {
    requiredTags.push('bus-terminal');
  }

  // If no specific tags found, try broader context matching
  if (requiredTags.length === 0) {
    const category = scenario.category === "mixed" ? "signs" : scenario.category;
    const mappedCategory = category === "rules" ? "signs" : category;
    const allImages = getImagesByCategory(mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc");
    
    // Return a few random images from the category as fallback
    return allImages.slice(0, 3);
  }

  // Get images matching the required tags
  const category = scenario.category === "mixed" ? "signs" : scenario.category;
  const mappedCategory = category === "rules" ? "signs" : category;
  
  let matchingImages = getImagesByTags(requiredTags, mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc");
  
  // If "No Entry" is specifically mentioned, prioritize those images
  if (requiredTags.includes('no-entry')) {
    const noEntryImages = matchingImages.filter(image => {
      const imageTags = image.tags || generateImageTags(image);
      return imageTags.includes('no-entry');
    });
    
    if (noEntryImages.length > 0) {
      // Put No Entry images first, then other matching images
      const otherImages = matchingImages.filter(image => {
        const imageTags = image.tags || generateImageTags(image);
        return !imageTags.includes('no-entry');
      });
      matchingImages = [...noEntryImages, ...otherImages];
    }
  }
  
  // Apply context filtering to ensure images match the scenario context
  if (matchingImages.length > 0) {
    matchingImages = matchingImages.filter(image => {
      const imageText = `${image.description || ''} ${image.filename || ''}`.toLowerCase();
      const imageContext = image.context || [];
      const imageTags = image.tags || generateImageTags(image);
      
      // Filter out rural/wilderness images for urban scenarios
      if (isUrban) {
        const ruralKeywords = ['wilderness', 'camp', 'farm', 'rural', 'countryside', 'nature', 'forest', 'mountain', 'kieliekrankie'];
        if (ruralKeywords.some(keyword => 
          imageText.includes(keyword) || 
          imageContext.some(ctx => ctx.toLowerCase().includes(keyword)) ||
          imageTags.includes('rural')
        )) {
          return false;
        }
      }
      
      // Filter out urban images for rural scenarios
      if (isRural) {
        const urbanKeywords = ['cbd', 'city', 'urban', 'taxi', 'traffic', 'intersection', 'building', 'street'];
        if (urbanKeywords.some(keyword => 
          imageText.includes(keyword) || 
          imageContext.some(ctx => ctx.toLowerCase().includes(keyword)) ||
          imageTags.includes('urban')
        )) {
          return false;
        }
      }
      
      // Filter out rural images for highway scenarios
      if (isHighway) {
        const ruralKeywords = ['wilderness', 'camp', 'farm', 'rural', 'countryside', 'kieliekrankie'];
        if (ruralKeywords.some(keyword => 
          imageText.includes(keyword) || 
          imageContext.some(ctx => ctx.toLowerCase().includes(keyword)) ||
          imageTags.includes('rural')
        )) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  // If no context-filtered images found, return original matches
  if (matchingImages.length === 0) {
    matchingImages = getImagesByTags(requiredTags, mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc");
  }
  
  return matchingImages;
};

export const imageMapping: Record<string, ImageAsset[]> = {
  "signs": [
    {
      "filename": "1066px-SADC_road_sign_W409.svg.png",
      "path": "/images/signs/1066px-SADC_road_sign_W409.svg.png",
      "id": "1066px-SADC-road-sign-W409-svg",
      "description": "South African road sign - 1066px-SADC_road_sign_W409.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "1066px-SADC_road_sign_W410.svg.png",
      "path": "/images/signs/1066px-SADC_road_sign_W410.svg.png",
      "id": "1066px-SADC-road-sign-W410-svg",
      "description": "South African road sign - 1066px-SADC_road_sign_W410.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "1078px-SADC_road_sign_TW409.svg.png",
      "path": "/images/signs/1078px-SADC_road_sign_TW409.svg.png",
      "id": "1078px-SADC-road-sign-TW409-svg",
      "description": "South African road sign - 1078px-SADC_road_sign_TW409.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "1078px-SADC_road_sign_TW410.svg.png",
      "path": "/images/signs/1078px-SADC_road_sign_TW410.svg.png",
      "id": "1078px-SADC-road-sign-TW410-svg",
      "description": "South African road sign - 1078px-SADC_road_sign_TW410.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_GDLS_A1-6.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_GDLS_A1-6.svg.png",
      "id": "120px-SADC-road-sign-GDLS-A1-6-svg",
      "description": "South African road sign - GDLS_A1-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_GDLS_A2-1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_GDLS_A2-1.svg.png",
      "id": "120px-SADC-road-sign-GDLS-A2-1-svg",
      "description": "South African road sign - GDLS_A2-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1-RHT_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1-RHT_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN1-RHT--Class-A1--svg",
      "description": "South African road sign - IN1-RHT_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1-RHT_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1-RHT_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN1-RHT--Class-A2--svg",
      "description": "South African road sign - IN1-RHT_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1-RHT_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1-RHT_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN1-RHT--Tourism--svg",
      "description": "South African road sign - IN1-RHT_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN1--Class-A1--svg",
      "description": "South African road sign - IN1_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN1--Class-A2--svg",
      "description": "South African road sign - IN1_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN1_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN1_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN1--Tourism--svg",
      "description": "South African road sign - IN1_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2-RHT_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2-RHT_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN2-RHT--Class-A1--svg",
      "description": "South African road sign - IN2-RHT_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2-RHT_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2-RHT_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN2-RHT--Class-A2--svg",
      "description": "South African road sign - IN2-RHT_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2-RHT_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2-RHT_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN2-RHT--Tourism--svg",
      "description": "South African road sign - IN2-RHT_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN2--Class-A1--svg",
      "description": "South African road sign - IN2_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN2--Class-A2--svg",
      "description": "South African road sign - IN2_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN2_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN2_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN2--Tourism--svg",
      "description": "South African road sign - IN2_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3-RHT_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3-RHT_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN3-RHT--Class-A1--svg",
      "description": "South African road sign - IN3-RHT_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3-RHT_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3-RHT_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN3-RHT--Class-A2--svg",
      "description": "South African road sign - IN3-RHT_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3-RHT_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3-RHT_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN3-RHT--Tourism--svg",
      "description": "South African road sign - IN3-RHT_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3_(Class_A1).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3_(Class_A1).svg.png",
      "id": "120px-SADC-road-sign-IN3--Class-A1--svg",
      "description": "South African road sign - IN3_(Class_A1).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3_(Class_A2).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3_(Class_A2).svg.png",
      "id": "120px-SADC-road-sign-IN3--Class-A2--svg",
      "description": "South African road sign - IN3_(Class_A2).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_IN3_(Tourism).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_IN3_(Tourism).svg.png",
      "id": "120px-SADC-road-sign-IN3--Tourism--svg",
      "description": "South African road sign - IN3_(Tourism).svg",
      "context": ["information","tourism"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_Muster-Sign_11.jpg",
      "path": "/images/signs/120px-SADC_road_sign_Muster-Sign_11.jpg",
      "id": "120px-SADC-road-sign-Muster-Sign-11",
      "description": "South African road sign - Muster-Sign_11",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R1.1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R1.1.svg.png",
      "id": "120px-SADC-road-sign-R1-1-svg",
      "description": "South African road sign - R1.1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R1.2-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R1.2-RHT.svg.png",
      "id": "120px-SADC-road-sign-R1-2-RHT-svg",
      "description": "South African road sign - R1.2-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R1.2.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R1.2.svg.png",
      "id": "120px-SADC-road-sign-R1-2-svg",
      "description": "South African road sign - R1.2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R108–R569-B.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R108–R569-B.svg.png",
      "id": "120px-SADC-road-sign-R108-R569-B-svg",
      "description": "South African road sign - R108–R569-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R2.1_(Pedestrians_and_Equestrians).svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R2.1_(Pedestrians_and_Equestrians).svg.png",
      "id": "120px-SADC-road-sign-R2-1--Pedestrians-and-Equestrians--svg",
      "description": "South African road sign - R2.1_(Pedestrians_and_Equestrians).svg",
      "context": ["regulatory","pedestrian"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R201-100-R512.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R201-100-R512.svg.png",
      "id": "120px-SADC-road-sign-R201-100-R512-svg",
      "description": "South African road sign - R201-100-R512.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R201-120-R511.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R201-120-R511.svg.png",
      "id": "120px-SADC-road-sign-R201-120-R511-svg",
      "description": "South African road sign - R201-120-R511.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R306-P–R503-B.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R306-P–R503-B.svg.png",
      "id": "120px-SADC-road-sign-R306-P-R503-B-svg",
      "description": "South African road sign - R306-P–R503-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R325-1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R325-1.svg.png",
      "id": "120px-SADC-road-sign-R325-1-svg",
      "description": "South African road sign - R325-1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R325-2.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R325-2.svg.png",
      "id": "120px-SADC-road-sign-R325-2-svg",
      "description": "South African road sign - R325-2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R325-3.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R325-3.svg.png",
      "id": "120px-SADC-road-sign-R325-3-svg",
      "description": "South African road sign - R325-3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R325-4.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R325-4.svg.png",
      "id": "120px-SADC-road-sign-R325-4-svg",
      "description": "South African road sign - R325-4.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-1-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-1-RHT.svg.png",
      "id": "120px-SADC-road-sign-R326-1-RHT-svg",
      "description": "South African road sign - R326-1-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-1.svg.png",
      "id": "120px-SADC-road-sign-R326-1-svg",
      "description": "South African road sign - R326-1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-2-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-2-RHT.svg.png",
      "id": "120px-SADC-road-sign-R326-2-RHT-svg",
      "description": "South African road sign - R326-2-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-2.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-2.svg.png",
      "id": "120px-SADC-road-sign-R326-2-svg",
      "description": "South African road sign - R326-2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-3-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-3-RHT.svg.png",
      "id": "120px-SADC-road-sign-R326-3-RHT-svg",
      "description": "South African road sign - R326-3-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-3.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-3.svg.png",
      "id": "120px-SADC-road-sign-R326-3-svg",
      "description": "South African road sign - R326-3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-4-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-4-RHT.svg.png",
      "id": "120px-SADC-road-sign-R326-4-RHT-svg",
      "description": "South African road sign - R326-4-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R326-4.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R326-4.svg.png",
      "id": "120px-SADC-road-sign-R326-4-svg",
      "description": "South African road sign - R326-4.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R333-P.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R333-P.svg.png",
      "id": "120px-SADC-road-sign-R333-P-svg",
      "description": "South African road sign - R333-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R333.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R333.svg.png",
      "id": "120px-SADC-road-sign-R333-svg",
      "description": "South African road sign - R333.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R334.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R334.svg.png",
      "id": "120px-SADC-road-sign-R334-svg",
      "description": "South African road sign - R334.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R335.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R335.svg.png",
      "id": "120px-SADC-road-sign-R335-svg",
      "description": "South African road sign - R335.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R341-1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R341-1.svg.png",
      "id": "120px-SADC-road-sign-R341-1-svg",
      "description": "South African road sign - R341-1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R341-2.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R341-2.svg.png",
      "id": "120px-SADC-road-sign-R341-2-svg",
      "description": "South African road sign - R341-2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R341-3.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R341-3.svg.png",
      "id": "120px-SADC-road-sign-R341-3-svg",
      "description": "South African road sign - R341-3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R345.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R345.svg.png",
      "id": "120px-SADC-road-sign-R345-svg",
      "description": "South African road sign - R345.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R346.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R346.svg.png",
      "id": "120px-SADC-road-sign-R346-svg",
      "description": "South African road sign - R346.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R347.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R347.svg.png",
      "id": "120px-SADC-road-sign-R347-svg",
      "description": "South African road sign - R347.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_R351.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_R351.svg.png",
      "id": "120px-SADC-road-sign-R351-svg",
      "description": "South African road sign - R351.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TGD3-D.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TGD3-D.svg.png",
      "id": "120px-SADC-road-sign-TGD3-D-svg",
      "description": "South African road sign - TGD3-D.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN1-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN1-RHT.svg.png",
      "id": "120px-SADC-road-sign-TIN1-RHT-svg",
      "description": "South African road sign - TIN1-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN1.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN1.svg.png",
      "id": "120px-SADC-road-sign-TIN1-svg",
      "description": "South African road sign - TIN1.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN2-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN2-RHT.svg.png",
      "id": "120px-SADC-road-sign-TIN2-RHT-svg",
      "description": "South African road sign - TIN2-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN2.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN2.svg.png",
      "id": "120px-SADC-road-sign-TIN2-svg",
      "description": "South African road sign - TIN2.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN3-RHT.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN3-RHT.svg.png",
      "id": "120px-SADC-road-sign-TIN3-RHT-svg",
      "description": "South African road sign - TIN3-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TIN3.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TIN3.svg.png",
      "id": "120px-SADC-road-sign-TIN3-svg",
      "description": "South African road sign - TIN3.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR108–TR569-B.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR108–TR569-B.svg.png",
      "id": "120px-SADC-road-sign-TR108-TR569-B-svg",
      "description": "South African road sign - TR108–TR569-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR201-100-TR512.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR201-100-TR512.svg.png",
      "id": "120px-SADC-road-sign-TR201-100-TR512-svg",
      "description": "South African road sign - TR201-100-TR512.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR201-120-TR511.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR201-120-TR511.svg.png",
      "id": "120px-SADC-road-sign-TR201-120-TR511-svg",
      "description": "South African road sign - TR201-120-TR511.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR216–TR502.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR216–TR502.svg.png",
      "id": "120px-SADC-road-sign-TR216-TR502-svg",
      "description": "South African road sign - TR216–TR502.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR306-P–TR503-B.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR306-P–TR503-B.svg.png",
      "id": "120px-SADC-road-sign-TR306-P-TR503-B-svg",
      "description": "South African road sign - TR306-P–TR503-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR333-P.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR333-P.svg.png",
      "id": "120px-SADC-road-sign-TR333-P-svg",
      "description": "South African road sign - TR333-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR333.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR333.svg.png",
      "id": "120px-SADC-road-sign-TR333-svg",
      "description": "South African road sign - TR333.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR334.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR334.svg.png",
      "id": "120px-SADC-road-sign-TR334-svg",
      "description": "South African road sign - TR334.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR335.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR335.svg.png",
      "id": "120px-SADC-road-sign-TR335-svg",
      "description": "South African road sign - TR335.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR345.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR345.svg.png",
      "id": "120px-SADC-road-sign-TR345-svg",
      "description": "South African road sign - TR345.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR346.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR346.svg.png",
      "id": "120px-SADC-road-sign-TR346-svg",
      "description": "South African road sign - TR346.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR347.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR347.svg.png",
      "id": "120px-SADC-road-sign-TR347-svg",
      "description": "South African road sign - TR347.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TR351.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TR351.svg.png",
      "id": "120px-SADC-road-sign-TR351-svg",
      "description": "South African road sign - TR351.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_TW413.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_TW413.svg.png",
      "id": "120px-SADC-road-sign-TW413-svg",
      "description": "South African road sign - TW413.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SADC_road_sign_W413.svg.png",
      "path": "/images/signs/120px-SADC_road_sign_W413.svg.png",
      "id": "120px-SADC-road-sign-W413-svg",
      "description": "South African road sign - W413.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M1.svg.png",
      "path": "/images/signs/120px-SA_road_M1.svg.png",
      "id": "120px-SA-road-M1-svg",
      "description": "South African road marker - M1.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M10.svg.png",
      "path": "/images/signs/120px-SA_road_M10.svg.png",
      "id": "120px-SA-road-M10-svg",
      "description": "South African road marker - M10.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M100.svg.png",
      "path": "/images/signs/120px-SA_road_M100.svg.png",
      "id": "120px-SA-road-M100-svg",
      "description": "South African road marker - M100.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M11.svg.png",
      "path": "/images/signs/120px-SA_road_M11.svg.png",
      "id": "120px-SA-road-M11-svg",
      "description": "South African road marker - M11.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M12.svg.png",
      "path": "/images/signs/120px-SA_road_M12.svg.png",
      "id": "120px-SA-road-M12-svg",
      "description": "South African road marker - M12.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M13.svg.png",
      "path": "/images/signs/120px-SA_road_M13.svg.png",
      "id": "120px-SA-road-M13-svg",
      "description": "South African road marker - M13.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M14.svg.png",
      "path": "/images/signs/120px-SA_road_M14.svg.png",
      "id": "120px-SA-road-M14-svg",
      "description": "South African road marker - M14.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M15.svg.png",
      "path": "/images/signs/120px-SA_road_M15.svg.png",
      "id": "120px-SA-road-M15-svg",
      "description": "South African road marker - M15.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M152.svg.png",
      "path": "/images/signs/120px-SA_road_M152.svg.png",
      "id": "120px-SA-road-M152-svg",
      "description": "South African road marker - M152.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M16.svg.png",
      "path": "/images/signs/120px-SA_road_M16.svg.png",
      "id": "120px-SA-road-M16-svg",
      "description": "South African road marker - M16.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M17.svg.png",
      "path": "/images/signs/120px-SA_road_M17.svg.png",
      "id": "120px-SA-road-M17-svg",
      "description": "South African road marker - M17.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M18.svg.png",
      "path": "/images/signs/120px-SA_road_M18.svg.png",
      "id": "120px-SA-road-M18-svg",
      "description": "South African road marker - M18.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M19.svg.png",
      "path": "/images/signs/120px-SA_road_M19.svg.png",
      "id": "120px-SA-road-M19-svg",
      "description": "South African road marker - M19.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M2.svg.png",
      "path": "/images/signs/120px-SA_road_M2.svg.png",
      "id": "120px-SA-road-M2-svg",
      "description": "South African road marker - M2.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M20.svg.png",
      "path": "/images/signs/120px-SA_road_M20.svg.png",
      "id": "120px-SA-road-M20-svg",
      "description": "South African road marker - M20.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M21.svg.png",
      "path": "/images/signs/120px-SA_road_M21.svg.png",
      "id": "120px-SA-road-M21-svg",
      "description": "South African road marker - M21.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M22.svg.png",
      "path": "/images/signs/120px-SA_road_M22.svg.png",
      "id": "120px-SA-road-M22-svg",
      "description": "South African road marker - M22.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M23.svg.png",
      "path": "/images/signs/120px-SA_road_M23.svg.png",
      "id": "120px-SA-road-M23-svg",
      "description": "South African road marker - M23.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M24.svg.png",
      "path": "/images/signs/120px-SA_road_M24.svg.png",
      "id": "120px-SA-road-M24-svg",
      "description": "South African road marker - M24.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M25.svg.png",
      "path": "/images/signs/120px-SA_road_M25.svg.png",
      "id": "120px-SA-road-M25-svg",
      "description": "South African road marker - M25.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M26.svg.png",
      "path": "/images/signs/120px-SA_road_M26.svg.png",
      "id": "120px-SA-road-M26-svg",
      "description": "South African road marker - M26.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M27.svg.png",
      "path": "/images/signs/120px-SA_road_M27.svg.png",
      "id": "120px-SA-road-M27-svg",
      "description": "South African road marker - M27.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M28.svg.png",
      "path": "/images/signs/120px-SA_road_M28.svg.png",
      "id": "120px-SA-road-M28-svg",
      "description": "South African road marker - M28.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M29.svg.png",
      "path": "/images/signs/120px-SA_road_M29.svg.png",
      "id": "120px-SA-road-M29-svg",
      "description": "South African road marker - M29.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M3.svg.png",
      "path": "/images/signs/120px-SA_road_M3.svg.png",
      "id": "120px-SA-road-M3-svg",
      "description": "South African road marker - M3.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M30.svg.png",
      "path": "/images/signs/120px-SA_road_M30.svg.png",
      "id": "120px-SA-road-M30-svg",
      "description": "South African road marker - M30.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M31.svg.png",
      "path": "/images/signs/120px-SA_road_M31.svg.png",
      "id": "120px-SA-road-M31-svg",
      "description": "South African road marker - M31.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M33.svg.png",
      "path": "/images/signs/120px-SA_road_M33.svg.png",
      "id": "120px-SA-road-M33-svg",
      "description": "South African road marker - M33.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M34.svg.png",
      "path": "/images/signs/120px-SA_road_M34.svg.png",
      "id": "120px-SA-road-M34-svg",
      "description": "South African road marker - M34.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M35.svg.png",
      "path": "/images/signs/120px-SA_road_M35.svg.png",
      "id": "120px-SA-road-M35-svg",
      "description": "South African road marker - M35.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M36.svg.png",
      "path": "/images/signs/120px-SA_road_M36.svg.png",
      "id": "120px-SA-road-M36-svg",
      "description": "South African road marker - M36.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M37.svg.png",
      "path": "/images/signs/120px-SA_road_M37.svg.png",
      "id": "120px-SA-road-M37-svg",
      "description": "South African road marker - M37.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M39.svg.png",
      "path": "/images/signs/120px-SA_road_M39.svg.png",
      "id": "120px-SA-road-M39-svg",
      "description": "South African road marker - M39.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M4.svg.png",
      "path": "/images/signs/120px-SA_road_M4.svg.png",
      "id": "120px-SA-road-M4-svg",
      "description": "South African road marker - M4.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M42.svg.png",
      "path": "/images/signs/120px-SA_road_M42.svg.png",
      "id": "120px-SA-road-M42-svg",
      "description": "South African road marker - M42.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M5.svg.png",
      "path": "/images/signs/120px-SA_road_M5.svg.png",
      "id": "120px-SA-road-M5-svg",
      "description": "South African road marker - M5.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M54.svg.png",
      "path": "/images/signs/120px-SA_road_M54.svg.png",
      "id": "120px-SA-road-M54-svg",
      "description": "South African road marker - M54.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M56.svg.png",
      "path": "/images/signs/120px-SA_road_M56.svg.png",
      "id": "120px-SA-road-M56-svg",
      "description": "South African road marker - M56.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M62.svg.png",
      "path": "/images/signs/120px-SA_road_M62.svg.png",
      "id": "120px-SA-road-M62-svg",
      "description": "South African road marker - M62.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M65.svg.png",
      "path": "/images/signs/120px-SA_road_M65.svg.png",
      "id": "120px-SA-road-M65-svg",
      "description": "South African road marker - M65.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M7.svg.png",
      "path": "/images/signs/120px-SA_road_M7.svg.png",
      "id": "120px-SA-road-M7-svg",
      "description": "South African road marker - M7.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M77.svg.png",
      "path": "/images/signs/120px-SA_road_M77.svg.png",
      "id": "120px-SA-road-M77-svg",
      "description": "South African road marker - M77.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M8.svg.png",
      "path": "/images/signs/120px-SA_road_M8.svg.png",
      "id": "120px-SA-road-M8-svg",
      "description": "South African road marker - M8.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-SA_road_M9.svg.png",
      "path": "/images/signs/120px-SA_road_M9.svg.png",
      "id": "120px-SA-road-M9-svg",
      "description": "South African road marker - M9.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-South_Africa-Tollroad_SOS_Phone01.jpg",
      "path": "/images/signs/120px-South_Africa-Tollroad_SOS_Phone01.jpg",
      "id": "120px-South-Africa-Tollroad-SOS-Phone01",
      "description": "Toll road information",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "1506px-SADC_road_sign_TW411.svg.png",
      "path": "/images/signs/1506px-SADC_road_sign_TW411.svg.png",
      "id": "1506px-SADC-road-sign-TW411-svg",
      "description": "South African road sign - 1506px-SADC_road_sign_TW411.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-A_model_of_South_African_road.jpg",
      "path": "/images/signs/250px-A_model_of_South_African_road.jpg",
      "id": "250px-A-model-of-South-African-road",
      "description": "K53 driving content - 250px-A_model_of_South_African_road",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Bloemsign124.jpg",
      "path": "/images/signs/250px-Bloemsign124.jpg",
      "id": "250px-Bloemsign124",
      "description": "K53 driving content - 250px-Bloemsign124",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Botswana_road_sign_-_No_Entry.svg.png",
      "path": "/images/signs/250px-Botswana_road_sign_-_No_Entry.svg.png",
      "id": "250px-Botswana-road-sign---No-Entry-svg",
      "description": "K53 driving content - 250px-Botswana_road_sign_-_No_Entry.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Botswana_road_sign_-_Railroad_Crossbuck_(old).svg.png",
      "path": "/images/signs/250px-Botswana_road_sign_-_Railroad_Crossbuck_(old).svg.png",
      "id": "250px-Botswana-road-sign---Railroad-Crossbuck--old--svg",
      "description": "K53 driving content - 250px-Botswana_road_sign_-_Railroad_Crossbuck_(old).svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Golelabordersign.jpg",
      "path": "/images/signs/250px-Golelabordersign.jpg",
      "id": "250px-Golelabordersign",
      "description": "K53 driving content - 250px-Golelabordersign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Hippo_Warning_on_the_road_to_Kruger_NP_..._(11410673314).jpg",
      "path": "/images/signs/250px-Hippo_Warning_on_the_road_to_Kruger_NP_..._(11410673314).jpg",
      "id": "250px-Hippo-Warning-on-the-road-to-Kruger-NP------11410673314-",
      "description": "K53 driving content - 250px-Hippo_Warning_on_the_road_to_Kruger_NP_..._(11410673314)",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Joburgsign1844.jpg",
      "path": "/images/signs/250px-Joburgsign1844.jpg",
      "id": "250px-Joburgsign1844",
      "description": "K53 driving content - 250px-Joburgsign1844",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Joburgsignbeaufortwes2.jpg",
      "path": "/images/signs/250px-Joburgsignbeaufortwes2.jpg",
      "id": "250px-Joburgsignbeaufortwes2",
      "description": "K53 driving content - 250px-Joburgsignbeaufortwes2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Joburg_road_M58.svg.png",
      "path": "/images/signs/250px-Joburg_road_M58.svg.png",
      "id": "250px-Joburg-road-M58-svg",
      "description": "K53 driving content - 250px-Joburg_road_M58.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Kieliekrankie_access_road_sign_..._(50893294156).jpg",
      "path": "/images/signs/250px-Kieliekrankie_access_road_sign_..._(50893294156).jpg",
      "id": "250px-Kieliekrankie-access-road-sign------50893294156-",
      "description": "K53 driving content - 250px-Kieliekrankie_access_road_sign_..._(50893294156)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-N1roadsouthboundatmidrand.jpg",
      "path": "/images/signs/250px-N1roadsouthboundatmidrand.jpg",
      "id": "250px-N1roadsouthboundatmidrand",
      "description": "K53 driving content - 250px-N1roadsouthboundatmidrand",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-N1roadwestboundintocapetown.jpg",
      "path": "/images/signs/250px-N1roadwestboundintocapetown.jpg",
      "id": "250px-N1roadwestboundintocapetown",
      "description": "K53 driving content - 250px-N1roadwestboundintocapetown",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Police_sign_South_Africa_01.jpg",
      "path": "/images/signs/250px-Police_sign_South_Africa_01.jpg",
      "id": "250px-Police-sign-South-Africa-01",
      "description": "K53 driving content - 250px-Police_sign_South_Africa_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Runway_sign_at_Skukuza_Airport.jpg",
      "path": "/images/signs/250px-Runway_sign_at_Skukuza_Airport.jpg",
      "id": "250px-Runway-sign-at-Skukuza-Airport",
      "description": "K53 driving content - 250px-Runway_sign_at_Skukuza_Airport",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SACU_road_sign_W315.svg.png",
      "path": "/images/signs/250px-SACU_road_sign_W315.svg.png",
      "id": "250px-SACU-road-sign-W315-svg",
      "description": "K53 driving content - 250px-SACU_road_sign_W315.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SACU_road_sign_W316.svg.png",
      "path": "/images/signs/250px-SACU_road_sign_W316.svg.png",
      "id": "250px-SACU-road-sign-W316-svg",
      "description": "K53 driving content - 250px-SACU_road_sign_W316.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-1.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-10.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-11.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-11.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-11-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-12.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-14.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-14.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-14-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-14.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-5.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-7.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-8.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A1-9-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A1-9-RHT.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A1-9-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A1-9-RHT.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-11.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-11.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-11-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-12.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-13.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-13.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-13-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-13.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-15.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-15.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-15-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-15.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-4.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-6.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-7.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A2-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A2-9.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A2-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A2-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDLS_A4-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDLS_A4-3.svg.png",
      "id": "250px-SADC-road-sign-GDLS-A4-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDLS_A4-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-1.svg.png",
      "id": "250px-SADC-road-sign-GDS-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-10.svg.png",
      "id": "250px-SADC-road-sign-GDS-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-12.svg.png",
      "id": "250px-SADC-road-sign-GDS-12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-13.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-13.svg.png",
      "id": "250px-SADC-road-sign-GDS-13-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-13.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-14.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-14.svg.png",
      "id": "250px-SADC-road-sign-GDS-14-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-14.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-15.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-15.svg.png",
      "id": "250px-SADC-road-sign-GDS-15-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-15.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-16.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-16.svg.png",
      "id": "250px-SADC-road-sign-GDS-16-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-16.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-19-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-19-NAM.svg.png",
      "id": "250px-SADC-road-sign-GDS-19-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-19-NAM.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-2.svg.png",
      "id": "250px-SADC-road-sign-GDS-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-20.svg.png",
      "id": "250px-SADC-road-sign-GDS-20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-20.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-21-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-21-RHT.svg.png",
      "id": "250px-SADC-road-sign-GDS-21-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-21-RHT.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-21.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-21.svg.png",
      "id": "250px-SADC-road-sign-GDS-21-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-21.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-23.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-23.svg.png",
      "id": "250px-SADC-road-sign-GDS-23-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-23.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-3.svg.png",
      "id": "250px-SADC-road-sign-GDS-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-4.svg.png",
      "id": "250px-SADC-road-sign-GDS-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-5.svg.png",
      "id": "250px-SADC-road-sign-GDS-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-6.svg.png",
      "id": "250px-SADC-road-sign-GDS-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-7.svg.png",
      "id": "250px-SADC-road-sign-GDS-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-8.svg.png",
      "id": "250px-SADC-road-sign-GDS-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GDS-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GDS-9.svg.png",
      "id": "250px-SADC-road-sign-GDS-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GDS-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-05.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-05.svg.png",
      "id": "250px-SADC-road-sign-GE19-05-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-05.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-06.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-06.svg.png",
      "id": "250px-SADC-road-sign-GE19-06-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-06.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-07.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-07.svg.png",
      "id": "250px-SADC-road-sign-GE19-07-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-07.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-10.svg.png",
      "id": "250px-SADC-road-sign-GE19-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-101.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-101.svg.png",
      "id": "250px-SADC-road-sign-GE19-101-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-101.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-102.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-102.svg.png",
      "id": "250px-SADC-road-sign-GE19-102-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-102.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-103.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-103.svg.png",
      "id": "250px-SADC-road-sign-GE19-103-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-103.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-105.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-105.svg.png",
      "id": "250px-SADC-road-sign-GE19-105-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-105.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-106.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-106.svg.png",
      "id": "250px-SADC-road-sign-GE19-106-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-106.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-107.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-107.svg.png",
      "id": "250px-SADC-road-sign-GE19-107-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-107.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-12.svg.png",
      "id": "250px-SADC-road-sign-GE19-12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-121.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-121.svg.png",
      "id": "250px-SADC-road-sign-GE19-121-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-121.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-122.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-122.svg.png",
      "id": "250px-SADC-road-sign-GE19-122-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-122.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-131.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-131.svg.png",
      "id": "250px-SADC-road-sign-GE19-131-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-131.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-16.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-16.svg.png",
      "id": "250px-SADC-road-sign-GE19-16-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-16.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-17.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-17.svg.png",
      "id": "250px-SADC-road-sign-GE19-17-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-17.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-19.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-19.svg.png",
      "id": "250px-SADC-road-sign-GE19-19-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-19.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-20.svg.png",
      "id": "250px-SADC-road-sign-GE19-20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-20.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-21.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-21.svg.png",
      "id": "250px-SADC-road-sign-GE19-21-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-21.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-22.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-22.svg.png",
      "id": "250px-SADC-road-sign-GE19-22-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-22.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-24.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-24.svg.png",
      "id": "250px-SADC-road-sign-GE19-24-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-24.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-25.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-25.svg.png",
      "id": "250px-SADC-road-sign-GE19-25-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-25.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-26.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-26.svg.png",
      "id": "250px-SADC-road-sign-GE19-26-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-26.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-27.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-27.svg.png",
      "id": "250px-SADC-road-sign-GE19-27-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-27.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-28.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-28.svg.png",
      "id": "250px-SADC-road-sign-GE19-28-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-28.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-29.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-29.svg.png",
      "id": "250px-SADC-road-sign-GE19-29-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-29.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-30.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-30.svg.png",
      "id": "250px-SADC-road-sign-GE19-30-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-30.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-301.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-301.svg.png",
      "id": "250px-SADC-road-sign-GE19-301-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-301.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-303.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-303.svg.png",
      "id": "250px-SADC-road-sign-GE19-303-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-303.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-31.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-31.svg.png",
      "id": "250px-SADC-road-sign-GE19-31-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-31.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-32.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-32.svg.png",
      "id": "250px-SADC-road-sign-GE19-32-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-32.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-34.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-34.svg.png",
      "id": "250px-SADC-road-sign-GE19-34-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-34.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-35.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-35.svg.png",
      "id": "250px-SADC-road-sign-GE19-35-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-35.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-36.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-36.svg.png",
      "id": "250px-SADC-road-sign-GE19-36-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-36.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-40.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-40.svg.png",
      "id": "250px-SADC-road-sign-GE19-40-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-40.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-421.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-421.svg.png",
      "id": "250px-SADC-road-sign-GE19-421-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-421.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-422.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-422.svg.png",
      "id": "250px-SADC-road-sign-GE19-422-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-422.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-423.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-423.svg.png",
      "id": "250px-SADC-road-sign-GE19-423-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-423.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GE19-50.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GE19-50.svg.png",
      "id": "250px-SADC-road-sign-GE19-50-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GE19-50.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GF12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GF12.svg.png",
      "id": "250px-SADC-road-sign-GF12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GF12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GF13-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GF13-RHT.svg.png",
      "id": "250px-SADC-road-sign-GF13-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GF13-RHT.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GF13.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GF13.svg.png",
      "id": "250px-SADC-road-sign-GF13-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GF13.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GF16.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GF16.svg.png",
      "id": "250px-SADC-road-sign-GF16-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GF16.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A1-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A1-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A1-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A1-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A1-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A1-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A1-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A1-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A10-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A10-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A10-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A10-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A10-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A10-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A10-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A10-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A11-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A11-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A11-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A11-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A12-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A12-8.svg.png",
      "id": "250px-SADC-road-sign-GFS-A12-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A12-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A13-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A13-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A13-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A13-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A2-2-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A2-2-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-A2-2-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A2-2-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A2-3-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A2-3-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-A2-3-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A2-3-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A3-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A3-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A3-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A3-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A3-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A3-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A3-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A3-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-10.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-2-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-2-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-2-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-2-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A4-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A4-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A4-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A4-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A5-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A5-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A5-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A5-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A5-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A5-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-A5-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A5-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A5-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A5-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A5-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A5-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6-8.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A6.svg.png",
      "id": "250px-SADC-road-sign-GFS-A6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7-1-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7-1-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-1-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7-1-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A8-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A8-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A8-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A8-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A8-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A8-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-A8-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A8-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A8-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A8-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-A8-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A8-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A8-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A8-9.svg.png",
      "id": "250px-SADC-road-sign-GFS-A8-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A8-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A9-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A9-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-A9-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A9-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A9-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A9-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-A9-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A9-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A9-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A9-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-A9-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A9-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A9-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A9-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-A9-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A9-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_A9-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_A9-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-A9-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_A9-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-10.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-2-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-2-NAM.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-2-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-2-NAM.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-2-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-2-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-2-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-2-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-7-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-7-NAM.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-7-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-7-NAM.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-8.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B1-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B1-9.svg.png",
      "id": "250px-SADC-road-sign-GFS-B1-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B1-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B2-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B2-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-B2-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B2-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B2-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B2-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-B2-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B2-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B4-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B4-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-B4-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B4-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B4-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B4-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-B4-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B4-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B4-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B4-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-B4-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B4-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-10.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-11.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-11.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-11-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-8.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_B5-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_B5-9.svg.png",
      "id": "250px-SADC-road-sign-GFS-B5-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_B5-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_C1-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_C1-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-C1-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_C1-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_C1-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_C1-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-C1-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_C1-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_C1-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_C1-9.svg.png",
      "id": "250px-SADC-road-sign-GFS-C1-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_C1-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-10.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-11.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-11.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-11-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-12.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-13.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-13.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-13-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-13.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-14-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-14-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-14-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-14-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-14-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-14-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-14-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-14-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-15-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-15-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-15-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-15-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-15-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-15-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-15-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-15-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-16-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-16-1.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-16-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-16-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-16-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-16-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-16-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-16-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-17-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-17-NAM.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-17-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-17-NAM.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-17.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-17.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-17-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-17.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-18.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-18.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-18-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-18.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-19.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-19.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-19-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-19.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-2.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-20.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-20.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-21.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-21.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-21-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-21.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-22.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-22.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-22-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-22.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-23.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-23.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-23-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-23.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-24.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-24.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-24-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-24.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-25.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-25.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-25-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-25.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-26.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-26.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-26-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-26.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-27.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-27.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-27-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-27.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-28.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-28.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-28-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-28.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-3.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-4.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-5.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-6.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-7.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-8.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-8.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-8-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D1-9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D1-9.svg.png",
      "id": "250px-SADC-road-sign-GFS-D1-9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D1-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D2-1-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D2-1-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-D2-1-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D2-1-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GFS_D2-2-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GFS_D2-2-RSA.svg.png",
      "id": "250px-SADC-road-sign-GFS-D2-2-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GFS_D2-2-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-2.svg.png",
      "id": "250px-SADC-road-sign-GLS-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-3.svg.png",
      "id": "250px-SADC-road-sign-GLS-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-4.svg.png",
      "id": "250px-SADC-road-sign-GLS-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-5.svg.png",
      "id": "250px-SADC-road-sign-GLS-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-6.svg.png",
      "id": "250px-SADC-road-sign-GLS-6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_GLS-7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_GLS-7.svg.png",
      "id": "250px-SADC-road-sign-GLS-7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_GLS-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN10.svg.png",
      "id": "250px-SADC-road-sign-IN10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN10.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN12.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN12.svg.png",
      "id": "250px-SADC-road-sign-IN12-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN12.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN14.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN14.svg.png",
      "id": "250px-SADC-road-sign-IN14-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN14.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN15-AFR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN15-AFR.svg.png",
      "id": "250px-SADC-road-sign-IN15-AFR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN15-AFR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN15-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN15-RSA.svg.png",
      "id": "250px-SADC-road-sign-IN15-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN15-RSA.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN15.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN15.svg.png",
      "id": "250px-SADC-road-sign-IN15-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN15.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN16-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN16-NAM.svg.png",
      "id": "250px-SADC-road-sign-IN16-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN16-NAM.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN16.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN16.svg.png",
      "id": "250px-SADC-road-sign-IN16-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN16.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN17.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN17.svg.png",
      "id": "250px-SADC-road-sign-IN17-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN17.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN18-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN18-RHT.svg.png",
      "id": "250px-SADC-road-sign-IN18-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN18-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN18.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN18.svg.png",
      "id": "250px-SADC-road-sign-IN18-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN18.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN19-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN19-RHT.svg.png",
      "id": "250px-SADC-road-sign-IN19-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN19-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN19.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN19.svg.png",
      "id": "250px-SADC-road-sign-IN19-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN19.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN20-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN20-RHT.svg.png",
      "id": "250px-SADC-road-sign-IN20-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN20-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN20.svg.png",
      "id": "250px-SADC-road-sign-IN20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN20.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN4.svg.png",
      "id": "250px-SADC-road-sign-IN4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN4.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN5.svg.png",
      "id": "250px-SADC-road-sign-IN5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN5.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN6.svg.png",
      "id": "250px-SADC-road-sign-IN6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN6.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN7.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN7.svg.png",
      "id": "250px-SADC-road-sign-IN7-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN7.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_IN9.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_IN9.svg.png",
      "id": "250px-SADC-road-sign-IN9-svg",
      "description": "South African road sign - 250px-SADC_road_sign_IN9.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_10.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_10.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-10",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_10",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_12.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_12.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-12",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_12",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_13.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_13.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-13",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_13",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_14.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_14.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-14",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_14",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_15.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_15.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-15",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_15",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_Muster-Sign_16.jpg",
      "path": "/images/signs/250px-SADC_road_sign_Muster-Sign_16.jpg",
      "id": "250px-SADC-road-sign-Muster-Sign-16",
      "description": "South African road sign - 250px-SADC_road_sign_Muster-Sign_16",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R1.3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R1.3.svg.png",
      "id": "250px-SADC-road-sign-R1-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R1.3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R1.4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R1.4.svg.png",
      "id": "250px-SADC-road-sign-R1-4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R1.4.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R1.svg.png",
      "id": "250px-SADC-road-sign-R1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R101-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R101-600.svg.png",
      "id": "250px-SADC-road-sign-R101-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R101-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R101.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R101.svg.png",
      "id": "250px-SADC-road-sign-R101-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R101.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R102.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R102.svg.png",
      "id": "250px-SADC-road-sign-R102-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R102.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R103.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R103.svg.png",
      "id": "250px-SADC-road-sign-R103-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R103.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R104.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R104.svg.png",
      "id": "250px-SADC-road-sign-R104-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R104.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R105.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R105.svg.png",
      "id": "250px-SADC-road-sign-R105-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R105.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R106.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R106.svg.png",
      "id": "250px-SADC-road-sign-R106-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R106.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R107.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R107.svg.png",
      "id": "250px-SADC-road-sign-R107-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R107.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R108.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R108.svg.png",
      "id": "250px-SADC-road-sign-R108-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R108.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R109.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R109.svg.png",
      "id": "250px-SADC-road-sign-R109-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R109.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R110.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R110.svg.png",
      "id": "250px-SADC-road-sign-R110-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R110.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R111.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R111.svg.png",
      "id": "250px-SADC-road-sign-R111-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R111.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R112.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R112.svg.png",
      "id": "250px-SADC-road-sign-R112-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R112.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R113.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R113.svg.png",
      "id": "250px-SADC-road-sign-R113-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R113.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R114.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R114.svg.png",
      "id": "250px-SADC-road-sign-R114-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R114.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R115.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R115.svg.png",
      "id": "250px-SADC-road-sign-R115-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R115.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R116.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R116.svg.png",
      "id": "250px-SADC-road-sign-R116-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R116.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R117.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R117.svg.png",
      "id": "250px-SADC-road-sign-R117-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R117.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R118-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R118-RHT.svg.png",
      "id": "250px-SADC-road-sign-R118-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R118-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R118.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R118.svg.png",
      "id": "250px-SADC-road-sign-R118-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R118.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R119.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R119.svg.png",
      "id": "250px-SADC-road-sign-R119-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R119.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R120.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R120.svg.png",
      "id": "250px-SADC-road-sign-R120-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R120.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R121.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R121.svg.png",
      "id": "250px-SADC-road-sign-R121-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R121.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R122.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R122.svg.png",
      "id": "250px-SADC-road-sign-R122-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R122.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R123.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R123.svg.png",
      "id": "250px-SADC-road-sign-R123-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R123.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R124.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R124.svg.png",
      "id": "250px-SADC-road-sign-R124-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R124.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R125.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R125.svg.png",
      "id": "250px-SADC-road-sign-R125-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R125.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R126.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R126.svg.png",
      "id": "250px-SADC-road-sign-R126-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R126.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R127-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R127-POR.svg.png",
      "id": "250px-SADC-road-sign-R127-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R127-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R127.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R127.svg.png",
      "id": "250px-SADC-road-sign-R127-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R127.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R128.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R128.svg.png",
      "id": "250px-SADC-road-sign-R128-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R128.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R129-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R129-POR.svg.png",
      "id": "250px-SADC-road-sign-R129-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R129-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R129-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R129-RSA.svg.png",
      "id": "250px-SADC-road-sign-R129-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R129-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R129.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R129.svg.png",
      "id": "250px-SADC-road-sign-R129-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R129.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R130.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R130.svg.png",
      "id": "250px-SADC-road-sign-R130-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R130.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R131.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R131.svg.png",
      "id": "250px-SADC-road-sign-R131-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R131.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R132-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R132-600.svg.png",
      "id": "250px-SADC-road-sign-R132-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R132-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R132.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R132.svg.png",
      "id": "250px-SADC-road-sign-R132-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R132.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R133-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R133-600.svg.png",
      "id": "250px-SADC-road-sign-R133-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R133-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R133.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R133.svg.png",
      "id": "250px-SADC-road-sign-R133-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R133.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R134.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R134.svg.png",
      "id": "250px-SADC-road-sign-R134-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R134.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R135.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R135.svg.png",
      "id": "250px-SADC-road-sign-R135-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R135.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R136.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R136.svg.png",
      "id": "250px-SADC-road-sign-R136-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R136.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R137-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R137-RHT.svg.png",
      "id": "250px-SADC-road-sign-R137-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R137-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R137.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R137.svg.png",
      "id": "250px-SADC-road-sign-R137-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R137.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R138.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R138.svg.png",
      "id": "250px-SADC-road-sign-R138-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R138.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R139.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R139.svg.png",
      "id": "250px-SADC-road-sign-R139-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R139.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R140.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R140.svg.png",
      "id": "250px-SADC-road-sign-R140-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R140.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R1–TIN11.577-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R1–TIN11.577-NAM.svg.png",
      "id": "250px-SADC-road-sign-R1-TIN11-577-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R1–TIN11.577-NAM.svg",
      "context": ["regulatory","information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.1-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.1-RHT.svg.png",
      "id": "250px-SADC-road-sign-R2-1-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.1-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.1.svg.png",
      "id": "250px-SADC-road-sign-R2-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.1_(Equestrians).svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.1_(Equestrians).svg.png",
      "id": "250px-SADC-road-sign-R2-1--Equestrians--svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.1_(Equestrians).svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.2-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.2-RHT.svg.png",
      "id": "250px-SADC-road-sign-R2-2-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.2-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.2.svg.png",
      "id": "250px-SADC-road-sign-R2-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R2.svg.png",
      "id": "250px-SADC-road-sign-R2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-10.svg.png",
      "id": "250px-SADC-road-sign-R201-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-10.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-100.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-100.svg.png",
      "id": "250px-SADC-road-sign-R201-100-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-100.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-120.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-120.svg.png",
      "id": "250px-SADC-road-sign-R201-120-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-120.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-30.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-30.svg.png",
      "id": "250px-SADC-road-sign-R201-30-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-30.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-40.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-40.svg.png",
      "id": "250px-SADC-road-sign-R201-40-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-40.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-5.svg.png",
      "id": "250px-SADC-road-sign-R201-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-5.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-50.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-50.svg.png",
      "id": "250px-SADC-road-sign-R201-50-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-50.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-60.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-60.svg.png",
      "id": "250px-SADC-road-sign-R201-60-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-60.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-70.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-70.svg.png",
      "id": "250px-SADC-road-sign-R201-70-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-70.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-75.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-75.svg.png",
      "id": "250px-SADC-road-sign-R201-75-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-75.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-80.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-80.svg.png",
      "id": "250px-SADC-road-sign-R201-80-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-80.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R201-90.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R201-90.svg.png",
      "id": "250px-SADC-road-sign-R201-90-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R201-90.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R202-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R202-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R202-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R202-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R202-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R202-600.svg.png",
      "id": "250px-SADC-road-sign-R202-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R202-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R202.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R202.svg.png",
      "id": "250px-SADC-road-sign-R202-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R202.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R203-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R203-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R203-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R203-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R203-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R203-600.svg.png",
      "id": "250px-SADC-road-sign-R203-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R203-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R203.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R203.svg.png",
      "id": "250px-SADC-road-sign-R203-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R203.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R204.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R204.svg.png",
      "id": "250px-SADC-road-sign-R204-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R204.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R205-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R205-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R205-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R205-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R205.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R205.svg.png",
      "id": "250px-SADC-road-sign-R205-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R205.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R206.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R206.svg.png",
      "id": "250px-SADC-road-sign-R206-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R206.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R207.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R207.svg.png",
      "id": "250px-SADC-road-sign-R207-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R207.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R208.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R208.svg.png",
      "id": "250px-SADC-road-sign-R208-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R208.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R209.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R209.svg.png",
      "id": "250px-SADC-road-sign-R209-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R209.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R210.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R210.svg.png",
      "id": "250px-SADC-road-sign-R210-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R210.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R211.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R211.svg.png",
      "id": "250px-SADC-road-sign-R211-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R211.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R212.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R212.svg.png",
      "id": "250px-SADC-road-sign-R212-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R212.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R213-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R213-RHT.svg.png",
      "id": "250px-SADC-road-sign-R213-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R213-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R213.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R213.svg.png",
      "id": "250px-SADC-road-sign-R213-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R213.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R214-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R214-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R214-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R214-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R214-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R214-RHT.svg.png",
      "id": "250px-SADC-road-sign-R214-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R214-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R214.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R214.svg.png",
      "id": "250px-SADC-road-sign-R214-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R214.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R214–IN11.2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R214–IN11.2.svg.png",
      "id": "250px-SADC-road-sign-R214-IN11-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R214–IN11.2.svg",
      "context": ["regulatory","information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R215-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R215-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R215-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R215-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R215-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R215-RHT.svg.png",
      "id": "250px-SADC-road-sign-R215-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R215-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R215.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R215.svg.png",
      "id": "250px-SADC-road-sign-R215-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R215.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R216.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R216.svg.png",
      "id": "250px-SADC-road-sign-R216-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R216.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R217.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R217.svg.png",
      "id": "250px-SADC-road-sign-R217-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R217.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R218.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R218.svg.png",
      "id": "250px-SADC-road-sign-R218-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R218.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R219.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R219.svg.png",
      "id": "250px-SADC-road-sign-R219-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R219.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R220.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R220.svg.png",
      "id": "250px-SADC-road-sign-R220-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R220.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R222.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R222.svg.png",
      "id": "250px-SADC-road-sign-R222-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R222.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R223.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R223.svg.png",
      "id": "250px-SADC-road-sign-R223-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R223.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R224-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R224-RHT.svg.png",
      "id": "250px-SADC-road-sign-R224-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R224-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R224.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R224.svg.png",
      "id": "250px-SADC-road-sign-R224-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R224.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R225.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R225.svg.png",
      "id": "250px-SADC-road-sign-R225-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R225.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R226.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R226.svg.png",
      "id": "250px-SADC-road-sign-R226-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R226.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R227.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R227.svg.png",
      "id": "250px-SADC-road-sign-R227-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R227.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R228.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R228.svg.png",
      "id": "250px-SADC-road-sign-R228-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R228.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R229.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R229.svg.png",
      "id": "250px-SADC-road-sign-R229-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R229.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R230.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R230.svg.png",
      "id": "250px-SADC-road-sign-R230-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R230.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R231.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R231.svg.png",
      "id": "250px-SADC-road-sign-R231-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R231.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R233-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R233-POR.svg.png",
      "id": "250px-SADC-road-sign-R233-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R233-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R233.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R233.svg.png",
      "id": "250px-SADC-road-sign-R233-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R233.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R234.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R234.svg.png",
      "id": "250px-SADC-road-sign-R234-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R234.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R235-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R235-POR.svg.png",
      "id": "250px-SADC-road-sign-R235-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R235-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R235-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R235-RSA.svg.png",
      "id": "250px-SADC-road-sign-R235-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R235-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R235.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R235.svg.png",
      "id": "250px-SADC-road-sign-R235-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R235.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R236.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R236.svg.png",
      "id": "250px-SADC-road-sign-R236-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R236.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R237.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R237.svg.png",
      "id": "250px-SADC-road-sign-R237-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R237.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R238.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R238.svg.png",
      "id": "250px-SADC-road-sign-R238-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R238.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R239.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R239.svg.png",
      "id": "250px-SADC-road-sign-R239-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R239.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R240.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R240.svg.png",
      "id": "250px-SADC-road-sign-R240-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R240.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R241.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R241.svg.png",
      "id": "250px-SADC-road-sign-R241-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R241.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R245-600-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R245-600-TAN.svg.png",
      "id": "250px-SADC-road-sign-R245-600-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R245-600-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R245-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R245-600.svg.png",
      "id": "250px-SADC-road-sign-R245-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R245-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R245.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R245.svg.png",
      "id": "250px-SADC-road-sign-R245-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R245.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R3.svg.png",
      "id": "250px-SADC-road-sign-R3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R301-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R301-P.svg.png",
      "id": "250px-SADC-road-sign-R301-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R301-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R301.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R301.svg.png",
      "id": "250px-SADC-road-sign-R301-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R301.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R302.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R302.svg.png",
      "id": "250px-SADC-road-sign-R302-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R302.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R303.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R303.svg.png",
      "id": "250px-SADC-road-sign-R303-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R303.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R304-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R304-P.svg.png",
      "id": "250px-SADC-road-sign-R304-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R304-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R304.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R304.svg.png",
      "id": "250px-SADC-road-sign-R304-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R304.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R305-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R305-P.svg.png",
      "id": "250px-SADC-road-sign-R305-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R305-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R306-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R306-P.svg.png",
      "id": "250px-SADC-road-sign-R306-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R306-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R307-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R307-P.svg.png",
      "id": "250px-SADC-road-sign-R307-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R307-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R307.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R307.svg.png",
      "id": "250px-SADC-road-sign-R307-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R307.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R308-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R308-P.svg.png",
      "id": "250px-SADC-road-sign-R308-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R308-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R308.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R308.svg.png",
      "id": "250px-SADC-road-sign-R308-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R308.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R309-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R309-P.svg.png",
      "id": "250px-SADC-road-sign-R309-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R309-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R309.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R309.svg.png",
      "id": "250px-SADC-road-sign-R309-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R309.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R310-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R310-P.svg.png",
      "id": "250px-SADC-road-sign-R310-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R310-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R310.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R310.svg.png",
      "id": "250px-SADC-road-sign-R310-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R310.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R311-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R311-P.svg.png",
      "id": "250px-SADC-road-sign-R311-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R311-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R311.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R311.svg.png",
      "id": "250px-SADC-road-sign-R311-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R311.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R312-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R312-P.svg.png",
      "id": "250px-SADC-road-sign-R312-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R312-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R312.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R312.svg.png",
      "id": "250px-SADC-road-sign-R312-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R312.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R313-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R313-P.svg.png",
      "id": "250px-SADC-road-sign-R313-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R313-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R313.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R313.svg.png",
      "id": "250px-SADC-road-sign-R313-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R313.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R314.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R314.svg.png",
      "id": "250px-SADC-road-sign-R314-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R314.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R315-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R315-P.svg.png",
      "id": "250px-SADC-road-sign-R315-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R315-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R315.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R315.svg.png",
      "id": "250px-SADC-road-sign-R315-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R315.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R316-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R316-P.svg.png",
      "id": "250px-SADC-road-sign-R316-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R316-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R316.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R316.svg.png",
      "id": "250px-SADC-road-sign-R316-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R316.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R317-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R317-P.svg.png",
      "id": "250px-SADC-road-sign-R317-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R317-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R317.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R317.svg.png",
      "id": "250px-SADC-road-sign-R317-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R317.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R318-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R318-P.svg.png",
      "id": "250px-SADC-road-sign-R318-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R318-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R318.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R318.svg.png",
      "id": "250px-SADC-road-sign-R318-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R318.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R319-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R319-P.svg.png",
      "id": "250px-SADC-road-sign-R319-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R319-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R319.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R319.svg.png",
      "id": "250px-SADC-road-sign-R319-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R319.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R320-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R320-P.svg.png",
      "id": "250px-SADC-road-sign-R320-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R320-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R320.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R320.svg.png",
      "id": "250px-SADC-road-sign-R320-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R320.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R321-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R321-P.svg.png",
      "id": "250px-SADC-road-sign-R321-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R321-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R321.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R321.svg.png",
      "id": "250px-SADC-road-sign-R321-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R321.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322-NAM.svg.png",
      "id": "250px-SADC-road-sign-R322-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322-P-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322-P-NAM.svg.png",
      "id": "250px-SADC-road-sign-R322-P-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322-P-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322-P-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322-P-RSA.svg.png",
      "id": "250px-SADC-road-sign-R322-P-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322-P-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322-P.svg.png",
      "id": "250px-SADC-road-sign-R322-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322-RSA.svg.png",
      "id": "250px-SADC-road-sign-R322-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R322.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R322.svg.png",
      "id": "250px-SADC-road-sign-R322-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R322.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R323-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R323-P.svg.png",
      "id": "250px-SADC-road-sign-R323-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R323-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R323.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R323.svg.png",
      "id": "250px-SADC-road-sign-R323-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R323.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R324-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R324-P.svg.png",
      "id": "250px-SADC-road-sign-R324-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R324-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R324.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R324.svg.png",
      "id": "250px-SADC-road-sign-R324-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R324.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R325-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R325-NAM.svg.png",
      "id": "250px-SADC-road-sign-R325-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R325-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R327-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R327-P.svg.png",
      "id": "250px-SADC-road-sign-R327-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R327-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R327.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R327.svg.png",
      "id": "250px-SADC-road-sign-R327-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R327.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R328.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R328.svg.png",
      "id": "250px-SADC-road-sign-R328-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R328.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R329.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R329.svg.png",
      "id": "250px-SADC-road-sign-R329-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R329.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R330-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R330-P.svg.png",
      "id": "250px-SADC-road-sign-R330-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R330-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R330.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R330.svg.png",
      "id": "250px-SADC-road-sign-R330-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R330.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R331.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R331.svg.png",
      "id": "250px-SADC-road-sign-R331-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R331.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R332.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R332.svg.png",
      "id": "250px-SADC-road-sign-R332-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R332.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R336.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R336.svg.png",
      "id": "250px-SADC-road-sign-R336-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R336.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R337.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R337.svg.png",
      "id": "250px-SADC-road-sign-R337-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R337.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R338.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R338.svg.png",
      "id": "250px-SADC-road-sign-R338-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R338.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R339.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R339.svg.png",
      "id": "250px-SADC-road-sign-R339-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R339.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R340.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R340.svg.png",
      "id": "250px-SADC-road-sign-R340-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R340.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R342.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R342.svg.png",
      "id": "250px-SADC-road-sign-R342-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R342.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R343.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R343.svg.png",
      "id": "250px-SADC-road-sign-R343-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R343.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R344.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R344.svg.png",
      "id": "250px-SADC-road-sign-R344-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R344.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R348.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R348.svg.png",
      "id": "250px-SADC-road-sign-R348-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R348.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R349.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R349.svg.png",
      "id": "250px-SADC-road-sign-R349-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R349.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R350.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R350.svg.png",
      "id": "250px-SADC-road-sign-R350-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R350.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R353.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R353.svg.png",
      "id": "250px-SADC-road-sign-R353-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R353.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R354.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R354.svg.png",
      "id": "250px-SADC-road-sign-R354-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R354.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R360-LES.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R360-LES.svg.png",
      "id": "250px-SADC-road-sign-R360-LES-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R360-LES.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R360.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R360.svg.png",
      "id": "250px-SADC-road-sign-R360-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R360.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R4.1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R4.1.svg.png",
      "id": "250px-SADC-road-sign-R4-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R4.1.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R4.2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R4.2.svg.png",
      "id": "250px-SADC-road-sign-R4-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R4.2.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R4.3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R4.3.svg.png",
      "id": "250px-SADC-road-sign-R4-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R4.3.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R401-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R401-600.svg.png",
      "id": "250px-SADC-road-sign-R401-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R401-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R401.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R401.svg.png",
      "id": "250px-SADC-road-sign-R401-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R401.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R402-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R402-600.svg.png",
      "id": "250px-SADC-road-sign-R402-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R402-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R402.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R402.svg.png",
      "id": "250px-SADC-road-sign-R402-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R402.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R403-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R403-600.svg.png",
      "id": "250px-SADC-road-sign-R403-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R403-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R403.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R403.svg.png",
      "id": "250px-SADC-road-sign-R403-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R403.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R5-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R5-RHT.svg.png",
      "id": "250px-SADC-road-sign-R5-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R5-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R5.svg.png",
      "id": "250px-SADC-road-sign-R5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R5.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R503-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R503-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R503-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R503-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R503.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R503.svg.png",
      "id": "250px-SADC-road-sign-R503-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R503.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R504-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R504-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R504-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R504-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R504-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R504-B.svg.png",
      "id": "250px-SADC-road-sign-R504-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R504-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R504-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R504-POR.svg.png",
      "id": "250px-SADC-road-sign-R504-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R504-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R505-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R505-POR.svg.png",
      "id": "250px-SADC-road-sign-R505-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R505-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R505.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R505.svg.png",
      "id": "250px-SADC-road-sign-R505-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R505.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R511-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R511-B.svg.png",
      "id": "250px-SADC-road-sign-R511-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R511-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R511.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R511.svg.png",
      "id": "250px-SADC-road-sign-R511-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R511.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R512-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R512-B.svg.png",
      "id": "250px-SADC-road-sign-R512-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R512-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R512.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R512.svg.png",
      "id": "250px-SADC-road-sign-R512-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R512.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R520-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R520-B.svg.png",
      "id": "250px-SADC-road-sign-R520-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R520-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R520.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R520.svg.png",
      "id": "250px-SADC-road-sign-R520-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R520.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R521-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R521-B.svg.png",
      "id": "250px-SADC-road-sign-R521-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R521-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R521.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R521.svg.png",
      "id": "250px-SADC-road-sign-R521-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R521.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R522.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R522.svg.png",
      "id": "250px-SADC-road-sign-R522-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R522.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R523.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R523.svg.png",
      "id": "250px-SADC-road-sign-R523-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R523.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R530-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R530-B.svg.png",
      "id": "250px-SADC-road-sign-R530-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R530-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R531-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R531-B.svg.png",
      "id": "250px-SADC-road-sign-R531-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R531-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R531.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R531.svg.png",
      "id": "250px-SADC-road-sign-R531-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R531.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R533-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R533-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R533-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R533-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R533-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R533-B.svg.png",
      "id": "250px-SADC-road-sign-R533-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R533-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R533-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R533-POR.svg.png",
      "id": "250px-SADC-road-sign-R533-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R533-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R533.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R533.svg.png",
      "id": "250px-SADC-road-sign-R533-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R533.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R534-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R534-POR.svg.png",
      "id": "250px-SADC-road-sign-R534-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R534-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R534.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R534.svg.png",
      "id": "250px-SADC-road-sign-R534-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R534.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R535-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R535-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R535-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R535-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R535-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R535-POR.svg.png",
      "id": "250px-SADC-road-sign-R535-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R535-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R540.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R540.svg.png",
      "id": "250px-SADC-road-sign-R540-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R540.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R560-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R560-B.svg.png",
      "id": "250px-SADC-road-sign-R560-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R560-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R560.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R560.svg.png",
      "id": "250px-SADC-road-sign-R560-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R560.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R561-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R561-B.svg.png",
      "id": "250px-SADC-road-sign-R561-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R561-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R561.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R561.svg.png",
      "id": "250px-SADC-road-sign-R561-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R561.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R562-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R562-B.svg.png",
      "id": "250px-SADC-road-sign-R562-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R562-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R562.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R562.svg.png",
      "id": "250px-SADC-road-sign-R562-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R562.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R563-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R563-B.svg.png",
      "id": "250px-SADC-road-sign-R563-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R563-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R563.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R563.svg.png",
      "id": "250px-SADC-road-sign-R563-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R563.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R564-B-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R564-B-RHT.svg.png",
      "id": "250px-SADC-road-sign-R564-B-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R564-B-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R564-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R564-B.svg.png",
      "id": "250px-SADC-road-sign-R564-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R564-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R564-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R564-RHT.svg.png",
      "id": "250px-SADC-road-sign-R564-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R564-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R564.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R564.svg.png",
      "id": "250px-SADC-road-sign-R564-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R564.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R565-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R565-B.svg.png",
      "id": "250px-SADC-road-sign-R565-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R565-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R565.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R565.svg.png",
      "id": "250px-SADC-road-sign-R565-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R565.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R566-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R566-B.svg.png",
      "id": "250px-SADC-road-sign-R566-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R566-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R566.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R566.svg.png",
      "id": "250px-SADC-road-sign-R566-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R566.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R567-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R567-B.svg.png",
      "id": "250px-SADC-road-sign-R567-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R567-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R567.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R567.svg.png",
      "id": "250px-SADC-road-sign-R567-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R567.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R568-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R568-B.svg.png",
      "id": "250px-SADC-road-sign-R568-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R568-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R568.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R568.svg.png",
      "id": "250px-SADC-road-sign-R568-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R568.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R569-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R569-B.svg.png",
      "id": "250px-SADC-road-sign-R569-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R569-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R569.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R569.svg.png",
      "id": "250px-SADC-road-sign-R569-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R569.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R570-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R570-B.svg.png",
      "id": "250px-SADC-road-sign-R570-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R570-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R570.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R570.svg.png",
      "id": "250px-SADC-road-sign-R570-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R570.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R571-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R571-B.svg.png",
      "id": "250px-SADC-road-sign-R571-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R571-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R571.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R571.svg.png",
      "id": "250px-SADC-road-sign-R571-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R571.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R572-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R572-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R572-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R572-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R572-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R572-B.svg.png",
      "id": "250px-SADC-road-sign-R572-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R572-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R572-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R572-POR.svg.png",
      "id": "250px-SADC-road-sign-R572-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R572-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R572.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R572.svg.png",
      "id": "250px-SADC-road-sign-R572-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R572.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R573-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R573-B.svg.png",
      "id": "250px-SADC-road-sign-R573-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R573-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R573.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R573.svg.png",
      "id": "250px-SADC-road-sign-R573-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R573.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574-B-POR.svg.png",
      "id": "250px-SADC-road-sign-R574-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574-B-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574-B-RSA.svg.png",
      "id": "250px-SADC-road-sign-R574-B-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574-B-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574-B.svg.png",
      "id": "250px-SADC-road-sign-R574-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574-POR.svg.png",
      "id": "250px-SADC-road-sign-R574-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574-RSA.svg.png",
      "id": "250px-SADC-road-sign-R574-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R574.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R574.svg.png",
      "id": "250px-SADC-road-sign-R574-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R574.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R575-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R575-B.svg.png",
      "id": "250px-SADC-road-sign-R575-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R575-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R575.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R575.svg.png",
      "id": "250px-SADC-road-sign-R575-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R575.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R576-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R576-B.svg.png",
      "id": "250px-SADC-road-sign-R576-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R576-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R576.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R576.svg.png",
      "id": "250px-SADC-road-sign-R576-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R576.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R577-B-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R577-B-NAM.svg.png",
      "id": "250px-SADC-road-sign-R577-B-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R577-B-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R577-B-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R577-B-RSA.svg.png",
      "id": "250px-SADC-road-sign-R577-B-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R577-B-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R577-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R577-NAM.svg.png",
      "id": "250px-SADC-road-sign-R577-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R577-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R577-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R577-RSA.svg.png",
      "id": "250px-SADC-road-sign-R577-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R577-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R577.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R577.svg.png",
      "id": "250px-SADC-road-sign-R577-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R577.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R578-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R578-B.svg.png",
      "id": "250px-SADC-road-sign-R578-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R578-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R578.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R578.svg.png",
      "id": "250px-SADC-road-sign-R578-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R578.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R579.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R579.svg.png",
      "id": "250px-SADC-road-sign-R579-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R579.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R580-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R580-B.svg.png",
      "id": "250px-SADC-road-sign-R580-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R580-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R580.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R580.svg.png",
      "id": "250px-SADC-road-sign-R580-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R580.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R581-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R581-B.svg.png",
      "id": "250px-SADC-road-sign-R581-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R581-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R581.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R581.svg.png",
      "id": "250px-SADC-road-sign-R581-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R581.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R582-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R582-B.svg.png",
      "id": "250px-SADC-road-sign-R582-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R582-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R583-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R583-B.svg.png",
      "id": "250px-SADC-road-sign-R583-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R583-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R583.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R583.svg.png",
      "id": "250px-SADC-road-sign-R583-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R583.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R6-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R6-RHT.svg.png",
      "id": "250px-SADC-road-sign-R6-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R6-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_R6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_R6.svg.png",
      "id": "250px-SADC-road-sign-R6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_R6.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TGD2-D-1.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TGD2-D-1.svg.png",
      "id": "250px-SADC-road-sign-TGD2-D-1-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TGD2-D-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TGD2-D-2.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TGD2-D-2.svg.png",
      "id": "250px-SADC-road-sign-TGD2-D-2-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TGD2-D-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TGD2-D-3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TGD2-D-3.svg.png",
      "id": "250px-SADC-road-sign-TGD2-D-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TGD2-D-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN20.svg.png",
      "id": "250px-SADC-road-sign-TIN20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN20.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN21.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN21.svg.png",
      "id": "250px-SADC-road-sign-TIN21-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN21.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN22.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN22.svg.png",
      "id": "250px-SADC-road-sign-TIN22-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN22.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN23.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN23.svg.png",
      "id": "250px-SADC-road-sign-TIN23-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN23.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN4.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN4.svg.png",
      "id": "250px-SADC-road-sign-TIN4-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN4.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN5.svg.png",
      "id": "250px-SADC-road-sign-TIN5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN5.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TIN6.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TIN6.svg.png",
      "id": "250px-SADC-road-sign-TIN6-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TIN6.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR101-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR101-600.svg.png",
      "id": "250px-SADC-road-sign-TR101-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR101-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR102.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR102.svg.png",
      "id": "250px-SADC-road-sign-TR102-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR102.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR102–TIN11.3.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR102–TIN11.3.svg.png",
      "id": "250px-SADC-road-sign-TR102-TIN11-3-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR102–TIN11.3.svg",
      "context": ["regulatory","information"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR103.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR103.svg.png",
      "id": "250px-SADC-road-sign-TR103-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR103.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR104.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR104.svg.png",
      "id": "250px-SADC-road-sign-TR104-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR104.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR105.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR105.svg.png",
      "id": "250px-SADC-road-sign-TR105-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR105.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR106.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR106.svg.png",
      "id": "250px-SADC-road-sign-TR106-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR106.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR107.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR107.svg.png",
      "id": "250px-SADC-road-sign-TR107-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR107.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR109.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR109.svg.png",
      "id": "250px-SADC-road-sign-TR109-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR109.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR110.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR110.svg.png",
      "id": "250px-SADC-road-sign-TR110-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR110.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR111.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR111.svg.png",
      "id": "250px-SADC-road-sign-TR111-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR111.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR113.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR113.svg.png",
      "id": "250px-SADC-road-sign-TR113-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR113.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR114.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR114.svg.png",
      "id": "250px-SADC-road-sign-TR114-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR114.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR115.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR115.svg.png",
      "id": "250px-SADC-road-sign-TR115-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR115.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR116.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR116.svg.png",
      "id": "250px-SADC-road-sign-TR116-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR116.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR117.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR117.svg.png",
      "id": "250px-SADC-road-sign-TR117-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR117.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR118.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR118.svg.png",
      "id": "250px-SADC-road-sign-TR118-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR118.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR120.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR120.svg.png",
      "id": "250px-SADC-road-sign-TR120-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR120.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR121.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR121.svg.png",
      "id": "250px-SADC-road-sign-TR121-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR121.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR122.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR122.svg.png",
      "id": "250px-SADC-road-sign-TR122-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR122.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR123.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR123.svg.png",
      "id": "250px-SADC-road-sign-TR123-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR123.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR125.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR125.svg.png",
      "id": "250px-SADC-road-sign-TR125-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR125.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR126.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR126.svg.png",
      "id": "250px-SADC-road-sign-TR126-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR126.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR127.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR127.svg.png",
      "id": "250px-SADC-road-sign-TR127-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR127.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR128.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR128.svg.png",
      "id": "250px-SADC-road-sign-TR128-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR128.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR129-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR129-POR.svg.png",
      "id": "250px-SADC-road-sign-TR129-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR129-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR129-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR129-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR129-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR129-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR129.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR129.svg.png",
      "id": "250px-SADC-road-sign-TR129-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR129.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR130.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR130.svg.png",
      "id": "250px-SADC-road-sign-TR130-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR130.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR131.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR131.svg.png",
      "id": "250px-SADC-road-sign-TR131-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR131.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR133-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR133-600.svg.png",
      "id": "250px-SADC-road-sign-TR133-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR133-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR133.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR133.svg.png",
      "id": "250px-SADC-road-sign-TR133-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR133.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR134.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR134.svg.png",
      "id": "250px-SADC-road-sign-TR134-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR134.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR135.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR135.svg.png",
      "id": "250px-SADC-road-sign-TR135-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR135.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR136.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR136.svg.png",
      "id": "250px-SADC-road-sign-TR136-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR136.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR137-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR137-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR137-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR137-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR137.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR137.svg.png",
      "id": "250px-SADC-road-sign-TR137-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR137.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR138.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR138.svg.png",
      "id": "250px-SADC-road-sign-TR138-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR138.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR139.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR139.svg.png",
      "id": "250px-SADC-road-sign-TR139-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR139.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR140.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR140.svg.png",
      "id": "250px-SADC-road-sign-TR140-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR140.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-10.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-10.svg.png",
      "id": "250px-SADC-road-sign-TR201-10-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-10.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-100.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-100.svg.png",
      "id": "250px-SADC-road-sign-TR201-100-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-100.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-120.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-120.svg.png",
      "id": "250px-SADC-road-sign-TR201-120-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-120.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-20.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-20.svg.png",
      "id": "250px-SADC-road-sign-TR201-20-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-20.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-30.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-30.svg.png",
      "id": "250px-SADC-road-sign-TR201-30-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-30.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-40.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-40.svg.png",
      "id": "250px-SADC-road-sign-TR201-40-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-40.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-5.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-5.svg.png",
      "id": "250px-SADC-road-sign-TR201-5-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-5.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-50.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-50.svg.png",
      "id": "250px-SADC-road-sign-TR201-50-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-50.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-60.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-60.svg.png",
      "id": "250px-SADC-road-sign-TR201-60-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-60.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-70.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-70.svg.png",
      "id": "250px-SADC-road-sign-TR201-70-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-70.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-75.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-75.svg.png",
      "id": "250px-SADC-road-sign-TR201-75-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-75.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-80.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-80.svg.png",
      "id": "250px-SADC-road-sign-TR201-80-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-80.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR201-90.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR201-90.svg.png",
      "id": "250px-SADC-road-sign-TR201-90-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR201-90.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR202-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR202-600.svg.png",
      "id": "250px-SADC-road-sign-TR202-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR202-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR203-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR203-600.svg.png",
      "id": "250px-SADC-road-sign-TR203-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR203-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR203.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR203.svg.png",
      "id": "250px-SADC-road-sign-TR203-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR203.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR204.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR204.svg.png",
      "id": "250px-SADC-road-sign-TR204-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR204.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR205-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR205-600.svg.png",
      "id": "250px-SADC-road-sign-TR205-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR205-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR205.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR205.svg.png",
      "id": "250px-SADC-road-sign-TR205-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR205.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR208.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR208.svg.png",
      "id": "250px-SADC-road-sign-TR208-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR208.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR209.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR209.svg.png",
      "id": "250px-SADC-road-sign-TR209-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR209.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR210.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR210.svg.png",
      "id": "250px-SADC-road-sign-TR210-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR210.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR211.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR211.svg.png",
      "id": "250px-SADC-road-sign-TR211-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR211.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR212.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR212.svg.png",
      "id": "250px-SADC-road-sign-TR212-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR212.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR213-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR213-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR213-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR213-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR213.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR213.svg.png",
      "id": "250px-SADC-road-sign-TR213-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR213.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR214-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR214-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR214-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR214-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR214.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR214.svg.png",
      "id": "250px-SADC-road-sign-TR214-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR214.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR215-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR215-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR215-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR215-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR215.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR215.svg.png",
      "id": "250px-SADC-road-sign-TR215-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR215.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR216.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR216.svg.png",
      "id": "250px-SADC-road-sign-TR216-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR216.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR217.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR217.svg.png",
      "id": "250px-SADC-road-sign-TR217-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR217.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR218.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR218.svg.png",
      "id": "250px-SADC-road-sign-TR218-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR218.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR220.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR220.svg.png",
      "id": "250px-SADC-road-sign-TR220-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR220.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR222.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR222.svg.png",
      "id": "250px-SADC-road-sign-TR222-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR222.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR223.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR223.svg.png",
      "id": "250px-SADC-road-sign-TR223-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR223.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR224-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR224-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR224-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR224-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR224.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR224.svg.png",
      "id": "250px-SADC-road-sign-TR224-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR224.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR225.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR225.svg.png",
      "id": "250px-SADC-road-sign-TR225-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR225.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR226.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR226.svg.png",
      "id": "250px-SADC-road-sign-TR226-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR226.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR227.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR227.svg.png",
      "id": "250px-SADC-road-sign-TR227-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR227.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR229.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR229.svg.png",
      "id": "250px-SADC-road-sign-TR229-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR229.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR230.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR230.svg.png",
      "id": "250px-SADC-road-sign-TR230-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR230.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR231.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR231.svg.png",
      "id": "250px-SADC-road-sign-TR231-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR231.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR232.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR232.svg.png",
      "id": "250px-SADC-road-sign-TR232-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR232.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR233-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR233-POR.svg.png",
      "id": "250px-SADC-road-sign-TR233-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR233-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR234.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR234.svg.png",
      "id": "250px-SADC-road-sign-TR234-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR234.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR235-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR235-POR.svg.png",
      "id": "250px-SADC-road-sign-TR235-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR235-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR235-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR235-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR235-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR235-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR235.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR235.svg.png",
      "id": "250px-SADC-road-sign-TR235-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR235.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR236.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR236.svg.png",
      "id": "250px-SADC-road-sign-TR236-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR236.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR237.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR237.svg.png",
      "id": "250px-SADC-road-sign-TR237-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR237.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR238.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR238.svg.png",
      "id": "250px-SADC-road-sign-TR238-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR238.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR239.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR239.svg.png",
      "id": "250px-SADC-road-sign-TR239-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR239.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR240.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR240.svg.png",
      "id": "250px-SADC-road-sign-TR240-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR240.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR241.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR241.svg.png",
      "id": "250px-SADC-road-sign-TR241-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR241.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR245-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR245-600.svg.png",
      "id": "250px-SADC-road-sign-TR245-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR245-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR245.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR245.svg.png",
      "id": "250px-SADC-road-sign-TR245-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR245.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR301-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR301-P.svg.png",
      "id": "250px-SADC-road-sign-TR301-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR301-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR301.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR301.svg.png",
      "id": "250px-SADC-road-sign-TR301-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR301.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR303.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR303.svg.png",
      "id": "250px-SADC-road-sign-TR303-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR303.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR304-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR304-P.svg.png",
      "id": "250px-SADC-road-sign-TR304-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR304-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR304.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR304.svg.png",
      "id": "250px-SADC-road-sign-TR304-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR304.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR305-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR305-P.svg.png",
      "id": "250px-SADC-road-sign-TR305-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR305-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR306-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR306-P.svg.png",
      "id": "250px-SADC-road-sign-TR306-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR306-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR307-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR307-P.svg.png",
      "id": "250px-SADC-road-sign-TR307-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR307-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR307.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR307.svg.png",
      "id": "250px-SADC-road-sign-TR307-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR307.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR308-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR308-P.svg.png",
      "id": "250px-SADC-road-sign-TR308-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR308-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR309-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR309-P.svg.png",
      "id": "250px-SADC-road-sign-TR309-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR309-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR309.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR309.svg.png",
      "id": "250px-SADC-road-sign-TR309-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR309.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR310-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR310-P.svg.png",
      "id": "250px-SADC-road-sign-TR310-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR310-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR310.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR310.svg.png",
      "id": "250px-SADC-road-sign-TR310-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR310.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR311-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR311-P.svg.png",
      "id": "250px-SADC-road-sign-TR311-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR311-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR312-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR312-P.svg.png",
      "id": "250px-SADC-road-sign-TR312-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR312-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR312.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR312.svg.png",
      "id": "250px-SADC-road-sign-TR312-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR312.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR313-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR313-P.svg.png",
      "id": "250px-SADC-road-sign-TR313-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR313-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR314-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR314-P.svg.png",
      "id": "250px-SADC-road-sign-TR314-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR314-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR314.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR314.svg.png",
      "id": "250px-SADC-road-sign-TR314-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR314.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR315-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR315-P.svg.png",
      "id": "250px-SADC-road-sign-TR315-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR315-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR315.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR315.svg.png",
      "id": "250px-SADC-road-sign-TR315-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR315.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR316-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR316-P.svg.png",
      "id": "250px-SADC-road-sign-TR316-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR316-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR316.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR316.svg.png",
      "id": "250px-SADC-road-sign-TR316-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR316.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR317-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR317-P.svg.png",
      "id": "250px-SADC-road-sign-TR317-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR317-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR317.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR317.svg.png",
      "id": "250px-SADC-road-sign-TR317-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR317.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR318-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR318-P.svg.png",
      "id": "250px-SADC-road-sign-TR318-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR318-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR319-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR319-P.svg.png",
      "id": "250px-SADC-road-sign-TR319-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR319-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR319.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR319.svg.png",
      "id": "250px-SADC-road-sign-TR319-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR319.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR320-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR320-P.svg.png",
      "id": "250px-SADC-road-sign-TR320-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR320-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR320.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR320.svg.png",
      "id": "250px-SADC-road-sign-TR320-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR320.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR321-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR321-P.svg.png",
      "id": "250px-SADC-road-sign-TR321-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR321-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR321.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR321.svg.png",
      "id": "250px-SADC-road-sign-TR321-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR321.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322-NAM.svg.png",
      "id": "250px-SADC-road-sign-TR322-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322-P-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322-P-NAM.svg.png",
      "id": "250px-SADC-road-sign-TR322-P-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322-P-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322-P-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322-P-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR322-P-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322-P-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322-P.svg.png",
      "id": "250px-SADC-road-sign-TR322-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR322-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR322.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR322.svg.png",
      "id": "250px-SADC-road-sign-TR322-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR322.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR323-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR323-P.svg.png",
      "id": "250px-SADC-road-sign-TR323-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR323-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR323.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR323.svg.png",
      "id": "250px-SADC-road-sign-TR323-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR323.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR324-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR324-P.svg.png",
      "id": "250px-SADC-road-sign-TR324-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR324-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR324.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR324.svg.png",
      "id": "250px-SADC-road-sign-TR324-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR324.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR327-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR327-P.svg.png",
      "id": "250px-SADC-road-sign-TR327-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR327-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR327.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR327.svg.png",
      "id": "250px-SADC-road-sign-TR327-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR327.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR328.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR328.svg.png",
      "id": "250px-SADC-road-sign-TR328-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR328.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR329.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR329.svg.png",
      "id": "250px-SADC-road-sign-TR329-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR329.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR330-P.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR330-P.svg.png",
      "id": "250px-SADC-road-sign-TR330-P-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR330-P.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR330.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR330.svg.png",
      "id": "250px-SADC-road-sign-TR330-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR330.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR331.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR331.svg.png",
      "id": "250px-SADC-road-sign-TR331-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR331.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR332.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR332.svg.png",
      "id": "250px-SADC-road-sign-TR332-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR332.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR336.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR336.svg.png",
      "id": "250px-SADC-road-sign-TR336-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR336.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR337.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR337.svg.png",
      "id": "250px-SADC-road-sign-TR337-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR337.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR338.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR338.svg.png",
      "id": "250px-SADC-road-sign-TR338-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR338.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR339.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR339.svg.png",
      "id": "250px-SADC-road-sign-TR339-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR339.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR340.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR340.svg.png",
      "id": "250px-SADC-road-sign-TR340-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR340.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR342.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR342.svg.png",
      "id": "250px-SADC-road-sign-TR342-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR342.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR343.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR343.svg.png",
      "id": "250px-SADC-road-sign-TR343-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR343.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR348.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR348.svg.png",
      "id": "250px-SADC-road-sign-TR348-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR348.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR349.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR349.svg.png",
      "id": "250px-SADC-road-sign-TR349-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR349.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR350.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR350.svg.png",
      "id": "250px-SADC-road-sign-TR350-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR350.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR352.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR352.svg.png",
      "id": "250px-SADC-road-sign-TR352-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR352.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR353.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR353.svg.png",
      "id": "250px-SADC-road-sign-TR353-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR353.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR354.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR354.svg.png",
      "id": "250px-SADC-road-sign-TR354-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR354.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR401-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR401-600.svg.png",
      "id": "250px-SADC-road-sign-TR401-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR401-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR402-600.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR402-600.svg.png",
      "id": "250px-SADC-road-sign-TR402-600-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR402-600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR402.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR402.svg.png",
      "id": "250px-SADC-road-sign-TR402-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR402.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR503-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR503-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR503-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR503-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR503-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR503-B.svg.png",
      "id": "250px-SADC-road-sign-TR503-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR503-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR503-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR503-POR.svg.png",
      "id": "250px-SADC-road-sign-TR503-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR503-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR503.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR503.svg.png",
      "id": "250px-SADC-road-sign-TR503-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR503.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR504-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR504-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR504-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR504-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR504-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR504-B.svg.png",
      "id": "250px-SADC-road-sign-TR504-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR504-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR504-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR504-POR.svg.png",
      "id": "250px-SADC-road-sign-TR504-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR504-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR504.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR504.svg.png",
      "id": "250px-SADC-road-sign-TR504-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR504.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR505-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR505-POR.svg.png",
      "id": "250px-SADC-road-sign-TR505-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR505-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR505.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR505.svg.png",
      "id": "250px-SADC-road-sign-TR505-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR505.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR511-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR511-B.svg.png",
      "id": "250px-SADC-road-sign-TR511-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR511-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR511.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR511.svg.png",
      "id": "250px-SADC-road-sign-TR511-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR511.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR512-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR512-B.svg.png",
      "id": "250px-SADC-road-sign-TR512-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR512-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR512.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR512.svg.png",
      "id": "250px-SADC-road-sign-TR512-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR512.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR520-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR520-B.svg.png",
      "id": "250px-SADC-road-sign-TR520-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR520-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR520.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR520.svg.png",
      "id": "250px-SADC-road-sign-TR520-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR520.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR521-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR521-B.svg.png",
      "id": "250px-SADC-road-sign-TR521-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR521-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR521.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR521.svg.png",
      "id": "250px-SADC-road-sign-TR521-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR521.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR522-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR522-B.svg.png",
      "id": "250px-SADC-road-sign-TR522-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR522-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR522.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR522.svg.png",
      "id": "250px-SADC-road-sign-TR522-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR522.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR523.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR523.svg.png",
      "id": "250px-SADC-road-sign-TR523-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR523.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR530-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR530-B.svg.png",
      "id": "250px-SADC-road-sign-TR530-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR530-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR530.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR530.svg.png",
      "id": "250px-SADC-road-sign-TR530-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR530.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR531-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR531-B.svg.png",
      "id": "250px-SADC-road-sign-TR531-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR531-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR531.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR531.svg.png",
      "id": "250px-SADC-road-sign-TR531-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR531.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR533-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR533-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR533-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR533-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR533-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR533-B.svg.png",
      "id": "250px-SADC-road-sign-TR533-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR533-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR533-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR533-POR.svg.png",
      "id": "250px-SADC-road-sign-TR533-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR533-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR533.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR533.svg.png",
      "id": "250px-SADC-road-sign-TR533-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR533.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR534-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR534-POR.svg.png",
      "id": "250px-SADC-road-sign-TR534-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR534-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR534.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR534.svg.png",
      "id": "250px-SADC-road-sign-TR534-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR534.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR535-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR535-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR535-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR535-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR535-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR535-POR.svg.png",
      "id": "250px-SADC-road-sign-TR535-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR535-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR540.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR540.svg.png",
      "id": "250px-SADC-road-sign-TR540-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR540.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR560-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR560-B.svg.png",
      "id": "250px-SADC-road-sign-TR560-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR560-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR560.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR560.svg.png",
      "id": "250px-SADC-road-sign-TR560-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR560.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR561-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR561-B.svg.png",
      "id": "250px-SADC-road-sign-TR561-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR561-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR561.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR561.svg.png",
      "id": "250px-SADC-road-sign-TR561-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR561.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR562.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR562.svg.png",
      "id": "250px-SADC-road-sign-TR562-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR562.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR563-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR563-B.svg.png",
      "id": "250px-SADC-road-sign-TR563-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR563-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR563.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR563.svg.png",
      "id": "250px-SADC-road-sign-TR563-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR563.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR564-B-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR564-B-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR564-B-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR564-B-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR564-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR564-B.svg.png",
      "id": "250px-SADC-road-sign-TR564-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR564-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR564-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR564-RHT.svg.png",
      "id": "250px-SADC-road-sign-TR564-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR564-RHT.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR564.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR564.svg.png",
      "id": "250px-SADC-road-sign-TR564-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR564.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR565-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR565-B.svg.png",
      "id": "250px-SADC-road-sign-TR565-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR565-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR565.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR565.svg.png",
      "id": "250px-SADC-road-sign-TR565-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR565.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR566-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR566-B.svg.png",
      "id": "250px-SADC-road-sign-TR566-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR566-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR566.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR566.svg.png",
      "id": "250px-SADC-road-sign-TR566-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR566.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR567-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR567-B.svg.png",
      "id": "250px-SADC-road-sign-TR567-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR567-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR567.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR567.svg.png",
      "id": "250px-SADC-road-sign-TR567-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR567.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR568-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR568-B.svg.png",
      "id": "250px-SADC-road-sign-TR568-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR568-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR568.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR568.svg.png",
      "id": "250px-SADC-road-sign-TR568-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR568.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR569-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR569-B.svg.png",
      "id": "250px-SADC-road-sign-TR569-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR569-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR569.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR569.svg.png",
      "id": "250px-SADC-road-sign-TR569-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR569.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR570-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR570-B.svg.png",
      "id": "250px-SADC-road-sign-TR570-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR570-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR570.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR570.svg.png",
      "id": "250px-SADC-road-sign-TR570-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR570.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR571-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR571-B.svg.png",
      "id": "250px-SADC-road-sign-TR571-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR571-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR571.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR571.svg.png",
      "id": "250px-SADC-road-sign-TR571-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR571.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR572-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR572-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR572-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR572-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR572-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR572-B.svg.png",
      "id": "250px-SADC-road-sign-TR572-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR572-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR572.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR572.svg.png",
      "id": "250px-SADC-road-sign-TR572-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR572.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR573-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR573-B.svg.png",
      "id": "250px-SADC-road-sign-TR573-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR573-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR573.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR573.svg.png",
      "id": "250px-SADC-road-sign-TR573-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR573.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574-B-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574-B-POR.svg.png",
      "id": "250px-SADC-road-sign-TR574-B-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574-B-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574-B-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574-B-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR574-B-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574-B-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574-B.svg.png",
      "id": "250px-SADC-road-sign-TR574-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574-POR.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574-POR.svg.png",
      "id": "250px-SADC-road-sign-TR574-POR-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR574-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR574.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR574.svg.png",
      "id": "250px-SADC-road-sign-TR574-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR574.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR575-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR575-B.svg.png",
      "id": "250px-SADC-road-sign-TR575-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR575-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR575.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR575.svg.png",
      "id": "250px-SADC-road-sign-TR575-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR575.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR576-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR576-B.svg.png",
      "id": "250px-SADC-road-sign-TR576-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR576-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR576.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR576.svg.png",
      "id": "250px-SADC-road-sign-TR576-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR576.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577-B-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577-B-NAM.svg.png",
      "id": "250px-SADC-road-sign-TR577-B-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577-B-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577-B-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577-B-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR577-B-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577-B-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577-B.svg.png",
      "id": "250px-SADC-road-sign-TR577-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577-NAM.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577-NAM.svg.png",
      "id": "250px-SADC-road-sign-TR577-NAM-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577-NAM.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577-RSA.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577-RSA.svg.png",
      "id": "250px-SADC-road-sign-TR577-RSA-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR577.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR577.svg.png",
      "id": "250px-SADC-road-sign-TR577-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR577.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR578-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR578-B.svg.png",
      "id": "250px-SADC-road-sign-TR578-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR578-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR578.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR578.svg.png",
      "id": "250px-SADC-road-sign-TR578-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR578.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR579-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR579-B.svg.png",
      "id": "250px-SADC-road-sign-TR579-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR579-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR579.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR579.svg.png",
      "id": "250px-SADC-road-sign-TR579-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR579.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR580-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR580-B.svg.png",
      "id": "250px-SADC-road-sign-TR580-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR580-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR580.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR580.svg.png",
      "id": "250px-SADC-road-sign-TR580-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR580.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR581-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR581-B.svg.png",
      "id": "250px-SADC-road-sign-TR581-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR581-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR581.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR581.svg.png",
      "id": "250px-SADC-road-sign-TR581-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR581.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR582-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR582-B.svg.png",
      "id": "250px-SADC-road-sign-TR582-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR582-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR582.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR582.svg.png",
      "id": "250px-SADC-road-sign-TR582-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR582.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR583-B.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR583-B.svg.png",
      "id": "250px-SADC-road-sign-TR583-B-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR583-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TR583.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TR583.svg.png",
      "id": "250px-SADC-road-sign-TR583-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TR583.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW101.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW101.svg.png",
      "id": "250px-SADC-road-sign-TW101-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW101.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW102-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW102-TAN.svg.png",
      "id": "250px-SADC-road-sign-TW102-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW102-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW102.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW102.svg.png",
      "id": "250px-SADC-road-sign-TW102-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW102.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW104.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW104.svg.png",
      "id": "250px-SADC-road-sign-TW104-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW104.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW105.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW105.svg.png",
      "id": "250px-SADC-road-sign-TW105-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW105.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW106.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW106.svg.png",
      "id": "250px-SADC-road-sign-TW106-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW106.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW107-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW107-TAN.svg.png",
      "id": "250px-SADC-road-sign-TW107-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW107-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW108-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW108-TAN.svg.png",
      "id": "250px-SADC-road-sign-TW108-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW108-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW108.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW108.svg.png",
      "id": "250px-SADC-road-sign-TW108-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW108.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW109-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW109-TAN.svg.png",
      "id": "250px-SADC-road-sign-TW109-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW109-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW109.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW109.svg.png",
      "id": "250px-SADC-road-sign-TW109-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW109.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW110-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW110-TAN.svg.png",
      "id": "250px-SADC-road-sign-TW110-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW110-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW110.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW110.svg.png",
      "id": "250px-SADC-road-sign-TW110-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW110.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW111.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW111.svg.png",
      "id": "250px-SADC-road-sign-TW111-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW111.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW112.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW112.svg.png",
      "id": "250px-SADC-road-sign-TW112-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW112.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW113.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW113.svg.png",
      "id": "250px-SADC-road-sign-TW113-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW113.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW114.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW114.svg.png",
      "id": "250px-SADC-road-sign-TW114-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW114.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW115.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW115.svg.png",
      "id": "250px-SADC-road-sign-TW115-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW115.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW116.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW116.svg.png",
      "id": "250px-SADC-road-sign-TW116-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW116.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW117.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW117.svg.png",
      "id": "250px-SADC-road-sign-TW117-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW117.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW118.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW118.svg.png",
      "id": "250px-SADC-road-sign-TW118-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW118.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW119.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW119.svg.png",
      "id": "250px-SADC-road-sign-TW119-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW119.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW201-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW201-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW201-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW201-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW201.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW201.svg.png",
      "id": "250px-SADC-road-sign-TW201-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW201.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW202.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW202.svg.png",
      "id": "250px-SADC-road-sign-TW202-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW202.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW203.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW203.svg.png",
      "id": "250px-SADC-road-sign-TW203-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW203.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW204.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW204.svg.png",
      "id": "250px-SADC-road-sign-TW204-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW204.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW205.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW205.svg.png",
      "id": "250px-SADC-road-sign-TW205-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW205.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW206.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW206.svg.png",
      "id": "250px-SADC-road-sign-TW206-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW206.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW207.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW207.svg.png",
      "id": "250px-SADC-road-sign-TW207-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW207.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW208.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW208.svg.png",
      "id": "250px-SADC-road-sign-TW208-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW208.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW209.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW209.svg.png",
      "id": "250px-SADC-road-sign-TW209-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW209.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW210.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW210.svg.png",
      "id": "250px-SADC-road-sign-TW210-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW210.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW211.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW211.svg.png",
      "id": "250px-SADC-road-sign-TW211-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW211.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW212-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW212-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW212-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW212-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW212.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW212.svg.png",
      "id": "250px-SADC-road-sign-TW212-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW212.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW213-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW213-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW213-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW213-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW213.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW213.svg.png",
      "id": "250px-SADC-road-sign-TW213-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW213.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW214.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW214.svg.png",
      "id": "250px-SADC-road-sign-TW214-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW214.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW215.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW215.svg.png",
      "id": "250px-SADC-road-sign-TW215-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW215.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW216.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW216.svg.png",
      "id": "250px-SADC-road-sign-TW216-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW216.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW217.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW217.svg.png",
      "id": "250px-SADC-road-sign-TW217-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW217.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW218.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW218.svg.png",
      "id": "250px-SADC-road-sign-TW218-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW218.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW301.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW301.svg.png",
      "id": "250px-SADC-road-sign-TW301-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW301.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW302.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW302.svg.png",
      "id": "250px-SADC-road-sign-TW302-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW302.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW303.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW303.svg.png",
      "id": "250px-SADC-road-sign-TW303-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW303.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW304.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW304.svg.png",
      "id": "250px-SADC-road-sign-TW304-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW304.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW305-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW305-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW305-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW305-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW305.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW305.svg.png",
      "id": "250px-SADC-road-sign-TW305-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW305.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW306-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW306-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW306-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW306-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW306.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW306.svg.png",
      "id": "250px-SADC-road-sign-TW306-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW306.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW307-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW307-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW307-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW307-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW307.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW307.svg.png",
      "id": "250px-SADC-road-sign-TW307-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW307.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW308-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW308-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW308-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW308-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW308.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW308.svg.png",
      "id": "250px-SADC-road-sign-TW308-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW308.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW309-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW309-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW309-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW309-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW309.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW309.svg.png",
      "id": "250px-SADC-road-sign-TW309-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW309.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW310-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW310-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW310-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW310-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW310.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW310.svg.png",
      "id": "250px-SADC-road-sign-TW310-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW310.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW311-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW311-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW311-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW311-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW311.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW311.svg.png",
      "id": "250px-SADC-road-sign-TW311-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW311.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW312.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW312.svg.png",
      "id": "250px-SADC-road-sign-TW312-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW312.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW313-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW313-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW313-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW313-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW313.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW313.svg.png",
      "id": "250px-SADC-road-sign-TW313-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW313.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW314.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW314.svg.png",
      "id": "250px-SADC-road-sign-TW314-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW314.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW315.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW315.svg.png",
      "id": "250px-SADC-road-sign-TW315-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW315.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW316.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW316.svg.png",
      "id": "250px-SADC-road-sign-TW316-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW316.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW317.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW317.svg.png",
      "id": "250px-SADC-road-sign-TW317-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW317.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW318.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW318.svg.png",
      "id": "250px-SADC-road-sign-TW318-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW318.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW322.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW322.svg.png",
      "id": "250px-SADC-road-sign-TW322-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW322.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW325.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW325.svg.png",
      "id": "250px-SADC-road-sign-TW325-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW325.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW326.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW326.svg.png",
      "id": "250px-SADC-road-sign-TW326-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW326.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW327-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW327-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW327-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW327-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW327.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW327.svg.png",
      "id": "250px-SADC-road-sign-TW327-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW327.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW328.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW328.svg.png",
      "id": "250px-SADC-road-sign-TW328-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW328.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW329.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW329.svg.png",
      "id": "250px-SADC-road-sign-TW329-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW329.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW330.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW330.svg.png",
      "id": "250px-SADC-road-sign-TW330-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW330.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW331.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW331.svg.png",
      "id": "250px-SADC-road-sign-TW331-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW331.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW332.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW332.svg.png",
      "id": "250px-SADC-road-sign-TW332-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW332.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW333.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW333.svg.png",
      "id": "250px-SADC-road-sign-TW333-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW333.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW334.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW334.svg.png",
      "id": "250px-SADC-road-sign-TW334-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW334.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW335.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW335.svg.png",
      "id": "250px-SADC-road-sign-TW335-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW335.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW336.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW336.svg.png",
      "id": "250px-SADC-road-sign-TW336-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW336.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW337.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW337.svg.png",
      "id": "250px-SADC-road-sign-TW337-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW337.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW338-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW338-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW338-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW338-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW338.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW338.svg.png",
      "id": "250px-SADC-road-sign-TW338-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW338.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW339.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW339.svg.png",
      "id": "250px-SADC-road-sign-TW339-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW339.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW340.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW340.svg.png",
      "id": "250px-SADC-road-sign-TW340-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW340.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW341.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW341.svg.png",
      "id": "250px-SADC-road-sign-TW341-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW341.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW342-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW342-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW342-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW342-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW342.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW342.svg.png",
      "id": "250px-SADC-road-sign-TW342-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW342.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW343.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW343.svg.png",
      "id": "250px-SADC-road-sign-TW343-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW343.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW344.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW344.svg.png",
      "id": "250px-SADC-road-sign-TW344-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW344.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW346.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW346.svg.png",
      "id": "250px-SADC-road-sign-TW346-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW346.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW347.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW347.svg.png",
      "id": "250px-SADC-road-sign-TW347-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW347.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW348-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW348-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW348-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW348-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW348.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW348.svg.png",
      "id": "250px-SADC-road-sign-TW348-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW348.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW350.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW350.svg.png",
      "id": "250px-SADC-road-sign-TW350-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW350.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW352-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW352-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW352-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW352-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW352.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW352.svg.png",
      "id": "250px-SADC-road-sign-TW352-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW352.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW353.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW353.svg.png",
      "id": "250px-SADC-road-sign-TW353-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW353.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW354.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW354.svg.png",
      "id": "250px-SADC-road-sign-TW354-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW354.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW355.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW355.svg.png",
      "id": "250px-SADC-road-sign-TW355-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW355.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW356-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW356-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW356-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW356-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW356.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW356.svg.png",
      "id": "250px-SADC-road-sign-TW356-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW356.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW357-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW357-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW357-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW357-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW357.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW357.svg.png",
      "id": "250px-SADC-road-sign-TW357-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW357.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW358-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW358-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW358-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW358-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW358.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW358.svg.png",
      "id": "250px-SADC-road-sign-TW358-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW358.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW359-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW359-RHT.svg.png",
      "id": "250px-SADC-road-sign-TW359-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW359-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW359.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW359.svg.png",
      "id": "250px-SADC-road-sign-TW359-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW359.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW360.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW360.svg.png",
      "id": "250px-SADC-road-sign-TW360-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW360.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW361.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW361.svg.png",
      "id": "250px-SADC-road-sign-TW361-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW361.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW363.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW363.svg.png",
      "id": "250px-SADC-road-sign-TW363-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW363.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW405.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW405.svg.png",
      "id": "250px-SADC-road-sign-TW405-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW405.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_TW406.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_TW406.svg.png",
      "id": "250px-SADC-road-sign-TW406-svg",
      "description": "South African road sign - 250px-SADC_road_sign_TW406.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W000_(sand).svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W000_(sand).svg.png",
      "id": "250px-SADC-road-sign-W000--sand--svg",
      "description": "South African road sign - 250px-SADC_road_sign_W000_(sand).svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W000_(wind).svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W000_(wind).svg.png",
      "id": "250px-SADC-road-sign-W000--wind--svg",
      "description": "South African road sign - 250px-SADC_road_sign_W000_(wind).svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W102-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W102-TAN.svg.png",
      "id": "250px-SADC-road-sign-W102-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W102-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W102.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W102.svg.png",
      "id": "250px-SADC-road-sign-W102-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W102.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W103.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W103.svg.png",
      "id": "250px-SADC-road-sign-W103-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W103.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W104.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W104.svg.png",
      "id": "250px-SADC-road-sign-W104-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W104.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W105.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W105.svg.png",
      "id": "250px-SADC-road-sign-W105-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W105.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W106.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W106.svg.png",
      "id": "250px-SADC-road-sign-W106-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W106.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W107-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W107-TAN.svg.png",
      "id": "250px-SADC-road-sign-W107-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W107-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W107.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W107.svg.png",
      "id": "250px-SADC-road-sign-W107-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W107.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W108-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W108-TAN.svg.png",
      "id": "250px-SADC-road-sign-W108-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W108-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W109-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W109-TAN.svg.png",
      "id": "250px-SADC-road-sign-W109-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W109-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W109.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W109.svg.png",
      "id": "250px-SADC-road-sign-W109-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W109.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W110-TAN.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W110-TAN.svg.png",
      "id": "250px-SADC-road-sign-W110-TAN-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W110-TAN.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W110.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W110.svg.png",
      "id": "250px-SADC-road-sign-W110-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W110.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W111.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W111.svg.png",
      "id": "250px-SADC-road-sign-W111-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W111.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W112.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W112.svg.png",
      "id": "250px-SADC-road-sign-W112-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W112.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W113.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W113.svg.png",
      "id": "250px-SADC-road-sign-W113-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W113.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W114.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W114.svg.png",
      "id": "250px-SADC-road-sign-W114-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W114.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W115.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W115.svg.png",
      "id": "250px-SADC-road-sign-W115-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W115.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W116.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W116.svg.png",
      "id": "250px-SADC-road-sign-W116-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W116.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W117.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W117.svg.png",
      "id": "250px-SADC-road-sign-W117-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W117.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W118.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W118.svg.png",
      "id": "250px-SADC-road-sign-W118-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W118.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W119.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W119.svg.png",
      "id": "250px-SADC-road-sign-W119-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W119.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W201-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W201-RHT.svg.png",
      "id": "250px-SADC-road-sign-W201-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W201-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W201.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W201.svg.png",
      "id": "250px-SADC-road-sign-W201-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W201.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W202.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W202.svg.png",
      "id": "250px-SADC-road-sign-W202-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W202.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W203.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W203.svg.png",
      "id": "250px-SADC-road-sign-W203-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W203.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W204.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W204.svg.png",
      "id": "250px-SADC-road-sign-W204-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W204.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W206.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W206.svg.png",
      "id": "250px-SADC-road-sign-W206-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W206.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W207.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W207.svg.png",
      "id": "250px-SADC-road-sign-W207-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W207.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W208.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W208.svg.png",
      "id": "250px-SADC-road-sign-W208-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W208.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W209.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W209.svg.png",
      "id": "250px-SADC-road-sign-W209-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W209.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W210.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W210.svg.png",
      "id": "250px-SADC-road-sign-W210-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W210.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W211.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W211.svg.png",
      "id": "250px-SADC-road-sign-W211-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W211.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W212-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W212-RHT.svg.png",
      "id": "250px-SADC-road-sign-W212-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W212-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W212.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W212.svg.png",
      "id": "250px-SADC-road-sign-W212-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W212.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W213-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W213-RHT.svg.png",
      "id": "250px-SADC-road-sign-W213-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W213-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W213.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W213.svg.png",
      "id": "250px-SADC-road-sign-W213-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W213.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W215.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W215.svg.png",
      "id": "250px-SADC-road-sign-W215-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W215.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W217.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W217.svg.png",
      "id": "250px-SADC-road-sign-W217-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W217.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W218.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W218.svg.png",
      "id": "250px-SADC-road-sign-W218-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W218.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W302.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W302.svg.png",
      "id": "250px-SADC-road-sign-W302-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W302.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W303.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W303.svg.png",
      "id": "250px-SADC-road-sign-W303-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W303.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W306-Fluorescent.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W306-Fluorescent.svg.png",
      "id": "250px-SADC-road-sign-W306-Fluorescent-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W306-Fluorescent.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W306-RHT-Fluorescent.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W306-RHT-Fluorescent.svg.png",
      "id": "250px-SADC-road-sign-W306-RHT-Fluorescent-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W306-RHT-Fluorescent.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W306-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W306-RHT.svg.png",
      "id": "250px-SADC-road-sign-W306-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W306-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W307.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W307.svg.png",
      "id": "250px-SADC-road-sign-W307-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W307.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W308-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W308-RHT.svg.png",
      "id": "250px-SADC-road-sign-W308-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W308-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W308.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W308.svg.png",
      "id": "250px-SADC-road-sign-W308-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W308.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W308_IN11.4_(School).svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W308_IN11.4_(School).svg.png",
      "id": "250px-SADC-road-sign-W308-IN11-4--School--svg",
      "description": "South African road sign - 250px-SADC_road_sign_W308_IN11.4_(School).svg",
      "context": ["warning","information","school-zone"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W309-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W309-RHT.svg.png",
      "id": "250px-SADC-road-sign-W309-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W309-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W309.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W309.svg.png",
      "id": "250px-SADC-road-sign-W309-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W309.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W310-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W310-RHT.svg.png",
      "id": "250px-SADC-road-sign-W310-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W310-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W310.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W310.svg.png",
      "id": "250px-SADC-road-sign-W310-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W310.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W311-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W311-RHT.svg.png",
      "id": "250px-SADC-road-sign-W311-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W311-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W311.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W311.svg.png",
      "id": "250px-SADC-road-sign-W311-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W311.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W312-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W312-RHT.svg.png",
      "id": "250px-SADC-road-sign-W312-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W312-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W312.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W312.svg.png",
      "id": "250px-SADC-road-sign-W312-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W312.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W313-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W313-RHT.svg.png",
      "id": "250px-SADC-road-sign-W313-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W313-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W313.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W313.svg.png",
      "id": "250px-SADC-road-sign-W313-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W313.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W314.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W314.svg.png",
      "id": "250px-SADC-road-sign-W314-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W314.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W315.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W315.svg.png",
      "id": "250px-SADC-road-sign-W315-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W315.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W316.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W316.svg.png",
      "id": "250px-SADC-road-sign-W316-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W316.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W317.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W317.svg.png",
      "id": "250px-SADC-road-sign-W317-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W317.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W318-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W318-RHT.svg.png",
      "id": "250px-SADC-road-sign-W318-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W318-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W318.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W318.svg.png",
      "id": "250px-SADC-road-sign-W318-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W318.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W319.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W319.svg.png",
      "id": "250px-SADC-road-sign-W319-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W319.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W320.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W320.svg.png",
      "id": "250px-SADC-road-sign-W320-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W320.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W321.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W321.svg.png",
      "id": "250px-SADC-road-sign-W321-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W321.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W322.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W322.svg.png",
      "id": "250px-SADC-road-sign-W322-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W322.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W323.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W323.svg.png",
      "id": "250px-SADC-road-sign-W323-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W323.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W324.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W324.svg.png",
      "id": "250px-SADC-road-sign-W324-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W324.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W325.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W325.svg.png",
      "id": "250px-SADC-road-sign-W325-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W325.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W326.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W326.svg.png",
      "id": "250px-SADC-road-sign-W326-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W326.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W327-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W327-RHT.svg.png",
      "id": "250px-SADC-road-sign-W327-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W327-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W327.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W327.svg.png",
      "id": "250px-SADC-road-sign-W327-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W327.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W328.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W328.svg.png",
      "id": "250px-SADC-road-sign-W328-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W328.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W329.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W329.svg.png",
      "id": "250px-SADC-road-sign-W329-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W329.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W330.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W330.svg.png",
      "id": "250px-SADC-road-sign-W330-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W330.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W331.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W331.svg.png",
      "id": "250px-SADC-road-sign-W331-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W331.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W332.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W332.svg.png",
      "id": "250px-SADC-road-sign-W332-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W332.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W333.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W333.svg.png",
      "id": "250px-SADC-road-sign-W333-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W333.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W334.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W334.svg.png",
      "id": "250px-SADC-road-sign-W334-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W334.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W335.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W335.svg.png",
      "id": "250px-SADC-road-sign-W335-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W335.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W339.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W339.svg.png",
      "id": "250px-SADC-road-sign-W339-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W339.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W346.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W346.svg.png",
      "id": "250px-SADC-road-sign-W346-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W346.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W348-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W348-RHT.svg.png",
      "id": "250px-SADC-road-sign-W348-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W348-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W348.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W348.svg.png",
      "id": "250px-SADC-road-sign-W348-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W348.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W349.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W349.svg.png",
      "id": "250px-SADC-road-sign-W349-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W349.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W350.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W350.svg.png",
      "id": "250px-SADC-road-sign-W350-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W350.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W351.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W351.svg.png",
      "id": "250px-SADC-road-sign-W351-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W351.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W352-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W352-RHT.svg.png",
      "id": "250px-SADC-road-sign-W352-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W352-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W352.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W352.svg.png",
      "id": "250px-SADC-road-sign-W352-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W352.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W354.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W354.svg.png",
      "id": "250px-SADC-road-sign-W354-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W354.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W355.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W355.svg.png",
      "id": "250px-SADC-road-sign-W355-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W355.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W356-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W356-RHT.svg.png",
      "id": "250px-SADC-road-sign-W356-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W356-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W356.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W356.svg.png",
      "id": "250px-SADC-road-sign-W356-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W356.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W357-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W357-RHT.svg.png",
      "id": "250px-SADC-road-sign-W357-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W357-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W357.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W357.svg.png",
      "id": "250px-SADC-road-sign-W357-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W357.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W358-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W358-RHT.svg.png",
      "id": "250px-SADC-road-sign-W358-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W358-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W358.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W358.svg.png",
      "id": "250px-SADC-road-sign-W358-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W358.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W359-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W359-RHT.svg.png",
      "id": "250px-SADC-road-sign-W359-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W359-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W359.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W359.svg.png",
      "id": "250px-SADC-road-sign-W359-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W359.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W360.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W360.svg.png",
      "id": "250px-SADC-road-sign-W360-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W360.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W361.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W361.svg.png",
      "id": "250px-SADC-road-sign-W361-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W361.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W362-RHT.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W362-RHT.svg.png",
      "id": "250px-SADC-road-sign-W362-RHT-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W362-RHT.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W362.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W362.svg.png",
      "id": "250px-SADC-road-sign-W362-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W362.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W363.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W363.svg.png",
      "id": "250px-SADC-road-sign-W363-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W363.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W365.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W365.svg.png",
      "id": "250px-SADC-road-sign-W365-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W365.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W404.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W404.svg.png",
      "id": "250px-SADC-road-sign-W404-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W404.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W405.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W405.svg.png",
      "id": "250px-SADC-road-sign-W405-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W405.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SADC_road_sign_W406.svg.png",
      "path": "/images/signs/250px-SADC_road_sign_W406.svg.png",
      "id": "250px-SADC-road-sign-W406-svg",
      "description": "South African road sign - 250px-SADC_road_sign_W406.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N1.svg.png",
      "path": "/images/signs/250px-SA_road_N1.svg.png",
      "id": "250px-SA-road-N1-svg",
      "description": "South African road marker - 250px-SA_road_N1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N10.svg.png",
      "path": "/images/signs/250px-SA_road_N10.svg.png",
      "id": "250px-SA-road-N10-svg",
      "description": "South African road marker - 250px-SA_road_N10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N11.svg.png",
      "path": "/images/signs/250px-SA_road_N11.svg.png",
      "id": "250px-SA-road-N11-svg",
      "description": "South African road marker - 250px-SA_road_N11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N12.svg.png",
      "path": "/images/signs/250px-SA_road_N12.svg.png",
      "id": "250px-SA-road-N12-svg",
      "description": "South African road marker - 250px-SA_road_N12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N14.svg.png",
      "path": "/images/signs/250px-SA_road_N14.svg.png",
      "id": "250px-SA-road-N14-svg",
      "description": "South African road marker - 250px-SA_road_N14.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N17.svg.png",
      "path": "/images/signs/250px-SA_road_N17.svg.png",
      "id": "250px-SA-road-N17-svg",
      "description": "South African road marker - 250px-SA_road_N17.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N18.svg.png",
      "path": "/images/signs/250px-SA_road_N18.svg.png",
      "id": "250px-SA-road-N18-svg",
      "description": "South African road marker - 250px-SA_road_N18.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N2.svg.png",
      "path": "/images/signs/250px-SA_road_N2.svg.png",
      "id": "250px-SA-road-N2-svg",
      "description": "South African road marker - 250px-SA_road_N2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N21.svg.png",
      "path": "/images/signs/250px-SA_road_N21.svg.png",
      "id": "250px-SA-road-N21-svg",
      "description": "South African road marker - 250px-SA_road_N21.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N3.svg.png",
      "path": "/images/signs/250px-SA_road_N3.svg.png",
      "id": "250px-SA-road-N3-svg",
      "description": "South African road marker - 250px-SA_road_N3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N4.svg.png",
      "path": "/images/signs/250px-SA_road_N4.svg.png",
      "id": "250px-SA-road-N4-svg",
      "description": "South African road marker - 250px-SA_road_N4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N5.svg.png",
      "path": "/images/signs/250px-SA_road_N5.svg.png",
      "id": "250px-SA-road-N5-svg",
      "description": "South African road marker - 250px-SA_road_N5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N6.svg.png",
      "path": "/images/signs/250px-SA_road_N6.svg.png",
      "id": "250px-SA-road-N6-svg",
      "description": "South African road marker - 250px-SA_road_N6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N7.svg.png",
      "path": "/images/signs/250px-SA_road_N7.svg.png",
      "id": "250px-SA-road-N7-svg",
      "description": "South African road marker - 250px-SA_road_N7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N8.svg.png",
      "path": "/images/signs/250px-SA_road_N8.svg.png",
      "id": "250px-SA-road-N8-svg",
      "description": "South African road marker - 250px-SA_road_N8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_N9.svg.png",
      "path": "/images/signs/250px-SA_road_N9.svg.png",
      "id": "250px-SA-road-N9-svg",
      "description": "South African road marker - 250px-SA_road_N9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R.svg.png",
      "path": "/images/signs/250px-SA_road_R.svg.png",
      "id": "250px-SA-road-R-svg",
      "description": "South African road marker - 250px-SA_road_R.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R101.svg.png",
      "path": "/images/signs/250px-SA_road_R101.svg.png",
      "id": "250px-SA-road-R101-svg",
      "description": "South African road marker - 250px-SA_road_R101.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R102.svg.png",
      "path": "/images/signs/250px-SA_road_R102.svg.png",
      "id": "250px-SA-road-R102-svg",
      "description": "South African road marker - 250px-SA_road_R102.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R103.svg.png",
      "path": "/images/signs/250px-SA_road_R103.svg.png",
      "id": "250px-SA-road-R103-svg",
      "description": "South African road marker - 250px-SA_road_R103.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R104.svg.png",
      "path": "/images/signs/250px-SA_road_R104.svg.png",
      "id": "250px-SA-road-R104-svg",
      "description": "South African road marker - 250px-SA_road_R104.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R105.svg.png",
      "path": "/images/signs/250px-SA_road_R105.svg.png",
      "id": "250px-SA-road-R105-svg",
      "description": "South African road marker - 250px-SA_road_R105.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R106.svg.png",
      "path": "/images/signs/250px-SA_road_R106.svg.png",
      "id": "250px-SA-road-R106-svg",
      "description": "South African road marker - 250px-SA_road_R106.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R107.svg.png",
      "path": "/images/signs/250px-SA_road_R107.svg.png",
      "id": "250px-SA-road-R107-svg",
      "description": "South African road marker - 250px-SA_road_R107.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R108.svg.png",
      "path": "/images/signs/250px-SA_road_R108.svg.png",
      "id": "250px-SA-road-R108-svg",
      "description": "South African road marker - 250px-SA_road_R108.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R109.svg.png",
      "path": "/images/signs/250px-SA_road_R109.svg.png",
      "id": "250px-SA-road-R109-svg",
      "description": "South African road marker - 250px-SA_road_R109.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R111.svg.png",
      "path": "/images/signs/250px-SA_road_R111.svg.png",
      "id": "250px-SA-road-R111-svg",
      "description": "South African road marker - 250px-SA_road_R111.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R112.svg.png",
      "path": "/images/signs/250px-SA_road_R112.svg.png",
      "id": "250px-SA-road-R112-svg",
      "description": "South African road marker - 250px-SA_road_R112.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R113.svg.png",
      "path": "/images/signs/250px-SA_road_R113.svg.png",
      "id": "250px-SA-road-R113-svg",
      "description": "South African road marker - 250px-SA_road_R113.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R114.svg.png",
      "path": "/images/signs/250px-SA_road_R114.svg.png",
      "id": "250px-SA-road-R114-svg",
      "description": "South African road marker - 250px-SA_road_R114.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R115.svg.png",
      "path": "/images/signs/250px-SA_road_R115.svg.png",
      "id": "250px-SA-road-R115-svg",
      "description": "South African road marker - 250px-SA_road_R115.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R116.svg.png",
      "path": "/images/signs/250px-SA_road_R116.svg.png",
      "id": "250px-SA-road-R116-svg",
      "description": "South African road marker - 250px-SA_road_R116.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R117.svg.png",
      "path": "/images/signs/250px-SA_road_R117.svg.png",
      "id": "250px-SA-road-R117-svg",
      "description": "South African road marker - 250px-SA_road_R117.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R118.svg.png",
      "path": "/images/signs/250px-SA_road_R118.svg.png",
      "id": "250px-SA-road-R118-svg",
      "description": "South African road marker - 250px-SA_road_R118.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R120.svg.png",
      "path": "/images/signs/250px-SA_road_R120.svg.png",
      "id": "250px-SA-road-R120-svg",
      "description": "South African road marker - 250px-SA_road_R120.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R154.svg.png",
      "path": "/images/signs/250px-SA_road_R154.svg.png",
      "id": "250px-SA-road-R154-svg",
      "description": "South African road marker - 250px-SA_road_R154.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R21.svg.png",
      "path": "/images/signs/250px-SA_road_R21.svg.png",
      "id": "250px-SA-road-R21-svg",
      "description": "South African road marker - 250px-SA_road_R21.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R22.svg.png",
      "path": "/images/signs/250px-SA_road_R22.svg.png",
      "id": "250px-SA-road-R22-svg",
      "description": "South African road marker - 250px-SA_road_R22.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R23.svg.png",
      "path": "/images/signs/250px-SA_road_R23.svg.png",
      "id": "250px-SA-road-R23-svg",
      "description": "South African road marker - 250px-SA_road_R23.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R24.svg.png",
      "path": "/images/signs/250px-SA_road_R24.svg.png",
      "id": "250px-SA-road-R24-svg",
      "description": "South African road marker - 250px-SA_road_R24.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R25.svg.png",
      "path": "/images/signs/250px-SA_road_R25.svg.png",
      "id": "250px-SA-road-R25-svg",
      "description": "South African road marker - 250px-SA_road_R25.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R26.svg.png",
      "path": "/images/signs/250px-SA_road_R26.svg.png",
      "id": "250px-SA-road-R26-svg",
      "description": "South African road marker - 250px-SA_road_R26.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R27.svg.png",
      "path": "/images/signs/250px-SA_road_R27.svg.png",
      "id": "250px-SA-road-R27-svg",
      "description": "South African road marker - 250px-SA_road_R27.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R28.svg.png",
      "path": "/images/signs/250px-SA_road_R28.svg.png",
      "id": "250px-SA-road-R28-svg",
      "description": "South African road marker - 250px-SA_road_R28.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R29.svg.png",
      "path": "/images/signs/250px-SA_road_R29.svg.png",
      "id": "250px-SA-road-R29-svg",
      "description": "South African road marker - 250px-SA_road_R29.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R30.svg.png",
      "path": "/images/signs/250px-SA_road_R30.svg.png",
      "id": "250px-SA-road-R30-svg",
      "description": "South African road marker - 250px-SA_road_R30.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R300.svg.png",
      "path": "/images/signs/250px-SA_road_R300.svg.png",
      "id": "250px-SA-road-R300-svg",
      "description": "South African road marker - 250px-SA_road_R300.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R302.svg.png",
      "path": "/images/signs/250px-SA_road_R302.svg.png",
      "id": "250px-SA-road-R302-svg",
      "description": "South African road marker - 250px-SA_road_R302.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R303.svg.png",
      "path": "/images/signs/250px-SA_road_R303.svg.png",
      "id": "250px-SA-road-R303-svg",
      "description": "South African road marker - 250px-SA_road_R303.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R304.svg.png",
      "path": "/images/signs/250px-SA_road_R304.svg.png",
      "id": "250px-SA-road-R304-svg",
      "description": "South African road marker - 250px-SA_road_R304.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R305.svg.png",
      "path": "/images/signs/250px-SA_road_R305.svg.png",
      "id": "250px-SA-road-R305-svg",
      "description": "South African road marker - 250px-SA_road_R305.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R306.svg.png",
      "path": "/images/signs/250px-SA_road_R306.svg.png",
      "id": "250px-SA-road-R306-svg",
      "description": "South African road marker - 250px-SA_road_R306.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R307.svg.png",
      "path": "/images/signs/250px-SA_road_R307.svg.png",
      "id": "250px-SA-road-R307-svg",
      "description": "South African road marker - 250px-SA_road_R307.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R308.svg.png",
      "path": "/images/signs/250px-SA_road_R308.svg.png",
      "id": "250px-SA-road-R308-svg",
      "description": "South African road marker - 250px-SA_road_R308.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R309.svg.png",
      "path": "/images/signs/250px-SA_road_R309.svg.png",
      "id": "250px-SA-road-R309-svg",
      "description": "South African road marker - 250px-SA_road_R309.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R31.svg.png",
      "path": "/images/signs/250px-SA_road_R31.svg.png",
      "id": "250px-SA-road-R31-svg",
      "description": "South African road marker - 250px-SA_road_R31.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R310.svg.png",
      "path": "/images/signs/250px-SA_road_R310.svg.png",
      "id": "250px-SA-road-R310-svg",
      "description": "South African road marker - 250px-SA_road_R310.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R311.svg.png",
      "path": "/images/signs/250px-SA_road_R311.svg.png",
      "id": "250px-SA-road-R311-svg",
      "description": "South African road marker - 250px-SA_road_R311.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R313.svg.png",
      "path": "/images/signs/250px-SA_road_R313.svg.png",
      "id": "250px-SA-road-R313-svg",
      "description": "South African road marker - 250px-SA_road_R313.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R315.svg.png",
      "path": "/images/signs/250px-SA_road_R315.svg.png",
      "id": "250px-SA-road-R315-svg",
      "description": "South African road marker - 250px-SA_road_R315.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R316.svg.png",
      "path": "/images/signs/250px-SA_road_R316.svg.png",
      "id": "250px-SA-road-R316-svg",
      "description": "South African road marker - 250px-SA_road_R316.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R317.svg.png",
      "path": "/images/signs/250px-SA_road_R317.svg.png",
      "id": "250px-SA-road-R317-svg",
      "description": "South African road marker - 250px-SA_road_R317.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R318.svg.png",
      "path": "/images/signs/250px-SA_road_R318.svg.png",
      "id": "250px-SA-road-R318-svg",
      "description": "South African road marker - 250px-SA_road_R318.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R319.svg.png",
      "path": "/images/signs/250px-SA_road_R319.svg.png",
      "id": "250px-SA-road-R319-svg",
      "description": "South African road marker - 250px-SA_road_R319.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R32.svg.png",
      "path": "/images/signs/250px-SA_road_R32.svg.png",
      "id": "250px-SA-road-R32-svg",
      "description": "South African road marker - 250px-SA_road_R32.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R321.svg.png",
      "path": "/images/signs/250px-SA_road_R321.svg.png",
      "id": "250px-SA-road-R321-svg",
      "description": "South African road marker - 250px-SA_road_R321.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R322.svg.png",
      "path": "/images/signs/250px-SA_road_R322.svg.png",
      "id": "250px-SA-road-R322-svg",
      "description": "South African road marker - 250px-SA_road_R322.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R323.svg.png",
      "path": "/images/signs/250px-SA_road_R323.svg.png",
      "id": "250px-SA-road-R323-svg",
      "description": "South African road marker - 250px-SA_road_R323.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R324.svg.png",
      "path": "/images/signs/250px-SA_road_R324.svg.png",
      "id": "250px-SA-road-R324-svg",
      "description": "South African road marker - 250px-SA_road_R324.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R325.svg.png",
      "path": "/images/signs/250px-SA_road_R325.svg.png",
      "id": "250px-SA-road-R325-svg",
      "description": "South African road marker - 250px-SA_road_R325.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R326.svg.png",
      "path": "/images/signs/250px-SA_road_R326.svg.png",
      "id": "250px-SA-road-R326-svg",
      "description": "South African road marker - 250px-SA_road_R326.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R327.svg.png",
      "path": "/images/signs/250px-SA_road_R327.svg.png",
      "id": "250px-SA-road-R327-svg",
      "description": "South African road marker - 250px-SA_road_R327.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R328.svg.png",
      "path": "/images/signs/250px-SA_road_R328.svg.png",
      "id": "250px-SA-road-R328-svg",
      "description": "South African road marker - 250px-SA_road_R328.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R329.svg.png",
      "path": "/images/signs/250px-SA_road_R329.svg.png",
      "id": "250px-SA-road-R329-svg",
      "description": "South African road marker - 250px-SA_road_R329.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R33.svg.png",
      "path": "/images/signs/250px-SA_road_R33.svg.png",
      "id": "250px-SA-road-R33-svg",
      "description": "South African road marker - 250px-SA_road_R33.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R330.svg.png",
      "path": "/images/signs/250px-SA_road_R330.svg.png",
      "id": "250px-SA-road-R330-svg",
      "description": "South African road marker - 250px-SA_road_R330.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R331.svg.png",
      "path": "/images/signs/250px-SA_road_R331.svg.png",
      "id": "250px-SA-road-R331-svg",
      "description": "South African road marker - 250px-SA_road_R331.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R332.svg.png",
      "path": "/images/signs/250px-SA_road_R332.svg.png",
      "id": "250px-SA-road-R332-svg",
      "description": "South African road marker - 250px-SA_road_R332.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R334.svg.png",
      "path": "/images/signs/250px-SA_road_R334.svg.png",
      "id": "250px-SA-road-R334-svg",
      "description": "South African road marker - 250px-SA_road_R334.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R335.svg.png",
      "path": "/images/signs/250px-SA_road_R335.svg.png",
      "id": "250px-SA-road-R335-svg",
      "description": "South African road marker - 250px-SA_road_R335.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R336.svg.png",
      "path": "/images/signs/250px-SA_road_R336.svg.png",
      "id": "250px-SA-road-R336-svg",
      "description": "South African road marker - 250px-SA_road_R336.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R337.svg.png",
      "path": "/images/signs/250px-SA_road_R337.svg.png",
      "id": "250px-SA-road-R337-svg",
      "description": "South African road marker - 250px-SA_road_R337.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R338.svg.png",
      "path": "/images/signs/250px-SA_road_R338.svg.png",
      "id": "250px-SA-road-R338-svg",
      "description": "South African road marker - 250px-SA_road_R338.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R339.svg.png",
      "path": "/images/signs/250px-SA_road_R339.svg.png",
      "id": "250px-SA-road-R339-svg",
      "description": "South African road marker - 250px-SA_road_R339.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R34.svg.png",
      "path": "/images/signs/250px-SA_road_R34.svg.png",
      "id": "250px-SA-road-R34-svg",
      "description": "South African road marker - 250px-SA_road_R34.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R340.svg.png",
      "path": "/images/signs/250px-SA_road_R340.svg.png",
      "id": "250px-SA-road-R340-svg",
      "description": "South African road marker - 250px-SA_road_R340.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R341.svg.png",
      "path": "/images/signs/250px-SA_road_R341.svg.png",
      "id": "250px-SA-road-R341-svg",
      "description": "South African road marker - 250px-SA_road_R341.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R342.svg.png",
      "path": "/images/signs/250px-SA_road_R342.svg.png",
      "id": "250px-SA-road-R342-svg",
      "description": "South African road marker - 250px-SA_road_R342.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R343.svg.png",
      "path": "/images/signs/250px-SA_road_R343.svg.png",
      "id": "250px-SA-road-R343-svg",
      "description": "South African road marker - 250px-SA_road_R343.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R344.svg.png",
      "path": "/images/signs/250px-SA_road_R344.svg.png",
      "id": "250px-SA-road-R344-svg",
      "description": "South African road marker - 250px-SA_road_R344.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R345.svg.png",
      "path": "/images/signs/250px-SA_road_R345.svg.png",
      "id": "250px-SA-road-R345-svg",
      "description": "South African road marker - 250px-SA_road_R345.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R346.svg.png",
      "path": "/images/signs/250px-SA_road_R346.svg.png",
      "id": "250px-SA-road-R346-svg",
      "description": "South African road marker - 250px-SA_road_R346.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R347.svg.png",
      "path": "/images/signs/250px-SA_road_R347.svg.png",
      "id": "250px-SA-road-R347-svg",
      "description": "South African road marker - 250px-SA_road_R347.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R349.svg.png",
      "path": "/images/signs/250px-SA_road_R349.svg.png",
      "id": "250px-SA-road-R349-svg",
      "description": "South African road marker - 250px-SA_road_R349.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R35.svg.png",
      "path": "/images/signs/250px-SA_road_R35.svg.png",
      "id": "250px-SA-road-R35-svg",
      "description": "South African road marker - 250px-SA_road_R35.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R350.svg.png",
      "path": "/images/signs/250px-SA_road_R350.svg.png",
      "id": "250px-SA-road-R350-svg",
      "description": "South African road marker - 250px-SA_road_R350.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R351.svg.png",
      "path": "/images/signs/250px-SA_road_R351.svg.png",
      "id": "250px-SA-road-R351-svg",
      "description": "South African road marker - 250px-SA_road_R351.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R352.svg.png",
      "path": "/images/signs/250px-SA_road_R352.svg.png",
      "id": "250px-SA-road-R352-svg",
      "description": "South African road marker - 250px-SA_road_R352.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R353.svg.png",
      "path": "/images/signs/250px-SA_road_R353.svg.png",
      "id": "250px-SA-road-R353-svg",
      "description": "South African road marker - 250px-SA_road_R353.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R354.svg.png",
      "path": "/images/signs/250px-SA_road_R354.svg.png",
      "id": "250px-SA-road-R354-svg",
      "description": "South African road marker - 250px-SA_road_R354.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R355.svg.png",
      "path": "/images/signs/250px-SA_road_R355.svg.png",
      "id": "250px-SA-road-R355-svg",
      "description": "South African road marker - 250px-SA_road_R355.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R356.svg.png",
      "path": "/images/signs/250px-SA_road_R356.svg.png",
      "id": "250px-SA-road-R356-svg",
      "description": "South African road marker - 250px-SA_road_R356.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R357.svg.png",
      "path": "/images/signs/250px-SA_road_R357.svg.png",
      "id": "250px-SA-road-R357-svg",
      "description": "South African road marker - 250px-SA_road_R357.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R358.svg.png",
      "path": "/images/signs/250px-SA_road_R358.svg.png",
      "id": "250px-SA-road-R358-svg",
      "description": "South African road marker - 250px-SA_road_R358.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R359.svg.png",
      "path": "/images/signs/250px-SA_road_R359.svg.png",
      "id": "250px-SA-road-R359-svg",
      "description": "South African road marker - 250px-SA_road_R359.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R36.svg.png",
      "path": "/images/signs/250px-SA_road_R36.svg.png",
      "id": "250px-SA-road-R36-svg",
      "description": "South African road marker - 250px-SA_road_R36.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R360.svg.png",
      "path": "/images/signs/250px-SA_road_R360.svg.png",
      "id": "250px-SA-road-R360-svg",
      "description": "South African road marker - 250px-SA_road_R360.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R361.svg.png",
      "path": "/images/signs/250px-SA_road_R361.svg.png",
      "id": "250px-SA-road-R361-svg",
      "description": "South African road marker - 250px-SA_road_R361.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R362.svg.png",
      "path": "/images/signs/250px-SA_road_R362.svg.png",
      "id": "250px-SA-road-R362-svg",
      "description": "South African road marker - 250px-SA_road_R362.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R363.svg.png",
      "path": "/images/signs/250px-SA_road_R363.svg.png",
      "id": "250px-SA-road-R363-svg",
      "description": "South African road marker - 250px-SA_road_R363.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R364.svg.png",
      "path": "/images/signs/250px-SA_road_R364.svg.png",
      "id": "250px-SA-road-R364-svg",
      "description": "South African road marker - 250px-SA_road_R364.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R365.svg.png",
      "path": "/images/signs/250px-SA_road_R365.svg.png",
      "id": "250px-SA-road-R365-svg",
      "description": "South African road marker - 250px-SA_road_R365.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R366.svg.png",
      "path": "/images/signs/250px-SA_road_R366.svg.png",
      "id": "250px-SA-road-R366-svg",
      "description": "South African road marker - 250px-SA_road_R366.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R369.svg.png",
      "path": "/images/signs/250px-SA_road_R369.svg.png",
      "id": "250px-SA-road-R369-svg",
      "description": "South African road marker - 250px-SA_road_R369.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R37.svg.png",
      "path": "/images/signs/250px-SA_road_R37.svg.png",
      "id": "250px-SA-road-R37-svg",
      "description": "South African road marker - 250px-SA_road_R37.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R371.svg.png",
      "path": "/images/signs/250px-SA_road_R371.svg.png",
      "id": "250px-SA-road-R371-svg",
      "description": "South African road marker - 250px-SA_road_R371.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R372.svg.png",
      "path": "/images/signs/250px-SA_road_R372.svg.png",
      "id": "250px-SA-road-R372-svg",
      "description": "South African road marker - 250px-SA_road_R372.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R374.svg.png",
      "path": "/images/signs/250px-SA_road_R374.svg.png",
      "id": "250px-SA-road-R374-svg",
      "description": "South African road marker - 250px-SA_road_R374.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R375.svg.png",
      "path": "/images/signs/250px-SA_road_R375.svg.png",
      "id": "250px-SA-road-R375-svg",
      "description": "South African road marker - 250px-SA_road_R375.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R376.svg.png",
      "path": "/images/signs/250px-SA_road_R376.svg.png",
      "id": "250px-SA-road-R376-svg",
      "description": "South African road marker - 250px-SA_road_R376.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R377.svg.png",
      "path": "/images/signs/250px-SA_road_R377.svg.png",
      "id": "250px-SA-road-R377-svg",
      "description": "South African road marker - 250px-SA_road_R377.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R378.svg.png",
      "path": "/images/signs/250px-SA_road_R378.svg.png",
      "id": "250px-SA-road-R378-svg",
      "description": "South African road marker - 250px-SA_road_R378.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R38.svg.png",
      "path": "/images/signs/250px-SA_road_R38.svg.png",
      "id": "250px-SA-road-R38-svg",
      "description": "South African road marker - 250px-SA_road_R38.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R380.svg.png",
      "path": "/images/signs/250px-SA_road_R380.svg.png",
      "id": "250px-SA-road-R380-svg",
      "description": "South African road marker - 250px-SA_road_R380.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R381.svg.png",
      "path": "/images/signs/250px-SA_road_R381.svg.png",
      "id": "250px-SA-road-R381-svg",
      "description": "South African road marker - 250px-SA_road_R381.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R382.svg.png",
      "path": "/images/signs/250px-SA_road_R382.svg.png",
      "id": "250px-SA-road-R382-svg",
      "description": "South African road marker - 250px-SA_road_R382.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R383.svg.png",
      "path": "/images/signs/250px-SA_road_R383.svg.png",
      "id": "250px-SA-road-R383-svg",
      "description": "South African road marker - 250px-SA_road_R383.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R384.svg.png",
      "path": "/images/signs/250px-SA_road_R384.svg.png",
      "id": "250px-SA-road-R384-svg",
      "description": "South African road marker - 250px-SA_road_R384.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R385.svg.png",
      "path": "/images/signs/250px-SA_road_R385.svg.png",
      "id": "250px-SA-road-R385-svg",
      "description": "South African road marker - 250px-SA_road_R385.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R386.svg.png",
      "path": "/images/signs/250px-SA_road_R386.svg.png",
      "id": "250px-SA-road-R386-svg",
      "description": "South African road marker - 250px-SA_road_R386.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R387.svg.png",
      "path": "/images/signs/250px-SA_road_R387.svg.png",
      "id": "250px-SA-road-R387-svg",
      "description": "South African road marker - 250px-SA_road_R387.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R388.svg.png",
      "path": "/images/signs/250px-SA_road_R388.svg.png",
      "id": "250px-SA-road-R388-svg",
      "description": "South African road marker - 250px-SA_road_R388.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R39.svg.png",
      "path": "/images/signs/250px-SA_road_R39.svg.png",
      "id": "250px-SA-road-R39-svg",
      "description": "South African road marker - 250px-SA_road_R39.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R390.svg.png",
      "path": "/images/signs/250px-SA_road_R390.svg.png",
      "id": "250px-SA-road-R390-svg",
      "description": "South African road marker - 250px-SA_road_R390.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R391.svg.png",
      "path": "/images/signs/250px-SA_road_R391.svg.png",
      "id": "250px-SA-road-R391-svg",
      "description": "South African road marker - 250px-SA_road_R391.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R392.svg.png",
      "path": "/images/signs/250px-SA_road_R392.svg.png",
      "id": "250px-SA-road-R392-svg",
      "description": "South African road marker - 250px-SA_road_R392.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R393.svg.png",
      "path": "/images/signs/250px-SA_road_R393.svg.png",
      "id": "250px-SA-road-R393-svg",
      "description": "South African road marker - 250px-SA_road_R393.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R394.svg.png",
      "path": "/images/signs/250px-SA_road_R394.svg.png",
      "id": "250px-SA-road-R394-svg",
      "description": "South African road marker - 250px-SA_road_R394.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R396.svg.png",
      "path": "/images/signs/250px-SA_road_R396.svg.png",
      "id": "250px-SA-road-R396-svg",
      "description": "South African road marker - 250px-SA_road_R396.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R397.svg.png",
      "path": "/images/signs/250px-SA_road_R397.svg.png",
      "id": "250px-SA-road-R397-svg",
      "description": "South African road marker - 250px-SA_road_R397.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R399.svg.png",
      "path": "/images/signs/250px-SA_road_R399.svg.png",
      "id": "250px-SA-road-R399-svg",
      "description": "South African road marker - 250px-SA_road_R399.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R40.svg.png",
      "path": "/images/signs/250px-SA_road_R40.svg.png",
      "id": "250px-SA-road-R40-svg",
      "description": "South African road marker - 250px-SA_road_R40.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R400.svg.png",
      "path": "/images/signs/250px-SA_road_R400.svg.png",
      "id": "250px-SA-road-R400-svg",
      "description": "South African road marker - 250px-SA_road_R400.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R401.svg.png",
      "path": "/images/signs/250px-SA_road_R401.svg.png",
      "id": "250px-SA-road-R401-svg",
      "description": "South African road marker - 250px-SA_road_R401.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R402.svg.png",
      "path": "/images/signs/250px-SA_road_R402.svg.png",
      "id": "250px-SA-road-R402-svg",
      "description": "South African road marker - 250px-SA_road_R402.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R403.svg.png",
      "path": "/images/signs/250px-SA_road_R403.svg.png",
      "id": "250px-SA-road-R403-svg",
      "description": "South African road marker - 250px-SA_road_R403.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R404.svg.png",
      "path": "/images/signs/250px-SA_road_R404.svg.png",
      "id": "250px-SA-road-R404-svg",
      "description": "South African road marker - 250px-SA_road_R404.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R405.svg.png",
      "path": "/images/signs/250px-SA_road_R405.svg.png",
      "id": "250px-SA-road-R405-svg",
      "description": "South African road marker - 250px-SA_road_R405.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R406.svg.png",
      "path": "/images/signs/250px-SA_road_R406.svg.png",
      "id": "250px-SA-road-R406-svg",
      "description": "South African road marker - 250px-SA_road_R406.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R407.svg.png",
      "path": "/images/signs/250px-SA_road_R407.svg.png",
      "id": "250px-SA-road-R407-svg",
      "description": "South African road marker - 250px-SA_road_R407.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R408.svg.png",
      "path": "/images/signs/250px-SA_road_R408.svg.png",
      "id": "250px-SA-road-R408-svg",
      "description": "South African road marker - 250px-SA_road_R408.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R41.svg.png",
      "path": "/images/signs/250px-SA_road_R41.svg.png",
      "id": "250px-SA-road-R41-svg",
      "description": "South African road marker - 250px-SA_road_R41.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R410.svg.png",
      "path": "/images/signs/250px-SA_road_R410.svg.png",
      "id": "250px-SA-road-R410-svg",
      "description": "South African road marker - 250px-SA_road_R410.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R411.svg.png",
      "path": "/images/signs/250px-SA_road_R411.svg.png",
      "id": "250px-SA-road-R411-svg",
      "description": "South African road marker - 250px-SA_road_R411.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R412.svg.png",
      "path": "/images/signs/250px-SA_road_R412.svg.png",
      "id": "250px-SA-road-R412-svg",
      "description": "South African road marker - 250px-SA_road_R412.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R42.svg.png",
      "path": "/images/signs/250px-SA_road_R42.svg.png",
      "id": "250px-SA-road-R42-svg",
      "description": "South African road marker - 250px-SA_road_R42.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R43.svg.png",
      "path": "/images/signs/250px-SA_road_R43.svg.png",
      "id": "250px-SA-road-R43-svg",
      "description": "South African road marker - 250px-SA_road_R43.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R44.svg.png",
      "path": "/images/signs/250px-SA_road_R44.svg.png",
      "id": "250px-SA-road-R44-svg",
      "description": "South African road marker - 250px-SA_road_R44.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R45.svg.png",
      "path": "/images/signs/250px-SA_road_R45.svg.png",
      "id": "250px-SA-road-R45-svg",
      "description": "South African road marker - 250px-SA_road_R45.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R46.svg.png",
      "path": "/images/signs/250px-SA_road_R46.svg.png",
      "id": "250px-SA-road-R46-svg",
      "description": "South African road marker - 250px-SA_road_R46.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R47.svg.png",
      "path": "/images/signs/250px-SA_road_R47.svg.png",
      "id": "250px-SA-road-R47-svg",
      "description": "South African road marker - 250px-SA_road_R47.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R48.svg.png",
      "path": "/images/signs/250px-SA_road_R48.svg.png",
      "id": "250px-SA-road-R48-svg",
      "description": "South African road marker - 250px-SA_road_R48.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R49.svg.png",
      "path": "/images/signs/250px-SA_road_R49.svg.png",
      "id": "250px-SA-road-R49-svg",
      "description": "South African road marker - 250px-SA_road_R49.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R50.svg.png",
      "path": "/images/signs/250px-SA_road_R50.svg.png",
      "id": "250px-SA-road-R50-svg",
      "description": "South African road marker - 250px-SA_road_R50.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R500.svg.png",
      "path": "/images/signs/250px-SA_road_R500.svg.png",
      "id": "250px-SA-road-R500-svg",
      "description": "South African road marker - 250px-SA_road_R500.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R501.svg.png",
      "path": "/images/signs/250px-SA_road_R501.svg.png",
      "id": "250px-SA-road-R501-svg",
      "description": "South African road marker - 250px-SA_road_R501.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R502.svg.png",
      "path": "/images/signs/250px-SA_road_R502.svg.png",
      "id": "250px-SA-road-R502-svg",
      "description": "South African road marker - 250px-SA_road_R502.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R503.svg.png",
      "path": "/images/signs/250px-SA_road_R503.svg.png",
      "id": "250px-SA-road-R503-svg",
      "description": "South African road marker - 250px-SA_road_R503.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R504.svg.png",
      "path": "/images/signs/250px-SA_road_R504.svg.png",
      "id": "250px-SA-road-R504-svg",
      "description": "South African road marker - 250px-SA_road_R504.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R505.svg.png",
      "path": "/images/signs/250px-SA_road_R505.svg.png",
      "id": "250px-SA-road-R505-svg",
      "description": "South African road marker - 250px-SA_road_R505.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R506.svg.png",
      "path": "/images/signs/250px-SA_road_R506.svg.png",
      "id": "250px-SA-road-R506-svg",
      "description": "South African road marker - 250px-SA_road_R506.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R507.svg.png",
      "path": "/images/signs/250px-SA_road_R507.svg.png",
      "id": "250px-SA-road-R507-svg",
      "description": "South African road marker - 250px-SA_road_R507.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R508.svg.png",
      "path": "/images/signs/250px-SA_road_R508.svg.png",
      "id": "250px-SA-road-R508-svg",
      "description": "South African road marker - 250px-SA_road_R508.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R509.svg.png",
      "path": "/images/signs/250px-SA_road_R509.svg.png",
      "id": "250px-SA-road-R509-svg",
      "description": "South African road marker - 250px-SA_road_R509.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R51.svg.png",
      "path": "/images/signs/250px-SA_road_R51.svg.png",
      "id": "250px-SA-road-R51-svg",
      "description": "South African road marker - 250px-SA_road_R51.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R510.svg.png",
      "path": "/images/signs/250px-SA_road_R510.svg.png",
      "id": "250px-SA-road-R510-svg",
      "description": "South African road marker - 250px-SA_road_R510.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R511.svg.png",
      "path": "/images/signs/250px-SA_road_R511.svg.png",
      "id": "250px-SA-road-R511-svg",
      "description": "South African road marker - 250px-SA_road_R511.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R512.svg.png",
      "path": "/images/signs/250px-SA_road_R512.svg.png",
      "id": "250px-SA-road-R512-svg",
      "description": "South African road marker - 250px-SA_road_R512.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R514.svg.png",
      "path": "/images/signs/250px-SA_road_R514.svg.png",
      "id": "250px-SA-road-R514-svg",
      "description": "South African road marker - 250px-SA_road_R514.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R515.svg.png",
      "path": "/images/signs/250px-SA_road_R515.svg.png",
      "id": "250px-SA-road-R515-svg",
      "description": "South African road marker - 250px-SA_road_R515.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R516.svg.png",
      "path": "/images/signs/250px-SA_road_R516.svg.png",
      "id": "250px-SA-road-R516-svg",
      "description": "South African road marker - 250px-SA_road_R516.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R517.svg.png",
      "path": "/images/signs/250px-SA_road_R517.svg.png",
      "id": "250px-SA-road-R517-svg",
      "description": "South African road marker - 250px-SA_road_R517.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R518.svg.png",
      "path": "/images/signs/250px-SA_road_R518.svg.png",
      "id": "250px-SA-road-R518-svg",
      "description": "South African road marker - 250px-SA_road_R518.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R519.svg.png",
      "path": "/images/signs/250px-SA_road_R519.svg.png",
      "id": "250px-SA-road-R519-svg",
      "description": "South African road marker - 250px-SA_road_R519.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R52.svg.png",
      "path": "/images/signs/250px-SA_road_R52.svg.png",
      "id": "250px-SA-road-R52-svg",
      "description": "South African road marker - 250px-SA_road_R52.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R520.svg.png",
      "path": "/images/signs/250px-SA_road_R520.svg.png",
      "id": "250px-SA-road-R520-svg",
      "description": "South African road marker - 250px-SA_road_R520.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R521.svg.png",
      "path": "/images/signs/250px-SA_road_R521.svg.png",
      "id": "250px-SA-road-R521-svg",
      "description": "South African road marker - 250px-SA_road_R521.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R522.svg.png",
      "path": "/images/signs/250px-SA_road_R522.svg.png",
      "id": "250px-SA-road-R522-svg",
      "description": "South African road marker - 250px-SA_road_R522.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R523.svg.png",
      "path": "/images/signs/250px-SA_road_R523.svg.png",
      "id": "250px-SA-road-R523-svg",
      "description": "South African road marker - 250px-SA_road_R523.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R524.svg.png",
      "path": "/images/signs/250px-SA_road_R524.svg.png",
      "id": "250px-SA-road-R524-svg",
      "description": "South African road marker - 250px-SA_road_R524.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R525.svg.png",
      "path": "/images/signs/250px-SA_road_R525.svg.png",
      "id": "250px-SA-road-R525-svg",
      "description": "South African road marker - 250px-SA_road_R525.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R526.svg.png",
      "path": "/images/signs/250px-SA_road_R526.svg.png",
      "id": "250px-SA-road-R526-svg",
      "description": "South African road marker - 250px-SA_road_R526.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R527.svg.png",
      "path": "/images/signs/250px-SA_road_R527.svg.png",
      "id": "250px-SA-road-R527-svg",
      "description": "South African road marker - 250px-SA_road_R527.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R528.svg.png",
      "path": "/images/signs/250px-SA_road_R528.svg.png",
      "id": "250px-SA-road-R528-svg",
      "description": "South African road marker - 250px-SA_road_R528.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R53.svg.png",
      "path": "/images/signs/250px-SA_road_R53.svg.png",
      "id": "250px-SA-road-R53-svg",
      "description": "South African road marker - 250px-SA_road_R53.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R530.svg.png",
      "path": "/images/signs/250px-SA_road_R530.svg.png",
      "id": "250px-SA-road-R530-svg",
      "description": "South African road marker - 250px-SA_road_R530.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R531.svg.png",
      "path": "/images/signs/250px-SA_road_R531.svg.png",
      "id": "250px-SA-road-R531-svg",
      "description": "South African road marker - 250px-SA_road_R531.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R532.svg.png",
      "path": "/images/signs/250px-SA_road_R532.svg.png",
      "id": "250px-SA-road-R532-svg",
      "description": "South African road marker - 250px-SA_road_R532.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R534.svg.png",
      "path": "/images/signs/250px-SA_road_R534.svg.png",
      "id": "250px-SA-road-R534-svg",
      "description": "South African road marker - 250px-SA_road_R534.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R535.svg.png",
      "path": "/images/signs/250px-SA_road_R535.svg.png",
      "id": "250px-SA-road-R535-svg",
      "description": "South African road marker - 250px-SA_road_R535.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R537.svg.png",
      "path": "/images/signs/250px-SA_road_R537.svg.png",
      "id": "250px-SA-road-R537-svg",
      "description": "South African road marker - 250px-SA_road_R537.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R538.svg.png",
      "path": "/images/signs/250px-SA_road_R538.svg.png",
      "id": "250px-SA-road-R538-svg",
      "description": "South African road marker - 250px-SA_road_R538.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R539.svg.png",
      "path": "/images/signs/250px-SA_road_R539.svg.png",
      "id": "250px-SA-road-R539-svg",
      "description": "South African road marker - 250px-SA_road_R539.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R54.svg.png",
      "path": "/images/signs/250px-SA_road_R54.svg.png",
      "id": "250px-SA-road-R54-svg",
      "description": "South African road marker - 250px-SA_road_R54.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R541.svg.png",
      "path": "/images/signs/250px-SA_road_R541.svg.png",
      "id": "250px-SA-road-R541-svg",
      "description": "South African road marker - 250px-SA_road_R541.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R542.svg.png",
      "path": "/images/signs/250px-SA_road_R542.svg.png",
      "id": "250px-SA-road-R542-svg",
      "description": "South African road marker - 250px-SA_road_R542.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R543.svg.png",
      "path": "/images/signs/250px-SA_road_R543.svg.png",
      "id": "250px-SA-road-R543-svg",
      "description": "South African road marker - 250px-SA_road_R543.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R544.svg.png",
      "path": "/images/signs/250px-SA_road_R544.svg.png",
      "id": "250px-SA-road-R544-svg",
      "description": "South African road marker - 250px-SA_road_R544.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R545.svg.png",
      "path": "/images/signs/250px-SA_road_R545.svg.png",
      "id": "250px-SA-road-R545-svg",
      "description": "South African road marker - 250px-SA_road_R545.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R546.svg.png",
      "path": "/images/signs/250px-SA_road_R546.svg.png",
      "id": "250px-SA-road-R546-svg",
      "description": "South African road marker - 250px-SA_road_R546.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R547.svg.png",
      "path": "/images/signs/250px-SA_road_R547.svg.png",
      "id": "250px-SA-road-R547-svg",
      "description": "South African road marker - 250px-SA_road_R547.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R548.svg.png",
      "path": "/images/signs/250px-SA_road_R548.svg.png",
      "id": "250px-SA-road-R548-svg",
      "description": "South African road marker - 250px-SA_road_R548.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R549.svg.png",
      "path": "/images/signs/250px-SA_road_R549.svg.png",
      "id": "250px-SA-road-R549-svg",
      "description": "South African road marker - 250px-SA_road_R549.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R55.svg.png",
      "path": "/images/signs/250px-SA_road_R55.svg.png",
      "id": "250px-SA-road-R55-svg",
      "description": "South African road marker - 250px-SA_road_R55.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R550.svg.png",
      "path": "/images/signs/250px-SA_road_R550.svg.png",
      "id": "250px-SA-road-R550-svg",
      "description": "South African road marker - 250px-SA_road_R550.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R551.svg.png",
      "path": "/images/signs/250px-SA_road_R551.svg.png",
      "id": "250px-SA-road-R551-svg",
      "description": "South African road marker - 250px-SA_road_R551.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R552.svg.png",
      "path": "/images/signs/250px-SA_road_R552.svg.png",
      "id": "250px-SA-road-R552-svg",
      "description": "South African road marker - 250px-SA_road_R552.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R553.svg.png",
      "path": "/images/signs/250px-SA_road_R553.svg.png",
      "id": "250px-SA-road-R553-svg",
      "description": "South African road marker - 250px-SA_road_R553.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R554.svg.png",
      "path": "/images/signs/250px-SA_road_R554.svg.png",
      "id": "250px-SA-road-R554-svg",
      "description": "South African road marker - 250px-SA_road_R554.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R555.svg.png",
      "path": "/images/signs/250px-SA_road_R555.svg.png",
      "id": "250px-SA-road-R555-svg",
      "description": "South African road marker - 250px-SA_road_R555.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R556.svg.png",
      "path": "/images/signs/250px-SA_road_R556.svg.png",
      "id": "250px-SA-road-R556-svg",
      "description": "South African road marker - 250px-SA_road_R556.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R557.svg.png",
      "path": "/images/signs/250px-SA_road_R557.svg.png",
      "id": "250px-SA-road-R557-svg",
      "description": "South African road marker - 250px-SA_road_R557.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R558.svg.png",
      "path": "/images/signs/250px-SA_road_R558.svg.png",
      "id": "250px-SA-road-R558-svg",
      "description": "South African road marker - 250px-SA_road_R558.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R559.svg.png",
      "path": "/images/signs/250px-SA_road_R559.svg.png",
      "id": "250px-SA-road-R559-svg",
      "description": "South African road marker - 250px-SA_road_R559.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R56.svg.png",
      "path": "/images/signs/250px-SA_road_R56.svg.png",
      "id": "250px-SA-road-R56-svg",
      "description": "South African road marker - 250px-SA_road_R56.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R560.svg.png",
      "path": "/images/signs/250px-SA_road_R560.svg.png",
      "id": "250px-SA-road-R560-svg",
      "description": "South African road marker - 250px-SA_road_R560.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R561.svg.png",
      "path": "/images/signs/250px-SA_road_R561.svg.png",
      "id": "250px-SA-road-R561-svg",
      "description": "South African road marker - 250px-SA_road_R561.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R562.svg.png",
      "path": "/images/signs/250px-SA_road_R562.svg.png",
      "id": "250px-SA-road-R562-svg",
      "description": "South African road marker - 250px-SA_road_R562.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R563.svg.png",
      "path": "/images/signs/250px-SA_road_R563.svg.png",
      "id": "250px-SA-road-R563-svg",
      "description": "South African road marker - 250px-SA_road_R563.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R564.svg.png",
      "path": "/images/signs/250px-SA_road_R564.svg.png",
      "id": "250px-SA-road-R564-svg",
      "description": "South African road marker - 250px-SA_road_R564.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R565.svg.png",
      "path": "/images/signs/250px-SA_road_R565.svg.png",
      "id": "250px-SA-road-R565-svg",
      "description": "South African road marker - 250px-SA_road_R565.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R566.svg.png",
      "path": "/images/signs/250px-SA_road_R566.svg.png",
      "id": "250px-SA-road-R566-svg",
      "description": "South African road marker - 250px-SA_road_R566.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R567.svg.png",
      "path": "/images/signs/250px-SA_road_R567.svg.png",
      "id": "250px-SA-road-R567-svg",
      "description": "South African road marker - 250px-SA_road_R567.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R568.svg.png",
      "path": "/images/signs/250px-SA_road_R568.svg.png",
      "id": "250px-SA-road-R568-svg",
      "description": "South African road marker - 250px-SA_road_R568.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R569.svg.png",
      "path": "/images/signs/250px-SA_road_R569.svg.png",
      "id": "250px-SA-road-R569-svg",
      "description": "South African road marker - 250px-SA_road_R569.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R57.svg.png",
      "path": "/images/signs/250px-SA_road_R57.svg.png",
      "id": "250px-SA-road-R57-svg",
      "description": "South African road marker - 250px-SA_road_R57.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R570.svg.png",
      "path": "/images/signs/250px-SA_road_R570.svg.png",
      "id": "250px-SA-road-R570-svg",
      "description": "South African road marker - 250px-SA_road_R570.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R571.svg.png",
      "path": "/images/signs/250px-SA_road_R571.svg.png",
      "id": "250px-SA-road-R571-svg",
      "description": "South African road marker - 250px-SA_road_R571.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R572.svg.png",
      "path": "/images/signs/250px-SA_road_R572.svg.png",
      "id": "250px-SA-road-R572-svg",
      "description": "South African road marker - 250px-SA_road_R572.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R573.svg.png",
      "path": "/images/signs/250px-SA_road_R573.svg.png",
      "id": "250px-SA-road-R573-svg",
      "description": "South African road marker - 250px-SA_road_R573.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R575.svg.png",
      "path": "/images/signs/250px-SA_road_R575.svg.png",
      "id": "250px-SA-road-R575-svg",
      "description": "South African road marker - 250px-SA_road_R575.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R576.svg.png",
      "path": "/images/signs/250px-SA_road_R576.svg.png",
      "id": "250px-SA-road-R576-svg",
      "description": "South African road marker - 250px-SA_road_R576.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R577.svg.png",
      "path": "/images/signs/250px-SA_road_R577.svg.png",
      "id": "250px-SA-road-R577-svg",
      "description": "South African road marker - 250px-SA_road_R577.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R578.svg.png",
      "path": "/images/signs/250px-SA_road_R578.svg.png",
      "id": "250px-SA-road-R578-svg",
      "description": "South African road marker - 250px-SA_road_R578.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R579.svg.png",
      "path": "/images/signs/250px-SA_road_R579.svg.png",
      "id": "250px-SA-road-R579-svg",
      "description": "South African road marker - 250px-SA_road_R579.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R58.svg.png",
      "path": "/images/signs/250px-SA_road_R58.svg.png",
      "id": "250px-SA-road-R58-svg",
      "description": "South African road marker - 250px-SA_road_R58.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R580.svg.png",
      "path": "/images/signs/250px-SA_road_R580.svg.png",
      "id": "250px-SA-road-R580-svg",
      "description": "South African road marker - 250px-SA_road_R580.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R59.svg.png",
      "path": "/images/signs/250px-SA_road_R59.svg.png",
      "id": "250px-SA-road-R59-svg",
      "description": "South African road marker - 250px-SA_road_R59.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R60.svg.png",
      "path": "/images/signs/250px-SA_road_R60.svg.png",
      "id": "250px-SA-road-R60-svg",
      "description": "South African road marker - 250px-SA_road_R60.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R600.svg.png",
      "path": "/images/signs/250px-SA_road_R600.svg.png",
      "id": "250px-SA-road-R600-svg",
      "description": "South African road marker - 250px-SA_road_R600.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R602.svg.png",
      "path": "/images/signs/250px-SA_road_R602.svg.png",
      "id": "250px-SA-road-R602-svg",
      "description": "South African road marker - 250px-SA_road_R602.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R603.svg.png",
      "path": "/images/signs/250px-SA_road_R603.svg.png",
      "id": "250px-SA-road-R603-svg",
      "description": "South African road marker - 250px-SA_road_R603.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R61.svg.png",
      "path": "/images/signs/250px-SA_road_R61.svg.png",
      "id": "250px-SA-road-R61-svg",
      "description": "South African road marker - 250px-SA_road_R61.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R612.svg.png",
      "path": "/images/signs/250px-SA_road_R612.svg.png",
      "id": "250px-SA-road-R612-svg",
      "description": "South African road marker - 250px-SA_road_R612.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R613.svg.png",
      "path": "/images/signs/250px-SA_road_R613.svg.png",
      "id": "250px-SA-road-R613-svg",
      "description": "South African road marker - 250px-SA_road_R613.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R614.svg.png",
      "path": "/images/signs/250px-SA_road_R614.svg.png",
      "id": "250px-SA-road-R614-svg",
      "description": "South African road marker - 250px-SA_road_R614.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R617.svg.png",
      "path": "/images/signs/250px-SA_road_R617.svg.png",
      "id": "250px-SA-road-R617-svg",
      "description": "South African road marker - 250px-SA_road_R617.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R618.svg.png",
      "path": "/images/signs/250px-SA_road_R618.svg.png",
      "id": "250px-SA-road-R618-svg",
      "description": "South African road marker - 250px-SA_road_R618.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R619.svg.png",
      "path": "/images/signs/250px-SA_road_R619.svg.png",
      "id": "250px-SA-road-R619-svg",
      "description": "South African road marker - 250px-SA_road_R619.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R62.svg.png",
      "path": "/images/signs/250px-SA_road_R62.svg.png",
      "id": "250px-SA-road-R62-svg",
      "description": "South African road marker - 250px-SA_road_R62.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R620.svg.png",
      "path": "/images/signs/250px-SA_road_R620.svg.png",
      "id": "250px-SA-road-R620-svg",
      "description": "South African road marker - 250px-SA_road_R620.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R621.svg.png",
      "path": "/images/signs/250px-SA_road_R621.svg.png",
      "id": "250px-SA-road-R621-svg",
      "description": "South African road marker - 250px-SA_road_R621.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R624.svg.png",
      "path": "/images/signs/250px-SA_road_R624.svg.png",
      "id": "250px-SA-road-R624-svg",
      "description": "South African road marker - 250px-SA_road_R624.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R63.svg.png",
      "path": "/images/signs/250px-SA_road_R63.svg.png",
      "id": "250px-SA-road-R63-svg",
      "description": "South African road marker - 250px-SA_road_R63.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R64.svg.png",
      "path": "/images/signs/250px-SA_road_R64.svg.png",
      "id": "250px-SA-road-R64-svg",
      "description": "South African road marker - 250px-SA_road_R64.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R65.svg.png",
      "path": "/images/signs/250px-SA_road_R65.svg.png",
      "id": "250px-SA-road-R65-svg",
      "description": "South African road marker - 250px-SA_road_R65.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R66.svg.png",
      "path": "/images/signs/250px-SA_road_R66.svg.png",
      "id": "250px-SA-road-R66-svg",
      "description": "South African road marker - 250px-SA_road_R66.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R67.svg.png",
      "path": "/images/signs/250px-SA_road_R67.svg.png",
      "id": "250px-SA-road-R67-svg",
      "description": "South African road marker - 250px-SA_road_R67.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R68.svg.png",
      "path": "/images/signs/250px-SA_road_R68.svg.png",
      "id": "250px-SA-road-R68-svg",
      "description": "South African road marker - 250px-SA_road_R68.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R69.svg.png",
      "path": "/images/signs/250px-SA_road_R69.svg.png",
      "id": "250px-SA-road-R69-svg",
      "description": "South African road marker - 250px-SA_road_R69.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R70.svg.png",
      "path": "/images/signs/250px-SA_road_R70.svg.png",
      "id": "250px-SA-road-R70-svg",
      "description": "South African road marker - 250px-SA_road_R70.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R700.svg.png",
      "path": "/images/signs/250px-SA_road_R700.svg.png",
      "id": "250px-SA-road-R700-svg",
      "description": "South African road marker - 250px-SA_road_R700.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R701.svg.png",
      "path": "/images/signs/250px-SA_road_R701.svg.png",
      "id": "250px-SA-road-R701-svg",
      "description": "South African road marker - 250px-SA_road_R701.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R702.svg.png",
      "path": "/images/signs/250px-SA_road_R702.svg.png",
      "id": "250px-SA-road-R702-svg",
      "description": "South African road marker - 250px-SA_road_R702.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R703.svg.png",
      "path": "/images/signs/250px-SA_road_R703.svg.png",
      "id": "250px-SA-road-R703-svg",
      "description": "South African road marker - 250px-SA_road_R703.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R704.svg.png",
      "path": "/images/signs/250px-SA_road_R704.svg.png",
      "id": "250px-SA-road-R704-svg",
      "description": "South African road marker - 250px-SA_road_R704.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R705.svg.png",
      "path": "/images/signs/250px-SA_road_R705.svg.png",
      "id": "250px-SA-road-R705-svg",
      "description": "South African road marker - 250px-SA_road_R705.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R706.svg.png",
      "path": "/images/signs/250px-SA_road_R706.svg.png",
      "id": "250px-SA-road-R706-svg",
      "description": "South African road marker - 250px-SA_road_R706.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R707.svg.png",
      "path": "/images/signs/250px-SA_road_R707.svg.png",
      "id": "250px-SA-road-R707-svg",
      "description": "South African road marker - 250px-SA_road_R707.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R708.svg.png",
      "path": "/images/signs/250px-SA_road_R708.svg.png",
      "id": "250px-SA-road-R708-svg",
      "description": "South African road marker - 250px-SA_road_R708.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R709.svg.png",
      "path": "/images/signs/250px-SA_road_R709.svg.png",
      "id": "250px-SA-road-R709-svg",
      "description": "South African road marker - 250px-SA_road_R709.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R71.svg.png",
      "path": "/images/signs/250px-SA_road_R71.svg.png",
      "id": "250px-SA-road-R71-svg",
      "description": "South African road marker - 250px-SA_road_R71.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R710.svg.png",
      "path": "/images/signs/250px-SA_road_R710.svg.png",
      "id": "250px-SA-road-R710-svg",
      "description": "South African road marker - 250px-SA_road_R710.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R711.svg.png",
      "path": "/images/signs/250px-SA_road_R711.svg.png",
      "id": "250px-SA-road-R711-svg",
      "description": "South African road marker - 250px-SA_road_R711.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R712.svg.png",
      "path": "/images/signs/250px-SA_road_R712.svg.png",
      "id": "250px-SA-road-R712-svg",
      "description": "South African road marker - 250px-SA_road_R712.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R713.svg.png",
      "path": "/images/signs/250px-SA_road_R713.svg.png",
      "id": "250px-SA-road-R713-svg",
      "description": "South African road marker - 250px-SA_road_R713.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R714.svg.png",
      "path": "/images/signs/250px-SA_road_R714.svg.png",
      "id": "250px-SA-road-R714-svg",
      "description": "South African road marker - 250px-SA_road_R714.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R715.svg.png",
      "path": "/images/signs/250px-SA_road_R715.svg.png",
      "id": "250px-SA-road-R715-svg",
      "description": "South African road marker - 250px-SA_road_R715.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R716.svg.png",
      "path": "/images/signs/250px-SA_road_R716.svg.png",
      "id": "250px-SA-road-R716-svg",
      "description": "South African road marker - 250px-SA_road_R716.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R718.svg.png",
      "path": "/images/signs/250px-SA_road_R718.svg.png",
      "id": "250px-SA-road-R718-svg",
      "description": "South African road marker - 250px-SA_road_R718.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R719.svg.png",
      "path": "/images/signs/250px-SA_road_R719.svg.png",
      "id": "250px-SA-road-R719-svg",
      "description": "South African road marker - 250px-SA_road_R719.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R72.svg.png",
      "path": "/images/signs/250px-SA_road_R72.svg.png",
      "id": "250px-SA-road-R72-svg",
      "description": "South African road marker - 250px-SA_road_R72.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R720.svg.png",
      "path": "/images/signs/250px-SA_road_R720.svg.png",
      "id": "250px-SA-road-R720-svg",
      "description": "South African road marker - 250px-SA_road_R720.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R721.svg.png",
      "path": "/images/signs/250px-SA_road_R721.svg.png",
      "id": "250px-SA-road-R721-svg",
      "description": "South African road marker - 250px-SA_road_R721.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R722.svg.png",
      "path": "/images/signs/250px-SA_road_R722.svg.png",
      "id": "250px-SA-road-R722-svg",
      "description": "South African road marker - 250px-SA_road_R722.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R723.svg.png",
      "path": "/images/signs/250px-SA_road_R723.svg.png",
      "id": "250px-SA-road-R723-svg",
      "description": "South African road marker - 250px-SA_road_R723.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R724.svg.png",
      "path": "/images/signs/250px-SA_road_R724.svg.png",
      "id": "250px-SA-road-R724-svg",
      "description": "South African road marker - 250px-SA_road_R724.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R725.svg.png",
      "path": "/images/signs/250px-SA_road_R725.svg.png",
      "id": "250px-SA-road-R725-svg",
      "description": "South African road marker - 250px-SA_road_R725.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R726.svg.png",
      "path": "/images/signs/250px-SA_road_R726.svg.png",
      "id": "250px-SA-road-R726-svg",
      "description": "South African road marker - 250px-SA_road_R726.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R727.svg.png",
      "path": "/images/signs/250px-SA_road_R727.svg.png",
      "id": "250px-SA-road-R727-svg",
      "description": "South African road marker - 250px-SA_road_R727.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R73.svg.png",
      "path": "/images/signs/250px-SA_road_R73.svg.png",
      "id": "250px-SA-road-R73-svg",
      "description": "South African road marker - 250px-SA_road_R73.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R730.svg.png",
      "path": "/images/signs/250px-SA_road_R730.svg.png",
      "id": "250px-SA-road-R730-svg",
      "description": "South African road marker - 250px-SA_road_R730.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R74.svg.png",
      "path": "/images/signs/250px-SA_road_R74.svg.png",
      "id": "250px-SA-road-R74-svg",
      "description": "South African road marker - 250px-SA_road_R74.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R75.svg.png",
      "path": "/images/signs/250px-SA_road_R75.svg.png",
      "id": "250px-SA-road-R75-svg",
      "description": "South African road marker - 250px-SA_road_R75.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R76.svg.png",
      "path": "/images/signs/250px-SA_road_R76.svg.png",
      "id": "250px-SA-road-R76-svg",
      "description": "South African road marker - 250px-SA_road_R76.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R80.svg.png",
      "path": "/images/signs/250px-SA_road_R80.svg.png",
      "id": "250px-SA-road-R80-svg",
      "description": "South African road marker - 250px-SA_road_R80.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R81.svg.png",
      "path": "/images/signs/250px-SA_road_R81.svg.png",
      "id": "250px-SA-road-R81-svg",
      "description": "South African road marker - 250px-SA_road_R81.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-SA_road_R82.svg.png",
      "path": "/images/signs/250px-SA_road_R82.svg.png",
      "id": "250px-SA-road-R82-svg",
      "description": "South African road marker - 250px-SA_road_R82.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-South_African_sign_warning_of_penguins.jpg",
      "path": "/images/signs/250px-South_African_sign_warning_of_penguins.jpg",
      "id": "250px-South-African-sign-warning-of-penguins",
      "description": "K53 driving content - 250px-South_African_sign_warning_of_penguins",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-South_africa_stop_sign.png",
      "path": "/images/signs/250px-South_africa_stop_sign.png",
      "id": "250px-South-africa-stop-sign",
      "description": "K53 driving content - 250px-South_africa_stop_sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Stop_sign%2C_Ode_Molen.jpg",
      "path": "/images/signs/250px-Stop_sign%2C_Ode_Molen.jpg",
      "id": "250px-Stop-sign-2C-Ode-Molen",
      "description": "K53 driving content - 250px-Stop_sign%2C_Ode_Molen",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Trafficsign_in_South_Africa.jpg",
      "path": "/images/signs/250px-Trafficsign_in_South_Africa.jpg",
      "id": "250px-Trafficsign-in-South-Africa",
      "description": "K53 driving content - 250px-Trafficsign_in_South_Africa",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Warning_sign_Baboons.jpg",
      "path": "/images/signs/250px-Warning_sign_Baboons.jpg",
      "id": "250px-Warning-sign-Baboons",
      "description": "K53 driving content - 250px-Warning_sign_Baboons",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Almasign.jpg",
      "path": "/images/signs/330px-Almasign.jpg",
      "id": "330px-Almasign",
      "description": "K53 driving content - 330px-Almasign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Bottom_of_the_main_road_sign_post.jpg",
      "path": "/images/signs/330px-Bottom_of_the_main_road_sign_post.jpg",
      "id": "330px-Bottom-of-the-main-road-sign-post",
      "description": "K53 driving content - 330px-Bottom_of_the_main_road_sign_post",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52115489850).jpg",
      "path": "/images/signs/330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52115489850).jpg",
      "id": "330px-Cheetah--Acinonyx-jubatus--male-jumping-on-the-road-marker------52115489850-",
      "description": "K53 driving content - 330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52115489850)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52484543234).jpg",
      "path": "/images/signs/330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52484543234).jpg",
      "id": "330px-Cheetah--Acinonyx-jubatus--male-jumping-on-the-road-marker------52484543234-",
      "description": "K53 driving content - 330px-Cheetah_(Acinonyx_jubatus)_male_jumping_on_the_road_marker_..._(52484543234)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-High_Accident_Zone%2C_warning_sign_in_South_Africa.jpg",
      "path": "/images/signs/330px-High_Accident_Zone%2C_warning_sign_in_South_Africa.jpg",
      "id": "330px-High-Accident-Zone-2C-warning-sign-in-South-Africa",
      "description": "K53 driving content - 330px-High_Accident_Zone%2C_warning_sign_in_South_Africa",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Kalahari_Trails_sign%2C_Kalahari%2C_Northern_Cape%2C_South_Africa_(20353961928).jpg",
      "path": "/images/signs/330px-Kalahari_Trails_sign%2C_Kalahari%2C_Northern_Cape%2C_South_Africa_(20353961928).jpg",
      "id": "330px-Kalahari-Trails-sign-2C-Kalahari-2C-Northern-Cape-2C-South-Africa--20353961928-",
      "description": "K53 driving content - 330px-Kalahari_Trails_sign%2C_Kalahari%2C_Northern_Cape%2C_South_Africa_(20353961928)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Little_Switzerland_sign.jpg",
      "path": "/images/signs/330px-Little_Switzerland_sign.jpg",
      "id": "330px-Little-Switzerland-sign",
      "description": "K53 driving content - 330px-Little_Switzerland_sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-N4roadeastboundnearmodderspruit.jpg",
      "path": "/images/signs/330px-N4roadeastboundnearmodderspruit.jpg",
      "id": "330px-N4roadeastboundnearmodderspruit",
      "description": "K53 driving content - 330px-N4roadeastboundnearmodderspruit",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Port_Elizabeth_sign_outside_st_Mary's_Cemetary.jpg",
      "path": "/images/signs/330px-Port_Elizabeth_sign_outside_st_Mary's_Cemetary.jpg",
      "id": "330px-Port-Elizabeth-sign-outside-st-Mary-s-Cemetary",
      "description": "K53 driving content - 330px-Port_Elizabeth_sign_outside_st_Mary's_Cemetary",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GD-NAM1.jpg",
      "path": "/images/signs/330px-SADC_road_sign_GD-NAM1.jpg",
      "id": "330px-SADC-road-sign-GD-NAM1",
      "description": "South African road sign - 330px-SADC_road_sign_GD-NAM1",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GD5-NAM.jpg",
      "path": "/images/signs/330px-SADC_road_sign_GD5-NAM.jpg",
      "id": "330px-SADC-road-sign-GD5-NAM",
      "description": "South African road sign - 330px-SADC_road_sign_GD5-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GD6-NAM.jpg",
      "path": "/images/signs/330px-SADC_road_sign_GD6-NAM.jpg",
      "id": "330px-SADC-road-sign-GD6-NAM",
      "description": "South African road sign - 330px-SADC_road_sign_GD6-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GD7-NAM.jpg",
      "path": "/images/signs/330px-SADC_road_sign_GD7-NAM.jpg",
      "id": "330px-SADC-road-sign-GD7-NAM",
      "description": "South African road sign - 330px-SADC_road_sign_GD7-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GD8-NAM.jpg",
      "path": "/images/signs/330px-SADC_road_sign_GD8-NAM.jpg",
      "id": "330px-SADC-road-sign-GD8-NAM",
      "description": "South African road sign - 330px-SADC_road_sign_GD8-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GDLS_A2-2.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GDLS_A2-2.svg.png",
      "id": "330px-SADC-road-sign-GDLS-A2-2-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GDLS_A2-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GDLS_A2-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GDLS_A2-5.svg.png",
      "id": "330px-SADC-road-sign-GDLS-A2-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GDLS_A2-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GDLS_A4-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GDLS_A4-5.svg.png",
      "id": "330px-SADC-road-sign-GDLS-A4-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GDLS_A4-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GDS-17.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GDS-17.svg.png",
      "id": "330px-SADC-road-sign-GDS-17-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GDS-17.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GF14.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GF14.svg.png",
      "id": "330px-SADC-road-sign-GF14-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GF14.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A1.svg.png",
      "id": "330px-SADC-road-sign-GFS-A1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A10.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A10.svg.png",
      "id": "330px-SADC-road-sign-GFS-A10-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A12-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A12-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-A12-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A12-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A12-7.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A12-7.svg.png",
      "id": "330px-SADC-road-sign-GFS-A12-7-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A12-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A12-9.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A12-9.svg.png",
      "id": "330px-SADC-road-sign-GFS-A12-9-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A12-9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A12.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A12.svg.png",
      "id": "330px-SADC-road-sign-GFS-A12-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A12.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A2-1-RSA.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A2-1-RSA.svg.png",
      "id": "330px-SADC-road-sign-GFS-A2-1-RSA-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A2-1-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A2-4-RSA.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A2-4-RSA.svg.png",
      "id": "330px-SADC-road-sign-GFS-A2-4-RSA-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A2-4-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A3-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A3-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-A3-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A3-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A3-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A3-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-A3-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A3-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A3-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A3-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-A3-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A3-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A3.svg.png",
      "id": "330px-SADC-road-sign-GFS-A3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A4-11.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A4-11.svg.png",
      "id": "330px-SADC-road-sign-GFS-A4-11-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A4-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A4-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A4-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-A4-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A4-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A4-6.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A4-6.svg.png",
      "id": "330px-SADC-road-sign-GFS-A4-6-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A4-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A4.svg.png",
      "id": "330px-SADC-road-sign-GFS-A4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A5-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A5-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-A5-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A5-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A5-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A5-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-A5-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A5-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A5-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A5-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-A5-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A5-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A5-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A5-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-A5-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A5-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A5-8.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A5-8.svg.png",
      "id": "330px-SADC-road-sign-GFS-A5-8-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A5-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A6-6.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A6-6.svg.png",
      "id": "330px-SADC-road-sign-GFS-A6-6-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A6-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A7-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A7-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-A7-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A7-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-10.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-10.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-10-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-11.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-11.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-11-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-6.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-6.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-6-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8-8.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8-8.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-8-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A8.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A8.svg.png",
      "id": "330px-SADC-road-sign-GFS-A8-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A9-6.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A9-6.svg.png",
      "id": "330px-SADC-road-sign-GFS-A9-6-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A9-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A9-7.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A9-7.svg.png",
      "id": "330px-SADC-road-sign-GFS-A9-7-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A9-7.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A9-8.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A9-8.svg.png",
      "id": "330px-SADC-road-sign-GFS-A9-8-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A9-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_A9.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_A9.svg.png",
      "id": "330px-SADC-road-sign-GFS-A9-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_A9.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B2-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B2-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-B2-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B2-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B3-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B3-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-B3-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B3-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B6-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B6-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-B6-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B6-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B6-2.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B6-2.svg.png",
      "id": "330px-SADC-road-sign-GFS-B6-2-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B6-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B6-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B6-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-B6-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B6-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B7-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B7-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-B7-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B7-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B7-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B7-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-B7-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B7-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B7-4.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B7-4.svg.png",
      "id": "330px-SADC-road-sign-GFS-B7-4-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B7-4.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B7-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B7-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-B7-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B7-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_B7-6.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_B7-6.svg.png",
      "id": "330px-SADC-road-sign-GFS-B7-6-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_B7-6.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-1.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-1.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-1-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-10.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-10.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-10-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-10.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-11.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-11.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-11-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-2.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-2.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-2-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-2.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-3.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-3.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-3-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-3.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-5.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-5.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-5-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-5.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_C1-8.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_C1-8.svg.png",
      "id": "330px-SADC-road-sign-GFS-C1-8-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_C1-8.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_GFS_D2-3-RSA.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_GFS_D2-3-RSA.svg.png",
      "id": "330px-SADC-road-sign-GFS-D2-3-RSA-svg",
      "description": "South African road sign - 330px-SADC_road_sign_GFS_D2-3-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_IN11.506.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_IN11.506.svg.png",
      "id": "330px-SADC-road-sign-IN11-506-svg",
      "description": "South African road sign - 330px-SADC_road_sign_IN11.506.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_R502-B.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_R502-B.svg.png",
      "id": "330px-SADC-road-sign-R502-B-svg",
      "description": "South African road sign - 330px-SADC_road_sign_R502-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_R502.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_R502.svg.png",
      "id": "330px-SADC-road-sign-R502-svg",
      "description": "South African road sign - 330px-SADC_road_sign_R502.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_R506.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_R506.svg.png",
      "id": "330px-SADC-road-sign-R506-svg",
      "description": "South African road sign - 330px-SADC_road_sign_R506.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_R532-B.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_R532-B.svg.png",
      "id": "330px-SADC-road-sign-R532-B-svg",
      "description": "South African road sign - 330px-SADC_road_sign_R532-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_R532.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_R532.svg.png",
      "id": "330px-SADC-road-sign-R532-svg",
      "description": "South African road sign - 330px-SADC_road_sign_R532.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TIN13-POR.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TIN13-POR.svg.png",
      "id": "330px-SADC-road-sign-TIN13-POR-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TIN13-POR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TIN13.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TIN13.svg.png",
      "id": "330px-SADC-road-sign-TIN13-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TIN13.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TR502-B.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TR502-B.svg.png",
      "id": "330px-SADC-road-sign-TR502-B-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TR502-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TR502.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TR502.svg.png",
      "id": "330px-SADC-road-sign-TR502-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TR502.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TR532-B.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TR532-B.svg.png",
      "id": "330px-SADC-road-sign-TR532-B-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TR532-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_TR532.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_TR532.svg.png",
      "id": "330px-SADC-road-sign-TR532-svg",
      "description": "South African road sign - 330px-SADC_road_sign_TR532.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SADC_road_sign_W403.svg.png",
      "path": "/images/signs/330px-SADC_road_sign_W403.svg.png",
      "id": "330px-SADC-road-sign-W403-svg",
      "description": "South African road sign - 330px-SADC_road_sign_W403.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N11_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N11_jct.svg.png",
      "id": "330px-SA-road-N11-jct-svg",
      "description": "South African road marker - 330px-SA_road_N11_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N1_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N1_jct.svg.png",
      "id": "330px-SA-road-N1-jct-svg",
      "description": "South African road marker - 330px-SA_road_N1_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N2_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N2_jct.svg.png",
      "id": "330px-SA-road-N2-jct-svg",
      "description": "South African road marker - 330px-SA_road_N2_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N3_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N3_jct.svg.png",
      "id": "330px-SA-road-N3-jct-svg",
      "description": "South African road marker - 330px-SA_road_N3_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N4_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N4_jct.svg.png",
      "id": "330px-SA-road-N4-jct-svg",
      "description": "South African road marker - 330px-SA_road_N4_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N5_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N5_jct.svg.png",
      "id": "330px-SA-road-N5-jct-svg",
      "description": "South African road marker - 330px-SA_road_N5_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N6_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N6_jct.svg.png",
      "id": "330px-SA-road-N6-jct-svg",
      "description": "South African road marker - 330px-SA_road_N6_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N7_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N7_jct.svg.png",
      "id": "330px-SA-road-N7-jct-svg",
      "description": "South African road marker - 330px-SA_road_N7_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N8_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N8_jct.svg.png",
      "id": "330px-SA-road-N8-jct-svg",
      "description": "South African road marker - 330px-SA_road_N8_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_N9_jct.svg.png",
      "path": "/images/signs/330px-SA_road_N9_jct.svg.png",
      "id": "330px-SA-road-N9-jct-svg",
      "description": "South African road marker - 330px-SA_road_N9_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N1_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N1_jct.svg.png",
      "id": "330px-SA-road-to-N1-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N1_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N2_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N2_jct.svg.png",
      "id": "330px-SA-road-to-N2-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N2_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N3_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N3_jct.svg.png",
      "id": "330px-SA-road-to-N3-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N3_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N4_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N4_jct.svg.png",
      "id": "330px-SA-road-to-N4-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N4_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N5_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N5_jct.svg.png",
      "id": "330px-SA-road-to-N5-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N5_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N6_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N6_jct.svg.png",
      "id": "330px-SA-road-to-N6-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N6_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N7_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N7_jct.svg.png",
      "id": "330px-SA-road-to-N7-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N7_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N8_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N8_jct.svg.png",
      "id": "330px-SA-road-to-N8-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N8_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SA_road_to_N9_jct.svg.png",
      "path": "/images/signs/330px-SA_road_to_N9_jct.svg.png",
      "id": "330px-SA-road-to-N9-jct-svg",
      "description": "South African road marker - 330px-SA_road_to_N9_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Street_sign_in_Bismarck-Str._Swakopmund%2C_Namibia_(2014).jpg",
      "path": "/images/signs/330px-Street_sign_in_Bismarck-Str._Swakopmund%2C_Namibia_(2014).jpg",
      "id": "330px-Street-sign-in-Bismarck-Str--Swakopmund-2C-Namibia--2014-",
      "description": "K53 driving content - 330px-Street_sign_in_Bismarck-Str._Swakopmund%2C_Namibia_(2014)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Tar_road_curving_to_the_right_and_then_white_bridge.jpg",
      "path": "/images/signs/330px-Tar_road_curving_to_the_right_and_then_white_bridge.jpg",
      "id": "330px-Tar-road-curving-to-the-right-and-then-white-bridge",
      "description": "K53 driving content - 330px-Tar_road_curving_to_the_right_and_then_white_bridge",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Zahamburg_sign.jpg",
      "path": "/images/signs/330px-Zahamburg_sign.jpg",
      "id": "330px-Zahamburg-sign",
      "description": "K53 driving content - 330px-Zahamburg_sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_GD2-NAM.jpg",
      "path": "/images/signs/500px-SADC_road_sign_GD2-NAM.jpg",
      "id": "500px-SADC-road-sign-GD2-NAM",
      "description": "South African road sign - 500px-SADC_road_sign_GD2-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_GD3-NAM.jpg",
      "path": "/images/signs/500px-SADC_road_sign_GD3-NAM.jpg",
      "id": "500px-SADC-road-sign-GD3-NAM",
      "description": "South African road sign - 500px-SADC_road_sign_GD3-NAM",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_GDLS_A2-14.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_GDLS_A2-14.svg.png",
      "id": "500px-SADC-road-sign-GDLS-A2-14-svg",
      "description": "South African road sign - 500px-SADC_road_sign_GDLS_A2-14.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_GDS-22.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_GDS-22.svg.png",
      "id": "500px-SADC-road-sign-GDS-22-svg",
      "description": "South African road sign - 500px-SADC_road_sign_GDS-22.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_GF11.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_GF11.svg.png",
      "id": "500px-SADC-road-sign-GF11-svg",
      "description": "South African road sign - 500px-SADC_road_sign_GF11.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.501.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.501.svg.png",
      "id": "500px-SADC-road-sign-IN11-501-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.501.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.560.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.560.svg.png",
      "id": "500px-SADC-road-sign-IN11-560-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.560.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.561.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.561.svg.png",
      "id": "500px-SADC-road-sign-IN11-561-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.561.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.562.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.562.svg.png",
      "id": "500px-SADC-road-sign-IN11-562-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.562.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.563.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.563.svg.png",
      "id": "500px-SADC-road-sign-IN11-563-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.563.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.564-RHT.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.564-RHT.svg.png",
      "id": "500px-SADC-road-sign-IN11-564-RHT-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.564-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.564.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.564.svg.png",
      "id": "500px-SADC-road-sign-IN11-564-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.564.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.565.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.565.svg.png",
      "id": "500px-SADC-road-sign-IN11-565-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.565.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.566.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.566.svg.png",
      "id": "500px-SADC-road-sign-IN11-566-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.566.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.567.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.567.svg.png",
      "id": "500px-SADC-road-sign-IN11-567-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.567.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.568.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.568.svg.png",
      "id": "500px-SADC-road-sign-IN11-568-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.568.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.569.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.569.svg.png",
      "id": "500px-SADC-road-sign-IN11-569-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.569.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.570.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.570.svg.png",
      "id": "500px-SADC-road-sign-IN11-570-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.570.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.571.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.571.svg.png",
      "id": "500px-SADC-road-sign-IN11-571-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.571.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.572-POR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.572-POR.svg.png",
      "id": "500px-SADC-road-sign-IN11-572-POR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.572-POR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.572.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.572.svg.png",
      "id": "500px-SADC-road-sign-IN11-572-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.572.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.573.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.573.svg.png",
      "id": "500px-SADC-road-sign-IN11-573-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.573.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.574-POR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.574-POR.svg.png",
      "id": "500px-SADC-road-sign-IN11-574-POR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.574-POR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.574.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.574.svg.png",
      "id": "500px-SADC-road-sign-IN11-574-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.574.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.575.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.575.svg.png",
      "id": "500px-SADC-road-sign-IN11-575-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.575.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.576.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.576.svg.png",
      "id": "500px-SADC-road-sign-IN11-576-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.576.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.577-NAM.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.577-NAM.svg.png",
      "id": "500px-SADC-road-sign-IN11-577-NAM-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.577-NAM.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.577-RSA.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.577-RSA.svg.png",
      "id": "500px-SADC-road-sign-IN11-577-RSA-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.577-RSA.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.577.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.577.svg.png",
      "id": "500px-SADC-road-sign-IN11-577-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.577.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.578.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.578.svg.png",
      "id": "500px-SADC-road-sign-IN11-578-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.578.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.579.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.579.svg.png",
      "id": "500px-SADC-road-sign-IN11-579-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.579.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.580.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.580.svg.png",
      "id": "500px-SADC-road-sign-IN11-580-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.580.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.581.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.581.svg.png",
      "id": "500px-SADC-road-sign-IN11-581-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.581.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.582.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.582.svg.png",
      "id": "500px-SADC-road-sign-IN11-582-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.582.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.583.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.583.svg.png",
      "id": "500px-SADC-road-sign-IN11-583-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.583.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_IN11.5XX.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_IN11.5XX.svg.png",
      "id": "500px-SADC-road-sign-IN11-5XX-svg",
      "description": "South African road sign - 500px-SADC_road_sign_IN11.5XX.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R1.5-POR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R1.5-POR.svg.png",
      "id": "500px-SADC-road-sign-R1-5-POR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R1.5-POR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R1.5-RSA.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R1.5-RSA.svg.png",
      "id": "500px-SADC-road-sign-R1-5-RSA-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R1.5-RSA.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R1.5.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R1.5.svg.png",
      "id": "500px-SADC-road-sign-R1-5-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R1.5.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R501-B.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R501-B.svg.png",
      "id": "500px-SADC-road-sign-R501-B-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R501-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R501.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R501.svg.png",
      "id": "500px-SADC-road-sign-R501-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R501.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535-AFR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535-AFR.svg.png",
      "id": "500px-SADC-road-sign-R535-AFR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535-AFR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535-B-AFR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535-B-AFR.svg.png",
      "id": "500px-SADC-road-sign-R535-B-AFR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535-B-AFR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535-B-TAN.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535-B-TAN.svg.png",
      "id": "500px-SADC-road-sign-R535-B-TAN-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535-B-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535-B.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535-B.svg.png",
      "id": "500px-SADC-road-sign-R535-B-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535-TAN.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535-TAN.svg.png",
      "id": "500px-SADC-road-sign-R535-TAN-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_R535.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_R535.svg.png",
      "id": "500px-SADC-road-sign-R535-svg",
      "description": "South African road sign - 500px-SADC_road_sign_R535.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.501.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.501.svg.png",
      "id": "500px-SADC-road-sign-TIN11-501-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.501.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.560.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.560.svg.png",
      "id": "500px-SADC-road-sign-TIN11-560-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.560.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.561.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.561.svg.png",
      "id": "500px-SADC-road-sign-TIN11-561-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.561.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.562.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.562.svg.png",
      "id": "500px-SADC-road-sign-TIN11-562-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.562.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.563.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.563.svg.png",
      "id": "500px-SADC-road-sign-TIN11-563-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.563.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.564-RHT.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.564-RHT.svg.png",
      "id": "500px-SADC-road-sign-TIN11-564-RHT-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.564-RHT.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.564.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.564.svg.png",
      "id": "500px-SADC-road-sign-TIN11-564-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.564.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.565.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.565.svg.png",
      "id": "500px-SADC-road-sign-TIN11-565-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.565.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.566.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.566.svg.png",
      "id": "500px-SADC-road-sign-TIN11-566-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.566.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.567.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.567.svg.png",
      "id": "500px-SADC-road-sign-TIN11-567-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.567.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.568.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.568.svg.png",
      "id": "500px-SADC-road-sign-TIN11-568-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.568.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.569.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.569.svg.png",
      "id": "500px-SADC-road-sign-TIN11-569-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.569.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.570.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.570.svg.png",
      "id": "500px-SADC-road-sign-TIN11-570-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.570.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.571.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.571.svg.png",
      "id": "500px-SADC-road-sign-TIN11-571-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.571.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.572-POR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.572-POR.svg.png",
      "id": "500px-SADC-road-sign-TIN11-572-POR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.572-POR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.572.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.572.svg.png",
      "id": "500px-SADC-road-sign-TIN11-572-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.572.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.573.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.573.svg.png",
      "id": "500px-SADC-road-sign-TIN11-573-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.573.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.574-POR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.574-POR.svg.png",
      "id": "500px-SADC-road-sign-TIN11-574-POR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.574-POR.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.574.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.574.svg.png",
      "id": "500px-SADC-road-sign-TIN11-574-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.574.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.575.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.575.svg.png",
      "id": "500px-SADC-road-sign-TIN11-575-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.575.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.576.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.576.svg.png",
      "id": "500px-SADC-road-sign-TIN11-576-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.576.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.577-NAM.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.577-NAM.svg.png",
      "id": "500px-SADC-road-sign-TIN11-577-NAM-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.577-NAM.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.577-RSA.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.577-RSA.svg.png",
      "id": "500px-SADC-road-sign-TIN11-577-RSA-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.577-RSA.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.577.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.577.svg.png",
      "id": "500px-SADC-road-sign-TIN11-577-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.577.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.578.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.578.svg.png",
      "id": "500px-SADC-road-sign-TIN11-578-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.578.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.579.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.579.svg.png",
      "id": "500px-SADC-road-sign-TIN11-579-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.579.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.580.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.580.svg.png",
      "id": "500px-SADC-road-sign-TIN11-580-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.580.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.581.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.581.svg.png",
      "id": "500px-SADC-road-sign-TIN11-581-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.581.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.582.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.582.svg.png",
      "id": "500px-SADC-road-sign-TIN11-582-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.582.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.583.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.583.svg.png",
      "id": "500px-SADC-road-sign-TIN11-583-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.583.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TIN11.5XX.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TIN11.5XX.svg.png",
      "id": "500px-SADC-road-sign-TIN11-5XX-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TIN11.5XX.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR501-B.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR501-B.svg.png",
      "id": "500px-SADC-road-sign-TR501-B-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR501-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR501.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR501.svg.png",
      "id": "500px-SADC-road-sign-TR501-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR501.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535-AFR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535-AFR.svg.png",
      "id": "500px-SADC-road-sign-TR535-AFR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535-AFR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535-B-AFR.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535-B-AFR.svg.png",
      "id": "500px-SADC-road-sign-TR535-B-AFR-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535-B-AFR.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535-B-TAN.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535-B-TAN.svg.png",
      "id": "500px-SADC-road-sign-TR535-B-TAN-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535-B-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535-B.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535-B.svg.png",
      "id": "500px-SADC-road-sign-TR535-B-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535-B.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535-TAN.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535-TAN.svg.png",
      "id": "500px-SADC-road-sign-TR535-TAN-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535-TAN.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TR535.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TR535.svg.png",
      "id": "500px-SADC-road-sign-TR535-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TR535.svg",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TW412.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TW412.svg.png",
      "id": "500px-SADC-road-sign-TW412-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TW412.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_TW414.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_TW414.svg.png",
      "id": "500px-SADC-road-sign-TW414-svg",
      "description": "South African road sign - 500px-SADC_road_sign_TW414.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SADC_road_sign_W414.svg.png",
      "path": "/images/signs/500px-SADC_road_sign_W414.svg.png",
      "id": "500px-SADC-road-sign-W414-svg",
      "description": "South African road sign - 500px-SADC_road_sign_W414.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N10_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N10_jct.svg.png",
      "id": "500px-SA-road-N10-jct-svg",
      "description": "South African road marker - 500px-SA_road_N10_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N12_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N12_jct.svg.png",
      "id": "500px-SA-road-N12-jct-svg",
      "description": "South African road marker - 500px-SA_road_N12_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N13_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N13_jct.svg.png",
      "id": "500px-SA-road-N13-jct-svg",
      "description": "South African road marker - 500px-SA_road_N13_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N14_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N14_jct.svg.png",
      "id": "500px-SA-road-N14-jct-svg",
      "description": "South African road marker - 500px-SA_road_N14_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N15_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N15_jct.svg.png",
      "id": "500px-SA-road-N15-jct-svg",
      "description": "South African road marker - 500px-SA_road_N15_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N16_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N16_jct.svg.png",
      "id": "500px-SA-road-N16-jct-svg",
      "description": "South African road marker - 500px-SA_road_N16_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N17_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N17_jct.svg.png",
      "id": "500px-SA-road-N17-jct-svg",
      "description": "South African road marker - 500px-SA_road_N17_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N19_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N19_jct.svg.png",
      "id": "500px-SA-road-N19-jct-svg",
      "description": "South African road marker - 500px-SA_road_N19_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N20_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N20_jct.svg.png",
      "id": "500px-SA-road-N20-jct-svg",
      "description": "South African road marker - 500px-SA_road_N20_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_N21_jct.svg.png",
      "path": "/images/signs/500px-SA_road_N21_jct.svg.png",
      "id": "500px-SA-road-N21-jct-svg",
      "description": "South African road marker - 500px-SA_road_N21_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N10_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N10_jct.svg.png",
      "id": "500px-SA-road-to-N10-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N10_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N11_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N11_jct.svg.png",
      "id": "500px-SA-road-to-N11-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N11_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N12_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N12_jct.svg.png",
      "id": "500px-SA-road-to-N12-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N12_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N13_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N13_jct.svg.png",
      "id": "500px-SA-road-to-N13-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N13_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N14_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N14_jct.svg.png",
      "id": "500px-SA-road-to-N14-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N14_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N15_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N15_jct.svg.png",
      "id": "500px-SA-road-to-N15-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N15_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N16_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N16_jct.svg.png",
      "id": "500px-SA-road-to-N16-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N16_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N17_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N17_jct.svg.png",
      "id": "500px-SA-road-to-N17-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N17_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N18_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N18_jct.svg.png",
      "id": "500px-SA-road-to-N18-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N18_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N19_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N19_jct.svg.png",
      "id": "500px-SA-road-to-N19-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N19_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-SA_road_to_N21_jct.svg.png",
      "path": "/images/signs/500px-SA_road_to_N21_jct.svg.png",
      "id": "500px-SA-road-to-N21-jct-svg",
      "description": "South African road marker - 500px-SA_road_to_N21_jct.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "60px-SADC_road_sign_TW401.svg.png",
      "path": "/images/signs/60px-SADC_road_sign_TW401.svg.png",
      "id": "60px-SADC-road-sign-TW401-svg",
      "description": "South African road sign - 60px-SADC_road_sign_TW401.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "60px-SADC_road_sign_TW402.svg.png",
      "path": "/images/signs/60px-SADC_road_sign_TW402.svg.png",
      "id": "60px-SADC-road-sign-TW402-svg",
      "description": "South African road sign - 60px-SADC_road_sign_TW402.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "60px-SADC_road_sign_W401.svg.png",
      "path": "/images/signs/60px-SADC_road_sign_W401.svg.png",
      "id": "60px-SADC-road-sign-W401-svg",
      "description": "South African road sign - 60px-SADC_road_sign_W401.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "60px-SADC_road_sign_W402.svg.png",
      "path": "/images/signs/60px-SADC_road_sign_W402.svg.png",
      "id": "60px-SADC-road-sign-W402-svg",
      "description": "South African road sign - 60px-SADC_road_sign_W402.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_GFS_D2-4-RSA.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_GFS_D2-4-RSA.svg.png",
      "id": "960px-SADC-road-sign-GFS-D2-4-RSA-svg",
      "description": "South African road sign - 960px-SADC_road_sign_GFS_D2-4-RSA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_GLS-1.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_GLS-1.svg.png",
      "id": "960px-SADC-road-sign-GLS-1-svg",
      "description": "South African road sign - 960px-SADC_road_sign_GLS-1.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.1.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.1.svg.png",
      "id": "960px-SADC-road-sign-IN11-1-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.1.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.2.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.2.svg.png",
      "id": "960px-SADC-road-sign-IN11-2-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.2.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.3.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.3.svg.png",
      "id": "960px-SADC-road-sign-IN11-3-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.3.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.4-POR_(Blind_People).svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.4-POR_(Blind_People).svg.png",
      "id": "960px-SADC-road-sign-IN11-4-POR--Blind-People--svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.4-POR_(Blind_People).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.4.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.4.svg.png",
      "id": "960px-SADC-road-sign-IN11-4-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.4.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.4_(Blind_People).svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.4_(Blind_People).svg.png",
      "id": "960px-SADC-road-sign-IN11-4--Blind-People--svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.4_(Blind_People).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.502.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.502.svg.png",
      "id": "960px-SADC-road-sign-IN11-502-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.502.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.503.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.503.svg.png",
      "id": "960px-SADC-road-sign-IN11-503-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.503.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.504.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.504.svg.png",
      "id": "960px-SADC-road-sign-IN11-504-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.504.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_IN11.505.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_IN11.505.svg.png",
      "id": "960px-SADC-road-sign-IN11-505-svg",
      "description": "South African road sign - 960px-SADC_road_sign_IN11.505.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.1.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.1.svg.png",
      "id": "960px-SADC-road-sign-TIN11-1-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.1.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.2.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.2.svg.png",
      "id": "960px-SADC-road-sign-TIN11-2-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.2.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.3.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.3.svg.png",
      "id": "960px-SADC-road-sign-TIN11-3-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.3.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.4-POR_(Accident).svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.4-POR_(Accident).svg.png",
      "id": "960px-SADC-road-sign-TIN11-4-POR--Accident--svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.4-POR_(Accident).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.4.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.4.svg.png",
      "id": "960px-SADC-road-sign-TIN11-4-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.4.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.4_(Accident).svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.4_(Accident).svg.png",
      "id": "960px-SADC-road-sign-TIN11-4--Accident--svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.4_(Accident).svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.502.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.502.svg.png",
      "id": "960px-SADC-road-sign-TIN11-502-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.502.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.503.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.503.svg.png",
      "id": "960px-SADC-road-sign-TIN11-503-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.503.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.504.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.504.svg.png",
      "id": "960px-SADC-road-sign-TIN11-504-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.504.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TIN11.505.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TIN11.505.svg.png",
      "id": "960px-SADC-road-sign-TIN11-505-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TIN11.505.svg",
      "context": ["information"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TW407.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TW407.svg.png",
      "id": "960px-SADC-road-sign-TW407-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TW407.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TW408.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TW408.svg.png",
      "id": "960px-SADC-road-sign-TW408-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TW408.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_TW415.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_TW415.svg.png",
      "id": "960px-SADC-road-sign-TW415-svg",
      "description": "South African road sign - 960px-SADC_road_sign_TW415.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_W407.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_W407.svg.png",
      "id": "960px-SADC-road-sign-W407-svg",
      "description": "South African road sign - 960px-SADC_road_sign_W407.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_W408.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_W408.svg.png",
      "id": "960px-SADC-road-sign-W408-svg",
      "description": "South African road sign - 960px-SADC_road_sign_W408.svg",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-SADC_road_sign_W415.svg.png",
      "path": "/images/signs/960px-SADC_road_sign_W415.svg.png",
      "id": "960px-SADC-road-sign-W415-svg",
      "description": "South African road sign - 960px-SADC_road_sign_W415.svg",
      "context": ["warning"],
      "difficulty": "basic"
    }
  ],
  "controls": [
    {
      "filename": "120px-Please%2C_brake_for_our_snakes_..._(52723584179).jpg",
      "path": "/images/controls/120px-Please%2C_brake_for_our_snakes_..._(52723584179).jpg",
      "id": "120px-Please-2C-brake-for-our-snakes------52723584179-",
      "description": "K53 driving content - Please%2C_brake_for_our_snakes_..._(52723584179)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg",
      "path": "/images/controls/250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles.jpg",
      "id": "250px-William-Orpen---The-Signing-of-Peace-in-the-Hall-of-Mirrors-2C-Versailles",
      "description": "K53 driving content - 250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors%2C_Versailles",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors.jpg",
      "path": "/images/controls/250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors.jpg",
      "id": "250px-William-Orpen---The-Signing-of-Peace-in-the-Hall-of-Mirrors",
      "description": "K53 driving content - 250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_MirrorsFXD.jpg",
      "path": "/images/controls/250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_MirrorsFXD.jpg",
      "id": "250px-William-Orpen---The-Signing-of-Peace-in-the-Hall-of-MirrorsFXD",
      "description": "K53 driving content - 250px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_MirrorsFXD",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Signing_of_Peace_in_the_Hall_of_Mirrors_(fragment).png",
      "path": "/images/controls/500px-Signing_of_Peace_in_the_Hall_of_Mirrors_(fragment).png",
      "id": "500px-Signing-of-Peace-in-the-Hall-of-Mirrors--fragment-",
      "description": "K53 driving content - 500px-Signing_of_Peace_in_the_Hall_of_Mirrors_(fragment)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors_-_Detail.jpg",
      "path": "/images/controls/960px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors_-_Detail.jpg",
      "id": "960px-William-Orpen---The-Signing-of-Peace-in-the-Hall-of-Mirrors---Detail",
      "description": "K53 driving content - 960px-William_Orpen_-_The_Signing_of_Peace_in_the_Hall_of_Mirrors_-_Detail",
      "context": ["general"],
      "difficulty": "basic"
    }
  ],
  "scenarios": [
    {
      "filename": "120px-Crop_to_Johnson_and_Seward_detail_of_The_man_that_blocks_up_the_highway.jpg",
      "path": "/images/scenarios/120px-Crop_to_Johnson_and_Seward_detail_of_The_man_that_blocks_up_the_highway.jpg",
      "id": "120px-Crop-to-Johnson-and-Seward-detail-of-The-man-that-blocks-up-the-highway",
      "description": "K53 driving content - Crop_to_Johnson_and_Seward_detail_of_The_man_that_blocks_up_the_highway",
      "context": ["highway"],
      "difficulty": "intermediate"
    },
    {
      "filename": "120px-Crossing_Hippopotamus_by_night.jpg",
      "path": "/images/scenarios/120px-Crossing_Hippopotamus_by_night.jpg",
      "id": "120px-Crossing-Hippopotamus-by-night",
      "description": "K53 driving content - Crossing_Hippopotamus_by_night",
      "context": ["general"],
      "difficulty": "intermediate"
    },
    {
      "filename": "120px-South_Africa-Emergency_Numbers01.jpg",
      "path": "/images/scenarios/120px-South_Africa-Emergency_Numbers01.jpg",
      "id": "120px-South-Africa-Emergency-Numbers01",
      "description": "Emergency services information",
      "context": ["emergency"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-Beautiful_weather_of_Ikoyi_05.jpg",
      "path": "/images/scenarios/250px-Beautiful_weather_of_Ikoyi_05.jpg",
      "id": "250px-Beautiful-weather-of-Ikoyi-05",
      "description": "K53 driving content - 250px-Beautiful_weather_of_Ikoyi_05",
      "context": ["general"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-Beautiful_weather_of_Ikoyi_07.jpg",
      "path": "/images/scenarios/250px-Beautiful_weather_of_Ikoyi_07.jpg",
      "id": "250px-Beautiful-weather-of-Ikoyi-07",
      "description": "K53 driving content - 250px-Beautiful_weather_of_Ikoyi_07",
      "context": ["general"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-Beautiful_weather_of_Ikoyi_08.jpg",
      "path": "/images/scenarios/250px-Beautiful_weather_of_Ikoyi_08.jpg",
      "id": "250px-Beautiful-weather-of-Ikoyi-08",
      "description": "K53 driving content - 250px-Beautiful_weather_of_Ikoyi_08",
      "context": ["general"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-Library_Company_of_Philadelphia_5760.F.111_The_man_that_blocks_up_the_highway_Philadelphia_1866.jpg",
      "path": "/images/scenarios/250px-Library_Company_of_Philadelphia_5760.F.111_The_man_that_blocks_up_the_highway_Philadelphia_1866.jpg",
      "id": "250px-Library-Company-of-Philadelphia-5760-F-111-The-man-that-blocks-up-the-highway-Philadelphia-1866",
      "description": "K53 driving content - 250px-Library_Company_of_Philadelphia_5760.F.111_The_man_that_blocks_up_the_highway_Philadelphia_1866",
      "context": ["highway"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-M1_Johannesburg_Highway_Sign.jpg",
      "path": "/images/scenarios/250px-M1_Johannesburg_Highway_Sign.jpg",
      "id": "250px-M1-Johannesburg-Highway-Sign",
      "description": "K53 driving content - 250px-M1_Johannesburg_Highway_Sign",
      "context": ["highway"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-N-12_Pentagon_highway_sign.png",
      "path": "/images/scenarios/250px-N-12_Pentagon_highway_sign.png",
      "id": "250px-N-12-Pentagon-highway-sign",
      "description": "K53 driving content - 250px-N-12_Pentagon_highway_sign",
      "context": ["highway"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-Pentagon_highway_7_shield.png",
      "path": "/images/scenarios/250px-Pentagon_highway_7_shield.png",
      "id": "250px-Pentagon-highway-7-shield",
      "description": "K53 driving content - 250px-Pentagon_highway_7_shield",
      "context": ["highway"],
      "difficulty": "intermediate"
    },
    {
      "filename": "250px-View_SE_down_Chiappini_Street_from_Helliger_Lane_intersection%2C_Bo-Kaap%2C_Cape_Town.jpg",
      "path": "/images/scenarios/250px-View_SE_down_Chiappini_Street_from_Helliger_Lane_intersection%2C_Bo-Kaap%2C_Cape_Town.jpg",
      "id": "250px-View-SE-down-Chiappini-Street-from-Helliger-Lane-intersection-2C-Bo-Kaap-2C-Cape-Town",
      "description": "K53 driving content - 250px-View_SE_down_Chiappini_Street_from_Helliger_Lane_intersection%2C_Bo-Kaap%2C_Cape_Town",
      "context": ["intersection"],
      "difficulty": "intermediate"
    }
  ],
  "locations": [
    {
      "filename": "120px-Hector_Pieterson_Museum%2C_Soweto.jpg",
      "path": "/images/locations/120px-Hector_Pieterson_Museum%2C_Soweto.jpg",
      "id": "120px-Hector-Pieterson-Museum-2C-Soweto",
      "description": "Historical landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Old_Raadsaal%2C_Church_Square_Pretoria_007.jpg",
      "path": "/images/locations/120px-Old_Raadsaal%2C_Church_Square_Pretoria_007.jpg",
      "id": "120px-Old-Raadsaal-2C-Church-Square-Pretoria-007",
      "description": "Religious landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-PortElizabeth_RouteMarker.jpg",
      "path": "/images/locations/120px-PortElizabeth_RouteMarker.jpg",
      "id": "120px-PortElizabeth-RouteMarker",
      "description": "K53 driving content - PortElizabeth_RouteMarker",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Suráfrica%2C_Namaqualand_37.jpg",
      "path": "/images/locations/120px-Suráfrica%2C_Namaqualand_37.jpg",
      "id": "120px-Sur-frica-2C-Namaqualand-37",
      "description": "K53 driving content - Suráfrica%2C_Namaqualand_37",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Welcome_in_Barrydale.jpg",
      "path": "/images/locations/120px-Welcome_in_Barrydale.jpg",
      "id": "120px-Welcome-in-Barrydale",
      "description": "K53 driving content - Welcome_in_Barrydale",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "1260px-WV_banner_Driving_in_South_Africa_Road_signs_N1_Johannesburg.jpg",
      "path": "/images/locations/1260px-WV_banner_Driving_in_South_Africa_Road_signs_N1_Johannesburg.jpg",
      "id": "1260px-WV-banner-Driving-in-South-Africa-Road-signs-N1-Johannesburg",
      "description": "K53 driving content - 1260px-WV_banner_Driving_in_South_Africa_Road_signs_N1_Johannesburg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-2025_Cape_Town_Cycle_Tour_-_Nelson_Mandela_Boulevard.jpg",
      "path": "/images/locations/250px-2025_Cape_Town_Cycle_Tour_-_Nelson_Mandela_Boulevard.jpg",
      "id": "250px-2025-Cape-Town-Cycle-Tour---Nelson-Mandela-Boulevard",
      "description": "K53 driving content - 250px-2025_Cape_Town_Cycle_Tour_-_Nelson_Mandela_Boulevard",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Bo-Kaap%2C_Cape_Town_(8).jpg",
      "path": "/images/locations/250px-Bo-Kaap%2C_Cape_Town_(8).jpg",
      "id": "250px-Bo-Kaap-2C-Cape-Town--8-",
      "description": "K53 driving content - 250px-Bo-Kaap%2C_Cape_Town_(8)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Durban's_Post_Office_(196892038).jpg",
      "path": "/images/locations/250px-Durban's_Post_Office_(196892038).jpg",
      "id": "250px-Durban-s-Post-Office--196892038-",
      "description": "K53 driving content - 250px-Durban's_Post_Office_(196892038)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Government_Building_in_Pretoria.jpg",
      "path": "/images/locations/250px-Government_Building_in_Pretoria.jpg",
      "id": "250px-Government-Building-in-Pretoria",
      "description": "K53 driving content - 250px-Government_Building_in_Pretoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Jacaranda_Trees_Pretoria.jpg",
      "path": "/images/locations/250px-Jacaranda_Trees_Pretoria.jpg",
      "id": "250px-Jacaranda-Trees-Pretoria",
      "description": "K53 driving content - 250px-Jacaranda_Trees_Pretoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-N1_(South_Africa)%2C_Pretoria.jpg",
      "path": "/images/locations/250px-N1_(South_Africa)%2C_Pretoria.jpg",
      "id": "250px-N1--South-Africa--2C-Pretoria",
      "description": "K53 driving content - 250px-N1_(South_Africa)%2C_Pretoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-OldJohannesburgRoad.jpg",
      "path": "/images/locations/250px-OldJohannesburgRoad.jpg",
      "id": "250px-OldJohannesburgRoad",
      "description": "K53 driving content - 250px-OldJohannesburgRoad",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_sign_and_birds_in_Cape_Town.jpg",
      "path": "/images/locations/250px-Road_sign_and_birds_in_Cape_Town.jpg",
      "id": "250px-Road-sign-and-birds-in-Cape-Town",
      "description": "K53 driving content - 250px-Road_sign_and_birds_in_Cape_Town",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-RSA_Pretoria_2.jpg",
      "path": "/images/locations/250px-RSA_Pretoria_2.jpg",
      "id": "250px-RSA-Pretoria-2",
      "description": "K53 driving content - 250px-RSA_Pretoria_2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(4).jpg",
      "path": "/images/locations/250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(4).jpg",
      "id": "250px-Table-Mountain--Nature-Reserve--2C-Cape-Town-2C-South-Africa---panoramio--4-",
      "description": "K53 driving content - 250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(5).jpg",
      "path": "/images/locations/250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(5).jpg",
      "id": "250px-Table-Mountain--Nature-Reserve--2C-Cape-Town-2C-South-Africa---panoramio--5-",
      "description": "K53 driving content - 250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(5)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(6).jpg",
      "path": "/images/locations/250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(6).jpg",
      "id": "250px-Table-Mountain--Nature-Reserve--2C-Cape-Town-2C-South-Africa---panoramio--6-",
      "description": "K53 driving content - 250px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(6)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-The_Chris_Hani_Baragwanath_Hospital%2C_Soweto.jpg",
      "path": "/images/locations/250px-The_Chris_Hani_Baragwanath_Hospital%2C_Soweto.jpg",
      "id": "250px-The-Chris-Hani-Baragwanath-Hospital-2C-Soweto",
      "description": "K53 driving content - 250px-The_Chris_Hani_Baragwanath_Hospital%2C_Soweto",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_01.jpg",
      "path": "/images/locations/250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_01.jpg",
      "id": "250px-Travelling-due-west-by-road-from-Johannesburg-to-South-Africa-s-north-west-coastline-01",
      "description": "K53 driving content - 250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_03.jpg",
      "path": "/images/locations/250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_03.jpg",
      "id": "250px-Travelling-due-west-by-road-from-Johannesburg-to-South-Africa-s-north-west-coastline-03",
      "description": "K53 driving content - 250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_03",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_04.jpg",
      "path": "/images/locations/250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_04.jpg",
      "id": "250px-Travelling-due-west-by-road-from-Johannesburg-to-South-Africa-s-north-west-coastline-04",
      "description": "K53 driving content - 250px-Travelling_due_west_by_road_from_Johannesburg_to_South_Africa's_north-west_coastline_04",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Warning_sign%2C_Cape_Town_(_1050377).jpg",
      "path": "/images/locations/250px-Warning_sign%2C_Cape_Town_(_1050377).jpg",
      "id": "250px-Warning-sign-2C-Cape-Town---1050377-",
      "description": "K53 driving content - 250px-Warning_sign%2C_Cape_Town_(_1050377)",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wikimania_2018%2C_Cape_Town_(_1050490).jpg",
      "path": "/images/locations/250px-Wikimania_2018%2C_Cape_Town_(_1050490).jpg",
      "id": "250px-Wikimania-2018-2C-Cape-Town---1050490-",
      "description": "K53 driving content - 250px-Wikimania_2018%2C_Cape_Town_(_1050490)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wikimania_2018%2C_Cape_Town_(_1050559).jpg",
      "path": "/images/locations/250px-Wikimania_2018%2C_Cape_Town_(_1050559).jpg",
      "id": "250px-Wikimania-2018-2C-Cape-Town---1050559-",
      "description": "K53 driving content - 250px-Wikimania_2018%2C_Cape_Town_(_1050559)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wikimania_2018%2C_Cape_Town_(_1050563).jpg",
      "path": "/images/locations/250px-Wikimania_2018%2C_Cape_Town_(_1050563).jpg",
      "id": "250px-Wikimania-2018-2C-Cape-Town---1050563-",
      "description": "K53 driving content - 250px-Wikimania_2018%2C_Cape_Town_(_1050563)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-2024_Cape_Town_Cycle_Tour_(4).jpg",
      "path": "/images/locations/330px-2024_Cape_Town_Cycle_Tour_(4).jpg",
      "id": "330px-2024-Cape-Town-Cycle-Tour--4-",
      "description": "K53 driving content - 330px-2024_Cape_Town_Cycle_Tour_(4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Avenidas_de_Johannesburg_enfeitadas_no_clima_da_Copa_(4684725066).jpg",
      "path": "/images/locations/330px-Avenidas_de_Johannesburg_enfeitadas_no_clima_da_Copa_(4684725066).jpg",
      "id": "330px-Avenidas-de-Johannesburg-enfeitadas-no-clima-da-Copa--4684725066-",
      "description": "K53 driving content - 330px-Avenidas_de_Johannesburg_enfeitadas_no_clima_da_Copa_(4684725066)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cape_Town_(ZA)%2C_Cape_Point_Nature_Reserve%2C_Wegweiser_--_2024_--_3374.jpg",
      "path": "/images/locations/330px-Cape_Town_(ZA)%2C_Cape_Point_Nature_Reserve%2C_Wegweiser_--_2024_--_3374.jpg",
      "id": "330px-Cape-Town--ZA--2C-Cape-Point-Nature-Reserve-2C-Wegweiser----2024----3374",
      "description": "K53 driving content - 330px-Cape_Town_(ZA)%2C_Cape_Point_Nature_Reserve%2C_Wegweiser_--_2024_--_3374",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cape_Town_(ZA)%2C_Equity_House_--_2024_--_3513.jpg",
      "path": "/images/locations/330px-Cape_Town_(ZA)%2C_Equity_House_--_2024_--_3513.jpg",
      "id": "330px-Cape-Town--ZA--2C-Equity-House----2024----3513",
      "description": "K53 driving content - 330px-Cape_Town_(ZA)%2C_Equity_House_--_2024_--_3513",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cape_Town_in_July_2018_-_199.jpg",
      "path": "/images/locations/330px-Cape_Town_in_July_2018_-_199.jpg",
      "id": "330px-Cape-Town-in-July-2018---199",
      "description": "K53 driving content - 330px-Cape_Town_in_July_2018_-_199",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cape_Town_in_July_2018_-_204.jpg",
      "path": "/images/locations/330px-Cape_Town_in_July_2018_-_204.jpg",
      "id": "330px-Cape-Town-in-July-2018---204",
      "description": "K53 driving content - 330px-Cape_Town_in_July_2018_-_204",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cape_Town_Marathon_sign.jpg",
      "path": "/images/locations/330px-Cape_Town_Marathon_sign.jpg",
      "id": "330px-Cape-Town-Marathon-sign",
      "description": "K53 driving content - 330px-Cape_Town_Marathon_sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Doornfontein_Siemert_Road%2C_Johannesburg_Postcard.jpg",
      "path": "/images/locations/330px-Doornfontein_Siemert_Road%2C_Johannesburg_Postcard.jpg",
      "id": "330px-Doornfontein-Siemert-Road-2C-Johannesburg-Postcard",
      "description": "K53 driving content - 330px-Doornfontein_Siemert_Road%2C_Johannesburg_Postcard",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-N1_(South_Africa)%2C_Pretoria_(cropped).jpg",
      "path": "/images/locations/330px-N1_(South_Africa)%2C_Pretoria_(cropped).jpg",
      "id": "330px-N1--South-Africa--2C-Pretoria--cropped-",
      "description": "K53 driving content - 330px-N1_(South_Africa)%2C_Pretoria_(cropped)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Old_Raadsaal%2C_Church_Square_Pretoria_005.jpg",
      "path": "/images/locations/330px-Old_Raadsaal%2C_Church_Square_Pretoria_005.jpg",
      "id": "330px-Old-Raadsaal-2C-Church-Square-Pretoria-005",
      "description": "Religious landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Pretoria%2C_Neighbourhood._-_War_Office_ledger._Signed_by_H.M._Jackson_Maj._R.E._Field._Intelligence._Department._June_1900._(WOMAT-AFR-TRA-17).jpg",
      "path": "/images/locations/330px-Pretoria%2C_Neighbourhood._-_War_Office_ledger._Signed_by_H.M._Jackson_Maj._R.E._Field._Intelligence._Department._June_1900._(WOMAT-AFR-TRA-17).jpg",
      "id": "330px-Pretoria-2C-Neighbourhood----War-Office-ledger--Signed-by-H-M--Jackson-Maj--R-E--Field--Intelligence--Department--June-1900---WOMAT-AFR-TRA-17-",
      "description": "K53 driving content - 330px-Pretoria%2C_Neighbourhood._-_War_Office_ledger._Signed_by_H.M._Jackson_Maj._R.E._Field._Intelligence._Department._June_1900._(WOMAT-AFR-TRA-17)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Signal_Hill%2C_Cape_Town%2C_8001%2C_South_Africa_-_panoramio_(32).jpg",
      "path": "/images/locations/330px-Signal_Hill%2C_Cape_Town%2C_8001%2C_South_Africa_-_panoramio_(32).jpg",
      "id": "330px-Signal-Hill-2C-Cape-Town-2C-8001-2C-South-Africa---panoramio--32-",
      "description": "K53 driving content - 330px-Signal_Hill%2C_Cape_Town%2C_8001%2C_South_Africa_-_panoramio_(32)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Spin_St%2C_Cape_Town.jpg",
      "path": "/images/locations/330px-Spin_St%2C_Cape_Town.jpg",
      "id": "330px-Spin-St-2C-Cape-Town",
      "description": "K53 driving content - 330px-Spin_St%2C_Cape_Town",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Suráfrica%2C_Namaqualand_33.jpg",
      "path": "/images/locations/330px-Suráfrica%2C_Namaqualand_33.jpg",
      "id": "330px-Sur-frica-2C-Namaqualand-33",
      "description": "K53 driving content - 330px-Suráfrica%2C_Namaqualand_33",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Union_Buildings_Pretoria_012.jpg",
      "path": "/images/locations/330px-Union_Buildings_Pretoria_012.jpg",
      "id": "330px-Union-Buildings-Pretoria-012",
      "description": "K53 driving content - 330px-Union_Buildings_Pretoria_012",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(3).jpg",
      "path": "/images/locations/500px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(3).jpg",
      "id": "500px-Table-Mountain--Nature-Reserve--2C-Cape-Town-2C-South-Africa---panoramio--3-",
      "description": "K53 driving content - 500px-Table_Mountain_(Nature_Reserve)%2C_Cape_Town%2C_South_Africa_-_panoramio_(3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "N1_Pietersburg_Pretoria.jpg",
      "path": "/images/locations/N1_Pietersburg_Pretoria.jpg",
      "id": "N1-Pietersburg-Pretoria",
      "description": "K53 driving content - N1_Pietersburg_Pretoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "Reproduction_of_a_road_sign_which_appears_on_the_barbed-wire_fence_of_a_farm_facing_the_Johannesburg-Verreeniging_Road_in_Johannesburg.jpg",
      "path": "/images/locations/Reproduction_of_a_road_sign_which_appears_on_the_barbed-wire_fence_of_a_farm_facing_the_Johannesburg-Verreeniging_Road_in_Johannesburg.jpg",
      "id": "Reproduction-of-a-road-sign-which-appears-on-the-barbed-wire-fence-of-a-farm-facing-the-Johannesburg-Verreeniging-Road-in-Johannesburg",
      "description": "K53 driving content - Reproduction_of_a_road_sign_which_appears_on_the_barbed-wire_fence_of_a_farm_facing_the_Johannesburg-Verreeniging_Road_in_Johannesburg",
      "context": ["general"],
      "difficulty": "basic"
    }
  ],
  "landmarks": [
    {
      "filename": "120px-All_Saint_Church_-_monument.jpg",
      "path": "/images/landmarks/120px-All_Saint_Church_-_monument.jpg",
      "id": "120px-All-Saint-Church---monument",
      "description": "Religious landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Beach_Road_sidewalk.jpg",
      "path": "/images/landmarks/120px-Beach_Road_sidewalk.jpg",
      "id": "120px-Beach-Road-sidewalk",
      "description": "Coastal area",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Royal_Wootton_Bassett_War_Memorial%2C_Wiltshire.jpg",
      "path": "/images/landmarks/120px-Royal_Wootton_Bassett_War_Memorial%2C_Wiltshire.jpg",
      "id": "120px-Royal-Wootton-Bassett-War-Memorial-2C-Wiltshire",
      "description": "K53 driving content - Royal_Wootton_Bassett_War_Memorial%2C_Wiltshire",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Sketch_of_Road_from_Fort_Mlangeni_towards_Fort_Manning_British_Central_Africa._(WOMAT-AFR-BCA-18-1).jpg",
      "path": "/images/landmarks/120px-Sketch_of_Road_from_Fort_Mlangeni_towards_Fort_Manning_British_Central_Africa._(WOMAT-AFR-BCA-18-1).jpg",
      "id": "120px-Sketch-of-Road-from-Fort-Mlangeni-towards-Fort-Manning-British-Central-Africa---WOMAT-AFR-BCA-18-1-",
      "description": "K53 driving content - Sketch_of_Road_from_Fort_Mlangeni_towards_Fort_Manning_British_Central_Africa._(WOMAT-AFR-BCA-18-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Sketch_of_Road_from_Fort_Mlangeni_to_Fort_Johnston._B.C._Africa._(WOMAT-AFR-BCA-17-1).jpg",
      "path": "/images/landmarks/120px-Sketch_of_Road_from_Fort_Mlangeni_to_Fort_Johnston._B.C._Africa._(WOMAT-AFR-BCA-17-1).jpg",
      "id": "120px-Sketch-of-Road-from-Fort-Mlangeni-to-Fort-Johnston--B-C--Africa---WOMAT-AFR-BCA-17-1-",
      "description": "K53 driving content - Sketch_of_Road_from_Fort_Mlangeni_to_Fort_Johnston._B.C._Africa._(WOMAT-AFR-BCA-17-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Harold_Porter_National_Botanical_Gardens%2C_2419_Kloof_Road%2C_Betty's_Bay%2C_7141%2C_Sudáfrica_20220927_114421.jpg",
      "path": "/images/landmarks/250px-Harold_Porter_National_Botanical_Gardens%2C_2419_Kloof_Road%2C_Betty's_Bay%2C_7141%2C_Sudáfrica_20220927_114421.jpg",
      "id": "250px-Harold-Porter-National-Botanical-Gardens-2C-2419-Kloof-Road-2C-Betty-s-Bay-2C-7141-2C-Sud-frica-20220927-114421",
      "description": "K53 driving content - 250px-Harold_Porter_National_Botanical_Gardens%2C_2419_Kloof_Road%2C_Betty's_Bay%2C_7141%2C_Sudáfrica_20220927_114421",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Methodist_Church%2C_Fulwood_Road-Ashgate_Road%2C_Broomhill_-_geograph.org.uk_-_1141785.jpg",
      "path": "/images/landmarks/250px-Methodist_Church%2C_Fulwood_Road-Ashgate_Road%2C_Broomhill_-_geograph.org.uk_-_1141785.jpg",
      "id": "250px-Methodist-Church-2C-Fulwood-Road-Ashgate-Road-2C-Broomhill---geograph-org-uk---1141785",
      "description": "Religious landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Old_Public_Library%2C_Memorial_Park%2C_Pasadena%2C_California_(14516731052).jpg",
      "path": "/images/landmarks/250px-Old_Public_Library%2C_Memorial_Park%2C_Pasadena%2C_California_(14516731052).jpg",
      "id": "250px-Old-Public-Library-2C-Memorial-Park-2C-Pasadena-2C-California--14516731052-",
      "description": "K53 driving content - 250px-Old_Public_Library%2C_Memorial_Park%2C_Pasadena%2C_California_(14516731052)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-1).jpg",
      "path": "/images/landmarks/250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-1).jpg",
      "id": "250px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-1-",
      "description": "K53 driving content - 250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-3).jpg",
      "path": "/images/landmarks/250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-3).jpg",
      "id": "250px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-3-",
      "description": "K53 driving content - 250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-5).jpg",
      "path": "/images/landmarks/250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-5).jpg",
      "id": "250px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-5-",
      "description": "K53 driving content - 250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-5)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-6).jpg",
      "path": "/images/landmarks/250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-6).jpg",
      "id": "250px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-6-",
      "description": "K53 driving content - 250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-6)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-7).jpg",
      "path": "/images/landmarks/250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-7).jpg",
      "id": "250px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-7-",
      "description": "K53 driving content - 250px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-7)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_closed_(7042813171).jpg",
      "path": "/images/landmarks/250px-Road_closed_(7042813171).jpg",
      "id": "250px-Road-closed--7042813171-",
      "description": "K53 driving content - 250px-Road_closed_(7042813171)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_sign%2C_Cape_of_Good_Hope_-_panoramio.jpg",
      "path": "/images/landmarks/250px-Road_sign%2C_Cape_of_Good_Hope_-_panoramio.jpg",
      "id": "250px-Road-sign-2C-Cape-of-Good-Hope---panoramio",
      "description": "K53 driving content - 250px-Road_sign%2C_Cape_of_Good_Hope_-_panoramio",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_signs_in_Khayelitsha_01.jpg",
      "path": "/images/landmarks/250px-Road_signs_in_Khayelitsha_01.jpg",
      "id": "250px-Road-signs-in-Khayelitsha-01",
      "description": "K53 driving content - 250px-Road_signs_in_Khayelitsha_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_signs_in_Khayelitsha_02.jpg",
      "path": "/images/landmarks/250px-Road_signs_in_Khayelitsha_02.jpg",
      "id": "250px-Road-signs-in-Khayelitsha-02",
      "description": "K53 driving content - 250px-Road_signs_in_Khayelitsha_02",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_signs_in_Khayelitsha_03.jpg",
      "path": "/images/landmarks/250px-Road_signs_in_Khayelitsha_03.jpg",
      "id": "250px-Road-signs-in-Khayelitsha-03",
      "description": "K53 driving content - 250px-Road_signs_in_Khayelitsha_03",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Road_signs_in_Khayelitsha_04.jpg",
      "path": "/images/landmarks/250px-Road_signs_in_Khayelitsha_04.jpg",
      "id": "250px-Road-signs-in-Khayelitsha-04",
      "description": "K53 driving content - 250px-Road_signs_in_Khayelitsha_04",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Tourists_walking_along_Table_Mountain_Road_near_cableway_base_station.jpg",
      "path": "/images/landmarks/250px-Tourists_walking_along_Table_Mountain_Road_near_cableway_base_station.jpg",
      "id": "250px-Tourists-walking-along-Table-Mountain-Road-near-cableway-base-station",
      "description": "K53 driving content - 250px-Tourists_walking_along_Table_Mountain_Road_near_cableway_base_station",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Boulders_Beach_Entrance_(01).jpg",
      "path": "/images/landmarks/330px-Boulders_Beach_Entrance_(01).jpg",
      "id": "330px-Boulders-Beach-Entrance--01-",
      "description": "Coastal area",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-City_Hall%2C_Market_Square%2C_Port_Elizabeth%2C_South_Africa.jpg",
      "path": "/images/landmarks/330px-City_Hall%2C_Market_Square%2C_Port_Elizabeth%2C_South_Africa.jpg",
      "id": "330px-City-Hall-2C-Market-Square-2C-Port-Elizabeth-2C-South-Africa",
      "description": "K53 driving content - 330px-City_Hall%2C_Market_Square%2C_Port_Elizabeth%2C_South_Africa",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Gay_Road%2C_Simon's_Town.jpg",
      "path": "/images/landmarks/330px-Gay_Road%2C_Simon's_Town.jpg",
      "id": "330px-Gay-Road-2C-Simon-s-Town",
      "description": "K53 driving content - 330px-Gay_Road%2C_Simon's_Town",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Kalahari_Roadsigns_..._(50929762532).jpg",
      "path": "/images/landmarks/330px-Kalahari_Roadsigns_..._(50929762532).jpg",
      "id": "330px-Kalahari-Roadsigns------50929762532-",
      "description": "K53 driving content - 330px-Kalahari_Roadsigns_..._(50929762532)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Mandela-Memorial_8183.jpg",
      "path": "/images/landmarks/330px-Mandela-Memorial_8183.jpg",
      "id": "330px-Mandela-Memorial-8183",
      "description": "K53 driving content - 330px-Mandela-Memorial_8183",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-2).jpg",
      "path": "/images/landmarks/330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-2).jpg",
      "id": "330px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-2-",
      "description": "K53 driving content - 330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-4).jpg",
      "path": "/images/landmarks/330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-4).jpg",
      "id": "330px-Rapid-Road-Sketch-from-Entebbe-to-the-Boundary---WOOS-14-9-4-",
      "description": "K53 driving content - 330px-Rapid_Road_Sketch_from_Entebbe_to_the_Boundary._(WOOS-14-9-4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Road_closed_after_the_floods_(6994296867).jpg",
      "path": "/images/landmarks/330px-Road_closed_after_the_floods_(6994296867).jpg",
      "id": "330px-Road-closed-after-the-floods--6994296867-",
      "description": "K53 driving content - 330px-Road_closed_after_the_floods_(6994296867)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Road_sign_Ekurhuleni.jpg",
      "path": "/images/landmarks/330px-Road_sign_Ekurhuleni.jpg",
      "id": "330px-Road-sign-Ekurhuleni",
      "description": "K53 driving content - 330px-Road_sign_Ekurhuleni",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Road_on_Robben_Island_with_view_of_Devil's_Peak_through_gap_in_trees.jpg",
      "path": "/images/landmarks/500px-Road_on_Robben_Island_with_view_of_Devil's_Peak_through_gap_in_trees.jpg",
      "id": "500px-Road-on-Robben-Island-with-view-of-Devil-s-Peak-through-gap-in-trees",
      "description": "K53 driving content - 500px-Road_on_Robben_Island_with_view_of_Devil's_Peak_through_gap_in_trees",
      "context": ["general"],
      "difficulty": "basic"
    }
  ],
  "misc": [
    {
      "filename": "120px-Beware_of_hippopotamus.jpg",
      "path": "/images/misc/120px-Beware_of_hippopotamus.jpg",
      "id": "120px-Beware-of-hippopotamus",
      "description": "K53 driving content - Beware_of_hippopotamus",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-De_Waterkant_58.jpg",
      "path": "/images/misc/120px-De_Waterkant_58.jpg",
      "id": "120px-De-Waterkant-58",
      "description": "K53 driving content - De_Waterkant_58",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Map_of_part_of_British_Central_Africa_Protectorate_south_and_south-west_of_Lake_Nyasa._(WOMAT-AFR-BCA-19-1).jpg",
      "path": "/images/misc/120px-Map_of_part_of_British_Central_Africa_Protectorate_south_and_south-west_of_Lake_Nyasa._(WOMAT-AFR-BCA-19-1).jpg",
      "id": "120px-Map-of-part-of-British-Central-Africa-Protectorate-south-and-south-west-of-Lake-Nyasa---WOMAT-AFR-BCA-19-1-",
      "description": "K53 driving content - Map_of_part_of_British_Central_Africa_Protectorate_south_and_south-west_of_Lake_Nyasa._(WOMAT-AFR-BCA-19-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-Over_200_meter_STOP.jpg",
      "path": "/images/misc/120px-Over_200_meter_STOP.jpg",
      "id": "120px-Over-200-meter-STOP",
      "description": "K53 driving content - Over_200_meter_STOP",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-thumbnail (1).jpg",
      "path": "/images/misc/120px-thumbnail (1).jpg",
      "id": "120px-thumbnail--1-",
      "description": "K53 driving content - thumbnail (1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-thumbnail (2).jpg",
      "path": "/images/misc/120px-thumbnail (2).jpg",
      "id": "120px-thumbnail--2-",
      "description": "K53 driving content - thumbnail (2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "120px-thumbnail.jpg",
      "path": "/images/misc/120px-thumbnail.jpg",
      "id": "120px-thumbnail",
      "description": "K53 driving content - thumbnail",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-2014-12-01_no_trading_here_anagoria.jpg",
      "path": "/images/misc/250px-2014-12-01_no_trading_here_anagoria.jpg",
      "id": "250px-2014-12-01-no-trading-here-anagoria",
      "description": "K53 driving content - 250px-2014-12-01_no_trading_here_anagoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-3405_crumbling_quality_mono.jpg",
      "path": "/images/misc/250px-3405_crumbling_quality_mono.jpg",
      "id": "250px-3405-crumbling-quality-mono",
      "description": "K53 driving content - 250px-3405_crumbling_quality_mono",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-6SADiv_Gen_Poole_Brig_Furstenburg_Gen_Theron_1944.jpg",
      "path": "/images/misc/250px-6SADiv_Gen_Poole_Brig_Furstenburg_Gen_Theron_1944.jpg",
      "id": "250px-6SADiv-Gen-Poole-Brig-Furstenburg-Gen-Theron-1944",
      "description": "K53 driving content - 250px-6SADiv_Gen_Poole_Brig_Furstenburg_Gen_Theron_1944",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-9_2_415_0027-Town_Hall-Ladysmith-s.jpg",
      "path": "/images/misc/250px-9_2_415_0027-Town_Hall-Ladysmith-s.jpg",
      "id": "250px-9-2-415-0027-Town-Hall-Ladysmith-s",
      "description": "K53 driving content - 250px-9_2_415_0027-Town_Hall-Ladysmith-s",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-9_2_436_0002-Pietermaritzburg_City_Hall1-KZN-s.jpg",
      "path": "/images/misc/250px-9_2_436_0002-Pietermaritzburg_City_Hall1-KZN-s.jpg",
      "id": "250px-9-2-436-0002-Pietermaritzburg-City-Hall1-KZN-s",
      "description": "K53 driving content - 250px-9_2_436_0002-Pietermaritzburg_City_Hall1-KZN-s",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Addo_Elephant_National_Park-005.jpg",
      "path": "/images/misc/250px-Addo_Elephant_National_Park-005.jpg",
      "id": "250px-Addo-Elephant-National-Park-005",
      "description": "K53 driving content - 250px-Addo_Elephant_National_Park-005",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Alberton_Boulevard.jpg",
      "path": "/images/misc/250px-Alberton_Boulevard.jpg",
      "id": "250px-Alberton-Boulevard",
      "description": "K53 driving content - 250px-Alberton_Boulevard",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Bejaardes.jpg",
      "path": "/images/misc/250px-Bejaardes.jpg",
      "id": "250px-Bejaardes",
      "description": "K53 driving content - 250px-Bejaardes",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Benede%2C_South_Africa_-_panoramio_(2).jpg",
      "path": "/images/misc/250px-Benede%2C_South_Africa_-_panoramio_(2).jpg",
      "id": "250px-Benede-2C-South-Africa---panoramio--2-",
      "description": "K53 driving content - 250px-Benede%2C_South_Africa_-_panoramio_(2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-1).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-1).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-1-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-10).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-10).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-10-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-10)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-11).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-11).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-11-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-11)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-12).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-12).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-12-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-12)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-13).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-13).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-13-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-13)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-14).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-14).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-14-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-14)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-15).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-15).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-15-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-15)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-16).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-16).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-16-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-16)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-17).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-17).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-17-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-17)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-18).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-18).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-18-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-18)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-19).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-19).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-19-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-19)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-2).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-2).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-2-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-20).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-20).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-20-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-20)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-21).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-21).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-21-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-21)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-22).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-22).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-22-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-22)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-23).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-23).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-23-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-23)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-24).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-24).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-24-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-24)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-25).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-25).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-25-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-25)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-26).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-26).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-26-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-26)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-27).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-27).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-27-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-27)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-28).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-28).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-28-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-28)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-29).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-29).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-29-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-29)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-3).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-3).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-3-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-30).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-30).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-30-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-30)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-31).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-31).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-31-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-31)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-4).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-4).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-4-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-5).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-5).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-5-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-5)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-6).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-6).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-6-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-6)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-7).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-7).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-7-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-7)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-8).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-8).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-8-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-8)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-9).jpg",
      "path": "/images/misc/250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-9).jpg",
      "id": "250px-Berbera-Argan-Railway-Survey--Signed-by-A-G--Stevenson-Capt--R-E---WOMAT-ADD-85-9-",
      "description": "K53 driving content - 250px-Berbera_Argan_Railway_Survey._Signed_by_A.G._Stevenson_Capt._R.E._(WOMAT-ADD-85-9)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berea_Fire_Station_018.jpg",
      "path": "/images/misc/250px-Berea_Fire_Station_018.jpg",
      "id": "250px-Berea-Fire-Station-018",
      "description": "K53 driving content - 250px-Berea_Fire_Station_018",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Berea_Fire_Station_019.jpg",
      "path": "/images/misc/250px-Berea_Fire_Station_019.jpg",
      "id": "250px-Berea-Fire-Station-019",
      "description": "K53 driving content - 250px-Berea_Fire_Station_019",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Beware_hippopotames.jpg",
      "path": "/images/misc/250px-Beware_hippopotames.jpg",
      "id": "250px-Beware-hippopotames",
      "description": "K53 driving content - 250px-Beware_hippopotames",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-BLACK_MEN_AT_THE_ENTRANCE_TO_A_POOL_HALL_WHERE_THEY_HANG_AROUND_DAILY%2C_LOCATED_ON_ROOSEVELT_ROAD_IN_THE_HEART_OF_THE..._-_NARA_-_556153.jpg",
      "path": "/images/misc/250px-BLACK_MEN_AT_THE_ENTRANCE_TO_A_POOL_HALL_WHERE_THEY_HANG_AROUND_DAILY%2C_LOCATED_ON_ROOSEVELT_ROAD_IN_THE_HEART_OF_THE..._-_NARA_-_556153.jpg",
      "id": "250px-BLACK-MEN-AT-THE-ENTRANCE-TO-A-POOL-HALL-WHERE-THEY-HANG-AROUND-DAILY-2C-LOCATED-ON-ROOSEVELT-ROAD-IN-THE-HEART-OF-THE------NARA---556153",
      "description": "K53 driving content - 250px-BLACK_MEN_AT_THE_ENTRANCE_TO_A_POOL_HALL_WHERE_THEY_HANG_AROUND_DAILY%2C_LOCATED_ON_ROOSEVELT_ROAD_IN_THE_HEART_OF_THE..._-_NARA_-_556153",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Cat_crossing.jpg",
      "path": "/images/misc/250px-Cat_crossing.jpg",
      "id": "250px-Cat-crossing",
      "description": "K53 driving content - 250px-Cat_crossing",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484745085).jpg",
      "path": "/images/misc/250px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484745085).jpg",
      "id": "250px-Cheetahs--Acinonyx-jubatus--brothers------52484745085-",
      "description": "K53 driving content - 250px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484745085)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-City_Hall_(4612440660).jpg",
      "path": "/images/misc/250px-City_Hall_(4612440660).jpg",
      "id": "250px-City-Hall--4612440660-",
      "description": "K53 driving content - 250px-City_Hall_(4612440660)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-COLLECTIE_TROPENMUSEUM_Auto_van_de_Afronautica_expeditie_bij_een_verkeersbord_tussen_Amersfoort_en_Wakkerstroom_TMnr_20014812.jpg",
      "path": "/images/misc/250px-COLLECTIE_TROPENMUSEUM_Auto_van_de_Afronautica_expeditie_bij_een_verkeersbord_tussen_Amersfoort_en_Wakkerstroom_TMnr_20014812.jpg",
      "id": "250px-COLLECTIE-TROPENMUSEUM-Auto-van-de-Afronautica-expeditie-bij-een-verkeersbord-tussen-Amersfoort-en-Wakkerstroom-TMnr-20014812",
      "description": "Historical landmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_children.jpg",
      "path": "/images/misc/250px-Crossing_children.jpg",
      "id": "250px-Crossing-children",
      "description": "K53 driving content - 250px-Crossing_children",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_Elephants.jpg",
      "path": "/images/misc/250px-Crossing_Elephants.jpg",
      "id": "250px-Crossing-Elephants",
      "description": "K53 driving content - 250px-Crossing_Elephants",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_Hippopotamus.jpg",
      "path": "/images/misc/250px-Crossing_Hippopotamus.jpg",
      "id": "250px-Crossing-Hippopotamus",
      "description": "K53 driving content - 250px-Crossing_Hippopotamus",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_horses.jpg",
      "path": "/images/misc/250px-Crossing_horses.jpg",
      "id": "250px-Crossing-horses",
      "description": "K53 driving content - 250px-Crossing_horses",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_lorry.jpg",
      "path": "/images/misc/250px-Crossing_lorry.jpg",
      "id": "250px-Crossing-lorry",
      "description": "K53 driving content - 250px-Crossing_lorry",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_people.jpg",
      "path": "/images/misc/250px-Crossing_people.jpg",
      "id": "250px-Crossing-people",
      "description": "K53 driving content - 250px-Crossing_people",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Crossing_wild_animals.jpg",
      "path": "/images/misc/250px-Crossing_wild_animals.jpg",
      "id": "250px-Crossing-wild-animals",
      "description": "K53 driving content - 250px-Crossing_wild_animals",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-D'MOSS-padteken%2C_Springside_Natuurreservaat.jpg",
      "path": "/images/misc/250px-D'MOSS-padteken%2C_Springside_Natuurreservaat.jpg",
      "id": "250px-D-MOSS-padteken-2C-Springside-Natuurreservaat",
      "description": "K53 driving content - 250px-D'MOSS-padteken%2C_Springside_Natuurreservaat",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Deer_crossing.jpg",
      "path": "/images/misc/250px-Deer_crossing.jpg",
      "id": "250px-Deer-crossing",
      "description": "K53 driving content - 250px-Deer_crossing",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-De_Mond_P1020944.jpg",
      "path": "/images/misc/250px-De_Mond_P1020944.jpg",
      "id": "250px-De-Mond-P1020944",
      "description": "K53 driving content - 250px-De_Mond_P1020944",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Duncanstreetpretoria2.jpg",
      "path": "/images/misc/250px-Duncanstreetpretoria2.jpg",
      "id": "250px-Duncanstreetpretoria2",
      "description": "K53 driving content - 250px-Duncanstreetpretoria2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-East_Fort_Blockhouse_01.jpg",
      "path": "/images/misc/250px-East_Fort_Blockhouse_01.jpg",
      "id": "250px-East-Fort-Blockhouse-01",
      "description": "K53 driving content - 250px-East_Fort_Blockhouse_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Engen_Big_Bird_1_Stop.jpg",
      "path": "/images/misc/250px-Engen_Big_Bird_1_Stop.jpg",
      "id": "250px-Engen-Big-Bird-1-Stop",
      "description": "K53 driving content - 250px-Engen_Big_Bird_1_Stop",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-From_the_Cape_to_Cairo%3B_the_first_traverse_of_Africa_from_south_to_north_(1902)_(14762114021).jpg",
      "path": "/images/misc/250px-From_the_Cape_to_Cairo%3B_the_first_traverse_of_Africa_from_south_to_north_(1902)_(14762114021).jpg",
      "id": "250px-From-the-Cape-to-Cairo-3B-the-first-traverse-of-Africa-from-south-to-north--1902---14762114021-",
      "description": "K53 driving content - 250px-From_the_Cape_to_Cairo%3B_the_first_traverse_of_Africa_from_south_to_north_(1902)_(14762114021)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Geflutet_P1010442.jpg",
      "path": "/images/misc/250px-Geflutet_P1010442.jpg",
      "id": "250px-Geflutet-P1010442",
      "description": "K53 driving content - 250px-Geflutet_P1010442",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-General_Dealer_building.jpg",
      "path": "/images/misc/250px-General_Dealer_building.jpg",
      "id": "250px-General-Dealer-building",
      "description": "K53 driving content - 250px-General_Dealer_building",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Group_of_African_American_men_reporting_property_losses_around_time_of_1917_Race_Riot_in_East_St._Louis.jpg",
      "path": "/images/misc/250px-Group_of_African_American_men_reporting_property_losses_around_time_of_1917_Race_Riot_in_East_St._Louis.jpg",
      "id": "250px-Group-of-African-American-men-reporting-property-losses-around-time-of-1917-Race-Riot-in-East-St--Louis",
      "description": "K53 driving content - 250px-Group_of_African_American_men_reporting_property_losses_around_time_of_1917_Race_Riot_in_East_St._Louis",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Harvest_Parade_2014_67.jpg",
      "path": "/images/misc/250px-Harvest_Parade_2014_67.jpg",
      "id": "250px-Harvest-Parade-2014-67",
      "description": "K53 driving content - 250px-Harvest_Parade_2014_67",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Hazardous_speedlimit_in_South_Africa.jpg",
      "path": "/images/misc/250px-Hazardous_speedlimit_in_South_Africa.jpg",
      "id": "250px-Hazardous-speedlimit-in-South-Africa",
      "description": "K53 driving content - 250px-Hazardous_speedlimit_in_South_Africa",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Hi-jacking_hot_spot.jpg",
      "path": "/images/misc/250px-Hi-jacking_hot_spot.jpg",
      "id": "250px-Hi-jacking-hot-spot",
      "description": "K53 driving content - 250px-Hi-jacking_hot_spot",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-HiddenSwartkops.jpg",
      "path": "/images/misc/250px-HiddenSwartkops.jpg",
      "id": "250px-HiddenSwartkops",
      "description": "K53 driving content - 250px-HiddenSwartkops",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Jacobs_ladder%2C_St_James.jpg",
      "path": "/images/misc/250px-Jacobs_ladder%2C_St_James.jpg",
      "id": "250px-Jacobs-ladder-2C-St-James",
      "description": "K53 driving content - 250px-Jacobs_ladder%2C_St_James",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Jhb_City_Hall.jpg",
      "path": "/images/misc/250px-Jhb_City_Hall.jpg",
      "id": "250px-Jhb-City-Hall",
      "description": "K53 driving content - 250px-Jhb_City_Hall",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Kaapstad16.jpg",
      "path": "/images/misc/250px-Kaapstad16.jpg",
      "id": "250px-Kaapstad16",
      "description": "K53 driving content - 250px-Kaapstad16",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Kaapstad7.jpg",
      "path": "/images/misc/250px-Kaapstad7.jpg",
      "id": "250px-Kaapstad7",
      "description": "K53 driving content - 250px-Kaapstad7",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Kuhschilder.jpg",
      "path": "/images/misc/250px-Kuhschilder.jpg",
      "id": "250px-Kuhschilder",
      "description": "K53 driving content - 250px-Kuhschilder",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-LadysmithSAR.jpg",
      "path": "/images/misc/250px-LadysmithSAR.jpg",
      "id": "250px-LadysmithSAR",
      "description": "K53 driving content - 250px-LadysmithSAR",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Laos_-_Traffic_Switchover_Point.svg.png",
      "path": "/images/misc/250px-Laos_-_Traffic_Switchover_Point.svg.png",
      "id": "250px-Laos---Traffic-Switchover-Point-svg",
      "description": "K53 driving content - 250px-Laos_-_Traffic_Switchover_Point.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Loxton_SA.png",
      "path": "/images/misc/250px-Loxton_SA.png",
      "id": "250px-Loxton-SA",
      "description": "K53 driving content - 250px-Loxton_SA",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-M1_ZAF_jct.svg.png",
      "path": "/images/misc/250px-M1_ZAF_jct.svg.png",
      "id": "250px-M1-ZAF-jct-svg",
      "description": "K53 driving content - 250px-M1_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-M1_ZAF_jct_blue.svg.png",
      "path": "/images/misc/250px-M1_ZAF_jct_blue.svg.png",
      "id": "250px-M1-ZAF-jct-blue-svg",
      "description": "K53 driving content - 250px-M1_ZAF_jct_blue.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-M2_Freeway_ZA.jpg",
      "path": "/images/misc/250px-M2_Freeway_ZA.jpg",
      "id": "250px-M2-Freeway-ZA",
      "description": "K53 driving content - 250px-M2_Freeway_ZA",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-MALTA_-_INTRODUCTION_(4308717706).jpg",
      "path": "/images/misc/250px-MALTA_-_INTRODUCTION_(4308717706).jpg",
      "id": "250px-MALTA---INTRODUCTION--4308717706-",
      "description": "K53 driving content - 250px-MALTA_-_INTRODUCTION_(4308717706)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Mangoche_District._(WOMAT-AFR-BCA-22-1).jpg",
      "path": "/images/misc/250px-Mangoche_District._(WOMAT-AFR-BCA-22-1).jpg",
      "id": "250px-Mangoche-District---WOMAT-AFR-BCA-22-1-",
      "description": "K53 driving content - 250px-Mangoche_District._(WOMAT-AFR-BCA-22-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Map_of_Fort_Mlangeni_and_Vicinity._(WOMAT-AFR-BCA-14-1).jpg",
      "path": "/images/misc/250px-Map_of_Fort_Mlangeni_and_Vicinity._(WOMAT-AFR-BCA-14-1).jpg",
      "id": "250px-Map-of-Fort-Mlangeni-and-Vicinity---WOMAT-AFR-BCA-14-1-",
      "description": "K53 driving content - 250px-Map_of_Fort_Mlangeni_and_Vicinity._(WOMAT-AFR-BCA-14-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Mokala-002.jpg",
      "path": "/images/misc/250px-Mokala-002.jpg",
      "id": "250px-Mokala-002",
      "description": "K53 driving content - 250px-Mokala-002",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Montagupas_bord_by_begin.jpg",
      "path": "/images/misc/250px-Montagupas_bord_by_begin.jpg",
      "id": "250px-Montagupas-bord-by-begin",
      "description": "K53 driving content - 250px-Montagupas_bord_by_begin",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Mr.Go_n_Stop.jpg",
      "path": "/images/misc/250px-Mr.Go_n_Stop.jpg",
      "id": "250px-Mr-Go-n-Stop",
      "description": "K53 driving content - 250px-Mr.Go_n_Stop",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-N1joburg.jpg",
      "path": "/images/misc/250px-N1joburg.jpg",
      "id": "250px-N1joburg",
      "description": "K53 driving content - 250px-N1joburg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Namakwa_Welcome_Sign.jpg",
      "path": "/images/misc/250px-Namakwa_Welcome_Sign.jpg",
      "id": "250px-Namakwa-Welcome-Sign",
      "description": "K53 driving content - 250px-Namakwa_Welcome_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Nobody_The_Place_to_be.jpg",
      "path": "/images/misc/250px-Nobody_The_Place_to_be.jpg",
      "id": "250px-Nobody-The-Place-to-be",
      "description": "K53 driving content - 250px-Nobody_The_Place_to_be",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-No_marked.jpg",
      "path": "/images/misc/250px-No_marked.jpg",
      "id": "250px-No-marked",
      "description": "K53 driving content - 250px-No_marked",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Odendaalsrus2.jpg",
      "path": "/images/misc/250px-Odendaalsrus2.jpg",
      "id": "250px-Odendaalsrus2",
      "description": "K53 driving content - 250px-Odendaalsrus2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21217851334).jpg",
      "path": "/images/misc/250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21217851334).jpg",
      "id": "250px-Oil-Heritage-Route-2C-Lambton-County-2C-Ontario--21217851334-",
      "description": "K53 driving content - 250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21217851334)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21850202701).jpg",
      "path": "/images/misc/250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21850202701).jpg",
      "id": "250px-Oil-Heritage-Route-2C-Lambton-County-2C-Ontario--21850202701-",
      "description": "K53 driving content - 250px-Oil_Heritage_Route%2C_Lambton_County%2C_Ontario_(21850202701)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Old_South_African_Stop_Sign.svg.png",
      "path": "/images/misc/250px-Old_South_African_Stop_Sign.svg.png",
      "id": "250px-Old-South-African-Stop-Sign-svg",
      "description": "K53 driving content - 250px-Old_South_African_Stop_Sign.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Outeniqualand_landbouvereniging_padbord.jpg",
      "path": "/images/misc/250px-Outeniqualand_landbouvereniging_padbord.jpg",
      "id": "250px-Outeniqualand-landbouvereniging-padbord",
      "description": "K53 driving content - 250px-Outeniqualand_landbouvereniging_padbord",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-2).jpg",
      "path": "/images/misc/250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-2).jpg",
      "id": "250px-Parts-of-the-German-East-Africa-Central-Line-Railway--Proposed-railway-from-Mikesse-to-Ulanga---WOMAT-AFR-GEA-38-2-2-",
      "description": "K53 driving content - 250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-3).jpg",
      "path": "/images/misc/250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-3).jpg",
      "id": "250px-Parts-of-the-German-East-Africa-Central-Line-Railway--Proposed-railway-from-Mikesse-to-Ulanga---WOMAT-AFR-GEA-38-2-3-",
      "description": "K53 driving content - 250px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Penguin_crossing.jpg",
      "path": "/images/misc/250px-Penguin_crossing.jpg",
      "id": "250px-Penguin-crossing",
      "description": "K53 driving content - 250px-Penguin_crossing",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Percys_Hole_north_entry_path.jpg",
      "path": "/images/misc/250px-Percys_Hole_north_entry_path.jpg",
      "id": "250px-Percys-Hole-north-entry-path",
      "description": "K53 driving content - 250px-Percys_Hole_north_entry_path",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-2).jpg",
      "path": "/images/misc/250px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-2).jpg",
      "id": "250px-Plane-table-Survey-of-Area-N--and-E--and-South-of-Kigoma-War-Office-ledger--Plane-Table-Sheets---WOMAT-AFR-GEA-44-1-2-",
      "description": "K53 driving content - 250px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Quitte_Jobourg..._France_(8777504595).jpg",
      "path": "/images/misc/250px-Quitte_Jobourg..._France_(8777504595).jpg",
      "id": "250px-Quitte-Jobourg----France--8777504595-",
      "description": "K53 driving content - 250px-Quitte_Jobourg..._France_(8777504595)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-R44_and_R365.jpg",
      "path": "/images/misc/250px-R44_and_R365.jpg",
      "id": "250px-R44-and-R365",
      "description": "K53 driving content - 250px-R44_and_R365",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-R620_Margate.jpg",
      "path": "/images/misc/250px-R620_Margate.jpg",
      "id": "250px-R620-Margate",
      "description": "K53 driving content - 250px-R620_Margate",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-R620_Margate_1.jpg",
      "path": "/images/misc/250px-R620_Margate_1.jpg",
      "id": "250px-R620-Margate-1",
      "description": "K53 driving content - 250px-R620_Margate_1",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Ridgeway_0004_(131604623).jpg",
      "path": "/images/misc/250px-Ridgeway_0004_(131604623).jpg",
      "id": "250px-Ridgeway-0004--131604623-",
      "description": "K53 driving content - 250px-Ridgeway_0004_(131604623)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Robben_Island_3.jpg",
      "path": "/images/misc/250px-Robben_Island_3.jpg",
      "id": "250px-Robben-Island-3",
      "description": "K53 driving content - 250px-Robben_Island_3",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Routes_from_Fort_Johnston_to_Mataka%2C_also_Lujenda_R._(N._of_Lake_Shirwa)_War_Office_ledger._(WOMAT-AFR-BCA-7-1).jpg",
      "path": "/images/misc/250px-Routes_from_Fort_Johnston_to_Mataka%2C_also_Lujenda_R._(N._of_Lake_Shirwa)_War_Office_ledger._(WOMAT-AFR-BCA-7-1).jpg",
      "id": "250px-Routes-from-Fort-Johnston-to-Mataka-2C-also-Lujenda-R---N--of-Lake-Shirwa--War-Office-ledger---WOMAT-AFR-BCA-7-1-",
      "description": "K53 driving content - 250px-Routes_from_Fort_Johnston_to_Mataka%2C_also_Lujenda_R._(N._of_Lake_Shirwa)_War_Office_ledger._(WOMAT-AFR-BCA-7-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773262470).jpg",
      "path": "/images/misc/250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773262470).jpg",
      "id": "250px-Route-to-Montr-al-Pierre-Elliott-Trudeau-International-Airport-2C-Montreal-2C-Quebec--29773262470-",
      "description": "K53 driving content - 250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773262470)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29953948702).jpg",
      "path": "/images/misc/250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29953948702).jpg",
      "id": "250px-Route-to-Montr-al-Pierre-Elliott-Trudeau-International-Airport-2C-Montreal-2C-Quebec--29953948702-",
      "description": "K53 driving content - 250px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29953948702)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-RSA_R339_Alfred_Pass_Die_Vlug.jpg",
      "path": "/images/misc/250px-RSA_R339_Alfred_Pass_Die_Vlug.jpg",
      "id": "250px-RSA-R339-Alfred-Pass-Die-Vlug",
      "description": "K53 driving content - 250px-RSA_R339_Alfred_Pass_Die_Vlug",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-RSA_Tortoise_Sign.jpg",
      "path": "/images/misc/250px-RSA_Tortoise_Sign.jpg",
      "id": "250px-RSA-Tortoise-Sign",
      "description": "K53 driving content - 250px-RSA_Tortoise_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A10_NA.svg.png",
      "path": "/images/misc/250px-Schild_A10_NA.svg.png",
      "id": "250px-Schild-A10-NA-svg",
      "description": "K53 driving content - 250px-Schild_A10_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A11_NA.svg.png",
      "path": "/images/misc/250px-Schild_A11_NA.svg.png",
      "id": "250px-Schild-A11-NA-svg",
      "description": "K53 driving content - 250px-Schild_A11_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A12_NA.svg.png",
      "path": "/images/misc/250px-Schild_A12_NA.svg.png",
      "id": "250px-Schild-A12-NA-svg",
      "description": "K53 driving content - 250px-Schild_A12_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A13_NA.svg.png",
      "path": "/images/misc/250px-Schild_A13_NA.svg.png",
      "id": "250px-Schild-A13-NA-svg",
      "description": "K53 driving content - 250px-Schild_A13_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A14_NA.svg.png",
      "path": "/images/misc/250px-Schild_A14_NA.svg.png",
      "id": "250px-Schild-A14-NA-svg",
      "description": "K53 driving content - 250px-Schild_A14_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A15_NA.svg.png",
      "path": "/images/misc/250px-Schild_A15_NA.svg.png",
      "id": "250px-Schild-A15-NA-svg",
      "description": "K53 driving content - 250px-Schild_A15_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A2_NA.svg.png",
      "path": "/images/misc/250px-Schild_A2_NA.svg.png",
      "id": "250px-Schild-A2-NA-svg",
      "description": "K53 driving content - 250px-Schild_A2_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A3_NA.svg.png",
      "path": "/images/misc/250px-Schild_A3_NA.svg.png",
      "id": "250px-Schild-A3-NA-svg",
      "description": "K53 driving content - 250px-Schild_A3_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A4_NA.svg.png",
      "path": "/images/misc/250px-Schild_A4_NA.svg.png",
      "id": "250px-Schild-A4-NA-svg",
      "description": "K53 driving content - 250px-Schild_A4_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A5_NA.svg.png",
      "path": "/images/misc/250px-Schild_A5_NA.svg.png",
      "id": "250px-Schild-A5-NA-svg",
      "description": "K53 driving content - 250px-Schild_A5_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A6_NA.svg.png",
      "path": "/images/misc/250px-Schild_A6_NA.svg.png",
      "id": "250px-Schild-A6-NA-svg",
      "description": "K53 driving content - 250px-Schild_A6_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A7_NA.svg.png",
      "path": "/images/misc/250px-Schild_A7_NA.svg.png",
      "id": "250px-Schild-A7-NA-svg",
      "description": "K53 driving content - 250px-Schild_A7_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A8_NA.svg.png",
      "path": "/images/misc/250px-Schild_A8_NA.svg.png",
      "id": "250px-Schild-A8-NA-svg",
      "description": "K53 driving content - 250px-Schild_A8_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_A9_NA.svg.png",
      "path": "/images/misc/250px-Schild_A9_NA.svg.png",
      "id": "250px-Schild-A9-NA-svg",
      "description": "K53 driving content - 250px-Schild_A9_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_B12_NA.svg.png",
      "path": "/images/misc/250px-Schild_B12_NA.svg.png",
      "id": "250px-Schild-B12-NA-svg",
      "description": "K53 driving content - 250px-Schild_B12_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Schild_B13_NA.svg.png",
      "path": "/images/misc/250px-Schild_B13_NA.svg.png",
      "id": "250px-Schild-B13-NA-svg",
      "description": "K53 driving content - 250px-Schild_B13_NA.svg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Shakadza.jpg",
      "path": "/images/misc/250px-Shakadza.jpg",
      "id": "250px-Shakadza",
      "description": "K53 driving content - 250px-Shakadza",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Silver_Springs_State_Park%3B_Equestrian_Entrance.jpg",
      "path": "/images/misc/250px-Silver_Springs_State_Park%3B_Equestrian_Entrance.jpg",
      "id": "250px-Silver-Springs-State-Park-3B-Equestrian-Entrance",
      "description": "K53 driving content - 250px-Silver_Springs_State_Park%3B_Equestrian_Entrance",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Skukuza_Airport_Runway_Sign.jpg",
      "path": "/images/misc/250px-Skukuza_Airport_Runway_Sign.jpg",
      "id": "250px-Skukuza-Airport-Runway-Sign",
      "description": "K53 driving content - 250px-Skukuza_Airport_Runway_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Sneeu_op_Laingsnek.jpg",
      "path": "/images/misc/250px-Sneeu_op_Laingsnek.jpg",
      "id": "250px-Sneeu-op-Laingsnek",
      "description": "K53 driving content - 250px-Sneeu_op_Laingsnek",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-1).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-1).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-1-1-1-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-2).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-2).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-1-1-2-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-3).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-3).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-1-1-3-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-4).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-4).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-1-1-4-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-1-1-4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-1).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-1).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Tracings---WOMAT-AFR-ABY-27-1-1-2-1-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-2).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-2).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Tracings---WOMAT-AFR-ABY-27-1-1-2-2-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-3).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-3).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Tracings---WOMAT-AFR-ABY-27-1-1-2-3-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-4).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-4).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Addis-Abbaba-to-Dolo--War-Office-ledger--Tracings---WOMAT-AFR-ABY-27-1-1-2-4-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Addis_Abbaba_to_Dolo._War_Office_ledger._Tracings._(WOMAT-AFR-ABY-27-1-1-2-4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-1).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-1).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Dolo-to-Gara--Jima--Gara--Ogorchi--War-Office-ledger---WOMAT-AFR-ABY-27-2-1-1-1-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-2).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-2).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Dolo-to-Gara--Jima--Gara--Ogorchi--War-Office-ledger---WOMAT-AFR-ABY-27-2-1-1-2-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-3).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-3).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Dolo-to-Gara--Jima--Gara--Ogorchi--War-Office-ledger---WOMAT-AFR-ABY-27-2-1-1-3-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Dolo_to_Gara._Jima._Gara._Ogorchi._War_Office_ledger._(WOMAT-AFR-ABY-27-2-1-1-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-1).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-1).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-1-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-2).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-2).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-2-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-3).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-3).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-3-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-4).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-4).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-4-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-5).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-5).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-5-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-5)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-6).jpg",
      "path": "/images/misc/250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-6).jpg",
      "id": "250px-Southern-Abyssinia-Boundary-Commission--Harrar-2C-Addis-Abbaba-and-Ginir-War-Office-ledger--Manuscripts---WOMAT-AFR-ABY-27-1-4-1-6-",
      "description": "K53 driving content - 250px-Southern_Abyssinia_Boundary_Commission._Harrar%2C_Addis_Abbaba_and_Ginir.War_Office_ledger._Manuscripts._(WOMAT-AFR-ABY-27-1-4-1-6)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-South_Africa-N10-001.jpg",
      "path": "/images/misc/250px-South_Africa-N10-001.jpg",
      "id": "250px-South-Africa-N10-001",
      "description": "K53 driving content - 250px-South_Africa-N10-001",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-South_Africa-N10-001_(cropped).jpg",
      "path": "/images/misc/250px-South_Africa-N10-001_(cropped).jpg",
      "id": "250px-South-Africa-N10-001--cropped-",
      "description": "K53 driving content - 250px-South_Africa-N10-001_(cropped)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-South_African-Namibian_Border.jpg",
      "path": "/images/misc/250px-South_African-Namibian_Border.jpg",
      "id": "250px-South-African-Namibian-Border",
      "description": "K53 driving content - 250px-South_African-Namibian_Border",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Sutherland_Fraserburg_Sign.jpg",
      "path": "/images/misc/250px-Sutherland_Fraserburg_Sign.jpg",
      "id": "250px-Sutherland-Fraserburg-Sign",
      "description": "K53 driving content - 250px-Sutherland_Fraserburg_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Take_care_cattle_grid.jpg",
      "path": "/images/misc/250px-Take_care_cattle_grid.jpg",
      "id": "250px-Take-care-cattle-grid",
      "description": "K53 driving content - 250px-Take_care_cattle_grid",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Take_care_for_wild_animals_01.jpg",
      "path": "/images/misc/250px-Take_care_for_wild_animals_01.jpg",
      "id": "250px-Take-care-for-wild-animals-01",
      "description": "K53 driving content - 250px-Take_care_for_wild_animals_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Take_care_for_wild_animals_02.jpg",
      "path": "/images/misc/250px-Take_care_for_wild_animals_02.jpg",
      "id": "250px-Take-care-for-wild-animals-02",
      "description": "K53 driving content - 250px-Take_care_for_wild_animals_02",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Take_care_for_wild_animals_03.jpg",
      "path": "/images/misc/250px-Take_care_for_wild_animals_03.jpg",
      "id": "250px-Take-care-for-wild-animals-03",
      "description": "K53 driving content - 250px-Take_care_for_wild_animals_03",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-The_Cavern_-_Vitrina_The_Quarrymen.jpg",
      "path": "/images/misc/250px-The_Cavern_-_Vitrina_The_Quarrymen.jpg",
      "id": "250px-The-Cavern---Vitrina-The-Quarrymen",
      "description": "K53 driving content - 250px-The_Cavern_-_Vitrina_The_Quarrymen",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-The_National_Archives_UK_-_CO_1069-214-129.jpg",
      "path": "/images/misc/250px-The_National_Archives_UK_-_CO_1069-214-129.jpg",
      "id": "250px-The-National-Archives-UK---CO-1069-214-129",
      "description": "K53 driving content - 250px-The_National_Archives_UK_-_CO_1069-214-129",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (1).jpg",
      "path": "/images/misc/250px-thumbnail (1).jpg",
      "id": "250px-thumbnail--1-",
      "description": "K53 driving content - 250px-thumbnail (1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (10).jpg",
      "path": "/images/misc/250px-thumbnail (10).jpg",
      "id": "250px-thumbnail--10-",
      "description": "K53 driving content - 250px-thumbnail (10)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (11).jpg",
      "path": "/images/misc/250px-thumbnail (11).jpg",
      "id": "250px-thumbnail--11-",
      "description": "K53 driving content - 250px-thumbnail (11)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (12).jpg",
      "path": "/images/misc/250px-thumbnail (12).jpg",
      "id": "250px-thumbnail--12-",
      "description": "K53 driving content - 250px-thumbnail (12)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (13).jpg",
      "path": "/images/misc/250px-thumbnail (13).jpg",
      "id": "250px-thumbnail--13-",
      "description": "K53 driving content - 250px-thumbnail (13)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (14).jpg",
      "path": "/images/misc/250px-thumbnail (14).jpg",
      "id": "250px-thumbnail--14-",
      "description": "K53 driving content - 250px-thumbnail (14)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (15).jpg",
      "path": "/images/misc/250px-thumbnail (15).jpg",
      "id": "250px-thumbnail--15-",
      "description": "K53 driving content - 250px-thumbnail (15)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (16).jpg",
      "path": "/images/misc/250px-thumbnail (16).jpg",
      "id": "250px-thumbnail--16-",
      "description": "K53 driving content - 250px-thumbnail (16)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (17).jpg",
      "path": "/images/misc/250px-thumbnail (17).jpg",
      "id": "250px-thumbnail--17-",
      "description": "K53 driving content - 250px-thumbnail (17)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (18).jpg",
      "path": "/images/misc/250px-thumbnail (18).jpg",
      "id": "250px-thumbnail--18-",
      "description": "K53 driving content - 250px-thumbnail (18)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (2).jpg",
      "path": "/images/misc/250px-thumbnail (2).jpg",
      "id": "250px-thumbnail--2-",
      "description": "K53 driving content - 250px-thumbnail (2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (3).jpg",
      "path": "/images/misc/250px-thumbnail (3).jpg",
      "id": "250px-thumbnail--3-",
      "description": "K53 driving content - 250px-thumbnail (3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (4).jpg",
      "path": "/images/misc/250px-thumbnail (4).jpg",
      "id": "250px-thumbnail--4-",
      "description": "K53 driving content - 250px-thumbnail (4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (5).jpg",
      "path": "/images/misc/250px-thumbnail (5).jpg",
      "id": "250px-thumbnail--5-",
      "description": "K53 driving content - 250px-thumbnail (5)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (6).jpg",
      "path": "/images/misc/250px-thumbnail (6).jpg",
      "id": "250px-thumbnail--6-",
      "description": "K53 driving content - 250px-thumbnail (6)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (7).jpg",
      "path": "/images/misc/250px-thumbnail (7).jpg",
      "id": "250px-thumbnail--7-",
      "description": "K53 driving content - 250px-thumbnail (7)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (8).jpg",
      "path": "/images/misc/250px-thumbnail (8).jpg",
      "id": "250px-thumbnail--8-",
      "description": "K53 driving content - 250px-thumbnail (8)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail (9).jpg",
      "path": "/images/misc/250px-thumbnail (9).jpg",
      "id": "250px-thumbnail--9-",
      "description": "K53 driving content - 250px-thumbnail (9)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-thumbnail.jpg",
      "path": "/images/misc/250px-thumbnail.jpg",
      "id": "250px-thumbnail",
      "description": "K53 driving content - 250px-thumbnail",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Toads_crossing.jpg",
      "path": "/images/misc/250px-Toads_crossing.jpg",
      "id": "250px-Toads-crossing",
      "description": "K53 driving content - 250px-Toads_crossing",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Tor_zu_bitte_P1010440.jpg",
      "path": "/images/misc/250px-Tor_zu_bitte_P1010440.jpg",
      "id": "250px-Tor-zu-bitte-P1010440",
      "description": "K53 driving content - 250px-Tor_zu_bitte_P1010440",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Town_Hall_Alberton.jpg",
      "path": "/images/misc/250px-Town_Hall_Alberton.jpg",
      "id": "250px-Town-Hall-Alberton",
      "description": "K53 driving content - 250px-Town_Hall_Alberton",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-1).jpg",
      "path": "/images/misc/250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-1).jpg",
      "id": "250px-Transvaal-Manoeuvre-Area--Surveyed-by-Capt--C--St-B--Sladen-Royal-Engineers--and-Lt--K-W--Lee-Royal-Field-Artillery--1910-11--WOOS-20-4-2-1-",
      "description": "K53 driving content - 250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-2).jpg",
      "path": "/images/misc/250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-2).jpg",
      "id": "250px-Transvaal-Manoeuvre-Area--Surveyed-by-Capt--C--St-B--Sladen-Royal-Engineers--and-Lt--K-W--Lee-Royal-Field-Artillery--1910-11--WOOS-20-4-2-2-",
      "description": "K53 driving content - 250px-Transvaal_Manoeuvre_Area._Surveyed_by_Capt._C._St_B._Sladen_Royal.Engineers._and_Lt._K.W._Lee_Royal.Field.Artillery._1910-11.(WOOS-20-4-2-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Tsitsikamma_National_Park_(ZA)%2C_Schild_--_2024_--_1993.jpg",
      "path": "/images/misc/250px-Tsitsikamma_National_Park_(ZA)%2C_Schild_--_2024_--_1993.jpg",
      "id": "250px-Tsitsikamma-National-Park--ZA--2C-Schild----2024----1993",
      "description": "K53 driving content - 250px-Tsitsikamma_National_Park_(ZA)%2C_Schild_--_2024_--_1993",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Van_Riebeeck_Avenue_south.jpg",
      "path": "/images/misc/250px-Van_Riebeeck_Avenue_south.jpg",
      "id": "250px-Van-Riebeeck-Avenue-south",
      "description": "K53 driving content - 250px-Van_Riebeeck_Avenue_south",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Vrystaat_Rest.jpg",
      "path": "/images/misc/250px-Vrystaat_Rest.jpg",
      "id": "250px-Vrystaat-Rest",
      "description": "K53 driving content - 250px-Vrystaat_Rest",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Warning_Elephants.jpg",
      "path": "/images/misc/250px-Warning_Elephants.jpg",
      "id": "250px-Warning-Elephants",
      "description": "K53 driving content - 250px-Warning_Elephants",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wasn't_clear_enough_%3F_(52790460818).jpg",
      "path": "/images/misc/250px-Wasn't_clear_enough_%3F_(52790460818).jpg",
      "id": "250px-Wasn-t-clear-enough--3F--52790460818-",
      "description": "K53 driving content - 250px-Wasn't_clear_enough_%3F_(52790460818)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-WegweiserBraunschweigOstkap.jpg",
      "path": "/images/misc/250px-WegweiserBraunschweigOstkap.jpg",
      "id": "250px-WegweiserBraunschweigOstkap",
      "description": "K53 driving content - 250px-WegweiserBraunschweigOstkap",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wegweiser_nach_Hamburg_Südafrika.jpg",
      "path": "/images/misc/250px-Wegweiser_nach_Hamburg_Südafrika.jpg",
      "id": "250px-Wegweiser-nach-Hamburg-S-dafrika",
      "description": "K53 driving content - 250px-Wegweiser_nach_Hamburg_Südafrika",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Welcome_to_Boulders_(01).jpg",
      "path": "/images/misc/250px-Welcome_to_Boulders_(01).jpg",
      "id": "250px-Welcome-to-Boulders--01-",
      "description": "K53 driving content - 250px-Welcome_to_Boulders_(01)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-West_Coast_Peninsula%2C_South_Africa_-_panoramio.jpg",
      "path": "/images/misc/250px-West_Coast_Peninsula%2C_South_Africa_-_panoramio.jpg",
      "id": "250px-West-Coast-Peninsula-2C-South-Africa---panoramio",
      "description": "K53 driving content - 250px-West_Coast_Peninsula%2C_South_Africa_-_panoramio",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wildwechsel_Südafrika.jpg",
      "path": "/images/misc/250px-Wildwechsel_Südafrika.jpg",
      "id": "250px-Wildwechsel-S-dafrika",
      "description": "K53 driving content - 250px-Wildwechsel_Südafrika",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Wild_animals.jpg",
      "path": "/images/misc/250px-Wild_animals.jpg",
      "id": "250px-Wild-animals",
      "description": "K53 driving content - 250px-Wild_animals",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "250px-Williston_mall.jpg",
      "path": "/images/misc/250px-Williston_mall.jpg",
      "id": "250px-Williston-mall",
      "description": "K53 driving content - 250px-Williston_mall",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-2014-11-30_Tsitsikamma_National_Park_Storms_River_Mouth_01_anagoria.jpg",
      "path": "/images/misc/330px-2014-11-30_Tsitsikamma_National_Park_Storms_River_Mouth_01_anagoria.jpg",
      "id": "330px-2014-11-30-Tsitsikamma-National-Park-Storms-River-Mouth-01-anagoria",
      "description": "K53 driving content - 330px-2014-11-30_Tsitsikamma_National_Park_Storms_River_Mouth_01_anagoria",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Angie's_-_De_Vlugt_-_panoramio.jpg",
      "path": "/images/misc/330px-Angie's_-_De_Vlugt_-_panoramio.jpg",
      "id": "330px-Angie-s---De-Vlugt---panoramio",
      "description": "K53 driving content - 330px-Angie's_-_De_Vlugt_-_panoramio",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Anglo_Zulu_War_1879_-_103.jpg",
      "path": "/images/misc/330px-Anglo_Zulu_War_1879_-_103.jpg",
      "id": "330px-Anglo-Zulu-War-1879---103",
      "description": "K53 driving content - 330px-Anglo_Zulu_War_1879_-_103",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Anglo_Zulu_War_1879_-_47.jpg",
      "path": "/images/misc/330px-Anglo_Zulu_War_1879_-_47.jpg",
      "id": "330px-Anglo-Zulu-War-1879---47",
      "description": "K53 driving content - 330px-Anglo_Zulu_War_1879_-_47",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Anton_Mauve_-_Huisje_aan_de_zandweg.jpg",
      "path": "/images/misc/330px-Anton_Mauve_-_Huisje_aan_de_zandweg.jpg",
      "id": "330px-Anton-Mauve---Huisje-aan-de-zandweg",
      "description": "K53 driving content - 330px-Anton_Mauve_-_Huisje_aan_de_zandweg",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-AQ_Bar_and_Restaurant%2C_Hounslow%2C_TW4_(7920762592).jpg",
      "path": "/images/misc/330px-AQ_Bar_and_Restaurant%2C_Hounslow%2C_TW4_(7920762592).jpg",
      "id": "330px-AQ-Bar-and-Restaurant-2C-Hounslow-2C-TW4--7920762592-",
      "description": "K53 driving content - 330px-AQ_Bar_and_Restaurant%2C_Hounslow%2C_TW4_(7920762592)",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Arrival_in_Ladismith.jpg",
      "path": "/images/misc/330px-Arrival_in_Ladismith.jpg",
      "id": "330px-Arrival-in-Ladismith",
      "description": "K53 driving content - 330px-Arrival_in_Ladismith",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Augrabies_National_Park%2C_Northern_Cape_(6253227928).jpg",
      "path": "/images/misc/330px-Augrabies_National_Park%2C_Northern_Cape_(6253227928).jpg",
      "id": "330px-Augrabies-National-Park-2C-Northern-Cape--6253227928-",
      "description": "K53 driving content - 330px-Augrabies_National_Park%2C_Northern_Cape_(6253227928)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Bainskloof_pass01.jpg",
      "path": "/images/misc/330px-Bainskloof_pass01.jpg",
      "id": "330px-Bainskloof-pass01",
      "description": "K53 driving content - 330px-Bainskloof_pass01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Bridge_over_the_Buffalo_River.jpg",
      "path": "/images/misc/330px-Bridge_over_the_Buffalo_River.jpg",
      "id": "330px-Bridge-over-the-Buffalo-River",
      "description": "K53 driving content - 330px-Bridge_over_the_Buffalo_River",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Bus_on_N2.jpg",
      "path": "/images/misc/330px-Bus_on_N2.jpg",
      "id": "330px-Bus-on-N2",
      "description": "K53 driving content - 330px-Bus_on_N2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Camdaboo_Route_Sign%2C_Karoo%2C_Eastern_Cape%2C_South_Africa_(19889856743).jpg",
      "path": "/images/misc/330px-Camdaboo_Route_Sign%2C_Karoo%2C_Eastern_Cape%2C_South_Africa_(19889856743).jpg",
      "id": "330px-Camdaboo-Route-Sign-2C-Karoo-2C-Eastern-Cape-2C-South-Africa--19889856743-",
      "description": "K53 driving content - 330px-Camdaboo_Route_Sign%2C_Karoo%2C_Eastern_Cape%2C_South_Africa_(19889856743)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484280861).jpg",
      "path": "/images/misc/330px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484280861).jpg",
      "id": "330px-Cheetahs--Acinonyx-jubatus--brothers------52484280861-",
      "description": "K53 driving content - 330px-Cheetahs_(Acinonyx_jubatus)_brothers_..._(52484280861)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetahs_(Acinonyx_jubatus)_brothers_marking_their_territory_..._(52115480305).jpg",
      "path": "/images/misc/330px-Cheetahs_(Acinonyx_jubatus)_brothers_marking_their_territory_..._(52115480305).jpg",
      "id": "330px-Cheetahs--Acinonyx-jubatus--brothers-marking-their-territory------52115480305-",
      "description": "K53 driving content - 330px-Cheetahs_(Acinonyx_jubatus)_brothers_marking_their_territory_..._(52115480305)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_a_herd_of_wildebeests_..._(52482950976).jpg",
      "path": "/images/misc/330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_a_herd_of_wildebeests_..._(52482950976).jpg",
      "id": "330px-Cheetahs--Acinonyx-jubatus--brothers-watched-by-a-herd-of-wildebeests------52482950976-",
      "description": "K53 driving content - 330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_a_herd_of_wildebeests_..._(52482950976)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_herd_of_wildebeests_..._(52113939257).jpg",
      "path": "/images/misc/330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_herd_of_wildebeests_..._(52113939257).jpg",
      "id": "330px-Cheetahs--Acinonyx-jubatus--brothers-watched-by-herd-of-wildebeests------52113939257-",
      "description": "K53 driving content - 330px-Cheetahs_(Acinonyx_jubatus)_brothers_watched_by_herd_of_wildebeests_..._(52113939257)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-De_Waterkant_20.jpg",
      "path": "/images/misc/330px-De_Waterkant_20.jpg",
      "id": "330px-De-Waterkant-20",
      "description": "K53 driving content - 330px-De_Waterkant_20",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-De_Waterkant_28.jpg",
      "path": "/images/misc/330px-De_Waterkant_28.jpg",
      "id": "330px-De-Waterkant-28",
      "description": "K53 driving content - 330px-De_Waterkant_28",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-De_Waterkant_53.jpg",
      "path": "/images/misc/330px-De_Waterkant_53.jpg",
      "id": "330px-De-Waterkant-53",
      "description": "K53 driving content - 330px-De_Waterkant_53",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Dorp_Street_cyclists_1.jpg",
      "path": "/images/misc/330px-Dorp_Street_cyclists_1.jpg",
      "id": "330px-Dorp-Street-cyclists-1",
      "description": "K53 driving content - 330px-Dorp_Street_cyclists_1",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Drakenstein_(ZA)%2C_Val_du_Charron%2C_Radwegweiser_--_2024_--_2740.jpg",
      "path": "/images/misc/330px-Drakenstein_(ZA)%2C_Val_du_Charron%2C_Radwegweiser_--_2024_--_2740.jpg",
      "id": "330px-Drakenstein--ZA--2C-Val-du-Charron-2C-Radwegweiser----2024----2740",
      "description": "K53 driving content - 330px-Drakenstein_(ZA)%2C_Val_du_Charron%2C_Radwegweiser_--_2024_--_2740",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Drakenstein_prison_8.jpg",
      "path": "/images/misc/330px-Drakenstein_prison_8.jpg",
      "id": "330px-Drakenstein-prison-8",
      "description": "K53 driving content - 330px-Drakenstein_prison_8",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-DSC00259_(16277253181).jpg",
      "path": "/images/misc/330px-DSC00259_(16277253181).jpg",
      "id": "330px-DSC00259--16277253181-",
      "description": "K53 driving content - 330px-DSC00259_(16277253181)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-East_London%2C_Eastern_Cape%2C_South_Africa_(20323249890).jpg",
      "path": "/images/misc/330px-East_London%2C_Eastern_Cape%2C_South_Africa_(20323249890).jpg",
      "id": "330px-East-London-2C-Eastern-Cape-2C-South-Africa--20323249890-",
      "description": "K53 driving content - 330px-East_London%2C_Eastern_Cape%2C_South_Africa_(20323249890)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-ETH-BIB-Ciskei%2C_Wegweiser%2C_Hamburg%2C_East_London-Dia_298-05980.jpg",
      "path": "/images/misc/330px-ETH-BIB-Ciskei%2C_Wegweiser%2C_Hamburg%2C_East_London-Dia_298-05980.jpg",
      "id": "330px-ETH-BIB-Ciskei-2C-Wegweiser-2C-Hamburg-2C-East-London-Dia-298-05980",
      "description": "K53 driving content - 330px-ETH-BIB-Ciskei%2C_Wegweiser%2C_Hamburg%2C_East_London-Dia_298-05980",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-FAMILIES_ENJOY_THE_MEMORIAL_DAY_PARADE_-_NARA_-_547026.jpg",
      "path": "/images/misc/330px-FAMILIES_ENJOY_THE_MEMORIAL_DAY_PARADE_-_NARA_-_547026.jpg",
      "id": "330px-FAMILIES-ENJOY-THE-MEMORIAL-DAY-PARADE---NARA---547026",
      "description": "K53 driving content - 330px-FAMILIES_ENJOY_THE_MEMORIAL_DAY_PARADE_-_NARA_-_547026",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Fish_Hoek.jpg",
      "path": "/images/misc/330px-Fish_Hoek.jpg",
      "id": "330px-Fish-Hoek",
      "description": "K53 driving content - 330px-Fish_Hoek",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-General_Dealer_building_cropped.jpg",
      "path": "/images/misc/330px-General_Dealer_building_cropped.jpg",
      "id": "330px-General-Dealer-building-cropped",
      "description": "K53 driving content - 330px-General_Dealer_building_cropped",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Hazardous_Objects.jpg",
      "path": "/images/misc/330px-Hazardous_Objects.jpg",
      "id": "330px-Hazardous-Objects",
      "description": "K53 driving content - 330px-Hazardous_Objects",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Hijacking_Hotspot%2C_R511_Gauteng_(South_Africa).jpg",
      "path": "/images/misc/330px-Hijacking_Hotspot%2C_R511_Gauteng_(South_Africa).jpg",
      "id": "330px-Hijacking-Hotspot-2C-R511-Gauteng--South-Africa-",
      "description": "K53 driving content - 330px-Hijacking_Hotspot%2C_R511_Gauteng_(South_Africa)",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Hijacking_Hotspot%2C_R511_in_Gauteng_(South_Africa).jpg",
      "path": "/images/misc/330px-Hijacking_Hotspot%2C_R511_in_Gauteng_(South_Africa).jpg",
      "id": "330px-Hijacking-Hotspot-2C-R511-in-Gauteng--South-Africa-",
      "description": "K53 driving content - 330px-Hijacking_Hotspot%2C_R511_in_Gauteng_(South_Africa)",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Hluhluwe_Sign.jpg",
      "path": "/images/misc/330px-Hluhluwe_Sign.jpg",
      "id": "330px-Hluhluwe-Sign",
      "description": "K53 driving content - 330px-Hluhluwe_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Humansdorp.jpg",
      "path": "/images/misc/330px-Humansdorp.jpg",
      "id": "330px-Humansdorp",
      "description": "K53 driving content - 330px-Humansdorp",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Humoristic_No_Entry%2C_Staff_Only_Sign%2C_South_Africa.jpg",
      "path": "/images/misc/330px-Humoristic_No_Entry%2C_Staff_Only_Sign%2C_South_Africa.jpg",
      "id": "330px-Humoristic-No-Entry-2C-Staff-Only-Sign-2C-South-Africa",
      "description": "K53 driving content - 330px-Humoristic_No_Entry%2C_Staff_Only_Sign%2C_South_Africa",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Isandlwana_Battlefield%2C_Reserve_18_15840%2C_Nqutu_District.jpg",
      "path": "/images/misc/330px-Isandlwana_Battlefield%2C_Reserve_18_15840%2C_Nqutu_District.jpg",
      "id": "330px-Isandlwana-Battlefield-2C-Reserve-18-15840-2C-Nqutu-District",
      "description": "K53 driving content - 330px-Isandlwana_Battlefield%2C_Reserve_18_15840%2C_Nqutu_District",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-JAMES_SMITH_MORLAND_(1846-1921)_Lengthening_Shadows_False_Bay%2C_South_Africa_Signed_and_dated_1901_Oil_on_canvas_-_109.1_x_155.0_cm.jpg",
      "path": "/images/misc/330px-JAMES_SMITH_MORLAND_(1846-1921)_Lengthening_Shadows_False_Bay%2C_South_Africa_Signed_and_dated_1901_Oil_on_canvas_-_109.1_x_155.0_cm.jpg",
      "id": "330px-JAMES-SMITH-MORLAND--1846-1921--Lengthening-Shadows-False-Bay-2C-South-Africa-Signed-and-dated-1901-Oil-on-canvas---109-1-x-155-0-cm",
      "description": "K53 driving content - 330px-JAMES_SMITH_MORLAND_(1846-1921)_Lengthening_Shadows_False_Bay%2C_South_Africa_Signed_and_dated_1901_Oil_on_canvas_-_109.1_x_155.0_cm",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-JGC_Williams_store.jpg",
      "path": "/images/misc/330px-JGC_Williams_store.jpg",
      "id": "330px-JGC-Williams-store",
      "description": "K53 driving content - 330px-JGC_Williams_store",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Kgalagadi-0004.jpg",
      "path": "/images/misc/330px-Kgalagadi-0004.jpg",
      "id": "330px-Kgalagadi-0004",
      "description": "K53 driving content - 330px-Kgalagadi-0004",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-L.P._Gas_Scania_R500_tanker_(17106384287).jpg",
      "path": "/images/misc/330px-L.P._Gas_Scania_R500_tanker_(17106384287).jpg",
      "id": "330px-L-P--Gas-Scania-R500-tanker--17106384287-",
      "description": "K53 driving content - 330px-L.P._Gas_Scania_R500_tanker_(17106384287)",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Lady_Loch_Bridge%2C_Wellington._1910._First_Steel_bridge_built_in_South_Africa_and_still_in_use..jpg",
      "path": "/images/misc/330px-Lady_Loch_Bridge%2C_Wellington._1910._First_Steel_bridge_built_in_South_Africa_and_still_in_use..jpg",
      "id": "330px-Lady-Loch-Bridge-2C-Wellington--1910--First-Steel-bridge-built-in-South-Africa-and-still-in-use-",
      "description": "K53 driving content - 330px-Lady_Loch_Bridge%2C_Wellington._1910._First_Steel_bridge_built_in_South_Africa_and_still_in_use.",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Lake_Gariep%2C_Eastern_Cape%2C_South_Africa_(20485621366).jpg",
      "path": "/images/misc/330px-Lake_Gariep%2C_Eastern_Cape%2C_South_Africa_(20485621366).jpg",
      "id": "330px-Lake-Gariep-2C-Eastern-Cape-2C-South-Africa--20485621366-",
      "description": "K53 driving content - 330px-Lake_Gariep%2C_Eastern_Cape%2C_South_Africa_(20485621366)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M11_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M11_ZAF_jct.svg.png",
      "id": "330px-M11-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M11_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M21_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M21_ZAF_jct.svg.png",
      "id": "330px-M21-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M21_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M2_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M2_ZAF_jct.svg.png",
      "id": "330px-M2-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M2_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M2_ZAF_jct_blue.svg.png",
      "path": "/images/misc/330px-M2_ZAF_jct_blue.svg.png",
      "id": "330px-M2-ZAF-jct-blue-svg",
      "description": "K53 driving content - 330px-M2_ZAF_jct_blue.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M3_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M3_ZAF_jct.svg.png",
      "id": "330px-M3-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M3_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M41_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M41_ZAF_jct.svg.png",
      "id": "330px-M41-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M41_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M4_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M4_ZAF_jct.svg.png",
      "id": "330px-M4-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M4_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M51_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M51_ZAF_jct.svg.png",
      "id": "330px-M51-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M51_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M5_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M5_ZAF_jct.svg.png",
      "id": "330px-M5-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M5_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M6_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M6_ZAF_jct.svg.png",
      "id": "330px-M6-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M6_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M71_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M71_ZAF_jct.svg.png",
      "id": "330px-M71-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M71_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M7_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M7_ZAF_jct.svg.png",
      "id": "330px-M7-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M7_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M81_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M81_ZAF_jct.svg.png",
      "id": "330px-M81-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M81_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M8_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M8_ZAF_jct.svg.png",
      "id": "330px-M8-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M8_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M91_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M91_ZAF_jct.svg.png",
      "id": "330px-M91-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M91_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-M9_ZAF_jct.svg.png",
      "path": "/images/misc/330px-M9_ZAF_jct.svg.png",
      "id": "330px-M9-ZAF-jct-svg",
      "description": "K53 driving content - 330px-M9_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Mandela_capture_site_2008.jpg",
      "path": "/images/misc/330px-Mandela_capture_site_2008.jpg",
      "id": "330px-Mandela-capture-site-2008",
      "description": "K53 driving content - 330px-Mandela_capture_site_2008",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Mbhongweni_Location_20231213_134615.jpg",
      "path": "/images/misc/330px-Mbhongweni_Location_20231213_134615.jpg",
      "id": "330px-Mbhongweni-Location-20231213-134615",
      "description": "K53 driving content - 330px-Mbhongweni_Location_20231213_134615",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Northern_Cape_Welcome_Sign.jpg",
      "path": "/images/misc/330px-Northern_Cape_Welcome_Sign.jpg",
      "id": "330px-Northern-Cape-Welcome-Sign",
      "description": "K53 driving content - 330px-Northern_Cape_Welcome_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Ntandazo_Nokamba_Street.jpg",
      "path": "/images/misc/330px-Ntandazo_Nokamba_Street.jpg",
      "id": "330px-Ntandazo-Nokamba-Street",
      "description": "K53 driving content - 330px-Ntandazo_Nokamba_Street",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Old_Police_Station_Vredefort-003.jpg",
      "path": "/images/misc/330px-Old_Police_Station_Vredefort-003.jpg",
      "id": "330px-Old-Police-Station-Vredefort-003",
      "description": "K53 driving content - 330px-Old_Police_Station_Vredefort-003",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Orange_River_Wine_Route%2C_Northern_Cape_(6252707905).jpg",
      "path": "/images/misc/330px-Orange_River_Wine_Route%2C_Northern_Cape_(6252707905).jpg",
      "id": "330px-Orange-River-Wine-Route-2C-Northern-Cape--6252707905-",
      "description": "K53 driving content - 330px-Orange_River_Wine_Route%2C_Northern_Cape_(6252707905)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Outeniqua_Hop_Route%2C_Garden_Route%2C_Western_Cape%2C_South_Africa_(20512372361).jpg",
      "path": "/images/misc/330px-Outeniqua_Hop_Route%2C_Garden_Route%2C_Western_Cape%2C_South_Africa_(20512372361).jpg",
      "id": "330px-Outeniqua-Hop-Route-2C-Garden-Route-2C-Western-Cape-2C-South-Africa--20512372361-",
      "description": "K53 driving content - 330px-Outeniqua_Hop_Route%2C_Garden_Route%2C_Western_Cape%2C_South_Africa_(20512372361)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-1).jpg",
      "path": "/images/misc/330px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-1).jpg",
      "id": "330px-Parts-of-the-German-East-Africa-Central-Line-Railway--Proposed-railway-from-Mikesse-to-Ulanga---WOMAT-AFR-GEA-38-2-1-",
      "description": "K53 driving content - 330px-Parts_of_the_German_East_Africa_Central_Line_Railway._Proposed_railway_from_Mikesse_to_Ulanga._(WOMAT-AFR-GEA-38-2-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-People_of_Askham%2C_Askham%2C_Northern_Cape%2C_South_Africa_(20351779448).jpg",
      "path": "/images/misc/330px-People_of_Askham%2C_Askham%2C_Northern_Cape%2C_South_Africa_(20351779448).jpg",
      "id": "330px-People-of-Askham-2C-Askham-2C-Northern-Cape-2C-South-Africa--20351779448-",
      "description": "K53 driving content - 330px-People_of_Askham%2C_Askham%2C_Northern_Cape%2C_South_Africa_(20351779448)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_02.jpg",
      "path": "/images/misc/330px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_02.jpg",
      "id": "330px-Pig--26-Whistle-Hotel--26-Pub--Bathurst-2C-Eastern-Cape-02",
      "description": "K53 driving content - 330px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_02",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-1).jpg",
      "path": "/images/misc/330px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-1).jpg",
      "id": "330px-Plane-table-Survey-of-Area-N--and-E--and-South-of-Kigoma-War-Office-ledger--Plane-Table-Sheets---WOMAT-AFR-GEA-44-1-1-",
      "description": "K53 driving content - 330px-Plane-table_Survey_of_Area_N._and_E._and_South_of_Kigoma_War_Office_ledger._Plane-Table_Sheets._(WOMAT-AFR-GEA-44-1-1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Police_Station%2C_124_Main_Street%2C_Somerset_West_(second_view).jpg",
      "path": "/images/misc/330px-Police_Station%2C_124_Main_Street%2C_Somerset_West_(second_view).jpg",
      "id": "330px-Police-Station-2C-124-Main-Street-2C-Somerset-West--second-view-",
      "description": "K53 driving content - 330px-Police_Station%2C_124_Main_Street%2C_Somerset_West_(second_view)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Polokwane_Sign5.jpg",
      "path": "/images/misc/330px-Polokwane_Sign5.jpg",
      "id": "330px-Polokwane-Sign5",
      "description": "K53 driving content - 330px-Polokwane_Sign5",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Port_Elizabeth_City_Hall_main_library_and_Market_square_after_renovation.jpg",
      "path": "/images/misc/330px-Port_Elizabeth_City_Hall_main_library_and_Market_square_after_renovation.jpg",
      "id": "330px-Port-Elizabeth-City-Hall-main-library-and-Market-square-after-renovation",
      "description": "K53 driving content - 330px-Port_Elizabeth_City_Hall_main_library_and_Market_square_after_renovation",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Pothole_warning%2C_R512_in_North_West_Province%2C_SA.jpg",
      "path": "/images/misc/330px-Pothole_warning%2C_R512_in_North_West_Province%2C_SA.jpg",
      "id": "330px-Pothole-warning-2C-R512-in-North-West-Province-2C-SA",
      "description": "K53 driving content - 330px-Pothole_warning%2C_R512_in_North_West_Province%2C_SA",
      "context": ["regulatory","warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Provincia_del_Cabo_Septentrional%2C_niebla.jpg",
      "path": "/images/misc/330px-Provincia_del_Cabo_Septentrional%2C_niebla.jpg",
      "id": "330px-Provincia-del-Cabo-Septentrional-2C-niebla",
      "description": "K53 driving content - 330px-Provincia_del_Cabo_Septentrional%2C_niebla",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-R310_Baden_Powell_Drive%2C_South_Africa.jpg",
      "path": "/images/misc/330px-R310_Baden_Powell_Drive%2C_South_Africa.jpg",
      "id": "330px-R310-Baden-Powell-Drive-2C-South-Africa",
      "description": "K53 driving content - 330px-R310_Baden_Powell_Drive%2C_South_Africa",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-R509_through_Derby.jpg",
      "path": "/images/misc/330px-R509_through_Derby.jpg",
      "id": "330px-R509-through-Derby",
      "description": "K53 driving content - 330px-R509_through_Derby",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Red_City_Tour_2.jpg",
      "path": "/images/misc/330px-Red_City_Tour_2.jpg",
      "id": "330px-Red-City-Tour-2",
      "description": "K53 driving content - 330px-Red_City_Tour_2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Republic_Of_Namibia.jpg",
      "path": "/images/misc/330px-Republic_Of_Namibia.jpg",
      "id": "330px-Republic-Of-Namibia",
      "description": "K53 driving content - 330px-Republic_Of_Namibia",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Rooihuiskraal_Battlefield-025.jpg",
      "path": "/images/misc/330px-Rooihuiskraal_Battlefield-025.jpg",
      "id": "330px-Rooihuiskraal-Battlefield-025",
      "description": "K53 driving content - 330px-Rooihuiskraal_Battlefield-025",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-RSA-Nationalstraße_N12.jpg",
      "path": "/images/misc/330px-RSA-Nationalstraße_N12.jpg",
      "id": "330px-RSA-Nationalstra-e-N12",
      "description": "K53 driving content - 330px-RSA-Nationalstraße_N12",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-RSA-Nationalstraße_N2.jpg",
      "path": "/images/misc/330px-RSA-Nationalstraße_N2.jpg",
      "id": "330px-RSA-Nationalstra-e-N2",
      "description": "K53 driving content - 330px-RSA-Nationalstraße_N2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Rue_Nelson_Mandela_Cassepierre.jpg",
      "path": "/images/misc/330px-Rue_Nelson_Mandela_Cassepierre.jpg",
      "id": "330px-Rue-Nelson-Mandela-Cassepierre",
      "description": "K53 driving content - 330px-Rue_Nelson_Mandela_Cassepierre",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sanipass_Hiwneisschild_Allradantrieb.jpg",
      "path": "/images/misc/330px-Sanipass_Hiwneisschild_Allradantrieb.jpg",
      "id": "330px-Sanipass-Hiwneisschild-Allradantrieb",
      "description": "K53 driving content - 330px-Sanipass_Hiwneisschild_Allradantrieb",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-SAR_Class_6E1_Series_6_E1671.jpg",
      "path": "/images/misc/330px-SAR_Class_6E1_Series_6_E1671.jpg",
      "id": "330px-SAR-Class-6E1-Series-6-E1671",
      "description": "K53 driving content - 330px-SAR_Class_6E1_Series_6_E1671",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Signboard_at_Saldanha_-_panoramio.jpg",
      "path": "/images/misc/330px-Signboard_at_Saldanha_-_panoramio.jpg",
      "id": "330px-Signboard-at-Saldanha---panoramio",
      "description": "K53 driving content - 330px-Signboard_at_Saldanha_-_panoramio",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sign_to_Die_Houthoop_guesthouse_(10640207823).jpg",
      "path": "/images/misc/330px-Sign_to_Die_Houthoop_guesthouse_(10640207823).jpg",
      "id": "330px-Sign-to-Die-Houthoop-guesthouse--10640207823-",
      "description": "K53 driving content - 330px-Sign_to_Die_Houthoop_guesthouse_(10640207823)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1recto).jpg",
      "path": "/images/misc/330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1recto).jpg",
      "id": "330px-Sketch-of-the-Sudan-Eritrea-Frontier-South-of-Sabderat---WOOG-347-1recto-",
      "description": "K53 driving content - 330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1recto)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1verso).jpg",
      "path": "/images/misc/330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1verso).jpg",
      "id": "330px-Sketch-of-the-Sudan-Eritrea-Frontier-South-of-Sabderat---WOOG-347-1verso-",
      "description": "K53 driving content - 330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-1verso)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2recto).jpg",
      "path": "/images/misc/330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2recto).jpg",
      "id": "330px-Sketch-of-the-Sudan-Eritrea-Frontier-South-of-Sabderat---WOOG-347-2recto-",
      "description": "K53 driving content - 330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2recto)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2verso).jpg",
      "path": "/images/misc/330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2verso).jpg",
      "id": "330px-Sketch-of-the-Sudan-Eritrea-Frontier-South-of-Sabderat---WOOG-347-2verso-",
      "description": "K53 driving content - 330px-Sketch_of_the_Sudan-Eritrea_Frontier_South_of_Sabderat._(WOOG-347-2verso)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Smash_and_Grab_Hot_Spot%2C_Retreat_(South_Africa).jpg",
      "path": "/images/misc/330px-Smash_and_Grab_Hot_Spot%2C_Retreat_(South_Africa).jpg",
      "id": "330px-Smash-and-Grab-Hot-Spot-2C-Retreat--South-Africa-",
      "description": "K53 driving content - 330px-Smash_and_Grab_Hot_Spot%2C_Retreat_(South_Africa)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Solar_Car_Tokai_Falcin_2009_SASC.jpg",
      "path": "/images/misc/330px-Solar_Car_Tokai_Falcin_2009_SASC.jpg",
      "id": "330px-Solar-Car-Tokai-Falcin-2009-SASC",
      "description": "K53 driving content - 330px-Solar_Car_Tokai_Falcin_2009_SASC",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Sound_Advice_!!!_(52656226761).jpg",
      "path": "/images/misc/330px-Sound_Advice_!!!_(52656226761).jpg",
      "id": "330px-Sound-Advice------52656226761-",
      "description": "K53 driving content - 330px-Sound_Advice_!!!_(52656226761)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-South_African_Children.jpg",
      "path": "/images/misc/330px-South_African_Children.jpg",
      "id": "330px-South-African-Children",
      "description": "K53 driving content - 330px-South_African_Children",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Speed_Camera_Sign.jpg",
      "path": "/images/misc/330px-Speed_Camera_Sign.jpg",
      "id": "330px-Speed-Camera-Sign",
      "description": "K53 driving content - 330px-Speed_Camera_Sign",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20317525878).jpg",
      "path": "/images/misc/330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20317525878).jpg",
      "id": "330px-Stellenbosch-Wine-Route-2C-Western-Cape-2C-South-Africa--20317525878-",
      "description": "K53 driving content - 330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20317525878)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20498170882).jpg",
      "path": "/images/misc/330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20498170882).jpg",
      "id": "330px-Stellenbosch-Wine-Route-2C-Western-Cape-2C-South-Africa--20498170882-",
      "description": "K53 driving content - 330px-Stellenbosch_Wine_Route%2C_Western_Cape%2C_South_Africa_(20498170882)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Suráfrica%2C_Olifants_2.jpg",
      "path": "/images/misc/330px-Suráfrica%2C_Olifants_2.jpg",
      "id": "330px-Sur-frica-2C-Olifants-2",
      "description": "K53 driving content - 330px-Suráfrica%2C_Olifants_2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-TableMountain.jpg",
      "path": "/images/misc/330px-TableMountain.jpg",
      "id": "330px-TableMountain",
      "description": "K53 driving content - 330px-TableMountain",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-The_rapids_of_the_Victoria_Falls%2C_Zambezi_River_by_Thomas_Baines.jpg",
      "path": "/images/misc/330px-The_rapids_of_the_Victoria_Falls%2C_Zambezi_River_by_Thomas_Baines.jpg",
      "id": "330px-The-rapids-of-the-Victoria-Falls-2C-Zambezi-River-by-Thomas-Baines",
      "description": "K53 driving content - 330px-The_rapids_of_the_Victoria_Falls%2C_Zambezi_River_by_Thomas_Baines",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-thumbnail (1).jpg",
      "path": "/images/misc/330px-thumbnail (1).jpg",
      "id": "330px-thumbnail--1-",
      "description": "K53 driving content - 330px-thumbnail (1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-thumbnail.jpg",
      "path": "/images/misc/330px-thumbnail.jpg",
      "id": "330px-thumbnail",
      "description": "K53 driving content - 330px-thumbnail",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Tiger_oats_01.jpg",
      "path": "/images/misc/330px-Tiger_oats_01.jpg",
      "id": "330px-Tiger-oats-01",
      "description": "K53 driving content - 330px-Tiger_oats_01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Tiger_oats_02.jpg",
      "path": "/images/misc/330px-Tiger_oats_02.jpg",
      "id": "330px-Tiger-oats-02",
      "description": "K53 driving content - 330px-Tiger_oats_02",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Voortrekker_Cemetery%2C_between_Burgersfort_%26_Ohrigstad%2C_Mpumalanga._01.jpg",
      "path": "/images/misc/330px-Voortrekker_Cemetery%2C_between_Burgersfort_%26_Ohrigstad%2C_Mpumalanga._01.jpg",
      "id": "330px-Voortrekker-Cemetery-2C-between-Burgersfort--26-Ohrigstad-2C-Mpumalanga--01",
      "description": "K53 driving content - 330px-Voortrekker_Cemetery%2C_between_Burgersfort_%26_Ohrigstad%2C_Mpumalanga._01",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Warning%2C_Kudu%2C_North_West_Province_(6252698611).jpg",
      "path": "/images/misc/330px-Warning%2C_Kudu%2C_North_West_Province_(6252698611).jpg",
      "id": "330px-Warning-2C-Kudu-2C-North-West-Province--6252698611-",
      "description": "K53 driving content - 330px-Warning%2C_Kudu%2C_North_West_Province_(6252698611)",
      "context": ["warning"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Way_up_to_Port_Elizabeth_(1980)_-_panoramio.jpg",
      "path": "/images/misc/330px-Way_up_to_Port_Elizabeth_(1980)_-_panoramio.jpg",
      "id": "330px-Way-up-to-Port-Elizabeth--1980----panoramio",
      "description": "K53 driving content - 330px-Way_up_to_Port_Elizabeth_(1980)_-_panoramio",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Welcome_to_the_Northern_Cape_(6252702573).jpg",
      "path": "/images/misc/330px-Welcome_to_the_Northern_Cape_(6252702573).jpg",
      "id": "330px-Welcome-to-the-Northern-Cape--6252702573-",
      "description": "K53 driving content - 330px-Welcome_to_the_Northern_Cape_(6252702573)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Willem_Pretorius_Game_Reserve-001.jpg",
      "path": "/images/misc/330px-Willem_Pretorius_Game_Reserve-001.jpg",
      "id": "330px-Willem-Pretorius-Game-Reserve-001",
      "description": "K53 driving content - 330px-Willem_Pretorius_Game_Reserve-001",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-Wood_R10.jpg",
      "path": "/images/misc/330px-Wood_R10.jpg",
      "id": "330px-Wood-R10",
      "description": "K53 driving content - 330px-Wood_R10",
      "context": ["regulatory"],
      "difficulty": "basic"
    },
    {
      "filename": "330px-الكال_عير_النيجر.jpg",
      "path": "/images/misc/330px-الكال_عير_النيجر.jpg",
      "id": "330px-----------------",
      "description": "K53 driving content - 330px-الكال_عير_النيجر",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-20171130_Woman_in_predominately_male_dominated_field_of_work.jpg",
      "path": "/images/misc/500px-20171130_Woman_in_predominately_male_dominated_field_of_work.jpg",
      "id": "500px-20171130-Woman-in-predominately-male-dominated-field-of-work",
      "description": "K53 driving content - 500px-20171130_Woman_in_predominately_male_dominated_field_of_work",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-3405_SAR_4-8-4_Class_25NC_built_by_NBL_1953.jpg",
      "path": "/images/misc/500px-3405_SAR_4-8-4_Class_25NC_built_by_NBL_1953.jpg",
      "id": "500px-3405-SAR-4-8-4-Class-25NC-built-by-NBL-1953",
      "description": "K53 driving content - 500px-3405_SAR_4-8-4_Class_25NC_built_by_NBL_1953",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M101_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M101_ZAF_jct.svg.png",
      "id": "500px-M101-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M101_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M10_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M10_ZAF_jct.svg.png",
      "id": "500px-M10-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M10_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M121_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M121_ZAF_jct.svg.png",
      "id": "500px-M121-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M121_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M12_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M12_ZAF_jct.svg.png",
      "id": "500px-M12-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M12_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M131_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M131_ZAF_jct.svg.png",
      "id": "500px-M131-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M131_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M13_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M13_ZAF_jct.svg.png",
      "id": "500px-M13-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M13_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M141_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M141_ZAF_jct.svg.png",
      "id": "500px-M141-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M141_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M146_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M146_ZAF_jct.svg.png",
      "id": "500px-M146-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M146_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M149_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M149_ZAF_jct.svg.png",
      "id": "500px-M149-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M149_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M14_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M14_ZAF_jct.svg.png",
      "id": "500px-M14-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M14_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M151_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M151_ZAF_jct.svg.png",
      "id": "500px-M151-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M151_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M152_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M152_ZAF_jct.svg.png",
      "id": "500px-M152-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M152_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M153_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M153_ZAF_jct.svg.png",
      "id": "500px-M153-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M153_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M155_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M155_ZAF_jct.svg.png",
      "id": "500px-M155-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M155_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M15_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M15_ZAF_jct.svg.png",
      "id": "500px-M15-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M15_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M160_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M160_ZAF_jct.svg.png",
      "id": "500px-M160-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M160_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M161_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M161_ZAF_jct.svg.png",
      "id": "500px-M161-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M161_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M163_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M163_ZAF_jct.svg.png",
      "id": "500px-M163-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M163_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M165_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M165_ZAF_jct.svg.png",
      "id": "500px-M165-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M165_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M168_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M168_ZAF_jct.svg.png",
      "id": "500px-M168-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M168_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M16_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M16_ZAF_jct.svg.png",
      "id": "500px-M16-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M16_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M174_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M174_ZAF_jct.svg.png",
      "id": "500px-M174-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M174_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M177_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M177_ZAF_jct.svg.png",
      "id": "500px-M177-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M177_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M17_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M17_ZAF_jct.svg.png",
      "id": "500px-M17-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M17_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M180_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M180_ZAF_jct.svg.png",
      "id": "500px-M180-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M180_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M181_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M181_ZAF_jct.svg.png",
      "id": "500px-M181-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M181_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M182_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M182_ZAF_jct.svg.png",
      "id": "500px-M182-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M182_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M189_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M189_ZAF_jct.svg.png",
      "id": "500px-M189-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M189_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M191_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M191_ZAF_jct.svg.png",
      "id": "500px-M191-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M191_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M19_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M19_ZAF_jct.svg.png",
      "id": "500px-M19-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M19_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M20_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M20_ZAF_jct.svg.png",
      "id": "500px-M20-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M20_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M22_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M22_ZAF_jct.svg.png",
      "id": "500px-M22-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M22_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M23_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M23_ZAF_jct.svg.png",
      "id": "500px-M23-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M23_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M25_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M25_ZAF_jct.svg.png",
      "id": "500px-M25-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M25_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M27_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M27_ZAF_jct.svg.png",
      "id": "500px-M27-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M27_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M28_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M28_ZAF_jct.svg.png",
      "id": "500px-M28-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M28_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M29_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M29_ZAF_jct.svg.png",
      "id": "500px-M29-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M29_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M30_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M30_ZAF_jct.svg.png",
      "id": "500px-M30-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M30_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M32_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M32_ZAF_jct.svg.png",
      "id": "500px-M32-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M32_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M33_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M33_ZAF_jct.svg.png",
      "id": "500px-M33-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M33_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M34_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M34_ZAF_jct.svg.png",
      "id": "500px-M34-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M34_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M35_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M35_ZAF_jct.svg.png",
      "id": "500px-M35-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M35_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M36_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M36_ZAF_jct.svg.png",
      "id": "500px-M36-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M36_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M37_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M37_ZAF_jct.svg.png",
      "id": "500px-M37-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M37_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M38_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M38_ZAF_jct.svg.png",
      "id": "500px-M38-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M38_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M39_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M39_ZAF_jct.svg.png",
      "id": "500px-M39-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M39_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M40_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M40_ZAF_jct.svg.png",
      "id": "500px-M40-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M40_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M42_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M42_ZAF_jct.svg.png",
      "id": "500px-M42-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M42_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M44_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M44_ZAF_jct.svg.png",
      "id": "500px-M44-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M44_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M45_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M45_ZAF_jct.svg.png",
      "id": "500px-M45-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M45_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M46_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M46_ZAF_jct.svg.png",
      "id": "500px-M46-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M46_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M47_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M47_ZAF_jct.svg.png",
      "id": "500px-M47-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M47_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M48_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M48_ZAF_jct.svg.png",
      "id": "500px-M48-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M48_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M52_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M52_ZAF_jct.svg.png",
      "id": "500px-M52-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M52_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M53_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M53_ZAF_jct.svg.png",
      "id": "500px-M53-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M53_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M54_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M54_ZAF_jct.svg.png",
      "id": "500px-M54-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M54_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M55_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M55_ZAF_jct.svg.png",
      "id": "500px-M55-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M55_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M56_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M56_ZAF_jct.svg.png",
      "id": "500px-M56-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M56_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M57_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M57_ZAF_jct.svg.png",
      "id": "500px-M57-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M57_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M58_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M58_ZAF_jct.svg.png",
      "id": "500px-M58-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M58_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M62_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M62_ZAF_jct.svg.png",
      "id": "500px-M62-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M62_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M63_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M63_ZAF_jct.svg.png",
      "id": "500px-M63-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M63_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M64_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M64_ZAF_jct.svg.png",
      "id": "500px-M64-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M64_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M65_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M65_ZAF_jct.svg.png",
      "id": "500px-M65-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M65_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M66_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M66_ZAF_jct.svg.png",
      "id": "500px-M66-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M66_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M67_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M67_ZAF_jct.svg.png",
      "id": "500px-M67-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M67_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M68_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M68_ZAF_jct.svg.png",
      "id": "500px-M68-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M68_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M69_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M69_ZAF_jct.svg.png",
      "id": "500px-M69-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M69_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M70_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M70_ZAF_jct.svg.png",
      "id": "500px-M70-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M70_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M72_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M72_ZAF_jct.svg.png",
      "id": "500px-M72-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M72_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M73_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M73_ZAF_jct.svg.png",
      "id": "500px-M73-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M73_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M74_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M74_ZAF_jct.svg.png",
      "id": "500px-M74-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M74_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M75_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M75_ZAF_jct.svg.png",
      "id": "500px-M75-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M75_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M76_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M76_ZAF_jct.svg.png",
      "id": "500px-M76-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M76_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M77_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M77_ZAF_jct.svg.png",
      "id": "500px-M77-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M77_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M78_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M78_ZAF_jct.svg.png",
      "id": "500px-M78-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M78_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M79_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M79_ZAF_jct.svg.png",
      "id": "500px-M79-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M79_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M80_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M80_ZAF_jct.svg.png",
      "id": "500px-M80-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M80_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M82_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M82_ZAF_jct.svg.png",
      "id": "500px-M82-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M82_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M83_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M83_ZAF_jct.svg.png",
      "id": "500px-M83-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M83_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M84_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M84_ZAF_jct.svg.png",
      "id": "500px-M84-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M84_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M85_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M85_ZAF_jct.svg.png",
      "id": "500px-M85-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M85_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M86_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M86_ZAF_jct.svg.png",
      "id": "500px-M86-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M86_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M87_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M87_ZAF_jct.svg.png",
      "id": "500px-M87-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M87_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M88_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M88_ZAF_jct.svg.png",
      "id": "500px-M88-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M88_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M89_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M89_ZAF_jct.svg.png",
      "id": "500px-M89-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M89_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M90_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M90_ZAF_jct.svg.png",
      "id": "500px-M90-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M90_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M92_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M92_ZAF_jct.svg.png",
      "id": "500px-M92-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M92_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M93_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M93_ZAF_jct.svg.png",
      "id": "500px-M93-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M93_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M94_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M94_ZAF_jct.svg.png",
      "id": "500px-M94-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M94_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M95_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M95_ZAF_jct.svg.png",
      "id": "500px-M95-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M95_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M97_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M97_ZAF_jct.svg.png",
      "id": "500px-M97-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M97_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M98_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M98_ZAF_jct.svg.png",
      "id": "500px-M98-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M98_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-M99_ZAF_jct.svg.png",
      "path": "/images/misc/500px-M99_ZAF_jct.svg.png",
      "id": "500px-M99-ZAF-jct-svg",
      "description": "K53 driving content - 500px-M99_ZAF_jct.svg",
      "context": ["highway"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Madiba_Circle.jpg",
      "path": "/images/misc/500px-Madiba_Circle.jpg",
      "id": "500px-Madiba-Circle",
      "description": "K53 driving content - 500px-Madiba_Circle",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Mangoche_District._Folio_(WOMAT-AFR-BCA-22-2).jpg",
      "path": "/images/misc/500px-Mangoche_District._Folio_(WOMAT-AFR-BCA-22-2).jpg",
      "id": "500px-Mangoche-District--Folio--WOMAT-AFR-BCA-22-2-",
      "description": "K53 driving content - 500px-Mangoche_District._Folio_(WOMAT-AFR-BCA-22-2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Nqweba_Dam_Info.jpg",
      "path": "/images/misc/500px-Nqweba_Dam_Info.jpg",
      "id": "500px-Nqweba-Dam-Info",
      "description": "K53 driving content - 500px-Nqweba_Dam_Info",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Orange_River_..._(Photo_JC_PLE).jpg",
      "path": "/images/misc/500px-Orange_River_..._(Photo_JC_PLE).jpg",
      "id": "500px-Orange-River------Photo-JC-PLE-",
      "description": "K53 driving content - 500px-Orange_River_..._(Photo_JC_PLE)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_10.jpg",
      "path": "/images/misc/500px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_10.jpg",
      "id": "500px-Pig--26-Whistle-Hotel--26-Pub--Bathurst-2C-Eastern-Cape-10",
      "description": "K53 driving content - 500px-Pig_%26_Whistle_Hotel_%26_Pub._Bathurst%2C_Eastern_Cape_10",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773260250).jpg",
      "path": "/images/misc/500px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773260250).jpg",
      "id": "500px-Route-to-Montr-al-Pierre-Elliott-Trudeau-International-Airport-2C-Montreal-2C-Quebec--29773260250-",
      "description": "K53 driving content - 500px-Route_to_Montréal–Pierre_Elliott_Trudeau_International_Airport%2C_Montreal%2C_Quebec_(29773260250)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Suráfrica%2C_El_Cabo_Occidental_2.jpg",
      "path": "/images/misc/500px-Suráfrica%2C_El_Cabo_Occidental_2.jpg",
      "id": "500px-Sur-frica-2C-El-Cabo-Occidental-2",
      "description": "K53 driving content - 500px-Suráfrica%2C_El_Cabo_Occidental_2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-thumbnail (1).jpg",
      "path": "/images/misc/500px-thumbnail (1).jpg",
      "id": "500px-thumbnail--1-",
      "description": "K53 driving content - 500px-thumbnail (1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-thumbnail.jpg",
      "path": "/images/misc/500px-thumbnail.jpg",
      "id": "500px-thumbnail",
      "description": "K53 driving content - 500px-thumbnail",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Vredefort_Dome_Vredefort-001.jpg",
      "path": "/images/misc/500px-Vredefort_Dome_Vredefort-001.jpg",
      "id": "500px-Vredefort-Dome-Vredefort-001",
      "description": "K53 driving content - 500px-Vredefort_Dome_Vredefort-001",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "500px-Welcome_to_Victoria_West_..._(Photo_JC_PLE).jpg",
      "path": "/images/misc/500px-Welcome_to_Victoria_West_..._(Photo_JC_PLE).jpg",
      "id": "500px-Welcome-to-Victoria-West------Photo-JC-PLE-",
      "description": "K53 driving content - 500px-Welcome_to_Victoria_West_..._(Photo_JC_PLE)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "960px-Ortsschild_Namibia.png",
      "path": "/images/misc/960px-Ortsschild_Namibia.png",
      "id": "960px-Ortsschild-Namibia",
      "description": "K53 driving content - 960px-Ortsschild_Namibia",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "commonswiki-wordmark.svg",
      "path": "/images/misc/commonswiki-wordmark.svg",
      "id": "commonswiki-wordmark",
      "description": "K53 driving content - commonswiki-wordmark",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "commonswiki.svg",
      "path": "/images/misc/commonswiki.svg",
      "id": "commonswiki",
      "description": "K53 driving content - commonswiki",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "download (1).svg",
      "path": "/images/misc/download (1).svg",
      "id": "download--1-",
      "description": "K53 driving content - download (1)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "download (2).svg",
      "path": "/images/misc/download (2).svg",
      "id": "download--2-",
      "description": "K53 driving content - download (2)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "download (3).svg",
      "path": "/images/misc/download (3).svg",
      "id": "download--3-",
      "description": "K53 driving content - download (3)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "download (4).svg",
      "path": "/images/misc/download (4).svg",
      "id": "download--4-",
      "description": "K53 driving content - download (4)",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "download.svg",
      "path": "/images/misc/download.svg",
      "id": "download",
      "description": "K53 driving content - download",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "lossy-page1-272px-ASC_Leiden_-_F._van_der_Kraaij_Collection_-_12_-_092_-_Une_route_pavée_avec_des_palmiers_et_des_champs_d'herbe_-_Niono%2C_Région_de_Ségou%2C_Mali%2C_1984.tif.jpg",
      "path": "/images/misc/lossy-page1-272px-ASC_Leiden_-_F._van_der_Kraaij_Collection_-_12_-_092_-_Une_route_pavée_avec_des_palmiers_et_des_champs_d'herbe_-_Niono%2C_Région_de_Ségou%2C_Mali%2C_1984.tif.jpg",
      "id": "lossy-page1-272px-ASC-Leiden---F--van-der-Kraaij-Collection---12---092---Une-route-pav-e-avec-des-palmiers-et-des-champs-d-herbe---Niono-2C-R-gion-de-S-gou-2C-Mali-2C-1984-tif",
      "description": "K53 driving content - lossy-page1-272px-ASC_Leiden_-_F._van_der_Kraaij_Collection_-_12_-_092_-_Une_route_pavée_avec_des_palmiers_et_des_champs_d'herbe_-_Niono%2C_Région_de_Ségou%2C_Mali%2C_1984.tif",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "lossy-page1-272px-thumbnail.tif.jpg",
      "path": "/images/misc/lossy-page1-272px-thumbnail.tif.jpg",
      "id": "lossy-page1-272px-thumbnail-tif",
      "description": "K53 driving content - lossy-page1-272px-thumbnail.tif",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "mediawiki_compact.svg",
      "path": "/images/misc/mediawiki_compact.svg",
      "id": "mediawiki-compact",
      "description": "K53 driving content - mediawiki_compact",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "Picto-Factory-2.png",
      "path": "/images/misc/Picto-Factory-2.png",
      "id": "Picto-Factory-2",
      "description": "K53 driving content - Picto-Factory-2",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "poweredby_mediawiki.svg",
      "path": "/images/misc/poweredby_mediawiki.svg",
      "id": "poweredby-mediawiki",
      "description": "K53 driving content - poweredby_mediawiki",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "wikimedia-button.svg",
      "path": "/images/misc/wikimedia-button.svg",
      "id": "wikimedia-button",
      "description": "K53 driving content - wikimedia-button",
      "context": ["general"],
      "difficulty": "basic"
    },
    {
      "filename": "wikimedia.svg",
      "path": "/images/misc/wikimedia.svg",
      "id": "wikimedia",
      "description": "K53 driving content - wikimedia",
      "context": ["general"],
      "difficulty": "basic"
    }
  ],
};

// Helper functions remain the same
export const getImagesByCategory = (category: keyof typeof imageMapping): ImageAsset[] => {
  return imageMapping[category] || [];
};

export const getRandomImageByCategory = (category: keyof typeof imageMapping): ImageAsset | null => {
  const images = getImagesByCategory(category);
  if (images.length > 0) {
    return images[Math.floor(Math.random() * images.length)];
  }
  return null;
};

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
  
  return getRandomImageByCategory(category);
};

export const getImageByDifficulty = (
  category: keyof typeof imageMapping,
  difficulty: "basic" | "intermediate" | "advanced"
): ImageAsset | null => {
  const images = getImagesByCategory(category);
  const matchingImages = images.filter(img => img.difficulty === difficulty);
  
  if (matchingImages.length > 0) {
    return matchingImages[Math.floor(Math.random() * matchingImages.length)];
  }
  
  return getRandomImageByCategory(category);
};



export const getQuestionImage = (
  question: {
    category: "controls" | "signs" | "rules";
    question: string;
  }
): ImageAsset | null => {
  if (!question || !question.question) {
    const mappedCategory = (question?.category || "controls") === "rules" ? "signs" : (question?.category || "controls");
    return getRandomImageByCategory(mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc");
  }
  
  const questionText = question.question.toLowerCase();
  const requiredTags: string[] = [];
  const context: string[] = [];
  
  // Speed-related questions (check specific first, then general)
  if (questionText.includes("speed limit") || questionText.includes("maximum speed") || questionText.includes("minimum speed")) {
    requiredTags.push("speed-limit");
    context.push("speed");
  } else if (questionText.includes("speed")) {
    // General speed questions (not about limits)
    context.push("speed-control");
  }
  
  // Built-up area / urban questions
  if (questionText.includes("built-up") || questionText.includes("urban area") || questionText.includes("city")) {
    context.push("urban");
  }
  
  // Stop and yield
  if (questionText.includes("stop sign") || questionText.includes("stop street")) {
    requiredTags.push("stop");
  }
  if (questionText.includes("yield") || questionText.includes("give way")) {
    requiredTags.push("yield");
  }
  
  // No entry / prohibited
  if (questionText.includes("no entry") || questionText.includes("prohibited") || questionText.includes("not allowed")) {
    requiredTags.push("no-entry");
  }
  
  // Parking (check "no parking" FIRST to avoid double-tagging)
  if (questionText.includes("no parking")) {
    requiredTags.push("no-parking");
  } else if (questionText.includes("parking") || questionText.includes("park")) {
    requiredTags.push("parking");
    context.push("parking");
  }
  
  // Pedestrians
  if (questionText.includes("pedestrian") || questionText.includes("crosswalk") || questionText.includes("crossing")) {
    requiredTags.push("pedestrian");
  }
  
  // School zones
  if (questionText.includes("school")) {
    requiredTags.push("school");
    context.push("school-zone");
  }
  
  // Traffic lights
  if (questionText.includes("traffic light") || questionText.includes("robot")) {
    requiredTags.push("traffic-light");
  }
  
  // Roundabouts
  if (questionText.includes("roundabout") || questionText.includes("traffic circle")) {
    requiredTags.push("roundabout");
  }
  
  // Overtaking
  if (questionText.includes("overtake") || questionText.includes("passing")) {
    requiredTags.push("overtaking");
  }
  
  // One way
  if (questionText.includes("one way") || questionText.includes("one-way")) {
    requiredTags.push("one-way");
  }
  
  // Vehicle controls
  if (questionText.includes("clutch") || questionText.includes("gear")) {
    context.push("gear-change");
  }
  if (questionText.includes("brake")) {
    context.push("braking");
  }
  if (questionText.includes("accelerator")) {
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
  
  // If we have specific tags, try to find images with those tags
  if (requiredTags.length > 0) {
    const allImages = Object.values(imageMapping).flat();
    const matchingImages = allImages.filter(img => {
      const imgTags = img.tags || generateImageTags(img);
      return requiredTags.some(tag => imgTags.includes(tag));
    });
    
    if (matchingImages.length > 0) {
      return matchingImages[Math.floor(Math.random() * matchingImages.length)];
    }
  }
  
  // If we have context but no tag matches, use context matching
  if (context.length > 0) {
    const mappedCategory = question.category === "rules" ? "signs" : question.category;
    const contextMatch = getImageByContext(mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc", context);
    if (contextMatch) return contextMatch;
  }
  
  // Default: return a category-appropriate image (not completely random)
  // For rules category, prefer signs category images
  const mappedCategory = question.category === "rules" ? "signs" : question.category;
  return getRandomImageByCategory(mappedCategory as "signs" | "controls" | "scenarios" | "locations" | "landmarks" | "misc");
};

// Production-ready function to get images that actually match scenario content
export const getScenarioMatchingImages = (
  scenario: {
    title: string;
    scenario: string;
    question: string;
    category: "controls" | "signs" | "rules" | "mixed";
    context?: string;
    difficulty?: "basic" | "intermediate" | "advanced";
  }
): ImageAsset[] => {
  // Use the new tag-based approach for better accuracy
  return getScenarioMatchingImagesByTags(scenario);
};

// Enhanced scenario image function that uses content matching
export const getScenarioImage = (
  scenario: {
    category: "controls" | "signs" | "rules" | "mixed";
    context?: string;
    difficulty?: "basic" | "intermediate" | "advanced";
    location?: {
      cities?: string[];
      regions?: string[];
    };
    title?: string;
    scenario?: string;
    question?: string;
  }
): ImageAsset | null => {
  // If we have full scenario text, use the new matching function
  if (scenario.title && scenario.scenario && scenario.question) {
    const matchingImages = getScenarioMatchingImages(scenario as any);
    return matchingImages.length > 0 ? matchingImages[0] : null;
  }
  
  // Fallback to original logic for backward compatibility
  const category = scenario.category === "mixed" ? "scenarios" : scenario.category;
  
  if (category === "scenarios") {
    const contextArray = scenario.context ? [scenario.context] : [];
    if (scenario.location?.cities) {
      contextArray.push(...scenario.location.cities.map(city => city.toLowerCase()));
    }
    
    return getImageByContext("scenarios", contextArray);
  }
  
  if (scenario.difficulty) {
    return getImageByDifficulty(category as keyof typeof imageMapping, scenario.difficulty);
  }
  
  return getRandomImageByCategory(category as keyof typeof imageMapping);
};
