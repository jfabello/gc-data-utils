/**
 * Genesys Cloud data utilities for Node.js errors.
 * @module gc-data-utils-errors
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

/**
 * Thrown when an internal Genesys Cloud data utilities error has occurred.
 * @class ERROR_GC_DATA_UTILS_INTERNAL_ERROR
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_INTERNAL_ERROR extends Error {
	/**
	 * @constructor
	 * @param {string} [extendedMessage] - The extended error message.
	 * @param {Error} [extendedError] - The extended error object.
	 */
	constructor(extendedMessage, extendedError) {
		super("An internal Genesys Cloud data utilities error has occurred.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof extendedMessage === "string") this.extendedMessage = extendedMessage;
		if (typeof extendedError === "object" && extendedError instanceof Error) this.extendedError = extendedError;
	}
}

/**
 * Thrown when the Genesys Cloud OAuth client ID type is not valid.
 * @class ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud OAuth client ID type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud OAuth client ID is not a valid UUID.
 * @class ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud OAuth client ID is not a valid UUID.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud OAuth client secret type is not valid.
 * @class ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud OAuth client secret type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud region type is not valid.
 * @class ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud region type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud region is not valid.
 * @class ERROR_GC_DATA_UTILS_REGION_INVALID
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_REGION_INVALID extends RangeError {
	/**
	 * @constructor
	 * @param {string} gcRegion - The invalid Genesys Cloud region.
	 */
	constructor(gcRegion) {
		super(`The Genesys Cloud region "${gcRegion}" is not valid.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the HTTP client socket timeout type is not valid.
 * @class ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The HTTP client socket timeout type is not valid. It must be an integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the HTTP client socket timeout is out of bounds.
 * @class ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super(`The HTTP client socket timeout is out of bounds. It must be a positive integer.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the time between API requests type is not valid.
 * @class ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The time between API requests type is not valid. It must be an integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the time between API requests is out of bounds.
 * @class ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super(`The time between API requests is out of bounds. It must be a positive integer.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the maximum API request retries type is not valid.
 * @class ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The maximum API request retries type is not valid. It must be an integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the maximum API request retries value is out of bounds.
 * @class ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super(`The maximum API request retries value is out of bounds. It must be a positive integer.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud data utilities client is not in a state that allows its initialization.
 * @class ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE extends Error {
	/**
	 * @constructor
	 */
	constructor() {
		super(`The Genesys Cloud data utilities client is not in a state that allows its initialization.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud OAuth client ID was not found in the platform.
 * @class ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND extends Error {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud OAuth client ID was not found in the platform.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when Genesys Cloud OAuth authentication fails.
 * @class ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE extends Error {
	/**
	 * @constructor
	 */
	constructor() {
		super("OAuth authentication failure. Check the Genesys Cloud OAuth client secret.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud Platform API request returns an unexpected error.
 * @class ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR extends Error {
	/**
	 * @constructor
	 * @param {Error} responseError - The unexpected response error.
	 */
	constructor(responseError) {
		super("The Genesys Cloud Platform API request returned an unexpected error.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		this.responseError = responseError;
	}
}

/**
 * Thrown when the Genesys Cloud Platform API request returns an unexpected HTTP status code.
 * @class ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE extends Error {
	/**
	 * @constructor
	 * @param {number} statusCode - The unexpected HTTP status code.
	 */
	constructor(statusCode) {
		super("The Genesys Cloud Platform API request returned an unexpected HTTP status code.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		this.statusCode = statusCode;
	}
}

/**
 * Thrown when the Genesys Cloud Platform API request returns an incomplete response.
 * @class ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE extends Error {
	/**
	 * @constructor
	 * @param {string} extendedMessage - The extended error message.
	 */
	constructor(extendedMessage) {
		super("The Genesys Cloud Platform API request returned an incomplete response.");
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof extendedMessage === "string") this.extendedMessage = extendedMessage;
	}
}

/**
 * Thrown when the Genesys Cloud data utilities is not in a state that allows its closing.
 * @class ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE extends Error {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud data utilities is not in a state that allows its closing.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the Genesys Cloud data utilities client is not connected.
 * @class ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED extends Error {
	/**
	 * @constructor
	 */
	constructor() {
		super("The Genesys Cloud data utilities client is not connected.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/** Thrown when the type of the page size argument is not valid.
 * @class ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The page size type is not valid. It must be an integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the page size argument is out of bounds.
 * @class ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The page size is out of bounds. It must be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the queue ID type is not valid.
 * @class ERROR_GC_DATA_UTILS_QUEUE_ID_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_QUEUE_ID_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The queue ID type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the queue ID is not a valid UUID.
 * @class ERROR_GC_DATA_UTILS_QUEUE_ID_INVALID_UUID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_QUEUE_ID_INVALID_UUID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The queue ID is not a valid UUID.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the start timestamp type is not valid.
 * @class ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The start timestamp type is not valid. It must be a Date object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the end timestamp type is not valid.
 * @class ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The end timestamp type is not valid. It must be a Date object.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the start timestamp is not earlier than the end timestamp.
 * @class ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The start timestamp must be earlier than the end timestamp.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/** Thrown when the start timestamp is beyond the datalake availability date */
class ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The start timestamp is beyond the datalake availability date.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the days per job argument type is not valid.
 * @class ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The days per job argument type is not valid. It must be an integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the days per job argument is not a positive integer.
 * @class ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS
 * @extends RangeError
 */
class ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS extends RangeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The days per job argument is out of bounds. It must be a positive integer.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the conversations details job has failed.
 * @class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_FAILED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_FAILED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The conversations details job with ID "${jobId}" has failed.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the conversations details job has been cancelled.
 * @class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_CANCELLED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_CANCELLED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The conversations details job with ID "${jobId}" has been cancelled.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the conversations details job has expired.
 * @class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_EXPIRED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_EXPIRED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The conversations details job with ID "${jobId}" has expired.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the users details job has failed.
 * @class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_FAILED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_FAILED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The users details job with ID "${jobId}" has failed.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the users details job has been cancelled.
 * @class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_CANCELLED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_CANCELLED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The users details job with ID "${jobId}" has been cancelled.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the users details job has expired.
 * @class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_EXPIRED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_EXPIRED extends Error {
	/**
	 * @constructor
	 * @param {string} jobId - The job ID.
	 * @param {object} returnedJobStatus - The returned job status.
	 */
	constructor(jobId, returnedJobStatus) {
		super(`The users details job with ID "${jobId}" has expired.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof jobId === "string") this.jobId = jobId;
		if (typeof returnedJobStatus === "object") this.returnedJobStatus = returnedJobStatus;
	}
}

/**
 * Thrown when the service name argument type is not valid.
 * @class ERROR_GC_DATA_UTILS_SERVICE_NAME_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_SERVICE_NAME_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The service name argument type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/**
 * Thrown when the entity type argument type is not valid.
 * @class ERROR_GC_DATA_UTILS_ENTITY_TYPE_TYPE_INVALID
 * @extends TypeError
 */
class ERROR_GC_DATA_UTILS_ENTITY_TYPE_TYPE_INVALID extends TypeError {
	/**
	 * @constructor
	 */
	constructor() {
		super("The entity type argument type is not valid. It must be a string.");
		this.name = Object.getPrototypeOf(this).constructor.name;
	}
}

/** Thrown when an audit log query has failed.
 * @class ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_FAILED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_FAILED extends Error {
	/**
	 * @constructor
	 * @param {string} queryId - The query ID.
	 * @param {object} returnedQueryStatus - The returned query status.
	 */
	constructor(queryId, returnedQueryStatus) {
		super(`The audit log query with ID "${queryId}" has failed.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof queryId === "string") this.queryId = queryId;
		if (typeof returnedQueryStatus === "object") this.returnedQueryStatus = returnedQueryStatus;
	}
}

/**
 * Thrown when an audit log query has been cancelled.
 * @class ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_CANCELLED
 * @extends Error
 */
class ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_CANCELLED extends Error {
	/**
	 * @constructor
	 * @param {string} queryId - The query ID.
	 * @param {object} returnedQueryStatus - The returned query status.
	 */
	constructor(queryId, returnedQueryStatus) {
		super(`The audit log query with ID "${queryId}" has been cancelled.`);
		this.name = Object.getPrototypeOf(this).constructor.name;
		if (typeof queryId === "string") this.queryId = queryId;
		if (typeof returnedQueryStatus === "object") this.returnedQueryStatus = returnedQueryStatus;
	}
}

const errors = {
	ERROR_GC_DATA_UTILS_INTERNAL_ERROR,
	ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID,
	ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_REGION_INVALID,
	ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS,
	ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS,
	ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS,
	ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE,
	ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND,
	ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE,
	ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR,
	ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE,
	ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE,
	ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE,
	ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED,
	ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS,
	ERROR_GC_DATA_UTILS_QUEUE_ID_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_QUEUE_ID_INVALID_UUID,
	ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH,
	ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA,
	ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS,
	ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_FAILED,
	ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_CANCELLED,
	ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_EXPIRED,
	ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_FAILED,
	ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_CANCELLED,
	ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_EXPIRED,
	ERROR_GC_DATA_UTILS_SERVICE_NAME_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_ENTITY_TYPE_TYPE_INVALID,
	ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_FAILED,
	ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_CANCELLED
};

Object.freeze(errors);

export { errors };
