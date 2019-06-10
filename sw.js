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
    "https://www.google-analytics.com/analytics.js",
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
        let responseFinal;
        if (isCurrentSite(response.url) && response.url.endsWith('/')){
            const blob = await response.clone().blob();
            responseFinal = new Response(blob, {
                status:response.status,
                statusText:response.statusText,
                headers: new Headers(response.headers)
            });
        }
        else {
            responseFinal = response.clone();
        }
        await cache.put(url, responseFinal);
    } catch (err) {
        console.error(`err: ${err}, could not put`, responseFinal);
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

function isCurrentSite(url){
    const u  = new URL(url);
    if (self.location.origin === u.origin){
        return true;
    }
    return false;
}

function shortIfLocal(url){
    const u  = new URL(url);
    if (isCurrentSite(u)) {
        return u.pathname;
    }
    return u.href;
}

function correctUrlForLocal(url){
    // try to construct url
    let temp;
    try{
       temp = new URL(url);
    } catch (err) {
        try {
            temp = new URL(self.location.origin+url);
        }
        catch(err2){
            temp = undefined;
        }
    } 
    if (!temp) return url;   
    if (!isCurrentSite(temp)) return temp;
    temp.pathname = temp.pathname.replace(/\/$/,'');
    return temp;
}

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(async cache => {
            console.log('Opened cache');
            const leadingSlashRemoved = raw.map(correctUrlForLocal);
            do {
                // cache in batches of 10
                const sliceDice = leadingSlashRemoved.splice(0, 50);
                await waitForAll(sliceDice.map(url => addUrl(shortIfLocal(url), cache)));
            } while(leadingSlashRemoved.length > 0);
            return true;
        })
    );
});




self.addEventListener('fetch', function (event) {
    const promise = caches.open(CACHE_NAME).then(async function (cache) {
        // correct url but only if it comes from the local site
        const url = correctUrlForLocal(event.request.url);
        const cacheResult = await cache.match(url.pathname,{ignoreSearch: true});
        if (cacheResult) return cacheResult;

        if (!isCurrentSite(url)){
            try {
                const response = await addUrl(url.href, cache);
                return response;
            }
            catch(err){
                console.error(`Error fetching offsite url:${event.request.url} err: ${err}`);
            }  
            return '';
        }

        promiseMatch = cache.match(url.pathname,{ignoreSearch: true});

        return promiseMatch.then(async function (response) {
            // found in cache
            if (response) return response;
            // return 404 if it is same origin
            if (isCurrentSite(url)) {
                const data = `This url ${url} is not part of the offline`
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
              const response = addUrl(`${url}`, cache);
              return response;
            }
            catch(err){
                console.error(`Error fetching offsite url:${url} err: ${err}`);
            }  
        });
    })

    event.respondWith(promise);
});