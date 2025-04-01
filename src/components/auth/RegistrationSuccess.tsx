import React from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CheckCircle, Mail } from "lucide-react";

const RegistrationSuccess = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-center mt-4">
            Registration Successful!
          </CardTitle>
          <CardDescription className="text-center">
            Thank you for creating an account with FitTrack
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-blue-500" />
            </div>
            <p className="text-sm text-gray-700">
              We've sent a confirmation email to your inbox. Please verify your
              email address to complete the registration process.
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Once verified, you'll be able to log in and start tracking your
            fitness and nutrition journey.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button asChild className="w-full">
            <Link to="/login">Continue to Login</Link>
          </Button>
          <div className="text-center text-sm text-gray-500">
            Didn't receive the email?{" "}
            <Button variant="link" className="p-0 h-auto">
              Resend verification email
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegistrationSuccess;
