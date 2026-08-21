export default function Loading() {
    return (
      <div className="min-h-screen bg-[#f7f4ef] font-['Noto_Serif_SC','Source_Han_Serif_SC',serif] text-[#3d3d3d] leading-[1.8]">
        <nav className="border-b border-[#e8e4dc] bg-[#fefdfb]">
          <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="h-6 w-24 rounded bg-[#e8e4dc]" />
            <div className="flex gap-6">
              <div className="h-4 w-8 rounded bg-[#e8e4dc]" />
              <div className="h-4 w-8 rounded bg-[#e8e4dc]" />
              <div className="h-4 w-8 rounded bg-[#e8e4dc]" />
            </div>
          </div>
        </nav>
        <main className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
          <div className="mb-10 text-center space-y-4">
            <div className="h-5 w-16 rounded-full bg-[#e8e4dc] mx-auto" />
            <div className="h-8 w-3/4 rounded bg-[#e8e4dc] mx-auto" />
            <div className="h-4 w-48 rounded bg-[#e8e4dc] mx-auto" />
          </div>
          <div className="bg-[#fefdfb] rounded-lg p-8 md:p-12 shadow-sm space-y-4">
            <div className="h-4 w-full rounded bg-[#e8e4dc]" />
            <div className="h-4 w-full rounded bg-[#e8e4dc]" />
            <div className="h-4 w-5/6 rounded bg-[#e8e4dc]" />
            <div className="h-4 w-full rounded bg-[#e8e4dc]" />
            <div className="h-4 w-4/6 rounded bg-[#e8e4dc]" />
            <div className="h-4 w-full rounded bg-[#e8e4dc]" />
            <div className="h-4 w-3/4 rounded bg-[#e8e4dc]" />
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <div className="h-10 w-24 rounded bg-[#e8e4dc]" />
            <div className="h-10 w-24 rounded bg-[#e8e4dc]" />
          </div>
        </main>
      </div>
    )
  }