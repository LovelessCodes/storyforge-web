export interface MapPieceDb {
	pixels?: number[];
}

export function decodeMapPieceDb(binary: Uint8Array): MapPieceDb {
	return _decodeMapPieceDb(wrapByteBuffer(binary));
}

function _decodeMapPieceDb(bb: ByteBuffer): MapPieceDb {
	const message: MapPieceDb = {};

	end_of_message: while (!isAtEnd(bb)) {
		const tag = readVarint32(bb);

		switch (tag >>> 3) {
			case 0:
				break end_of_message;

			// repeated int32 pixels = 1;
			case 1: {
				// biome-ignore lint/suspicious/noAssignInExpressions: Generated from protobuf
				const values = message.pixels || (message.pixels = []);
				if ((tag & 7) === 2) {
					const outerLimit = pushTemporaryLength(bb);
					while (!isAtEnd(bb)) {
						values.push(readVarint32(bb));
					}
					bb.limit = outerLimit;
				} else {
					values.push(readVarint32(bb));
				}
				break;
			}

			default:
				skipUnknownField(bb, tag & 7);
		}
	}

	return message;
}

export interface Long {
	low: number;
	high: number;
	unsigned: boolean;
}

interface ByteBuffer {
	bytes: Uint8Array;
	offset: number;
	limit: number;
}

function pushTemporaryLength(bb: ByteBuffer): number {
	const length = readVarint32(bb);
	const limit = bb.limit;
	bb.limit = bb.offset + length;
	return limit;
}

function skipUnknownField(bb: ByteBuffer, type: number): void {
	switch (type) {
		case 0:
			while (readByte(bb) & 0x80) {}
			break;
		case 2:
			skip(bb, readVarint32(bb));
			break;
		case 5:
			skip(bb, 4);
			break;
		case 1:
			skip(bb, 8);
			break;
		default:
			throw new Error(`Unimplemented type: ${type}`);
	}
}

// The code below was modified from https://github.com/protobufjs/bytebuffer.js
// which is under the Apache License 2.0.

function wrapByteBuffer(bytes: Uint8Array): ByteBuffer {
	return { bytes, limit: bytes.length, offset: 0 };
}

function skip(bb: ByteBuffer, offset: number): void {
	if (bb.offset + offset > bb.limit) {
		throw new Error("Skip past limit");
	}
	bb.offset += offset;
}

function isAtEnd(bb: ByteBuffer): boolean {
	return bb.offset >= bb.limit;
}

function advance(bb: ByteBuffer, count: number): number {
	const offset = bb.offset;
	if (offset + count > bb.limit) {
		throw new Error("Read past limit");
	}
	bb.offset += count;
	return offset;
}

function readByte(bb: ByteBuffer): number {
	return bb.bytes[advance(bb, 1)];
}

function readVarint32(bb: ByteBuffer): number {
	let c = 0;
	let value = 0;
	let b: number;
	do {
		b = readByte(bb);
		if (c < 32) value |= (b & 0x7f) << c;
		c += 7;
	} while (b & 0x80);
	return value;
}
