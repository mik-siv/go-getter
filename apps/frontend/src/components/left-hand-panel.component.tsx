import '../LeftHandPanel.css';
import {
  LeftHandPanelProps,
  MenuItemProps,
} from '../interfaces/left-hand-panel.interfaces.ts';

/**
 * Represents a menu item.
 * @property {string} name - The name of the menu item.
 * @property {function} onClick - The click event handler for the menu item.
 */
const MenuItem = ({ name, onClick }: MenuItemProps) => (
  <button onClick={onClick}>
    {name}
  </button>
);

/**
 * Represents a left hand panel component.
 * @param {Object} props - The props object.
 * @param {Object[]} props.items - The array of items to display.
 * @param {Function} props.onItemClick - The function to handle item click event.
 * @returns {JSX.Element} The left hand panel component JSX.
 */
export const LeftHandPanel = ({ items, onItemClick }: LeftHandPanelProps): JSX.Element => {
  return (
    <div id="left-hand-panel" className="peripheral">
      {!items ? <text>🤷</text> : items.map((item) => (
        <MenuItem key={item.name} name={item.name} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
};