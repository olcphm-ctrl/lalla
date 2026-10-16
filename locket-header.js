/**
 * locket-header.js  v2.0
 * Locket — RevenueCat request header patch
 *
 * Xóa ETag / conditional-request headers để server luôn trả về
 * response đầy đủ (200) thay vì cache 304.
 *
 * Target : api.revenuecat.com  (receipts, subscribers)
 * Type   : http-request
 * Tested : Locket 3.x – 6.x
 *
 * GitHub : olcphm-ctrl/locket-scripts
 */

(function () {
    var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

    // Chỉ chạy cho Locket; bỏ qua app khác dùng chung RevenueCat
    if (!ua.includes("Locket")) {
        $done({});
        return;
    }

    var headers = $request.headers;

    // Danh sách headers cần xóa — case-insensitive
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

    // Đảm bảo không bao giờ gửi ETag dù key viết hoa hay thường
    headers["Cache-Control"] = "no-cache, no-store";

    $done({ headers: headers });
})();
