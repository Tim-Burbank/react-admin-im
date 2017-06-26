/**
 * Created by Yurek on 2017/5/11.
 */
import React from 'react'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination } from  'antd'
import { connect } from 'react-redux'
import {ImmutableTable} from '../../../components/antd/Table'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Link} from 'react-router'
import { pathJump,takeId } from '../../../utils/'
import TopSearch from '../../../components/search/topSearch'
import Title from '../../../components/title/title'
import {pro_status,productAdminStatus,titles as _tit,supplierType,supplierStatus,productTableFielsd as _prot,supplierShowType,rlsStatus,orderStatus,orderStatus_type,productCate,productStatus,proStatus,freezed} from '../../../config'
import Immutable from 'immutable'
import {fetchProduct,updateProduct} from '../module/productManagement'
import {formatDate,formatMoney,configDirectory,configDirectoryObject} from '../../../utils/formatData'


class ProductManagementPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      loading : false,
      selectedNum:[],
      currentPage:1
    }
  }

  componentWillMount(){
    const {dispatch,params,location} = this.props;
    if(location && location.query){
      this.setState({loading:true});
      dispatch(fetchProduct(location.query)).then((e)=>{
        if(e.error){
          message.error(e.error.message);
        }else{
          this.setState({loading:false})
        }
      });
    }
  }

  onFetch = (values) =>{
    const {dispatch,product}=this.props;
    this.setState({loading:true})
    //获取数据
    dispatch(fetchProduct(values)).then((e)=>{
      if(e.error){
        message.error(e.error.message);
      }else{
        this.setState({loading:false})
      }
    });
  };

  create=e=>{
    const {dispatch} = this.props
    dispatch(pathJump('product_management/new_product'))
  };

  getcontent=()=>{
    const {intl:{formatMessage}} = this.props
    return <Button onClick={this.create} type='primary'>{formatMessage({id:"new_product"})}</Button>
  };



  handleAccount=(action,rls,tips)=>{
    const {dispatch,product,intl:{formatMessage}} = this.props
    let _supData= product.toJS()
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
        productId: idArr.join(','),
        adminRls: rls
      }
      this.setState({loading:true});
      dispatch(action(json, this.state.searchOption)).then(e=> {
        if (e.payload) {
          message.success(tips + this.state.selectedNum.length + " account success")
          this.setState({loading: false, selectedNum: []});
        }else{
          message.error(e.error.message)
          this.setState({loading: false, selectedNum: []});
        }
      })
    }else{
      message.error(formatMessage({id:"selectOne"}))
    }
  }

  changeTable=(pagination, filters, sorter) => {
    console.log(pagination, filters, sorter)
    this.setState({currentPage:pagination.current})
  }




  render(){
    const {intl:{formatMessage},product,location:{pathname},count} = this.props;
    console.log('count',count)
    console.log('pathname',pathname)
    console.log("product",product)

    const { loading } = this.state
    const columns = [
      {dataIndex:_prot.name},
      {dataIndex:_prot.craftsman,render:(text,record)=>{
        return record.getIn(['craftsman','account','username'])
      }},

      {dataIndex:_prot.supplier,render:(text,record)=>{
        return record.getIn(['supplier','account','username'])
      }},
      {dataIndex:_prot.createdAt,render:date=>formatDate(date)},
      {dataIndex:_prot.updatedAt,render:date=>formatDate(date)},
      {dataIndex:_prot.categoryId},
      {dataIndex:_prot.adminRls,render:(text,record)=>{
        return configDirectory(text,pro_status)
      }},
      {dataIndex:_prot.userRls,render:(text,record)=>{
        return configDirectoryObject(text,proStatus)
      }},
      {dataIndex:_prot.operation,render:(text,$record)=>{
        return (
          <Link to={`${pathname}/productInfo/${$record.get('id')}`}>
            {formatMessage({id:"view"})}
          </Link>)
      }}
    ].map(
      item=>({
        ...item,
        title:formatMessage({id:`product_${item.dataIndex}`}),
      })
    )

    this.formColumns=[
      {dataIndex:'createdAt',type:'date',},
      {dataIndex:'updatedAt',type:'date'},
      {dataIndex:'option',placeholder:'option',type:'select',selectOption:['Craftsman Name','Supplier Name']},
      {dataIndex:'keywords',formTag:'input'},
      {dataIndex:'category',placeholder:formatMessage({id:'select_pro_status'}),type:'select',selectOption:productCate},
      {dataIndex:'adminRls',placeholder:formatMessage({id:'select_pro_status'}),type:'select',selectOption:productAdminStatus},
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
      },
    };

    return (
      <Row>
        <Title title={formatMessage({id:`${_tit.product_management}`})} />
        <TopSearch  {...searchProps} />
        <div style={{display:'flex',justifyContent:'flex-start',marginTop:'20px'}}>
          <Button onClick={this.handleAccount.bind(this,updateProduct.stop,0,'Stop ')} style={{marginRight:'10px'}}>{formatMessage({id:'stop'})}</Button>
          <Button onClick={this.handleAccount.bind(this,updateProduct.active,1,'Active ')} style={{marginRight:'10px'}}>{formatMessage({id:'active'})}</Button>
          {this.state.selectedNum.length>0 &&
          <p style={{fontSize:16,lineHeight:'31px'}}>{formatMessage({id:"selected"})} <span style={{color:"#108ee9"}}>{this.state.selectedNum.length}</span> {formatMessage({id:"item"})}</p>}
        </div>
        <ImmutableTable
            loading={loading}
            rowSelection={Selection}
            style={{marginTop:20}}
            columns={columns}
            dataSource={product}
            pagination={{ pageSize: 13,total:product&&product.size}}
            onChange={this.changeTable}
          />
      </Row>
    )
  }
}


ProductManagementPage.propTypes = {
  pathJump : React.PropTypes.func,
};


const mapStateToProps = (state) => ({
  product : state.getIn(['productManagement','product']),
});

export default injectIntl(connect(mapStateToProps)(ProductManagementPage))


//const WrappedSystemUser = Form.create()();


