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
import {pushType,jpushTableFields as pushT,titles as _tit,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,customerStatus,customerFreezed} from '../../../../config'
import Immutable from 'immutable'
import {fetchJpushs} from '../module/informationPush'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'


class InformationPushPage extends React.Component{
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
      dispatch(fetchJpushs(location.query)).then((e)=>{
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
    this.setState({loading:true})
    //获取数据
    dispatch(fetchJpushs(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
        this.setState({loading:false})
      }else{
        this.setState({loading:false})
      }
    });
  };

  create=e=>{
    const {dispatch} = this.props
    dispatch(pathJump('customer_management/customerInfo/new'))
  };

  //getcontent=()=>{
  //  return <Button onClick={this.create} type='primary'>New Customer</Button>
  //};

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
        freezed: rls
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
    const {intl:{formatMessage},informationPush,location:{pathname}} = this.props;
    const {pushModal,pushInformation} = this.state
    console.log('pathname',pathname)

    const { loading } = this.state
    const columns = [
      {dataIndex:pushT.username,render:(text,record)=>{
        return record.has('account')?record.getIn(['account','username']):'Push to all'
      }},

      {dataIndex:pushT.type,render:(text,record)=>{
        return configDirectoryObject(text,pushType)
      }},
      {dataIndex:pushT.createdAt,render:date=>formatDate(date)},

      {dataIndex:pushT.content,render:(text,$record)=>{
        return (
          <a onClick={()=>{this.setState({pushModal:true,pushInformation:text})}} >
            {formatMessage({id:'view'})}
          </a>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`push_${item.dataIndex}`}),
      })
    )


    this.formColumns=[
      {dataIndex:'createdAt_between',type:'date'},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['customer','craftsman','supplier']},
      {dataIndex:'group',type:'check',noLable:true,width:450,options:{valuePropName: 'checked', initialValue: false,}},
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
        <Title title={formatMessage({id:`${_tit.information_push}`})} />
        <TopSearch  {...searchProps} />
        <ImmutableTable
          loading={loading}
          style={{marginTop:20}}
          columns={columns}
          dataSource={informationPush}
          pagination={{ pageSize: 13,total:informationPush&&informationPush.size }}
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

InformationPushPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  informationPush : state.getIn(['informationPush','informationPush']),
});

export default injectIntl(connect(mapStateToProps)(InformationPushPage))


//const WrappedSystemUser = Form.create()();


