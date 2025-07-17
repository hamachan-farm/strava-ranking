const apiBaseUrl = 'https://script.google.com/macros/s/AKfycbwGwnsYZiMtzUcB1Mk6odPNAgLaZPVr9K4WaHs0EYgqy3emiBimIg1wZPk_Ucobjb3iSg/exec';

    const monthInput = document.getElementById('monthInput');
    const loadBtn = document.getElementById('loadBtn');
    const rankingDiv = document.getElementById('ranking');
    const errorDiv = document.getElementById('error');

    loadBtn.addEventListener('click', () => {
      const month = monthInput.value;
      if (!month) {
        showError('月を選択してください');
        return;
      }
      fetchRanking(month);
    });

    function showError(msg) {
      errorDiv.textContent = msg;
      errorDiv.classList.remove('d-none');
      rankingDiv.innerHTML = ''; // Clear ranking content
    }

    function hideError() {
      errorDiv.classList.add('d-none');
    }

    async function fetchRanking(month) {
      hideError();
      rankingDiv.innerHTML = `
        <div class="d-flex justify-content-center align-items-center" style="min-height: 200px;">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="ms-3 mb-0">読み込み中...</p>
        </div>
      `;

      const url = `${apiBaseUrl}?month=${month}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('通信エラーが発生しました。');
        const data = await res.json();
        if (data.error) {
          showError(data.error);
          return;
        }
        renderRankingCards(data.ranking);
      } catch (e) {
        showError('データの取得に失敗しました: ' + e.message);
        console.error(e);
      }
    }

    function renderRankingCards(ranking) {
      rankingDiv.innerHTML = '';

      if (!Array.isArray(ranking) || ranking.length === 0) {
        rankingDiv.innerHTML = '<div class="alert alert-info">この月のデータはありません。</div>';
        return;
      }

      let html = '<div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">';
      ranking.forEach((row, index) => {
        const rank = index + 1;
        let rankBadge;
        if (rank === 1) {
          rankBadge = '<span class="badge bg-warning text-dark rank-badge"><i class="fas fa-crown"></i> 1位</span>';
        } else if (rank === 2) {
          rankBadge = '<span class="badge bg-secondary rank-badge">2位</span>';
        } else if (rank === 3) {
          rankBadge = '<span class="badge bg-bronze rank-badge">3位</span>';
        } else {
          rankBadge = `<span class="badge bg-light text-dark rank-badge">${rank}位</span>`;
        }

        html += `
          <div class="col">
            <div class="card h-100 ranking-card">
              ${rankBadge}
              <div class="card-body text-center">
                <h5 class="card-title text-primary mb-3">${row.user}</h5>
                <p class="card-text mb-2">
                  <i class="fas fa-road"></i> <strong>距離:</strong> ${row.distance_km} km
                </p>
                <p class="card-text mb-2">
                  <i class="far fa-clock"></i> <strong>時間:</strong> ${row.time_min} min
                </p>
                <p class="card-text">
                  <i class="fas fa-hashtag"></i> <strong>ラン回数:</strong> ${row.count}
                </p>
              </div>
            </div>
          </div>
        `;
      });
      html += '</div>';
      rankingDiv.innerHTML = html;
    }

    // Initial load with current month
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;
    monthInput.value = currentMonth;
    fetchRanking(currentMonth);