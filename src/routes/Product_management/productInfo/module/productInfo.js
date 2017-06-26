/**
 * Created by Yurek on 2017/5/22.
 */
/**
 * Created by Yurek on 2017/5/17.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FETCH_PRODUCTINFO = 'FETCH_PRODUCTINFO';
export const UPDATE_PRODUCTINFO = 'UPDATE_PRODUCTINFO'


export const fetchProductInfo = (id,method,json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/products/'+id,method,json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_PRODUCTINFO,
            payload : e.products
          })
        }
      )
      .catch(e=>({error:e}))

  }
};




const ACTION_HANDLERS = {
  [FETCH_PRODUCTINFO]    : (state, action) => state.update('productInfo',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function productInfoReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
