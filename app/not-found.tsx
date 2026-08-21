import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] flex items-center justify-center leading-[1.8]">
      <div className="text-center px-6">
        <h1 className="text-7xl font-bold text-[#8b7355] mb-4 tracking-wider">404</h1>
        <p className="text-xl mb-2 font-bold">页面未找到</p>
        <p className="text-sm text-[#8a8a8a] mb-8">此页面可能已被移除，或从未存在过</p>
        <Link 
          href="/" 
          className="inline-block px-6 py-2.5 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors text-sm"
        >
          ← 返回首页
        </Link>
      </div>
    </div>
  );
}