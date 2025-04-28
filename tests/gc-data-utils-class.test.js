/**
 * Genesys Cloud data utilities for Node.js tests.
 * @module gc-data-utils-class-tests
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

// Module imports
import process from "node:process";
import { beforeAll, describe, test, expect } from "@jest/globals";
import { GCDataUtils } from "../src/gc-data-utils-class.js";

// Constants
const DUMMY_CLIENT_ID = "f6eb9da0-4590-4bb7-82a0-f85afbfa1070";
const DUMMY_CLIENT_SECRET = "pHe8l6Ro4raxeph13etrujufri9ecl5lwr0hlCrO-jQ";
const DUMMY_REGION = "us-east-1";

// Variables
let realClientId = null;
let realClientSecret = null;
let realRegion = null;

beforeAll(() => {
	// Check that the required environment variables are set
	if ("GENESYS_CLOUD_CLIENT_ID" in process.env === false) {
		throw new Error('The "GENESYS_CLOUD_CLIENT_ID" environment variable is not set.');
	}
	if ("GENESYS_CLOUD_CLIENT_SECRET" in process.env === false) {
		throw new Error("The GENESYS_CLOUD_CLIENT_SECRET environment variable is not set.");
	}
	if ("GENESYS_CLOUD_REGION" in process.env === false) {
		throw new Error("The GENESYS_CLOUD_REGION environment variable is not set.");
	}

	realClientId = process.env["GENESYS_CLOUD_CLIENT_ID"];
	realClientSecret = process.env["GENESYS_CLOUD_CLIENT_SECRET"];
	realRegion = process.env["GENESYS_CLOUD_REGION"];
});

describe("Genesys Cloud data utilities for Node.js tests", () => {
	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID error when no arguments are passed", () => {
		expect.assertions(1);
		try {
			// @ts-expect-error
			new GCDataUtils();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID error when a client ID argument that is not a string is passed", () => {
		expect.assertions(3);
		try {
			// @ts-expect-error
			new GCDataUtils(1234);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(false);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils({ gcClientId: DUMMY_CLIENT_ID });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID error when a client ID that is not an UUID is passed", () => {
		expect.assertions(1);
		try {
			// @ts-expect-error
			new GCDataUtils("myClientId");
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_INVALID_UUID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID error when a client secret argument is not passed", () => {
		expect.assertions(1);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID error when a client secret argument that is not a string is passed", () => {
		expect.assertions(3);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, 1234);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, false);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, { gcClientSecret: DUMMY_CLIENT_SECRET });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_SECRET_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID error when a region argument is not passed", () => {
		expect.assertions(1);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID error when a region argument that is not a string is passed", () => {
		expect.assertions(3);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, 1234);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, false);
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, { gcRegion: DUMMY_REGION });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_REGION_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_REGION_INVALID error when an invalid region is passed", () => {
		expect.assertions(1);
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, "not-a-region");
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_REGION_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID when a socket timeout argument that is not an integer is passed", () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: "1234" });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: false });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: { timeout: 1234 } });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: 1234.56 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS error when a socket timeout argument that is not a positive integer is passed", () => {
		expect.assertions(2);
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { socketTimeout: -1234 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_SOCKET_TIMEOUT_OUT_OF_BOUNDS);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID when a time between requests argument that is not an integer is passed", () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: "1234" });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: false });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: { timeout: 1234 } });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: 1234.56 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS error when a time between requests argument that is not a positive integer is passed", () => {
		expect.assertions(2);
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { timeBetweenRequests: -1234 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_TIME_BETWEEN_REQUESTS_OUT_OF_BOUNDS);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID when a max retries argument that is not an integer is passed", () => {
		expect.assertions(4);
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: "1234" });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: false });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: { timeout: 1234 } });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: 1234.56 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_TYPE_INVALID);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS error when a max retries argument that is not a positive integer is passed", () => {
		expect.assertions(2);
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: 0 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS);
		}
		try {
			new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION, { maxRetries: -1234 });
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_MAX_RETRIES_OUT_OF_BOUNDS);
		}
	});

	test("An attempt to create a Genesys Cloud data utilities instance must return a new instance with its state set to CREATED state when valid arguments are passed", () => {
		expect.assertions(2);
		const gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		expect(gcDataUtils).toBeInstanceOf(GCDataUtils);
		expect(gcDataUtils.state).toBe(GCDataUtils.CREATED);
	});

	test("A call to the connect(...) method of a Genesys Cloud data utilities instance must return a Promise object and set the instance state to CONNECTING when the instance is in the CREATED state", async () => {
		expect.assertions(3);
		const gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		expect(gcDataUtils.state).toBe(GCDataUtils.CREATED);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();
		expect(gcDataUtilsConnectPromise).toBeInstanceOf(Promise);
		expect(gcDataUtils.state).toBe(GCDataUtils.CONNECTING);
		try {
			await gcDataUtilsConnectPromise;
		} catch {
			// Do nothing
		}
	});

	test("A second call to the connect(...) method of a Genesys Cloud data utilities instance must return the same Promise object that was returned in the first call", async () => {
		expect.assertions(1);
		const gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();
		expect(gcDataUtils.connect()).toBe(gcDataUtilsConnectPromise);
		try {
			await gcDataUtilsConnectPromise;
		} catch {
			// Do nothing
		}
	});

	test("A call to the connect(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE error when the client is not in a state that allows it to connect to Genesys Cloud", async () => {
		expect.assertions(8);
		let gcDataUtils = null;
		let gcDataUtilsConnectPromise = null;
		let gcDataUtilsClosePromise = null;

		// From the CONNECTED, CLOSING and CLOSED states
		gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		gcDataUtilsConnectPromise = gcDataUtils.connect();
		await gcDataUtilsConnectPromise;
		expect(gcDataUtils.state).toBe(GCDataUtils.CONNECTED);
		try {
			gcDataUtils.connect();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE);
		}
		gcDataUtilsClosePromise = gcDataUtils.close();
		expect(gcDataUtils.state).toBe(GCDataUtils.CLOSING);
		try {
			gcDataUtils.connect();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE);
		}
		await gcDataUtilsClosePromise;
		expect(gcDataUtils.state).toBe(GCDataUtils.CLOSED);
		try {
			gcDataUtils.connect();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE);
		}

		// From the FAILED state
		gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		gcDataUtilsConnectPromise = gcDataUtils.connect();
		try {
			await gcDataUtilsConnectPromise;
		} catch {
			expect(gcDataUtils.state).toBe(GCDataUtils.FAILED);
		}
		try {
			gcDataUtils.connect();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CONNECT_UNAVAILABLE);
		}
	});

	test("A call to the connect(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND error and set the instance state to FAILED when the Genesys Cloud client ID is not an ID for the region", async () => {
		expect.assertions(2);
		const gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();
		try {
			await gcDataUtilsConnectPromise;
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_ID_NOT_FOUND);
			expect(gcDataUtils.state).toBe(GCDataUtils.FAILED);
		}
	});

	test("A call to the connect(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE error and set the instance state to FAILED when the Genesys Cloud client secret is incorrect for a valid client ID for the region", async () => {
		expect.assertions(2);
		const gcDataUtils = new GCDataUtils(realClientId, DUMMY_CLIENT_SECRET, realRegion);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();
		try {
			await gcDataUtilsConnectPromise;
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_AUTHENTICATION_FAILURE);
			expect(gcDataUtils.state).toBe(GCDataUtils.FAILED);
		}
	});

	test("A call to the connect(...) method of a Genesys Cloud data utilities instance must return true and set the instance state to CONNECTED when the Genesys Cloud client ID and secret are valid for the region", async () => {
		expect.assertions(2);
		const gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();

		expect(await gcDataUtilsConnectPromise).toBe(true);

		expect(gcDataUtils.state).toBe(GCDataUtils.CONNECTED);
		const gcDataUtilsClosePromise = gcDataUtils.close();

		await gcDataUtilsClosePromise;
	});

	test("A call to the close(...) method of a Genesys Cloud data utilities instance must return a Promise object and set the instance state to CLOSING when the instance is in the CONNECTED state", async () => {
		expect.assertions(3);
		const gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();

		await gcDataUtilsConnectPromise;

		expect(gcDataUtils.state).toBe(GCDataUtils.CONNECTED);
		const gcDataUtilsClosePromise = gcDataUtils.close();
		expect(gcDataUtilsClosePromise).toBeInstanceOf(Promise);
		expect(gcDataUtils.state).toBe(GCDataUtils.CLOSING);

		await gcDataUtilsClosePromise;
	});

	test("A second call to the close(...) method of a Genesys Cloud data utilities instance must return the same Promise object that was returned in the first call", async () => {
		expect.assertions(1);
		const gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();

		await gcDataUtilsConnectPromise;

		const gcDataUtilsClosePromise = gcDataUtils.close();
		expect(gcDataUtils.close()).toBe(gcDataUtilsClosePromise);

		await gcDataUtilsClosePromise;
	});

	test("A call to the close(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE error when the client is not in a state that allows its closing", async () => {
		expect.assertions(4);
		let gcDataUtils = null;
		let gcDataUtilsConnectPromise = null;

		// From the CREATED and FAILED states
		gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		expect(gcDataUtils.state).toBe(GCDataUtils.CREATED);
		try {
			gcDataUtils.close();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE);
		}
		gcDataUtilsConnectPromise = gcDataUtils.connect();
		try {
			await gcDataUtilsConnectPromise;
		} catch {
			expect(gcDataUtils.state).toBe(GCDataUtils.FAILED);
		}
		try {
			gcDataUtils.close();
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLOSE_UNAVAILABLE);
		}
	});

	test("A call to the close(...) method of a Genesys Cloud data utilities instance must return true and set the instance state to CLOSED when the instance is in the CONNECTED state", async () => {
		expect.assertions(3);
		const gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		const gcDataUtilsConnectPromise = gcDataUtils.connect();

		await gcDataUtilsConnectPromise;

		expect(gcDataUtils.state).toBe(GCDataUtils.CONNECTED);
		const gcDataUtilsClosePromise = gcDataUtils.close();

		expect(await gcDataUtilsClosePromise).toBe(true);

		expect(gcDataUtils.state).toBe(GCDataUtils.CLOSED);
	});
	test("A call to the getAllUsers(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED errors when the instance is not in the CONNECTED state", async () => {
		expect.assertions(1);
		const gcDataUtils = new GCDataUtils(DUMMY_CLIENT_ID, DUMMY_CLIENT_SECRET, DUMMY_REGION);
		try {
			// eslint-disable-next-line no-unused-vars, no-empty
			for await (const dummy of gcDataUtils.getAllUsers()) {
			}
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_CLIENT_NOT_CONNECTED);
		}
	});
	test("A call to the getAllUsers(...) method of a Genesys Cloud data utilities instance must throw an ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID error when the page size argument is not a positive integer", async () => {
		expect.assertions(4);
		const gcDataUtils = new GCDataUtils(realClientId, realClientSecret, realRegion);
		await gcDataUtils.connect();
		try {
			// @ts-expect-error
			// eslint-disable-next-line no-unused-vars, no-empty
			for await (const dummy of gcDataUtils.getAllUsers({ pageSize: "1234" })) {
			}
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			// eslint-disable-next-line no-unused-vars, no-empty
			for await (const dummy of gcDataUtils.getAllUsers({ pageSize: false })) {
			}
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID);
		}
		try {
			// @ts-expect-error
			// eslint-disable-next-line no-unused-vars, no-empty
			for await (const dummy of gcDataUtils.getAllUsers({ pageSize: { timeout: 1234 } })) {
			}
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID);
		}
		try {
			// eslint-disable-next-line no-unused-vars, no-empty
			for await (const dummy of gcDataUtils.getAllUsers({ pageSize: 1234.56 })) {
			}
		} catch (error) {
			expect(error).toBeInstanceOf(GCDataUtils.errors.ERROR_GC_DATA_UTILS_PAGE_SIZE_TYPE_INVALID);
		}
		await gcDataUtils.close();
	});
});
