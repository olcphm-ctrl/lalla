/**
 * locket-header.js  v4.0
 * Locket — RevenueCat request header patch
 *
 * GitHub : olcphm-ctrl/locket-scripts
 */

var headers = $request.headers;

var key = Object.keys(headers).find(function (k) {
    return k.toLowerCase() === "x-revenuecat-etag";
});

if (key) {
    headers[key] = "";
} else {
    headers["X-RevenueCat-ETag"] = "";
}

$done({ headers: headers });
