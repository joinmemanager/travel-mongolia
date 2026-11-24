import * as migration_20261113_115323_initial from './20261113_115323_initial';
import * as migration_20261120_042234_r2_storage from './20261120_042234_r2_storage';
import * as migration_20261120_100000_mn_collation from './20261120_100000_mn_collation';
import * as migration_20261124_024225_admin_2fa from './20261124_024225_admin_2fa';
import * as migration_20261124_024919_team from './20261124_024919_team';

export const migrations = [
  {
    up: migration_20261113_115323_initial.up,
    down: migration_20261113_115323_initial.down,
    name: '20261113_115323_initial',
  },
  {
    up: migration_20261120_042234_r2_storage.up,
    down: migration_20261120_042234_r2_storage.down,
    name: '20261120_042234_r2_storage',
  },
  {
    up: migration_20261120_100000_mn_collation.up,
    down: migration_20261120_100000_mn_collation.down,
    name: '20261120_100000_mn_collation',
  },
  {
    up: migration_20261124_024225_admin_2fa.up,
    down: migration_20261124_024225_admin_2fa.down,
    name: '20261124_024225_admin_2fa',
  },
  {
    up: migration_20261124_024919_team.up,
    down: migration_20261124_024919_team.down,
    name: '20261124_024919_team'
  },
];
