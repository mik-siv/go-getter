import { SuitableForLeftHandPanel } from './left-hand-panel.interfaces.ts';

/**
 * Represents a goal object.
 * @interface
 * @extends SuitableForLeftHandPanel
 */
export interface Goal extends SuitableForLeftHandPanel {
  name: string;
  subgoals: { name: string }[];
}