/*
  Ok, so here's the basic overview:
  This app will expect POST requests sent to some-gregory-url.aws.com
  This server will then check the "body" of the request to get information about the slash command
  Then, using the name of the drink, it will look for the text file with the corresponding recipe.

  Using literal files like this is a bad pattern (depending on how many recipes you'll eventually have)
  That's what databases are for...
  But its a good start
*/

// fs is a library that can read contents of files
const fs = require('fs')

const {
  createRecipeResponse,
 } = require('./src/responseHelper.js')

// Import express, a simple JavaScript HTTP
// server that accepts HTTP requests, and returns
// a response
// For a basic express tutorial, see here: 
const express = require('express')

// Import body-parser, which allows our express server
// to convert HTTP text to JavaScript
const bodyParser = require('body-parser')

const app = new express()
app.use(bodyParser.urlencoded({extended: true}))

// On AWS, `process.env.PORT` will exist.
// On our computers, we assign it to 8000 arbitrarily
// See: https://en.wikipedia.org/wiki/Localhost
const { PORT, SLACK_TOKEN } = process.env
const defaultPort = 8000
const port = PORT || defaultPort

// Slack slash commands send POST requests
// See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods to learn about different types of HTTP requests
// Most common HTTP requests are: GET, POST, PUT, PATCH, and DELETE - and they all mean (generally) what they sound like they mean
app.post('/', (request, response) => {
  if (request.body.token !== SLACK_TOKEN) {
    return response.send('Unauthorized requestuest')
  }

  if (!request.body.text) {
    // Not quite sure the cleanest way to do this one yet...
    return response.send('All the recipes coming soon...')
  }

  try {
    const drink = request.body.text.toLowerCase().replace(/-_/g, '')
    const recipe = fs.readFileSync(`recipes/${drink}.txt`)

    response.json(
      createRecipeResponse(drink, recipe)
    )
  } catch (error) {
    if (error.code === 'ENOENT') {
      return response.send(`Sorry, I don\'t know the recipe for ${drink} :confused:`)
    }

    throw error
  }
})

app.listen(port, () => {
  console.log(`Server started at localholst:${port}`)
})
