#!/bin/bash
# Дахин бичсэн файлуудыг шалгаад DRAFT болгон хадгалж, rewrite-list.csv-д төлөв бичнэ (нийтлэхгүй).
#   bash scripts/content/rewrite-batch.sh <entryId> [<entryId> ...]
# Ажил 1-ийн CMA хязгаар: 6,000-ийн тоолуур, 300 үлдэхэд (5,700) зогсоно.
cd "$(dirname "$0")/../.."
export ELECTRON_RUN_AS_NODE=1 CMA_BUDGET_FILE=backups/cma-budget-2026-11-06.txt CMA_BUDGET_MAX=5700
N="/c/Users/hp/AppData/Local/Programs/Microsoft VS Code/Code.exe"
for id in "$@"; do
  f="data/rewrites/$id.md"
  if ! out=$("$N" scripts/content/find.js --check "$f" 2>&1); then echo "$id ХОЛБООС: $(echo "$out" | grep ҮГҮЙ | tr '\n' ' ')"; continue; fi
  links=$(echo "$out" | grep -c '^OK')
  if ! res=$("$N" scripts/content/apply-rewrite.js "$f" 2>&1); then echo "$id $res"; [[ "$res" == *хязгаар* ]] && exit 3; continue; fi
  kw=$(grep -m1 '^keyword:' "$f" | sed 's/^keyword: *//')
  ow=$(echo "$res" | grep -o '"oldWords":[0-9]*' | cut -d: -f2); nw=$(echo "$res" | grep -o '"newWords":[0-9]*' | cut -d: -f2)
  faq=$([ "$nw" -gt 300 ] && grep -q '^## Түгээмэл асуулт' "$f" && echo "FAQ нэмсэн" || echo "<300 үг тул FAQ нэмээгүй")
  [ "$nw" -gt 300 ] && ! grep -q '^## Түгээмэл асуулт' "$f" && faq="FAQ алга (шалгах)"
  "$N" scripts/content/set-status.js "$id" "дахин бичсэн (draft)" "гол үг: $kw; $ow→$nw үг; $links дотоод холбоос; $faq"
  echo "$id OK $ow→$nw links=$links"
done
echo "CMA: $(cat backups/cma-budget-2026-11-06.txt)"
