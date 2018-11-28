const DB_USER = "admin";
const DB_PASSWORD = "admin1";
const DATABASE = "mongodb://" + DB_USER + ":" + DB_PASSWORD + "@ds251223.mlab.com:51223/galwaycitytour";

module.exports = {
    'secret':'meansecure',
    'database': DATABASE
  };
  