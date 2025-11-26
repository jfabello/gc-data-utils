declare class GCDataUtils {
	// Static properties
	static readonly CREATED: symbol;
	static readonly CONNECTING: symbol;
	static readonly CONNECTED: symbol;
	static readonly CLOSING: symbol;
	static readonly CLOSED: symbol;
	static readonly FAILED: symbol;
	static readonly errors: object;

	// Instance properties
	readonly state: symbol;
	readonly on: (eventName: string | symbol, listener: (...args: any[]) => void) => this;

	// Constructor
	constructor(
		gcClientId: string,
		gcClientSecret: string,
		gcRegion: string,
		options?: {
			socketTimeout?: number;
			timeBetweenRequests?: number;
			maxRetries?: number;
		}
	);

	// Methods
	connect(): Promise<boolean>;
	close(): Promise<boolean>;
	getAllUsers(options?: { pageSize?: number }): AsyncGenerator<object, void, unknown>;
	getAllQueues(options?: { pageSize?: number }): AsyncGenerator<object, void, unknown>;
	getQueueMembers(queueId: string, options?: { pageSize?: number }): AsyncGenerator<object, void, unknown>;
	getConversationsDatalakeAvailabilityTimestamp(): Promise<Date>;
	getUsersDatalakeAvailabilityTimestamp(): Promise<Date>;
	getOldestQueueCreationTimestamp(options?: { pageSize?: number }): Promise<Date>;
	getConversationsDetailsFromDatalake(
		startTimestamp: Date,
		endTimestamp: Date,
		options?: {
			pageSize?: number;
			daysPerJob?: number;
		}
	): AsyncGenerator<object, void, unknown>;
	getUsersDetailsFromDatalake(
		startTimestamp: Date,
		endTimestamp: Date,
		options?: {
			pageSize?: number;
			daysPerJob?: number;
		}
	): AsyncGenerator<object, void, unknown>;
	getEventsFromAuditLog(
		startTimestamp: Date,
		endTimestamp: Date,
		serviceName: string,
		options?: {
			entityType?: string;
			pageSize?: number;
		}
	): AsyncGenerator<object, void, unknown>;
}

export default GCDataUtils;
