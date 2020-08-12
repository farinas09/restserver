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

//Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '251491264322-ghlov238qgv2u1gh9kfhi8c03bhe9m3l.apps.googleusercontent.com';