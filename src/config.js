export let channel_info = {
  content: '{"name":"TaskQ5","about":"TaskQ5 is a task distribution platform where you can post tasks if you need help.","picture":"https://raw.githubusercontent.com/duozhutuan/taskq5/refs/heads/main/docs/logo.png","relays":["wss://relay1.nostrchat.io","wss://relay2.nostrchat.io","wss://purplerelay.com/","wss://relay.damus.io","wss://strfry.iris.to","wss://nos.lol","wss://nostr.slothy.win","wss://xmr.usenostr.org","wss://at.nostrworks.com","wss://btc.klendazu.com","wss://relay.nostrified.org","wss://news.utxo.one","wss://bitcoinmaximalists.online/","wss://nostr.tbai.me:592/"]}',
  created_at: 1732847026,
  id: '33dc840f93f36b4bbdd84244200ab1c8b2f299e2033d40731eefc8ca3af78281',
  kind: 40,
  pubkey: 'bccf33d867d2fb0b02905297efd8dc9edabae6576214b9ef0c636ab94b705625',
  sig: '8fc5cf19ec3c57df94131cfd69442adfb372853c45866ada57d5346c656d3fb1e7fb0d60e7be4564630c63be4bf395f0569201ce995f649f82f77b6eff3e016b',
  tags: [],
}

export let relayServer =  [  
  'wss://relay1.nostrchat.io',
  'wss://relay2.nostrchat.io',
  'wss://purplerelay.com/',
  'wss://relay.damus.io',
  'wss://strfry.iris.to',
  'wss://nos.lol',
  'wss://nostr.slothy.win',
  'wss://xmr.usenostr.org',
  'wss://at.nostrworks.com',  
  'wss://btc.klendazu.com',
  'wss://relay.nostrified.org',
  'wss://news.utxo.one',
  'wss://bitcoinmaximalists.online/',
  'wss://nostr.tbai.me:592/',

];

//let hub = "wss://bridge.duozhutuan.com/";
let hub = "";
export let relays = relayServer.map(relay => hub + relay );

export const rejectSelfTasks = true;

