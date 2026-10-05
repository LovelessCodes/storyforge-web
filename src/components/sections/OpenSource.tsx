import { DownloadIcon, GitFork, Github, Star } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useGithubStatsQuery } from "@/hooks/use-github-stats";

export function OpenSource() {
	const { t } = useTranslation();
	const { data: stats } = useGithubStatsQuery();

	const items = [
		{ icon: Star, label: t("home.openSource.stars"), value: stats?.stars ?? 0 },
		{ icon: GitFork, label: t("home.openSource.forks"), value: stats?.forks ?? 0 },
		{ icon: DownloadIcon, label: t("home.openSource.downloads"), value: stats?.downloads ?? 0 },
	];

	return (
		<section className="border-border border-b">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal>
					<div className="border-border bg-card relative overflow-hidden border">
						<div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,black,transparent)] opacity-40" />
						<div className="bg-accent-primary/12 absolute -top-24 left-1/2 h-64 w-[560px] -translate-x-1/2 blur-[100px]" />

						<div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
							<div className="max-w-xl">
								<div className="flex items-center gap-2">
									<div className="border-border bg-background flex size-8 items-center justify-center border">
										<Github className="size-4" />
									</div>
									<h2 className="text-xl font-bold tracking-tight sm:text-2xl">
										{t("home.openSource.title")}
									</h2>
								</div>
								<p className="text-muted-foreground mt-4 text-sm/relaxed">
									{t("home.openSource.description")}
								</p>

								<div className="bg-border border-border mt-8 grid grid-cols-3 gap-px border">
									{items.map((stat) => (
										<div
											className="bg-background grid justify-items-center gap-1 px-4 py-5"
											key={stat.label}
										>
											<stat.icon className="text-muted-foreground size-3.5" />
											<span className="text-lg font-bold tabular-nums">
												<NumberTicker value={stat.value} />
											</span>
											<span className="text-muted-foreground text-[10px] tracking-widest uppercase">
												{stat.label}
											</span>
										</div>
									))}
								</div>
							</div>

							<div className="flex flex-wrap gap-3 lg:flex-col">
								<Button
									size="lg"
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge"
											rel="noopener noreferrer"
											target="_blank"
										>
											<Github /> {t("home.openSource.viewRepo")}
										</a>
									}
								/>
								<Button
									size="lg"
									variant="outline"
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge/issues"
											rel="noopener noreferrer"
											target="_blank"
										>
											{t("home.openSource.reportIssue")}
										</a>
									}
								/>
								<Button
									size="lg"
									variant="outline"
									render={
										<a
											href="https://github.com/lovelesscodes/storyforge/blob/release/CONTRIBUTING.md"
											rel="noopener noreferrer"
											target="_blank"
										>
											{t("home.openSource.contribute")}
										</a>
									}
								/>
							</div>
						</div>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
