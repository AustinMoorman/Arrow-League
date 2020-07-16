import React, { useEffect } from 'react'
import './login.css';

const axios = require('axios').default;
axios.defaults.withCredentials = true;


function Login(props) {

    useEffect(() => {
        props.resetUser()
    }, [])

    const handleLogin = () => {
        if (props.user.password && props.user.email) {
            let e = {}
            e.target = {
                name: 'loginMessage',
                value: 'Logging In'
            }
            props.onChange(e)
            props.setHeadError('')
            axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/login`, { user: props.user })
                .then(response => {
                    props.logIn(response.data)
                    props.switchPage('HostHome')
                }).catch(error => {
                    if (error.response) {
                        e.target.value = error.response.data.message
                        props.onChange(e)
                    }else{
                        e.target.value = ''
                        props.onChange(e)
                        props.setHeadError('There was a network error. Please try again.')
                    }
                })


        } else {
            let e = {}
            e.target = {
                name: 'loginMessage',
                value: 'Please enter an email and password.'
            }
            props.onChange(e)
        }
    }
    const handleForgotPasswordReq = () => {
        let e = {}
        e.target = {
            name: 'resetMessage',
        }
        props.setHeadError('')
        axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/login/send_reset_code`, { email: props.user.forgottenEmail }).then(response => {
            e.target.value = response.data.message
            props.onChange(e)
            e.target = {
                name: 'forgotPassword',
                value: 'newPassword'
            }
            props.onChange(e)
        }).catch(error => {
            if (error.resonse) {
                e.target.value = error.response.data.message
                props.onChange(e)
            } else {
                e.target.value = ''
                props.setHeadError('There was a network error. Please try again.')
            }

        })
    }
    const handleSubmitNewPassword = () => {
        let e = {}
        e.target = {
            name: 'resetMessage',
        }
        if (props.user.resetPassword.match(/[a-z]/) && props.user.resetPassword.match(/[A-Z]/) && props.user.resetPassword.match(/[0-9]/) && props.user.resetPassword.match(/[^a-zA-Z\d]/) && props.user.resetPassword.length >= 8) {
            if (props.user.resetPassword === props.user.resetRePassword) {
                e.target.value = 'Changing your password.'
                props.onChange(e)
                e.target.name = 'loginMessage'
                axios.post(`${process.env.REACT_APP_EXPRESS_URL}/api/login/reset_password`, { user: props.user })
                    .then(response => {
                        e.target.value = response.data.message
                    }).catch(error => {
                        if (error.response.status == 401) {
                            e.target.value = error.response.data.message
                        } else {
                            e.target.value = 'There was an error please try resetting your password again.'
                        }
                        props.resetUser()
                        props.onChange(e)
                    })
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

    const loginField = (
        <div className="loginField">
            <input type="email" name="email" placeholder="email" value={props.user.email} onChange={props.onChange}></input>
            <input type="password" name="password" placeholder="password" value={props.user.password} onChange={props.onChange}></input>
            <p>{props.user.loginMessage}</p>
            <button onClick={handleLogin}>Login</button>
            <button onClick={props.onChange} name='forgotPassword' value="code" >Forgot Password</button>
        </div>
    )
    const forgotPasswordEmailField = (
        <div className="forgotPasswordField">
            <p>{props.user.resetMessage}</p>
            <input type="email" name="forgottenEmail" placeholder="email" value={props.user.forgottenEmail} onChange={props.onChange}></input>
            <button onClick={handleForgotPasswordReq}>Reset Password</button>
        </div>
    )
    const forgotPasswordResetField = (
        <div className="forgotPasswordResetField">
            <p>{props.user.resetMessage}</p>
            <input type="email" name="forgottenEmail" placeholder="email" value={props.user.forgottenEmail} onChange={props.onChange} disabled></input>
            <input type="text" name="resetCode" placeholder="Reset Code" value={props.user.resetCode} onChange={props.onChange}></input>
            <input type="password" name="resetPassword" placeholder="new password" value={props.user.resetPassword} onChange={props.onChange}></input>
            <input type="password" name="resetRePassword" placeholder="confirm new password" value={props.user.resetRePassword} onChange={props.onChange}></input>
            <button onClick={handleSubmitNewPassword}>Submit</button>
        </div>
    )
    if (props.user.forgotPassword == 'code') {
        return (
            <div className="login">
                {loginField}
                {forgotPasswordEmailField}
            </div>
        )
    } else if (props.user.forgotPassword == 'newPassword') {
        return (
            <div className="login">
                {loginField}
                {forgotPasswordResetField}
            </div>
        )


    } else {
        return (
            <div className="login">
                {loginField}
            </div>
        )
    }
}

export default Login