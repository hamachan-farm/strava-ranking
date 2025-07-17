const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxarjliM7v29kN3b7z9XQL4bhdRwujUD__qhgNgAB_eNUxuzPReXnH_25ci7WEEJ_FsHA/exec";

async function fetchRanking() {
  const month = document.getElementById("monthSelector").value;
  if (!month) return;

  const res = await fetch(`${GAS_API_URL}?month=${month}`);
  const data = await res.json();

  const rankingEl = document.getElementById("ranking");

  // ✅ 空チェック（ここがポイント）
  if (!data.ranking || data.ranking.length === 0) {
    rankingEl.innerHTML = "<p>この月のランキングデータはありません。</p>";
    return;
  }

  // ✅ データあり時の表示
  rankingEl.innerHTML = data.ranking.map((item, i) =>
    `<div style="margin-bottom: 10px;">
      <img src="${item.profile_image}" alt="icon" width="32" height="32" style="vertical-align: middle; border-radius: 50%; margin-right: 8px;">
      <strong>${i + 1}位:</strong> ${item.user_name} - ${item.distance_km} km / ${item.time_min} 分 / ${item.count} 回
    </div>`
  ).join("");
}
