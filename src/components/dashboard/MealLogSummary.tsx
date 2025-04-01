import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Clock, Coffee, UtensilsCrossed, Apple, Cookie } from "lucide-react";

interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

interface MealGroup {
  type: "breakfast" | "lunch" | "dinner" | "snacks";
  icon: React.ReactNode;
  title: string;
  items: MealItem[];
  totalCalories: number;
}

interface MealLogSummaryProps {
  meals?: MealGroup[];
  date?: Date;
}

const MealLogSummary = ({
  meals = [
    {
      type: "breakfast",
      icon: <Coffee className="h-4 w-4" />,
      title: "Breakfast",
      items: [
        {
          id: "1",
          name: "Oatmeal with Berries",
          calories: 320,
          protein: 12,
          carbs: 58,
          fat: 6,
          time: "07:30 AM",
        },
        {
          id: "2",
          name: "Greek Yogurt",
          calories: 150,
          protein: 15,
          carbs: 8,
          fat: 5,
          time: "07:45 AM",
        },
      ],
      totalCalories: 470,
    },
    {
      type: "lunch",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      title: "Lunch",
      items: [
        {
          id: "3",
          name: "Grilled Chicken Salad",
          calories: 380,
          protein: 35,
          carbs: 20,
          fat: 15,
          time: "12:30 PM",
        },
        {
          id: "4",
          name: "Whole Grain Bread",
          calories: 120,
          protein: 4,
          carbs: 22,
          fat: 2,
          time: "12:45 PM",
        },
      ],
      totalCalories: 500,
    },
    {
      type: "dinner",
      icon: <UtensilsCrossed className="h-4 w-4" />,
      title: "Dinner",
      items: [
        {
          id: "5",
          name: "Salmon with Quinoa",
          calories: 450,
          protein: 40,
          carbs: 30,
          fat: 18,
          time: "07:00 PM",
        },
        {
          id: "6",
          name: "Steamed Vegetables",
          calories: 80,
          protein: 3,
          carbs: 15,
          fat: 1,
          time: "07:15 PM",
        },
      ],
      totalCalories: 530,
    },
    {
      type: "snacks",
      icon: <Cookie className="h-4 w-4" />,
      title: "Snacks",
      items: [
        {
          id: "7",
          name: "Apple",
          calories: 95,
          protein: 0.5,
          carbs: 25,
          fat: 0.3,
          time: "10:30 AM",
        },
        {
          id: "8",
          name: "Protein Bar",
          calories: 200,
          protein: 15,
          carbs: 20,
          fat: 8,
          time: "03:30 PM",
        },
      ],
      totalCalories: 295,
    },
  ],
  date = new Date(),
}: MealLogSummaryProps) => {
  // Format date to display
  const formattedDate = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Calculate total calories for the day
  const totalDailyCalories = meals.reduce(
    (total, meal) => total + meal.totalCalories,
    0,
  );

  return (
    <Card className="w-full h-full bg-white shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Today's Meals</CardTitle>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-500">{formattedDate}</span>
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Total:{" "}
          <span className="font-medium">{totalDailyCalories} calories</span>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {meals.map((meal) => (
              <TabsTrigger key={meal.type} value={meal.type}>
                <span className="flex items-center gap-1">
                  {meal.icon}
                  <span className="hidden sm:inline">{meal.title}</span>
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <ScrollArea className="h-[250px] pr-4">
              {meals.map((meal, index) => (
                <div key={meal.type} className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {meal.icon}
                      <h3 className="font-medium">{meal.title}</h3>
                    </div>
                    <Badge variant="outline">{meal.totalCalories} cal</Badge>
                  </div>

                  {meal.items.map((item) => (
                    <div key={item.id} className="pl-6 py-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span>{item.time}</span>
                            <span>{item.calories} cal</span>
                            <span>{item.protein}g protein</span>
                          </div>
                        </div>
                      </div>
                      {index < meals.length - 1 && (
                        <Separator className="mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </ScrollArea>
          </TabsContent>

          {meals.map((meal) => (
            <TabsContent key={meal.type} value={meal.type}>
              <ScrollArea className="h-[250px] pr-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {meal.icon}
                    <h3 className="font-medium">{meal.title}</h3>
                  </div>
                  <Badge variant="outline">{meal.totalCalories} cal</Badge>
                </div>

                {meal.items.map((item, idx) => (
                  <div key={item.id} className="pl-6 py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span>{item.time}</span>
                          <span>{item.calories} cal</span>
                          <span>{item.protein}g protein</span>
                        </div>
                      </div>
                    </div>
                    {idx < meal.items.length - 1 && (
                      <Separator className="mt-2" />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MealLogSummary;
