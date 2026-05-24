export const themeStyles = {
    default: {
        bg: "bg-gradient-to-br from-blue-50 to-purple-50",
        card: "bg-white border-blue-200",
        text: "text-gray-900",
        accent: "text-blue-600",
        button: "bg-blue-600 text-white",
        badge: "bg-blue-100 text-blue-700"
    },
    dark: {
        bg: "bg-gradient-to-br from-zinc-900 to-zinc-950",
        card: "bg-zinc-800 border-zinc-700",
        text: "text-zinc-100",
        accent: "text-blue-400",
        button: "bg-blue-500 text-white",
        badge: "bg-zinc-700 text-zinc-300"
    },
    minimal: {
        bg: "bg-white",
        card: "bg-gray-50 border-gray-200",
        text: "text-gray-900",
        accent: "text-gray-700",
        button: "bg-gray-900 text-white",
        badge: "bg-gray-200 text-gray-700"
    },
    colorful: {
        bg: "bg-gradient-to-br from-amber-50 via-green-50 to-indigo-50",
        card: "bg-white border-indigo-200",
        text: "text-gray-900",
        accent: "text-indigo-600",
        button: "bg-gradient-to-r from-amber-500 to-indigo-600 text-white",
        badge: "bg-gradient-to-r from-amber-100 to-indigo-100 text-indigo-700"
    }
} as const

export type ThemeKey = keyof typeof themeStyles