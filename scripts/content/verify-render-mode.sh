#!/usr/bin/env bash
# Build хийж, хуудсуудын cache горимыг шалгана.
#   bash scripts/content/verify-render-mode.sh <preview|production> <port>
MODE=$1; PORT=$2
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
NODE='/c/Users/hp/AppData/Local/Programs/Microsoft VS Code/Code.exe'
cd "$ROOT/travel-mongolia" || exit 1
if [ "$MODE" = production ]; then export VERCEL_ENV=production; else unset VERCEL_ENV; fi
export NEXT_TELEMETRY_DISABLED=1 ELECTRON_RUN_AS_NODE=1
"$NODE" node_modules/next/dist/bin/next build --webpack > "$ROOT/backups/build-$MODE.log" 2>&1
echo "build exit $?"
"$NODE" node_modules/next/dist/bin/next start -p "$PORT" > "$ROOT/backups/start-$MODE.log" 2>&1 &
PID=$!
for i in $(seq 1 40); do grep -q "Ready in" "$ROOT/backups/start-$MODE.log" && break; sleep 2; done
unset ELECTRON_RUN_AS_NODE
for u in /province/khovd /province/khovd /province/khentii/dadal /province/khentii/dadal /stories/news/madagaskar /stories/news/madagaskar /province/no-such-aimag /province/umnugovi /destination/region /things-to-do/food /local/food /things-to-do/festivals; do
  curl -s -o /dev/null -w "$u %{http_code} cache=%header{x-nextjs-cache} cc=%header{cache-control} loc=%header{location} t=%{time_total}\n" --max-time 120 "http://localhost:$PORT$u"
done
grep -c "Server Components render\|DYNAMIC_SERVER" "$ROOT/backups/start-$MODE.log"
kill $PID 2>/dev/null
taskkill //F //PID $PID >/dev/null 2>&1
exit 0
