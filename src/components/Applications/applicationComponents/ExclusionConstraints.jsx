import React, { Component } from 'react';
import { connect } from 'react-redux';
import { DataBox } from '../../generals/Generals.jsx';
import { postExclConsAction, deleteExclConsAction }  from '../../../actions/applicationAsycAC';

export class ExclusionConstraints extends Component{

mapKeys(configId){
  let a = this.props.app.configurationkeys.filter(key=>{
    if(key.id === configId){
      return key
    }
  })[0];
  return a ? a : "";
}
mapOperations(opId){
    return (this.props.operations[opId -1] ? this.props.operations[opId -1].human_value : "");
}
postData(){
  const appId = this.props.app.id;
  const configId = this.refs.constkey1.value;
  const config2 = this.refs.constkey2.value;
  const value1 = this.refs.value1.value;
  const value2 = this.refs.value2.value;
  const firstOpKey = this.refs.operator1.value;
  const secondOpKey = this.refs.operator2.value;
  let payload = {
  "first_configurationkey_id": configId,
  "first_operator_id": firstOpKey,
  "first_value_a": value1,
  "second_configurationkey_id": config2,
  "second_operator_id": secondOpKey,
  "second_value_a": value2,
  }
  this.props.onPostExcl({app: appId, payload: payload});
}

  render(){
    return (<DataBox
        heading="Exclusion Constraints"
        content={
          <div>{this.props.app.exclusionconstraints.map(excl=>{
              return <div key={excl.id}>
                {this.mapKeys(excl.first_configurationkey_id).name}
                :
                 {this.mapOperations(excl.first_operator_id)}
                  :
                  { excl.first_value_a ? excl.first_value_a : "" }
                  { excl.first_value_b ? excl.first_value_b : "" }
                   {(this.mapKeys(excl.second_configurationkey_id).name)}
                   {this.mapOperations(excl.second_operator_id)}
                   { excl.second_value_a ? excl.second_value_a : "" }
                   { excl.second_value_b ? excl.second_value_b : "" }
                   <div><button onClick={ ()=>{
                       this.props.onDeleteExclClick(this.props.app.id,
                          excl.first_configurationkey_id,
                        excl.id)
                     } }>Delete Exclusion Constraint</button></div>
               </div>
            })}
            {"if"}  <select ref="constkey1">
                {this.props.app.configurationkeys.map(key=>{
                  return <option key={"keyExc1" + key.id} value={key.id}>{key.name}</option>
                })}
              </select>
              <select ref="operator1">
                {this.props.operations.map(op=>{
                  return <option key={"opExc1"+op.id} value={op.id}>{op.human_value}</option>
                })}
              </select>
              <input type="text" ref="value1"></input>
              {"then"}
              <select ref="constkey2">
                 {this.props.app.configurationkeys.map(key=>{
                   return <option key={"keyExc2" + key.id} value={key.id}>{key.name}</option>
                 })}
               </select>
               <select ref="operator2">
                 {this.props.operations.map(op=>{
                   return <option key={"opExc2"+op.id} value={op.id}>{op.human_value}</option>
                 })}
               </select>
               <input type="text" ref="value2"></input>
               <button onClick={() => this.postData()}>Paina tästä</button>
          </div>
        }
        ></DataBox>
    )
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    onDeleteExclClick: (appId, ckId, exclId) =>{
      dispatch(deleteExclConsAction({appId: appId, ckId: ckId, exclId: exclId}));
    },
    onPostExcl: (payload) =>{
      dispatch(postExclConsAction(payload));
    }
  }
}

export const ExConstBase = connect(null,mapDispatchToProps)(ExclusionConstraints);