// locketfix2.js — spoof Locket Gold via revenuecat response
var body = $response.body;

try {
  var obj = JSON.parse(body);

  if (obj && obj.subscriber) {
    var now = new Date();
    var future = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
    var nowISO = now.toISOString();
    var futureISO = future.toISOString();

    var fakeEnt = {
      expires_date: futureISO,
      grace_period_expires_date: null,
      product_identifier: "com.locket.Locket.gold.monthly",
      purchase_date: nowISO
    };

    var fakeSub = {
      auto_resume_date: null,
      billing_issues_detected_at: null,
      expires_date: futureISO,
      grace_period_expires_date: null,
      is_sandbox: false,
      original_purchase_date: nowISO,
      ownership_type: "PURCHASED",
      period_type: "normal",
      product_plan_identifier: null,
      purchase_date: nowISO,
      refunded_at: null,
      store: "app_store",
      unsubscribe_detected_at: null
    };

    if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
    if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

    // inject cả 3 tên có thể dùng
    obj.subscriber.entitlements["gold"] = fakeEnt;
    obj.subscriber.entitlements["locket_gold"] = fakeEnt;
    obj.subscriber.entitlements["pro"] = fakeEnt;

    obj.subscriber.subscriptions["com.locket.Locket.gold.monthly"] = fakeSub;
    obj.subscriber.subscriptions["com.locket.Locket.gold.annual"] = fakeSub;

    $done({ body: JSON.stringify(obj) });
  } else {
    $done({});
  }
} catch (e) {
  $done({});
}
