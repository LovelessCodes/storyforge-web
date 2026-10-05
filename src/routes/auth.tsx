import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
	Check,
	Globe,
	Loader2,
	LogOut,
	Mail,
	ShieldCheck,
	User,
} from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { DiscordIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthSession } from "@/hooks/use-auth-session";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { authClient } from "@/lib/auth";
import { api } from "@/lib/modpacks";

type Mode = "signin" | "signup";
type FieldName = "email" | "name" | "password";
type FieldErrors = Partial<Record<FieldName, string>>;

interface AuthSearch {
	mode?: Mode;
	redirect?: string;
}

export const Route = createFileRoute("/auth")({
	component: AuthPage,
	validateSearch: (search: Record<string, unknown>): AuthSearch => ({
		mode: search.mode === "signup" ? "signup" : undefined,
		redirect:
			typeof search.redirect === "string" &&
			search.redirect.startsWith("/") &&
			!search.redirect.startsWith("//")
				? search.redirect
				: undefined,
	}),
});

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const providerIcons: Record<string, React.ReactNode> = {
	discord: <DiscordIcon className="size-3.5" />,
};

function validate(mode: Mode, values: Record<FieldName, string>): FieldErrors {
	const errors: FieldErrors = {};
	if (mode === "signup" && !values.name.trim()) {
		errors.name = "Please enter your name.";
	}
	if (!EMAIL_PATTERN.test(values.email)) {
		errors.email = "Please enter a valid email address.";
	}
	if (values.password.length < 8) {
		errors.password = "Passwords must be at least 8 characters.";
	}
	return errors;
}

function AccountCard() {
	const { user, signOut } = useAuthSession();
	const navigate = useNavigate();

	if (!user) return null;

	return (
		<div className="grid gap-5">
			<div className="flex items-center gap-3">
				{user.image ? (
					<img
						alt={user.name}
						className="size-12 border border-border object-cover"
						referrerPolicy="no-referrer"
						src={user.image}
					/>
				) : (
					<span className="grid size-12 place-items-center border border-border bg-secondary text-sm font-bold">
						{user.name?.charAt(0)?.toUpperCase() ?? "?"}
					</span>
				)}
				<div className="grid gap-0.5">
					<span className="text-sm font-medium">{user.name}</span>
					<span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<Mail className="size-3" /> {user.email}
					</span>
				</div>
			</div>

			<Separator />

			<div className="grid gap-2 text-[11px] text-muted-foreground">
				<span className="flex items-center gap-2">
					<ShieldCheck className="size-3.5 text-success" /> Signed in to your
					Story Forge account
				</span>
				<span className="flex items-center gap-2">
					<Check className="size-3.5 text-success" /> Modpacks you own are
					marked in the browser
				</span>
			</div>

			<div className="flex gap-2">
				<Button render={<Link to="/modpacks" />} variant="accent">
					Browse modpacks
				</Button>
				<Button
					onClick={() => {
						void signOut().then(() => navigate({ to: "/" }));
					}}
					variant="outline"
				>
					<LogOut /> Sign out
				</Button>
			</div>
		</div>
	);
}

