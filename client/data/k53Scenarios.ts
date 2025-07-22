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
  },
  // NEW SCENARIOS FROM GROK - URBAN SCENARIOS (SC026-SC040)
  {
    id: "SC026",
    category: "controls",
    title: "Emergency Stop in Sandton During Load Shedding",
    scenario: "You're driving on Rivonia Road in Sandton, Johannesburg, at night during load shedding, and the robots are out. A pedestrian suddenly steps into the road in front of you.",
    question: "What should you do in this situation?",
    options: [
      "Hoot and swerve to avoid the pedestrian",
      "Apply the brakes firmly and stop the vehicle",
      "Accelerate to pass the pedestrian quickly",
      "Flash your lights and continue driving"
    ],
    correct: 1,
    explanation: "In an emergency, you must apply the brakes firmly to stop the vehicle and avoid a collision. Swerving or accelerating could be dangerous, and hooting or flashing lights won't ensure the pedestrian's safety.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "night",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC027",
    category: "signs",
    title: "Navigating a Temporary Road Sign in Cape Town",
    scenario: "You're driving on the M3 near Newlands, Cape Town, when you see a temporary roadworks sign indicating a lane closure ahead. A minibus taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Ignore the sign and maintain your lane",
      "Signal early and merge into the open lane",
      "Stop suddenly to let the taxi pass"
    ],
    correct: 2,
    explanation: "A temporary roadworks sign indicates a change in road conditions. You must signal early and merge safely into the open lane while checking for the taxi in your mirrors to avoid a collision.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC028",
    category: "rules",
    title: "Yielding to a Taxi in Soweto",
    scenario: "You're approaching a four-way stop in Soweto, Johannesburg, when a minibus taxi from the left speeds through without stopping. You're next in line to proceed.",
    question: "What should you do in this situation?",
    options: [
      "Proceed immediately since you have right of way",
      "Hoot and flash your lights to warn the taxi",
      "Wait to ensure the intersection is clear",
      "Follow the taxi to report it to authorities"
    ],
    correct: 2,
    explanation: "Even if you have the right of way, you must ensure the intersection is clear before proceeding. The taxi's actions are unsafe, but prioritizing safety prevents collisions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC029",
    category: "mixed",
    title: "Navigating a Busy Johannesburg CBD Intersection",
    scenario: "You're driving on Commissioner Street in Johannesburg's CBD during peak hour. A robot turns red, but a minibus taxi behind you hoots aggressively, and pedestrians are crossing slowly.",
    question: "What should you do in this situation?",
    options: [
      "Move forward to appease the taxi",
      "Stop and wait until the robot turns green",
      "Hoot back at the taxi to assert your position",
      "Wave pedestrians to hurry up"
    ],
    correct: 1,
    explanation: "You must stop at a red robot and wait until it turns green, regardless of pressure from other drivers. Moving forward or hooting could endanger pedestrians or violate traffic rules.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC030",
    category: "controls",
    title: "Parallel Parking in Cape Town During a Protest",
    scenario: "You're attempting to parallel park on Long Street, Cape Town, when a protest march blocks the road behind you. Your mirrors show a taxi waiting impatiently.",
    question: "What should you do in this situation?",
    options: [
      "Abandon parking and drive away",
      "Continue parking while checking mirrors",
      "Hoot to clear the protesters",
      "Park quickly without checking mirrors"
    ],
    correct: 1,
    explanation: "You should continue parking carefully, using your mirrors to monitor the taxi and protesters. Abandoning the maneuver or parking without checking mirrors could be unsafe, and hooting is ineffective.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC031",
    category: "signs",
    title: "Speed Limit Change in Sandton",
    scenario: "You're driving on Katherine Street in Sandton, Johannesburg, where the speed limit changes from 60 km/h to 40 km/h near a school zone during school hours.",
    question: "What should you do in this situation?",
    options: [
      "Maintain 60 km/h to keep up with traffic",
      "Reduce speed to 40 km/h immediately",
      "Increase speed to pass the school quickly",
      "Stop and wait for school children to cross"
    ],
    correct: 1,
    explanation: "You must obey the new speed limit of 40 km/h in the school zone to ensure safety. Maintaining or increasing speed violates traffic rules, and stopping is unnecessary unless pedestrians are crossing.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC032",
    category: "rules",
    title: "Right of Way at a Midrand Roundabout",
    scenario: "You're entering a roundabout on Olifantsfontein Road in Midrand, Johannesburg. A bakkie from the right is approaching quickly, and a taxi is merging from the left.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to enter before the bakkie",
      "Yield to the bakkie and check for the taxi",
      "Hoot to warn both vehicles",
      "Stop in the middle of the roundabout"
    ],
    correct: 1,
    explanation: "Vehicles already in the roundabout or approaching from the right have right of way. You must yield to the bakkie and ensure the taxi is not merging unsafely before entering.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC033",
    category: "mixed",
    title: "Hijacking Awareness in Hillbrow",
    scenario: "You're driving through Hillbrow, Johannesburg, at night when a suspicious vehicle blocks the road ahead. Your instructor advised you about hijacking risks in this area.",
    question: "What should you do in this situation?",
    options: [
      "Drive around the vehicle quickly",
      "Stop and wait for the vehicle to move",
      "Reverse and find an alternative route",
      "Hoot and flash your lights"
    ],
    correct: 2,
    explanation: "In high-risk areas like Hillbrow, reversing and finding an alternative route is the safest option to avoid potential hijacking. Driving around or stopping could expose you to danger.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC034",
    category: "controls",
    title: "Clutch Control in Cape Town Traffic",
    scenario: "You're in heavy traffic on Adderley Street, Cape Town, during a music festival. You need to move forward slowly without stalling your manual car.",
    question: "What should you do in this situation?",
    options: [
      "Keep the clutch fully pressed and accelerate",
      "Use clutch control to move slowly",
      "Shift to neutral and coast",
      "Hoot to clear the traffic"
    ],
    correct: 1,
    explanation: "In slow-moving traffic, use clutch control by partially releasing the clutch while gently pressing the accelerator to move smoothly without stalling. Other options are unsafe or ineffective.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC035",
    category: "signs",
    title: "Construction Zone in Pretoria",
    scenario: "You're driving on the R21 near Pretoria when you see a construction zone sign indicating a reduced speed limit of 60 km/h and a narrow lane ahead.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your current speed",
      "Reduce speed to 60 km/h and stay alert",
      "Overtake slower vehicles to pass quickly",
      "Stop and wait for construction to end"
    ],
    correct: 1,
    explanation: "You must reduce your speed to 60 km/h as indicated by the construction zone sign and stay alert for workers or obstacles. Overtaking or maintaining speed is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC036",
    category: "rules",
    title: "Toll Booth Etiquette on the M1",
    scenario: "You're approaching a toll booth on the M1 in Johannesburg. The lane you're in is cash-only, but you only have a card, and a taxi is behind you.",
    question: "What should you do in this situation?",
    options: [
      "Stay in the lane and ask the booth operator for help",
      "Switch lanes to an electronic payment booth",
      "Stop and reverse to find another route",
      "Pay with cash from a passenger"
    ],
    correct: 1,
    explanation: "You should signal early and switch to an electronic payment lane if you only have a card. Staying in the cash-only lane or reversing is unsafe and inefficient.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC037",
    category: "mixed",
    title: "Braai Traffic in Fourways",
    scenario: "You're driving on William Nicol Drive in Fourways, Johannesburg, on a Sunday afternoon during a braai gathering. Traffic is heavy, and a taxi suddenly cuts in front of you.",
    question: "What should you do in this situation?",
    options: [
      "Hoot and tailgate the taxi",
      "Slow down and maintain a safe following distance",
      "Overtake the taxi immediately",
      "Flash your lights to warn other drivers"
    ],
    correct: 1,
    explanation: "Slowing down and maintaining a safe following distance prevents a collision with the taxi. Hooting, tailgating, or overtaking in heavy traffic is unsafe.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC038",
    category: "controls",
    title: "Emergency Stop in Bellville",
    scenario: "You're driving on Voortrekker Road in Bellville, Cape Town, when a child runs into the road chasing a ball near a busy taxi rank.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "You must apply the brakes firmly to stop and avoid hitting the child. Swerving or hooting may not prevent a collision, and continuing to drive is dangerous.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC039",
    category: "signs",
    title: "No U-Turn in Rosebank",
    scenario: "You're driving on Oxford Road in Rosebank, Johannesburg, and want to turn back toward Sandton. You see a 'No U-Turn' sign ahead.",
    question: "What should you do in this situation?",
    options: [
      "Make a U-turn anyway if traffic is clear",
      "Continue and find the next legal turn",
      "Stop and wait for traffic to clear",
      "Hoot to alert other drivers"
    ],
    correct: 1,
    explanation: "A 'No U-Turn' sign prohibits U-turns. You must continue driving and find the next legal turn to avoid breaking traffic rules.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC040",
    category: "rules",
    title: "Pedestrian Crossing in Stellenbosch",
    scenario: "You're driving on Bird Street in Stellenbosch, Cape Town, near a university campus. Students are waiting at a pedestrian crossing, but a taxi behind you hoots impatiently.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the crossing",
      "Stop and let the students cross",
      "Hoot back at the taxi",
      "Wave the students to wait"
    ],
    correct: 1,
    explanation: "You must stop at a pedestrian crossing to allow pedestrians to cross safely, regardless of pressure from other drivers. Speeding up or waving pedestrians to wait is unsafe.",
    difficulty: "basic",
    context: "urban",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  // RURAL/HIGHWAY SCENARIOS (SC041-SC050)
  {
    id: "SC041",
    category: "controls",
    title: "Clutch Control on the N1 Near Polokwane",
    scenario: "You're driving a manual bakkie on the N1 near Polokwane in heavy holiday traffic heading to Limpopo. You need to crawl forward on an incline without rolling back.",
    question: "What should you do in this situation?",
    options: [
      "Keep the clutch fully pressed",
      "Use clutch control with the handbrake",
      "Shift to neutral and accelerate",
      "Hoot to clear the traffic"
    ],
    correct: 1,
    explanation: "On an incline, use clutch control with the handbrake to prevent rolling back while moving forward slowly. Other options could cause stalling or unsafe movement.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC042",
    category: "signs",
    title: "Animal Crossing on the R71",
    scenario: "You're driving on the R71 near Tzaneen, Limpopo, when you see a warning sign for cattle crossing. A herd of cows is visible ahead on the road.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Speed up to pass the cows",
      "Slow down and stop if necessary",
      "Continue driving at the same speed"
    ],
    correct: 2,
    explanation: "A cattle crossing sign indicates potential animals on the road. You must slow down and stop if necessary to avoid hitting the cows, ensuring safety for both the animals and yourself.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC043",
    category: "rules",
    title: "Overtaking on the N2 Near Knysna",
    scenario: "You're on the N2 near Knysna, Western Cape, behind a slow-moving truck. The road is single-lane with a solid line marking.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Wait for a broken line to overtake",
      "Hoot to urge the truck to speed up",
      "Tailgate the truck to pressure it"
    ],
    correct: 1,
    explanation: "A solid line prohibits overtaking. You must wait for a broken line where overtaking is allowed, ensuring it's safe to pass the truck.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC044",
    category: "mixed",
    title: "Cash-in-Transit Heist on the N3",
    scenario: "You're driving on the N3 near Harrismith, Free State, when you see police lights and a cash-in-transit heist blocking the road ahead. Traffic is slowing down.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the scene quickly",
      "Slow down and follow police instructions",
      "Stop and take photos of the scene",
      "Reverse to find another route"
    ],
    correct: 1,
    explanation: "In a dangerous situation like a heist, slow down and follow police instructions to stay safe. Speeding up, stopping for photos, or reversing could be risky.",
    difficulty: "advanced",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC045",
    category: "controls",
    title: "Emergency Stop on the R56",
    scenario: "You're driving on the R56 near Kokstad, KwaZulu-Natal, when a child on a bicycle suddenly swerves into your lane from a rural dirt road.",
    question: "What should you do in this situation?",
    options: [
      "Swerve to avoid the child",
      "Apply the brakes firmly to stop",
      "Hoot to warn the child",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "You must apply the brakes firmly to stop and avoid a collision with the child. Swerving or hooting may not prevent an accident, and continuing to drive is unsafe.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC046",
    category: "signs",
    title: "Speed Bump Warning in Bloemfontein",
    scenario: "You're driving on the R30 near Bloemfontein when you see a speed bump warning sign near a rural school. Children are playing nearby.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Slow down and prepare to stop",
      "Hoot to warn the children",
      "Ignore the sign if no children are on the road"
    ],
    correct: 1,
    explanation: "A speed bump warning sign indicates a need to slow down, especially near a school. Prepare to stop if children are on or near the road to ensure their safety.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC047",
    category: "rules",
    title: "Right of Way on the R62",
    scenario: "You're approaching an unmarked intersection on the R62 near Oudtshoorn, Western Cape. A bakkie is approaching from the right on a gravel road.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the bakkie on the right",
      "Hoot to warn the bakkie",
      "Speed up to cross first"
    ],
    correct: 1,
    explanation: "At an unmarked intersection, the vehicle on the right has the right of way. You must yield to the bakkie to avoid a collision.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC048",
    category: "mixed",
    title: "Holiday Traffic on the N2 Near East London",
    scenario: "You're driving on the N2 near East London during December holiday traffic. A minibus taxi overtakes recklessly, and you notice a toll booth ahead.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to keep pace with the taxi",
      "Maintain your speed and prepare for the toll",
      "Hoot to warn other drivers",
      "Pull over to let the taxi pass"
    ],
    correct: 1,
    explanation: "Maintain your speed and focus on preparing for the toll booth safely. Speeding up or hooting is unnecessary, and pulling over may not be practical in heavy traffic.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC049",
    category: "controls",
    title: "Hill Start on the R43",
    scenario: "You're in a manual car on the R43 near Hermanus, Western Cape, stopped on a steep incline behind a slow-moving truck during a whale-watching weekend.",
    question: "What should you do in this situation?",
    options: [
      "Release the clutch quickly to move",
      "Use the handbrake and clutch control",
      "Hoot to urge the truck to move",
      "Shift to neutral and wait"
    ],
    correct: 1,
    explanation: "On a steep incline, use the handbrake and clutch control to start moving without rolling back. Other options could cause stalling or unsafe movement.",
    difficulty: "intermediate",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "clear",
    language: "en"
  },
  {
    id: "SC050",
    category: "signs",
    title: "No Stopping on the N12",
    scenario: "You're driving on the N12 near Kimberley when you see a 'No Stopping' sign. Your passenger asks you to stop to take a photo of the Big Hole.",
    question: "What should you do in this situation?",
    options: [
      "Stop briefly to take the photo",
      "Continue driving and find a safe stopping area",
      "Hoot to signal your intention",
      "Slow down but don't stop"
    ],
    correct: 1,
    explanation: "A 'No Stopping' sign prohibits stopping on the road. You must continue driving and find a designated safe area to stop for the photo.",
    difficulty: "basic",
    context: "freeway",
    timeOfDay: "morning",
    weather: "clear",
    language: "en"
  },
  // WEATHER-RELATED SCENARIOS (SC051-SC075)
  {
    id: "SC051",
    category: "controls",
    title: "Wipers in Heavy Rain on the N1",
    scenario: "You're driving on the N1 near Centurion, Pretoria, when heavy rain reduces visibility. Your windshield is getting blurry, and a taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to avoid the taxi",
      "Turn on your wipers and reduce speed",
      "Hoot to warn the taxi",
      "Pull over immediately"
    ],
    correct: 1,
    explanation: "In heavy rain, turn on your wipers to improve visibility and reduce speed to maintain control. Speeding up or pulling over suddenly is unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC052",
    category: "signs",
    title: "Slippery Road in Fog on the M5",
    scenario: "You're driving on the M5 in Cape Town during thick morning fog. A slippery road sign appears, and you notice wet leaves on the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass quickly",
      "Reduce speed and increase following distance",
      "Hoot to warn other drivers",
      "Turn on your high beams"
    ],
    correct: 1,
    explanation: "A slippery road sign in fog indicates a risk of losing traction. Reduce speed and increase your following distance to maintain control and avoid collisions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC053",
    category: "rules",
    title: "Strong Winds on the N2 Near Port Elizabeth",
    scenario: "You're driving on the N2 near Port Elizabeth during strong coastal winds. Your bakkie is swaying, and a truck ahead is struggling to stay in its lane.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the truck quickly",
      "Reduce speed and grip the steering wheel firmly",
      "Hoot to warn the truck driver",
      "Pull over and wait for the wind to die down"
    ],
    correct: 1,
    explanation: "In strong winds, reduce speed and grip the steering wheel firmly to maintain control. Overtaking or pulling over may be unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC054",
    category: "mixed",
    title: "Rainy Night in Durban's CBD",
    scenario: "You're driving on Dr Pixley KaSeme Street in Durban's CBD at night during heavy rain. A robot is out due to load shedding, and a taxi is approaching from the right.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Yield to the taxi and check for pedestrians",
      "Hoot to assert your right of way",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "With a robot out, treat the intersection as a four-way stop. Yield to the taxi on the right and check for pedestrians, especially in poor visibility due to rain.",
    difficulty: "advanced",
    context: "urban",
    timeOfDay: "night",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC055",
    category: "controls",
    title: "Fog Lights on the N3",
    scenario: "You're driving on the N3 near Mooi River, KwaZulu-Natal, in dense fog at dawn. Visibility is low, and you're behind a slow-moving truck.",
    question: "What should you do in this situation?",
    options: [
      "Use high beams to see better",
      "Turn on fog lights and increase following distance",
      "Hoot to urge the truck to speed up",
      "Overtake the truck immediately"
    ],
    correct: 1,
    explanation: "In dense fog, turn on fog lights to improve visibility and increase your following distance to allow more reaction time. High beams reduce visibility, and overtaking or hooting is unsafe.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC056",
    category: "signs",
    title: "Wet Road Warning in George",
    scenario: "You're driving on the N9 near George, Western Cape, after heavy rain. A 'Wet Road' warning sign is posted, and you notice water pooling on the road.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to pass the water",
      "Reduce speed and avoid sudden braking",
      "Hoot to warn other drivers",
      "Turn on your hazard lights"
    ],
    correct: 1,
    explanation: "A wet road sign indicates a risk of hydroplaning. Reduce speed and avoid sudden braking to maintain control, especially in pooled water.",
    difficulty: "basic",
    context: "rural",
    timeOfDay: "afternoon",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC057",
    category: "rules",
    title: "Rainy Intersection in East London",
    scenario: "You're approaching a robot on Oxford Street in East London during light rain. The robot turns amber, and a minibus taxi behind you is tailgating.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to clear the intersection",
      "Stop if it's safe to do so",
      "Hoot to warn the taxi",
      "Continue driving cautiously"
    ],
    correct: 1,
    explanation: "An amber robot requires you to stop if it's safe. In rain, stopping safely prevents collisions, even with a tailgating taxi. Speeding up is risky in wet conditions.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "evening",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC058",
    category: "mixed",
    title: "Foggy Night on the R61",
    scenario: "You're driving on the R61 near Port Shepstone, KwaZulu-Natal, at night in thick fog. A bakkie ahead is driving erratically, and you can barely see road markings.",
    question: "What should you do in this situation?",
    options: [
      "Overtake the bakkie to avoid it",
      "Slow down and use fog lights",
      "Follow the bakkie closely for guidance",
      "Hoot to alert the bakkie"
    ],
    correct: 1,
    explanation: "In thick fog at night, slow down and use fog lights to improve visibility while keeping a safe distance from the erratic bakkie. Overtaking or following closely is dangerous.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "night",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC059",
    category: "controls",
    title: "Windy Conditions on the N7",
    scenario: "You're driving a bakkie on the N7 near Clanwilliam, Western Cape, during strong crosswinds. Your vehicle is swaying, and debris is blowing across the road.",
    question: "What should you do in this situation?",
    options: [
      "Speed up to pass the debris",
      "Reduce speed and grip the steering wheel",
      "Hoot to warn other drivers",
      "Pull over immediately"
    ],
    correct: 1,
    explanation: "In strong crosswinds, reduce speed and grip the steering wheel firmly to maintain control. Speeding up or pulling over suddenly could be unsafe, and hooting is ineffective.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC060",
    category: "signs",
    title: "Slippery Road in Rain Near Knysna",
    scenario: "You're driving on the N2 near Knysna after heavy rain, and a slippery road sign is posted. The road is wet, and a taxi is tailgating you.",
    question: "What should you do in this situation?",
    options: [
      "Maintain your speed to avoid the taxi",
      "Reduce speed and increase following distance",
      "Hoot to warn the taxi",
      "Pull over to let the taxi pass"
    ],
    correct: 1,
    explanation: "A slippery road sign indicates a risk of losing traction. Reduce speed and increase your following distance to maintain control, even with a tailgating taxi.",
    difficulty: "intermediate",
    context: "freeway",
    timeOfDay: "morning",
    weather: "rain",
    language: "en"
  },
  {
    id: "SC061",
    category: "rules",
    title: "Foggy Intersection in Bloemfontein",
    scenario: "You're approaching a four-way stop on Nelson Mandela Drive in Bloemfontein during dense fog. Visibility is low, and a bakkie is approaching from the left.",
    question: "What should you do in this situation?",
    options: [
      "Proceed since you're on the main road",
      "Stop and wait for the bakkie to pass",
      "Hoot to signal your presence",
      "Speed up to clear the intersection"
    ],
    correct: 1,
    explanation: "In low visibility, stop at the four-way stop and wait for the bakkie to pass, ensuring the intersection is clear. Hooting or speeding up is unsafe in fog.",
    difficulty: "intermediate",
    context: "urban",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC062",
    category: "mixed",
    title: "Rainy Toll Booth on the N1",
    scenario: "You're approaching a toll booth on the N1 near Polokwane in heavy rain. The road is slippery, and a truck ahead is slowing down suddenly.",
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
    id: "SC063",
    category: "controls",
    title: "Wipers in Sudden Rain in Midrand",
    scenario: "You're driving on the R55 in Midrand, Johannesburg, when a sudden downpour reduces visibility. A minibus taxi is weaving through traffic ahead.",
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
    id: "SC064",
    category: "signs",
    title: "Wind Warning on the R43",
    scenario: "You're driving on the R43 near Hermanus, Western Cape, when you see a strong wind warning sign. Dust and leaves are blowing across the road.",
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
    id: "SC065",
    category: "rules",
    title: "Foggy Night on the N12",
    scenario: "You're driving on the N12 near Kimberley at night in thick fog. A truck ahead is barely visible, and you can't see road signs clearly.",
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
    id: "SC066",
    category: "mixed",
    title: "Rainy Rural Road in Tzaneen",
    scenario: "You're driving on the R71 near Tzaneen, Limpopo, during heavy rain. A cattle crossing sign is posted, and you see cows near the wet road.",
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
    id: "SC067",
    category: "controls",
    title: "Fog Lights in Polokwane",
    scenario: "You're driving on the N1 bypass in Polokwane at dawn in dense fog. Visibility is poor, and a taxi is overtaking recklessly.",
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
    context: "freeway",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC068",
    category: "signs",
    title: "Wet Road in Stellenbosch",
    scenario: "You're driving on the R44 near Stellenbosch after heavy rain, and a wet road sign is posted. The road is slippery, and a bakkie is tailgating you.",
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
    id: "SC069",
    category: "rules",
    title: "Windy Conditions in Port Elizabeth",
    scenario: "You're driving on the N2 near Port Elizabeth during strong coastal winds. A truck ahead is swaying, and debris is on the road.",
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
    context: "freeway",
    timeOfDay: "afternoon",
    weather: "wind",
    language: "en"
  },
  {
    id: "SC070",
    category: "mixed",
    title: "Rainy Night in Sandton",
    scenario: "You're driving on Grayston Drive in Sandton, Johannesburg, at night during heavy rain. The robots are out due to load shedding, and a taxi is approaching from the left.",
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
    id: "SC071",
    category: "controls",
    title: "Emergency Stop in Fog on the R62",
    scenario: "You're driving on the R62 near Oudtshoorn in thick fog when a child runs into the road from a rural settlement.",
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
    id: "SC072",
    category: "signs",
    title: "Slippery Road in Rain Near Durban",
    scenario: "You're driving on the M4 near Durban after heavy rain, and a slippery road sign is posted. The road is wet, and a taxi is overtaking you.",
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
    id: "SC073",
    category: "rules",
    title: "Windy Intersection in George",
    scenario: "You're approaching a robot on York Street in George during strong winds. The robot turns amber, and debris is blowing across the road.",
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
    id: "SC074",
    category: "mixed",
    title: "Foggy Rural Road Near Kokstad",
    scenario: "You're driving on the R56 near Kokstad, KwaZulu-Natal, in dense fog at dawn. A cattle crossing sign is posted, and you hear cows nearby but can't see them.",
    question: "What should you do in this situation?",
    options: [
      "Hoot to scare the cows away",
      "Slow down and prepare to stop",
      "Speed up to pass the area",
      "Continue driving at the same speed"
    ],
    correct: 1,
    explanation: "In dense fog with a cattle crossing sign, slow down and prepare to stop to avoid hitting unseen cows. Hooting or speeding up is unsafe in low visibility.",
    difficulty: "advanced",
    context: "rural",
    timeOfDay: "morning",
    weather: "fog",
    language: "en"
  },
  {
    id: "SC075",
    category: "controls",
    title: "Wipers in Sudden Rain on the N3",
    scenario: "You're driving on the N3 near Harrismith, Free State, when a sudden downpour reduces visibility. A truck ahead is slowing down.",
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
