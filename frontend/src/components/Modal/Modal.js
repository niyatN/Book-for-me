import React from 'react';


const modal = props =>{
    return(<div>
        <header>{props.title}</header>
        <section>
            {props.children}
        </section>
        <section>
            {props.canCancel && <button onClick={props.onCancel}> Cancel </button> }
            {props.canConfirm && <button onClick={props.onConfirm}>Confirm</button> }
        </section>
    </div>)
}

export default modal;