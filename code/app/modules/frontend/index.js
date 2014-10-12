module.exports = function( app ){

  var BaseController = require('./controllers/base');

  var HomeController =  require('./controllers/home')(BaseController);
  var UserController =  require('./controllers/user')(BaseController);
  var AlbumController =  require('./controllers/album')(BaseController);
  var MediaController =  require('./controllers/media')(BaseController);

  

  app.get('/', attachDB, function (req, res,next) {
    HomeController.index( req, res, next );
  })

  app.post('/users/login', attachDB, function (req, res,next) {
    UserController.login( req, res, next );
  });

  app.post('/users/register', attachDB, function (req, res,next) {
    UserController.register( req, res, next );
  });

  app.get('/users/info', attachDB, function (req, res,next) {
    UserController.info( req, res, next );
  });

  app.get('/media/:id', attachDB, function (req, res,next) {
    MediaController.index( req, res, next );
  });

  app.get('/albums', checkUser, function (req, res,next) {
    AlbumController.index( req, res, next );
  });

  app.post('/albums', checkUser, function (req, res,next) {
    AlbumController.add( req, res, next );
  });


  app.get('/hello.txt', function(req, res){
    res.send('Hello World');
  });

  app.get('/test', function(req, res){
    res.json({title:'Hello World'});
  });
}
