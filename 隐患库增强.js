(() => {
  const style = document.createElement('style');
  style.textContent = '.hazard-drawer{position:fixed;right:0;top:68px;width:min(760px,94vw);height:calc(100vh - 68px);background:#fff;z-index:1100;box-shadow:-14px 0 36px #0f172a2b;transform:translateX(105%);transition:transform .25s ease;overflow:auto}.hazard-drawer.open{transform:translateX(0)}.hazard-mask{position:fixed;inset:68px 0 0;background:#0f172a55;z-index:1099;display:none}.hazard-mask.open{display:block}.hd-section{margin:18px 22px;padding:18px;border:1px solid #dce6f2;border-radius:12px}.hd-section h3{font-weight:700;margin-bottom:14px;padding-left:9px}.hd-field{background:#f7faff;border:1px solid #e3edf8;border-radius:9px;padding:11px;margin:8px 0}.hd-field label{display:block;color:#66768d;font-size:12px;margin-bottom:5px}.hd-tabs{display:flex;gap:8px;border-bottom:1px solid #e5ebf3}.hd-tab{border:0;background:none;padding:8px 13px;color:#64748b;cursor:pointer}.hd-tab.active{color:#2563eb;border-bottom:2px solid #2563eb}.hd-thumb{width:58px;height:42px;background:#e9eff7;display:flex;align-items:center;justify-content:center;color:#718096;border-radius:5px}';
  document.head.appendChild(style);

  const mask = document.createElement('div');
  const drawer = document.createElement('aside');
  mask.className = 'hazard-mask';
  drawer.className = 'hazard-drawer';
  drawer.setAttribute('data-keep-sidebar', 'true');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.append(mask, drawer);

  const closeDetail = () => {
    mask.classList.remove('open');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
  };

  const openHazardDetail = row => {
    if (!row) return;
    const photoCount = row[5];
    const untrainedCount = Math.max(0, photoCount - 2);
    const trainedCount = Math.min(2, photoCount);
    drawer.innerHTML = `<div class="p-5 border-b flex justify-between sticky top-0 bg-white z-10"><div><div class="text-xs text-slate-500">隐患库 / 隐患详情</div><h2 class="text-lg font-semibold">${row[0]} · ${row[1]}</h2></div><button id="hazard-detail-close" type="button" aria-label="关闭隐患详情" class="text-2xl text-slate-500">×</button></div><div class="hd-section"><h3>隐患基础信息</h3><div class="hd-field"><label>隐患描述</label><b>${row[1]}</b></div><div class="grid grid-cols-2 gap-3"><div class="hd-field"><label>隐患分类</label><b>${row[2]}</b></div><div class="hd-field"><label>隐患等级</label><b>${row[3]}</b></div></div><div class="hd-field"><label>整改建议</label><b>立即组织整改，明确责任人和完成时限，整改完成后复核销项。</b></div><div class="hd-field"><label>合规依据</label><b>企业安全生产管理制度及相关行业安全检查标准。</b></div><div class="hd-field"><label>法律责任</label><b>未按规定整改并造成事故的，将依法承担相应责任。</b></div><div class="hd-field"><label>法律法规原文</label><b>生产经营单位应当及时发现并消除事故隐患。</b></div><div class="hd-field"><label>依据来源</label><b>《中华人民共和国安全生产法》及企业隐患排查治理制度</b></div></div><div class="hd-section"><h3>关联隐患台账（${row[4]} 条）</h3><div class="overflow-x-auto"><table class="w-full text-xs"><tr class="bg-slate-50"><th class="p-2">编号</th><th>隐患描述</th><th>分类</th><th>等级</th><th>发现时间</th><th>照片</th></tr><tr class="border-t"><td class="p-2">${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td><td>2026-08-28</td><td><div class="hd-thumb"><i class="fa fa-image"></i></div></td></tr></table></div></div><div class="hd-section"><h3>图片库（${photoCount} 张）</h3><div class="hd-tabs"><button class="hd-tab active" data-tab="all">全部 ${photoCount}</button><button class="hd-tab" data-tab="trained">已训练 ${trainedCount}</button><button class="hd-tab" data-tab="untrained">未训练 ${untrainedCount}</button><button class="hd-tab" data-tab="invalid">无效照片 0</button></div><div id="hazard-photos" class="grid grid-cols-3 gap-3 mt-4"></div></div>`;

    const photos = drawer.querySelector('#hazard-photos');
    const drawPhotos = filter => {
      photos.innerHTML = Array.from({ length: photoCount }, (_, index) => {
        const state = index < untrainedCount ? 'untrained' : 'trained';
        if (filter !== 'all' && filter !== state) return '';
        return `<div class="border rounded-lg p-2"><div class="h-24 bg-slate-100 rounded flex items-center justify-center"><i class="fa fa-image text-2xl text-slate-400"></i></div><div class="text-xs mt-2">${row[0]}-${index + 1}</div><div class="text-xs ${state === 'untrained' ? 'text-amber-700' : 'text-emerald-700'}">${state === 'untrained' ? '未训练' : '已训练'}</div></div>`;
      }).join('');
    };

    drawPhotos('all');
    drawer.querySelector('#hazard-detail-close').onclick = closeDetail;
    drawer.querySelectorAll('[data-tab]').forEach(button => {
      button.onclick = () => {
        drawer.querySelectorAll('.hd-tab').forEach(tab => tab.classList.toggle('active', tab === button));
        drawPhotos(button.dataset.tab);
      };
    });
    mask.classList.add('open');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.querySelector('#hazard-detail-close').focus();
  };

  mask.addEventListener('click', closeDetail);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && drawer.classList.contains('open')) closeDetail();
  });
  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-view]');
    if (!trigger) return;
    const cells = trigger.closest('tr')?.cells;
    if (!cells) return;
    const row = [
      trigger.dataset.view,
      cells[1].textContent.trim(),
      cells[2].textContent.trim(),
      cells[3].textContent.trim(),
      Number(cells[4].textContent.trim()),
      Number(cells[5].textContent.trim()),
      Number(cells[6].textContent.trim()),
      cells[7].textContent.trim()
    ];
    event.preventDefault();
    event.stopImmediatePropagation();
    openHazardDetail(row);
  }, true);

  window.openHazardDetail = openHazardDetail;
  // 兼容隐患库原有行内点击逻辑：旧代码调用 show(...) 时仍打开同一详情抽屉。
  window.show = openHazardDetail;
})();
