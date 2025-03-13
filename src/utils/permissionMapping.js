// Archivo: permissionMapping.js

/**
 * Mapa de códigos cortos a rutas completas de permisos
 * Usamos códigos numéricos para minimizar el espacio de almacenamiento
 */
export const PERMISSION_CODES = {
  // Secciones principales
  1: "home",
  2: "tools",
  3: "sales",
  4: "control",
  5: "operations",
  6: "marketing",
  7: "services",
  8: "agent-management",
  9: "companies",
  10: "settings",

  // Tools
  21: "tools:tasks",
  22: "tools:calendar",
  23: "tools:drive",
  24: "tools:email",

  // Sales
  31: "sales:crm",
  311: "sales:crm:contacts",
  312: "sales:crm:leads",
  32: "sales:reports",
  321: "sales:reports:activities",
  322: "sales:reports:history",
  323: "sales:reports:reports",
  324: "sales:reports:agent",
  3241: "sales:reports:agent:performance",

  // Control
  41: "control:commissions",
  411: "control:commissions:commission-simulator",
  412: "control:commissions:commissions-generated",
  42: "control:portfolio",
  421: "control:portfolio:receipts",
  422: "control:portfolio:control",

  // Operations
  51: "operations:management",
  52: "operations:policies",
  53: "operations:endorsements",
  54: "operations:sinisters",
  55: "operations:refunds",
  56: "operations:fund-recovery",

  // Marketing
  61: "marketing:campaigns",
  62: "marketing:phone",
  63: "marketing:sms",
  64: "marketing:widgets",
  65: "marketing:websites",
  66: "marketing:landing",

  // Services
  71: "services:automations",
  72: "services:funnels",
  73: "services:chat",
  74: "services:trash",
  75: "services:logs",
  76: "services:academy",

  // Agent Management
  81: "agent-management:accompaniment",
  82: "agent-management:recruitment",
  83: "agent-management:capacitations",
  831: "agent-management:capacitations:e-learning",
  8311: "agent-management:capacitations:e-learning:courses",
  83111: "agent-management:capacitations:e-learning:courses:more-menu",
  831111: "agent-management:capacitations:e-learning:courses:more-menu:edit",
  831112: "agent-management:capacitations:e-learning:courses:more-menu:move",
  831113: "agent-management:capacitations:e-learning:courses:more-menu:delete",
  83112: "agent-management:capacitations:e-learning:courses:progress-bar",
  83113: "agent-management:capacitations:e-learning:courses:course-details",
  831131:
    "agent-management:capacitations:e-learning:courses:course-details:edit-course",
  831132:
    "agent-management:capacitations:e-learning:courses:course-details:delete-course",
  831133:
    "agent-management:capacitations:e-learning:courses:course-details:add-folder",
  831134:
    "agent-management:capacitations:e-learning:courses:course-details:edit-folder",
  831135:
    "agent-management:capacitations:e-learning:courses:course-details:delete-folder",
  831136:
    "agent-management:capacitations:e-learning:courses:course-details:add-folder-page",
  831137:
    "agent-management:capacitations:e-learning:courses:course-details:edit-folder-page",
  831138:
    "agent-management:capacitations:e-learning:courses:course-details:duplicate-folder-page",
  831139:
    "agent-management:capacitations:e-learning:courses:course-details:change-folder-page-folder",
  831140:
    "agent-management:capacitations:e-learning:courses:course-details:delete-folder-page",
  831141:
    "agent-management:capacitations:e-learning:courses:course-details:edit-content-title",
  831142:
    "agent-management:capacitations:e-learning:courses:course-details:edit-content-body",
  831143:
    "agent-management:capacitations:e-learning:courses:course-details:marks-as-completed",
  831144:
    "agent-management:capacitations:e-learning:courses:course-details:progress-bar",
  8312: "agent-management:capacitations:e-learning:my-courses",
  8313: "agent-management:capacitations:e-learning:config",
  8314: "agent-management:capacitations:e-learning:evaluations",
  83141: "agent-management:capacitations:e-learning:evaluations:take",
  83142: "agent-management:capacitations:e-learning:evaluations:create",
  83143: "agent-management:capacitations:e-learning:evaluations:edit",
  83144: "agent-management:capacitations:e-learning:evaluations:list",
  83145: "agent-management:capacitations:e-learning:evaluations:tests-list",
  84: "agent-management:conections",
  85: "agent-management:meetings",
  851: "agent-management:meetings:team-meetings",
  852: "agent-management:meetings:individual-meetings",

  // Companies
  91: "companies:insurance",
  911: "companies:insurance:gnp",
  912: "companies:insurance:axa",
  913: "companies:insurance:banorte",
  914: "companies:insurance:mapfre",
  915: "companies:insurance:atlas",
  916: "companies:insurance:qualitas",
  917: "companies:insurance:zurich",
  918: "companies:insurance:afirme",
  919: "companies:insurance:others",
  92: "companies:agency-addresses",
  921: "companies:agency-addresses:gya",
  922: "companies:agency-addresses:blinda",

  // Settings
  101: "settings:permissions",
  1011: "settings:permissions:invite",
  1012: "settings:permissions:user-list",
  102: "settings:others",
  1021: "settings:others:other-settings",
  1022: "settings:others:change-password",
  1023: "settings:others:other-notifications",
  1024: "settings:others:subscriptions",
};

/**
 * Mapa invertido para buscar códigos a partir de rutas de permisos
 */
export const PERMISSION_PATHS = Object.entries(PERMISSION_CODES).reduce(
  (acc, [code, path]) => {
    acc[path] = parseInt(code, 10);
    return acc;
  },
  {}
);

/**
 * Convierte un array de rutas de permisos a códigos numéricos
 * @param {string[]} permissionPaths - Array de rutas de permisos
 * @returns {number[]} - Array de códigos numéricos
 */
export function pathsToCodes(permissionPaths) {
  return permissionPaths
    .map((path) => PERMISSION_PATHS[path])
    .filter((code) => code !== undefined);
}

/**
 * Convierte un array de códigos numéricos a rutas de permisos
 * @param {number[]} permissionCodes - Array de códigos numéricos
 * @returns {string[]} - Array de rutas de permisos
 */
export function codesToPaths(permissionCodes) {
  return permissionCodes
    .map((code) => PERMISSION_CODES[code])
    .filter((path) => path !== undefined);
}

/**
 * Optimización adicional: inferir permisos padre
 * Si tienes permiso a una ruta anidada, automáticamente tendrás permiso a sus rutas padre
 * @param {number[]} permissionCodes - Array de códigos numéricos
 * @returns {number[]} - Array de códigos numéricos con padres incluidos
 */
export function inferParentPermissions(permissionCodes) {
  const result = new Set(permissionCodes);

  permissionCodes.forEach((code) => {
    // Convertir a string para manipular
    let codeStr = code.toString();

    // Mientras podamos truncar el código
    while (codeStr.length > 1) {
      // Eliminar el último dígito
      codeStr = codeStr.slice(0, -1);

      // Convertir de nuevo a número y añadir al conjunto
      const parentCode = parseInt(codeStr, 10);
      if (PERMISSION_CODES[parentCode]) {
        result.add(parentCode);
      }
    }
  });

  return Array.from(result).sort((a, b) => a - b);
}
