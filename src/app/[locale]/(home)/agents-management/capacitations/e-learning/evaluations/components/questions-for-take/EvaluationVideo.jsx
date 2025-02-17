import { videoUrlFormatter } from '../../../helpers/video-url-formatter';

export const EvaluationVideo = ({ question }) => {
  return (
    <div>
      <h2 className="text-xl font-bold">{question.title}</h2>
      {question.description && <p className="text-sm">{question.description}</p>}
      <div className="mt-8">
        {question.videoSrc ? (
          <div className="w-full h-[500px]">
            <iframe className="w-full h-full" src={videoUrlFormatter(question.videoSrc)} title={question.title} allowFullScreen frameborder="0"></iframe>
          </div>
        ) : (
          <div className="w-full h-[500px] flex items-center justify-center rounded-lg bg-gray-100">
            <p>No se ha cargado el video</p>
          </div>
        )}
      </div>
    </div>
  );
};
