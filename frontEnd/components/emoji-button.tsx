"use client";

import React from 'react'
import { cn } from "@/lib/utils"

interface EmojiButtonProps {
  emoji: string
  text: string
  isSelected: boolean
  onClick: () => void
}

function EmojiButton({ emoji, text, isSelected, onClick }: EmojiButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex flex-col items-center justify-center w-[calc(50%-0.5rem)] sm:w-32 h-24 sm:h-32 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        isSelected
          ? "bg-blue-500 text-white"
          : "bg-white text-gray-800 hover:bg-gray-100 border border-gray-200"
      )}
      onClick={onClick}
      aria-pressed={isSelected}
    >
      <span className="text-3xl sm:text-4xl mb-2" role="img" aria-label={emoji}>
        {emoji}
      </span>
      <span className="text-xs sm:text-sm font-medium">{text}</span>
    </button>
  )
}


export default React.memo(EmojiButton);