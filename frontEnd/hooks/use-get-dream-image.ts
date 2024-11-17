import { useState } from "react";
import { getDreamImage } from "@/lib/server-actions";
import { GetDreamImageResponse } from "@/types/dto";

export function useGetDreamImage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetDreamImageResponse | null>(null);

  const fetch = async (dreamId: string, userId: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      setError(null);

      const result = await getDreamImage(dreamId, userId);
      console.log(result);
      setData(result);
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