/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Modal,Col,Input  } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import { pathJump,takeId } from '../../../../utils/'
import TopSearch from '../../../../components/search/topSearch'
import Title from '../../../../components/title/title'
import {financeTableField as _finT,financeStatusArr,financeStatus,withdrawStatus,transactionStatus,withdrawTableField as _witT , titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,rlsStatus} from '../../../../config'
import Immutable from 'immutable'
import {fetchCustomerFinance} from '../module/customerFinance'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'





class CustomerFinance extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      currentPage:1,

    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchCustomerFinance(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
    }
  }

  onFetch = (values) =>{
    this.setState({loading:true});
    const {dispatch,craftsmanAccount}=this.props;

    //获取数据
    dispatch(fetchCustomerFinance(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false})
      }else{
        this.setState({loading:false})
      }
    });
  };


  //create=e=>{
  //  const {dispatch} = this.props
  //  dispatch(pathJump('craftsman_management/new_craftsman'))
  //};

  //
  //getcontent=()=>{
  //  const {dispatch,supplierAccount,intl:{formatMessage}} = this.props
  //  return (
  //    <Col>
  //      <Button style={{marginRight:'10px'}} onClick={this.create} type='primary'>{formatMessage({id:"newCraftsman"})}</Button>
  //      <Button style={{marginRight:'10px'}} onClick={this.groupPushFun} >{formatMessage({id:"groupPush_cra"})}</Button>
  //    </Col>
  //  )
  //};

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }

  handleAccount=(action,rls,tips)=>{
    const {dispatch,withdraw,intl:{formatMessage}} = this.props
    let _supData= withdraw.toJS()
    let idArr = [];
    let _selectedNum = this.state.selectedNum
    let page = this.state.currentPage
    if(_selectedNum.length>0) {
      if (page == 1) {
        _selectedNum.map(z=> {
          idArr.push(_supData[z]['id'])
        })
      } else {
        _selectedNum.map(z=> {
          console.log('page', z + (page - 1) * 13)
          idArr.push(_supData[z + (page - 1) * 13]['id'])
        })
      }

      console.log(idArr)
      let json = {
        ids: idArr,
        rlsStatus: rls
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " account success")
          this.setState({loading: false, selectedNum: []});
        }else{
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }
  }

  render(){
    const {intl:{formatMessage},customerFinance,location:{pathname}} = this.props;
    const {pushModal} = this.state
    console.log('pathname',pathname)


    const { loading } = this.state
    const columns = [
      {dataIndex:_finT.username},
      {dataIndex:_finT.mobile},
      {dataIndex:_finT.createdAt,render:date=>formatDate(date)},
      {dataIndex:_finT.balance,render:(text,record)=>{
        return formatMoney(record.getIn(['wallet','balance']))
      }},
      {dataIndex:_finT.status,render:(text,record)=>{
        return configDirectoryObject(record.getIn(['wallet','status']),financeStatus)
      }},
      {dataIndex:_finT.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/customerFinanceInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`finance_${item.dataIndex}`}),
      })
    )

    this.formColumns=[
      {dataIndex:'username'},
      {dataIndex:'finance_status',placeholder:formatMessage({id:'select_fin_status'}),type:'select',selectOption:financeStatusArr},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    )



    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      //rightContent:this.getcontent()
    };



    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.customerFinance}`})} />
        <TopSearch  {...searchProps} />
        <ImmutableTable
          loading={loading}
          style={{marginTop:20}}
          columns={columns}
          dataSource={customerFinance}
          pagination={{ pageSize: 13,total:customerFinance&&customerFinance.size }}
        />
      </Row>
    )
  }
}


CustomerFinance.propTypes = {
  pathJump : React.PropTypes.func,
};


export default injectIntl(CustomerFinance)

//const WrappedSystemUser = Form.create()();


