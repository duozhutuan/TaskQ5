export let channel_info = {
  id: '27bc0c85d8b52a4c016b8c22790447da94f819609cb597babdf3603a82e5fbbe',
  kind: 40,
  pubkey: 'bccf33d867d2fb0b02905297efd8dc9edabae6576214b9ef0c636ab94b705625',
  created_at: 1732151769,
  content: '{"name": "taskq5 requests", "about": "TaskQ5 is a task distribution platform where you can post tasks if you need help.", "picture": "https://duozhutuan.com/logo.svg","relays": [  "wss://relay1.nostrchat.io","wss://relay2.nostrchat.io","wss://relay.damus.io","wss://relay.snort.social","wss://nos.lol"]}',
  tags: [],
  sig: '7a85a205c4669f689437aa4abb9588c932f153cfb53e9b43ab4a388f2e9c5d7a140d3b244b1dbf3d19c8f8b000961e9597d6b19c2ae05d7df5eb2febc835a188'
}

export let relayServer =  [  'wss://relay1.nostrchat.io',
  'wss://relay2.nostrchat.io',
  'wss://relay.damus.io',
  'wss://strfry.iris.to',
  'wss://nos.lol',
];

let hub = "wss://relay.duozhutuan.com/";
//let hub = "";
export let relays = relayServer.map(relay => hub + relay );

