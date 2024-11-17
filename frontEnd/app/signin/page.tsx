"use client";
import { MultiStepLoader } from "@/components/multi-step-loader";
import { useState } from "react";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);

  const loadingStates = [
    { text: "Checking credentials..." },
    { text: "Validating session..." },
    { text: "Redirecting to dashboard..." },
  ];

  const handleSignIn = () => {
    setLoading(true);
    // Simulate sign-in process
    setTimeout(() => {
      setLoading(false);
    }, 6000); // Show loader for 6 seconds
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <button
        onClick={handleSignIn}
        className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:opacity-90"
      >
        Sign In
      </button>

      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={2000} // Each state will show for 2 seconds
        loop={false} // Don't loop through states
      />
    </div>
  );
}
