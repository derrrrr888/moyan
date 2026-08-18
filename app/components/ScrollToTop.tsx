'use client'

import { useEffect, useState } from 'react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggle = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', toggle)
    return () => window.removeEventListener('scroll', toggle)
  }, [])

  const scroll = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  if (!visible) return null

  return (
    <button
      onClick={scroll}
      className="fixed bottom-8 right-8 w-10 h-10 bg-[#8b7355] text-white rounded-full shadow-lg hover:bg-[#6b5a45] hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
      aria-label="返回顶部"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}