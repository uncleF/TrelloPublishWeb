"use strict";function onInstall(a){a.waitUntil(caches.open(CACHE_NAME).then(function(a){a.addAll(offline)}))}function onFetch(a){var b=a.request,c=function(a){var c=a.clone();return caches.open(CACHE_NAME).then(function(a){a.put(b,c)}),a},d=function(a){var d=fetch(b).then(c);return a||d};return"GET"!==b.method?void a.respondWith(fetch(b)):void a.respondWith(caches.match(b).then(d))}var CACHE_NAME="pt-cache-v3",offline=["/","/res/css/styles.css","/res/js/scripts.js"];self.addEventListener("install",onInstall),self.addEventListener("fetch",onFetch);