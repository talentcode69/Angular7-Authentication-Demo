var express = require('express');
var router = express.Router();
var db = require('../db');
var bodyParser = require('body-parser');
/* GET users listing. */
router.use(bodyParser.json());
router.get('/', function(req, res, next) {
  var sql = "SELECT * FROM users";
  db.query(sql, function(err, rows, fields) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    res.json(rows)
  })
});
router.post('/register', function (req, res, next) {
  
  var username = req.body.username;
  var firstname = req.body.firstName;
  var lastname = req.body.lastName;
  var password = req.body.pwd;
  db.query('INSERT INTO users (username, firstName, lastName, pwd, created_at, updated_at) VALUES (?,?,?,?,NOW(),NOW())',[username,firstname,lastname,password], function (err, result) { 
    if (err) {
      res.status(500).send({ error: 'Something failed!' });
      console.log("error:", err);
    }
    console.log("sucess"+result.insertId);
    res.json({'id': result.insertId,'username':username,'firstName':firstname,'lastName':lastname,'pwd':password });
  });
});
router.post('/login', function (req, res, next) {
  
  var username = req.body.username;
  var password = req.body.pwd;
  db.query('SELECT * FROM users where username=? AND pwd=?',[username,password],function(err, rows, fields) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    res.json(rows[0]);
  });
});
router.get('/:id', function (req, res, next) {

  var id = req.params.id;
  db.query(`SELECT * FROM users WHERE id=?`,[id], function(err, row, fields) {
    if(err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    res.json(row[0])
  })
});

router.delete('/delete/:id', function (req, res, next) {
  var id = req.params.id;
  db.query('DELETE FROM users WHERE id=?', [id], function (err, result) {
    if (err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    res.json({ 'status': 'success' })
  })
});

router.put('/update/:id', function(req, res, next) {

  var id = req.params.id;
  var username = req.body.username;
  var firstname = req.body.firstName;
  var lastname = req.body.lastName;
  var password = req.body.pwd;
  db.query('UPDATE users SET username=?, firstName=?, lastName=?, pwd=?, updated_at=NOW()  WHERE id=?',[username,firstname,lastname,password,id], function (err, result) { 
    if (err) {
      res.status(500).send({ error: 'Something failed!' });
      console.log("error:", err);
    }
    res.json({ 'status': 'success'});
  });
});
module.exports = router;
