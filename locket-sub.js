/**
 * locket-sub.js  v2.1
 * Locket — RevenueCat subscriber/receipts response patch
 * Injects active Gold entitlement
 *
 * Target: api.revenuecat.com — receipts & subscribers endpoints
 * Type:   http-response
 *
 * Maintainer: tự host — không phụ thuộc server ngoài
 */

var ua  = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
var obj = JSON.parse($response.body);

if (!ua.includes("Locket")) {
    $done({ body: $response.body });
    return;
}

var goldSub = {
    auto_resume_date:           null,
    display_name:               "locket_1600_1y",
    is_sandbox:                 true,
    ownership_type:             "PURCHASED",
    billing_issues_detected_at: null,
    management_url:             "https://apps.apple.com/account/subscriptions",
    period_type:                "normal",
    price:                      { amount: 399000.0, currency: "VND" },
    expires_date:               "9999-01-09T10:10:14Z",
    grace_period_expires_date:  null,
    refunded_at:                null,
    unsubscribe_detected_at:    null,
    original_purchase_date:     "2024-01-01T00:00:00Z",
    purchase_date:              "2024-01-01T00:00:00Z",
    store:                      "app_store",
    store_transaction_id:       "2000001108724193"
};

var goldEntitlement = {
    grace_period_expires_date: null,
    purchase_date:             "2024-01-01T00:00:00Z",
    product_identifier:        "locket_1600_1y",
    expires_date:              "9999-01-09T10:10:14Z"
};

var goldEntitlementNMS = {
    grace_period_expires_date: null,
    purchase_date:             "2024-01-01T00:00:00Z",
    product_identifier:        "Gold",
    expires_date:              "9999-01-09T10:10:14Z"
};

if (obj.subscriber) {
    obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
    obj.subscriber.entitlements  = obj.subscriber.entitlements  || {};

    // Subscription records
    obj.subscriber.subscriptions["locket_1600_1y"] = goldSub;
    obj.subscriber.subscriptions["Gold"]           = goldSub;

    // Entitlements — cover mọi key app có thể check
    obj.subscriber.entitlements["Gold"]    = goldEntitlement;
    obj.subscriber.entitlements["gold"]    = goldEntitlement;
    obj.subscriber.entitlements["GOLD"]    = goldEntitlement;
    obj.subscriber.entitlements["premium"] = goldEntitlement;

    // NMS-compatible: product_identifier = 'Gold' → unlock 30s, voice, video
    obj.subscriber.entitlements["Locket"]  = goldEntitlementNMS;
}

$done({ body: JSON.stringify(obj) });
