import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import $ from 'jquery';
import * as Table from 'reactabular-table';
import 'picnic/picnic.css';
import _ from 'lodash';


const rows = [
  {id_page: "88730", page_short: "moga", conference_short: "cowen44", company_name: "Moog Inc.", page_archivedown: "3/24/2018 10:45:00 AM"},


{id_page: "88417", page_short: "kss", conference_short: "icr4", company_name: "Kohl''s Corporation", page_archivedown: "3/24/2018 12:00:00 PM"}
];



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
  }
];

export default class PersonList extends React.Component {
  
constructor(props) {
    super(props);
    this.state = {

          data:[]
      

    };
  }
  

 
componentDidMount() {

 

$.ajax({
    data: { action: 'load'},
    type: 'POST',
    dataType: 'json',
   
  }).done((data) => {




  
  this.setState({data});


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
 
  <Table.Body rows={this.state.data} rowKey="id" />
</Table.Provider>
  


      </div>
    )
  }
}



ReactDOM.render(<PersonList /> , document.getElementById('root'));




registerServiceWorker();
