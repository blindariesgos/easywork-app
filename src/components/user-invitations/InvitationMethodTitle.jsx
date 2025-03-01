export const InvitationMethodTitle = ({ title, icon, rightAction }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="rounded-full p-1 bg-easywork-main">{icon}</div>
      <h2>{title}</h2>

      <div className="flex-grow" />

      {rightAction && rightAction}
    </div>
  );
};
