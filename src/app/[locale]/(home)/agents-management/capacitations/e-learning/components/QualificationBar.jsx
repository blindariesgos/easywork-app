export const Qualification = ({ stage }) => {
  const colorsByStage = {
    0: 'bg-red-600',
    1: 'bg-cyan-600',
    2: 'bg-cyan-600',
    3: 'bg-yellow-100',
    4: 'bg-yellow-100',
    5: 'bg-yellow-100',
    6: 'bg-yellow-100',
    7: 'bg-yellow-100',
    8: 'bg-yellow-100',
    9: 'bg-green-primary',
    10: 'bg-green-primary',
  };

  const bgColor = colorsByStage[stage];

  return Array(6)
    .fill(0)
    .map((_, i) => {
      const key = _ + i;

      return <div key={key} className={`${i + 1 > stage ? 'bg-gray-200' : bgColor} h-4 w-4 inline-block`} style={{ marginLeft: 0.5 }} />;
    });
};
