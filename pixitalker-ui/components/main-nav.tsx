import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Book, Brain, GamepadIcon, Home, School } from 'lucide-react'

const subjects = [
  {
    title: "Mathematics",
    description: "Learn numbers, counting, addition, and more!",
    icon: Brain,
  },
  {
    title: "Reading",
    description: "Explore stories and improve reading skills",
    icon: Book,
  },
  {
    title: "Science",
    description: "Discover the wonders of the world",
    icon: School,
  },
  {
    title: "Games",
    description: "Learn while having fun with educational games",
    icon: GamepadIcon,
  },
]

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white/50 px-4 py-2 text-sm font-medium transition-colors hover:bg-white/80 hover:text-purple-500 focus:bg-white/80 focus:text-purple-500 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-white/50 data-[state=open]:bg-white/50">
              <Home className="mr-2 h-4 w-4" />
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-white/50 hover:bg-white/80 hover:text-purple-500">
            Subjects
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              {subjects.map((subject) => (
                <li key={subject.title}>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-purple-100 hover:text-purple-500 focus:bg-purple-100 focus:text-purple-500"
                    >
                      <div className="flex items-center gap-2">
                        <subject.icon className="h-4 w-4" />
                        <div className="text-sm font-medium leading-none">
                          {subject.title}
                        </div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {subject.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

