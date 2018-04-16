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
          
          rows:[],
          selectedRows: [],
          
          columns : [
  {
    property: 'id_page',
   props: {
      style: {
      width: "100%" }
    },
    header: {
      label: '#ID',
       formatters: [
            
          ]
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
      style: { 
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
          
  };
    

    this.onRemove = this.onRemove.bind(this);

    this.onRow = this.onRow.bind(this);

    this.onSelectRow = this.onSelectRow.bind(this);
    this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

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
  

 const { columns, rows, selectedRows } = this.state;
 const selectedRowIndex = this.getSelectedRowIndex(selectedRows);
 
    

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
  >

  <Table.Header />

     <h1>{selectedRows.length}</h1>     
 
  <Table.Body 

  rows={rows} 
 
  rowKey="id_page" 
 
 onRow={this.onRow}




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

onRow(row, { rowIndex }) {
    return {
      className: classnames(
        rowIndex % 2 ? 'odd-row' : 'even-row',
        row.selected && 'selected-row'
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




