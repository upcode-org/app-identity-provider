import { IdentityProvider } from './identity-provider';
import { expect } from 'chai';
import 'mocha';
import { containerResolver } from '../composition-root';
import { LoginUserRequest, SignupUserRequest, SignupUserResponse } from './service-contracts/identity-provider-contracts';
import { UserRepository } from '../repositories/user-repository';
import { DeleteWriteOpResultObject } from 'mongodb';

describe('Identity Provider Test:', () => {

    let container;
    let timestamp = new Date().getTime();
    let password = '1234';

    before( async () => {
        container = await containerResolver();
    });

    it('should signup a user', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.email = `test-${timestamp}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = 'firstName';
        
        try {
            result = await identityProvider.signupUser(signupUserRequest);
        } catch(err) {
            result = err;
        }

        expect(result).to.satisfy((result: SignupUserResponse) => {
            if(result.token && !result.authenticated) return true;
            return false;
        });
    });

    it('should fail signing up due to existing user', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.email = `test-${timestamp}@email.com`;
        signupUserRequest.firstName = 'firstName';
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.password = password;
        
        try {
            result = await identityProvider.signupUser(signupUserRequest);
        } catch(err) {
            result = err;
        }
        expect(result.code).to.equal(1); // already registered code
    });

    it('should fail signing up due to missing first name', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.email = `test-${new Date().getTime()}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = '';
        
        try {
            result = await identityProvider.signupUser(signupUserRequest);
        } catch(err) {
            result = err;
        }

        expect(result.code).to.equal(2); //failed validation code
    });

    it('should fail signing up due to wrong first name type', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.email = `test-${new Date().getTime()}@email.com`;
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        signupUserRequest.firstName = 122;
        
        try {
            result = await identityProvider.signupUser(signupUserRequest);
        } catch(err) {
            result = err;
        }

        expect(result.code).to.equal(2); //failed validation code
    });

    it('should fail signing up due to missing email', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let signupUserRequest = new SignupUserRequest();
        let result;
        
        signupUserRequest.firstName = 'firstName';
        signupUserRequest.password = password;
        signupUserRequest.lastName = 'lastName';
        
        try {
            result = await identityProvider.signupUser(signupUserRequest);
        } catch(err) {
            result = err;
        }

        expect(result.code).to.equal(2); //failed validation code
    });

    it('should fail login due to unverified user', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let loginUserRequest = new LoginUserRequest();
        
        loginUserRequest.email = `test-${timestamp}@email.com`;
        loginUserRequest.password = password;

        const result = await identityProvider.loginUser(loginUserRequest);
        expect(result.authenticated).to.equal(false);

    });

    it('should fail login due to wrong credentials', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let loginUserRequest = new LoginUserRequest();
        
        loginUserRequest.email = 'svega@upcode.co';
        loginUserRequest.password = 'wrongpassword';

        const result = await identityProvider.loginUser(loginUserRequest);
        expect(result.authenticated).to.equal(false);

    });

    it('should login a user', async () => {
        const identityProvider: IdentityProvider = container.get('identityProvider');
        let loginUserRequest = new LoginUserRequest();
        
        loginUserRequest.email = 'svega@upcode.co';
        loginUserRequest.password = 'upcode-1985!';

        const result = await identityProvider.loginUser(loginUserRequest);
        expect(result.authenticated).to.equal(true);

    });

    after(async () => {
        const userRepository: UserRepository = container.get('userRepository');
        await userRepository.userCollection.deleteOne({ email : `test-${timestamp}@email.com` })
            .then((res: DeleteWriteOpResultObject)  => console.log('deleted: ', res.deletedCount));
    });

});


