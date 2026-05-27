"use client"

import { useState, useTransition } from "react"
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react"
import { sendContactEmail } from "@/app/portfolio/[username]/actions"

interface ContactFormProps {
  username: string
  styles: {
    card: string
    text: string
    accent: string
    button: string
  }
}

export function ContactForm({ username, styles }: ContactFormProps) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('username', username)

    startTransition(async () => {
      const result = await sendContactEmail(formData)
      
      if (result.success) {
        setStatus('success')
        ;(e.target as HTMLFormElement).reset()
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setErrorMessage(result.error || 'Something went wrong')
        setTimeout(() => setStatus('idle'), 5000)
      }
    })
  }

  return (
    <div className={`relative overflow-hidden rounded-3xl ${styles.card} border p-8 sm:p-10`}>
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-4">
            <Mail className="text-indigo-500" size={24} />
          </div>
          <h2 className={`text-2xl sm:text-3xl font-bold ${styles.text} mb-3`}>
            Let's Work Together
          </h2>
          <p className={`text-base ${styles.text} opacity-60 max-w-md mx-auto`}>
            Have a project in mind? Send me a message and I'll get back to you as soon as possible.
          </p>
        </div>

        {/* Success Message */}
        {status === 'success' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={20} />
            <p className="text-emerald-500 font-medium text-sm">
              Message sent successfully! I'll get back to you soon.
            </p>
          </div>
        )}

        {/* Error Message */}
        {status === 'error' && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
            <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
            <p className="text-red-500 font-medium text-sm">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium ${styles.text} mb-2`}>
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              disabled={isPending}
              placeholder="John Doe"
              className={`w-full px-4 py-3 rounded-xl ${styles.card} border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles.text}`}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${styles.text} mb-2`}>
              Your Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              disabled={isPending}
              placeholder="john@example.com"
              className={`w-full px-4 py-3 rounded-xl ${styles.card} border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${styles.text}`}
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className={`block text-sm font-medium ${styles.text} mb-2`}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              disabled={isPending}
              rows={5}
              placeholder="Tell me about your project..."
              className={`w-full px-4 py-3 rounded-xl ${styles.card} border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${styles.text}`}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl ${styles.button} font-medium shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
          >
            {isPending ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send size={18} />
                Send Message
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
