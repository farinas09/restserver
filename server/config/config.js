// PORT
process.env.PORT = process.env.PORT || 3000;

//Env

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//Tokens settings
process.env.SEED = process.env.SEED || "api-dev";
process.env.EXPIRES_TIME = "48h";
//DB

let dburl;

if (process.env.NODE_ENV === "dev") {
  dburl = "mongodb+srv://api:YV6X2v20l3Tj498H@cafe.lp2ue.mongodb.net/cafe";
} else {
  dburl = process.env.DB_URL;
}

process.env.URLDB = dburl;

//Google Client ID
process.env.CLIENT_ID =
  process.env.CLIENT_ID ||
  "251491264322-ghlov238qgv2u1gh9kfhi8c03bhe9m3l.apps.googleusercontent.com";
