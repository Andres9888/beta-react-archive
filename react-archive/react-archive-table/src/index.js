//import App from './App';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import $ from 'jquery';
import * as Table from 'reactabular-table';
import 'picnic/picnic.css';
import { cloneDeep, findIndex } from 'lodash';




import * as select from 'selectabular';
import { compose } from 'redux';
import classnames from 'classnames';

var moment = require('moment');
var today = moment();

class PersonList extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            rows: [],
            selectedRows: [],

            columns: [{
                    property: 'id_page',
                    props: {
                        style: {
                            width: "100%",
                            textAlign: "right"
                        }
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
                        style: {
                            minWidth: 300,
                            width: "100%",
                            textTransform: 'uppercase'
                        }
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
                        style: {
                            minWidth: 300,
                            width: "100%"
                        }
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
                    props: {
                        style: {
                            width: "125px",
                            textAlign: "right"
                        }
                    },
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
                                
                                { moment(rowData.page_archivedown, "M/D/YYYY h:mm:ss A").startOf('day').diff(today.startOf('day'), 'days') } 
                                
                                </div>
                            )
                        ]
                    }
                },

                {

                    property: 'page_archivedown',
                    props: {
                        style: {
                            width: "125px",
                            textAlign: "right"
                        }
                    },

                    header: {
                        label: '(Date)',
                        formatters: [

                        ]
                    },
                    width: "100%"
                },
                {

                    header: {
                        label: 'box',
                        formatters: [

                            name => ( <
                                button onClick = { this.onExpireAll } style = { { width: '20px', background: "red" } } > Expire All Less Than Zero





                                <
                                /button>
                            )



                        ]


                    },
                    props: {
                        style: {

                            width: 125,
                            minWidth: 50
                        }
                    },
                    cell: {
                        formatters: [
                            (value, { rowIndex,rowData }) => (  

                            <
                        
                                button  className = "warning remove-button" onClick = {
                                    (event) => this.onExpire(rowIndex, rowData.id_page, event) } >


                                <
                                div className = "button-text" >
                                Expire| <
                                /div> <
                                div className = "icon" >
                                <
                                i className = "fa fa-history" > < /i>

                                <
                                /div> <
                                /button>
                            )
                        ]
                    }


                },
                {
                    props: {
                        style: {
                            width: 125,
                            minWidth: 50
                        }
                    },
                    cell: {
                        formatters: [
                            
                            (value, { rowIndex, rowData }) => (<button onClick = {
                                    () => this.onRemove(rowIndex, rowData.id_page) }     >
    
                                
<
                                div className = "button-text" >
                                Remove| <
                                /div> <
                                div className = "icon" >
                                <
                                i className = "fa fa-history" > < /i>

                                

                                  <
                                /div>   
                                     
                               <
                                /button>
                            )
                        ]
                    }


                },
                {
                    props: {
                        style: {
                            width: 125,
                            minWidth: 50
                        }
                    },
                    cell: {
                        formatters: [
                            
                            (value, { rowData }) => ( <
                                button className = "success" >

                                <
                                a href = { "http://wsw.com/webcast/" + rowData.conference_short + '/' + rowData.page_short } target = "_blank" >
                                View Page <
                                /a>

                                <
                                /button>
                            )
                        ]
                    }
                }
            ]

        };


        this.onRemove = this.onRemove.bind(this);
        this.onRemoveAll = this.onRemoveAll.bind(this);

        this.onExpire = this.onExpire.bind(this);
        this.onExpireAll = this.onExpireAll.bind(this);

        this.onRow = this.onRow.bind(this);

        this.onSelectRow = this.onSelectRow.bind(this);
        this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

        this.onSelectRow = this.onSelectRow.bind(this);
        this.getSelectedRowIndex = this.getSelectedRowIndex.bind(this);

    }


    componentDidMount() {

        $.ajax({
            data: { action: 'load' },
            type: 'POST',
            dataType: 'json',

        }).done((rows) => {

            this.setState({ rows });

        })

    }


    render() {


        const { columns, rows, selectedRows } = this.state;
        const selectedRowIndex = this.getSelectedRowIndex(selectedRows);

        var filtered = rows.filter((x, i, arr) => {
            return x.selected && x.id_page;
        });

        var filteredTimeRow = rows.filter((x, i, arr) => {
            return moment(x.page_archivedown, "M/D/YYYY h:mm:ss A").startOf('day').diff(today.startOf('day'), 'days') <= 0

                &&
                x.id_page;
        });



        var selectedId = [];

        for (var key in filtered) {
            if (filtered.hasOwnProperty(key)) {
                selectedId.push(filtered[key]["id_page"]);
            }
        }

        var filteredAllExpiredID = [];

        for (var key in filteredTimeRow) {
            if (filteredTimeRow.hasOwnProperty(key)) {
                filteredAllExpiredID.push(filteredTimeRow[key]["id_page"]);
            }
        }



        var buttonStyle = {
            margin: "10px 10px 10px 0"
        };

        var divOneStyle = {
            fontSize: "18px",
            color:"white",
            fontWeight:900,
            float:"left",
            display:"inline"

        };

          var divTwoStyle = {
            fontSize: "18px",
            color:"white",
            fontWeight:900,
            float:"right",
            display:"inline"

        };

       


        return select.byArrowKeys({
            rows,
            selectedRowIndex,
            onSelectRow: this.onSelectRow
        })(


            <
            div >


            <
            Table.Provider className = "primary"
            columns = { columns } >

            <
            Table.Header

            
            
            />



            <
            Table.Body

            rows = { rows }

            rowKey = "id_page"

            onRow = { this.onRow }

            /> 

            <
            tfoot  >


            <div style = {divOneStyle}>

            Total Pages: { this.state.rows.length + " "}

            <br />

            Pages to Expire: { filteredAllExpiredID.length + " "} 

            <br />

            Selected: {selectedId.length + " " }
                    
           
            </div>

            <div style = {divTwoStyle}>
            <
            button className = "btn btn-default"
            style = { buttonStyle } onClick = {
                () => {


                    this.setState(compose(select.rows(row => row), select.all)(rows))


                }
            } >
           
            Select All < /button>

             <
            button className = "btn btn-default"
            style = { buttonStyle } onClick = {
                

                () => {
                            this.setState(compose(select.rows(row => !row), select.none)(rows))
                    }
            } >
            
            Select None < /button> 

            <
            button className = "btn btn-default"
            style = { buttonStyle } onClick = {

                this.onExpireAll1
            } >
            
            Expire All < /button>

             <
            button className = "btn btn-default"
            style = { buttonStyle } onClick = {
               this.onExpireAll


                
            } >
            
            Expire Selected < /button> 

            <
            button className = "btn btn-default"
            style = { buttonStyle } onClick = {
                () => {


                    this.setState(compose(select.rows(row => !row), select.none)(rows))


                }
            } >
            Remove Selected
            </button>

        </div>

             <
            /tfoot>

            <
            /Table.Provider>

            <
            /div>


        );

    }
  

    onRow(row, { rowIndex }) {

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
            className: classnames(
                
                row.selected && 'selected-row'
            ),
            onClick: () => this.onSelectRow(rowIndex)
        };
    }

    onSelectRow(selectedRowIndex) {
        const { rows } = this.state;
        const selectedRowId = rows[selectedRowIndex].id_page;

        this.setState({
            rows: select.toggle(row => row.id_page === selectedRowId)(rows)
        });
    }


    getSelectedRowIndex(selectedRows) {
        return findIndex(this.state.rows, {
            id: selectedRows[0] && selectedRows[0].id_page
        });
    }


    onExpire(index, id,event) {
        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });
        

        

        rows.splice(index, 1);     
        this.setState({ rows });
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

        event.stopPropagation();

        
    }

    onExpireAll(index, id) {



        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });


        var filteredTimeRow2 = rows.filter((x, i, arr) => {
            return moment(x.page_archivedown, "M/D/YYYY h:mm:ss A").startOf('day').diff(today.startOf('day'), 'days') <= 0

                &&
                x.id_page;
        });
        
        var filteredAllExpiredID2 = [];

        for (var key in filteredTimeRow2) {
            if (filteredTimeRow2.hasOwnProperty(key)) {
                filteredAllExpiredID2.push(filteredTimeRow2[key]["id_page"]);
            }
        }




        console.log(index);
        console.log(idx);
        console.log(id);
        console.log(filteredTimeRow2);
        console.log(filteredAllExpiredID2);

        
 $.ajax({
            data: { action: 'expire', pages: filteredAllExpiredID2 },
            type: 'POST',
            dataType: 'json',
            traditional: true
        })




    }



    onRemove(index, id) {
        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });


        console.log(index);
        console.log(idx);
        console.log(id);


        $.ajax({
            data: { action: 'remove', pages: [id] },
            type: 'POST',
            dataType: 'json',
            traditional: true
        })


        rows.splice(index, 1);



        this.setState({ rows });
    }
    onRemoveAll(index, id) {

        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });


        console.log(index);
        console.log(idx);
        console.log(id);


        $.ajax({
            data: { action: 'remove', pages: [id] },
            type: 'POST',
            dataType: 'json',
            traditional: true
        })


        rows.splice(index, 1);



        this.setState({ rows });
    }
    
    expireSelected(index, id) {

        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });




        var filtered2 = rows.filter((x, i, arr) => {
            return x.selected && x.id_page;
        });

        
        var selectedId2 = [];

        for (var key in filtered2) {
            if (filtered2.hasOwnProperty(key)) {
                selectedId2.push(filtered2[key]["id_page"]);
            }
        }


        console.log(index);
        console.log(idx);
        console.log(id);
        console.log(filtered2);
        console.log(selectedId2);


        $.ajax({
            data: { action: 'expire', pages: [id] },
            type: 'POST',
            dataType: 'json',
            traditional: true
        })


        rows.splice(index, 1);



        this.setState({ rows });
    }
    
    removeSelected(index, id) {

        const rows = cloneDeep(this.state.rows);
        const idx = findIndex(rows, { id });
        

        var filtered2 = rows.filter((x, i, arr) => {
            return x.selected && x.id_page;
        });

        
        var selectedId2 = [];

        for (var key in filtered2) {
            if (filtered2.hasOwnProperty(key)) {
                selectedId2.push(filtered2[key]["id_page"]);
            }
        }

        console.log(index);
        console.log(idx);
        console.log(id);
        console.log(filtered2);
        console.log(selectedId2);


        $.ajax({
            data: { action: 'remove', pages: [id] },
            type: 'POST',
            dataType: 'json',
            traditional: true
        })


        rows.splice(index, 1);



        this.setState({ rows });
    }

}

ReactDOM.render( < PersonList / > , document.getElementById('root'));