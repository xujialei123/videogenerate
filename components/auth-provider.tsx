/*
 * @Author: xudada 1820064201@qq.com
 * @Date: 2025-04-20 02:30:24
 * @LastEditors: xudada 1820064201@qq.com
 * @LastEditTime: 2025-04-20 18:23:11
 * @FilePath: /video-generator (1)/components/auth-provider.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type User = {
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: true
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  // 监听 Supabase 认证状态变化
  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const userInfo = {
          email: session.user.email!,
          name: session.user.email?.split('@')[0] || 'User'
        }
        setUser(userInfo)
        localStorage.setItem('user', JSON.stringify(userInfo))
      } else {
        setUser(null)
        localStorage.removeItem('user')
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // 初始化时检查用户状态
  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user: supabaseUser }
        } = await supabase.auth.getUser()
        if (supabaseUser) {
          const userInfo = {
            email: supabaseUser.email!,
            name: supabaseUser.email?.split('@')[0] || 'User'
          }
          setUser(userInfo)
          localStorage.setItem('user', JSON.stringify(userInfo))
        } else {
          setUser(null)
          localStorage.removeItem('user')
        }
      } catch (error) {
        console.error('Error checking user:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [supabase])

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return !error
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user && pathname !== '/login') {
      router.push('/login')
    }

    // Redirect to dashboard if already logged in and on login page
    if (!isLoading && user && pathname === '/login') {
      router.push('/dashboard')
    }
  }, [user, isLoading, pathname, router])

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
