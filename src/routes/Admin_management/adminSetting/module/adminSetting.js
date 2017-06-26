
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'
import {fetchAdminInfo} from '../adminInfo/module/adminInfo'

export const FETCH_ADMIN = 'FETCH_ADMIN';
export const UPDATAFEEDBACK = 'UPDATAFEEDBACK'


export const fetchAdmin = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/admins','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ADMIN,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updateAdmin = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/admins','put',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchAdmin(option))
        }
      })
      .catch(e=>({error:e}))

  }
}

export const newAdmin = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/admins','post',json)
      .then(e=>{
        if(type==1){
          return dispatch(fetchAdmin(option))
        }
      })
      .catch(e=>({error:e}))

  }
}

export const updateAdminStatus = {
  active:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/admins-active','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchAdmin(option))
          }else if(type==2){
            return dispatch(fetchAdminInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  stop:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/admins-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchAdmin(option))
          }else if(type==2){
            return dispatch(fetchAdminInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  delete:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/admins-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchAdmin(option))
          }else if(type==2){
            return dispatch(fetchAdminInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  }
}



const ACTION_HANDLERS = {
  [FETCH_ADMIN]    : (state, action) => state.update('adminSetting',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function adminSettingReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
