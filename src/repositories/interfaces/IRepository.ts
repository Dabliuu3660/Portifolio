// Base Repository Interface
// This defines the contract that all repositories must follow

export interface IRepository<T, TCreate = Partial<T>> {
    /**
     * Get all items
     */
    getAll(): Promise<T[]>;

    /**
     * Get a single item by ID
     * @param id - The unique identifier
     * @returns The item or null if not found
     */
    getById(id: string): Promise<T | null>;

    /**
     * Create a new item
     * @param data - The data to create the item
     * @returns The created item
     */
    create(data: TCreate): Promise<T>;

    /**
     * Update an existing item
     * @param id - The unique identifier
     * @param data - The partial data to update
     * @returns The updated item or null if not found
     */
    update(id: string, data: Partial<TCreate>): Promise<T | null>;

    /**
     * Delete an item
     * @param id - The unique identifier
     * @returns True if deleted, false if not found
     */
    delete(id: string): Promise<boolean>;
}

/**
 * Storage adapter interface
 * Allows switching between different storage mechanisms (IndexedDB, Supabase, etc.)
 */
export interface IStorageAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T): Promise<void>;
    remove(key: string): Promise<void>;
    clear(): Promise<void>;
}
