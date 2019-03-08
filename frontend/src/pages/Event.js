import React, {Component} from 'react';
import Modal from '../components/Modal/Modal'
import Backdrop from '../components/Backdrop/Backdrop'
class EventsPage extends Component{
    state ={
        creating: false
    }
    startCreateEventHandler =()=>{
        this.setState({creating:true})
    }
    modalConfirmHandler=()=>{
        this.setState({creating:false})
    }
    modalCancelHandler=()=>{
        this.setState({creating:false})
    }
    render(){
        return(
            // <h1>Event Page</h1>
            <React.Fragment>
                {/* <Backdrop> */}
                    <h3><p>Share Your Event</p></h3>
                {this.state.creating && <Modal title="Add Event" canCancel onCancel={this.modalCancelHandler} canConfirm firmonCon={this.modalConfirmHandler}>
                    <p>Modal Content</p>
                </Modal>}
                <div>
                    <button onClick={this.startCreateEventHandler}>Create Event</button>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;