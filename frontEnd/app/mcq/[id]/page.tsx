"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useGetMCQs } from "@/hooks/use-get-mcqs";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubmitMCQs } from "@/hooks/use-submit-mcqs";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

function QuestionSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-8 space-y-6">
      {/* Emoji and Question Skeleton */}
      <div className="text-center space-y-4">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-6 w-3/4 mx-auto" />
      </div>

      {/* Options Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>

      {/* Button Skeleton */}
      <Skeleton className="h-10 w-full" />
    </div>
  );
}

export default function MCQPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { fetch, data, isLoading, isError } = useGetMCQs();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<
    Array<{ question: string; answer: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitMCQs = useSubmitMCQs();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetch(params.id);
  }, [params.id]);

  if (isLoading) {
    return (
      <div
        className="
      bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30
      grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20"
      >
        {/* Progress Bar Skeleton */}
        <div className="w-full max-w-2xl h-2 bg-gray-200 rounded-full overflow-hidden">
          <Skeleton className="h-full w-1/3" />
        </div>

        <main className="w-full max-w-2xl space-y-8">
          <QuestionSkeleton />

          {/* Question Counter Skeleton */}
          <div className="text-center">
            <Skeleton className="h-4 w-24 mx-auto" />
          </div>
        </main>
      </div>
    );
  }

  if (isError || !data?.success || !data.data) {
    return <div>Error loading questions</div>;
  }

  const questions = data?.data.mcqs;

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNavigation = async () => {
    if (selectedAnswer) {
      // Check if this question's answer is already recorded
      if (
        answers.some((a) => a.question === questions[currentQuestion].question)
      ) {
        return;
      }

      const newAnswers = [
        ...answers,
        {
          question: questions[currentQuestion].question,
          answer: selectedAnswer,
        },
      ];

      setAnswers(newAnswers);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setIsSubmitting(true);
        try {
          const result = await submitMCQs.mutate(params.id, newAnswers);
          if (result.success && result.prompt) {
            setGeneratedPrompt(result.prompt);
            setShowSuccessModal(true);
          }
        } catch (error) {
          console.error(error);
          // Handle error here
        } finally {
          setIsSubmitting(false);
        }
      }
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <>
      <div
        className="
      bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30
      grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20"
      >
        {/* Progress Bar */}
        <div className="w-full max-w-2xl h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <main className="w-full max-w-2xl space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-lg border bg-card p-8 space-y-6"
            >
              {/* Emoji and Question */}
              <div className="text-center space-y-4">
                <span className="text-6xl">
                  {questions[currentQuestion].emoji}
                </span>
                <h2 className="text-xl font-semibold">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              {/* Options */}
              <div className="grid gap-4">
                {questions[currentQuestion].options.map((option) => (
                  <Button
                    key={option}
                    variant={selectedAnswer === option ? "default" : "outline"}
                    className={`w-full p-4 text-left transition-colors ${
                      selectedAnswer === option
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Navigation Button */}
              <Button
                className="w-full rounded-full"
                disabled={!selectedAnswer || isSubmitting}
                onClick={handleNavigation}
              >
                {isSubmitting && currentQuestion === questions.length - 1 ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span>Generating...</span>
                  </>
                ) : currentQuestion === questions.length - 1 ? (
                  "Submit"
                ) : (
                  "Next"
                )}
              </Button>
            </motion.div>
          </AnimatePresence>

          {/* Question Counter */}
          <p className="text-center text-sm text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </main>
      </div>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your Dream Prompt</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <DialogDescription>{generatedPrompt}</DialogDescription>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => router.push(`/view/${user?.email}/${params.id}`)}
            >
              View Your Dream
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
