// Simple interactivity for dashboard
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const copyBtn = document.getElementById('copyBtn');
  const previewBtn = document.getElementById('previewBtn');
  const previewMobile = document.getElementById('previewMobile');
  const toast = document.getElementById('toast');
  const pagesStatus = document.getElementById('pagesStatus');

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(()=>toast.classList.remove('show'),2000);
  }

  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    themeToggle.textContent = document.documentElement.classList.contains('dark') ? 'Light' : 'Dark';
  });

  copyBtn.addEventListener('click', async ()=>{
    try{
      await navigator.clipboard.writeText(window.location.href);
      showToast('URL disalin');
    }catch(e){
      showToast('Gagal menyalin');
    }
  });

  previewBtn && previewBtn.addEventListener('click', ()=>{
    window.open('https://febianadwimulyani2007-hue.github.io/febi_web/','_blank');
  });
  previewMobile && previewMobile.addEventListener('click', ()=>{
    window.open('https://febianadwimulyani2007-hue.github.io/febi_web/','_blank');
  });

  // Poll simple Pages status via fetch to known URL (detect availability)
  async function checkPages(){
    try{
      const res = await fetch('https://febianadwimulyani2007-hue.github.io/febi_web/', {method:'HEAD', mode:'no-cors'});
      // If no-cors, we can't read status; optimistic message
      pagesStatus.textContent = 'Tersedia (cek manual jika perlu)';
    }catch(e){
      pagesStatus.textContent = 'Tidak tersedia atau diblokir oleh CORS';
    }
  }
  checkPages();

  // Theme persistence
  const saved = localStorage.getItem('theme');
  if(saved === 'dark') document.documentElement.classList.add('dark');

  // Counters animation
  const counters = document.querySelectorAll('.number');
  function animateCounters(){
    counters.forEach(el=>{
      const target = +el.dataset.target || 0;
      let cur = 0; const step = Math.max(1, Math.floor(target/60));
      const iv = setInterval(()=>{
        cur += step; if(cur >= target){el.textContent = target; clearInterval(iv)} else el.textContent = cur;
      },16);
    });
  }
  // Start when visible
  const obs = new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){animateCounters(); obs.disconnect();}})} ,{threshold:0.3});
  document.querySelectorAll('.counters .card').forEach(c=>obs.observe(c));

  // Accordion
  document.querySelectorAll('.accordion-item').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const open = btn.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
      const panel = btn.nextElementSibling;
      if(open) panel.style.display = 'block'; else panel.style.display = 'none';
    });
  });

  // Modal contact
  const modal = document.getElementById('modal');
  const closeModal = document.getElementById('closeModal');
  const modalCancel = document.getElementById('modalCancel');
  document.getElementById('downloadCv').addEventListener('click', (e)=>{e.preventDefault(); showToast('Fitur download belum diisi')});
  // Show modal when clicking contact link
  document.getElementById('contactForm') && (document.getElementById('contactForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const fd = new FormData(e.target);
    const msg = `Nama: ${fd.get('name')}\nEmail: ${fd.get('email')}\nPesan: ${fd.get('message')}`;
    showToast('Form dikirim (mailto)');
    window.location.href = `mailto:febiana@example.com?subject=Pesan%20dari%20situs&body=${encodeURIComponent(msg)}`;
  }));
  // Copy email
  const copyEmail = document.getElementById('copyEmail');
  copyEmail && copyEmail.addEventListener('click', async ()=>{
    try{ await navigator.clipboard.writeText('febiana@example.com'); showToast('Email disalin'); }
    catch(e){ showToast('Gagal menyalin email'); }
  });

  // Modal controls
  closeModal && closeModal.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); });
  modalCancel && modalCancel.addEventListener('click', ()=>{ modal.setAttribute('aria-hidden','true'); });
  // open modal when clicking contact card button (make card clickable)
  const contactCard = document.querySelector('.card.contact');
  contactCard && contactCard.addEventListener('dblclick', ()=>{ modal.setAttribute('aria-hidden','false'); });

  // Persist theme toggles
  themeToggle.addEventListener('click', ()=>{
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    themeToggle.textContent = isDark ? 'Light' : 'Dark';
  });

  // --- New interactive features ---
  const toggleLayout = document.getElementById('toggleLayout');
  const featuresGrid = document.querySelector('.features-grid');
  toggleLayout && toggleLayout.addEventListener('click', ()=>{
    featuresGrid.classList.toggle('list');
    showToast('Layout toggled');
  });

  // Randomize accent
  const randomAccent = document.getElementById('randomAccent');
  randomAccent && randomAccent.addEventListener('click', ()=>{
    const c = '#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
    document.documentElement.style.setProperty('--accent', c);
    localStorage.setItem('accent', c);
    showToast('Accent changed');
  });
  // restore accent
  const savedAccent = localStorage.getItem('accent'); if(savedAccent) document.documentElement.style.setProperty('--accent', savedAccent);

  // Todo list
  const todoInput = document.getElementById('todoInput');
  const todoAdd = document.getElementById('todoAdd');
  const todoList = document.getElementById('todoList');
  let todos = JSON.parse(localStorage.getItem('todos')||'[]');
  function renderTodos(){ todoList.innerHTML=''; todos.forEach((t,i)=>{
    const div = document.createElement('div'); div.className='todo-item'; div.innerHTML=`<span>${t}</span><button data-i="${i}">✕</button>`;
    div.querySelector('button').addEventListener('click', e=>{ todos.splice(i,1); saveRender(); });
    todoList.appendChild(div);
  }); }
  function saveRender(){ localStorage.setItem('todos', JSON.stringify(todos)); renderTodos(); }
  todoAdd && todoAdd.addEventListener('click', ()=>{ if(!todoInput.value) return showToast('Isi tugas'); todos.push(todoInput.value); todoInput.value=''; saveRender(); });
  renderTodos();

  // Clock
  const clockDisplay = document.getElementById('clockDisplay');
  function tick(){ const d=new Date(); clockDisplay.textContent = d.toLocaleTimeString(); }
  tick(); setInterval(tick,1000);

  // Rating
  const stars = document.getElementById('stars');
  if(stars){ const savedRating = localStorage.getItem('rating')||0; Array.from(stars.children).forEach(s=>{ const n=+s.dataset.star; if(n<=savedRating) s.classList.add('active'); s.addEventListener('click', ()=>{ localStorage.setItem('rating', n); Array.from(stars.children).forEach(x=>x.classList.toggle('active', +x.dataset.star<=n)); showToast('Terima kasih atas ratingnya'); }); }); }

  // Gallery modal
  const galleryModal = document.getElementById('galleryModal');
  const openGallery = document.getElementById('openGallery');
  const closeGallery = document.getElementById('closeGallery');
  openGallery && openGallery.addEventListener('click', ()=>{ galleryModal.setAttribute('aria-hidden','false'); });
  closeGallery && closeGallery.addEventListener('click', ()=>{ galleryModal.setAttribute('aria-hidden','true'); });

  // Share
  const shareBtn = document.getElementById('shareBtn');
  shareBtn && shareBtn.addEventListener('click', async ()=>{
    const shareData = {title:document.title,text:'Lihat situs Febiana',url:window.location.href};
    try{ if(navigator.share){ await navigator.share(shareData); } else { await navigator.clipboard.writeText(window.location.href); showToast('Link disalin'); } }
    catch(e){ showToast('Gagal share'); }
  });

  // Clear cache (hard reload)
  const clearCache = document.getElementById('clearCache');
  clearCache && clearCache.addEventListener('click', ()=>{ location.reload(true); });

  // Language toggle (simple)
  const langToggle = document.getElementById('langToggle');
  const texts = { en: { welcome: 'Hello, I am Febiana', lead:'A simple dashboard.' }, id: { welcome:'Halo, saya Febiana', lead:'Sebuah dashboard sederhana.' } };
  langToggle && langToggle.addEventListener('click', ()=>{
    const cur = document.documentElement.getAttribute('lang') || 'id'; const next = cur==='id' ? 'en' : 'id'; document.documentElement.setAttribute('lang', next);
    document.querySelector('.hero h1').textContent = texts[next].welcome; document.querySelector('.lead').textContent = texts[next].lead;
    showToast('Language: '+next);
  });

  // Preview button open
  previewBtn && previewBtn.addEventListener('click', ()=>{ window.open('https://febianadwimulyani2007-hue.github.io/febi_web/','_blank'); });

});
