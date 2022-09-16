#!/usr/bin/env node

// read in env settings
require('dotenv').config();

const yargs = require('yargs');

const fetch = require('./fetch');
const auth = require('./auth');
const core = require('@actions/core');

const API_POLICY_LOCATION = core.getInput('API_POLICY_LOCATION') || process.env.API_POLICY_LOCATION;

const options = yargs
    .usage('Usage: --op <operation_name>')
    .option('op', { alias: 'operation', describe: 'operation name', type: 'string', demandOption: false })
    .argv;

async function main() {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0; // by pass ssl cert error
    //console.log(`You have selected: ${options.op}`);
    try {
        const authResponse = await auth.getToken(auth.tokenRequest);
       const apiValidationResp= await fetch.validateApiSpec();
        const apiCreateResp = await fetch.createApi(auth.apiConfig.uri, authResponse.accessToken);
        const apiPolicyResp = await fetch.createApiPolicy(auth.apiPolicyConfig.uri, authResponse.accessToken);
        console.log(`***STATUS*** : apiValidationRespCode= ${apiValidationResp.status} apiCreateRespCode= ${apiCreateResp.status}  apiPolicyRespCode=${apiPolicyResp.status} `);
    } catch (error) {
        console.log('***Failed***');
        core.setFailed(error);
    }
};

main();
