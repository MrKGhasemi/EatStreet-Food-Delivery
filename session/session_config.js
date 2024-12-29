const connect_mongodb_session = require("connect-mongodb-session");

function SessionStoreConfig(session) {
  const MongoDBStore = connect_mongodb_session(session);
  const sessionStore = new MongoDBStore({
    uri: "mongodb://127.0.0.1:27017",
    databaseName: "food_delivery",
    collection: "sessions",
  });
  return sessionStore;
}

function SessionCreate(sessionStore) {
  return {
    secret: "124124c21csaexe!@#!@#v421m879/890(*/89",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  };
}

module.exports = {
  SessionStoreConfig: SessionStoreConfig,
  SessionCreate: SessionCreate,
};
