'use strict';
/**
 * The Thorin.js plugin for IAM works with UNLOQ.io's access management system
 * It abstracts away access & permissioning for back-end applications with a lighting-fast speed.
 * The idea behind permission checking is to cache it as much as possible. Therefore, the way we handle
 * IAM permission requests is described bellow:
 *    (request)
 *    ------YOUR_APPLICATION -----       ------UIAM Cache app-----          ----UNLOQ.io API----
 *    | action --> iamObj.check() | ---> |  hitCache() , if false |  --->  | check()           |
 *    |---------------------------|      |------------------------|        |-------------------|
 *
 *    NOTE: UIAM Cache app is optional here, we can directly hit the API
 *    NOTE2: IF the UIAM Cache app is present, we will use websockets for a faster and persistent connection, so
 *    make sure that your back-end can support websockets.
 */
const Client = require('uiamp-client');
module.exports = (thorin, opt, pluginName) => {
  opt = thorin.util.extend({
    logger: pluginName || 'iam',
    url: '',  // Your UIAMP Server URL
    key: ''   // Your UIAMP Server Key generated with "npm run token" in the server
  }, opt);
  let pluginObj = {},
    clientObj,
    logger = thorin.logger(opt.logger);
  try {
    clientObj = new Client(opt);
    clientObj.run = (done) => {
      clientObj.connect().then(() => {
        logger.trace(`Connected to UIAMP`);
        done();
      }).catch((e) => {
        logger.trace(`Could not initiate UIAMP client`);
        return done(thorin.error('IAM.CONNECT', e.message || 'Could not connect to UIAMP'));
      });
    }
  } catch (e) {
    clientObj = {};
    clientObj.run = (done) => {
      return done(thorin.error('IAM.CONNECT', 'Missing UIAMP server URL'));
    };
  }

  return clientObj;
};

module.exports.publicName = 'iam';