import { Db, MongoClient } from 'mongodb';
import * as fs from 'fs';

const dbCredentials = JSON.parse(fs.readFileSync('.config/credentials.json', 'utf8')).mongodb;
const username = dbCredentials.username;
const password = dbCredentials.password;
const host = dbCredentials.host;
const dbName = dbCredentials.dbName;
const connectionString = `mongodb+srv://${username}:${password}@${host}`;

export const mongoConnection = ():Promise<Db> => {
    return MongoClient.connect(connectionString)
        .then((client: MongoClient) => {
            const identityProviderDb = client.db(dbName);
            console.log('connected to database: ', identityProviderDb.databaseName);
            return identityProviderDb
        })
        .catch( err => {
            throw new Error(err);
        });
}