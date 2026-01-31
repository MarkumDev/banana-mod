// ==UserScript==
// @name bananaMod
// @icon https://imgur.com/WhK0p6F.png
// @description better moomoo.io
// @match https://*.moomoo.io/*
// @run-at document-start
// @version 0.68
// @grant none
// ==/UserScript==

/* eslint-disable no-sequences */
/* eslint-disable curly */
/* eslint-disable no-return-assign */

(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs
  function utf8DecodeJs(bytes, inputOffset, byteLength) {
    let offset = inputOffset;
    const end = offset + byteLength;
    const units = [];
    let result = "";
    while (offset < end) {
      const byte1 = bytes[offset++];
      if ((byte1 & 128) === 0) {
        units.push(byte1);
      } else if ((byte1 & 224) === 192) {
        const byte2 = bytes[offset++] & 63;
        units.push((byte1 & 31) << 6 | byte2);
      } else if ((byte1 & 240) === 224) {
        const byte2 = bytes[offset++] & 63;
        const byte3 = bytes[offset++] & 63;
        units.push((byte1 & 31) << 12 | byte2 << 6 | byte3);
      } else if ((byte1 & 248) === 240) {
        const byte2 = bytes[offset++] & 63;
        const byte3 = bytes[offset++] & 63;
        const byte4 = bytes[offset++] & 63;
        let unit = (byte1 & 7) << 18 | byte2 << 12 | byte3 << 6 | byte4;
        if (unit > 65535) {
          unit -= 65536;
          units.push(unit >>> 10 & 1023 | 55296);
          unit = 56320 | unit & 1023;
        }
        units.push(unit);
      } else {
        units.push(byte1);
      }
      if (units.length >= CHUNK_SIZE) {
        result += String.fromCharCode(...units);
        units.length = 0;
      }
    }
    if (units.length > 0) {
      result += String.fromCharCode(...units);
    }
    return result;
  }
  function utf8DecodeTD(bytes, inputOffset, byteLength) {
    const stringBytes = bytes.subarray(inputOffset, inputOffset + byteLength);
    return sharedTextDecoder.decode(stringBytes);
  }
  function utf8Decode(bytes, inputOffset, byteLength) {
    if (byteLength > TEXT_DECODER_THRESHOLD) {
      return utf8DecodeTD(bytes, inputOffset, byteLength);
    } else {
      return utf8DecodeJs(bytes, inputOffset, byteLength);
    }
  }
  var sharedTextEncoder, CHUNK_SIZE, sharedTextDecoder, TEXT_DECODER_THRESHOLD;
  var init_utf8 = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/utils/utf8.mjs"() {
      sharedTextEncoder = new TextEncoder();
      CHUNK_SIZE = 4096;
      sharedTextDecoder = new TextDecoder();
      TEXT_DECODER_THRESHOLD = 200;
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs
  var ExtData;
  var init_ExtData = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/ExtData.mjs"() {
      ExtData = class {
        constructor(type, data) {
          __publicField(this, "type");
          __publicField(this, "data");
          this.type = type;
          this.data = data;
        }
      };
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs
  var DecodeError;
  var init_DecodeError = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/DecodeError.mjs"() {
      DecodeError = class _DecodeError extends Error {
        constructor(message) {
          super(message);
          const proto = Object.create(_DecodeError.prototype);
          Object.setPrototypeOf(this, proto);
          Object.defineProperty(this, "name", {
            configurable: true,
            enumerable: false,
            value: _DecodeError.name
          });
        }
      };
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs
  function setInt64(view, offset, value) {
    const high = Math.floor(value / 4294967296);
    const low = value;
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
  }
  function getInt64(view, offset) {
    const high = view.getInt32(offset);
    const low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
  }
  function getUint64(view, offset) {
    const high = view.getUint32(offset);
    const low = view.getUint32(offset + 4);
    return high * 4294967296 + low;
  }
  var UINT32_MAX;
  var init_int = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/utils/int.mjs"() {
      UINT32_MAX = 4294967295;
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs
  function encodeTimeSpecToTimestamp({ sec, nsec }) {
    if (sec >= 0 && nsec >= 0 && sec <= TIMESTAMP64_MAX_SEC) {
      if (nsec === 0 && sec <= TIMESTAMP32_MAX_SEC) {
        const rv = new Uint8Array(4);
        const view = new DataView(rv.buffer);
        view.setUint32(0, sec);
        return rv;
      } else {
        const secHigh = sec / 4294967296;
        const secLow = sec & 4294967295;
        const rv = new Uint8Array(8);
        const view = new DataView(rv.buffer);
        view.setUint32(0, nsec << 2 | secHigh & 3);
        view.setUint32(4, secLow);
        return rv;
      }
    } else {
      const rv = new Uint8Array(12);
      const view = new DataView(rv.buffer);
      view.setUint32(0, nsec);
      setInt64(view, 4, sec);
      return rv;
    }
  }
  function encodeDateToTimeSpec(date) {
    const msec = date.getTime();
    const sec = Math.floor(msec / 1e3);
    const nsec = (msec - sec * 1e3) * 1e6;
    const nsecInSec = Math.floor(nsec / 1e9);
    return {
      sec: sec + nsecInSec,
      nsec: nsec - nsecInSec * 1e9
    };
  }
  function encodeTimestampExtension(object) {
    if (object instanceof Date) {
      const timeSpec = encodeDateToTimeSpec(object);
      return encodeTimeSpecToTimestamp(timeSpec);
    } else {
      return null;
    }
  }
  function decodeTimestampToTimeSpec(data) {
    const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
    switch (data.byteLength) {
      case 4: {
        const sec = view.getUint32(0);
        const nsec = 0;
        return { sec, nsec };
      }
      case 8: {
        const nsec30AndSecHigh2 = view.getUint32(0);
        const secLow32 = view.getUint32(4);
        const sec = (nsec30AndSecHigh2 & 3) * 4294967296 + secLow32;
        const nsec = nsec30AndSecHigh2 >>> 2;
        return { sec, nsec };
      }
      case 12: {
        const sec = getInt64(view, 4);
        const nsec = view.getUint32(0);
        return { sec, nsec };
      }
      default:
        throw new DecodeError(`Unrecognized data size for timestamp (expected 4, 8, or 12): ${data.length}`);
    }
  }
  function decodeTimestampExtension(data) {
    const timeSpec = decodeTimestampToTimeSpec(data);
    return new Date(timeSpec.sec * 1e3 + timeSpec.nsec / 1e6);
  }
  var EXT_TIMESTAMP, TIMESTAMP32_MAX_SEC, TIMESTAMP64_MAX_SEC, timestampExtension;
  var init_timestamp = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/timestamp.mjs"() {
      init_DecodeError();
      init_int();
      EXT_TIMESTAMP = -1;
      TIMESTAMP32_MAX_SEC = 4294967296 - 1;
      TIMESTAMP64_MAX_SEC = 17179869184 - 1;
      timestampExtension = {
        type: EXT_TIMESTAMP,
        encode: encodeTimestampExtension,
        decode: decodeTimestampExtension
      };
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs
  var _ExtensionCodec, ExtensionCodec;
  var init_ExtensionCodec = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/ExtensionCodec.mjs"() {
      init_ExtData();
      init_timestamp();
      _ExtensionCodec = class _ExtensionCodec {
        constructor() {
          // ensures ExtensionCodecType<X> matches ExtensionCodec<X>
          // this will make type errors a lot more clear
          // eslint-disable-next-line @typescript-eslint/naming-convention
          __publicField(this, "__brand");
          // built-in extensions
          __publicField(this, "builtInEncoders", []);
          __publicField(this, "builtInDecoders", []);
          // custom extensions
          __publicField(this, "encoders", []);
          __publicField(this, "decoders", []);
          this.register(timestampExtension);
        }
        register({ type, encode, decode: decode2 }) {
          if (type >= 0) {
            this.encoders[type] = encode;
            this.decoders[type] = decode2;
          } else {
            const index = -1 - type;
            this.builtInEncoders[index] = encode;
            this.builtInDecoders[index] = decode2;
          }
        }
        tryToEncode(object, context) {
          for (let i = 0; i < this.builtInEncoders.length; i++) {
            const encodeExt = this.builtInEncoders[i];
            if (encodeExt != null) {
              const data = encodeExt(object, context);
              if (data != null) {
                const type = -1 - i;
                return new ExtData(type, data);
              }
            }
          }
          for (let i = 0; i < this.encoders.length; i++) {
            const encodeExt = this.encoders[i];
            if (encodeExt != null) {
              const data = encodeExt(object, context);
              if (data != null) {
                const type = i;
                return new ExtData(type, data);
              }
            }
          }
          if (object instanceof ExtData) {
            return object;
          }
          return null;
        }
        decode(data, type, context) {
          const decodeExt = type < 0 ? this.builtInDecoders[-1 - type] : this.decoders[type];
          if (decodeExt) {
            return decodeExt(data, type, context);
          } else {
            return new ExtData(type, data);
          }
        }
      };
      __publicField(_ExtensionCodec, "defaultCodec", new _ExtensionCodec());
      ExtensionCodec = _ExtensionCodec;
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs
  function isArrayBufferLike(buffer) {
    return buffer instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && buffer instanceof SharedArrayBuffer;
  }
  function ensureUint8Array(buffer) {
    if (buffer instanceof Uint8Array) {
      return buffer;
    } else if (ArrayBuffer.isView(buffer)) {
      return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
    } else if (isArrayBufferLike(buffer)) {
      return new Uint8Array(buffer);
    } else {
      return Uint8Array.from(buffer);
    }
  }
  var init_typedArrays = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/utils/typedArrays.mjs"() {
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs
  function prettyByte(byte) {
    return `${byte < 0 ? "-" : ""}0x${Math.abs(byte).toString(16).padStart(2, "0")}`;
  }
  var init_prettyByte = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/utils/prettyByte.mjs"() {
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs
  var DEFAULT_MAX_KEY_LENGTH, DEFAULT_MAX_LENGTH_PER_KEY, CachedKeyDecoder;
  var init_CachedKeyDecoder = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/CachedKeyDecoder.mjs"() {
      init_utf8();
      DEFAULT_MAX_KEY_LENGTH = 16;
      DEFAULT_MAX_LENGTH_PER_KEY = 16;
      CachedKeyDecoder = class {
        constructor(maxKeyLength = DEFAULT_MAX_KEY_LENGTH, maxLengthPerKey = DEFAULT_MAX_LENGTH_PER_KEY) {
          __publicField(this, "hit", 0);
          __publicField(this, "miss", 0);
          __publicField(this, "caches");
          __publicField(this, "maxKeyLength");
          __publicField(this, "maxLengthPerKey");
          this.maxKeyLength = maxKeyLength;
          this.maxLengthPerKey = maxLengthPerKey;
          this.caches = [];
          for (let i = 0; i < this.maxKeyLength; i++) {
            this.caches.push([]);
          }
        }
        canBeCached(byteLength) {
          return byteLength > 0 && byteLength <= this.maxKeyLength;
        }
        find(bytes, inputOffset, byteLength) {
          const records = this.caches[byteLength - 1];
          FIND_CHUNK: for (const record of records) {
            const recordBytes = record.bytes;
            for (let j = 0; j < byteLength; j++) {
              if (recordBytes[j] !== bytes[inputOffset + j]) {
                continue FIND_CHUNK;
              }
            }
            return record.str;
          }
          return null;
        }
        store(bytes, value) {
          const records = this.caches[bytes.length - 1];
          const record = { bytes, str: value };
          if (records.length >= this.maxLengthPerKey) {
            records[Math.random() * records.length | 0] = record;
          } else {
            records.push(record);
          }
        }
        decode(bytes, inputOffset, byteLength) {
          const cachedValue = this.find(bytes, inputOffset, byteLength);
          if (cachedValue != null) {
            this.hit++;
            return cachedValue;
          }
          this.miss++;
          const str = utf8DecodeJs(bytes, inputOffset, byteLength);
          const slicedCopyOfBytes = Uint8Array.prototype.slice.call(bytes, inputOffset, inputOffset + byteLength);
          this.store(slicedCopyOfBytes, str);
          return str;
        }
      };
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs
  var STATE_ARRAY, STATE_MAP_KEY, STATE_MAP_VALUE, mapKeyConverter, StackPool, HEAD_BYTE_REQUIRED, EMPTY_VIEW, EMPTY_BYTES, MORE_DATA, sharedCachedKeyDecoder, Decoder;
  var init_Decoder = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/Decoder.mjs"() {
      init_prettyByte();
      init_ExtensionCodec();
      init_int();
      init_utf8();
      init_typedArrays();
      init_CachedKeyDecoder();
      init_DecodeError();
      STATE_ARRAY = "array";
      STATE_MAP_KEY = "map_key";
      STATE_MAP_VALUE = "map_value";
      mapKeyConverter = (key) => {
        if (typeof key === "string" || typeof key === "number") {
          return key;
        }
        throw new DecodeError("The type of key must be string or number but " + typeof key);
      };
      StackPool = class {
        constructor() {
          __publicField(this, "stack", []);
          __publicField(this, "stackHeadPosition", -1);
        }
        get length() {
          return this.stackHeadPosition + 1;
        }
        top() {
          return this.stack[this.stackHeadPosition];
        }
        pushArrayState(size) {
          const state = this.getUninitializedStateFromPool();
          state.type = STATE_ARRAY;
          state.position = 0;
          state.size = size;
          state.array = new Array(size);
        }
        pushMapState(size) {
          const state = this.getUninitializedStateFromPool();
          state.type = STATE_MAP_KEY;
          state.readCount = 0;
          state.size = size;
          state.map = {};
        }
        getUninitializedStateFromPool() {
          this.stackHeadPosition++;
          if (this.stackHeadPosition === this.stack.length) {
            const partialState = {
              type: void 0,
              size: 0,
              array: void 0,
              position: 0,
              readCount: 0,
              map: void 0,
              key: null
            };
            this.stack.push(partialState);
          }
          return this.stack[this.stackHeadPosition];
        }
        release(state) {
          const topStackState = this.stack[this.stackHeadPosition];
          if (topStackState !== state) {
            throw new Error("Invalid stack state. Released state is not on top of the stack.");
          }
          if (state.type === STATE_ARRAY) {
            const partialState = state;
            partialState.size = 0;
            partialState.array = void 0;
            partialState.position = 0;
            partialState.type = void 0;
          }
          if (state.type === STATE_MAP_KEY || state.type === STATE_MAP_VALUE) {
            const partialState = state;
            partialState.size = 0;
            partialState.map = void 0;
            partialState.readCount = 0;
            partialState.type = void 0;
          }
          this.stackHeadPosition--;
        }
        reset() {
          this.stack.length = 0;
          this.stackHeadPosition = -1;
        }
      };
      HEAD_BYTE_REQUIRED = -1;
      EMPTY_VIEW = new DataView(new ArrayBuffer(0));
      EMPTY_BYTES = new Uint8Array(EMPTY_VIEW.buffer);
      try {
        EMPTY_VIEW.getInt8(0);
      } catch (e) {
        if (!(e instanceof RangeError)) {
          throw new Error("This module is not supported in the current JavaScript engine because DataView does not throw RangeError on out-of-bounds access");
        }
      }
      MORE_DATA = new RangeError("Insufficient data");
      sharedCachedKeyDecoder = new CachedKeyDecoder();
      Decoder = class _Decoder {
        constructor(options) {
          __publicField(this, "extensionCodec");
          __publicField(this, "context");
          __publicField(this, "useBigInt64");
          __publicField(this, "rawStrings");
          __publicField(this, "maxStrLength");
          __publicField(this, "maxBinLength");
          __publicField(this, "maxArrayLength");
          __publicField(this, "maxMapLength");
          __publicField(this, "maxExtLength");
          __publicField(this, "keyDecoder");
          __publicField(this, "mapKeyConverter");
          __publicField(this, "totalPos", 0);
          __publicField(this, "pos", 0);
          __publicField(this, "view", EMPTY_VIEW);
          __publicField(this, "bytes", EMPTY_BYTES);
          __publicField(this, "headByte", HEAD_BYTE_REQUIRED);
          __publicField(this, "stack", new StackPool());
          __publicField(this, "entered", false);
          this.extensionCodec = options?.extensionCodec ?? ExtensionCodec.defaultCodec;
          this.context = options?.context;
          this.useBigInt64 = options?.useBigInt64 ?? false;
          this.rawStrings = options?.rawStrings ?? false;
          this.maxStrLength = options?.maxStrLength ?? UINT32_MAX;
          this.maxBinLength = options?.maxBinLength ?? UINT32_MAX;
          this.maxArrayLength = options?.maxArrayLength ?? UINT32_MAX;
          this.maxMapLength = options?.maxMapLength ?? UINT32_MAX;
          this.maxExtLength = options?.maxExtLength ?? UINT32_MAX;
          this.keyDecoder = options?.keyDecoder !== void 0 ? options.keyDecoder : sharedCachedKeyDecoder;
          this.mapKeyConverter = options?.mapKeyConverter ?? mapKeyConverter;
        }
        clone() {
          return new _Decoder({
            extensionCodec: this.extensionCodec,
            context: this.context,
            useBigInt64: this.useBigInt64,
            rawStrings: this.rawStrings,
            maxStrLength: this.maxStrLength,
            maxBinLength: this.maxBinLength,
            maxArrayLength: this.maxArrayLength,
            maxMapLength: this.maxMapLength,
            maxExtLength: this.maxExtLength,
            keyDecoder: this.keyDecoder
          });
        }
        reinitializeState() {
          this.totalPos = 0;
          this.headByte = HEAD_BYTE_REQUIRED;
          this.stack.reset();
        }
        setBuffer(buffer) {
          const bytes = ensureUint8Array(buffer);
          this.bytes = bytes;
          this.view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
          this.pos = 0;
        }
        appendBuffer(buffer) {
          if (this.headByte === HEAD_BYTE_REQUIRED && !this.hasRemaining(1)) {
            this.setBuffer(buffer);
          } else {
            const remainingData = this.bytes.subarray(this.pos);
            const newData = ensureUint8Array(buffer);
            const newBuffer = new Uint8Array(remainingData.length + newData.length);
            newBuffer.set(remainingData);
            newBuffer.set(newData, remainingData.length);
            this.setBuffer(newBuffer);
          }
        }
        hasRemaining(size) {
          return this.view.byteLength - this.pos >= size;
        }
        createExtraByteError(posToShow) {
          const { view, pos } = this;
          return new RangeError(`Extra ${view.byteLength - pos} of ${view.byteLength} byte(s) found at buffer[${posToShow}]`);
        }
        /**
         * @throws {@link DecodeError}
         * @throws {@link RangeError}
         */
        decode(buffer) {
          if (this.entered) {
            const instance = this.clone();
            return instance.decode(buffer);
          }
          try {
            this.entered = true;
            this.reinitializeState();
            this.setBuffer(buffer);
            const object = this.doDecodeSync();
            if (this.hasRemaining(1)) {
              throw this.createExtraByteError(this.pos);
            }
            return object;
          } finally {
            this.entered = false;
          }
        }
        *decodeMulti(buffer) {
          if (this.entered) {
            const instance = this.clone();
            yield* instance.decodeMulti(buffer);
            return;
          }
          try {
            this.entered = true;
            this.reinitializeState();
            this.setBuffer(buffer);
            while (this.hasRemaining(1)) {
              yield this.doDecodeSync();
            }
          } finally {
            this.entered = false;
          }
        }
        async decodeAsync(stream) {
          if (this.entered) {
            const instance = this.clone();
            return instance.decodeAsync(stream);
          }
          try {
            this.entered = true;
            let decoded = false;
            let object;
            for await (const buffer of stream) {
              if (decoded) {
                this.entered = false;
                throw this.createExtraByteError(this.totalPos);
              }
              this.appendBuffer(buffer);
              try {
                object = this.doDecodeSync();
                decoded = true;
              } catch (e) {
                if (!(e instanceof RangeError)) {
                  throw e;
                }
              }
              this.totalPos += this.pos;
            }
            if (decoded) {
              if (this.hasRemaining(1)) {
                throw this.createExtraByteError(this.totalPos);
              }
              return object;
            }
            const { headByte, pos, totalPos } = this;
            throw new RangeError(`Insufficient data in parsing ${prettyByte(headByte)} at ${totalPos} (${pos} in the current buffer)`);
          } finally {
            this.entered = false;
          }
        }
        decodeArrayStream(stream) {
          return this.decodeMultiAsync(stream, true);
        }
        decodeStream(stream) {
          return this.decodeMultiAsync(stream, false);
        }
        async *decodeMultiAsync(stream, isArray) {
          if (this.entered) {
            const instance = this.clone();
            yield* instance.decodeMultiAsync(stream, isArray);
            return;
          }
          try {
            this.entered = true;
            let isArrayHeaderRequired = isArray;
            let arrayItemsLeft = -1;
            for await (const buffer of stream) {
              if (isArray && arrayItemsLeft === 0) {
                throw this.createExtraByteError(this.totalPos);
              }
              this.appendBuffer(buffer);
              if (isArrayHeaderRequired) {
                arrayItemsLeft = this.readArraySize();
                isArrayHeaderRequired = false;
                this.complete();
              }
              try {
                while (true) {
                  yield this.doDecodeSync();
                  if (--arrayItemsLeft === 0) {
                    break;
                  }
                }
              } catch (e) {
                if (!(e instanceof RangeError)) {
                  throw e;
                }
              }
              this.totalPos += this.pos;
            }
          } finally {
            this.entered = false;
          }
        }
        doDecodeSync() {
          DECODE: while (true) {
            const headByte = this.readHeadByte();
            let object;
            if (headByte >= 224) {
              object = headByte - 256;
            } else if (headByte < 192) {
              if (headByte < 128) {
                object = headByte;
              } else if (headByte < 144) {
                const size = headByte - 128;
                if (size !== 0) {
                  this.pushMapState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = {};
                }
              } else if (headByte < 160) {
                const size = headByte - 144;
                if (size !== 0) {
                  this.pushArrayState(size);
                  this.complete();
                  continue DECODE;
                } else {
                  object = [];
                }
              } else {
                const byteLength = headByte - 160;
                object = this.decodeString(byteLength, 0);
              }
            } else if (headByte === 192) {
              object = null;
            } else if (headByte === 194) {
              object = false;
            } else if (headByte === 195) {
              object = true;
            } else if (headByte === 202) {
              object = this.readF32();
            } else if (headByte === 203) {
              object = this.readF64();
            } else if (headByte === 204) {
              object = this.readU8();
            } else if (headByte === 205) {
              object = this.readU16();
            } else if (headByte === 206) {
              object = this.readU32();
            } else if (headByte === 207) {
              if (this.useBigInt64) {
                object = this.readU64AsBigInt();
              } else {
                object = this.readU64();
              }
            } else if (headByte === 208) {
              object = this.readI8();
            } else if (headByte === 209) {
              object = this.readI16();
            } else if (headByte === 210) {
              object = this.readI32();
            } else if (headByte === 211) {
              if (this.useBigInt64) {
                object = this.readI64AsBigInt();
              } else {
                object = this.readI64();
              }
            } else if (headByte === 217) {
              const byteLength = this.lookU8();
              object = this.decodeString(byteLength, 1);
            } else if (headByte === 218) {
              const byteLength = this.lookU16();
              object = this.decodeString(byteLength, 2);
            } else if (headByte === 219) {
              const byteLength = this.lookU32();
              object = this.decodeString(byteLength, 4);
            } else if (headByte === 220) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 221) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushArrayState(size);
                this.complete();
                continue DECODE;
              } else {
                object = [];
              }
            } else if (headByte === 222) {
              const size = this.readU16();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 223) {
              const size = this.readU32();
              if (size !== 0) {
                this.pushMapState(size);
                this.complete();
                continue DECODE;
              } else {
                object = {};
              }
            } else if (headByte === 196) {
              const size = this.lookU8();
              object = this.decodeBinary(size, 1);
            } else if (headByte === 197) {
              const size = this.lookU16();
              object = this.decodeBinary(size, 2);
            } else if (headByte === 198) {
              const size = this.lookU32();
              object = this.decodeBinary(size, 4);
            } else if (headByte === 212) {
              object = this.decodeExtension(1, 0);
            } else if (headByte === 213) {
              object = this.decodeExtension(2, 0);
            } else if (headByte === 214) {
              object = this.decodeExtension(4, 0);
            } else if (headByte === 215) {
              object = this.decodeExtension(8, 0);
            } else if (headByte === 216) {
              object = this.decodeExtension(16, 0);
            } else if (headByte === 199) {
              const size = this.lookU8();
              object = this.decodeExtension(size, 1);
            } else if (headByte === 200) {
              const size = this.lookU16();
              object = this.decodeExtension(size, 2);
            } else if (headByte === 201) {
              const size = this.lookU32();
              object = this.decodeExtension(size, 4);
            } else {
              throw new DecodeError(`Unrecognized type byte: ${prettyByte(headByte)}`);
            }
            this.complete();
            const stack = this.stack;
            while (stack.length > 0) {
              const state = stack.top();
              if (state.type === STATE_ARRAY) {
                state.array[state.position] = object;
                state.position++;
                if (state.position === state.size) {
                  object = state.array;
                  stack.release(state);
                } else {
                  continue DECODE;
                }
              } else if (state.type === STATE_MAP_KEY) {
                if (object === "__proto__") {
                  throw new DecodeError("The key __proto__ is not allowed");
                }
                state.key = this.mapKeyConverter(object);
                state.type = STATE_MAP_VALUE;
                continue DECODE;
              } else {
                state.map[state.key] = object;
                state.readCount++;
                if (state.readCount === state.size) {
                  object = state.map;
                  stack.release(state);
                } else {
                  state.key = null;
                  state.type = STATE_MAP_KEY;
                  continue DECODE;
                }
              }
            }
            return object;
          }
        }
        readHeadByte() {
          if (this.headByte === HEAD_BYTE_REQUIRED) {
            this.headByte = this.readU8();
          }
          return this.headByte;
        }
        complete() {
          this.headByte = HEAD_BYTE_REQUIRED;
        }
        readArraySize() {
          const headByte = this.readHeadByte();
          switch (headByte) {
            case 220:
              return this.readU16();
            case 221:
              return this.readU32();
            default: {
              if (headByte < 160) {
                return headByte - 144;
              } else {
                throw new DecodeError(`Unrecognized array type byte: ${prettyByte(headByte)}`);
              }
            }
          }
        }
        pushMapState(size) {
          if (size > this.maxMapLength) {
            throw new DecodeError(`Max length exceeded: map length (${size}) > maxMapLengthLength (${this.maxMapLength})`);
          }
          this.stack.pushMapState(size);
        }
        pushArrayState(size) {
          if (size > this.maxArrayLength) {
            throw new DecodeError(`Max length exceeded: array length (${size}) > maxArrayLength (${this.maxArrayLength})`);
          }
          this.stack.pushArrayState(size);
        }
        decodeString(byteLength, headerOffset) {
          if (!this.rawStrings || this.stateIsMapKey()) {
            return this.decodeUtf8String(byteLength, headerOffset);
          }
          return this.decodeBinary(byteLength, headerOffset);
        }
        /**
         * @throws {@link RangeError}
         */
        decodeUtf8String(byteLength, headerOffset) {
          if (byteLength > this.maxStrLength) {
            throw new DecodeError(`Max length exceeded: UTF-8 byte length (${byteLength}) > maxStrLength (${this.maxStrLength})`);
          }
          if (this.bytes.byteLength < this.pos + headerOffset + byteLength) {
            throw MORE_DATA;
          }
          const offset = this.pos + headerOffset;
          let object;
          if (this.stateIsMapKey() && this.keyDecoder?.canBeCached(byteLength)) {
            object = this.keyDecoder.decode(this.bytes, offset, byteLength);
          } else {
            object = utf8Decode(this.bytes, offset, byteLength);
          }
          this.pos += headerOffset + byteLength;
          return object;
        }
        stateIsMapKey() {
          if (this.stack.length > 0) {
            const state = this.stack.top();
            return state.type === STATE_MAP_KEY;
          }
          return false;
        }
        /**
         * @throws {@link RangeError}
         */
        decodeBinary(byteLength, headOffset) {
          if (byteLength > this.maxBinLength) {
            throw new DecodeError(`Max length exceeded: bin length (${byteLength}) > maxBinLength (${this.maxBinLength})`);
          }
          if (!this.hasRemaining(byteLength + headOffset)) {
            throw MORE_DATA;
          }
          const offset = this.pos + headOffset;
          const object = this.bytes.subarray(offset, offset + byteLength);
          this.pos += headOffset + byteLength;
          return object;
        }
        decodeExtension(size, headOffset) {
          if (size > this.maxExtLength) {
            throw new DecodeError(`Max length exceeded: ext length (${size}) > maxExtLength (${this.maxExtLength})`);
          }
          const extType = this.view.getInt8(this.pos + headOffset);
          const data = this.decodeBinary(
            size,
            headOffset + 1
            /* extType */
          );
          return this.extensionCodec.decode(data, extType, this.context);
        }
        lookU8() {
          return this.view.getUint8(this.pos);
        }
        lookU16() {
          return this.view.getUint16(this.pos);
        }
        lookU32() {
          return this.view.getUint32(this.pos);
        }
        readU8() {
          const value = this.view.getUint8(this.pos);
          this.pos++;
          return value;
        }
        readI8() {
          const value = this.view.getInt8(this.pos);
          this.pos++;
          return value;
        }
        readU16() {
          const value = this.view.getUint16(this.pos);
          this.pos += 2;
          return value;
        }
        readI16() {
          const value = this.view.getInt16(this.pos);
          this.pos += 2;
          return value;
        }
        readU32() {
          const value = this.view.getUint32(this.pos);
          this.pos += 4;
          return value;
        }
        readI32() {
          const value = this.view.getInt32(this.pos);
          this.pos += 4;
          return value;
        }
        readU64() {
          const value = getUint64(this.view, this.pos);
          this.pos += 8;
          return value;
        }
        readI64() {
          const value = getInt64(this.view, this.pos);
          this.pos += 8;
          return value;
        }
        readU64AsBigInt() {
          const value = this.view.getBigUint64(this.pos);
          this.pos += 8;
          return value;
        }
        readI64AsBigInt() {
          const value = this.view.getBigInt64(this.pos);
          this.pos += 8;
          return value;
        }
        readF32() {
          const value = this.view.getFloat32(this.pos);
          this.pos += 4;
          return value;
        }
        readF64() {
          const value = this.view.getFloat64(this.pos);
          this.pos += 8;
          return value;
        }
      };
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/decode.mjs
  function decode(buffer, options) {
    const decoder = new Decoder(options);
    return decoder.decode(buffer);
  }
  var init_decode = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/decode.mjs"() {
      init_Decoder();
    }
  });

  // node_modules/@msgpack/msgpack/dist.esm/index.mjs
  var init_dist = __esm({
    "node_modules/@msgpack/msgpack/dist.esm/index.mjs"() {
      init_decode();
    }
  });

  // src/modules/WSModule.ts
  function captureWebSocket() {
    const OriginalSend = WebSocket.prototype.send;
    if (!WebSocket.prototype.send.__hooked) {
      WebSocket.prototype.send.__hooked = true;
      WebSocket.prototype.send = function(data) {
        if (!window.moomooWS) {
          window.moomooWS = this;
          console.log("\u2714 WS captured via send()");
        }
        return OriginalSend.call(this, data);
      };
    }
    const OriginalWebSocket = window.WebSocket;
    if (OriginalWebSocket.__captured) return;
    OriginalWebSocket.__captured = true;
    window.WebSocket = new Proxy(OriginalWebSocket, {
      construct(target, args) {
        const ws = new target(...args);
        ws.binaryType = "arraybuffer";
        window.moomooWS = ws;
        console.log("\u2714 WS captured", String(args[0]));
        window.WebSocket = OriginalWebSocket;
        return ws;
      }
    });
  }
  var init_WSModule = __esm({
    "src/modules/WSModule.ts"() {
    }
  });

  // src/modules/UIModule.ts
  var UIModule;
  var init_UIModule = __esm({
    "src/modules/UIModule.ts"() {
      UIModule = class {
        onElement(selector, action) {
          const el = document.querySelector(selector);
          if (!el) {
            console.log(`Element ${selector} not found`);
            return;
          }
          action(el);
        }
        tweakGameMenu() {
          this.onElement("#gameName", (el) => {
            el.innerHTML = "Banana Mod v0.61";
          });
          this.onElement("#rightCardHolder", (el) => {
            el.style.display = "block";
          });
          [
            "#promoImgHolder",
            "#linksContainer2",
            "#joinPartyButton",
            "#partyButton",
            //"#allianceButton",
            //"#storeButton",
            "#chatButton",
            "#wideAdCard",
            ".menuCard",
            ".adMenuCard",
            ".material-icons"
          ].forEach((selector) => {
            this.onElement(selector, (el) => el.remove());
          });
          const observer = new MutationObserver((mutations) => {
            for (const m of mutations) {
              for (const node of m.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                if (node.tagName === "INS" && node.classList.contains("adsbygoogle")) {
                  node.remove();
                  console.log("Ads removed");
                  observer.disconnect();
                }
              }
            }
          });
          observer.observe(document.documentElement, {
            childList: true,
            subtree: true
          });
          console.log("\u2714 tweakGameMenu loaded");
        }
        tweakGameUI() {
          this.onElement("#bottomContainer", (el) => {
            el.style.bottom = "auto";
            el.style.right = "auto";
          });
          console.log("\u2714 tweakGameUI loaded");
        }
        createModUI() {
          const gameUI = document.getElementById("gameUI");
          if (!gameUI) return;
          const cfgButton = document.createElement("div");
          cfgButton.style.right = "390px";
          cfgButton.classList.add("uiElement", "gameButton");
          const cfgIcon = document.createElement("i");
          cfgIcon.style.fontSize = "40px";
          cfgIcon.style.verticalAlign = "middle";
          cfgIcon.classList.add("material-icons");
          cfgIcon.textContent = "settings";
          cfgButton.appendChild(cfgIcon);
          gameUI.appendChild(cfgButton);
          console.log("\u2714 createModUI loaded");
        }
      };
    }
  });

  // src/main.ts
  var require_main = __commonJS({
    "src/main.ts"() {
      init_dist();
      init_WSModule();
      init_UIModule();
      (function init() {
        captureWebSocket();
        let ui_once = false;
        const ui = new UIModule();
        document.addEventListener("DOMContentLoaded", () => {
          ui.tweakGameMenu();
        });
        function setupNetworkListeners() {
          const wait = setInterval(() => {
            const ws = window.moomooWS;
            if (!ws) return;
            clearInterval(wait);
            ws.addEventListener("message", (e) => {
              if (!(e.data instanceof ArrayBuffer)) return;
              const decoded = decode(new Uint8Array(e.data));
              if (!Array.isArray(decoded)) return;
              const packet = decoded;
              if (packet[0] === "C") {
                const spawn = packet;
                if (ui_once) return;
                ui.tweakGameUI();
                ui.createModUI();
                ui_once = true;
              }
            });
          }, 100);
        }
        setupNetworkListeners();
      })();
    }
  });
  require_main();
})();