/**
 * Created by Yurek on 2017/5/17.
 */
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'withdraw/withdrawInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const WthdrawInfo = require('./component/withdrawInfo').default
      const reducer = require('./module/withdrawInfo').default
      injectReducer(store, { key: 'withdrawInfo', reducer });
      cb(null, WthdrawInfo)
    }, 'WthdrawInfo')
  }
})
