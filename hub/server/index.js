"use strict";
// https://github.com/natevw/node-nrf
var http = require("http");
var process = require("process");
var express = require('express')
var moment = require('moment')
var app = express()
var config = require('./config')
var cors = require('cors')
var bodyParser = require('body-parser')
let spiDev = "/dev/spidev0.0";
let cePin = 25;
let irqPin = 6;
var radio = require('nrf').connect(spiDev, cePin, irqPin);
radio.channel(0x4c).dataRate('1Mbps').crcBytes(2).autoRetransmit({count:15, delay:4000});
radio.begin(function () {
    var rx = radio.openPipe('rx', 0xF0F0F0F0E1),
        tx = radio.openPipe('tx', 0xF0F0F0F0D2);
    rx.pipe(tx);        // echo back everything
});

console.log("config",config)

var sqlite3 = require('sqlite3').verbose();
var db;

app.use(cors());
app.use(express.static('public'))
app.use(bodyParser.json())

var createTable = function() {
    console.log("createTable");
    db.run("CREATE TABLE IF NOT EXISTS stats (node INTEGER, type TEXT, value INTEGER, device INTEGER, created RECORD_TIME NOT NULL DEFAULT CURRENT_TIMESTAMP )");
}
db = new sqlite3.Database('db.sqlite3', createTable);

var databaseInsert = function(node,type,value,deviceId){
  if(deviceId==null)deviceId=0;
  //console.log("insert row",node,type,value,deviceId);
  var p = db.prepare("INSERT INTO stats VALUES (?,?,?,?,datetime('now','localtime'))");
  p.run(node,type,value,deviceId);
  p.finalize();
}

var databaseGetStats = function(){
  db.each("SELECT * FROM stats", function(err, row) {
      //console.log("row",row);
  });
}

var closeDb = function() {
    console.log("closeDb");
    db.close();
}

process.on('exit', function(code) {
  //https://www.tutorialspoint.com/nodejs/nodejs_process.htm
   console.log('About to exit with code:', code);
});

var getNodeConfig = function(id){
  for(let i = 0; i < config.nodes.length; i++){
    if(config.nodes[i].id==id)
      return config.nodes[i];
  }
}



app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.post('/insert', function(req, res){
  databaseInsert(req.body.node,req.body.type,req.body.value,req.body.deviceId);
})

app.get('/nodes', function (req, res) {
  var list = [];
  db.each("SELECT * FROM stats GROUP BY node ORDER BY created  DESC", function(err, row) {
    var node = Object.assign({},row,getNodeConfig(row.node));
    var dateLast = moment(node.created);
    var dateDiff = parseInt( moment.duration(moment().diff(dateLast)).asMinutes() );
    node.isAlive = (dateDiff<config.nodeUnavailableAfterMinutes);
    list.push(node);
  },function(){
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(list));
  });
})

app.get('/nodes/:id', function (req, res) {
  console.log("load for",req.params['id'])
  //var obj = {temperature:[],humidity:[],moisture:[]};
  var list = [];
  db.each("SELECT * FROM stats WHERE node = 1 GROUP BY device,type ORDER BY device ASC,type ASC,created DESC", function(err, row) {
    /*
    switch(row.type){
      case 't':
        obj.temperature.push(row);
        break;
      case 'h':
        obj.humidity.push(row);
        break;
      case 'm':
        obj.moisture.push(row);
        break;
    }
    */
    list.push(row);
  },function(){
    res.setHeader('Content-Type', 'application/json');
    //res.send(JSON.stringify(obj));
    res.send(JSON.stringify(list));
  });
})

app.get('/config', function (req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(config));
})

app.get('/statistics', function (req, res) {

  //http://127.0.0.1:8000/?days=15&type=temperature

  var days = req.query['days'] || 15;
  var type = req.query['type'] || 'temperature';
  var dbtype = 't';
  switch(type){
    case 'temperature':
      dbtype = 't';
      break;
    case 'humidity':
      dbtype = 'h';
      break;
    case 'moisture':
      dbtype = 'm';
      break;
  }

  var obj = {};
  //@TODO round to closes 5min
  db.each("SELECT * FROM stats WHERE type = '"+dbtype+"' AND created >= datetime( julianday(date('now'))-"+days+") ORDER BY created ASC", function(err, row) {
    var c = getNodeConfig(row.node);
    if(c==null) c = {group:'undefined',name:'undefined',color:'red'};

    row.label = c.group;

    if(obj[c.group]==null) obj[c.group] = {
      label: c.name,
      lineTension: 0.3,
      data:[],
      borderColor: c.color,
    };
    obj[c.group].data.push({x:moment(row.created).unix(),y:row.value});
  },function(){
    var out = {
      datasets:[],
    };
    for(let i in obj){
      out.datasets.push(obj[i]);
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(out));
  });
})


/*
app.configure(function() {

    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'cool beans' }));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(__dirname + '/public'));



});
*/

app.listen(8000, function () {
  console.log('Example app listening on port 8000!')
})




// for testing
var random = function(from,to){
  return Math.floor(Math.random() * to) + from;
}
var randomInsertTmp = function(){
  setTimeout(function(){
    var t;
    var v;
    var n = random(1,3);
    var d = 0;
    switch(random(1,4)){
      case 1: // humidity
        t = 'h';
        v = random(10,12)
        break;
      case 2: // temperature
        t = 't';
        v = random(15,22)
        break;
      case 3: // moisture
        t = 'm';
        v = random(22,43)
        d = random(0,14)
        break;
      case 4: // sun
        t = 's';
        v = random(0,10)
        break;
    }
    databaseInsert(n,t,v,d)
    randomInsertTmp();
  },500);

  databaseGetStats()
}
//randomInsertTmp();
