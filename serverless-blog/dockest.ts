import { Dockest, logLevel } from 'dockest'
import { createPostgresReadinessCheck } from 'dockest/readiness-check'
import jest from 'jest'
const dockest = new Dockest({
  composeFile: ['docker-compose.test.yml'],
  dumpErrors: true,
  jestLib: jest,
  logLevel: logLevel.DEBUG,
})

dockest.run([
  {
    serviceName: 'postgres',
    commands: [],
    readinessCheck: createPostgresReadinessCheck(),
  },
])