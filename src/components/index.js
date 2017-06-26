import React from 'react'


import { Form, Row, Col, Input, Button, Icon,DatePicker ,Select,Checkbox   } from 'antd'
const Option=Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const Search = Input.Search;
const FormItem = Form.Item;
const dateFormat = 'YYYY/MM/DD';
const monthFormat = 'YYYY/MM';
import Moment from 'moment';
import enUS from 'antd/lib/date-picker/locale/en_US';
import {supplierType,supplierStatus,customerStatus,craftsmanStatus} from '../config'

export function getFormTag(column,fixedWidth=false){
  let inputProps={
    placeholder:column.title,
    ...column.props
  };
  let {selectOption,dataIndex,formTag,width,placeholder,handleRoleChange,style,roleValue,...otherProps}=column;
  if(width&&fixedWidth){
    otherProps.style={width};
  }

  //是否指定form
  if(formTag=='input'){
    return <Input {...inputProps} />
  }



  //根据 column.type 设置
  if(column.type=='date'){

    //默认选项
    let props={
      key:dataIndex,
      allowClear:false,
      placeholder:['From','To'],
      ...otherProps,
      ...column.props
    };

    return <RangePicker {...props} />;
  }

  if(column.type == 'dateSingle'){
    let props={
      key:dataIndex,
      placeholder:'Select Time',
      format:"YYYY-MM-DD HH:mm",
      ...otherProps,
      ...column.props
    };


    return <DatePicker style={{width:'270px'}} {...props} />
  }

  if(column.type == 'select'){
    let props={
      placeholder:placeholder,
    };
    let option;
    console.log('selectOption',selectOption)
    option = selectOption.map(v=>
        <Option key={v} value={v} >{v}</Option>
      )

    return <Select {...props} >{option}</Select>
  }

  if(column.type == 'check'){
    return <Checkbox >Only view group message</Checkbox>
  }

  if(column.type == 'selectWithInput'){
    let options = selectOption.map(d => <Option key={d.name}>{d.name}</Option>)
    return (
      <Select
        mode="combobox"
        placeholder={placeholder}
        notFoundContent=""
        style={style}
        defaultActiveFirstOption={false}
        showArrow={false}
        filterOption={false}
        onChange={handleRoleChange}
      >
        {options}
      </Select>
    );
  }



  //默认设置
  return <Input {...inputProps} />
}
