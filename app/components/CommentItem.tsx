'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'
import LikeButton from './LikeButton'

interface Comment {
  id: number
  article_id: number
  author: string
  content: string
  date: string
  parent_id: number | null
  likes: number
  children?: Comment[]
}

export default function CommentItem({ comment, articleId }: { comment: Comment; articleId: number }) {
  const [replying, setReplying] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!replyContent.trim()) return

    // 内容安全检测
    const { checkContent } = await import('../lib/moderation')
    const check = checkContent(replyContent)
    if (!check.clean) {
      alert('回复' + check.reason + '，请修改后重新提交')
      return
    }

    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user

    const { error } = await supabase.from('comments').insert({
      article_id: articleId,
      parent_id: comment.id,
      author: user?.user_metadata?.name || user?.email?.split('@')[0] || '匿名读者',
      content: replyContent.trim(),
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      is_hidden: false,
    })

    if (error) {
      alert('回复失败：' + error.message)
    } else {
      setReplyContent('')
      setReplying(false)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="pb-5 border-b border-[#f0ece4] last:border-0">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-8 h-8 rounded-full bg-[#e8e4dc] flex items-center justify-center text-xs text-[#8b7355]">
          {comment.author[0]}
        </div>
        <div>
          <div className="text-sm font-medium">{comment.author}</div>
          <div className="text-xs text-[#8a8a8a]">{comment.date}</div>
        </div>
      </div>
      <p className="text-sm text-[#6b6b6b] leading-relaxed pl-11 mb-3">
        {comment.content}
      </p>
      <div className="pl-11 flex items-center gap-4">
        <LikeButton id={comment.id} initialLikes={comment.likes || 0} table="comments" size="sm" />
        <button
          onClick={() => setReplying(!replying)}
          className="text-xs text-[#8a8a8a] hover:text-[#8b7355] transition-colors"
        >
          {replying ? '取消回复' : '回复'}
        </button>
      </div>

      {replying && (
        <form onSubmit={handleReply} className="pl-11 mt-3">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder={`回复 ${comment.author}...`}
            className="w-full p-3 bg-[#f7f4ef] border border-[#e8e4dc] rounded-lg text-sm placeholder:text-[#a0a0a0] focus:outline-none focus:border-[#8b7355] resize-none"
            rows={3}
            required
          />
          <div className="flex justify-end mt-2 gap-2">
            <button
              type="button"
              onClick={() => setReplying(false)}
              className="px-4 py-1.5 text-xs text-[#8a8a8a] hover:text-[#3d3d3d] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-[#8b7355] text-white text-xs rounded-lg hover:bg-[#6b5a45] transition-colors disabled:opacity-50"
            >
              {loading ? '提交中...' : '回复'}
            </button>
          </div>
        </form>
      )}

      {comment.children && comment.children.length > 0 && (
        <div className="mt-4 ml-4 pl-4 border-l-2 border-[#e8e4dc] space-y-4">
          {comment.children.map((child) => (
            <CommentItem key={child.id} comment={child} articleId={articleId} />
          ))}
        </div>
      )}
    </div>
  )
}