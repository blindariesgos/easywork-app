export const CapacitationStageProgress = ({ stage }) => {
  const colorsByStage = {
    1: 'bg-yellow-100',
    2: 'bg-yellow-100',
    3: 'bg-cyan-600',
    4: 'bg-gray-400',
    5: 'bg-red-600',
    6: 'bg-green-primary',
  };

  return Array(6)
    .fill(0)
    .map((_, i) => {
      const key = _ + i;
      const bgColor = colorsByStage[stage];

      return <div key={key} className={`${i + 1 > stage ? 'bg-gray-200' : bgColor} h-4 w-4 inline-block`} style={{ marginLeft: 0.5 }} />;
    });
};
