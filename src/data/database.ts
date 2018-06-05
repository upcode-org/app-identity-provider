import { MongoClient, Db, Collection } from 'mongodb';
import * as fs from 'fs';

const dbCredentials = JSON.parse(fs.readFileSync('.config/credentials.json', 'utf8')).mongodb;

const username = dbCredentials.username;
const password = dbCredentials.password;
const host = dbCredentials.host;
const dbName = dbCredentials.dbName;

export class MongoDriver {

    public identityProviderDb: Db;
    private connectionString: string = `mongodb+srv://${username}:${password}@${host}`;

    constructor(opts) {
        this.initialize();
    }

    private initialize() {
        MongoClient.connect(this.connectionString)
            .then((client: MongoClient) => {
                this.identityProviderDb = client.db(dbName);
                console.log('connected to database: ', this.identityProviderDb.databaseName);
            })
            .catch((err)=>console.log(err));
    }
}
