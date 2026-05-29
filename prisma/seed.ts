import { PrismaClient, BattleResult, LogSeverity } from '@prisma/client';
import { getDirectDatabaseUrl } from '../src/config/database-url';

const prisma = new PrismaClient({
  datasources: { db: { url: getDirectDatabaseUrl() } },
});

async function main(): Promise<void> {
  await prisma.battleLog.deleteMany();
  await prisma.battle.deleteMany();
  await prisma.team.deleteMany();
  await prisma.trainer.deleteMany();

  const ash = await prisma.trainer.create({
    data: {
      name: 'Ash Ketchum',
      badgeCount: 8,
      region: 'Kanto',
      avatarUrl:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/1.png',
      rank: 'Champion',
    },
  });

  const misty = await prisma.trainer.create({
    data: {
      name: 'Misty Waterflower',
      badgeCount: 5,
      region: 'Kanto',
      avatarUrl: '',
      rank: 'Gym Leader',
    },
  });

  const brock = await prisma.trainer.create({
    data: {
      name: 'Brock Harrison',
      badgeCount: 6,
      region: 'Kanto',
      avatarUrl: '',
      rank: 'Gym Leader',
    },
  });

  const kantoStarters = await prisma.team.create({
    data: {
      trainerId: ash.id,
      name: 'Kanto Starters',
      pokemonIds: [25, 6, 9, 3, 131, 143],
      createdAt: new Date('2024-01-15T10:00:00Z'),
    },
  });

  const johtoSquad = await prisma.team.create({
    data: {
      trainerId: ash.id,
      name: 'Johto Squad',
      pokemonIds: [157, 181, 214, 248, 197, 169],
      createdAt: new Date('2024-03-20T14:30:00Z'),
    },
  });

  const waterSpecialists = await prisma.team.create({
    data: {
      trainerId: misty.id,
      name: 'Water Specialists',
      pokemonIds: [121, 130, 134, 73, 91, 99],
      createdAt: new Date('2024-02-10T09:00:00Z'),
    },
  });

  const rockSolid = await prisma.team.create({
    data: {
      trainerId: brock.id,
      name: 'Rock Solid',
      pokemonIds: [76, 95, 142, 141, 139, 248],
      createdAt: new Date('2024-04-05T16:45:00Z'),
    },
  });

  const battles = await prisma.battle.createMany({
    data: [
      {
        trainerId: ash.id,
        opponentName: 'Gary Oak',
        teamId: kantoStarters.id,
        result: BattleResult.win,
        date: new Date('2024-06-01'),
        scoreTrainer: 3,
        scoreOpponent: 1,
      },
      {
        trainerId: ash.id,
        opponentName: 'Cynthia',
        teamId: johtoSquad.id,
        result: BattleResult.loss,
        date: new Date('2024-06-15'),
        scoreTrainer: 1,
        scoreOpponent: 3,
      },
      {
        trainerId: ash.id,
        opponentName: 'Lance',
        teamId: kantoStarters.id,
        result: BattleResult.win,
        date: new Date('2024-07-01'),
        scoreTrainer: 3,
        scoreOpponent: 2,
      },
      {
        trainerId: misty.id,
        opponentName: 'Lorelei',
        teamId: waterSpecialists.id,
        result: BattleResult.win,
        date: new Date('2024-07-10'),
        scoreTrainer: 3,
        scoreOpponent: 0,
      },
      {
        trainerId: ash.id,
        opponentName: 'Red',
        teamId: johtoSquad.id,
        result: BattleResult.loss,
        date: new Date('2024-08-01'),
        scoreTrainer: 2,
        scoreOpponent: 3,
      },
      {
        trainerId: brock.id,
        opponentName: 'Giovanni',
        teamId: rockSolid.id,
        result: BattleResult.win,
        date: new Date('2024-08-20'),
        scoreTrainer: 3,
        scoreOpponent: 1,
      },
      {
        trainerId: ash.id,
        opponentName: 'Blue',
        teamId: kantoStarters.id,
        result: BattleResult.win,
        date: new Date('2024-09-05'),
        scoreTrainer: 3,
        scoreOpponent: 2,
      },
      {
        trainerId: misty.id,
        opponentName: 'Wallace',
        teamId: waterSpecialists.id,
        result: BattleResult.loss,
        date: new Date('2024-09-18'),
        scoreTrainer: 1,
        scoreOpponent: 3,
      },
      {
        trainerId: ash.id,
        opponentName: 'Steven Stone',
        teamId: johtoSquad.id,
        result: BattleResult.win,
        date: new Date('2024-10-01'),
        scoreTrainer: 3,
        scoreOpponent: 1,
      },
      {
        trainerId: ash.id,
        opponentName: 'Diantha',
        teamId: kantoStarters.id,
        result: BattleResult.win,
        date: new Date('2024-10-20'),
        scoreTrainer: 3,
        scoreOpponent: 0,
      },
    ],
  });

  console.log(`Seeded ${battles.count} battles`);

  const battle1 = await prisma.battle.findFirst({
    where: { opponentName: 'Gary Oak' },
  });
  const battle2 = await prisma.battle.findFirst({
    where: { opponentName: 'Cynthia' },
  });
  const battle3 = await prisma.battle.findFirst({
    where: { opponentName: 'Lance' },
  });

  if (battle1 && battle2 && battle3) {
    await prisma.battleLog.createMany({
      data: [
        {
          battleId: battle1.id,
          timestamp: new Date('2024-06-01T10:01:00Z'),
          message: "Pikachu used Thunderbolt! It's super effective!",
          severity: LogSeverity.success,
        },
        {
          battleId: battle1.id,
          timestamp: new Date('2024-06-01T10:02:00Z'),
          message: "Opponent's Blastoise fainted!",
          severity: LogSeverity.info,
        },
        {
          battleId: battle2.id,
          timestamp: new Date('2024-06-15T14:05:00Z'),
          message: 'Garchomp used Earthquake! Critical hit!',
          severity: LogSeverity.danger,
        },
        {
          battleId: battle2.id,
          timestamp: new Date('2024-06-15T14:06:00Z'),
          message: 'Typhlosion fainted!',
          severity: LogSeverity.danger,
        },
        {
          battleId: battle3.id,
          timestamp: new Date('2024-07-01T11:00:00Z'),
          message: 'Charizard used Flare Blitz!',
          severity: LogSeverity.success,
        },
      ],
    });
  }

  console.log('Database seeded successfully');
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
