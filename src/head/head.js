import React from 'react';
import './head.css'
import { socket } from '../archerHome/socket'
const axios = require('axios').default;
axios.defaults.withCredentials = true;



function Head(props) {
    const handleLogOut = () => {
        axios.delete(`${process.env.REACT_APP_EXPRESS_URL}/api/login`)
        .then(response => {
            if(response.statusText === "OK"){
                window.location.reload(true);
            }
        })
    }
    let back
    let logout
    if(props.page != 'Home' && props.page != 'HostHome' && props.page != 'ArcherHome'){
        back = <button onClick={props.back}>back</button>
    }
    if(props.page == 'HostHome' || props.page == 'ArcherHome'){
        logout = <button onClick={handleLogOut}>logout</button>
    }
    return (
        <div className="head">
            {back}
            <h1>Arrow League</h1>
            {logout}
            <div>
                <p>{props.headError}</p>
            </div>
        </div>
    )
}
export default Head;