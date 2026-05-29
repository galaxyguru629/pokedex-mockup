import type { Prisma, Team } from '@prisma/client';
import { prisma } from '../../config/database';
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

  async remove(id: number): Promise<Team> {
    const existing = await teamRepository.findById(id);
    if (!existing) throw new NotFoundError('Team', id);

    // Battles reference teams with onDelete: Restrict — remove them first.
    return prisma.$transaction(async (tx) => {
      await tx.battle.deleteMany({ where: { teamId: id } });
      return tx.team.delete({ where: { id } });
    });
  },
};
