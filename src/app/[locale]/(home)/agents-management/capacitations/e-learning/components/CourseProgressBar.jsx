import { LMS_PERMISSIONS } from '../../constants';
import { useUserPermissions } from '../../hooks/useUserPermissions';

export const CourseProgressBar = ({ progress }) => {
  const { hasPermission } = useUserPermissions();

  return (
    hasPermission(LMS_PERMISSIONS.coursesProgressBar) && (
      <div className="w-full h-5 bg-gray-200 rounded-full overflow-hidden mt-2">
        <div className="h-full bg-blue-300 rounded-full transition-all duration-500 flex items-center" style={{ width: progress > 0 ? `${progress}%` : '0px' }}>
          <p className={`${Number(progress) > 2 ? 'text-white' : 'text-black'} px-5`}>{progress}%</p>
        </div>
      </div>
    )
  );
};
