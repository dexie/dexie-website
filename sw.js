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
].filter(file => !file.startsWith("/test") && !file.includes("analytics.js"));

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
                await waitForAll(sliceDice.map(async url => cache.put(url, await fetch((url)))));
            } while(leadingSlashRemoved.length > 0);
            return true;
        })
    );
});

async function respondFromCache(cache, origRes, req, origError) {
    const cacheResult = await cache.match(req);
    if (cacheResult) return cacheResult;
    if (origError) throw origError;
    return origRes;
}

self.addEventListener('fetch', function (event) {
    event.respondWith(fetch(event.request).then(async res => {
        const cache = await caches.open(CACHE_NAME);
        if (!res.ok) return respondFromCache(cache, res, event.request);
        cache.put(event.request, res.clone());
        return res;
    }, async error => {
        return respondFromCache(await caches.open(CACHE_NAME), null, event.request, error);
    }));
});
