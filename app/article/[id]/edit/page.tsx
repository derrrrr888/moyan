'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const [article, setArticle] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('散文')
  const [summary, setSummary] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { id } = await params
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .eq('id', parseInt(id))
        .single()

      if (error || !data) {
        setError('文章不存在')
        setLoading(false)
        return
      }

      const { data: { session } } = await supabase.auth.getSession()
      const userName = session?.user?.user_metadata?.name || session?.user?.email?.split('@')[0]
      if (data.author !== userName) {
        setError('无权编辑此文章')
        setLoading(false)
        return
      }

      setArticle(data)
      setTitle(data.title)
      setCategory(data.category)
      setSummary(data.summary || '')
      setContent(data.content)
      setLoading(false)
    }
    load()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('标题和正文不能为空')
      return
    }

    setSaving(true)
    const { error: err } = await supabase
      .from('articles')
      .update({
        title: title.trim(),
        category,
        summary: summary.trim(),
        content: content.trim(),
      })
      .eq('id', article.id)

    if (err) {
      setError('保存失败：' + err.message)
      setSaving(false)
    } else {
      alert('保存成功！')
      router.push(`/article/${article.id}`)
      router.refresh()
    }
  }

  if (loading) return <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#8a8a8a]">加载中...</div>
  if (error) return (
    <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#3d3d3d]">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">{error}</h1>
        <Link href="/" className="text-[#8b7355] hover:underline">← 返回首页</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <Link href={`/article/${article.id}`} className="text-sm text-[#6b6b6b] hover:text-[#8b7355]">← 返回文章</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-8 text-center">编辑文章</h1>

        {error && <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

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
            <Link href={`/article/${article.id}`}
              className="px-6 py-2 border border-[#e8e4dc] text-[#6b6b6b] rounded-lg hover:bg-[#f0ece4] transition-colors text-sm text-center">
              取消
            </Link>
            <button type="submit" disabled={saving}
              className="px-6 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors disabled:opacity-50 text-sm">
              {saving ? '保存中...' : '保存修改'}
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