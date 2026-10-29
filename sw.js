var CACHE='trip-2026-v1';
var FILES=['./','./index.html'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}));
});
self.addEventListener('fetch',function(e){
  var r=e.request;
  if(r.method!=='GET')return;
  var u=new URL(r.url);
  if(u.origin!==location.origin)return;
  // 有網路就拿最新版並更新備份,沒網路就用備份
  e.respondWith(fetch(r).then(function(res){
    var copy=res.clone();caches.open(CACHE).then(function(c){c.put(r,copy)});return res;
  }).catch(function(){
    return caches.match(r).then(function(m){return m||caches.match('./index.html')});
  }));
});
