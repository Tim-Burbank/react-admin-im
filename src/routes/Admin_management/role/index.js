
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {RolePage} from './component/Role_page'


export default (store) => ({
  path : rootPath.role,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const RolePage = require('./component/Role_page').default;
      const reducer = require('./module/role').default
      injectReducer(store, { key: 'role', reducer })
      cb(null, RolePage)
    }, 'RolePage')
  },


})

