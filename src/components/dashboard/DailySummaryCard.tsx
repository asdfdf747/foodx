import React from "react";
import { Card, CardContent } from "../ui/card";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { InfoIcon } from "lucide-react";

interface MacroData {
  name: string;
  value: number;
  target: number;
  color: string;
}

interface DailySummaryCardProps {
  caloriesConsumed?: number;
  caloriesTarget?: number;
  macros?: MacroData[];
}

const DailySummaryCard = ({
  caloriesConsumed = 1250,
  caloriesTarget = 2000,
  macros = [
    { name: "Protein", value: 75, target: 120, color: "bg-blue-500" },
    { name: "Carbs", value: 150, target: 200, color: "bg-green-500" },
    { name: "Fat", value: 45, target: 65, color: "bg-yellow-500" },
  ],
}: DailySummaryCardProps) => {
  const caloriesRemaining = caloriesTarget - caloriesConsumed;
  const caloriesPercentage = Math.min(
    Math.round((caloriesConsumed / caloriesTarget) * 100),
    100,
  );

  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Calories Summary */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              Daily Calories
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="h-4 w-4 ml-2 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Your personalized daily calorie target based on your goals
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Consumed</span>
              <span className="text-sm font-medium">
                {caloriesConsumed} kcal
              </span>
            </div>

            <Progress value={caloriesPercentage} className="h-2 mb-2" />

            <div className="flex justify-between text-sm">
              <div>
                <span className="font-medium text-2xl">
                  {caloriesRemaining}
                </span>
                <span className="text-gray-500 ml-1">kcal left</span>
              </div>
              <div>
                <span className="text-gray-500">Goal: </span>
                <span className="font-medium">{caloriesTarget} kcal</span>
              </div>
            </div>
          </div>

          <Separator orientation="vertical" className="hidden md:block" />

          {/* Macros Breakdown */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-4">Macros Breakdown</h3>
            <div className="space-y-4">
              {macros.map((macro, index) => {
                const percentage = Math.min(
                  Math.round((macro.value / macro.target) * 100),
                  100,
                );

                return (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{macro.name}</span>
                      <span className="text-sm text-gray-500">
                        {macro.value}g / {macro.target}g
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${macro.color} h-2 rounded-full`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailySummaryCard;
