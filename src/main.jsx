import {Config, CognitoIdentityCredentials} from 'aws-sdk';
import {
    CognitoUserPool,
    CognitoUserAttribute,
    AuthenticationDetails,
    CognitoUser
} from 'amazon-cognito-identity-js';
import React from 'react';
import ReactDOM from 'react-dom';
import appConfig from './config';

Config.region = appConfig.region;
// Config.credentials = new CognitoIdentityCredentials({
//     IdentityPoolId: appConfig.IdentityPoolId
// });

const userPool = new CognitoUserPool({
    UserPoolId: appConfig.UserPoolId,
    ClientId: appConfig.ClientId,
});
window.userPool = userPool;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <SignUpForm/>
                <SignInForm/>
            </div>
        );
    }
}

class SignUpForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            username: '',
            gender: '',
            code: '',
            showConfirmationForm: false
        };
        this.cognitoUser = null;
    }

    handleEmailChange(e) {
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleUsernameChange(e) {
        this.setState({username: e.target.value});
    }

    handleGenderChange(e) {
        this.setState({gender: e.target.value});
    }

    handleVerificationCodeChange(e) {
        this.setState({code: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.state.email.trim();
        const password = this.state.password.trim();
        const username = this.state.username.trim();
        const gender = this.state.gender.trim();
        const attributeList = [ //must include all required and can include additional fields to store with user
            new CognitoUserAttribute({
                Name: 'email',
                Value: email,
            }),
            new CognitoUserAttribute({
                Name: 'preferred_username',
                Value: username,
            }),
            new CognitoUserAttribute({
                Name: 'gender',
                Value: gender,
            })
        ];
        userPool.signUp(email, password, attributeList, null, (err, result) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('user name is ' + result.user.getUsername());
            console.log('call result: ' + result);
            this.setState({showConfirmationForm: true});
            this.cognitoUser = result.user;
        });
    }

    handleVerCodeSubmit(e) {
        e.preventDefault();
        const code = this.state.code.trim();
        console.log('%c MATIdebug: ', 'background: #222; color: #bada55', this.cognitoUser);
        this.cognitoUser.confirmRegistration(code, true, function(err, result) {
            if (err) {
                alert(err);
                return;
            }
            console.log('call result: ' + result);
        });
    }

    render() {
        return (
            <div>
                <h1>Sign Up</h1>
            {!this.state.showConfirmationForm ?
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <input type="email"
                           value={this.state.email}
                           placeholder="Email"
                           onChange={this.handleEmailChange.bind(this)}/>
                    <input type="text"
                           value={this.state.username}
                           placeholder="Username"
                           onChange={this.handleUsernameChange.bind(this)}/>
                    <div>
                        <label><input type="radio" value="MALE" name="gender" checked={this.state.gender==='MALE'} onChange={this.handleGenderChange.bind(this)}/> Male</label>
                        <label><input type="radio" value="FEMALE" name="gender" checked={this.state.gender==='FEMALE'} onChange={this.handleGenderChange.bind(this)}/> Female</label>
                    </div>
                    <input type="password"
                           value={this.state.password}
                           placeholder="Password"
                           onChange={this.handlePasswordChange.bind(this)}/>
                    <input type="submit"/>
                </form>
            :
                <form onSubmit={this.handleVerCodeSubmit.bind(this)}>
                    <input type="text"
                           value={this.state.code}
                           placeholder="Verification Code"
                           onChange={this.handleVerificationCodeChange.bind(this)}/>
                    <input type="submit" value="Send"/>
                </form>
            }
           </div>
        );
    }
}

class SignInForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
        console.log(userPool.getCurrentUser());
    }

    emailHandler(e) {
        this.setState({email: e.target.value});
    }

    passwordHandler(e) {
        this.setState({password: e.target.value});
    }

    loginHandler(e) {
        e.preventDefault();
        const email = this.state.email.trim();
        const password = this.state.password.trim();
        const authenticationData = {
            Username : email,
            Password : password
        };
        const userData = {
            Username : email,
            Pool : userPool
        };
        const authenticationDetails = new AuthenticationDetails(authenticationData);
        const cognitoUser = new CognitoUser(userData);
        // window.cognitoUser = cognitoUser;
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log('access token + ' + result.getAccessToken().getJwtToken());
                // window.fetchedResult = result;
            },
            onFailure: function(err) {
                alert(err);
            },
            mfaRequired: function(codeDeliveryDetails) {//if multi factor authentication is enabled
                var verificationCode = prompt('Please input verification code' ,'');
                cognitoUser.sendMFACode(verificationCode, this);
            }
        });
    }

    render() {
        return (
            <div>
                <h1>Sign In</h1>
                <form onSubmit={this.loginHandler.bind(this)}>
                    <input type="email"
                           value={this.state.email}
                           placeholder="Email"
                           onChange={this.emailHandler.bind(this)}/>
                    <input type="password"
                           value={this.state.password}
                           placeholder="Password"
                           onChange={this.passwordHandler.bind(this)}/>
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));