/**
 * locket-header.js  v3.0
 * Locket — RevenueCat request header patch
 *
 * v3.0 — thêm Pragma: no-cache
 *
 * Target : api.revenuecat.com  (receipts, subscribers)
 * Type   : http-request
 *
 * GitHub : olcphm-ctrl/locket-scripts
 */

(function () {
    var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

    if (!ua.includes("Locket")) {
        $done({});
        return;
    }

    var headers = $request.headers;

    var stripList = [
        "x-revenuecat-etag",
        "if-none-match",
        "if-modified-since",
        "if-unmodified-since",
        "if-match"
    ];

    Object.keys(headers).forEach(function (k) {
        if (stripList.indexOf(k.toLowerCase()) !== -1) {
            delete headers[k];
        }
    });

    headers["Cache-Control"] = "no-cache, no-store";
    headers["Pragma"]        = "no-cache";

    $done({ headers: headers });
})();
