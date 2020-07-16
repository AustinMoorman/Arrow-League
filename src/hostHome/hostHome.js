import React, { useEffect } from 'react'
import './hostHome.css';
import {connect} from "react-redux"

import CreateLeague from './sub/createLeague/createLeague'
import EditLeague from './sub/editLeague/editLeague'
import RunLeague from './sub/runLeague/runLeague'

import {leagueOnChange, leaguesOnChange, defaultCreateLeague, setLeagues} from '../actions/hostActions'

function HostHome(props) {
    switch(props.page){
        case 'CreateLeague':
            return (
                <CreateLeague league={props.host.league} leagueOnChange={props.leagueOnChange} user={props.user} setHeadError={props.setHeadError} defaultCreateLeague={props.defaultCreateLeague} />
            )
            break;
            case 'EditLeague':
                return (
                    <EditLeague leagues={props.host.leagues} leaguesOnChange={props.leaguesOnChange} user={props.user} setHeadError={props.setHeadError} setLeagues={props.setLeagues}/>
                )
                break;
            case 'RunLeague':
                return (
                    <RunLeague leagues={props.host.leagues} leaguesOnChange={props.leaguesOnChange} user={props.user} setHeadError={props.setHeadError} setLeagues={props.setLeagues}/>
                )
        default:
            return (
        <div className="hostHome">
            Host Home
            <button onClick={props.switchPage.bind(this,'RunLeague')} >Run League</button>
            <button onClick={props.switchPage.bind(this,'CreateLeague')} >Create League</button>
            <button onClick={props.switchPage.bind(this,'EditLeague')} >Edit League</button>
        </div>
    )
    }
    
}

const mapStateToProps = state => {
    return {
      host: state.host
    }
  }

const mapDispatchToProps = dispatch => {
    return {
        leagueOnChange: e => {
            dispatch(leagueOnChange(e))
        },
        leaguesOnChange: (e,index) => {
            dispatch(leaguesOnChange(e, index))
        },
        defaultCreateLeague: (gameModeID) => {
            dispatch(defaultCreateLeague(gameModeID))
        },
        setLeagues: leagues => {
            dispatch(setLeagues(leagues))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(HostHome)