/**
 * Represents the props expected by the MenuItem component.
 * @interface MenuItemProps
 */
export interface MenuItemProps {
  name: string;
  onClick: () => void;
}

/**
 * Represents a class suitable for the left hand panel.
 * @interface SuitableForLeftHandPanel
 */
export interface SuitableForLeftHandPanel {
  name: string;
  [key: string]: any;
}

/**
 * Represents the properties for the LeftHandPanel component.
 * @interface LeftHandPanelProps
 */
export interface LeftHandPanelProps {
  items: SuitableForLeftHandPanel[];
  onItemClick: (item: SuitableForLeftHandPanel) => void;
}