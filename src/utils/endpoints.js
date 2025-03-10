export const endpoints = {
  calendar: {
    list: "/calendar/events",
    create: "/calendar/events",
    details: (id) => `/calendar/events/${id}`,
  },
};
