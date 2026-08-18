'use client'

import { useState } from 'react'

export default function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      alert('复制失败，请手动复制地址栏链接')
    }
  }

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-1.5 text-sm text-[#8a8a8a] hover:text-[#8b7355] transition-colors select-none"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
      <span>{copied ? '已复制链接' : '分享'}</span>
    </button>
  )
}