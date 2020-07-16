import React, { useEffect } from 'react'
import './register.css';

const axios = require('axios').default;
axios.defaults.withCredentials = true;

function Register(props) {
    useEffect(() => {
        props.resetUser()
    }, [])


    const handleRegister = () => {
        let e = {}
        e.target = {
            name: 'registerMessage',
        }
        if (props.user.password.match(/[a-z]/) && props.user.password.match(/[A-Z]/) && props.user.password.match(/[0-9]/) && props.user.password.match(/[^a-zA-Z\d]/) && props.user.password.length >= 8) {
            if (props.user.password === props.user.rePassword) {
                if (props.user.email.match('@')) {
                    if (props.user.rangeName) {
                        e.target.value = 'Registering your account.'
                        props.onChange(e)
                        props.setHeadError()
                        axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/register`, { user: props.user })
                            .then(response => {
                                e.target.value = response.data.message
                                props.resetUser()
                                props.onChange(e)
                            }).catch(error => {
                                if (error.response && error.response.status) {
                                    e.target.value = error.response.data.message
                                    props.onChange(e)
                                } else {
                                    e.target.value = ''
                                    props.onChange(e)
                                    props.setHeadError('There was a network error. Please try again.')
                                }
                            })
                    } else {
                        e.target.value = 'Please enter the name of your range'
                        return props.onChange(e)
                    }
                } else {
                    e.target.value = 'Please provide a valid email.'
                    return props.onChange(e)
                }
            } else {
                e.target.value = 'Passwords do not match'
                return props.onChange(e)
            }
        } else {
            e.target.value = (
                <div>
                    <p>At least 1 uppercase character.</p>
                    <p>At least 1 lowercase character.</p>
                    <p>At least 1 digit.</p>
                    <p>At least 1 special character.</p>
                    <p>Minimum 8 characters.</p>
                </div>
            )
            return props.onChange(e)
        }
    }

    return (
        <div className="register">
            <input type="text" name="rangeName" placeholder="Name of Range" value={props.user.rangeName} onChange={props.onChange}></input>
            <input type="email" name="email" placeholder="Email" value={props.user.email} onChange={props.onChange}></input>
            <input type="password" name="password" placeholder="Password" value={props.user.password} onChange={props.onChange}></input>
            <input type="password" name="rePassword" placeholder="Confirm Password" value={props.user.rePassword} onChange={props.onChange}></input>
            <p>{props.user.registerMessage}</p>
            <button onClick={handleRegister}>Register</button>
        </div>
    )
}

export default Register