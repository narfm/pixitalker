import Link from "next/link"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { AudioPlayer } from "@/components/audio-player"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-violet-100 via-fuchsia-50 to-cyan-100">
      <div className="flex h-16 items-center px-4 max-w-full">
        <Link href="/" className="mr-6">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            KidsLearn
          </h1>
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <AudioPlayer />
          <UserNav />
        </div>
      </div>
    </header>
  )
}

