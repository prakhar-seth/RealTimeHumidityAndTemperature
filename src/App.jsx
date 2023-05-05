import { useState , useEffect} from 'react'
import './App.css'

function App() {
  const [currentReadings, setCurrentReadings] = useState({})

  const addDataToTable = (data) => {
    const table = document.createElement('table');
    const headers = ['Serial Number', 'TSensor 1(℃)', 'TSensor 2(℃)', 'TSensor 3(℃)', 'TSensor 4(℃)', 'HSensor1(%)', 'HSensor2(%)', 'HSensor3(%)', 'HSensor4(%)'];
    const headerRow = document.createElement('tr');
  
    headers.forEach(header => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    const tbody = document.createElement('tbody');
    table.appendChild(headerRow);
    table.appendChild(tbody);

    let currentRow = null;

    let rowCount = 0;

    data.forEach(item => {
      const row = document.createElement('tr');
      rowCount += 1;
      if(rowCount>10){
        const firstRow = tbody.querySelector('tr:nth-child(10)');
        firstRow.remove();
      }
      const serialNumber = document.createElement('td');
      serialNumber.textContent = item.serialNumber;
      const tsensor1 = document.createElement('td');
      tsensor1.textContent = item.tsensor1;
      const tsensor2 = document.createElement('td');
      tsensor2.textContent = item.tsensor2;
      const tsensor3 = document.createElement('td');
      tsensor3.textContent = item.tsensor3;
      const tsensor4 = document.createElement('td');
      tsensor4.textContent = item.tsensor4;
      const hsensor1 = document.createElement('td');
      hsensor1.textContent = item.hsensor1;
      const hsensor2 = document.createElement('td');
      hsensor2.textContent = item.hsensor2;
      const hsensor3 = document.createElement('td');
      hsensor3.textContent = item.hsensor3;
      const hsensor4 = document.createElement('td');
      hsensor4.textContent = item.hsensor4;
      row.appendChild(serialNumber);
      row.appendChild(tsensor1);
      row.appendChild(tsensor2);
      row.appendChild(tsensor3);
      row.appendChild(tsensor4);
      row.appendChild(hsensor1);
      row.appendChild(hsensor2);
      row.appendChild(hsensor3);
      row.appendChild(hsensor4);
      tbody.insertBefore(row, tbody.firstChild);

      currentRow = item;
    });
    setCurrentReadings(currentRow);
    const container = document.getElementById('data-container');
    container.innerHTML = ``;
    container.appendChild(table);
    
  }

  const readGoogleSheet =()=> {
    fetch('https://sheetdb.io/api/v1/cu78sa76ap0rd')
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        addDataToTable(data);
      });
  }
  
  useEffect(() => {
    readGoogleSheet();
    const interval = setInterval(() => {
      readGoogleSheet();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    displayCurrent();
  }, [currentReadings]);

  const displayCurrent = ()=>{
    const t1 = Number (currentReadings.tsensor1);
    const t2 = Number (currentReadings.tsensor2);
    const t3 = Number (currentReadings.tsensor3);
    const t4 = Number (currentReadings.tsensor4);
    
    const h1 = Number (currentReadings.hsensor1);
    const h2 = Number (currentReadings.hsensor2);
    const h3 = Number (currentReadings.hsensor3);
    const h4 = Number (currentReadings.hsensor4);
    console.log(typeof(t1));
    console.log(typeof(t3));
    console.log(typeof(t2));
    console.log(typeof(t4));
    
    const t = ((t1+t2+t3+t4)/4).toFixed(2);
    const h = ((h1+h2+h3+h4)/4).toFixed(2);
    console.log(t);
    console.log(h);
    
    const temp = document.getElementById("currentR");
    temp.innerHTML = `<h1>Current Temperature: ${t}℃<br><br>Current Humidity: ${h}%</h1>`;

    const warning = document.getElementById("warn");
    
    if(isNaN(t1) || isNaN(t2) || isNaN(t3) || isNaN(t4)){
      const err = document.createElement("div");
      const read = document.getElementById("currentR");
      read.style.backgroundColor = "rgb(255, 75, 75)";
      read.style.color = "white";
      err.innerHTML = `<h1 style="color:red">Error: One or More Sensors Disconnected!!</h1>`;
      warning.innerHTML = ``;
      warning.appendChild(err);
      warning.style.margin = "50px";
      warning.style.marginBottom = "-10px";
    }
    else if(t >= 40 || h >= 70){
      const war = document.createElement("div");
      const read = document.getElementById("currentR");
      read.style.backgroundColor = "rgb(255, 75, 75)";
      read.style.color = "white";
      war.innerHTML = `<h1 style="color:red">Warning: The temperature or humidity is too high!</h1>`;
      warning.innerHTML = ``;
      warning.appendChild(war);
      warning.style.margin = "50px";
      warning.style.marginBottom = "-10px";

    }
    else{
      warning.innerHTML = ``;
      const read = document.getElementById("currentR");
      read.style.color = "black";
      read.style.backgroundColor = "rgb(43, 255, 234)";
    }
  }
  
  return (
    <>
      <div className="app">
        <div id='currentR'></div>
        <div id="warn"></div>

        <h3>Previous Readings: </h3>

        <div id="data-container"></div>
      </div>
    </>
  )
}

export default App