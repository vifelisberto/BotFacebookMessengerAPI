//Teste a
viar express = require('express');
var app = express();

app.get('/webhook', function (req, res) {
    if (req.query['hub.verify_token'] === 'mastertech') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');
    }
});

app.post('/webhook/', function (req, res) {
    let messaging_events = req.body.entry[0].messaging
    for (let i = 0; i < messaging_events.length; i++) {
        let event = req.body.entry[0].messaging[i]
        let sender = event.sender.id
        if (event.message && event.message.text) {
            let text = event.message.text
            sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
        }
    }
    res.sendStatus(200)
})

const token = "EAAFV7VbZA4YkBAPz41ZAcATQd4nLRZBaaJQ1i3OAwDyWRjqEXanoF4OlFGHkBWdXBCOiSFZBpMetKuiGOt6ExjwalD5YN0gdOI8xFT30BONONNF0ZCFUVH3aEjjFeHxCF4O7LiGRWeEup0iRrYdKFfYsDVxf6BZB52FZBX1jZC3cKAZDZD"

function sendTextMessage(sender, text) {
    let messageData = { text:text }
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
