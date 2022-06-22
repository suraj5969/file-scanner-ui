import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import debounce from 'lodash.debounce';
import theme from './theme';
import { maxHeight } from '@mui/system';

function SearchBar({ searchString, setSearchString, searchData }) {

  const [warn, setWarn] = useState(false);

  const searchFilter = (e) => {
    if (e.target.value === '' || e.target.value.length > 2) {
      setSearchString(e.target.value);
      setWarn(false);
      // alert('Please search with atleast 3 characters.');
    }
    else {
      setWarn(true);
    }
  }
  const handelChange = debounce(searchFilter, 1000);

  const downloadAll = () => {
    if (searchData.length > 100) {
      window.alert('You cannot download more than 100 files at a time.');
      return;
    }

    const seacrhStr = searchString.replace(/\//g, '__replace_slash__');
    const element = document.createElement('a');
    element.setAttribute('href', `${process.env.REACT_APP_SERVER_URL}/api/getAllFiles/${seacrhStr}`);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  return (
    <>
      <div className='button' style={{ marginRight: '200px', paddingBottom: '20px', paddingTop: '20px' }}>
        <Stack direction="row" spacing={2}>
          <Stack spacing={1}>
            <ThemeProvider theme={theme}>
              <TextField
                id="outlined-basic"
                placeholder='Search a File'
                variant="outlined"
                label="Search"
                onChange={handelChange}
              />
            </ThemeProvider>
            {warn ? <small> Search with 3 or more characters to get results</small> : ''}
          </Stack>
          <Button
            variant="contained" onClick={downloadAll}
            disabled={searchString.length > 2 ? false : true}
            sx={{ maxHeight: '48px' }}>
            Download All
          </Button>
          {/* <Button variant="contained" onClick={click}>Search</Button> */}
        </Stack>
      </div>
    </>
  )
}

export default SearchBar;