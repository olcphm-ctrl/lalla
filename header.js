// header.js — request header cleaner
// Stash/Surge-compatible

let headers = $request.headers;

// Xoá headers khiến RC bỏ qua cached response
delete headers["If-None-Match"];
delete headers["If-Modified-Since"];
delete headers["Cache-Control"];

$done({ headers });
