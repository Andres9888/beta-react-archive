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
import * as resizable from 'reactabular-resizable';

var moment = require('moment');
var today = moment();
 
        


 export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);

    this.state = {
          query: {},
          rows:[],
          columns : this.getColumns() 
  };
    
    this.tableHeader = null;
    this.tableBody = null;
    this.onRemove = this.onRemove.bind(this);

}
  

componentWillMount() {
    this.resizableHelper = resizable.helper({
      globalId: uuid.v4(),
      getId: ({ property}) => property
    });

    
    this.setState({
      columns: this.resizableHelper.initialize(this.state.columns)
    });
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


componentWillUnmount() {
    this.resizableHelper.cleanup();
  }

  getColumns() {
    const resizableFormatter = resizable.column({
      onDragStart: (width, { column }) => {
        console.log('drag start', width, column);
      },
      onDrag: (width, { column }) => {
        this.resizableHelper.update({
          column,
          width
        });
      },
      onDragEnd: (width, { column }) => {
        console.log('drag end', width, column);
      }
    });
return [
  {
    property: 'id_page',
   props: {
      style: { minWidth: 300,
      width: "100%" }
    },
    header: {
      label: '#ID',
       formatters: [
            resizableFormatter
          ]
        },
         cell: {
                formatters: [search.highlightCell]
              },
        width: "100%"

      },
  {
    property: 'page_short',
    props: {
      style: { minWidth: 300,
        width: "100%",
      textTransform: 'uppercase' }
    },
    header: {
      label: 'Page Short',
      formatters: [
            resizableFormatter
          ]
        },
        width: "100%"
      },
   {
    property: 'conference_short',
    props: {
      style: { minWidth: 300,
        width: "100%",
      textTransform: 'uppercase',
       }
    },
    header: {
      label: 'Conference',
       formatters: [
            resizableFormatter
          ]
        },
        width: "100%"
      },
  {
    property: 'company_name',
    props: {
      style: { minWidth: 300,
      width: "100%" }
    },
    header: {
      label: 'Company Name',
      formatters: [
            resizableFormatter
          ]
        },
        width: "100%"
      },
  

  {

  property: 'page_archivedown',
    header: {
      label: 'Archive Down:(Day)',
      name: "archivedays",
      formatters: [
            resizableFormatter
          ]
        },
        cell: {
          
          formatters: [
            (value, { rowData }) => (
               
           <div>
              {moment(rowData.page_archivedown, "M/D/YYYY h:mm:ss A").startOf('day').diff(today.startOf('day'), 'days')}
             </div>
            )
            ]
        }
      },
  
      


         

{


    property: 'page_archivedown',
    
    header: {
      label: '(Date)',
      formatters: [
            resizableFormatter
          ]
        },
        width: "100%"
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
                
    <a href={"http://wsw.com/webcast/" + rowData.conference_short + '/' + rowData.page_short} target="_blank">
        View Page
    </a>
                
              </button>
            )
            ]
        }
      }
    ]; 

  }

getClassName(column, i) {
    return `column-${this.id}-${i}`;
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
    <div>
      <h1>{this.state.rows.length} </h1>
      <Table.Provider
  className="primary"
  columns={columns}
  style={{ width: 'auto' }}
>

  <Table.Header 

  headerRows={resolve.headerRows({ columns })}>
  
  <search.Columns
    query={query}
    columns={columns}
    onChange={query=> this.setState({query})}
    style={"width:100%"}
    />

     </Table.Header>


   

    
     <h1>{searchedRows.length}</h1>     
 
  <Table.Body 

  rows={searchedRows} 
 

  rowKey="id" 
 
 onRow={this.onRow}


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
  
</div>

      
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




