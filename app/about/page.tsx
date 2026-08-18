import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
      <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-wider">拾墨杂谈</Link>
          <div className="flex gap-8 text-sm text-[#6b6b6b]">
            <Link href="/" className="hover:text-[#8b7355] transition-colors">首页</Link>
            <Link href="/categories" className="hover:text-[#8b7355] transition-colors">分类</Link>
            <span className="text-[#8b7355] font-medium">关于</span>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4 tracking-wider">关于拾墨杂谈</h1>
          <p className="text-[#8a8a8a] text-sm">以文字为舟，载思想而行</p>
        </div>

        <div className="bg-[#fefdfb] rounded-lg p-8 md:p-12 shadow-sm border border-[#f0ece4] space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3 text-[#3d3d3d]">本站缘起</h2>
            <p className="text-sm text-[#6b6b6b] leading-relaxed">
              拾墨杂谈诞生于对文字温度的执念。在这个信息爆炸的时代，我们希望为那些愿意慢下来的人，留一方安静的书桌。这里不追逐热点，不制造焦虑，只收录真诚的随笔、散文、小说与时评，让每一篇文字都能被认真对待。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#3d3d3d]">在这里，你可以</h2>
            <ul className="text-sm text-[#6b6b6b] leading-relaxed space-y-2 list-disc list-inside">
              <li>阅读来自不同作者的原创文字作品</li>
              <li>按散文、随笔、小说、时评、诗歌等体裁浏览文章</li>
              <li>注册账号，发布自己的作品，建立个人专栏</li>
              <li>为喜欢的文章点赞、收藏，留下评论与作者交流</li>
              <li>在评论中与他人展开深入的对话与讨论</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#3d3d3d]">内容主张</h2>
            <p className="text-sm text-[#6b6b6b] leading-relaxed">
              我们鼓励真实、克制、有温度的表达。无论你是记录生活碎片的随笔作者，还是构建虚构世界的小说家，或是关注公共议题的观察者，这里都欢迎你的声音。我们相信，好的文字自有力量，它能穿越屏幕，抵达另一个人的心里。
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold mb-3 text-[#3d3d3d]">联系与反馈</h2>
            <p className="text-sm text-[#6b6b6b] leading-relaxed">
              如果你有任何建议、合作意向，或只是想聊聊文字，欢迎通过邮件联系我们。拾墨杂谈仍在成长，期待与你一起，把它变得更好。
            </p>
            <p className="text-sm text-[#8b7355] mt-2">contact@shimozatan.com</p>
          </section>
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