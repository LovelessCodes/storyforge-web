/** Lowercase + strip punctuation/extra whitespace — fuzzy-ish search normalization. */
export const stripped = (str: string) =>
	str
		.toLowerCase()
		.replace(/[^\w\s]/g, "")
		.replace(/\s+/g, " ")
		.trim();
