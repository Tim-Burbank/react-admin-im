
import Immutable from 'immutable'
import {easyfetch} from '../../../../utils/FetchHelper'
import {host} from '../../../../config'

export const FEEDBACK = 'FEEDBACK';
export const UPDATAFEEDBACK = 'UPDATAFEEDBACK'


export const feedback = (json) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/feedbacks','get',json)
      .then(
        e=>{
          return dispatch({
            type    : FEEDBACK,
            payload : e.objs
          })
        }
      )
      .catch(e=>({error:e}))

  }
}

export const updatefeedback = (json,option,type=1) => {
  return (dispatch, getState) => {
    return easyfetch(host,'/a/feedbacks','put',json)
      .then(e=>{
        if(type==1){
          return dispatch(feedback(option))
        }
      })
      .catch(e=>({error:e}))

  }
}



const ACTION_HANDLERS = {
  [FEEDBACK]    : (state, action) => state.update('feedback',() =>Immutable.fromJS(action.payload)),

};

// ------------------------------------
// Reducer
// ------------------------------------
export default function feedbackReducer (state = Immutable.Map(), action) {
  const handler = ACTION_HANDLERS[action.type]
  return handler ? handler(state, action) : state
}
