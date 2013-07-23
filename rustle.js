// ----------------------------------------------------------------------------
//
//
//
//
// ----------------------------------------------------------------------------

var util = require('util');

// ----------------------------------------------------------------------------

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

    // check we have a valid retention
    if ( typeof opts.retention !== 'number' ) {
        throw new Error("rustle: Provide a valid period");
    }

    // now create the correct class for this aggregation type
    if ( opts.aggregation === 'sum' ) {
        return new Sum(opts);
    }

    throw new Error("rustle: Unknown aggregation type : " + opts.aggregation);
}

function Sum(opts) {
    var self = this;

    // save these options locally
    self.domain    = opts.domain;
    self.category  = opts.category;
    self.name      = opts.name;
    self.period    = opts.period;
    self.retention = opts.retention;

    // save the redis client
    self.client    = opts.client;

    // save some generated things
    self.setName = [ self.domain, self.category, self.name ].join(':');

    // return this
    return self;
}

// this just returns some meta info about this stat (not about the stats itself)
Sum.prototype.info = function() {
    var self = this;
    return {
        aggregation : 'sum',
        name        : self.name,
        domain      : self.domain,
        category    : self.category,
        retention   : self.retention,
        period      : self.period,
        total       : self.retention * self.period,
    };
}

// this hits the client to find out more info related to this stat
Sum.prototype.stats = function(callback) {
    var self = this;
    process.nextTick(function() {
        callback(null, {});
    });
}

Sum.prototype.inc = function(timestamp, callback) {
    var self = this;

    if ( typeof callback == 'undefined' ) {
        callback = timestamp;
        timestamp = Date.now();
    }

    if ( typeof callback == 'undefined' ) {
        callback = function(){};
    }

    // ok, firstly, round down the timestamp so it is on the previous period boundary
    timestamp = Math.floor(timestamp / 1000);
    var thisPeriod = timestamp - ( timestamp % self.period );

    var periodKey = [ self.setName, thisPeriod ].join(':');

    // finally, hit the client with this stuff
    self.client
        .multi()
        .zadd(self.setName, thisPeriod, periodKey)
        .incr(periodKey)
        .exec(function(err, results) {
            callback(err, results);
        })
    ;
}

Sum.prototype.keys = function(callback) {
    var self = this;

    // make sure we have a callback
    if ( typeof callback !== 'function' ) {
        throw new Error("Provide a callback");
    }

    // zrange cssminifier:hits:homepage 0 -1
    this.client.zrange(self.setName, 0, -1, function(err, keys) {
        if (err) return callback(err);
        keys.forEach(function(key, i) {
            var bits = key.split(':');
            keys[i] = bits[3];
        });
        callback(null, keys);
    });
};

Sum.prototype.values = function(callback) {
    var self = this;

    // make sure we have a callback
    if ( typeof callback !== 'function' ) {
        throw new Error("Provide a callback");
    }

    // zrange cssminifier:hits:homepage 0 -1
    this.client.sort(self.setName, 'by', 'scores', 'get', '#', 'get', '*', function(err, values) {
        if (err) return callback(err);
        var vals = [];
        var key;
        values.forEach(function(v) {
            if ( key ) {
                var bits = key.split(':');
                vals.push({
                    ts   : bits[3],
                    val  : v
                });
                key = undefined;
            }
            else {
                key = v;
            }
        });
        callback(null, vals);
    });
};

// ----------------------------------------------------------------------------

module.exports = create;

// ----------------------------------------------------------------------------
