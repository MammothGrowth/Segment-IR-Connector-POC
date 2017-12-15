
const segmentEventName = 'Started Membership';
const segmentEventType = 'track';
/*

{
    "_metadata": {
        "bundled": [
            "AdWords",
            "Segment.io"
        ],
        "unbundled": []
    },
    "anonymousId": "fecb2569-febc-4dde-a687-38adc23387e1",
    "channel": "client",
    "context": {
        "ip": "104.245.193.254",
        "library": {
            "name": "analytics.js",
            "version": "3.2.5"
        },
        "page": {
            "path": "/",
            "referrer": "",
            "search": "",
            "title": "Shipt Signup",
            "url": "https://staging-signup.shipt.com/"
        },
        "userAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
    },
    "event": "Started Membership",
    "integrations": {},
    "messageId": "ajs-55cb87dd19ac23a5c2ad21e1a7b50c20",
    "originalTimestamp": "2017-12-15T22:03:39.213Z",
    "projectId": "WVl1JK7ysR",
    "properties": {
        "billing_amount": "99.00",
        "metro": "Birmingham",
        "plan_id": "GROCERY_YEARLY",
        "plan_term": "Annual"
    },
    "receivedAt": "2017-12-15T22:03:39.342Z",
    "sentAt": "2017-12-15T22:03:39.214Z",
    "timestamp": "2017-12-15T22:03:39.341Z",
    "type": "track",
    "userId": "854284",
    "version": 2
}

*/

exports.map = (row) =>{

  const eventName = row.event;
  const eventType = row.type;

  if(eventName != segmentEventName || eventType != segmentEventType){
    console.log(`Throwing away event ${eventType} ${eventName}`);
    return null;
  }

  const context = row.context;
  const properties = row.properties;
  const customerId = row.userId;

  const promoCode = properties["promo_code"] || "TEST";
  const orderId = row.messageId;
  const eventDate = row.timestamp;

  const billingAmount = properties["billing_amount"];
  const planId = properties["plan_id"];
  const planTerm = properties["plan_term"];


  //validate

  if(!promoCode){
    console.log("Skipping event - no promo code.");
    return null;
  }

  const mappedValue = {
    OrderId: orderId,
    CustomerId: customerId,
    OrderPromoCode: promoCode,
    ItemCategory1: "self",
    ItemSku1: planId,
    ItemQuantity1: 1,
    ItemSubTotal1: billingAmount,
    EventDate: eventDate
  }

  return mappedValue;
};
