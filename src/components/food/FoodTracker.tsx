import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import {
  Search,
  Camera,
  Plus,
  X,
  Check,
  Filter,
  Clock,
  ArrowRight,
} from "lucide-react";

interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving: string;
  cuisine: "indian" | "us" | "chinese" | "other";
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
}

interface FoodLogItem extends FoodItem {
  timestamp: Date;
  quantity: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
}

interface FoodTrackerProps {
  onAddFood?: (food: FoodLogItem) => void;
  foodDatabase?: FoodItem[];
  foodLog?: FoodLogItem[];
}

const defaultFoodDatabase: FoodItem[] = [
  {
    id: "1",
    name: "Dal Makhani",
    calories: 230,
    protein: 9,
    carbs: 28,
    fat: 10,
    serving: "1 cup",
    cuisine: "indian",
  },
  {
    id: "2",
    name: "Chicken Burger",
    calories: 450,
    protein: 25,
    carbs: 40,
    fat: 22,
    serving: "1 burger",
    cuisine: "us",
  },
  {
    id: "3",
    name: "Fried Rice",
    calories: 350,
    protein: 8,
    carbs: 55,
    fat: 12,
    serving: "1 cup",
    cuisine: "chinese",
  },
  {
    id: "4",
    name: "Paneer Tikka",
    calories: 280,
    protein: 18,
    carbs: 8,
    fat: 20,
    serving: "100g",
    cuisine: "indian",
  },
  {
    id: "5",
    name: "Caesar Salad",
    calories: 180,
    protein: 5,
    carbs: 10,
    fat: 15,
    serving: "1 bowl",
    cuisine: "us",
  },
  {
    id: "6",
    name: "Dumplings",
    calories: 300,
    protein: 12,
    carbs: 40,
    fat: 10,
    serving: "6 pieces",
    cuisine: "chinese",
  },
];

const defaultFoodLog: FoodLogItem[] = [
  {
    ...defaultFoodDatabase[0],
    timestamp: new Date(new Date().setHours(8, 30)),
    quantity: 1,
    mealType: "breakfast",
  },
  {
    ...defaultFoodDatabase[4],
    timestamp: new Date(new Date().setHours(13, 0)),
    quantity: 1,
    mealType: "lunch",
  },
  {
    ...defaultFoodDatabase[2],
    timestamp: new Date(new Date().setHours(19, 30)),
    quantity: 1.5,
    mealType: "dinner",
  },
];

