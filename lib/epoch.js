function toEpoch(d) {
    if ( d instanceof Date ) {
        return Math.floor(d.valueOf() / 1000);
    }

    if ( typeof d === 'string' ) {
        return Math.floor((Date.parse(d)).valueOf() / 1000);
    }

    if ( typeof d === 'number' ) {
        return Math.floor((new Date(+(d + '000'))).valueOf() / 1000);
    }

    throw new Error("Unknown format for converting to Epoch : " + typeof d);
}

module.exports = toEpoch;
