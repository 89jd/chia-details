const express = require('express')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const app = express()
const port = 3000

const chiaLocation = process.env.CHIA_EXECUTABLE

async function getChiaFarmDetails() {
    const { stdout, stderr } = await exec(`ssh -o StrictHostKeyChecking=no ${process.env.SSH_USER}@localhost ${chiaLocation} farm summary`);

    if (stderr) {
      console.log(stderr)
      return null
    } else {
      return stdout.trim().split('\n')
            .map((value) => value.split(":"))
            .filter((value) => value.length == 2)
            .map((value) => [value[0].toLowerCase().replace(" ", "_"), value[1].substr(1)])
            .reduce((map, value) => (map[value[0]] = value[1], map), {})
    }
}

var cachedChiaFarmDetails = getChiaFarmDetails()

app.get('/chia/', async (req, res) => {
  cachedChiaFarmDetails = getChiaFarmDetails()
  res.send(await cachedChiaFarmDetails) 
})

app.listen(port, () => {
  
})