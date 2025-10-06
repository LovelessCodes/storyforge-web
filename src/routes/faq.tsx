import { createFileRoute, Link } from "@tanstack/react-router";
import { FAQItem } from "@/components/items/faq.item";
import { Accordion } from "@/components/ui/accordion";

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

interface FaqProps {
	heading?: string;
	categories?: FaqCategory[];
}

function Faq({
	heading = "Frequently asked questions",
	categories = [
		{
			items: [
				{
					answer:
						"You can download the app from our official website. Once downloaded, open the installer and follow the on-screen instructions.",
					id: "faq-general-1",
					question: "How do I install the app?",
				},
				{
					answer: (
						<p>
							Yes, you can find the user guides on our website under the{" "}
							<Link
								className="text-blue-500 underline hover:text-blue-700"
								to="/guide"
							>
								"Guides"
							</Link>{" "}
							section.
						</p>
					),
					id: "faq-general-2",
					question: "Is there any user guides available?",
				},
			],
			title: "General",
		},
		{
			items: [
				{
					answer:
						"You can add an exception in Windows Defender SmartScreen settings to allow the app to run.",
					id: "faq-windows-1",
					question:
						"My 'Windows Defender SmartScreen' is blocking the app. What should I do?",
				},
			],
			title: "Windows Specific",
		},
		{
			items: [
				{
					answer:
						'When launching the installer on Mac, you\'re likely to get the message "Unable to verify Story Forge since it was downloaded from the internet", this is because I don\'t have an Apple Developer account to sign the application - to get it to launch, go into System Settings and go to Privacy & Security, at the bottom you must click "Open anyway" on Story Forge.',
					id: "faq-mac-1",
					question: "How do I use the installer on Mac?",
				},
				{
					answer:
						"This is a security feature in macOS to protect users from potentially harmful software. You can bypass this by right-clicking the app and selecting 'Open', then confirming you want to open it.",
					id: "faq-mac-2",
					question: "Why does the app say it's from an unidentified developer?",
				},
			],
			title: "Mac Specific",
		},
	],
}: FaqProps) {
	return (
		<section className="py-32 px-8 md:px-0 flex justify-center items-center">
			<div className="container max-w-3xl text-white">
				<h1 className="mb-4 text-3xl font-semibold md:mb-11 md:text-4xl">
					{heading}
				</h1>
				{categories.map((category) => (
					<div
						className="w-full border-t px-4 md:px-0 pt-6 mb-10 grid md:grid-cols-2 grid-cols-1"
						key={category.title}
					>
						<h3 className="mb-4 text-xl font-semibold md:mb-11 md:text-2xl">
							{category.title}
						</h3>
						<Accordion collapsible type="single">
							{category.items.map((item) => (
								<FAQItem item={item} key={item.id} />
							))}
						</Accordion>
					</div>
				))}
			</div>
		</section>
	);
}
