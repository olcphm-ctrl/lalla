/**
 * locket-header.js
 * Locket — RevenueCat request header patch
 * Clears X-RevenueCat-ETag so server always returns a fresh
 * subscriber response instead of a cached 304
 *
 * Target: api.revenuecat.com
 * Type:   http-request
 *
 * Maintainer: tự host — không phụ thuộc server ngoài
 */

var headers = $request.headers;

// Clear ETag — handles both casing variants
var key = Object.keys(headers).find(k => k.toLowerCase() === "x-revenuecat-etag");
if (key) {
    headers[key] = "";
} else {
    headers["X-RevenueCat-ETag"] = "";
}

$done({ headers: headers });
