/*!
 * qrcode.js - QRCode for JavaScript
 * MIT License
 */
(function () {

    //--------------------------------------------------------------------------
    // QRCode Constants
    //--------------------------------------------------------------------------

    const QRMode = {
        MODE_NUMBER: 1 << 0,
        MODE_ALPHA_NUM: 1 << 1,
        MODE_8BIT_BYTE: 1 << 2,
        MODE_KANJI: 1 << 3
    };

    const QRErrorCorrectLevel = {
        L: 1,
        M: 0,
        Q: 3,
        H: 2
    };

    const QRMaskPattern = {
        PATTERN000: 0,
        PATTERN001: 1,
        PATTERN010: 2,
        PATTERN011: 3,
        PATTERN100: 4,
        PATTERN101: 5,
        PATTERN110: 6,
        PATTERN111: 7
    };

    //--------------------------------------------------------------------------
    // QR8bitByte
    //--------------------------------------------------------------------------

    function QR8bitByte(data) {
        this.mode = QRMode.MODE_8BIT_BYTE;
        this.data = data;
    }

    QR8bitByte.prototype = {
        getLength: function (buffer) {
            return this.data.length;
        },
        write: function (buffer) {
            for (let i = 0; i < this.data.length; i++) {
                buffer.put(this.data.charCodeAt(i), 8);
            }
        }
    };

    //--------------------------------------------------------------------------
    // QR Util
    //--------------------------------------------------------------------------

    const QRUtil = {

        PATTERN_POSITION_TABLE: [
            [],
            [6, 18],
            [6, 22],
            [6, 26],
            [6, 30],
            [6, 34],
            [6, 22, 38],
            [6, 24, 42],
            [6, 26, 46],
            [6, 28, 50],
            [6, 30, 54],
        ],

        G15: (1 << 10) | (1 << 8) | (1 << 5) | (1 << 4) | (1 << 2) | (1),
        G18: (1 << 12) | (1 << 11) | (1 << 10) |
            (1 << 9) | (1 << 8) | (1 << 5) |
            (1 << 2) | (1 << 0),
        G15_MASK: (1 << 14) | (1 << 12) | (1 << 10) |
            (1 << 4) | (1 << 1),

        getBCHTypeInfo: function (data) {
            let d = data << 10;
            while (QRUtil.getBCHDigit(d) - QRUtil.getBCHDigit(QRUtil.G15) >= 0) {
                d ^= (QRUtil.G15 << (QRUtil.getBCHDigit(d) -
                    QRUtil.getBCHDigit(QRUtil.G15)));
            }
            return ((data << 10) | d) ^ QRUtil.G15_MASK;
        },

        getBCHDigit: function (data) {
            let digit = 0;
            while (data !== 0) {
                digit++;
                data >>>= 1;
            }
            return digit;
        },

        getPatternPosition: function (typeNumber) {
            return QRUtil.PATTERN_POSITION_TABLE[typeNumber - 1];
        },

        getMask: function (maskPattern, i, j) {
            switch (maskPattern) {
                case QRMaskPattern.PATTERN000:
                    return (i + j) % 2 === 0;
                case QRMaskPattern.PATTERN001:
                    return i % 2 === 0;
                case QRMaskPattern.PATTERN010:
                    return j % 3 === 0;
                case QRMaskPattern.PATTERN011:
                    return (i + j) % 3 === 0;
                case QRMaskPattern.PATTERN100:
                    return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
                case QRMaskPattern.PATTERN101:
                    return (i * j) % 2 + (i * j) % 3 === 0;
                case QRMaskPattern.PATTERN110:
                    return ((i * j) % 2 + (i * j) % 3) % 2 === 0;
                case QRMaskPattern.PATTERN111:
                    return ((i + j) % 2 + (i * j) % 3) % 2 === 0;
                default:
                    throw new Error("bad maskPattern:" + maskPattern);
            }
        }
    };

    //--------------------------------------------------------------------------
    // BitBuffer
    //--------------------------------------------------------------------------

    function QRBitBuffer() {
        this.buffer = [];
        this.length = 0;
    }

    QRBitBuffer.prototype = {

        get: function (index) {
            const bufIndex = Math.floor(index / 8);
            return ((this.buffer[bufIndex] >>> (7 - index % 8)) & 1) === 1;
        },

        put: function (num, length) {
            for (let i = 0; i < length; i++) {
                this.putBit(((num >>> (length - i - 1)) & 1) === 1);
            }
        },

        putBit: function (bit) {
            const bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) {
                this.buffer.push(0);
            }
            if (bit) {
                this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
            }
            this.length++;
        }
    };

    //--------------------------------------------------------------------------
    // QRCode Factory
    //--------------------------------------------------------------------------

    function QRCode(typeNumber, errorCorrectLevel) {
        this.typeNumber = typeNumber;
        this.errorCorrectLevel = errorCorrectLevel;
        this.modules = null;
        this.moduleCount = 0;
        this.dataList = [];
    }

    QRCode.prototype = {

        addData: function (data) {
            this.dataList.push(new QR8bitByte(data));
        },

        make: function () {
            this.makeImpl(false, this.getBestMaskPattern());
        },

        makeImpl: function (test, maskPattern) {

            this.moduleCount = this.typeNumber * 4 + 17;
            this.modules = new Array(this.moduleCount);

            for (let row = 0; row < this.moduleCount; row++) {
                this.modules[row] = new Array(this.moduleCount);
                for (let col = 0; col < this.moduleCount; col++) {
                    this.modules[row][col] = null;
                }
            }

            const data = this.createData();
            this.mapData(data, maskPattern);
        },

        createData: function () {
            const buffer = new QRBitBuffer();

            for (let i = 0; i < this.dataList.length; i++) {
                const data = this.dataList[i];
                buffer.put(4, 4);
                buffer.put(data.getLength(), 8);
                data.write(buffer);
            }

            return buffer;
        },

        mapData: function (buffer, maskPattern) {

            let inc = -1;
            let row = this.moduleCount - 1;
            let bitIndex = 0;

            for (let col = this.moduleCount - 1; col > 0; col -= 2) {

                if (col === 6) col--;

                while (true) {
                    for (let c = 0; c < 2; c++) {
                        if (this.modules[row][col - c] == null) {
                            let bit = buffer.get(bitIndex);
                            if (QRUtil.getMask(maskPattern, row, col - c)) {
                                bit = !bit;
                            }
                            this.modules[row][col - c] = bit;
                            bitIndex++;
                        }
                    }
                    row += inc;
                    if (row < 0 || this.moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        },

        getBestMaskPattern: function () {
            return QRMaskPattern.PATTERN000;
        },

        createSvgTag: function (cellSize, margin) {
            const size = this.moduleCount * cellSize + margin * 2;
            let svg = '<svg width="' + size + '" height="' + size + '" viewBox="0 0 ' + size + ' ' + size + '" xmlns="http://www.w3.org/2000/svg">';
            svg += '<rect width="100%" height="100%" fill="white"/>';

            for (let r = 0; r < this.moduleCount; r++) {
                for (let c = 0; c < this.moduleCount; c++) {
                    if (this.modules[r][c]) {
                        svg += '<rect x="' + (c * cellSize + margin) + '" y="' + (r * cellSize + margin) + '" width="' + cellSize + '" height="' + cellSize + '" fill="black"/>';
                    }
                }
            }

            svg += '</svg>';
            return svg;
        }
    };

    //--------------------------------------------------------------------------
    // Export
    //--------------------------------------------------------------------------

    window.QRCode = {
        toString: function(text, options, cb) {
            const qr = new QRCode(5, QRErrorCorrectLevel.M);
            qr.addData(text);
            qr.make();
            const svg = qr.createSvgTag(4, 4);
            cb(null, svg);
        }
    };

})();
