---
layout: null
---

// Cache all assets
{% for asset in site.static_files %}
  urlsToCache.push("{{ file.path }}")
{% endfor %}

// Cache all pages
{% for page in site.html_pages %}
  urlsToCache.push("{{ page.url }}")
{% endfor %}

const urlsToCache = [];


const CACHE_NAME = 'dexiejs-offline-cache';

self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        cache.match(event.request).then(function (response) {
            // return or fetch over network if not found and put in cache
            return response || fetch(event.request).then(function (response) {
                cache.put(event.request, response.clone());
                return response;
            });
        })
    );
});