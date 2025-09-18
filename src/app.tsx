import { DownloadSection } from "@/components/DownloadSection"
import { GitHubSection } from "@/components/GithubSection"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Highlighter } from "./components/ui/highlighter"

export function App() {
  return (
    <div className="min-h-screen bg-background dark">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6 text-balance">
            <img src="/StoryForge.png" alt="Story Forge Logo" className="inline w-24 h-24 mr-4 mb-2" />
            <span className="text-foreground">
              Story Forge
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            <Highlighter action="box" color="#2c96c4" animationDuration={3000}><span className="text-foreground">The ultimate launcher for Vintage Story.</span></Highlighter><br/>Experience seamless gameplay with our feature-rich,{" "}
            <Highlighter action="underline" color="#FEAD36">community-driven</Highlighter> launcher designed for the modern adventurer.
          </p>
        </div>

        <DownloadSection />
        <GitHubSection />
      </main>
      <Footer />
    </div>
  )
}
