"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AuthService {
    constructor(opts) {
        this.providedJwt = opts.providedJwt;
        this.verifyJwt = opts.verifyJwt;
        this.publicKey = opts.publicKey;
    }
    //Are you who you say you are ?
    //Verifies a jwt using the public PEM key.
    authenticate() {
        return new Promise((resolve, reject) => {
            this.verifyJwt(this.providedJwt, this.publicKey, { algorithms: ['RS256'] }, (err, decoded) => {
                if (err)
                    return reject(err);
                resolve(decoded);
            });
        });
    }
    //Can you perform this action ?
    authorize() {
        //Checks the currentUser groups
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map