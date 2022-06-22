const express = require('express');
const sql = require('mssql');
const cors = require('cors');
const zip = require('express-zip');
const config = require('./dbconfig');

const app = express();
app.use(express.json());
app.use(cors());
const router = express.Router();
app.use('/api', router);

const dbConfig = config;

console.log(dbConfig);

router.use('/', (req, res, next) => {
    console.log('middleware');
    next();
})

let cachedData = [];
//Get data from api
router.route('/getInitailData').get(async function (req, res) {
    try {
        // console.log('initial data called')
        if (cachedData.length > 0) {
            res.json(cachedData);
            return;
        }
        const query = `SELECT TOP 500 [id]
            ,[file_name]
            ,[file_path]
            ,SUBSTRING([file_content], 1, 1000) AS file_content
            ,[file_ext]
            ,[file_size_in_kb]
            ,[word_found]
            FROM [ProposalGenerator].[dbo].[file_scanner_new]`;
        let pool = await sql.connect(dbConfig);
        const data = await pool.request()
            .query(query);
        cachedData = data.recordset;
        res.json(data.recordset);
    }
    catch (err) {
        console.log(err);
    }
});

//Download single file
router.route('/getFile/:file_id').get(async (req, res) => {
    try {
        const file_id = req.params.file_id;
        const query = `SELECT [file_path]
            FROM [ProposalGenerator].[dbo].[file_scanner_new]
            WHERE [id] = ${Number(file_id)}`;

        let pool = await sql.connect(dbConfig);
        const data = await pool.request()
            .query(query);
        console.log(data.recordset[0].file_path, 'file_path');
        if (data.recordset.length > 0) {
            const file_path = data.recordset[0].file_path;
            res.download(file_path);
        }
        else {
            res.send('No file found with given ID');
        }
    } catch (err) {
        console.log(err);
    }
})

//Search
let lastsearchString = '', lastsearchData = [];
async function getSearchData(searchString) {
    try {
        if (searchString === lastsearchString && lastsearchData.length > 0) {
            return lastsearchData;
        }
        const query = `SELECT TOP 500 [id]
            ,[file_name]
            ,[file_path]
            ,SUBSTRING([file_content], 1, 1000) AS file_content
            ,[file_ext]
            ,[file_size_in_kb]
            ,[word_found]
            FROM [ProposalGenerator].[dbo].[file_scanner_new]
            WHERE file_name LIKE '%${searchString}%' OR file_content LIKE '%${searchString}%'`;

        let pool = await sql.connect(dbConfig);
        const data = await pool.request()
            .query(query);
        lastsearchString = searchString;
        lastsearchData = data.recordset;
        return data.recordset;
    }
    catch (err) {
        console.log(err)
    }
}

router.route("/getSearchData/:searchString").get(async function (req, res) {
    try {
        const searchString = req.params.searchString;
        const seacrhStr = searchString.replace(/__replace_slash__/g, '/');
        const data = await getSearchData(seacrhStr);
        // console.log(data.length)
        res.json(data);
    } catch (err) {
        console.log(err);
    }
});

//Download all files
router.route('/getAllFiles/:searchString').get(async function (req, res) {
    try {
        const searchString = req.params.searchString;
        const seacrhStr = searchString.replace(/__replace_slash__/g, '/');
        const data = await getSearchData(seacrhStr);

        const zipFiles = [];
        data.forEach((row) => {
            zipFiles.push({ path: row.file_path, name: row.file_name })
        })
        res.zip(zipFiles);
    }
    catch (err) {
        console.log(err);
    }
});

const port = 5000;
app.listen(port, () => { console.log("Server started at 5000"); })