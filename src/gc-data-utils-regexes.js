/**
 * Genesys Cloud Data Utilities for Node.js regexes.
 * @module gc-data-utils-regexes
 * @license MIT
 * @author Juan F. Abello <juan@jfabello.com>
 */

// Sets strict mode
"use strict";

const regexes = {};

regexes.UUID = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

Object.freeze(regexes);

export { regexes };
