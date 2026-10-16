/**
 * locket-sub.js  v3.0
 * Locket — RevenueCat subscriber/receipts response patch
 *
 * v3.0 — non_subscriptions, other_purchases, active_subscriptions list,
 *         extended entitlement key coverage, shared date constants
 *
 * Target: api.revenuecat.com — receipts & subscribers endpoints
 * Type:   http-response
 *
 * Maintainer: tự host — không phụ thuộc server ngoài
 */

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

var now       = "2024-01-01T00:00:00Z";
var farFuture = "9999-01-09T10:10:14Z";

var goldSub = {
    auto_resume_date:           null,
    display_name:               "locket_1600_1y",
    is_sandbox:                 true,
    ownership_type:             "PURCHASED",
    billing_issues_detected_at: null,
    management_url:             "https://apps.apple.com/account/subscriptions",
    period_type:                "normal",
    price:                      { amount: 399000.0, currency: "VND" },
    expires_date:               farFuture,
    grace_period_expires_date:  null,
    refunded_at:                null,
    unsubscribe_detected_at:    null,
    original_purchase_date:     now,
    purchase_date:              now,
    store:                      "app_store",
    store_transaction_id:       "2000001108724193"
};

function makeEntitlement(productId) {
    return {
        grace_period_expires_date: null,
        purchase_date:             now,
        product_identifier:        productId,
        expires_date:              farFuture
    };
}

var nonSubRecord = [{
    id:                     "locket_lifetime_mock",
    is_sandbox:             true,
    original_purchase_date: now,
    purchase_date:          now,
    store:                  "app_store",
    store_transaction_id:   "2000001108724194"
}];

if (obj.subscriber) {
    obj.subscriber.subscriptions     = obj.subscriber.subscriptions     || {};
    obj.subscriber.entitlements      = obj.subscriber.entitlements      || {};
    obj.subscriber.non_subscriptions = obj.subscriber.non_subscriptions || {};
    obj.subscriber.other_purchases   = obj.subscriber.other_purchases   || {};
    obj.subscriber.first_seen        = obj.subscriber.first_seen        || now;

    // active_subscriptions — một số build check array này trực tiếp
    obj.subscriber.active_subscriptions = [
        "locket_1600_1y", "Gold", "gold_yearly"
    ];

    // ── Subscriptions ─────────────────────────────────────────────────────
    [
        "locket_1600_1y", "Gold", "gold_yearly",
        "locket_gold",    "locket_399_1y", "locket_gold_yearly"
    ].forEach(function (key) {
        obj.subscriber.subscriptions[key] = goldSub;
    });

    // ── Entitlements — mọi key variant đã biết ───────────────────────────
    [
        "Gold", "gold", "GOLD",
        "premium", "Premium", "PREMIUM",
        "locket_gold", "gold_yearly", "GoldYearly"
    ].forEach(function (key) {
        obj.subscriber.entitlements[key] = makeEntitlement("locket_1600_1y");
    });

    // NMS path — product_identifier phải là "Gold" (capital G)
    obj.subscriber.entitlements["Locket"] = makeEntitlement("Gold");

    // ── Non-subscriptions (lifetime check path) ───────────────────────────
    [
        "locket_lifetime", "lifetime",
        "Lifetime",        "locket_one_time"
    ].forEach(function (key) {
        obj.subscriber.non_subscriptions[key] = nonSubRecord;
    });
}

$done({ body: JSON.stringify(obj) });
