import { Link, useLocation } from "@tanstack/react-router";
import { Github, LogIn } from "lucide-react";
import { motion } from "motion/react";

import { DiscordIcon } from "@/components/icons";
import { AccountMenu } from "@/components/layout/AccountMenu";
import { MobileMenu } from "@/components/layout/MobileMenu";
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

export function Header() {
	const pathname = useLocation({ select: (s) => s.pathname });
	const { user, isLoading } = useAuthSession();

	const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

	return (
		<header className="border-border bg-background shrink-0 border-b">
			<div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-6">
				{/* Brand */}
				<Link className="group flex shrink-0 items-center gap-2.5" to="/">
					<img
						alt="Story Forge"
						className="size-7 object-contain transition-transform duration-300 group-hover:scale-105"
						src="/StoryForge.svg"
					/>
					<span className="hidden leading-tight sm:grid">
						<span className="text-[13px] font-bold tracking-wide">STORY FORGE</span>
						<span className="text-accent-amber text-[9px] font-medium tracking-widest uppercase">
							Vintage Story Launcher
						</span>
					</span>
				</Link>

				{/* Desktop nav */}
				<nav className="ml-4 hidden items-center gap-0.5 md:flex">
					{navigationLinks.map((link) => {
						const active = isActive(link.to);
						return (
							<Link
								className={`relative px-2.5 py-1.5 text-xs font-medium transition-colors ${
									active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
								}`}
								key={link.to}
								to={link.to}
							>
								{link.label}
								{active && (
									<motion.span
										className="bg-accent-primary absolute inset-x-2 -bottom-[1px] h-px"
										layoutId="header-nav-active"
										transition={{ damping: 26, stiffness: 360, type: "spring" }}
									/>
								)}
							</Link>
						);
					})}
				</nav>

				<div className="ml-auto flex items-center gap-1.5">
					<ThemeToggle />
					<a
						aria-label="GitHub repository"
						className="text-muted-foreground hover:text-foreground transition-colors"
						href="https://github.com/lovelesscodes/storyforge"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Button aria-label="GitHub repository" size="icon-sm" variant="ghost">
							<Github />
						</Button>
					</a>
					<a
						aria-label="Join our Discord"
						className="text-muted-foreground hover:text-foreground hidden transition-colors sm:block"
						href="https://discord.gg/gByx63peUC"
						rel="noopener noreferrer"
						target="_blank"
					>
						<Button aria-label="Join our Discord" size="icon-sm" variant="ghost">
							<DiscordIcon className="size-3.5" />
						</Button>
					</a>

					{isLoading ? (
						<span className="border-border bg-muted hidden size-7 animate-pulse border sm:block" />
					) : user ? (
						<AccountMenu />
					) : (
						<Button
							className="hidden sm:inline-flex"
							render={<Link to="/auth" />}
							size="sm"
							variant="accent"
						>
							<LogIn /> Sign in
						</Button>
					)}

					<MobileMenu />
				</div>
			</div>
		</header>
	);
}
