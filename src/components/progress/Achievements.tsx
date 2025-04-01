import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Award,
  Trophy,
  Target,
  Dumbbell,
  Utensils,
  Droplets,
} from "lucide-react";

const achievements = [
  {
    id: 1,
    title: "First Weigh-In",
    description: "Record your first weight measurement",
    icon: <Award className="h-8 w-8 text-yellow-500" />,
    earned: true,
    date: "2023-10-15",
    category: "weight",
  },
  {
    id: 2,
    title: "Weight Loss Warrior",
    description: "Lose 5kg from your starting weight",
    icon: <Trophy className="h-8 w-8 text-yellow-500" />,
    earned: false,
    progress: 60,
    category: "weight",
  },
  {
    id: 3,
    title: "Goal Setter",
    description: "Set your first weight goal",
    icon: <Target className="h-8 w-8 text-yellow-500" />,
    earned: true,
    date: "2023-10-16",
    category: "goals",
  },
  {
    id: 4,
    title: "Consistency King",
    description: "Log your weight for 7 consecutive days",
    icon: <Award className="h-8 w-8 text-yellow-500" />,
    earned: false,
    progress: 40,
    category: "consistency",
  },
  {
    id: 5,
    title: "Meal Master",
    description: "Log 50 meals",
    icon: <Utensils className="h-8 w-8 text-yellow-500" />,
    earned: false,
    progress: 30,
    category: "nutrition",
  },
  {
    id: 6,
    title: "Hydration Hero",
    description: "Meet your daily water goal for 10 days",
    icon: <Droplets className="h-8 w-8 text-yellow-500" />,
    earned: false,
    progress: 20,
    category: "hydration",
  },
  {
    id: 7,
    title: "Fitness Fanatic",
    description: "Log 20 workouts",
    icon: <Dumbbell className="h-8 w-8 text-yellow-500" />,
    earned: false,
    progress: 10,
    category: "fitness",
  },
];

const Achievements = () => {
  const earnedAchievements = achievements.filter(
    (achievement) => achievement.earned,
  );
  const inProgressAchievements = achievements.filter(
    (achievement) => !achievement.earned,
  );

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Achievements</h1>
        <div className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-semibold">
            {earnedAchievements.length}/{achievements.length} Earned
          </span>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your Achievement Progress</CardTitle>
          <CardDescription>
            Complete various activities to earn badges and track your fitness
            journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Overall Progress</span>
                <span>
                  {Math.round(
                    (earnedAchievements.length / achievements.length) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={(earnedAchievements.length / achievements.length) * 100}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="earned">
          {earnedAchievements.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-gray-500">
                  You haven't earned any achievements yet. Keep tracking your
                  fitness journey to unlock badges!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earnedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  achievement={achievement}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inProgressAchievements.map((achievement) => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const AchievementCard = ({ achievement }) => {
  return (
    <Card
      className={achievement.earned ? "border-yellow-200 bg-yellow-50" : ""}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 bg-white p-3 rounded-full shadow-sm">
            {achievement.icon}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg">{achievement.title}</h3>
              {achievement.earned ? (
                <Badge
                  variant="outline"
                  className="bg-yellow-100 text-yellow-800 border-yellow-200"
                >
                  Earned
                </Badge>
              ) : (
                <Badge variant="outline">In Progress</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {achievement.description}
            </p>
            {achievement.earned ? (
              <p className="text-xs text-gray-500 mt-2">
                Earned on {new Date(achievement.date).toLocaleDateString()}
              </p>
            ) : (
              <div className="mt-2">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-1" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Achievements;
