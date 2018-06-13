import { IdentityProvider } from './identity-provider';
import { expect } from 'chai';
import 'mocha';
import { containerResolver } from '../composition-root';
import { LoginUserRequest, SignupUserRequest } from './service-contracts/identity-provider-contracts';
import { MongoError } from 'mongodb';

let container;

describe('Identity Provider Test:', () => {

    before( async () => {
        container = await containerResolver();
    });

    it('should login a user', async () => {
        let identityProvider: IdentityProvider = container.get('identityProvider');
        let loginUserRequest = new LoginUserRequest();
        
        loginUserRequest.email = 'user8@email.com';
        loginUserRequest.password = '1234';

        const result = await identityProvider.loginUser(loginUserRequest);
        expect(result.authenticated).to.equal(true);

    });

    it('should fail signing up a user, due to missing name', async () => {
        let identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.email = `${new Date().getTime()}@email.com`;
        signupUserRequest.password = '1234';
        signupUserRequest.lastName = 'lastName';
        
        try {
            await identityProvider.signupUser(signupUserRequest);
        }catch(err) {
            result = err;
        }

        expect(result.message).to.equal('Document failed validation');
    });

});


