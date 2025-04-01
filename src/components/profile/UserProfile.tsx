import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { supabase, UserProfile as UserProfileType } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Alert, AlertDescription } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Loader2, Save, User, Lock, Camera } from "lucide-react";

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileType | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Personal info form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState<"male" | "female" | "other">("male");
  const [height, setHeight] = useState(170); // cm
  const [weight, setWeight] = useState(70); // kg

  // Fitness goals form
  const [activityLevel, setActivityLevel] = useState<
    | "sedentary"
    | "lightly_active"
    | "moderately_active"
    | "very_active"
    | "extremely_active"
  >("moderately_active");
  const [goalType, setGoalType] = useState<
    "weight_loss" | "weight_gain" | "maintain"
  >("weight_loss");
  const [targetWeight, setTargetWeight] = useState(65);
  const [weeklyGoal, setWeeklyGoal] = useState(0.5); // kg per week
  const [timeframe, setTimeframe] = useState(12); // weeks

  // Diet preferences form
  const [dietType, setDietType] = useState<
    | "no_restriction"
    | "vegetarian"
    | "vegan"
    | "keto"
    | "paleo"
    | "mediterranean"
  >("no_restriction");
  const [mealFrequency, setMealFrequency] = useState<
    "three" | "four" | "five" | "six"
  >("three");
  const [cuisinePreferences, setCuisinePreferences] = useState<string[]>([
    "indian",
    "us",
  ]);

  // Password change form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email);
      setName(user.name || "");
      setAvatarUrl(user.avatar_url || null);
      fetchUserProfile();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Check if user profile exists
      const { data, error } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setUserProfile(data as UserProfileType);
        // Set form values from profile
        setName(data.name);
        setAge(data.age);
        setGender(data.gender);
        setHeight(data.height);
        setWeight(data.weight);
        setActivityLevel(data.activity_level);
        setGoalType(data.goal_type);
        setTargetWeight(data.target_weight);
        setWeeklyGoal(data.weekly_goal);
        setTimeframe(data.timeframe);
        setDietType(data.diet_type);
        setMealFrequency(data.meal_frequency);
        setCuisinePreferences(data.cuisine_preferences);
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      setError(err.message || "Failed to fetch user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Update user name in users table
      const { error: userUpdateError } = await supabase
        .from("users")
        .update({ name })
        .eq("id", user.id);

      if (userUpdateError) throw userUpdateError;

      // Prepare profile data
      const profileData = {
        user_id: user.id,
        name,
        age,
        gender,
        height,
        weight,
        activity_level: activityLevel,
        goal_type: goalType,
        target_weight: targetWeight,
        weekly_goal: weeklyGoal,
        timeframe,
        diet_type: dietType,
        meal_frequency: mealFrequency,
        cuisine_preferences: cuisinePreferences,
      };

      if (userProfile) {
        // Update existing profile
        const { error: profileUpdateError } = await supabase
          .from("user_profiles")
          .update(profileData)
          .eq("id", userProfile.id);

        if (profileUpdateError) throw profileUpdateError;
      } else {
        // Create new profile
        const { error: profileInsertError } = await supabase
          .from("user_profiles")
          .insert([profileData]);

        if (profileInsertError) throw profileInsertError;
      }

      setSuccess("Profile updated successfully");
      fetchUserProfile(); // Refresh profile data
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }

    setSaving(true);

    try {
      // First verify current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      });

      if (signInError) {
        setPasswordError("Current password is incorrect");
        setSaving(false);
        return;
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setPasswordSuccess("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      console.error("Error changing password:", err);
      setPasswordError(err.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.files || !event.target.files.length) {
      return;
    }

    const file = event.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    setUploading(true);

    try {
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // Update user with avatar URL
      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user?.id);

      if (updateError) throw updateError;

      setAvatarUrl(data.publicUrl);
      setSuccess("Avatar updated successfully");
    } catch (err: any) {
      console.error("Error uploading avatar:", err);
      setError(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
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
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>

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

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <Card className="w-full md:w-64 flex-shrink-0">
          <CardContent className="p-6 flex flex-col items-center">
            <div className="relative mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {name
                    ? name[0].toUpperCase()
                    : user?.email?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1 rounded-full cursor-pointer"
              >
                <Camera className="h-4 w-4" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <h2 className="text-xl font-semibold">{name || "(No name)"}</h2>
            <p className="text-sm text-gray-500 mb-4">{email}</p>
            <div className="w-full">
              <div className="flex justify-between text-sm mb-1">
                <span>Profile Completion</span>
                <span>80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-1">
          <Tabs defaultValue="personal">
            <TabsList className="mb-6">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="fitness">Fitness Goals</TabsTrigger>
              <TabsTrigger value="diet">Diet Preferences</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={email} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value))}
                        min={1}
                        max={120}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select
                        value={gender}
                        onValueChange={(value: any) => setGender(value)}
                      >
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => setHeight(parseInt(e.target.value))}
                        min={50}
                        max={250}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={weight}
                        onChange={(e) => setWeight(parseInt(e.target.value))}
                        min={20}
                        max={300}
                        step={0.1}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="fitness" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fitness Goals</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity-level">Activity Level</Label>
                      <Select
                        value={activityLevel}
                        onValueChange={(value: any) => setActivityLevel(value)}
                      >
                        <SelectTrigger id="activity-level">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="goal-type">Goal Type</Label>
                      <Select
                        value={goalType}
                        onValueChange={(value: any) => setGoalType(value)}
                      >
                        <SelectTrigger id="goal-type">
                          <SelectValue placeholder="Select goal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight_loss">
                            Weight Loss
                          </SelectItem>
                          <SelectItem value="weight_gain">
                            Weight Gain
                          </SelectItem>
                          <SelectItem value="maintain">
                            Maintain Weight
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="target-weight">Target Weight (kg)</Label>
                      <Input
                        id="target-weight"
                        type="number"
                        value={targetWeight}
                        onChange={(e) =>
                          setTargetWeight(parseFloat(e.target.value))
                        }
                        min={20}
                        max={300}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weekly-goal">Weekly Goal (kg)</Label>
                      <Input
                        id="weekly-goal"
                        type="number"
                        value={weeklyGoal}
                        onChange={(e) =>
                          setWeeklyGoal(parseFloat(e.target.value))
                        }
                        min={0.1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeframe">Timeframe (weeks)</Label>
                      <Input
                        id="timeframe"
                        type="number"
                        value={timeframe}
                        onChange={(e) => setTimeframe(parseInt(e.target.value))}
                        min={1}
                        max={52}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="diet" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Diet Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="diet-type">Diet Type</Label>
                      <Select
                        value={dietType}
                        onValueChange={(value: any) => setDietType(value)}
                      >
                        <SelectTrigger id="diet-type">
                          <SelectValue placeholder="Select diet type" />
                        </SelectTrigger>
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
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="meal-frequency">Meal Frequency</Label>
                      <Select
                        value={mealFrequency}
                        onValueChange={(value: any) => setMealFrequency(value)}
                      >
                        <SelectTrigger id="meal-frequency">
                          <SelectValue placeholder="Select meal frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="three">3 meals per day</SelectItem>
                          <SelectItem value="four">4 meals per day</SelectItem>
                          <SelectItem value="five">5 meals per day</SelectItem>
                          <SelectItem value="six">6 meals per day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label>Cuisine Preferences</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="cuisine-indian"
                            checked={cuisinePreferences.includes("indian")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCuisinePreferences([
                                  ...cuisinePreferences,
                                  "indian",
                                ]);
                              } else {
                                setCuisinePreferences(
                                  cuisinePreferences.filter(
                                    (cuisine) => cuisine !== "indian",
                                  ),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="cuisine-indian"
                            className="text-sm font-normal"
                          >
                            Indian
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="cuisine-us"
                            checked={cuisinePreferences.includes("us")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCuisinePreferences([
                                  ...cuisinePreferences,
                                  "us",
                                ]);
                              } else {
                                setCuisinePreferences(
                                  cuisinePreferences.filter(
                                    (cuisine) => cuisine !== "us",
                                  ),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="cuisine-us"
                            className="text-sm font-normal"
                          >
                            American
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="cuisine-chinese"
                            checked={cuisinePreferences.includes("chinese")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCuisinePreferences([
                                  ...cuisinePreferences,
                                  "chinese",
                                ]);
                              } else {
                                setCuisinePreferences(
                                  cuisinePreferences.filter(
                                    (cuisine) => cuisine !== "chinese",
                                  ),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="cuisine-chinese"
                            className="text-sm font-normal"
                          >
                            Chinese
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="cuisine-other"
                            checked={cuisinePreferences.includes("other")}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setCuisinePreferences([
                                  ...cuisinePreferences,
                                  "other",
                                ]);
                              } else {
                                setCuisinePreferences(
                                  cuisinePreferences.filter(
                                    (cuisine) => cuisine !== "other",
                                  ),
                                );
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label
                            htmlFor="cuisine-other"
                            className="text-sm font-normal"
                          >
                            Other
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}

                  {passwordSuccess && (
                    <Alert className="bg-green-50 border-green-200">
                      <AlertDescription className="text-green-800">
                        {passwordSuccess}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Enter your current password"
                        />
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="pl-10"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handlePasswordChange} disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Change Password</>
                  )}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
