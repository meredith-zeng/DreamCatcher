"use client";

import { motion, AnimatePresence } from "framer-motion";
import WordRotate from "./ui/word-rotate";

interface LoadingOverlayProps {
  isLoading: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
}) => {
  const rotatingText: string[] = [
    "💭 Reflecting on the fragments of your dream...",
    "✨ Let your memories guide you...",
    "🌀 Unraveling the threads of the night...",
    "🌙 What whispers from your dream remain?",
    "🖋️ Ready to jot down what you recall...",
    "🔮 Look inward and see what surfaces...",
    "🌌 Wandering through the dreamscape of your mind...",
    "💡 Holding onto the fleeting moments of your dream...",
    "🎨 Imagine the vivid details coming back to you...",
    "🌠 A journey into your dream begins...",
  ];

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 bg-opacity-75 backdrop-blur-sm"
        >
          <div className="flex flex-col items-center justify-center text-center w-[90vw] h-[30vh] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] mx-auto bg-white rounded-lg p-8">
            <WordRotate
              words={rotatingText}
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-foreground"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingOverlay;
