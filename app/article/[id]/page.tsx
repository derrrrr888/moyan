import Link from "next/link";
import { supabase } from "../../lib/supabase";
import CommentForm from "../../components/CommentForm";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id);

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .single();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .order("date", { ascending: true });

  if (!article) {
    return (
      <div className="min-h-screen bg-[#f7f4ef] flex items-center justify-center text-[#3d3d3d]">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">文章未找到</h1>
          <Link href="/" className="text-[#8b7355] hover:underline">← 返回首页</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-[#3d3d3d] tracking-wider">
            拾墨杂谈
          </Link>
          <div className="flex gap-8 text-sm text-[#6b6b6b]">
          <Link href="/" className="hover:text-[#8b7355] transition-colors">首页</Link>
          <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 text-xs text-[#8b7355] border border-[#e8e4dc] rounded-full mb-4">
            {article.category}
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-wide">{article.title}</h1>
          <div className="text-sm text-[#8a8a8a] flex items-center justify-center gap-4">
            <span>{article.author}</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
        </div>

        <article className="bg-[#fefdfb] rounded-lg p-8 md:p-12 shadow-sm mb-12">
          <div className="prose prose-lg max-w-none whitespace-pre-wrap text-[#3d3d3d] leading-[2] text-base md:text-lg">
            {article.content}
          </div>
        </article>

        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center text-[#8b7355] hover:text-[#6b5a45] transition-colors text-sm"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="bg-[#fefdfb] rounded-lg p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6 pb-4 border-b border-[#e8e4dc]">
            评论 ({comments?.length || 0})
          </h3>

          <div className="space-y-6 mb-8">
            {comments && comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="pb-6 border-b border-[#f0ece4] last:border-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#e8e4dc] flex items-center justify-center text-xs text-[#8b7355]">
                      {comment.author[0]}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{comment.author}</div>
                      <div className="text-xs text-[#8a8a8a]">{comment.date}</div>
                    </div>
                  </div>
                  <p className="text-sm text-[#6b6b6b] leading-relaxed pl-11">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-sm text-[#8a8a8a] text-center py-4">暂无评论</div>
            )}
          </div>

          <CommentForm articleId={articleId} />
        </div>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb] mt-12">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>
    </div>
  );
}