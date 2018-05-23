var express = require('express');
var cookieParser = require('cookie-parser');
var app = express();
var bodyParser=require('body-parser');
var fs = require('fs');
var multer=require('multer');
app.use(express.static('public'));
var urlencodedParser=express.urlencoded({extended :false});
//bodyParser.urlencoded({ extended: false });
app.use(cookieParser());
app.use(urlencodedParser);
app.use(multer({dest:__dirname+'//upload/'}).single('file'));
app.get('/', function (req, res) {
   console.log("Got a get request from the homepage");
    //res.send('Hello GET');
    res.sendFile(__dirname+"/home.html");
})
app.post('/',function(req,res){
    console.log("got a post request from the homepage");
    res.send('Hello POST');
})

app.get('/ab*cd',function(req,res){
    console.log("got a pattern request from the homepage");
    res.send("Page pattern match");
})
app.get('/index.html',function(req,res){
    res.sendFile(__dirname+"/"+"index.html");
})
app.get('/process_get',function(req,res){
    response = {
        name:req.query.first_name+" "+req.query.last_name,
        password:req.query.password,
        profess:req.query.profess,
        id:req.query.id
     };
   
     console.log(response);
     console.log("Cookies :",req.cookies);
     res.end(JSON.stringify(response));
     fs.writeFile(__dirname+"//json//users.json",response,function(err){
         if(err)
            return console.error(err);
         console.log("Sucessfully added a user in the json file");
     })
  
})
app.get('/process_test',function(req,res){
    options=req.query.options;
    res.sendFile(__dirname+'//'+options+".html");
})

app.post('/process_post', urlencodedParser, function (req, res) {
    // Prepare output in JSON format
    response = {
       first_name:req.body.first_name,
       last_name:req.body.last_name
    };
    console.log(response);
 
    res.end(JSON.stringify(response));
 })
 app.post('/process_upload', function (req, res) {
    console.log(req.file.name);
    console.log(req.file.path);
    console.log(req.file.type);
    var file = __dirname + "//upload//" + req.file.name;
    
    fs.readFile( req.file.path, function (err, data) {
       fs.writeFile(file, data, function (err) {
          if( err ){
             console.log( err );
             }else{
                response = {
                   message:'File uploaded successfully',
                   filename:req.file.name
                };
             }
          console.log( response );
          res.end( JSON.stringify( response ) );
       });
    });
 })
var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   
   console.log("Example app listening at http://%s:%s", host, port)
})