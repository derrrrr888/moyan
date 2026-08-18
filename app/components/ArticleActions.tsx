'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function ArticleActions({ article }: { article: any }) {
  const [isAuthor, setIsAuthor] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user
      if (user) {
        const name = user.user_metadata?.name || user.email?.split('@')[0]
        if (name === article.author) setIsAuthor(true)
      }
    })
  }, [article.author])

  const handleDelete = async () => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return
    setDeleting(true)
    
    await supabase.from('comments').delete().eq('article_id', article.id)
    const { error } = await supabase.from('articles').delete().eq('id', article.id)
    
    if (error) {
      alert('删除失败：' + error.message)
      setDeleting(false)
    } else {
      alert('删除成功')
      router.push('/')
      router.refresh()
    }
  }

  if (!isAuthor) return null

  return (
    <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#e8e4dc]">
      <Link
        href={`/article/${article.id}/edit`}
        className="px-4 py-2 bg-[#8b7355] text-white text-sm rounded-lg hover:bg-[#6b5a45] transition-colors"
      >
        编辑文章
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="px-4 py-2 border border-red-300 text-red-500 text-sm rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        {deleting ? '删除中...' : '删除文章'}
      </button>
    </div>
  )
}