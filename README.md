# Identity Provider

This web service provides identification tokens to authenticated users.

## API

POST /login - receives form data with username and password, returns a signed jwt after authentication.

POST /signup - receives form data with new user's information, validates information and signs user up, returns a signed jwt.