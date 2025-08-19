import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// Function to create a question with the correct database structure
function createQuestion(category, questionText, options, correctAnswer, explanation) {
  return {
    id: uuidv4(),
    category,
    question_text: questionText,
    question_type: "multiple_choice",
    difficulty: "basic",
    options,
    correct_answer: correctAnswer.toString(),
    explanation,
    image_url: null,
    tags: null,
    is_active: true
  };
}

// Official questions extracted from the K53 manual
const officialQuestions = [
  // REGULATORY SIGNS QUESTIONS (from page 20-25)
  createQuestion(
    "signs",
    "How should you respond to a 4-way Stop sign?",
    [
      "Stop and proceed if you feel it is safe to do so",
      "Stop and proceed only when every vehicle that has stopped at a Stop line in the intersection before you has proceeded through the intersection",
      "Stop and then proceed as soon as you can",
      "Stop and wait for traffic lights"
    ],
    1,
    "Stop and proceed only when every vehicle that has stopped at a Stop line in the intersection before you has proceeded through the intersection. This applies also to a 3-way stop. Do not proceed unless it is safe to do so."
  ),
  createQuestion(
    "signs",
    "Which statement is correct in respect of a Yield sign?",
    [
      "There is a dangerous hazard beyond the sign",
      "You must give way to pedestrians and cross-traffic at the intersection",
      "You have right of way",
      "You must stop completely"
    ],
    1,
    "You must give way to pedestrians and cross-traffic at the intersection. You must yield right of way at the sign or marking to all traffic already on the road that you are approaching."
  ),
  createQuestion(
    "signs",
    "Which statement is correct in respect of a Stop/Yield sign?",
    [
      "You may proceed if turning left, but must yield to traffic and pedestrians as necessary",
      "If not turning left, you must stop",
      "Both of these",
      "Neither of these"
    ],
    2,
    "Both of these. If you intend proceeding straight ahead, stop as for a Stop sign. If you intend turning left at the intersection, you may do so without stopping but you must yield right of way to traffic approaching from the right, and to any pedestrians crossing in front of you."
  ),

  // WARNING SIGNS QUESTIONS (from page 30-35)
  createQuestion(
    "signs",
    "What is the meaning of a T-junction warning sign?",
    [
      "The road you are on ends ahead and you will have to turn sharply to the left or right, depending on the angle of the junction",
      "There is a dead-end ahead",
      "You have right of way to the left",
      "There is a roundabout ahead"
    ],
    0,
    "The road you are on ends ahead and you will have to turn sharply to the left or right, depending on the angle of the junction. This sign warns of a skew T-junction in the road ahead where the driver will have to make a sharp turn to the left or right."
  ),
  createQuestion(
    "signs",
    "How should a driver react to a T-junction warning sign?",
    [
      "Reduce speed",
      "Look out for a Stop or Yield sign",
      "Both of these",
      "Speed up to get through quickly"
    ],
    2,
    "Both of these. This sign warns of a T-junction in the road ahead where the driver will have to make a sharp turn to the left or right. Look out for and obey any regulatory signs displayed in conjunction with this sign."
  ),

  // RULES OF THE ROAD QUESTIONS (from page 64-67)
  createQuestion(
    "rules",
    "What is the correct sequence to follow when applying the technique of defensive driving?",
    [
      "Search, Predict, Identify, Decide, Execute",
      "Predict, Identify, Search, Decide, Execute", 
      "Neither of these",
      "Decide, Execute, Search, Predict, Identify"
    ],
    2,
    "Neither of these. The correct application of the defensive driving sequence is: Search: Look out for hazards on the road. Identify: Identify the type of hazard. Predict: Consider how the hazard may affect you. Decide: Choose a safe reaction. Execute: Perform the action/s you have decided."
  ),
  createQuestion(
    "rules",
    "The process of defensive driving consists of three groups of actions. Which group can be left out if you are not going to apply the brakes or change gear?",
    [
      "Observe, blind spots, signal",
      "Blind spot, steer, accelerate", 
      "Mirrors, brakes, gears",
      "All groups are always required"
    ],
    2,
    "Mirrors, Brakes, Gears. If you are not going to change speed, it is not necessary to look in the mirror, or to apply the brakes, or to change gear. Remember, though: mirrors must be checked every 5 to 8 seconds on a straight road and before every hazard."
  ),
  createQuestion(
    "rules",
    "When driving a motor vehicle in traffic under normal weather and road conditions, what gap should be maintained behind the vehicle ahead of you?",
    [
      "Enough for you to stop without swerving",
      "Enough to avoid bumping the vehicle ahead",
      "If you can swerve and pass the vehicle ahead",
      "At least 2 seconds following distance"
    ],
    0,
    "Enough for you to stop without swerving. You need enough clear space so that if the vehicle ahead should stop suddenly, you should be able to stop safely behind it without swerving."
  ),
  createQuestion(
    "rules",
    "What is the general speed limit on roads in South Africa?",
    [
      "60 km/h on roads in an urban area",
      "100 km/h on roads outside an urban area",
      "Both of these",
      "120 km/h on all roads"
    ],
    2,
    "Both of these. The general speed limits in South Africa are 60 km/h on roads in urban areas, 100 km/h on roads in rural areas and 120 km/h on freeways. Goods vehicles over 9 000 kg are limited to 80 km/h on roads in rural areas and freeways."
  ),
  createQuestion(
    "rules",
    "What must you do if you plan to change direction, reduce speed or stop?",
    [
      "Indicate your intention",
      "Keep left",
      "Both of these",
      "Sound your horn"
    ],
    0,
    "Indicate your intention. You must use the vehicle indicators or brake lights to warn other road users of your intention to slow down, stop, or turn. You must indicate in good time and for long enough to warn other road users of your intention."
  ),

  // VEHICLE CONTROLS QUESTIONS (from manual)
  createQuestion(
    "controls",
    "Which control is used to change direction or turn?",
    [
      "Steering wheel",
      "Gear lever", 
      "Brake pedal",
      "Accelerator pedal"
    ],
    0,
    "The steering wheel is used to change direction or turn the vehicle. It should be held in the ten to two or quarter to three position with palms and thumbs on the circumference."
  ),
  createQuestion(
    "controls",
    "Which control does a vehicle with automatic transmission not have?",
    [
      "Clutch pedal",
      "Brake pedal",
      "Accelerator pedal", 
      "Steering wheel"
    ],
    0,
    "A vehicle with automatic transmission does not have a clutch pedal. The transmission automatically handles gear changes, so manual clutch operation is not required."
  ),
  createQuestion(
    "controls",
    "Which control prevents a parked vehicle from moving?",
    [
      "Handbrake/Parking brake",
      "Brake pedal",
      "Clutch pedal",
      "Gear lever"
    ],
    0,
    "The handbrake or parking brake prevents a parked vehicle from moving. It should be applied when the vehicle is parked or stopped for any length of time, or where there is a possibility of rolling."
  ),
  createQuestion(
    "controls",
    "Which controls are used to select a gear?",
    [
      "Clutch pedal and gear lever",
      "Brake pedal and gear lever",
      "Accelerator pedal and gear lever",
      "Steering wheel and gear lever"
    ],
    0,
    "The clutch pedal and gear lever are used together to select a gear. The clutch pedal disengages the engine from the transmission, allowing you to change gears smoothly."
  ),
  createQuestion(
    "controls",
    "Which control is used to accelerate?",
    [
      "Accelerator pedal",
      "Brake pedal",
      "Clutch pedal",
      "Gear lever"
    ],
    0,
    "The accelerator pedal is used to increase the speed of the vehicle. It controls the amount of fuel and air entering the engine, which determines the vehicle's speed."
  ),
  createQuestion(
    "controls",
    "Which control is used to stop the vehicle?",
    [
      "Brake pedal",
      "Clutch pedal",
      "Accelerator pedal",
      "Gear lever"
    ],
    0,
    "The brake pedal is used to stop the vehicle. It should be applied timeously, smoothly and progressively to bring the vehicle to a controlled stop."
  ),
  createQuestion(
    "controls",
    "Which controls are used to make a sharp turn to the left or right?",
    [
      "Steering wheel, brake pedal, clutch pedal, gear lever, and accelerator pedal",
      "Steering wheel only",
      "Brake pedal and steering wheel only",
      "All vehicle controls"
    ],
    0,
    "To make a sharp turn, you need to use the steering wheel to change direction, brake pedal to reduce speed, clutch pedal and gear lever to select appropriate gear, and accelerator pedal to maintain control."
  )
];

