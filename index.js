const express = require('express');

const http = require('http');

const routes = require('./src/routes');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const port = 4000;

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(port, () => {
    console.log(`> O Servidor está no ar, na porta: ${port} `);
});


