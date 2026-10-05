import { Link } from "@tanstack/react-router";
import { Github, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { DiscordIcon } from "@/components/icons";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";

const navigationLinks = [
	{ key: "nav.home", to: "/" },
	{ key: "nav.modpacks", to: "/modpacks" },
	{ key: "nav.mods", to: "/mods" },
	{ key: "nav.map", to: "/map" },
	{ key: "nav.guides", to: "/guide" },
	{ key: "nav.faq", to: "/faq" },
] as const;

export function MobileMenu() {
	const { t } = useTranslation();
	const [open, setOpen] = useState(false);
	const { user, signOut } = useAuthSession();

	// Lock page scroll while the overlay is open.
	useEffect(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	return (
		<div className="md:hidden">
			<Button
				aria-expanded={open}
				aria-label={t("account.toggleMenu")}
				size="icon-sm"
				variant="ghost"
				onClick={() => setOpen((value) => !value)}
			>
				<AnimatePresence initial={false} mode="wait">
					{open ? (
						<motion.span
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0, rotate: -90 }}
							initial={{ opacity: 0, rotate: 90 }}
							key="close"
							transition={{ duration: 0.18 }}
						>
							<X />
						</motion.span>
					) : (
						<motion.span
							animate={{ opacity: 1, rotate: 0 }}
							exit={{ opacity: 0, rotate: 90 }}
							initial={{ opacity: 0, rotate: -90 }}
							key="menu"
							transition={{ duration: 0.18 }}
						>
							<Menu />
						</motion.span>
					)}
				</AnimatePresence>
			</Button>

			<AnimatePresence>
				{open && (
					<motion.div
						animate={{ opacity: 1 }}
						className="bg-background fixed inset-0 top-14 z-50 flex flex-col"
						exit={{ opacity: 0 }}
						initial={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<nav className="flex flex-col px-4 py-4">
							{navigationLinks.map((link, index) => (
								<motion.div
									animate={{ opacity: 1, x: 0 }}
									initial={{ opacity: 0, x: 16 }}
									key={link.to}
									transition={{
										delay: 0.04 * index,
										duration: 0.3,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									<Link
										className="border-border/60 text-foreground flex items-center border-b py-4 text-lg font-semibold tracking-tight"
										onClick={() => setOpen(false)}
										to={link.to}
									>
										{t(link.key)}
									</Link>
								</motion.div>
							))}
						</nav>

						<div className="mt-auto grid gap-3 px-4 pb-8">
							{user ? (
								<>
									<div className="text-muted-foreground text-xs">
										{t("account.signedInAs")}{" "}
										<span className="text-foreground font-medium">{user.name}</span>
									</div>
									<Button
										variant="outline"
										onClick={() => {
											void signOut().then(() => setOpen(false));
										}}
									>
										<LogOut /> {t("account.signOut")}
									</Button>
								</>
							) : (
								<Button
									size="lg"
									variant="accent"
									render={<Link onClick={() => setOpen(false)} to="/auth" />}
								>
									<LogIn /> {t("account.signIn")}
								</Button>
							)}
							<div className="flex items-center gap-2">
								<a
									href="https://github.com/lovelesscodes/storyforge"
									rel="noopener noreferrer"
									target="_blank"
								>
									<Button size="sm" variant="outline">
										<Github /> GitHub
									</Button>
								</a>
								<a href="https://discord.gg/gByx63peUC" rel="noopener noreferrer" target="_blank">
									<Button size="sm" variant="outline">
										<DiscordIcon className="size-3.5" /> Discord
									</Button>
								</a>
								<LanguageSwitcher />
								<ThemeToggle />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
