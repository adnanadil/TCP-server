const http = require('http')
const mqtt = require('mqtt')
const net = require('net')
const {app} = require('./api')

const PORT = 3000

const server = http.createServer(app)

server.listen(PORT, () => {
    console.log(`Listening to Port ${PORT}`)
})