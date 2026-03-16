const searchInput = document.getElementById('searchInput');
const detayliListeCheckbox = document.getElementById('detayliListe');
const table = document.getElementById('examTable');
const loadingDiv = document.getElementById('loading');

let allData = [];

// Sayfa yüklendiğinde verileri çek
document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

// Checkbox değiştiğinde verileri yeniden çek
detayliListeCheckbox.addEventListener('change', () => {
    fetchData();
});

// Arama kutusuna yazıldığında filtrele
searchInput.addEventListener('input', (e) => {
    renderTable(e.target.value);
});

async function fetchData() {
    loadingDiv.style.display = 'block';
    table.style.display = 'none';
    
    // Checkbox işaretli mi kontrol et
    const isDetailed = detayliListeCheckbox.checked;
    // İşaretliyse detaylı listeyi iste, değilse varsayılanı (Instagram) iste
    const url = isDetailed ? '/api/data?kaynak=detayli' : '/api/data';

    // Varsayılan (Instagram) liste görüntülenirken arama kutusunu (şube/bölüm filtresi) gizle
    if (!isDetailed) {
        searchInput.style.display = 'none';
        searchInput.value = ''; // Aramayı temizle
    } else {
        searchInput.style.display = 'block';
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        allData = data;
        renderTable(searchInput.value);
        loadingDiv.style.display = 'none';
        table.style.display = 'table';
    } catch (error) {
        console.error('Hata:', error);
        loadingDiv.textContent = 'Veriler yüklenirken bir hata oluştu.';
    }
}

function renderTable(filterText = '') {
    const tbody = table.querySelector('tbody');
    const thead = table.querySelector('thead');
    tbody.innerHTML = '';
    thead.innerHTML = '';

    if (allData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5">Veri bulunamadı.</td></tr>';
        return;
    }

    // Dinamik başlık oluşturma (Gelen veriye göre değişir)
    const headers = Object.keys(allData[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    const filter = filterText.toLowerCase();

    allData.forEach(row => {
        // Satırdaki tüm değerleri birleştirip arama yap
        const rowValues = Object.values(row).join(' ').toLowerCase();
        if (rowValues.includes(filter)) {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header] || '';
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
        }
    });
}