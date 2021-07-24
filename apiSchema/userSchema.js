const Joi = require('@hapi/joi');

module.exports.create = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  description: Joi.string().required(),
  password: Joi.string().allow(null, ''),

});
module.exports.login = Joi.object().keys({
  email: Joi.string().email().required(),
  password: Joi.string().required(),

});
module.exports.update = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  description: Joi.string().required(),
  password: Joi.string().allow(null, ''),
});
