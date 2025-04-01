import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Progress } from "../ui/progress";
import { Play, Pause, RefreshCw } from "lucide-react";

interface FastingTimerWidgetProps {
  isActive?: boolean;
  fastingSchedule?: string;
  startTime?: Date;
  endTime?: Date;
  onStart?: () => void;
  onPause?: () => void;
  onReset?: () => void;
  onScheduleChange?: (schedule: string) => void;
}

const FastingTimerWidget = ({
  isActive = false,
  fastingSchedule = "16:8",
  startTime = new Date(Date.now() - 2 * 60 * 60 * 1000), // Default: started 2 hours ago
  endTime = new Date(Date.now() + 14 * 60 * 60 * 1000), // Default: 14 hours remaining
  onStart = () => {},
  onPause = () => {},
  onReset = () => {},
  onScheduleChange = () => {},
}: FastingTimerWidgetProps) => {
  const [timeRemaining, setTimeRemaining] = useState<string>("00:00:00");
  const [progress, setProgress] = useState<number>(0);
  const [localIsActive, setLocalIsActive] = useState<boolean>(isActive);

  // Calculate time remaining and progress
  useEffect(() => {
    const calculateTimeRemaining = () => {
      if (!localIsActive) return;

      const now = new Date();
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeRemaining("00:00:00");
        setProgress(100);
        setLocalIsActive(false);
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      );

      // Calculate progress percentage
      const totalDuration = endTime.getTime() - startTime.getTime();
      const elapsed = now.getTime() - startTime.getTime();
      const progressPercentage = Math.min(100, (elapsed / totalDuration) * 100);
      setProgress(progressPercentage);
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [localIsActive, startTime, endTime]);

  const handleStart = () => {
    setLocalIsActive(true);
    onStart();
  };

  const handlePause = () => {
    setLocalIsActive(false);
    onPause();
  };

  const handleReset = () => {
    setLocalIsActive(false);
    setProgress(0);
    setTimeRemaining("00:00:00");
    onReset();
  };

  const handleScheduleChange = (value: string) => {
    onScheduleChange(value);
  };

  return (
    <Card className="w-full max-w-md shadow-md bg-white dark:bg-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex justify-between items-center">
          <span>Fasting Timer</span>
          <Select value={fastingSchedule} onValueChange={handleScheduleChange}>
            <SelectTrigger className="w-24 h-8 text-xs">
              <SelectValue placeholder="Schedule" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="16:8">16:8</SelectItem>
              <SelectItem value="18:6">18:6</SelectItem>
              <SelectItem value="20:4">20:4</SelectItem>
              <SelectItem value="OMAD">OMAD</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full flex justify-center">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute text-2xl font-bold">{timeRemaining}</div>
            </div>
          </div>

          <div className="text-sm text-center">
            {localIsActive ? "Fasting in progress" : "Fasting paused"}
          </div>

          <div className="flex space-x-2 w-full justify-center">
            {!localIsActive ? (
              <Button size="sm" onClick={handleStart}>
                <Play className="h-4 w-4 mr-1" /> Start
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={handlePause}>
                <Pause className="h-4 w-4 mr-1" /> Pause
              </Button>
            )}
            <Button size="sm" variant="outline" onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>

          <div className="w-full text-xs text-center text-muted-foreground">
            {localIsActive ? (
              <span>Next meal in {timeRemaining}</span>
            ) : (
              <span>Select schedule and start timer</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FastingTimerWidget;
