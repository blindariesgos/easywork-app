'use client';

export default function CalendarLayout({ children, calendar }) {
  return (
    <>
      {calendar}
      {children}
    </>
  );
}
