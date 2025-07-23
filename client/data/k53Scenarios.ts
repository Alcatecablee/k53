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
  weather?: "clear" | "rain" | "fog" | "wind" | "snow";
  language: "en" | "af" | "zu";
}

export const k53ScenarioBank: K53Scenario[] = [
  // VEHICLE CONTROLS SCENARIOS
  {
    id: "SC001",
    category: "controls",
    title: "Hill Start Challenge",
    scenario:
      "You're stopped at a traffic light on a steep uphill slope in Cape Town. There's a taxi very close behind you. The light turns green and you need to move forward without rolling backward.",
    question:
      "What is the correct procedure to prevent rolling backward when starting on a hill?",
    options: [
      "Quickly release the clutch and accelerate hard",
      "Use the handbrake to hold the car while finding the clutch bite point",
      "Rev the engine high before releasing the clutch",
      "Ask passengers to get out to reduce weight",
    ],
    correct: 1,
    explanation:
      "Use the handbrake to hold the vehicle while you find the clutch bite point, then gradually release the handbrake as you feel the car wanting to move forward. This prevents rolling backward.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC002",
    category: "controls",
    title: "Emergency Brake Situation",
    scenario:
      "You're driving on the N1 freeway at 120km/h when suddenly a child runs onto the road 50 meters ahead. You need to stop as quickly as possible without losing control.",
    question: "What is the correct emergency braking technique?",
    options: [
      "Slam on the brakes as hard as possible",
      "Apply firm, steady pressure while steering straight",
      "Pump the brakes rapidly",
      "Swerve first, then brake",
    ],
    correct: 1,
    explanation:
      "Apply firm, steady pressure to the brake pedal while keeping the steering wheel straight. Modern cars have ABS which prevents wheel lock-up. Swerving while braking can cause loss of control.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC003",
    category: "controls",
    title: "Parking Maneuver",
    scenario:
      "You need to parallel park your car in a tight space in Sandton City. There are expensive cars parked in front and behind the space you want to use.",
    question:
      "What's the safest approach for parallel parking in a tight space?",
    options: [
      "Drive in quickly to avoid holding up traffic",
      "Use your mirrors and reverse slowly, checking constantly",
      "Ask someone to guide you from outside",
      "Look for an easier parking space",
    ],
    correct: 1,
    explanation:
      "Use your mirrors constantly and reverse very slowly, being prepared to stop immediately. Take your time - other drivers will wait. Check your mirrors and blind spots continuously.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC004",
    category: "controls",
    title: "Wet Weather Driving",
    scenario:
      "It's raining heavily in Durban and you're driving on a wet road. You feel your car starting to slide slightly when you go around a corner.",
    question:
      "What should you do when you feel your car sliding on a wet road?",
    options: [
      "Brake hard to regain control",
      "Accelerate to power through the slide",
      "Ease off the accelerator and steer in the direction you want to go",
      "Pull the handbrake",
    ],
    correct: 2,
    explanation:
      "Ease off the accelerator (don't brake suddenly) and steer gently in the direction you want the car to go. Sudden inputs can make the slide worse.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "evening",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC005",
    category: "controls",
    title: "Mirror Adjustment",
    scenario:
      "You've just gotten into your friend's car to drive to Johannesburg. The seat and mirrors are adjusted for someone much taller than you.",
    question: "In what order should you adjust the controls before driving?",
    options: [
      "Mirrors first, then seat position",
      "Seat position first, then mirrors and steering wheel",
      "Start driving and adjust while moving",
      "Only adjust if you can't see properly",
    ],
    correct: 1,
    explanation:
      "Always adjust the seat position first so you can reach all controls comfortably, then adjust mirrors and steering wheel. Never adjust while driving.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },

  // ROAD SIGNS SCENARIOS
  {
    id: "SC006",
    category: "signs",
    title: "Confusing Sign Sequence",
    scenario:
      "You're driving through Stellenbosch when you see a 'No Entry' sign, but traffic seems to be flowing through. Local drivers are ignoring the sign and you're confused about whether it applies to you.",
    question:
      "What should you do when you see a 'No Entry' sign that others seem to be ignoring?",
    options: [
      "Follow the other drivers - they know the local rules",
      "Obey the sign regardless of what others are doing",
      "Stop and ask another driver",
      "Call the traffic department for clarification",
    ],
    correct: 1,
    explanation:
      "Always obey traffic signs regardless of what other drivers are doing. The sign is legally binding and you could be fined or cause an accident by ignoring it.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC007",
    category: "signs",
    title: "School Zone Rush",
    scenario:
      "You're running late for work and driving through a school zone in Pretoria at 8:15 AM. The speed limit sign shows 30km/h but you're used to driving 60km/h on this road outside school hours.",
    question:
      "What is the legal requirement when driving through a school zone during school hours?",
    options: [
      "You can drive 60km/h if school hasn't started yet",
      "Must drive at 30km/h and give way to all pedestrians",
      "Only slow down if you see children",
      "School zones only apply to school buses",
    ],
    correct: 1,
    explanation:
      "School zone speed limits are strictly enforced during specified hours (usually 7-9 AM and 2-4 PM). You must drive at 30km/h and pedestrians have right of way.",
    difficulty: "basic",
    context: "residential",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC008",
    category: "signs",
    title: "Yield vs Stop Confusion",
    scenario:
      "You approach an intersection in Port Elizabeth where there's a YIELD sign for your direction, but you can't see any traffic coming due to buildings blocking your view.",
    question: "What should you do at a YIELD sign when visibility is limited?",
    options: [
      "Proceed slowly since it's only a yield sign",
      "Treat it as a STOP sign and come to a complete halt",
      "Sound your horn and proceed",
      "Speed up to get through quickly",
    ],
    correct: 1,
    explanation:
      "When visibility is limited at a YIELD sign, treat it as a STOP sign. Come to a complete stop until you can see clearly that it's safe to proceed.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC009",
    category: "signs",
    title: "Construction Zone Navigation",
    scenario:
      "You're driving on the N2 near East London where road construction has changed the normal traffic pattern. Temporary signs show a detour route that contradicts your GPS navigation.",
    question:
      "When temporary road signs contradict your GPS, what should you do?",
    options: [
      "Follow your GPS - it's more up to date",
      "Follow the temporary road signs",
      "Stop and ask construction workers",
      "Turn around and find another route",
    ],
    correct: 1,
    explanation:
      "Always follow official temporary road signs over GPS navigation. Construction signs reflect current, real-time road conditions that GPS may not have updated.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC010",
    category: "signs",
    title: "Wildlife Crossing",
    scenario:
      "You're driving through the Kruger Park area at dusk when you see a 'Wild Animals Crossing' warning sign. You haven't seen any animals yet but the road ahead curves into thick bush.",
    question: "How should you respond to wildlife crossing warning signs?",
    options: [
      "Only slow down if you actually see animals",
      "Reduce speed immediately and stay alert",
      "Sound your horn to scare animals away",
      "Speed up to get through the area quickly",
    ],
    correct: 1,
    explanation:
      "Reduce speed immediately when you see wildlife warning signs. Animals can appear suddenly, especially at dawn and dusk. Be prepared to stop.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },

  // TRAFFIC RULES SCENARIOS
  {
    id: "SC011",
    category: "rules",
    title: "Four-Way Stop Confusion",
    scenario:
      "You arrive at a four-way stop in Bloemfontein at exactly the same time as three other vehicles - one to your left, one to your right, and one opposite you wanting to turn left.",
    question:
      "When four vehicles arrive simultaneously at a four-way stop, who has right of way?",
    options: [
      "The largest vehicle goes first",
      "Yield to traffic on your right, then proceed",
      "The vehicle going straight has right of way over turning vehicles",
      "Honk your horn and go first",
    ],
    correct: 1,
    explanation:
      "When vehicles arrive simultaneously, yield to traffic on your right. If all arrive at the same time, drivers should make eye contact and proceed one at a time safely.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC012",
    category: "rules",
    title: "Taxi Loading Zone",
    scenario:
      "You're driving in downtown Johannesburg when a taxi stops suddenly in front of you to pick up passengers. There's no official taxi rank, but taxis regularly stop here.",
    question:
      "What's the correct response when a taxi stops suddenly to load passengers?",
    options: [
      "Honk and try to overtake immediately",
      "Flash your lights and tailgate to make them move",
      "Maintain safe following distance and wait patiently",
      "Call the traffic police",
    ],
    correct: 2,
    explanation:
      "Maintain a safe following distance and be patient. Taxis have the right to stop for passengers at designated areas. Aggressive driving increases accident risk.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC013",
    category: "rules",
    title: "Overtaking Dilemma",
    scenario:
      "You're stuck behind a slow-moving truck on a single-lane road near Kimberley. There's a broken yellow line allowing overtaking, but oncoming traffic is intermittent.",
    question:
      "When is it safe to overtake on a road with a broken yellow line?",
    options: [
      "Anytime there's a broken yellow line",
      "Only when you can see the road is clear for at least 200 meters ahead",
      "When the vehicle ahead is going less than 80km/h",
      "During daytime only",
    ],
    correct: 1,
    explanation:
      "You may only overtake when you can see the road is clear for sufficient distance to complete the maneuver safely - typically at least 200 meters depending on speed.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC014",
    category: "rules",
    title: "Cell Phone Emergency",
    scenario:
      "While driving in Polokwane, you receive what appears to be an urgent call from your child's school. You don't have a hands-free device in the car.",
    question:
      "What should you do when you receive an urgent call while driving without hands-free equipment?",
    options: [
      "Answer quickly and keep the call short",
      "Pull over safely and stop before answering",
      "Let it go to voicemail - no exceptions",
      "Answer but put it on speaker phone",
    ],
    correct: 1,
    explanation:
      "Pull over safely and stop the vehicle before using a handheld phone. Using a handheld device while driving is illegal and dangerous, even for emergencies.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC015",
    category: "rules",
    title: "Blood Alcohol Uncertainty",
    scenario:
      "You had two beers at a restaurant in Hermanus three hours ago. You feel fine, but you're not sure if you're under the legal limit. You need to drive home.",
    question:
      "What's the safest approach when uncertain about blood alcohol levels?",
    options: [
      "Drive slowly and carefully",
      "Wait another hour to be safe",
      "Find alternative transport - don't risk it",
      "Have some coffee first to sober up",
    ],
    correct: 2,
    explanation:
      "Never drive when uncertain about blood alcohol levels. Alcohol affects judgment and reaction time. Use alternative transport like Uber, taxi, or designated driver.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },

  // MIXED SCENARIOS
  {
    id: "SC016",
    category: "mixed",
    title: "Rainy Night Emergency",
    scenario:
      "It's 11 PM and raining heavily near George. Your car breaks down on a curve where visibility is poor. You have an emergency triangle but nowhere safe to walk to place it.",
    question:
      "What's the safest procedure when broken down in a dangerous location at night?",
    options: [
      "Try to push the car to safety yourself",
      "Turn on hazard lights, stay in the car, and call for help",
      "Walk along the road looking for help",
      "Try to flag down passing vehicles",
    ],
    correct: 1,
    explanation:
      "Turn on hazard lights and stay in the vehicle where you're safest. Call for professional help. Don't walk on a busy road at night in poor weather - it's extremely dangerous.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "night",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC017",
    category: "mixed",
    title: "Load Shedding Traffic Lights",
    scenario:
      "You approach a major intersection in Midrand during load shedding. The traffic lights are not working and there's heavy traffic from all directions with no traffic officer present.",
    question:
      "How should you proceed through an intersection with non-functioning traffic lights?",
    options: [
      "Treat it as a four-way stop",
      "The main road has right of way",
      "Largest vehicles go first",
      "Follow the car in front",
    ],
    correct: 0,
    explanation:
      "When traffic lights are not working, treat the intersection as a four-way stop. Come to a complete stop and yield to vehicles that arrived before you.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC018",
    category: "mixed",
    title: "Pedestrian Right of Way",
    scenario:
      "You're turning left at a green light in Cape Town CBD when pedestrians start crossing against the red pedestrian signal. They're blocking your turn.",
    question:
      "What should you do when pedestrians cross against their signal while you have a green light?",
    options: [
      "Honk to make them move faster",
      "Proceed slowly - you have right of way",
      "Wait for pedestrians to clear, regardless of signals",
      "Drive around them",
    ],
    correct: 2,
    explanation:
      "Always yield to pedestrians, even when they're crossing illegally. Pedestrian safety takes priority over traffic flow. Wait patiently for them to clear.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC019",
    category: "mixed",
    title: "Aggressive Driver Encounter",
    scenario:
      "On the M1 in Johannesburg, another driver is tailgating you aggressively, flashing lights and hooting because you're doing the speed limit in the right lane.",
    question: "How should you handle an aggressive driver behind you?",
    options: [
      "Speed up to get away from them",
      "Brake suddenly to teach them a lesson",
      "Move to the left lane safely when possible",
      "Stop and confront them",
    ],
    correct: 2,
    explanation:
      "Move to the left lane safely when possible to let aggressive drivers pass. Don't engage or retaliate - this escalates road rage situations. Stay calm and drive defensively.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC020",
    category: "mixed",
    title: "Elderly Driver Situation",
    scenario:
      "You're behind an elderly driver in Knysna who is driving very slowly (40km/h in a 60km/h zone) and seems uncertain. Other drivers are getting impatient.",
    question:
      "What's the appropriate response when following a slow, uncertain driver?",
    options: [
      "Follow closely and honk to encourage them to speed up",
      "Overtake as soon as possible",
      "Maintain safe distance and be patient",
      "Flash your lights to get their attention",
    ],
    correct: 2,
    explanation:
      "Be patient and maintain a safe following distance. The driver may be dealing with medical issues or lack of confidence. Pressuring them could cause an accident.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC021",
    category: "controls",
    title: "Clutch Control in Traffic",
    scenario:
      "You're in stop-and-go traffic on the N3 highway near Pietermaritzburg. Your manual car is constantly starting and stopping, and your left leg is getting tired from using the clutch.",
    question: "What's the best clutch technique for heavy stop-and-go traffic?",
    options: [
      "Keep the clutch pedal pressed in while stopped",
      "Put the car in neutral and use the handbrake when stopped",
      "Rest your foot on the clutch pedal",
      "Use first gear only throughout the traffic jam",
    ],
    correct: 1,
    explanation:
      "Put the car in neutral and apply the handbrake when stopped for more than a few seconds. This prevents clutch wear and reduces fatigue. Don't rest your foot on the clutch pedal.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC022",
    category: "signs",
    title: "Speed Camera Warning",
    scenario:
      "You're driving on the R21 near OR Tambo Airport when you see a speed camera warning sign. You check your speedometer and realize you're going 140km/h in a 120km/h zone.",
    question:
      "What should you do when you see a speed camera warning sign while exceeding the limit?",
    options: [
      "Brake hard immediately to slow down before the camera",
      "Gradually reduce speed to the legal limit",
      "Maintain current speed - the warning means no camera yet",
      "Speed up to get past the camera quickly",
    ],
    correct: 1,
    explanation:
      "Gradually reduce speed to the legal limit. Sudden braking can cause accidents. The warning sign means speed cameras are in the area, possibly ahead.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC023",
    category: "rules",
    title: "Parking Time Limit",
    scenario:
      "You park your car in a 2-hour parking zone in Sandton at 10 AM for a meeting. Your meeting runs long and it's now 12:30 PM. You can see your car from the building.",
    question: "What should you do when you've exceeded a parking time limit?",
    options: [
      "Stay in the meeting - traffic officers rarely check",
      "Ask someone else to move your car",
      "Quickly go move your car to reset the time limit",
      "Pay the fine later if you get one",
    ],
    correct: 2,
    explanation:
      "Go move your car immediately. Parking violations result in fines, and in some areas, clamping or towing. Don't risk it or ask others to drive your car illegally.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC024",
    category: "mixed",
    title: "Tire Blowout on Highway",
    scenario:
      "You're driving at 110km/h on the N1 near Beaufort West when your front right tire suddenly blows out. The car starts pulling to the right.",
    question: "What's the correct response to a tire blowout at highway speed?",
    options: [
      "Brake hard and steer left to compensate",
      "Grip the steering wheel firmly, ease off accelerator, brake gently when controlled",
      "Turn on hazard lights and continue to the next exit",
      "Pull the handbrake to stop quickly",
    ],
    correct: 1,
    explanation:
      "Grip the steering wheel firmly, ease off the accelerator gradually, and only brake gently once you have control. Sudden braking or steering can cause loss of control.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC025",
    category: "rules",
    title: "Funeral Procession",
    scenario:
      "You encounter a funeral procession on the R102 near Durban. The lead car has a 'FUNERAL' sign and hazard lights on, followed by about 20 cars also with hazard lights.",
    question:
      "What are your legal obligations when encountering a funeral procession?",
    options: [
      "You can overtake if there's a safe gap",
      "Pull over and stop until the entire procession passes",
      "Follow behind the procession",
      "Treat it like normal traffic",
    ],
    correct: 1,
    explanation:
      "You must pull over and allow the entire funeral procession to pass. It's both a legal requirement and a mark of respect. Do not break into the procession.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  // NEW SCENARIOS FROM GROK - URBAN SCENARIOS (SC026-SC040)
  {
    id: "SC026",
    category: "controls",
    title: "Emergency Stop in Sandton During Load Shedding",
    scenario:
      "You're driving on Rivonia Road in Sandton, Johannesburg, at night during load shedding, and the robots are out. A pedestrian suddenly steps into the road in front of you.",
    question: "What should you do in this situation?",
    options: [
      "Hoot and swerve to avoid the pedestrian",
      "Apply the brakes firmly and stop the vehicle",
      "Accelerate to pass the pedestrian quickly",
      "Flash your lights and continue driving",
    ],
    correct: 1,
    explanation:
      "In an emergency, you must apply the brakes firmly to stop the vehicle and avoid a collision. Swerving or accelerating could be dangerous, and hooting or flashing lights won't ensure the pedestrian's safety.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "night",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC027",
    category: "signs",
    title: "Navigating a Temporary Road Sign in Cape Town",
    scenario:
      "You're driving on the M3 near Newlands, Cape Town, when you see a temporary roadworks sign indicating a lane closure ahead. A minibus taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Ignore the sign and maintain your lane",
      "Signal early and merge into the open lane",
      "Stop suddenly to let the taxi pass",
    ],
    correct: 2,
    explanation:
      "A temporary roadworks sign indicates a change in road conditions. You must signal early and merge safely into the open lane while checking for the taxi in your mirrors to avoid a collision.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC028",
    category: "rules",
    title: "Yielding to a Taxi in Soweto",
    scenario:
      "You're approaching a four-way stop in Soweto, Johannesburg, when a minibus taxi from the left speeds through without stopping. You're next in line to proceed.",
    question: "What should you do in this situation?",
    options: [
      "Proceed immediately since you have right of way",
      "Hoot and flash your lights to warn the taxi",
      "Wait to ensure the intersection is clear",
      "Follow the taxi to report it to authorities",
    ],
    correct: 2,
    explanation:
      "Even if you have the right of way, you must ensure the intersection is clear before proceeding. The taxi's actions are unsafe, but prioritizing safety prevents collisions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC029",
    category: "mixed",
    title: "Navigating a Busy Johannesburg CBD Intersection",
    scenario:
      "You're driving on Commissioner Street in Johannesburg's CBD during peak hour. A robot turns red, but a minibus taxi behind you hoots aggressively, and pedestrians are crossing slowly.",
    question: "What should you do in this situation?",
    options: [
      "Move forward to appease the taxi",
      "Stop and wait until the robot turns green",
      "Hoot back at the taxi to assert your position",
      "Wave pedestrians to hurry up",
    ],
    correct: 1,
    explanation:
      "You must stop at a red robot and wait until it turns green, regardless of pressure from other drivers. Moving forward or hooting could endanger pedestrians or violate traffic rules.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC030",
    category: "controls",
    title: "Parallel Parking in Cape Town During a Protest",
    scenario:
      "You're attempting to parallel park on Long Street, Cape Town, when a protest march blocks the road behind you. Your mirrors show a taxi waiting impatiently.",
    question: "What should you do in this situation?",
    options: [
      "Abandon parking and drive away",
      "Continue parking while checking mirrors",
      "Hoot to clear the protesters",
      "Park quickly without checking mirrors",
    ],
    correct: 1,
    explanation:
      "You should continue parking carefully, using your mirrors to monitor the taxi and protesters. Abandoning the maneuver or parking without checking mirrors could be unsafe, and hooting is ineffective.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC031",
    category: "signs",
    title: "Speed Limit Change in Sandton",
    scenario:
      "You're driving on Katherine Street in Sandton, Johannesburg, where the speed limit changes from 60 km/h to 40 km/h near a school zone during school hours.",
    question: "What should you do in this situation?",
    options: [
      "Maintain 60 km/h to keep up with traffic",
      "Reduce speed to 40 km/h immediately",
      "Increase speed to pass the school quickly",
      "Stop and wait for school children to cross",
    ],
    correct: 1,
    explanation:
      "You must obey the new speed limit of 40 km/h in the school zone to ensure safety. Maintaining or increasing speed violates traffic rules, and stopping is unnecessary unless pedestrians are crossing.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC032",
    category: "rules",
    title: "Right of Way at a Midrand Roundabout",
    scenario:
      "You're entering a roundabout on Olifantsfontein Road in Midrand, Johannesburg. A bakkie from the right is approaching quickly, and a taxi is merging from the left.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to enter before the bakkie",
      "Yield to the bakkie and check for the taxi",
      "Hoot to warn both vehicles",
      "Stop in the middle of the roundabout",
    ],
    correct: 1,
    explanation:
      "Vehicles already in the roundabout or approaching from the right have right of way. You must yield to the bakkie and ensure the taxi is not merging unsafely before entering.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC033",
    category: "mixed",
    title: "Hijacking Awareness in Hillbrow",
    scenario:
      "You're driving through Hillbrow, Johannesburg, at night when a suspicious vehicle blocks the road ahead. Your instructor advised you about hijacking risks in this area.",
    question: "What should you do in this situation?",
    options: [
      "Drive around the vehicle quickly",
      "Stop and wait for the vehicle to move",
      "Reverse and find an alternative route",
      "Hoot and flash your lights",
    ],
    correct: 2,
    explanation:
      "In high-risk areas like Hillbrow, reversing and finding an alternative route is the safest option to avoid potential hijacking. Driving around or stopping could expose you to danger.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC034",
    category: "controls",
    title: "Clutch Control in Cape Town Traffic",
    scenario:
      "You're in heavy traffic on Adderley Street, Cape Town, during a music festival. You need to move forward slowly without stalling your manual car.",
    question: "What should you do in this situation?",
    options: [
      "Keep the clutch fully pressed and accelerate",
      "Use clutch control to move slowly",
      "Shift to neutral and coast",
      "Hoot to clear the traffic",
    ],
    correct: 1,
    explanation:
      "In slow-moving traffic, use clutch control by partially releasing the clutch while gently pressing the accelerator to move smoothly without stalling. Other options are unsafe or ineffective.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC035",
    category: "signs",
    title: "Construction Zone in Pretoria",
    scenario:
      "You're driving on the R21 near Pretoria when you see a construction zone sign indicating a reduced speed limit of 60 km/h and a narrow lane ahead.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your current speed",
      "Reduce speed to 60 km/h and stay alert",
      "Overtake slower vehicles to pass quickly",
      "Stop and wait for construction to end",
    ],
    correct: 1,
    explanation:
      "You must reduce your speed to 60 km/h as indicated by the construction zone sign and stay alert for workers or obstacles. Overtaking or maintaining speed is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC036",
    category: "rules",
    title: "Toll Booth Etiquette on the M1",
    scenario:
      "You're approaching a toll booth on the M1 in Johannesburg. The lane you're in is cash-only, but you only have a card, and a taxi is behind you.",
    question: "What should you do in this situation?",
    options: [
      "Stay in the lane and ask the booth operator for help",
      "Switch lanes to an electronic payment booth",
      "Stop and reverse to find another route",
      "Pay with cash from a passenger",
    ],
    correct: 1,
    explanation:
      "You should signal early and switch to an electronic payment lane if you only have a card. Staying in the cash-only lane or reversing is unsafe and inefficient.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC037",
    category: "mixed",
    title: "Braai Traffic in Fourways",
    scenario:
      "You're driving on William Nicol Drive in Fourways, Johannesburg, on a Sunday afternoon during a braai gathering. Traffic is heavy, and a taxi suddenly cuts in front of you.",
    question: "What should you do in this situation?",
    options: [
      "Hoot and tailgate the taxi",
      "Slow down and maintain a safe following distance",
      "Overtake the taxi immediately",
      "Flash your lights to warn other drivers",
    ],
    correct: 1,
    explanation:
      "Slowing down and maintaining a safe following distance prevents a collision with the taxi. Hooting, tailgating, or overtaking in heavy traffic is unsafe.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC038",
    category: "controls",
    title: "Emergency Stop in Bellville",
    scenario:
      "You're driving on Voortrekker Road in Bellville, Cape Town, when a child runs into the road chasing a ball near a busy taxi rank.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously",
    ],
    correct: 1,
    explanation:
      "You must apply the brakes firmly to stop and avoid hitting the child. Swerving or hooting may not prevent a collision, and continuing to drive is dangerous.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC039",
    category: "signs",
    title: "No U-Turn in Rosebank",
    scenario:
      "You're driving on Oxford Road in Rosebank, Johannesburg, and want to turn back toward Sandton. You see a 'No U-Turn' sign ahead.",
    question: "What should you do in this situation?",
    options: [
      "Make a U-turn anyway if traffic is clear",
      "Continue and find the next legal turn",
      "Stop and wait for traffic to clear",
      "Hoot to alert other drivers",
    ],
    correct: 1,
    explanation:
      "A 'No U-Turn' sign prohibits U-turns. You must continue driving and find the next legal turn to avoid breaking traffic rules.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC040",
    category: "rules",
    title: "Pedestrian Crossing in Stellenbosch",
    scenario:
      "You're driving on Bird Street in Stellenbosch, Cape Town, near a university campus. Students are waiting at a pedestrian crossing, but a taxi behind you hoots impatiently.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the crossing",
      "Stop and let the students cross",
      "Hoot back at the taxi",
      "Wave the students to wait",
    ],
    correct: 1,
    explanation:
      "You must stop at a pedestrian crossing to allow pedestrians to cross safely, regardless of pressure from other drivers. Speeding up or waving pedestrians to wait is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  // RURAL/HIGHWAY SCENARIOS (SC041-SC050)
  {
    id: "SC041",
    category: "controls",
    title: "Clutch Control on the N1 Near Polokwane",
    scenario:
      "You're driving a manual bakkie on the N1 near Polokwane in heavy holiday traffic heading to Limpopo. You need to crawl forward on an incline without rolling back.",
    question: "What should you do in this situation?",
    options: [
      "Keep the clutch fully pressed",
      "Use clutch control with the handbrake",
      "Shift to neutral and accelerate",
      "Hoot to clear the traffic",
    ],
    correct: 1,
    explanation:
      "On an incline, use clutch control with the handbrake to prevent rolling back while moving forward slowly. Other options could cause stalling or unsafe movement.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC042",
    category: "signs",
    title: "Animal Crossing on the R71",
    scenario:
      "You're driving on the R71 near Tzaneen, Limpopo, when you see a warning sign for cattle crossing. A herd of cows is visible ahead on the road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Speed up to pass the cows",
      "Slow down and stop if necessary",
      "Continue driving at the same speed",
    ],
    correct: 2,
    explanation:
      "A cattle crossing sign indicates potential animals on the road. You must slow down and stop if necessary to avoid hitting the cows, ensuring safety for both the animals and yourself.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC043",
    category: "rules",
    title: "Overtaking on the N2 Near Knysna",
    scenario:
      "You're on the N2 near Knysna, Western Cape, behind a slow-moving truck. The road is single-lane with a solid line marking.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Wait for a broken line to overtake",
      "Hoot to urge the truck to speed up",
      "Tailgate the truck to pressure it",
    ],
    correct: 1,
    explanation:
      "A solid line prohibits overtaking. You must wait for a broken line where overtaking is allowed, ensuring it's safe to pass the truck.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC044",
    category: "mixed",
    title: "Cash-in-Transit Heist on the N3",
    scenario:
      "You're driving on the N3 near Harrismith, Free State, when you see police lights and a cash-in-transit heist blocking the road ahead. Traffic is slowing down.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the scene quickly",
      "Slow down and follow police instructions",
      "Stop and take photos of the scene",
      "Reverse to find another route",
    ],
    correct: 1,
    explanation:
      "In a dangerous situation like a heist, slow down and follow police instructions to stay safe. Speeding up, stopping for photos, or reversing could be risky.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC045",
    category: "controls",
    title: "Emergency Stop on the R56",
    scenario:
      "You're driving on the R56 near Kokstad, KwaZulu-Natal, when a child on a bicycle suddenly swerves into your lane from a rural dirt road.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously",
    ],
    correct: 1,
    explanation:
      "You must apply the brakes firmly to stop and avoid a collision with the child. Swerving or hooting may not prevent an accident, and continuing to drive is unsafe.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC046",
    category: "signs",
    title: "Speed Bump Warning in Bloemfontein",
    scenario:
      "You're driving on the R30 near Bloemfontein when you see a speed bump warning sign near a rural school. Children are playing nearby.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Slow down and prepare to stop",
      "Hoot to warn the children",
      "Ignore the sign if no children are on the road",
    ],
    correct: 1,
    explanation:
      "A speed bump warning sign indicates a need to slow down, especially near a school. Prepare to stop if children are on or near the road to ensure their safety.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC047",
    category: "rules",
    title: "Right of Way on the R62",
    scenario:
      "You're approaching an unmarked intersection on the R62 near Oudtshoorn, Western Cape. A bakkie is approaching from the right on a gravel road.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the bakkie on the right",
      "Hoot to warn the bakkie",
      "Speed up to cross first",
    ],
    correct: 1,
    explanation:
      "At an unmarked intersection, the vehicle on the right has the right of way. You must yield to the bakkie to avoid a collision.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC048",
    category: "mixed",
    title: "Holiday Traffic on the N2 Near East London",
    scenario:
      "You're driving on the N2 near East London during December holiday traffic. A minibus taxi overtakes recklessly, and you notice a toll booth ahead.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to keep pace with the taxi",
      "Maintain your speed and prepare for the toll",
      "Hoot to warn other drivers",
      "Pull over to let the taxi pass",
    ],
    correct: 1,
    explanation:
      "Maintain your speed and focus on preparing for the toll booth safely. Speeding up or hooting is unnecessary, and pulling over may not be practical in heavy traffic.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC049",
    category: "controls",
    title: "Hill Start on the R43",
    scenario:
      "You're in a manual car on the R43 near Hermanus, Western Cape, stopped on a steep incline behind a slow-moving truck during a whale-watching weekend.",
    question: "What should you do in this situation?",
    options: [
      "Release the clutch quickly to move",
      "Use the handbrake and clutch control",
      "Hoot to urge the truck to move",
      "Shift to neutral and wait",
    ],
    correct: 1,
    explanation:
      "On a steep incline, use the handbrake and clutch control to start moving without rolling back. Other options could cause stalling or unsafe movement.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC050",
    category: "signs",
    title: "No Stopping on the N12",
    scenario:
      "You're driving on the N12 near Kimberley when you see a 'No Stopping' sign. Your passenger asks you to stop to take a photo of the Big Hole.",
    question: "What should you do in this situation?",
    options: [
      "Stop briefly to take the photo",
      "Continue driving and find a safe stopping area",
      "Hoot to signal your intention",
      "Slow down but don't stop",
    ],
    correct: 1,
    explanation:
      "A 'No Stopping' sign prohibits stopping on the road. You must continue driving and find a designated safe area to stop for the photo.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  // WEATHER-RELATED SCENARIOS (SC051-SC075)
  {
    id: "SC051",
    category: "controls",
    title: "Wipers in Heavy Rain on the N1",
    scenario:
      "You're driving on the N1 near Centurion, Pretoria, when heavy rain reduces visibility. Your windshield is getting blurry, and a taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Turn on your wipers and reduce speed",
      "Hoot to warn the taxi",
      "Pull over immediately",
    ],
    correct: 1,
    explanation:
      "In heavy rain, turn on your wipers to improve visibility and reduce speed to maintain control. Speeding up or pulling over suddenly is unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC052",
    category: "signs",
    title: "Slippery Road in Fog on the M5",
    scenario:
      "You're driving on the M5 in Cape Town during thick morning fog. A slippery road sign appears, and you notice wet leaves on the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and increase following distance",
      "Hoot to warn other drivers",
      "Turn on your high beams",
    ],
    correct: 1,
    explanation:
      "A slippery road sign in fog indicates a risk of losing traction. Reduce speed and increase your following distance to maintain control and avoid collisions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC053",
    category: "rules",
    title: "Strong Winds on the N2 Near Port Elizabeth",
    scenario:
      "You're driving on the N2 near Port Elizabeth during strong coastal winds. Your bakkie is swaying, and a truck ahead is struggling to stay in its lane.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Reduce speed and grip the steering wheel firmly",
      "Hoot to warn the truck driver",
      "Pull over and wait for the wind to die down",
    ],
    correct: 1,
    explanation:
      "In strong winds, reduce speed and grip the steering wheel firmly to maintain control. Overtaking or pulling over may be unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC054",
    category: "mixed",
    title: "Rainy Night in Durban's CBD",
    scenario:
      "You're driving on Dr Pixley KaSeme Street in Durban's CBD at night during heavy rain. A robot is out due to load shedding, and a taxi is approaching from the right.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the taxi and check for pedestrians",
      "Hoot to assert your right of way",
      "Speed up to clear the intersection",
    ],
    correct: 1,
    explanation:
      "With a robot out, treat the intersection as a four-way stop. Yield to the taxi on the right and check for pedestrians, especially in poor visibility due to rain.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC055",
    category: "controls",
    title: "Fog Lights on the N3",
    scenario:
      "You're driving on the N3 near Mooi River, KwaZulu-Natal, in dense fog at dawn. Visibility is low, and you're behind a slow-moving truck.",
    question: "What should you do in this situation?",
    options: [
      "Use high beams to see better",
      "Turn on fog lights and increase following distance",
      "Hoot to urge the truck to speed up",
      "Overtake the truck immediately",
    ],
    correct: 1,
    explanation:
      "In dense fog, turn on fog lights to improve visibility and increase your following distance to allow more reaction time. High beams reduce visibility, and overtaking or hooting is unsafe.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC056",
    category: "signs",
    title: "Wet Road Warning in George",
    scenario:
      "You're driving on the N9 near George, Western Cape, after heavy rain. A 'Wet Road' warning sign is posted, and you notice water pooling on the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass the water",
      "Reduce speed and avoid sudden braking",
      "Hoot to warn other drivers",
      "Turn on your hazard lights",
    ],
    correct: 1,
    explanation:
      "A wet road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden braking to maintain control, especially in pooled water.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC057",
    category: "rules",
    title: "Rainy Intersection in East London",
    scenario:
      "You're approaching a robot on Oxford Street in East London during light rain. The robot turns amber, and a minibus taxi behind you is tailgating.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop if it's safe to do so",
      "Hoot to warn the taxi",
      "Continue driving cautiously",
    ],
    correct: 1,
    explanation:
      "An amber robot requires you to stop if it's safe. In rain, stopping safely prevents collisions, even with a tailgating taxi. Speeding up is risky in wet conditions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC058",
    category: "mixed",
    title: "Foggy Night on the R61",
    scenario:
      "You're driving on the R61 near Port Shepstone, KwaZulu-Natal, at night in thick fog. A bakkie ahead is driving erratically, and you can barely see road markings.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the bakkie to avoid it",
      "Slow down and use fog lights",
      "Follow the bakkie closely for guidance",
      "Hoot to alert the bakkie",
    ],
    correct: 1,
    explanation:
      "In thick fog at night, slow down and use fog lights to improve visibility while keeping a safe distance from the erratic bakkie. Overtaking or following closely is dangerous.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "night",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC059",
    category: "controls",
    title: "Windy Conditions on the N7",
    scenario:
      "You're driving a bakkie on the N7 near Clanwilliam, Western Cape, during strong crosswinds. Your vehicle is swaying, and debris is blowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the debris",
      "Reduce speed and grip the steering wheel",
      "Hoot to warn other drivers",
      "Pull over immediately",
    ],
    correct: 1,
    explanation:
      "In strong crosswinds, reduce speed and grip the steering wheel firmly to maintain control. Speeding up or pulling over suddenly could be unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC060",
    category: "signs",
    title: "Slippery Road in Rain Near Knysna",
    scenario:
      "You're driving on the N2 near Knysna after heavy rain, and a slippery road sign is posted. The road is wet, and a taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to avoid the taxi",
      "Reduce speed and increase following distance",
      "Hoot to warn the taxi",
      "Pull over to let the taxi pass",
    ],
    correct: 1,
    explanation:
      "A slippery road sign indicates a risk of losing traction. Reduce speed and increase your following distance to maintain control, even with a tailgating taxi.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC061",
    category: "rules",
    title: "Foggy Intersection in Bloemfontein",
    scenario:
      "You're approaching a four-way stop on Nelson Mandela Drive in Bloemfontein during dense fog. Visibility is low, and a bakkie is approaching from the left.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Stop and wait for the bakkie to pass",
      "Hoot to signal your presence",
      "Speed up to clear the intersection",
    ],
    correct: 1,
    explanation:
      "In low visibility, stop at the four-way stop and wait for the bakkie to pass, ensuring the intersection is clear. Hooting or speeding up is unsafe in fog.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC062",
    category: "mixed",
    title: "Rainy Toll Booth on the N1",
    scenario:
      "You're approaching a toll booth on the N1 near Polokwane in heavy rain. The road is slippery, and a truck ahead is slowing down suddenly.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck to reach the booth",
      "Slow down gradually and use wipers",
      "Hoot to warn the truck",
      "Stop suddenly to avoid the truck",
    ],
    correct: 1,
    explanation:
      "In heavy rain, slow down gradually and use wipers to maintain visibility and control. Overtaking or stopping suddenly is dangerous on a slippery road.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC063",
    category: "controls",
    title: "Wipers in Sudden Rain in Midrand",
    scenario:
      "You're driving on the R55 in Midrand, Johannesburg, when a sudden downpour reduces visibility. A minibus taxi is weaving through traffic ahead.",
    question: "What should you do in this situation?",
    options: [
      "Follow the taxi closely to stay on course",
      "Turn on wipers and reduce speed",
      "Hoot to warn the taxi",
      "Turn on high beams for better visibility",
    ],
    correct: 1,
    explanation:
      "In sudden rain, turn on wipers and reduce speed to maintain visibility and control. Following closely or using high beams is unsafe, and hooting is ineffective.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC064",
    category: "signs",
    title: "Wind Warning on the R43",
    scenario:
      "You're driving on the R43 near Hermanus, Western Cape, when you see a strong wind warning sign. Dust and leaves are blowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and grip the steering wheel",
      "Hoot to clear the debris",
      "Turn on hazard lights",
    ],
    correct: 1,
    explanation:
      "A strong wind warning sign indicates potential loss of control. Reduce speed and grip the steering wheel to stay stable, especially with debris on the road.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC065",
    category: "rules",
    title: "Foggy Night on the N12",
    scenario:
      "You're driving on the N12 near Kimberley at night in thick fog. A truck ahead is barely visible, and you can't see road signs clearly.",
    question: "What should you do in this situation?",
    options: [
      "Follow the truck closely to stay on track",
      "Slow down and use fog lights",
      "Hoot to signal your presence",
      "Overtake the truck to avoid delay",
    ],
    correct: 1,
    explanation:
      "In thick fog at night, slow down and use fog lights to improve visibility while keeping a safe distance from the truck. Following closely or overtaking is dangerous.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "night",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC066",
    category: "mixed",
    title: "Rainy Rural Road in Tzaneen",
    scenario:
      "You're driving on the R71 near Tzaneen, Limpopo, during heavy rain. A cattle crossing sign is posted, and you see cows near the wet road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Slow down and prepare to stop",
      "Speed up to pass the cows",
      "Continue driving at the same speed",
    ],
    correct: 1,
    explanation:
      "In heavy rain with a cattle crossing sign, slow down and prepare to stop to avoid hitting cows on the slippery road. Hooting or speeding up is unsafe.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC067",
    category: "controls",
    title: "Fog Lights in Polokwane",
    scenario:
      "You're driving on the N1 bypass in Polokwane at dawn in dense fog. Visibility is poor, and a taxi is overtaking recklessly.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Turn on fog lights and slow down",
      "Hoot to warn the taxi",
      "Follow the taxi closely",
    ],
    correct: 1,
    explanation:
      "In dense fog, turn on fog lights and slow down to maintain visibility and control. Speeding up or following the taxi closely is unsafe in low visibility.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC068",
    category: "signs",
    title: "Wet Road in Stellenbosch",
    scenario:
      "You're driving on the R44 near Stellenbosch after heavy rain, and a wet road sign is posted. The road is slippery, and a bakkie is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the bakkie",
      "Reduce speed and avoid sudden braking",
      "Hoot to warn the bakkie",
      "Pull over to let the bakkie pass",
    ],
    correct: 1,
    explanation:
      "A wet road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden braking to maintain control, even with a tailgating bakkie.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC069",
    category: "rules",
    title: "Windy Conditions in Port Elizabeth",
    scenario:
      "You're driving on the N2 near Port Elizabeth during strong coastal winds. A truck ahead is swaying, and debris is on the road.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Reduce speed and keep a safe distance",
      "Hoot to warn the truck",
      "Pull over and wait",
    ],
    correct: 1,
    explanation:
      "In strong winds, reduce speed and keep a safe distance from the swaying truck to avoid debris and maintain control. Overtaking or pulling over is risky.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC070",
    category: "mixed",
    title: "Rainy Night in Sandton",
    scenario:
      "You're driving on Grayston Drive in Sandton, Johannesburg, at night during heavy rain. The robots are out due to load shedding, and a taxi is approaching from the left.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the taxi and check for pedestrians",
      "Hoot to assert your right of way",
      "Speed up to clear the intersection",
    ],
    correct: 1,
    explanation:
      "With robots out, treat the intersection as a four-way stop. Yield to the taxi on the left and check for pedestrians, especially in poor visibility due to rain.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC071",
    category: "controls",
    title: "Emergency Stop in Fog on the R62",
    scenario:
      "You're driving on the R62 near Oudtshoorn in thick fog when a child runs into the road from a rural settlement.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously",
    ],
    correct: 1,
    explanation:
      "In thick fog, apply the brakes firmly to stop and avoid hitting the child. Swerving or hooting may not prevent a collision, and continuing to drive is unsafe.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC072",
    category: "signs",
    title: "Slippery Road in Rain Near Durban",
    scenario:
      "You're driving on the M4 near Durban after heavy rain, and a slippery road sign is posted. The road is wet, and a taxi is overtaking you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to match the taxi",
      "Reduce speed and avoid sudden movements",
      "Hoot to warn the taxi",
      "Pull over to let the taxi pass",
    ],
    correct: 1,
    explanation:
      "A slippery road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden movements to maintain control, even with an overtaking taxi.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC073",
    category: "rules",
    title: "Windy Intersection in George",
    scenario:
      "You're approaching a robot on York Street in George during strong winds. The robot turns amber, and debris is blowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop if it's safe to do so",
      "Hoot to warn other drivers",
      "Continue driving cautiously",
    ],
    correct: 1,
    explanation:
      "An amber robot requires you to stop if it's safe. In strong winds with debris, stopping safely prevents collisions and ensures control.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC074",
    category: "mixed",
    title: "Foggy Rural Road Near Kokstad",
    scenario:
      "You're driving on the R56 near Kokstad, KwaZulu-Natal, in dense fog at dawn. A cattle crossing sign is posted, and you hear cows nearby but can't see them.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Slow down and prepare to stop",
      "Speed up to pass the area",
      "Continue driving at the same speed",
    ],
    correct: 1,
    explanation:
      "In dense fog with a cattle crossing sign, slow down and prepare to stop to avoid hitting unseen cows. Hooting or speeding up is unsafe in low visibility.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC075",
    category: "controls",
    title: "Wipers in Sudden Rain on the N3",
    scenario:
      "You're driving on the N3 near Harrismith, Free State, when a sudden downpour reduces visibility. A truck ahead is slowing down.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck to avoid delay",
      "Turn on wipers and reduce speed",
      "Hoot to warn the truck",
      "Follow the truck closely",
    ],
    correct: 1,
    explanation:
      "In sudden rain, turn on wipers and reduce speed to maintain visibility and control. Overtaking or following closely is unsafe in poor weather conditions.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  // NEW CHATGPT SCENARIOS - URBAN SCENARIOS (SC076-SC091)
  {
    id: "SC076",
    category: "rules",
    title: "Load Shedding Traffic Light",
    scenario:
      "You're approaching a major intersection in Sandton during Stage 4 load shedding. The traffic lights (robots) are completely off, and there's moderate traffic coming from all directions.",
    question: "What should you do in this situation?",
    options: [
      "Proceed with caution as you have right of way",
      "Treat the intersection as a 4-way stop",
      "Wait until all traffic clears before proceeding",
      "Sound your horn and proceed through the intersection",
    ],
    correct: 1,
    explanation:
      "When traffic lights are not functioning, the intersection must be treated as a 4-way stop. Each vehicle must stop completely and proceed in order of arrival. If vehicles arrive simultaneously, the vehicle on the right has right of way.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC077",
    category: "rules",
    title: "Minibus Taxi Lane Cutting",
    scenario:
      "You're driving on William Nicol Drive in Johannesburg when a minibus taxi suddenly swerves in front of you from the left lane without indicating, attempting to pick up passengers at an informal taxi stop.",
    question: "What is the appropriate response in this situation?",
    options: [
      "Accelerate to prevent the taxi from cutting in",
      "Brake suddenly and sound your horn in anger",
      "Reduce your speed and allow safe space for the taxi",
      "Flash your lights and drive aggressively around the taxi",
    ],
    correct: 2,
    explanation:
      "When a vehicle cuts in front of you unexpectedly, you should reduce your speed to maintain a safe following distance. While the taxi driver's behavior may be improper, defensive driving requires prioritizing safety over right of way. Maintain your composure and adjust your driving to accommodate the situation.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC078",
    category: "rules",
    title: "Pedestrian Crossing CBD",
    scenario:
      "You're driving through Cape Town CBD on Adderley Street during lunchtime. A pedestrian suddenly steps onto a zebra crossing about 10 meters ahead of you while looking at their phone.",
    question: "What should you do?",
    options: [
      "Proceed through the crossing as pedestrians must wait for vehicles",
      "Sound your horn to alert the pedestrian and continue driving",
      "Slow down gradually and stop completely before the crossing",
      "Swerve around the pedestrian to avoid stopping",
    ],
    correct: 2,
    explanation:
      "At a pedestrian crossing, pedestrians have right of way. You must slow down and stop completely to allow pedestrians to cross safely, even if they appear distracted. This is particularly important in busy CBD areas with high pedestrian traffic.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC079",
    category: "controls",
    title: "Parallel Parking on Long Street",
    scenario:
      "You need to parallel park your vehicle in a tight space between two cars on Long Street in Cape Town's busy entertainment district. There are pedestrians on the pavement and light traffic on the road.",
    question:
      "What is the correct procedure for parallel parking in this situation?",
    options: [
      "Signal right, stop alongside the front vehicle, reverse slowly turning your steering wheel first left then right",
      "Signal left, drive past the parking space, reverse straight back until you're in position",
      "Signal left, stop alongside the front vehicle, reverse slowly turning your steering wheel first right then left",
      "Park elsewhere as parallel parking is too difficult in busy areas",
    ],
    correct: 2,
    explanation:
      "The correct parallel parking procedure is to signal left, stop alongside the front vehicle with about 1 meter of space between vehicles, reverse slowly while turning your steering wheel first to the right (to bring your rear into the space) and then to the left (to straighten). Always check mirrors and blind spots for pedestrians and other vehicles throughout the maneuver.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    language: "en",
  },
  {
    id: "SC080",
    category: "mixed",
    title: "Emergency Vehicle Response",
    scenario:
      "You're driving on Bree Street in central Cape Town when you hear sirens and see an ambulance with flashing lights approaching from behind in heavy traffic. There's limited space to move aside.",
    question: "What should you do?",
    options: [
      "Continue driving normally as the ambulance will find its way around you",
      "Stop immediately where you are to let the ambulance pass",
      "Signal and carefully move to the left where possible, stopping if necessary",
      "Speed up to clear the road ahead for the ambulance",
    ],
    correct: 2,
    explanation:
      "When an emergency vehicle approaches with sirens and lights activated, you must give way by moving to the left side of the road where possible and stopping if necessary. If there's limited space in urban areas, make your best effort to create passage, but do so safely without mounting curbs or endangering others.",
    difficulty: "intermediate",
    context: "urban",
    language: "en",
  },
  {
    id: "SC081",
    category: "signs",
    title: "Construction Zone in Rosebank",
    scenario:
      "You're approaching a construction zone on Oxford Road in Rosebank, Johannesburg. There are temporary orange signs, reduced lane markings, and workers visible on site with a temporary speed limit posted.",
    question: "How should you navigate this construction zone?",
    options: [
      "Maintain your normal speed as the construction doesn't affect your lane",
      "Reduce speed to the temporary limit, follow lane markings and watch for workers",
      "Change lanes immediately to avoid the construction area altogether",
      "Sound your horn to alert workers of your approach",
    ],
    correct: 1,
    explanation:
      "In construction zones, you must reduce your speed to the temporary posted limit, follow any temporary lane markings carefully, and be especially vigilant for workers who may be close to traffic. Construction zones require extra caution as conditions may change quickly and unexpectedly.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC082",
    category: "rules",
    title: "School Zone in Claremont",
    scenario:
      "You're driving past Claremont High School in Cape Town at 2:30 PM as schools are letting out. There are school zone signs, children crossing the road, and parents' vehicles parked along the roadside.",
    question: "What is the correct way to drive through this school zone?",
    options: [
      "Drive at the normal speed limit as children should know to stay off the road",
      "Reduce speed significantly, stay alert for children, and be prepared to stop",
      "Sound your horn continuously to alert children of your presence",
      "Accelerate to get through the school zone quickly",
    ],
    correct: 1,
    explanation:
      "When driving through a school zone, especially during arrival or dismissal times, you must reduce your speed significantly (even below the posted school zone limit if necessary for safety), stay highly alert for unpredictable child pedestrians, and be prepared to stop suddenly if needed. Children may dart into the road unexpectedly, so extreme caution is required.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC083",
    category: "mixed",
    title: "Taxi Rank Navigation",
    scenario:
      "You're driving near the Noord Taxi Rank in Johannesburg CBD during rush hour. Minibus taxis are stopping randomly to pick up passengers, pedestrians are crossing between vehicles, and there's general congestion.",
    question: "What is the safest way to navigate through this area?",
    options: [
      "Drive assertively and don't give way to taxis to establish your position",
      "Avoid the area completely by taking a longer alternative route",
      "Reduce speed significantly, maintain larger following distances, and stay alert",
      "Sound your horn continuously to ensure everyone is aware of your presence",
    ],
    correct: 2,
    explanation:
      "When driving near busy taxi ranks in South African cities, defensive driving is essential. Reduce your speed significantly, maintain a much larger following distance than normal, anticipate sudden stops from taxis, watch carefully for pedestrians who may cross from between vehicles, and remain patient and alert. Safety takes priority over getting to your destination quickly.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC084",
    category: "controls",
    title: "Traffic Circle in Greenpoint",
    scenario:
      "You're approaching the busy traffic circle at Greenpoint in Cape Town with multiple lanes and exits. There's moderate traffic, and some vehicles are already in the circle.",
    question:
      "What is the correct procedure for entering and exiting this traffic circle?",
    options: [
      "Yield to all traffic in the circle regardless of which lane they're in, signal when exiting",
      "Enter without yielding as traffic circles are first-come, first-served",
      "Yield only to vehicles approaching from your right, no signals needed",
      "Come to a complete stop before entering regardless of traffic",
    ],
    correct: 0,
    explanation:
      "When approaching a traffic circle in South Africa, you must yield to all traffic already in the circle regardless of which lane they're in. Use your indicator to signal when you're exiting the circle, not when entering. For multi-lane circles, generally use the left lane for exiting at the first or second exit, and the right lane for later exits, but follow road markings if present.",
    difficulty: "intermediate",
    context: "urban",
    language: "en",
  },
  {
    id: "SC085",
    category: "rules",
    title: "Dual Carriageway on M3",
    scenario:
      "You're driving on the M3 dual carriageway in Cape Town and need to overtake a slower vehicle ahead of you. There are two lanes in your direction and moderate traffic.",
    question: "What is the correct procedure for overtaking on this road?",
    options: [
      "Overtake on the left (inner) lane if the right lane is occupied",
      "Always use the right (outer) lane for overtaking, return to the left lane when safe",
      "Flash your lights to signal the vehicle ahead to move over, then overtake",
      "Overtake using whichever lane is convenient at the moment",
    ],
    correct: 1,
    explanation:
      "On dual carriageways in South Africa, the correct procedure for overtaking is to use the right (outer) lane, passing the slower vehicle on their right side, and then return to the left lane once you've safely passed and can see the overtaken vehicle in your rearview mirror. The left lane is the normal driving lane, while the right lane should primarily be used for overtaking.",
    difficulty: "basic",
    context: "urban",
    language: "en",
  },
  {
    id: "SC086",
    category: "mixed",
    title: "Cash-in-Transit Situation",
    scenario:
      "While driving on Rivonia Road in Sandton, you notice a cash-in-transit vehicle stopped ahead with security guards in tactical positions. Blue lights are flashing and there's a visible cash transfer happening.",
    question: "What is the safest action to take?",
    options: [
      "Stop and wait directly behind the cash-in-transit vehicle",
      "Pull over at a safe distance and wait until the operation is complete",
      "Drive around the vehicle quickly to avoid any potential danger",
      "Sound your horn to alert them you need to pass",
    ],
    correct: 1,
    explanation:
      "Cash-in-transit operations in South Africa can be targets for armed robberies. The safest action is to maintain a significant distance from the operation. Pull over safely if possible and wait until the transfer is complete and the vehicle has moved on. Never pressure the security team by driving too close, sounding your horn, or making sudden movements near their operation.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC087",
    category: "rules",
    title: "Security Boom Gate Estate",
    scenario:
      "You're approaching the entrance of a security estate in Fourways, Johannesburg. There's a boom gate, security guard, and several vehicles queuing to enter. You're visiting a friend and don't have resident access.",
    question: "What is the correct procedure at this security entrance?",
    options: [
      "Follow closely behind the car in front to enter on their access",
      "Stop completely at the boom, provide identification and details of who you're visiting",
      "Sound your horn to get the guard's attention for faster service",
      "Drive around the boom if the queue is moving too slowly",
    ],
    correct: 1,
    explanation:
      "At South African security estate entrances, all visitors must stop completely at the boom gate, provide personal identification (usually driver's license), and provide details of the resident you're visiting. The guard will typically call to confirm your visit is expected. Never tailgate another vehicle through the boom as this is both dangerous and a security violation.",
    difficulty: "basic",
    context: "residential",
    language: "en",
  },
  {
    id: "SC088",
    category: "signs",
    title: "Temporary Road Closure V&A Waterfront",
    scenario:
      "You're driving toward the V&A Waterfront in Cape Town when you encounter temporary barriers and a 'Road Closed' sign due to a weekend market event. There are traffic officers redirecting vehicles.",
    question: "What should you do in this situation?",
    options: [
      "Ignore the barriers as you're certain your destination is just beyond them",
      "Follow the traffic officer's directions even if it means taking a detour",
      "Stop and argue with the traffic officer about needing access",
      "Drive around the barriers when the officer isn't looking",
    ],
    correct: 1,
    explanation:
      "When encountering temporary road closures with traffic officers present, you must always follow their directions, even if it means taking a detour to your destination. Traffic officers' hand signals and instructions supersede regular road signs and rules. Attempting to ignore or circumvent road closures is illegal and dangerous.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC089",
    category: "mixed",
    title: "Approaching Metro Police Roadblock",
    scenario:
      "You're driving on Jan Smuts Avenue in Johannesburg when you notice a Metro Police roadblock ahead checking for licenses and vehicle roadworthiness. There are several police vehicles with flashing lights and officers directing traffic.",
    question: "What is the correct way to approach and handle this roadblock?",
    options: [
      "Make a U-turn before reaching the roadblock to avoid delays",
      "Slow down, follow officers' directions, and have your license ready",
      "Quickly change lanes repeatedly to try to get through faster",
      "Tell the officers you're in a hurry and ask to be let through quickly",
    ],
    correct: 1,
    explanation:
      "When approaching a police roadblock in South Africa, you must slow down safely, follow all directions from the officers, and be prepared to present your driver's license and vehicle registration. Remain courteous and cooperative. Making a U-turn to avoid a roadblock is illegal and can result in serious consequences including arrest.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC090",
    category: "rules",
    title: "Merging onto M1 Highway",
    scenario:
      "You're on the on-ramp to join the M1 highway in Johannesburg during moderate traffic. The acceleration lane is short, and there are vehicles already traveling at speed on the highway.",
    question:
      "What is the correct procedure for merging onto the highway in this situation?",
    options: [
      "Stop at the end of the on-ramp and wait for a large gap in traffic",
      "Accelerate to match highway speed, use indicators, and merge when safe",
      "Drive slowly on the on-ramp and expect highway traffic to make way for you",
      "Accelerate quickly and force your way into the highway traffic",
    ],
    correct: 1,
    explanation:
      "The correct procedure for merging onto a highway is to use the acceleration lane to match your speed with the flow of traffic, activate your indicator to signal your intention to merge, check mirrors and blind spots, and merge smoothly when a safe gap appears. Vehicles already on the highway have right of way, but defensive driving means both parties should adjust to facilitate safe merging.",
    difficulty: "intermediate",
    context: "urban",
    language: "en",
  },
  {
    id: "SC091",
    category: "controls",
    title: "Cable Theft Manhole",
    scenario:
      "You're driving on a residential street in Parkview, Johannesburg at night when you suddenly notice an open manhole in your lane where thieves have removed the cover to steal cables. You're about 15 meters away.",
    question: "What is the correct action to take?",
    options: [
      "Swerve sharply to avoid the manhole without checking surrounding traffic",
      "Brake suddenly and come to a complete stop before the hazard",
      "Check mirrors, reduce speed appropriately and safely navigate around the hazard",
      "Sound your horn continuously while driving through the hazard",
    ],
    correct: 2,
    explanation:
      "When encountering a sudden road hazard like an open manhole, you should first check your mirrors to be aware of surrounding traffic, reduce your speed appropriately without braking suddenly (which could cause a rear-end collision), and then safely navigate around the hazard if possible. After passing safely, you should report the hazard to authorities.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    language: "en",
  },
  // RURAL SCENARIOS (SC092-SC106)
  {
    id: "SC092",
    category: "mixed",
    title: "N2 Wild Coast Animal Crossing",
    scenario:
      "You're driving on the N2 highway near Port St. Johns in the Eastern Cape when you notice a sign warning of animal crossings. It's dusk, and visibility is becoming limited in this rural area.",
    question: "What precautions should you take in this situation?",
    options: [
      "Maintain your speed but flash your lights occasionally to scare animals away",
      "Reduce your speed significantly and increase your following distance",
      "Sound your horn continuously to warn animals of your approach",
      "Switch lanes frequently to avoid animals that might appear",
    ],
    correct: 1,
    explanation:
      "When driving in areas with potential animal crossings, especially at dusk when many animals are more active, you should reduce your speed significantly and increase your vigilance. This gives you more time to react if an animal suddenly appears on the road. Increased following distance is also important as the vehicle ahead of you might brake suddenly for animals.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "evening",
    language: "en",
  },
  {
    id: "SC093",
    category: "rules",
    title: "N1 Highway Breakdown",
    scenario:
      "Your vehicle experiences a mechanical problem and you need to stop on the N1 highway between Bloemfontein and Colesberg. There's a narrow shoulder, it's daytime, and there's moderate traffic.",
    question:
      "What is the correct procedure for safely stopping on the highway?",
    options: [
      "Stop immediately where you are and put on your hazard lights",
      "Signal, slow down gradually, and pull as far onto the shoulder as safely possible",
      "Drive at very slow speed until you reach the next town",
      "Make a U-turn and drive against traffic to the nearest exit",
    ],
    correct: 1,
    explanation:
      "When experiencing a breakdown on a highway, signal your intention to pull over, slow down gradually, and pull as far onto the shoulder as safely possible. Once stopped, activate your hazard warning lights, place your warning triangle 45 meters behind your vehicle, and ensure all passengers exit the vehicle on the side away from traffic and move to safety behind the barrier if present. Call for assistance and remain visible but at a safe distance from the roadway.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC094",
    category: "mixed",
    title: "N3 Van Reenen's Pass Descent",
    scenario:
      "You're driving a vehicle with a trailer descending Van Reenen's Pass on the N3 between Gauteng and KwaZulu-Natal. The road is steep with warning signs about using lower gears.",
    question: "What is the safest way to descend this mountain pass?",
    options: [
      "Use the brakes continuously to control your speed",
      "Shift to a lower gear before the descent and use engine braking",
      "Put the vehicle in neutral to save fuel on the downhill",
      "Maintain highway speed to avoid causing traffic delays",
    ],
    correct: 1,
    explanation:
      "When descending steep mountain passes like Van Reenen's Pass, you should shift to a lower gear before beginning the descent and use engine braking to control your speed. This prevents brake overheating and potential brake failure. Using the brakes intermittently (not continuously) helps maintain control. This is especially important when towing a trailer, as the additional weight increases stopping distance and momentum.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC095",
    category: "signs",
    title: "N7 Roadworks Speed Limit",
    scenario:
      "You're driving on the N7 highway toward Springbok in the Northern Cape when you encounter roadworks with a reduced temporary speed limit of 60 km/h. The normal speed limit is 120 km/h and the road appears clear.",
    question: "What should you do regarding the speed limit?",
    options: [
      "Maintain 120 km/h as the road appears clear of workers",
      "Reduce to 80 km/h as a reasonable compromise",
      "Reduce to 60 km/h and maintain this speed through the entire roadworks section",
      "Speed up after passing the first roadworks sign if no workers are visible",
    ],
    correct: 2,
    explanation:
      "Temporary speed limits at roadworks must be obeyed throughout the entire demarcated roadworks section, regardless of whether workers or machinery are visible at that moment. The reduced limits are set for safety due to potential hazards like lane shifts, uneven surfaces, loose gravel, or machinery that may not be immediately visible. Violating roadworks speed limits carries higher penalties and is especially dangerous for road workers.",
    difficulty: "basic",
    context: "rural",
    language: "en",
  },
  {
    id: "SC096",
    category: "rules",
    title: "Rural Stop Street Intersection",
    scenario:
      "You're driving on a rural road near Ceres in the Western Cape and approach a four-way intersection with stop signs in all directions. You arrive at exactly the same time as another vehicle on your right.",
    question: "Who has the right of way in this situation?",
    options: [
      "You have right of way as you're ready to proceed first",
      "The vehicle on your right has right of way",
      "The vehicle with the larger engine capacity has right of way",
      "Both vehicles should proceed at the same time cautiously",
    ],
    correct: 1,
    explanation:
      "At a four-way stop intersection where vehicles arrive simultaneously, the vehicle on the right has right of way. This is in accordance with the South African K53 rules and the National Road Traffic Act. Each vehicle must come to a complete stop, and then proceed in order of arrival. When arrivals are simultaneous, yield to the vehicle on your right.",
    difficulty: "basic",
    context: "rural",
    language: "en",
  },
  {
    id: "SC097",
    category: "mixed",
    title: "N4 Platinum Highway Toll Plaza",
    scenario:
      "You're approaching the Bronkhorstspruit toll plaza on the N4 Platinum Highway. There are multiple lanes including e-tag lanes, cash lanes, and credit card lanes with varying queue lengths.",
    question:
      "Which lane should you choose if you don't have an e-tag but have both cash and credit card?",
    options: [
      "Any e-tag lane as all lanes can process all payment types",
      "The lane specifically marked for cash or credit card payments only",
      "The lane with the shortest queue regardless of payment type markings",
      "Any lane, as you can argue with the attendant if you choose incorrectly",
    ],
    correct: 1,
    explanation:
      "At South African toll plazas, you must select a lane that matches your payment method. If you don't have an e-tag, you must use lanes specifically marked for cash or credit card payments. Using an e-tag lane without an e-tag disrupts traffic flow and may result in a violation. Choose the appropriate lane even if other lanes have shorter queues.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC098",
    category: "controls",
    title: "R63 Farm Vehicle Encounter",
    scenario:
      "You're driving on the R63 near Graaff-Reinet in the Eastern Cape when you encounter a slow-moving farm tractor pulling an implement that takes up part of your lane. The road has solid white lines and limited visibility due to curves.",
    question: "What is the correct way to handle this situation?",
    options: [
      "Overtake immediately to avoid getting stuck behind the tractor",
      "Follow at a safe distance until there's a legal and safe opportunity to pass",
      "Sound your horn continuously until the tractor moves off the road",
      "Cross the solid white line slowly to pass the tractor",
    ],
    correct: 1,
    explanation:
      "When encountering slow-moving farm vehicles on rural roads, you should maintain a safe following distance until there's a legal and safe opportunity to pass. Even if the vehicle is moving very slowly, you must never overtake on a solid white line or when visibility is limited. Patient, defensive driving is essential on rural roads where agricultural vehicles are common.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC099",
    category: "mixed",
    title: "R62 Rural Hitchhiker",
    scenario:
      "While driving on the R62 in the Klein Karoo between Oudtshoorn and Calitzdorp, you see a hitchhiker on the side of the road signaling for a ride. You're driving alone with empty seats in your vehicle.",
    question: "What is the safest response to this situation?",
    options: [
      "Stop and offer the hitchhiker a ride as it's common courtesy in rural areas",
      "Slow down to speak with the hitchhiker before deciding whether to give a ride",
      "Continue driving without stopping, maintaining your speed and focus on the road",
      "Stop and give money to the hitchhiker instead of a ride",
    ],
    correct: 2,
    explanation:
      "For safety reasons, it's advisable not to stop for hitchhikers in South Africa, regardless of location. Continue driving without changing your speed or behavior. Stopping for unknown persons poses significant personal safety risks. If you want to help those needing transportation in rural areas, it's safer to support formal community transport initiatives rather than picking up strangers.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC100",
    category: "rules",
    title: "R71 Overtaking Heavy Vehicle",
    scenario:
      "You're driving on the R71 between Polokwane and Tzaneen behind a heavily loaded truck that's moving slowly uphill. There's a broken white line in the center of the road, but limited visibility ahead due to the hill crest.",
    question: "What is the correct decision regarding overtaking?",
    options: [
      "Overtake quickly before reaching the hill crest",
      "Remain behind the truck until after the hill crest when visibility improves",
      "Sound your horn to alert oncoming traffic and then overtake",
      "Follow closely behind the truck to look for gaps in oncoming traffic",
    ],
    correct: 1,
    explanation:
      "When visibility is limited due to a hill crest, it's unsafe and illegal to overtake even if there's a broken white line. You must remain behind the slower vehicle until you've passed the hill crest and can see that the road ahead is clear enough to overtake safely. Patience is essential for safe driving on rural roads with changing topography.",
    difficulty: "intermediate",
    context: "rural",
    language: "en",
  },
  {
    id: "SC101",
    category: "signs",
    title: "N12 Kimberley Animal Warning",
    scenario:
      "You're driving on the N12 near Kimberley in the Northern Cape when you see a warning sign showing a kudu silhouette. It's late afternoon and the sun is starting to set.",
    question: "What precautions should you take after seeing this sign?",
    options: [
      "No special precautions are needed unless animals are actually visible",
      "Reduce speed and increase vigilance, especially near dense vegetation",
      "Sound your horn periodically to scare away any animals",
      "Switch on your high beam headlights continuously",
    ],
    correct: 1,
    explanation:
      "Animal warning signs, particularly for large antelope like kudu, indicate high-risk areas for animal crossings. You should reduce your speed and increase vigilance, scanning both the road and roadside vegetation where animals may be hidden. This is especially important during dawn, dusk, and night when many animals are most active. A collision with a large antelope can be fatal for both the animal and vehicle occupants.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "evening",
    language: "en",
  },
  {
    id: "SC102",
    category: "mixed",
    title: "N10 Rural Accident Scene",
    scenario:
      "While driving on the N10 between Cradock and Cookhouse in the Eastern Cape, you come upon a recent accident scene. There's a damaged vehicle on the side of the road, people standing nearby, but no emergency services present yet.",
    question: "What is the correct response to this situation?",
    options: [
      "Drive past without stopping to avoid creating more congestion",
      "Stop immediately in the road and get out to help",
      "Slow down, stop safely if you can assist, or proceed cautiously if others are helping",
      "Take photos of the accident to report to authorities later",
    ],
    correct: 2,
    explanation:
      "When encountering an accident scene where emergency services haven't yet arrived, first slow down and assess the situation safely. If stopping to assist, pull completely off the road with hazard lights on. Check if anyone needs urgent medical help, call emergency services (10111 or 112), and provide basic first aid if you're trained. If others are already assisting, proceed cautiously without creating additional hazards. Never stop in a dangerous position that could cause another accident.",
    difficulty: "advanced",
    context: "rural",
    language: "en",
  },
  {
    id: "SC103",
    category: "controls",
    title: "R75 Fuel Gauge Warning",
    scenario:
      "You're driving on the R75 between Uitenhage and Graaff-Reinet, approximately 60km from the nearest town, when your fuel gauge warning light illuminates. There are no visible fuel stations on this stretch of rural road.",
    question: "What is the best course of action?",
    options: [
      "Continue at normal speed to reach the next town quickly",
      "Pull over immediately and call for assistance",
      "Reduce speed, turn off air conditioning, and drive economically to the nearest fuel station",
      "Stop and flag down another vehicle to ask for fuel",
    ],
    correct: 2,
    explanation:
      "When the fuel warning light illuminates in a rural area, you should take immediate steps to conserve fuel while proceeding to the nearest fuel station. Reduce your speed (fuel consumption increases significantly at higher speeds), turn off the air conditioning, and drive in the highest gear possible at your reduced speed. Most vehicles can travel 30-50km after the warning light appears, but this varies by vehicle. If possible, use a map or GPS to locate the nearest fuel station rather than just heading to the next town.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC104",
    category: "rules",
    title: "R356 Single-Lane Bridge",
    scenario:
      "You're approaching a narrow single-lane bridge on the R356 near Sutherland in the Northern Cape. There's a yield sign on your side, and a vehicle is approaching from the opposite direction.",
    question: "What should you do in this situation?",
    options: [
      "Accelerate to cross the bridge before the other vehicle arrives",
      "Proceed onto the bridge and expect the other vehicle to reverse if you meet",
      "Stop before the bridge, yield to the oncoming vehicle, and then proceed",
      "Sound your horn to assert your right of way",
    ],
    correct: 2,
    explanation:
      "When approaching a single-lane bridge with a yield sign on your side, you must stop before the bridge and give way to any vehicles already on the bridge or about to enter from the opposite side (which doesn't have a yield sign). Only proceed when the bridge is completely clear. Single-lane bridges are common on rural South African roads and require courtesy and patience.",
    difficulty: "basic",
    context: "rural",
    language: "en",
  },
  {
    id: "SC105",
    category: "mixed",
    title: "R61 Livestock on Road",
    scenario:
      "You're driving on the R61 near Mthatha in the Eastern Cape when you encounter a herd of cattle crossing the road, supervised by a young herdsman. There's no formal animal crossing warning.",
    question: "What is the appropriate action to take?",
    options: [
      "Sound your horn continuously to scatter the cattle and clear your path",
      "Maintain your speed but swerve between the animals",
      "Stop completely and wait patiently for all animals to cross",
      "Drive slowly through the herd forcing them to move aside",
    ],
    correct: 2,
    explanation:
      "When encountering livestock crossing a rural road, you must stop completely and wait patiently for all animals to cross. Sounding your horn may startle the animals causing unpredictable movements and possible accidents. Livestock herding is common in many rural South African areas, and respecting this practice is both a safety measure and a courtesy to rural communities. After the incident, continue to drive cautiously as stray animals may still be near the road.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC106",
    category: "signs",
    title: "N11 Speed Limit Change",
    scenario:
      "You're driving on the N11 between Newcastle and Volksrust and pass a sign reducing the speed limit from 120 km/h to 80 km/h as you approach a small rural settlement.",
    question:
      "When should you begin reducing your speed after seeing this sign?",
    options: [
      "Gradually reduce speed after passing the sign to reach 80 km/h at the next sign",
      "Begin reducing speed before reaching the sign",
      "Immediately reduce to exactly 80 km/h precisely at the sign",
      "Reduce speed only when you see the actual settlement",
    ],
    correct: 2,
    explanation:
      "Speed limit signs indicate the maximum legal speed from the point where the sign is positioned. You must have reduced your speed to 80 km/h or below by the time you reach the sign, not after it. This is particularly important when entering rural settlements where pedestrians, animals, and local traffic may be present. Ignoring reduced speed limits in rural settlements is a common cause of serious accidents.",
    difficulty: "basic",
    context: "rural",
    language: "en",
  },
  // WEATHER-RELATED SCENARIOS (SC107-SC126)
  {
    id: "SC107",
    category: "mixed",
    title: "Cape Town Winter Rain",
    scenario:
      "You're driving on the N1 near Century City in Cape Town during heavy winter rainfall. The road is wet, visibility is reduced, and there's moderate traffic around you.",
    question: "How should you adjust your driving in these rainy conditions?",
    options: [
      "Maintain normal speed but turn on headlights",
      "Reduce speed by at least 20%, increase following distance, and use headlights",
      "Pull over and wait for the rain to stop completely",
      "Drive in the emergency lane where there's less water",
    ],
    correct: 1,
    explanation:
      "In heavy rain, you must reduce your speed significantly (by at least 20% of the speed limit), increase your following distance to at least 3-4 seconds, and use headlights (not hazard lights) to improve your visibility to other drivers. Wet roads increase stopping distance and reduce tire grip, while reduced visibility limits reaction time. Cape Town's winter rainfall can be particularly heavy and sudden, requiring immediate driving adjustments.",
    difficulty: "intermediate",
    context: "urban",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC108",
    category: "controls",
    title: "Aquaplaning on N2",
    scenario:
      "You're driving on the N2 near George during heavy coastal rain when you suddenly feel your vehicle lose contact with the road and begin to slide on surface water (aquaplaning).",
    question: "What is the correct way to handle aquaplaning?",
    options: [
      "Brake firmly and steer in the opposite direction of the slide",
      "Accelerate to push through the water more effectively",
      "Ease off the accelerator, keep steering straight, and don't brake suddenly",
      "Turn on your hazard lights and brake hard",
    ],
    correct: 2,
    explanation:
      "When aquaplaning occurs, you should ease off the accelerator (don't brake), keep steering straight (or make only very gentle steering adjustments if necessary), and hold a firm grip on the steering wheel. Sudden braking or steering can cause complete loss of control. Once you feel traction return, gently apply brakes to reduce speed further. To prevent aquaplaning, reduce speed on wet roads, maintain proper tire pressure and tread depth, and avoid standing water when possible.",
    difficulty: "advanced",
    context: "rural",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC109",
    category: "mixed",
    title: "Table Mountain Fog",
    scenario:
      "You're driving on Tafelberg Road near Table Mountain in Cape Town when you suddenly enter a dense bank of fog. Visibility drops to less than 20 meters ahead.",
    question: "What actions should you take when suddenly entering fog?",
    options: [
      "Turn on high beam headlights to penetrate the fog better",
      "Pull over immediately wherever you are and wait for the fog to clear",
      "Reduce speed significantly, turn on low beam headlights and fog lights if equipped",
      "Follow the taillights of the vehicle ahead closely to navigate",
    ],
    correct: 2,
    explanation:
      "When suddenly entering fog, you should reduce your speed significantly, turn on low beam headlights (high beams reflect off fog and reduce visibility further), and fog lights if equipped. Increase following distance as stopping distances remain the same but reaction time is affected by reduced visibility. Use the road's edge line as a guide rather than the center line where possible. Only pull over if you can get completely off the road in a safe location, with hazard lights on.",
    difficulty: "advanced",
    context: "urban",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC110",
    category: "rules",
    title: "Johannesburg Thunderstorm",
    scenario:
      "You're driving in Sandton, Johannesburg during a severe summer thunderstorm with lightning, heavy rain, and some hail. Traffic signals at the upcoming intersection aren't functioning due to a power outage.",
    question:
      "How should you proceed through the intersection with non-functioning traffic signals?",
    options: [
      "Proceed with caution if no other vehicles are visible",
      "Treat it as a yield intersection with main road having priority",
      "Stop completely and then proceed only when safe, treating it as a 4-way stop",
      "Sound your horn and proceed through the intersection",
    ],
    correct: 2,
    explanation:
      "When traffic signals are not functioning due to power outages (common during Johannesburg thunderstorms), you must treat the intersection as a 4-way stop regardless of the size of the roads. Come to a complete stop, yield to vehicles that arrived before you, and proceed only when it's safe. If you arrive at the same time as another vehicle, yield to the vehicle on your right. This rule applies even on major roads where you normally wouldn't expect to stop.",
    difficulty: "intermediate",
    context: "urban",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC111",
    category: "mixed",
    title: "N3 Van Reenen's Pass Fog",
    scenario:
      "You're driving on the N3 at Van Reenen's Pass between Gauteng and KZN when you encounter patches of dense fog reducing visibility to less than 50 meters. There's heavy truck traffic on this route.",
    question: "What is the safest approach to driving in these conditions?",
    options: [
      "Maintain highway speed but stay in the emergency lane",
      "Drive with hazard lights on at normal speed",
      "Reduce speed significantly, maintain extra distance from trucks, use appropriate lights",
      "Pull over at the nearest opportunity and wait for conditions to improve",
    ],
    correct: 2,
    explanation:
      "When driving in fog on mountain passes with heavy truck traffic, reduce your speed significantly according to visibility conditions, maintain an extra large following distance (especially from trucks which may brake suddenly), use low beam headlights and fog lights if equipped (never high beams or hazard lights while moving), and stay in your lane. Be particularly cautious of trucks moving slowly uphill or potentially losing control downhill. Only pull over if there's a designated rest area or viewing point, never on the shoulder of a mountain pass.",
    difficulty: "advanced",
    context: "rural",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC112",
    category: "controls",
    title: "Windshear at Cape Town Airport",
    scenario:
      "You're driving on Airport Approach Road near Cape Town International during extremely strong Cape Doctor winds. Your vehicle is being buffeted by powerful gusts and you see dust and debris blowing across the road.",
    question:
      "How should you control your vehicle in these strong wind conditions?",
    options: [
      "Accelerate to drive through gusts more quickly",
      "Grip the steering wheel loosely to allow natural correction",
      "Reduce speed, grip the wheel firmly with both hands, and be prepared for directional changes",
      "Drive in the center of the road to avoid being blown off course",
    ],
    correct: 2,
    explanation:
      "In strong wind conditions like Cape Town's notorious 'Cape Doctor' south-easter, reduce your speed significantly, grip the steering wheel firmly with both hands at the 9 and 3 o'clock positions, and be prepared to make steering corrections when hit by gusts. Be especially cautious when passing high-sided vehicles, crossing bridges, or moving from sheltered areas to exposed ones. Allow extra space around your vehicle, particularly from motorcycles and trucks which may be affected more severely by wind.",
    difficulty: "advanced",
    context: "urban",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC113",
    category: "mixed",
    title: "KZN Midlands Mist",
    scenario:
      "You're driving on the R103 in the KwaZulu-Natal Midlands early in the morning when you encounter patches of mist and ground fog in the valleys. Visibility fluctuates between clear and very limited.",
    question:
      "What is the appropriate way to handle these changing visibility conditions?",
    options: [
      "Maintain a constant speed regardless of visibility to avoid disrupting traffic flow",
      "Repeatedly turn headlights on and off to make yourself more visible",
      "Adjust speed according to visibility, using appropriate lights consistently throughout",
      "Pull over in each foggy patch and resume driving in clear sections",
    ],
    correct: 2,
    explanation:
      "When driving in areas with fluctuating fog or mist patches (common in the KZN Midlands), you should adjust your speed according to visibility conditions - slowing significantly in foggy patches and resuming normal speed in clear sections. Keep headlights on low beam throughout the entire journey, not just in foggy sections. This helps maintain your visibility to other drivers even in clear patches between fog. Be especially alert for wildlife and farm animals which are common in this region and may be obscured by mist.",
    difficulty: "intermediate",
    context: "rural",
    weather: "fog",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC114",
    category: "rules",
    title: "Flooded Low Water Bridge",
    scenario:
      "After heavy rain in Mpumalanga, you approach a low water bridge on the R536 near Hazyview with water flowing across the road surface. There are no depth indicators visible.",
    question: "What should you do at this flooded crossing?",
    options: [
      "Drive through slowly in first gear without stopping",
      "Test the depth by walking through the water first, then decide",
      "Do not attempt to cross; turn around and find an alternative route",
      "Wait to observe if other vehicles cross successfully, then follow their example",
    ],
    correct: 2,
    explanation:
      "When encountering a flooded low water bridge with no visible depth indicators and water flowing across the road, you should not attempt to cross. Even seemingly shallow water can be powerful enough to sweep vehicles away, hide washouts in the road surface, or cause engine damage. The safest action is to turn around and find an alternative route. The South African Weather Service and disaster management agencies consistently advise: 'Turn around, don't drown' when facing water crossings during flood conditions.",
    difficulty: "intermediate",
    context: "rural",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC115",
    category: "mixed",
    title: "Karoo Dust Storm",
    scenario:
      "While driving on the N1 in the Karoo near Beaufort West, you see a large dust storm approaching from the side of the road. Visibility is rapidly decreasing as dust envelops the highway.",
    question:
      "What is the safest action to take when encountering a dust storm?",
    options: [
      "Speed up to get through the dust storm as quickly as possible",
      "Stop immediately where you are on the highway with hazard lights on",
      "Reduce speed, turn on lights, and pull completely off the roadway if possible",
      "Keep driving at normal speed but sound your horn periodically",
    ],
    correct: 2,
    explanation:
      "When encountering a dust storm, reduce speed immediately, turn on your headlights (not hazard lights while moving), and if visibility becomes too poor to proceed safely, pull completely off the roadway (not just onto the shoulder if possible). Once stopped, turn off all lights, set the parking brake, keep seatbelts fastened, turn off the engine, and stay in the vehicle. Dust storms in the Karoo can reduce visibility to near zero and create dangerous multi-vehicle accidents if drivers remain on the roadway.",
    difficulty: "advanced",
    context: "rural",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC116",
    category: "controls",
    title: "Wet Road Braking Distance",
    scenario:
      "You're driving on a wet N2 near Port Elizabeth after a brief shower. The speed limit is 120 km/h, but the road surface is visibly wet and there's light traffic.",
    question:
      "How should you adjust your following distance in these wet conditions?",
    options: [
      "Maintain the standard 2-second following distance",
      "Increase to a 3-second following distance",
      "Double your following distance to at least 4 seconds",
      "Following distance doesn't need adjustment, just drive more alertly",
    ],
    correct: 2,
    explanation:
      "On wet roads, stopping distances can increase by up to 50% or more compared to dry conditions. You should at least double your following distance from the standard 2 seconds to a minimum of 4 seconds. This provides crucial additional time and space to react and stop safely if the vehicle ahead brakes suddenly. The 'only a fool breaks the two-second rule' rhyme should be adjusted to 'only a fool breaks the four-second rule' in wet conditions.",
    difficulty: "intermediate",
    context: "rural",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC117",
    category: "signs",
    title: "Western Cape Snow Warning",
    scenario:
      "You're driving on the N1 near Touws River in the Western Cape when you see a temporary warning sign indicating 'Snow Ahead - Caution.' The temperature is near freezing.",
    question: "What precautions should you take after seeing this warning?",
    options: [
      "Continue at normal speed but be prepared to see snow",
      "Reduce speed, increase following distance, and watch for ice especially on bridges",
      "Turn around and avoid the area completely",
      "Stop and put on snow chains immediately regardless of road conditions",
    ],
    correct: 1,
    explanation:
      "Snow warnings in South African mountain passes should be taken seriously. Reduce your speed significantly, increase your following distance, and be especially cautious on bridges and in shaded areas where ice may form even if the main road appears clear. Watch for changing road texture that might indicate black ice. Most South African vehicles are not equipped with winter tires, making standard safety margins inadequate for these rare but dangerous conditions.",
    difficulty: "advanced",
    context: "rural",
    weather: "snow",
    language: "en",
  },
  {
    id: "SC118",
    category: "mixed",
    title: "Highveld Lightning Storm",
    scenario:
      "You're driving on the R21 near Kempton Park during a severe Highveld electrical storm. There's intense lightning, heavy rain, and poor visibility. You're concerned about lightning striking your vehicle.",
    question:
      "What is the safest approach regarding lightning while in your vehicle?",
    options: [
      "Exit the vehicle and lie flat on the ground away from the car",
      "Pull over under trees for protection from lightning",
      "Stay inside the vehicle as it provides protection from lightning",
      "Open all windows to equalize electrical pressure inside and outside",
    ],
    correct: 2,
    explanation:
      "During a lightning storm, your vehicle provides good protection through the principle of a 'Faraday cage' effect where the metal body conducts electricity around the cabin, not through it. You should stay inside the vehicle, keep windows fully closed, avoid touching metal components, and if possible, pull over safely away from trees or high objects until the worst of the storm passes. Don't exit the vehicle during an active lightning storm as this puts you at much greater risk.",
    difficulty: "intermediate",
    context: "urban",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC119",
    category: "rules",
    title: "Durban Coastal Rainfall",
    scenario:
      "You're driving on the M4 coastal highway in Durban during extremely heavy tropical rainfall. Water is pooling on the road, your windshield wipers are at maximum speed, and visibility is poor.",
    question:
      "What is the appropriate speed adjustment for these severe conditions?",
    options: [
      "Reduce speed by approximately 10-20% below the limit",
      "Reduce speed by at least 50% of the posted limit",
      "Maintain the speed limit to avoid being rear-ended",
      "Pull over immediately regardless of location",
    ],
    correct: 1,
    explanation:
      "In extremely heavy rainfall with poor visibility and water pooling on the road, you should reduce your speed by at least 50% of the posted limit. Durban's tropical downpours can create dangerous driving conditions very quickly. The standard advice of reducing speed by just 10-20% is inadequate for severe conditions. Only pull over if you can find a safe location completely off the roadway, otherwise proceed at a greatly reduced speed with headlights on (not hazard lights while moving).",
    difficulty: "intermediate",
    context: "urban",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC120",
    category: "mixed",
    title: "High Wind Bridge Crossing",
    scenario:
      "You're approaching the Van Stadens Bridge on the N2 near Port Elizabeth in your small sedan during very strong coastal winds. There are wind warning signs posted.",
    question: "How should you cross the bridge safely in high winds?",
    options: [
      "Increase speed to cross the bridge quickly and minimize wind exposure time",
      "Wait for a large truck and follow closely behind it using it as a wind block",
      "Reduce speed significantly, grip the steering wheel firmly, and maintain lane position",
      "Cross in neutral gear to prevent wind affecting engine performance",
    ],
    correct: 2,
    explanation:
      "When crossing bridges in high winds, reduce your speed significantly, grip the steering wheel firmly with both hands, and focus on maintaining your lane position. Be prepared for sudden gusts as you move from protected to exposed areas at the start of the bridge. Leave extra space around your vehicle, particularly from high-sided vehicles like trucks which may be affected more severely by crosswinds. Small sedans are particularly vulnerable to being pushed by strong lateral winds on exposed bridges.",
    difficulty: "advanced",
    context: "rural",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC121",
    category: "signs",
    title: "Free State Black Frost Warning",
    scenario:
      "You're driving on the N6 near Aliwal North in the Free State early morning when you see a temporary warning sign for 'Black Ice/Black Frost.' The temperature is just above freezing.",
    question: "What does this warning mean and how should you respond?",
    options: [
      "Warning about dark patches of normal ice; drive cautiously around visible dark spots",
      "Warning about frozen exhaust emissions; no special action required",
      "Warning about invisible ice on the road surface; reduce speed significantly and avoid sudden maneuvers",
      "Warning only relevant for black vehicles; continue normally if driving another color vehicle",
    ],
    correct: 2,
    explanation:
      "Black ice (sometimes called black frost in South Africa) refers to a thin, transparent layer of ice on the road surface that's nearly invisible, making the road look merely wet or even dry. It's extremely dangerous as it provides almost no traction. You should reduce your speed significantly, avoid sudden braking, acceleration or steering, increase following distance substantially, and be especially cautious on bridges, shaded areas, and early mornings when temperatures are near freezing.",
    difficulty: "advanced",
    context: "rural",
    weather: "clear",
    timeOfDay: "morning",
    language: "en",
  },
  {
    id: "SC122",
    category: "mixed",
    title: "Berg Wind Conditions",
    scenario:
      "You're driving on the N2 near Plettenberg Bay during strong Berg wind conditions. The air is hot and dusty, visibility is somewhat reduced, and there are occasional gusts affecting your vehicle stability.",
    question:
      "What additional hazards should you be prepared for during Berg wind conditions?",
    options: [
      "Increased chance of vehicle overheating only",
      "Higher risk of veld fires near the road and smoke hazards",
      "Lower risk of accidents as roads are drier",
      "No special hazards beyond normal windy conditions",
    ],
    correct: 1,
    explanation:
      "Berg winds in the Southern Cape create hot, dry conditions that significantly increase fire danger. When driving during Berg wind conditions, be alert for veld fires near roadways, sudden smoke across the road reducing visibility, emergency vehicles, and evacuating residents. If you encounter smoke crossing the road, slow down significantly and be prepared to stop if visibility becomes too poor. Also watch for debris blown onto the road and maintain a firm grip on the steering wheel to counter unexpected gusts.",
    difficulty: "intermediate",
    context: "rural",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC123",
    category: "controls",
    title: "Foggy Mountain Pass Lights",
    scenario:
      "You're driving through Tradouw Pass between Barrydale and Swellendam in dense mountain fog with visibility under 30 meters. You need to use your vehicle's lights appropriately.",
    question:
      "Which lighting combination is most appropriate for these foggy conditions?",
    options: [
      "High beam headlights and hazard lights",
      "Low beam headlights only",
      "Low beam headlights and front fog lights if equipped",
      "High beam headlights only",
    ],
    correct: 2,
    explanation:
      "In fog, the most appropriate lighting combination is low beam headlights and front fog lights (if equipped). High beams reflect off the fog particles back into your eyes, reducing rather than improving visibility. Hazard lights should only be used when stationary or moving extremely slowly in emergency situations, not for normal driving in fog. Rear fog lights (if equipped) should be used in very dense fog to make your vehicle more visible from behind.",
    difficulty: "intermediate",
    context: "rural",
    weather: "fog",
    language: "en",
  },
  {
    id: "SC124",
    category: "mixed",
    title: "Flash Flood Warning",
    scenario:
      "You're driving on the R40 near Hazyview during the rainy season when you hear a weather alert on the radio warning of flash flood conditions for the area you're traveling through.",
    question:
      "What is the most appropriate response to this flash flood warning?",
    options: [
      "Continue your journey but drive faster to get through the area quickly",
      "Pull over at the next town or service station and wait for updated information",
      "Ignore the warning unless you actually see flooding on the road",
      "Call emergency services to come escort you through the area",
    ],
    correct: 1,
    explanation:
      "When you receive a flash flood warning for your current location, the safest response is to pull over at the next safe place (town, service station, or rest area - not the side of the road) and wait for updated information. Flash floods can develop rapidly, particularly in mountainous areas like Mpumalanga, making roads impassable or washed away with little warning. Check weather apps, call the local traffic authority, or listen to radio updates before deciding whether to continue your journey or seek alternate routes.",
    difficulty: "advanced",
    context: "rural",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC125",
    category: "rules",
    title: "Headlight Use in Daytime Rain",
    scenario:
      "You're driving on Oxford Road in Johannesburg during a daytime rainstorm. Visibility is reduced due to the heavy rain and spray from other vehicles.",
    question:
      "According to South African road regulations, should you use headlights in this situation?",
    options: [
      "No, headlights are only legally required after sunset",
      "Yes, low beam headlights are legally required in reduced visibility conditions",
      "No, but hazard lights should be used instead",
      "Only if visibility drops below 100 meters",
    ],
    correct: 1,
    explanation:
      "According to South African road regulations (National Road Traffic Act), headlights are legally required not only at night but in any conditions of reduced visibility, including rain, fog, snow, or dust, regardless of the time of day. Low beam headlights should be used in daytime rain to make your vehicle more visible to others and to improve your vision. Hazard lights should only be used when stationary or in emergency situations, not for driving in rain.",
    difficulty: "basic",
    context: "urban",
    weather: "rain",
    timeOfDay: "afternoon",
    language: "en",
  },
  {
    id: "SC126",
    category: "controls",
    title: "Demisting Windscreen",
    scenario:
      "You're driving in Durban during humid weather when your windscreen suddenly starts fogging up from the inside, reducing visibility. You need to clear it quickly while still driving.",
    question:
      "What is the most effective way to quickly clear a fogged interior windscreen while driving?",
    options: [
      "Open all windows fully regardless of outside weather",
      "Turn air conditioning on, set to hot air, and direct airflow to the windscreen",
      "Wipe the windscreen continuously with your hand while driving",
      "Use the windscreen wipers with washer fluid",
    ],
    correct: 1,
    explanation:
      "To quickly clear a fogged interior windscreen while driving, turn on the air conditioning (which removes moisture from the air), set the temperature to hot, and direct airflow to the windscreen. This combination of dry, hot air will rapidly clear condensation from the inside of the glass. Opening windows slightly can help in some conditions but isn't as effective as the AC method. Windscreen wipers only clear the exterior surface. If possible, pull over safely first to clear the windscreen before continuing.",
    difficulty: "basic",
    context: "urban",
    weather: "clear",
    language: "en",
  },
  // ADDITIONAL UNIQUE SOUTH AFRICAN SCENARIOS (SC127-SC156)
  {
    id: "SC127",
    category: "mixed",
    title: "Baboon Roadblock in Cape Peninsula",
    scenario:
      "You're driving on Chapman's Peak Drive near Cape Town when a troop of baboons blocks the road. Some are sitting on your car, and tourists are getting out of their vehicles to take photos.",
    question: "What is the safest action when encountering baboons on the road?",
    options: [
      "Get out and shoo the baboons away",
      "Honk continuously to scare them off",
      "Stay in your vehicle and wait patiently for them to move",
      "Drive slowly through the troop",
    ],
    correct: 2,
    explanation:
      "When encountering baboons, never leave your vehicle or feed them. Stay inside, keep windows closed, and wait patiently. Baboons can be aggressive and may damage your car if provoked. Never honk as this can agitate them further.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC128",
    category: "rules",
    title: "Informal Settlement Children at Play",
    scenario:
      "You're driving through an informal settlement near Alexandra, Johannesburg. Children are playing soccer in the street, and there are no proper sidewalks or playing areas.",
    question: "How should you navigate through informal settlements with children playing?",
    options: [
      "Drive at normal speed and honk to clear the way",
      "Reduce speed significantly and be prepared to stop completely",
      "Avoid the area completely",
      "Flash your lights to warn the children",
    ],
    correct: 1,
    explanation:
      "In informal settlements, reduce speed to walking pace and be extremely vigilant. Children may not be aware of traffic dangers, and space is limited. Be prepared to stop completely and show patience and understanding for the community.",
    difficulty: "advanced",
    context: "residential",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC129",
    category: "controls",
    title: "Pothole Minefield on R25",
    scenario:
      "You're driving on the R25 between Johannesburg and Bronkhorstspruit, and the road is severely damaged with large potholes. Some are unavoidable in your lane.",
    question: "What's the best technique for navigating severe potholes?",
    options: [
      "Speed up to bounce over them quickly",
      "Swerve aggressively to avoid all potholes",
      "Slow down significantly and drive as straight as possible through unavoidable ones",
      "Brake hard just before each pothole",
    ],
    correct: 2,
    explanation:
      "Slow down significantly when approaching potholes. If unavoidable, drive straight through rather than swerving dangerously. Braking hard just before a pothole can cause more damage. Maintain steady speed through the pothole to minimize impact.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC130",
    category: "mixed",
    title: "Spaza Shop Chaos in Soweto",
    scenario:
      "You're driving through Soweto when you encounter a busy spaza shop area. People are carrying large items, children are running between cars, and taxis are stopping randomly to drop off customers.",
    question: "How should you drive through busy informal commercial areas?",
    options: [
      "Drive quickly to get through the chaos",
      "Honk continuously to clear a path",
      "Drive very slowly and be prepared to stop frequently",
      "Take a different route to avoid the area",
    ],
    correct: 2,
    explanation:
      "In busy informal commercial areas, drive at walking pace and be extremely patient. People may be carrying heavy loads and children are unpredictable. Frequent stopping is normal in these areas, so maintain extra vigilance.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC131",
    category: "signs",
    title: "Stolen Street Signs in Hillbrow",
    scenario:
      "You're navigating through Hillbrow, Johannesburg, and notice that many street signs and traffic signs have been stolen or vandalized, making navigation difficult.",
    question: "What should you do when street signage is missing or damaged?",
    options: [
      "Continue driving normally using GPS only",
      "Slow down significantly and use extra caution at all intersections",
      "Turn around and find another route",
      "Ask pedestrians for directions while driving",
    ],
    correct: 1,
    explanation:
      "When signage is missing, slow down and treat all intersections with extreme caution. Use GPS as a guide but don't rely on it entirely. Be prepared to stop frequently to assess road conditions and right of way.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC132",
    category: "controls",
    title: "Donkey Cart on N14",
    scenario:
      "You're driving on the N14 near Ventersdorp when you encounter a donkey cart moving slowly in your lane. The road is single-lane with oncoming traffic visible in the distance.",
    question: "How should you handle overtaking a donkey cart on a busy road?",
    options: [
      "Honk and tailgate until they move aside",
      "Overtake immediately regardless of oncoming traffic",
      "Slow down, maintain safe distance, and overtake only when completely safe",
      "Flash your lights continuously",
    ],
    correct: 2,
    explanation:
      "Donkey carts have as much right to use the road as motor vehicles in rural areas. Maintain a safe following distance, be patient, and only overtake when you can see the road is completely clear for a sufficient distance.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC133",
    category: "rules",
    title: "Traditional Healer Ceremony Road Closure",
    scenario:
      "You encounter a traditional ceremony taking place across a rural road near Limpopo. Community members are gathered, and the road is temporarily blocked by the cultural event.",
    question: "What is the appropriate response to traditional ceremonies blocking roads?",
    options: [
      "Honk and drive through the ceremony",
      "Get out and complain about the inconvenience",
      "Respectfully wait for the ceremony to conclude or ask for guidance",
      "Call the police to clear the road",
    ],
    correct: 2,
    explanation:
      "Show respect for cultural and traditional ceremonies. Wait patiently or politely approach an elder to ask if there's an alternative route. These ceremonies are important cultural events and deserve respect.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC134",
    category: "mixed",
    title: "Fuel Shortage Queue at Garage",
    scenario:
      "You arrive at a petrol station in Kimberley during a fuel shortage. There's a long queue of vehicles, some drivers are getting aggressive, and the queue extends into the road.",
    question: "How should you handle fuel shortage situations at petrol stations?",
    options: [
      "Cut into the queue to save time",
      "Argue with other drivers about queue positions",
      "Join the queue patiently and keep vehicles moving safely",
      "Block traffic by parking in the road while waiting",
    ],
    correct: 2,
    explanation:
      "During fuel shortages, patience and courtesy are essential. Join the proper queue, help keep traffic flowing, and avoid blocking roads. Aggressive behavior only makes the situation worse for everyone.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC135",
    category: "controls",
    title: "Flooding on Low Water Bridge",
    scenario:
      "You approach a low water bridge near Rustenburg after heavy rains. Water is flowing over the bridge, but you can see the road surface underneath. Other drivers are crossing slowly.",
    question: "What is the safest approach when crossing flooded low water bridges?",
    options: [
      "Speed up to get across quickly before water gets deeper",
      "Test the depth slowly and cross at steady, slow speed if safe",
      "Follow closely behind other vehicles",
      "Wait for the water to completely recede",
    ],
    correct: 1,
    explanation:
      "Test depth carefully by moving forward slowly. If water is not deeper than your vehicle's clearance and you can see the road, cross at steady slow speed. Never speed through water as this can cause loss of control.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en",
  },
  {
    id: "SC136",
    category: "signs",
    title: "Multilingual Road Signs in KwaZulu-Natal",
    scenario:
      "You're driving in rural KwaZulu-Natal and encounter road signs in Zulu, English, and Afrikaans. Some signs are faded, and you're unsure of the local language meanings.",
    question: "How should you interpret multilingual or unclear road signs?",
    options: [
      "Ignore signs you can't read",
      "Guess the meaning based on context",
      "Look for English translations or symbols, and err on the side of caution",
      "Ask local pedestrians while driving",
    ],
    correct: 2,
    explanation:
      "Always look for English translations or universal symbols on multilingual signs. When in doubt, err on the side of caution by reducing speed and being extra vigilant. Stop safely to ask for clarification if needed.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC137",
    category: "mixed",
    title: "Graduation Day Traffic at University",
    scenario:
      "You're driving near the University of Cape Town on graduation day. There are families with traditional attire, photographers in the road, and extreme congestion around the campus.",
    question: "How should you navigate university areas during special events?",
    options: [
      "Honk to get people out of the road",
      "Drive slowly and patiently, allowing extra time for celebrations",
      "Use the university grounds as a shortcut",
      "Complain to security about the congestion",
    ],
    correct: 1,
    explanation:
      "During university celebrations, show patience and respect for families celebrating important milestones. Drive slowly, allow extra time, and be courteous to pedestrians in celebratory attire.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC138",
    category: "rules",
    title: "Meter Taxi vs Uber Conflict",
    scenario:
      "You're stopped at traffic lights in Cape Town CBD when a dispute breaks out between a metered taxi driver and an Uber driver over passengers. The argument is blocking traffic.",
    question: "What should you do when witnessing taxi industry conflicts?",
    options: [
      "Get involved to help resolve the dispute",
      "Honk to break up the argument",
      "Change lanes safely and avoid the conflict area",
      "Take photos of the incident",
    ],
    correct: 2,
    explanation:
      "Taxi industry conflicts can escalate quickly. Safely change lanes to avoid the area, don't get involved, and continue on your route. Report serious incidents to authorities if necessary, but prioritize your safety.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC139",
    category: "controls",
    title: "Sandstorm on N10 Karoo",
    scenario:
      "You're driving on the N10 through the Karoo when a sudden sandstorm reduces visibility to less than 10 meters. Wind is buffeting your vehicle strongly.",
    question: "What is the correct response to driving in a sandstorm?",
    options: [
      "Speed up to get through it quickly",
      "Stop immediately in your lane",
      "Pull off the road safely, turn on hazards, and wait",
      "Follow the tail lights of the vehicle ahead closely",
    ],
    correct: 2,
    explanation:
      "In severe sandstorms, pull completely off the road if possible, turn on hazard lights, and wait for conditions to improve. Never stop in your lane or follow other vehicles closely in zero visibility.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en",
  },
  {
    id: "SC140",
    category: "mixed",
    title: "Election Day Rally Traffic",
    scenario:
      "You're driving through central Polokwane during election season when a political rally is ending. Supporters in party colors are marching, singing, and some are in the road.",
    question: "How should you navigate through political rally areas?",
    options: [
      "Drive through quickly showing support for one party",
      "Remain neutral, drive slowly and patiently",
      "Honk your horn to show disapproval",
      "Argue with supporters about politics",
    ],
    correct: 1,
    explanation:
      "During political events, remain completely neutral and respectful. Drive slowly and patiently, allowing demonstrators to exercise their democratic rights. Avoid any political displays or commentary from your vehicle.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC141",
    category: "signs",
    title: "Game Reserve Warning Signs",
    scenario:
      "You're driving on the R536 near Kruger National Park when you see multiple wildlife warning signs including elephant, lion, and hippo crossings within a few kilometers.",
    question: "How should you adjust your driving near game reserves?",
    options: [
      "Only slow down if you actually see animals",
      "Reduce speed significantly and stay highly alert",
      "Honk continuously to scare animals away",
      "Drive normally as animals avoid roads",
    ],
    correct: 1,
    explanation:
      "Near game reserves, reduce speed significantly and remain highly alert. Large animals can appear suddenly and cause fatal accidents. Never honk as this may provoke dangerous animals or stampede herds.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "evening",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC142",
    category: "controls",
    title: "Steep Mountain Pass Descent",
    scenario:
      "You're descending the steep Van Reenen's Pass on the N3 in a heavily loaded bakkie. Your brakes are starting to smell hot, and there's a runaway truck lane ahead.",
    question: "What should you do when brakes overheat on a steep descent?",
    options: [
      "Continue using brakes and pour water on them at the bottom",
      "Use the runaway truck lane to stop safely",
      "Shift to a lower gear and reduce brake use",
      "Put the vehicle in neutral to cool the brakes",
    ],
    correct: 1,
    explanation:
      "If brakes are overheating and there's a runaway truck lane available, use it immediately. This is exactly what these lanes are designed for. Never put a vehicle in neutral on a steep descent as you'll lose engine braking.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC143",
    category: "mixed",
    title: "Stokvel Meeting Traffic",
    scenario:
      "You're driving through a residential area in Soweto on a Saturday afternoon when a large stokvel meeting is ending. Many people are walking to their cars carrying money and discussing business.",
    question: "How should you behave around community financial gatherings?",
    options: [
      "Drive quickly through the area",
      "Observe people carrying money and report suspicious activity",
      "Drive slowly and respectfully, avoiding unnecessary attention",
      "Offer lifts to people walking",
    ],
    correct: 2,
    explanation:
      "Around community financial gatherings, drive slowly and respectfully. Avoid drawing attention to yourself or appearing to observe people's business. These are legitimate community financial activities that deserve privacy and respect.",
    difficulty: "basic",
    context: "residential",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC144",
    category: "rules",
    title: "Hostel Taxi Violence Area",
    scenario:
      "You're driving near a hostel complex in KwaZulu-Natal when you notice increased police presence and what appears to be tension between different taxi associations in the area.",
    question: "How should you navigate areas with taxi violence or tension?",
    options: [
      "Drive normally as it doesn't affect you",
      "Take an alternative route if possible and avoid the area",
      "Slow down to observe what's happening",
      "Report everything you see to police",
    ],
    correct: 1,
    explanation:
      "Taxi violence can be extremely dangerous for all road users. Take alternative routes when possible, avoid the area, and don't get involved or linger. Your safety is more important than saving time.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC145",
    category: "controls",
    title: "Overloaded Bakkie Handling",
    scenario:
      "You're driving a bakkie loaded with furniture and appliances for a house move in Pretoria. The load is properly secured but the vehicle is handling very differently than usual.",
    question: "How should you adjust your driving when your vehicle is heavily loaded?",
    options: [
      "Drive normally as the load is secure",
      "Increase speed to maintain momentum",
      "Reduce speed, increase following distance, and brake earlier",
      "Use higher gears to reduce engine strain",
    ],
    correct: 2,
    explanation:
      "Heavy loads significantly change vehicle handling. Reduce speed, increase following distance, brake earlier and more gently, and take corners more slowly. Stopping distance increases dramatically with heavy loads.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC146",
    category: "signs",
    title: "Multilingual Stop Sign Confusion",
    scenario:
      "You're in rural Mpumalanga and encounter a stop sign with 'STOP' written in English, 'HALT' in Afrikaans, and 'YIMA' in Zulu. Some local drivers are treating it as a yield sign.",
    question: "How should you respond to multilingual stop signs?",
    options: [
      "Follow what other local drivers are doing",
      "Come to a complete stop regardless of the language",
      "Only stop if it says 'STOP' in English",
      "Treat it as a yield sign if locals do",
    ],
    correct: 1,
    explanation:
      "A stop sign is legally binding regardless of the language used. Always come to a complete stop, even if local drivers are not following the rule correctly. Traffic laws apply consistently across all languages.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC147",
    category: "mixed",
    title: "Clinic Emergency Vehicle Priority",
    scenario:
      "You're driving in a rural area near Tzaneen when an ambulance approaches from behind, but the road is too narrow to pull over safely. There's a cliff on one side and a deep ditch on the other.",
    question: "What should you do when you can't safely pull over for emergency vehicles?",
    options: [
      "Stop where you are and let them figure it out",
      "Speed up to find a safe place to pull over",
      "Drive off the road regardless of safety",
      "Continue at normal speed",
    ],
    correct: 1,
    explanation:
      "When you can't immediately pull over safely, speed up moderately to find the next safe opportunity (wide shoulder, driveway, etc.) and then pull over. Communicate your intentions with hazard lights if possible.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC148",
    category: "controls",
    title: "Township Speed Humps Navigation",
    scenario:
      "You're driving through Khayelitsha in Cape Town where there are numerous unmarked speed humps of varying heights and conditions. Some are damaged and create sharp jolts.",
    question: "What's the best technique for navigating township speed humps?",
    options: [
      "Speed up to bounce over them quickly",
      "Slow down significantly and take each one carefully",
      "Swerve around damaged ones",
      "Follow other vehicles' tire tracks exactly",
    ],
    correct: 1,
    explanation:
      "Slow down significantly for all speed humps, even if they appear small. Township speed humps can be inconsistent in height and condition. Taking them carefully protects your vehicle and ensures passenger safety.",
    difficulty: "intermediate",
    context: "residential",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC149",
    category: "rules",
    title: "Heritage Day Cultural Procession",
    scenario:
      "You encounter a Heritage Day cultural procession in central Durban with people in traditional Zulu attire, drummers, and dancers proceeding slowly down the main road.",
    question: "What is the appropriate response to cultural processions on public roads?",
    options: [
      "Honk to get them to move faster",
      "Drive through gaps in the procession",
      "Follow behind respectfully at their pace",
      "Take a photo while driving",
    ],
    correct: 2,
    explanation:
      "Cultural processions have the right to use public roads for traditional ceremonies. Follow behind respectfully, allow them to proceed at their pace, and show appreciation for cultural diversity. Taking photos while driving is dangerous.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC150",
    category: "mixed",
    title: "Farm Worker Transport Breakdown",
    scenario:
      "You encounter a broken-down truck full of farm workers on the R37 near Nelspruit. Workers are standing by the roadside in the hot sun, and some are trying to flag down vehicles for help.",
    question: "How should you respond to stranded farm workers?",
    options: [
      "Ignore them as it's not your responsibility",
      "Stop and offer a lift to as many as possible",
      "Call emergency services and continue driving safely",
      "Give them money and continue driving",
    ],
    correct: 2,
    explanation:
      "The safest approach is to call emergency services or roadside assistance on their behalf, then continue driving safely. Stopping to pick up multiple strangers can be dangerous, but showing concern by getting them help is appropriate.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC151",
    category: "controls",
    title: "Gravel Road Dust Cloud Overtaking",
    scenario:
      "You're on a gravel road near Upington following a truck that's creating a massive dust cloud. You can't see oncoming traffic, but the truck is moving very slowly.",
    question: "How should you handle overtaking in dusty conditions on gravel roads?",
    options: [
      "Overtake quickly while you can't see oncoming traffic",
      "Follow closely to reduce the dust gap",
      "Drop back to improve visibility, then overtake only when you can see clearly",
      "Sound your horn continuously while overtaking",
    ],
    correct: 2,
    explanation:
      "On dusty gravel roads, drop back to get clear visibility before attempting to overtake. Never overtake when you can't see oncoming traffic. Patience is essential for safety on gravel roads.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC152",
    category: "signs",
    title: "Temporary Diversion Through Squatter Camp",
    scenario:
      "Road construction has created a temporary diversion that routes traffic through an informal settlement near East London. There are handwritten signs and no official road markings.",
    question: "How should you navigate temporary diversions through informal settlements?",
    options: [
      "Drive at normal speed following the signs",
      "Ignore informal signs and find your own route",
      "Drive very slowly and be extra cautious of pedestrians",
      "Refuse to use the diversion and turn back",
    ],
    correct: 2,
    explanation:
      "In informal settlements, drive very slowly regardless of signage. Be extremely cautious of children, pedestrians, and narrow spaces. Show respect for the community you're passing through.",
    difficulty: "advanced",
    context: "residential",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC153",
    category: "mixed",
    title: "Power Line Theft Crime Scene",
    scenario:
      "You're driving on the R114 near Centurion when you see police investigating power line theft. There are cables across the road and officers directing traffic around the scene.",
    question: "How should you behave at infrastructure crime scenes?",
    options: [
      "Stop and ask police what happened",
      "Take photos of the crime scene",
      "Follow police directions quietly and continue",
      "Offer to help with the investigation",
    ],
    correct: 2,
    explanation:
      "At crime scenes, follow police directions quietly and continue on your way. Don't stop to ask questions, take photos, or interfere with the investigation. Police need space to work safely.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC154",
    category: "controls",
    title: "Minibus Taxi Loading Techniques",
    scenario:
      "You're driving a minibus taxi in Johannesburg and need to stop to pick up passengers. There's moderate traffic, and passengers are running to catch your taxi.",
    question: "What's the safest way to stop a minibus taxi for passenger loading?",
    options: [
      "Stop suddenly wherever passengers are waiting",
      "Signal early, check mirrors, and stop in a designated taxi stop area",
      "Let passengers jump on while moving slowly",
      "Stop in traffic lanes to load quickly",
    ],
    correct: 1,
    explanation:
      "Always signal early, check mirrors for other vehicles, and stop in designated taxi stop areas when possible. Passenger safety and traffic flow are both important considerations.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC155",
    category: "rules",
    title: "Border Post Queue Management",
    scenario:
      "You're approaching the Beitbridge border post with Zimbabwe. There's a massive queue of trucks and cars, some drivers are cutting in line, and tempers are rising in the heat.",
    question: "How should you behave in long border post queues?",
    options: [
      "Cut in line if you see an opportunity",
      "Get out and argue with queue jumpers",
      "Join the proper queue and wait patiently despite delays",
      "Pay someone to hold your place in line",
    ],
    correct: 2,
    explanation:
      "At border posts, patience and proper queuing are essential. Join the correct queue and wait despite long delays. Cutting lines or paying for positions can lead to conflicts and delays for everyone.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  {
    id: "SC156",
    category: "mixed",
    title: "Community Protest Road Closure",
    scenario:
      "You encounter a peaceful community protest in Mamelodi, Pretoria, where residents are marching for better service delivery. The main road is blocked, but protesters are directing traffic to side streets.",
    question: "How should you respond to peaceful community protests affecting traffic?",
    options: [
      "Honk and demand they clear the road",
      "Drive through the protest anyway",
      "Follow their directions respectfully and use alternative routes",
      "Call police to break up the protest",
    ],
    correct: 2,
    explanation:
      "Peaceful protests are a democratic right. Follow protesters' traffic directions respectfully, use alternative routes they suggest, and show understanding for community concerns. Avoid confrontation or disruption.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en",
  },
  // ADDITIONAL GROK-GENERATED SCENARIOS (SC157-SC206)
  {
    id: "SC157",
    category: "controls",
    title: "Mirror Check in Alexandra Township",
    scenario: "You're driving through Alexandra, Johannesburg, on a narrow street near a busy spaza shop. A group of children playing soccer suddenly kick a ball toward the road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to warn the children",
      "Check mirrors and slow down",
      "Swerve to avoid the ball",
      "Accelerate to pass quickly"
    ],
    correct: 1,
    explanation: "Check your mirrors and slow down to assess the situation and avoid hitting the children or the ball. Hooting may startle them, and swerving or accelerating is unsafe in a crowded township.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC158",
    category: "signs",
    title: "Yield Sign in Cape Town's Bo-Kaap",
    scenario: "You're driving on Wale Street in Bo-Kaap, Cape Town, during a cultural festival. A yield sign is posted at an intersection, and a minibus taxi is approaching from the right.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the taxi and check for pedestrians",
      "Hoot to assert your position",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "A yield sign requires you to give way to vehicles from the right. Yield to the taxi and check for festival pedestrians to ensure safety.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC159",
    category: "rules",
    title: "Parking Near a Johannesburg Taxi Rank",
    scenario: "You're on Bree Street in Johannesburg's CBD near a busy taxi rank. You want to park, but a 'No Parking' sign is posted during peak hours.",
    question: "What should you do in this situation?",
    options: [
      "Park briefly to drop off a passenger",
      "Find an alternative parking area",
      "Hoot to clear the taxi rank",
      "Ignore the sign if no taxis are nearby"
    ],
    correct: 1,
    explanation: "A 'No Parking' sign prohibits parking during specified hours. You must find an alternative parking area to comply with traffic rules and avoid congestion near the taxi rank.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC160",
    category: "mixed",
    title: "Navigating a Soweto Street Market",
    scenario: "You're driving on Vilakazi Street in Soweto, Johannesburg, during a weekend street market. A minibus taxi stops suddenly to drop off passengers, and vendors are crossing the road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to clear the vendors",
      "Slow down and wait for a safe gap",
      "Overtake the taxi immediately",
      "Reverse to avoid the market"
    ],
    correct: 1,
    explanation: "In a busy market area, slow down and wait for a safe gap to avoid collisions with vendors and the taxi. Hooting, overtaking, or reversing is unsafe in a crowded space.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC161",
    category: "controls",
    title: "Three-Point Turn in Rondebosch",
    scenario: "You're performing a three-point turn on a narrow residential street in Rondebosch, Cape Town. A bakkie approaches from behind, and children are playing nearby.",
    question: "What should you do in this situation?",
    options: [
      "Complete the turn quickly",
      "Check mirrors and pause if necessary",
      "Hoot to warn the bakkie",
      "Abandon the turn and drive away"
    ],
    correct: 1,
    explanation: "During a three-point turn, check mirrors and pause if vehicles or pedestrians are near to ensure safety. Completing the turn quickly or hooting is unsafe, and abandoning the maneuver may not be necessary.",
    difficulty: "intermediate",
    context: "residential",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC162",
    category: "signs",
    title: "No Overtaking in Sandton",
    scenario: "You're driving on West Street in Sandton, Johannesburg, behind a slow-moving delivery van. A 'No Overtaking' sign is posted due to a nearby construction zone.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the van if the road is clear",
      "Maintain a safe following distance",
      "Hoot to urge the van to speed up",
      "Pull over to wait for the van to pass"
    ],
    correct: 1,
    explanation: "A 'No Overtaking' sign prohibits overtaking. Maintain a safe following distance behind the van until it's safe and legal to overtake after the construction zone.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC163",
    category: "rules",
    title: "Right of Way in Pretoria CBD",
    scenario: "You're at a four-way stop on Church Street in Pretoria's CBD. A minibus taxi from the left proceeds out of turn, and a pedestrian is crossing from the right.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're next in line",
      "Wait for the pedestrian and intersection to clear",
      "Hoot to warn the taxi",
      "Follow the taxi immediately"
    ],
    correct: 1,
    explanation: "At a four-way stop, wait for the pedestrian and ensure the intersection is clear, even if the taxi moves out of turn, to prioritize safety.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC164",
    category: "mixed",
    title: "Load Shedding at a Randburg Intersection",
    scenario: "You're driving on Malibongwe Drive in Randburg, Johannesburg, at night during load shedding, and the robots are out. A group of street vendors are crossing the intersection.",
    question: "What should you do in this situation?",
    options: [
      "Proceed cautiously through the intersection",
      "Stop and yield to the vendors",
      "Hoot to clear the intersection",
      "Flash your lights to warn the vendors"
    ],
    correct: 1,
    explanation: "With robots out, treat the intersection as a four-way stop. Stop and yield to the vendors to ensure their safety before proceeding.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC165",
    category: "controls",
    title: "Clutch Control in Cape Town's Sea Point",
    scenario: "You're in a manual car on Main Road in Sea Point, Cape Town, during heavy traffic after a beach event. You need to move forward slowly on a slight incline.",
    question: "What should you do in this situation?",
    options: [
      "Keep the clutch pressed and accelerate",
      "Use clutch control with the handbrake",
      "Shift to neutral and coast",
      "Hoot to clear the traffic"
    ],
    correct: 1,
    explanation: "On an incline in traffic, use clutch control with the handbrake to move forward smoothly without rolling back or stalling. Other options are unsafe or ineffective.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC166",
    category: "signs",
    title: "Pedestrian Crossing in Fourways",
    scenario: "You're driving on Witkoppen Road in Fourways, Johannesburg, near a shopping mall. A pedestrian crossing sign is posted, and shoppers are waiting to cross.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass before they cross",
      "Stop and let the pedestrians cross",
      "Hoot to warn the pedestrians",
      "Wave the pedestrians to wait"
    ],
    correct: 1,
    explanation: "A pedestrian crossing sign requires you to stop and let pedestrians cross safely. Speeding up or hooting is unsafe, and waving pedestrians to wait is incorrect.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC167",
    category: "rules",
    title: "School Zone in Claremont",
    scenario: "You're driving on Main Road in Claremont, Cape Town, near a school during drop-off time. The speed limit is 40 km/h, and children are walking along the pavement.",
    question: "What should you do in this situation?",
    options: [
      "Maintain 60 km/h to keep up with traffic",
      "Reduce speed to 40 km/h and stay alert",
      "Hoot to warn the children",
      "Stop to let the children cross"
    ],
    correct: 1,
    explanation: "In a school zone, reduce speed to 40 km/h and stay alert for children who may cross unexpectedly. Maintaining a higher speed or hooting is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC168",
    category: "mixed",
    title: "Taxi Rank Chaos in Midrand",
    scenario: "You're driving on Old Pretoria Road in Midrand, Johannesburg, near a taxi rank. A minibus taxi pulls out suddenly, and pedestrians are crossing to nearby shops.",
    question: "What should you do in this situation?",
    options: [
      "Hoot and speed up to pass the taxi",
      "Slow down and yield to pedestrians",
      "Follow the taxi closely",
      "Reverse to avoid the area"
    ],
    correct: 1,
    explanation: "Slow down and yield to pedestrians while keeping a safe distance from the taxi. Hooting, following closely, or reversing is unsafe in a busy taxi rank area.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC169",
    category: "controls",
    title: "Emergency Stop in Green Point",
    scenario: "You're driving on Helen Suzman Boulevard in Green Point, Cape Town, when a cyclist swerves into your lane near the V&A Waterfront.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the cyclist",
      "Apply the brakes firmly to stop",
      "Hoot to warn the cyclist",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "Apply the brakes firmly to stop and avoid a collision with the cyclist. Swerving or hooting may not prevent an accident, and continuing to drive is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC170",
    category: "signs",
    title: "No Entry in Rosebank",
    scenario: "You're driving on Jan Smuts Avenue in Rosebank, Johannesburg, and want to turn into a side street but see a 'No Entry' sign.",
    question: "What should you do in this situation?",
    options: [
      "Enter the street if it's clear",
      "Find an alternative route",
      "Hoot to signal your intention",
      "Stop and wait for traffic to clear"
    ],
    correct: 1,
    explanation: "A 'No Entry' sign prohibits entering the street. You must find an alternative route to comply with traffic rules and avoid unsafe situations.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC171",
    category: "rules",
    title: "Robot Timing in Braamfontein",
    scenario: "You're approaching a robot on Jorissen Street in Braamfontein, Johannesburg, near Wits University. The robot turns amber as you're close to the intersection.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop if it's safe to do so",
      "Hoot to warn other drivers",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "An amber robot requires you to stop if it's safe to do so to avoid running a red light. Speeding up or continuing through is unsafe and against traffic rules.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC172",
    category: "controls",
    title: "Hill Start on the R34 Near Vryheid",
    scenario: "You're in a manual bakkie on the R34 near Vryheid, KwaZulu-Natal, stopped on a steep hill behind a tractor during a local farmers' market weekend.",
    question: "What should you do in this situation?",
    options: [
      "Release the clutch quickly to move",
      "Use the handbrake and clutch control",
      "Hoot to urge the tractor to move",
      "Shift to neutral and wait"
    ],
    correct: 1,
    explanation: "On a steep hill, use the handbrake and clutch control to start moving without rolling back. Other options could cause stalling or unsafe movement.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC173",
    category: "signs",
    title: "Wildlife Crossing on the N4",
    scenario: "You're driving on the N4 near Nelspruit, Mpumalanga, when you see a wildlife crossing sign indicating possible antelope. You spot movement in the bushes.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the animals away",
      "Slow down and prepare to stop",
      "Speed up to pass the area",
      "Continue driving at the same speed"
    ],
    correct: 1,
    explanation: "A wildlife crossing sign indicates potential animals on the road. Slow down and prepare to stop to avoid hitting antelope, ensuring safety for both animals and yourself.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC174",
    category: "rules",
    title: "Overtaking on the R61 Near Port St Johns",
    scenario: "You're on the R61 near Port St Johns, Eastern Cape, behind a slow-moving minibus taxi. The road has a broken line, but a sharp curve is ahead.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the taxi before the curve",
      "Wait until after the curve to overtake",
      "Hoot to urge the taxi to speed up",
      "Tailgate the taxi to pressure it"
    ],
    correct: 1,
    explanation: "Only overtake when it's safe and legal. Wait until after the curve to ensure clear visibility and avoid collisions, as overtaking near a curve is dangerous.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC175",
    category: "mixed",
    title: "Pothole Avoidance on the R573",
    scenario: "You're driving on the R573 near Hammanskraal, Gauteng, when you notice large potholes in the road. A truck is approaching from the opposite direction.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the potholes",
      "Slow down and navigate carefully",
      "Hoot to warn the truck",
      "Speed up to pass the potholes"
    ],
    correct: 1,
    explanation: "Slow down and navigate carefully to avoid potholes while staying aware of the oncoming truck. Swerving or speeding up could lead to loss of control or a collision.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC176",
    category: "controls",
    title: "Emergency Stop on the N2 Near Mthatha",
    scenario: "You're driving on the N2 near Mthatha, Eastern Cape, when a goat runs onto the road from a nearby kraal.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the goat",
      "Apply the brakes firmly to stop",
      "Hoot to scare the goat",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "Apply the brakes firmly to stop and avoid hitting the goat. Swerving or hooting may not prevent a collision, and continuing to drive is unsafe.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC177",
    category: "signs",
    title: "Gravel Road Warning on the R501",
    scenario: "You're driving on the R501 near Carletonville, Gauteng, when a sign indicates a gravel road ahead. The road is narrow, and a bakkie is approaching from the opposite direction.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Slow down and keep to the left",
      "Hoot to warn the bakkie",
      "Stop in the middle of the road"
    ],
    correct: 1,
    explanation: "On a gravel road, slow down and keep to the left to maintain control and avoid collisions with the oncoming bakkie. Maintaining speed or stopping in the middle is unsafe.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC178",
    category: "rules",
    title: "Right of Way on the R304",
    scenario: "You're approaching an unmarked intersection on the R304 near Stellenbosch, Western Cape. A tractor is approaching from the right on a dirt road.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the tractor on the right",
      "Hoot to warn the tractor",
      "Speed up to cross first"
    ],
    correct: 1,
    explanation: "At an unmarked intersection, the vehicle on the right has the right of way. Yield to the tractor to avoid a collision.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC179",
    category: "mixed",
    title: "Festival Traffic on the N1 Near Worcester",
    scenario: "You're driving on the N1 near Worcester, Western Cape, during a wine festival. Traffic is heavy, and a minibus taxi is weaving through lanes to pick up passengers.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Maintain a safe following distance",
      "Hoot to warn the taxi",
      "Follow the taxi closely"
    ],
    correct: 1,
    explanation: "In heavy traffic, maintain a safe following distance to avoid collisions with the weaving taxi. Speeding up or following closely is unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC180",
    category: "controls",
    title: "Clutch Control on the R43 Near Villiersdorp",
    scenario: "You're in a manual car on the R43 near Villiersdorp, Western Cape, stuck in slow traffic on a hill due to a fruit market. You need to move forward without stalling.",
    question: "What should you do in this situation?",
    options: [
      "Release the clutch quickly",
      "Use clutch control with the handbrake",
      "Hoot to clear the traffic",
      "Shift to neutral and wait"
    ],
    correct: 1,
    explanation: "On a hill, use clutch control with the handbrake to move forward smoothly without stalling. Other options could cause unsafe movement or delays.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC181",
    category: "signs",
    title: "No Stopping Near a Polokwane Market",
    scenario: "You're driving on the R81 near Polokwane, Limpopo, when you see a 'No Stopping' sign near a busy roadside market. Your passenger wants to stop to buy fruit.",
    question: "What should you do in this situation?",
    options: [
      "Stop briefly to buy fruit",
      "Continue driving and find a safe stopping area",
      "Hoot to signal your intention",
      "Slow down but don't stop"
    ],
    correct: 1,
    explanation: "A 'No Stopping' sign prohibits stopping on the road. Continue driving and find a designated safe area to stop for the market.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC182",
    category: "controls",
    title: "Wipers in Heavy Rain in Khayelitsha",
    scenario: "You're driving on Steve Biko Road in Khayelitsha, Cape Town, during a heavy rainstorm. Visibility is poor, and water is pooling on the road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the pools",
      "Turn on wipers and reduce speed",
      "Hoot to warn other drivers",
      "Pull over immediately"
    ],
    correct: 1,
    explanation: "In heavy rain, turn on wipers and reduce speed to maintain visibility and avoid hydroplaning on pooled water. Speeding up or pulling over suddenly is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC183",
    category: "signs",
    title: "Slippery Road in Fog on the N3",
    scenario: "You're driving on the N3 near Estcourt, KwaZulu-Natal, in thick fog. A slippery road sign is posted, and the road is wet from earlier rain.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and increase following distance",
      "Hoot to warn other drivers",
      "Turn on high beams"
    ],
    correct: 1,
    explanation: "A slippery road sign in fog indicates a risk of losing traction. Reduce speed and increase following distance to maintain control and avoid collisions.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC184",
    category: "rules",
    title: "Strong Winds on the M7 Near Durban",
    scenario: "You're driving on the M7 near Durban during strong winds. Your car is swaying, and a minibus taxi ahead is struggling to stay in its lane.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the taxi quickly",
      "Reduce speed and grip the steering wheel",
      "Hoot to warn the taxi",
      "Pull over and wait for the wind to subside"
    ],
    correct: 1,
    explanation: "In strong winds, reduce speed and grip the steering wheel firmly to maintain control. Overtaking or pulling over is risky, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC185",
    category: "mixed",
    title: "Rainy Night in Soweto",
    scenario: "You're driving on Klipspruit Valley Road in Soweto, Johannesburg, at night during heavy rain. The robots are out due to load shedding, and a bakkie is approaching from the right.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the bakkie and check for pedestrians",
      "Hoot to assert your right of way",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "With robots out, treat the intersection as a four-way stop. Yield to the bakkie on the right and check for pedestrians, especially in poor visibility due to rain.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC186",
    category: "controls",
    title: "Fog Lights on the R71 Near Tzaneen",
    scenario: "You're driving on the R71 near Tzaneen, Limpopo, at dawn in dense fog. Visibility is low, and a tractor is moving slowly ahead.",
    question: "What should you do in this situation?",
    options: [
      "Use high beams to see better",
      "Turn on fog lights and increase following distance",
      "Hoot to urge the tractor to speed up",
      "Overtake the tractor immediately"
    ],
    correct: 1,
    explanation: "In dense fog, turn on fog lights and increase your following distance to improve visibility and reaction time. High beams reduce visibility, and overtaking or hooting is unsafe.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC187",
    category: "signs",
    title: "Wet Road Warning Near Knysna",
    scenario: "You're driving on the N2 near Knysna, Western Cape, after heavy rain. A wet road sign is posted, and you notice water flowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and avoid sudden braking",
      "Hoot to warn other drivers",
      "Turn on hazard lights"
    ],
    correct: 1,
    explanation: "A wet road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden braking to maintain control, especially with water on the road.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC188",
    category: "rules",
    title: "Rainy Intersection in East London",
    scenario: "You're approaching a robot on Settlers Way in East London during light rain. The robot turns red, and a taxi behind you is hooting impatiently.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop and wait for the robot to turn green",
      "Hoot back at the taxi",
      "Wave the taxi to pass"
    ],
    correct: 1,
    explanation: "Stop at a red robot and wait until it turns green, regardless of pressure from the taxi. Speeding up or hooting is unsafe, especially in wet conditions.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "evening",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC189",
    category: "mixed",
    title: "Foggy Night on the R61 Near Cradock",
    scenario: "You're driving on the R61 near Cradock, Eastern Cape, at night in thick fog. A sheep crosses the road, and you can barely see the road markings.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the sheep away",
      "Slow down and use fog lights",
      "Follow the sheep to stay on track",
      "Speed up to pass the sheep"
    ],
    correct: 1,
    explanation: "In thick fog, slow down and use fog lights to improve visibility while avoiding the sheep. Hooting or speeding up is unsafe in low visibility.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "night",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC190",
    category: "controls",
    title: "Windy Conditions on the N12 Near Kimberley",
    scenario: "You're driving a bakkie on the N12 near Kimberley during strong winds. Dust is blowing across the road, and your vehicle is swaying.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the dust",
      "Reduce speed and grip the steering wheel",
      "Hoot to warn other drivers",
      "Pull over immediately"
    ],
    correct: 1,
    explanation: "In strong winds, reduce speed and grip the steering wheel firmly to maintain control. Speeding up or pulling over suddenly is unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC191",
    category: "signs",
    title: "Slippery Road in Rain Near George",
    scenario: "You're driving on the N9 near George, Western Cape, after heavy rain. A slippery road sign is posted, and a taxi is tailgating you on the wet road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Reduce speed and avoid sudden movements",
      "Hoot to warn the taxi",
      "Pull over to let the taxi pass"
    ],
    correct: 1,
    explanation: "A slippery road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden movements to maintain control, even with a tailgating taxi.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC192",
    category: "rules",
    title: "Foggy Intersection in Bloemfontein",
    scenario: "You're approaching a four-way stop on Curie Avenue in Bloemfontein during dense fog. A minibus taxi is approaching from the right, barely visible.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Stop and wait for the taxi to pass",
      "Hoot to signal your presence",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "In low visibility, stop at the four-way stop and wait for the taxi to pass, ensuring the intersection is clear. Hooting or speeding up is unsafe in fog.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC193",
    category: "mixed",
    title: "Rainy Toll Booth on the N1 Near Musina",
    scenario: "You're approaching a toll booth on the N1 near Musina, Limpopo, in heavy rain. The road is slippery, and a truck ahead is slowing down unexpectedly.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck to reach the booth",
      "Slow down gradually and use wipers",
      "Hoot to warn the truck",
      "Stop suddenly to avoid the truck"
    ],
    correct: 1,
    explanation: "In heavy rain, slow down gradually and use wipers to maintain visibility and control. Overtaking or stopping suddenly is dangerous on a slippery road.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC194",
    category: "controls",
    title: "Wipers in Sudden Rain in Centurion",
    scenario: "You're driving on John Vorster Drive in Centurion, Pretoria, when a sudden downpour reduces visibility. A minibus taxi is weaving through traffic ahead.",
    question: "What should you do in this situation?",
    options: [
      "Follow the taxi closely to stay on course",
      "Turn on wipers and reduce speed",
      "Hoot to warn the taxi",
      "Turn on high beams for better visibility"
    ],
    correct: 1,
    explanation: "In sudden rain, turn on wipers and reduce speed to maintain visibility and control. Following closely or using high beams is unsafe, and hooting is ineffective.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC195",
    category: "signs",
    title: "Wind Warning on the R62 Near Calitzdorp",
    scenario: "You're driving on the R62 near Calitzdorp, Western Cape, when you see a strong wind warning sign. Dust and small branches are blowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and grip the steering wheel",
      "Hoot to clear the debris",
      "Turn on hazard lights"
    ],
    correct: 1,
    explanation: "A strong wind warning sign indicates potential loss of control. Reduce speed and grip the steering wheel to stay stable, especially with debris on the road.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC196",
    category: "rules",
    title: "Foggy Night on the N14 Near Upington",
    scenario: "You're driving on the N14 near Upington, Northern Cape, at night in thick fog. A truck ahead is barely visible, and road signs are hard to see.",
    question: "What should you do in this situation?",
    options: [
      "Follow the truck closely to stay on track",
      "Slow down and use fog lights",
      "Hoot to signal your presence",
      "Overtake the truck to avoid delay"
    ],
    correct: 1,
    explanation: "In thick fog at night, slow down and use fog lights to improve visibility while keeping a safe distance from the truck. Following closely or overtaking is dangerous.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "night",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC197",
    category: "mixed",
    title: "Rainy Rural Road Near Vryburg",
    scenario: "You're driving on the N18 near Vryburg, North West, during heavy rain. A cattle crossing sign is posted, and you see cows near the wet road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Slow down and prepare to stop",
      "Speed up to pass the cows",
      "Continue driving at the same speed"
    ],
    correct: 1,
    explanation: "In heavy rain with a cattle crossing sign, slow down and prepare to stop to avoid hitting cows on the slippery road. Hooting or speeding up is unsafe.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC198",
    category: "controls",
    title: "Fog Lights in Polokwane",
    scenario: "You're driving on the R101 near Polokwane, Limpopo, at dawn in dense fog. A minibus taxi is overtaking recklessly in low visibility.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Turn on fog lights and slow down",
      "Hoot to warn the taxi",
      "Follow the taxi closely"
    ],
    correct: 1,
    explanation: "In dense fog, turn on fog lights and slow down to maintain visibility and control. Speeding up or following the taxi closely is unsafe in low visibility.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC199",
    category: "signs",
    title: "Wet Road in Stellenbosch",
    scenario: "You're driving on the R44 near Stellenbosch, Western Cape, after heavy rain. A wet road sign is posted, and a bakkie is tailgating you on the slippery road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the bakkie",
      "Reduce speed and avoid sudden braking",
      "Hoot to warn the bakkie",
      "Pull over to let the bakkie pass"
    ],
    correct: 1,
    explanation: "A wet road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden braking to maintain control, even with a tailgating bakkie.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC200",
    category: "rules",
    title: "Windy Conditions in Port Alfred",
    scenario: "You're driving on the R72 near Port Alfred, Eastern Cape, during strong coastal winds. A truck ahead is swaying, and debris is on the road.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Reduce speed and keep a safe distance",
      "Hoot to warn the truck",
      "Pull over and wait"
    ],
    correct: 1,
    explanation: "In strong winds, reduce speed and keep a safe distance from the swaying truck to avoid debris and maintain control. Overtaking or pulling over is risky.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC201",
    category: "mixed",
    title: "Rainy Night in Randburg",
    scenario: "You're driving on Republic Road in Randburg, Johannesburg, at night during heavy rain. The robots are out due to load shedding, and a taxi is approaching from the left.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the taxi and check for pedestrians",
      "Hoot to assert your right of way",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "With robots out, treat the intersection as a four-way stop. Yield to the taxi on the left and check for pedestrians, especially in poor visibility due to rain.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC202",
    category: "controls",
    title: "Emergency Stop in Fog Near Graaff-Reinet",
    scenario: "You're driving on the N9 near Graaff-Reinet, Eastern Cape, in thick fog when a child runs onto the road from a nearby informal settlement.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "In thick fog, apply the brakes firmly to stop and avoid hitting the child. Swerving or hooting may not prevent a collision, and continuing to drive is unsafe.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC203",
    category: "signs",
    title: "Slippery Road in Rain Near Umhlanga",
    scenario: "You're driving on the M41 near Umhlanga, KwaZulu-Natal, after heavy rain. A slippery road sign is posted, and a taxi is overtaking you on the wet road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to match the taxi",
      "Reduce speed and avoid sudden movements",
      "Hoot to warn the taxi",
      "Pull over to let the taxi pass"
    ],
    correct: 1,
    explanation: "A slippery road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden movements to maintain control, even with an overtaking taxi.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC204",
    category: "rules",
    title: "Windy Intersection in Hermanus",
    scenario: "You're approaching a robot on Main Road in Hermanus, Western Cape, during strong winds. The robot turns amber, and debris is blowing across the intersection.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop if it's safe to do so",
      "Hoot to warn other drivers",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "An amber robot requires you to stop if it's safe. In strong winds with debris, stopping safely prevents collisions and ensures control.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC205",
    category: "mixed",
    title: "Foggy Rural Road Near Underberg",
    scenario: "You're driving on the R617 near Underberg, KwaZulu-Natal, in dense fog at dawn. A horse crossing sign is posted, and you hear hooves but can't see the animals.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the horses away",
      "Slow down and prepare to stop",
      "Speed up to pass the area",
      "Continue driving at the same speed"
    ],
    correct: 1,
    explanation: "In dense fog with a horse crossing sign, slow down and prepare to stop to avoid hitting unseen animals. Hooting or speeding up is unsafe in low visibility.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC206",
    category: "controls",
    title: "Wipers in Sudden Rain on the N3 Near Ladysmith",
    scenario: "You're driving on the N3 near Ladysmith, KwaZulu-Natal, when a sudden downpour reduces visibility. A truck ahead is slowing down in the rain.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck to avoid delay",
      "Turn on wipers and reduce speed",
      "Hoot to warn the truck",
      "Follow the truck closely"
    ],
    correct: 1,
    explanation: "In sudden rain, turn on wipers and reduce speed to maintain visibility and control. Overtaking or following closely is unsafe in poor weather conditions.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
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
export const getScenariosByContext = (context: string): K53Scenario[] => {
  return k53ScenarioBank.filter((s) => s.context === context);
};

// Function to shuffle an array using Fisher-Yates algorithm
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]; // Create a copy to avoid mutating the original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Function to generate a random scenario test
export const generateRandomScenarioTest = (
  count: number = 10,
  difficulty?: "basic" | "intermediate" | "advanced",
  category?: "controls" | "signs" | "rules" | "mixed",
): K53Scenario[] => {
  let scenarios = k53ScenarioBank;

  if (difficulty) {
    scenarios = scenarios.filter((s) => s.difficulty === difficulty);
  }

  if (category) {
    scenarios = scenarios.filter((s) => s.category === category);
  }

  // Use proper Fisher-Yates shuffle instead of biased sort
  const shuffledScenarios = shuffleArray(scenarios);
  return shuffledScenarios.slice(0, count);
};

export type { K53Scenario };
