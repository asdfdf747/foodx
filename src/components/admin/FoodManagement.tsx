import React, { useState, useEffect } from "react";
import { supabase, FoodItem } from "../../lib/supabase";
import { useAuth } from "../../lib/auth-context";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  PlusCircle,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Utensils,
  MessageSquare,
} from "lucide-react";

const FoodManagement = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string>("all");
  const [showAddFoodDialog, setShowAddFoodDialog] = useState(false);
  const [showEditFoodDialog, setShowEditFoodDialog] = useState(false);
  const [showDeleteFoodDialog, setShowDeleteFoodDialog] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [showCreateAdDialog, setShowCreateAdDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    serving: "",
    cuisine: "indian" as "indian" | "us" | "chinese" | "other",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Fetch foods
  const fetchFoods = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("food_items")
        .select("*")
        .order("name");

      if (error) throw error;

      setFoods(data as FoodItem[]);
    } catch (err: any) {
      console.error("Error fetching foods:", err);
      setError(err.message || "Failed to fetch food items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // Filter foods based on search query and cuisine
  const filteredFoods = foods.filter((food) => {
    const matchesSearch = food.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCuisine =
      selectedCuisine === "all" || food.cuisine === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "name" || name === "serving" ? value : Number(value),
    });
  };

  // Handle cuisine selection
  const handleCuisineChange = (value: "indian" | "us" | "chinese" | "other") => {
    setFormData({
      ...formData,
      cuisine: value,
    });
  };

  // Add new food item
  const handleAddFood = async () => {
    setFormError(null);
    setFormLoading(true);

    if (!formData.name || !formData.serving) {
      setFormError("Name and serving size are required");
      setFormLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from("food_items").insert([
        {
          ...formData,
          created_by: user?.id || "",
        },
      ]);

      if (error) throw error;

      // Reset form and close dialog
      setFormData({
        name: "",
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        serving: "",
        cuisine: "indian",
      });
      setShowAddFoodDialog(false);

      // Refresh food list
      fetchFoods();
    } catch (err: any) {
      console.error("Error adding food:", err);
      setFormError(err.message || "Failed to add food item");
    } finally {
      setFormLoading(false);
    }
  };

  // Edit food item
  const handleEditFood = async () => {
    if (!selectedFood) return;

    setFormError(null);
    setFormLoading(true);

    try {
      const { error } = await supabase
        .from("food_items")
        .update(formData)
        .eq("id", selectedFood.id);

      if (error) throw error;

      // Reset form and close dialog
      setShowEditFoodDialog(false);
      setSelectedFood(null);

      // Refresh food list
      fetchFoods();
    } catch (err: any) {
      console.error("Error updating food:", err);
      setFormError(err.message || "Failed to update food item");
    } finally {
      setFormLoading(false);
    }
  };

  // Delete food item
  const handleDeleteFood = async () => {
    if (!selectedFood) return;

    setFormLoading(true);

    try {
      const { error } = await supabase
        .from("food_items")
        .delete()
        .eq("id", selectedFood.id);

      if (error) throw error;

      // Reset form and close dialog
      setShowDeleteFoodDialog(false);
      setSelectedFood(null);

      //