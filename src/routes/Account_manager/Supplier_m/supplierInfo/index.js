/**
 * Created by Yurek on 2017/5/17.
 */
import { injectReducer } from 'store/reducers'
import { rootPath,childPath } from '../../../../config'

export default (store) => ({
  path : 'supplier_management/supplierInfo/:id',
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SupplierInfo = require('./containers/supplierInfo').default
      const reducer = require('./modules/supplierInfo').default
      injectReducer(store, { key: 'supplierInfo', reducer });
      cb(null, SupplierInfo)
    }, 'supplierInfo')
  }
})
