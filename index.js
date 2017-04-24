const Lazy = require('lazy.ai');
const lazy = new Lazy();
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
lazy.loadTrainedData()
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendfile('index.html');
});

io.on('connection', (socket) => {
  socket.on('phrase', (phrase) => {
    lazy.query({phrase})
      .then(result => {
        console.log(`Phrase: ${phrase}, Result: ${result.response}`);
        console.log(result);
        if (result.possibility === 1) {
          io.emit('result', result.response);
        } else if (result.possibility === .5) {
          io.emit('error', result)
        }
        //
      })
      .catch(err => {
        console.log(err);
      })
  });
});

http.listen(process.env.PORT || 5000, function(){
  console.log('listening on *:', process.env.PORT || 5000);
});
