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

self.addEventListener( 'push' , ( event ) => {
		let data = event.data.json()
		//let title = ( event.data && event.data.text() ) || "Message received"
		let title = data.title || "notification received"
		let message = data.message || "message received"

		event.waitUntil(
			self.registration.showNotification( title , {
				icon : "icon.png" ,
				body : message ,
				tag : "pwa"
			} )
	       )
})
