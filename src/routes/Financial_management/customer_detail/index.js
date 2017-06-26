
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {CustomerFinance} from './container/CustomerFinance'

export default (store) => ({
  path : rootPath.customer_finance,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CustomerFinance = require('./container/CustomerFinance').default;
      const reducer = require('./module/customerFinance').default
      injectReducer(store, { key: 'customerFinance', reducer })
      cb(null, CustomerFinance)
    }, 'CustomerFinance')
  },


})

