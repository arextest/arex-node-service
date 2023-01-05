## Description

The node service that unifies execution of third-party JavaScript. To provide the function of AREX-UI's  ```Pre-request Script```
and ```Testsd```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# production mode
$ npm run start:prod
```

## Getting Started

url：/pTest

request:

```txt
{	
    "address": {
        // request method
        "method": "POST",
        // request url
        "endpoint": "http://www.baidu.com"
    },
    // request headers
    "headers": [
        {
            "key": "Content-Type",
            "value": "application/json"
        }
    ],
    // request body
    "body": "{\"key\": \"value\"}",
    // environments
    "envList": [
        {
            "key": "key",
            "value": "value"
        }
    ],
    // variables
    "varList": [
        {
            "key": "key",
            "value": "value"
        }
    ],
    // response
    "response": "{\"status\":200,\"statusText\":\"\",\"headers\":[{\"key\":\"vary\",\"value\":\"Origin, Access-Control-Request-Method, Access-Control-Request-Headers\"},{\"key\":\"content-type\",\"value\":\"application/json\"},{\"key\":\"transfer-encoding\",\"value\":\"chunked\"},{\"key\":\"date\",\"value\":\"Thu, 05 Jan 2023 02:18:04 GMT\"},{\"key\":\"connection\",\"value\":\"close\"}],\"body\":{\"responseStatusType\":{\"responseCode\":0,\"responseDesc\":\"success\",\"timestamp\":1672885084858},\"body\":{\"id\":\"1234567890123456789\"}}}",
    // Executing scripts in the sandbox
    "preTestScripts": [
        "let response = await arex.sendRequest({\"method\":\"GET\",\"url\":\"http://www.baidu.com\"});"
    ]
}
```

response

```txt
{
    "responseStatusType": {
        "responseCode": 0,
        "responseDesc": "success",
        "timestamp": 1672901036000
    },
    "body": {
        "address": {
            "method": "POST",
            "endpoint": "http://www.baidu.com"
        },
        "headers": [
            {
                "key": "Content-Type",
                "value": "application/json"
            }
        ],
        "body": "{\"key\":\"value\"}",
        "envList": [
            {
                "key": "key",
                "value": "value"
            }
        ],
        "varList": [
            {
                "key": "key",
                "value": "value"
            }
        ],
        // the results of validation 
        "caseResult": {
            "descriptor": "root",
            "expectResults": [],
            "children": []
        }
    }
}
```

## Sandbox Environment

The following section outlines the API available inside sandbox scripts

- arex.environment
- arex.variables
- arex.request
- arex.response
- arex.sendRequest
- arex.executeMySql
- arex.test
- arex.expect
- arex.toBe
- arex.toBeLevel2xx

## LICESE

```md
Copyright (C) 2022 ArexTest

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see https://www.gnu.org/licenses/.
```




