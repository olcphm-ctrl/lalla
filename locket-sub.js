/**
 * locket-sub.js
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

// Fake Gold subscription — expires far future
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

// Inject into subscriber object
if (obj.subscriber) {
    obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
    obj.subscriber.entitlements  = obj.subscriber.entitlements  || {};

    obj.subscriber.subscriptions["locket_1600_1y"] = goldSub;
    obj.subscriber.entitlements["Gold"]            = goldEntitlement;

    // Cover alternate entitlement key names app may check
    obj.subscriber.entitlements["gold"]            = goldEntitlement;
    obj.subscriber.entitlements["Locket"]          = goldEntitlement;
}

$done({ body: JSON.stringify(obj) });
