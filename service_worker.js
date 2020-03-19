self.addEventListener('install', function(e) {
	e.waitUntil(
		caches.open('sustaincia.org').then(function(cache) {
			return 
			return cache.addAll([ '/' , 'index.html' ]);
		})
	   );
});

self.addEventListener('fetch', function(event) { // needed for home screen installation https://developers.google.com/web/fundamentals/app-install-banners/
	console.log(event.request.url);
	event.respondWith(
		caches.match(event.request).then(function(response) {
//			console.log("cache match for "+event.request.url)
			return response || fetch(event.request);
		})
	);
});
