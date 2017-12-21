const Promise = require('bluebird');


  const trackingParams= {
    CampaignId: 7391,
    ActionTrackerId: 13171 //Converted Trial
  }

  const authCredentials = {
    AccountId: "IRxn4RnVRiD9464737YAxmZSCKUJdb46g1",
    AuthToken: "QNozQ5h4_BkMFcRXMpokkwMzdq-MMZum",
    baseURL: "api.impactradius.com/Advertisers/IRxn4RnVRiD9464737YAxmZSCKUJdb46g1/Conversions"
  }

  console.log("init dependencies");
  const target = require('./sources/impact_radius').create(trackingParams, authCredentials);
  console.log("init mapper");
  const mapper = require('./pump_configs/from_kinesis/impact_radius_converted_trial_mapper');
  console.log("init config");
  const config = require('./pump_configs/from_kinesis/impact_radius_config').create(target, mapper);
  console.log("init worker");
  const worker = require('./kinesis_worker').create(config);


const parseKinesisRecords = (records) => {

  const data = records
    .map((record) => {
      let json = (new Buffer(record.kinesis.data, 'base64').toString('utf8'));
      return JSON.parse(json);

    });

  return data;
};

exports.handler = (event, context, callback) => {


  console.log("starting Lambda");

  context.callbackWaitsForEmptyEventLoop = false

  console.log("parsing records");
    const data = parseKinesisRecords(event.Records);

  console.log(`Processing ${data.length} events.`);

  if(data.length == 0){

    callback(null);
    return;
  }

  worker.sync(data)
    .then(()=>{

      callback(null);
    }).catch(error=>{
      console.error("ERROR!");
      console.error(error);
      callback(error);
    });
};
