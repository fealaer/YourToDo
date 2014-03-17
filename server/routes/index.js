var auth = require('./auth'),
    path = require('path'),
    passport = require('passport'),
    oauth2 = require('../lib/oauth2');

module.exports = function (app) {
  require('./api/v0')(app);

  app.post('/oauth/token', oauth2.token);

  app.post('/register', auth.register);
  app.post('/login', auth.logIn);
  app.post('/logout', auth.logOut);

  app.get('/api/userInfo',
      passport.authenticate('bearer', { session: false }),
      function (req, res) {
        res.json({ user_id: req.user.userId, name: req.user.username, scope: req.authInfo.scope })
      }
  );

  app.get('/', function (req, res, next) {
    res.sendfile(path.join(app.get('views'), 'index.html'));
  });
};