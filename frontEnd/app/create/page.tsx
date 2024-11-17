"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import EmojiButton from "@/components/emoji-button";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { DreamFormData, Fragment } from "@/types/dto";
import { useCreateMemory } from "@/hooks/use-create-memory";
import LoadingOverlay from "@/components/loading-overlay";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { SignInPromptCard } from "@/components/sign-in-prompt-card";

export default function CreatePage() {
  const { isAuthenticated } = useAuth();
  const [customMood, setCustomMood] = useState("");
  const [customProtagonist, setCustomProtagonist] = useState("");
  const [fragment, setFragment] = useState<Fragment>({
    location: "",
    interaction: "",
    entity: "",
    relation: "",
  });
  const [selectedMood, setSelectedMood] = useState("happy");
  const [selectedProtagonist, setSelectedProtagonist] = useState("human");

  const { toast } = useToast();

  const router = useRouter();
  const { mutate, data, isError, error } = useCreateMemory();
  const [formLoading, setFormLoading] = useState(false);

  const updateFragment = useCallback((field: keyof Fragment, value: string) => {
    setFragment((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const dreamData: DreamFormData = {
        mood: selectedMood === "custom" ? customMood : selectedMood,
        protagonist:
          selectedProtagonist === "custom"
            ? customProtagonist
            : selectedProtagonist,
        fragments: fragment,
      };

      const result = await mutate(dreamData);

      console.log(data);
      console.log(isError);
      console.log(error);
      console.log(result);
      
      if (isError) {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: error || "There was a problem with your request.",
        });
      }

      if (result?.success && result?.data) {
        console.log(result.data.dreamId);
        router.push(`/mcq/${result.data.dreamId}`);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error("Error submitting form:", error);
    } finally {
      setFormLoading(false);
    }
  };

  const moodEmojis = {
    happy: { emoji: "😊", text: "Happy" },
    sad: { emoji: "😢", text: "Sad" },
    angry: { emoji: "😠", text: "Angry" },
    custom: { emoji: "✨", text: "Custom" },
  };

  const protagonistEmojis = {
    human: { emoji: "👤", text: "Human" },
    dog: { emoji: "🐕", text: "Dog" },
    custom: { emoji: "✨", text: "Custom" },
  };

  const handleMoodSelect = useCallback((value: string) => {
    setSelectedMood(value);
    if (value !== "custom") {
      setCustomMood("");
    }
  }, []);

  const handleProtagonistSelect = useCallback((value: string) => {
    setSelectedProtagonist(value);
    if (value !== "custom") {
      setCustomProtagonist("");
    }
  }, []);

  if (!isAuthenticated) {
    return <SignInPromptCard />
  }

  return (
    <div className="
    bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30
    grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-bold">Rekindle Your Dreams</h1>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          <div className="rounded-lg border bg-card p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mood Selection */}
              <div className="space-y-4">
                <SectionTitle title="Mood" />
                <div className="flex flex-wrap gap-4">
                  {Object.entries(moodEmojis).map(
                    ([value, { emoji, text }]) => (
                      <EmojiButton
                        key={value}
                        emoji={emoji}
                        text={text}
                        isSelected={selectedMood === value}
                        onClick={() => handleMoodSelect(value)}
                      />
                    )
                  )}
                </div>
                {selectedMood === "custom" && (
                  <input
                    type="text"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    placeholder="Enter custom mood"
                    value={customMood}
                    onChange={(e) => setCustomMood(e.target.value)}
                  />
                )}
              </div>

              {/* Protagonist Selection */}
              <div className="space-y-4">
                <SectionTitle title="Protagonist" />
                <div className="flex flex-wrap gap-4">
                  {Object.entries(protagonistEmojis).map(
                    ([value, { emoji, text }]) => (
                      <EmojiButton
                        key={value}
                        emoji={emoji}
                        text={text}
                        isSelected={selectedProtagonist === value}
                        onClick={() => handleProtagonistSelect(value)}
                      />
                    )
                  )}
                </div>
                {selectedProtagonist === "custom" && (
                  <input
                    type="text"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    placeholder="Enter custom protagonist"
                    value={customProtagonist}
                    onChange={(e) => setCustomProtagonist(e.target.value)}
                  />
                )}
              </div>

              {/* Memory Fragment */}
              <div className="space-y-4">
                <SectionTitle title="Memory Fragment" />
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="space-y-4 p-4 border rounded-md"
                >
                  <input
                    placeholder="Location"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={fragment.location}
                    onChange={(e) => updateFragment("location", e.target.value)}
                  />
                  <input
                    placeholder="Interaction"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={fragment.interaction}
                    onChange={(e) =>
                      updateFragment("interaction", e.target.value)
                    }
                  />
                  <input
                    placeholder="Entity"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={fragment.entity}
                    onChange={(e) => updateFragment("entity", e.target.value)}
                  />
                  <input
                    placeholder="Relation"
                    className="w-full rounded-md border bg-background px-3 py-2"
                    value={fragment.relation}
                    onChange={(e) => updateFragment("relation", e.target.value)}
                  />
                </motion.div>
              </div>

              <RainbowButton
                type="submit"
                className="w-full bg-primary px-8 py-2 text-primary-foreground hover:opacity-90"
              >
                Create Memory
              </RainbowButton>
            </form>
          </div>
        </motion.div>
      </main>
      <LoadingOverlay isLoading={formLoading} />
    </div>
  );
}

const SectionTitle = ({ title }: { title: string }) => {
  return (
    <h2 className="scroll-m-20 text-xl sm:text-2xl font-semibold tracking-tight">
      {title}
    </h2>
  );
};