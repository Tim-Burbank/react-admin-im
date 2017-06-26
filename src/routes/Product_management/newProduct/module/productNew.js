import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const NEW_PRODUCT = 'NEW_PRODUCT';


export const newProduct = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/products','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_PRODUCT,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}


const ACTION_HANDLERS = {
  [NEW_PRODUCT]    : (state, action) => state.update('productNew',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function productNewReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
