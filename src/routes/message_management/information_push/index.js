
import { injectReducer } from 'store/reducers'
import { rootPath,chilPath } from '../../../config'
import {InformationPushPage} from './component/Information_push_page'


export default (store) => ({
  path : rootPath.information_push,
  getComponent (nextState, cb) {
    require.ensure([], (require) => {
      const InformationPushPage = require('./component/Information_push_page').default;
      const reducer = require('./module/informationPush').default
      injectReducer(store, { key: 'informationPush', reducer })
      cb(null, InformationPushPage)
    }, 'InformationPushPage')
  },


})

