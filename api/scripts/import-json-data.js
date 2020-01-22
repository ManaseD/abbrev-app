const fs = require('fs')
const rp = require('request-promise')
const Promise = require('bluebird')
const forEach = require('lodash/forEach')


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

const insertExpansions = (expansions, abbrev_id) => {
  forEach(expansions, (text) => {

    let data = { abbrev_id, expanded_text: text.trim() }
    let options = {
      method: 'POST',
      uri: 'http://localhost:8000/expansions',
      body: data,
      json: true // Automatically stringifies the body to JSON
    }

    rp(options)
      .catch(function (err) {
        console.error(err)
      })
  })
}

const insertSentences = (sentences, abbrev_id, abbr) => {
  forEach(sentences, (sentence) => {
    const text = sentence.trim()
    const char_pos = text.indexOf(`<${abbr}>`)
    const data = { abbrev_id, text, char_pos }

    const options = {
      method: 'POST',
      uri: 'http://localhost:8000/sentences',
      body: data,
      json: true // Automatically stringifies the body to JSON
    }

    rp(options)
      .catch(function (err) {
        console.error(err)
      })
  })
}


const args = process.argv.slice(2)
const json_path = args[0]

if(!json_path) {
  console.error('Missing argument for JSON path')
  process.exit(1)
}

console.log('Processing abbreviations json: ', json_path)

const rawData = fs.readFileSync(json_path)
const abbreviations = JSON.parse(rawData)


// Add abbreviation first so we can reference it in the expansions and sentences
forEach(abbreviations, (data, abbr) => {
  let expansions = data['expansions']
  let sentences = data['sentences']

  insertAbbreviation(abbr)
    .then(result => {
      const { id, abbreviated_text } = result

      Promise.all([
        insertExpansions(expansions, id),
        insertSentences(sentences, id, abbreviated_text)
      ])
    })
})
