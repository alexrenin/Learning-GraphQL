const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require('../schema/schema')
const mongoose = require('mongoose')

const {USER_MONGODB, PASSWORD_MONGODB} = require('../config/config')

const app = express()
const PORT = 3005

mongoose.connect(
    `mongodb+srv://${USER_MONGODB}:${PASSWORD_MONGODB}@cluster0-zwc49.mongodb.net/graphql-tutorial?retryWrites=true&w=majority`,
	{ useNewUrlParser: true }
)

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}))

const dbConnection = mongoose.connection
dbConnection.on('error', err => console.log(`Connection error: ${err}`))
dbConnection.once('open', () => console.log('Connected to DB!'))

app.listen(PORT, err => {
  err ? console.log(err) : console.log('Server started!');
})