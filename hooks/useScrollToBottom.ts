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
        end.scrollIntoView({ behavior: "smooth", block: "end" })
      }, 100)

      const observer = new MutationObserver(() => {
        // For Safari/iOS, use a different approach
        const isSafari =
          /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || /iPad|iPhone|iPod/.test(navigator.userAgent)

        if (isSafari) {
          // Use setTimeout to ensure the scroll happens after content is rendered
          setTimeout(() => {
            // Use scrollTo instead of scrollIntoView for better iOS compatibility
            const scrollHeight = container.scrollHeight
            container.scrollTo({
              top: scrollHeight,
              behavior: "smooth",
            })
          }, 50)
        } else {
          // For other browsers, use scrollIntoView
          end.scrollIntoView({ behavior: "smooth", block: "end" })
        }
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

  return [containerRef, endRef]
}
