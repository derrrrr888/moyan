'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isRegister) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name: name || email.split('@')[0] }
          }
        })
        if (error) throw error
        alert('注册成功！请登录')
        setIsRegister(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || '出错了')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f4ef] font-wenkai text-[#3d3d3d] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="text-2xl font-bold tracking-wider">拾墨杂谈</Link>
          <p className="text-sm text-[#8a8a8a] mt-2">以文字为舟，载思想而行</p>
        </div>

        <div className="bg-[#fefdfb] rounded-lg p-8 shadow-sm border border-[#f0ece4]">
          <h1 className="text-xl font-bold text-center mb-6">
            {isRegister ? '注册账号' : '欢迎回来'}
          </h1>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm mb-1">笔名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="请输入笔名"
                  className="w-full p-3 bg-[#f7f4ef] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355]"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1">邮箱</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full p-3 bg-[#f7f4ef] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355]"
              />
            </div>

            <div>
              <label className="block text-sm mb-1">密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                minLength={6}
                className="w-full p-3 bg-[#f7f4ef] border border-[#e8e4dc] rounded-lg text-sm focus:outline-none focus:border-[#8b7355]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#8b7355] text-white rounded-lg hover:bg-[#6b5a45] transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? '请稍候...' : (isRegister ? '注册' : '登录')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#8a8a8a]">
            {isRegister ? '已有账号？' : '还没有账号？'}
            <button
              onClick={() => { setIsRegister(!isRegister); setError('') }}
              className="text-[#8b7355] hover:underline ml-1"
            >
              {isRegister ? '去登录' : '去注册'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[#8a8a8a] hover:text-[#8b7355]">← 返回首页</Link>
        </div>
      </div>
    </div>
  )
}