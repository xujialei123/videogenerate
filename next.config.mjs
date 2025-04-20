/*
 * @Author: xudada 1820064201@qq.com
 * @Date: 2025-04-20 19:08:56
 * @LastEditors: xudada 1820064201@qq.com
 * @LastEditTime: 2025-04-20 19:23:25
 * @FilePath: /myproject/test/videogenerate/next.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    appDir: true
  },
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true
  },
  images: {
    unoptimized: true
  }
}

export default nextConfig
