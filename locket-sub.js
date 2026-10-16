/**
 * locket-sub.js  v2.0
 * Locket — RevenueCat subscriber / receipts response patch
 *
 * Inject Gold subscription + entitlement vào response.
 * Hoạt động với cả receipts lẫn subscribers endpoint.
 * Forward-compatible: giữ nguyên mọi field server trả về,
 * chỉ thêm / override phần subscription/entitlement.
 *
 * Target : api.revenuecat.com  (receipts$  |  subscribers/[id]$)
 * Type   : http-response
 * Tested : Locket 3.x – 6.x
 *
 * GitHub : olcphm-ctrl/locket-scripts
 */

(function () {
    var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";

    if (!ua.includes("Locket")) {
        $done({ body: $response.body });
        return;
    }

    var obj;
    try {
        obj = JSON.parse($response.body);
    } catch (e) {
        $done({ body: $response.body });
        return;
    }

    // ── Fake Gold subscription record ─────────────────────────────────────
    var GOLD_SKU   = "locket_1600_1y";
    var EXPIRES    = "9999-01-01T00:00:00Z";
    var PURCHASE   = "2020-01-01T00:00:00Z";

    var goldSub = {
        auto_resume_date:           null,
        billing_issues_detected_at: null,
        display_name:               GOLD_SKU,
        expires_date:               EXPIRES,
        grace_period_expires_date:  null,
        is_sandbox:                 true,
        management_url:             "https://apps.apple.com/account/subscriptions",
        original_purchase_date:     PURCHASE,
        ownership_type:             "PURCHASED",
        period_type:                "normal",
        price:                      { amount: 0.0, currency: "VND" },
        purchase_date:              PURCHASE,
        refunded_at:                null,
        store:                      "app_store",
        store_transaction_id:       "2000000000000001",
        unsubscribe_detected_at:    null
    };

    var goldEnt = {
        expires_date:       EXPIRES,
        grace_period_expires_date: null,
        product_identifier: GOLD_SKU,
        purchase_date:      PURCHASE
    };

    // ── Inject vào subscriber object ──────────────────────────────────────
    function patchSubscriber(sub) {
        sub.subscriptions = sub.subscriptions || {};
        sub.entitlements  = sub.entitlements  || {};
        sub.non_subscriptions       = sub.non_subscriptions       || {};
        sub.other_purchases         = sub.other_purchases         || {};

        // Subscription record — key theo SKU
        sub.subscriptions[GOLD_SKU] = goldSub;

        // Entitlements — cover nhiều key name app có thể check
        var entKeys = ["Gold", "gold", "GOLD", "Locket", "locket", "premium", "Premium"];
        entKeys.forEach(function (k) {
            sub.entitlements[k] = goldEnt;
        });

        return sub;
    }

    // RevenueCat trả về { subscriber: {...} }
    if (obj.subscriber) {
        obj.subscriber = patchSubscriber(obj.subscriber);
    }

    // Một số endpoint trả về { subscribers: [{...}] }
    if (Array.isArray(obj.subscribers)) {
        obj.subscribers = obj.subscribers.map(patchSubscriber);
    }

    // Nếu response là subscriber object trực tiếp (không wrapped)
    if (obj.subscriptions !== undefined || obj.entitlements !== undefined) {
        obj = patchSubscriber(obj);
    }

    $done({ body: JSON.stringify(obj) });
})();
