
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {FeedbackPage} from './component/Feedback_page'


export default (store) => ({
  path : rootPath.feedback,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const FeedbackPage = require('./component/Feedback_page').default;
      const reducer = require('./module/feedback').default
      injectReducer(store, { key: 'feedback', reducer })
      cb(null, FeedbackPage)
    }, 'FeedbackPage')
  },


})

