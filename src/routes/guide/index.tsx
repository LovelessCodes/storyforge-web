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
				<div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-accent-amber uppercase">
					<BookOpen className="size-3" /> Guides
				</div>
				<h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
					Learn the ropes
				</h1>
				<p className="mt-3 max-w-2xl text-sm/relaxed text-muted-foreground">
					Short, practical guides for getting the most out of Story Forge — from
					first install to hosting a server.
				</p>
			</Reveal>

			<div className="mt-10 grid gap-12">
				{guideCategories.map((category) => {
					const entries = guides.filter(
						(guide) => guide.category === category.id,
					);
					if (entries.length === 0) return null;
					return (
						<Reveal key={category.id}>
							<div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
								<h2 className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
									{category.label}
								</h2>
								<span className="hidden text-[10px] text-muted-foreground/70 sm:block">
									{category.description}
								</span>
							</div>

							<div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
								{entries.map((guide, index) => (
									<Reveal delay={Math.min(index * 0.05, 0.2)} key={guide.slug}>
										<Link
											className="group grid h-full content-start gap-3 border border-border bg-card p-5 transition-all duration-300 hover:border-accent-primary/40 hover:bg-surface-hover"
											params={{ slug: guide.slug }}
											to="/guide/$slug"
										>
											<div className="flex size-8 items-center justify-center border border-border bg-background text-accent-primary transition-colors group-hover:border-accent-primary/50 group-hover:text-accent-amber">
												<guide.icon className="size-4" />
											</div>
											<h3 className="text-sm font-medium transition-colors group-hover:text-accent-amber">
												{guide.title}
											</h3>
											<p className="text-[11px]/relaxed text-muted-foreground">
												{guide.description}
											</p>
											<div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
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
					<div className="flex flex-wrap items-center justify-between gap-4 border border-border bg-surface/50 p-5">
						<div className="flex items-center gap-3">
							<MessageCircle className="size-4 text-accent-amber" />
							<p className="text-xs text-muted-foreground">
								Missing a guide? Tell us what you'd like explained — topics get
								added all the time.
							</p>
						</div>
						<a
							className="inline-flex items-center gap-1 text-[11px] font-medium text-accent-primary transition-colors hover:text-accent-amber"
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
