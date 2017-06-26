
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import SupplierFinance  from './container/SupplierFinance'

export default (store) => ({
  path : rootPath.supplier_finance,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SupplierFinance = require('./container/SupplierFinance').default;
      const reducer = require('./module/supplierFinance').default
      injectReducer(store, { key: 'supplierFinance', reducer })
      cb(null, SupplierFinance)
    }, 'SupplierFinance')
  },


})

