import type { Prisma } from '@prisma/client';
import { prisma } from '../../config/database';

export type TrainerFilter = {
  ids?: number[];
  region?: string;
  rank?: string;
  q?: string;
};

export type ListParams = {
  page?: number;
  perPage?: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: TrainerFilter;
};

const trainerSortFields = new Set([
  'id',
  'name',
  'badgeCount',
  'region',
  'rank',
  'createdAt',
]);

function buildWhere(filter?: TrainerFilter): Prisma.TrainerWhereInput {
  if (!filter) return {};

  const where: Prisma.TrainerWhereInput = {};

  if (filter.ids?.length) {
    where.id = { in: filter.ids };
  }
  if (filter.region) {
    where.region = filter.region;
  }
  if (filter.rank) {
    where.rank = filter.rank;
  }
  if (filter.q) {
    where.OR = [
      { name: { contains: filter.q, mode: 'insensitive' } },
      { region: { contains: filter.q, mode: 'insensitive' } },
      { rank: { contains: filter.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export const trainerRepository = {
  async findById(id: number) {
    return prisma.trainer.findUnique({ where: { id } });
  },

  async findMany(params: ListParams = {}) {
    const { page = 0, perPage = 25, sortField = 'id', sortOrder = 'asc', filter } =
      params;
    const orderField = trainerSortFields.has(sortField ?? 'id')
      ? sortField!
      : 'id';

    return prisma.trainer.findMany({
      where: buildWhere(filter),
      orderBy: { [orderField]: sortOrder },
      skip: page * perPage,
      take: perPage,
    });
  },

  async count(filter?: TrainerFilter) {
    return prisma.trainer.count({ where: buildWhere(filter) });
  },

  async create(data: Prisma.TrainerCreateInput) {
    return prisma.trainer.create({ data });
  },

  async update(id: number, data: Prisma.TrainerUpdateInput) {
    return prisma.trainer.update({ where: { id }, data });
  },

  async delete(id: number) {
    return prisma.trainer.delete({ where: { id } });
  },
};
