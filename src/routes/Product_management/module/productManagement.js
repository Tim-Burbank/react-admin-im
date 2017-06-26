/**
 * Created by Yurek on 2017/5/15.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../utils/FetchHelper'
import {host} from '../../../config'
import { fetchProductInfo } from '../productInfo/module/productInfo'

export const FETCH_PRODUCT = 'FETCH_PRODUCT';


export const fetchProduct = (json) => {
  return (dispatch, getState) => {
    let _json = {
      ...json,
      limit : 999999
    }
    return easyfetch(host,'/a/products','get',_json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_PRODUCT,
            payload : e.products
          })
        }
      )
      .catch(e=>({error:e}))

  }
}


export const updateProduct = {
  active:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/products-active','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchProduct(option))
          }else if(type==2){
            return dispatch(fetchProductInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  stop:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/products-stop','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchProduct(option))
          }else if(type==2){
            return dispatch(fetchProductInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  public:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/products-public','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchProduct(option))
          }else if(type==2){
            return dispatch(fetchProductInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  },
  unpublic:(json,option,type=1) => {
    return (dispatch,getState) => {
      return easyfetch(host,'/a/products-unpublic','put',json)
        .then(e=>{
          if(type==1){
            return dispatch(fetchProduct(option))
          }else if(type==2){
            return dispatch(fetchProductInfo(option,'get'))
          }
        })
        .catch(e=>({error:e}))
    }
  }
}


const ACTION_HANDLERS = {
  [FETCH_PRODUCT]    : (state, action) => state.update('product',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function productReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
