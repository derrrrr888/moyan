import Link from "next/link";
import { supabase } from "../../lib/supabase";
import FollowButton from "../../components/FollowButton";

export default async function UserPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const authorName = decodeURIComponent(name);

  const { data: articles } = await supabase
    .from("articles")
    .select("*")
    .eq("author", authorName)
    .eq("is_hidden", false)
    .order("date", { ascending: false });

  const { count: followers } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("following_name", authorName);

  const { count: following } = await supabase
    .from("follows")
    .select("*", { count: "exact", head: true })
    .eq("follower_name", authorName);

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <div className="flex gap-8 text-sm text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#8b7355] transition-colors">首页</Link>
            <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
            <Link href="/following" className="hover:text-[#8b7355] transition-colors">关注</Link>
            <Link href="/about" className="hover:text-[#8b7355] transition-colors">关于</Link>
          </div>
        </div>
      </nav>

      <header className="max-w-3xl mx-auto px-6 pt-12 pb-8 text-center">
        <div className="w-20 h-20 rounded-full bg-[#e8e4dc] flex items-center justify-center text-2xl text-[#8b7355] mx-auto mb-4">
          {authorName[0]}
        </div>
        <h1 className="text-2xl font-bold mb-2">{authorName}</h1>
        <div className="flex items-center justify-center gap-4 text-sm text-[#8a8a8a] mb-4">
          <span>共 {articles?.length || 0} 篇作品</span>
          <span>·</span>
          <span>{followers || 0} 粉丝</span>
          <span>·</span>
          <span>{following || 0} 关注</span>
        </div>
        <FollowButton targetName={authorName} />
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
                  <div className="flex items-center justify-between text-xs text-[#8a8a8a]">
                    <span>{article.views || 0} 次阅读 · {article.likes || 0} 赞</span>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center text-[#8a8a8a] py-12">该作者暂无文章</div>
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