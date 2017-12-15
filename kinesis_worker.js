const Promise = require('bluebird');

/*

  Config must specify:

  {
  init: function() => Promise
  startBatch: function(sourceBatch) => Promise<[syncId]>
  mapSourceBatch: function(sourceBatch) => Promise<targetBatch>
  batchToTarget: function(targetBatch) => Promise
  finishBatch: function([syncId]) => Promise
  failBatch: function([Syncid], error) => Promise
  completeSync: function() => Promise
}

*/

const validateConfig = (config) =>{

  if(typeof config.init !== 'function') throw 'config.init must be present';
  if(typeof config.startBatch !== 'function') throw 'config.startBatch must be present';
  if(typeof config.mapSourceBatch !== 'function') throw 'config.mapSourceBatch must be present';
  if(typeof config.batchToTarget !== 'function') throw 'config.batchToTarget must be present';
  if(typeof config.finishBatch !== 'function') throw 'config.finishBatch must be present';
  if(typeof config.failBatch !== 'function') throw 'config.failBatch must be present';
  if(typeof config.syncComplete !== 'function') throw 'config.syncComplete must be present';

  return config;
}

exports.create = (config) =>{

  const pumpConfig = validateConfig(config);

  const nextBatch = (sourceBatch) =>{

      if(!Array.isArray(sourceBatch)) throw 'expected array of items to process.';

      return pumpConfig.startBatch(sourceBatch)
      .then(syncIds =>{
        if(!Array.isArray(syncIds)) throw 'expected syncIds to be array.';

        return pumpConfig.mapSourceBatch(sourceBatch)
        .then(targetBatch=>{
          if(!Array.isArray(targetBatch)) throw 'expected array of items to send.';

          //expected to return the batchIndex to pass into the next loop
          return pumpConfig.batchToTarget(targetBatch)
          .then(()=>{

            //flag the syncIds as complete then resolve
            return pumpConfig.finishBatch(syncIds)
            .then(()=>{
              return Promise.resolve();
            });
          }).catch(error=>{
            console.error(error);
            //flag the syncIds as failed then reject
            return pumpConfig.failBatch(syncIds, error).then(()=>{ return Promise.reject(error) });
          }); //batchToTarget
        }); //mapSourceBatch
      }); //strtBatch
  }; //function


  const sync = (batch) =>{

    return pumpConfig.init()
    .then(()=>{
      return nextBatch(batch);
    });

  };

  return {
    sync: sync
  }

}
