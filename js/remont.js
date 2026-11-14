function formatUsd(num) {
    return '$' + Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatUah(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' грн';
}

function calculateRenovation() {
    var area = parseFloat(document.getElementById('area').value) || 0;
    var housingMult = parseFloat(document.getElementById('housingType').value) || 1.0;
    var rClass = document.getElementById('renoClass').value;
    var bathrooms = parseInt(document.getElementById('bathrooms').value) || 1;
    var usdRate = parseFloat(document.getElementById('usdRate').value) || 41.5;
    var reserve = parseFloat(document.getElementById('reserve').value) || 0;

    var workRate = 300;
    var roughRate = 150;
    var finishRate = 200;

    if (rClass === 'cosmetic') {
        workRate = 150;
        roughRate = 70;
        finishRate = 110;
    } else if (rClass === 'design') {
        workRate = 425;
        roughRate = 200;
        finishRate = 350;
    }

    var extraBath = bathrooms - 1;
    var reserveMult = 1 + (reserve / 100);

    var workUsd = (area * workRate * housingMult + extraBath * 1500) * reserveMult;
    var roughUsd = (area * roughRate * housingMult + extraBath * 600) * reserveMult;
    var finishUsd = (area * finishRate + extraBath * 1000) * reserveMult;
    var totalUsd = workUsd + roughUsd + finishUsd;

    var workUah = workUsd * usdRate;
    var roughUah = roughUsd * usdRate;
    var finishUah = finishUsd * usdRate;
    var totalUah = totalUsd * usdRate;

    var workPerSqm = area > 0 ? Math.round(workUsd / area) : 0;
    var monthsMin = Math.max(1, (area / 25).toFixed(1));
    var monthsMax = Math.max(1.5, (area / 18).toFixed(1));

    document.getElementById('resWorkUsd').textContent = formatUsd(workUsd);
    document.getElementById('resWorkUah').textContent = '~' + formatUah(workUah) + ' ($' + workPerSqm + '/м² із резервом)';
    document.getElementById('resRough').textContent = formatUsd(roughUsd) + ' (~' + formatUah(roughUah) + ')';
    document.getElementById('resFinish').textContent = formatUsd(finishUsd) + ' (~' + formatUah(finishUah) + ')';
    document.getElementById('resGrandTotal').textContent = formatUsd(totalUsd) + ' (~' + formatUah(totalUah) + ')';
    document.getElementById('resDuration').textContent = '~' + monthsMin + ' — ' + monthsMax + ' міс.';
}

document.getElementById('housingType').addEventListener('change', calculateRenovation);
document.getElementById('renoClass').addEventListener('change', calculateRenovation);
document.getElementById('bathrooms').addEventListener('change', calculateRenovation);
document.getElementById('calcBtn').addEventListener('click', calculateRenovation);

document.getElementById('copyBtn').addEventListener('click', function() {
    var work = document.getElementById('resWorkUsd').textContent;
    var workUah = document.getElementById('resWorkUah').textContent;
    var rough = document.getElementById('resRough').textContent;
    var finish = document.getElementById('resFinish').textContent;
    var total = document.getElementById('resGrandTotal').textContent;
    var area = document.getElementById('area').value;
    var text = "Кошторис ремонту (БудКальк):\n- Площа: " + area + " м²\n- Роботи: " + work + " (" + workUah + ")\n- Чорнові: " + rough + "\n- Чистові: " + finish + "\n- Разом: " + total;

    var el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    var btn = this;
    btn.textContent = '✅ Скопійовано!';
    setTimeout(function() { btn.textContent = '📋 Скопіювати кошторис'; }, 2000);
});

calculateRenovation();