const FoodTracker: React.FC<FoodTrackerProps> = ({
  onAddFood = () => {},
  foodDatabase = defaultFoodDatabase,
  foodLog = defaultFoodLog,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [selectedMealType, setSelectedMealType] = useState<string>("breakfast");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [manualEntryOpen, setManualEntryOpen] = useState(false);
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [newFoodItem, setNewFoodItem] = useState<Partial<FoodItem>>({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: "",
    cuisine: "other",
  });

  // Filter foods based on search query and cuisine
  const filteredFoods = foodDatabase.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "all" || food.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  // Group food log by meal type
  const groupedFoodLog = foodLog.reduce(
    (acc, food) => {
      if (!acc[food.mealType]) {
        acc[food.mealType] = [];
      }
      acc[food.mealType].push(food);
      return acc;
    },
    {} as Record<string, FoodLogItem[]>,
  );

  const handleAddFood = () => {
    if (selectedFood) {
      const newLogItem: FoodLogItem = {
        ...selectedFood,
        timestamp: new Date(),
        quantity: quantity,
        mealType: selectedMealType as
          | "breakfast"
          | "lunch"
          | "dinner"
          | "snack",
      };
      onAddFood(newLogItem);
      setSelectedFood(null);
      setQuantity(1);
    }
  };

  const handleManualAdd = () => {
    if (newFoodItem.name && newFoodItem.calories) {
      const newFood: FoodItem = {
        id: `manual-${Date.now()}`,
        name: newFoodItem.name || "",
        calories: newFoodItem.calories || 0,
        protein: newFoodItem.protein || 0,
        carbs: newFoodItem.carbs || 0,
        fat: newFoodItem.fat || 0,
        serving: newFoodItem.serving || "serving",
        cuisine:
          (newFoodItem.cuisine as "indian" | "us" | "chinese" | "other") ||
          "other",
      };

      const newLogItem: FoodLogItem = {
        ...newFood,
        timestamp: new Date(),
        quantity: quantity,
        mealType: selectedMealType as
          | "breakfast"
          | "lunch"
          | "dinner"
          | "snack",
      };

      onAddFood(newLogItem);
      setManualEntryOpen(false);
      setNewFoodItem({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving: "",
        cuisine: "other",
      });
      setQuantity(1);
    }
  };

  const handleBarcodeScanned = (barcode: string) => {
    // Simulate finding a food item by barcode
    // In a real app, this would call an API to look up the barcode
    const mockFoundItem = {
      id: `barcode-${barcode}`,
      name: "Scanned Food Item",
      calories: 250,
      protein: 10,
      carbs: 30,
      fat: 12,
      serving: "1 package",
      cuisine: "other" as const,
    };

    setSelectedFood(mockFoundItem);
    setBarcodeDialogOpen(false);
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-lg shadow-sm">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Food Tracker</h2>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setManualEntryOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Manually
            </Button>
            <Button
              variant="outline"
              onClick={() => setBarcodeDialogOpen(true)}
            >
              <Camera className="mr-2 h-4 w-4" /> Scan Barcode
            </Button>
          </div>
        </div>

        <Tabs defaultValue="search" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="search">Search Foods</TabsTrigger>
            <TabsTrigger value="log">Food Log</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <div className="flex space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search for foods..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select
                value={selectedCuisine}
                onValueChange={setSelectedCuisine}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cuisines</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="us">American</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={selectedMealType}
                onValueChange={setSelectedMealType}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Meal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ScrollArea className="h-[400px] rounded-md border p-4">
              {filteredFoods.length > 0 ? (
                <div className="space-y-4">
                  {filteredFoods.map((food) => (
                    <Card
                      key={food.id}
                      className={`cursor-pointer transition-colors ${selectedFood?.id === food.id ? "border-primary" : ""}`}
                      onClick={() => setSelectedFood(food)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{food.name}</h3>
                            <p className="text-sm text-gray-500">
                              {food.serving}
                            </p>
                            <div className="flex items-center mt-1 space-x-2">
                              <Badge variant="outline">{food.cuisine}</Badge>
                              <span className="text-sm">
                                {food.calories} kcal
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs space-y-1">
                              <p>Protein: {food.protein}g</p>
                              <p>Carbs: {food.carbs}g</p>
                              <p>Fat: {food.fat}g</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <p className="text-gray-500">
                    No foods found matching your search criteria.
                  </p>
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCuisine("all");
                    }}
                  >
                    Clear filters
                  </Button>
                </div>
              )}
            </ScrollArea>

            {selectedFood && (
              <div className="p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{selectedFood.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedFood.calories * quantity} kcal total
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="quantity">Quantity:</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0.25"
                      step="0.25"
                      value={quantity}
                      onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      className="w-20"
                    />
                    <Button onClick={handleAddFood}>Add to Log</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="log" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Today's Food Log</h3>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Clock className="mr-2 h-4 w-4" /> Previous Days
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" /> Filter
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                <div key={mealType} className="space-y-2">
                  <div className="flex items-center">
                    <h4 className="text-md font-medium capitalize">
                      {mealType}
                    </h4>
                    <Separator className="flex-1 mx-4" />
                    <span className="text-sm text-gray-500">
                      {groupedFoodLog[mealType]?.reduce(
                        (sum, food) => sum + food.calories * food.quantity,
                        0,
                      ) || 0}{" "}
                      kcal
                    </span>
                  </div>

                  {groupedFoodLog[mealType]?.length ? (
                    <div className="space-y-2">
                      {groupedFoodLog[mealType].map((food) => (
                        <Card
                          key={`${food.id}-${food.timestamp.getTime()}`}
                          className="p-3"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center">
                                <h5 className="font-medium">{food.name}</h5>
                                <span className="text-xs text-gray-500 ml-2">
                                  {food.timestamp.toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                              <p className="text-sm">
                                {food.quantity} {food.serving} (
                                {food.calories * food.quantity} kcal)
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <Button variant="ghost" size="sm">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <X className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md bg-gray-50">
                      <p className="text-gray-500">No {mealType} logged yet</p>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSelectedMealType(mealType);
                        }}
                      >
                        Add {mealType}
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="text-center py-8 border rounded-md bg-gray-50">
              <p className="text-gray-500">
                You haven't saved any favorite foods yet.
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Foods you frequently eat can be saved here for quick access.
              </p>
              <Button variant="link" className="mt-2">
                Browse foods to add favorites
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Manual Entry Dialog */}
      <Dialog open={manualEntryOpen} onOpenChange={setManualEntryOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Food Manually</DialogTitle>
            <DialogDescription>
              Enter the details of the food item you want to add to your log.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newFoodItem.name}
                onChange={(e) =>
                  setNewFoodItem({ ...newFoodItem, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                value={newFoodItem.calories}
                onChange={(e) =>
                  setNewFoodItem({
                    ...newFoodItem,
                    calories: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="protein" className="text-right">
                Protein (g)
              </Label>
              <Input
                id="protein"
                type="number"
                value={newFoodItem.protein}
                onChange={(e) =>
                  setNewFoodItem({
                    ...newFoodItem,
                    protein: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="carbs" className="text-right">
                Carbs (g)
              </Label>
              <Input
                id="carbs"
                type="number"
                value={newFoodItem.carbs}
                onChange={(e) =>
                  setNewFoodItem({
                    ...newFoodItem,
                    carbs: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fat" className="text-right">
                Fat (g)
              </Label>
              <Input
                id="fat"
                type="number"
                value={newFoodItem.fat}
                onChange={(e) =>
                  setNewFoodItem({
                    ...newFoodItem,
                    fat: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serving" className="text-right">
                Serving
              </Label>
              <Input
                id="serving"
                value={newFoodItem.serving}
                onChange={(e) =>
                  setNewFoodItem({ ...newFoodItem, serving: e.target.value })
                }
                className="col-span-3"
                placeholder="e.g., 1 cup, 100g"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cuisine" className="text-right">
                Cuisine
              </Label>
              <Select
                value={newFoodItem.cuisine as string}
                onValueChange={(value) =>
                  setNewFoodItem({ ...newFoodItem, cuisine: value as any })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="us">American</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantity" className="text-right">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                min="0.25"
                step="0.25"
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="mealType" className="text-right">
                Meal Type
              </Label>
              <Select
                value={selectedMealType}
                onValueChange={setSelectedMealType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setManualEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleManualAdd}>Add to Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Barcode Scanner Dialog */}
      <Dialog open={barcodeDialogOpen} onOpenChange={setBarcodeDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Scan Barcode</DialogTitle>
            <DialogDescription>
              Position the barcode within the camera frame to scan.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center mb-4">
              <Camera className="h-12 w-12 text-gray-400" />
              <p className="text-gray-500 text-center">
                Camera preview would appear here
              </p>
            </div>

            {/* Simulated barcode scanning */}
            <div className="space-y-2 w-full">
              <p className="text-sm text-center text-gray-500">
                For demo purposes, select a mock barcode:
              </p>
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  onClick={() => handleBarcodeScanned("123456789")}
                >
                  Scan Cereal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleBarcodeScanned("987654321")}
                >
                  Scan Protein Bar
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBarcodeDialogOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodTracker;
