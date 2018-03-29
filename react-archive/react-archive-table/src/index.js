import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import $ from 'jquery';
import * as Table from 'reactabular-table';
import 'picnic/picnic.css';
import { cloneDeep, findIndex } from 'lodash';
import uuid from 'uuid';
import fontawesome from '@fortawesome/fontawesome';
import * as Sticky from 'reactabular-sticky';

var moment = require('moment');
var today = moment();
 
        


 export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);

    this.state = {

          rows:[],
          columns : [
  {
    property: 'id_page',
   props: {
      style: { minWidth: 300 }
    },
    header: {
      label: '#ID'
    }
  },
  {
    property: 'page_short',
    props: {
      style: { minWidth: 300 }
    },
    header: {
      label: 'Page_short'
    }
  },
   {
    property: 'conference_short',
    props: {
      style: { minWidth: 300 }
    },
    header: {
      label: 'Conference'
    }
  },
  {
    property: 'company_name',
    props: {
      style: { minWidth: 300 }
    },
    header: {
      label: 'Company Name'
    }
  },
  {
    property: 'page_archivedown',
    
    header: {
      label: 'Archive Down:(Date)'
    }
  },
  {
        props: {
          style: {

            width: 50,
            minWidth:50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <button
                className="warning"
               
              >Expire

                
              </button>
            )
            ]
        }


         },
         {
        props: {
          style: {
            width: 50,
            minWidth:50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <button
                className="error"
                
               onClick={() => this.onRemove(rowData.id)} style={{ cursor: 'pointer' }}>Remove


                
              </button>
            )
            ]
        }


         },
         {
        props: {
          style: {
            width: 50,
            minWidth:50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <button
                className="success">
                
              <a href="http://wsw.com/webcast/{this.state.rows.conference_short + '/' + this.state.rows.page_short}/" target="_blank">
View Page
</a>
                
              </button>
            )
            ]
        }
      }
    ] 
  };
    
    this.tableHeader = null;
    this.tableBody = null;
    this.onRemove = this.onRemove.bind(this);

}
  

componentDidMount() {
 this.forceUpdate();
 $.ajax({
    data: { action: 'load'},
    type: 'POST',
    dataType: 'json',
   
  }).done((rows) => {




  
  this.setState({rows});


})



  }

  
  render() {
  

 const { rows, columns } = this.state;

  var archiveDownDayFormatted = moment(this.state.rows.page_archivedown, "M/D/YYYY h:mm:ss A");
    
    var archiveDays = archiveDownDayFormatted.startOf('day').diff(today.startOf('day'), 'days');
    
    var warningcolor;
    switch(true){
      case (archiveDays > 0):
        warningcolor = 'white';
        break;
      case (archiveDays <= 0 && archiveDays >= -5):
        warningcolor = 'yellow';
        break;
      case (archiveDays <= -5 && archiveDays >= -10):
        warningcolor = 'orange';
        break;
      case (archiveDays <= -10):
        warningcolor = 'red';
        break;
      default:
        warningcolor = 'inherit';
        break;
    }




    return (
      <div>
      
      <Table.Provider
  className="primary"
  columns={this.state.columns}
>
  <Sticky.Header 

  style={{maxWidth:'100%',
           position: 'fixed'  }}

  ref={tableHeader => {
            this.tableHeader = tableHeader && tableHeader.getRef();
          }}

 tableBody={this.tableBody}
          />
 
  <Sticky.Body 

  rows={this.state.rows} 
  style={{
            maxWidth: '100%',
            maxHeight: '100%'
          }}

  rowKey="id" 
ref={tableBody => {
            this.tableBody = tableBody && tableBody.getRef();
          }}
          tableHeader={this.tableHeader}


onRow={(row, { rowIndex }) => {
     
  var archiveDownDayFormatted = moment(this.state.rows[rowIndex].page_archivedown, "M/D/YYYY h:mm:ss A");
    
    var archiveDays = archiveDownDayFormatted.startOf('day').diff(today.startOf('day'), 'days');
    
    var warningcolor;
    switch(true){
      case (archiveDays > 0):
        warningcolor = 'inherit';
        break;
      case (archiveDays <= 0 && archiveDays >= -5):
        warningcolor = 'yellow';
        break;
      case (archiveDays <= -5 && archiveDays >= -10):
        warningcolor = 'orange';
        break;
      case (archiveDays <= -10):
        warningcolor = 'red';
        break;
      default:
        warningcolor = 'inherit';
        break;
    }




      return {
        style:{backgroundColor: warningcolor},
      }

  }

}
  />


  </Table.Provider>
  


      </div>
    );
  
}

onRemove(id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });

    
    rows.splice(idx, 1);

    this.setState({ rows });
  }
}

ReactDOM.render(<PersonList /> , document.getElementById('root'));




