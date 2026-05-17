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
});
