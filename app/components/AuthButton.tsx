'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

export default function AuthButton() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Link 
          href="/write" 
          className="text-sm text-[#8b7355] hover:text-[#6b5a45] transition-colors"
        >
          写文章
        </Link>
        <span className="text-sm text-[#3d3d3d]">
          {user.user_metadata?.name || user.email?.split('@')[0]}
        </span>
        <button
          onClick={handleLogout}
          className="text-sm text-[#8a8a8a] hover:text-[#8b7355] transition-colors"
        >
          退出
        </button>
      </div>
    )
  }

  return (
    <Link href="/login" className="text-sm text-[#6b6b6b] hover:text-[#8b7355] transition-colors">
      登录
    </Link>
  )
}