// PORT
process.env.PORT = process.env.PORT || 3000;



//Env

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//Tokens settings
process.env.SEED = process.env.SEED || 'api-dev';
process.env.EXPIRES_TIME = 60 * 60 * 24 * 30;
//DB

let dburl;

if (process.env.NODE_ENV === 'dev') {
    dburl = 'mongodb://localhost:27017/cafe'
} else {
    dburl = process.env.DB_URL;
}



process.env.URLDB = dburl;