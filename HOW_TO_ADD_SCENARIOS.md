# How to Add Scenarios to K53 Database
## Complete Guide for Scenario Development and Database Integration

### Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Scenario Structure](#scenario-structure)
4. [Database Schema](#database-schema)
5. [Adding Scenarios Step-by-Step](#adding-scenarios-step-by-step)
6. [Best Practices](#best-practices)
7. [Quality Assurance](#quality-assurance)
8. [Troubleshooting](#troubleshooting)
9. [Examples](#examples)
10. [Related Documentation](#related-documentation)

---

## Overview

This guide explains how to add new scenarios to the K53 database. The system uses Supabase as the backend database, and scenarios are added directly to the database rather than local files.

### Key Principles
- **Direct Database Integration**: Scenarios are added directly to Supabase
- **Unique Identifiers**: Each scenario must have a unique ID
- **South African Context**: All scenarios should be tailored to SA driving conditions
- **No Duplicates**: Avoid creating duplicate scenarios
- **Quality Standards**: Maintain high educational value and accuracy

---

## Prerequisites

### Required Tools
- **Node.js**: Version 16 or higher
- **Supabase Account**: Access to your project
- **Service Role Key**: For database write access
- **Code Editor**: VS Code or similar

### Required Files
- `.env` file with Supabase credentials
- `package.json` with required dependencies

### Dependencies
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "dotenv": "^16.x.x"
}
```

---

## Scenario Structure

### Required Fields
```typescript
interface K53Scenario {
  id: string;                    // Unique identifier (e.g., "SC_001")
  category: string;              // "controls", "rules", "signs"
  title: string;                 // Descriptive title
  scenario: string;              // Detailed scenario description
  question: string;              // Multiple choice question
  options: string[];             // Array of 4 answer options
  correct: number;               // Index of correct answer (0-3)
  explanation: string;           // Detailed explanation of correct answer
  difficulty: string;            // "basic", "intermediate", "advanced"
  context: string;               // "urban", "highway", "rural", "coastal", "mountain"
  time_of_day: string;           // "morning", "afternoon", "evening", "night"
  weather: string;               // "clear", "rain", "fog", "wind", "snow"
  language: string;              // "en" for English
  location: {                    // Location object
    specificity: string;         // "city", "region", "national"
    region: string;              // Province name
    city?: string;               // City name (if applicable)
    highway?: string;            // Highway name (if applicable)
    landmark?: string;           // Landmark name (if applicable)
    area?: string;               // Area description (if applicable)
  };
}
```

### Optional Fields
- `created_at`: Automatically set by database
- `updated_at`: Automatically set by database

---

## Database Schema

### Table: `public.scenarios`
```sql
CREATE TABLE public.scenarios (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  scenario TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  context TEXT NOT NULL,
  time_of_day TEXT NOT NULL,
  weather TEXT NOT NULL,
  language TEXT NOT NULL,
  location JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Indexes
- Primary key on `id`
- Indexes on `category`, `difficulty`, `context`, `language`

---

## Adding Scenarios Step-by-Step

### Step 1: Create a New Script File

Create a new JavaScript file (e.g., `add-new-scenarios.js`):

```javascript
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const SERVICE_ROLE_KEY = 'your-service-role-key-here';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  SERVICE_ROLE_KEY
);
```

### Step 2: Define Your Scenarios

Create an array of scenario objects:

```javascript
const newScenarios = [
  {
    id: "SC_NEW001",
    category: "controls",
    title: "Your Scenario Title",
    scenario: "Detailed scenario description...",
    question: "What should you do in this situation?",
    options: [
      "Option A",
      "Option B", 
      "Option C",
      "Option D"
    ],
    correct: 1, // Index of correct answer
    explanation: "Detailed explanation of why this is correct...",
    difficulty: "intermediate",
    context: "urban",
    time_of_day: "afternoon",
    weather: "clear",
    language: "en",
    location: {
      specificity: "city",
      region: "Gauteng",
      city: "Johannesburg"
    }
  }
  // Add more scenarios...
];
```

### Step 3: Create the Add Function

```javascript
async function addScenarios() {
  try {
    console.log('🚀 Adding New Scenarios to Database...\n');
    
    console.log(`📊 Total scenarios to add: ${newScenarios.length}\n`);

    // Add scenarios in batches
    const batchSize = 10;
    let successCount = 0;

    for (let i = 0; i < newScenarios.length; i += batchSize) {
      const batch = newScenarios.slice(i, i + batchSize);
      
      console.log(`📦 Adding batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(newScenarios.length / batchSize)}...`);
      
      const { data, error } = await supabase
        .from('scenarios')
        .insert(batch);

      if (error) {
        console.log(`❌ Error adding batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        
        // Try adding scenarios one by one to identify the problematic one
        for (const scenario of batch) {
          const { error: singleError } = await supabase
            .from('scenarios')
            .insert([scenario]);
          
          if (singleError) {
            console.log(`❌ Failed to add ${scenario.id}:`, singleError.message);
          } else {
            successCount++;
            console.log(`✅ Added ${scenario.id}`);
          }
        }
      } else {
        successCount += batch.length;
        console.log(`✅ Successfully added batch ${Math.floor(i / batchSize) + 1} (${batch.length} scenarios)`);
      }
    }

    console.log(`\n🎉 Scenarios Added Successfully!`);
    console.log(`✅ Total scenarios added: ${successCount}`);

    // Verify the count
    const { count, error: countError } = await supabase
      .from('scenarios')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.log('❌ Error counting scenarios:', countError.message);
    } else {
      console.log(`📊 Total scenarios in database: ${count}`);
      console.log(`📈 Scenarios added in this session: ${successCount}`);
    }

  } catch (error) {
    console.error('❌ Failed to add scenarios:', error.message);
  }
}

// Run the script
addScenarios();
```

### Step 4: Run the Script

```bash
node add-new-scenarios.js
```

---

## Best Practices

### 1. Scenario ID Naming Convention
- **Format**: `SC_[CATEGORY][NUMBER]`
- **Examples**: 
  - `SC_TECH001` (Technology scenarios)
  - `SC_EMG001` (Emergency scenarios)
  - `SC_ACC001` (Accessibility scenarios)
  - `SC_ECO001` (Eco-driving scenarios)
  - `SC_WEA001` (Weather scenarios)

### 2. Content Guidelines
- **Realistic**: Base scenarios on real South African driving situations
- **Educational**: Focus on learning outcomes and safety
- **Clear**: Use simple, understandable language
- **Specific**: Include specific locations and conditions
- **Balanced**: Provide 4 distinct answer options

### 3. Location Guidelines
- **Cities**: Use major South African cities (Johannesburg, Cape Town, Durban, Pretoria)
- **Suburbs**: Use specific suburb names (Sandton, Sea Point, Hatfield, Umhlanga) - see SOUTH_AFRICAN_LOCATIONS_GUIDE.md
- **Regions**: Include provinces and specific areas
- **Highways**: Reference major highways (N1, N2, N3, etc.)
- **Landmarks**: Include famous locations (Chapman's Peak, Long Tom Pass)

### 4. Difficulty Levels
- **Basic**: Fundamental driving concepts, clear right/wrong answers
- **Intermediate**: More complex situations, multiple factors to consider
- **Advanced**: Complex scenarios with multiple variables and nuanced decisions

### 5. Categories
- **Controls**: Vehicle operation, handling, and control
- **Rules**: Traffic laws, regulations, and legal requirements
- **Signs**: Road signs, signals, and markings

### 6. Contexts
- **Urban**: City driving, traffic lights, pedestrians
- **Highway**: Freeway driving, merging, high speeds
- **Rural**: Country roads, agricultural areas
- **Coastal**: Beach areas, coastal roads
- **Mountain**: Mountain passes, elevation changes

---

## Quality Assurance

### 1. Pre-Validation Checklist
- [ ] Unique scenario ID
- [ ] All required fields present
- [ ] Correct answer index (0-3)
- [ ] 4 distinct answer options
- [ ] South African context
- [ ] Realistic scenario
- [ ] Clear explanation
- [ ] Appropriate difficulty level

### 2. Content Review
- **Accuracy**: Verify driving rules and procedures
- **Clarity**: Ensure scenarios are easy to understand
- **Relevance**: Confirm scenarios are relevant to K53 test
- **Safety**: Emphasize safety in all scenarios

### 3. Testing
- **Database Integration**: Test adding scenarios to database
- **Application Testing**: Verify scenarios appear in the app
- **User Testing**: Get feedback from actual users

---

## Troubleshooting

### Common Issues

#### 1. Duplicate Key Error
```
Error: duplicate key value violates unique constraint "scenarios_pkey"
```
**Solution**: Check for existing scenario IDs and use unique identifiers.

#### 2. Missing Environment Variables
```
Error: supabaseUrl is required
```
**Solution**: Ensure `.env` file contains `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

#### 3. Permission Denied
```
Error: permission denied for table scenarios
```
**Solution**: Use the service role key for write access to the database.

#### 4. Invalid JSON
```
Error: invalid input syntax for type jsonb
```
**Solution**: Ensure `options` and `location` fields are valid JSON objects.

### Debugging Steps

1. **Check Environment Variables**:
   ```javascript
   console.log('URL:', process.env.VITE_SUPABASE_URL);
   console.log('Key:', process.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set');
   ```

2. **Test Database Connection**:
   ```javascript
   const { data, error } = await supabase
     .from('scenarios')
     .select('count', { count: 'exact', head: true });
   
   if (error) {
     console.log('Connection error:', error);
   } else {
     console.log('Connected successfully');
   }
   ```

3. **Validate Scenario Structure**:
   ```javascript
   function validateScenario(scenario) {
     const required = ['id', 'category', 'title', 'scenario', 'question', 'options', 'correct', 'explanation', 'difficulty', 'context', 'time_of_day', 'weather', 'language', 'location'];
     
     for (const field of required) {
       if (!scenario[field]) {
         console.log(`Missing field: ${field}`);
         return false;
       }
     }
     
     if (scenario.correct < 0 || scenario.correct > 3) {
       console.log('Invalid correct answer index');
       return false;
     }
     
     if (scenario.options.length !== 4) {
       console.log('Must have exactly 4 options');
       return false;
     }
     
     return true;
   }
   ```

---

## Examples

### Example 1: Technology Scenario
```javascript
{
  id: "SC_TECH001",
  category: "controls",
  title: "Lane Departure Warning on N1 Highway",
  scenario: "You're driving on the N1 highway near Johannesburg when your vehicle's lane departure warning system activates. The system detects that your vehicle is drifting toward the lane marking.",
  question: "What should you do when your lane departure warning system activates?",
  options: [
    "Ignore the warning and continue driving",
    "Check your position and correct your steering if needed",
    "Speed up to get through the lane quickly",
    "Turn off the lane departure warning system"
  ],
  correct: 1,
  explanation: "When your lane departure warning system activates, check your position and correct your steering if needed. The system is designed to alert you to unintentional lane departures.",
  difficulty: "intermediate",
  context: "highway",
  time_of_day: "afternoon",
  weather: "clear",
  language: "en",
  location: {
    specificity: "city",
    region: "Gauteng",
    city: "Johannesburg"
  }
}
```

### Example 2: Emergency Scenario
```javascript
{
  id: "SC_EMG001",
  category: "rules",
  title: "Medical Emergency on Chapman's Peak",
  scenario: "You're driving on Chapman's Peak Drive near Cape Town when you experience chest pain and shortness of breath. You suspect you may be having a heart attack.",
  question: "What should you do if you experience chest pain while driving?",
  options: [
    "Continue driving to the nearest hospital",
    "Pull over safely, stop the vehicle, and call emergency services",
    "Speed up to reach help quickly",
    "Ignore the symptoms and continue driving"
  ],
  correct: 1,
  explanation: "If you experience chest pain while driving, pull over safely, stop the vehicle, and call emergency services. Continuing to drive could endanger yourself and others.",
  difficulty: "advanced",
  context: "mountain",
  time_of_day: "afternoon",
  weather: "clear",
  language: "en",
  location: {
    specificity: "region",
    region: "Western Cape",
    landmark: "Chapman's Peak"
  }
}
```

### Example 3: Weather Scenario
```javascript
{
  id: "SC_WEA001",
  category: "controls",
  title: "Valley Fog on Long Tom Pass",
  scenario: "You're driving on Long Tom Pass in Mpumalanga when you encounter thick valley fog. Visibility is reduced to less than 50 meters and the road surface is wet from the fog.",
  question: "What should you do when driving through thick valley fog?",
  options: [
    "Continue driving at normal speed with high beams",
    "Reduce speed, use low beams, and increase following distance",
    "Speed up to get through the fog quickly",
    "Turn off all lights to avoid reflection"
  ],
  correct: 1,
  explanation: "When driving through thick valley fog, reduce speed, use low beams, and increase following distance. High beams can reflect off fog and reduce visibility further.",
  difficulty: "advanced",
  context: "mountain",
  time_of_day: "morning",
  weather: "fog",
  language: "en",
  location: {
    specificity: "region",
    region: "Mpumalanga",
    landmark: "Long Tom Pass"
  }
}
```

---

## Summary

This guide provides everything you need to add new scenarios to the K53 database:

1. **Follow the structure** outlined in the Scenario Structure section
2. **Use the template** provided in the Examples section
3. **Run the script** to add scenarios to the database
4. **Follow best practices** for quality and consistency
5. **Test thoroughly** to ensure everything works correctly

Remember: All scenarios should be educational, realistic, and specifically tailored to South African driving conditions and the K53 learner's license test requirements.

---

## Related Documentation

### Essential Guides
- **[SOUTH_AFRICAN_LOCATIONS_GUIDE.md](./SOUTH_AFRICAN_LOCATIONS_GUIDE.md)**: Comprehensive guide to using proper suburb names and locations
- **[RESET_SCENARIOS_ROADMAP.md](./RESET_SCENARIOS_ROADMAP.md)**: Current roadmap and implementation status

### Key Resources
- **Suburb Database**: Complete list of South African suburbs with characteristics
- **Traffic Patterns**: Area-specific traffic conditions and safety considerations
- **Geographic Context**: How to match scenarios to appropriate locations

### Best Practices Summary
1. **Use specific suburb names** instead of generic city references
2. **Match scenario context** to area characteristics (business, residential, student, industrial)
3. **Consider traffic patterns** appropriate for the location
4. **Include relevant landmarks** when they enhance the scenario
5. **Maintain geographic diversity** across all scenario categories

---

*For questions or issues, refer to the troubleshooting section or contact the development team.* 