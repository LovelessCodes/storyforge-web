import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/guide/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<section className="py-32 px-8 flex flex-col md:px-0 flex text-foreground justify-center items-center">
			<h1 className="text-4xl font-bold">Guides</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 container mt-8">
				<a
					className="border border-border rounded-lg p-6 hover:bg-accent/50 transition"
					href="/guide/migrate"
				>
					<h2 className="text-2xl font-semibold mb-2">
						Migrating from Vintage Story
					</h2>
					<p className="text-muted-foreground">
						A guide to help you migrate your projects from Vintage Story to
						Story Forge.
					</p>
				</a>
				{/* Add some skeleton guides for now */}
				<div className="border border-border rounded-lg p-6 opacity-50 cursor-not-allowed">
					<h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
					<p className="text-muted-foreground">
						More guides will be added in the future. Stay tuned!
					</p>
				</div>
				<div className="border border-border rounded-lg p-6 opacity-50 cursor-not-allowed">
					<h2 className="text-2xl font-semibold mb-2">Coming Soon</h2>
					<p className="text-muted-foreground">
						More guides will be added in the future. Stay tuned!
					</p>
				</div>
			</div>
		</section>
	);
}
