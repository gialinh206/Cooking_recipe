import MealSlot from './MealSlot.jsx';
import { DAYS, MEALS } from '../utils/helpers';

// lookup: { "0-breakfast": recipe, ... }
const MealPlanGrid = ({ lookup, onPick, onClear }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] border-collapse">
      <thead>
        <tr>
          <th className="p-2" />
          {MEALS.map((m) => <th key={m.key} className="p-2">{m.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {DAYS.map((d, day) => (
          <tr key={d}>
            <th scope="row" className="p-2 text-left">{d}</th>
            {MEALS.map((m) => (
              <td key={m.key} className="p-1 align-top">
                <MealSlot recipe={lookup[`${day}-${m.key}`]} onClick={() => onPick(day, m.key)} onClear={() => onClear(day, m.key)} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
export default MealPlanGrid;
