var express = require('express');
var router = express.Router();
var user = require("../controllers/userController.js");
const bcrypt = require('bcryptjs');
const passport = require('passport');
var ensureLoggedIn = require('connect-ensure-login');

// Bring in User Model
let User = require('../models/user');

// Register Form
router.get('/register', function(req, res){
  res.render('register');
});

// Register Proccess
router.post('/register', function(req, res){
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;

  req.checkBody('name', 'Nome é obrigatório').notEmpty();
  req.checkBody('email', 'Email is required').notEmpty();
  req.checkBody('email', 'E-mail é obrigatório').isEmail();
  req.checkBody('username', 'Nome de usuário é requerido').notEmpty();
  req.checkBody('password', 'Senha requerida').notEmpty();
  req.checkBody('password2', 'As senhas não coincidem').equals(req.body.password);

  let errors = req.validationErrors();

  if(errors){
    res.render('register', {
      errors:errors
    });
  } else {
    let newUser = new User({
      name:name,
      email:email,
      username:username,
      password:password
    });

    bcrypt.genSalt(10, function(err, salt){
      bcrypt.hash(newUser.password, salt, function(err, hash){
        if(err){
          return;
        }
        newUser.password = hash;
        newUser.save(function(err){
          if(err){
            console.log(err);
            return;
          } else {
            req.flash('success',' Sucesso! Agora você está registrado e pode efetuar o Login');
            res.redirect('/users/login');
          }
        });
      });
    });
  }
});

// Login Form
router.get('/login', function(req, res){
  res.render('login');
});

// Login Process
router.post('/login', function(req, res, next){
  passport.authenticate('local', {
    successRedirect:'/',
    failureRedirect:'/users/login',
    failureFlash: true
  })(req, res, next);
});

// logout
router.get('/logout', function(req, res){
  req.logout();
  req.flash('success', 'Você está desconectado');
  res.redirect('/users/login');
});


router.get('/edit/:id', ensureAuthenticated,
  //ensureLoggedIn.ensureLoggedIn('/users/login'),
  function(req, res) {
        user.edit(req, res);
});

// Edit update
router.post('/update/:id', function(req, res) {
  user.update(req, res);
});


// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    //console.log(req.users);
    return next();
  } else {
    req.flash('danger', 'Por favor, Faça o Login!');
    res.redirect('/users/login');
  }
}

module.exports = router;
