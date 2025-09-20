import { Github, Star, GitFork, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { NumberTicker } from "./ui/number-ticker"

export function GitHubSection() {
    const { data: githubData } = useQuery({
        queryKey: ['github-stats'],
        queryFn: () => fetch('https://api.github.com/repos/lovelesscodes/storyforge')
            .then(res => res.json())
            .then(data => ({
                stars: data.stargazers_count as number,
                forks: data.forks_count as number,
                watchers: data.watchers_count as number,
            })),
    });

    return (
        <section id="github" className="mb-20">
            <div className="text-center mb-6">
                <h2 className="text-4xl font-bold mb-4 text-foreground">Open Source</h2>
                <p className="text-muted-foreground text-lg">
                    Story Forge is built in the open. Contribute, report issues, or just explore the code.
                </p>
            </div>

            <div className="max-w-4xl mx-auto">
                <Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                            <Github className="w-10 h-10 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Story Forge on GitHub</CardTitle>
                        <CardDescription className="text-base">Join our community of developers and contributors</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="text-center">
                                <div className="flex items-center justify-center">
                                    <Star className="w-5 h-5 text-yellow-500 mr-2" />
                                    <span className="text-2xl font-bold"><NumberTicker value={githubData?.stars ?? 0} /></span>
                                </div>
                                <p className="text-muted-foreground">Stars</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center">
                                    <GitFork className="w-5 h-5 text-purple-500 mr-2" />
                                    <span className="text-2xl font-bold"><NumberTicker value={githubData?.forks ?? 0} /></span>
                                </div>
                                <p className="text-muted-foreground">Forks</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center">
                                    <Eye className="w-5 h-5 text-emerald-500 mr-2" />
                                    <span className="text-2xl font-bold"><NumberTicker value={githubData?.watchers ?? 0} /></span>
                                </div>
                                <p className="text-muted-foreground">Watchers</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a className="w-full md:w-auto" href="https://github.com/lovelesscodes/storyforge" target="_blank" rel="noopener noreferrer">
                                <Button size="lg" className="w-full md:w-auto">
                                    <Github className="w-5 h-5 mr-2" />
                                    View Repository
                                </Button>
                            </a>
                            <a className="w-full md:w-auto" href="https://github.com/lovelesscodes/storyforge/issues" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" size="lg" className="w-full md:w-auto">
                                    Report Issue
                                </Button>
                            </a>
                            <a
                                className="w-full md:w-auto"
                                href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button variant="outline" size="lg" className="w-full md:w-auto">
                                    Contribute
                                </Button>
                            </a>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
