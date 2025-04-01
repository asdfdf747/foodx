import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import {
  supabase,
  ReminderSettings as ReminderSettingsType,
} from "../../lib/supabase";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Loader2,
  Save,
  Bell,
  Utensils,
  Droplets,
  Dumbbell,
  Timer,
  Clock,
} from "lucide-react";

const defaultReminderSettings: ReminderSettingsType = {
  id: "",
  user_id: "",
  meals: {
    enabled: true,
    breakfast: "08:00",
    lunch: "13:00",
    dinner: "19:00",
    snacks: ["11:00", "16:00"],
  },
  water: {
    enabled: true,
    frequency: "hourly",
    startTime: "08:00",
    endTime: "22:00",
  },
  workouts: {
    enabled: true,
    days: ["monday", "wednesday", "friday"],
    time: "18:00",
  },
  fasting: {
    enabled: false,
    startAlert: true,
    endAlert: true,
  },
  created_at: "",
  updated_at: "",
};

const ReminderSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReminderSettingsType>(
    defaultReminderSettings,
  );
  const [activeTab, setActiveTab] = useState("meals");

  useEffect(() => {
    if (user) {
      fetchReminderSettings();
    }
  }, [user]);

  const fetchReminderSettings = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Check if reminder settings exist
      const { data, error } = await supabase
        .from("reminder_settings")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSettings(data as ReminderSettingsType);
      } else {
        // Set default settings with user ID
        setSettings({
          ...defaultReminderSettings,
          user_id: user.id,
        });
      }
    } catch (err: any) {
      console.error("Error fetching reminder settings:", err);
      setError(err.message || "Failed to fetch reminder settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      if (settings.id) {
        // Update existing settings
        const { error } = await supabase
          .from("reminder_settings")
          .update({
            meals: settings.meals,
            water: settings.water,
            workouts: settings.workouts,
            fasting: settings.fasting,
          })
          .eq("id", settings.id);

        if (error) throw error;
      } else {
        // Create new settings
        const { error } = await supabase.from("reminder_settings").insert([
          {
            user_id: user.id,
            meals: settings.meals,
            water: settings.water,
            workouts: settings.workouts,
            fasting: settings.fasting,
          },
        ]);

        if (error) throw error;
      }

      setSuccess("Reminder settings saved successfully");
      fetchReminderSettings(); // Refresh settings
    } catch (err: any) {
      console.error("Error saving reminder settings:", err);
      setError(err.message || "Failed to save reminder settings");
    } finally {
      setSaving(false);
    }
  };

  const updateMealSettings = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      meals: {
        ...prev.meals,
        [field]: value,
      },
    }));
  };

  const updateWaterSettings = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      water: {
        ...prev.water,
        [field]: value,
      },
    }));
  };

  const updateWorkoutSettings = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      workouts: {
        ...prev.workouts,
        [field]: value,
      },
    }));
  };

  const updateFastingSettings = (field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      fasting: {
        ...prev.fasting,
        [field]: value,
      },
    }));
  };

  const toggleDay = (day: string) => {
    const currentDays = [...settings.workouts.days];
    if (currentDays.includes(day)) {
      updateWorkoutSettings(
        "days",
        currentDays.filter((d) => d !== day),
      );
    } else {
      updateWorkoutSettings("days", [...currentDays, day]);
    }
  };

  const addSnack = () => {
    updateMealSettings("snacks", [...settings.meals.snacks, "15:00"]);
  };

  const removeSnack = (index: number) => {
    const newSnacks = [...settings.meals.snacks];
    newSnacks.splice(index, 1);
    updateMealSettings("snacks", newSnacks);
  };

  const updateSnackTime = (index: number, time: string) => {
    const newSnacks = [...settings.meals.snacks];
    newSnacks[index] = time;
    updateMealSettings("snacks", newSnacks);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <h1 className="text-3xl font-bold mb-6">Reminder Settings</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center gap-2">
            <Bell className="h-6 w-6" />
            <CardTitle>Reminder Settings</CardTitle>
          </div>
          <CardDescription className="text-gray-100">
            Configure your meal, water, workout, and fasting reminders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="meals" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <span>Meals</span>
              </TabsTrigger>
              <TabsTrigger value="water" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                <span>Water</span>
              </TabsTrigger>
              <TabsTrigger value="workouts" className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <span>Workouts</span>
              </TabsTrigger>
              <TabsTrigger value="fasting" className="flex items-center gap-2">
                <Timer className="h-4 w-4" />
                <span>Fasting</span>
              </TabsTrigger>
            </TabsList>

            {/* Meal Reminders */}
            <TabsContent value="meals" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-orange-500" />
                  <h3 className="text-lg font-medium">Meal Reminders</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="meal-notifications"
                    checked={settings.meals.enabled}
                    onCheckedChange={(checked) =>
                      updateMealSettings("enabled", checked)
                    }
                  />
                  <Label htmlFor="meal-notifications">
                    {settings.meals.enabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              <div className="grid gap-6 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="breakfast-time">Breakfast Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="breakfast-time"
                        type="time"
                        value={settings.meals.breakfast}
                        onChange={(e) =>
                          updateMealSettings("breakfast", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lunch-time">Lunch Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="lunch-time"
                        type="time"
                        value={settings.meals.lunch}
                        onChange={(e) =>
                          updateMealSettings("lunch", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dinner-time">Dinner Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="dinner-time"
                        type="time"
                        value={settings.meals.dinner}
                        onChange={(e) =>
                          updateMealSettings("dinner", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Snack Times</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addSnack}
                      className="text-xs"
                    >
                      Add Snack Time
                    </Button>
                  </div>

                  {settings.meals.snacks.map((snack, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        type="time"
                        value={snack}
                        onChange={(e) => updateSnackTime(index, e.target.value)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSnack(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Water Reminders */}
            <TabsContent value="water" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-medium">Water Reminders</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="water-notifications"
                    checked={settings.water.enabled}
                    onCheckedChange={(checked) =>
                      updateWaterSettings("enabled", checked)
                    }
                  />
                  <Label htmlFor="water-notifications">
                    {settings.water.enabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              <div className="grid gap-6 mt-4">
                <div className="space-y-4">
                  <Label htmlFor="water-frequency">Reminder Frequency</Label>
                  <div className="flex flex-wrap gap-2">
                    {["hourly", "every 2 hours", "every 3 hours", "custom"].map(
                      (freq) => (
                        <Badge
                          key={freq}
                          variant={
                            settings.water.frequency === freq
                              ? "default"
                              : "outline"
                          }
                          className={`cursor-pointer ${settings.water.frequency === freq ? "bg-blue-500" : ""}`}
                          onClick={() => updateWaterSettings("frequency", freq)}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="water-start-time">Start Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="water-start-time"
                        type="time"
                        value={settings.water.startTime}
                        onChange={(e) =>
                          updateWaterSettings("startTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="water-end-time">End Time</Label>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Input
                        id="water-end-time"
                        type="time"
                        value={settings.water.endTime}
                        onChange={(e) =>
                          updateWaterSettings("endTime", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Workout Reminders */}
            <TabsContent value="workouts" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Dumbbell className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-medium">Workout Reminders</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="workout-notifications"
                    checked={settings.workouts.enabled}
                    onCheckedChange={(checked) =>
                      updateWorkoutSettings("enabled", checked)
                    }
                  />
                  <Label htmlFor="workout-notifications">
                    {settings.workouts.enabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              <div className="grid gap-6 mt-4">
                <div className="space-y-4">
                  <Label>Workout Days</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "monday",
                      "tuesday",
                      "wednesday",
                      "thursday",
                      "friday",
                      "saturday",
                      "sunday",
                    ].map((day) => (
                      <Badge
                        key={day}
                        variant={
                          settings.workouts.days.includes(day)
                            ? "default"
                            : "outline"
                        }
                        className={`cursor-pointer ${settings.workouts.days.includes(day) ? "bg-green-500" : ""}`}
                        onClick={() => toggleDay(day)}
                      >
                        {day.charAt(0).toUpperCase() + day.slice(1)}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workout-time">Workout Time</Label>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      id="workout-time"
                      type="time"
                      value={settings.workouts.time}
                      onChange={(e) =>
                        updateWorkoutSettings("time", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Fasting Reminders */}
            <TabsContent value="fasting" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Timer className="h-5 w-5 text-purple-500" />
                  <h3 className="text-lg font-medium">Fasting Reminders</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fasting-notifications"
                    checked={settings.fasting.enabled}
                    onCheckedChange={(checked) =>
                      updateFastingSettings("enabled", checked)
                    }
                  />
                  <Label htmlFor="fasting-notifications">
                    {settings.fasting.enabled ? "Enabled" : "Disabled"}
                  </Label>
                </div>
              </div>

              <div className="grid gap-6 mt-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fasting-start-alert"
                      checked={settings.fasting.startAlert}
                      onCheckedChange={(checked) =>
                        updateFastingSettings("startAlert", checked)
                      }
                      disabled={!settings.fasting.enabled}
                    />
                    <Label htmlFor="fasting-start-alert">
                      Notify me when it's time to start fasting
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fasting-end-alert"
                      checked={settings.fasting.endAlert}
                      onCheckedChange={(checked) =>
                        updateFastingSettings("endAlert", checked)
                      }
                      disabled={!settings.fasting.enabled}
                    />
                    <Label htmlFor="fasting-end-alert">
                      Notify me when it's time to end fasting
                    </Label>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-6" />

          <div className="flex justify-end">
            <Button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center gap-2"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReminderSettings;
