import React, { useState } from 'react';
import './App.css';
import SearchBar from './SearchBar';
import TableData from './TableData';

function App() {

  const [searchString, setSearchString] = useState('');
  const [searchData, setSearchData] = useState([]);

  return (
    <div style={{ maxWidth: '1500px', margin: 'auto', background:'#fff' }}>
      <SearchBar
        searchString={searchString}
        setSearchString={setSearchString}
        searchData={searchData}
      />
      <TableData
        searchString={searchString}
        searchData={searchData}
        setSearchData={setSearchData}
      />
    </div>
  );
}

export default App;
