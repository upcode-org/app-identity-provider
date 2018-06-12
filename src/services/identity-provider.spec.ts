import { IdentityProvider } from './identity-provider';
import { expect } from 'chai';
import 'mocha';
import { containerResolver } from '../composition-root';
import { LoginUserRequest } from './service-contracts/identity-provider-contracts';

let container;

describe('Identity Provider', () => {

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

});


