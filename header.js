// header.js — strip etag headers to force 200 response with body
var headers = $request.headers;

delete headers["X-Revenuecat-Etag"];
delete headers["x-revenuecat-etag"];
delete headers["If-None-Match"];
delete headers["if-none-match"];

$done({ headers: headers });
