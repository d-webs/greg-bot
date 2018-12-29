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
const queryString = require('query-string')
const { createRecipeResponse } = require('./src/responseHelper')

const { SLACK_TOKEN } = process.env

exports.handler = async (event) => {
  const body = queryString.parse(event.body)

  if (body.token !== SLACK_TOKEN) {
    return {
      statusCode: 401,
      body: 'Unauthorized Request'
    }
  }

  if (!body.text) {
    return {
      statusCode: 200,
      body: 'All recipes coming soon'
    }
  }

  const drink = body.text.toLowerCase().replace(/[-_\s]+/g, '')
  try {
    const recipe = fs.readFileSync(`recipes/${drink}.txt`)

    return {
      statusCode: 200,
      body: JSON.stringify(
        createRecipeResponse(drink, recipe)
      )
    }
  } catch (_e) {
    return {
      statusCode: 200,
      body: `Sorry, I don\'t know the recipe for ${drink} :confused:`
    }
  }
}
