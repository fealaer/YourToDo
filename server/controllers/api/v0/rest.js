var JsonResponse = require('../../../helpers/json/response'),
    JsonError = require('../../../helpers/json/error'),
    validateObjectId = require('../../../helpers/validateObjectId');

module.exports = function (Model) {
  return new RestApi(Model);
};

function RestApi(_Model) {
  var Model = _Model;

  this.query = function (req, res, next) {
    Model.find({}, function (err, records) {
      if (err) {
        res.json(new JsonResponse(new JsonError(err), null));
      } else {
        res.json(new JsonResponse(null, records));
      }
    });
  };

  this.get = function (req, res, next) {
    validateObjectId(req.params.id, function (err, _id) {
      if (err) {
        res.json(new JsonResponse(err, null));
      } else {
        Model.findById(_id, function (err, record) {
          if (err) {
            res.json(new JsonResponse(new JsonError(err), null));
          } else {
            if (!record) {
              res.json(new JsonResponse(new JsonError(null, 404, 'Record not found'), null));
            } else {
              res.json(new JsonResponse(null, record));
            }
          }
        });
      }
    });
  };

  this.getByField = function (req, res, next) {
    var field = req.params.field;
    var value = req.params.value;
    if (!(field && value)) {
      res.json(new JsonResponse(new JsonError(null, 400, 'You need specify parameter and value'), null));
    } else {
      Model.findOne(select(field, value), function (err, record) {
        if (err) {
          res.json(new JsonResponse(new JsonError(err), null));
        } else {
          if (!record) {
            res.json(new JsonResponse(new JsonError(null, 404, 'Record not found'), null));
          } else {
            res.json(new JsonResponse(null, record));
          }
        }
      });
    }
  };

  this.post = function (req, res, next) {
    var rawData = req.body.data || req.body;
    delete rawData._id;
    var newModel = new Model(rawData);
    newModel.validate(function (err) {
      if (err) {
        res.json(new JsonResponse(new JsonError(err), null));
      } else {
        newModel.save(function (err) {
          if (err) {
            res.json(new JsonResponse(new JsonError(err), null));
          } else {
            res.json(new JsonResponse(null, newModel));
          }
        });
      }
    });
  };

  this.put = function (req, res, next) {
    var rawData = req.body.data || req.body;
    validateObjectId(rawData._id, function (err, _id) {
      if (err) {
        res.json(new JsonResponse(err, null));
      } else {
        delete rawData._id;
        delete rawData.id;
        Model.update({'_id': _id}, rawData, {upsert: false}, function (err, affected) {
          if (err) {
            res.json(new JsonResponse(new JsonError(err), null));
          } else {
            if (affected < 1) {
              res.json(new JsonResponse(new JsonError(null, 404, 'Record does not exist'), null));
            } else {
              res.json(new JsonResponse(null, {recordsAffected: affected}));
            }
          }
        });
      }
    });
  };

  this.delete = function (req, res, next) {
    validateObjectId(req.params.id, function (err, _id) {
      if (err) {
        res.json(new JsonResponse(err, null));
      } else {
        Model.remove({'_id': _id}, function (err, affected) {
          if (err) {
            res.json(new JsonResponse(new JsonError(err), null));
          } else {
            if (affected < 1) {
              res.json(new JsonResponse(new JsonError(null, 404, 'Record does not exist'), null));
            } else {
              res.json(new JsonResponse(null, {recordsAffected: affected}));
            }
          }
        });
      }
    });
  };

  this.move = function (req, res, next) {
    var rd = req.body.data || req.body;
    if (! Model.schema.path('pos')) {
      res.json(new JsonResponse(new JsonError(null, 500, 'This Model does not have field pos'), null));
    } else if (!(rd.index && rd.dropindex && rd.title)) {
      res.json(new JsonResponse(new JsonError(null, 400, 'You need specify index, dropindex and title'), null));
    } else {
      var prev = rd.index, fol = rd.dropindex;
      var inc, gte, lte, pos;

      if (rd.index < rd.dropindex) {
        gte = prev;
        lte = fol;
        inc = -1;
        pos = prev - 1;
      } else {
        gte = fol;
        lte = prev;
        inc = 1;
        pos = prev + 1;
      }
      Model.update({pos: {"$gte": gte, "$lte" :lte}}, {'$inc': {pos: inc}}, {multi: true}, function (err, affected) {
        if (err) {
          res.json(new JsonResponse(new JsonError(err), null));
        } else {
          Model.update({pos: pos, title: rd.title}, {$set: {pos: fol}}, function (err, affected) {
            if (err) {
              res.json(new JsonResponse(new JsonError(err), null));
            } else {
              if (affected < 1) {
                res.json(new JsonResponse(new JsonError(null, 404, 'Record does not exist'), null));
              } else if (affected > 1) {
                res.json(new JsonResponse(new JsonError(null, 404, 'Affected more than one record'), null));
              } else {
                res.json(new JsonResponse(null, {result: 'OK'}));
              }
            }
          });
        }
      });
    }
  }
}

function select(field, value) {
  var select = {};
  select[field] = value;
  return select;
}

RestApi.prototype.name = 'RestApi';