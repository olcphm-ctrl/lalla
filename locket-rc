/**
 * locket-rc.js  v3.0
 * Locket — Firebase Remote Config response patch
 *
 * v3.0 — version-aware branching, memories / catch-up / AR /
 *         night mode / share / profile extended, paywall hardened
 *
 * GitHub : olcphm-ctrl/locket-scripts
 */

(function () {
    // ── Guard ─────────────────────────────────────────────────────────────
    var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "";
    if (!ua.includes("Locket")) {
        $done({ body: $response.body });
        return;
    }

    // ── Version parse ─────────────────────────────────────────────────────
    var appVersion = [0, 0, 0];
    var verMatch = ua.match(/Locket\/(\d+)\.(\d+)\.?(\d*)/);
    if (verMatch) {
        appVersion = [
            parseInt(verMatch[1], 10) || 0,
            parseInt(verMatch[2], 10) || 0,
            parseInt(verMatch[3], 10) || 0
        ];
    }

    function versionAtLeast(major, minor, patch) {
        minor = minor || 0; patch = patch || 0;
        if (appVersion[0] !== major) return appVersion[0] > major;
        if (appVersion[1] !== minor) return appVersion[1] > minor;
        return appVersion[2] >= patch;
    }

    // ── Parse ─────────────────────────────────────────────────────────────
    var obj;
    try {
        obj = JSON.parse($response.body);
    } catch (e) {
        $done({ body: $response.body });
        return;
    }

    obj.entries = obj.entries || {};
    obj.state   = "UPDATE";

    // ── Helpers ───────────────────────────────────────────────────────────
    function mergeEntries(patch) {
        Object.keys(patch).forEach(function (k) {
            var v = patch[k];
            obj.entries[k] = (typeof v === "object" && v !== null)
                ? JSON.stringify(v) : String(v);
        });
    }

    function mergeJsonEntry(key, patch) {
        var base = {};
        try { base = JSON.parse(obj.entries[key] || "{}"); } catch (e) {}
        Object.assign(base, patch);
        obj.entries[key] = JSON.stringify(base);
    }

    // ── 1. Gold feature gates ─────────────────────────────────────────────
    try {
        var fgBase = {};
        try { fgBase = JSON.parse(obj.entries["feature_gates"] || "{}"); } catch (e) {}
        Object.assign(fgBase, {
            app_icon_picker:      "enabled",
            camera_roll:          "enabled",
            camera_theme:         "enabled",
            locket_views:         "enabled",
            long_captions:        "enabled",
            longer_video:         "enabled",
            unlimited_friends:    "enabled",
            priority_support:     "enabled",
            profile_badge:        "enabled",
            remove_ads:           "enabled",
            video:                "enabled",
            custom_widget_frames: "enabled",
            streak_recovery:      "enabled",
            locket_gold:          "enabled",
            gold_features:        "enabled",
            premium:              "enabled",
            memories:             "enabled",
            flashback:            "enabled",
            ar_filters:           "enabled",
            night_mode:           "enabled",
            share_moment:         "enabled",
            catch_up:             "enabled",
            multi_send:           "enabled",
            profile_theme:        "enabled",
            reactions_extended:   "enabled"
        });
        obj.entries["feature_gates"] = JSON.stringify(fgBase);
    } catch (e) {}

    // ── 2. Upsell / paywall ───────────────────────────────────────────────
    try {
        mergeEntries({
            upsell_features: {
                app_icon_picker:      true,
                camera_roll:          true,
                camera_theme:         true,
                locket_views:         true,
                remove_ads:           true,
                custom_widget_frames: true,
                memories:             true,
                ar_filters:           true,
                night_mode:           true,
                share_moment:         true,
                catch_up:             true,
                profile_theme:        true
            },
            paywall_presentation_config: {
                uid:                   "paywall_disabled",
                onboarding:            false,
                after_sent_moment:     false,
                on_foreground:         false,
                on_camera_roll_access: false,
                on_friend_limit:       false,
                on_video_access:       false,
                on_filter_access:      false,
                on_memory_access:      false,
                on_catch_up_access:    false,
                interval:              2592000,
                profile_banner:        false,
                settings_banner:       false
            },
            android_subscribe_gold_button_enabled: "false",
            profile_badge_visible:                 "true",
            gold_upsell_enabled:                   "false",
            show_upgrade_prompt:                   "false",
            paywall_enabled:                       "false"
        });
    } catch (e) {}

    // ── 3. Ads ────────────────────────────────────────────────────────────
    try {
        mergeEntries({
            history_ads_mode:               "off",
            history_ads_prefetch_count:     "0",
            history_ads_prefetch_immediate: "false",
            history_ads_dynamic_insertion:  "false",
            ads_enabled:                    "false",
            show_ads:                       "false",
            interstitial_ads_enabled:       "false",
            banner_ads_enabled:             "false",
            rewarded_ads_enabled:           "false",
            native_ads_enabled:             "false",
            ad_frequency:                   "0",
            ad_interval:                    "99999"
        });
    } catch (e) {}

    // ── 4. Sentry ─────────────────────────────────────────────────────────
    try {
        mergeEntries({
            sentry_sample_rate:          "0",
            sentry_network_tracing:      "false",
            sentry_performance_tracking: "false",
            sentry_trace_sample_rate:    "0",
            sentry_profiles_sample_rate: "0",
            sentry_enabled:              "false"
        });
    } catch (e) {}

    // ── 5. Camera — 30s ───────────────────────────────────────────────────
    try {
        mergeJsonEntry("camera", {
            gold_max_duration:  30.0,
            goldMaxDuration:    30.0,
            max_duration:       30.0,
            maxDuration:        30.0,
            ultra_wide:         true,
            ultraWide:          true,
            volume_button:      true,
            flash_button:       true,
            telephoto:          true,
            quality_mbps:       0.9,
            night_mode:         true,
            nightMode:          true,
            enhanced_low_light: true,
            ar_filters:         true,
            arFilters:          true,
            timer_enabled:      true,
            grid_enabled:       true,
            zoom_max:           10.0
        });
    } catch (e) {}

    // ── 6. Camera roll — 30s ──────────────────────────────────────────────
    try {
        mergeJsonEntry("camera_roll", {
            gold_max_duration:        30.0,
            goldMaxDuration:          30.0,
            video_max_duration:       30.0,
            videoMaxDuration:         30.0,
            max_duration:             30.0,
            trim_max_duration:        30.0,
            camera_roll_max_duration: 30.0,
            quality_mbps:             0.9,
            flash_button:             true,
            gold_required:            false,
            enabled:                  true,
            video_enabled:            true,
            live_photo_enabled:       true
        });
    } catch (e) {}

    // ── 7. Flat duration keys ─────────────────────────────────────────────
    try {
        [
            "camera_roll_video_max_duration",
            "camera_roll_max_duration",
            "camera_roll_duration",
            "max_video_duration",
            "video_max_duration",
            "video_trim_max_duration",
            "trim_max_duration",
            "gold_max_duration",
            "goldMaxDuration",
            "maxDuration",
            "max_duration",
            "memory_max_duration",
            "catch_up_max_duration"
        ].forEach(function (k) { obj.entries[k] = "30.0"; });

        mergeEntries({
            camera_roll_preview_enabled:       "true",
            camera_roll_video_enabled:         "true",
            camera_roll_video_upload_enabled:  "true",
            longer_camera_roll_videos_enabled: "true",
            video_sound_enabled:               "true",
            microphone_enabled:                "true",
            camera_microphone_enabled:         "true",
            zoom_enabled:                      "true",
            zoom_max_level:                    "10.0"
        });
    } catch (e) {}

    // ── 8. Live photos ────────────────────────────────────────────────────
    try {
        mergeJsonEntry("live_photos", {
            capture:             true,
            viewing:             true,
            catch_up:            true,
            widget_looping_mode: "never",
            gold_required:       false,
            enabled:             true
        });
    } catch (e) {}

    // ── 9. Friends ────────────────────────────────────────────────────────
    try {
        mergeEntries({
            max_friends_count:                 "999999",
            friend_limit_mode:                 "0",
            soft_friend_limit_threshold_count: "999999",
            hard_friend_limit_count:           "999999",
            show_friend_limit_on_cam:          "false",
            hide_friends_enabled:              "true",
            show_all_contacts:                 "true",
            friend_suggestions_enabled:        "true",
            contact_sync_enabled:              "true"
        });
    } catch (e) {}

    // ── 10. Streak ────────────────────────────────────────────────────────
    try {
        var streak = {};
        try { streak = JSON.parse(obj.entries["streak_config"] || "{}"); } catch (e2) {}
        streak.minimum_recovery_count = 0;
        streak.minimum_display_count  = 0;
        streak.recovery_enabled       = true;
        streak.gold_required          = false;
        streak.streak_gold_required   = false;
        streak.recovery_gold_required = false;
        obj.entries["streak_config"]  = JSON.stringify(streak);
    } catch (e) {}

    // ── 11. Moments, chat ─────────────────────────────────────────────────
    try {
        mergeEntries({
            moment_views_enabled:      "true",
            moment_reactions_v2:       "true",
            chat_reactions_enabled:    "true",
            typing_indicators_enabled: "true",
            unsend_message_enabled:    "true",
            conversations_enabled:     "true",
            groups_enabled:            "true",
            rollcall_enabled:          "true",
            read_receipts_enabled:     "true",
            message_requests_enabled:  "true",
            voice_messages_enabled:    "true"
        });
    } catch (e) {}

    // ── 12. Widget, UI ────────────────────────────────────────────────────
    try {
        mergeEntries({
            widget_badge_enabled:     "true",
            widget_badge_v2:          "true",
            notification_preferences: "true",
            activity_bar_enabled:     "true",
            custom_profile_pics:      "true",
            profile_menu_v2_enabled:  "true",
            dark_mode_enabled:        "true",
            haptic_feedback_enabled:  "true",
            animated_ui_enabled:      "true"
        });

        mergeJsonEntry("widget_config", {
            max_friends:         999,
            gold_required:       false,
            custom_frames:       true,
            animated_frames:     true,
            frame_gold_required: false,
            stacked_view:        true,
            large_widget:        true,
            medium_widget:       true,
            small_widget:        true
        });
    } catch (e) {}

    // ── 13. CDN, cache ────────────────────────────────────────────────────
    try {
        mergeEntries({
            cdn_domain_replacements: { "firebasestorage.googleapis.com": "cdn.locketcamera.com" },
            image_cache_max_age_sec: "157680000",
            image_cache_max_size:    "400000000",
            get_latest_moment_v2:    "true",
            beta_features_enabled:   "true",
            preload_enabled:         "true",
            prefetch_enabled:        "true"
        });
    } catch (e) {}

    // ── 14. Captions, filters ─────────────────────────────────────────────
    try {
        mergeEntries({
            captions_enabled:            "true",
            music_caption_enabled:       "true",
            overlay_navigator_enabled:   "true",
            caption_gold_required:       "false",
            long_captions_gold_required: "false",
            caption_max_length:          "500",
            emoji_reactions_enabled:     "true"
        });
    } catch (e) {}

    // ── 15. Memories / Flashback ──────────────────────────────────────────
    try {
        mergeEntries({
            memories_enabled:            "true",
            flashback_enabled:           "true",
            flashback_gold_required:     "false",
            memories_gold_required:      "false",
            on_this_day_enabled:         "true",
            memory_notification_enabled: "true",
            memory_max_count:            "9999",
            memory_playback_enabled:     "true"
        });
    } catch (e) {}

    // ── 16. Catch-up / Multi-send ─────────────────────────────────────────
    try {
        mergeEntries({
            catch_up_enabled:          "true",
            catch_up_gold_required:    "false",
            catch_up_max_count:        "99",
            multi_send_enabled:        "true",
            send_to_all_enabled:       "true",
            send_to_all_gold_required: "false",
            batch_send_enabled:        "true"
        });
    } catch (e) {}

    // ── 17. AR filters / Night mode ───────────────────────────────────────
    try {
        mergeEntries({
            ar_filters_enabled:      "true",
            camera_filters_enabled:  "true",
            filter_gold_required:    "false",
            ar_effects_enabled:      "true",
            lens_enabled:            "true",
            night_mode_enabled:      "true",
            low_light_mode_enabled:  "true",
            enhanced_camera_enabled: "true",
            portrait_mode_enabled:   "true",
            portrait_gold_required:  "false"
        });
    } catch (e) {}

    // ── 18. Share / Export ────────────────────────────────────────────────
    try {
        mergeEntries({
            share_to_instagram_enabled: "true",
            export_enabled:             "true",
            save_to_camera_roll:        "true",
            share_moment_enabled:       "true",
            share_gold_required:        "false",
            export_gold_required:       "false",
            watermark_enabled:          "false",
            watermark_gold_required:    "false"
        });
    } catch (e) {}

    // ── 19. Profile extended ──────────────────────────────────────────────
    try {
        mergeEntries({
            profile_customization_enabled: "true",
            profile_theme_enabled:         "true",
            profile_bio_enabled:           "true",
            profile_link_enabled:          "true",
            profile_theme_gold_required:   "false",
            custom_profile_frame_enabled:  "true",
            profile_analytics_enabled:     "true",
            view_profile_enabled:          "true"
        });
    } catch (e) {}

    // ── 20. Version-specific ─────────────────────────────────────────────
    try {
        if (versionAtLeast(6, 0)) {
            mergeEntries({
                nms_enabled:       "true",
                nms_gold_required: "false",
                moment_format_v2:  "true"
            });
        }
        if (versionAtLeast(5, 0)) {
            mergeEntries({
                reactions_v2_enabled:  "true",
                group_moments_enabled: "true",
                group_gold_required:   "false"
            });
        }
        if (versionAtLeast(4, 0)) {
            mergeEntries({
                views_enabled:          "true",
                views_gold_required:    "false",
                views_analytics_enabled:"true"
            });
        }
    } catch (e) {}

    $done({ body: JSON.stringify(obj) });
})();
