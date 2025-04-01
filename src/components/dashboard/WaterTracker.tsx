import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplet, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  dailyGoal?: number; // in ml
  currentIntake?: number; // in ml
  onAddWater?: (amount: number) => void;
}

const WaterTracker = ({
  dailyGoal = 2500,
  currentIntake = 750,
  onAddWater = () => {},
}: WaterTrackerProps) => {
  const [intake, setIntake] = useState(currentIntake);
  const progressPercentage = Math.min(
    Math.round((intake / dailyGoal) * 100),
    100,
  );

  const handleAddWater = (amount: number) => {
    const newIntake = Math.max(0, intake + amount);
    setIntake(newIntake);
    onAddWater(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Water Intake</h3>
        <Droplet className="text-blue-500 h-5 w-5" />
      </div>

      <div className="flex flex-col items-center justify-center flex-grow">
        <div className="relative w-32 h-32 mb-4">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="text-3xl font-bold text-blue-600">{intake}</span>
              <p className="text-sm text-gray-500">ml</p>
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-gray-200"
              strokeWidth="8"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
            />
            <circle
              className="text-blue-500"
              strokeWidth="8"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="40"
              cx="50"
              cy="50"
              strokeDasharray={`${2 * Math.PI * 40}`}
              strokeDashoffset={`${2 * Math.PI * 40 * (1 - progressPercentage / 100)}`}
              transform="rotate(-90 50 50)"
            />
          </svg>
        </div>

        <div className="w-full mb-2">
          <div className="flex justify-between text-sm mb-1">
            <span>{intake} ml</span>
            <span>{dailyGoal} ml</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <p className="text-sm text-gray-500 mb-4">
          {progressPercentage}% of daily goal
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center justify-center",
            progressPercentage >= 100 ? "opacity-50" : "",
          )}
          onClick={() => handleAddWater(250)}
          disabled={progressPercentage >= 100}
        >
          <Plus className="h-4 w-4 mr-1" />
          250ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex items-center justify-center",
            progressPercentage >= 100 ? "opacity-50" : "",
          )}
          onClick={() => handleAddWater(500)}
          disabled={progressPercentage >= 100}
        >
          <Plus className="h-4 w-4 mr-1" />
          500ml
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center justify-center"
          onClick={() => handleAddWater(-250)}
          disabled={intake <= 0}
        >
          <Minus className="h-4 w-4 mr-1" />
          250ml
        </Button>
      </div>
    </div>
  );
};

export default WaterTracker;
