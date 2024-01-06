/**
 * A mock generic repository class for testing purposes.
 * @template T The entity type that the repository will manage.
 */
export class GenericRepositoryMock<T> {
  items: T[] = [];

  /**
   * Creates a new entity.
   * @param {Partial<T>} itemData Partial data for the entity.
   * @returns {Promise<T>} The newly created entity.
   */
  create(itemData: Partial<T>): T {
    return  Object.assign({} as T, itemData);
  }

  /**
   * Saves an entity.
   * @param {T} item The entity to be saved.
   * @returns {Promise<T>} The saved entity.
   */
  async save(item: T): Promise<T> {
    this.items.push(item);
    return Promise.resolve(item);
  }

  /**
   * Finds a single entity that matches the given conditions.
   * @param {any} conditions Conditions to find the entity.
   * @returns {Promise<T | undefined>} A promise that resolves to the found entity or undefined.
   */
  async findOne(conditions: any): Promise<T | undefined> {
    const item = this.items.find((item) => {
      return Object.entries(conditions.where).every(
        ([key, value]) => item[key] === value,
      );
    });
    return Promise.resolve(item);
  }

  /**
   * Finds all entities that match the given conditions.
   * @param {any} conditions Conditions to find the entities.
   * @returns {Promise<T[] | []>} A promise that resolves to an array of found entities.
   */
  async findBy(conditions: any): Promise<T[] | []> {
    const foundItems = this.items.filter(item => {
      return Object.entries(conditions).every(
        ([key, value]) => item[key] === value,
      );
    });
    return Promise.resolve(foundItems);
  }

  async find(): Promise<T[] | []> {
    return Promise.resolve(this.items);
  }

  /**
   * Removes an entity.
   * @param {T} item The entity to be removed.
   * @returns {Promise<T>} The removed entity.
   */
  async remove(item: T): Promise<T> {
    const itemIndex = this.items.findIndex((storedItem) => {
      return Object.entries(storedItem).every(
        ([key, value]) => item[key] === value,
      );
    });
    if (itemIndex > -1) {
      this.items.splice(itemIndex, 1);
    }
    return Promise.resolve(item);
  }
}
