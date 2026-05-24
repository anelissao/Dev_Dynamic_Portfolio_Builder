'use client'
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">Something went wrong</h2>
                <p className="text-zinc-400 mb-6">{error.message}</p>
                <button onClick={reset} className="px-6 py-3 bg-indigo-600 text-white rounded-lg">
                    Try again
                </button>
            </div>
        </div>
    )
}
