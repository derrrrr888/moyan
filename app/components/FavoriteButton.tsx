'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function FavoriteButton({ articleId }: { articleId: number }) {
  const [favorited, setFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        checkFavorited(session.user.id)
      }
    })
  }, [articleId])

  const checkFavorited = async (userId: string) => {
    const { data } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .single()
    setFavorited(!!data)
  }

  const toggleFavorite = async () => {
    if (!user) {
      alert('请先登录')
      return
    }
    setLoading(true)
    
    if (favorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('article_id', articleId)
      setFavorited(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, article_id: articleId })
      setFavorited(true)
    }
    
    setLoading(false)
  }

  if (!user) return null

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-1.5 text-sm transition-colors select-none
        ${favorited ? 'text-[#8b7355]' : 'text-[#8a8a8a] hover:text-[#8b7355]'}`}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-5 h-5 transition-all duration-200 ${favorited ? 'fill-[#8b7355] stroke-[#8b7355]' : 'fill-none'}`}>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
      <span>{favorited ? '已收藏' : '收藏'}</span>
    </button>
  )
}