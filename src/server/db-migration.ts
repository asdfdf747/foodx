import { createClient } from "@supabase/supabase-js";

// This script will be run when the app is deployed to create the necessary database tables
// It can be run manually with: npm run migrate

export async function runMigrations() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error(
      "Missing Supabase credentials. Please set VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY environment variables.",
    );
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log("Running database migrations...");

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "users",
        table_definition: `
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        name TEXT,
        avatar_url TEXT,
        is_suspended BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (usersError) throw usersError;

    // Create user_profiles table
    const { error: profilesError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "user_profiles",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
        height NUMERIC NOT NULL,
        weight NUMERIC NOT NULL,
        activity_level TEXT NOT NULL CHECK (activity_level IN ('sedentary', 'lightly_active', 'moderately_active', 'very_active', 'extremely_active')),
        goal_type TEXT NOT NULL CHECK (goal_type IN ('weight_loss', 'weight_gain', 'maintain')),
        target_weight NUMERIC NOT NULL,
        weekly_goal NUMERIC NOT NULL,
        timeframe INTEGER NOT NULL,
        diet_type TEXT NOT NULL CHECK (diet_type IN ('no_restriction', 'vegetarian', 'vegan', 'keto', 'paleo', 'mediterranean')),
        meal_frequency TEXT NOT NULL CHECK (meal_frequency IN ('three', 'four', 'five', 'six')),
        cuisine_preferences TEXT[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (profilesError) throw profilesError;

    // Create food_items table
    const { error: foodItemsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "food_items",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein NUMERIC NOT NULL,
        carbs NUMERIC NOT NULL,
        fat NUMERIC NOT NULL,
        serving TEXT NOT NULL,
        cuisine TEXT NOT NULL CHECK (cuisine IN ('indian', 'us', 'chinese', 'other')),
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (foodItemsError) throw foodItemsError;

    // Create meal_logs table
    const { error: mealLogsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "meal_logs",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        food_id UUID NOT NULL REFERENCES food_items(id),
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        quantity NUMERIC NOT NULL,
        meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (mealLogsError) throw mealLogsError;

    // Create reminder_settings table
    const { error: reminderSettingsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "reminder_settings",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        meals JSONB NOT NULL,
        water JSONB NOT NULL,
        workouts JSONB NOT NULL,
        fasting JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (reminderSettingsError) throw reminderSettingsError;

    // Create weight_logs table
    const { error: weightLogsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "weight_logs",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        weight NUMERIC NOT NULL,
        date DATE NOT NULL,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (weightLogsError) throw weightLogsError;

    // Create water_logs table
    const { error: waterLogsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "water_logs",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        amount INTEGER NOT NULL,
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (waterLogsError) throw waterLogsError;

    // Create food_ads table
    const { error: foodAdsError } = await supabase.rpc(
      "create_table_if_not_exists",
      {
        table_name: "food_ads",
        table_definition: `
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        food_id UUID NOT NULL REFERENCES food_items(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT,
        created_by UUID NOT NULL REFERENCES users(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
      `,
      },
    );

    if (foodAdsError) throw foodAdsError;

    // Create indexes for better performance
    await supabase.rpc("create_index_if_not_exists", {
      index_name: "idx_meal_logs_user_id",
      table_name: "meal_logs",
      column_name: "user_id",
    });

    await supabase.rpc("create_index_if_not_exists", {
      index_name: "idx_weight_logs_user_id",
      table_name: "weight_logs",
      column_name: "user_id",
    });

    await supabase.rpc("create_index_if_not_exists", {
      index_name: "idx_water_logs_user_id",
      table_name: "water_logs",
      column_name: "user_id",
    });

    // Create a default admin user if none exists
    const { data: existingAdmins } = await supabase
      .from("users")
      .select("id")
      .eq("role", "admin")
      .limit(1);

    if (!existingAdmins || existingAdmins.length === 0) {
      // Create a default admin user
      const adminEmail = "admin@fittrack.com";
      const adminPassword = "Admin123!";

      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
      });

      if (authError) {
        console.error("Error creating default admin user:", authError);
      } else if (authUser?.user) {
        const { error: insertError } = await supabase.from("users").insert([
          {
            id: authUser.user.id,
            email: adminEmail,
            role: "admin",
            name: "System Admin",
            is_suspended: false,
          },
        ]);

        if (insertError) {
          console.error("Error inserting admin user data:", insertError);
        } else {
          console.log(
            "Created default admin user: admin@fittrack.com / Admin123!",
          );
        }
      }
    }

    console.log("Database migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
  }
}
