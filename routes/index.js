var express = require('express');
var router = express.Router();
var expressValidator = require("express-validator");
var mongojs = require('mongojs')
var ObjectId = mongojs.ObjectId;
var db = mongojs('tetrisapp', ['ranking']);
/* GET home page. */

router.get('/', function(req, res, next) {
  db.ranking.find().sort( {puntuacion: -1}).limit(10).toArray( function(err, docs) {

    if (err) {
      console.log(err);
    } else {
      console.log(docs);
      res.render('index', {
        title:'Tetris',
        ranking: docs,
      });
    }

  });
  //res.render('index', { title: 'Express' });
});
router.get('/ranking/delete', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/ranking/add',function(req, res) {
  db.ranking.insert({nombre: req.body.nombre,puntuacion: req.body.puntuacion}, function(err, result){
    if (err){
      console.log(err);
    } else {
      res.send(result);
    }
  });
});
module.exports = router;
