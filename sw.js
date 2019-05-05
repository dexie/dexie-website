---
layout: null
---

// Cache all css
// 
const raw = [

    "/",
    "https://ghbtns.com/github-btn.html?user=dfahlander&repo=Dexie.js&type=star&count=true",
    "https://buttons.github.io/buttons.js",
    "https://unpkg.com/dexie",
    "http://www.google-analytics.com/analytics.js",
    {% for page in site.html_pages %}
    "{{ page.url }}",
    {% endfor %}

    {%for file in site.static_files %}
    "{{ file.path }}",
    {% endfor %}
];

const CACHE_NAME = 'dexiejs-offline-cache';

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

async function waitForAll(promises){
    return new Promise( resolve => {
        let rc = { success: 0, failure:0 };
        for (let i=0; i < promises.length; i++) {
            promises[i]
            .then(()=>{
                rc.success++;
                if (rc.success+rc.failure === promises.length) resolve(rc);
            }).catch(err => {
                rc.failure++;
                if (rc.success+rc.failure === promises.length) resolve(rc);
                console.error(`error occurred ${err}`);
            });
        }
    });
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(async cache => {
            console.log('Opened cache');
            do {
                const sliceDice = raw.splice(0,10);
                await waitForAll(sliceDice.map(url => addUrl(url, cache)));
            } while(raw.length > 0);
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
            if (isCurrentSite(event.request.url)) {
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