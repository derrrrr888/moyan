'use client'

import { useEffect, useState, useCallback, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import AuthButton from '../components/AuthButton'
import ScrollToTop from '../components/ScrollToTop'

const PAGE_SIZE = 10

interface Article {
  id: number
  title: string
  author: string
  category: string
  date: string
  summary: string
  views: number
  likes: number
}

function HomeContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [total, setTotal] = useState(0)
  const [pressingId, setPressingId] = useState<number | null>(null)
  const q = searchParams.get('q') || ''
  const sort = searchParams.get('sort') || 'latest'
  const isHot = sort === 'hot'

  const fetchArticles = useCallback(async (pageNum: number, isLoadMore = false) => {
    if (!isLoadMore) setLoading(true)
    else setLoadingMore(true)

    const start = pageNum * PAGE_SIZE
    const end = start + PAGE_SIZE - 1

    let query = supabase.from('articles').select('*', { count: 'exact' }).eq('is_hidden', false)

    if (q) {
      query = query.or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
    }

    if (isHot) {
      query = query.order('views', { ascending: false })
    } else {
      query = query.order('date', { ascending: false })
    }

    const { data, count, error } = await query.range(start, end)

    if (error) {
      console.error('加载文章失败:', error)
    } else {
      const newArticles = data || []
      if (isLoadMore) {
        setArticles(prev => [...prev, ...newArticles])
      } else {
        setArticles(newArticles)
      }
      setTotal(count || 0)
      setHasMore(newArticles.length === PAGE_SIZE && (count ? start + newArticles.length < count : true))
    }

    setLoading(false)
    setLoadingMore(false)
  }, [q, isHot])

  useEffect(() => {
    setPage(0)
    fetchArticles(0, false)
  }, [q, sort, fetchArticles])

  const handleLoadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchArticles(nextPage, true)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }
    router.push(`/?${params.toString()}`)
  }

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (newSort === 'hot') {
      params.set('sort', 'hot')
    } else {
      params.delete('sort')
    }
    router.push(`/?${params.toString()}`)
  }

  const SkeletonCard = () => (
    <div className="bg-[#fefdfb] rounded-lg p-6 shadow-sm border border-[#f0ece4] space-y-4">
      <div className="flex items-center gap-3">
        <div className="h-5 w-16 rounded-full animate-shimmer" />
        <div className="h-4 w-20 rounded animate-shimmer" />
      </div>
      <div className="h-7 w-3/4 rounded animate-shimmer" />
      <div className="space-y-2">
        <div className="h-4 w-full rounded animate-shimmer" />
        <div className="h-4 w-5/6 rounded animate-shimmer" />
        <div className="h-4 w-4/6 rounded animate-shimmer" />
      </div>
      <div className="flex items-center justify-between pt-2">
        <div className="h-4 w-32 rounded animate-shimmer" />
        <div className="h-4 w-12 rounded animate-shimmer" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wider">拾墨杂谈</div>
          <div className="flex items-center gap-8 text-sm text-[#6b6b6b]">
            <span className="text-[#8b7355] font-medium">首页</span>
            <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
            <Link href="/about" className="hover:text-[#8b7355] transition-colors">关于</Link>
            <AuthButton />
          </div>
        </div>
      </nav>

      <header className="max-w-5xl mx-auto px-6 pt-16 pb-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">
          拾墨杂谈
        </h1>
        <p className="text-[#8a8a8a] text-sm md:text-base">
          以文字为舟，载思想而行。记录文字里的温度与思考。
        </p>
      </header>

      <div className="max-w-5xl mx-auto px-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-1 bg-[#e8e4dc] rounded-lg p-0.5">
            <button
              onClick={() => handleSortChange('latest')}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                !isHot ? 'bg-[#fefdfb] text-[#3d3d3d] shadow-sm' : 'text-[#6b6b6b] hover:text-[#3d3d3d]'
              }`}
            >
              最新
            </button>
            <button
              onClick={() => handleSortChange('hot')}
              className={`px-4 py-1.5 rounded-md text-sm transition-colors ${
                isHot ? 'bg-[#fefdfb] text-[#3d3d3d] shadow-sm' : 'text-[#6b6b6b] hover:text-[#3d3d3d]'
              }`}
            >
              热门
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          {isHot && <input type="hidden" name="sort" value="hot" />}
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="搜索文章标题或内容..."
            className="flex-1 p-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355] placeholder:text-[#a0a0a0]"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors text-sm"
          >
            搜索
          </button>
          {q && (
            <button
              type="button"
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString())
                params.delete('q')
                router.push(`/?${params.toString()}`)
              }}
              className="px-4 py-2 border border-[#e8e4dc] text-[#6b6b6b] rounded-lg hover:bg-[#f0ece4] transition-colors text-sm"
            >
              清除
            </button>
          )}
        </form>
      </div>

      <main className="max-w-5xl mx-auto px-6 pb-16">
        {q && !loading && (
          <p className="text-sm text-[#8a8a8a] mb-4">
            "{q}" 的搜索结果：共 {total} 篇
          </p>
        )}
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                             <article
                             key={article.id}
                             className={`bg-[#fefdfb] rounded-lg p-6 shadow-sm border border-[#f0ece4] hover:shadow-md transition-all duration-150 cursor-pointer select-none ${pressingId === article.id ? 'scale-[0.97] bg-[#f5f2ed]' : ''}`}
                             onMouseDown={() => setPressingId(article.id)}
                             onMouseUp={() => setPressingId(null)}
                             onMouseLeave={() => setPressingId(null)}
                             onTouchStart={() => setPressingId(article.id)}
                             onTouchEnd={() => setPressingId(null)}
                           >
                             <Link href={`/article/${article.id}`} prefetch={true}>
                               <div className="flex items-center gap-3 mb-3">
                                 <span className="text-xs text-[#8b7355] border border-[#e8e4dc] px-2 py-0.5 rounded-full">
                                   {article.category}
                                 </span>
                                 <span className="text-xs text-[#8a8a8a]">{article.date}</span>
                               </div>
                               <h2 className="text-lg font-bold mb-3 hover:text-[#8b7355] transition-colors line-clamp-2">
                                 {article.title}
                               </h2>
                               <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4 line-clamp-3">
                                 {article.summary}
                               </p>
                             </Link>
                             <div className="flex items-center justify-between text-xs text-[#8a8a8a]">
                               <div className="flex items-center gap-3">
                                 <Link
                                   href={`/user/${encodeURIComponent(article.author)}`}
                                   className="hover:text-[#8b7355] transition-colors"
                                 >
                                   {article.author}
                                 </Link>
                                 <span>·</span>
                                 <span>{article.views || 0} 次阅读</span>
                               </div>
                               <div className="flex items-center gap-1.5 text-[#8a8a8a]">
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 fill-none">
                                   <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                 </svg>
                                 <span>{article.likes || 0}</span>
                               </div>
                             </div>
                           </article>
              ))}
            </div>

            {hasMore && (
              <div className="mt-10 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-3 bg-[#fefdfb] border border-[#e8e4dc] rounded-lg text-sm text-[#6b6b6b] hover:text-[#8b7355] hover:border-[#8b7355] transition-colors disabled:opacity-50"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2 justify-center">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      加载中...
                    </span>
                  ) : (
                    '加载更多'
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center text-[#8a8a8a] py-12">
            {q ? '没有找到相关文章' : '暂无文章'}
          </div>
        )}
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#8a8a8a]">加载中...</div>}>
      <HomeContent />
    </Suspense>
  )
}