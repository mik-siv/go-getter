import { useEffect, useState } from 'react';
import { LeftHandPanel } from '../components/left-hand-panel.component.tsx';
import { Goal } from '../interfaces/goal.interfaces';
import { SuitableForLeftHandPanel } from '../interfaces/left-hand-panel.interfaces';

export const HomePage = () => {
  const goalsApiData: Goal[] = [{
    name: 'first goal',
    subgoals: [{ name: '1st subgoal' }, { name: 'second subgoal' }],
  }, {
    name: 'Become a Backend developer',
    subgoals: [{ name: '3rd subgoal' }, { name: '4th subgoal' }],
  }];

  const [activeGoal, setActiveGoal] = useState<Goal>();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => setGoals(goalsApiData), []);

  return (
    <div id="home-page">
      <LeftHandPanel items={goals} onItemClick={(item: SuitableForLeftHandPanel) => {
        if ('subgoals' in item) setActiveGoal(item as Goal);
      }} />
      <div id="active-goal">
        {activeGoal?.subgoals.map((subgoal, index) => (
          <div key={index}>{subgoal.name}</div>
        ))}
      </div>
    </div>
  );
};