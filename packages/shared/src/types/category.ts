/**
 * Category domain types.
 *
 * Categories classify posts (e.g. education, health, infrastructure).
 * They are managed by admins and referenced by ID inside Post documents.
 */

/** Category reference embedded inside posts. */
export interface CategoryInfo {
  _id: string;
  name: string;
}
