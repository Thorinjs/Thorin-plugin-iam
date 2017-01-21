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
module.exports = (thorin, opt, pluginName) => {
  opt = thorin.util.extend({
    logger: pluginName || 'iam',

  }, opt);
};

module.exports.publicName = 'iam';