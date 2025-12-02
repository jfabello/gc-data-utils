/**
 * Genesys Cloud Data Utilities for Node.js class.
 * @module jfabello/gc-data-utils-class
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
import { EventEmitter } from "node:events";
import { GCPlatformAPIClient } from "@jfabello/gc-platform-api-client";
import { SimpleTimer } from "@jfabello/simple-timer";

// Constants
import { constants } from "./gc-data-utils-constants.js";

// Defaults
import { defaults } from "./gc-data-utils-defaults.js";

// Errors
import { errors } from "./gc-data-utils-errors.js";

// Regexes
import { regexes } from "./gc-data-utils-regexes.js";

/**
 * Genesys Cloud Data Utilities class.
 * @class GCDataUtils
 */
class GCDataUtils {
	// Private static properties
	static #CREATED = Symbol("CREATED");
	static #CONNECTING = Symbol("CONNECTING");
	static #CONNECTED = Symbol("CONNECTED");
	static #CLOSING = Symbol("CLOSING");
	static #CLOSED = Symbol("CLOSED");
	static #FAILED = Symbol("FAILED");
	static #STATES = [GCDataUtils.#CREATED, GCDataUtils.#CONNECTING, GCDataUtils.#CONNECTED, GCDataUtils.#CLOSING, GCDataUtils.#CLOSED, GCDataUtils.#FAILED];

	// Private instance properties
	/** @type {symbol} */ #clientState = null;
	/** @type {EventEmitter} */ #internalEventEmitter = new EventEmitter();
	/** @type {GCPlatformAPIClient} */ #gcPlatformAPIClient = null;
	/** @type {Promise} */ #connectPromise = null;
	/** @type {Promise} */ #closePromise = null;

	/**
	 * Read-only property representing the CREATED state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get CREATED() {
		return GCDataUtils.#CREATED;
	}

	/**
	 * Read-only property representing the CONNECTING state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get CONNECTING() {
		return GCDataUtils.#CONNECTING;
	}

	/**
	 * Read-only property representing the CONNECTED state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get CONNECTED() {
		return GCDataUtils.#CONNECTED;
	}

	/**
	 * Read-only property representing the CLOSING state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get CLOSING() {
		return GCDataUtils.#CLOSING;
	}

	/**
	 * Read-only property representing the CANCELLED state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get CLOSED() {
		return GCDataUtils.#CLOSED;
	}

	/**
	 * Read-only property representing the FAILED state.
	 * @static
	 * @readonly
	 * @type {symbol}
	 */
	static get FAILED() {
		return GCDataUtils.#FAILED;
	}

	/**
	 * Read-only property that contains the Genesys Cloud Data Utilities error classes as properties.
	 * @static
	 * @readonly
	 * @type {object}
	 */
	static get errors() {
		return errors;
	}

	/**
	 * Read-only property that returns the state of the Genesys Cloud Data Utilities client.
	 * @readonly
	 * @type {symbol}
	 */
	get state() {
		return this.#clientState;
	}

	/**
	 * Read-only property that exposes the on(...) method of the internal event emitter
	 * @readonly
	 * @type {Function}
	 */
	get on() {
		return this.#internalEventEmitter.on.bind(this.#internalEventEmitter);
	}

	/**
	 * Creates a new Genesys Cloud Data Utilities instance.
	 * @constructor
	 * @param {string} gcClientId - The Genesys Cloud OAuth client ID. Must be a valid UUID.
	 * @param {string} gcClientSecret - The Genesys Cloud OAuth client ID secret.
	 * @param {string} gcRegion - The Genesys Cloud region. For example: us-east-1, ca-central-1, ap-south-1, etc.
	 * @param {object} options - The Genesys Cloud Data Utilities options object.
	 * @param {number} [options.socketTimeout=60000] - The HTTP socket timeout in milliseconds.
	 * @param {number} [options.timeBetweenRequests=200] - The time in milliseconds between each call to the Genesys Cloud platform API.
	 * @param {number} [options.maxRetries=5] - The maximum number of retries for retryable Genesys Cloud platform API errors.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID} If the Genesys Cloud OAuth client ID argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID} If the Genesys Cloud OAuth client ID argument is not a valid UUID.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID} If the Genesys Cloud OAuth client secret argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID} If the Genesys Cloud region argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_REGION_INVALID} If the Genesys Cloud region argument is not a valid Genesys Cloud region.
	 * @throws {ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID} If the socket timeout option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS} If the socket timeout option is less than 1 miliseconds.
	 * @throws {ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID} If the time between requests option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS} If the time between requests option is less than 1 miliseconds.
	 * @throws {ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID} If the max retries option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS} If the max retries option is less than 1.
	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If an internal error occurred.
	 */
	constructor(gcClientId, gcClientSecret, gcRegion, { socketTimeout = defaults.SOCKET_TIMEOUT, timeBetweenRequests = defaults.TIME_BETWEEN_REQUESTS, maxRetries = defaults.MAX_RETRIES } = {}) {
		// Check the passed Genesys Cloud client ID argument
		if (typeof gcClientId !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID();
		}

		// Check if the passed Genesys Cloud client ID is a valid UUID
		if (regexes.UUID.test(gcClientId) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID();
		}

		// Check the passed Genesys Cloud client secret argument
		if (typeof gcClientSecret !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID();
		}

		// Check the passed Genesys Cloud region argument
		if (typeof gcRegion !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID();
		}

		if (constants.GC_REGIONS.includes(gcRegion) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_REGION_INVALID(gcRegion);
		}

		// Check the socket timeout option
		if (typeof socketTimeout !== "number" || Number.isInteger(socketTimeout) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID();
		}

		if (socketTimeout < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS();
		}

		/// Check the time between requests option
		if (typeof timeBetweenRequests !== "number" || Number.isInteger(timeBetweenRequests) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID();
		}

		if (timeBetweenRequests < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS();
		}

		// Check the max retries option
		if (typeof maxRetries !== "number" || Number.isInteger(maxRetries) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID();
		}

		if (maxRetries < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS();
		}

		// Create the Genesys Cloud Platform API client instance
		try {
			this.#gcPlatformAPIClient = new GCPlatformAPIClient(gcClientId, gcClientSecret, gcRegion, { socketTimeout, timeBetweenRequests, maxRetries });
		} catch (error) {
			throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(error.message, error);
		}

		// Create the Genesys Cloud Data Utilities event emitter
		this.#internalEventEmitter = new EventEmitter();

		// Set the client state to CREATED
		this.#changeState(GCDataUtils.#CREATED);
	}

