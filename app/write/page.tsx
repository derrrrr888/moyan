'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function WritePage() {
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('散文')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) router.push('/login')
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('标题和正文不能为空')
      return
    }

        // 内容安全检测
        const { checkArticle } = await import('../lib/moderation')
        const check = checkArticle(title, summary, content)
        if (!check.clean) {
          setError(`${check.field}：${check.reason}，请修改后重新提交`)
          setLoading(false)
          return
        }

    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user
    if (!user) {
      router.push('/login')
      return
    }

    const userName = user.user_metadata?.name || user.email?.split('@')[0]

    const { error: err } = await supabase.from('articles').insert({
      title: title.trim(),
      category,
      summary: summary.trim() || content.trim().slice(0, 100) + '...',
      content: content.trim(),
      author: userName,
      date: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      is_hidden: false,
      is_flagged: false,
    })

    if (err) {
      setError('发布失败：' + err.message)
      setLoading(false)
    } else {
      alert('发布成功！')
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <Link href="/" className="text-sm text-[#6b6b6b] hover:text-[#8b7355]">← 返回首页</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8 text-center">写文章</h1>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">标题</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full p-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355]" />
          </div>

          <div>
            <label className="block text-sm mb-2">分类</label>
            <select value={category} onChange={e => setCategory(e.target.value)}
              className="w-full p-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355]">
              <option value="散文">散文</option>
              <option value="随笔">随笔</option>
              <option value="小说">小说</option>
              <option value="时评">时评</option>
              <option value="诗歌">诗歌</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">摘要</label>
            <textarea value={summary} onChange={e => setSummary(e.target.value)} rows={2}
              className="w-full p-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355] resize-none" />
          </div>

          <div>
            <label className="block text-sm mb-2">正文</label>
            <textarea value={content} onChange={e => setContent(e.target.value)} required rows={20}
              className="w-full p-4 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355] resize-y leading-relaxed" />
          </div>

          <div className="flex justify-end gap-4">
            <Link href="/"
              className="px-6 py-2 border border-[#e8e4dc] text-[#6b6b6b] rounded-lg hover:bg-[#f0ece4] transition-colors text-sm text-center">
              取消
            </Link>
            <button type="submit" disabled={loading}
              className="px-6 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors disabled:opacity-50 text-sm">
              {loading ? '发布中...' : '发布文章'}
            </button>
          </div>
        </form>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb] mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>
    </div>
  )
}