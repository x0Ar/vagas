const fs = require('fs')
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const { verify } = require('jsonwebtoken')

var teste1 = require("./teste1");
var teste2 = require("./teste2");
var teste3 = require("./teste3");
var teste4 = require("./teste4");
var teste5 = require("./teste5");


app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.send(`get user/ </br>
  get users/ </br>
  post users/ </br>
  delete users/ </br>
  put users/ </br>
  `);
})

let auth = function (req, res, next) {
  const auth = req.headers.authorization
  if (!auth) {
    return res.status(401).json({ message: 'acesso negado' })
  }

  const [, token] = auth.split(' ')

  try {
    const { sub, role } = verify(token, 'shhhhh')
    req.headers.sub = sub
    req.headers.role = role

    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}

let only = function (req, res, next) {
  const { role } = req.headers
  if (role !== 'ADMIN') {
    return res.json({ message: 'Unauthorized' })
  }
  next()
}

app.get("/user", teste1.getUser);
app.get("/users", teste1.getUsers);
app.post("/users", teste2)
app.delete("/users", auth, only, teste3)
app.put("/users", auth, only, teste4)
app.get("/users/access", teste5);


const port = 3000;
app.listen(port, function () {
  console.log('Express server listening on port ' + port);
});