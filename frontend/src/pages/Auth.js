import React, {Component} from 'react';
import axios from 'axios';
import AuthContext from '../context/auth-context';
class AuthPage extends Component{
    state = {
        isLogin:true
    }
    static contextType = AuthContext;

    constructor(props){
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
    }

    switchLoginToSignUp=()=>{
        this.setState(prevState=>{
            return{isLogin:!prevState.isLogin}
        })
    }
    submitHandler = (e)=>{
        e.preventDefault();
        const email = this.emailEl.current.value;
        const password =this.passwordEl.current.value;

        if(email.trim().length===0 || password.trim().length===0){
            return;
        }
        else{
            // req to backend
            console.log(email,password);
            let requestData = {
                query:`
                query{
                    login(email:"${email}",password:"${password}"){
                      userId
                      token
                      tokenExpiration
                    }
                  }
                `
            }
            if(!this.state.isLogin){
                let requestData = {
                    query:`
                    mutation{
                    createUser(userInput:{
                        email:"${email}",
                        password:"${password}"
                    })
                    {
                        _id
                        email
                    }
                    }
                    `
                };
            }
            console.log(requestData)
            axios({
                method: 'post',
                url: 'http://localhost:8000/graphql',
                headers:{
                    'Content-Type':'application/json'
                },
                data:requestData
            })
            .then((res)=>{
                
            
                let d = {...res.data}
                console.log(d)
                if(res.data.login.token){
                    console.log('Iiiii')
                    this.context.login(
                        res.data.login.token,
                        res.data.login.userId,
                        res.data.login.tokenExpiration
                    )
                }

            })
            .catch(err=>{
                throw err;
            })
              
        }
    }
    render(){
        return(
            <div>
                <h1>Auth Page</h1>
                <hr/>
                <form onSubmit={this.submitHandler}>
                    <div className="form-control">
                        {/* <label htmlFor="email">E-Mail</label> */}
                        <input type="email" id="email" placeholder="E-mail" ref={this.emailEl}/>
                    </div>
                    <div className="form-control">
                        {/* <label htmlFor="password">Password</label> */}
                        <input type="password" id="password" placeholder="Password" ref ={this.passwordEl}/>
                    </div>
                    <div className="form-action">
                        <button type="submit">Submit</button>
                        <button type="button" onClick={this.switchLoginToSignUp}>Switch to {this.state.isLogin?'Sign up':'Log in'}</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AuthPage;