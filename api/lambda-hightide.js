event = {};
process.env.TZ = 'Australia/Sydney'
const http = require('http');
const zlib = require("zlib");

var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var dateTime = require('node-datetime');
var dt = dateTime.create();
var d = dt.format('Y-m-d');
var report = []
var buffer = [];


parser.on('error', function(err) { console.log('Parser error', err); });

const options = {
  hostname: 'www.bom.gov.au',
  path: '/ntc/IDO59001/IDO59001_2021_VIC_TP009.xml',
  headers: { 'User-Agent': 'Mozilla/5.0 (X11; CrOS x86_64 13816.82.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.218 Safari/537.36',
  'Host': 'www.bom.gov.au',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
  'Cookie': '__utma=172860464.456594757.1622178828.1622178828.1622178828.1; __utmc=172860464; __utmz=172860464.1622178828.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); _easyab_seed=630.7793953918866; _hjTLDTest=1; _hjid=bccab30f-26e4-46e7-8ec5-1f358e2a5ae1; bm_sv=1DECE32E29D7503310B2F1DF86546AA7~TG5MzDwriZC0wvjWoiXF4O56EPexh+f9ZCT+igosoK2T15XIAzob9C+YXdW/h6FCuoJmuUTPsrD0tsypCig252Dtbb4S3pmPLoFKkBYEeOsms5UdJljlq4uGu49ycxITinEiaHgp9GXNw6bAmNYPOLm/A1zvpIglGZPiXrh/ftI=',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'max-age=0',
  'Accept-Encoding': 'gzip, deflate'}
};


exports.handler = (event, context, callback) => {


var data = '';

http.get(options, function(res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      var gunzip = zlib.createGunzip();            
      res.pipe(gunzip);

      gunzip.on('data', function(data) { buffer.push(data.toString()); });
      gunzip.on('end', function() {
        console.log('buffer', buffer);

        parser.parseString(buffer.join(""), function(err, result) {
          var tidedata = result.product.forecast[0].area[0]['forecast-period']
          for (var i = 0; i < tidedata.length; i++) {
           // var subdata = tidedata[i]['element'][0]['$']

              var element = tidedata[i]['element']
                for (var s = 0; s < element.length; s++) {

           var clean = tidedata[i]['element'][s]['$'].type
           if (clean != 'moon_phase' && clean != 'tide_forecast_datum') {

           var type = tidedata[i]['element'][s]['$'].type
           var seq = tidedata[i]['element'][s]['$'].sequence
           var instance = tidedata[i]['element'][s]['$'].instance
           var tl  = tidedata[i]['element'][s]['$']["time-local"]
            console.log('time:',tl,'  type:',type,'  seq:',seq,'  instance:',instance);

            var timelookup = tl.split("T");
            if (timelookup[0] === d ) { console.log('match ---------- now:',d,'  feed:',timelookup[0])
                                        report.push(timelookup[1])
                                        report.push(instance);}

         ////remove moon_phase junk
            }
          }}
          console.log('report:',report)
          //console.log(d,'FINISHED', err, tidedata);
          var myJsonString = JSON.stringify(report);
         callback(null, myJsonString);
        });
      });
    }
  });



};
