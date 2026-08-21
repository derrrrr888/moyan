import Link from "next/link";
import ScrollToTop from "../components/ScrollToTop";

export const metadata = {
  title: "关于",
  description: "关于拾墨杂谈——一个文学内容平台的介绍与声明",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] leading-[1.8]">
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
        {/* 头部 */}
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-xl bg-[#8b7355] flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M10 24c2-1 4-3 5-6 1-2 1-4 0-6-1-2-2-3-3-4-1 2-2 4-2 6 0 2 0 4 0 6z" fill="#fefdfb" opacity="0.9"/>
              <path d="M18 8c-1 2-2 5-1 8 1 2 3 4 5 5" stroke="#fefdfb" strokeWidth="2" strokeLinecap="round" opacity="0.85"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-3 tracking-wider">拾墨杂谈</h1>
          <p className="text-[#8a8a8a] text-sm">以文字为舟，载思想而行</p>
        </div>

        {/* 网站介绍 */}
        <section className="bg-[#fefdfb] rounded-lg p-8 md:p-10 shadow-sm border border-[#f0ece4] mb-8">
          <h2 className="text-lg font-bold mb-4 pb-3 border-b border-[#e8e4dc]">关于本站</h2>
          <div className="text-sm text-[#6b6b6b] space-y-4 leading-relaxed">
            <p>
              拾墨杂谈是一个专注于原创文学的内容平台，收录散文、随笔、小说、时评、诗歌等多种体裁。
              我们相信，在这个信息碎片化的时代，依然有人愿意慢下来，用文字记录生活的温度与思考的痕迹。
            </p>
            <p>
              "拾墨"二字，取自"拾取墨香"之意。每一篇文章都是作者蘸取生活之墨、书写内心之声的痕迹。
              我们希望能为写作者提供一个安静、纯粹的表达空间，也为读者提供一个远离喧嚣的阅读角落。
            </p>
          </div>
        </section>

        {/* 社区准则 */}
        <section className="bg-[#fefdfb] rounded-lg p-8 md:p-10 shadow-sm border border-[#f0ece4] mb-8">
          <h2 className="text-lg font-bold mb-4 pb-3 border-b border-[#e8e4dc]">社区准则</h2>
          <ul className="text-sm text-[#6b6b6b] space-y-3 leading-relaxed list-disc list-inside">
            <li>尊重原创，禁止抄袭、洗稿或未经授权转载他人作品</li>
            <li>文明发言，禁止发布涉及政治敏感、色情低俗、暴力恐怖、赌博诈骗等内容</li>
            <li>禁止发布垃圾广告、引流信息及外部链接</li>
            <li>理性讨论，尊重不同观点，禁止人身攻击与恶意辱骂</li>
            <li>平台保留对违规内容进行隐藏、删除及封禁账号的权利</li>
          </ul>
        </section>

        {/* 隐私说明 */}
        <section className="bg-[#fefdfb] rounded-lg p-8 md:p-10 shadow-sm border border-[#f0ece4] mb-8">
          <h2 className="text-lg font-bold mb-4 pb-3 border-b border-[#e8e4dc]">隐私说明</h2>
          <div className="text-sm text-[#6b6b6b] space-y-4 leading-relaxed">
            <p>
              我们使用 Supabase 进行用户认证与数据存储，您的邮箱信息仅用于登录识别，不会向第三方出售或共享。
            </p>
            <p>
              您发布的内容（文章、评论）将公开显示在网站上。平台会对用户发布的内容进行安全审核，以维护良好的社区环境。
            </p>
            <p>
              如需删除账号或导出个人数据，请联系站长。
            </p>
          </div>
        </section>

        {/* 联系方式 */}
        <section className="bg-[#fefdfb] rounded-lg p-8 md:p-10 shadow-sm border border-[#f0ece4] mb-12">
          <h2 className="text-lg font-bold mb-4 pb-3 border-b border-[#e8e4dc]">联系我们</h2>
          <div className="text-sm text-[#6b6b6b] space-y-3 leading-relaxed">
            <p>如有合作、投稿、反馈或侵权投诉，欢迎通过以下方式联系：</p>
            <div className="flex items-center gap-2 text-[#8b7355]">
              <span>📧</span>
              <span>contact@shimozatan.com</span>
            </div>
            <p className="text-xs text-[#8a8a8a] mt-4">通常会在 48 小时内回复。</p>
          </div>
        </section>

        {/* 返回首页 */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors text-sm"
          >
            ← 返回首页
          </Link>
        </div>
      </main>

      <footer className="border-t border-[#e8e4dc] bg-[#fefdfb]">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center text-xs text-[#8a8a8a]">
          <p>以文字为舟，载思想而行</p>
          <p className="mt-2">拾墨杂谈 © 2026</p>
        </div>
      </footer>

      <ScrollToTop />
    </div>
  );
}