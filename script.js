import http, {asyncRequest} from 'k6/http'
import { check } from 'k6'
import { Rate } from 'k6/metrics';
import { SharedArray } from 'k6/data'
import encoding from 'k6/encoding'
export const errorRate = new Rate('errors');
const data = new SharedArray('name', function () {
    const f = JSON.parse(open('./env.json'))
    return f
})
const id = data[0]
const sec = data[1]

export default function () {

let auth = encoding.b64encode(`${id}:${sec}`)
let tokenUrl = `${__ENV.TOKEN_URL}`
const body = { 'grant_type':'client_credentials'}

// make token request
let req = asyncRequest(`POST`,tokenUrl,body, {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "host": "https:api-sandbox.byu.edu/",
          'Authorization': `Basic ${auth}`
      },
  }
)
let response = req.toString()
const data = JSON.parse(response)


// Get the client id and secret
const apiToken = `${data.access_token}`
    const baseUrl = `${__ENV.base_URL}`
    const params = {
        headers: {
            'Authorization': 'Bearer ' + apiToken
        }
    }
    // Verify response
    check(http.get(url, params), {
        'status is 200': (r) => r.status == 200,
    }) || errorRate.add(1);
}


