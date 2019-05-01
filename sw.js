---
    layout: null
---

// Cache all css
// 
const urlsToCache = [

    "/",
    {% for page in site.html_pages %}
"{{ page.url }}",
    {% endfor %}

{% for file in site.static_files %}
"{{ file.path }}",
    {% endfor %}
];


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
   const promise = caches.open(CACHE_NAME).then(function (cache) {
            
          const promiseMatch =  cache.match(event.request);
          return promiseMatch.then(function (response) {
                // return or fetch over network if not found and put in cache
                return response || fetch(event.request).then(function (networkResponse) {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
          });
    })
    
   event.respondWith(promise);
});