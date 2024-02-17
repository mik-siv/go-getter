import { SetMetadata } from '@nestjs/common';
import { OwnedResource } from '../../constants/enums/owned-resources.enum';

export const RESOURCES_KEY = 'resources';

/**
 * Set metadata for resources.
 *
 * @param {...OwnedResource[]} resources - An array of owned resources.
 */
export const Resources = (...resources: OwnedResource[]) => SetMetadata(RESOURCES_KEY, resources);
