export default function Loading() {
    return (
      <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
        {/* 导航骨架 */}
        <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-[#e8e4dc] opacity-40" />
            <div className="flex gap-6">
              <div className="h-4 w-8 rounded bg-[#e8e4dc] opacity-40" />
              <div className="h-4 w-8 rounded bg-[#e8e4dc] opacity-40" />
              <div className="h-4 w-8 rounded bg-[#e8e4dc] opacity-40" />
            </div>
          </div>
        </nav>
  
        <main className="max-w-3xl mx-auto px-6 py-12">
          {/* 文章头部：分类 → 标题 → 元信息，依次晕染 */}
          <div className="mb-10 text-center space-y-4">
            {/* 分类标签 */}
            <div
              className="ink-line mx-auto h-5 w-16 rounded-full bg-[#e8e4dc]"
              style={{ animationDelay: '0ms' }}
            />
            {/* 标题第一行 */}
            <div
              className="ink-line mx-auto h-9 w-3/4 rounded bg-[#e8e4dc]"
              style={{ animationDelay: '60ms' }}
            />
            {/* 标题第二行 */}
            <div
              className="ink-line mx-auto h-9 w-1/2 rounded bg-[#e8e4dc]"
              style={{ animationDelay: '120ms' }}
            />
            {/* 元信息：作者 · 日期 */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <div className="ink-line h-4 w-16 rounded bg-[#e8e4dc]" style={{ animationDelay: '180ms' }} />
              <div className="ink-line h-4 w-1.5 rounded bg-[#e8e4dc]" style={{ animationDelay: '210ms' }} />
              <div className="ink-line h-4 w-20 rounded bg-[#e8e4dc]" style={{ animationDelay: '240ms' }} />
            </div>
          </div>
  
          {/* 正文：像墨水在纸上逐行渗透 */}
          <div className="bg-[#fefdfb] rounded-lg p-8 md:p-12 shadow-sm space-y-5">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="ink-line h-4 rounded bg-[#e8e4dc]"
                style={{
                  animationDelay: `${320 + i * 80}ms`,
                  width: i === 6 ? '58%' : '100%',
                }}
              />
            ))}
          </div>
  
          {/* 互动按钮区 */}
          <div className="mt-8 flex justify-center gap-4">
            <div className="ink-line h-10 w-24 rounded bg-[#e8e4dc]" style={{ animationDelay: '960ms' }} />
            <div className="ink-line h-10 w-24 rounded bg-[#e8e4dc]" style={{ animationDelay: '1040ms' }} />
          </div>
        </main>
      </div>
    )
  }