import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const BodyMeasurements = () => {
  const [loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [measurements, setMeasurements] = useState({
    chest: "",
    waist: "",
    hips: "",
    thighs: "",
    arms: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMeasurements({
      ...measurements,
      [name]: value,
    });
  };

  const handleAddMeasurements = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowAddDialog(false);
      setSuccess("Measurements added successfully");

      // Reset form
      setMeasurements({
        chest: "",
        waist: "",
        hips: "",
        thighs: "",
        arms: "",
        date: new Date().toISOString().split("T")[0],
      });
    }, 1000);
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Body Measurements</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Measurements
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Body Measurements</DialogTitle>
              <DialogDescription>
                Record your body measurements to track your progress over time.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={measurements.date}
                  onChange={handleInputChange}
                  className="col-span-3"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="chest" className="text-right">
                  Chest (cm)
                </Label>
                <Input
                  id="chest"
                  name="chest"
                  type="number"
                  value={measurements.chest}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Chest measurement in cm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="waist" className="text-right">
                  Waist (cm)
                </Label>
                <Input
                  id="waist"
                  name="waist"
                  type="number"
                  value={measurements.waist}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Waist measurement in cm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hips" className="text-right">
                  Hips (cm)
                </Label>
                <Input
                  id="hips"
                  name="hips"
                  type="number"
                  value={measurements.hips}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Hips measurement in cm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="thighs" className="text-right">
                  Thighs (cm)
                </Label>
                <Input
                  id="thighs"
                  name="thighs"
                  type="number"
                  value={measurements.thighs}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Thighs measurement in cm"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arms" className="text-right">
                  Arms (cm)
                </Label>
                <Input
                  id="arms"
                  name="arms"
                  type="number"
                  value={measurements.arms}
                  onChange={handleInputChange}
                  className="col-span-3"
                  placeholder="Arms measurement in cm"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMeasurements} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      <Card className="mb-8">
        <CardContent className="p-8 text-center">
          <p className="text-gray-500 mb-4">
            This feature is coming soon! You'll be able to track detailed body
            measurements and see your progress over time.
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Measurements
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Waist-to-Hip Ratio</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">0.8</p>
                <p className="text-sm text-gray-500">Healthy range: 0.8-0.9</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Body Fat %</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">22%</p>
                <p className="text-sm text-gray-500">
                  Estimated based on measurements
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-500">-2.5 cm</p>
                <p className="text-sm text-gray-500">
                  Waist reduction in last 30 days
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Measurement History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                No measurement history available yet. Start tracking your
                measurements to see your progress over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <CardTitle>Measurement Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">
                Charts will be available once you have recorded multiple
                measurements over time.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BodyMeasurements;
