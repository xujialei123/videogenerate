/*
 * @Author: xudada 1820064201@qq.com
 * @Date: 2025-04-20 02:30:24
 * @LastEditors: xudada 1820064201@qq.com
 * @LastEditTime: 2025-04-20 10:47:18
 * @FilePath: /video-generator (1)/app/login/page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    if (!email || !password) {
      setError('请输入邮箱和密码')
      setIsLoading(false)
      return
    }

    try {
      // 先尝试登录
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        // 如果登录失败且是因为凭证无效，则尝试注册
        if (signInError.message?.includes('Invalid login credentials')) {
          const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/auth/callback`
            }
          })

          if (signUpError) {
            throw signUpError
          }

          // 注册成功后，再次尝试登录
          const { error: newSignInError } =
            await supabase.auth.signInWithPassword({
              email,
              password
            })

          if (newSignInError) {
            throw newSignInError
          }
        } else {
          throw signInError
        }
      }

      // 获取用户信息并存储
      const {
        data: { user: supabaseUser }
      } = await supabase.auth.getUser()
      if (supabaseUser) {
        const userInfo = {
          email: supabaseUser.email,
          name: supabaseUser.email?.split('@')[0] || 'User'
        }
        localStorage.setItem('user', JSON.stringify(userInfo))
      }

      router.refresh()
      router.push('/dashboard')
    } catch (err) {
      console.error('登录错误:', err)
      setError(err instanceof Error ? err.message : '登录失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            AI Video Generator
          </CardTitle>
          <CardDescription>输入邮箱登录您的账号</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
