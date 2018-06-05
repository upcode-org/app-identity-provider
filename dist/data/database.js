"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const fs = require("fs");
const dbCredentials = JSON.parse(fs.readFileSync('.config/credentials.json', 'utf8')).mongodb;
const username = dbCredentials.username;
const password = dbCredentials.password;
const host = dbCredentials.host;
const dbName = dbCredentials.dbName;
class MongoDriver {
    constructor(opts) {
        this.connectionString = `mongodb+srv://${username}:${password}@${host}`;
        this.initialize();
    }
    initialize() {
        mongodb_1.MongoClient.connect(this.connectionString)
            .then((client) => {
            this.identityProviderDb = client.db(dbName);
            console.log('connected to database: ', this.identityProviderDb.databaseName);
        })
            .catch((err) => console.log(err));
    }
}
exports.MongoDriver = MongoDriver;
//# sourceMappingURL=database.js.map