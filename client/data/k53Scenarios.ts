interface K53Scenario {
  id: string;
  category: "controls" | "signs" | "rules" | "mixed";
  title: string;
  scenario: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: "basic" | "intermediate" | "advanced";
  context: string; // e.g., "urban", "rural", "freeway", "residential"
  timeOfDay?: "morning" | "afternoon" | "evening" | "night";
  weather?: "clear" | "rain" | "fog" | "wind";
  language: "en" | "af" | "zu";
}

export const k53ScenarioBank: K53Scenario[] = [
  // VEHICLE CONTROLS SCENARIOS
  {
    id: "SC001",
    category: "controls",
    title: "Hill Start Challenge",
    scenario: "You're stopped at a traffic light on a steep uphill slope in Cape Town. There's a taxi very close behind you. The light turns green and you need to move forward without rolling backward.",
    question: "What is the correct procedure to prevent rolling backward when starting on a hill?",
    options: [
      "Quickly release the clutch and accelerate hard",
      "Use the handbrake to hold the car while finding the clutch bite point",
      "Rev the engine high before releasing the clutch",
      "Ask passengers to get out to reduce weight"
    ],
    correct: 1,
    explanation: "Use the handbrake to hold the vehicle while you find the clutch bite point, then gradually release the handbrake as you feel the car wanting to move forward. This prevents rolling backward.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC002",
    category: "controls",
    title: "Emergency Brake Situation",
    scenario: "You're driving on the N1 freeway at 120km/h when suddenly a child runs onto the road 50 meters ahead. You need to stop as quickly as possible without losing control.",
    question: "What is the correct emergency braking technique?",
    options: [
      "Slam on the brakes as hard as possible",
      "Apply firm, steady pressure while steering straight",
      "Pump the brakes rapidly",
      "Swerve first, then brake"
    ],
    correct: 1,
    explanation: "Apply firm, steady pressure to the brake pedal while keeping the steering wheel straight. Modern cars have ABS which prevents wheel lock-up. Swerving while braking can cause loss of control.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC003",
    category: "controls",
    title: "Parking Maneuver",
    scenario: "You need to parallel park your car in a tight space in Sandton City. There are expensive cars parked in front and behind the space you want to use.",
    question: "What's the safest approach for parallel parking in a tight space?",
    options: [
      "Drive in quickly to avoid holding up traffic",
      "Use your mirrors and reverse slowly, checking constantly",
      "Ask someone to guide you from outside",
      "Look for an easier parking space"
    ],
    correct: 1,
    explanation: "Use your mirrors constantly and reverse very slowly, being prepared to stop immediately. Take your time - other drivers will wait. Check your mirrors and blind spots continuously.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC004",
    category: "controls",
    title: "Wet Weather Driving",
    scenario: "It's raining heavily in Durban and you're driving on a wet road. You feel your car starting to slide slightly when you go around a corner.",
    question: "What should you do when you feel your car sliding on a wet road?",
    options: [
      "Brake hard to regain control",
      "Accelerate to power through the slide",
      "Ease off the accelerator and steer in the direction you want to go",
      "Pull the handbrake"
    ],
    correct: 2,
    explanation: "Ease off the accelerator (don't brake suddenly) and steer gently in the direction you want the car to go. Sudden inputs can make the slide worse.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "evening",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC005",
    category: "controls",
    title: "Mirror Adjustment",
    scenario: "You've just gotten into your friend's car to drive to Johannesburg. The seat and mirrors are adjusted for someone much taller than you.",
    question: "In what order should you adjust the controls before driving?",
    options: [
      "Mirrors first, then seat position",
      "Seat position first, then mirrors and steering wheel",
      "Start driving and adjust while moving",
      "Only adjust if you can't see properly"
    ],
    correct: 1,
    explanation: "Always adjust the seat position first so you can reach all controls comfortably, then adjust mirrors and steering wheel. Never adjust while driving.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },

  // ROAD SIGNS SCENARIOS  
  {
    id: "SC006",
    category: "signs",
    title: "Confusing Sign Sequence",
    scenario: "You're driving through Stellenbosch when you see a 'No Entry' sign, but traffic seems to be flowing through. Local drivers are ignoring the sign and you're confused about whether it applies to you.",
    question: "What should you do when you see a 'No Entry' sign that others seem to be ignoring?",
    options: [
      "Follow the other drivers - they know the local rules",
      "Obey the sign regardless of what others are doing",
      "Stop and ask another driver",
      "Call the traffic department for clarification"
    ],
    correct: 1,
    explanation: "Always obey traffic signs regardless of what other drivers are doing. The sign is legally binding and you could be fined or cause an accident by ignoring it.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC007",
    category: "signs",
    title: "School Zone Rush",
    scenario: "You're running late for work and driving through a school zone in Pretoria at 8:15 AM. The speed limit sign shows 30km/h but you're used to driving 60km/h on this road outside school hours.",
    question: "What is the legal requirement when driving through a school zone during school hours?",
    options: [
      "You can drive 60km/h if school hasn't started yet",
      "Must drive at 30km/h and give way to all pedestrians",
      "Only slow down if you see children",
      "School zones only apply to school buses"
    ],
    correct: 1,
    explanation: "School zone speed limits are strictly enforced during specified hours (usually 7-9 AM and 2-4 PM). You must drive at 30km/h and pedestrians have right of way.",
    difficulty: "basic",
    context: "residential",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC008",
    category: "signs",
    title: "Yield vs Stop Confusion",
    scenario: "You approach an intersection in Port Elizabeth where there's a YIELD sign for your direction, but you can't see any traffic coming due to buildings blocking your view.",
    question: "What should you do at a YIELD sign when visibility is limited?",
    options: [
      "Proceed slowly since it's only a yield sign",
      "Treat it as a STOP sign and come to a complete halt",
      "Sound your horn and proceed",
      "Speed up to get through quickly"
    ],
    correct: 1,
    explanation: "When visibility is limited at a YIELD sign, treat it as a STOP sign. Come to a complete stop until you can see clearly that it's safe to proceed.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC009",
    category: "signs",
    title: "Construction Zone Navigation",
    scenario: "You're driving on the N2 near East London where road construction has changed the normal traffic pattern. Temporary signs show a detour route that contradicts your GPS navigation.",
    question: "When temporary road signs contradict your GPS, what should you do?",
    options: [
      "Follow your GPS - it's more up to date",
      "Follow the temporary road signs",
      "Stop and ask construction workers",
      "Turn around and find another route"
    ],
    correct: 1,
    explanation: "Always follow official temporary road signs over GPS navigation. Construction signs reflect current, real-time road conditions that GPS may not have updated.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC010",
    category: "signs",
    title: "Wildlife Crossing",
    scenario: "You're driving through the Kruger Park area at dusk when you see a 'Wild Animals Crossing' warning sign. You haven't seen any animals yet but the road ahead curves into thick bush.",
    question: "How should you respond to wildlife crossing warning signs?",
    options: [
      "Only slow down if you actually see animals",
      "Reduce speed immediately and stay alert",
      "Sound your horn to scare animals away",
      "Speed up to get through the area quickly"
    ],
    correct: 1,
    explanation: "Reduce speed immediately when you see wildlife warning signs. Animals can appear suddenly, especially at dawn and dusk. Be prepared to stop.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },

  // TRAFFIC RULES SCENARIOS
  {
    id: "SC011",
    category: "rules",
    title: "Four-Way Stop Confusion",
    scenario: "You arrive at a four-way stop in Bloemfontein at exactly the same time as three other vehicles - one to your left, one to your right, and one opposite you wanting to turn left.",
    question: "When four vehicles arrive simultaneously at a four-way stop, who has right of way?",
    options: [
      "The largest vehicle goes first",
      "Yield to traffic on your right, then proceed",
      "The vehicle going straight has right of way over turning vehicles",
      "Honk your horn and go first"
    ],
    correct: 1,
    explanation: "When vehicles arrive simultaneously, yield to traffic on your right. If all arrive at the same time, drivers should make eye contact and proceed one at a time safely.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC012",
    category: "rules",
    title: "Taxi Loading Zone",
    scenario: "You're driving in downtown Johannesburg when a taxi stops suddenly in front of you to pick up passengers. There's no official taxi rank, but taxis regularly stop here.",
    question: "What's the correct response when a taxi stops suddenly to load passengers?",
    options: [
      "Honk and try to overtake immediately",
      "Flash your lights and tailgate to make them move",
      "Maintain safe following distance and wait patiently",
      "Call the traffic police"
    ],
    correct: 2,
    explanation: "Maintain a safe following distance and be patient. Taxis have the right to stop for passengers at designated areas. Aggressive driving increases accident risk.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC013",
    category: "rules",
    title: "Overtaking Dilemma",
    scenario: "You're stuck behind a slow-moving truck on a single-lane road near Kimberley. There's a broken yellow line allowing overtaking, but oncoming traffic is intermittent.",
    question: "When is it safe to overtake on a road with a broken yellow line?",
    options: [
      "Anytime there's a broken yellow line",
      "Only when you can see the road is clear for at least 200 meters ahead",
      "When the vehicle ahead is going less than 80km/h",
      "During daytime only"
    ],
    correct: 1,
    explanation: "You may only overtake when you can see the road is clear for sufficient distance to complete the maneuver safely - typically at least 200 meters depending on speed.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC014",
    category: "rules",
    title: "Cell Phone Emergency",
    scenario: "While driving in Polokwane, you receive what appears to be an urgent call from your child's school. You don't have a hands-free device in the car.",
    question: "What should you do when you receive an urgent call while driving without hands-free equipment?",
    options: [
      "Answer quickly and keep the call short",
      "Pull over safely and stop before answering",
      "Let it go to voicemail - no exceptions",
      "Answer but put it on speaker phone"
    ],
    correct: 1,
    explanation: "Pull over safely and stop the vehicle before using a handheld phone. Using a handheld device while driving is illegal and dangerous, even for emergencies.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC015",
    category: "rules",
    title: "Blood Alcohol Uncertainty",
    scenario: "You had two beers at a restaurant in Hermanus three hours ago. You feel fine, but you're not sure if you're under the legal limit. You need to drive home.",
    question: "What's the safest approach when uncertain about blood alcohol levels?",
    options: [
      "Drive slowly and carefully",
      "Wait another hour to be safe",
      "Find alternative transport - don't risk it",
      "Have some coffee first to sober up"
    ],
    correct: 2,
    explanation: "Never drive when uncertain about blood alcohol levels. Alcohol affects judgment and reaction time. Use alternative transport like Uber, taxi, or designated driver.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },

  // MIXED SCENARIOS
  {
    id: "SC016",
    category: "mixed",
    title: "Rainy Night Emergency",
    scenario: "It's 11 PM and raining heavily near George. Your car breaks down on a curve where visibility is poor. You have an emergency triangle but nowhere safe to walk to place it.",
    question: "What's the safest procedure when broken down in a dangerous location at night?",
    options: [
      "Try to push the car to safety yourself",
      "Turn on hazard lights, stay in the car, and call for help",
      "Walk along the road looking for help",
      "Try to flag down passing vehicles"
    ],
    correct: 1,
    explanation: "Turn on hazard lights and stay in the vehicle where you're safest. Call for professional help. Don't walk on a busy road at night in poor weather - it's extremely dangerous.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "night",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC017",
    category: "mixed",
    title: "Load Shedding Traffic Lights",
    scenario: "You approach a major intersection in Midrand during load shedding. The traffic lights are not working and there's heavy traffic from all directions with no traffic officer present.",
    question: "How should you proceed through an intersection with non-functioning traffic lights?",
    options: [
      "Treat it as a four-way stop",
      "The main road has right of way",
      "Largest vehicles go first",
      "Follow the car in front"
    ],
    correct: 0,
    explanation: "When traffic lights are not working, treat the intersection as a four-way stop. Come to a complete stop and yield to vehicles that arrived before you.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC018",
    category: "mixed",
    title: "Pedestrian Right of Way",
    scenario: "You're turning left at a green light in Cape Town CBD when pedestrians start crossing against the red pedestrian signal. They're blocking your turn.",
    question: "What should you do when pedestrians cross against their signal while you have a green light?",
    options: [
      "Honk to make them move faster",
      "Proceed slowly - you have right of way",
      "Wait for pedestrians to clear, regardless of signals",
      "Drive around them"
    ],
    correct: 2,
    explanation: "Always yield to pedestrians, even when they're crossing illegally. Pedestrian safety takes priority over traffic flow. Wait patiently for them to clear.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC019",
    category: "mixed",
    title: "Aggressive Driver Encounter",
    scenario: "On the M1 in Johannesburg, another driver is tailgating you aggressively, flashing lights and hooting because you're doing the speed limit in the right lane.",
    question: "How should you handle an aggressive driver behind you?",
    options: [
      "Speed up to get away from them",
      "Brake suddenly to teach them a lesson",
      "Move to the left lane safely when possible",
      "Stop and confront them"
    ],
    correct: 2,
    explanation: "Move to the left lane safely when possible to let aggressive drivers pass. Don't engage or retaliate - this escalates road rage situations. Stay calm and drive defensively.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC020",
    category: "mixed",
    title: "Elderly Driver Situation",
    scenario: "You're behind an elderly driver in Knysna who is driving very slowly (40km/h in a 60km/h zone) and seems uncertain. Other drivers are getting impatient.",
    question: "What's the appropriate response when following a slow, uncertain driver?",
    options: [
      "Follow closely and honk to encourage them to speed up",
      "Overtake as soon as possible",
      "Maintain safe distance and be patient",
      "Flash your lights to get their attention"
    ],
    correct: 2,
    explanation: "Be patient and maintain a safe following distance. The driver may be dealing with medical issues or lack of confidence. Pressuring them could cause an accident.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC021",
    category: "controls",
    title: "Clutch Control in Traffic",
    scenario: "You're in stop-and-go traffic on the N3 highway near Pietermaritzburg. Your manual car is constantly starting and stopping, and your left leg is getting tired from using the clutch.",
    question: "What's the best clutch technique for heavy stop-and-go traffic?",
    options: [
      "Keep the clutch pedal pressed in while stopped",
      "Put the car in neutral and use the handbrake when stopped",
      "Rest your foot on the clutch pedal",
      "Use first gear only throughout the traffic jam"
    ],
    correct: 1,
    explanation: "Put the car in neutral and apply the handbrake when stopped for more than a few seconds. This prevents clutch wear and reduces fatigue. Don't rest your foot on the clutch pedal.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC022",
    category: "signs",
    title: "Speed Camera Warning",
    scenario: "You're driving on the R21 near OR Tambo Airport when you see a speed camera warning sign. You check your speedometer and realize you're going 140km/h in a 120km/h zone.",
    question: "What should you do when you see a speed camera warning sign while exceeding the limit?",
    options: [
      "Brake hard immediately to slow down before the camera",
      "Gradually reduce speed to the legal limit",
      "Maintain current speed - the warning means no camera yet",
      "Speed up to get past the camera quickly"
    ],
    correct: 1,
    explanation: "Gradually reduce speed to the legal limit. Sudden braking can cause accidents. The warning sign means speed cameras are in the area, possibly ahead.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC023",
    category: "rules",
    title: "Parking Time Limit",
    scenario: "You park your car in a 2-hour parking zone in Sandton at 10 AM for a meeting. Your meeting runs long and it's now 12:30 PM. You can see your car from the building.",
    question: "What should you do when you've exceeded a parking time limit?",
    options: [
      "Stay in the meeting - traffic officers rarely check",
      "Ask someone else to move your car",
      "Quickly go move your car to reset the time limit",
      "Pay the fine later if you get one"
    ],
    correct: 2,
    explanation: "Go move your car immediately. Parking violations result in fines, and in some areas, clamping or towing. Don't risk it or ask others to drive your car illegally.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC024",
    category: "mixed",
    title: "Tire Blowout on Highway",
    scenario: "You're driving at 110km/h on the N1 near Beaufort West when your front right tire suddenly blows out. The car starts pulling to the right.",
    question: "What's the correct response to a tire blowout at highway speed?",
    options: [
      "Brake hard and steer left to compensate",
      "Grip the steering wheel firmly, ease off accelerator, brake gently when controlled",
      "Turn on hazard lights and continue to the next exit",
      "Pull the handbrake to stop quickly"
    ],
    correct: 1,
    explanation: "Grip the steering wheel firmly, ease off the accelerator gradually, and only brake gently once you have control. Sudden braking or steering can cause loss of control.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC025",
    category: "rules",
    title: "Funeral Procession",
    scenario: "You encounter a funeral procession on the R102 near Durban. The lead car has a 'FUNERAL' sign and hazard lights on, followed by about 20 cars also with hazard lights.",
    question: "What are your legal obligations when encountering a funeral procession?",
    options: [
      "You can overtake if there's a safe gap",
      "Pull over and stop until the entire procession passes",
      "Follow behind the procession",
      "Treat it like normal traffic"
    ],
    correct: 1,
    explanation: "You must pull over and allow the entire funeral procession to pass. It's both a legal requirement and a mark of respect. Do not break into the procession.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  }
];

// Function to get scenarios by category
export const getScenariosByCategory = (
  category: "controls" | "signs" | "rules" | "mixed",
): K53Scenario[] => {
  return k53ScenarioBank.filter((s) => s.category === category);
};

// Function to get scenarios by difficulty
export const getScenariosByDifficulty = (
  difficulty: "basic" | "intermediate" | "advanced",
): K53Scenario[] => {
  return k53ScenarioBank.filter((s) => s.difficulty === difficulty);
};

// Function to get scenarios by context
export const getScenariosByContext = (
  context: string,
): K53Scenario[] => {
  return k53ScenarioBank.filter((s) => s.context === context);
};

// Function to generate a random scenario test
export const generateRandomScenarioTest = (
  count: number = 10,
  difficulty?: "basic" | "intermediate" | "advanced",
  category?: "controls" | "signs" | "rules" | "mixed"
): K53Scenario[] => {
  let scenarios = k53ScenarioBank;
  
  if (difficulty) {
    scenarios = scenarios.filter((s) => s.difficulty === difficulty);
  }
  
  if (category) {
    scenarios = scenarios.filter((s) => s.category === category);
  }
  
  return scenarios
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
};

export type { K53Scenario };
