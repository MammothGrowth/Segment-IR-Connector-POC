const Promise = require('bluebird');

const parseKinesisRecords = (records) => {

  const data = records
    .map((record) => {
      let json = (new Buffer(record.kinesis.data, 'base64').toString('utf8'));
      return JSON.parse(json);

    });

  return data;
};

exports.handler = (event, context, callback) => {


  context.callbackWaitsForEmptyEventLoop = false

  const trackingParams= {
    CampaignId: 7391,
    ActionTrackerId: 13171, //Converted Trial
    Quantity: 1
  }

  const authCredentials = {
    AccountId: "IRxn4RnVRiD9464737YAxmZSCKUJdb46g1",
    AuthToken: "QNozQ5h4_BkMFcRXMpokkwMzdq-MMZum",
    baseURL: "api.impactradius.com/Advertisers/IRxn4RnVRiD9464737YAxmZSCKUJdb46g1/Conversions"
  }

  const data = parseKinesisRecords(event.Records);
  const target = require('./sources/impact_radius').create(trackingParams, authCredentials);
  const mapper = require('./pump_configs/from_kinesis/impact_radius_signed_up_mapper');
  const cloudwatchConfig = require('./pump_configs/from_kinesis/impact_radius_config').create(target, mapper);
  const worker = require('./kinesis_worker').create(cloudwatchConfig);

  worker.sync(data)
    .then(()=>{

      callback(null);
    }).catch(error=>{
      console.error("ERROR!");
      console.error(error);
      callback(error);
    });
};
