import { Link } from "@tanstack/react-router";
import { Download, Layers } from "lucide-react";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "@/components/icons";
import { usePageScroll } from "@/components/layout/PageScroll";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";

export function FinalCta() {
	const { t } = useTranslation();
	const { scrollToId } = usePageScroll();

	return (
		<section className="relative overflow-hidden">
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black,transparent)] opacity-50" />
				<div className="bg-accent-primary/14 absolute -bottom-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 blur-[130px]" />
			</div>

			<div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
				<Reveal className="mx-auto grid max-w-2xl justify-items-center gap-6">
					<img alt="Story Forge" className="size-14 object-contain" src="/StoryForge.svg" />
					<h2 className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
						{t("home.finalCta.title")}
					</h2>
					<p className="text-muted-foreground max-w-lg text-sm/relaxed">
						{t("home.finalCta.description")}
					</p>
					<div className="flex flex-wrap justify-center gap-3">
						<Button onClick={() => scrollToId("download")} size="xl" variant="amber">
							<Download /> {t("home.finalCta.download")}
						</Button>
						<Button render={<Link to="/modpacks" />} size="xl" variant="outline">
							<Layers /> {t("home.finalCta.explore")}
						</Button>
						<Button
							render={
								<a href="https://discord.gg/gByx63peUC" rel="noopener noreferrer" target="_blank">
									<DiscordIcon className="size-4" /> {t("home.finalCta.discord")}
								</a>
							}
							size="xl"
							variant="ghost"
						/>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
