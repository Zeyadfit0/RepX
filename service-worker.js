const CACHE_NAME = 'fitness-tracker-v1'; // اسم ذاكرة التخزين المؤقت للتطبيق الخاص بك
// قائمة بجميع الملفات التي تريد تخزينها مؤقتًا
const urlsToCache = [
    '/', // المسار الأساسي (root) للموقع
    '/index.html',
    '/script.js',
    '/style.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css' // ملف Font Awesome
    // إذا كان لديك أي ملفات صور محلية (ليست روابط خارجية)، أضف مساراتها هنا.
    // على سبيل المثال: '/images/my-icon.png'
];

// حدث التثبيت (install event): يحدث عند تثبيت الـ Service Worker لأول مرة.
// هنا نقوم بفتح ذاكرة التخزين المؤقت وإضافة جميع الملفات الأساسية إليها.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache opened. Adding URLs to cache...');
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()) // هذا يضمن تفعيل الـ SW الجديد على الفور
    );
});

// حدث الجلب (fetch event): يحدث عندما يطلب المتصفح موردًا (مثل ملف HTML، صورة، CSS، JS).
// هنا نتحقق مما إذا كان المورد متاحًا في ذاكرة التخزين المؤقت، وإذا لم يكن، نجلبه من الشبكة.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // إذا كان المورد موجودًا في ذاكرة التخزين المؤقت، أعده.
                if (response) {
                    console.log('Service Worker: Serving from cache:', event.request.url);
                    return response;
                }
                // إذا لم يكن موجودًا، اذهب واجلبه من الشبكة.
                console.log('Service Worker: Fetching from network:', event.request.url);
                return fetch(event.request).catch(() => {
                    // هذا الجزء يتم تنفيذه إذا فشل جلب المورد من الشبكة ولم يكن في الكاش.
                    // يمكنك هنا عرض صفحة "غير متصل بالإنترنت" مخصصة إذا أردت.
                    console.error('Service Worker: Fetch failed and no cache for:', event.request.url);
                    // مثال: return caches.match('/offline.html');
                });
            })
    );
});

// حدث التفعيل (activate event): يحدث عند تفعيل Service Worker جديد.
// هذا الحدث يستخدم عادةً لتنظيف ذاكرات التخزين المؤقت القديمة.
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activated!');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // حذف ذاكرات التخزين المؤقت التي ليست في القائمة البيضاء.
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // يسمح للـ SW بالتحكم الفوري في الصفحات
    );
});