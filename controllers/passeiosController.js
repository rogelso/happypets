var mongoose = require("mongoose");
var Passeios = require("../models/passeios");
const passport = require('passport');

var passeiosController = {};


passeiosController.edit = function(req, res) {
  let passeios = {};
  passeio.pet = req.body.pet;
  passeio.body = req.body.body;
  passeio.dono_pet = req.user._id;
  passeio.andador = "";
  passeio.valor_passeio = req.body.valor_passeio;
  passeio.situacao = "1";

  let query = {_id:req.params.id}

  Passeios.update(query, passeios, function(err){
    if(err){
      console.log(err);
      return;
    } else {
      req.flash('success', 'PAsseio Atualizado');
      res.redirect('/');
    }
  });
};

module.exports = passeiosController;
