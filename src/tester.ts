import http from 'k6/http'
import { check, sleep } from 'k6'

// Get the client id and secret

function getCreds(prefix, callback) {
    console.info('getting creds')
    const clientId = process.env.CLIENT_ID ?? ""
    const clientSecret = process.env.CLIENT_SECRET ?? ""
    if (clientSecret != "") {
        console.info("clientid & secret retrieved")
    }
    if (callback) {
        // if local environment, add the logic to add a jwt to the requests
        if (process.env.ENV=== 'local') {
            return callback(prefix, clientId, clientSecret)
        } else {
            return callback(prefix, clientId, clientSecret)
        }
    }
}
// Get the Tyk Token
function getToken(prefix, clientId, clientSecret, callback) {
    console.info('getting token')
    // Check cache
    const cacheKey = `${prefix}tyk_cache`;
    const cacheString = process.env.CACHE
    let cache = null
    if (cacheString) {
        try {
            cache = JSON.parse(cacheString)
        } catch (e) {
            // Cache not proper JSON string, so ignore
        }
    }
    // Include 30-second buffer for expiration check
    if (cache && cache.clientId == clientId && cache.expires && cache.expires > Date.now() + 30000) {
        // add token to header
        request.headers.add({
            key: 'Authorization',
            value: `Bearer ${cache.token}`
        });
        if (callback) {
            return callback(prefix, cache.token)
        }
        return
    }
    // Cache doesn't exist or has expired
    let auth = btoa(clientId + ':' + clientSecret)
    const tokenUrl = "https://api-sandbox.byu.edu"
    let tokenRequest = {
        url: tokenUrl,
        method: "POST",
        body: {
            mode: 'urlencoded',
            urlencoded: [{ key: "grant_type", value: "client_credentials", disabled: false }]
        },
        header: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${auth}`
        }
    }
    // make token request
    return sendRequest(tokenRequest, function (err, res) {
        if (err) throw new Error(`Request Error: ${err.message}`)
        let request = fetch(requestHeaders)
        let response = res.stream.toString('utf8')
        const data = JSON.parse(response)
        if (data.error) throw new Error(`Request Error: ${data.error_description}`)
        const token = data.access_token
        if (callback) return callback(prefix, token)
    })
}
// Comment out when not using
getCreds(test='', getToken)


export const options = {
    vus: 10,
    duration: '3s'
}

const apiToken = ''
const requestHeaders = {
    'Authorization': 'Bearer ' + apiToken
}
const params = {

}

export default function () {
    const res = http.get('https://api-sandbox.byu.edu/bdp/human_resources/worker/v0?workerid=082243064')
}