const fs = require('fs')
const rp = require('request-promise')
const Promise = require('bluebird')

const args = process.argv.slice(2)
const abbreviated_text = args[0]
const expansionPath = args[1]
const sentencePath = args[2]

if(!abbreviated_text || !expansionPath || !sentencePath) {
  console.error('Missing argument')
  process.exit(1)
}

console.log('Processing abbreviation: ', abbreviated_text)
console.log('Expansions Path:', expansionPath)
console.log('Sentences Path:', sentencePath)


const insertAbbreviation = (abbreviated_text) => {
  const data = {
    abbreviated_text
  }

  const options = {
    method: 'POST',
    uri: 'http://localhost:8000/abbreviations',
    body: data,
    json: true // Automatically stringifies the body to JSON
  }

  return rp(options)
    .then(function (parsedBody) {
      const { id, abbreviated_text } = parsedBody
      console.log(`Successfully added abbreviation: ${abbreviated_text}, id: ${id}`)

      return parsedBody
    })
    .catch(function (err) {
      console.error(err)
    })
}

const insertExpansions = (path, abbrev_id) => {
  const lineReader = require('readline').createInterface({ input: fs.createReadStream(path) })

  lineReader.on('line', function (line) {
    const data = { abbrev_id, expanded_text: line.trim() }
    const options = {
      method: 'POST',
      uri: 'http://localhost:8000/expansions',
      body: data,
      json: true // Automatically stringifies the body to JSON
    }

    rp(options)
      .then(function (parsedBody) {
        const { expanded_text } = parsedBody

        console.log(`Successfully added expansions: ${expanded_text}`)
      })
      .catch(function (err) {
        console.error(err)
      })
  })
}

const insertSentences = (path, abbrev_id, abbreviated_text) => {
  const lineReader = require('readline').createInterface({ input: fs.createReadStream(path) })

  lineReader.on('line', function (line) {
    const text = line.trim()
    const char_pos = text.indexOf(`<${abbreviated_text}>`)
    const data = { abbrev_id, text, char_pos }

    const options = {
      method: 'POST',
      uri: 'http://localhost:8000/sentences',
      body: data,
      json: true // Automatically stringifies the body to JSON
    }

    rp(options)
      .then(function (parsedBody) {
        const { text } = parsedBody

        console.log(`Successfully added sentence: ${text}`)
      })
      .catch(function (err) {
        console.error(err)
      })
  })
}


// Add abbreviation first so we can reference it in the expansions and sentences
insertAbbreviation(abbreviated_text)
  .then(result => {
    const { id, abbreviated_text } = result

    Promise.all([ insertExpansions(expansionPath, id), insertSentences(sentencePath, id, abbreviated_text) ])
  })
