# Identity Provider

This web service provides identification tokens to authenticated users.

## API

POST /login - receives form data with username and password, returns a signed jwt after authentication.

POST /signup - receives form data with new user's information, validates information and signs user up, returns a signed jwt.

----------

You will need: node.js, nodemon & typescript installed in your machine.

## DEV ENVIRONMENT

1. To run the service first install the project dependencies by typing "npm install" or "yarn".
2. You will then have to compile the typescript code in the "src" folder. Do this by typing "npm run compile". The compiled javascript will be place in the "dist" folder and the typescript compiler will watch for changes.
3. Finally you can type "npm run server" in a separate terminal tab. Everytime the source code changes it will be compiled, placed in the dist folder, and nodemon will restart your server.




