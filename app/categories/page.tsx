import Link from "next/link";
import { supabase } from "../lib/supabase";
import ScrollToTop from "../components/ScrollToTop";

export default async function CategoriesPage() {
  const { data: articles } = await supabase
    .from("articles")
    .select("category")
    .eq("is_hidden", false);

  const categoryCount: Record<string, number> = {};
  articles?.forEach((article) => {
    categoryCount[article.category] = (categoryCount[article.category] || 0) + 1;
  });

  const categories = [
    { name: "散文", desc: "形散神不散，记录生活点滴与情感流动" },
    { name: "随笔", desc: "随手写下，关于生活、思考与观察的碎片" },
    { name: "小说", desc: "虚构的世界，真实的人心与故事" },
    { name: "时评", desc: "对时代、社会与公共议题的观察与思考" },
    { name: "诗歌", desc: "以凝练的语言，捕捉瞬间的美与哲思" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <div className="flex gap-8 text-sm text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#8b7355] transition-colors">首页</Link>
            <span className="text-[#8b7355] font-medium">分类</span>
            <Link href="/about" className="hover:text-[#8b7355] transition-colors">关于</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-2 text-center">文章分类</h1>
        <p className="text-sm text-[#8a8a8a] text-center mb-10">按体裁浏览作品</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <Link key={cat.name} href={`/category/${cat.name}`}>
              <div className="bg-[#fefdfb] rounded-lg p-6 shadow-sm border border-[#f0ece4] hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-bold">{cat.name}</h2>
                  <span className="text-xs text-[#8b7355] bg-[#f7f4ef] px-2 py-0.5 rounded-full">
                    {categoryCount[cat.name] || 0} 篇
                  </span>
                </div>
                <p className="text-sm text-[#8a8a8a]">{cat.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb] mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}