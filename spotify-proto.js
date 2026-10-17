// language: JavaScript, file: spotify-proto.js
// target: Spotify spclient — /bootstrap/v1/bootstrap + /user-customization-service/v1/customize
// decodes protobuf response, injects Premium account attributes, re-encodes

let protobuf;
// [protobuf.js bundle — giữ nguyên toàn bộ phần bundle phía dưới]
!function(g){"use strict";/* ... giữ nguyên bundle ... */}();

const spotifyJson = {/* ... giữ nguyên spotifyJson ... */};

// ── Cache types once per invocation — tránh build root tree 2 lần ──
const spotifyRoot       = protobuf.Root.fromJSON(spotifyJson);
const bootstrapType     = spotifyRoot.lookupType("BootstrapResponse");
const ucsWrapperType    = spotifyRoot.lookupType("UcsResponseWrapper");

console.log(`[Spotify] 2026-10-17`);

const resStatus = $response.status ?? $response.statusCode;
if (resStatus !== 200) {
    console.log(`[Spotify] skip — status ${resStatus}`);
    $done({});
} else {
    const url    = $request.url;
    const method = $request.method;
    const isQuanX = typeof $task !== "undefined";
    const binaryBody = isQuanX
        ? new Uint8Array($response.bodyBytes)
        : $response.body;

    let body = null;

    try {
        if (url.includes("bootstrap/v1/bootstrap") && method === "POST") {
            const msg = bootstrapType.decode(binaryBody);
            processMapObj(
                msg.ucsResponseV0.success.customization.success
                   .accountAttributesSuccess.accountAttributes
            );
            body = bootstrapType.encode(msg).finish();
            console.log("[Spotify] bootstrap — done");

        } else if (url.includes("user-customization-service/v1/customize") && method === "POST") {
            const msg = ucsWrapperType.decode(binaryBody);
            processMapObj(
                msg.success.accountAttributesSuccess.accountAttributes
            );
            body = ucsWrapperType.encode(msg).finish();
            console.log("[Spotify] customize — done");

        } else {
            console.log(`[Spotify] path/method mismatch: ${method} ${url}`);
            $done({});
            // exit early — body stays null
        }
    } catch (e) {
        console.log(`[Spotify] decode/encode error: ${e}`);
        $notification.post("Spotify unlock", "Script error", String(e));
        $done({});
        // exit early
    }

    if (body !== null) {
        if (isQuanX) {
            $done({ bodyBytes: body.buffer.slice(body.byteOffset, body.byteOffset + body.byteLength) });
        } else {
            $done({ body });
        }
    }
}

function processMapObj(map) {
    map['smart-shuffle']                                  = { stringValue: 'AVAILABLE'  };
    map['is-euterpe']                                     = { boolValue:   true         };
    map['has-audiobooks-subscription']                    = { boolValue:   true         };
    map['type']                                           = { stringValue: 'premium'    };
    map['payments-initial-campaign']                      = { stringValue: 'prepaid'    };

    const endDateStr = (() => {
        const d = new Date();
        d.setMonth(d.getMonth() + 1);
        return d.toISOString().split('.')[0] + "Z";
    })();

    map['subscription-enddate']                           = { stringValue: endDateStr   };
    map['product-expiry']                                 = { stringValue: endDateStr   };
    map['social-session-free-tier']                       = { boolValue:   false        };
    map['can_use_superbird']                              = { boolValue:   true         };
    map['jam-social-session']                             = { stringValue: 'EXPANDED'   };
    map['offline']                                        = { boolValue:   true         };
    map['audio-quality']                                  = { stringValue: '1'          };
    map['shuffle-algorithm']                              = { stringValue: 'RANDOM'     };
    map['is-thalia']                                      = { boolValue:   true         };
    map['shuffle']                                        = { boolValue:   false        };
    map['is-pigeon']                                      = { boolValue:   true         };
    map['nft-disabled']                                   = { stringValue: '1'          };
    map['libspotify']                                     = { boolValue:   true         };
    map['high-bitrate']                                   = { boolValue:   true         };
    map['unrestricted']                                   = { boolValue:   true         };
    map['catalogue']                                      = { stringValue: 'premium'    };
    map['your-library-tags']                              = { boolValue:   true         };
    map['ads']                                            = { boolValue:   false        };
    map['on-demand']                                      = { boolValue:   true         };
    map['name']                                           = { stringValue: 'Spotify Premium' };
    map['loudness-levels']                                = { stringValue: '1:-5.0,0.0,3.0:-2.0' };
    map['social-session']                                 = { boolValue:   true         };
    map['pick-and-shuffle']                               = { boolValue:   false        };
    map['offline-backup']                                 = { stringValue: 'UNRESTRICTED' };
    map['lyrics-offline']                                 = { boolValue:   true         };
    map['financial-product']                              = { stringValue: 'pr:premium,tc:0' };
    map['streaming-rules']                                = { stringValue: ''           };
    map['mixing-tools']                                   = { stringValue: 'EDIT'       };
    map['mobile']                                         = { boolValue:   true         };
    map['player-license']                                 = { stringValue: 'premium'    };
    map['com.spotify.madprops.use.ucs.product.state']     = { boolValue:   true         };
    map['com.spotify.madprops.delivered.by.ucs']          = { boolValue:   true         };
}
