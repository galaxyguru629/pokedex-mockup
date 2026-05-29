import type { Prisma } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/app-error';
import { teamRepository, type ListParams, type TeamFilter } from './team.repository';

export const teamService = {
  getById(id: number) {
    return teamRepository.findById(id);
  },

  listByTrainer(trainerId: number) {
    return teamRepository.findByTrainerId(trainerId);
  },

  list(params: ListParams) {
    return teamRepository.findMany(params);
  },

  count(filter?: TeamFilter) {
    return teamRepository.count(filter);
  },

  create(data: Prisma.TeamCreateInput) {
    return teamRepository.create(data);
  },

  async update(id: number, data: Prisma.TeamUpdateInput) {
    const existing = await teamRepository.findById(id);
    if (!existing) throw new NotFoundError('Team', id);
    return teamRepository.update(id, data);
  },

  async remove(id: number) {
    const existing = await teamRepository.findById(id);
    if (!existing) throw new NotFoundError('Team', id);
    return teamRepository.delete(id);
  },
};
