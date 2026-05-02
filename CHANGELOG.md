# Changelog

## 0.2.0 (2026-05-02)

Full Changelog: [v0.1.0...v0.2.0](https://github.com/tanay-io/RateSheild/compare/v0.1.0...v0.2.0)

### Features

* add CORSAllowedOrigins to API config for dynamic CORS handling ([225aa68](https://github.com/tanay-io/RateSheild/commit/225aa681a5a46750cbfbd11de3cf9f7030a98892))
* add Dockerfile and configure HTTP server port from environment variable ([0e9f681](https://github.com/tanay-io/RateSheild/commit/0e9f681d0b8b69ee3460ecc79a04c11f96166f9e))
* Added Lua script for Slding window but not wired yet ([d97d557](https://github.com/tanay-io/RateSheild/commit/d97d55780babf5d27866feec48168e6a28c28d51))
* added the benchmarks via 10m+ concurrent req via autocannon ([60a074b](https://github.com/tanay-io/RateSheild/commit/60a074b6359a7a053be087491739f9a9ade218c1))
* **api:** manual updates ([7c7cecc](https://github.com/tanay-io/RateSheild/commit/7c7cecc14679ce0f0ca7ddea34379a0a8b5bfa10))
* changed the apikeyauth to use the context intead of passing the userid in url we are directly attaching it to the context by our middleware ([9f0f158](https://github.com/tanay-io/RateSheild/commit/9f0f158553059d220cd2ab3e54fa5bf554aed9fe))
* completed backend ([c8fc7ee](https://github.com/tanay-io/RateSheild/commit/c8fc7eeabf63b300c9b81c7b64f67e435c5be4f0))
* completed the frontend ([a92621e](https://github.com/tanay-io/RateSheild/commit/a92621ec97c8411cd50395b7ebe43f0b523be0b4))
* implement API key management system with  authentication middleware ([2cb9097](https://github.com/tanay-io/RateSheild/commit/2cb9097dabe2254cb1d97b82774f69d313688fc1))
* implement rate limiting service with Redis-backed fixed window algorithm & improved the folder structure ([8d3778f](https://github.com/tanay-io/RateSheild/commit/8d3778f1dafae6046b738f43b89685fd1504dde3))
* implement Redis-backed fixed window rate limiting service and API server ([678a7a7](https://github.com/tanay-io/RateSheild/commit/678a7a70c90b452b95282fb945b3724c44356c8d))
* implement websocket handler and redis pub/sub subscriber for real-time event delivery. Ensured that we have a global subsciber instead of every user id having its own go routine ([134f44d](https://github.com/tanay-io/RateSheild/commit/134f44d8c69a33ebf87cb6023ea0ba14746861e9))
* implemented and learnt  token bucket rate limiting algorithm ([730cf97](https://github.com/tanay-io/RateSheild/commit/730cf974bbf6c02d8470a780b830e07b59329c6c))
* implemented API key generation ([d6c0d55](https://github.com/tanay-io/RateSheild/commit/d6c0d559a12955cc3f5c4746fd71dd5fb64df532))
* implemented jwt auth and fixed the bug of the fixed window being in the seconds instead of milliseconds ([1a8f94f](https://github.com/tanay-io/RateSheild/commit/1a8f94fd89210dce861106a9abb9eab3fcbc46e3))
* implemented sliding window rate limiting algorithm ([8159912](https://github.com/tanay-io/RateSheild/commit/815991223155d69d081a3752b6af017552f0e3dd))
* implemented the hub for the websocket implementation ([5aa1586](https://github.com/tanay-io/RateSheild/commit/5aa15862133dd8518ffc7ebd98fa759a57227697))
* made the frontend to be realtime using redis pub sub instead of the mock data being shown ([586b0cd](https://github.com/tanay-io/RateSheild/commit/586b0cd7ffeca2db77e221fcac691fd147076285))
* update Redis connection handling to support URL parsing ([d75a7f0](https://github.com/tanay-io/RateSheild/commit/d75a7f0ca90b05e6d5e699b1b05eafd26f031c62))


### Chores

* sync repo ([28bc57d](https://github.com/tanay-io/RateSheild/commit/28bc57d9d545088fcd221c89b83fb6f787d2366e))

## 0.1.0 (2026-05-02)

Full Changelog: [v0.0.1...v0.1.0](https://github.com/tanay-io/RateSheild/compare/v0.0.1...v0.1.0)

### Features

* add CORSAllowedOrigins to API config for dynamic CORS handling ([225aa68](https://github.com/tanay-io/RateSheild/commit/225aa681a5a46750cbfbd11de3cf9f7030a98892))
* add Dockerfile and configure HTTP server port from environment variable ([0e9f681](https://github.com/tanay-io/RateSheild/commit/0e9f681d0b8b69ee3460ecc79a04c11f96166f9e))
* Added Lua script for Slding window but not wired yet ([d97d557](https://github.com/tanay-io/RateSheild/commit/d97d55780babf5d27866feec48168e6a28c28d51))
* added the benchmarks via 10m+ concurrent req via autocannon ([60a074b](https://github.com/tanay-io/RateSheild/commit/60a074b6359a7a053be087491739f9a9ade218c1))
* changed the apikeyauth to use the context intead of passing the userid in url we are directly attaching it to the context by our middleware ([9f0f158](https://github.com/tanay-io/RateSheild/commit/9f0f158553059d220cd2ab3e54fa5bf554aed9fe))
* completed backend ([c8fc7ee](https://github.com/tanay-io/RateSheild/commit/c8fc7eeabf63b300c9b81c7b64f67e435c5be4f0))
* completed the frontend ([a92621e](https://github.com/tanay-io/RateSheild/commit/a92621ec97c8411cd50395b7ebe43f0b523be0b4))
* implement API key management system with  authentication middleware ([2cb9097](https://github.com/tanay-io/RateSheild/commit/2cb9097dabe2254cb1d97b82774f69d313688fc1))
* implement rate limiting service with Redis-backed fixed window algorithm & improved the folder structure ([8d3778f](https://github.com/tanay-io/RateSheild/commit/8d3778f1dafae6046b738f43b89685fd1504dde3))
* implement Redis-backed fixed window rate limiting service and API server ([678a7a7](https://github.com/tanay-io/RateSheild/commit/678a7a70c90b452b95282fb945b3724c44356c8d))
* implement websocket handler and redis pub/sub subscriber for real-time event delivery. Ensured that we have a global subsciber instead of every user id having its own go routine ([134f44d](https://github.com/tanay-io/RateSheild/commit/134f44d8c69a33ebf87cb6023ea0ba14746861e9))
* implemented and learnt  token bucket rate limiting algorithm ([730cf97](https://github.com/tanay-io/RateSheild/commit/730cf974bbf6c02d8470a780b830e07b59329c6c))
* implemented API key generation ([d6c0d55](https://github.com/tanay-io/RateSheild/commit/d6c0d559a12955cc3f5c4746fd71dd5fb64df532))
* implemented jwt auth and fixed the bug of the fixed window being in the seconds instead of milliseconds ([1a8f94f](https://github.com/tanay-io/RateSheild/commit/1a8f94fd89210dce861106a9abb9eab3fcbc46e3))
* implemented sliding window rate limiting algorithm ([8159912](https://github.com/tanay-io/RateSheild/commit/815991223155d69d081a3752b6af017552f0e3dd))
* implemented the hub for the websocket implementation ([5aa1586](https://github.com/tanay-io/RateSheild/commit/5aa15862133dd8518ffc7ebd98fa759a57227697))
* made the frontend to be realtime using redis pub sub instead of the mock data being shown ([586b0cd](https://github.com/tanay-io/RateSheild/commit/586b0cd7ffeca2db77e221fcac691fd147076285))
* update Redis connection handling to support URL parsing ([d75a7f0](https://github.com/tanay-io/RateSheild/commit/d75a7f0ca90b05e6d5e699b1b05eafd26f031c62))


### Chores

* sync repo ([43c4e27](https://github.com/tanay-io/RateSheild/commit/43c4e27880edf284af65ddd6c96f510172ad53ed))
* update SDK settings ([4d33069](https://github.com/tanay-io/RateSheild/commit/4d33069a3453135dbab97053ff5a36bf961294e7))
* update SDK settings ([e6d28e4](https://github.com/tanay-io/RateSheild/commit/e6d28e49fab9976987f07ea71522941c1db8cdae))
