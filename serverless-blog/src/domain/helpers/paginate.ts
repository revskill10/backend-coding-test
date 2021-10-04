import { SelectQueryBuilder } from 'typeorm';

declare module 'typeorm' {
  export interface SelectQueryBuilder<Entity> {
    sPaginate(q?: ISPaginateQuery): this;
  }
}

export interface ISPaginateQuery {
  limit?: number;
  skip?: number;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export function sPaginate<T>(queryBuilder: SelectQueryBuilder<T>, query: ISPaginateQuery): SelectQueryBuilder<T> {
  let qb = queryBuilder;

  if (query.limit) {
    if (query.limit > MAX_LIMIT) {
      qb = qb.take(MAX_LIMIT);
    } else if (query.limit <= 0) {
      qb = qb.take(DEFAULT_LIMIT);
    } else {
      qb = qb.take(query.limit);
    }
  } else {
    qb = qb.take(DEFAULT_LIMIT);
  }

  if (query.skip) {
    qb = qb.skip(query.skip);
  }
  return qb;
}

// Patch the prototype
SelectQueryBuilder.prototype.sPaginate = function (q: ISPaginateQuery = {}) {
  return sPaginate(this, q);
};
