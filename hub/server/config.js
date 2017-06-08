exports = module.exports = config = {
  nodes: [
    {
      id: 1,
      name: 'Outdoor 1',
      group:'outdoor',
      color:'green',
      design: {
        image: 'outdoor1.png',
        moisture:[

          {device:0,x:66,y:70},
          {device:1,x:66,y:156},
          {device:2,x:66,y:244},

          {device:3,x:235,y:104},
          {device:4,x:315,y:104},
          {device:5,x:400,y:104},
          {device:6,x:480,y:104},
          {device:7,x:570,y:104},
          {device:8,x:644,y:104},

          {device:9,x:235,y:240},
          {device:10,x:315,y:240},
          {device:11,x:400,y:240},
          {device:12,x:480,y:240},
          {device:13,x:570,y:240},
          {device:14,x:644,y:240},

        ],
        temperature:[
          {device:0,x:160,y:60},
        ],
        humidity: [
          {device:0,x:160,y:255},
        ],
      },
    },
    {id: 2, name: 'Outdoor 2',group:'outdoor',color:'blue'},
    {id: 3, name: 'Indoor 3',group:'indoor',color:'orange'}
  ],
  nodeUnavailableAfterMinutes: 20,
  refreshIntervalMilliseconds: 10000,
  refreshIntervalNodeMilliseconds: 10000,
}
