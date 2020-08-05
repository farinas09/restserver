// PORT
process.env.PORT = process.env.PORT || 3000;



//Env

process.env, NODE_ENV = process.env.NODE_ENV || 'dev';

//DB

let dburl;

if (process.env.NODE_ENV === 'dev') {
    dburl = 'mongodb://localhost:27017/cafe'
} else {
    dburl = 'mongodb+srv://api:YV6X2v20l3Tj498H@cafe.lp2ue.mongodb.net/cafe'
}

//mongodb+srv://<username>:<password>@cafe.lp2ue.mongodb.net/<dbname>?retryWrites=true&w=majority

process.env.URLDB = dburl;