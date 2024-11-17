import useSWR from 'swr';

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface Session {
  user?: User;
}

const fetcher = async (url: string) => {
  const res = await fetch(url);
  return res.json();
};

export function useAuth() {
  const { data: session, error } = useSWR<Session>('/api/session', fetcher);

  return {
    user: session?.user || null,
    isAuthenticated: !!session?.user,
    isLoading: !error && !session,
    error,
  };
}
