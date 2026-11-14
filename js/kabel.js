function calculateCable() {
    var powerKw = parseFloat(document.getElementById('powerKw').value) || 0;
    var voltage = parseInt(document.getElementById('voltage').value) || 220;
    var material = document.getElementById('material').value;
    var install = document.getElementById('installType').value;
    var length = parseFloat(document.getElementById('lineLength').value) || 10;
    var cosPhi = parseFloat(document.getElementById('cosPhi').value) || 1;

    var current = (voltage === 220) 
        ? (powerKw * 1000) / (220 * cosPhi) 
        : (powerKw * 1000) / (1.732 * 380 * cosPhi);

    var rho = (material === 'copper') ? 0.0175 : 0.028;
    var factor = (voltage === 220) ? 2 : 1.732;

    var s = 2.5;
    var maxAmp = 21;
    var breaker = 16;

    if (material === 'copper') {
        var lim1 = (install === 'closed') ? 14 : 18;
        var lim2 = (install === 'closed') ? 20 : 25;
        var lim3 = (install === 'closed') ? 26 : 36;
        var lim4 = (install === 'closed') ? 33 : 44;
        var lim5 = (install === 'closed') ? 48 : 66;

        if (current <= lim1) { s = 1.5; maxAmp = (install === 'closed') ? 15 : 19; breaker = 10; }
        else if (current <= lim2) { s = 2.5; maxAmp = (install === 'closed') ? 21 : 27; breaker = 16; }
        else if (current <= lim3) { s = 4.0; maxAmp = (install === 'closed') ? 27 : 38; breaker = 25; }
        else if (current <= lim4) { s = 6.0; maxAmp = (install === 'closed') ? 34 : 46; breaker = 32; }
        else if (current <= lim5) { s = 10.0; maxAmp = (install === 'closed') ? 50 : 70; breaker = 40; }
        else { s = 16.0; maxAmp = (install === 'closed') ? 70 : 85; breaker = 63; }
    } else {
        var alim1 = (install === 'closed') ? 15 : 19;
        var alim2 = (install === 'closed') ? 20 : 26;
        var alim3 = (install === 'closed') ? 25 : 34;
        var alim4 = (install === 'closed') ? 36 : 48;

        if (current <= alim1) { s = 2.5; maxAmp = (install === 'closed') ? 16 : 20; breaker = 10; }
        else if (current <= alim2) { s = 4.0; maxAmp = (install === 'closed') ? 21 : 28; breaker = 16; }
        else if (current <= alim3) { s = 6.0; maxAmp = (install === 'closed') ? 26 : 36; breaker = 25; }
        else if (current <= alim4) { s = 10.0; maxAmp = (install === 'closed') ? 38 : 50; breaker = 32; }
        else { s = 16.0; maxAmp = (install === 'closed') ? 55 : 60; breaker = 50; }
    }

    var deltaU = (factor * current * length * rho) / s;
    var dropPercent = (deltaU / voltage) * 100;
    var maxPowerKw = (voltage === 220) 
        ? (maxAmp * 220 * cosPhi) / 1000 
        : (maxAmp * 380 * 1.732 * cosPhi) / 1000;

    var cores = (voltage === 220) ? '3' : '5';
    var matName = (material === 'copper') 
        ? ('мідний кабель (ВВГнг ' + cores + '×' + s + ')') 
        : ('алюмінієвий кабель (АВВГ ' + cores + '×' + s + ')');

    document.getElementById('resSection').textContent = s + ' мм²';
    document.getElementById('resMatNote').textContent = matName;
    document.getElementById('resCurrent').textContent = current.toFixed(1) + ' А';
    document.getElementById('resBreaker').textContent = breaker + ' А (тип C або B)';
    document.getElementById('lblLen').textContent = length;
    document.getElementById('resDrop').textContent = dropPercent.toFixed(2) + '% (допустимо до 5%)';
    document.getElementById('resMaxPower').textContent = maxPowerKw.toFixed(1) + ' кВт (при ' + maxAmp + ' А)';
}

document.getElementById('voltage').addEventListener('change', calculateCable);
document.getElementById('material').addEventListener('change', calculateCable);
document.getElementById('installType').addEventListener('change', calculateCable);
document.getElementById('cosPhi').addEventListener('change', calculateCable);
document.getElementById('calcBtn').addEventListener('click', calculateCable);

document.getElementById('copyBtn').addEventListener('click', function() {
    var sec = document.getElementById('resSection').textContent;
    var note = document.getElementById('resMatNote').textContent;
    var breaker = document.getElementById('resBreaker').textContent;
    var power = document.getElementById('powerKw').value;
    var text = "Розрахунок кабелю (БудКальк):\n- Потужність: " + power + " кВт\n- Переріз: " + sec + " — " + note + "\n- Автомат: " + breaker;

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

calculateCable();
