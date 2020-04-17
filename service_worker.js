self.addEventListener('install', function(e) {
	self.skipWaiting()  // update service worker immediately not waiting for tabs to close
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
		let note = {
			icon : "icon.png" ,
			body : data.message || "message received" ,
			tag : "pwa" ,
		}
		if( data.url ){
			note.data = { url : data.url }
		}

		event.waitUntil(
			self.registration.showNotification( data.title || "notification recieved" , note )
		)
})

self.addEventListener( 'notificationclick' , ( event ) => {
	event.notification.close()
	event.waitUntil( clients.matchAll({
		type: 'window'
	}).then( ( clientList )=>{
		for (var i = 0; i < clientList.length; i++) {
			var client = clientList[i];
			if (client.url == '/' && 'focus' in client)
			return client.focus();
		}
		if (clients.openWindow) return clients.openWindow('/');
	})
} ) // notificationclick
