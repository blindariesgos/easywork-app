// accessControlConfig.js

module.exports = [
  {
    pattern: /^\/tools\/tasks\/.*$/, // Patrón para /tools/tasks/:path*
    roles: ["admin", "superadmin"],
  },
  // Puedes agregar más rutas y roles aquí
];
