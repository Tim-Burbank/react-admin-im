/**
 * Created by Yurek on 2017/5/15.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'
import {fetchSupplierInfo} from '../supplierInfo/modules/supplierInfo'

export const FETCH_SUPPLIER = 'FETCH_SUPPLIER';


export const fetchSupplier = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/supplier','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_SUPPLIER,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}


export const updateSupplier = {
  active:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/supplier-active','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchSupplier(option))
          }else if(type==2){
            return dispatch(fetchSupplierInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  stop:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/supplier-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchSupplier(option))
          }else if(type==2){
            return dispatch(fetchSupplierInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  check:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/supplier-check','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchSupplier(option))
          }else if(type==2){
            return dispatch(fetchSupplierInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  disapprove:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/account/supplier-disapprove','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchSupplier(option))
          }else if(type==2){
            return dispatch(fetchSupplierInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  }
}


const ACTION_HANDLERS = {
  [FETCH_SUPPLIER]    : (state, action) => state.update('supplierAccount',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function supplierAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
