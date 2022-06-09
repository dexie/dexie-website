---
layout: null
---

// Cache all css
// 
const raw = [

    "/",
    "https://ghbtns.com/github-btn.html?user=dfahlander&repo=Dexie.js&type=star&count=true",
    "https://api.github.com/repos/dfahlander/Dexie.js",
    "https://buttons.github.io/buttons.js",
    "https://unpkg.com/dexie",
    "https://www.google-analytics.com/analytics.js",
    {% for page in site.html_pages %}
    "{{ page.url }}",
    {% endfor %}

    {%for file in site.static_files %}
    "{{ file.path }}",
    {% endfor %}
].filter(file =>
    !file.startsWith("/test") &&
    !file.includes("analytics.js") &&
    !file.endsWith(".sh") &&
    !file.startsWith("/assets/movies/"));

const CACHE_NAME = 'dexiejs-offline-cache';

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

/*
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
}*/

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.delete(CACHE_NAME)
        .then(() => caches.open(CACHE_NAME))
        .then(async cache => {
            console.log('Opened cache');
            const leadingSlashRemoved = raw.map(url => url);
            do {
                // cache in batches of 10
                const sliceDice = leadingSlashRemoved.splice(0, 50);
                await waitForAll(sliceDice.map(async url => {
                    const response = await fetch(url);
                    console.log("URL", url, response);
                    await cache.put(url, response);
                }));
            } while(leadingSlashRemoved.length > 0);
            return true;
        })
    );
});

const MAX_WAIT = 300; // If network responds slower than 100 ms, respond with cache instead

self.addEventListener('fetch', function (event) {
    const request = event.request;
    // Don't take over if it's not a GET, HEAD or OPTIONS request
    if (request.method !== 'GET' && request.method !== "HEAD" && request.method !== "OPTIONS") return;
    // Don't cache google analytics requests:
    if (/google-analytics/.test(request.url)) return;

    // Start reading from cache
    const cachedResponsePromise = caches.match(request, {ignoreVary: true});
    const fetchPromise = fetch(request);
    let timeoutHandle;
    const timeoutPromise = new Promise(resolve => {
        timeoutHandle = setTimeout(()=>{
            timeoutHandle = null;
            resolve("timedout");
        }, MAX_WAIT)
    });
    // Start fetching in parallell
    event.respondWith(Promise.race([fetchPromise, timeoutPromise]).then(async res => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        // Fetch successful, probably online. See if we also have the cached response:
        const cachedResponse = await cachedResponsePromise.catch(err => null);
        if (res === "timedout" || !res.ok) {
            // Fetch didn't throw but the result wasn't ok either.
            // Could be timeout, a 404, 500 or maybe offline?
            // In case we have an OK response in the cache, respond with that one instead:
            if (cachedResponse && cachedResponse.ok) {
                // Respond from cache.
                // But in parallell, update the cache once the slow response arrives (if it is successful and newer)
                if (res === "timedout") {
                    console.debug("URL", request.url, "timedout. Serving it from cache but also update cache once slow response arrives");
                    event.waitUntil(fetchPromise.then(async res => {
                        if (!res.ok) return;
                        await updateCache(request, res, cachedResponse);
                    }).catch(err => null));
                }
                return cachedResponse;
            } else if (res === "timedout") {
                // We don't have anything in cache. Wait for fetch even if it takes time.
                res = await fetchPromise;
                if (!res.ok) {
                    // Response not successful. Respond with it without trying to cache it.
                    return res;
                }
                // else, the slow response was successful. Let it continue further down
                // so we can cache this slow response.
            } else {
                // res not ok. Don't cache it but return it.
                return res;
            }
        }

        // We come here if the real fetch was successful.
        event.waitUntil(updateCache(request, res, cachedResponse));
        return res;
    }, async error => {
        const cachedResponse = await cachedResponsePromise.catch(err => null);
        console.debug("sw: Finding in cache:", request.url, cachedResponse);
        console.debug("sw: ok?:", cachedResponse && cachedResponse.ok);
        if (cachedResponse && cachedResponse.ok) {
            return cachedResponse;
        }
        throw error;
    }));
});

async function updateCache(request, res, currentCachedRes) {
    // Should we update the cache with this fresh version?
    let cachedLastMod = currentCachedRes && currentCachedRes.headers.get("last-modified");
    if (!cachedLastMod || (cachedLastMod !== res.headers.get("last-modified"))) {
        // There were no cached response, or no "last-modified", or "last-modified" headers was changed - keep the cache up-to-date,
        // so that, when the user goes offline, it will have the latest and greatest, and not revert to old versions
        const clonedResponse = res.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, clonedResponse);
    }
}
