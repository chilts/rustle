# Rustle #

Rustle is a stats aggregation library which can use a number of backends for storing a fixed-size database. It is
similar in design to RRD and Whisper but uses Redis, Files, Memory or any number of other backends (currently only
Redis is implemented).

Each of these backends can stream an entire fixed-size database hence can be written to disk, over the network
or indeed to anything in Node which is a ```writeStream``` that can accept a ```.pipe()``` from a ```readStream```.

## Example ##

Imagine we wanted to keep a count of the number of hits on our homepage every minute and retain all stats for one
year. We'd set up a stat such as the following:

```
var redis = require('redis');
var rustle = require('./rustle.js');

var client = redis.createClient();

var homepageHits = rustle({
    client       : client,

    // keys are prefixed : "<domain>:<category>:<name>"
    domain       : 'cssminifier',      //
    category     : 'hits',             // 
    name         : 'homepage',         // 
    period       : 60,                 // one minute
    retention    : 365 * 24 * 60 * 60, // one year
    aggregation  : 'sum',              // average, sum, last, max, min
});

To increment the number of hits, just call ```hit```:

homepageHits.inc(function(err) {
   // ...
});
```

If you'd like to know which periods have info:

```
homepageHits.keys(function(err, keys) {
   // ...
});
```

If you'd like to know get all the periods and their valies:

```
homepageHits.values(function(err, periods) {
   // ...
});
```

## ToDo ##

Other commands such as the ability to get all the values between two time periods along with a periodLength to allow
for more aggregation.

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

Copyright © 2013 Andrew Chilton <andychilton@gmail.com>.  All rights reserved.

See [http://chilts.mit-license.org/2013/](http://chilts.mit-license.org/2013/).

(Ends)
