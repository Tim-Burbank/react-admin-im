
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../../config'
import CustomerFinanceInfo from './container/CustomerFinanceInfo'

export default (store) => ({
  path : 'customer_finance/customerFinanceInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CustomerFinanceInfo = require('./container/CustomerFinanceInfo').default;
      const reducer = require('./module/customerFinanceInfo').default
      injectReducer(store, { key: 'customerFinanceInfo', reducer })
      cb(null, CustomerFinanceInfo)
    }, 'CustomerFinanceInfo')
  },


})

