
import React from 'react'
import Immutable from 'immutable'
import SimpleForm from '../../../../../components/antd/SimpleForm'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Title from '../../../../../components/title/title'
import { injectIntl } from 'react-intl'
import { Row , message , Spin ,Button ,Pagination,Form,Input,Col ,Radio,Upload,Icon,Modal,Select,Card,Checkbox } from  'antd'
import { connect } from 'react-redux'
import { ImmutableTable } from '../../../../../components/antd/Table'
import { Link } from 'react-router'
import { titles as _tit,supplierType,supplierStatus,orderDetails as _ordD,supplierShowType,supplierDetails as _supd,gender,orderDetailTitle,orderStatus_type,customerDetails as _cusD,payment} from '../../../../../config'
import { formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress } from '../../../../../utils/formatData'
import { fetchRoleInfo,newRoleInfo } from '../module/roleInfo'
import { getFormRequired } from '../../../../../utils/common'
import { role_config as _rolC } from '../../../../../role_config'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;



class RoleInfoPage extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      previewImage:'',
      newPage:false,
      visible:false,
      roleName:null,
      indeterminate: true,
      checkAll: false,
      loading:false
    }
  }
  componentWillMount(){
    const {dispatch,params} = this.props;
    if(params.id =='new'){
      this.setState({newPage:true})
    }else{
      this.setState({loading:true})
      dispatch(fetchRoleInfo(params.id,'get')).then(e=>{
        if(e.payload){
          this.setState({roleName:e.payload.name})
          let _e= e.payload
          let _map = {};
          let perArr = []
          _e.targetPermissions.map(v=>{
            if(_map['checkedList_'+v.object]&&_map['checkedList_'+v.object].length>0){
              _map['checkedList_'+v.object].push(v.id)
            }else{
              _map['checkedList_'+v.object]=[];
              _map['checkedList_'+v.object].push(v.id)
            }
          }
          )
          this.setState(_map)
          this.setState({loading:false})
        }
      })
    }
  }


  handleSave=()=>{
    const {dispatch,params,intl:{formatMessage}} = this.props;

    let perArr = [];
    let _state = this.state
    for(let p in _state){
      if(p.substring(0,11) == 'checkedList'){
        console.log("1111")
        perArr=perArr.concat(_state[p])

      }
    }

    console.log("perArr",perArr)

        if(this.state.newPage){
          let json = {
            "name": this.state.roleName,
            "permissionIds": perArr,
          }
          this.setState({loading:true})
          dispatch(fetchRoleInfo('','post',json)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({loading:false})
            }else{
              message.success(formatMessage({id:'save_ok'}))
              this.setState({loading:false})
            }
          })
        }else{
          let json = {
            "name": this.state.roleName,
            "permissionIds": perArr,
          }
          this.setState({loading:true})
          dispatch(fetchRoleInfo(params.id,'put',json)).then(e=>{
            console.log(e)
            if(e.error){
              message.error(e.error.message)
              this.setState({loading:false})
            }else{
              dispatch(fetchRoleInfo(params.id,'get'))
              message.success(formatMessage({id:'modify_ok'}))
              this.setState({loading:false})
            }
          })
        }
        //新增或编辑



  }

  save= ()=>{
    this.setState({visible:true})
  }

  cancelOrder=()=>{

  }

  getDes = (v)=>{
    console.log('vvvvvv',v)
    let arr= []
    v.map(c=>{
      arr.push(c.id)
    })
    return arr
  }


  onRoleChange = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  }
  onCheckAllChange = (e,plainOptions) => {
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }

  delId= (assets)=> {
    console.log('assets1',assets)
    assets.map((v,i)=>{
      if(v[0] =='id'){
        assets.splice(i,1)
      }
    })
    console.log('assets2',assets)
    return assets
  }

  getAllDes = (assets) =>{
    let arr = [];
    for( let v in assets){
      if(v !== 'permissions'){
        if(assets[v]['permissions']){
          assets[v]['permissions'].map(v=>{
            arr.push(v.id)
          })
        }else{
          arr = arr
        }
      }else{
        assets['permissions'].map(b=>{
          arr.push(b.id)
        })
      }

    }
    return arr
  }

  render(){
    const {intl:{formatMessage},orderInfo,location:{pathname},params} = this.props;
    const {previewVisible ,previewImage,newPage,visible } = this.state
    console.log('this.state',this.state)
    const column = [
      {dataIndex:_ordD.productName,deep:['product','name']},
      {dataIndex:_ordD.orderStatus,trans:configDirectoryObject,config:orderStatus_type,bold:true},
      {dataIndex:_ordD.supplier,deep:['supplier','name']},
      {dataIndex:_ordD.craftsman,deep:['craftsman','name']},
      {dataIndex:_ordD.startDt},
      {dataIndex:_ordD.endDt},
      {dataIndex:_ordD.pressStart,deep:['startDt']},
      {dataIndex:_ordD.originPrice},
      {dataIndex:_ordD.currentPrice},
      {dataIndex:_ordD.craftsPhone,deep:['craftsman','account','mobile']},
    ];

    let cardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`order_${orderDetailTitle.product_cra}`})}</p>
        </Col>
      </Row>
    );

    let anotherCardHeader = (
      <Row>
        <Col span={24} style={{ textAlign: 'center' }}>
          <p className="title_words">{formatMessage({id:`order_${orderDetailTitle.cust_info}`})}</p>
        </Col>
      </Row>
    );

    let cardProps = {
      title: cardHeader,
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };

    let anotherCardProps = {
      title: anotherCardHeader,
      style: {borderRadius: 0, marginBottom: 10},
      bodyStyle: {padding: '20px 0px 15px 10px', backgroundColor: '#f7f7f7'}
    };



    const rolePer = () => {
      let roleFirst=[],roleSecond=[],roleThird=[]
      return Object.entries(_rolC).map(v=>{
        return <div style={{ borderBottom: '1px solid #E9E9E9' }}>
          <div>
            <Checkbox
              indeterminate={this.state['role'+v[0]]}
              onChange={(e)=>{
                        let _state = {};
                          _state['checkAll_'+v[0]] = e.target.checked;
                        if(v[1]['permissions'] == undefined){
                        for(let c in v[1]){
                          if(c !=='id'){
                            _state['checkedList_'+v[1][c]['target']] =e.target.checked ? this.getDes(v[1][c]['permissions']): [];
                            _state['role'+v[1][c]['target']] = e.target.checked
                            _state['checkAll_'+v[1][c]['target']] = e.target.checked
                          }
                        }
                        }else{
                          _state['role'+v[1]['target']] = false;
                          _state['checkedList_'+v[1]['target']] = e.target.checked ? this.getAllDes(v[1]) : [];
                        }
                          this.setState(_state);
                      }}
              checked={this.state['checkAll_'+v[0]]}
            >
              {v[0]}
            </Checkbox>
          </div>
          <br />
          {v[1]['permissions'] == undefined?
            <Row >
              {this.delId(Object.entries(v[1])).map((x,i)=>(
                <Row style={{marginBottom:'40px'}}>
                  <Row style={{marginBottom:'10px'}}>
                    <Col span={8}>
                      <Checkbox
                        indeterminate={this.state['role'+x[1]['target']]}
                        onChange={(e)=>{
                        let _state = {};
                        _state['role'+x[1]['target']] = false;
                        _state['checkedList_'+x[1]['target']] = e.target.checked ? this.getDes(x[1]['permissions']) : [];
                        _state['checkAll_'+x[1]['target']] = e.target.checked;
                        this.setState(_state);
                      }}
                        checked={this.state['checkedList_'+v[0]]&&this.state['checkedList_'+v[0]].length>0?this.state['checkedList_'+v[0]]:this.state['checkAll_'+x[1]['target']]}
                      >
                        {x[0]}
                      </Checkbox>
                    </Col>
                  </Row>
                  <CheckboxGroup
                    value={this.state['checkedList_'+v[0]]&&this.state['checkedList_'+v[0]].length>0?this.state['checkedList_'+v[0]]:this.state['checkedList_'+x[1]['target']]}
                    onChange={(checkedList)=>{
                    console.log('checkedListff0',checkedList)
                    let _state = {};
                    _state['role'+x[1]['target']] = !!checkedList.length && (checkedList.length < x[1]['permissions'].length);
                    _state['checkedList_'+x[1]['target']] = checkedList;
                    _state['checkAll_'+x[1]['target']] = checkedList.length === x[1]['permissions'].length;
                    this.setState(_state);
                    }} >
                    <Row>
                      {Object.entries(x[1]['permissions']).map(a=>(<Col span={8}><Checkbox value={a[1]['id']}>{a[1]['description']}</Checkbox></Col>))}
                    </Row>
                  </CheckboxGroup>
                </Row>
              ))
              }
            </Row>
            :
            <Row style={{marginBottom:'40px'}}>
              <CheckboxGroup
                value={this.state['checkedList_'+v[1]['target']]}
                onChange={(checkedList)=>{
                    let _state = {};
                    _state['role'+v[1]['target']] = !!checkedList.length && (checkedList.length < v[1]['permissions'].length);
                    _state['checkedList_'+v[1]['target']] = checkedList;
                    _state['checkAll_'+v[1]['target']] = checkedList.length === v[1]['permissions'].length;
                    this.setState(_state);
                    }} >
                <Row>
                  {Object.entries(v[1]['permissions']).map(a=>(<Col span={8}><Checkbox value={a[1]['id']}>{a[1]['description']}</Checkbox></Col>))}
                </Row>
              </CheckboxGroup>
            </Row>
          }
        </div>
      })

    }

    return (

      <Row>
        <Title title={newPage?formatMessage({id:`${_tit.new_role}`}):formatMessage({id:`${_tit.role_detail}`})} />

          <Row type="flex" justify="start" style={{margin:"20px"}}>
            <p style={{marginRight:'10px'}}>{formatMessage({id:'roleName'})}</p>
            <Input onChange={(e)=>{this.setState({roleName:e.target.value})}}  value={this.state.roleName} style={{width:'250px'}} />
          </Row>
        <Spin  spinning={this.state.loading} tip="Loading..." >
            {rolePer()}
        </Spin>
          <Row type="flex" justify="center" style={{marginTop:"20px"}}>
            <Button onClick={this.handleSave}  type="primary" >{this.state.newPage?formatMessage({id:'createRole'}):formatMessage({id:'modifyRole'})}</Button>
          </Row>

      </Row>

    )
  }
}





RoleInfoPage.propTypes = {
  pathJump : React.PropTypes.func,
};

export default injectIntl(RoleInfoPage)


