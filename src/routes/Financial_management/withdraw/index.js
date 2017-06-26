
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {Withdraw} from './component/Withdraw'

export default (store) => ({
  path : rootPath.withdraw,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const Withdraw = require('./component/Withdraw').default;
      const reducer = require('./module/withdraw').default
      injectReducer(store, { key: 'withdraw', reducer })
      cb(null, Withdraw)
    }, 'Withdraw')
  },


})

