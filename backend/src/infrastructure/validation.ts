export function requireString(value, field) {

  if (typeof value !== "string" || value.length === 0) {

    throw new Error(`${field} must be string`);

  }

}