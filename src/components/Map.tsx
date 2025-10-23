import { Loader2Icon, MapIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import initSqlJs, { type Database } from "sql.js";
import { Card } from "@/components/ui/card";
import {
	imageDataToCanvas,
	imageDataToDataUrl,
	pixelsToImageData,
} from "@/hooks/use-world-map";
import { decodeMapPieceDb } from "@/lib/schema";
import { Button } from "./ui/button";

const COORD_BITS = 27;
const COORD_MASK = (1 << COORD_BITS) - 1; // (1 << 27) - 1 = 134217727

function decodePosition(position: number): [number, number] {
	const x = Math.floor(position / (1 << COORD_BITS)); // position >> 27
	const y = position & COORD_MASK;
	return [x, y];
}

export function WorldMapViewer() {
	const baseCanvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	// Database state
	const [db, setDb] = useState<Database | null>(null);
	const [tiles, setTiles] = useState<
		Array<{ x: number; y: number; width: number; image_data: Uint8Array }>
	>([]);
	const [bounds, setBounds] = useState<{
		min_x: number;
		max_x: number;
		min_y: number;
		max_y: number;
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	// Load database from file
	const handleFileUpload = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			setIsLoading(true);
			setError(null);

			try {
				const arrayBuffer = await file.arrayBuffer();
				const uint8Array = new Uint8Array(arrayBuffer);

				const SQL = await initSqlJs({
					locateFile: () => "https://sql.js.org/dist/sql-wasm.wasm",
				});
				const database = new SQL.Database(uint8Array);
				setDb(database);

				// Find the main table
				const tablesResult = database.exec(
					"SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' LIMIT 1",
				);
				if (tablesResult.length === 0) {
					throw new Error("No map table found in database");
				}
				const tableName = tablesResult[0].values[0][0];

				// Get all tiles
				const tilesResult = database.exec(
					`SELECT position, data FROM ${tableName}`,
				);

				if (tilesResult.length === 0) {
					throw new Error("No map data found in table");
				}

				let minX = Number.MAX_SAFE_INTEGER;
				let maxX = Number.MIN_SAFE_INTEGER;
				let minY = Number.MAX_SAFE_INTEGER;
				let maxY = Number.MIN_SAFE_INTEGER;

				const tileData: Array<{
					x: number;
					y: number;
					width: number;
					image_data: Uint8Array;
				}> = [];

				for (const row of tilesResult[0].values) {
					const position = Number(row[0]);
					const imageBlob = row[1] as Uint8Array;

					const [x, y] = decodePosition(position);

					minX = Math.min(minX, x);
					maxX = Math.max(maxX, x);
					minY = Math.min(minY, y);
					maxY = Math.max(maxY, y);

					// Decode protobuf to pixels
					const mapPiece = decodeMapPieceDb(imageBlob);
					const pixels = mapPiece.pixels;
					if (!pixels || pixels.length === 0) {
						console.warn(`Failed to decode protobuf for tile ${x},${y}`);
						continue;
					}

					// Calculate size from pixel count
					const pixelCount = pixels.length;
					const size = Math.sqrt(pixelCount);

					if (size * size !== pixelCount) {
						console.warn(
							`Tile ${x},${y}: pixel count ${pixelCount} is not a perfect square (${size}x${size})`,
						);
					}

					// Convert pixels to ImageData
					const int32Array = new Int32Array(pixels);
					const imageData = pixelsToImageData(int32Array, size, size);

					// Convert ImageData to PNG data URL
					const canvas = imageDataToCanvas(imageData);
					const pngDataUrl = canvas.toDataURL("image/png");

					// Store as base64 PNG for use in canvas rendering
					const base64 = pngDataUrl.split(",")[1];
					const binaryString = atob(base64);
					const bytes = new Uint8Array(binaryString.length);
					for (let i = 0; i < binaryString.length; i++) {
						bytes[i] = binaryString.charCodeAt(i);
					}

					tileData.push({
						image_data: bytes,
						width: size,
						x,
						y,
					});
				}

				setBounds({
					max_x: maxX,
					max_y: maxY,
					min_x: minX,
					min_y: minY,
				});

				setTiles(tileData);
			} catch (err) {
				console.error("Database error:", err);
				setError(
					err instanceof Error ? err : new Error("Failed to load database"),
				);
			} finally {
				setIsLoading(false);
			}
		},
		[],
	);

	// Viewport state
	const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 0.5 });
	const viewportRef = useRef(viewport);

	const minXRef = useRef<number | null>(null);
	const minYRef = useRef<number | null>(null);
	const tileSizeRef = useRef<number | null>(null);

	const lodCacheRef = useRef<
		Map<number, { groupSize: number; tiles: Map<string, HTMLCanvasElement> }>
	>(new Map());

	const rafPendingRef = useRef(false);

	const [isPanning, setIsPanning] = useState(false);
	const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

	const [cursorCoords, setCursorCoords] = useState<{
		x: number;
		y: number;
		z?: number;
		screenX: number;
		screenY: number;
	} | null>(null);

	const [imageCache, setImageCache] = useState<Map<string, HTMLImageElement>>(
		new Map(),
	);

	const [containerSize, setContainerSize] = useState({ height: 0, width: 0 });

	const SPAWN_COORDINATE = 512000;
	const MAP_CHUNK_SIZE = 32;
	const spawnOffsetX = bounds
		? Math.round((bounds.min_y * MAP_CHUNK_SIZE) / SPAWN_COORDINATE) *
			SPAWN_COORDINATE
		: 0;
	const spawnOffsetY = bounds
		? Math.round((bounds.min_x * MAP_CHUNK_SIZE) / SPAWN_COORDINATE) *
			SPAWN_COORDINATE
		: 0;

	// Observe container resize
	useEffect(() => {
		if (!containerRef.current) return;

		const resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const { width, height } = entry.contentRect;
				setContainerSize({ height, width });
			}
		});

		resizeObserver.observe(containerRef.current);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	// Initialize viewport when bounds and tiles are loaded
	useEffect(() => {
		if (bounds && containerRef.current && tiles && tiles.length > 0) {
			const containerWidth = containerRef.current.clientWidth;
			const containerHeight = containerRef.current.clientHeight;

			// Container not ready yet
			if (containerWidth <= 0 || containerHeight <= 0) {
				console.warn("Container not ready, retrying...");
				// Retry after a frame
				const timeout = requestAnimationFrame(() => {
					// Trigger effect again by updating state or re-checking
				});
				return () => cancelAnimationFrame(timeout);
			}

			const normalizedWidth = bounds.max_y - bounds.min_y + 1;
			const normalizedHeight = bounds.max_x - bounds.min_x + 1;
			const tileSize = tiles[0]?.width || 512;
			const mapPixelWidth = normalizedWidth * tileSize;
			const mapPixelHeight = normalizedHeight * tileSize;
			const zoomX = containerWidth / mapPixelWidth;
			const zoomY = containerHeight / mapPixelHeight;
			const fitZoom = Math.min(zoomX, zoomY) * 0.9;

			const newViewport = {
				x: normalizedWidth / 2 - containerWidth / (2 * tileSize * fitZoom),
				y: normalizedHeight / 2 - containerHeight / (2 * tileSize * fitZoom),
				zoom: fitZoom,
			};
			viewportRef.current = newViewport;
			setViewport(newViewport);
		}
	}, [bounds, tiles]);

	// Load and cache images when tiles change
	useEffect(() => {
		if (!tiles) return;
		for (const tile of tiles) {
			const key = `${tile.x},${tile.y}`;
			if (!imageCache.has(key)) {
				const img = new Image();
				img.src = imageDataToDataUrl(tile.image_data);
				img.onload = () => {
					setImageCache((prev) => new Map(prev).set(key, img));
				};
			}
		}
	}, [tiles, imageCache]);

	// Cache minX/minY/tileSize
	useEffect(() => {
		if (!tiles || tiles.length === 0) return;
		const tileSize = tiles[0]?.width || 512;
		const xs = tiles.map((t) => t.x);
		const ys = tiles.map((t) => t.y);
		minXRef.current = Math.min(...xs);
		minYRef.current = Math.min(...ys);
		tileSizeRef.current = tileSize;
	}, [tiles]);

	// Build LOD levels
	useEffect(() => {
		if (!tiles || tiles.length === 0) return;
		if (
			!tileSizeRef.current ||
			minXRef.current === null ||
			minYRef.current === null
		)
			return;
		if (imageCache.size !== tiles.length) return;

		const existingLevels = lodCacheRef.current;
		const levels = [
			{ groupSize: 2, level: 1 },
			{ groupSize: 4, level: 2 },
			{ groupSize: 8, level: 3 },
		];
		const baseTileSize = tileSizeRef.current;

		for (const { level, groupSize } of levels) {
			if (existingLevels.has(level)) continue;
			const compositeMap = new Map<string, HTMLCanvasElement>();

			for (const tile of tiles) {
				const groupX = Math.floor(tile.x / groupSize) * groupSize;
				const groupY = Math.floor(tile.y / groupSize) * groupSize;
				const key = `${groupX},${groupY}`;

				if (!compositeMap.has(key)) {
					const tempCanvas = document.createElement("canvas");
					tempCanvas.width = baseTileSize * groupSize;
					tempCanvas.height = baseTileSize * groupSize;
					const tCtx = tempCanvas.getContext("2d");
					if (!tCtx) continue;

					for (let dx = 0; dx < groupSize; dx++) {
						for (let dy = 0; dy < groupSize; dy++) {
							const sx = groupX + dx;
							const sy = groupY + dy;
							const img = imageCache.get(`${sx},${sy}`);
							if (!img) continue;
							tCtx.drawImage(
								img,
								dy * baseTileSize,
								dx * baseTileSize,
								baseTileSize,
								baseTileSize,
							);
						}
					}

					const finalCanvas = document.createElement("canvas");
					finalCanvas.width = baseTileSize;
					finalCanvas.height = baseTileSize;
					const fCtx = finalCanvas.getContext("2d");
					if (fCtx) {
						fCtx.imageSmoothingEnabled = true;
						fCtx.drawImage(
							tempCanvas,
							0,
							0,
							finalCanvas.width,
							finalCanvas.height,
						);
						compositeMap.set(key, finalCanvas);
					}
				}
			}

			existingLevels.set(level, { groupSize, tiles: compositeMap });
		}
	}, [tiles, imageCache]);

	const chooseLodLevel = useCallback((zoom: number) => {
		if (zoom >= 1) return 0;
		if (zoom >= 0.5) return 1;
		if (zoom >= 0.25) return 2;
		return 3;
	}, []);

	const drawBase = useCallback(() => {
		if (!baseCanvasRef.current || !tiles || tiles.length === 0) return;
		if (
			minXRef.current === null ||
			minYRef.current === null ||
			!tileSizeRef.current
		)
			return;
		const canvas = baseCanvasRef.current;
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.fillStyle = "#1a1a1a";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
		const minX = minXRef.current;
		const minY = minYRef.current;
		const tileSize = tileSizeRef.current;
		const level = chooseLodLevel(viewportRef.current.zoom);

		if (level === 0) {
			for (const tile of tiles) {
				const img = imageCache.get(`${tile.x},${tile.y}`);
				if (!img || !img.complete) continue;
				const normalizedX = tile.x - minX;
				const normalizedY = tile.y - minY;
				const screenX =
					(normalizedY * tileSize - viewportRef.current.x * tileSize) *
					viewportRef.current.zoom;
				const screenY =
					(normalizedX * tileSize - viewportRef.current.y * tileSize) *
					viewportRef.current.zoom;
				const screenSize = tileSize * viewportRef.current.zoom;
				if (
					screenX + screenSize > 0 &&
					screenX < canvas.width &&
					screenY + screenSize > 0 &&
					screenY < canvas.height &&
					screenSize >= 2
				) {
					ctx.drawImage(img, screenX, screenY, screenSize, screenSize);
				}
			}
		} else {
			const lod = lodCacheRef.current.get(level);
			if (lod) {
				for (const [key, compCanvas] of lod.tiles) {
					const [gxStr, gyStr] = key.split(",");
					const gx = parseInt(gxStr, 10);
					const gy = parseInt(gyStr, 10);
					const normalizedX = gx - minX;
					const normalizedY = gy - minY;
					const screenX =
						(normalizedY * tileSize - viewportRef.current.x * tileSize) *
						viewportRef.current.zoom;
					const screenY =
						(normalizedX * tileSize - viewportRef.current.y * tileSize) *
						viewportRef.current.zoom;
					const screenSize =
						tileSize * viewportRef.current.zoom * lod.groupSize;
					if (
						screenX + screenSize > 0 &&
						screenX < canvas.width &&
						screenY + screenSize > 0 &&
						screenY < canvas.height
					) {
						ctx.drawImage(compCanvas, screenX, screenY, screenSize, screenSize);
					}
				}
			}
		}

		if (bounds) {
			ctx.fillStyle = "rgba(255,255,255,0.8)";
			ctx.font = "12px monospace";
			ctx.fillText(
				`LOD: ${level} | Zoom: ${viewportRef.current.zoom.toFixed(2)} | Tiles: ${tiles.length}`,
				10,
				20,
			);
		}
	}, [tiles, imageCache, bounds, chooseLodLevel]);

	const drawOverlay = useCallback(() => {
		if (!overlayCanvasRef.current || !tiles || tiles.length === 0) return;
		if (
			minXRef.current === null ||
			minYRef.current === null ||
			!tileSizeRef.current
		)
			return;
		const canvas = overlayCanvasRef.current;
		if (!containerRef.current) return;
		const rect = containerRef.current.getBoundingClientRect();
		canvas.width = rect.width;
		canvas.height = rect.height;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}, [tiles]);

	const scheduleRedraw = useCallback(() => {
		if (rafPendingRef.current) return;
		rafPendingRef.current = true;
		requestAnimationFrame(() => {
			rafPendingRef.current = false;
			drawBase();
			drawOverlay();
		});
	}, [drawBase, drawOverlay]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Needed
	useEffect(() => {
		scheduleRedraw();
	}, [viewport, tiles, containerSize, scheduleRedraw]);

	const handleWheel = useCallback(
		(e: React.WheelEvent) => {
			e.preventDefault();
			const canvas = overlayCanvasRef.current;
			if (!canvas || !tiles || tiles.length === 0) return;
			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;
			const tileSize = tiles[0]?.width || 512;
			setViewport((prev) => {
				const delta = e.deltaY > 0 ? 0.9 : 1.1;
				const newZoom = Math.max(0.1, Math.min(5, prev.zoom * delta));
				const worldMouseX = mouseX / (prev.zoom * tileSize) + prev.x;
				const worldMouseY = mouseY / (prev.zoom * tileSize) + prev.y;
				const newX = worldMouseX - mouseX / (newZoom * tileSize);
				const newY = worldMouseY - mouseY / (newZoom * tileSize);
				const vp = { x: newX, y: newY, zoom: newZoom };
				viewportRef.current = vp;
				scheduleRedraw();
				return vp;
			});
		},
		[tiles, scheduleRedraw],
	);

	const handleMouseDown = useCallback((e: React.MouseEvent) => {
		if (e.button === 0) {
			setIsPanning(true);
			setLastMousePos({ x: e.clientX, y: e.clientY });
		}
	}, []);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			if (!overlayCanvasRef.current || !tiles || tiles.length === 0 || !bounds)
				return;
			const canvas = overlayCanvasRef.current;
			const rect = canvas.getBoundingClientRect();
			const mouseX = e.clientX - rect.left;
			const mouseY = e.clientY - rect.top;

			const tileSize = tiles[0]?.width || 512;
			const minX = minXRef.current ?? Math.min(...tiles.map((t) => t.x));
			const minY = minYRef.current ?? Math.min(...tiles.map((t) => t.y));
			const worldX =
				mouseX / (viewportRef.current.zoom * tileSize) + viewportRef.current.x;
			const worldY =
				mouseY / (viewportRef.current.zoom * tileSize) + viewportRef.current.y;
			const absoluteX = Math.round((worldX + minY) * MAP_CHUNK_SIZE);
			const absoluteY = Math.round((worldY + minX) * MAP_CHUNK_SIZE);
			const vsX = absoluteX - spawnOffsetX;
			const vsY = absoluteY - spawnOffsetY;

			setCursorCoords({
				screenX: e.clientX,
				screenY: e.clientY,
				x: vsX,
				y: vsY,
			});

			if (isPanning) {
				const dx = e.clientX - lastMousePos.x;
				const dy = e.clientY - lastMousePos.y;
				const prev = viewportRef.current;
				const updated = {
					...prev,
					x: prev.x - dx / (tileSize * prev.zoom),
					y: prev.y - dy / (tileSize * prev.zoom),
				};
				viewportRef.current = updated;
				if (!rafPendingRef.current) {
					rafPendingRef.current = true;
					requestAnimationFrame(() => {
						rafPendingRef.current = false;
						setViewport(viewportRef.current);
						drawBase();
						drawOverlay();
					});
				}
				setLastMousePos({ x: e.clientX, y: e.clientY });
			}
		},
		[
			isPanning,
			lastMousePos,
			tiles,
			bounds,
			spawnOffsetX,
			spawnOffsetY,
			drawBase,
			drawOverlay,
		],
	);

	const handleMouseUp = useCallback(() => {
		setIsPanning(false);
	}, []);

	const handleMouseLeave = useCallback(() => {
		setIsPanning(false);
		setCursorCoords(null);
	}, []);

	// UI with file upload
	if (!db) {
		return (
			<Card className="flex items-center justify-center h-full min-h-[400px]">
				<div className="flex flex-col items-center gap-4 p-8">
					<MapIcon className="h-12 w-12 text-muted-foreground" />
					<div className="flex flex-col items-center gap-2">
						<h3 className="font-semibold mb-2">Upload Map Database</h3>
						<input
							accept=".db"
							className="border rounded px-3 py-2"
							disabled={isLoading}
							onChange={handleFileUpload}
							type="file"
						/>
					</div>
					{isLoading && (
						<div className="flex items-center gap-2">
							<Loader2Icon className="animate-spin h-4 w-4" />
							<p className="text-sm text-muted-foreground">
								Loading database...
							</p>
						</div>
					)}
					{error && (
						<p className="text-sm text-destructive">Error: {error.message}</p>
					)}
				</div>
			</Card>
		);
	}

	if (isLoading) {
		return (
			<Card className="flex items-center justify-center h-full min-h-[400px]">
				<div className="flex flex-col items-center gap-2">
					<Loader2Icon className="animate-spin h-8 w-8 text-muted-foreground" />
					<p className="text-sm text-muted-foreground">Loading map...</p>
				</div>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="flex items-center justify-center h-full min-h-[400px]">
				<div className="flex flex-col items-center gap-2 text-center p-4">
					<MapIcon className="h-12 w-12 text-muted-foreground opacity-50" />
					<p className="text-sm text-muted-foreground">
						Error: {error.message}
					</p>
					<Button
						onClick={() => {
							setDb(null);
							setTiles([]);
							setBounds(null);
							setError(null);
						}}
					>
						Upload Another Map
					</Button>
				</div>
			</Card>
		);
	}

	if (!tiles || tiles.length === 0) {
		return (
			<Card className="flex items-center justify-center h-full min-h-[400px]">
				<div className="flex flex-col items-center gap-2 text-center p-4">
					<MapIcon className="h-12 w-12 text-muted-foreground opacity-50" />
					<p className="text-sm text-muted-foreground">
						No map tiles found in database.
					</p>
					<Button
						onClick={() => {
							setDb(null);
							setTiles([]);
							setBounds(null);
							setError(null);
						}}
					>
						Upload Another Map
					</Button>
				</div>
			</Card>
		);
	}

	return (
		<Card className="relative h-full min-h-[400px] overflow-hidden">
			<div
				className="w-full h-full min-h-[400px]"
				ref={containerRef}
				style={{ cursor: isPanning ? "grabbing" : "grab" }}
			>
				<canvas
					className="absolute inset-0 w-full h-full pointer-events-none"
					ref={baseCanvasRef}
				/>
				<canvas
					className="absolute inset-0 w-full h-full"
					onMouseDown={handleMouseDown}
					onMouseLeave={handleMouseLeave}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onWheel={handleWheel}
					ref={overlayCanvasRef}
				/>
				{cursorCoords && overlayCanvasRef.current && (
					<div
						className="absolute pointer-events-none bg-background/95 backdrop-blur-sm border rounded px-2 py-1 text-xs font-mono shadow-lg"
						style={{
							left: (() => {
								const canvasRect =
									overlayCanvasRef.current?.getBoundingClientRect();
								if (!canvasRect) return 0;
								const rawLeft = cursorCoords.screenX - canvasRect.left + 12;
								return `${Math.min(rawLeft, canvasRect.width - 160)}px`;
							})(),
							top: (() => {
								const canvasRect =
									overlayCanvasRef.current?.getBoundingClientRect();
								if (!canvasRect) return 0;
								const rawTop = cursorCoords.screenY - canvasRect.top - 12;
								return `${Math.min(Math.max(rawTop, 4), canvasRect.height - 4)}px`;
							})(),
						}}
					>
						{cursorCoords.z !== undefined
							? `${cursorCoords.x}, ${cursorCoords.y}, ${cursorCoords.z}`
							: `${cursorCoords.x}, ${cursorCoords.y}`}
					</div>
				)}
			</div>
			<Button
				className="absolute top-1 right-1 z-10"
				onClick={() => {
					setDb(null);
					setTiles([]);
					setBounds(null);
					setError(null);
				}}
				variant="secondary"
			>
				Upload Another Map
			</Button>
			<div className="absolute pointer-events-none bottom-1 right-1 bg-background/90 backdrop-blur-sm border rounded-md px-3 py-2 text-xs text-muted-foreground">
				<p>🖱️ Drag to pan • 🔍 Scroll to zoom</p>
			</div>
		</Card>
	);
}
