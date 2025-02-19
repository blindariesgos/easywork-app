import { useState } from 'react';
import { EvaluationBodyToTake } from './EvaluationBodyToTake';

const calculateElapsedTime = (startedAt, finishedAt) => {
<<<<<<< HEAD
  startedAt = new Date(startedAt);
  finishedAt = new Date(finishedAt);

=======
>>>>>>> 62af94af555fc1fc2462e0f44b002525786eebbd
  const result = {
    milliseconds: 0,
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  };

  if (!startedAt || !finishedAt) return result;

<<<<<<< HEAD
  const differenceInMilliseconds = finishedAt.getTime() - startedAt.getTime();
  result.milliseconds = differenceInMilliseconds / 1000;
  result.seconds = Math.ceil(result.milliseconds / 60);
  result.minutes = Math.ceil(result.seconds / 60);
  result.hours = Math.ceil(result.minutes / 24);
=======
  const differenceInMilliseconds = startedAt.getTime() - finishedAt.getTime();
  result.milliseconds = differenceInMilliseconds / 1000;
  result.seconds = result.milliseconds / 60;
  result.minutes = result.seconds / 60;
  result.hours = result.minutes / 24;
>>>>>>> 62af94af555fc1fc2462e0f44b002525786eebbd

  return result;
};

export const EvaluationFinalized = ({ evaluation, evaluationAttempt }) => {
  const [showDetails, setShowDetails] = useState(false);

  const timeElapsed = calculateElapsedTime(evaluationAttempt.startedAt, evaluationAttempt.finishedAt);

  if (!evaluation || !evaluationAttempt)
    return (
      <div>
        <p>Ha ocurrido un error con la finalización de la evaluación</p>
      </div>
    );

  return (
    <>
      <div className="bg-white p-8 rounded-lg">
        <h2 className="font-bold text-xl">{evaluation.name}</h2>

        <p className="mt-4">Evaluación completada</p>
        <p className="mt-4">
          Tu nota es: <span className={`${Number(evaluationAttempt.qualification) === 100 ? 'text-green-500' : 'text-red-400'} font-bold text-lg`}>{evaluationAttempt.qualification}</span>
        </p>

        <p className="mt-4">
          Tiempo: <span className="font-bold text-lg">{`${timeElapsed.hours}:${timeElapsed.minutes < 10 ? `0${timeElapsed.minutes}` : timeElapsed.minutes}:${timeElapsed.seconds}`}</span>
        </p>

        <button type="button" className="bg-easy-400 px-3 py-2 text-white rounded-lg font-bold mt-6" onClick={() => setShowDetails(prev => !prev)}>
          {showDetails ? 'Ocultar' : 'Ver'} evaluación
        </button>
      </div>

      {showDetails && (
        <>
          <div className="my-8 mx-auto w-11/12">
            <hr />
          </div>
          <div>
            {/* <p className="text-xl font-bold mb-4 text-center">Correcciones</p> */}
            <EvaluationBodyToTake evaluationAttempt={evaluationAttempt} />
          </div>
        </>
      )}
    </>
  );
};
