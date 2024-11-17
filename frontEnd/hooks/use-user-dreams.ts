import { useState, useEffect } from "react";
import { getUserDreams } from "@/lib/server-actions";
import { GetUserDreamsResponse } from "@/types/dto";
import { useAuth } from "./use-auth";

export function useUserDreams() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<GetUserDreamsResponse | null>(null);

  useEffect(() => {
    async function fetchDreams() {
      if (!user?.email) return;

      try {
        setIsLoading(true);
        setError(null);
        const result = await getUserDreams(user.email);
        setData(result);
      } catch (e) {
        setError(e instanceof Error ? e.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchDreams();
  }, [user?.email]);

  return {
    dreams: data?.dreams ?? [],
    isLoading,
    error,
  };
} 