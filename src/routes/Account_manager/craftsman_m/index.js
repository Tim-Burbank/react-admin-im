
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {CraftsmanManagementPage} from './containers/Craftsman_man_page'

export default (store) => ({
  path : rootPath.craftsman_management,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const CraftsmanManagementPage = require('./containers/Craftsman_man_page').default;
      const reducer = require('./module/craftsmanManagement').default
      injectReducer(store, { key: 'craftsmanManagement', reducer })
      cb(null, CraftsmanManagementPage)
    }, 'CraftsmanManagementPage')
  },


})

