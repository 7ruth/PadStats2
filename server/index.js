/* eslint consistent-return:0 */

const express = require('express')
const bodyParser = require('body-parser')
const request = require('superagent')
const logger = require('./logger')

const argv = require('minimist')(process.argv.slice(2))
const setup = require('./middlewares/frontendMiddleware')
const isDev = process.env.NODE_ENV !== 'production'
const ngrok = (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel ? require('ngrok') : false
const resolve = require('path').resolve
const app = express()

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())

// MailChimp Sign up
mailchimpInstance = 'us13',
listUniqueId = '419afc1fa6',
mailchimpApiKey = '23930801bc23be85057d09f74aa8a46a-us13';

app.post('/api/signup', function (req, res) {
  request
        .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
        .set('Content-Type', 'application/json;charset=utf-8')
        .set('Authorization', 'Basic ' + new Buffer('any:' + mailchimpApiKey ).toString('base64'))
        .send({
          'email_address': req.body.EMAIL,
          'status': 'subscribed',
          // 'merge_fields': {
          //   'FNAME': req.body.firstName,
          //   'LNAME': req.body.lastName
          // }
        })
            .end(function(err, response) {
              if (response) {
                if (response.status < 300 || (response.status === 400 && response.body.title === "Member Exists")) {
                  res.send(response);
                } else {
                  return logger.error(err.message);
                }
              } else {
                console.log('no response from HTML request');
                console.log('Are you connected to the internet?');
              }
          });
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

const port = argv.port || process.env.PORT || 3000;

// Start your app.
app.listen(port, host, (err) => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    ngrok.connect(port, (innerErr, url) => {
      if (innerErr) {
        return logger.error(innerErr);
      }

      logger.appStarted(port, prettyHost, url);
    });
  } else {
    logger.appStarted(port, prettyHost);
  }
});
