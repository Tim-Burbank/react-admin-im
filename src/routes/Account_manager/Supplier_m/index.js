/**
 * Created by Yurek on 2017/5/17.
 */
/**
 * Created by Yurek on 2017/5/11.
 */
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {SupplierManagementPage} from './containers/Supplier_man_page'
import SupplierInfoPage from './supplierInfo/containers/supplierInfo'
import SupplierInfo from './supplierInfo/'




export default (store) => ({
  path : rootPath.supplier_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const SupplierManagementPage = require('./containers/Supplier_man_page').default;
      const reducer = require('./module/supplierManagement').default
      injectReducer(store, { key: 'supplierManagement', reducer })
      cb(null, SupplierManagementPage)
    }, 'SupplierManagementPage')
  },


})

