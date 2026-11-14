function calculateWaste() {
    var mode = document.getElementById('calcType').value;
    var weightKg = 0;
    var volumeM3 = 0;
    var bagsCount = 0;

    if (mode === 'bags') {
        bagsCount = parseInt(document.getElementById('bagCount').value) || 0;
        var fill = document.getElementById('wasteFill').value;
        var wPerBag = 35;
        var vPerBag = 0.035;
        if (fill === 'medium') { wPerBag = 25; vPerBag = 0.04; }
        else if (fill === 'light') { wPerBag = 15; vPerBag = 0.045; }
        weightKg = bagsCount * wPerBag;
        volumeM3 = bagsCount * vPerBag;
    } else {
        var area = parseFloat(document.getElementById('demoArea').value) || 0;
        var work = document.getElementById('demoWork').value;
        var wPerSqm = 90;
        var vPerSqm = 0.07;
        if (work === 'tile') { wPerSqm = 35; vPerSqm = 0.03; }
        else if (work === 'brick') { wPerSqm = 140; vPerSqm = 0.11; }
        else if (work === 'drywall') { wPerSqm = 45; vPerSqm = 0.04; }
        else if (work === 'plaster') { wPerSqm = 25; vPerSqm = 0.02; }
        weightKg = area * wPerSqm;
        volumeM3 = area * vPerSqm;
        bagsCount = Math.ceil(weightKg / 30);
    }

    var bulky = document.getElementById('bulkyItems').value;
    if (bulky === 'some') { weightKg += 150; volumeM3 += 1.5; }
    else if (bulky === 'many') { weightKg += 400; volumeM3 += 3.5; }

    var tons = weightKg / 1000;
    var truck = 'Газель / Бус (до 1.5 т)';
    var truckNote = 'кузов 8–10 м³';
    var loaders = '2 чол.';

    if (tons <= 1.5 && volumeM3 <= 9) {
        truck = 'Газель / Бус (до 1.5 т)';
        truckNote = 'кузов 8–10 м³';
        loaders = tons > 0.8 ? '2 чол.' : '1–2 чол.';
    } else if (tons <= 3.0 && volumeM3 <= 16) {
        truck = 'Вантажівка 3-тонник';
        truckNote = 'кузов 14–18 м³';
        loaders = '2–3 чол.';
    } else if (tons <= 5.5 && volumeM3 <= 20) {
        truck = 'ЗІЛ самоскид (до 5–6 т)';
        truckNote = 'кузов 6–8 м³ або контейнер 8 м³';
        loaders = '3–4 чол.';
    } else if (tons <= 10) {
        truck = 'КамАЗ самоскид (до 10 т)';
        truckNote = 'кузов 10–12 м³';
        loaders = '4 чол.';
    } else {
        var trips = Math.ceil(tons / 10);
        truck = 'КамАЗ 10 т (' + trips + ' рейси)';
        truckNote = 'великий обсяг демонтажу';
        loaders = '4 чол.';
    }

    document.getElementById('resTruck').textContent = truck;
    document.getElementById('resTruckNote').textContent = truckNote;
    document.getElementById('resWeight').textContent = Math.round(weightKg) + ' кг (' + tons.toFixed(2) + ' т)';
    document.getElementById('resVolume').textContent = volumeM3.toFixed(2) + ' м³';
    document.getElementById('resBags').textContent = bagsCount + ' шт.';
    document.getElementById('resLoaders').textContent = loaders;
}

document.getElementById('calcType').addEventListener('change', function() {
    var mode = this.value;
    document.getElementById('bagsBlock').style.display = mode === 'bags' ? 'block' : 'none';
    document.getElementById('demolitionBlock').style.display = mode === 'demolition' ? 'block' : 'none';
    calculateWaste();
});

document.getElementById('wasteFill').addEventListener('change', calculateWaste);
document.getElementById('demoWork').addEventListener('change', calculateWaste);
document.getElementById('bulkyItems').addEventListener('change', calculateWaste);
document.getElementById('calcBtn').addEventListener('click', calculateWaste);

document.getElementById('copyBtn').addEventListener('click', function() {
    var truck = document.getElementById('resTruck').textContent;
    var weight = document.getElementById('resWeight').textContent;
    var vol = document.getElementById('resVolume').textContent;
    var bags = document.getElementById('resBags').textContent;
    var text = "Розрахунок вивозу сміття (БудКальк):\n- Транспорт: " + truck + "\n- Вага: " + weight + ", об'єм: " + vol + "\n- Мішків: " + bags;

    var el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    var btn = this;
    btn.textContent = '✅ Скопійовано!';
    setTimeout(function() { btn.textContent = '📋 Скопіювати розрахунок'; }, 2000);
});

calculateWaste();
