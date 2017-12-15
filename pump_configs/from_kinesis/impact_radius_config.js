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
      return Promise.resolve(sourceBatch.map(mapper.map).filter(x => x));
    },
    batchToTarget: (targetBatch) =>{
      return Promise.map(targetBatch, target.send);
    },
    finishBatch: (syncIds)=>{
      return Promise.resolve();
    },
    failBatch: (syncIds, error)=>{
      return Promise.reject(error)
    },
    syncComplete: ()=>{
      return Promise.resolve();
    }
  }
}
