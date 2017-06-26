import React from 'react'
import CustomerFinance from '../component/CustomerFinance'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  customerFinance : state.getIn(['customerFinance','customerFinance']),
});

export default connect(mapStateToProps)(CustomerFinance)
