const Promise = require('bluebird');



exports.create = () =>{

  const log = (params) =>{

    console.log("%j", params);

    return Promise.resolve();
  }

  return {
    send: log
  }
}
