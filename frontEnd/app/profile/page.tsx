import { auth } from "@/auth";
import { SignInPromptCard } from "@/components/sign-in-prompt-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { getUserDreams } from "@/lib/server-actions";
import { DreamsGallery } from "@/components/dreams-gallery";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return <SignInPromptCard />
  }

  // Fetch dreams on the server
  const dreamsData = await getUserDreams(session.user?.email ?? '');
  const userDreams = dreamsData.dreams;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 w-full max-w-4xl">
        {/* Profile Section */}
        <Card className="p-6 flex flex-col sm:flex-row items-center gap-6">
          <Avatar className="w-24 h-24">
            <AvatarImage src={session.user?.image ?? ''} alt={session.user?.name ?? ''} />
            <AvatarFallback>{session.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h1 className="text-2xl font-bold">{session.user?.name}</h1>
            <p className="text-muted-foreground">{session.user?.email}</p>
          </div>
        </Card>

        {/* Dreams Gallery - now a client component */}
        <DreamsGallery initialDreams={userDreams} />
      </main>
    </div>
  );
}
  