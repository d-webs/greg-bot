const createSuccessMessage = recipe => ({
  color: 'good',
  text: `\`\`\`${recipe}\`\`\``,
})

const createRecipeResponse = (drink, recipe) => ({
  response_type: 'in_channel',
  text: `Hey there. Here's the recipe for ${drink}!`,
  attachments: [
    createSuccessMessage(recipe)
  ]
})

module.exports = {
  createRecipeResponse,
  createSuccessMessage,
}
