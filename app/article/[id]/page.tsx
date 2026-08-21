import Link from "next/link";
import { Metadata } from "next";
import { supabase } from "../../lib/supabase";
import CommentForm from "../../components/CommentForm";
import LikeButton from "../../components/LikeButton";
import CommentItem from "../../components/CommentItem";
import ArticleActions from "../../components/ArticleActions";
import FavoriteButton from "../../components/FavoriteButton";
import ShareButton from "../../components/ShareButton";
import ScrollToTop from "../../components/ScrollToTop";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const articleId = parseInt(id);
  const { data: article } = await supabase
    .from("articles")
    .select("title,summary")
    .eq("id", articleId)
    .eq("is_hidden", false)
    .single();

  if (!article) return { title: "文章未找到 | 拾墨杂谈" };
  return {
    title: article.title,
    description: article.summary,
  };
}

function buildCommentTree(comments: any[]) {
  const map = new Map<number, any>();
  const roots: any[] = [];
  comments.forEach((c) => { map.set(c.id, { ...c, children: [] }); });
  comments.forEach((c) => {
    if (c.parent_id && map.has(c.parent_id)) {
      map.get(c.parent_id)!.children.push(map.get(c.id));
    } else {
      roots.push(map.get(c.id));
    }
  });
  return roots;
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const articleId = parseInt(id);

  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .eq("is_hidden", false)
    .single();

  if (article) {
    await supabase
      .from("articles")
      .update({ views: (article.views || 0) + 1 })
      .eq("id", articleId);
  }

  const { data: updatedArticle } = await supabase
    .from("articles")
    .select("*")
    .eq("id", articleId)
    .eq("is_hidden", false)
    .single();

  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .eq("article_id", articleId)
    .eq("is_hidden", false)
    .order("date", { ascending: true });

  const commentTree = buildCommentTree(comments || []);

  if (!updatedArticle) {
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
            <Link href="/about" className="hover:text-[#8b7355] transition-colors">关于</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <div className="inline-block px-3 py-1 text-xs text-[#8b7355] border border-[#e8e4dc] rounded-full mb-4">
            {updatedArticle.category}
          </div>
          <h1 className="text-3xl font-bold mb-4 tracking-wide">{updatedArticle.title}</h1>
          <div className="text-sm text-[#8a8a8a] flex items-center justify-center gap-3 flex-wrap">
            <Link href={`/user/${encodeURIComponent(updatedArticle.author)}`} className="hover:text-[#8b7355] transition-colors">
              {updatedArticle.author}
            </Link>
            <span>·</span>
            <span>{updatedArticle.date}</span>
            <span>·</span>
            <span>{updatedArticle.views || 0} 次阅读</span>
          </div>
        </div>

        <article className="bg-[#fefdfb] rounded-lg p-8 md:p-12 shadow-sm mb-8">
          <div className="prose prose-lg max-w-none whitespace-pre-wrap text-[#3d3d3d] leading-[2] text-base md:text-lg">
            {updatedArticle.content}
          </div>
        </article>

        <div className="flex items-center justify-center gap-8 mb-8">
          <LikeButton id={articleId} initialLikes={updatedArticle.likes || 0} size="md" />
          <FavoriteButton articleId={articleId} />
          <ShareButton />
        </div>

        <ArticleActions article={updatedArticle} />

        <div className="mb-12 mt-8">
          <Link href="/" className="inline-flex items-center text-[#8b7355] hover:text-[#6b5a45] transition-colors text-sm">
            ← 返回首页
          </Link>
        </div>

        <div className="bg-[#fefdfb] rounded-lg p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6 pb-4 border-b border-[#e8e4dc]">
            评论 ({comments?.length || 0})
          </h3>
          <div className="space-y-6 mb-8">
            {commentTree.length > 0 ? (
              commentTree.map((comment) => (
                <CommentItem key={comment.id} comment={comment} articleId={articleId} />
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

      <ScrollToTop />
    </div>
  );
}