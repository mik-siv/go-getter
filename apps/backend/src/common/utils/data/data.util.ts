import { EntityWithId } from '../../types/general.types';

export class DataUtils {
  /**
   * Extracts the IDs from an array of entities with IDs.
   * @param {Promise<EntityWithId[]>} relations - The promise representing the array of entities with IDs.
   * @returns {Promise<string[]>} - The promise representing the array of extracted IDs.
   * @private
   */
  public static async extractRelationIds(relations: Promise<EntityWithId[]>): Promise<string[]> {
    return (await relations).map((relation) => relation.id);
  }
}
