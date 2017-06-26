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
import { pathJump } from '../../../../utils/'
import TopSearch from '../../../../components/search/topSearch'
import Title from '../../../../components/title/title'
import {titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,customerStatus,customerFreezed} from '../../../../config'
import Immutable from 'immutable'
import {fetchCustomer,updateCustomer} from '../module/customerManagement'
import {formatDate,formatMoney,configDirectory} from '../../../../utils/formatData'
import {pushInfo,groupPushInfo} from '../../../message_management/information_push/module/informationPush'



class CustomerManagementPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      searchOption:null,
      currentPage:1,
      pushModal:false,
      pushInfomation:null,
      pushId:null,
      pushLoad:null,
      group:false
    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
    console.log('this.props',this.props)
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchCustomer(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
    }
  }

  onFetch = (values) =>{
    const {dispatch,customerAccount}=this.props;
    this.setState({searchOption:values})
    this.setState({loading:true});
    //获取数据
    dispatch(fetchCustomer(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false});
      }else{
        this.setState({loading:false})
      }
    });
  };

  create=e=>{
    const {dispatch} = this.props
    dispatch(pathJump('customer_management/customerInfo/new'))
  };
  groupPushFun=()=>{
    this.setState({pushModal:true,group:true})
  }

  getcontent=()=>{
    const {intl:{formatMessage}} = this.props
    return (
      <Col>
        <Button style={{marginRight:'10px'}} onClick={this.create} type='primary'>{formatMessage({id:"newCustomer"})}</Button>
        <Button style={{marginRight:'10px'}} onClick={this.groupPushFun} >{formatMessage({id:"groupPush_cus"})}</Button>
      </Col>)
  };

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }


  handleAccount=(action,rls,tips)=>{

    const {dispatch,customerAccount,intl:{formatMessage}} = this.props
    let _supData= customerAccount.toJS()
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
        status: rls
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " account success")
          this.setState({loading: false, selectedNum: []});
        } else {
          message.error(e.error.message)
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }
  }
  changePush=(e)=>{
    this.setState({pushInfomation:e.target.value})
  }

  handlePushModal=()=> {
    const {pushId,pushInfomation,group} = this.state
    const {dispatch,customerAccount,intl:{formatMessage}} = this.props
    let _supData = customerAccount.toJS()
    let idArr = [];
    if(group){
      let json={
        tag:'customer',
        message:pushInfomation,
        type:1
      }
      this.setState({pushLoad:true})
      dispatch(groupPushInfo(json)).then(e=>{
        if(e.payload){
          message.success(formatMessage({id:'sendMessageSuccess_sup'}))
          this.setState({pushLoad:false,pushModal:false,pushInfomation:null,group:null})
        }else{
          message.error(e.error.message)
          this.setState({pushLoad:false,pushModal:false,pushId:null,group:null})
        }
      })
    }else{
      if (pushId == null) {
        let _selectedNum = this.state.selectedNum
        let page = this.state.currentPage
        if(_selectedNum.length>0){
          if(page == 1){
            _selectedNum.map(z=>{
              idArr.push(_supData[z]['id'])
            })
          }else{

            _selectedNum.map(z=>{
              console.log('page',z+(page-1)*13)
              idArr.push(_supData[z+(page-1)*13]['id'])
            })
          }

          console.log(idArr)
          let json = {
            message: pushInfomation,
            accountId: idArr.join(",")
          }
          this.setState({pushLoad:true})
          dispatch(pushInfo(json)).then(e=>{
            if(e.payload){
              message.success('Successfully push '+this.state.selectedNum.length+" messages")
              this.setState({pushLoad:false,pushModal:false,pushInfomation:null,pushId:null})
            }else{
              message.error(e.error.message)
              this.setState({pushLoad:false,pushModal:false,pushId:null})
            }
          })

        }else{
          message.error(formatMessage({id:"selectOne"}))
        }
      } else {
        let json = {
          message: pushInfomation,
          accountId: pushId
        }

        this.setState({pushLoad:true})
        dispatch(pushInfo(json)).then(e=>{
          if(e.payload){
            message.success(formatMessage({id:'sendMessageSuccess'}))
            this.setState({pushLoad:false,pushModal:false,pushInfomation:null,pushId:null})
          }else{
            message.error(e.error.message)
            this.setState({pushLoad:false,pushModal:false,pushId:null})
          }
        })
      }
    }

  }


  onPageChange=(pageNumber)=>{
    console.log('Page: ', pageNumber);
  }

  render(){
    const {intl:{formatMessage},customerAccount,location:{pathname}} = this.props;
    const {pushModal,pushInfomation} = this.state
    console.log('pathname',pathname)

    const { loading } = this.state
    const columns = [
      {dataIndex:_sup.username,render:(text,record)=>{
        return record.getIn(['account','username'])
      }},

      {dataIndex:_sup.phoneNumber,render:(text,record)=>{
        return record.getIn(['account','mobile'])
      }},
      {dataIndex:_sup.createdAt,render:date=>formatDate(date)},
      {dataIndex:_sup.status,render:(text,record)=>{
        return configDirectory(text,customerFreezed)
      }},
      {dataIndex:_sup.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/customerInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }},
      {dataIndex:_sup.pushinfo,render:(text,$record)=>{
        return (
          <a onClick={()=>{this.setState({pushModal:true,pushId:$record.getIn(['account','id'])})}} >
            {formatMessage({id:'sendMessage'})}
          </a>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`supplier_${item.dataIndex}`}),
      })
    )

    this.formColumns=[

      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'freezed',placeholder:formatMessage({id:'select_cus_status'}),type:'select',selectOption:customerStatus},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['username','phone number']},
      {dataIndex:'keywords',formTag:'input'},

    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    )

    let searchProps={
      formColumns:this.formColumns,
      onSave:this.onFetch,
      rightContent:this.getcontent()
    };

    const Selection = {
      selectedRowKeys:this.state.selectedNum,
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.setState({selectedNum:selectedRowKeys});
        this.setState({selectedRows:selectedRows})
      }
    };

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.customer_management}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateCustomer.stop,2,'Stop ')} style={{marginRight:'10px'}}>{formatMessage({id:'customer_stopAc'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateCustomer.active,1,'Active ')} style={{marginRight:'10px'}}>{formatMessage({id:'customer_actAc'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={customerAccount}
          pagination={{ pageSize: 13,total:customerAccount&&customerAccount.size }}
          onChange={this.changeTable}
        />
        <Modal
          visible={pushModal}
          onCancel={()=>this.setState({pushModal:false,pushId:null})}
          title={formatMessage({id:'infoPush'})}
          onOk={this.handlePushModal}
          maskClosable={false}
          okText="Push"
          cancelText="Cancel"
        >
          <Spin  spinning={this.state.pushLoad} tip="Pushing..." >
            <Row>
              <Col span="24">
                <Input type="textarea" placeholder={formatMessage({id:'sendPlacehold'})} value={pushInfomation} onChange={this.changePush}  autosize={{ minRows: 8 }} />
              </Col>
            </Row>
          </Spin>
        </Modal>
      </Row>
    )
  }
}

CustomerManagementPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  customerAccount : state.getIn(['customerManagement','customerAccount']),
});

export default injectIntl(connect(mapStateToProps)(CustomerManagementPage))


//const WrappedSystemUser = Form.create()();


