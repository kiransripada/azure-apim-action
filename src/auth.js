const msal = require('@azure/msal-node');
const core = require('@actions/core');

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL Node configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/configuration.md
 */

const TENANT_ID =  process.env.TENANT_ID || core.getInput('TENANT_ID');
const SUBSCRIPTION_ID =  process.env.SUBSCRIPTION_ID || core.getInput('SUBSCRIPTION_ID');
const RESOURCE_GROUP_NAME =  process.env.RESOURCE_GROUP_NAME || core.getInput('RESOURCE_GROUP_NAME');
const CLIENT_ID =  process.env.CLIENT_ID || core.getInput('CLIENT_ID');
const CLIENT_SECRET =  process.env.CLIENT_SECRET || core.getInput('CLIENT_SECRET');
const APIM_SERVICE_NAME =  process.env.APIM_SERVICE_NAME || core.getInput('APIM_SERVICE_NAME');
const APIM_API_NAME =  process.env.APIM_API_NAME || core.getInput('APIM_API_NAME');
const AAD_ENDPOINT =  process.env.AAD_ENDPOINT || core.getInput('AAD_ENDPOINT');
const GRAPH_ENDPOINT =  process.env.GRAPH_ENDPOINT || core.getInput('GRAPH_ENDPOINT');
const AUTHORITY =   AAD_ENDPOINT + TENANT_ID;




const msalConfig = {
	auth: {
		clientId: CLIENT_ID ,
		authority: AUTHORITY,
		clientSecret: CLIENT_SECRET
	}
};

/**
 * With client credentials flows permissions need to be granted in the portal by a tenant administrator.
 * The scope is always in the format '<resource-appId-uri>/.default'. For more, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow
 */
const tokenRequest = {
	scopes: [GRAPH_ENDPOINT + '.default'], // e.g. 'https://graph.microsoft.com/.default'
};

const apiConfig = {
	uri: GRAPH_ENDPOINT + `subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.ApiManagement/service/${APIM_SERVICE_NAME}/apis/${APIM_API_NAME}?api-version=2021-08-01`, // e.g. 'https://graph.microsoft.com/v1.0/users'
};

const apiPolicyConfig = {
	uri: GRAPH_ENDPOINT + `subscriptions/${SUBSCRIPTION_ID}/resourceGroups/${RESOURCE_GROUP_NAME}/providers/Microsoft.ApiManagement/service/${APIM_SERVICE_NAME}/apis/${APIM_API_NAME}/policies/policy?api-version=2021-08-01`, // e.g. 'https://graph.microsoft.com/v1.0/users'
};

/**
 * Initialize a confidential client application. For more info, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-node/docs/initialize-confidential-client-application.md
 */
const cca = new msal.ConfidentialClientApplication(msalConfig);

/**
 * Acquires token with client credentials.
 * @param {object} tokenRequest
 */
async function getToken(tokenRequest) {
	return await cca.acquireTokenByClientCredential(tokenRequest);
}

module.exports = {
	apiConfig: apiConfig,
	apiPolicyConfig:apiPolicyConfig,
	tokenRequest: tokenRequest,
	getToken: getToken
};
