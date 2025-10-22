export type MapTile = {
	x: number;
	y: number;
	position: number;
	image_data: number[]; // Vec<u8> from Rust
	width: number;
	height: number;
};

export function pixelsToImageData(
	pixels: Int32Array,
	width: number,
	height: number,
): ImageData {
	// Ensure dimensions are valid integers
	width = Math.floor(width);
	height = Math.floor(height);

	if (width <= 0 || height <= 0) {
		throw new Error(`Invalid dimensions: ${width}x${height}`);
	}

	if (pixels.length !== width * height) {
		console.warn(
			`Pixel count mismatch: got ${pixels.length}, expected ${width * height}`,
		);
	}

	const imageData = new ImageData(width, height);
	const data = imageData.data;

	for (let i = 0; i < pixels.length && i < width * height; i++) {
		const pixel = pixels[i];

		// Decode ARGB from i32 (same as Rust)
		const a = (pixel >> 24) & 0xff;
		const r = (pixel >> 16) & 0xff;
		const g = (pixel >> 8) & 0xff;
		const b = pixel & 0xff;

		const dataIdx = i * 4;
		data[dataIdx] = r;
		data[dataIdx + 1] = g;
		data[dataIdx + 2] = b;
		data[dataIdx + 3] = a;
	}

	return imageData;
}

export function imageDataToCanvas(imageData: ImageData): HTMLCanvasElement {
	const canvas = document.createElement("canvas");
	canvas.width = imageData.width;
	canvas.height = imageData.height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Cannot get canvas context");
	ctx.putImageData(imageData, 0, 0);
	return canvas;
}

export function imageDataToDataUrl(data: ImageData | Uint8Array): string {
	// If it's already a Uint8Array of PNG bytes
	if (data instanceof Uint8Array) {
		// Check if it's PNG (magic bytes)
		if (
			data[0] === 0x89 &&
			data[1] === 0x50 &&
			data[2] === 0x4e &&
			data[3] === 0x47
		) {
			// Convert to base64
			let binary = "";
			for (let i = 0; i < data.length; i++) {
				binary += String.fromCharCode(data[i]);
			}
			const base64 = btoa(binary);
			return `data:image/png;base64,${base64}`;
		}
		throw new Error("Invalid PNG data");
	}

	// If it's ImageData
	if (
		data instanceof ImageData ||
		(data && "data" in data && "width" in data && "height" in data)
	) {
		const canvas = imageDataToCanvas(data as ImageData);
		return canvas.toDataURL("image/png");
	}

	throw new Error("Unknown data format");
}
