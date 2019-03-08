import React,{Component}from 'react';
import {NavLink} from'react-router-dom';
import AuthContext from '../../context/auth-context';
// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/core/MenuItem';
// import Drawer from '@material-ui/core/Drawer';
// import MailIcon from '@material-ui/icons/Mail';
// import InputBase from '@material-ui/core/InputBase';



// class MainNavigation extends Component{
//     state={
//         drawerIsOpen:false
//     }
//     handelDrawer=()=>{
//         // let flag = this.state.
//         this.setState({drawerIsOpen:this.state.drawerIsOpen})
//     }
//     render(){
//         return(
//         <div >
//             <AppBar position="static">
//                 <Toolbar>

//                     <Typography variant="title" color="inherit" >
//                     Book For Me
//                     </Typography>
//                     <InputBase placeholder="Search…" className="navbar-search"/>
//                     <div>
//                         <IconButton color="inherit">
//                             <MailIcon />
//                         </IconButton>
//                     </div>
//                 </Toolbar>
//             </AppBar>
//             <Drawer variant="persistent" open={this.state.drawerIsOpen} />

//         </div>
//     )
//     }
// }
const MainNavigation = props =>(
    <AuthContext.Consumer>
        {
            (context)=>{
            return(
                <header>
                    <div className="main-naigation__logo">
                    <h1> Book For Me</h1>
                    </div>
                    <nav className ="main-navigation__item">
                    <ul>
                        {
                            !context.token && (<li><NavLink to="/auth">Auth</NavLink></li>)
                        }
                        <li><NavLink to="/events">Events</NavLink></li>
                        {
                            context.token && (
                                <React.Fragment>
                                    <li><NavLink to="/bookings">Bookings</NavLink></li>
                                    <li><button onClick={context.logout}>Logout</button></li>
                                </React.Fragment>
                            )

                        }
                        
                    </ul>
                    </nav>
                </header>
            )
            }
        
        }

    </AuthContext.Consumer>
)
export default MainNavigation;