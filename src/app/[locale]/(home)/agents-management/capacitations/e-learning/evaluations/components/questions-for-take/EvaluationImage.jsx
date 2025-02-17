import Image from 'next/image';

export const EvaluationImage = ({ question }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">{question.title}</h2>
      {question.description && <p className="text-sm">{question.description}</p>}
      <div className="mt-8">
        {question.imageSrc ? (
          <div className="relative w-full h-[500px]">
            <Image src={question.imageSrc} alt="Descripción de la imagen" layout="fill" objectFit="cover" />
          </div>
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center rounded-lg bg-gray-100">
            <p>No image</p>
          </div>
        )}
      </div>
    </div>
  );
};
