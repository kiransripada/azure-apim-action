const axios = require('axios');
const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

const APIM_API_NAME =  process.env.APIM_API_NAME || core.getInput('APIM_API_NAME');
const API_SPEC =  process.env.API_SPEC || core.getInput('API_SPEC');
const GITHUB_WORKSPACE =  process.env.GITHUB_WORKSPACE || core.getInput('GITHUB_WORKSPACE');

const apiSpecValidatorServiceURL= 'https://validator.swagger.io/validator/debug'

/**
 * Validate Api Spec.
 * @param {string} accessToken
 */
async function validateApiSpec() {


    try {
        console.log("apiSpec ="+API_SPEC);
        const apiSpecData = readApiDoc('api-spec.json')

        const validateResp = await axios({
            headers: {
                'content-type': 'application/json'
            },
            method: 'post',
            url: apiSpecValidatorServiceURL,
            data:apiSpecData
        });
        console.log("validate status code= "+ validateResp.status);
        if (validateResp.status ===200 && Object.keys(validateResp.data).length ===0 ) {
            console.log('*** API Spec validation is successful');

            return validateResp
        }else{
            console.log(JSON.stringify(validateResp.data));
            throw  new Error(`ERROR: API Spec Validation failed --${JSON.stringify(validateResp.data)}`)
        }

    } catch (error) {
        throw  new Error(`ERROR: Validating API -- ${JSON.stringify(error)}`);
    }
}

/**
 * Validate Api Spec.
 * @param {string} accessToken
 */
async function validateApiSpecUsingLink() {

    console.log('validation request  at: ' + new Date().toString());

    try {
        console.log("apiSpec ="+API_SPEC);
        const apiSpec = await axios.default.get(API_SPEC);

        const validateResp = await axios({
            method: 'post',
            url: apiSpecValidatorServiceURL,
            data:apiSpec.data
        });
        console.log("validate status code= "+ validateResp.status);
        if (validateResp.status ===200 && Object.keys(validateResp.data).length ===0 ) {
            console.log('*** API Spec validation is successful');

            return validateResp
        }else{
            console.log(JSON.stringify(validateResp.data));
            throw  new Error(`ERROR: API Spec Validation failed --${JSON.stringify(validateResp.data)}`)
        }

    } catch (error) {
        throw  new Error(`ERROR: Validating API -- ${JSON.stringify(error)}`);
    }
}


/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function callApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    try {
        const response = await axios.default.get(endpoint, options);
        return response.data;
    } catch (error) {
        console.log(error)
        throw  new Error(`Error in  getting token -- ${error.code } -- ${error}`);
    }
}
// fileUrl: the absolute url of the image or video you want to download
// downloadFolder: the path of the downloaded file on your machine
const downloadFile = async (fileUrl, downloadFolder,fileName) => {
    // Get the file name
/*    const fileName = path.basename(fileUrl);
    console.log('fileName'+fileName);*/


    // The path of the downloaded file on our machine
    const localFilePath = path.resolve(__dirname, downloadFolder, fileName);
    console.log('localFilePath=='+localFilePath);

    try {
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream',
        });

        const w = response.data.pipe(fs.createWriteStream(localFilePath));
        w.on('finish', () => {
            console.log('Successfully downloaded file!');
        });
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function createApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());

    const apiSpecFileContent= readApiDoc('api-spec.json');

    try {
        const response = await axios({
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'content-type': 'application/json'
            },
            method: 'put',
            url: endpoint,
            data:{
                "properties": {
                    "format": "openapi+json", // "openapi-content"
                    "value": `${apiSpecFileContent}`,

                    "description": `${APIM_API_NAME}`,

                    "subscriptionKeyParameterNames": {
                        "header": "X-API-Key",
                        "query": "xx-dont-use-xx"
                    },
                    "displayName": `${APIM_API_NAME}`,
                    "path": `external/${APIM_API_NAME}`,
                    "protocols": [
                        "https",
                        "http"
                    ]
                }
            }
        });
        return response;
    } catch (error) {
        console.log('Error in publishing  API to APIM',error);
        throw  new Error(`Error in publishing  API to APIM -- ${error.code } -- ${error}`);
    }
};


/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function createApiUsingLink(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());
    //const excelFile = path.resolve('./dist/api-spec.json');

    //const apiSpec = fs.readFileSync('./dist/api-spec.json', 'utf8');
    //console.log("data==="+apiSpec);
  try {
        const response = await axios({
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: 'put',
            url: endpoint,
            data:{
                "properties": {
                    "format": "openapi-link", // "openapi-link"
                    "value": `${API_SPEC}`,

                    "description": `${APIM_API_NAME}`,

                    "subscriptionKeyParameterNames": {
                        "header": "X-API-Key",
                        "query": "xx-dont-use-xx"
                    },
                    "displayName": `${APIM_API_NAME}`,
                    "path": `external/${APIM_API_NAME}`,
                    "protocols": [
                        "https",
                        "http"
                    ]
                }
            }
        });
        return response;
    } catch (error) {
      console.log('Error in publishing  API to APIM',error);
      throw  new Error(`Error in publishing  API to APIM -- ${error.code } -- ${error}`);
    }
};

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint
 * @param {string} accessToken
 */
async function createApiPolicy(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    console.log('request made to web API at: ' + new Date().toString());
    const apiPolicy= readApiDoc('api-policy.xml');
   try {
        const response = await axios({
            headers: {
                Authorization: `Bearer ${accessToken}`
            },
            method: 'put',
            url: endpoint,
            data:{
                "properties": {
                    "format": "rawxml",
                    "value": `${apiPolicy}`
                }
            }
        });
        return response;
    } catch (error) {
       console.log('Error in publishing  API-Policy to APIM' ,error);
       throw  new Error(`Error in publishing  API-Policy to APIM -- ${error.code } -- ${error}`);
    }
};

/**
 *
 * @param docName {string}
 */
const readApiDoc =  (docName) =>{

    //@TODO: make it clean:  for local testing ,place api-spec.json and api-policy.xml in project base dir
/*    const file = path.resolve(`${docName}`);
    console.log("ApiSpecFile==="+file);*/
    //@TODO: make it clean:  for local testing ,place api-spec.json and api-policy.xml in project base dir
    const docContent = fs.readFileSync(`${GITHUB_WORKSPACE}/docs/${docName}`, 'utf8');
    console.log(`Content in ${docName}=== ${docContent}`);
    return docContent;

}

module.exports = {
    callApi: callApi,
    createApi:createApi,
    downloadFile:downloadFile,
    createApiPolicy:createApiPolicy,
    validateApiSpec:validateApiSpec
};
