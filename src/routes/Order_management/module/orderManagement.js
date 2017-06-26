/**
 * Created by Yurek on 2017/5/15.
 */
import Immutable from 'immutable'
import {easyfetch} from '../../../utils/FetchHelper'
import {host} from '../../../config'

export const FETCH_ORDER = 'FETCH_ORDER';

export const fetchOrder = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/orders','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FETCH_ORDER,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}


const ACTION_HANDLERS = {
  [FETCH_ORDER]    : (state, action) => state.update('order',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function supplierAccountReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
