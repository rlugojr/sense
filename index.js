module.exports = function (kibana) {
  let { escapeRegExp } = require('lodash');
  let { resolve } = require('path');
  let Joi = require('joi');
  let Boom = require('boom');
  let modules = resolve(__dirname, 'public/module_shims/');

  return new kibana.Plugin({
    id: 'sense',

    require: ['kibana'],

    init: function (server, options) {
      // http://hapijs.com/api/8.8.1#route-configuration
      server.route({
        path: '/api/sense/proxy',
        method: ['*', 'GET'],
        config: {
          handler: {
            proxy: {
              mapUri: function (req, cb) {
                let { uri } = req.query;

                if (!uri) {
                  cb(Boom.badRequest('URI is a required param.'));
                }
                else {
                  cb(null, uri);
                }
              },
              passThrough: true,
              xforward: true
            }
          }
        }
      });
    },

    uiExports: {
      app: {
        title: 'Sense',
        description: 'JSON aware developer\'s interface to ElasticSearch',
        main: 'plugins/sense/index',
        autoload: kibana.autoload.styles
      },

      noParse: [
        new RegExp(escapeRegExp(resolve(modules, 'ace/') + '.+')),
        resolve(modules, 'moment'),
        resolve(modules, 'sense_editor/mode/worker.js'),
      ]
    }
  })
}