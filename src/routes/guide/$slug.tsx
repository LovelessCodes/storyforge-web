import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen } from "lucide-react";
import { guideContent } from "@/components/guides/content";
import { GuideShell } from "@/components/guides/GuideShell";
import { Button } from "@/components/ui/button";
import { getGuide } from "@/lib/guides";

export const Route = createFileRoute("/guide/$slug")({
	component: RouteComponent,
});

function RouteComponent() {
	const { slug } = Route.useParams();
	const guide = getGuide(slug);
	const Content = guideContent[slug];

	if (!guide || !Content) {
		return (
			<main className="mx-auto grid w-full max-w-3xl flex-1 place-items-center px-4 py-24 text-center sm:px-6">
				<div className="grid justify-items-center gap-4">
					<BookOpen className="size-8 text-muted-foreground" />
					<h1 className="text-xl font-bold">Guide not found</h1>
					<p className="max-w-sm text-xs text-muted-foreground">
						This guide doesn't exist (yet). Browse the guide index to find what
						you need.
					</p>
					<Button render={<Link to="/guide" />} size="sm" variant="outline">
						All guides
					</Button>
				</div>
			</main>
		);
	}

	return (
		<GuideShell slug={slug}>
			<Content />
		</GuideShell>
	);
}
