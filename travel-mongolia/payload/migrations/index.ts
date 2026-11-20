import * as migration_20261113_115323_initial from './20261113_115323_initial';
import * as migration_20261120_042234_r2_storage from './20261120_042234_r2_storage';
import * as migration_20261120_100000_mn_collation from './20261120_100000_mn_collation';

export const migrations = [
  {
    up: migration_20261113_115323_initial.up,
    down: migration_20261113_115323_initial.down,
    name: '20261113_115323_initial',
  },
  {
    up: migration_20261120_042234_r2_storage.up,
    down: migration_20261120_042234_r2_storage.down,
    name: '20261120_042234_r2_storage'
  },
  {
    up: migration_20261120_100000_mn_collation.up,
    down: migration_20261120_100000_mn_collation.down,
    name: '20261120_100000_mn_collation',
  },
];
