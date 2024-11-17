'use client';

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { DreamModal } from "@/components/dream-modal";
import { Dream } from "@/types/dto";
import Image from "next/image";
interface DreamsGalleryProps {
  initialDreams: Dream[];
}

export function DreamsGallery({ initialDreams }: DreamsGalleryProps) {
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your Dreams</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {initialDreams.map((dream) => (
          <Card 
            key={dream.dreamId} 
            className="overflow-hidden group relative aspect-square cursor-pointer"
            onClick={() => {
              if (!dream.url) return;
              setIsModalOpen(true);
              setSelectedDream(dream);
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={dream.url ?? ''}
                alt={dream.prompt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </Card>
        ))}
      </div>

      <DreamModal
        dream={selectedDream}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
} 