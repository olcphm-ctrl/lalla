// language: JavaScript, file: soundcloud.js
// target: api-mobile.soundcloud.com/configuration/ios — response rewrite
// upgrades plan to Go+ and enables all premium feature flags

const resStatus = $response.status ?? $response.statusCode;

if (resStatus !== 200) {
    console.log(`[SoundCloud] skip — status ${resStatus}`);
    $done({});
} else {
    try {
        const obj = JSON.parse($response.body);

        obj.plan = {
            vendor: "apple",
            id: "high_tier",
            manageable: true,
            plan_upsells: [],
            plan_id: "go-plus",
            upsells: [],
            plan_name: "SoundCloud Go+"
        };

        obj.features = [
            { name: "offline_sync",               enabled: true,  plans: ["mid_tier", "high_tier"] },
            { name: "no_audio_ads",               enabled: true,  plans: ["mid_tier", "high_tier"] },
            { name: "hq_audio",                   enabled: true,  plans: ["high_tier"] },
            { name: "system_playlist_in_library", enabled: true,  plans: [] },
            { name: "ads_krux",                   enabled: false, plans: [] },
            { name: "new_home",                   enabled: true,  plans: [] },
            { name: "spotlight",                  enabled: false, plans: [] }
        ];

        $done({ body: JSON.stringify(obj) });
    } catch (e) {
        console.log(`[SoundCloud] parse/stringify error: ${e}`);
        $notification.post("SoundCloud unlock", "Script error", String(e));
        $done({});
    }
}