	/**
	 * Connects the Genesys Cloud Data Utilities client.
	 * @async
	 * @returns {Promise<boolean>} A promise that fulfills to true if the client connected.
	 * @throws {ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE} If the client is not in a state that allows it to connect to Genesys Cloud.
	 * @throws {ERROR_GC_DATA_UTILS_ID_NOT_FOUND} If the Genesys Cloud OAuth client ID was not found.
	 * @throws {ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE} If the Genesys Cloud OAuth authentication failed.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR} If the Genesys Cloud OAuth access token request returned an unexpected response.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE} If the Genesys Cloud OAuth access token request returned an unexpected HTTP status code.
	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If an internal error occurred while connecting the client.
	 * @throws Errors thrown by the makeRequest() method of the HTTP client class.
	 */
	connect() {
		// Return the Genesys Cloud Data Utilities connect promise object if the client state is already CONNECTING
		if (this.#clientState === GCDataUtils.#CONNECTING) {
			return this.#connectPromise;
		}

		// Throw an error if the client is not in a state that allows its initialization
		if (this.#clientState !== GCDataUtils.#CREATED) {
			throw new errors.ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE();
		}

		// Set the client state to CONNECTING
		this.#changeState(GCDataUtils.#CONNECTING);

		this.#connectPromise = this.#connect();

		return this.#connectPromise;
	}

