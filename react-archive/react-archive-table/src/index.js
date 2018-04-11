//import App from './App';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
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
import * as select from 'selectabular';
import { compose } from 'redux';
import classnames from 'classnames';

var moment = require('moment');
var today = moment();
 
export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);

    this.state = {
          query: {},
          rows:[],
          selectedRows: [],
          columns : [
  {
    property: 'id_page',
   props: {
      style: { minWidth: 300,
      width: "100%" }
    },
    header: {
      label: '#ID',
       formatters: [
            
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
    ]
          
  }
    
    this.tableHeader = null;
    this.tableBody = null;


    this.onRemove = this.onRemove.bind(this);

    this.onRow = this.onRow.bind(this);

    this.onSelectRow = this.onSelectRow.bind(this);
    this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

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



getClassName(column, i) {
    return `column-${this.id}-${i}`;
  }


  
  render() {
  

 const { columns, query, rows, selectedRows } = this.state;
 const selectedRowIndex = this.getSelectedRowIndex(selectedRows);
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




    return select.byArrowKeys({
      rows,
      selectedRowIndex,
      onSelectRow: this.onSelectRow
    })(
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
<tfoot>
            <tr>
              <td>Selected: {selectedRows[0] && selectedRows[0].id_page}</td>
              <td>Select Length{selectedRows.length}</td>
            </tr>
          </tfoot>

  </Table.Provider>
  
</div>

      
    );
  
}

onRow(searchedRows, { rowIndex }) {
    return {
      className: classnames(
        rowIndex % 2 ? 'odd-row' : 'even-row',
        searchedRows.selected && 'selected-row'
      ),
      onClick: () => this.onSelectRow(rowIndex)
    };
  }

 onSelectRow(selectedRowIndex) {
    const { rows } = this.state;
    const selectedRowId = rows[selectedRowIndex].id_page;

    this.setState(
      compose(
        select.rows(row => row.id_page === selectedRowId),
        select.none
      )(rows)
    );
  }

   getSelectedRowIndex(selectedRows) {
    return findIndex(this.state.rows, {
      id: selectedRows[0] && selectedRows[0].id_page
    });
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




