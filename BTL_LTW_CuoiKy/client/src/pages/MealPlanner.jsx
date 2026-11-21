import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMealPlan, saveMealPlan, setSlot, clearSlot, setWeekStart } from '../store/mealPlanSlice';
import MealPlanGrid from '../components/MealPlanGrid.jsx';
import RecipePickerModal from '../components/RecipePickerModal.jsx';
import Spinner from '../components/Spinner.jsx';
import { addWeeks } from '../utils/helpers';

const MealPlanner = () => {
  const dispatch = useDispatch();
  const { weekStart, slots, status, saved, error } = useSelector((s) => s.mealPlan);
  const [picking, setPicking] = useState(null); // { day, meal }

  useEffect(() => {
    dispatch(fetchMealPlan(weekStart));
  }, [dispatch, weekStart]);

  // useMemo: tạo bảng tra cứu "day-meal" -> recipe để mỗi ô tra O(1)
  const lookup = useMemo(
    () => Object.fromEntries(slots.map((s) => [`${s.day}-${s.meal}`, s.recipe])),
    [slots]
  );

  const handlePick = (recipe) => {
    dispatch(setSlot({ ...picking, recipe }));
    setPicking(null);
  };

  return (
    <>
      <h1 className="mb-3 text-2xl font-bold">Thực đơn tuần</h1>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <button type="button" className="btn-outline" onClick={() => dispatch(setWeekStart(addWeeks(weekStart, -1)))}>← Tuần trước</button>
        <span>Tuần bắt đầu {weekStart}</span>
        <button type="button" className="btn-outline" onClick={() => dispatch(setWeekStart(addWeeks(weekStart, 1)))}>Tuần sau →</button>
        <button type="button" className="btn ml-auto" disabled={saved || status === 'saving'} onClick={() => dispatch(saveMealPlan())}>
          {status === 'saving' ? 'Đang lưu...' : saved ? 'Đã lưu' : 'Lưu thực đơn'}
        </button>
      </div>
      {error && <p className="text-red-600" role="alert">{error}</p>}
      {status === 'loading' ? <Spinner /> : (
        <MealPlanGrid lookup={lookup} onPick={(day, meal) => setPicking({ day, meal })} onClear={(day, meal) => dispatch(clearSlot({ day, meal }))} />
      )}
      {picking && <RecipePickerModal onPick={handlePick} onClose={() => setPicking(null)} />}
    </>
  );
};
export default MealPlanner;
