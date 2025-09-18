import { Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="StoryForge.png" alt="Story Forge Logo" className="w-8 h-8" />
            <span className="text-xl text-foreground font-bold">Story Forge</span>
          </div>

          <div className="flex items-center space-x-6">
            <a href="https://github.com/lovelesscodes/storyforge" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm">
                <Github className="w-4 h-4 mr-2" />
                View Source
              </Button>
            </a>
          </div>
        </nav>
      </div>
    </header>
  )
}
