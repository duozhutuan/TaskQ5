import NDK ,{NDKPrivateKeySigner,NDKRelaySet,NDKEvent} from "@nostr-dev-kit/ndk";
import "websocket-polyfill";

import {channel_info,relays,relayServer,rejectSelfTasks} from './config.js'
import {        Keypub,
        Keypriv,
        bech32PrivateKey,
        bech32PublicKey} from './getkey.js'
import {log} from './log.js'


let kind    = 42

function timeSince(created_at){

	// 当前时间戳 (毫秒)
	const now = Date.now() / 1000;
	// 计算时间差 (毫秒)
	const timeDifference = now - created_at;

	// 转换为天、小时、分钟和秒
	const seconds = Math.floor(timeDifference);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	console.log(`New event publish at ${days}天 ${hours % 24}小时 ${minutes % 60}分钟 ${seconds % 60}秒 之前`);

}

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
	    timeSince(Nevent.created_at)
	    
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

