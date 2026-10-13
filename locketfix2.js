// locketfix2.js — RevenueCat response spoof for Locket Gold
// Stash/Surge-compatible

const url = $request.url;
let body = $response.body;

try {
  let data = JSON.parse(body);

  const ENTITLEMENT  = "Gold";
  const PRODUCT_ID   = "cam.locket.app.gold.yearly";
  const EXPIRES      = "2099-12-31T23:59:59Z";
  const PURCHASED    = "2024-01-01T00:00:00Z";

  const fakeEntitlement = {
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    product_identifier: PRODUCT_ID,
    purchase_date: PURCHASED
  };

  const fakeSub = {
    auto_resume_date: null,
    billing_issues_detected_at: null,
    expires_date: EXPIRES,
    grace_period_expires_date: null,
    is_sandbox: false,
    original_purchase_date: PURCHASED,
    ownership_type: "PURCHASED",
    period_type: "normal",
    purchase_date: PURCHASED,
    refund_at: null,
    store: "app_store",
    unsubscribe_detected_at: null
  };

  if (!data.subscriber) data.subscriber = {};

  data.subscriber.entitlements = data.subscriber.entitlements || {};
  data.subscriber.entitlements[ENTITLEMENT] = fakeEntitlement;

  data.subscriber.subscriptions = data.subscriber.subscriptions || {};
  data.subscriber.subscriptions[PRODUCT_ID] = fakeSub;

  $done({ body: JSON.stringify(data) });
} catch (e) {
  $done({ body });
}
