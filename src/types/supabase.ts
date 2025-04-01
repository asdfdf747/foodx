export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: "admin" | "customer";
          created_at: string;
          name: string | null;
          avatar_url: string | null;
          is_suspended: boolean;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "admin" | "customer";
          created_at?: string;
          name?: string | null;
          avatar_url?: string | null;
          is_suspended?: boolean;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "admin" | "customer";
          created_at?: string;
          name?: string | null;
          avatar_url?: string | null;
          is_suspended?: boolean;
        };
      };
      user_profiles: {
        Row: {
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
        Insert: {
          id?: string;
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
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          age?: number;
          gender?: "male" | "female" | "other";
          height?: number;
          weight?: number;
          activity_level?:
            | "sedentary"
            | "lightly_active"
            | "moderately_active"
            | "very_active"
            | "extremely_active";
          goal_type?: "weight_loss" | "weight_gain" | "maintain";
          target_weight?: number;
          weekly_goal?: number;
          timeframe?: number;
          diet_type?:
            | "no_restriction"
            | "vegetarian"
            | "vegan"
            | "keto"
            | "paleo"
            | "mediterranean";
          meal_frequency?: "three" | "four" | "five" | "six";
          cuisine_preferences?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      food_items: {
        Row: {
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
        Insert: {
          id?: string;
          name: string;
          calories: number;
          protein: number;
          carbs: number;
          fat: number;
          serving: string;
          cuisine: "indian" | "us" | "chinese" | "other";
          created_at?: string;
          created_by: string;
        };
        Update: {
          id?: string;
          name?: string;
          calories?: number;
          protein?: number;
          carbs?: number;
          fat?: number;
          serving?: string;
          cuisine?: "indian" | "us" | "chinese" | "other";
          created_at?: string;
          created_by?: string;
        };
      };
      meal_logs: {
        Row: {
          id: string;
          user_id: string;
          food_id: string;
          timestamp: string;
          quantity: number;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          food_id: string;
          timestamp: string;
          quantity: number;
          meal_type: "breakfast" | "lunch" | "dinner" | "snack";
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          food_id?: string;
          timestamp?: string;
          quantity?: number;
          meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
          created_at?: string;
        };
      };
      reminder_settings: {
        Row: {
          id: string;
          user_id: string;
          meals: Json;
          water: Json;
          workouts: Json;
          fasting: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          meals: Json;
          water: Json;
          workouts: Json;
          fasting: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          meals?: Json;
          water?: Json;
          workouts?: Json;
          fasting?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
      weight_logs: {
        Row: {
          id: string;
          user_id: string;
          weight: number;
          date: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          weight: number;
          date: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          weight?: number;
          date?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      water_logs: {
        Row: {
          id: string;
          user_id: string;
          amount: number;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          amount: number;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          amount?: number;
          timestamp?: string;
          created_at?: string;
        };
      };
      food_ads: {
        Row: {
          id: string;
          food_id: string;
          title: string;
          description: string;
          image_url: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          food_id: string;
          title: string;
          description: string;
          image_url?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          food_id?: string;
          title?: string;
          description?: string;
          image_url?: string | null;
          created_by?: string;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
