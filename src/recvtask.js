import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'


const ndk = new NDK({
    explicitRelayUrls: relays,
    devWriteRelayUrls: relays,
    signer:new NDKPrivateKeySigner(Keypriv)
});

await ndk.connect();
let relaySets =  NDKRelaySet.fromRelayUrls(ndk._explicitRelayUrls, ndk);



let kind    = 42


export async function recv_task(eventid,handlerEvent ) {
    let filters = {"kinds":[42],"#e":[eventid],"limit":30}

    let sub = ndk.subscribe(filters,{},
                        relaySets,true)
    sub.on("event" ,async (Nevent) => {
	        
    		await handlerEvent(Nevent)
    })


}

