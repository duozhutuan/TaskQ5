import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer,rejectSelfTasks} from './config.js'
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

    setInterval(() => {
        ndk.pool.relays.forEach((relay, key) => {
            relay.connectivity._connectionStats.attempts = 1;
        });
    }, 10000);


let kind    = 42


export async function recv_task(eventid,handlerEvent ) {
    let filters = {"kinds":[42],"#e":[eventid],"limit":30}

    let sub = ndk.subscribe(filters,{},
                        relaySets,true)

    sub.on("event" ,async (Nevent) => {

	    if (rejectSelfTasks && Nevent.pubkey == Keypub){
                console.log("rejectSelfTasks = true, Don't execute ",Keypub,"task")
                return
            }
            handlerEvent(Nevent);

    })

    ndk.pool.on("relay:connect",(relay)=>{
        relay.subscribe(sub, sub.filters);
    })
	
}

