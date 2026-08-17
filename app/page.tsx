import Link from "next/link";
import { supabase } from "./lib/supabase";
import AuthButton from "./components/AuthButton";

export default async function Home() {
  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .order("date", { ascending: false });

    <div className="flex items-center gap-8 text-sm text-[#6b6b6b]">
    <span className="text-[#8b7355] font-medium">首页</span>
    <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
    <span className="hover:text-[#8b7355] transition-colors cursor-pointer">关于</span>
    <AuthButton />
  </div>

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-xl font-bold tracking-wider">拾墨杂谈</div>
          <div className="flex items-center gap-8 text-sm text-[#6b6b6b]">
          <div className="flex items-center gap-8 text-sm text-[#6b6b6b]">
  <span className="text-[#8b7355] font-medium">首页</span>
  <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
  <span className="hover:text-[#8b7355] transition-colors cursor-pointer">关于</span>
  <AuthButton />
</div>
            <AuthButton />
          </div>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-16 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wider">
          拾墨杂谈
        </h1>
        <p className="text-[#8a8a8a] text-sm md:text-base">
          以文字为舟，载思想而行。记录文字里的温度与思考。
        </p>
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
            <div className="text-center text-[#8a8a8a] py-12">暂无文章</div>
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