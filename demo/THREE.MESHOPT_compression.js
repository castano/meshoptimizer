var GLTFMeshoptCompressionExtension = /** @class */ (function() {
	function GLTFMeshoptCompressionExtension(decoder) {
		this.extension = "MESHOPT_compression";
		this.decoder = decoder;
	}

	GLTFMeshoptCompressionExtension.prototype.onBufferView = function(bufferViewDef, parser) {
		if (bufferViewDef.extensions === undefined || bufferViewDef.extensions[this.extension] === undefined) {
			return undefined;
		}

		var extensionDef = bufferViewDef.extensions[this.extension];
		var decoder = this.decoder;
		var buffer = parser.loadBuffer(extensionDef.buffer);

		return Promise.all([buffer, decoder.ready]).then(function(results) {
			var buffer = results[0];

			var byteOffset = extensionDef.byteOffset || 0;
			var byteLength = extensionDef.byteLength || 0;

			var count = extensionDef.count;
			var stride = extensionDef.byteStride;

			var result = new ArrayBuffer(count * stride);
			var source = new Uint8Array(buffer, byteOffset, byteLength);

			switch (extensionDef.mode) {
			case 0:
				decoder.decodeVertexBuffer(new Uint8Array(result), count, stride, source);
				break;

			case 1:
				decoder.decodeIndexBuffer(new Uint8Array(result), count, stride, source);
				break;

			default:
				throw new Error('THREE.GLTFLoader: Unrecognized meshopt compression mode.');
			}

			return result;
		});
	};

	return GLTFMeshoptCompressionExtension;
})();
