// Basic interactions for the panel demo
document.addEventListener('DOMContentLoaded', function(){
  const parcels = {
    1: {moisture:45, temp:28, water:120},
    2: {moisture:32, temp:30, water:90},
    3: {moisture:56, temp:25, water:110}
  };

  const parcelList = document.getElementById('parcel-list');
  const moistureEl = document.getElementById('moisture');
  const tempEl = document.getElementById('temp');
  const waterEl = document.getElementById('water');
  const chart = document.getElementById('chart');
  const refreshBtn = document.getElementById('refresh-btn');
  const exportBtn = document.getElementById('export-btn');
  const logOutput = document.getElementById('log-output');
  const activitySelect = document.getElementById('activity-select');
  const activityNote = document.getElementById('activity-note');
  const logBtn = document.getElementById('log-btn');

  let current = 1;

  function setActiveParcel(id){
    current = id;
    // update active class
    parcelList.querySelectorAll('li').forEach(li=>li.classList.remove('active'));
    const activeLi = parcelList.querySelector('li[data-id="'+id+'"]');
    if(activeLi) activeLi.classList.add('active');
    renderStats();
  }

  function renderStats(){
    const p = parcels[current];
    moistureEl.textContent = p.moisture + ' %';
    tempEl.textContent = p.temp + ' °C';
    waterEl.textContent = p.water + ' L';
    renderChart();
  }

  function renderChart(){
    // simple sparkline-like bars
    const p = parcels[current];
    const values = [p.moisture - 5, p.moisture - 2, p.moisture, p.moisture + 3, p.moisture - 1];
    chart.innerHTML = '';
    const w = 600, h = 120, pad = 8;
    const maxv = Math.max(...values);
    values.forEach((v,i)=>{
      const barH = Math.round((v / maxv) * (h - 20));
      const x = pad + i*( (w-pad*2)/values.length );
      const rect = document.createElementNS('http://www.w3.org/2000/svg','rect');
      rect.setAttribute('x', x);
      rect.setAttribute('y', h - barH - 10);
      rect.setAttribute('width', 30);
      rect.setAttribute('height', barH);
      rect.setAttribute('rx', 6);
      rect.setAttribute('fill', 'rgba(31,138,112,0.9)');
      chart.appendChild(rect);
    });
  }

  // parcel select
  parcelList.querySelectorAll('li').forEach(li=>li.addEventListener('click', ()=>{
    setActiveParcel(parseInt(li.dataset.id));
  }));

  // initial render
  setActiveParcel(1);

  // refresh simulation (random small changes)
  refreshBtn.addEventListener('click', ()=>{
    Object.keys(parcels).forEach(k=>{
      parcels[k].moisture = Math.max(12, Math.min(90, parcels[k].moisture + (Math.random()*8 - 4)));
      parcels[k].temp = Math.max(10, Math.min(42, parcels[k].temp + (Math.random()*2 - 1)));
      parcels[k].water = Math.max(20, Math.min(500, parcels[k].water + Math.round(Math.random()*20 - 10)));
    });
    renderStats();
  });

  // export CSV
  exportBtn.addEventListener('click', ()=>{
    const rows = [['parcela','humedad','temp','agua']];
    Object.keys(parcels).forEach(k=>{
      const p = parcels[k];
      rows.push([k,p.moisture,p.temp,p.water]);
    });
    const csv = rows.map(r=>r.join(',')).join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'parcels.csv'; document.body.appendChild(a); a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  // logging activities
  logBtn.addEventListener('click', ()=>{
    const act = activitySelect.value;
    const note = activityNote.value.trim();
    const now = new Date().toLocaleString();
    const p = parcels[current];
    const entry = document.createElement('div');
    entry.textContent = `[${now}] Parcela ${current} — ${act} — ${note}`;
    logOutput.prepend(entry);
    activityNote.value='';
  });

  // contact form friendly message
  const form = document.getElementById('contact-form');
  form && form.addEventListener('submit', ()=>{
    setTimeout(()=>{ alert('Gracias — tu mensaje fue enviado.'); }, 100);
  });

  // fill year
  document.getElementById('year').textContent = new Date().getFullYear();
});