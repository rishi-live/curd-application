const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require("mysql");
const constants = require("../constants/index");

const DB = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports.register = async (req, res) => {
    let response = { ...constants.defaultServerResponse };
    try {
        const {
            name,
            password,
            email,
            description
        } = req.body;
        DB.query('SELECT email FROM users WHERE email = ?', [email], async (error, result) => {
            if (error) console.log(error);
            if (result.length > 0) {

                response.message = "Email already exist";
                response.status = 409;
                return res.status(response.status).send(response);
            }
            let pass = await bcrypt.hash(password, 8);
            DB.query('INSERT INTO users set ?', {
                id: null,
                name: name,
                password: pass,
                description: description,
                email: email,
            }, (error, result) => {
                if (error) console.log(error);
                if (result) {
                    response.message = "Registration Successful";
                    response.status = 201;
                    return res.status(response.status).send(response);
                }
            });
        });
    } catch (error) {
        console.log("ERROR IN CONTROLLER : ", error);
        throw new Error("Error in Register");
    }
};

module.exports.login = async (req, res) => {
    let response = { ...constants.defaultServerResponse };
    try {
        const {
            password,
            email
        } = req.body;
        if (email && password) {
            DB.query('SELECT * FROM users WHERE email = ?', [email], async (error, result) => {
                if (error) console.log(error);
                if (result.length > 0) {

                    const isValid = await bcrypt.compare(password, result[0].password);
                    if (!isValid) {
                        response.message = constants.user.LOGIN_FAIL;
                        response.status = 401;
                        return res.status(response.status).send(response);
                    } else {
                        delete result[0].password;
                        const id = result[0].id;
                        token = jwt.sign({
                            id: id
                        }, process.env.SECRET_KEY, {
                            expiresIn: process.env.EXPIRES_IN
                        });
                        // const cookieOption = {
                        //     expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60),
                        //     httpOnly: true
                        // }
                        // res.cookie('jwt', token, cookieOption);

                        response.message = constants.user.LOGIN;
                        response.body = {
                            token: token,
                            result: result[0]
                        };
                        response.status = 200;
                        return res.status(response.status).send(response);
                    }
                } else {
                    response.message = constants.user.LOGIN_FAIL;
                    response.status = 401;
                    return res.status(response.status).send(response);
                }
            });
        } else {
            response.message = constants.user.LOGIN_FAIL;
            response.status = 401;
            return res.status(response.status).send(response);
        }
    } catch (error) {
        console.log("ERROR IN CONTROLLER : ", error);
        throw new Error("Error in login")
    }
};

module.exports.edit = async (req, res) => {
    let response = { ...constants.defaultServerResponse };

    try {
        const {
            name,
            email,
            description
        } = req.body;
        const id = req.params.id;
        if (id) {
            // let sql = `UPDATE users SET name = ${name}, email = ${email}, description = ${description} WHERE id = ${id}`;
            DB.query(`update users set name=?, email=?, description=? where id = ?`, [name, email, description, id], (error, result) => {
                if (error) console.log(error);
                if (result) {
                    DB.query(`SELECT name, email, description FROM users where id = ${id}`, async (error, result) => {
                        if (error) console.log(error);
                        if (result.length > 0) {
                            response.message = constants.user.UPDATED;
                            response.body = {
                                result: result[0]
                            };
                            response.status = 200;
                            return res.status(response.status).send(response);
                        } else {
                            response.message = constants.user.RESOURCE_NOT_FOUND;
                            response.status = 400;
                            return res.status(response.status).send(response);
                        }
                    });
                }
            });
        } else {
            response.message = constants.user.LOGIN_FAIL;
            response.status = 401;
            return res.status(response.status).send(response);
        }
    } catch (error) {
        console.log("Error : ", error);
        throw new Error("Error in Edit")
    }
};


module.exports.single = async (req, res) => {
    let response = { ...constants.defaultServerResponse };
    try {
        const { id } = req.params;
        if (id) {
            DB.query(`SELECT * FROM users WHERE id = ${id}`, async (error, result) => {
                if (error) console.log(error);
                else {
                    delete result[0].password;
                    response.message = constants.user.RESOURCE_FOUND;
                    response.body = {
                        result: result[0]
                    };
                    response.status = 200;
                    return res.status(response.status).send(response);
                }
            });
        } else {
            response.message = constants.user.LOGIN_FAIL;
            response.status = 401;
            return res.status(response.status).send(response);
        }
    } catch (error) {
        console.log("ERROR IN CONTROLLER : ", error);
        throw new Error("Error in single")
    }
};

module.exports.fetch_all = async (req, res) => {
    let response = { ...constants.defaultServerResponse };
    try {
        DB.query(`SELECT name, email, description FROM users`, async (error, result) => {
            if (error) console.log(error);
            if (result.length > 0) {
                delete result.password;
                response.message = constants.user.RESOURCE_FOUND;
                response.body = {
                    result: result
                };
                response.status = 200;
                return res.status(response.status).send(response);
            } else {
                response.message = constants.user.LOGIN_FAIL;
                response.status = 401;
                return res.status(response.status).send(response);
            }
        });
    } catch (error) {
        console.log("Error : ", error);
        throw new Error("Error in Fetch All")
    }
};