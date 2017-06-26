import {easyfetch} from './FetchHelper'
import {host,gender_type,customerFreezed,product_subcategory,product_type,product_style,supplierShowType} from '../config'
import Immutable from 'immutable'
import moment from 'moment';
import {formatDate,formatMoney,configDirectory,configDirectoryObject,formatAddress} from '../utils/formatData'

exports.fetchPayment=(id)=>easyfetch(host,`orders/${id}`,'get')

// array to Object
Array.prototype.toObject= function ( key='id' ) {
  let obj={}
  this.forEach(item=>{
    if (item[key] !== undefined) {
      obj[item[key]]=item
    }
  })
  return obj
};



export  function JSONparse (json) {
  var parsed;
  try {
    parsed = JSON.parse(json)
  } catch (e) {

  }
  console.log('转换JSON字段', parsed)
  return parsed
}

//保存创建申请单的值到localStorage

exports.savePaymentToStorage=obj=>{
  console.log('保存 payment 数据到 localStorage')
  localStorage.setItem('payment',JSON.stringify(obj))
}

exports.getPaymentFormStorage=()=>JSONparse(localStorage.getItem('payment'))
exports.removePaymentToStorage=()=>localStorage.removeItem('payment')


//设置表单的默认值
export const setFormDefaultValue=(props)=>{
  let initial={};

  if(props.initial){
    props.columns.forEach(item=>{

      //获取表单的默认值
      const value=props.initial.getIn(item.take || [item.dataIndex])
      if(value){
        initial[item.dataIndex]=value;
      }else{
        initial[item.dataIndex]=null
      }
    });

    //如果有id也放入表单中
    if(props.initial.get('id')){
      initial.id=props.initial.get('id')
      props.form.setFieldsValue({keys:props.initial.get('id')})
    }

    if(props.initial.get('account')){
      props.initial.get('account').map((v,k)=>{
        if(k == 'wallet'){
          initial['balance'] = v.get('balance')
        }else{
          initial[k] = v
        }
      })
    }

    if(props.initial.get('customer')){
      props.initial.get('customer').map((v,k)=>{
        if(k == 'account'){
          initial['customerMobile'] = v.get('mobile')
        }
      })
    }

    if(props.initial.has('gender')) {
      if (props.initial.get('gender') == 0) {
        initial['gender'] = gender_type[0]
      } else {
        initial['gender'] = gender_type[1]
      }
    }

    if(props.initial.has('wallet')){
      initial.balance = props.initial.getIn(['wallet','balance'])
    }

    if(props.initial.has('customer_address')){
      initial.customer_address = formatAddress(props.initial.get('customer_address')).join('/')
    }

    if(props.initial.has('freezed')) {
      if (props.initial.get('freezed') == 0) {
        initial['freezed'] = customerFreezed[0]
      } else {
        initial['freezed'] = customerFreezed[1]
      }
    }

    if(props.initial.has('subcategoryId')){
      for(let v in product_subcategory){
        if(props.initial.get('subcategoryId') == v){
          initial['subcategoryId'] = product_subcategory[v]['name_en']
        }
      }
    }

    if(props.initial.has('typeId')){
      for(let v in product_type){
        if(props.initial.get('typeId') == v){
          initial['typeId'] = product_type[v]['name_en']
        }
      }
    }

    if(props.initial.has('type')){
      for(let v in supplierShowType){
        if(props.initial.get('type') == v){
          initial['type'] = supplierShowType[v]
        }
      }
    }


    if(props.initial.has('product_styles')){
      let _styleArr=[]
      let _orgData = props.initial.get('product_styles').toJS()
      _orgData.map(v=>{
        _styleArr.push(v.style.name)
      })
      initial['styleId'] = _styleArr
    }

    if(props.initial.has('product_properties')){
      let _orgData = props.initial.get('product_properties').toJS();
      _orgData.map(v=>{
        initial[v.property.name] = v.content
      })
    }

    if(props.initial.has('roles')){
      let _orgData = props.initial.get('roles').toJS()
      if(_orgData.length>0){
        initial['roles'] = _orgData[0]['id']
      }else{
        initial['roles']=[]
      }
    }

    if(props.initial.has('admin')){
      let _orgData = props.initial.get('admin').toJS()
      for(let v in _orgData){
        initial['admin_'+v] = _orgData[v]
      }
    }

    if(props.initial.has('birthday')){
      let _orgData = props.initial.get('birthday')
      initial.birthday = moment(_orgData, 'YYYY/MM/DD')
    }

  }else{
    props.form.resetFields()
  }
  console.log('表单默认值',initial)
  props.form.setFieldsValue(initial)
}

//设置表单必选项
export function getFormRequired(message,type) {
  return {
    initialValue: [],
    rules: [
      { required: true,message, type },
    ],
  }
}


//将分散在details 数据抽出和并成一条数据
export function splitDataFromField(data=Immutable.List(),field='details'){
  let $formatVendor=Immutable.List();
  let mergeCount=0;
  data.forEach($v=>{
    let mergeSpan=1; // 用来标识合并rowSpan
    let mergeGroup=0; //用来标识合并项的Row class,用来优化row hover
    const $base=$v.delete(field);
    const $details=$v.get(field);
    if($details.size>1){
      mergeGroup = ++mergeCount
      mergeSpan = $details.size
      const $list=$details.map(($detil,i)=>$detil.merge(
        $base.merge({
          merge:i>0?0:mergeSpan,
          mergeGroup
        }))
      );
      $formatVendor=$formatVendor.concat($list)
    }else{
      $formatVendor=$formatVendor.concat([$base])
    }
  })
  return $formatVendor;
}

