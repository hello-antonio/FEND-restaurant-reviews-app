/**
 *
 * sw.js
 * Service workers api handles the cashing of the site assets offline. Note: HTTPS is
 * required for service workers to work as well as a modern browser, but for development
 * localhost works fine.
 *
 */

 // Update version
const VERSION = 'v2';

// TODO: array of images to be cache, check the dbhelper.js for the URLs helpers and setting the paths,
// the app uses two image dimensions one for the thumbnails and reviews info but the names are the same for // both. Note: no images included.
let allImages = ['1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'];

// include all assets to cache
let cacheAllAssest = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/css/styles.min.css',
  '/data/restaurants.json',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://a.tile.openstreetmap.org',
  'https://fonts.googleapis.com/css?family=Yeseva+One|Open+Sans:300,400,600,700'
];

// TODO: add all images from allImages to the cacheAllAsset
allImages.forEach((img) => {

  cacheAllAssest.push((`/img/review/${img}`), (`/img/thumb/${img}`));

});

// Setup installation of services for the cache assets
self.addEventListener('install', function (event) {

  event.waitUntil(

    caches.open(VERSION).then(function (cache) {

      return cache.addAll(cacheAllAssest);

    })
  );

});

// Service to fetch resources from network and/or storage
self.addEventListener('fetch', function (event) {

  event.respondWith(

    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }

      let responseFromFetch = event.request.clone();

      return fetch(responseFromFetch).then(function (response) {
        // Check if we received a valid response
        // TODO: Set 404.html page
        // if (!response || response.status !== 200 || response.type !== 'basic') {
        //   return response;
        // }

        let responseClone = response.clone();

        caches.open(VERSION).then(function (cache) {
          cache.put(event.request, responseClone);
        });

        return response;
      })
    }));
});

// Finished setup and clean old cache services
self.addEventListener('activate', function (event) {
  let cacheWhitelist = [VERSION];

  event.waitUntil(

    caches.keys().then(function (keyList) {

      return Promise.all(keyList.map(function (key) {

        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }

      }));
    })
  );
});