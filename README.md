# Segment-IR-Connector-POC

to setup:

```
npm install
npm install -g lambda-local
```

to run a sample event:

```
lambda-local -l kinesis_segment_integration_handler.js -h handler -t 300 -e "/Users/drew/Source Code/Mammoth Growth/shipt/nodejs/examples/orderCompleted.js" -E '{}'
```

