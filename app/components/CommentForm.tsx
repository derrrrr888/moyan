'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function CommentForm({ articleId }: { articleId: number }) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)

    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    const { error } = await supabase.from('comments').insert({
      article_id: articleId,
      author: user?.user_metadata?.name || user?.email?.split('@')[0] || '匿名读者',
      content: content.trim(),
      date: new Date().toISOString().split('T')[0],
    })

    if (error) {
      alert('评论失败：' + error.message)
    } else {
      setContent('')
      router.refresh()
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="pt-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="写下你的想法..."
        className="w-full p-4 bg-[#f7f4ef] border border-[#e8e4dc] rounded-lg text-sm placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#8b7355] resize-none"
        rows={4}
        required
      />
      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-[#8b7355] text-white text-sm rounded-lg hover:bg-[#6b5a45] transition-colors disabled:opacity-50"
        >
          {loading ? '提交中...' : '提交评论'}
        </button>
      </div>
    </form>
  )
}