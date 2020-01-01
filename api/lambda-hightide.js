event = {};
process.env.TZ = 'Australia/Sydney'

var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();
var dateTime = require('node-datetime');
var dt = dateTime.create();
var d = dt.format('Y-m-d');
var report = []
parser.on('error', function(err) { console.log('Parser error', err); });

const options = {
  hostname: 'www.bom.gov.au',
  path: '/ntc/IDO59001/IDO59001_2020_VIC_TP009.xml',
  headers: { 'User-Agent': 'Mozilla/5.0' }
};


exports.handler = (event, context, callback) => {


var data = '';
http.get(options, function(res) {
    if (res.statusCode >= 200 && res.statusCode < 400) {
      res.on('data', function(data_) { data += data_.toString(); });
      res.on('end', function() {
        //console.log('data', data);
        parser.parseString(data, function(err, result) {
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
