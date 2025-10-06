import { useQuery } from "@tanstack/react-query";
import { DownloadIcon, Eye, GitFork, Github, Star } from "lucide-react";
import { useId } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { NumberTicker } from "./ui/number-ticker";

export function GitHubSection() {
	const id = useId();
	const { data: githubData } = useQuery({
		queryFn: () =>
			fetch("https://api.github.com/repos/lovelesscodes/storyforge")
				.then((res) => res.json())
				.then((data) => ({
					forks: data.forks_count as number,
					stars: data.stargazers_count as number,
					watchers: data.watchers_count as number,
				})),
		queryKey: ["github-stats"],
	});

	const { data: downloads } = useQuery({
		queryFn: () =>
			fetch("https://api.github.com/repos/LovelessCodes/StoryForge/releases")
				.then((res) => res.json())
				.then(
					(data) =>
						data.reduce(
							(
								acc: number,
								release: { assets: { download_count: number; name: string }[] },
							) => {
								const releaseDownloads = release.assets.reduce(
									(sum, asset) =>
										sum +
										(asset.name !== "latest.json" ? asset.download_count : 0),
									0,
								);
								return acc + releaseDownloads;
							},
							0,
						) as number,
				),
		queryKey: ["github-downloads"],
		staleTime: 1000 * 60 * 60, // 1 hour
	});

	return (
		<section className="mb-20" id={`github-section-${id}`}>
			<div className="text-center mb-6">
				<h2 className="text-4xl font-bold mb-4 text-foreground">Open Source</h2>
				<p className="text-muted-foreground text-lg">
					Story Forge is built in the open. Contribute, report issues, or just
					explore the code.
				</p>
			</div>

			<div className="max-w-4xl mx-auto">
				<Card className="bg-gradient-to-br from-card to-card/50 border-primary/20">
					<CardHeader className="text-center">
						<div className="mx-auto mb-4 w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
							<Github className="w-10 h-10 text-primary" />
						</div>
						<CardTitle className="text-2xl">Story Forge on GitHub</CardTitle>
						<CardDescription className="text-base">
							Join our community of developers and contributors
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-4 gap-6 mb-8">
							<div className="text-center">
								<div className="flex items-center justify-center">
									<Star className="w-5 h-5 text-yellow-500 mr-2" />
									<span className="text-2xl font-bold">
										<NumberTicker value={githubData?.stars ?? 0} />
									</span>
								</div>
								<p className="text-muted-foreground">Stars</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center">
									<GitFork className="w-5 h-5 text-purple-500 mr-2" />
									<span className="text-2xl font-bold">
										<NumberTicker value={githubData?.forks ?? 0} />
									</span>
								</div>
								<p className="text-muted-foreground">Forks</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center">
									<Eye className="w-5 h-5 text-emerald-500 mr-2" />
									<span className="text-2xl font-bold">
										<NumberTicker value={githubData?.watchers ?? 0} />
									</span>
								</div>
								<p className="text-muted-foreground">Watchers</p>
							</div>
							<div className="text-center">
								<div className="flex items-center justify-center">
									<DownloadIcon className="w-5 h-5 text-blue-500 mr-2" />
									<span className="text-2xl font-bold">
										<NumberTicker value={downloads ?? 0} />
									</span>
								</div>
								<p className="text-muted-foreground">Downloads</p>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								className="w-full md:w-auto"
								href="https://github.com/lovelesscodes/storyforge"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Button className="w-full md:w-auto" size="lg">
									<Github className="w-5 h-5 mr-2" />
									View Repository
								</Button>
							</a>
							<a
								className="w-full md:w-auto"
								href="https://github.com/lovelesscodes/storyforge/issues"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Button
									className="w-full md:w-auto"
									size="lg"
									variant="outline"
								>
									Report Issue
								</Button>
							</a>
							<a
								className="w-full md:w-auto"
								href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
								rel="noopener noreferrer"
								target="_blank"
							>
								<Button
									className="w-full md:w-auto"
									size="lg"
									variant="outline"
								>
									Contribute
								</Button>
							</a>
						</div>
					</CardContent>
				</Card>
			</div>
		</section>
	);
}
