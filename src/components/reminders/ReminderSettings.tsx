import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, Droplets, Utensils, Timer, Dumbbell } from "lucide-react";

interface ReminderSettingsProps {
  onSave?: (settings: ReminderSettings) => void;
  initialSettings?: ReminderSettings;
}

interface ReminderSettings {
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
}

const defaultSettings: ReminderSettings = {
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
    days: ["Monday", "Wednesday", "Friday"],
    time: "18:00",
  },
  fasting: {
    enabled: false,
    startAlert: true,
    endAlert: true,
  },
};

const ReminderSettings: React.FC<ReminderSettingsProps> = ({
  onSave = () => {},
  initialSettings = defaultSettings,
}) => {
  const [settings, setSettings] = useState<ReminderSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("meals");

  const handleSave = () => {
    onSave(settings);
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

  return (
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
                      disabled={!settings.meals.enabled}
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
                      disabled={!settings.meals.enabled}
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
                      disabled={!settings.meals.enabled}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Snack Reminders</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addSnack}
                    disabled={!settings.meals.enabled}
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
                      disabled={!settings.meals.enabled}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSnack(index)}
                      disabled={!settings.meals.enabled}
                      className="text-red-500 hover:text-red-700"
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
                <h3 className="text-lg font-medium">Water Intake Reminders</h3>
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
              <div className="space-y-2">
                <Label htmlFor="water-frequency">Reminder Frequency</Label>
                <Select
                  value={settings.water.frequency}
                  onValueChange={(value) =>
                    updateWaterSettings("frequency", value)
                  }
                  disabled={!settings.water.enabled}
                >
                  <SelectTrigger id="water-frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30min">Every 30 minutes</SelectItem>
                    <SelectItem value="hourly">Every hour</SelectItem>
                    <SelectItem value="2hours">Every 2 hours</SelectItem>
                    <SelectItem value="3hours">Every 3 hours</SelectItem>
                    <SelectItem value="4hours">Every 4 hours</SelectItem>
                  </SelectContent>
                </Select>
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
                      disabled={!settings.water.enabled}
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
                      disabled={!settings.water.enabled}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  Water reminders will be sent between{" "}
                  {settings.water.startTime} and {settings.water.endTime}
                  {settings.water.frequency === "30min" && "every 30 minutes"}
                  {settings.water.frequency === "hourly" && "every hour"}
                  {settings.water.frequency === "2hours" && "every 2 hours"}
                  {settings.water.frequency === "3hours" && "every 3 hours"}
                  {settings.water.frequency === "4hours" && "every 4 hours"}
                </p>
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
              <div className="space-y-2">
                <Label>Workout Days</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                  ].map((day) => (
                    <Badge
                      key={day}
                      variant={
                        settings.workouts.days.includes(day)
                          ? "default"
                          : "outline"
                      }
                      className={`cursor-pointer ${settings.workouts.days.includes(day) ? "bg-green-500 hover:bg-green-600" : "hover:bg-gray-100"}`}
                      onClick={() => toggleDay(day)}
                    >
                      {day.substring(0, 3)}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="workout-time">Reminder Time</Label>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <Input
                    id="workout-time"
                    type="time"
                    value={settings.workouts.time}
                    onChange={(e) =>
                      updateWorkoutSettings("time", e.target.value)
                    }
                    disabled={!settings.workouts.enabled}
                  />
                </div>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Workout reminders will be sent at {settings.workouts.time} on:{" "}
                  {settings.workouts.days.length > 0
                    ? settings.workouts.days.join(", ")
                    : "No days selected"}
                </p>
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="fasting-start">Fasting Start Alert</Label>
                  <Switch
                    id="fasting-start"
                    checked={settings.fasting.startAlert}
                    onCheckedChange={(checked) =>
                      updateFastingSettings("startAlert", checked)
                    }
                    disabled={!settings.fasting.enabled}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="fasting-end">Fasting End Alert</Label>
                  <Switch
                    id="fasting-end"
                    checked={settings.fasting.endAlert}
                    onCheckedChange={(checked) =>
                      updateFastingSettings("endAlert", checked)
                    }
                    disabled={!settings.fasting.enabled}
                  />
                </div>
              </div>

              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-700">
                  Fasting alerts will be sent based on your fasting schedule set
                  in the Fasting Timer section.
                  {settings.fasting.startAlert && settings.fasting.endAlert
                    ? " You will be notified at both the start and end of your fasting periods."
                    : settings.fasting.startAlert
                      ? " You will be notified at the start of your fasting periods."
                      : settings.fasting.endAlert
                        ? " You will be notified at the end of your fasting periods."
                        : " No alerts are currently enabled."}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-8 space-x-4">
          <Button
            variant="outline"
            onClick={() => setSettings(initialSettings)}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReminderSettings;
