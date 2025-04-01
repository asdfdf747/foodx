import React, { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Scale,
  Utensils,
} from "lucide-react";

import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Slider } from "../ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  age: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Age must be a positive number",
  }),
  gender: z.enum(["male", "female", "other"]),
  height: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Height must be a positive number",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Weight must be a positive number",
  }),
  activityLevel: z.enum([
    "sedentary",
    "lightly_active",
    "moderately_active",
    "very_active",
    "extremely_active",
  ]),
});

const goalSettingSchema = z.object({
  goalType: z.enum(["weight_loss", "weight_gain", "maintain"]),
  targetWeight: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Target weight must be a positive number",
    }),
  weeklyGoal: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Weekly goal must be a number",
  }),
  timeframe: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Timeframe must be a positive number",
    }),
});

const dietPreferencesSchema = z.object({
  dietType: z.enum([
    "no_restriction",
    "vegetarian",
    "vegan",
    "keto",
    "paleo",
    "mediterranean",
  ]),
  allergies: z.array(z.string()).optional(),
  mealFrequency: z.enum(["three", "four", "five", "six"]),
  cuisinePreferences: z.array(
    z.enum([
      "indian",
      "american",
      "chinese",
      "mediterranean",
      "mexican",
      "italian",
    ]),
  ),
});

interface OnboardingFlowProps {
  onComplete?: (data: any) => void;
  isOpen?: boolean;
}

