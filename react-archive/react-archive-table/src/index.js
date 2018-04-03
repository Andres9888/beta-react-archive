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
import 'font-awesome/css/font-awesome.css';
import * as search from 'searchtabular-antd';
import * as resolve from 'table-resolver';

var moment = require('moment');
var today = moment();
 
        


 export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);

    this.state = {
          query: {},
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
      label: 'Page Short'
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
                className="warning remove-button">
               <div className="button-text">
              Expire
</div>
                <div className="icon">
    <i className="fa fa-remove"></i>
    
  </div>
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
            (value, { rowIndex,rowData }) => (
              <button
                className="error"
                
               onClick={() => this.onRemove(rowIndex,rowData.id_page)} style={{ cursor: 'pointer' }}>Remove


                
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
  

 const { columns, query, rows } = this.state;
 const searchedRows = search.multipleColumns({
      columns: columns,
      query
    })(rows);

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
    
      
      <Table.Provider
  className="primary"
  columns={columns}
>

  <Table.Header 

  headerRows={resolve.headerRows({ columns })}>
  
  <search.Columns
    query={query}
    columns={columns}
    onChange={query=> this.setState({query})}

    />

     </Table.Header>


   

    
          
 
  <Table.Body 

  rows={searchedRows} 
 

  rowKey="id" 



onRow={(row, { rowIndex }) => {
     
  var archiveDownDayFormatted = moment(this.state.rows[rowIndex].page_archivedown, "M/D/YYYY h:mm:ss A");
    
    var archiveDays = archiveDownDayFormatted.startOf('day').diff(today.startOf('day'), 'days');
    
    var warningcolor;
    switch(true){
      case (archiveDays > 0):
        warningcolor = '';
        break;
      case (archiveDays <= 0 && archiveDays >= -5):
        warningcolor = 'yellow';
        break;
      case (archiveDays <= -5 && archiveDays >= -10):
        warningcolor = 'orange';
        break;
      case (archiveDays <= -10):
        warningcolor = '#ff2b2b';
        break;
      default:
        warningcolor = '';
        break;
    }




      return {
        style:{backgroundColor: warningcolor},
      }

  }

}
  />


  </Table.Provider>
  


      
    );
  
}

onRemove(index,id) {
    const rows = cloneDeep(this.state.rows);
    const idx = findIndex(rows, { id });


    console.log(index);
    console.log(idx);
    console.log(id);


$.ajax({
    data: { action: 'expire', pages: [id] },
    type: 'POST',
    dataType: 'json',
    traditional: true
  })


    rows.splice(index, 1);



  





    this.setState({ rows });
  }
}

ReactDOM.render(<PersonList /> , document.getElementById('root'));




