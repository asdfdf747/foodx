import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import {
  LineChart,
  BarChart,
  Activity,
  Award,
  TrendingUp,
  Scale,
  Utensils,
} from "lucide-react";

interface ProgressChartsProps {
  weightData?: {
    date: string;
    weight: number;
  }[];
  calorieData?: {
    date: string;
    calories: number;
    goal: number;
  }[];
  achievements?: {
    id: string;
    title: string;
    description: string;
    earned: boolean;
    date?: string;
  }[];
}

const ProgressCharts = ({
  weightData = [
    { date: "2023-06-01", weight: 75.5 },
    { date: "2023-06-08", weight: 74.8 },
    { date: "2023-06-15", weight: 74.2 },
    { date: "2023-06-22", weight: 73.5 },
    { date: "2023-06-29", weight: 72.9 },
    { date: "2023-07-06", weight: 72.3 },
    { date: "2023-07-13", weight: 71.8 },
  ],
  calorieData = [
    { date: "2023-07-07", calories: 1850, goal: 2000 },
    { date: "2023-07-08", calories: 1920, goal: 2000 },
    { date: "2023-07-09", calories: 2100, goal: 2000 },
    { date: "2023-07-10", calories: 1760, goal: 2000 },
    { date: "2023-07-11", calories: 1890, goal: 2000 },
    { date: "2023-07-12", calories: 2050, goal: 2000 },
    { date: "2023-07-13", calories: 1800, goal: 2000 },
  ],
  achievements = [
    {
      id: "1",
      title: "First Step",
      description: "Logged your first meal",
      earned: true,
      date: "2023-06-01",
    },
    {
      id: "2",
      title: "Hydration Hero",
      description: "Reached water goal for 7 consecutive days",
      earned: true,
      date: "2023-06-15",
    },
    {
      id: "3",
      title: "Consistent Tracker",
      description: "Logged all meals for 14 days straight",
      earned: true,
      date: "2023-06-28",
    },
    {
      id: "4",
      title: "Weight Milestone",
      description: "Reached first weight goal",
      earned: false,
    },
    {
      id: "5",
      title: "Fasting Master",
      description: "Completed 10 fasting cycles",
      earned: false,
    },
  ],
}: ProgressChartsProps) => {
  return (
    <Card className="w-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">Progress Tracking</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>-2.6kg</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Activity className="h-3 w-3" />
              <span>On Track</span>
            </Badge>
          </div>
        </div>
        <CardDescription>
          Track your weight, calories, and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weight" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="weight" className="flex items-center gap-2">
              <Scale className="h-4 w-4" />
              Weight
            </TabsTrigger>
            <TabsTrigger value="calories" className="flex items-center gap-2">
              <Utensils className="h-4 w-4" />
              Calories
            </TabsTrigger>
            <TabsTrigger
              value="achievements"
              className="flex items-center gap-2"
            >
              <Award className="h-4 w-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="weight" className="space-y-4">
            <div className="h-64 w-full bg-gray-50 rounded-md p-4 flex flex-col justify-center items-center relative">
              {/* Placeholder for actual chart implementation */}
              <div className="absolute inset-0 p-4">
                <div className="h-full w-full flex flex-col">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <div>Jun 1</div>
                    <div>Jun 15</div>
                    <div>Jul 1</div>
                    <div>Jul 13</div>
                  </div>
                  <div className="relative flex-1">
                    {/* Simplified chart visualization */}
                    <div className="absolute inset-0">
                      <div className="h-full w-full flex items-end">
                        <div className="h-[95%] w-[14%] bg-blue-100 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            75.5kg
                          </div>
                        </div>
                        <div className="h-[90%] w-[14%] bg-blue-200 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            74.8kg
                          </div>
                        </div>
                        <div className="h-[85%] w-[14%] bg-blue-300 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            74.2kg
                          </div>
                        </div>
                        <div className="h-[80%] w-[14%] bg-blue-400 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            73.5kg
                          </div>
                        </div>
                        <div className="h-[75%] w-[14%] bg-blue-500 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            72.9kg
                          </div>
                        </div>
                        <div className="h-[70%] w-[14%] bg-blue-600 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            72.3kg
                          </div>
                        </div>
                        <div className="h-[65%] w-[14%] bg-blue-700 rounded-t-sm relative group">
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            71.8kg
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <LineChart className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                Weight Trend (Last 6 Weeks)
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Starting</p>
                <p className="text-lg font-bold">75.5kg</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Current</p>
                <p className="text-lg font-bold">71.8kg</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="text-lg font-bold">70.0kg</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calories" className="space-y-4">
            <div className="h-64 w-full bg-gray-50 rounded-md p-4 flex flex-col justify-center items-center relative">
              {/* Placeholder for actual chart implementation */}
              <div className="absolute inset-0 p-4">
                <div className="h-full w-full flex flex-col">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <div>Jul 7</div>
                    <div>Jul 9</div>
                    <div>Jul 11</div>
                    <div>Jul 13</div>
                  </div>
                  <div className="relative flex-1">
                    {/* Simplified chart visualization */}
                    <div className="absolute inset-0">
                      <div className="h-full w-full flex items-end">
                        {calorieData.map((day, index) => (
                          <div
                            key={index}
                            className="h-full w-[14%] flex flex-col justify-end items-center"
                          >
                            <div
                              className={`w-4/5 rounded-t-sm relative group ${day.calories > day.goal ? "bg-orange-400" : "bg-green-400"}`}
                              style={{
                                height: `${(day.calories / 2500) * 100}%`,
                              }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {day.calories} cal
                              </div>
                            </div>
                            <div
                              className="w-full border-t-2 border-dashed border-gray-400 absolute"
                              style={{ bottom: `${(day.goal / 2500) * 100}%` }}
                            ></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <BarChart className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 text-sm">
                Calorie History (Last 7 Days)
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Average</p>
                <p className="text-lg font-bold">1,910</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Goal</p>
                <p className="text-lg font-bold">2,000</p>
              </div>
              <div className="bg-green-50 p-3 rounded-md">
                <p className="text-sm text-gray-500">Deficit</p>
                <p className="text-lg font-bold">-630</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-4">
            <div className="grid gap-3">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`flex items-center p-3 rounded-md ${achievement.earned ? "bg-yellow-50" : "bg-gray-50"}`}
                >
                  <div
                    className={`p-2 rounded-full mr-3 ${achievement.earned ? "bg-yellow-100" : "bg-gray-200"}`}
                  >
                    <Award
                      className={`h-5 w-5 ${achievement.earned ? "text-yellow-600" : "text-gray-400"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-medium ${achievement.earned ? "text-yellow-700" : "text-gray-500"}`}
                    >
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned ? (
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 border-yellow-200 text-yellow-700"
                    >
                      Earned{" "}
                      {achievement.date &&
                        new Date(achievement.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-500"
                    >
                      Locked
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProgressCharts;
