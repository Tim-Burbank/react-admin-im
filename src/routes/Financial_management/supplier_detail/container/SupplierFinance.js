import React from 'react'
import SupplierFinance from '../component/SupplierFinance'
import { connect } from 'react-redux'

const mapStateToProps = (state) => ({
  supplierFinance : state.getIn(['supplierFinance','supplierFinance']),
});

export default connect(mapStateToProps)(SupplierFinance)
