import { useState } from "react";
import { submitMCQAnswers } from "@/lib/server-actions";
import { SubmitMCQAnswersResponse, MCQAnswer } from "@/types/dto";

export function useSubmitMCQs() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SubmitMCQAnswersResponse | null>(null);

  const mutate = async (dreamId: string, answers: MCQAnswer[]) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const enrichedData = {
        dreamId,
        mcqs: answers
      }

      console.log(enrichedData);

      const result = await submitMCQAnswers(enrichedData);
      
      
      setData(result);
      setIsSuccess(result.success);
      setIsError(!result.success);
      setError(result.errorMessage);

      return result;
    } catch (e) {
      setIsError(true);
      setError(e instanceof Error ? e.message : "An error occurred");
      throw e;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    mutate,
    isLoading,
    isSuccess,
    isError,
    error,
    data,
  };
} 