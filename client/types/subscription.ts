// Subscription and usage tracking types

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_type: "free" | "light" | "basic" | "pro" | "family";
  status: "active" | "canceled" | "expired" | "trial";
  price_cents: number; // In cents (R50 = 5000 cents)
  currency: "ZAR";
  billing_cycle: "monthly" | "yearly";
  trial_ends_at?: string;
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DailyUsage {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  scenarios_used: number;
  questions_used: number;
  max_scenarios: number;
  max_questions: number;
  created_at: string;
  updated_at: string;
}

export interface ScenarioPack {
  id: string;
  name: string;
  description: string;
  location_region: string;
  location_city?: string;
  scenario_count: number;
  price_cents: number; // In cents
  currency: "ZAR";
  scenario_ids: string[];
  preview_scenarios: string[]; // First 2-3 scenario IDs for preview
  created_at: string;
  updated_at: string;
}

export interface UserPurchase {
  id: string;
  user_id: string;
  item_type: "subscription" | "scenario_pack";
  item_id: string; // subscription_id or scenario_pack_id
  price_cents: number;
  currency: "ZAR";
  payment_method: "payfast" | "card" | "eft";
  payment_status: "pending" | "completed" | "failed" | "refunded";
  payment_reference?: string;
  purchased_at: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  currency: "ZAR";
  billing_cycle: "monthly" | "yearly";
  features: string[];
  max_scenarios_per_day: number;
  max_questions_per_day: number;
  includes_all_packs: boolean;
  popular?: boolean;
}

// Predefined subscription plans
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free Practice",
    description: "Basic assessment preparation",
    price_cents: 0,
    currency: "ZAR",
    billing_cycle: "monthly",
    features: [
      "Unlimited official assessments (64 questions)",
      "Unlimited practice assessments (12 questions)",
      "5 scenarios per day",
      "Basic progress tracking",
      "Location-aware scenarios",
      "Standard explanations",
    ],
    max_scenarios_per_day: 5,
    max_questions_per_day: -1, // -1 means unlimited
    includes_all_packs: false,
  },
  {
    id: "light",
    name: "SuperK53 Light",
    description: "Enhanced practice for regular learners",
    price_cents: 2900, // R29
    currency: "ZAR",
    billing_cycle: "monthly",
    features: [
      "Unlimited official assessments (64 questions)",
      "Unlimited practice assessments (12 questions)",
      "15 scenarios per day",
      "Enhanced progress tracking",
      "Location-specific content",
      "Detailed explanations",
    ],
    max_scenarios_per_day: 15,
    max_questions_per_day: -1,
    includes_all_packs: false,
    popular: true,
  },
  {
    id: "basic",
    name: "SuperK53 Standard",
    description: "Unlimited practice for serious learners",
    price_cents: 7900, // R79
    currency: "ZAR",
    billing_cycle: "monthly",
    features: [
      "Unlimited official assessments (64 questions)",
      "Unlimited practice assessments (12 questions)",
      "Unlimited scenarios",
      "Advanced progress tracking",
      "Location-specific content",
      "Detailed explanations",
      "Mock K53 tests",
    ],
    max_scenarios_per_day: -1, // -1 means unlimited
    max_questions_per_day: -1,
    includes_all_packs: false,
  },
  {
    id: "pro",
    name: "SuperK53 Premium",
    description: "Complete preparation system with premium features",
    price_cents: 14900, // R149
    currency: "ZAR",
    billing_cycle: "monthly",
    features: [
      "Everything in Standard",
      "All scenario packs included",
      "Offline access capability",
      "Advanced performance analytics",
      "Priority technical support",
      "Personalized study recommendations",
    ],
    max_scenarios_per_day: -1,
    max_questions_per_day: -1,
    includes_all_packs: true,
  },
];

// Predefined scenario packs
export const SCENARIO_PACKS: Omit<
  ScenarioPack,
  "id" | "created_at" | "updated_at"
>[] = [
  {
    name: "Tembisa Township Pack",
    description: "Real-world scenarios from Tembisa and surrounding areas",
    location_region: "Gauteng",
    location_city: "Tembisa",
    scenario_count: 25,
    price_cents: 2500, // R25
    currency: "ZAR",
    scenario_ids: [], // Will be populated with actual scenario IDs
    preview_scenarios: [],
  },
  {
    name: "Cape Town Coastal Pack",
    description: "Coastal driving scenarios including baboon encounters",
    location_region: "Western Cape",
    location_city: "Cape Town",
    scenario_count: 30,
    price_cents: 3000, // R30
    currency: "ZAR",
    scenario_ids: [],
    preview_scenarios: [],
  },
  {
    name: "Johannesburg Urban Pack",
    description: "City driving with taxi ranks and traffic complexities",
    location_region: "Gauteng",
    location_city: "Johannesburg",
    scenario_count: 28,
    price_cents: 3000, // R30
    currency: "ZAR",
    scenario_ids: [],
    preview_scenarios: [],
  },
  {
    name: "Rural Roads Pack",
    description: "Gravel roads, farm animals, and small town scenarios",
    location_region: "National",
    scenario_count: 20,
    price_cents: 2000, // R20
    currency: "ZAR",
    scenario_ids: [],
    preview_scenarios: [],
  },
  {
    name: "Durban Coastal Pack",
    description: "Beach traffic, holiday crowds, and coastal conditions",
    location_region: "KwaZulu-Natal",
    location_city: "Durban",
    scenario_count: 22,
    price_cents: 2500, // R25
    currency: "ZAR",
    scenario_ids: [],
    preview_scenarios: [],
  },
];
