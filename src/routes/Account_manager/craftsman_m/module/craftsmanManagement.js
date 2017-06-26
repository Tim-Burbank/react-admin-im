/**
 * Created by Yurek on 2017/5/15.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'
import { fetchCraftsmanInfo } from '../craftsmanInfo/modules/craftsmanInfo'

export const FETCH_CRAFTSMAN = 'FETCH_CRAFTSMAN';
export const UPDATE_CRAFTSMAN = 'UPDATE_CRAFTSMAN';

export const fetchCraftsman = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/craftsman','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_CRAFTSMAN,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updateCraftsman = {
  active:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/craftsman-active','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCraftsman(option))
          }else if(type==2){
            return dispatch(fetchCraftsmanInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  stop:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/craftsman-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCraftsman(option))
          }else if(type==2){
            return dispatch(fetchCraftsmanInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  check:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/craftsman-check','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCraftsman(option))
          }else if(type==2){
            return dispatch(fetchCraftsmanInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  disapprove:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/craftsman-disapprove','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchCraftsman(option))
          }else if(type==2){
            return dispatch(fetchCraftsmanInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  }
}

const ACTION_HANDLERS = {
  [FETCH_CRAFTSMAN]    : (state, action) => state.update('craftsmanAccount',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function craftsmanAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
