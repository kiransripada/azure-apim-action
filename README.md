## Action to publish & promote APIs to Azure API-M
<p align="center">
  <a href="#" src="#"></a>
</p>

#### Use case 
  - Enable self-service capabilities to publish & promote APIs to Azure API-M( using GitHub actions) .
    - If you are new to API-M,[click here](https://azure.microsoft.com/en-us/services/api-management)
 


#### 2.Proposed Process
```
  - Enable self-service to publish & promote APIs to APIM( using GitHub actions) 
  - Enable product teams to manage  publish and promotion to API-M as well
  Note: This process complements the current process 
```  
##### 2.1 Details 
 This action gives API developers ability to :
```
  - validate the API-Specification
  - publish & promote APIs to API-M 
  - create/update API policies
  Note:Currently this process still in evaluation phase and only available in API-M **sandbox** environment only. 
```
##### 2.2 Usage
You can now consume the action by referencing github branch(say main,apim) in your gh workflows yml
```
Sample #
https://github.com//hello-world-svc/blob/main/.github/workflows/publish-to-apim.yml
```

##### 2.3 Configuration - Environment
For publishing APIs to a specific API-M environment ,following environment configurations are needed
```
  TENANT_ID:445555-d9999-4900a-916123sd44
  CLIENT_ID: ${{ secrets.CLIENT_ID }}
  CLIENT_SECRET: ${{ secrets.CLIENT_SECRET }}
  SUBSCRIPTION_ID:{SET_VALUE_HERE} //eg: 664AAAb36e0-XXXX-YYY-ZZZ-a2z1233
  RESOURCE_GROUP_NAME:{SET_VALUE_HERE} //eg: my-sandbox-apim-001-rg
  APIM_SERVICE_NAME:{SET_VALUE_HERE} //eg: my-sandbox-apim
  AAD_ENDPOINT:  //eg: https://login.microsoftonline.com/
  GRAPH_ENDPOINT:  //eg: https://management.azure.com/
```

##### 2.4 Configuration - Apis
For publishing APIs to API-M environments ,following API specific inputs are needed.
```
  APIM_API_NAME:{YOUR_API_NAME} //eg: swaggerpetstore
  API_SPEC: {YOUR_API_SPEC}//api-spec in {YOUR_GH_REPO}/docs location or openapi spec link,which is accessible eg: https://petstore3.swagger.io/api/v3/openapi.json 
  API_POLICY_LOCATION: {YOUR_API_POLICY_XML} //api policy, present in {YOUR_GH_REPO}/docs location in  eg://https://github.com/hello-world-svc/blob/main/docs/api-policy.xml
```

#### 3. Next steps
```
 - Provide capability to manage NamedValues .
```

#### 4. Technical details
```
This action:
 - uses Microsoft REST APIs to interact with Azure API-M 
 - use OAuth2.0 ClientCredential flow to authenticate Azure API-M
 - uses GitHub libraries to interact with GitHub
```
