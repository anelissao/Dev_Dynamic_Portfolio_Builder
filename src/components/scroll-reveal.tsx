"use client"

import { useEffect, useRef, ReactNode, ElementType } from "react"

interface ScrollRevealProps {
    children: ReactNode
    className?: string
    delay?: number
    /** "fadeUp" | "fadeIn" | "scaleIn" | "slideInLeft" */
    variant?: "fadeUp" | "fadeIn" | "scaleIn" | "slideInLeft"
    as?: ElementType
    threshold?: number
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    variant = "fadeUp",
    as: Tag = "div",
    threshold = 0.15,
}: ScrollRevealProps) {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const el = ref.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.style.animationDelay = `${delay}ms`
                    el.classList.add("sr-visible")
                    observer.unobserve(el)
                }
            },
            { threshold }
        )

        observer.observe(el)
        return () => observer.disconnect()
    }, [delay, threshold])

    return (
        
        <Tag
            ref={ref}
            className={`sr-hidden sr-${variant} ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {children}
        </Tag>
    )
}