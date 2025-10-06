import { useId } from "react";
import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQItem = ({
	item,
}: {
	item: { question: React.ReactNode; answer: React.ReactNode };
}) => {
	const id = useId();
	return (
		<AccordionItem key={id} value={`item-${id}`}>
			<AccordionTrigger className="font-semibold hover:no-underline">
				{item.question}
			</AccordionTrigger>
			<AccordionContent className="text-muted-foreground">
				{item.answer}
			</AccordionContent>
		</AccordionItem>
	);
};
