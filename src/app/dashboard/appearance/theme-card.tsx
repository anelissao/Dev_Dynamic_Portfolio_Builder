"use client"

import { Check } from "lucide-react"
import { useState } from "react"

interface ThemeCardProps {
  theme: {
    name: string
    value: string
    description: string
    colors: string[]
    preview: string
  }
  isSelected: boolean
  onSelect: (value: string) => void
}

export default function ThemeCard({ theme, isSelected, onSelect }: ThemeCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      type="button"
      onClick={() => onSelect(theme.value)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        group relative overflow-hidden rounded-2xl border-2 
        transition-all duration-300 hover:scale-105
        ${isSelected 
          ? 'border-blue-500 bg-zinc-800/50 shadow-lg shadow-blue-500/20' 
          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
        }
      `}
    >
      {/* Color Preview Section */}
      <div className={`
        h-32 p-4 flex items-center justify-center gap-2
        ${theme.preview}
        transition-all duration-300
        ${isHovered ? 'scale-110' : 'scale-100'}
      `}>
        <div className="flex gap-2">
          {theme.colors.map((color, i) => (
            <div
              key={i}
              className="w-10 h-10 rounded-full shadow-lg transition-transform group-hover:scale-110 border-2 border-white/20"
              style={{ 
                backgroundColor: color,
                transitionDelay: `${i * 50}ms`
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Theme Info */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <h3 className="font-semibold text-lg text-white mb-1">
          {theme.name}
        </h3>
        <p className="text-sm text-zinc-400">
          {theme.description}
        </p>
      </div>
      
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute top-3 right-3 bg-blue-500 rounded-full p-1.5 shadow-lg animate-in zoom-in duration-200">
          <Check className="text-white" size={16} />
        </div>
      )}

      {/* Hover Glow Effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300
        pointer-events-none
      `} />
    </button>
  )
}
