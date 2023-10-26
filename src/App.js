import './App.css';
import React, { useEffect, useState } from 'react';
import Dataframe from './componets/Dataframe';
import MissingData from './componets/MissingData';
import DataTypeChange from './componets/DataTypeChange';
import DataEncoding from './componets/DataEncoding';

function App() {
  const [userInput, setUserInput] = useState(1);

  const [sectionBVisible, setSectionBVisible] = useState(false);

  const sectionBVisibleFun = () => {
    setSectionBVisible(true);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  }

  return (
    <div>
      <h1 className='title'>Data Preprocessing </h1>
      <div className='section A'>
        <input className='input-head' placeholder='Enter number of rows' type="number" value={userInput} onChange={handleInputChange} />
        <Dataframe rows={userInput} shapeDisplay="true" />
      </div>
      <div className='section B'>
        <DataTypeChange />
      </div>
      <div className='section C'>
        <button className='section-btn' onClick={sectionBVisibleFun}>Missing Value</button>
        <MissingData />
      </div>
      <div className='section D'>
        <button className='section-btn' onClick={sectionBVisibleFun}>Data Encoding</button>
        <DataEncoding />
      </div>
    </div>
  );
}

export default App;
