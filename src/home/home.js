import React, { useEffect } from 'react'
import './home.css';

import Register from '../register/register'
import Login from '../login/login'
import HostHome from '../hostHome/hostHome'
import ArcherHome from '../archerHome/archerHome'


const axios = require('axios').default;
axios.defaults.withCredentials = true;


function Home(props) {
    useEffect(() => {
        props.setHeadError('')
        axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth`)
            .then(response => {
                props.logIn(response.data)
                if (response.data.type === 'Host') {
                    props.switchPage('HostHome')
                } else {
                    props.switchPage('ArcherHome')
                }

            }).catch(error => {
                const queryString = window.location.search
                const urlParams = new URLSearchParams(queryString)
                const newUser = urlParams.get('new_registration')
                if (newUser === 'yes') {
                    alert('Congratulations on your registration!')
                } else if (newUser === 'failed') {
                    alert(`Your email couldnt be verified. Try registering again or contacting us at ${process.env.REACT_APP_SUPPORT_EMAIL}`)
                }
            })
    }, [])

    const authArcher = () => {
        const accessCode = props.user.accessCode || ''
        if (accessCode.length === 6) {
            props.setHeadError('')
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/auth/archer`, { accessCode: props.user.accessCode })
                .then(response => {
                    props.logIn(response.data)
                    props.switchPage('ArcherHome')
                }).catch(error => {
                    if (error.response) {
                        props.onChange({ target: { name: 'message', value: error.response.data.message } })
                    } else {
                        props.setHeadError('There was a network error. Please try again.')
                    }
                })
        } else {
            props.onChange({ target: { name: 'message', value: 'The host code is a 6 digit combination of lowercase letters and numbers.' } })
        }


    }

    switch (props.page) {

        case 'Register':
            return (
                <Register onChange={props.onChange} user={props.user} resetUser={props.resetUser} setHeadError={props.setHeadError} />
            )
        case 'Login':
            return (
                <Login onChange={props.onChange} user={props.user} logIn={props.logIn} switchPage={props.switchPage} resetUser={props.resetUser} setHeadError={props.setHeadError} />
            )
        case 'HostHome':
        case 'CreateLeague':
        case 'EditLeague':
        case 'RunLeague':
            return (
                <HostHome switchPage={props.switchPage} page={props.page} user={props.user} setHeadError={props.setHeadError} />
            )
        case 'Scoreboard':
        case 'Score':
        case 'ScorerSelector':
        case 'ArcherHome':
            return (
                <ArcherHome page={props.page} switchPage={props.switchPage} user={props.user} setHeadError={props.setHeadError} />
            )
        default:
            return (
                <div className="home">
                    <div className="code">
                        <h2>Welcome to Arrow League</h2>
                        <h3>Please enter your host code</h3>
                        <input type="text" name="accessCode" value={props.user.accessCode} onChange={props.onChange}></input>
                        <button onClick={authArcher}> connect</button>
                        <p>{props.user.message}</p>
                    </div>
                    <div className="logReg">
                        <button onClick={props.switchPage.bind(this, 'Login')}>Login</button>
                        <p>or</p>
                        <button onClick={props.switchPage.bind(this, 'Register')}>Register</button>
                    </div>

                </div>
            );
    }
}

export default Home