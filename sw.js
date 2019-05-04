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

    {%for file in site.static_files %}
    "{{ file.path }}",
    {% endfor %}
];

const CACHE_NAME = 'dexiejs-offline-cache';

function isValidExt(ext){
   return [
       '.css', '.eot', '.html', 
       '.jpg', '.js', '.otf', 
       '.pdn', '.png', '.svg', 
       '.ttf', '.webmanifest',
       '.woff'
   ].includes(ext);
}

function basename(path){
    const base = path.match(/([^\/]+)$/g);
    if (base) return base[0];
    return ''; 
}

function ext(path){
    const extention = path.match(/\.([^.]+)$/g);
    if (extention) return extention[0];
    return '';
}

async function addUrl(url, cache) {
    let response;
    try {
      response = await fetch(url);
      if (!response.ok) {
          console.error(`not ok`, response);
          return; // skip
      }
    }
    catch(err){
        console.error(`could not fetch ${url}, because ${err}`);
        return;
    }
    try {
        await cache.put(url, response.clone());
    } catch (err) {
        console.error(`err: ${err}, could not put`, response);
    }
    return response;
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(async cache => {
            console.log('Opened cache');
            for (let i = 0; i < raw.length; i++) {
                await addUrl(raw[i], cache);
            }
            return true;
        })
    );
});

function isCurrentSite(url){
    const u  = new URL(url);
    if (self.location.origin === u.origin){
        return true;
    }
    return false;
}


self.addEventListener('fetch', function (event) {
    
    const promise = caches.open(CACHE_NAME).then(async function (cache) {
        
        const cacheResult = await cache.match(new URL(event.request.url).pathname,{ignoreSearch: true});
        if (cacheResult) return cacheResult;

        if (!isCurrentSite(event.request.url)){
            try {
                const response = await addUrl(event.request.url, cache);
                return response;
            }
            catch(err){
                console.error(`Error fetching offsite url:${eevent.request.url} err: ${err}`);
            }  
            return '';
        }

        promiseMatch = cache.match(new URL(event.request.url).pathname,{ignoreSearch: true});

        return promiseMatch.then(async function (response) {
            // return or fetch over network if not found and put in cache
            if (response) return response;
            // return 404 if it is same origin
            if (isCurrentSIte(event.request.url)) {
                const data = `This url ${event.request.url} is not part of the offline`
                return new Response(data, {
                    status: 404,
                    statusText: 'Not found',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                        'Content-Length': data.length
                    }),
                });
            }
            try {
              const response = addUrl(event.request.url, cache);
              return response;
            }
            catch(err){
                console.error(`Error fetching offsite url:${eevent.request.url} err: ${err}`);
            }  
        });
    })

    event.respondWith(promise);
});