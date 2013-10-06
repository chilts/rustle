// ----------------------------------------------------------------------------
//
// rustle.js - Write and read aggregated time-based stats to Redis.
//
// Copyright (c) 2013 Andrew Chilton <andychilton@gmail.com>.
// All rights reserved.
//
// ----------------------------------------------------------------------------

// local
var Sum = require('./lib/sum.js');

// ----------------------------------------------------------------------------
// create()

function create(opts) {
    // check we have a client
    if ( !opts.client ) {
        throw new Error("rustle: Provide a Redis client");
    }

    // check we have a category
    if ( typeof opts.category !== 'string' ) {
        throw new Error("rustle: Provide a valid category");
    }

    // check we have a domain
    if ( typeof opts.domain !== 'string' ) {
        throw new Error("rustle: Provide a valid domain");
    }

    // check we have a name
    if ( typeof opts.name !== 'string' ) {
        throw new Error("rustle: Provide a valid name");
    }

    // check we have a valid period
    if ( typeof opts.period !== 'number' ) {
        throw new Error("rustle: Provide a valid period");
    }

    // now create the correct class for this aggregation type
    if ( opts.aggregation === 'sum' ) {
        return new Sum(opts);
    }

    throw new Error("rustle: Unknown aggregation type : " + opts.aggregation);
}

// ----------------------------------------------------------------------------

module.exports = create;

// ----------------------------------------------------------------------------
