import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock, MessageCircle } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { guideCategories, guides } from "@/lib/guides";

export const Route = createFileRoute("/guide/")({
	component: RouteComponent,
});

function RouteComponent() {
	useDocumentTitle("Guides — Story Forge");

	return (
		<main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6">
			<Reveal>
				<div className="text-accent-amber flex items-center gap-2 text-[10px] font-medium tracking-widest uppercase">
					<BookOpen className="size-3" /> Guides
				</div>
				<h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">Learn the ropes</h1>
				<p className="text-muted-foreground mt-3 max-w-2xl text-sm/relaxed">
					Short, practical guides for getting the most out of Story Forge — from first install to
					hosting a server.
				</p>
			</Reveal>

			<div className="mt-10 grid gap-12">
				{guideCategories.map((category) => {
					const entries = guides.filter((guide) => guide.category === category.id);
					if (entries.length === 0) return null;
					return (
						<Reveal key={category.id}>
							<div className="border-border flex items-baseline justify-between gap-4 border-b pb-2">
								<h2 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
									{category.label}
								</h2>
								<span className="text-muted-foreground/70 hidden text-[10px] sm:block">
									{category.description}
								</span>
							</div>

							<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{entries.map((guide, index) => (
									<Reveal delay={Math.min(index * 0.05, 0.2)} key={guide.slug}>
										<Link
											className="group border-border bg-card hover:border-accent-primary/40 hover:bg-surface-hover grid h-full content-start gap-3 border p-5 transition-all duration-300"
											params={{ slug: guide.slug }}
											to="/guide/$slug"
										>
											<div className="border-border bg-background text-accent-primary group-hover:border-accent-primary/50 group-hover:text-accent-amber flex size-8 items-center justify-center border transition-colors">
												<guide.icon className="size-4" />
											</div>
											<h3 className="group-hover:text-accent-amber text-sm font-medium transition-colors">
												{guide.title}
											</h3>
											<p className="text-muted-foreground text-[11px]/relaxed">
												{guide.description}
											</p>
											<div className="text-muted-foreground mt-1 flex items-center justify-between text-[10px]">
												<span className="flex items-center gap-1">
													<Clock className="size-3" /> {guide.minutes} min read
												</span>
												<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
											</div>
										</Link>
									</Reveal>
								))}
							</div>
						</Reveal>
					);
				})}

				<Reveal>
					<div className="border-border bg-surface/50 flex flex-wrap items-center justify-between gap-4 border p-5">
						<div className="flex items-center gap-3">
							<MessageCircle className="text-accent-amber size-4" />
							<p className="text-muted-foreground text-xs">
								Missing a guide? Tell us what you'd like explained — topics get added all the time.
							</p>
						</div>
						<a
							className="text-accent-primary hover:text-accent-amber inline-flex items-center gap-1 text-[11px] font-medium transition-colors"
							href="https://discord.gg/gByx63peUC"
							rel="noopener noreferrer"
							target="_blank"
						>
							Suggest a topic <ArrowRight className="size-3.5" />
						</a>
					</div>
				</Reveal>
			</div>
		</main>
	);
}
