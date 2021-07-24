const mysql = require("mysql");


module.exports = async () => {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.USER,
            password: process.env.PASSWORD,
            database: process.env.DATABASE
        });
        
        db.connect( (error) => {
            if(error) console.log(error);
            else console.log("Database connected...")
        })
    } catch (error){
        console.log('Database Connectivity Error', error);
        throw new Error(error);
    }
};