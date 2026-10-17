/**
 * locket-rc.js  v4.0
 * Locket — Firebase Remote Config response patch
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

    // ── Duration — đổi số này để thay duration ───────────────────────────
    var MAX_DURATION     = 60.0;
    var MAX_DURATION_STR = "60.0";

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

    // ── 5. Camera ─────────────────────────────────────────────────────────
    try {
        mergeJsonEntry("camera", {
            gold_max_duration:  MAX_DURATION,
            goldMaxDuration:    MAX_DURATION,
            max_duration:       MAX_DURATION,
            maxDuration:        MAX_DURATION,
            ultra_wide:         true,
            ultraWide:          true,
            volume_button:      true,
            volumeButton:       true,
            flash_button:       true,
            telephoto:          true,
            quality_mbps:       1.2,
            qualityMbps:        1.2,
            night_mode:         true,
            nightMode:          true,
            enhanced_low_light: true,
            ar_filters:         true,
            arFilters:          true,
            timer_enabled:      true,
            grid_enabled:       true,
            zoom_max:           10.0,
            srgb:               true,
            lanczos:            true
        });
    } catch (e) {}

    // ── 6. Camera roll ────────────────────────────────────────────────────
    try {
        mergeJsonEntry("camera_roll", {
            gold_max_duration:              MAX_DURATION,
            goldMaxDuration:               MAX_DURATION,
            video_max_duration:            MAX_DURATION,
            videoMaxDuration:              MAX_DURATION,
            max_duration:                  MAX_DURATION,
            maxDuration:                   MAX_DURATION,
            trim_max_duration:             MAX_DURATION,
            trimMaxDuration:               MAX_DURATION,
            camera_roll_max_duration:      MAX_DURATION,
            camera_roll_video_max_duration:MAX_DURATION,
            max_file_size:                 104857600,
            max_upload_bytes:              104857600,
            max_size_bytes:                104857600,
            quality_mbps:                  1.2,
            qualityMbps:                   1.2,
            flash_button:                  true,
            gold_required:                 false,
            enabled:                       true,
            video_enabled:                 true,
            live_photo_enabled:            true
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
        ].forEach(function (k) { obj.entries[k] = MAX_DURATION_STR; });

        mergeEntries({
            camera_roll_preview_enabled:               "true",
            camera_roll_video_enabled:                 "true",
            camera_roll_video_upload_enabled:          "true",
            internal_camera_roll_video_upload_enabled: "true",
            longer_camera_roll_videos_enabled:         "true",
            video_sound_enabled:                       "true",
            microphone_enabled:                        "true",
            camera_microphone_enabled:                 "true",
            audio_session_deactivation_enabled:        "true",
            zoom_enabled:                              "true",
            zoom_max_level:                            "10.0",
            max_file_size:                             "104857600",
            max_upload_bytes:                          "104857600",
            upload_main_image_quality:                 "1.0",
            upload_main_image_size:                    "1440",
            upload_thumbnail_image_quality:            "1.0",
            upload_thumbnail_image_size:               "1020"
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
            signup_max_friends_count:          "999999",
            celebrity_inbox_limit:             "999999",
            hide_friends_enabled:              "true",
            show_all_contacts:                 "true",
            show_invite_suggestions:           "true",
            friend_suggestions_enabled:        "true",
            improved_friend_suggestions:       "true",
            contact_sync_enabled:              "true",
            show_no_friends_bottom_sheet:      "false",
            signup_allow_skip_add_friends:     "true"
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
            moment_views_enabled:               "true",
            moment_views_v2:                    "true",
            record_moment_views:                "true",
            notify_moment_views:                "true",
            get_moment_views_as_cloud_function: "true",
            moment_reactions_v2:                "true",
            chat_reactions_enabled:             "true",
            conversation_reactions:             "true",
            typing_indicators_enabled:          "true",
            unsend_message_enabled:             "true",
            reply_prototype_enabled:            "true",
            messages_integration:               "true",
            conversations_enabled:              "true",
            fetch_moments_in_conversation:      "true",
            hide_chat_button:                   "false",
            groups_enabled:                     "true",
            rollcall_enabled:                   "true",
            rollcall_comment_actions:           "true",
            rollcall_profile_button:            "true",
            read_receipts_enabled:              "true",
            message_requests_enabled:           "true",
            voice_messages_enabled:             "true",
            send_to_self_only_mode:             "always_enabled",
            time_travel_rewind_v2_enabled:      "true",
            calendar_delete_moment_enabled:     "true"
        });
    } catch (e) {}

    // ── 12. Widget, UI ────────────────────────────────────────────────────
    try {
        mergeEntries({
            widget_badge_enabled:           "true",
            widget_badge_v2:                "true",
            widget_frame_event_max_images:  "10",
            notification_preferences:       "true",
            notification_reply_body_visible:"true",
            activity_bar_enabled:           "true",
            journal_activity_bar_enabled:   "true",
            custom_profile_pics:            "true",
            profile_menu_v2_enabled:        "true",
            dark_mode_enabled:              "true",
            haptic_feedback_enabled:        "true",
            animated_ui_enabled:            "true",
            custom_widget_frames:           "enabled",
            custom_widget_frames_enabled:   "true"
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

        mergeJsonEntry("journal_settings", {
            debug_menu_enabled:                false,
            focus_animation:                   true,
            compact_header:                    true,
            friends_button:                    true,
            reverse_scroll_direction:          false,
            streak_visualization:              true,
            streak_visualization_style:        "gradient",
            streak_header_minimum_count:       0,
            streak_visualization_minimum_count:2,
            overlay_indicators: { location:true, music:true, static_content:true, weather:true }
        });
    } catch (e) {}

    // ── 13. CDN, cache ────────────────────────────────────────────────────
    try {
        mergeEntries({
            image_cache_max_age_sec: "157680000",
            image_cache_max_size:    "400000000",
            get_latest_moment_v2:    "true",
            beta_features_enabled:   "true",
            preload_enabled:         "true",
            prefetch_enabled:        "true"
        });
    } catch (e) {}

    // ── 14. Captions & filters ────────────────────────────────────────────
    try {
        mergeEntries({
            captions_enabled:                   "true",
            music_caption_enabled:              "true",
            music_caption_song_preview_enabled: "true",
            link_caption_link_enabled:          "true",
            overlay_navigator_enabled:          "true",
            overlays_v2_config:                 { suggestions_enabled: true },
            caption_gold_required:              "false",
            long_captions_gold_required:        "false",
            caption_max_length:                 "500",
            emoji_reactions_enabled:            "true",

            camera_filter_config: {
                allows_custom_filters: true,
                show_filter_button:    true,
                sheet_enabled:         true,
                open_sheet_immediately:true,
                sheet_filters: [
                    { title:{en:"Goofy"},    filter_ids:["okay_wig","influencer","looks_maxxing","toothless","bye_brows"] },
                    { title:{en:"Looks"},    filter_ids:["bowling_ball","blonde_bleached","beard","bob_cut","buns","tatted","mohawk","braces","bye_brows"] },
                    { title:{en:"Celebrate"},filter_ids:["slimed","princess","disco_lights","cash_money","happy_birthday"] },
                    { title:{en:"Cute"},     filter_ids:["cutesy","sticker_face","flower_crown","love_bug"] },
                    { title:{en:"Costumes"}, filter_ids:["wedding","cowboy_cowgirl","giraffe","clown"] },
                    { title:{en:"Holidays"}, filter_ids:["easter_bunney_cutout","easter_chick_cutout","bearded","leprechaun","lucky_face","sweet_hearts","elf_cutout","santa_cutout","frosty"] }
                ],
                picker_filters:[
                    "okay_wig","influencer","looks_maxxing","toothless","bye_brows",
                    "bowling_ball","blonde_bleached","beard","bob_cut","buns",
                    "tatted","mohawk","braces","slimed","princess",
                    "disco_lights","cash_money","happy_birthday","cutesy","sticker_face",
                    "flower_crown","love_bug","wedding","cowboy_cowgirl","giraffe",
                    "clown","easter_bunney_cutout","easter_chick_cutout","bearded","leprechaun",
                    "lucky_face","sweet_hearts","elf_cutout","santa_cutout","frosty"
                ]
            },

            overlay_dynamic_captions: [
                "standard","poll","color_palette","review","music","location",
                "weather","time","streak","star_sign","party_time","locket_count",
                "good_morning","goodnight","ootd","miss_you","custom","halloween_2026"
            ],

            overlay_items: [
                {
                    section:"🎨 General",
                    items:[
                        {overlay_id:"caption:standard",     source:"local",caption:{type:"standard"}},
                        {overlay_id:"caption:review",       source:"local",caption:{type:"review"}},
                        {overlay_id:"caption:music",        source:"local",caption:{type:"music"}},
                        {overlay_id:"caption:location",     source:"local",caption:{type:"location"}},
                        {overlay_id:"caption:weather",      source:"local",caption:{type:"weather"}},
                        {overlay_id:"caption:time",         source:"local",caption:{type:"time"}},
                        {overlay_id:"caption:streak",       source:"local",caption:{type:"streak"}},
                        {overlay_id:"caption:star_sign",    source:"local",caption:{type:"star_sign"}},
                        {overlay_id:"caption:poll",         source:"local",caption:{type:"poll"}},
                        {overlay_id:"caption:color_palette",source:"local",caption:{type:"color_palette"}},
                        {overlay_id:"caption:locket_count", source:"local",caption:{type:"locket_count"}}
                    ]
                },
                {
                    section:"🎨 Holiday",
                    items:[
                        {overlay_id:"caption:halloween_2026",    source:"remote",caption:{background:{colors:["#150804","#C8540D"]},icon:{data:"🎃",type:"emoji"},max_lines:1,text:"Halloween",text_color:"#FFB182",type:"static_content"}},
                        {overlay_id:"caption:autumn_2026",       source:"remote",caption:{background:{colors:["#FFE0A0","#F6A53A"]},icon:{data:"🍂",type:"emoji"},max_lines:1,text:"Xin chào Mùa Thu",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:christmas_eve_2026",source:"remote",caption:{background:{colors:["#2FA85F","#176B3A"]},icon:{data:"🕯️",type:"emoji"},max_lines:1,text:"Giáng sinh an lành",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:christmas_day_2026",source:"remote",caption:{background:{colors:["#E53935","#A81818"]},icon:{data:"🎄",type:"emoji"},max_lines:1,text:"Giáng sinh an lành",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:new_years_eve_2026",source:"remote",caption:{background:{colors:["#FFC64B","#FFEDBF"]},icon:{data:"🥂",type:"emoji"},max_lines:1,text:"Xin chào 2027!",text_color:"#643F00",type:"static_content"}},
                        {overlay_id:"caption:new_years_day_2027",source:"remote",caption:{background:{colors:["#3B00EC","#823FFF"]},icon:{data:"💫",type:"emoji"},max_lines:1,text:"Xin chào 2027!",text_color:"#FFFFFF",type:"static_content"}}
                    ]
                },
                {
                    section:"🎨 Decorative",
                    items:[
                        {overlay_id:"caption:party_time",  source:"remote",caption:{background:{colors:["#5EFFF5","#FCFF57"]},icon:{data:"🪩",type:"emoji"},max_lines:1,text:"Party Time!",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:good_morning",source:"remote",daily_start_hour:5,daily_end_hour:10,caption:{background:{colors:["#EF7402","#EABF0F"]},icon:{data:"☀️",type:"emoji"},max_lines:1,text:"Good morning",text_color:"#FFFFFFE5",type:"static_content"}},
                        {overlay_id:"caption:goodnight",   source:"remote",daily_start_hour:19.5,daily_end_hour:24,caption:{background:{colors:["#370C6F","#575CD4"]},icon:{data:"🌙",type:"emoji"},max_lines:1,text:"Goodnight",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:ootd",        source:"remote",caption:{background:{colors:["#FFFFFF","#DBDBDB"]},icon:{data:"🕶",type:"emoji"},max_lines:1,text:"OOTD",text_color:"#101010E6",type:"static_content"}},
                        {overlay_id:"caption:miss_you",    source:"remote",caption:{background:{colors:["#EC0C00","#FF493F"]},icon:{data:"🥰",type:"emoji"},max_lines:1,text:"Miss you",text_color:"#FFFFFFDB",type:"static_content"}}
                    ]
                },
                {
                    section:"🎨 Độc lạ",
                    items:[
                        {overlay_id:"caption:chay_ngay_di",       source:"remote",caption:{background:{colors:["#D31027","#EA384D"]},icon:{data:"🏃💨",type:"emoji"},max_lines:1,text:"Chạy ngay đi",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:cu_tu_tu_khoai",     source:"remote",caption:{background:{colors:["#56AB2F","#A8E063"]},icon:{data:"🥔",type:"emoji"},max_lines:1,text:"Cứ từ từ khoai sẽ nhừ",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:kiem_tra_nhan_pham", source:"remote",caption:{background:{colors:["#654EA3","#EAAFC8"]},icon:{data:"🎲",type:"emoji"},max_lines:1,text:"Kiểm tra nhân phẩm",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:ai_so_thi_di_ve",   source:"remote",caption:{background:{colors:["#B71C1C","#FF5722"]},icon:{data:"🏃",type:"emoji"},max_lines:1,text:"ai sợ thì đi về",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:con_cai_nit",        source:"remote",caption:{background:{colors:["#D7CCC8","#8D6E63"]},icon:{data:"🧶",type:"emoji"},max_lines:1,text:"còn cái nịt",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:canh_bao_co_hat",   source:"remote",caption:{background:{colors:["#9C27B0","#E91E63"]},icon:{data:"🎤",type:"emoji"},max_lines:1,text:"cảnh báo có hát",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:dep_trai_co_gi_sai",source:"remote",caption:{background:{colors:["#FF5722","#FFC107"]},icon:{data:"😎",type:"emoji"},max_lines:1,text:"Đẹp trai có gì sai",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:dam_nhau_khong",    source:"remote",caption:{background:{colors:["#E53935","#FF7043"]},icon:{data:"🥊",type:"emoji"},max_lines:1,text:"đấm nhau không",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:sieu_cap_ba_khi",   source:"remote",caption:{background:{colors:["#EC407A","#F44336"]},icon:{data:"🐉",type:"emoji"},max_lines:1,text:"siêu cấp bá khí",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:doi_roi",           source:"remote",caption:{background:{colors:["#FF5F6D","#FFC371"]},icon:{data:"😤",type:"emoji"},max_lines:1,text:"Dỗi rồi",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:dang_ban_tuong_tu", source:"remote",caption:{background:{colors:["#1A2980","#26D0CE"]},icon:{data:"💭",type:"emoji"},max_lines:1,text:"Đang bận tương tư",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:muon_duoc_om",      source:"remote",caption:{background:{colors:["#FF9A9E","#FECFEF"]},icon:{data:"🫂",type:"emoji"},max_lines:1,text:"Muốn được ôm",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:mo_hon_nhung_tam_hien",source:"remote",caption:{background:{colors:["#FFB75E","#ED8F03"]},icon:{data:"🐤",type:"emoji"},max_lines:1,text:"Mỏ hỗn nhưng tâm hiền",text_color:"#FFFFFF",type:"static_content"}}
                    ]
                },
                {
                    section:"🎨 Trend",
                    items:[
                        {overlay_id:"caption:hoi_chieu_troi_mua",    source:"remote",caption:{background:{colors:["#546E7A","#263238"]},icon:{data:"🌧️",type:"emoji"},max_lines:1,text:"Hồi chiều trời mưa...",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:roi_let_luon",           source:"remote",caption:{background:{colors:["#FF9A9E","#FECFEF","#FBC2EB","#A6C1EE"]},icon:{data:"💅",type:"emoji"},max_lines:1,text:"rồi lét luôn",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:roi_gay_luon",           source:"remote",caption:{background:{colors:["#FF6EC7","#7873F5","#4ADEDE","#FFE66D"]},icon:{data:"🌈",type:"emoji"},max_lines:1,text:"rồi gay luôn",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:tuyet_doi_khong_nghe",   source:"remote",caption:{background:{colors:["#FF416C","#FF4B2B"]},icon:{data:"🙉",type:"emoji"},max_lines:1,text:"Tuyệt đối không nghe",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:co_bien_co_bien",        source:"remote",caption:{background:{colors:["#FF512F","#F09819","#FFD200"]},icon:{data:"🚨",type:"emoji"},max_lines:1,text:"Có biến có biến",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:hong_drama",             source:"remote",caption:{background:{colors:["#8A2387","#E94057","#F27121"]},icon:{data:"🍿",type:"emoji"},max_lines:1,text:"Hóng drama",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:cuoi_vcl_m_oi",          source:"remote",caption:{background:{colors:["#F7971E","#FFD200","#FFEE58"]},icon:{data:"😂",type:"emoji"},max_lines:1,text:"Cười vcl m oi",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:vl_m_oi",                source:"remote",caption:{background:{colors:["#1F1C2C","#928DAB","#C9D6FF"]},icon:{data:"😳",type:"emoji"},max_lines:1,text:"vl m ơi?",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:flex_den_hoi_tho_cuoi",  source:"remote",caption:{background:{colors:["#F7971E","#FFD200"]},icon:{data:"💎",type:"emoji"},max_lines:1,text:"Flex đến hơi thở cuối",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:overthinking_vai_chuong",source:"remote",caption:{background:{colors:["#2C3E50","#4CA1AF"]},icon:{data:"🤯",type:"emoji"},max_lines:1,text:"Overthinking vai chưởng",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:chan_bo_may_di",         source:"remote",caption:{background:{colors:["#870000","#190A05"]},icon:{data:"🙄",type:"emoji"},max_lines:1,text:"Chan bố mày đi",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:oach_xa_lach",           source:"remote",caption:{background:{colors:["#11998E","#38EF7D"]},icon:{data:"🥬",type:"emoji"},max_lines:1,text:"oách xà lách",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:ua_alo",                 source:"remote",caption:{background:{colors:["#8E2DE2","#4A00E0"]},icon:{data:"📞",type:"emoji"},max_lines:1,text:"Ủa alo",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:hom_nay_toi_buon",       source:"remote",caption:{background:{colors:["#141E30","#243B55"]},icon:{data:"🥀",type:"emoji"},max_lines:1,text:"hôm nay tôi buồn",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:tram_cam_nhe",           source:"remote",caption:{background:{colors:["#1F1C2C","#928DAB"]},icon:{data:"🫠",type:"emoji"},max_lines:1,text:"Trầm cảm nhẹ",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:lai_phai_lo",            source:"remote",caption:{background:{colors:["#FBD3E9","#BB377D","#6A0572"]},icon:{data:"💔",type:"emoji"},max_lines:1,text:"lại phải lọ",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:xinh_dep_tuyet_voi",     source:"remote",caption:{background:{colors:["#FC5C7D","#6A82FB"]},icon:{data:"💅",type:"emoji"},max_lines:1,text:"Xinh đẹp tuyệt vời",text_color:"#FFFFFFE6",type:"static_content"}}
                    ]
                },
                {
                    section:"🎨 Gen Z Life",
                    items:[
                        {overlay_id:"caption:hao_han",           source:"remote",caption:{background:{colors:["#114357","#F29492"]},icon:{data:"🗡️",type:"emoji"},max_lines:1,text:"Hảo hán",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:bat_luc",           source:"remote",caption:{background:{colors:["#2C3E50","#3498DB"]},icon:{data:"🏳️",type:"emoji"},max_lines:1,text:"Bất lực",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:rot_nuoc_mat",      source:"remote",caption:{background:{colors:["#1CB5E0","#000046"]},icon:{data:"😭",type:"emoji"},max_lines:1,text:"Rớt nước mắt",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:guc_nga",           source:"remote",caption:{background:{colors:["#3A1C71","#D76D77"]},icon:{data:"📉",type:"emoji"},max_lines:1,text:"Gục ngã",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:tien_dinh",         source:"remote",caption:{background:{colors:["#C33764","#1D2671"]},icon:{data:"🌪️",type:"emoji"},max_lines:1,text:"Tiền đình",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:che_manh",          source:"remote",caption:{background:{colors:["#FF4E50","#F9D423"]},icon:{data:"👎",type:"emoji"},max_lines:1,text:"Chê mạnh",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:xinh_gai_an_phim", source:"remote",caption:{background:{colors:["#F77062","#FE5196"]},icon:{data:"💅",type:"emoji"},max_lines:1,text:"Xinh gái ấn phím 1",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:di_lam_vi_dam_me", source:"remote",caption:{background:{colors:["#FDC830","#F37335"]},icon:{data:"🤡",type:"emoji"},max_lines:1,text:"Đi làm vì đam mê",text_color:"#FFFFFF",type:"static_content"}},
                        {overlay_id:"caption:xin_lui_duoc_chua",source:"remote",caption:{background:{colors:["#F6D365","#FDA085"]},icon:{data:"🥺",type:"emoji"},max_lines:1,text:"Xin lũi được chưa",text_color:"#000000",type:"static_content"}},
                        {overlay_id:"caption:luon_vui_tuoi",     source:"remote",caption:{background:{colors:["#00F2FE","#4FACFE"]},icon:{data:"🤡",type:"emoji"},max_lines:1,text:"Luôn vui tươi",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:khong_cam_xuc",     source:"remote",caption:{background:{colors:["#434343","#000000"]},icon:{data:"🗿",type:"emoji"},max_lines:1,text:"Không cảm xúc",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:phu_huynh_dung_xem",source:"remote",caption:{background:{colors:["#FF0844","#FFB199"]},icon:{data:"🙈",type:"emoji"},max_lines:1,text:"Phụ huynh đừng xem",text_color:"#FFFFFFE6",type:"static_content"}}
                    ]
                },
                {
                    section:"🎨 Đời sống",
                    items:[
                        {overlay_id:"caption:cuoi_xiu",         source:"remote",caption:{background:{colors:["#FFEB3B","#FF9800"]},icon:{data:"😎",type:"emoji"},max_lines:1,text:"Cười xỉu",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:toang_that_roi",   source:"remote",caption:{background:{colors:["#F44336","#B71C1C"]},icon:{data:"🐉",type:"emoji"},max_lines:1,text:"Toang thật rồi",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:khong_the_tin_noi",source:"remote",caption:{background:{colors:["#00BCD4","#0097A7"]},icon:{data:"❓",type:"emoji"},max_lines:1,text:"Không thể tin nổi",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:ngay_moi_vui_ve",  source:"remote",caption:{background:{colors:["#4CAF50","#2E7D32"]},icon:{data:"☀️",type:"emoji"},max_lines:1,text:"Ngày mới vui vẻ",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:ngu_ngon",         source:"remote",caption:{background:{colors:["#3F51B5","#1A237E"]},icon:{data:"🌙",type:"emoji"},max_lines:1,text:"Ngủ ngon",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:an_com_chua",      source:"remote",caption:{background:{colors:["#FF9800","#F57C00"]},icon:{data:"🍽️",type:"emoji"},max_lines:1,text:"Ăn cơm chưa?",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:di_choi_khong",    source:"remote",caption:{background:{colors:["#E91E63","#C2185B"]},icon:{data:"✈️",type:"emoji"},max_lines:1,text:"Đi chơi không?",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:coffee_time",      source:"remote",caption:{background:{colors:["#4E342E","#8D6E63"]},icon:{data:"☕",type:"emoji"},max_lines:1,text:"Coffee Time!",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:cinema_time",      source:"remote",caption:{background:{colors:["#1A237E","#455A64"]},icon:{data:"🎬",type:"emoji"},max_lines:1,text:"Cinema Time!",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:shopping_time",    source:"remote",caption:{background:{colors:["#B3E5FC","#FFFFFF"]},icon:{data:"🛍️",type:"emoji"},max_lines:1,text:"Shopping Time!",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:dating_time",      source:"remote",caption:{background:{colors:["#E91E63","#F44336"]},icon:{data:"💕",type:"emoji"},max_lines:1,text:"Dating Time!",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:deadline_ruot",    source:"remote",caption:{background:{colors:["#ED213A","#93291E"]},icon:{data:"🔥",type:"emoji"},max_lines:1,text:"Deadline dí tụt quần",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:tien_dau_ma_tieu", source:"remote",caption:{background:{colors:["#11998E","#38EF7D"]},icon:{data:"💸",type:"emoji"},max_lines:1,text:"Tiền đâu mà tiêu",text_color:"#FFFFFFE6",type:"static_content"}},
                        {overlay_id:"caption:tinh_hoa_hoi_tu",  source:"remote",caption:{background:{colors:["#FFD700","#FF8C00"]},icon:{data:"✨",type:"emoji"},max_lines:1,text:"Tinh hoa hội tụ",text_color:"#000000E6",type:"static_content"}},
                        {overlay_id:"caption:ngoan_xinh_yeu",   source:"remote",caption:{background:{colors:["#FFAFBD","#FFC3A0"]},icon:{data:"🌸",type:"emoji"},max_lines:1,text:"Ngoan xinh yêu của ai?",text_color:"#000000E6",type:"static_content"}}
                    ]
                }
            ]
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

    // ── 17. AR / Night mode ───────────────────────────────────────────────
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

    // ── 19. Profile ───────────────────────────────────────────────────────
    try {
        mergeEntries({
            profile_customization_enabled: "true",
            profile_theme_enabled:         "true",
            profile_bio_enabled:           "true",
            profile_link_enabled:          "true",
            profile_theme_gold_required:   "false",
            custom_profile_frame_enabled:  "true",
            profile_analytics_enabled:     "true",
            view_profile_enabled:          "true",
            qr_code_config:                { profile_enabled:true, scanning_enabled:true }
        });
    } catch (e) {}

    // ── 20. Version-specific ──────────────────────────────────────────────
    try {
        if (versionAtLeast(6, 0)) {
            mergeEntries({ nms_enabled:"true", nms_gold_required:"false", moment_format_v2:"true" });
        }
        if (versionAtLeast(5, 0)) {
            mergeEntries({ reactions_v2_enabled:"true", group_moments_enabled:"true", group_gold_required:"false" });
        }
        if (versionAtLeast(4, 0)) {
            mergeEntries({ views_enabled:"true", views_gold_required:"false", views_analytics_enabled:"true" });
        }
    } catch (e) {}

    $done({ body: JSON.stringify(obj) });

})();
