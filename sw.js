---
    layout: null
---

// Cache all css
// 
const raw = [

    "/",
    {% for page in site.html_pages %}
"{{ page.url }}",
    {% endfor %}

{% for file in site.static_files %}
"{{ file.path }}",
    {% endfor %}
];

const CACHE_NAME = 'dexiejs-offline-cache';

function recreateRequest(newUrl, oldRequest) {
    const temp = oldRequest.clone();
    const init = {
        method: temp.method,
        headers: new Headers(tempheaders),
        body: ['GET', 'HEAD'].includes(temp.method) ? undefined : temp.body,
        mode: temp.mode,
        credentials: temp.credentials,
        cache: temp.cache,
        redirect: temp.redirect,
        referrer: temp.referrer,
        integrity: temp.integrity
    };
    return new Request(newUrl, init);
}


function correctExtention(name) {
    const result = name.match(/^(\/[^\/.]+)+(\.[^.]+)?$/);
    if (result !== null) {
        const [full, last, ext] = result;
        if (!ext) { // add html
            return [`${name}.html`];
        }
    }
    return [name];
}

function addsIndexHtml(name) {
    if (name.endsWith('/')) {
        return `${name}index.html`;
    }
    return name;
}

self.addEventListener('install', function (event) {
    // lets normalize the strings
    const normalizedUrl = raw.map(name => {
        const correctedName = correctExtention(addsIndexHtml(name));
        return correctedName;
    });
    // Perform install steps
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log('Opened cache');
                return cache.addAll(normalizedUrl);
            })
    );
});

self.addEventListener('fetch', function (event) {
    const promise = caches.open(CACHE_NAME).then(function (cache) {
        // we need to normalize the url
        // normalize 
        const oldurl = new URL(event.request.url);
        const newpath = correctExtention(addsIndexHtml(oldurl.pathname));
       
        let promiseMatch
        if (newpath !== oldpath){ // re-create request with new url 
            oldurl.pathname = newpath;
            const newurl = oldurl.toString();
            const newrequest = recreateRequest(newurl, event.request); 
            promiseMatch = cache.match(newrequest);    
        }
        else {
            promiseMatch = cache.match(event.request);    
        }
       
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