// PORT
process.env.PORT = process.env.PORT || 3000;



//Env

process.env, NODE_ENV = process.env.NODE_ENV || 'dev';

//DB

let dburl;

if (process.env.NODE_ENV === 'dev') {
    dburl = 'mongodb://localhost:27017/cafe'
} else {
    dburl = process.env.DB_URL;
}

//mongodb+srv://<username>:<password>@cafe.lp2ue.mongodb.net/<dbname>?retryWrites=true&w=majority

process.env.URLDB = dburl;