// Function to check for existing questions to avoid duplicates
async function checkExistingQuestions() {
  try {
    const { data: existingQuestions, error } = await supabase
      .from('questions')
      .select('id, question_text');

    if (error) throw error;

    console.log(`Found ${existingQuestions.length} existing questions in database`);
    
    // Create a set of existing question IDs for quick lookup
    const existingIds = new Set(existingQuestions.map(q => q.id));
    const existingQuestionTexts = new Set(existingQuestions.map(q => q.question_text.toLowerCase().trim()));

    return { existingIds, existingQuestionTexts };
  } catch (error) {
    console.error('Error checking existing questions:', error);
    return { existingIds: new Set(), existingQuestionTexts: new Set() };
  }
}

// Function to add official questions to database
async function addOfficialQuestions() {
  try {
    console.log('Starting official questions extraction...');
    
    const { existingIds, existingQuestionTexts } = await checkExistingQuestions();
    
    // Filter out duplicates
    const newQuestions = officialQuestions.filter(question => {
      // Check if ID already exists
      if (existingIds.has(question.id)) {
        console.log(`Skipping duplicate ID: ${question.id}`);
        return false;
      }
      
      // Check if question text already exists (case-insensitive)
      if (existingQuestionTexts.has(question.question_text.toLowerCase().trim())) {
        console.log(`Skipping duplicate question: ${question.question_text.substring(0, 50)}...`);
        return false;
      }
      
      return true;
    });

    console.log(`Found ${newQuestions.length} new questions to add (out of ${officialQuestions.length} total)`);

    if (newQuestions.length === 0) {
      console.log('No new questions to add. All questions already exist in database.');
      return;
    }

    // Add questions to database
    const { data, error } = await supabase
      .from('questions')
      .insert(newQuestions);

    if (error) {
      console.error('Error adding questions:', error);
      return;
    }

    console.log(`Successfully added ${newQuestions.length} official questions to database`);
    
    // Log summary by category
    const categoryCount = newQuestions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {});

    console.log('Questions added by category:', categoryCount);

  } catch (error) {
    console.error('Error in addOfficialQuestions:', error);
  }
}

// Function to get database statistics
async function getDatabaseStats() {
  try {
    const { data: questions, error: questionsError } = await supabase
      .from('questions')
      .select('category');

    if (questionsError) throw questionsError;

    const categoryCount = questions.reduce((acc, q) => {
      acc[q.category] = (acc[q.category] || 0) + 1;
      return acc;
    }, {});

    console.log('\n=== DATABASE STATISTICS ===');
    console.log(`Total questions: ${questions.length}`);
    console.log('Questions by category:', categoryCount);
    console.log('===========================\n');

  } catch (error) {
    console.error('Error getting database stats:', error);
  }
}

// Main execution
async function main() {
  console.log('=== K53 Official Questions Extraction ===');
  
  await addOfficialQuestions();
  await getDatabaseStats();
  
  console.log('Extraction process completed!');
}

// Run the script
main().catch(console.error); 