# Testing Amazon Cognito features

You need to create user pool and assign app to it then in `src/config.js` put those credentials:

```javascript
export default {
    region: 'region',
    UserPoolId: 'userPoolid',
    ClientId: 'clientId'
}
```

Then run npm install & npm run build - app is bundled and ready.
Open index.html in browser to see it working.