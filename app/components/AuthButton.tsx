'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (user) {
    const userName = user.user_metadata?.name || user.email?.split('@')[0]

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-8 h-8 rounded-full bg-[#e8e4dc] flex items-center justify-center text-xs font-medium text-[#8b7355] hover:bg-[#8b7355] hover:text-white transition-colors"
        >
          {userName[0]}
        </button>
        
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg shadow-lg py-1 z-50">
            <Link href={`/user/${encodeURIComponent(userName)}`} onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#f7f4ef] transition-colors">
              我的主页
            </Link>
            <Link href="/favorites" onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#f7f4ef] transition-colors">
              我的收藏
            </Link>
            <Link href="/write" onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-[#3d3d3d] hover:bg-[#f7f4ef] transition-colors">
              写文章
            </Link>
            <div className="border-t border-[#e8e4dc] my-1" />
            <button onClick={() => { setOpen(false); handleLogout(); }}
              className="block w-full text-left px-4 py-2 text-sm text-[#8a8a8a] hover:bg-[#f7f4ef] transition-colors">
              退出
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href="/login" className="text-sm text-[#6b6b6b] hover:text-[#8b7355] transition-colors">
      登录
    </Link>
  )
}