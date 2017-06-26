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
import {withdrawStatus,transactionStatus,withdrawTableField as _witT , titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,rlsStatus} from '../../../../config'
import Immutable from 'immutable'
import {fetchWithdraw,updateWithdraw} from '../module/withdraw'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'




class Withdraw extends React.Component{
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
      dispatch(fetchWithdraw(location.query)).then((e)=>{
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
    dispatch(fetchWithdraw(values)).then((e)=>{
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
    const {intl:{formatMessage},withdraw,location:{pathname}} = this.props;
    const {pushModal} = this.state
    console.log('pathname',pathname)


    const { loading } = this.state
    const columns = [
      {dataIndex:_witT.username,render:(text,record)=>{
        return record.getIn(['account','username'])
      }},
      {dataIndex:_witT.createdAt,render:date=>formatDate(date)},
      {dataIndex:_witT.updatedAt,render:date=>formatDate(date)},
      {dataIndex:_witT.transactionStatus,render:(text,record)=>{
        return configDirectoryObject(text,transactionStatus)
      }},
      {dataIndex:_witT.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/withdrawInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`withdraw_${item.dataIndex}`}),
      })
    )

    this.formColumns=[
      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'supplier_name'},
      {dataIndex:'transactionStatus',placeholder:formatMessage({id:'select_withdraw_status'}),type:'select',selectOption:withdrawStatus},
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

    const Selection = {
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedNum:selectedRowKeys});
        this.setState({selectedRows:selectedRows})
      },
    };

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.withdraw}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateWithdraw.stop,10,'Stop ')} style={{marginRight:'10px'}}>{formatMessage({id:'supplier_stopAc'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={withdraw}
          pagination={{ pageSize: 13,total:withdraw&&withdraw.size}}
          onChange={this.changeTable}
        />
      </Row>
    )
  }
}

Withdraw.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  withdraw : state.getIn(['withdraw','withdraw']),
});

export default injectIntl(connect(mapStateToProps)(Withdraw))


//const WrappedSystemUser = Form.create()();


