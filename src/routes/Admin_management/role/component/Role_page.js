/**
 * Created by Yurek on 2017/6/9.
 */
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
import {roleTableField as _rolT ,pushType,jpushTableFields as pushT,titles as _tit,feedbackTableField as _feeT,feedbackReplyStatus,feedbackStatus,supplierType,supplierStatus,supplierTableFields as _sup,supplierShowType,customerStatus,customerFreezed} from '../../../../config'
import Immutable from 'immutable'
import {fetchRole,updateRole,deleteRole} from '../module/role'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../../utils/formatData'


class RolePage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      searchOption:null,
      currentPage:1,
      pushModal:false,
      pushInformation:null,
      role:null
    }
  }



  componentWillMount(){
    const {dispatch,params,location} = this.props;
    console.log('this.props',this.props)
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchRole(location.query)).then((e)=>{
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
    let json = {
      name_fuzzyMatch:values.role
    }
    dispatch(fetchRole(json)).then((e)=>{
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
    dispatch(pathJump('role/roleInfo/new'))
  };

  getcontent=()=>{
    return <Button onClick={this.create} type='primary'>New Role</Button>
  };

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }

  handleAccount=(action,rls,tips)=>{

    const {dispatch,role,intl:{formatMessage}} = this.props

    let _supData= role.toJS()
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
        ids: idArr
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " role success")
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
    const {intl:{formatMessage},role,location:{pathname}} = this.props;
    const {pushModal,pushInformation} = this.state
    console.log('pathname',pathname)

    const { loading } = this.state
    const columns = [
      {dataIndex:_rolT.name},
      {dataIndex:_rolT.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/roleInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`role_${item.dataIndex}`}),
      })
    );

    this.formColumns=[
      {dataIndex:'role'},
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`search_${item.dataIndex}`}),
      })
    );



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
        <Title title={formatMessage({id:`${_tit.role}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,deleteRole,1,'Delete ')} style={{marginRight:'10px'}}>{formatMessage({id:'roleDel'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
          loading={loading}
          rowSelection={Selection}
          style={{marginTop:20}}
          columns={columns}
          dataSource={role}
          pagination={{ pageSize: 13,total:role&&role.size }}
          onChange={this.changeTable}
        />
      </Row>
    )
  }
}

RolePage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  role : state.getIn(['role','role']),
});

export default injectIntl(connect(mapStateToProps)(RolePage))


//const WrappedSystemUser = Form.create()();


