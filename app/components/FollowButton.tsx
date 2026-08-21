'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FollowButton({ targetName }: { targetName: string }) {
  const [currentUserName, setCurrentUserName] = useState<string | null>(null)
  const [following, setFollowing] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      const name = session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0]
      if (name) {
        setCurrentUserName(name)
        const { data } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_name', name)
          .eq('following_name', targetName)
          .single()
        setFollowing(!!data)
      }
      setLoading(false)
    }
    init()
  }, [targetName])

  if (!currentUserName || currentUserName === targetName) return null
  if (loading) return <div className="h-8 w-20 rounded bg-[#e8e4dc] animate-pulse" />

  const handleClick = async () => {
    if (following) {
      await supabase.from('follows').delete().eq('follower_name', currentUserName).eq('following_name', targetName)
      setFollowing(false)
    } else {
      await supabase.from('follows').insert({ follower_name: currentUserName, following_name: targetName })
      setFollowing(true)
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`px-5 py-1.5 rounded-full text-sm transition-colors ${
        following
          ? 'bg-[#e8e4dc] text-[#6b6b6b] hover:bg-[#d8d4cc]'
          : 'bg-[#8b7355] text-white hover:bg-[#6b5a45]'
      }`}
    >
      {following ? '已关注' : '+ 关注'}
    </button>
  )
}