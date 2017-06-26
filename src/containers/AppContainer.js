import React, { Component, PropTypes } from 'react'
import { browserHistory, Router } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import { addLocaleData } from 'react-intl'
import { Provider } from 'react-redux'
import en from 'react-intl/locale-data/en'
import zh from 'react-intl/locale-data/zh'
import LocaleContainer from './LocaleContainer'
import enUS from 'antd/lib/locale-provider/en_US';
import 'styles/core.scss'
import moment from 'moment';
moment.locale('en');

class AppContainer extends Component {
  static propTypes = {
    routes : PropTypes.object.isRequired,
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { routes, store } = this.props
    const history = syncHistoryWithStore(browserHistory, store, {
      selectLocationState (state) {
        return state.get('routing')
      }
    })
    addLocaleData([...en,...zh])
    return (
      <Provider store={store}>
        <LocaleContainer>
          <div style={{ height: '100%' }}>
            <Router history={history} children={routes} />
          </div>
        </LocaleContainer>
      </Provider>
    )
  }
}

export default AppContainer
