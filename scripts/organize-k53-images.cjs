const fs = require('fs');
const path = require('path');

// Image categorization rules
const imageCategories = {
  signs: {
    patterns: [
      /SADC_road_sign_/,
      /SA_road_/,
      /120px-SADC_road_sign_/,
      /60px-SADC_road_sign_/
    ],
    subcategories: {
      regulatory: [/R\d+/, /R\d+-\w+/],
      warning: [/W\d+/, /TW\d+/],
      information: [/IN\d+/, /TIN\d+/],
      tourism: [/Tourism/],
      general: [/GDLS/]
    }
  },
  controls: {
    patterns: [
      /clutch/,
      /brake/,
      /accelerator/,
      /steering/,
      /gear/,
      /mirror/,
      /dashboard/,
      /indicator/,
      /horn/,
      /wiper/,
      /light/
    ]
  },
  scenarios: {
    patterns: [
      /highway/,
      /intersection/,
      /parking/,
      /school/,
      /pedestrian/,
      /construction/,
      /emergency/,
      /weather/,
      /night/,
      /fog/,
      /rain/
    ]
  },
  locations: {
    patterns: [
      /Johannesburg/,
      /Cape_Town/,
      /Pretoria/,
      /Durban/,
      /PortElizabeth/,
      /Soweto/,
      /Sandton/,
      /Rosebank/,
      /Barrydale/,
      /Namaqualand/
    ]
  },
  landmarks: {
    patterns: [
      /Museum/,
      /Church/,
      /Memorial/,
      /Beach/,
      /Road/,
      /Square/
    ]
  }
};

function categorizeImage(filename) {
  const lowerFilename = filename.toLowerCase();
  
  // Check each category
  for (const [category, config] of Object.entries(imageCategories)) {
    for (const pattern of config.patterns) {
      if (pattern.test(filename) || pattern.test(lowerFilename)) {
        return {
          category,
          subcategory: getSubcategory(filename, config.subcategories),
          filename,
          originalPath: `/images/all images/${filename}`,
          newPath: `/images/${category}/${filename}`
        };
      }
    }
  }
  
  // Default to signs if it's a road sign but doesn't match specific patterns
  if (filename.includes('road') || filename.includes('sign')) {
    return {
      category: 'signs',
      subcategory: 'general',
      filename,
      originalPath: `/images/all images/${filename}`,
      newPath: `/images/signs/${filename}`
    };
  }
  
  return {
    category: 'misc',
    subcategory: 'general',
    filename,
    originalPath: `/images/all images/${filename}`,
    newPath: `/images/misc/${filename}`
  };
}

function getSubcategory(filename, subcategories) {
  if (!subcategories) return 'general';
  
  for (const [subcategory, patterns] of Object.entries(subcategories)) {
    for (const pattern of patterns) {
      if (pattern.test(filename)) {
        return subcategory;
      }
    }
  }
  return 'general';
}

function generateImageMapping() {
  const allImagesDir = path.join(__dirname, '../public/images/all images');
  const files = fs.readdirSync(allImagesDir);
  
  const categorizedImages = {
    signs: [],
    controls: [],
    scenarios: [],
    locations: [],
    landmarks: [],
    misc: []
  };
  
  files.forEach(filename => {
    if (filename.match(/\.(png|jpg|jpeg|svg)$/i)) {
      const category = categorizeImage(filename);
      categorizedImages[category.category].push(category);
    }
  });
  
  return categorizedImages;
}

function createDirectories() {
  const baseDir = path.join(__dirname, '../public/images');
  const categories = ['signs', 'controls', 'scenarios', 'locations', 'landmarks', 'misc'];
  
  categories.forEach(category => {
    const categoryDir = path.join(baseDir, category);
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }
  });
}

