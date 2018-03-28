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
    header: {
      label: '#ID'
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
      label: 'Conference'
    }
  },
  {
    property: 'company_name',
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
            width: 50
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
            width: 50
          }
        },
        cell: {
          formatters: [
            (value, { rowData }) => (
              <button
                className="error"
                
              >Remove


                
              </button>
            )
            ]
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
  
  var archiveDownDayFormatted = moment(this.state.rows.page_archivedown, "M/D/YYYY h:mm:ss A");
    
    var archiveDays = archiveDownDayFormatted.startOf('day').diff(today.startOf('day'), 'days');
    
    var warningcolor;
    switch(true){
      case (archiveDays > 0):
        warningcolor = 'white';
        break;
      case (archiveDays <= 0 && archiveDays >= -5):
        warningcolor = 'light_red';
        break;
      case (archiveDays <= -5 && archiveDays >= -10):
        warningcolor = 'med_red';
        break;
      case (archiveDays <= -10):
        warningcolor = 'dark_red';
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
  <Table.Header />
 
  <Table.Body style={{backgroundColor: warningcolor}} rows={this.state.rows} rowKey="id" />


   

 


</Table.Provider>
  


      </div>
    )
  }
}



ReactDOM.render(<PersonList /> , document.getElementById('root'));




