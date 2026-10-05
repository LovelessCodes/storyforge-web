import { Link } from "@tanstack/react-router";
import { Github, LogIn, LogOut, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import { DiscordIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuthSession } from "@/hooks/use-auth-session";

const navigationLinks = [
	{ label: "Home", to: "/" },
	{ label: "Modpacks", to: "/modpacks" },
	{ label: "Mods", to: "/mods" },
	{ label: "Map Viewer", to: "/map" },
	{ label: "Guides", to: "/guide" },
	{ label: "FAQ", to: "/faq" },
] as const;

export function MobileMenu() {
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
				aria-label="Toggle menu"
				onClick={() => setOpen((value) => !value)}
				size="icon-sm"
				variant="ghost"
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
						className="fixed inset-0 top-14 z-50 flex flex-col bg-background"
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
										className="flex items-center border-b border-border/60 py-4 text-lg font-semibold tracking-tight text-foreground"
										onClick={() => setOpen(false)}
										to={link.to}
									>
										{link.label}
									</Link>
								</motion.div>
							))}
						</nav>

						<div className="mt-auto grid gap-3 px-4 pb-8">
							{user ? (
								<>
									<div className="text-xs text-muted-foreground">
										Signed in as{" "}
										<span className="font-medium text-foreground">
											{user.name}
										</span>
									</div>
									<Button
										onClick={() => {
											void signOut().then(() => setOpen(false));
										}}
										variant="outline"
									>
										<LogOut /> Sign out
									</Button>
								</>
							) : (
								<Button
									render={<Link onClick={() => setOpen(false)} to="/auth" />}
									size="lg"
									variant="accent"
								>
									<LogIn /> Sign in to Story Forge
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
								<a
									href="https://discord.gg/gByx63peUC"
									rel="noopener noreferrer"
									target="_blank"
								>
									<Button size="sm" variant="outline">
										<DiscordIcon className="size-3.5" /> Discord
									</Button>
								</a>
								<ThemeToggle />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
