import './config/env/env';

import express    from 'express';
import bodyParser from 'body-parser';
import {mongoose} from './config/mongodb';

//import socketIO   from 'socket.io';
import http       from 'http';
import path       from 'path'; // for test

const app     = express();
const port    = process.env.PORT;

app.use(bodyParser.json());

//Socket 테스트위해 임시허용
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

import Router from './router/index';
Router(app);

let server = http.Server(app);

import mainChatSocket from './socket/mainChat';
mainChatSocket(server);
//
import subChatSocket from './socket/subChat';
subChatSocket(server);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'))
});

app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index2.html'))
});

app.get('/sub1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/sub_index.html'))
});

app.get('/sub2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/sub_index2.html'))
});

server.listen(port, () => {
  console.log(`Connteced to port ${port}`);
});

module.exports = {app, server};