const OnboardingFlow = ({
  onComplete = () => {},
  isOpen = true,
}: OnboardingFlowProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      age: "",
      gender: "male",
      height: "",
      weight: "",
      activityLevel: "moderately_active",
    },
    goalSetting: {
      goalType: "weight_loss",
      targetWeight: "",
      weeklyGoal: "0.5",
      timeframe: "12",
    },
    dietPreferences: {
      dietType: "no_restriction",
      allergies: [],
      mealFrequency: "three",
      cuisinePreferences: ["indian", "american", "chinese"],
    },
  });

  const personalInfoForm = useForm({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: formData.personalInfo,
  });

  const goalSettingForm = useForm({
    resolver: zodResolver(goalSettingSchema),
    defaultValues: formData.goalSetting,
  });

  const dietPreferencesForm = useForm({
    resolver: zodResolver(dietPreferencesSchema),
    defaultValues: formData.dietPreferences,
  });

  const handlePersonalInfoSubmit = (data: any) => {
    setFormData({ ...formData, personalInfo: data });
    setStep(2);
  };

  const handleGoalSettingSubmit = (data: any) => {
    setFormData({ ...formData, goalSetting: data });
    setStep(3);
  };

  const handleDietPreferencesSubmit = (data: any) => {
    setFormData({ ...formData, dietPreferences: data });
    // Complete onboarding
    onComplete({ ...formData, dietPreferences: data });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
          <h1 className="text-2xl font-bold">
            Welcome to Fitness & Nutrition Tracker
          </h1>
          <p className="opacity-90 mt-1">
            Let's set up your profile to get personalized recommendations
          </p>

          <div className="flex mt-6 space-x-2">
            <div
              className={`flex items-center ${step >= 1 ? "text-white" : "text-white/50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-white/20" : "bg-white/10"}`}
              >
                <User size={18} />
              </div>
              <span className="ml-2 text-sm font-medium">Personal Info</span>
            </div>
            <div className="w-8 h-1 bg-white/20 self-center"></div>
            <div
              className={`flex items-center ${step >= 2 ? "text-white" : "text-white/50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-white/20" : "bg-white/10"}`}
              >
                <Scale size={18} />
              </div>
              <span className="ml-2 text-sm font-medium">Goal Setting</span>
            </div>
            <div className="w-8 h-1 bg-white/20 self-center"></div>
            <div
              className={`flex items-center ${step >= 3 ? "text-white" : "text-white/50"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-white/20" : "bg-white/10"}`}
              >
                <Utensils size={18} />
              </div>
              <span className="ml-2 text-sm font-medium">Diet Preferences</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <Form {...personalInfoForm}>
              <form
                onSubmit={personalInfoForm.handleSubmit(
                  handlePersonalInfoSubmit,
                )}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={personalInfoForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="30" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={personalInfoForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex space-x-4"
                        >
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="male" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="female" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <RadioGroupItem value="other" />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={personalInfoForm.control}
                    name="height"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Height (cm)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="175" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={personalInfoForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="70" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={personalInfoForm.control}
                  name="activityLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sedentary">
                            Sedentary (little or no exercise)
                          </SelectItem>
                          <SelectItem value="lightly_active">
                            Lightly Active (light exercise 1-3 days/week)
                          </SelectItem>
                          <SelectItem value="moderately_active">
                            Moderately Active (moderate exercise 3-5 days/week)
                          </SelectItem>
                          <SelectItem value="very_active">
                            Very Active (hard exercise 6-7 days/week)
                          </SelectItem>
                          <SelectItem value="extremely_active">
                            Extremely Active (very hard exercise & physical job)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the option that best describes your typical
                        weekly activity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...goalSettingForm}>
              <form
                onSubmit={goalSettingForm.handleSubmit(handleGoalSettingSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={goalSettingForm.control}
                  name="goalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your primary goal?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2"
                        >
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <RadioGroupItem
                                value="weight_loss"
                                className="sr-only"
                              />
                            </FormControl>
                            <div
                              className={`w-full p-4 rounded-lg border-2 ${field.value === "weight_loss" ? "border-blue-500 bg-blue-50" : "border-gray-200"} cursor-pointer`}
                              onClick={() => field.onChange("weight_loss")}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Weight Loss</span>
                                {field.value === "weight_loss" && (
                                  <Check className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Reduce body weight and fat
                              </p>
                            </div>
                          </FormItem>
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <RadioGroupItem
                                value="weight_gain"
                                className="sr-only"
                              />
                            </FormControl>
                            <div
                              className={`w-full p-4 rounded-lg border-2 ${field.value === "weight_gain" ? "border-blue-500 bg-blue-50" : "border-gray-200"} cursor-pointer`}
                              onClick={() => field.onChange("weight_gain")}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">Weight Gain</span>
                                {field.value === "weight_gain" && (
                                  <Check className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Build muscle and increase weight
                              </p>
                            </div>
                          </FormItem>
                          <FormItem className="flex flex-col items-center">
                            <FormControl>
                              <RadioGroupItem
                                value="maintain"
                                className="sr-only"
                              />
                            </FormControl>
                            <div
                              className={`w-full p-4 rounded-lg border-2 ${field.value === "maintain" ? "border-blue-500 bg-blue-50" : "border-gray-200"} cursor-pointer`}
                              onClick={() => field.onChange("maintain")}
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  Maintain Weight
                                </span>
                                {field.value === "maintain" && (
                                  <Check className="h-5 w-5 text-blue-500" />
                                )}
                              </div>
                              <p className="text-sm text-gray-500 mt-1">
                                Stay at current weight
                              </p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={goalSettingForm.control}
                  name="targetWeight"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Weight (kg)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="65" {...field} />
                      </FormControl>
                      <FormDescription>
                        What weight would you like to achieve?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={goalSettingForm.control}
                  name="weeklyGoal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Weekly Goal (kg)</FormLabel>
                      <FormControl>
                        <Slider
                          defaultValue={[parseFloat(field.value) || 0.5]}
                          max={2}
                          min={0.25}
                          step={0.25}
                          onValueChange={(vals) =>
                            field.onChange(vals[0].toString())
                          }
                          className="py-4"
                        />
                      </FormControl>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>0.25 kg</span>
                        <span className="font-medium">
                          {field.value} kg per week
                        </span>
                        <span>2 kg</span>
                      </div>
                      <FormDescription>
                        {field.value === "0.25" && "Slow and steady approach"}
                        {field.value === "0.5" && "Recommended for most people"}
                        {field.value === "0.75" && "Moderate pace"}
                        {field.value === "1" && "Faster progress"}
                        {parseFloat(field.value) > 1 &&
                          "Ambitious goal - requires dedication"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={goalSettingForm.control}
                  name="timeframe"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Timeframe (weeks)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="12" {...field} />
                      </FormControl>
                      <FormDescription>
                        How many weeks do you want to achieve your goal in?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Next <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 3 && (
            <Form {...dietPreferencesForm}>
              <form
                onSubmit={dietPreferencesForm.handleSubmit(
                  handleDietPreferencesSubmit,
                )}
                className="space-y-6"
              >
                <FormField
                  control={dietPreferencesForm.control}
                  name="dietType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diet Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select diet type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="no_restriction">
                            No Restrictions
                          </SelectItem>
                          <SelectItem value="vegetarian">Vegetarian</SelectItem>
                          <SelectItem value="vegan">Vegan</SelectItem>
                          <SelectItem value="keto">Keto</SelectItem>
                          <SelectItem value="paleo">Paleo</SelectItem>
                          <SelectItem value="mediterranean">
                            Mediterranean
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your preferred diet type for meal
                        recommendations.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dietPreferencesForm.control}
                  name="mealFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Frequency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select meal frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="three">3 meals per day</SelectItem>
                          <SelectItem value="four">4 meals per day</SelectItem>
                          <SelectItem value="five">5 meals per day</SelectItem>
                          <SelectItem value="six">6 meals per day</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How many meals would you like to have per day?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={dietPreferencesForm.control}
                  name="cuisinePreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cuisine Preferences</FormLabel>
                      <FormDescription>
                        Select your preferred cuisines for meal recommendations.
                      </FormDescription>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {[
                          { value: "indian", label: "Indian" },
                          { value: "american", label: "American" },
                          { value: "chinese", label: "Chinese" },
                          { value: "mediterranean", label: "Mediterranean" },
                          { value: "mexican", label: "Mexican" },
                          { value: "italian", label: "Italian" },
                        ].map((cuisine) => (
                          <div
                            key={cuisine.value}
                            className={`p-3 rounded-lg border-2 cursor-pointer ${field.value?.includes(cuisine.value) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                            onClick={() => {
                              const currentValues = field.value || [];
                              const newValues = currentValues.includes(
                                cuisine.value,
                              )
                                ? currentValues.filter(
                                    (v) => v !== cuisine.value,
                                  )
                                : [...currentValues, cuisine.value];
                              field.onChange(newValues);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span>{cuisine.label}</span>
                              {field.value?.includes(cuisine.value) && (
                                <Check className="h-4 w-4 text-blue-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Setup <Check className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingFlow;
