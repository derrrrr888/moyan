import Link from "next/link";
import { supabase } from "../../lib/supabase";

export default async function CategoryPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const categoryName = decodeURIComponent(name);

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("category", categoryName)
    .order("date", { ascending: false });

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <div className="flex gap-8 text-sm text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#8b7355] transition-colors">首页</Link>
            <Link href="/categories" className="text-[#8b7355] font-medium">分类</Link>
            <span className="hover:text-[#8b7355] transition-colors cursor-pointer">关于</span>
          </div>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/categories" className="text-sm text-[#8a8a8a] hover:text-[#8b7355]">← 全部分类</Link>
        </div>
        <h1 className="text-3xl font-bold tracking-wider">{categoryName}</h1>
        <p className="text-sm text-[#8a8a8a] mt-2">共 {articles?.length || 0} 篇作品</p>
      </header>

      <main className="max-w-3xl mx-auto px-6 pb-16">
        <div className="space-y-6">
          {articles && articles.length > 0 ? (
            articles.map((article) => (
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
                  <p className="text-sm text-[#6b6b6b] leading-relaxed mb-4 line-clamp-3">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#8a8a8a]">作者：{article.author}</span>
                    <span className="text-xs text-[#8b7355]">阅读全文 →</span>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center text-[#8a8a8a] py-12">该分类下暂无文章</div>
          )}
        </div>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>
    </div>
  );
}