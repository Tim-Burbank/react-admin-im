import Immutable from 'immutable'
import {easyfetch} from '../../../../../utils/FetchHelper'
import {host} from '../../../../../config'

export const NEW_CRAFTSMAN = 'NEW_CRAFTSMAN';


export const newCraftsman = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/account/craftsman','post',json)
      .then(
        e=>{
          return dispatch({
            type    : NEW_CRAFTSMAN,
            payload : e
          })
        }
      )
      .catch(e=>({error:e}))

  }
}


const ACTION_HANDLERS = {
  [NEW_CRAFTSMAN]    : (state, action) => state.update('craftsmanNew',() =>Immutable.fromJS(action.payload)),
};

// ------------------------------------
// Reducer
// ------------------------------------
export default function craftsmanNewReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
