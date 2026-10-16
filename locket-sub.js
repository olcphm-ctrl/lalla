/**
 * locket-sub.js  v2.1
 * Locket — RevenueCat subscriber / receipts response patch
 *
 * Thay đổi so với v2.0:
 *   - Thêm subscriptions['Gold'] + entitlements['Locket'].product_identifier = 'Gold'
 *   - App check string 'Gold' để unlock 30s / voice / video 10s
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

    var GOLD_SKU = "locket_1600_1y";
    var EXPIRES  = "9999-01-01T00:00:00Z";
    var PURCHASE = "2020-01-01T00:00:00Z";

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
        store_transaction_id:       "2000001108724193",
        unsubscribe_detected_at:    null
    };

    function makeEnt(pid) {
        return {
            expires_date:              EXPIRES,
            grace_period_expires_date: null,
            product_identifier:        pid,
            purchase_date:             PURCHASE
        };
    }

    function patchSubscriber(sub) {
        sub.subscriptions     = sub.subscriptions     || {};
        sub.entitlements      = sub.entitlements      || {};
        sub.non_subscriptions = sub.non_subscriptions || {};
        sub.other_purchases   = sub.other_purchases   || {};

        // SKU thực — subscription record
        sub.subscriptions[GOLD_SKU] = goldSub;

        // NightMarket-compatible: key 'Gold', product_identifier = 'Gold'
        // App map string này → unlock 30s, voice, video 10s
        sub.subscriptions["Gold"]  = goldSub;
        sub.entitlements["Locket"] = makeEnt("Gold");

        // Cover thêm naming variants
        ["Gold", "gold", "GOLD", "premium", "Premium"].forEach(function (k) {
            sub.entitlements[k] = makeEnt(GOLD_SKU);
        });

        return sub;
    }

    // RevenueCat wrapped: { subscriber: {...} }
    if (obj.subscriber) {
        obj.subscriber = patchSubscriber(obj.subscriber);
    }

    // Array variant: { subscribers: [{...}] }
    if (Array.isArray(obj.subscribers)) {
        obj.subscribers = obj.subscribers.map(patchSubscriber);
    }

    // Unwrapped subscriber object
    if (obj.subscriptions !== undefined || obj.entitlements !== undefined) {
        obj = patchSubscriber(obj);
    }

    $done({ body: JSON.stringify(obj) });
})();
