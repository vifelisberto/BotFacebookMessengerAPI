  // Teste BOT Facebook Messenger APi // V.Felisberto
  'use strict'

  const express = require('express')
  const bodyParser = require('body-parser')
  const request = require('request')
  const app = express()


  // parse application/x-www-form-urlencoded
  app.use(bodyParser.urlencoded({extended: false}))

  // parse application/json
  app.use(bodyParser.json())

  // index
  app.get('/', function (req, res) {
          res.send('Hello World! Secret Bot: Ativo')
  })

  // Verificação do Facebook
  app.get('/webhook/', function (req, res) {
          if (req.query['hub.verify_token'] === 'mastertech') {
                  res.send(req.query['hub.challenge'])
          } else {
                  res.send('Error, wrong token')
          }
  })
  // Para post data
  app.post('/webhook/', function (req, res) {
          let messaging_events = req.body.entry[0].messaging
          for (let i = 0; i < messaging_events.length; i++) {
                  let event = req.body.entry[0].messaging[i]
                  let sender = event.sender.id
                  if (event.message && event.message.text) {
                          let text = event.message.text.toLowerCase()
                          if (text === 'oi' || text === 'ola'|| text === 'olá'|| text === 'ooi'|| text === 'oii'){
                                  //sendGenericMessage(sender)
                                if(sendTextMessage(sender, "Olá seja bem-vindo ao Mastertech!!")){
                                  sendTextMessage(sender, "No que podemos te ajudar? =D")
                                }
                                  continue
                          }
                          if (text.indexOf('cursos') != -1){
                            sendTextMessage(sender, "Esses são nossos cursos ;)")
                            sendGenericMessage(sender)
                            continue
                          }
                          if (text.indexOf('workshop') != -1){
                            sendList(sender)
                            continue
                          }
                          //sendTextMessage(sender, "Text received, echo: " + text.substring(0, 200))
                  }
                  if (event.postback) {
                          let text = JSON.stringify(event.postback)
                          sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
                          continue
                  }
          }
          res.sendStatus(200)
  })

  // recommended to inject access tokens as environmental variables, e.g.
  // const token = process.env.FB_PAGE_ACCESS_TOKEN
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

  function sendGenericMessage(sender) {
          let messageData = {
                  "attachment": {
                          "type": "template",
                          "payload": {
                                  "template_type": "generic",
                                  "elements": [{
                                          "title": "BOOTCAMP DE PROGRAMAÇÃO",
                                          "subtitle": "Aprenda a programar em 8 semanas",
                                          "image_url": "https://mastertech.tech/wp-content/uploads/2016/11/curso-imersivo-programacao.jpg",
                                          "buttons": [{
                                                  "type": "web_url",
                                                  "url": "https://mastertech.tech/bootcamp/",
                                                  "title": "Inscreva-se"
                                          }, {
                                                  "type": "postback",
                                                  "title": "Quero saber mais",
                                                  "payload": "Quero saber mais",
                                          }],
                                  }, {
                                          "title": "EM UM FINAL DE SEMANA",
                                          "subtitle": "Aprenda a programar em um final de semana",
                                          "image_url": "https://mastertech.tech/wp-content/uploads/2016/10/IoonicHome.jpg",
                                          "buttons": [{
                                                  "type": "web_url",
                                                  "url": "https://mastertech.tech/fds/",
                                                  "title": "Inscreva-se"
                                          }, {
                                                  "type": "postback",
                                                  "title": "Quero saber mais",
                                                  "payload": "Quero saber mais",
                                          }],
                                  }]
                          }
                  }
          }
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

  function sendList(sender) {
    let messageData = {
        "text":"Pick a color:",
        "quick_replies":[
          {
            "content_type":"text",
            "title":"Red",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_RED"
          },
          {
            "content_type":"text",
            "title":"Green",
            "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_GREEN"
          }
        ]
      }
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
                    console.log('Erro ao enviar mensagens: ', error)
            } else if (response.body.error) {
                    console.log('Error: ', response.body.error)
            }
    })
  }

  // spin spin sugar
  app.listen(80, function() {
          console.log('running on port', app.get('port'))
  })
