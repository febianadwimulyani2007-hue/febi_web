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
});
