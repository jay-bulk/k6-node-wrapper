import { spawn } from 'child_process'
import meow from 'meow'

const f = JSON.parse(open('./env.json'))
const meow.ask('What endpoint would you like to call?')

const id = f[0]
const sec = f[1]

export default function () {

let auth = encoding.b64encode(`${id}:${sec}`)
let tokenUrl = `env.json`
const body = { 'grant_type':'client_credentials'}

// make token request
let req = asyncRequest(`POST`,tokenUrl, body, {
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "host": "env.json",
          'Authorization': `Basic ${auth}`
      },
  }
)

// Get the client id and secret
const apiToken = `${req.access_token}`
const echo = ```
import http, {asyncRequest} from 'k6/http'
import { check } from 'k6'
import { Rate } from 'k6/metrics';
import encoding from 'k6/encoding'
import { spawn } from 'child_process'

export const errorRate = new Rate('errors')

export const options = {
    scenarios: {
        my_scenario1: {
            executor: 'constant-arrival-rate',
            duration: '25s', // total duration
            preAllocatedVUs: 20, // to allocate runtime resources

            rate: 50, // number of constant iterations given `timeUnit`
            timeUnit: '1s',
        },
    },
};

export default function () {

// Get the client id and secret
const apiToken = \`${apiToken}\`
    const baseUrl = \`${baseUrl}\`
    const params = {
        headers: {
            'Authorization': 'Bearer ' + apiToken
        }
    }
    // Verify response
    check(http.get(baseUrl, params), {
        'status is 200': (r) => r.status == 200,
    }) || errorRate.add(1);
}
```


const child = spawn('k6 run', ['--vus 10', 'script2.js'])

// use child.stdout.setEncoding('utf8'); if you want text chunks
child.stdout.on('data', (chunk) => {
  // data from standard output is here as buffers
  console.log(chunk)
});

// since these are streams, you can pipe them elsewhere
child.stderr.pipe(dest);

child.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

