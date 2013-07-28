# Rustle #

Rustle is a stats aggregation library which can use a number of backends for storing a fixed-size database. It is
similar in design to RRD and Whisper but uses Redis, Files, Memory or any number of other backends (currently only
Redis is implemented).

## Example ##

Imagine we wanted to keep a count of the number of hits on our homepage every minute and retain all stats for one
year. We'd set up a stat such as the following:

```
var redis = require('redis');
var rustle = require('rustle');

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
```

To increment the number of hits:

```
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

If you'd like to get all the periods and their values:

```
homepageHits.values(function(err, periods) {
   // ...
});
```

If you'd like to get a subrange of values:

```
var opts = { from : 1374554520, to : 1374555120 };
homepageHits.values(opts, function(err, periods) {
   // ...
});
```

If you'd like to get a aggregate a range of values into larger periods (e.g. 5 mins):

```
var opts = { from : 1374554520, to : 1374555120, period : 300 };
homepageHits.values(opts, function(err, periods) {
   // ...
});
```

## ToDo ##

* ability to stream values to disk
* other aggregations, such as avg, min, max

## Author ##

Written by [Andrew Chilton](http://chilts.org/) - [Blog](http://chilts.org/blog/) -
[Twitter](https://twitter.com/andychilton).

## License ##

Copyright © 2013 Andrew Chilton <andychilton@gmail.com>.  All rights reserved.

See [http://chilts.mit-license.org/2013/](http://chilts.mit-license.org/2013/).

(Ends)
