/**
 * Genesys Cloud Data Utilities for Node.js defaults.
 * @module gc-data-utils-defaults
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

const defaults = {};

defaults.SOCKET_TIMEOUT = 60 * 1000; // 60 seconds
defaults.TIME_BETWEEN_REQUESTS = 200; // 200 miliseconds => 5 requests per second.
defaults.MAX_RETRIES = 5;
defaults.GET_USERS_PAGE_SIZE = 100;
defaults.GET_GROUPS_PAGE_SIZE = 100;
defaults.GET_QUEUES_PAGE_SIZE = 100;
defaults.GET_QUEUE_MEMBERS_PAGE_SIZE = 100;
defaults.DATALAKE_PAGE_SIZE = 2000;
defaults.DATALAKE_DAYS_PER_JOB = 30;
defaults.DATALAKE_EXPONENTIAL_BACKOFF_BASE_TIME_IN_SECONDS = 2;
defaults.DATALAKE_EXPONENTIAL_BACKOFF_MAX_TIME_IN_SECONDS = 60;
defaults.AUDIT_LOGS_PAGE_SIZE = 500;
defaults.AUDIT_LOGS_EXPONENTIAL_BACKOFF_BASE_TIME_IN_SECONDS = 2;
defaults.AUDIT_LOGS_EXPONENTIAL_BACKOFF_MAX_TIME_IN_SECONDS = 60;

Object.freeze(defaults);

export { defaults };
