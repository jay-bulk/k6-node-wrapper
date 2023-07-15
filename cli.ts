import meow from 'meow'
import resolveFrom from 'resolve-from'

const cli = meow(`
	Usage
	  $ loader <input>

	Options
	  --token, -t specify a token

	Examples
	  $ loader -t crunchbase_api tokens.json
	  loadtesting crunchbase_api with default settings:...
`, {
  importMeta: import.meta,
  flags: {
    token: {
      type: 'boolean',
      shortFlag: 't'
    },
    config:{
      type: 'string',
      shortFlag: 'c'
    }
  }
})

const optionsBase = {}

optionsBase.configFile =
    resolveFrom(process.cwd(), cli.flags.config)
let file: string
Promise.resolve()
  .then(() => Object.assign({}, optionsBase))
  .then(options => standalone(options))
  .then(output => {
    if (cli.input.length === 0) {
      file = path.resolve('./env.json')
      }
    else if (cli.input.config !== undefined) {
      file = path.resolve(cli.input.pop())
    }


    return Promise.resolve().then(() => fs.outputFile(file, output));
  })
  .catch(error => {
    console.log(error); // eslint-disable-line no-console
    process.exit(error.code || 1);
  });
/*
{
	input: ['unicorns'],
	flags: {rainbow: true},
	...
}
*/

loader(cli.input.at(0), cli.flags);