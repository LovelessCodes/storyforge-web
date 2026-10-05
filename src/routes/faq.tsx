import { createFileRoute, Link } from "@tanstack/react-router";
import { HelpCircle } from "lucide-react";

import { FAQItem } from "@/components/items/faq.item";
import { Reveal } from "@/components/motion/Reveal";
import { Accordion } from "@/components/ui/accordion";
import { useDocumentTitle } from "@/hooks/use-document-title";

export const Route = createFileRoute("/faq")({
	component: Faq,
});

interface FaqItem {
	id: string;
	question: React.ReactNode;
	answer: React.ReactNode;
}

interface FaqCategory {
	title: string;
	items: FaqItem[];
}

function Faq() {
	useDocumentTitle("FAQ — Story Forge");

	const categories: FaqCategory[] = [
		{
			items: [
				{
					answer:
						"Download Story Forge from the home page, open the installer and follow the on-screen instructions. Windows, macOS and Linux are supported.",
					id: "faq-general-1",
					question: "How do I install the app?",
				},
				{
					answer: (
						<p>
							Yes — guides live under the{" "}
							<Link
								className="text-accent-primary underline-offset-2 hover:underline"
								to="/guide"
							>
								Guides
							</Link>{" "}
							section. The migration guide is a good place to start.
						</p>
					),
					id: "faq-general-2",
					question: "Is there any user documentation?",
				},
				{
					answer:
						"Yes. Story Forge is GPLv3-licensed, and the source lives on GitHub. Contributions, issues and feature requests are all welcome.",
					id: "faq-general-3",
					question: "Is Story Forge open source?",
				},
			],
			title: "General",
		},
		{
			items: [
				{
					answer:
						"Click “More info” in the SmartScreen dialog, then “Run anyway”. You can also add an exception in Windows Defender settings.",
					id: "faq-windows-1",
					question:
						"My 'Windows Defender SmartScreen' is blocking the app. What should I do?",
				},
			],
			title: "Windows",
		},
		{
			items: [
				{
					answer:
						'When launching the installer on Mac you may see "Unable to verify Story Forge since it was downloaded from the internet". The app is not notarized because it is community-funded — open System Settings → Privacy & Security, scroll down and click "Open Anyway" on Story Forge.',
					id: "faq-mac-1",
					question: "How do I use the installer on Mac?",
				},
				{
					answer:
						"This is a security feature in macOS for software from unidentified developers. Right-click the app, choose “Open”, then confirm — you only need to do this once.",
					id: "faq-mac-2",
					question: "Why does the app say it's from an unidentified developer?",
				},
			],
			title: "macOS",
		},
		{
			items: [
				{
					answer:
						"You need a Story Forge account to publish modpacks, but anyone can browse and install packs. Sign in from the top-right of this site to link your account.",
					id: "faq-modpacks-1",
					question: "Do I need an account to use modpacks?",
				},
				{
					answer:
						"A modpack is a curated set of mods plus their configs. Open the Modpacks page in the app, pick a version and Story Forge downloads and wires everything up for you.",
					id: "faq-modpacks-2",
					question: "How do I install a modpack?",
				},
			],
			title: "Modpacks & Account",
		},
	];

	return (
		<main className="mx-auto w-full max-w-4xl flex-1 px-4 py-12 sm:px-6">
			<Reveal>
				<div className="flex items-center gap-2 text-[10px] font-medium tracking-widest text-accent-amber uppercase">
					<HelpCircle className="size-3" /> Support
				</div>
				<h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
					Frequently asked questions
				</h1>
				<p className="mt-3 text-sm/relaxed text-muted-foreground">
					Install troubles, macOS warnings and everything in between.
				</p>
			</Reveal>

			<div className="mt-10 grid gap-10">
				{categories.map((category) => (
					<Reveal key={category.title}>
						<h2 className="border-b border-border pb-2 text-[10px] font-medium tracking-widest text-muted-foreground uppercase">
							{category.title}
						</h2>
						<Accordion multiple={false}>
							{category.items.map((item) => (
								<FAQItem item={item} key={item.id} />
							))}
						</Accordion>
					</Reveal>
				))}
			</div>

			<Reveal className="mt-12 flex items-center justify-between gap-4 border border-border bg-surface/50 p-5">
				<p className="text-xs text-muted-foreground">
					Still stuck? Ask the community — we’re friendly.
				</p>
				<a
					className="text-[11px] font-medium text-accent-primary transition-colors hover:text-accent-amber"
					href="https://discord.gg/gByx63peUC"
					rel="noopener noreferrer"
					target="_blank"
				>
					Join the Discord →
				</a>
			</Reveal>
		</main>
	);
}
