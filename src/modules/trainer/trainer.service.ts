import type { Prisma } from '@prisma/client';
import { NotFoundError } from '../../shared/errors/app-error';
import {
  trainerRepository,
  type ListParams,
  type TrainerFilter,
} from './trainer.repository';

export const trainerService = {
  getById(id: number) {
    return trainerRepository.findById(id);
  },

  list(params: ListParams) {
    return trainerRepository.findMany(params);
  },

  count(filter?: TrainerFilter) {
    return trainerRepository.count(filter);
  },

  create(data: Prisma.TrainerCreateInput) {
    return trainerRepository.create(data);
  },

  async update(id: number, data: Prisma.TrainerUpdateInput) {
    const existing = await trainerRepository.findById(id);
    if (!existing) throw new NotFoundError('Trainer', id);
    return trainerRepository.update(id, data);
  },

  async remove(id: number) {
    const existing = await trainerRepository.findById(id);
    if (!existing) throw new NotFoundError('Trainer', id);
    return trainerRepository.delete(id);
  },
};
