import { useEffect } from "react";

/** Sets document.title while a page is mounted. */
export function useDocumentTitle(title: string | undefined) {
	useEffect(() => {
		if (!title) return;
		const previous = document.title;
		document.title = title;
		return () => {
			document.title = previous;
		};
	}, [title]);
}
