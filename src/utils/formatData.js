import Immutable from 'immutable'
import React from 'react'
import {paymentFields as _pay,settingFields,currency} from '../config'
import { Row,Col } from  'antd'
import {Link} from 'react-router'




// num toFixed
export const toFixed=(num,fractionDigits=2)=>(Math.round(num * Math.pow( 10, fractionDigits  ))/Math.pow(10,fractionDigits)).toFixed(fractionDigits);

// 货币格式化
export const numberWithCommas=(x)=>{
  x=x===undefined?0:x;
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
};

//格式化 货币的显示方式
exports.formatMoney=m=>numberWithCommas(toFixed(m));

//格式化数据库时间
exports.formatDate=e=>e.replace(/(\d{4}-\d{2}-\d{2}).*/,'$1')

exports.configDirectory=(text,config,cate)=>{
  console.log('11111',text)
  if(cate =='supplierType'){
    if(text&&text ===1||text ==="1"){
      return config[1]
    }else{
      return config[0]
    }
  }else{
    for(let v in config){
      if(text == v){
        console.log('type',config[v])
        return config[v]
      }
    }
  }
};

exports.configCate = (text,config) => {
  if(!isNaN(text)){
    for(let v in config){
      if(text == v){
        return config[v]['name_en']
      }
    }
  }else{
    if(text instanceof Array){
      let _result=[]
      text.map(v=>{
        for(let a in config){
          if(v == config[a]['name_en']){
            _result.push(a)
          }
        }
      }
      )
      return _result.join(',')
    }else{
      for(let z in config){
        if(text == config[z]['name_en'] ){
          return z
        }
      }
    }
  }

}
exports.configDirectoryObject=(text,config)=>{
  for(let v in config){
    if(text == config[v]){
      return v
    }
  }
};

exports.renderPic=(v)=>{
  if(typeof(v) == "string" ){
    return <Row style={{marginTop:'15px'}}>
      <img src={v} alt="" style={{height:'150px',width:'150px',display:'inline-block',borderRadius:'50%'}} />
    </Row>
  }else{
    let _pic = v.toJS();
    let _picArr = [];
    if(_pic instanceof Array){
      _pic.map(v=>{
        _picArr.push(v.picture)
      })
      return <Row style={{marginTop:'15px'}}>
        {_picArr.map(v=>(
            <img src={v} alt="" style={{height:'150px',width:'150px',display:'inline-block',marginRight:'15px'}} />
          )
        )}
      </Row>
    }
  }
};



exports.renderPicAndTitle=(v,id)=>{
  let _pic = v.toJS();
  let _picArr = []
  return <Row style={{marginTop:'15px'}}>
    {_pic.map(v=>(
      <Col span="4" style={{marginBottom:'15px'}}>
        {v.product_slide_pics.map(z=>(<img src={z.picture} alt="" style={{height:'150px',width:'150',display:'inline-block'}} />))}
        <p style={{textAlign:'center',width:'150'}}>{v.name}</p>
      </Col>
    )
    )}
    <Col span="4" style={{lineHeight:'150px'}}>
      <Link to={{pathname:'/product_management',query:{'craftsmanUsername':id}}}>
        More...
      </Link>
    </Col>
  </Row>
};




exports.formatAddress=(v)=>{
  console.log(v.toJS())
  let _arr = [];
  let _par = v.toJS();

  if(_par instanceof Array){
    _par.map(t=>{
      console.log('t',t)
      if(t.detail){
        _arr.push(t.province+','+t.city+','+t.region+','+t.detail)
      }else{
        _arr.push(t.province+','+t.city+','+t.region)
      }

    })
  }else{
    let arr=[]
    for( let o in _par){
      arr.push(_par[o])
    }
    arr = arr.join(',')
    _arr.push(arr)
  }

    console.log('address',_arr)
    return _arr
}






//将分散在details 数据抽出和并成一条数据
export function splitDataFromField(field){

  return function (data=Immutable.List()) {
    let $formatVendor=Immutable.List();
    data.forEach($v=>{
      const $base=$v.delete(field);
      const $details=$v.get(field);
      if($details.size>0){
        const $list=$details.map(($detail,i)=>$detail.merge($base));
        $formatVendor=$formatVendor.concat($list)
      }else{
        $formatVendor=$formatVendor.concat([$base])
      }
    });
    return $formatVendor;
  }
}
export const formatDetails=(field='details')=>splitDataFromField(field);




