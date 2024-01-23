import { useEffect, useState } from 'react';
import { LeftHandPanel } from '../components/left-hand-panel.component.tsx';

export interface Goal {
  name: string;
  subgoals: { name: string }[];
}

export const Home = () => {
  const goalsApiData: Goal[] = [{
    name: 'first goal',
    subgoals: [{ name: '1st subgoal' }, { name: 'second subgoal' }],
  }, {
    name: 'Become a Backend developer',
    subgoals: [{ name: '3rd subgoal' }, { name: '4th subgoal' }],
  }];

  const [activeGoal, setActiveGoal] = useState<Goal>();
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => setGoals(goalsApiData), [goalsApiData]);

  return (
    <div id="home-page">
      <LeftHandPanel items={goals} onItemClick={setActiveGoal} />
      <div id="active-goal">
        {activeGoal?.subgoals.map((subgoal, index) => (
          <div key={index}>{subgoal.name}</div>
        ))}
      </div>
    </div>
  );
};