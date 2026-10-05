import { Boxes, Earth, IdCard, Layers, Package, Server } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Reveal } from "@/components/motion/Reveal";

const features = [
	{ icon: IdCard, key: "profiles" },
	{ icon: Package, key: "mods" },
	{ icon: Layers, key: "modpacks" },
	{ icon: Boxes, key: "versions" },
	{ icon: Earth, key: "maps" },
	{ icon: Server, key: "hosting" },
] as const;

export function Features() {
	const { t } = useTranslation();

	return (
		<section className="border-border border-b">
			<div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
				<Reveal className="max-w-2xl">
					<p className="text-accent-amber text-[10px] font-medium tracking-widest uppercase">
						{t("home.features.eyebrow")}
					</p>
					<h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
						{t("home.features.title")}
					</h2>
					<p className="text-muted-foreground mt-3 text-sm/relaxed">
						{t("home.features.description")}
					</p>
				</Reveal>

				<div className="bg-border border-border mt-10 grid gap-px border sm:grid-cols-2 lg:grid-cols-3">
					{features.map((feature, index) => (
						<Reveal delay={Math.min(index * 0.05, 0.3)} key={feature.key}>
							<div className="bg-background hover:bg-surface-hover group h-full p-6 transition-colors duration-300">
								<div className="border-border bg-card text-accent-primary group-hover:border-accent-primary/50 group-hover:text-accent-amber flex size-8 items-center justify-center border transition-colors duration-300">
									<feature.icon className="size-4" />
								</div>
								<h3 className="mt-4 text-xs font-medium">
									{t(`home.features.${feature.key}.title`)}
								</h3>
								<p className="text-muted-foreground mt-1.5 text-[11px]/relaxed">
									{t(`home.features.${feature.key}.description`)}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}
