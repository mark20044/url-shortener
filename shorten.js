module.exports = function (p, r) {
  console.log("Parameter: " + p);
  var mongodb = require('mongodb');
  var MongoClient = mongodb.MongoClient;
  var validURL = require('validator');
  
  var url = process.env.MONGO_URL;    

    MongoClient.connect(url, function (err, db) {
      if (err) {
        r.end('Unable to connect to the mongoDB server. Error:' + err);
      } else {
  
        var collection = db.collection('links');

      if (validURL.isFQDN(p)) {
        var shortcode = newCode();
        
        console.log("New shortcode: " + shortcode);
        collection.insert({shortcode: shortcode, url: p}, (err, data) => {
            if (err) r.end(err);
            r.end("https://bog-mist.glitch.me/s/" + shortcode);
        });
      } else if (p.length === 6) {
        collection.find({ shortcode: p}, {_id: 0}).toArray((err, docs) => {
          if (err) r.end(err);
          var result = docs[0].url;
          console.log("Match found: " + result);
          if (!/^http/.test(result)) result = "http://" + result;
          
          r.redirect(result);
          
        });
          
        
      } else {
        r.end("Invalid url");
      }
      
        db.close();
      
      }
    });
  
  function newCode(callback) {
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += randLetter();
    }
    
    return code;
  }
  
  function randLetter() {
    var lower = Math.round(Math.random()) ? 97 : 65;
    return String.fromCharCode( Math.round(Math.random() * 25) + lower )
  }
  
}