import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DailySummaryCard from "./dashboard/DailySummaryCard";
import QuickActionsGrid from "./dashboard/QuickActionsGrid";
import WaterTracker from "./dashboard/WaterTracker";
import ProgressCharts from "./dashboard/ProgressCharts";
import MealLogSummary from "./dashboard/MealLogSummary";
import FastingTimerWidget from "./dashboard/FastingTimerWidget";
import OnboardingFlow from "./onboarding/OnboardingFlow";
import Header from "./layout/Header";

const Home = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Handle onboarding completion
  const handleOnboardingComplete = (data) => {
    setUserProfile(data);
    setShowOnboarding(false);
    // In a real app, you would save this data to your backend
    console.log("Onboarding completed with data:", data);
  };

  // Check if user has completed onboarding
  useEffect(() => {
    // In a real app, you would check if the user has already completed onboarding
    const hasCompletedOnboarding = localStorage.getItem(
      "hasCompletedOnboarding",
    );
    if (hasCompletedOnboarding === "true") {
      setShowOnboarding(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingFlow
          isOpen={showOnboarding}
          onComplete={(data) => {
            handleOnboardingComplete(data);
            localStorage.setItem("hasCompletedOnboarding", "true");
          }}
        />
      )}

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Daily Summary Card */}
        <section className="mb-8">
          <DailySummaryCard />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <QuickActionsGrid />
        </section>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Progress Charts */}
            <ProgressCharts />

            {/* Meal Log Summary */}
            <MealLogSummary />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Water Tracker */}
            <WaterTracker />

            {/* Fasting Timer Widget */}
            <FastingTimerWidget />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© 2023 Fitness & Nutrition Tracker. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/privacy" className="hover:text-gray-700">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-gray-700">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:text-gray-700">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
