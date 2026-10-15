// 1-р багцын (21 аймаг + Архангайн сумд) мөрүүдийг tic-inventory.csv-ээс сонгоно.

// TIC-ийн аймгийн нэр → Travel Hub-ийн slug (tic-migration.md-ийн шинэ_url-тай ижил)
function provinceSlug(row) {
  return row['шинэ_url'].replace(/^\/(province|destination)\//, '');
}

function batch01Rows(rows) {
  const c13 = rows.filter((r) => r['ангилал'] === '13');
  const aimags = c13.filter((r) => r['contentful_төрөл'] === 'province');
  const arkhangaiSoums = c13.filter(
    (r) => r['contentful_төрөл'].replace('*', '') === 'soum' && r['аймаг'] === 'Архангай' && r['шинэ_url'].startsWith('/province/arkhangai/')
  );
  return [...aimags, ...arkhangaiSoums];
}

module.exports = { batch01Rows, provinceSlug };
