"use client";

import { useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Share2 } from "lucide-react";
import { useGetDreamImage } from "@/hooks/use-get-dream-image";
import { MultiStepLoader } from "@/components/multi-step-loader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DreamViewPage({
  params,
}: {
  params: { dreamId: string; userId: string };
}) {
  const { fetch, data, isLoading, isError, error } = useGetDreamImage();

  useEffect(() => {
    fetch(params.dreamId, params.userId);
  }, [params.dreamId, params.userId]);

  

  const loadingStates = [
    { text: "Establishing secure connection..." },
    { text: "Accessing dream archives..." },
    { text: "Decoding neural patterns..." },
    { text: "Analyzing dream sequences..." },
    { text: "Processing visual elements..." },
    { text: "Reconstructing dream environment..." },
    { text: "Enhancing dream details..." },
    { text: "Applying visual filters..." },
    { text: "Validating dream integrity..." },
    { text: "Preparing final visualization..." },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
        <MultiStepLoader
          loadingStates={loadingStates}
          loading={isLoading}
          duration={3000}
          loop={false}
        />
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div>
        Error loading dream
        {error}
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Dream Visualization",
          text: data.data?.prompt,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast notification here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
      <div className="container mx-auto px-4 py-12 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-5xl mx-auto space-y-8"
        >
          <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
                Your Dream Visualization
              </CardTitle>
              <Button
                variant="outline"
                onClick={handleShare}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share Dream
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-square sm:aspect-[3/2]">
                <Image
                  src={data.data?.s3 ?? ""}
                  alt="AI Generated Dream"
                  fill
                  className="object-cover rounded-md"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>

              <p className="text-lg text-muted-foreground">
                {data.data?.prompt}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
