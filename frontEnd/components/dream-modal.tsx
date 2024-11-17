import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dream } from "@/types/dto";

interface DreamModalProps {
  dream: Dream | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DreamModal({ dream, isOpen, onClose }: DreamModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 w-full max-w-3xl mx-auto h-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader className="p-4 sm:p-6">
          <DialogTitle className="text-lg sm:text-xl">Dream Details</DialogTitle>
        </DialogHeader>
        {dream && (
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full" style={{ width: '100%', height: '60vh', maxHeight: '600px', minHeight: '300px' }}>
              <Image
                src={dream.url}
                alt={dream.prompt}
                fill
                className="object-contain"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, 1024px"
                priority
              />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground px-4 sm:px-6 pb-4 sm:pb-6">
              {dream.prompt}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}