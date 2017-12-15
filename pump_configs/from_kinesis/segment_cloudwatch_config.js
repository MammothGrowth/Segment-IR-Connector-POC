const
  Promise = require('bluebird')

exports.create = (target, mapper) =>{

  return {
    init: () =>{
      return Promise.resolve();
    },
    startBatch: (sourceBatch) =>{
      return Promise.resolve(sourceBatch);
    },
    mapSourceBatch: (sourceBatch) =>{
      return Promise.resolve(sourceBatch.map(mapper.map));
    },
    batchToTarget: (targetBatch) =>{
      return Promise.map(targetBatch, target.send);
    },
    finishBatch: (syncIds)=>{
      return Promise.resolve(syncIds);
    },
    failBatch: (syncIds, error)=>{
      console.error(error);
      return Promise.resolve();
    },
    syncComplete: ()=>{
      return Promise.resolve();
    }
  }
}
