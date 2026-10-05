import { ArrowUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { usePageScroll } from "@/components/layout/PageScroll";
import { Button } from "@/components/ui/button";

/** Floating back-to-top button; appears once the page scroller moves down. */
export function ScrollToTopButton() {
	const { t } = useTranslation();
	const { viewport } = usePageScroll();
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		if (!viewport) return;
		const onScroll = () => setVisible(viewport.scrollTop > 700);
		onScroll();
		viewport.addEventListener("scroll", onScroll, { passive: true });
		return () => viewport.removeEventListener("scroll", onScroll);
	}, [viewport]);

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="fixed right-4 bottom-4 z-40"
					exit={{ opacity: 0, y: 8 }}
					initial={{ opacity: 0, y: 8 }}
					transition={{ duration: 0.2 }}
				>
					<Button
						aria-label={t("common.backToTop")}
						className="border-border bg-card/90 shadow-lg backdrop-blur-sm"
						onClick={() => viewport?.scrollTo({ behavior: "smooth", top: 0 })}
						size="icon"
						variant="outline"
					>
						<ArrowUp />
					</Button>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
