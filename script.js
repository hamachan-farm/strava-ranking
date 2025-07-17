const GAS_API_URL = "https://script.google.com/macros/s/AKfycbxarjliM7v29kN3b7z9XQL4bhdRwujUD__qhgNgAB_eNUxuzPReXnH_25ci7WEEJ_FsHA/exec"; // 

async function fetchRanking() {
  const month = document.getElementById("monthSelector").value;
  if (!month) return;

  const res = await fetch(`${GAS_API_URL}?month=${month}`);
  const data = await res.json();

  const rankingEl = document.getElementById("ranking");
  if (!data || data.length === 0) {
    rankingEl.innerHTML = "<p>データが見つかりませんでした。</p>";
    return;
  }

  rankingEl.innerHTML = data.map((item, i) =>
    `<p>${i + 1}. ${item.name} - ${item.distance}km</p>`
  ).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  const selector = document.getElementById("monthSelector");
  if (!selector) return;

  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = date.toISOString().slice(0, 7);
    const option = document.createElement("option");
    option.value = monthStr;
    option.text = monthStr;
    selector.appendChild(option);
  }
});

