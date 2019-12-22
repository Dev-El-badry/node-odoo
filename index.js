const express = require('express')
const bodyParser = require("body-parser");

var Odoo = require("odoo-xmlrpc");


const app = express();
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var odoo = new Odoo({
  url: "http://207.154.195.214",
  port: 8069,
  db: "Azimut_Fund",
  username: "ahmed.abouelsaad@azimut.eg",
  password: "azimut"
});



//function to get method type of request
// para: request
function get_method_type(req) {
  var x = req.route.stack;
  var method_type = "";
  for (key in x) {
    if (x.hasOwnProperty(key)) {
      var value = x[key];
      method_type = value.method;
      //do something with value;
    }
  }

  if(method_type == null) {
    method_type = null;
  }

  return method_type;
}

//request: post
app.post("/login", function(req, res) {

  method_type = get_method_type(req); //call function get_method_type

  if (method_type == 'post') {
    
    odoo.connect(function(err, result) {
      if (err) {
        return res.send(err);
      }
      res.send("Connected to Odoo server.");
    });


  } else {
    res.end("method type is wrong");
  }
});
//request: post
app.post("/call_method", function(req, res) {

  method_type = get_method_type(req); //call function get_method_type

  if (method_type == 'post') {
    
    odoo.connect(function(err) {
      if (err) {
        return res.send(err);
      }
      //res.send("Connected to Odoo server.");
      var inParams = [];
      inParams.push("read");
      inParams.push(false); //raise_exception
      var params = [];
      params.push(inParams);
      odoo.execute_kw("res.partner", "check_access_rights", params, function(
        err,
        value
      ) {
        if (err) {
          return res.send(err);
        }
        res.send("Result: " + value);
      });
    });

  } else {
    res.end("method type is wrong");
  }
});






app.listen(3000, () => {
    console.log('Express Server Started At Port: 3000')
})