
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../../config'
import SupplierFinanceInfo from './container/SupplierFinanceInfo'

export default (store) => ({
  path : 'supplier_finance/supplierFinanceInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SupplierFinanceInfo = require('./container/SupplierFinanceInfo').default;
      const reducer = require('./module/supplierFinanceInfo').default
      injectReducer(store, { key: 'supplierFinanceInfo', reducer })
      cb(null, SupplierFinanceInfo)
    }, 'SupplierFinanceInfo')
  },


})

