interface K53Question {
  id: string;
  category: "controls" | "signs" | "rules";
  question: string;
  image?: string;
  options: string[];
  correct: number;
  explanation: string;
  language: "en" | "af" | "zu";
}

export const k53QuestionBank: K53Question[] = [
  // VEHICLE CONTROLS QUESTIONS
  {
    id: "C001",
    category: "controls",
    question: "What is the primary function of the clutch pedal?",
    options: [
      "To increase speed",
      "To disengage the engine for gear changes",
      "To apply the brakes",
      "To steer the vehicle"
    ],
    correct: 1,
    explanation: "The clutch pedal is used to disengage the engine from the transmission, allowing you to change gears smoothly.",
    language: "en"
  },
  {
    id: "C002",
    category: "controls",
    question: "What should you do with the parking brake when stopping for any length of time?",
    options: [
      "Leave it off to save fuel",
      "Only apply it on hills",
      "Apply it to keep the vehicle stationary",
      "Use it only at night"
    ],
    correct: 2,
    explanation: "The parking brake should be applied when the vehicle is parked or stopped for any length of time, or where there is a possibility of rolling.",
    language: "en"
  },
  {
    id: "C003",
    category: "controls",
    question: "How often should you check your mirrors while driving?",
    options: [
      "Only when changing lanes",
      "Every 5 to 8 seconds",
      "Once every minute",
      "Only when turning"
    ],
    correct: 1,
    explanation: "You should check the rear-view mirror(s) every 5 to 8 seconds to maintain awareness of your surroundings.",
    language: "en"
  },
  {
    id: "C004",
    category: "controls",
    question: "When should you use your indicators?",
    options: [
      "Only when turning right",
      "Only in heavy traffic",
      "When turning, changing lanes, or pulling over",
      "Only on freeways"
    ],
    correct: 2,
    explanation: "You must indicate your intention to change direction, reduce speed or stop. Use indicators when turning, changing lanes, or pulling over.",
    language: "en"
  },
  {
    id: "C005",
    category: "controls",
    question: "What is the correct hand position on the steering wheel?",
    options: [
      "12 and 6 o'clock",
      "10 and 2 o'clock or quarter to 3",
      "11 and 1 o'clock",
      "9 and 3 o'clock only"
    ],
    correct: 1,
    explanation: "Position your hands on the steering wheel in the ten to two or quarter to three position with palms and thumbs on the circumference.",
    language: "en"
  },
  {
    id: "C006",
    category: "controls",
    question: "When should you apply the service brake?",
    options: [
      "Only in emergencies",
      "Timeously, smoothly and progressively",
      "As hard as possible every time",
      "Only when the parking brake fails"
    ],
    correct: 1,
    explanation: "The service/footbrake should be applied timeously, smoothly and progressively using the right foot, without locking the wheels.",
    language: "en"
  },
  {
    id: "C007",
    category: "controls",
    question: "What should you do before changing gear?",
    options: [
      "Sound the horn",
      "Check mirrors",
      "Depress the clutch completely",
      "Apply the parking brake"
    ],
    correct: 2,
    explanation: "Before changing gear, you must depress (pull in) the clutch pedal (lever) completely to disengage the engine.",
    language: "en"
  },
  {
    id: "C008",
    category: "controls",
    question: "When leaving your vehicle unattended, what must you do?",
    options: [
      "Leave the engine running",
      "Set the parking brake",
      "Leave the doors unlocked",
      "Keep the lights on"
    ],
    correct: 1,
    explanation: "You may not leave the vehicle unattended without setting the parking brake or using alternative methods to prevent the vehicle from moving.",
    language: "en"
  },

  // ROAD SIGNS QUESTIONS
  {
    id: "S001",
    category: "signs",
    question: "What does a red circle with a white horizontal bar mean?",
    options: [
      "No entry for all vehicles",
      "No parking",
      "No overtaking",
      "Stop and give way"
    ],
    correct: 0,
    explanation: "A red circle with a white horizontal bar is a 'No Entry' sign, prohibiting all vehicles from entering this road at any time.",
    language: "en"
  },
  {
    id: "S002",
    category: "signs",
    question: "What does a triangular sign with a red border indicate?",
    options: [
      "Information",
      "Warning of potential hazards ahead",
      "Prohibition",
      "Mandatory action"
    ],
    correct: 1,
    explanation: "Triangular signs with red borders are warning signs that alert drivers to potential hazards or changes in road conditions ahead.",
    language: "en"
  },
  {
    id: "S003",
    category: "signs",
    question: "What does a blue circular sign indicate?",
    options: [
      "Prohibition",
      "Warning",
      "Mandatory action or command",
      "Information only"
    ],
    correct: 2,
    explanation: "Blue circular signs are command signs that specify an action that must be taken or indicate a roadway that certain vehicles may use.",
    language: "en"
  },
  {
    id: "S004",
    category: "signs",
    question: "What does a STOP sign require you to do?",
    options: [
      "Slow down and proceed",
      "Give way to other traffic",
      "Come to a complete halt",
      "Sound your horn"
    ],
    correct: 2,
    explanation: "Come to a complete halt in line with the stop sign, or before the stop line. Remain stationary and move only when it is safe to do so.",
    language: "en"
  },
  {
    id: "S005",
    category: "signs",
    question: "What does a YIELD sign mean?",
    options: [
      "Stop completely",
      "Give way to other traffic that has right of way",
      "Proceed without stopping",
      "Turn around"
    ],
    correct: 1,
    explanation: "A yield sign means you must give way to other traffic that has right of way, including pedestrians crossing or waiting to cross your path.",
    language: "en"
  },
  {
    id: "S006",
    category: "signs",
    question: "What do white disc-shaped signs with red borders indicate?",
    options: [
      "Commands",
      "Warnings",
      "Prohibitions",
      "Information"
    ],
    correct: 2,
    explanation: "White disc-shaped signs with red borders are prohibition signs that tell you what you may not do or which class of road user may not use a particular roadway.",
    language: "en"
  },
  {
    id: "S007",
    category: "signs",
    question: "What does a red cross over a road sign indicate?",
    options: [
      "Danger ahead",
      "Medical emergency",
      "End of restriction",
      "Religious site"
    ],
    correct: 2,
    explanation: "A red cross over a road sign indicates that a restriction, command or set of regulations no longer applies (de-restriction sign).",
    language: "en"
  },
  {
    id: "S008",
    category: "signs",
    question: "What does a traffic circle sign indicate?",
    options: [
      "Turn right only",
      "Traffic circle ahead (mini circle or roundabout)",
      "No turning allowed",
      "Intersection ahead"
    ],
    correct: 1,
    explanation: "This sign indicates a traffic circle ahead (mini circle or roundabout) where you must proceed in the direction shown.",
    language: "en"
  },
  {
    id: "S009",
    category: "signs",
    question: "What does a pedestrian crossing sign warn you about?",
    options: [
      "School zone ahead",
      "Marked pedestrian crossing ahead",
      "No pedestrians allowed",
      "Bus stop ahead"
    ],
    correct: 1,
    explanation: "This warning sign indicates a marked pedestrian crossing ahead where you must give way to pedestrians crossing or about to cross.",
    language: "en"
  },
  {
    id: "S010",
    category: "signs",
    question: "What does a speed limit sign of 60 km/h mean?",
    options: [
      "Minimum speed required",
      "Maximum speed allowed",
      "Recommended speed only",
      "Speed for trucks only"
    ],
    correct: 1,
    explanation: "Speed limit signs indicate the maximum speed allowed on that section of road, in this case 60 km/h.",
    language: "en"
  },
  {
    id: "S011",
    category: "signs",
    question: "What should you do when you see a steep downhill warning sign?",
    options: [
      "Speed up",
      "Change to a lower gear if necessary",
      "Turn on hazard lights",
      "Stop immediately"
    ],
    correct: 1,
    explanation: "When you see a steep downhill warning sign, change to a lower gear if necessary to help control your speed going downhill.",
    language: "en"
  },
  {
    id: "S012",
    category: "signs",
    question: "What does a 'No Overtaking' sign prohibit?",
    options: [
      "Changing lanes",
      "Overtaking vehicles for the specified distance",
      "Stopping",
      "Turning"
    ],
    correct: 1,
    explanation: "A 'No Overtaking' sign prohibits overtaking vehicles for the next specified distance (e.g., 500m).",
    language: "en"
  },
  {
    id: "S013",
    category: "signs",
    question: "What does a tunnel ahead sign require you to do?",
    options: [
      "Stop before entering",
      "Switch on headlights and don't overtake",
      "Sound your horn",
      "Reduce speed to 40 km/h"
    ],
    correct: 1,
    explanation: "When you see a tunnel ahead sign, switch your headlights on and don't overtake while in the tunnel.",
    language: "en"
  },
  {
    id: "S014",
    category: "signs",
    question: "What does a 'Children Ahead' warning sign mean?",
    options: [
      "School bus stop",
      "Playground nearby",
      "Children may be crossing or playing near the road",
      "Speed limit 30 km/h"
    ],
    correct: 2,
    explanation: "A 'Children Ahead' warning sign alerts you that children may be crossing or playing near the road, so drive with extra caution.",
    language: "en"
  },

  // RULES OF THE ROAD QUESTIONS
  {
    id: "R001",
    category: "rules",
    question: "What is the maximum speed limit in a built-up area unless otherwise indicated?",
    options: [
      "40 km/h",
      "50 km/h",
      "60 km/h",
      "80 km/h"
    ],
    correct: 2,
    explanation: "The general speed limit in built-up areas (cities and towns) is 60 km/h unless otherwise indicated by road signs.",
    language: "en"
  },
  {
    id: "R002",
    category: "rules",
    question: "What is the recommended safe following distance for a light motor vehicle?",
    options: [
      "1 second",
      "2 seconds minimum",
      "3 seconds recommended",
      "5 seconds"
    ],
    correct: 2,
    explanation: "The recommended safe following time is 3 seconds for a light motor vehicle (2 seconds absolute minimum).",
    language: "en"
  },
  {
    id: "R003",
    category: "rules",
    question: "When are you allowed to overtake on the left?",
    options: [
      "Never",
      "When the vehicle ahead is turning right",
      "Only on one-way roads",
      "Both B and C are correct"
    ],
    correct: 3,
    explanation: "You may overtake on the left when the vehicle ahead is turning right, on one-way roads, or when traffic in your lane is moving faster than the right lane.",
    language: "en"
  },
  {
    id: "R004",
    category: "rules",
    question: "How far from a pedestrian crossing must you not park?",
    options: [
      "3 meters",
      "6 meters",
      "9 meters",
      "12 meters"
    ],
    correct: 2,
    explanation: "You may not park closer than 9 meters from a pedestrian crossing to ensure visibility and safety.",
    language: "en"
  },
  {
    id: "R005",
    category: "rules",
    question: "What is the blood alcohol limit for professional drivers?",
    options: [
      "0.02 grams per 100ml",
      "0.05 grams per 100ml",
      "0.08 grams per 100ml",
      "0.10 grams per 100ml"
    ],
    correct: 0,
    explanation: "Professional drivers must not exceed 0.02 grams per 100ml of blood alcohol content (0.05 grams for regular drivers).",
    language: "en"
  },
  {
    id: "R006",
    category: "rules",
    question: "When must you use headlights?",
    options: [
      "Only at night",
      "Between sunset and sunrise",
      "When visibility is poor due to weather",
      "Both B and C are correct"
    ],
    correct: 3,
    explanation: "Headlights must be used between sunset and sunrise and when visibility is poor due to weather conditions.",
    language: "en"
  },
  {
    id: "R007",
    category: "rules",
    question: "How far must you place an emergency triangle behind your broken-down vehicle?",
    options: [
      "25 meters",
      "45 meters",
      "60 meters",
      "100 meters"
    ],
    correct: 1,
    explanation: "Emergency triangles must be displayed at least 45 meters from the rear of the vehicle on a public road.",
    language: "en"
  },
  {
    id: "R008",
    category: "rules",
    question: "What is the maximum speed on a freeway for light vehicles?",
    options: [
      "100 km/h",
      "120 km/h",
      "140 km/h",
      "No limit"
    ],
    correct: 1,
    explanation: "The maximum speed limit on freeways for light vehicles is 120 km/h unless otherwise indicated.",
    language: "en"
  },
  {
    id: "R009",
    category: "rules",
    question: "When turning right, where should you position your vehicle?",
    options: [
      "In the left lane",
      "As close as possible to the centre of the road",
      "In any available lane",
      "On the shoulder"
    ],
    correct: 1,
    explanation: "Before turning right, position the vehicle as close as possible to the centre of the road while keeping to the left of the centre line.",
    language: "en"
  },
  {
    id: "R010",
    category: "rules",
    question: "What should you do at a four-way stop?",
    options: [
      "The first vehicle to arrive has right of way",
      "Turn right has right of way",
      "Yield to vehicles on your right",
      "Sound your horn and proceed"
    ],
    correct: 0,
    explanation: "At a four-way stop, yield to pedestrians and vehicles that arrived at the intersection before you. If vehicles arrive simultaneously, yield to the right.",
    language: "en"
  },
  {
    id: "R011",
    category: "rules",
    question: "How close to an intersection can you park?",
    options: [
      "Right up to the corner",
      "3 meters away",
      "5 meters away",
      "10 meters away"
    ],
    correct: 2,
    explanation: "You may not park closer than 5 meters from an intersection to ensure visibility and traffic flow.",
    language: "en"
  },
  {
    id: "R012",
    category: "rules",
    question: "What is the minimum tyre tread depth required?",
    options: [
      "0.5mm",
      "1mm across the entire width and circumference",
      "2mm",
      "3mm"
    ],
    correct: 1,
    explanation: "The tread pattern must be clearly visible and have a depth of not less than 1mm across the tyre's entire width and circumference.",
    language: "en"
  },
  {
    id: "R013",
    category: "rules",
    question: "When should you wear a seatbelt?",
    options: [
      "Only on freeways",
      "Only when driving fast",
      "At all times when in a moving vehicle",
      "Only in the front seat"
    ],
    correct: 2,
    explanation: "Seatbelts are compulsory to wear at all times when in a moving vehicle, for all occupants.",
    language: "en"
  },
  {
    id: "R014",
    category: "rules",
    question: "What should you do when being overtaken?",
    options: [
      "Speed up",
      "Move safely to the left and don't accelerate",
      "Change lanes",
      "Apply brakes"
    ],
    correct: 1,
    explanation: "When being overtaken, move over safely to the left to allow the other vehicle to pass, and do not accelerate until the other vehicle has passed.",
    language: "en"
  },
  {
    id: "R015",
    category: "rules",
    question: "What is the speed limit in a residential area?",
    options: [
      "40 km/h",
      "50 km/h",
      "60 km/h unless otherwise indicated",
      "30 km/h maximum"
    ],
    correct: 3,
    explanation: "In a residential area, you may not exceed 30 km/h and must give way to all pedestrians as they have right of way.",
    language: "en"
  },
  {
    id: "R016",
    category: "rules",
    question: "How long before turning should you indicate?",
    options: [
      "Immediately before turning",
      "In good time, but not too early to confuse other road users",
      "Exactly 5 seconds before",
      "Only when other vehicles are present"
    ],
    correct: 1,
    explanation: "You should indicate in good time before turning, changing lanes, or stopping, but not too early where this could create confusion for other road users.",
    language: "en"
  },
  {
    id: "R017",
    category: "rules",
    question: "What should you do if your vehicle breaks down on a freeway?",
    options: [
      "Stop in the right lane",
      "Continue driving slowly",
      "Stop only in an emergency or designated stopping area",
      "Stop anywhere on the left"
    ],
    correct: 2,
    explanation: "Stopping a vehicle on a freeway is prohibited, except in the event of an emergency or in a designated stopping area.",
    language: "en"
  },
  {
    id: "R018",
    category: "rules",
    question: "What is the legal requirement for motorcycle riders?",
    options: [
      "Only license required",
      "Must wear a protective helmet",
      "Must have insurance",
      "Must be over 21"
    ],
    correct: 1,
    explanation: "You may not ride a motorcycle or be a passenger on a motorcycle on a public road unless a protective helmet is worn.",
    language: "en"
  },
  {
    id: "R019",
    category: "rules",
    question: "When can vehicles travel in convoy?",
    options: [
      "Anytime",
      "Only on weekdays",
      "Not over weekends, long weekends and holidays from 6pm until 6am",
      "Only with special permission"
    ],
    correct: 2,
    explanation: "Vehicles may not travel in convoy over weekends, long weekends and holidays from 6pm the night before until 6am the morning after.",
    language: "en"
  },
  {
    id: "R020",
    category: "rules",
    question: "What should you do in the event of an accident?",
    options: [
      "Leave the scene immediately",
      "Stop immediately and check for injuries",
      "Continue driving if no one is hurt",
      "Only stop if your vehicle is damaged"
    ],
    correct: 1,
    explanation: "In the event of an accident, stop the vehicle immediately, check for injuries, provide assistance where possible, and report to police within 24 hours.",
    language: "en"
  },

  // TRAFFIC LIGHT QUESTIONS
  {
    id: "T001",
    category: "rules",
    question: "What should you do when approaching a traffic light that changes from green to amber?",
    options: [
      "Speed up to get through",
      "Stop if it's safe to do so",
      "Continue at the same speed",
      "Sound your horn"
    ],
    correct: 1,
    explanation: "When a traffic light changes from green to amber, you should stop if it's safe to do so. Only proceed if stopping would be dangerous.",
    language: "en"
  },
  {
    id: "T002",
    category: "rules",
    question: "What does a steady red traffic light mean?",
    options: [
      "Proceed with caution",
      "Stop completely and wait for green",
      "Yield to oncoming traffic",
      "Turn right only"
    ],
    correct: 1,
    explanation: "A steady red light means stop completely behind the stop line and wait for the light to change to green before proceeding.",
    language: "en"
  },
  {
    id: "T003",
    category: "rules",
    question: "What does a green arrow at a traffic light indicate?",
    options: [
      "Proceed in any direction",
      "Proceed only in the direction of the arrow",
      "Yield to pedestrians",
      "Stop and wait"
    ],
    correct: 1,
    explanation: "A green arrow indicates that you may proceed only in the direction of the arrow, but you must still give way to pedestrians and vehicles lawfully in the intersection.",
    language: "en"
  },
  {
    id: "T004",
    category: "rules",
    question: "What does a flashing red traffic light mean?",
    options: [
      "Proceed with caution",
      "Treat as a stop sign",
      "Speed up",
      "Turn right only"
    ],
    correct: 1,
    explanation: "A flashing red light should be treated as a stop sign - come to a complete stop and proceed only when safe.",
    language: "en"
  }
];

// Function to get questions by category
export const getQuestionsByCategory = (category: "controls" | "signs" | "rules"): K53Question[] => {
  return k53QuestionBank.filter(q => q.category === category);
};

// Function to get a random selection of questions for a test
export const generateRandomTest = (
  controlsCount: number = 8,
  signsCount: number = 28, 
  rulesCount: number = 28
): K53Question[] => {
  const controlsQuestions = getQuestionsByCategory("controls").sort(() => Math.random() - 0.5).slice(0, controlsCount);
  const signsQuestions = getQuestionsByCategory("signs").sort(() => Math.random() - 0.5).slice(0, signsCount);
  const rulesQuestions = getQuestionsByCategory("rules").sort(() => Math.random() - 0.5).slice(0, rulesCount);
  
  return [...controlsQuestions, ...signsQuestions, ...rulesQuestions].sort(() => Math.random() - 0.5);
};

export type { K53Question };
