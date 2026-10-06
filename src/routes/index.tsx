import { createFileRoute } from "@tanstack/react-router";

import { JsonLdSoftwareVersion } from "@/components/JsonLdSoftwareVersion";
import { DownloadSection } from "@/components/sections/DownloadSection";
import { Features } from "@/components/sections/Features";
import { FinalCta } from "@/components/sections/FinalCta";
import { Hero } from "@/components/sections/Hero";
import { ModpacksPreview } from "@/components/sections/ModpacksPreview";
import { OpenSource } from "@/components/sections/OpenSource";
import { Showcase } from "@/components/sections/Showcase";

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	return (
		<main className="flex-1">
			<JsonLdSoftwareVersion />
			<Hero />
			<Features />
			<Showcase />
			<ModpacksPreview />
			<DownloadSection />
			<OpenSource />
			<FinalCta />
		</main>
	);
}
