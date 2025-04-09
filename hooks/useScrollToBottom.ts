"use client"

import { useEffect, useRef, type RefObject } from "react"

export function useScrollToBottom<T extends HTMLElement>(): [RefObject<T>, RefObject<T>] {
  const containerRef = useRef<T>(null)
  const endRef = useRef<T>(null)

  useEffect(() => {
    const container = containerRef.current
    const end = endRef.current

    if (container && end) {
      // Initial scroll to bottom
      setTimeout(() => {
        scrollToBottom(container, end)
      }, 100)

      const observer = new MutationObserver(() => {
        scrollToBottom(container, end)
      })

      observer.observe(container, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true,
      })

      return () => observer.disconnect()
    }
  }, [])

  // Helper function to handle scrolling with better mobile support
  const scrollToBottom = (container: HTMLElement, end: HTMLElement) => {
    // Check if it's a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    // For mobile devices, use a more aggressive approach
    if (isMobile) {
      // First try with requestAnimationFrame for smoother scrolling
      requestAnimationFrame(() => {
        // Try both methods for maximum compatibility
        end.scrollIntoView({ behavior: "auto", block: "end" })

        // Also use direct scrollTo as a fallback
        setTimeout(() => {
          container.scrollTop = container.scrollHeight
        }, 10)
      })
    } else {
      // For desktop, use the smoother scrolling
      end.scrollIntoView({ behavior: "smooth", block: "end" })
    }
  }

  return [containerRef, endRef]
}
