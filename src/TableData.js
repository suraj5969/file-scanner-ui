import React, { useEffect, useState } from 'react';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid'
import CircularProgress from '@mui/material/CircularProgress';
import './TableData.css';

// import axios from 'axios';
// import { response } from 'express';

function TableData({ searchString, searchData, setSearchData }) {
    // console.log(searchInput);
    const [initialData, setInitialData] = useState([]);
    const [rows, setRows] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // console.log(`${process.env.REACT_APP_SERVER_URL}/api/getInitailData`);
        setIsLoading(true);
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/getInitailData`)
            .then(response => response.json())
            .then(data => {
                // console.log('initial called');
                setInitialData(data);
                setSearchData(data);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
                setSearchData([]);
                alert('unable to get data from Database. Please try again later');
                console.log(err);
            })
    }, [])

    useEffect(() => {
        if (Array.isArray(searchData)) {
            const sData = [];
            searchData.forEach(obj => {
                sData.push({
                    id: obj.id,
                    download: `${process.env.REACT_APP_SERVER_URL}/api/getFile/${obj.id}`,
                    fileName: obj.file_name,
                    fileContent: obj.file_content,
                    filePath: obj.file_path,
                    fileType: obj.file_ext,
                    wordfound: obj.word_found
                });
            })

            setRows(sData);
        }
    }, [searchData])

    useEffect(() => {
        if (searchString === '' || searchString.length < 3) {
            setSearchData(initialData);
            return;
        }
        setIsLoading(true);
        const seacrhStr = searchString.replace(/\//g, '__replace_slash__').trim();
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/getSearchData/${seacrhStr}`)
            .then(response => response.json())
            .then(data => {
                setSearchData(data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log("error occured while searching: ", err);
                setSearchData([]);
                setIsLoading(false);
                alert("error occurd whlie searching");
            })
    }, [searchString, setSearchData])

    const columns = [
        {
            field: 'download',
            headerName: 'Download',
            renderCell: (params) => (
                <a href={params.value}><DownloadIcon color="primary" /></a>
            ),
            width: 100,
        },
        {
            field: 'fileName',
            headerName: 'File Name',
            renderCell: (params) => (
                <Tooltip title={params.value} placement="top">
                    <p>{params.value}</p>
                </Tooltip>
            ),
            width: 300
        },
        {
            field: 'fileContent',
            headerName: 'File Content',
            renderCell: (params) => {
                // const displayStr = addr ? addr.length > 100 ? addr.substring(0, 99) + '...' : addr : '';
                const tooltipTitle = <div style={{ whiteSpace: "pre-wrap" }}>
                    {params.value.length > 600 ? params.value.substring(0, 600) + '...' : params.value}
                </div>;
                return (
                    <Tooltip title={tooltipTitle} placement="right">
                        <p> {params.value}</p>
                    </Tooltip>
                );
            },
            width: 400
        },
        {
            field: 'filePath',
            headerName: 'File Path',
            renderCell: (params) => (
                <Tooltip title={params.value} placement="top">
                    <p> {params.value}</p>
                </Tooltip>
            ),
            width: 350
        },
        { field: 'fileType', headerName: 'File Type', width: 100 },
        { field: 'wordfound', headerName: 'Word Found', width: 150 }
    ];

    const [pagesize, setPageSize] = useState(15);

    return (
        <div style={{ height: 900, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className='table'>
            {
                isLoading === false ?
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={pagesize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[15, 25, 50, 100]}
                        disableColumnFilter={true}
                        disableColumnMenu={true}
                    /> :
                    <CircularProgress />
            }

        </div>
    )
}
export default TableData;