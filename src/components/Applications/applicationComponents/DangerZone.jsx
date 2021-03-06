import React, {Component} from 'react'
import { connect } from 'react-redux';

import { deleteApplication, deleteAllConfigKeys } from '../../../actions/applicationAsycAC.js';
import { DataBox } from '../../generals/Generals.jsx'
import { Modal, openModal, closeModal } from "../../generals/Modal.jsx";

/**
 * DataBox class for all the nasty deleting stuff. 
 */
export class DangerZone extends Component{

  render(){
    return(
      <DataBox heading="Danger Zone"
        content={  <div>
            <h4>Delete this Application</h4>
            <Modal
              modalId="deleteApplication"
              content={
                <div>
                  Are you sure you want to delete  {this.props.app.name}
                  <button onClick={()=>
                      {
                        this.props.onDeleteClick(this.props.app.id);
                        closeModal("deleteApplication");
                      }
                    }>
                    Delete Application
                  </button>
                </div>}
             />
            <button onClick={() => openModal("deleteApplication")}>Delete this app </button>
            <button onClick={() => this.props.onDeleteConfigKeysClick(this.props.app.id)}>Delete All Configuration Keys</button>
          </div>} />
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) =>{
  return{
    onDeleteClick: (id) => {
      ownProps.router.push("/applications")
      dispatch(deleteApplication(id));
    },
    onDeleteConfigKeysClick: (id) => {
      dispatch(deleteAllConfigKeys(id))
    }
  }
}

export const DangerZoneContainer = connect(null,mapDispatchToProps)(DangerZone)
