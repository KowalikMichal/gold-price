import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ReactTable from "react-table";

import 'react-datepicker/dist/react-datepicker.css';
import 'react-table/react-table.css'
import './App.css';

class App extends Component {
  constructor(){
    super();
    this.state = {
      startDate: moment(),
      endDate : null,
      minDate: moment().subtract(367, 'd'),
      fetchData: []
    }
  }
  render() {
    let showData, additionalInfo;
    if (this.state.fetchData.length !== 0){
      showData = <this.displayData />
      additionalInfo = <this.displayAdditionalInfo />
    }

    return (
      <div>
        <div className="conitainer">
          <div className="selectDate">
            <label>Data początkowa</label>
            <DatePicker selected={this.state.startDate} onChange={this.changeStartDate} minDate={this.state.minDate} maxDate= {moment()} dateFormat="YYYY-MM-DD"/>
          </div>
          <div className="selectDate">
            <label>Data końcowa</label>
            <DatePicker selected={this.state.endDate} minDate={this.state.minDate} maxDate={this.state.startDate} onChange={this.changeEndDate} dateFormat="YYYY-MM-DD"/>
          </div>
          <button type="button" className="downloadData" onClick={this.fetchData}>Pobierz dane</button>
        </div>
        <div className="loading"></div>
        <div className="conitainer">
          {showData}{additionalInfo}
        </div>
      </div>
    );
  }
  displayData = () =>{
    const data = this.state.fetchData;

    const columns = [{
      Header: 'Cena',
      accessor: 'cena'
    }, {
      Header: 'Data',
      accessor: 'data',
    }];

    return <ReactTable data={data} columns={columns} defaultPageSize={5}/>
  }

  displayAdditionalInfo = ()=>{
    function sortByKey(array, key) {
      return array.sort(function(a, b) {
        const x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }
    const data = sortByKey(this.state.fetchData, 'cena');
    const half = Math.floor(data.length/2);
    const median = (data.length % 2) ? data[half]['cena']:(data[half-1]['cena']+data[half]['cena'])/2;
    document.querySelector('.loading').style.display = "none";
    return(
      <table className="tableInfo">
        <thead>
          <tr>
            <th>Rodzaj</th>
            <th>Cena</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Minimalna cena</td>
            <td>{data[0]['cena']}</td>
            <td>{data[0]['data']}</td>
          </tr>
          <tr>
            <td>Maskymalna cena</td>
            <td>{data[data.length-1]['cena']}</td>
            <td>{data[data.length-1]['data']}</td>
          </tr>
          <tr>
            <td>Medaina</td>
            <td>{median}</td>
            <td>-</td>
          </tr>
        </tbody>
      </table>
    );
  }

  fetchData = () =>{
    document.querySelector('.loading').style.display = "block";
    let url = `https://api.nbp.pl/api/cenyzlota/`;
    if (this.state.endDate) url +=`/${this.state.endDate.format('YYYY-MM-DD')}`;
    url +=`/${this.state.startDate.format('YYYY-MM-DD')}`;
    fetch(url)
      .then(resp => resp.json())
      .then(resp => this.setState({fetchData: resp}))
      .catch(error => alert("Błąd: ", error));
  }

  changeStartDate = (date)=>{
    this.setState({startDate: date});
  }
  changeEndDate = (date) =>{
    this.setState({endDate: date});
  }
}

export default App;
