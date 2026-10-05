import { DownloadIcon, GitFork, Github, Star } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useGithubStatsQuery } from "@/hooks/use-github-stats";

export function OpenSource() {
	const { data: stats } = useGithubStatsQuery();

	const items = [
		{ icon: Star, label: "Stars", value: stats?.stars ?? 0 },
		{ icon: GitFork, label: "Forks", value: stats?.forks ?? 0 },
		{ icon: DownloadIcon, label: "Downloads", value: stats?.downloads ?? 0 },
	];

	return (
		<section className="border-b border-border">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal>
					<div className="relative overflow-hidden border border-border bg-card">
						<div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)]" />
						<div className="absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 bg-accent-primary/12 blur-[100px]" />

						<div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
							<div className="max-w-xl">
								<div className="flex items-center gap-2">
									<div className="flex size-8 items-center justify-center border border-border bg-background">
										<Github className="size-4" />
									</div>
									<h2 className="text-xl font-bold tracking-tight sm:text-2xl">
										Built in the open
									</h2>
								</div>
								<p className="mt-4 text-sm/relaxed text-muted-foreground">
									Story Forge is GPLv3-licensed and developed in public. Read
									the source, report bugs, request features or send a pull
									request — every contribution makes the launcher better.
								</p>

								<div className="mt-8 grid grid-cols-3 gap-px border border-border bg-border">
									{items.map((stat) => (
										<div
											className="grid justify-items-center gap-1 bg-background px-4 py-5"
											key={stat.label}
										>
											<stat.icon className="size-3.5 text-muted-foreground" />
											<span className="text-lg font-bold tabular-nums">
												<NumberTicker value={stat.value} />
											</span>
											<span className="text-[10px] tracking-widest text-muted-foreground uppercase">
												{stat.label}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex flex-wrap gap-3 lg:flex-col">
								<Button
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge"
											rel="noopener noreferrer"
											target="_blank"
										>
											<Github /> View repository
										</a>
									}
									size="lg"
								/>
								<Button
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge/issues"
											rel="noopener noreferrer"
											target="_blank"
										>
											Report an issue
										</a>
									}
									size="lg"
									variant="outline"
								/>
								<Button
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
											rel="noopener noreferrer"
											target="_blank"
										>
											Contribute
										</a>
									}
									size="lg"
									variant="outline"
								/>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
