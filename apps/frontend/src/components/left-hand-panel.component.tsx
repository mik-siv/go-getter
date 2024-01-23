import '../LeftHandPanel.css';
import { Goal } from '../pages/home.tsx';

interface MenuItemProps {
  name: string;
  onClick: () => void;
}

const MenuItem = ({ name, onClick }: MenuItemProps) => (
  <button onClick={onClick}>
    {name}
  </button>
);

interface LeftHandPanelProps {
  items: Goal[];
  onItemClick: (item: Goal) => void;
}

export const LeftHandPanel = ({ items, onItemClick }: LeftHandPanelProps) => {
  return (
    <div id="left-hand-panel" className="peripheral">
      {!items ? <text>Error occurred</text> : items.map((item) => (
        <MenuItem key={item.name} name={item.name} onClick={() => onItemClick(item)} />
      ))}
    </div>
  );
};