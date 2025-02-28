import { useEffect, useState } from "react";
import { TfiTimer } from "react-icons/tfi";

export const calculateElapsedTime = (timeSpent, initDate, endDate) => {
  const end = endDate ? new Date(endDate) : new Date();
  const init = new Date(initDate);
  const difference = end - init;
  const spent = timeSpent ?? 0;
  console.log({ difference, spent });
  const seconds = (Math.floor((difference + spent) / 1000) % 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.floor((difference + spent) / (1000 * 60)) % 60)
    .toString()
    .padStart(2, "0");
  const hours = (Math.floor((difference + spent) / (1000 * 60 * 60)) % 24)
    .toString()
    .padStart(2, "0");

  return { hours, minutes, seconds };
};

const Timer = ({ date, timeSpent }) => {
  const [timer, setTimer] = useState(calculateElapsedTime(timeSpent, date));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(calculateElapsedTime(timeSpent, date));
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div className="flex gap-1 items-center">
      <TfiTimer className="w-4 h-4 text-easy-400" />
      <p className="text-easy-400 text-sm">{`${timer.hours}:${timer.minutes}:${timer.seconds}`}</p>
    </div>
  );
};

export default Timer;