function copyImages(categorizedImages) {
  const allImagesDir = path.join(__dirname, '../public/images/all images');
  const baseDir = path.join(__dirname, '../public/images');
  
  let copiedCount = 0;
  let errorCount = 0;
  
  Object.entries(categorizedImages).forEach(([category, images]) => {
    images.forEach(image => {
      try {
        const sourcePath = path.join(allImagesDir, image.filename);
        const destPath = path.join(baseDir, category, image.filename);
        
        if (fs.existsSync(sourcePath)) {
          fs.copyFileSync(sourcePath, destPath);
          copiedCount++;
        } else {
          console.error(`Source file not found: ${sourcePath}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error copying ${image.filename}:`, error.message);
        errorCount++;
      }
    });
  });
  
  return { copiedCount, errorCount };
}

function generateImageMappingFile(categorizedImages) {
  const mappingContent = `// Auto-generated image mapping from organize-k53-images.js
export interface ImageAsset {
  filename: string;
  path: string;
  id: string;
  description?: string;
  context?: readonly string[];
  difficulty?: "basic" | "intermediate" | "advanced";
}

export const imageMapping = {
${Object.entries(categorizedImages).map(([category, images]) => {
  if (images.length === 0) return `  "${category}": [],`;
  
  return `  "${category}": [
${images.map(image => {
  const id = image.filename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-');
  const description = generateDescription(image);
  const context = generateContext(image);
  const difficulty = determineDifficulty(image);
  
  return `    {
      "filename": "${image.filename}",
      "path": "${image.newPath}",
      "id": "${id}",
      "description": "${description}",
      "context": ${JSON.stringify(context)},
      "difficulty": "${difficulty}"
    }`;
}).join(',\n')}
  ],`;
}).join('\n')}
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

export const getQuestionImage = (
  question: {
    category: "controls" | "signs" | "rules";
    question: string;
  }
): ImageAsset | null => {
  if (!question || !question.question) {
    return getRandomImageByCategory(question?.category || "controls");
  }
  
  const questionText = question.question.toLowerCase();
  const context: string[] = [];
  
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
`;

  fs.writeFileSync(
    path.join(__dirname, '../client/data/imageMapping.ts'),
    mappingContent
  );
}

function generateDescription(image) {
  const filename = image.filename.toLowerCase();
  
  if (filename.includes('sadc_road_sign')) {
    return `South African road sign - ${image.filename.replace(/120px-SADC_road_sign_/, '').replace(/\.(png|jpg|svg)$/, '')}`;
  }
  if (filename.includes('sa_road')) {
    return `South African road marker - ${image.filename.replace(/120px-SA_road_/, '').replace(/\.(png|jpg|svg)$/, '')}`;
  }
  if (filename.includes('emergency')) {
    return 'Emergency services information';
  }
  if (filename.includes('tollroad')) {
    return 'Toll road information';
  }
  if (filename.includes('museum')) {
    return 'Historical landmark';
  }
  if (filename.includes('church')) {
    return 'Religious landmark';
  }
  if (filename.includes('beach')) {
    return 'Coastal area';
  }
  
  return `K53 driving content - ${image.filename.replace(/120px-/, '').replace(/\.(png|jpg|svg)$/, '')}`;
}

function generateContext(image) {
  const filename = image.filename.toLowerCase();
  const context = [];
  
  if (filename.includes('regulatory') || /R\d+/.test(image.filename)) {
    context.push('regulatory');
  }
  if (filename.includes('warning') || /W\d+/.test(image.filename)) {
    context.push('warning');
  }
  if (filename.includes('information') || /IN\d+/.test(image.filename)) {
    context.push('information');
  }
  if (filename.includes('tourism')) {
    context.push('tourism');
  }
  if (filename.includes('emergency')) {
    context.push('emergency');
  }
  if (filename.includes('highway') || /M\d+/.test(image.filename)) {
    context.push('highway');
  }
  if (filename.includes('intersection')) {
    context.push('intersection');
  }
  if (filename.includes('school')) {
    context.push('school-zone');
  }
  if (filename.includes('pedestrian')) {
    context.push('pedestrian');
  }
  
  return context.length > 0 ? context : ['general'];
}

function determineDifficulty(image) {
  const filename = image.filename.toLowerCase();
  
  if (filename.includes('basic') || filename.includes('simple')) {
    return 'basic';
  }
  if (filename.includes('advanced') || filename.includes('complex')) {
    return 'advanced';
  }
  
  // Default based on category
  if (image.category === 'signs') {
    return 'basic';
  }
  if (image.category === 'scenarios') {
    return 'intermediate';
  }
  
  return 'basic';
}

function main() {
  console.log('Starting K53 image organization...');
  
  // Create directories
  console.log('Creating category directories...');
  createDirectories();
  
  // Categorize images
  console.log('Categorizing images...');
  const categorizedImages = generateImageMapping();
  
  // Display statistics
  console.log('\nImage categorization results:');
  Object.entries(categorizedImages).forEach(([category, images]) => {
    console.log(`  ${category}: ${images.length} images`);
  });
  
  // Copy images to organized directories
  console.log('\nCopying images to organized directories...');
  const { copiedCount, errorCount } = copyImages(categorizedImages);
  console.log(`  Copied: ${copiedCount} images`);
  console.log(`  Errors: ${errorCount} images`);
  
  // Generate updated image mapping
  console.log('\nGenerating updated image mapping...');
  generateImageMappingFile(categorizedImages);
  
  console.log('\nImage organization complete!');
  console.log('\nNext steps:');
  console.log('1. Review the generated imageMapping.ts file');
  console.log('2. Test image display in the application');
  console.log('3. Consider implementing additional image features');
}

if (require.main === module) {
  main();
}

module.exports = {
  categorizeImage,
  generateImageMapping,
  createDirectories,
  copyImages,
  generateImageMappingFile
}; 