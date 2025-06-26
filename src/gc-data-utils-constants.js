/**
 * Genesys Cloud Data Utilities for Node.js constants.
 * @module gc-data-utils-constants
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

const constants = {};

constants.GC_REGIONS = ["us-east-1", "us-east-2", "us-west-2", "ca-central-1", "eu-west-1", "eu-west-2", "eu-central-1", "eu-central-2", "ap-south-1", "ap-northeast-1", "ap-northeast-2", "ap-northeast-3", "ap-southeast-2", "sa-east-1", "me-central-1"];
constants.AUDIT_LOG_QUERY_MAX_DAYS = 30;
constants.AUDIT_LOG_QUERY_INTERVAL_IN_MS = 6 * 1000;

Object.freeze(constants);

export { constants };
