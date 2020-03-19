    global.ObjectID = require('mongodb').ObjectID;
    global.db = db;

    showSucc("Connected to db with uri " + config.mongo_uri );
    //if you don't wanna use redis, use boot() directly
    connectRedis();

  });

}*/

function connectRedis(db){
  var redis  = require("redis"),
  client = redis.createClient();

  client.on('error', function (err) {
    showError("Redis error", err);
  });

  client.on('connect', function(){
    showSucc("connected to redis");
    //Boot router
    boot(db);
  });
}



  var expressSession = require('express-session');
  var cookieParser = require('cookie-parser'); // the session is stored in a cookie, so we use this to parse it
  var MongoStore = require('connect-mongo')(expressSession);
  app.use(cookieParser());
  //app.use(expressSession({secret:'a3flsjf&*&S*DHFSDF'}));
  app.use(expressSession({
      secret: 'tais#@@$%ao',
      name: "cookie_name",
      store:new MongoStore({
        mongoose_connection: db
      }),
      proxy: true,
      resave: true,
      //cookie: { maxAge: 1000*60*2 },
      saveUninitialized: true
  }));

  //Allow get body in the request
  var bodyParser = require('body-parser');
    
  //Limit is 1mb
  app.use(bodyParser.urlencoded({ extended: false, limit: '1mb' }));
  app.use( bodyParser.json( {limit: '1mb'}) );       // to support JSON-encoded bodies
  

  /*app.use(bodyParser.json({limit: '1mb'}));
  app.use(bodyParser.urlencoded({extended: false,limit: '1mb'}));*/

  var methodOverride = require('method-override');
  app.use(methodOverride());

  if ( !global.is_debug ){
    var csrf    = require('csurf')

    app.use(csrf())

    // error handler
    app.use(function (err, req, res, next) {
      if (err.code !== 'EBADCSRFTOKEN') return next(err)

      // handle CSRF token errors here
      res.status(403)
      res.send('session has expired or form tampered with')
    })    
  }

  require('./app/modules/frontend')(app);
  require('./app/modules/backend')(app);
  
  var listen_port = config.port || 3000;
  var server = app.listen(listen_port, function() {
    console.log('Listening on port %d', server.address().port);
  });

  //Custom 404 page
  app.use(function(req, res, next){
    res.status(404).send('Sorry cant find that!')
  });

