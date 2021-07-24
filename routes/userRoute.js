const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const tokenValidation = require("../middlewares/token_validation");
const joiSchemaValidation = require("../middlewares/joiSchemaValidation");
const userSchema = require('../apiSchema/userSchema');


router.post('/register',joiSchemaValidation.validateBody(userSchema.create), userController.register);
router.post('/login',joiSchemaValidation.validateBody(userSchema.login), userController.login);

router.post('/edit/:id',tokenValidation.validateToken, joiSchemaValidation.validateBody(userSchema.update), userController.edit);
router.get('/fetch_all',tokenValidation.validateToken, userController.fetch_all);
router.get('/single/:id',tokenValidation.validateToken, userController.single);






module.exports = router;