function AuthPage() {
	const search = Route.useSearch();
	const redirect = search.redirect;
	const mode = search.mode ?? "signin";
	const navigate = useNavigate();
	const reduceMotion = useReducedMotion();
	const { user, isLoading } = useAuthSession();

	const [values, setValues] = useState<Record<FieldName, string>>({
		email: "",
		name: "",
		password: "",
	});
	const [errors, setErrors] = useState<FieldErrors>({});
	const [formError, setFormError] = useState<string | null>(null);
	const [submitting, setSubmitting] = useState(false);

	useDocumentTitle(
		user ? "Your account — Story Forge" : "Sign in — Story Forge",
	);

	const { data: providers } = useQuery({
		enabled: !user,
		queryFn: api.getSocialProviders,
		queryKey: ["social-providers"],
		staleTime: Number.POSITIVE_INFINITY,
	});

	const isSignUp = mode === "signup";
	const target = redirect ?? "/modpacks";

	const setValue = (field: FieldName, value: string) => {
		setValues((prev) => ({ ...prev, [field]: value }));
		setErrors((prev) => ({ ...prev, [field]: undefined }));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		setFormError(null);
		const nextErrors = validate(mode, values);
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}
		setSubmitting(true);
		try {
			const result = isSignUp
				? await authClient.signUp.email({
						email: values.email,
						name: values.name,
						password: values.password,
					})
				: await authClient.signIn.email({
						email: values.email,
						password: values.password,
					});

			if (result.error) {
				setFormError(
					result.error.message ??
						(isSignUp
							? "Could not create your account."
							: "Could not sign you in."),
				);
			} else {
				void navigate({ to: target });
			}
		} catch (error) {
			setFormError(
				error instanceof Error
					? error.message
					: "Something went wrong. Try again.",
			);
		} finally {
			setSubmitting(false);
		}
	};

	const toggleMode = () => {
		setFormError(null);
		setErrors({});
		void navigate({
			replace: true,
			search: { mode: isSignUp ? undefined : "signup", redirect },
			to: "/auth",
		});
	};

	const socialProviders = (providers ?? []).filter((provider) =>
		[
			"github",
			"discord",
			"google",
			"apple",
			"gitlab",
			"reddit",
			"microsoft",
			"twitch",
			"twitter",
		].includes(provider),
	);

	return (
		<main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16">
			<div className="pointer-events-none absolute inset-0">
				<div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)]" />
				<div className="absolute top-1/4 left-1/2 h-[380px] w-[560px] -translate-x-1/2 bg-accent-primary/12 blur-[130px]" />
			</div>

			<motion.div
				animate={{ opacity: 1, y: 0 }}
				className="relative w-full max-w-md border border-border bg-card shadow-2xl shadow-black/40"
				initial={reduceMotion ? false : { opacity: 0, y: 16 }}
				transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
			>
				<div className="border-b border-border p-6 pb-5">
					<div className="flex items-center gap-2.5">
						<img
							alt="Story Forge"
							className="size-8 object-contain"
							src="/StoryForge.png"
						/>
						<span className="grid leading-tight">
							<span className="text-xs font-bold tracking-wide">
								STORY FORGE
							</span>
							<span className="text-[9px] font-medium tracking-widest text-accent-amber uppercase">
								Account
							</span>
						</span>
					</div>
					<h1 className="mt-5 text-lg font-bold tracking-tight">
						{user
							? "Your account"
							: isSignUp
								? "Create your account"
								: "Welcome back"}
					</h1>
					<p className="mt-1 text-[11px] text-muted-foreground">
						{user
							? "You are signed in to Story Forge."
							: isSignUp
								? "One account for the launcher, modpacks and more."
								: "Sign in with your Story Forge account."}
					</p>
				</div>

				<div className="p-6">
					{isLoading ? (
						<div className="flex items-center gap-2 py-8 text-xs text-muted-foreground">
							<Loader2 className="size-4 animate-spin" /> Checking session…
						</div>
					) : user ? (
						<AccountCard />
					) : (
						<>
							{socialProviders.length > 0 && (
								<>
									<div className="grid gap-2">
										{socialProviders.map((provider) => (
											<Button
												key={provider}
												onClick={() => {
													void authClient.signIn.social({
														callbackURL: `${window.location.origin}/#${target}`,
														provider,
													});
												}}
												variant="outline"
											>
												{providerIcons[provider] ?? (
													<Globe className="size-3.5" />
												)}
												<span className="capitalize">
													Continue with {provider}
												</span>
											</Button>
										))}
									</div>
									<div className="my-4 flex items-center gap-3">
										<Separator className="flex-1" />
										<span className="text-[10px] tracking-widest text-muted-foreground uppercase">
											or
										</span>
										<Separator className="flex-1" />
									</div>
								</>
							)}

							<form
								className="grid gap-4"
								onSubmit={(event) => void handleSubmit(event)}
							>
								{isSignUp && (
									<div className="grid gap-1.5">
										<label className="text-[11px] font-medium" htmlFor="name">
											Name
										</label>
										<Input
											autoComplete="name"
											id="name"
											onChange={(event) => setValue("name", event.target.value)}
											placeholder="Your name"
											value={values.name}
										/>
										{errors.name && (
											<p className="text-[10px] text-destructive">
												{errors.name}
											</p>
										)}
									</div>
								)}

								<div className="grid gap-1.5">
									<label className="text-[11px] font-medium" htmlFor="email">
										Email
									</label>
									<Input
										autoComplete="email"
										id="email"
										onChange={(event) => setValue("email", event.target.value)}
										placeholder="you@example.com"
										type="email"
										value={values.email}
									/>
									{errors.email && (
										<p className="text-[10px] text-destructive">
											{errors.email}
										</p>
									)}
								</div>

								<div className="grid gap-1.5">
									<label className="text-[11px] font-medium" htmlFor="password">
										Password
									</label>
									<Input
										autoComplete={
											isSignUp ? "new-password" : "current-password"
										}
										id="password"
										onChange={(event) =>
											setValue("password", event.target.value)
										}
										placeholder={
											isSignUp ? "At least 8 characters" : "Your password"
										}
										type="password"
										value={values.password}
									/>
									{errors.password && (
										<p className="text-[10px] text-destructive">
											{errors.password}
										</p>
									)}
								</div>

								{formError && (
									<p className="border border-destructive/30 bg-destructive/10 px-3 py-2 text-[11px] text-destructive">
										{formError}
									</p>
								)}

								<Button
									className="w-full"
									disabled={submitting}
									size="lg"
									type="submit"
									variant="accent"
								>
									{submitting ? <Loader2 className="animate-spin" /> : <User />}
									{submitting
										? "Please wait…"
										: isSignUp
											? "Create account"
											: "Sign in"}
								</Button>
							</form>

							<Separator className="my-4" />

							<p className="text-center text-[11px] text-muted-foreground">
								{isSignUp ? "Already have an account?" : "New to Story Forge?"}{" "}
								<button
									className="text-accent-primary hover:underline"
									onClick={toggleMode}
									type="button"
								>
									{isSignUp ? "Sign in" : "Create one"}
								</button>
							</p>
						</>
					)}
				</div>
			</motion.div>
		</main>
	);
}
