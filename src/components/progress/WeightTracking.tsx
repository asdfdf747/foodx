import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { supabase, WeightLog } from "../../lib/supabase";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2, Plus, Trash2, PenLine } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const WeightTracking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [weight, setWeight] = useState(70);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [selectedLog, setSelectedLog] = useState<WeightLog | null>(null);

  useEffect(() => {
    if (user) {
      fetchWeightLogs();
    }
  }, [user]);

  const fetchWeightLogs = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("date", { ascending: true });

      if (error) throw error;

      setWeightLogs(data as WeightLog[]);
    } catch (err: any) {
      console.error("Error fetching weight logs:", err);
      setError(err.message || "Failed to fetch weight logs");
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!user) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.from("weight_logs").insert([
        {
          user_id: user.id,
          weight,
          date,
          notes: notes || null,
        },
      ]);

      if (error) throw error;

      setSuccess("Weight log added successfully");
      setShowAddDialog(false);
      resetForm();
      fetchWeightLogs();
    } catch (err: any) {
      console.error("Error adding weight log:", err);
      setError(err.message || "Failed to add weight log");
    } finally {
      setSaving(false);
    }
  };

  const handleEditWeight = async () => {
    if (!user || !selectedLog) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from("weight_logs")
        .update({
          weight,
          date,
          notes: notes || null,
        })
        .eq("id", selectedLog.id);

      if (error) throw error;

      setSuccess("Weight log updated successfully");
      setShowEditDialog(false);
      resetForm();
      fetchWeightLogs();
    } catch (err: any) {
      console.error("Error updating weight log:", err);
      setError(err.message || "Failed to update weight log");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteWeight = async (id: string) => {
    if (!user) return;

    if (!confirm("Are you sure you want to delete this weight log?")) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from("weight_logs")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSuccess("Weight log deleted successfully");
      fetchWeightLogs();
    } catch (err: any) {
      console.error("Error deleting weight log:", err);
      setError(err.message || "Failed to delete weight log");
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (log: WeightLog) => {
    setSelectedLog(log);
    setWeight(log.weight);
    setDate(log.date);
    setNotes(log.notes || "");
    setShowEditDialog(true);
  };

  const resetForm = () => {
    setWeight(70);
    setDate(new Date().toISOString().split("T")[0]);
    setNotes("");
    setSelectedLog(null);
  };

  const getChartData = () => {
    return weightLogs.map((log) => ({
      date: new Date(log.date).toLocaleDateString(),
      weight: log.weight,
    }));
  };

  const getWeightStats = () => {
    if (weightLogs.length === 0) return { current: 0, initial: 0, change: 0 };

    const current = weightLogs[weightLogs.length - 1].weight;
    const initial = weightLogs[0].weight;
    const change = current - initial;

    return { current, initial, change };
  };

  const stats = getWeightStats();

  if (loading && weightLogs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weight Tracking</h1>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Weight
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Weight Log</DialogTitle>
              <DialogDescription>
                Record your weight to track your progress over time.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="weight" className="text-right">
                  Weight (kg)
                </Label>
                <Input
                  id="weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="col-span-3"
                  min={20}
                  max={300}
                  step={0.1}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date" className="text-right">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional notes about this weight measurement"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddWeight} disabled={saving}>
                {saving ? (
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

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Weight Log</DialogTitle>
              <DialogDescription>
                Update your weight log information.
              </DialogDescription>
            </DialogHeader>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-weight" className="text-right">
                  Weight (kg)
                </Label>
                <Input
                  id="edit-weight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="col-span-3"
                  min={20}
                  max={300}
                  step={0.1}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-date" className="text-right">
                  Date
                </Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="col-span-3"
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-notes" className="text-right">
                  Notes
                </Label>
                <Textarea
                  id="edit-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional notes about this weight measurement"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditWeight} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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

      {weightLogs.length === 0 ? (
        <Card className="mb-8">
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">
              You haven't recorded any weight logs yet. Start tracking your
              weight to see your progress over time.
            </p>
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Your First Weight Log
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Current Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.current.toFixed(1)} kg
                </div>
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(
                    weightLogs[weightLogs.length - 1].date,
                  ).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Initial Weight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.initial.toFixed(1)} kg
                </div>
                <p className="text-xs text-gray-500">
                  Recorded: {new Date(weightLogs[0].date).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Weight Change
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${stats.change < 0 ? "text-green-500" : stats.change > 0 ? "text-red-500" : ""}`}
                >
                  {stats.change > 0 ? "+" : ""}
                  {stats.change.toFixed(1)} kg
                </div>
                <p className="text-xs text-gray-500">
                  {stats.change < 0
                    ? "Lost"
                    : stats.change > 0
                      ? "Gained"
                      : "Maintained"}{" "}
                  since you started tracking
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Weight Progress Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                      name="Weight (kg)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Log History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weightLogs
                    .slice()
                    .reverse()
                    .map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          {new Date(log.date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{log.weight.toFixed(1)}</TableCell>
                        <TableCell>{log.notes || "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(log)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteWeight(log.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default WeightTracking;
