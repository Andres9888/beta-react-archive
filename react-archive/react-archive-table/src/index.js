import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';



import $ from 'jquery';
import * as Table from 'reactabular-table';
import 'picnic/picnic.css';
import { cloneDeep, findIndex } from 'lodash';

import uuid from 'uuid';





const columns = [
  {
    property: 'id_page',
    header: {
      label: 'ID'
    }
  },
  {
    property: 'page_short',
    header: {
      label: 'Page_short'
    }
  },
   {
    property: 'conference_short',
    header: {
      label: 'conference_short'
    }
  },
  {
    property: 'company_name',
    header: {
      label: 'company_name'
    }
  },
  {
    property: 'page_archivedown',
    header: {
      label: 'page_archivedown'
    }
  },
  {
        props: {
          style: {
            width: 50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <span
                className="remove"
                
              >
                &#10007;
              </span>
            )
            ]
        }
         } ];
        


 export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);
    this.state = {

          rows:[]
           
      

    };
  }
  

 
componentDidMount() {

 

$.ajax({
    data: { action: 'load'},
    type: 'POST',
    dataType: 'json',
   
  }).done((rows) => {




  
  this.setState({rows});


})



  }

  



  render() {





    return (
      <div>
      
      <Table.Provider
  className="primary"
  columns={columns}
>
  <Table.Header />
 
  <Table.Body rows={this.state.rows} rowKey="id" /> <td className="del-cell">
          <input type="button" value="X" className="del-btn"/>
        </td>
</Table.Provider>
  


      </div>
    )
  }
}



ReactDOM.render(<PersonList /> , document.getElementById('root'));




registerServiceWorker();
