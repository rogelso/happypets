const express = require('express');
const router = express.Router();

// Passeios Model
let Passeios = require('../models/passeios');
// User Model
let User = require('../models/user');

var passeios = require("../controllers/passeiosController.js");


// Add Route
router.get('/add', function(req, res){
  res.render('../views/passeio/add_passeios', {
    title:'Novo Passeio'
  });
});

// Add Submit POST Route
router.post('/add',ensureAuthenticated, function(req, res){
  req.checkBody('pet','Pet é requerido').notEmpty();
  req.checkBody('body','Descrição é  requerida').notEmpty();
  req.checkBody('valor_passeio','Valor do Passeio é requerido').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    res.render('../views/passeio/add_passeios', {
      title:'Novo Passeio',
      errors:errors
    });
  } else {
    let passeio = new Passeios();
    passeio.pet = req.body.pet;
    passeio.body = req.body.body;
    passeio.dono_pet = req.user._id;
    passeio.andador = "";
    passeio.valor_passeio = req.body.valor_passeio;
    passeio.situacao = "1";

    passeio.save(function(err){
      if(err){
        console.log(err);
        return;
      } else {
        req.flash('success','Passeio Adicionado!');
        res.redirect('/');
      }
    });
  }
});

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
  Passeios.findById(req.params.id, function(err, passeios){
    if(passeios.dono_pet != req.user._id){
      req.flash('danger', 'Não Autorizado');
      res.redirect('/');
    }
    res.render('../views/passeio/edit_passeios', {
      title:'Editar Passeio',
      passeios:passeios
    });
  });
});

// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  console.log("chegou");
  passeios.edit(req, res);
});

// Delete Article
router.delete('/:id', function(req, res){
  if(!req.user._id){
    res.status(500).send();
  }

  let query = {_id:req.params.id}

  Article.findById(req.params.id, function(err, article){
    if(article.author != req.user._id){
      res.status(500).send();
    } else {
      Article.remove(query, function(err){
        if(err){
          console.log(err);
        }
        res.send('Success');
      });
    }
  });
});

// obter passeio
router.get('/:id', function(req, res){
  Passeios.findById(req.params.id, function(err, passeios){
    User.findById(passeios.dono_pet, function(err, user){
      res.render('../views/passeio/passeio', {
        passeios:passeios,
        dono_pet: user.name
      });
    });
  });
});

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Por favor, Faça o Login!');
    res.redirect('/users/login');
  }
}

module.exports = router;