	/**
	 * Connects the Genesys Cloud Data Utilities client.
	 * @async
	 * @returns {Promise<boolean>} A promise that fulfills to true if the client connected.
	 * @throws {ERROR_GC_DATA_UTILS_ID_NOT_FOUND} If the Genesys Cloud OAuth client ID was not found.
	 * @throws {ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE} If the Genesys Cloud OAuth authentication failed.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR} If the Genesys Cloud OAuth access token request returned an unexpected response.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE} If the Genesys Cloud OAuth access token request returned an unexpected HTTP status code.
	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If an internal error occurred while connecting the client.
	 * @throws Errors thrown by the makeRequest() method of the HTTP client class.
	 */
	async #connect() {
		// Connect the Genesys Cloud Platform API client
		try {
			await this.#gcPlatformAPIClient.connect();
		} catch (error) {
			this.#changeState(GCDataUtils.#FAILED);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_ID_NOT_FOUND) throw new errors.ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND();
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_AUTHENTICATION_FAILURE) throw new errors.ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE();
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_UNEXPECTED_RESPONSE_ERROR) throw new errors.ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR(error.responseError);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_UNEXPECTED_STATUS_CODE) throw new errors.ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE(error.statusCode);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_INTERNAL_ERROR) throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(error.extendedMessage, error.extendedError);
			else throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(error.message, error);
		}

		// Set the client state to CONNECTED
		this.#changeState(GCDataUtils.#CONNECTED);

		// Remove the connect promise
		this.#connectPromise = null;

		return true;
	}

	/**
	 * Closes the Genesys Cloud Data Utilities client connection.
	 * @async
	 * @returns {Promise<boolean>} A promise that fulfills to true if the client is gracefully disconnected.
	 * @throws {ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE} If the client is not in a state that allows its closing.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR} If the Genesys Cloud OAuth access token deletion request returned an unexpected response.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE} If the Genesys Cloud OAuth access token deletion request returned an unexpected HTTP status code.
	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If an internal error occurred while closing the client connection.
	 * @throws Errors thrown by the makeRequest() method of the HTTP client class.
	 */
	close() {
		// Return the Genesys Cloud Data Utilities client close promise object if the client state is already CLOSING or CLOSED
		if (this.#clientState === GCDataUtils.#CLOSING || this.#clientState === GCDataUtils.#CLOSED) {
			return this.#closePromise;
		}

		// Throws an error if the client is not in a state that allows its closing
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE();
		}

		// Set the client state to CLOSING
		this.#changeState(GCDataUtils.#CLOSING);

		this.#closePromise = this.#close();

		return this.#closePromise;
	}

	/**
	 * Closes the Genesys Cloud Data Utilities client connection.
	 * @async
	 * @returns {Promise<boolean>} A promise that fulfills to true if the client is gracefully disconnected.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR} If the Genesys Cloud OAuth access token deletion request returned an unexpected response.
	 * @throws {ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE} If the Genesys Cloud OAuth access token deletion request returned an unexpected HTTP status code.
 	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If an internal error occurred while closing the client.

	 * @throws Errors thrown by the makeRequest() method of the HTTP client class.
	 */
	async #close() {
		// Close the Genesys Cloud Platform API client
		try {
			await this.#gcPlatformAPIClient.close(false); // Sets the clearBacklog argument to false.
		} catch (error) {
			this.#changeState(GCDataUtils.#FAILED);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_UNEXPECTED_RESPONSE_ERROR) throw new errors.ERROR_GC_DATA_UTILS_UNEXPECTED_RESPONSE_ERROR(error.responseError);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_UNEXPECTED_STATUS_CODE) throw new errors.ERROR_GC_DATA_UTILS_UNEXPECTED_STATUS_CODE(error.statusCode);
			if (error instanceof GCPlatformAPIClient.errors.ERROR_GC_PLATFORM_API_CLIENT_INTERNAL_ERROR) throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(error.extendedMessage, error.extendedError);
			else throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(error.message, error);
		}

		// Set the client state to CLOSED
		this.#changeState(GCDataUtils.#CLOSED);

		// Remove all event listeners to avoid memory leaks
		this.#internalEventEmitter.removeAllListeners();

		return true;
	}

	/**
	 * Get all the users, including inactive and deleted users.
	 * @async
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=100] - The number of users to return per page.
	 * @returns {AsyncGenerator<object>} An async generator that yields the users.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getAllUsers({ pageSize = defaults.GET_USERS_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		let currentPage = 0;
		let pageCount = 0;

		do {
			currentPage++;
			const getUsersResult = await this.#gcPlatformAPIClient.UsersAPI.getUsers({ pageNumber: currentPage, pageSize: pageSize, state: "any" });

			if ("body" in getUsersResult === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("entities" in getUsersResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "entities" property.');
			if (Array.isArray(getUsersResult.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
			if ("pageCount" in getUsersResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "pageCount" property.');
			if (typeof getUsersResult.body.pageCount !== "number") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "pageCount" property is not a number.');

			yield getUsersResult.body.entities;
			pageCount = getUsersResult.body.pageCount;
		} while (currentPage < pageCount);
	}

	/**
	 * Get all the groups, including inactive and deleted groups.
	 * @async
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=100] - The number of groups to return per page.
	 * @returns {AsyncGenerator<object>} An async generator that yields the groups.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getAllGroups({ pageSize = defaults.GET_GROUPS_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		let currentPage = 0;
		let pageCount = 0;

		do {
			currentPage++;
			const getGroupsResult = await this.#gcPlatformAPIClient.GroupsAPI.getGroups({ pageNumber: currentPage, pageSize: pageSize });

			if ("body" in getGroupsResult === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("entities" in getGroupsResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "entities" property.');
			if (Array.isArray(getGroupsResult.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
			if ("pageCount" in getGroupsResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "pageCount" property.');
			if (typeof getGroupsResult.body.pageCount !== "number") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "pageCount" property is not a number.');

			yield getGroupsResult.body.entities;
			pageCount = getGroupsResult.body.pageCount;
		} while (currentPage < pageCount);
	}

	/**
	 * Get all the queues.
	 * @async
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=100] - The number of queues to return per page.
	 * @returns {AsyncGenerator<object>} An async generator that yields the queues.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getAllQueues({ pageSize = defaults.GET_QUEUES_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		let currentPage = 0;
		let pageCount = 0;

		do {
			currentPage++;
			const getQueuesResult = await this.#gcPlatformAPIClient.RoutingAPI.getRoutingQueues({ pageNumber: currentPage, pageSize: pageSize });

			if ("body" in getQueuesResult === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("entities" in getQueuesResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "entities" property.');
			if (Array.isArray(getQueuesResult.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
			if ("pageCount" in getQueuesResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "pageCount" property.');
			if (typeof getQueuesResult.body.pageCount !== "number") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "pageCount" property is not a number.');

			yield getQueuesResult.body.entities;
			pageCount = getQueuesResult.body.pageCount;
		} while (currentPage < pageCount);
	}

	/**
	 * Get all the members of a queue.
	 * @async
	 * @param {string} queueId - The ID of the queue.
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=100] - The number of members to return per page.
	 * @returns {AsyncGenerator<object>} An async generator that yields the members of the queue.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_QUEUE_ID_TYPE_INVALID} If the queue ID argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_QUEUE_ID_INVALID_UUID} If the queue ID argument is not a valid UUID.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getQueueMembers(queueId, { pageSize = defaults.GET_QUEUE_MEMBERS_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the queue ID argument
		if (typeof queueId !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_QUEUE_ID_TYPE_INVALID();
		}

		if (regexes.UUID.test(queueId) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_QUEUE_ID_INVALID_UUID();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		let currentPage = 0;
		let nextUri = null;

		do {
			currentPage++;
			const getQueueMembersResult = await this.#gcPlatformAPIClient.RoutingAPI.getRoutingQueueMembers(queueId, { pageNumber: currentPage, pageSize: pageSize });

			if ("body" in getQueueMembersResult === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("entities" in getQueueMembersResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "entities" property.');
			if (Array.isArray(getQueueMembersResult.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
			if ("nextUri" in getQueueMembersResult.body === true && typeof getQueueMembersResult.body.nextUri !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "nextUri" property is not a string.');

			yield getQueueMembersResult.body.entities;
			nextUri = getQueueMembersResult.body.nextUri;
		} while (nextUri !== undefined);
	}

	/**
	 * Get the conversations datalake availability timestamp.
	 * @async
	 * @returns {Promise<Date>} A promise that fulfills to the conversations datalake availability timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async getConversationsDatalakeAvailabilityTimestamp() {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		const getAnalyticsConversationsDetailsJobsAvailability = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsConversationsDetailsJobsAvailability();

		if ("body" in getAnalyticsConversationsDetailsJobsAvailability === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
		if ("dataAvailabilityDate" in getAnalyticsConversationsDetailsJobsAvailability.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "dataAvailabilityDate" property.');
		if (typeof getAnalyticsConversationsDetailsJobsAvailability.body.dataAvailabilityDate !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "dataAvailabilityDate" property is not a string.');

		return new Date(getAnalyticsConversationsDetailsJobsAvailability.body.dataAvailabilityDate);
	}

	/**
	 * Get the users datalake availability timestamp.
	 * @async
	 * @returns {Promise<Date>} A promise that fulfills to the users datalake availability timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 */
	async getUsersDatalakeAvailabilityTimestamp() {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		const getAnalyticsUsersDetailsJobsAvailability = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsUsersDetailsJobsAvailability();

		if ("body" in getAnalyticsUsersDetailsJobsAvailability === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
		if ("dataAvailabilityDate" in getAnalyticsUsersDetailsJobsAvailability.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "dataAvailabilityDate" property.');
		if (typeof getAnalyticsUsersDetailsJobsAvailability.body.dataAvailabilityDate !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "dataAvailabilityDate" property is not a string.');

		return new Date(getAnalyticsUsersDetailsJobsAvailability.body.dataAvailabilityDate);
	}

	/**
	 * Get the oldest queue creation timestamp.
	 * @async
	 * @returns {Promise<Date>} A promise that fulfills to the oldest queue creation timestamp.
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=100] - The number of queues to fetch per page.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async getOldestQueueCreationTimestamp({ pageSize = defaults.GET_QUEUES_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		let currentPage = 0;
		let pageCount = 0;
		let OldestQueueCreationTimestampAsISOString = new Date().toISOString();

		do {
			currentPage++;
			const getQueuesResult = await this.#gcPlatformAPIClient.RoutingAPI.getRoutingQueues({ pageNumber: currentPage, pageSize: pageSize });

			if ("body" in getQueuesResult === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("entities" in getQueuesResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "entities" property.');
			if (Array.isArray(getQueuesResult.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
			if ("pageCount" in getQueuesResult.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "pageCount" property.');
			if (typeof getQueuesResult.body.pageCount !== "number") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "pageCount" property is not a number.');

			for (const queue of getQueuesResult.body.entities) {
				if ("dateCreated" in queue === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "queue" property is missing the "dateCreated" property.');
				if (typeof queue.dateCreated !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "queue" property "dateCreated" property is not a string.');
				if (queue.dateCreated < OldestQueueCreationTimestampAsISOString) OldestQueueCreationTimestampAsISOString = queue.dateCreated;
			}
			pageCount = getQueuesResult.body.pageCount;
		} while (currentPage < pageCount);

		return new Date(OldestQueueCreationTimestampAsISOString);
	}

	/**
	 * Get conversations details from the datalake. This method automatically adjusts the end of the interval to the datalake availability timestamp.
	 * @async
	 * @param {Date} startTimestamp - The start of the interval to fetch.
	 * @param {Date} endTimestamp - The end of the interval to fetch.
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=2000] - The number of conversations details to fetch per page.
	 * @param {number} [options.daysPerJob=30] - The number of days to fetch per job.
	 * @returns {AsyncGenerator<object>} An async generator that yields the conversations.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID} If the start timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID} If the end timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH} If the start timestamp is not earlier than the end timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID} If the days per job option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS} If the days per job option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA} If the start timestamp is later than the conversations details datalake availability timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getConversationsDetailsFromDatalake(startTimestamp, endTimestamp, { pageSize = defaults.DATALAKE_PAGE_SIZE, daysPerJob = defaults.DATALAKE_DAYS_PER_JOB } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the start timestamp argument
		if (typeof startTimestamp !== "object" || startTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID();
		}

		// Check the end timestamp argument
		if (typeof endTimestamp !== "object" || endTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID();
		}

		// Check that the start timestamp is earlier than the end timestamp
		if (startTimestamp.getTime() >= endTimestamp.getTime()) {
			throw new errors.ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		// Check the days per job option
		if (typeof daysPerJob !== "number" || Number.isInteger(daysPerJob) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID();
		}

		if (daysPerJob < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS();
		}

		// Get the conversations details datalake availability timestamp
		const conversationsDatalakeAvailabilityTimestamp = await this.getConversationsDatalakeAvailabilityTimestamp();

		// Check that the start timestamp is earlier than the conversations details datalake availability timestamp
		if (startTimestamp.getTime() >= conversationsDatalakeAvailabilityTimestamp.getTime()) {
			throw new errors.ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA();
		}

		// Adjust the end timestamp to the conversations details datalake availability timestamp if needed
		if (endTimestamp.getTime() > conversationsDatalakeAvailabilityTimestamp.getTime()) endTimestamp = new Date(conversationsDatalakeAvailabilityTimestamp);

		const startTimestampInMs = startTimestamp.getTime();
		const endTimestampInMs = endTimestamp.getTime();
		const daysPerJobInMs = daysPerJob * 24 * 60 * 60 * 1000;

		// Run the conversations details jobs in intervals of daysPerJob
		for (let currentStartTimestampInMs = startTimestampInMs, currentEndTimestampInMs = Math.min(startTimestampInMs + daysPerJobInMs, endTimestampInMs); currentStartTimestampInMs < endTimestampInMs; currentStartTimestampInMs = currentEndTimestampInMs, currentEndTimestampInMs = Math.min(currentStartTimestampInMs + daysPerJobInMs, endTimestampInMs)) {
			// Create the job
			const createConversationsDetailsJobResults = await this.#gcPlatformAPIClient.AnalyticsAPI.postAnalyticsConversationsDetailsJobs({ interval: `${new Date(currentStartTimestampInMs).toISOString()}/${new Date(currentEndTimestampInMs).toISOString()}` });

			if ("body" in createConversationsDetailsJobResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("jobId" in createConversationsDetailsJobResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "jobId" property.');
			if (typeof createConversationsDetailsJobResults.body.jobId !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "jobId" property is not a string.');

			const conversationsDetailsJobId = createConversationsDetailsJobResults.body.jobId;

			// Enclosed in a try/finally block to ensure the job is deleted even if the job fails
			try {
				let conversationDetailsJobState = null;
				let exponentialBackoffTimeInSeconds = 1;

				// Wait for the job to be fulfilled
				do {
					// Apply exponential backoff logic
					exponentialBackoffTimeInSeconds = Math.min(exponentialBackoffTimeInSeconds * defaults.DATALAKE_EXPONENTIAL_BACKOFF_BASE_TIME_IN_SECONDS, defaults.DATALAKE_EXPONENTIAL_BACKOFF_MAX_TIME_IN_SECONDS);
					await new SimpleTimer(exponentialBackoffTimeInSeconds * 1000).start();

					// Get the job status
					const conversationsDetailsJobStatusResults = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsConversationsDetailsJob(conversationsDetailsJobId);

					if ("body" in conversationsDetailsJobStatusResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
					if ("state" in conversationsDetailsJobStatusResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "state" property.');
					if (typeof conversationsDetailsJobStatusResults.body.state !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "state" property is not a string.');

					conversationDetailsJobState = conversationsDetailsJobStatusResults.body.state;

					if (conversationDetailsJobState === "FULFILLED") break;
					if (conversationDetailsJobState === "QUEUED" || conversationDetailsJobState === "PENDING") continue;
					if (conversationDetailsJobState === "FAILED") throw new errors.ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_FAILED(conversationsDetailsJobId, conversationsDetailsJobStatusResults.body);
					if (conversationDetailsJobState === "CANCELLED") throw new errors.ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_CANCELLED(conversationsDetailsJobId, conversationsDetailsJobStatusResults.body);
					if (conversationDetailsJobState === "EXPIRED") throw new errors.ERROR_GC_DATA_UTILS_CONVERSATIONS_DETAILS_JOB_EXPIRED(conversationsDetailsJobId, conversationsDetailsJobStatusResults.body);
					else throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(`The conversations details job ${conversationsDetailsJobId} returned an unexpected status: ${conversationDetailsJobState}.`, conversationsDetailsJobStatusResults.body);
				} while (conversationDetailsJobState !== "FULFILLED");

				let conversationsDetailsJobResultsCursor = null;

				// Get the job results
				do {
					// Get a page from the job results
					const getConversationsDetailsJobOptions = { pageSize: pageSize };
					if (typeof conversationsDetailsJobResultsCursor === "string") getConversationsDetailsJobOptions.cursor = conversationsDetailsJobResultsCursor;
					const getConversationsDetailsJobResults = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsConversationsDetailsJobResults(conversationsDetailsJobId, getConversationsDetailsJobOptions);

					if ("body" in getConversationsDetailsJobResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
					if ("conversations" in getConversationsDetailsJobResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "conversations" property.');
					if (Array.isArray(getConversationsDetailsJobResults.body.conversations) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "conversations" property is not an array.');
					if ("cursor" in getConversationsDetailsJobResults.body === true && typeof getConversationsDetailsJobResults.body.cursor !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "cursor" property is not a string.');

					yield getConversationsDetailsJobResults.body.conversations;
					conversationsDetailsJobResultsCursor = getConversationsDetailsJobResults.body.cursor;
				} while (conversationsDetailsJobResultsCursor !== undefined);
			} finally {
				try {
					await this.#gcPlatformAPIClient.AnalyticsAPI.deleteAnalyticsConversationsDetailsJob(conversationsDetailsJobId);
				} catch {
					// Do nothing, this is a best effort delete
				}
			}
		}
	}

	/**
	 * Get users details from the datalake. This method automatically adjusts the end of the interval to the datalake availability timestamp.
	 * @async
	 * @param {Date} startTimestamp - The start of the interval to fetch.
	 * @param {Date} endTimestamp - The end of the interval to fetch.
	 * @param {object} options - The options object.
	 * @param {number} [options.pageSize=2000] - The number of users details to fetch per page.
	 * @param {number} [options.daysPerJob=30] - The number of days to fetch per job.
	 * @returns {AsyncGenerator<object>} An async generator that yields the users.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID} If the start timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID} If the end timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH} If the start timestamp is not earlier than the end timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID} If the days per job option is not an integer.
	 * @throws {ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS} If the days per job option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA} If the start timestamp is later than the users details datalake availability timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getUsersDetailsFromDatalake(startTimestamp, endTimestamp, { pageSize = defaults.DATALAKE_PAGE_SIZE, daysPerJob = defaults.DATALAKE_DAYS_PER_JOB } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the start timestamp argument
		if (typeof startTimestamp !== "object" || startTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID();
		}

		// Check the end timestamp argument
		if (typeof endTimestamp !== "object" || endTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID();
		}

		// Check that the start timestamp is earlier than the end timestamp
		if (startTimestamp.getTime() >= endTimestamp.getTime()) {
			throw new errors.ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		// Check the days per job option
		if (typeof daysPerJob !== "number" || Number.isInteger(daysPerJob) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_DAYS_PER_JOB_TYPE_INVALID();
		}

		if (daysPerJob < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_DAYS_PER_JOB_OUT_OF_BOUNDS();
		}

		// Get the users details datalake availability timestamp
		const usersDatalakeAvailabilityTimestamp = await this.getUsersDatalakeAvailabilityTimestamp();

		// Check that the start timestamp is earlier than the users details datalake availability timestamp
		if (startTimestamp.getTime() >= usersDatalakeAvailabilityTimestamp.getTime()) {
			throw new errors.ERROR_GC_DATA_UTILS_START_TIMESTAMP_NO_DATA();
		}

		// Adjust the end timestamp to the users details datalake availability timestamp if needed
		if (endTimestamp.getTime() > usersDatalakeAvailabilityTimestamp.getTime()) endTimestamp = new Date(usersDatalakeAvailabilityTimestamp);

		const startTimestampInMs = startTimestamp.getTime();
		const endTimestampInMs = endTimestamp.getTime();
		const daysPerJobInMs = daysPerJob * 24 * 60 * 60 * 1000;

		// Run the users details jobs in intervals of daysPerJob
		for (let currentStartTimestampInMs = startTimestampInMs, currentEndTimestampInMs = Math.min(startTimestampInMs + daysPerJobInMs, endTimestampInMs); currentStartTimestampInMs < endTimestampInMs; currentStartTimestampInMs = currentEndTimestampInMs, currentEndTimestampInMs = Math.min(currentStartTimestampInMs + daysPerJobInMs, endTimestampInMs)) {
			// Create the job
			const createUersDetailsJobResults = await this.#gcPlatformAPIClient.AnalyticsAPI.postAnalyticsUsersDetailsJobs({ interval: `${new Date(currentStartTimestampInMs).toISOString()}/${new Date(currentEndTimestampInMs).toISOString()}` });

			if ("body" in createUersDetailsJobResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("jobId" in createUersDetailsJobResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "jobId" property.');
			if (typeof createUersDetailsJobResults.body.jobId !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "jobId" property is not a string.');

			const usersDetailsJobId = createUersDetailsJobResults.body.jobId;

			// Enclosed in a try/finally block to ensure the job is deleted even if the job fails
			try {
				let usersDetailsJobState = null;
				let exponentialBackoffTimeInSeconds = 1;

				// Wait for the job to be fulfilled
				do {
					// Apply exponential backoff logic
					exponentialBackoffTimeInSeconds = Math.min(exponentialBackoffTimeInSeconds * defaults.DATALAKE_EXPONENTIAL_BACKOFF_BASE_TIME_IN_SECONDS, defaults.DATALAKE_EXPONENTIAL_BACKOFF_MAX_TIME_IN_SECONDS);
					await new SimpleTimer(exponentialBackoffTimeInSeconds * 1000).start();

					// Get the job status
					const usersDetailsJobStatusResults = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsUsersDetailsJob(usersDetailsJobId);

					if ("body" in usersDetailsJobStatusResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
					if ("state" in usersDetailsJobStatusResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "state" property.');
					if (typeof usersDetailsJobStatusResults.body.state !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "state" property is not a string.');

					usersDetailsJobState = usersDetailsJobStatusResults.body.state;

					if (usersDetailsJobState === "FULFILLED") break;
					if (usersDetailsJobState === "QUEUED" || usersDetailsJobState === "PENDING") continue;
					if (usersDetailsJobState === "FAILED") throw new errors.ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_FAILED(usersDetailsJobId, usersDetailsJobStatusResults.body);
					if (usersDetailsJobState === "CANCELLED") throw new errors.ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_CANCELLED(usersDetailsJobId, usersDetailsJobStatusResults.body);
					if (usersDetailsJobState === "EXPIRED") throw new errors.ERROR_GC_DATA_UTILS_USERS_DETAILS_JOB_EXPIRED(usersDetailsJobId, usersDetailsJobStatusResults.body);
					else throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(`The users details job ${usersDetailsJobId} returned an unexpected status: ${usersDetailsJobState}.`, usersDetailsJobStatusResults.body);
				} while (usersDetailsJobState !== "FULFILLED");

				let usersDetailsJobResultsCursor = null;

				// Get the job results
				do {
					// Get a page from the job results
					const getUsersDetailsJobOptions = { pageSize: pageSize };
					if (typeof usersDetailsJobResultsCursor === "string") getUsersDetailsJobOptions.cursor = usersDetailsJobResultsCursor;
					const getUsersDetailsJobResults = await this.#gcPlatformAPIClient.AnalyticsAPI.getAnalyticsUsersDetailsJobResults(usersDetailsJobId, getUsersDetailsJobOptions);

					if ("body" in getUsersDetailsJobResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
					if ("userDetails" in getUsersDetailsJobResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "userDetails" property.');
					if (Array.isArray(getUsersDetailsJobResults.body.userDetails) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "userDetails" property is not an array.');
					if ("cursor" in getUsersDetailsJobResults.body === true && typeof getUsersDetailsJobResults.body.cursor !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "cursor" property is not a string.');

					yield getUsersDetailsJobResults.body.userDetails;
					usersDetailsJobResultsCursor = getUsersDetailsJobResults.body.cursor;
				} while (usersDetailsJobResultsCursor !== undefined);
			} finally {
				try {
					await this.#gcPlatformAPIClient.AnalyticsAPI.deleteAnalyticsUsersDetailsJob(usersDetailsJobId);
				} catch {
					// Do nothing, this is a best effort delete
				}
			}
		}
	}

	/**
	 * Get events from the audit log.
	 * @async
	 * @param {Date} startTimestamp - The start of the interval to fetch.
	 * @param {Date} endTimestamp - The end of the interval to fetch.
	 * @param {string} serviceName - The name of the service to fetch events from.
	 * @param {object} options - The options object.
	 * @param {string} [options.entityType] - The type of entity to fetch events for. If not provided, all entity types for the service will be fetched.
	 * @param {number} [options.pageSize=500] - The number of audit log events to fetch per page.
	 * @returns {AsyncGenerator<object>} An async generator that yields the queue events.
	 * @throws {ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED} If the Genesys Cloud Data Utilities client is not connected.
	 * @throws {ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID} If the start timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID} If the end timestamp argument is not a Date object.
	 * @throws {ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH} If the start timestamp is not earlier than the end timestamp.
	 * @throws {ERROR_GC_DATA_UTILS_SERVICE_NAME_TYPE_INVALID} If the service name argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_ENTITY_TYPE_TYPE_INVALID} If the entity type argument is not a string.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID} If the page size option is not a number.
	 * @throws {ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS} If the page size option is not a positive integer.
	 * @throws {ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE} If the response is missing a required property or there is a property type mismatch.
	 */
	async *getEventsFromAuditLog(startTimestamp, endTimestamp, serviceName, { entityType = undefined, pageSize = defaults.AUDIT_LOGS_PAGE_SIZE } = {}) {
		// Check the client state
		if (this.#clientState !== GCDataUtils.#CONNECTED) {
			throw new errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED();
		}

		// Check the start timestamp argument
		if (typeof startTimestamp !== "object" || startTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_START_TIMESTAMP_TYPE_INVALID();
		}

		// Check the end timestamp argument
		if (typeof endTimestamp !== "object" || endTimestamp instanceof Date === false) {
			throw new errors.ERROR_GC_DATA_UTILS_END_TIMESTAMP_TYPE_INVALID();
		}

		// Check that the start timestamp is earlier than the end timestamp
		if (startTimestamp.getTime() >= endTimestamp.getTime()) {
			throw new errors.ERROR_GC_DATA_UTILS_INTERVAL_MISMATCH();
		}

		// Check the service name argument
		if (typeof serviceName !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_SERVICE_NAME_TYPE_INVALID();
		}

		// Check the entity type argument
		if (entityType !== undefined && typeof entityType !== "string") {
			throw new errors.ERROR_GC_DATA_UTILS_ENTITY_TYPE_TYPE_INVALID();
		}

		// Check the page size option
		if (typeof pageSize !== "number" || Number.isInteger(pageSize) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID();
		}

		if (pageSize < 1) {
			throw new errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_OUT_OF_BOUNDS();
		}

		const startTimestampInMs = startTimestamp.getTime();
		const endTimestampInMs = endTimestamp.getTime();
		const daysPerQueryInMs = constants.AUDIT_LOG_QUERY_MAX_DAYS * 24 * 60 * 60 * 1000;
		let lastQueryTimestamp = null;

		for (let currentStartTimestampInMs = startTimestampInMs, currentEndTimestampInMs = Math.min(startTimestampInMs + daysPerQueryInMs, endTimestampInMs); currentStartTimestampInMs < endTimestampInMs; currentStartTimestampInMs = currentEndTimestampInMs, currentEndTimestampInMs = Math.min(currentStartTimestampInMs + daysPerQueryInMs, endTimestampInMs)) {
			const nextQueryWaitTime = lastQueryTimestamp === null ? 0 : lastQueryTimestamp.getTime() + constants.AUDIT_LOG_QUERY_INTERVAL_IN_MS - Date.now();
			if (nextQueryWaitTime > 0) await new SimpleTimer(nextQueryWaitTime).start();

			const createAuditLogQueryBody = {
				interval: `${new Date(currentStartTimestampInMs).toISOString()}/${new Date(currentEndTimestampInMs).toISOString()}`,
				serviceName: serviceName
			};

			if (typeof entityType === "string") createAuditLogQueryBody.filters = [{ property: "entityType", value: entityType }];

			const createAuditLogQueryResults = await this.#gcPlatformAPIClient.AuditAPI.postAuditsQuery(createAuditLogQueryBody);

			if ("body" in createAuditLogQueryResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
			if ("id" in createAuditLogQueryResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "id" property.');
			if (typeof createAuditLogQueryResults.body.id !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "id" property is not a string.');
			if ("state" in createAuditLogQueryResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "state" property.');
			if (typeof createAuditLogQueryResults.body.state !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "state" property is not a string.');
			if ("startDate" in createAuditLogQueryResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "startDate" property.');
			if (typeof createAuditLogQueryResults.body.startDate !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "startDate" property is not a string.');

			lastQueryTimestamp = new Date(createAuditLogQueryResults.body.startDate);

			const auditLogQueryId = createAuditLogQueryResults.body.id;
			let auditLogQueryState = createAuditLogQueryResults.body.state;
			let exponentialBackoffTimeInSeconds = 1;

			while (auditLogQueryState !== "Succeeded") {
				// Apply exponential backoff logic
				exponentialBackoffTimeInSeconds = Math.min(exponentialBackoffTimeInSeconds * defaults.AUDIT_LOGS_EXPONENTIAL_BACKOFF_BASE_TIME_IN_SECONDS, defaults.AUDIT_LOGS_EXPONENTIAL_BACKOFF_MAX_TIME_IN_SECONDS);
				await new SimpleTimer(exponentialBackoffTimeInSeconds * 1000).start();

				// Get the query status
				const auditLogQueryStatusResults = await this.#gcPlatformAPIClient.AuditAPI.getAuditsQueryTransactionId(auditLogQueryId);

				if ("body" in auditLogQueryStatusResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
				if ("state" in auditLogQueryStatusResults.body === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body is missing the "state" property.');
				if (typeof auditLogQueryStatusResults.body.state !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "state" property is not a string.');

				auditLogQueryState = auditLogQueryStatusResults.body.state;

				if (auditLogQueryState === "Succeeded") break;
				if (auditLogQueryState === "Queued" || auditLogQueryState === "Running") continue;
				if (auditLogQueryState === "Failed") throw new errors.ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_FAILED(auditLogQueryId, auditLogQueryStatusResults.body);
				if (auditLogQueryState === "Cancelled") throw new errors.ERROR_GC_DATA_UTILS_AUDIT_LOG_QUERY_CANCELLED(auditLogQueryId, auditLogQueryStatusResults.body);
				else throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(`The audit log query ${auditLogQueryId} returned an unexpected status: ${auditLogQueryState}.`, auditLogQueryStatusResults.body);
			}

			let auditLogQueryResultsCursor = null;

			// Get the query results
			do {
				// Get a page from the query results
				const getAuditLogQueryResultsOptions = { pageSize: pageSize, allowRedirect: false };
				if (typeof auditLogQueryResultsCursor === "string") getAuditLogQueryResultsOptions.cursor = auditLogQueryResultsCursor;
				const getAuditLogQueryResults = await this.#gcPlatformAPIClient.AuditAPI.getAuditsQueryTransactionIdResults(createAuditLogQueryResults.body.id, getAuditLogQueryResultsOptions);

				if ("body" in getAuditLogQueryResults === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response is missing the "body" property.');
				if ("entities" in getAuditLogQueryResults.body === true && Array.isArray(getAuditLogQueryResults.body.entities) === false) throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "entities" property is not an array.');
				if ("cursor" in getAuditLogQueryResults.body === true && typeof getAuditLogQueryResults.body.cursor !== "string") throw new errors.ERROR_GC_DATA_UTILS_INCOMPLETE_RESPONSE('The response body "cursor" property is not a string.');

				if ("entities" in getAuditLogQueryResults.body === false) getAuditLogQueryResults.body.entities = [];

				yield getAuditLogQueryResults.body.entities;

				auditLogQueryResultsCursor = getAuditLogQueryResults.body.cursor;
			} while (auditLogQueryResultsCursor !== undefined);
		}
	}

	/**
	 * Changes the internal state of the Genesys Cloud Data Utilities instance.
	 * @param {symbol} newState - The new state of the Genesys Cloud Data Utilities instance.
	 * @throws {ERROR_GC_DATA_UTILS_INTERNAL_ERROR} If the new state parameter is not a valid Genesys Cloud Data Utilities state.
	 */
	#changeState(newState) {
		if (GCDataUtils.#STATES.includes(newState) === false) {
			throw new errors.ERROR_GC_DATA_UTILS_INTERNAL_ERROR(`The state ${newState.description} is not a valid Genesys Cloud Data Utilities state.`);
		}

		const previousState = this.#clientState;

		this.#clientState = newState;

		this.#emit("state-change", { previousState: previousState === null ? null : previousState.description, newState: this.#clientState.description });
	}

	/**
	 * Emits an event using the internal event emitter.
	 * @param {string} eventName - The name of the event to emit.
	 * @param {object} eventData - The data to pass to the event listener. An "eventDate" property is added to the event data object with the current date and time.
	 * @returns {boolean} True if the event was emitted successfully. False if the event emitter is not instantiated or the passed arguments are not valid.
	 */
	#emit(eventName, eventData) {
		if (this.#internalEventEmitter === null) return false;
		if (typeof eventName !== "string") return false;
		if (typeof eventData !== "object") return false;

		this.#internalEventEmitter.emit(eventName, Object.assign({ eventDate: new Date() }, eventData));

		return true;
	}
}

export { GCDataUtils };
