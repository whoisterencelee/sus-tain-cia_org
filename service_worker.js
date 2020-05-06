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
			requireInteraction : true ,
		}
		if( data.url ){
			note.data = { url : data.url }
		}

		event.waitUntil(
			self.registration.showNotification( data.title || "notification recieved" , note )
		)
})

// https://stackoverflow.com/questions/38713685/how-can-i-initiate-a-pwa-progressive-webapp-open-from-a-click-on-a-push-notifi
self.addEventListener( 'notificationclick' , ( event ) => {
	event.notification.close()
	var data = event.notification.data
	var rooturl = new URL('./', location).href
	if( data.url ){
		event.waitUntil( clients.matchAll({
			type: 'window'
		}).then( ( clientList ) => {
			for (var i = 0; i < clientList.length; i++) {
				var client = clientList[i]
				if (client.url == data.url && 'focus' in client) return client.focus()
			}
			if (clients.openWindow) return clients.openWindow( data.url ).then( ( client ) => client.focus() )
		} ) )
	}
} ) // notificationclick
