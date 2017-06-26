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
import {pushType,jpushTableFields as pushT,titles as _tit,feedbackTableField as _feeT,feedbackReplyStatus,feedbackStatus,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,customerStatus,customerFreezed} from '../../../../config'
import Immutable from 'immutable'
import {feedback,updatefeedback} from '../module/feedback'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'


class FeedbackPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      searchOption:null,
      currentPage:1,
      pushModal:false,
      pushInformation:null
    }
  }


  componentWillMount(){
    const {dispatch,params,location} = this.props;
    console.log('this.props',this.props)
    if(location && location.query){
      this.setState({loading:true});
      dispatch(feedback(location.query)).then((e)=>{
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
    this.setState({loading:true});
    this.setState({searchOption:values})
    //获取数据
    dispatch(feedback(values)).then((e)=>{
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
  //  dispatch(pathJump('feedback/customerInfo/new'))
  //};

  //getcontent=()=>{
  //  return <Button onClick={this.create} type='primary'>New Customer</Button>
  //};

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }

  handleAccount=(action,rls,tips)=>{

    const {dispatch,feedback,intl:{formatMessage}} = this.props

    let _supData= feedback.toJS()
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
        feedbackId: idArr.join(','),
        replied: rls
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




  onPageChange=(pageNumber)=>{
    console.log('Page: ', pageNumber);
  }

  render(){
    const {intl:{formatMessage},feedback,location:{pathname}} = this.props;
    const {pushModal,pushInformation} = this.state
    console.log('pathname',pathname)

    const { loading } = this.state
    const columns = [
      {dataIndex:_feeT.username,render:(text,record)=>{
        return record.getIn(['account','username'])
      }},
      {dataIndex:_feeT.mobile,render:(text,record)=>{
        return record.getIn(['account','mobile'])
      }},
      {dataIndex:_feeT.email,render:(text,record)=>{
        return record.getIn(['account','email'])
      }},

      {dataIndex:_feeT.accountType,render:(text,record)=>{
        return configDirectoryObject(record.getIn(['account','type']),pushType)
      }},
      {dataIndex:_feeT.createdAt,render:date=>formatDate(date)},
      {dataIndex:_feeT.title},
      {dataIndex:_feeT.replied,render:(text,record)=>{
      return configDirectoryObject(text,feedbackReplyStatus)
    }},
      {dataIndex:_feeT.content,render:(text,$record)=>{
        return (
          <a onClick={()=>{this.setState({pushModal:true,pushInformation:text})}} >
            {formatMessage({id:'view'})}
          </a>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`feedback_${item.dataIndex}`}),
      })
    );

    this.formColumns=[
      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['customer','supplier']},
      {dataIndex:'replied',placeholder:'status',type:'select',selectOption:feedbackStatus},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    );



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
      }
    };

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.feedback}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updatefeedback,1,'Complete ')} style={{marginRight:'10px'}}>{formatMessage({id:'feedbackComplete'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={feedback}
          pagination={{ pageSize: 13,total:feedback&&feedback.size}}
          onChange={this.changeTable}
        />
        <Modal
          visible={pushModal}
          onCancel={()=>this.setState({pushModal:false,pushId:null})}
          title={formatMessage({id:'infoPushDetail'})}
          footer={null}
          maskClosable={false}
          okText="Push"
          cancelText="Cancel"
        >
          <p>{pushInformation}</p>
        </Modal>
      </Row>
    )
  }
}

FeedbackPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  feedback : state.getIn(['feedback','feedback']),
});

export default injectIntl(connect(mapStateToProps)(FeedbackPage))


//const WrappedSystemUser = Form.create()();


