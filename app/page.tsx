'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from './lib/supabase'
import AuthButton from './components/AuthButton'
import ScrollToTop from './components/ScrollToTop'

const PAGE_SIZE = 8

function HomeContent() {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || ''
  const isHot = sort === 'hot'
  
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)

  const fetchArticles = async (pageNum: number, isAppend: boolean) => {
    if (loadingRef.current) return
    loadingRef.current = true
    if (pageNum === 0) setLoading(true)
    else setLoadingMore(true)

    let query = supabase.from('articles').select('*', { count: 'exact' }).eq('is_hidden', false)
    if (q) query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
    if (isHot) query = query.order('views', { ascending: false })
    else query = query.order('date', { ascending: false })
    
    const from = pageNum * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, count, error } = await query.range(from, to)
    
    if (!error) {
      if (isAppend) setArticles(prev => [...prev, ...(data || [])])
      else setArticles(data || [])
      const currentTotal = (isAppend ? articles.length : 0) + (data?.length || 0)
      setHasMore((data?.length || 0) === PAGE_SIZE && currentTotal < (count || 0))
    }
    
    if (pageNum === 0) setLoading(false)
    else setLoadingMore(false)
    loadingRef.current = false
  }

  useEffect(() => {
    pageRef.current = 0
    setHasMore(true)
    fetchArticles(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort])

  useEffect(() => {
    const handleScroll = () => {
      if (loadingRef.current || !hasMore) return
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight
      if (scrollTop + clientHeight >= scrollHeight - 300) {
        pageRef.current += 1
        fetchArticles(pageRef.current, true)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore])

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wider">拾墨杂谈</div>
          <div className="flex items-center gap-8 text-sm text-[#6b6b6b]">
            <span className="text-[#8b7355] font-medium">首页</span>
            <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
            <Link href="/following" className="hover:text-[#8b7355] transition-colors">关注</Link>
            <Link href="/about" className="hover:text-[#8b7355] transition-colors">关于</Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-16 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">拾墨杂谈</h1>
        <p className="text-[#8a8a8a] text-sm md:text-base">以文字为舟，载思想而行。记录文字里的温度与思考。</p>
      </header>

      <div className="max-w-3xl mx-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-[#e8e4dc] rounded-lg p-0.5">
            <Link href={q ? `/?q=${encodeURIComponent(q)}` : '/'} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${!isHot ? 'bg-[#fefdfb] text-[#3d3d3d] shadow-sm' : 'text-[#6b6b6b] hover:text-[#3d3d3d]'}`}>最新</Link>
            <Link href={q ? `/?sort=hot&q=${encodeURIComponent(q)}` : '/?sort=hot'} className={`px-4 py-1.5 rounded-md text-sm transition-colors ${isHot ? 'bg-[#fefdfb] text-[#3d3d3d] shadow-sm' : 'text-[#6b6b6b] hover:text-[#3d3d3d]'}`}>热门</Link>
          </div>
        </div>

        <form action="/" method="get" className="flex gap-2">
          {isHot && <input type="hidden" name="sort" value="hot" />}
          <input type="text" name="q" defaultValue={q} placeholder="搜索文章标题或内容..." className="flex-1 p-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355] placeholder:text-[#a0a0a0]" />
          <button type="submit" className="px-5 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors text-sm">搜索</button>
          {q && <Link href={isHot ? '/?sort=hot' : '/'} className="px-4 py-2 border border-[#e8e4dc] text-[#6b6b6b] rounded-lg hover:bg-[#f0ece4] transition-colors text-sm">清除</Link>}
        </form>
      </div>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        {q && !loading && <p className="text-sm text-[#8a8a8a] mb-4">"{q}" 的搜索结果</p>}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <article key={article.id} className="bg-[#fefdfb] rounded-lg p-6 shadow-sm border border-[#f0ece4] hover:shadow-md transition-shadow">
                  <Link href={`/article/${article.id}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xs text-[#8b7355] border border-[#e8e4dc] px-2 py-0.5 rounded-full">{article.category}</span>
                      <span className="text-xs text-[#8a8a8a]">{article.date}</span>
                    </div>
                    <h2 className="text-lg font-bold mb-3 hover:text-[#8b7355] transition-colors line-clamp-2">{article.title}</h2>
                    <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4 line-clamp-3">{article.summary}</p>
                  </Link>
                  <div className="flex items-center justify-between text-xs text-[#8a8a8a]">
                    <div className="flex items-center gap-3">
                      <Link href={`/user/${encodeURIComponent(article.author)}`} className="hover:text-[#8b7355] transition-colors">{article.author}</Link>
                      <span>·</span>
                      <span>{article.views || 0} 次阅读</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#8a8a8a]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 fill-none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
                      <span>{article.likes || 0}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {loadingMore && (
              <div className="py-8 flex flex-col items-center justify-center gap-2">
                <div className="w-6 h-6 border-2 border-[#e8e4dc] border-t-[#8b7355] rounded-full animate-spin" />
                <span className="text-xs text-[#8a8a8a]">加载中...</span>
              </div>
            )}

            {!hasMore && articles.length > 0 && (
              <div className="py-8 text-center">
                <div className="inline-flex items-center gap-3 text-xs text-[#8a8a8a]">
                  <span className="w-8 h-px bg-[#e8e4dc]" />已经到底啦 ~<span className="w-8 h-px bg-[#e8e4dc]" />
                </div>
              </div>
            )}

            {!loading && articles.length === 0 && (
              <div className="text-center text-[#8a8a8a] py-12">{q ? '没有找到相关文章' : '暂无文章'}</div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#fefdfb] rounded-lg p-6 shadow-sm border border-[#f0ece4] space-y-4">
      <div className="flex items-center gap-3"><div className="h-5 w-16 rounded-full animate-shimmer" /><div className="h-4 w-20 rounded animate-shimmer" /></div>
      <div className="h-7 w-3/4 rounded animate-shimmer" />
      <div className="space-y-2"><div className="h-4 w-full rounded animate-shimmer" /><div className="h-4 w-5/6 rounded animate-shimmer" /><div className="h-4 w-4/6 rounded animate-shimmer" /></div>
      <div className="flex items-center justify-between pt-2"><div className="h-4 w-32 rounded animate-shimmer" /><div className="h-4 w-12 rounded animate-shimmer" /></div>
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#8a8a8a]">加载中...</div>}>
      <HomeContent />
    </Suspense>
  )
}