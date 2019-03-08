import React, { Component } from 'react';
import './App.css';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth';
import EventsPage from './pages/Event';
import BookingsPage from './pages/Booking';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';

class App extends Component {
  state ={
    token: null,
    userId: null
  }
  login = (token, userId, tokenExpiration)=>{
    this.setState({
      token:token,
      userId:userId
    })
  }
  logout = ()=>{
    this.setState({token: null, userId: null});
  }
  render() {
    return (
      <BrowserRouter>
        <AuthContext.Provider value={{
          token: this.state.token,
          userId: this.state.userId,
          login: this.login,
          logout: this.logout
        }}>
          <React.Fragment>
            <MainNavigation />
            <main>
            <Switch>
              {/* {!this.state.token && <Redirect from="/bookings" to="/auth" exact /> } */}
              {this.state.token && <Redirect from="/" to="/events" exact /> }
              {this.state.token && <Redirect from="/auth" to="/events" exact /> }
              {!this.state.token && <Route path="/auth" component={AuthPage} /> }
              <Route path="/events" component={EventsPage} />
              {this.state.token && <Route path="/bookings" component={BookingsPage} /> }
              {!this.state.token && <Redirect  to="/auth" exact /> }
             
            </Switch>
            </main>
          </React.Fragment>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
