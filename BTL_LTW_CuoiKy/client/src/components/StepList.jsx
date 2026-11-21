const StepList = ({ steps = [] }) => (
  <ol className="space-y-3">
    {steps.map((s) => (
      <li key={s.order} className="flex gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-600 text-white">{s.order}</span>
        <p>{s.content}</p>
      </li>
    ))}
  </ol>
);
export default StepList;
