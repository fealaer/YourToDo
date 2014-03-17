var Task = require('../../../models/task'),
    rest = require('../../../controllers/api/v0/rest')(Task),
    checkAuth = require('../../../middleware/checkAuth');
    passport = require('passport');

module.exports = function (app) {
  app.get('/api/v0/tasks/:id', passport.authenticate('bearer', { session: false }), checkAuth, rest.get);
  app.get('/api/v0/tasks/:field/:value', passport.authenticate('bearer', { session: false }), checkAuth, rest.queryByField);
  app.post('/api/v0/tasks', passport.authenticate('bearer', { session: false }), checkAuth, rest.post);
  app.put('/api/v0/tasks', passport.authenticate('bearer', { session: false }), checkAuth, rest.put);
  app.delete('/api/v0/tasks/:id/:userId', passport.authenticate('bearer', { session: false }), checkAuth, rest.delete);
};