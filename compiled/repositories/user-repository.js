"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const error_definitions_1 = require("../services/identity-provider/error-definitions");
class UserRepository {
    constructor(identityProviderDb) {
        this.userCollection = identityProviderDb.collection('app-users');
    }
    getUserByEmail(email) {
        return this.userCollection.findOne({ "email": email })
            .then(doc => doc);
    }
    createUser(newUser) {
        return this.userCollection.insertOne(newUser)
            .then((result) => {
            const insertedDocument = result.ops[0];
            return insertedDocument;
        })
            .catch(err => {
            if (err.code === 11000)
                throw new error_definitions_1.AlreadyRegisteredError('User with this email is already registered');
            if (err.code === 121)
                throw new error_definitions_1.FieldValidationError('Document failed validation');
            throw err;
        });
    }
    updateUserVerification(userId) {
        return this.userCollection.findOneAndUpdate({
            "_id": new mongodb_1.ObjectId(userId)
        }, {
            $set: { verified: true, active: true }
        }, {
            returnOriginal: false
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user-repository.js.map