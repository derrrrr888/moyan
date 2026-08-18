'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function FavoritesPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        router.push('/login')
        return
      }

      const { data: favs, error: favError } = await supabase
        .from('favorites')
        .select('article_id')
        .eq('user_id', session.user.id)

      if (favError) {
        console.error('收藏查询出错:', favError)
        setLoading(false)
        return
      }

      if (favs && favs.length > 0) {
        const ids = favs.map(f => f.article_id)
        const { data, error } = await supabase
          .from('articles')
          .select('*')
          .in('id', ids)
          .eq('is_hidden', false)
          .order('date', { ascending: false })
        
        if (error) console.error('文章查询出错:', error)
        setArticles(data || [])
      } else {
        setArticles([])
      }
      setLoading(false)
    }
    load()
  }, [router])

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <Link href="/" className="text-sm text-[#6b6b6b] hover:text-[#8b7355]">← 返回首页</Link>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2">我的收藏</h1>
        <p className="text-sm text-[#8a8a8a] mb-8">共 {articles.length} 篇收藏</p>

        {loading ? (
          <div className="text-center text-[#8a8a8a] py-12">加载中...</div>
        ) : articles.length > 0 ? (
          <div className="space-y-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/article/${article.id}`}>
                <article className="bg-[#fefdfb] rounded-lg p-6 md:p-8 shadow-sm border border-[#f0ece4] hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs text-[#8b7355] border border-[#e8e4dc] px-2 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="text-xs text-[#8a8a8a]">{article.date}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 hover:text-[#8b7355] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#8a8a8a] py-12">
            <p>暂无收藏</p>
            <Link href="/" className="text-[#8b7355] hover:underline text-sm mt-2 inline-block">去首页看看 →</Link>
          </div>
        )}
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