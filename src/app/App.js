import React, {useEffect} from 'react';

import {connect} from "react-redux"
import {switchPage, back, onChange, logIn, logOut, resetUser,setHeadError} from '../actions/headActions'

import './App.css';
import Head from '../head/head'
import Home from '../home/home'

function App(props) {
  return (
    <div className="App">
      <Head history={props.head.history} page={props.head.page} headError={props.head.headError} user={props.head.user} switchPage={props.switchPage} back={props.back} logOut={props.logOut}/>
      <Home page={props.head.page} switchPage={props.switchPage} onChange={props.onChange} user={props.head.user} logIn={props.logIn} resetUser={props.resetUser} setHeadError={props.setHeadError}/>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    head: state.head
  }
}
const mapDispatchToProps = dispatch => {
  return {
    switchPage: page => {
      dispatch(switchPage(page))
    },
    back: () => {
      dispatch(back())
    },
    onChange: e => {
      dispatch(onChange(e))
    },
    logIn: (user) => {
      dispatch(logIn(user))
    },
    logOut: () => {
      dispatch(logOut())
    },
    resetUser: () => {
      dispatch(resetUser())
    },
    setHeadError: (message) => {
      dispatch(setHeadError(message))
    }
  }
}


export default connect(mapStateToProps,mapDispatchToProps)(App);
