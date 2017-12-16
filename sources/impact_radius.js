const Promise = require('bluebird');
const rp = require('request-promise');

console.log("impact_radius");
const maxLengths = {
  OrderId: 64,
  CustomerId: 50,
  OrderPromoCode: 64,
  ItemCategory1:64,
  ItemSku1: 40
};

const verifyFields = (params)=>{
  //Make sure all strings are within spec
  Object.keys(params).forEach((idx, key)=>{
    const maxLength = maxLengths[key];

    if(!maxLength) return;

    const val = params[key];

    if(val.length > maxLength) throw `Value for ${key} ${val} is greater than spec (${maxLength})`;
  });
}

exports.create = (trackingParams, authCredentials) =>{

  console.log("init impact_radius");
  if(!trackingParams) throw `Missing trackingParams`;
  if(!authCredentials) throw `Missing authCredentials`;

  if(!(authCredentials.AccountId && authCredentials.AuthToken && authCredentials.baseURL)) throw `Bad authCredentials`;

  console.log("setting up track");
  const track = (params) =>{

    verifyFields(params);

    const event = Object.assign(params, trackingParams);

    const url = `https://${authCredentials.AccountId}:${authCredentials.AuthToken}@${authCredentials.baseURL}`

    console.log(event);

    var options = {
        method: 'POST',
        uri: url,
        formData: event,
        headers:{
          "accept": "application/json"
        }
    };

    return rp(options).then(result=>{
      console.log(result);
    });
  }
  console.log("returning ");


  return {
    send: track
  }
}
