var Task = require('../../../models/task'),
    rest = require('../../../controllers/api/v0/rest')(Task),
        checkAuth = require('../../../middleware/checkAuth');

module.exports = function (app) {
  app.get('/api/v0/tasks/:id', checkAuth, rest.get);
  app.get('/api/v0/tasks/:field/:value', checkAuth, rest.getByField);
  app.post('/api/v0/tasks', checkAuth, rest.post);
  app.put('/api/v0/tasks', checkAuth, rest.put);
  app.delete('/api/v0/tasks/:id', checkAuth, rest.delete);
};