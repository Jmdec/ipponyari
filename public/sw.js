if (!self.define) {
  let e,
    a = {};
  const s = (s, c) => (
    (s = new URL(s + ".js", c).href),
    a[s] ||
      new Promise((a) => {
        if ("document" in self) {
          const e = document.createElement("script");
          (e.src = s), (e.onload = a), document.head.appendChild(e);
        } else (e = s), importScripts(s), a();
      }).then(() => {
        let e = a[s];
        if (!e) throw new Error(`Module ${s} didn’t register its module`);
        return e;
      })
  );
  self.define = (c, i) => {
    const n =
      e ||
      ("document" in self ? document.currentScript.src : "") ||
      location.href;
    if (a[n]) return;
    let t = {};
    const d = (e) => s(e, n),
      r = { module: { uri: n }, exports: t, require: d };
    a[n] = Promise.all(c.map((e) => r[e] || d(e))).then((e) => (i(...e), t));
  };
}
define(["./workbox-f1770938"], function (e) {
  "use strict";
  importScripts(),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        {
          url: "/_next/static/2T_19eOpCJXz7tkCW_k8_/_buildManifest.js",
          revision: "771187ea46e61dfeca2563714c71c191",
        },
        {
          url: "/_next/static/2T_19eOpCJXz7tkCW_k8_/_ssgManifest.js",
          revision: "b6652df95db52feb4daf4eca35380933",
        },
        {
          url: "/_next/static/chunks/1143-fc54843f9debcec0.js",
          revision: "fc54843f9debcec0",
        },
        {
          url: "/_next/static/chunks/1646.a93085a0445ba909.js",
          revision: "a93085a0445ba909",
        },
        {
          url: "/_next/static/chunks/1717-10e10f5e2bfa8461.js",
          revision: "10e10f5e2bfa8461",
        },
        {
          url: "/_next/static/chunks/2273-d94eb94c4366e6f0.js",
          revision: "d94eb94c4366e6f0",
        },
        {
          url: "/_next/static/chunks/2658-9a93275ff5db5899.js",
          revision: "9a93275ff5db5899",
        },
        {
          url: "/_next/static/chunks/297-82933dba0a8b3452.js",
          revision: "82933dba0a8b3452",
        },
        {
          url: "/_next/static/chunks/2996-48c0170e07483be9.js",
          revision: "48c0170e07483be9",
        },
        {
          url: "/_next/static/chunks/3792-b363442d247a16b9.js",
          revision: "b363442d247a16b9",
        },
        {
          url: "/_next/static/chunks/4119-151aa75e08f8f88c.js",
          revision: "151aa75e08f8f88c",
        },
        {
          url: "/_next/static/chunks/4276-8d00b74fe8d475a3.js",
          revision: "8d00b74fe8d475a3",
        },
        {
          url: "/_next/static/chunks/4696-7570922b091a0ed8.js",
          revision: "7570922b091a0ed8",
        },
        {
          url: "/_next/static/chunks/4723-8fd2c02c191e08cf.js",
          revision: "8fd2c02c191e08cf",
        },
        {
          url: "/_next/static/chunks/4bd1b696-100b9d70ed4e49c1.js",
          revision: "100b9d70ed4e49c1",
        },
        {
          url: "/_next/static/chunks/5139.e4ff9cc3669129ed.js",
          revision: "e4ff9cc3669129ed",
        },
        {
          url: "/_next/static/chunks/5239-fd1f2ddd6bc959f1.js",
          revision: "fd1f2ddd6bc959f1",
        },
        {
          url: "/_next/static/chunks/5476-fe05decf3477041b.js",
          revision: "fe05decf3477041b",
        },
        {
          url: "/_next/static/chunks/5707-c772769fd83b94ab.js",
          revision: "c772769fd83b94ab",
        },
        {
          url: "/_next/static/chunks/7278-0dfd93e043b30c17.js",
          revision: "0dfd93e043b30c17",
        },
        {
          url: "/_next/static/chunks/8700-f120035ae1eafcdf.js",
          revision: "f120035ae1eafcdf",
        },
        {
          url: "/_next/static/chunks/8716-83228827478654c2.js",
          revision: "83228827478654c2",
        },
        {
          url: "/_next/static/chunks/8916-af9c0250a22cd45d.js",
          revision: "af9c0250a22cd45d",
        },
        {
          url: "/_next/static/chunks/9011-c5ac774d782e408d.js",
          revision: "c5ac774d782e408d",
        },
        {
          url: "/_next/static/chunks/9055-0ce0c84d5c2e29f9.js",
          revision: "0ce0c84d5c2e29f9",
        },
        {
          url: "/_next/static/chunks/9511-e48007c389bf0337.js",
          revision: "e48007c389bf0337",
        },
        {
          url: "/_next/static/chunks/9638-4850373f61245e57.js",
          revision: "4850373f61245e57",
        },
        {
          url: "/_next/static/chunks/9961-3613b17a13ac930e.js",
          revision: "3613b17a13ac930e",
        },
        {
          url: "/_next/static/chunks/9972-6552c6c71285a15a.js",
          revision: "6552c6c71285a15a",
        },
        {
          url: "/_next/static/chunks/app/_not-found/page-af11b9ce3f92ab3b.js",
          revision: "af11b9ce3f92ab3b",
        },
        {
          url: "/_next/static/chunks/app/about/page-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/admin/announcements/page-eea6642527eb3596.js",
          revision: "eea6642527eb3596",
        },
        {
          url: "/_next/static/chunks/app/admin/blog/page-41080ac831120cc8.js",
          revision: "41080ac831120cc8",
        },
        {
          url: "/_next/static/chunks/app/admin/chefs/page-13ae67dc18948bb3.js",
          revision: "13ae67dc18948bb3",
        },
        {
          url: "/_next/static/chunks/app/admin/dashboard/page-094964f229d68d4b.js",
          revision: "094964f229d68d4b",
        },
        {
          url: "/_next/static/chunks/app/admin/events/page-67b3cc6f95aa5a54.js",
          revision: "67b3cc6f95aa5a54",
        },
        {
          url: "/_next/static/chunks/app/admin/order/%5Bid%5D/edit/page-04c1344015b9e84d.js",
          revision: "04c1344015b9e84d",
        },
        {
          url: "/_next/static/chunks/app/admin/order/page-5cb53572cf553732.js",
          revision: "5cb53572cf553732",
        },
        {
          url: "/_next/static/chunks/app/admin/product/%5Bid%5D/page-4de504442d61b0ad.js",
          revision: "4de504442d61b0ad",
        },
        {
          url: "/_next/static/chunks/app/admin/product/page-ee515d5ea745f798.js",
          revision: "ee515d5ea745f798",
        },
        {
          url: "/_next/static/chunks/app/admin/reports/page-1ebd8e9a8f512a67.js",
          revision: "1ebd8e9a8f512a67",
        },
        {
          url: "/_next/static/chunks/app/admin/reservations/page-3a719ddec7114380.js",
          revision: "3a719ddec7114380",
        },
        {
          url: "/_next/static/chunks/app/admin/settings/page-87e950d2f50be945.js",
          revision: "87e950d2f50be945",
        },
        {
          url: "/_next/static/chunks/app/admin/testimonials/page-2fb45b2d9b99a2a4.js",
          revision: "2fb45b2d9b99a2a4",
        },
        {
          url: "/_next/static/chunks/app/admin/users/page-07221be43d45a008.js",
          revision: "07221be43d45a008",
        },
        {
          url: "/_next/static/chunks/app/api/announcements/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/announcements/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/auth/login/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/auth/logout/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/auth/me/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/auth/register/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/blog-posts/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/blog-posts/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/chefs/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/chefs/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/contact/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/dashboard/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/delivery-fee/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/events/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/order-items/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/orders/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/orders/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/product/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/product/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/promos/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/promos/stats/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/reservations/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/send-email/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/testimonials/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/users/%5Bid%5D/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/api/users/route-12d5ed047bc99da2.js",
          revision: "12d5ed047bc99da2",
        },
        {
          url: "/_next/static/chunks/app/blog/page-b688def78e8beeff.js",
          revision: "b688def78e8beeff",
        },
        {
          url: "/_next/static/chunks/app/cart/page-5d7eeb5a996d21df.js",
          revision: "5d7eeb5a996d21df",
        },
        {
          url: "/_next/static/chunks/app/checkout/page-e43509ea8ff98105.js",
          revision: "e43509ea8ff98105",
        },
        {
          url: "/_next/static/chunks/app/chefs/page-a9320db104ff2c21.js",
          revision: "a9320db104ff2c21",
        },
        {
          url: "/_next/static/chunks/app/contact/page-bd3f3dc62d10a14d.js",
          revision: "bd3f3dc62d10a14d",
        },
        {
          url: "/_next/static/chunks/app/events/%5Bid%5D/page-6833751ccadeb2f4.js",
          revision: "6833751ccadeb2f4",
        },
        {
          url: "/_next/static/chunks/app/events/page-f4769f7129a6c01c.js",
          revision: "f4769f7129a6c01c",
        },
        {
          url: "/_next/static/chunks/app/layout-d6e76499db3b57dd.js",
          revision: "d6e76499db3b57dd",
        },
        {
          url: "/_next/static/chunks/app/login/page-6ae7e84f95e79b57.js",
          revision: "6ae7e84f95e79b57",
        },
        {
          url: "/_next/static/chunks/app/menu/page-433be1cfd4d8391b.js",
          revision: "433be1cfd4d8391b",
        },
        {
          url: "/_next/static/chunks/app/order-history/page-52b5ddf122da0f13.js",
          revision: "52b5ddf122da0f13",
        },
        {
          url: "/_next/static/chunks/app/order-success/page-b262707c6a16b71e.js",
          revision: "b262707c6a16b71e",
        },
        {
          url: "/_next/static/chunks/app/orders/page-3476dd2c1485ef8c.js",
          revision: "3476dd2c1485ef8c",
        },
        {
          url: "/_next/static/chunks/app/page-c8fb932222999492.js",
          revision: "c8fb932222999492",
        },
        {
          url: "/_next/static/chunks/app/promos/page-65b8056f22a836be.js",
          revision: "65b8056f22a836be",
        },
        {
          url: "/_next/static/chunks/app/register/page-0afbad8eebe2e06d.js",
          revision: "0afbad8eebe2e06d",
        },
        {
          url: "/_next/static/chunks/app/reservations/page-1675704e357dae2a.js",
          revision: "1675704e357dae2a",
        },
        {
          url: "/_next/static/chunks/app/testimonials/page-2bcf4a556bc6e069.js",
          revision: "2bcf4a556bc6e069",
        },
        {
          url: "/_next/static/chunks/framework-32492dd9c4fc5870.js",
          revision: "32492dd9c4fc5870",
        },
        {
          url: "/_next/static/chunks/main-7c64fc0f46ccc81f.js",
          revision: "7c64fc0f46ccc81f",
        },
        {
          url: "/_next/static/chunks/main-app-a5fa358081035d9a.js",
          revision: "a5fa358081035d9a",
        },
        {
          url: "/_next/static/chunks/pages/_app-e8b861c87f6f033c.js",
          revision: "e8b861c87f6f033c",
        },
        {
          url: "/_next/static/chunks/pages/_error-c8f84f7bd11d43d4.js",
          revision: "c8f84f7bd11d43d4",
        },
        {
          url: "/_next/static/chunks/polyfills-42372ed130431b0a.js",
          revision: "846118c33b2c0e922d7b3a7676f81f6f",
        },
        {
          url: "/_next/static/chunks/webpack-6a01eb86d9805c69.js",
          revision: "6a01eb86d9805c69",
        },
        {
          url: "/_next/static/css/064e16e1e279b542.css",
          revision: "064e16e1e279b542",
        },
        {
          url: "/_next/static/media/bibimbap.e26ab404.jpg",
          revision: "049918f059bff2febc9dfee202d70914",
        },
        {
          url: "/_next/static/media/bulgogi.ff6715a4.jpg",
          revision: "dba4fcc361d70b7cf8176fbe76cc445e",
        },
        {
          url: "/_next/static/media/kimchi-jjigae.6be18032.jpg",
          revision: "f8e966de09ffca049c6998d99848860b",
        },
        {
          url: "/bpi-bank-qr-code-for-payment.png",
          revision: "1914f37afef88ee3df7ca779eea84c65",
        },
        { url: "/file.svg", revision: "d09f95206c3fa0bb9bd9fefabfd0ea71" },
        {
          url: "/gcash-qr-code-for-payment.jpg",
          revision: "2a75ed454ce116bc57e2d13b39e451da",
        },
        { url: "/globe.svg", revision: "2aaafa6a49b6563925fe440891e32717" },
        {
          url: "/header/subtle-pattern.jpg",
          revision: "bc089e680a1e806968a2f0bd751be597",
        },
        {
          url: "/hero-korean-food.jpg",
          revision: "a12a8eb2147033127c4cdd9b0b28dfc1",
        },
        {
          url: "/icon512_maskable.png",
          revision: "233493b1ef528dec6fd780ab573cb921",
        },
        {
          url: "/icon512_rounded.png",
          revision: "233493b1ef528dec6fd780ab573cb921",
        },
        {
          url: "/images/abic-logo.png",
          revision: "04244b867e156a6dd0288ef8ee7ce791",
        },
        {
          url: "/images/bonga-logo.jpg",
          revision: "6622c5d01b7b7625609dcf0461c74faf",
        },
        {
          url: "/images/newbanner.png",
          revision: "c1ef51389554028c84b1bf6c97c4871c",
        },
        {
          url: "/korean-bbq-grilled-meat-on-table-grill.jpg",
          revision: "d56ef4fd81a1d778d7ea9f721ba29fd3",
        },
        {
          url: "/korean-bbq-grilled-meat-with-side-dishes.jpg",
          revision: "71f9846fd4a29a26bc444454dad32a81",
        },
        {
          url: "/korean-bibimbap-rice-bowl-with-colorful-vegetables.jpg",
          revision: "c279975c71ad653246e30a71df0f677f",
        },
        {
          url: "/korean-bibimbap-rice-bowl-with-vegetables-and-beef.jpg",
          revision: "68feeca125fdec1080d101d8b4ef912e",
        },
        {
          url: "/korean-kimchi-stew-in-stone-pot.jpg",
          revision: "c4250693caacd567d42a00031cfb1760",
        },
        {
          url: "/korean-kimchi-stew-jjigae-in-stone-pot.jpg",
          revision: "6f4f9b2b07e5e1af4a813a81c2109636",
        },
        { url: "/logo.png", revision: "1155dd8226f046d3be76b0ce975dfd7e" },
        { url: "/manifest.json", revision: "eca84a2ce1f4fc6c81da4e39006c9a25" },
        {
          url: "/maya-digital-wallet-qr-code-for-payment.png",
          revision: "aba06f6af045bd08bbd02c9123352ff2",
        },
        { url: "/next.svg", revision: "8e061864f388b47f33a1c3780831193e" },
        {
          url: "/paypal-qr-code-for-payment.png",
          revision: "a44432fe943e6a27b3a81ea185b3e2a9",
        },
        {
          url: "/swe-worker-5c72df51bb1f6ee0.js",
          revision: "76fdd3369f623a3edcf74ce2200bfdd0",
        },
        { url: "/vercel.svg", revision: "c0af2f507b369b085b35ef4bbe3bcf1e" },
        { url: "/window.svg", revision: "a2760511c65806022ad20adf74370ff3" },
      ],
      { ignoreURLParametersMatching: [/^utm_/, /^fbclid$/] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: function (e) {
              var a = e.response;
              return _async_to_generator(function () {
                return _ts_generator(this, function (e) {
                  return [
                    2,
                    a && "opaqueredirect" === a.type
                      ? new Response(a.body, {
                          status: 200,
                          statusText: "OK",
                          headers: a.headers,
                        })
                      : a,
                  ];
                });
              })();
            },
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 2592e3 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/static.+\.js$/i,
      new e.CacheFirst({
        cacheName: "next-static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4|webm)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [
          new e.RangeRequestsPlugin(),
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 48, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var a = e.sameOrigin,
          s = e.url.pathname;
        return !(
          !a ||
          s.startsWith("/api/auth/callback") ||
          !s.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          c = e.sameOrigin;
        return (
          "1" === a.headers.get("RSC") &&
          "1" === a.headers.get("Next-Router-Prefetch") &&
          c &&
          !s.startsWith("/api/")
        );
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc-prefetch",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var a = e.request,
          s = e.url.pathname,
          c = e.sameOrigin;
        return "1" === a.headers.get("RSC") && c && !s.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages-rsc",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        var a = e.url.pathname;
        return e.sameOrigin && !a.startsWith("/api/");
      },
      new e.NetworkFirst({
        cacheName: "pages",
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 }),
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      function (e) {
        return !e.sameOrigin;
      },
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [
          new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 }),
        ],
      }),
      "GET"
    ),
    (self.__WB_DISABLE_DEV_LOGS = !0);
});
