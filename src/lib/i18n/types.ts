/** A flat dictionary of translation keys to strings. */
export type Dict = Record<string, string>;

/** Values interpolated into a translation template, e.g. { count: 5 }. */
export type TVars = Record<string, string | number>;
