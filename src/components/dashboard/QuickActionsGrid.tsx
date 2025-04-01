import React from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Plus,
  Droplet,
  Weight,
  Timer,
  Bell,
  UtensilsCrossed,
} from "lucide-react";

interface QuickActionProps {
  actions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const QuickActionsGrid = ({ actions = defaultActions }: QuickActionProps) => {
  return (
    <Card className="w-full p-6 bg-white shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {actions.map((action) => (
          <TooltipProvider key={action.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`flex flex-col items-center justify-center h-24 w-full border-2 ${action.color} hover:bg-gray-50 transition-colors`}
                  onClick={action.onClick}
                >
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <span className="text-sm font-medium">{action.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add {action.label.toLowerCase()}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </Card>
  );
};

// Default actions with mock functionality
const defaultActions: QuickAction[] = [
  {
    id: "add-food",
    label: "Add Food",
    icon: <UtensilsCrossed className="text-green-500" />,
    onClick: () => console.log("Add food clicked"),
    color: "border-green-200 hover:border-green-300",
  },
  {
    id: "add-water",
    label: "Add Water",
    icon: <Droplet className="text-blue-500" />,
    onClick: () => console.log("Add water clicked"),
    color: "border-blue-200 hover:border-blue-300",
  },
  {
    id: "log-weight",
    label: "Log Weight",
    icon: <Weight className="text-purple-500" />,
    onClick: () => console.log("Log weight clicked"),
    color: "border-purple-200 hover:border-purple-300",
  },
  {
    id: "start-fast",
    label: "Start Fast",
    icon: <Timer className="text-orange-500" />,
    onClick: () => console.log("Start fast clicked"),
    color: "border-orange-200 hover:border-orange-300",
  },
  {
    id: "set-reminder",
    label: "Set Reminder",
    icon: <Bell className="text-red-500" />,
    onClick: () => console.log("Set reminder clicked"),
    color: "border-red-200 hover:border-red-300",
  },
];

export default QuickActionsGrid;
