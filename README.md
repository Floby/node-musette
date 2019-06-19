[![Build Status][travis-image]][travis-url] [![Coverage][coveralls-image]][coveralls-url]

Musette
=======

> A programmable API stub

Musette lets you start a HTTP server and programmatically configure the way
it handles the next requests.
It can even delegate the implementation to the configuring code.
Designed for use in integration testing or acceptance testing.

Install
-------

    $ npm install musette

Run
---

    $ npx musette

Usage
-----

### Program next reply for a match

The API is configured on the administration port (usually `9090`)

```
> POST /_match
> Content-Type: application/json
>
> {
>   path: '/some/:matching/path',
>   method: 'GET',
>   headers: {
>     "x-api-key": "123456789"
>   },
>   reply: {
>     body: {
>       some: 'payload'
>     }
>   }
> }

< 201 Created
```

Then, the next API call matching on the stub port (usually `8080`) will reply

```
> GET /some/888/path
> x-api-key: 123456789

< 200
< Content-Type: application/json
<
< { "some": "payload" }
```

Test
----

    npm test


Contributing
------------

Anyone is welcome to submit issues and pull requests


License
-------

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2019 Florent Jaby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


[travis-image]: http://img.shields.io/travis/Floby/node-musette/master.svg?style=flat
[travis-url]: https://travis-ci.org/Floby/node-musette
[coveralls-image]: http://img.shields.io/coveralls/Floby/node-musette/master.svg?style=flat
[coveralls-url]: https://coveralls.io/r/Floby/node-musette

