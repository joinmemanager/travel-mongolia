#!/bin/sh
# Локал Postgres 17 (Neon-ийн түлхүүр байхгүй үед). EDB-ийн албан ёсны portable binary (.tools/pg17, суулгалтгүй),
# өгөгдөл .tools/pgdata. Payload нь production-тай ИЖИЛ @payloadcms/db-postgres адаптер, ижил migration-оор холбогдоно.
#   sh scripts/payload/local-db.sh start|stop|status   → postgres://postgres:postgres@127.0.0.1:5433/postgres
# Анх удаа: .tools/pg17/pgsql/bin/initdb.exe -D .tools/pgdata -U postgres --pwfile=<postgres гэсэн файл> -E UTF8 --locale=C -A scram-sha-256
T="$(cd "$(dirname "$0")/../../.." && pwd)/.tools"
exec "$T/pg17/pgsql/bin/pg_ctl.exe" -D "$T/pgdata" -l "$T/pg.log" -o "-p 5433 -c listen_addresses=127.0.0.1" "${1:-status}"
