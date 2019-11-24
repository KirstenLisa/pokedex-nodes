require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const POKEDEX = require('./pokedex.json')
const PORT = process.env.PORT || 8000

const app = express()

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]


app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN
  const authToken = req.get('Authorization')
   console.log('validate bearer token middleware')
   debugger
   if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
      }
    // move to the next middleware
    next()
  })

function handleGetTypes(req, res) {
  res.json(validTypes)
}
    
app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
  let response = POKEDEX.pokemon
  if(req.query.name) {
    response = response.filter(pokemon => pokemon.name.toLowerCase() === req.query.name.toLowerCase())
    res.send(response)
   }
  if(req.query.type) {
    response = response.filter(pokemon => pokemon.type == req.query.type)
    res.send(response)
  }
}
  
app.get('/pokemon', handleGetPokemon)
    
app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})


app.listen(PORT, () => {})
