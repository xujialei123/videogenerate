'use client'

import { useAuth } from '@/components/auth-provider'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle, Video, ImageIcon } from 'lucide-react'
import { VideoList } from '@/components/video-list'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  console.log(user, 'user')
  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create New Video</CardTitle>
            <CardDescription>
              Start a new video creation process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Choose how you want to start your new video project</p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/create/script">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start from Blank
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/create/script/preview">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start with Script
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/create/audio/upload">
                <PlusCircle className="mr-2 h-4 w-4" />
                Start with Audio
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Videos</CardTitle>
            <CardDescription>View and manage your videos</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Access all your previously created videos</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/videos">
                <Video className="mr-2 h-4 w-4" />
                View All Videos
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Image Library</CardTitle>
            <CardDescription>Manage your image albums</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Organize and access images for your videos</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link href="/images">
                <ImageIcon className="mr-2 h-4 w-4" />
                Manage Images
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Recent Videos</h2>
        <VideoList limit={5} />
      </div>
    </div>
  )
}
