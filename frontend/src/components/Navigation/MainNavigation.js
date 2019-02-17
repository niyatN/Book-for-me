import React,{Component}from 'react';

// import AppBar from '@material-ui/core/AppBar';
// import Toolbar from '@material-ui/core/Toolbar';
// import Typography from '@material-ui/core/Typography';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/core/MenuItem';
// import Drawer from '@material-ui/core/Drawer';

import {NavLink} from'react-router-dom';

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
//                     {/* <IconButton color="inherit" aria-label="Menu">
//                         <MenuIcon />
//                     </IconButton> */}
//                     <Typography variant="title" color="inherit" >
//                     Book For Me
//                     </Typography>
//                 </Toolbar>
//             </AppBar>
//             <Drawer variant="persistent" open={this.state.drawerIsOpen} />

//         </div>
//     )
//     }
// }
const MainNavigation = props =>(
    <header>
        <div className="main-naigation__logo">
        <h1> Book For Me</h1>
        </div>
        <nav className ="main-navigation__item">
        <ul>
            <li><NavLink to="/auth">Auth</NavLink></li>
            <li><NavLink to="/events">Events</NavLink></li>
            <li><NavLink to="/bookings">Bookings</NavLink></li>

        </ul>
        </nav>
    </header>
)
export default MainNavigation;