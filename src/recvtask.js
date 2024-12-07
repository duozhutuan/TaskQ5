import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer,rejectSelfTasks} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'
import {log} from './log.js'


let kind    = 42


export async function recv_task(eventid,handlerEvent ) {
	let ndk = new NDK({
    		explicitRelayUrls: relays,
    		devWriteRelayUrls: relays,
    		signer:new NDKPrivateKeySigner(Keypriv)
	});

	await ndk.connect();
	let relaySets =  NDKRelaySet.fromRelayUrls(ndk._explicitRelayUrls, ndk);

    	let attempts = setInterval(() => {
        	ndk.pool.relays.forEach((relay, key) => {
            	relay.connectivity._connectionStats.attempts = 1;
        	});
    	}, 10000);




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
    
    ndk.pool.on("relay:ready",(relay)=>{
	log.gray(relay.url)
        relay.subscribe(sub, sub.filters);
    })

    setTimeout(()=>{
	clearInterval(attempts);
	ndk.pool.off('relay:ready',() =>{})
	sub = null;
	ndk = null;
	//start new ndk    
	recv_task(eventid,handlerEvent );
    }, 20 * 60 * 1000);
	
}

