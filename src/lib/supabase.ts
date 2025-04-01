import { createClient } from "@supabase/supabase-js";
import { Database } from "../types/supabase";

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.",
  );
  // Provide fallback values to prevent app from crashing during development
  // These won't actually connect to any real Supabase instance
  const fallbackUrl = "https://placeholder-project.supabase.co";
  const fallbackKey = "placeholder-anon-key";

  // Only use fallbacks if variables are completely missing
  if (!supabaseUrl) {
    console.warn(`Using fallback Supabase URL: ${fallbackUrl}`);
  }
  if (!supabaseAnonKey) {
    console.warn(`Using fallback Supabase anon key`);
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type User = {
  id: string;
  email: string;
  role: "admin" | "customer";
  created_at: string;
  name?: string;
  avatar_url?: string;
  is_suspended?: boolean;
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  cuisine: "indian" | "us" | "chinese" | "other";
  created_at: string;
  created_by: string;
};

export type MealLogItem = {
  id: string;
  user_id: string;
  food_id: string;
  timestamp: string;
  quantity: number;
  meal_type: "breakfast" | "lunch" | "dinner" | "snack";
  food?: FoodItem;
};

export type UserProfile = {
  id: string;
  user_id: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  height: number;
  weight: number;
  activity_level:
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active";
  goal_type: "weight_loss" | "weight_gain" | "maintain";
  target_weight: number;
  weekly_goal: number;
  timeframe: number;
  diet_type:
    | "no_restriction"
    | "vegetarian"
    | "vegan"
    | "keto"
    | "paleo"
    | "mediterranean";
  meal_frequency: "three" | "four" | "five" | "six";
  cuisine_preferences: string[];
  created_at: string;
  updated_at: string;
};

export type ReminderSettings = {
  id: string;
  user_id: string;
  meals: {
    enabled: boolean;
    breakfast: string;
    lunch: string;
    dinner: string;
    snacks: string[];
  };
  water: {
    enabled: boolean;
    frequency: string;
    startTime: string;
    endTime: string;
  };
  workouts: {
    enabled: boolean;
    days: string[];
    time: string;
  };
  fasting: {
    enabled: boolean;
    startAlert: boolean;
    endAlert: boolean;
  };
  created_at: string;
  updated_at: string;
};

export type WeightLog = {
  id: string;
  user_id: string;
  weight: number;
  date: string;
  notes?: string;
  created_at: string;
};

export type WaterLog = {
  id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  created_at: string;
};

export type FoodAd = {
  id: string;
  food_id: string;
  title: string;
  description: string;
  image_url?: string;
  created_by: string;
  created_at: string;
};
