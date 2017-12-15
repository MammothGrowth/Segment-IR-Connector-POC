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

## Architecture

Entrypoint: `kinesis_segment_integration_handler.js`

This file is client-specific.  This creates all dependncies, pulls any keys/crednetials from environment variables.

Config: `pump_configs/from_kinesis/impact_radius_config.js`

This file defines a series of hooks which perform work at various stages of the worker lifecycle:

* _init_ - perform any dependency initialization for the entire execution (possibly multiple batchecs)
* _startBatch_ - perform any pre-work on the incoming batch of data from source
* _mapSourceBatch_ - perform necessary mappings from the source to the target schema
* _batchToTarget_ - send mapped data to target
* _finishBatch_ - perform any post-batch work
* _failBatch_ - handle bad / invalid batch
* _syncComplete_ - entire sync complete (multiple batches)

Mapper: `impact_radius_converted_trail_mapping.js`

This file performs the necessary mapping between the Segment event and the Impact Radius event

Kinesis Worker: `kinesis_worker.js`

No configuration for this file - this file manages the entire batch and calls necessary hooks from the Config.
