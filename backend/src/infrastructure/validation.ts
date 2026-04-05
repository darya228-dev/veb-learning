import ApiError from "./apiError";

export function requireString(value: unknown, field: string) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ApiError(400, "VALIDATION_ERROR", `${field} must be a non-empty string`);
  }
}

export function oneOf(value: string, allowed: string[], field: string) {
  if (!allowed.includes(value)) {
    throw new ApiError(400, "VALIDATION_ERROR", `${field} must be one of: ${allowed.join(", ")}`);
  }
}
export function oneOfEnum<T extends readonly string[]>(value: string, allowed: T, field: string) {
  if (!allowed.includes(value)) {
    throw new ApiError(400, "VALIDATION_ERROR", `${field} must be one of: ${allowed.join(", ")}`);
  }
}

export function optionalString(value: unknown, field: string) {
  if (value !== undefined && typeof value !== "string") {
    throw new ApiError(400, "VALIDATION_ERROR", `${field} must be a string`);
  }
}
