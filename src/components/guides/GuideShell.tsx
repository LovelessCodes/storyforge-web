import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Clock, MessageCircle } from "lucide-react";
import type * as React from "react";

import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { getGuide, guideCategories, relatedGuides } from "@/lib/guides";

interface GuideShellProps {
	slug: string;
	children: React.ReactNode;
}

/** Shared layout for every guide: header, prose card, related links, help CTA. */
export function GuideShell({ slug, children }: GuideShellProps) {
	const guide = getGuide(slug);
	useDocumentTitle(guide ? `${guide.title} — Story Forge Guides` : "Guides");

	const category = guideCategories.find((entry) => entry.id === guide?.category);
	const related = relatedGuides(slug);

	return (
		<main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
			<Link
				className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-[11px] transition-colors"
				to="/guide"
			>
				<ArrowLeft className="size-3.5" /> All guides
			</Link>

			<Reveal className="mt-6">
				{guide ? (
					<>
						<div className="text-accent-amber flex flex-wrap items-center gap-3 text-[10px] font-medium tracking-widest uppercase">
							<span className="flex items-center gap-1.5">
								<guide.icon className="size-3" />
								{category?.label}
							</span>
							<span className="text-muted-foreground flex items-center gap-1.5">
								<Clock className="size-3" /> {guide.minutes} min read
							</span>
						</div>
						<h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{guide.title}</h1>
						<p className="text-muted-foreground mt-3 text-sm/relaxed">{guide.description}</p>
					</>
				) : null}
			</Reveal>

			<div className="border-border bg-card mt-6 border px-5 py-5">{children}</div>

			{/* Related guides */}
			{related.length > 0 && (
				<Reveal className="mt-10">
					<h2 className="text-muted-foreground text-[10px] font-medium tracking-widest uppercase">
						Keep reading
					</h2>
					<div className="border-border bg-border mt-3 grid gap-px border sm:grid-cols-3">
						{related.map((entry) => (
							<Link
								className="group bg-background hover:bg-surface-hover grid content-start gap-2 p-4 transition-colors"
								key={entry.slug}
								params={{ slug: entry.slug }}
								to="/guide/$slug"
							>
								<entry.icon className="text-accent-primary group-hover:text-accent-amber size-4 transition-colors" />
								<span className="group-hover:text-accent-amber text-xs font-medium transition-colors">
									{entry.title}
								</span>
								<span className="text-muted-foreground line-clamp-2 text-[10px]/relaxed">
									{entry.description}
								</span>
							</Link>
						))}
					</div>
				</Reveal>
			)}

			{/* Help */}
			<Reveal className="border-border bg-surface/50 mt-8 flex flex-wrap items-center justify-between gap-4 border p-5">
				<div className="flex items-center gap-3">
					<MessageCircle className="text-accent-amber size-4" />
					<p className="text-muted-foreground text-xs">
						Stuck on a step? The community is happy to help on Discord.
					</p>
				</div>
				<div className="flex gap-2">
					<Button render={<Link to="/faq" />} size="sm" variant="outline">
						Read the FAQ
					</Button>
					<Button
						render={
							<a href="https://discord.gg/gByx63peUC" rel="noopener noreferrer" target="_blank">
								Ask on Discord <ArrowRight className="size-3.5" />
							</a>
						}
						size="sm"
						variant="accent"
					/>
				</div>
			</Reveal>
		</main>
	);
}
