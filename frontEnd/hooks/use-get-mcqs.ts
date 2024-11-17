import { useState } from "react";
import { getMCQs } from "@/lib/server-actions";
import { GetMCQsResponse } from "@/types/dto";

export function useGetMCQs() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetMCQsResponse | null>(null);

  const fetch = async (dreamId: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const result = await getMCQs(dreamId);

      console.log(result);

      setData({
        success: result.success,
        data: result.data,
        errorMessage: result.errorMessage || 'Something went wrong'
      });
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
    fetch,
    isLoading,
    isError,
    error,
    data,
  };
} 