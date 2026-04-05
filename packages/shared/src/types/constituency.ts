/**
 * Constituency domain types.
 *
 * Bihar constituencies are the primary geographic unit of the platform.
 * All posts and user profiles are anchored to a constituency.
 */

/** Minimal constituency reference embedded inside posts and user profiles. */
export interface ConstituencyInfo {
  _id: string;
  area_name: string;
}

/** Full constituency list item returned by /api/constituencies/list/paginated */
export interface ConstituencyListType {
  _id: string;
  area_name: string;
  english_name?: string;
}

/** Paginated response from GET /api/constituencies/list/paginated */
export interface ConstituencyListResponse {
  data: ConstituencyListType[];
  pagination: PaginationMeta;
}

/** Shared pagination metadata used across all paginated endpoints. */
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  limit: number;
}
