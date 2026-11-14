import re,os
D='chokhatauri-site'
pages=sorted(f[:-5] for f in os.listdir(D) if f.endswith('.html'))
def rd(f): return open(os.path.join(D,f),encoding='utf-8').read()
def fix(t): return re.sub(r'href="([a-z0-9-]+)\.html"',lambda m:'href="#%s"'%('home' if m.group(1)=='index' else m.group(1)),t)
idx=rd('index.html')
header=fix(re.search(r'<header.*?</header>',idx,re.S).group(0))
footer=fix(re.search(r'<footer.*?</footer>',idx,re.S).group(0))
parts=[]
for p in pages:
    t=rd(p+'.html')
    body=t[t.index('</header>')+9:t.index('<footer>')]
    pid='home' if p=='index' else p
    parts.append('<main class="pg" id="pg-%s" hidden>%s</main>'%(pid,fix(body)))
css=rd('style.css')+"\n.reveal{opacity:1!important;transform:none!important}.site-header{top:env(safe-area-inset-top,0px)}\n"
js=rd('main.js')
router='''
function route(){var n=(location.hash||'#home').slice(1);var el=document.getElementById('pg-'+n);if(!el){n='home';el=document.getElementById('pg-home');}
document.querySelectorAll('.pg').forEach(function(m){m.hidden=m!==el});
var k=n.indexOf('monument')==0?'monuments':n.indexOf('craft')==0?'crafts':n.indexOf('sport')==0?'sports':n=='about'?'about':'';
document.querySelectorAll('.menu a').forEach(function(a){a.classList.toggle('active',a.getAttribute('href')=='#'+k)});
window.scrollTo(0,0);}
window.addEventListener('hashchange',route);route();
'''
out='<title>ჩოხატაურის მემკვიდრეობა</title>\n<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Georgian:wght@400;600&display=swap" rel="stylesheet">\n<style>'+css+'</style>\n'+header+'\n'+'\n'.join(parts)+'\n'+footer+'\n<script>'+js+router+'</script>\n'
open('site-single.html','w',encoding='utf-8').write(out)
print(len(out)//1024,'KB',len(pages),'pages')
