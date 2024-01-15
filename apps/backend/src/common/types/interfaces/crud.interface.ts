import { FindOptionsWhere } from 'typeorm';

/**
 * Interface for CRUD operations on a generic type `T`.
 * @interface
 * @template T - The entity type.
 * @template CreateDTO - The data transfer object type for creation.
 * @template UpdateDTO - The data transfer object type for update.
 */
export interface ICrudService<T, CreateDTO, UpdateDTO> {
  /**
   * Creates a new entity.
   * @param {CreateDTO} createDto - The creation data transfer object.
   * @returns {Promise<T>} A promise that resolves to the newly created entity.
   */
  create(createDto: CreateDTO): Promise<T>;

  /**
   * Finds all entities.
   * @returns {Promise<T[]>} A promise that resolves to an array of entities.
   */
  findAll(): Promise<T[]>;

  /**
   * Finds entities by specified attributes.
   * @param {Partial<T>} attrs - The attributes to query by.
   * @returns {Promise<T[]>} A promise that resolves to an array of entities matching the criteria.
   */
  findBy(attrs: FindOptionsWhere<T> | FindOptionsWhere<T>[]): Promise<T[]>;

  /**
   * Finds a single entity by its identifier.
   * @param {string} id - The unique identifier of the entity.
   * @returns {Promise<T>} A promise that resolves to the entity with the specified identifier.
   */
  findById(id: string): Promise<T>;

  /**
   * Updates an existing entity.
   * @param {string} id - The unique identifier of the entity to update.
   * @param {UpdateDTO} updateDto - The data transfer object containing updates.
   * @returns {Promise<T>} A promise that resolves to the updated entity.
   */
  update(id: string, updateDto: UpdateDTO): Promise<T>;

  /**
   * Removes an entity.
   * @param {string} id - The unique identifier of the entity to remove.
   * @returns {Promise<T>} A promise that resolves to the removed entity.
   */
  remove(id: string): Promise<T>;
}
