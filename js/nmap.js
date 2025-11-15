import { Core, addNodes } from './core.js';

function guessType(ports){
  const ids=new Set(ports.map(p=>+p.portid));
  if(ids.has(515)||ids.has(9100)) return 'printer';
  if(ids.has(445)||ids.has(139)||ids.has(2049)) return 'nas';
  if(ids.has(22)) return 'router';
  if(ids.has(80)||ids.has(443)||ids.has(8080)) return 'pc';
  return 'pc';
}

function importXml(txt,{replace=false, ipPrefix='192.168.1.'}={}){
  const doc = new DOMParser().parseFromString(txt,'application/xml');
  const hosts=[...doc.querySelectorAll('host')];
  const added=[];
  if(replace){
    Core.state.data.nodes.length=0;
    Core.state.nodeMap.clear();
    Core.state.groups.nodes.clear();
  }
  hosts.forEach(h=>{
    const addr=h.querySelector('address[type="ipv4"], address[type="ipv6"], address');
    if(!addr) return;
    const ip=addr.getAttribute('addr');
    const st=h.querySelector('status')?.getAttribute('state')||'unknown';
    if(st!=='up') return;
    const name=h.querySelector('hostnames hostname')?.getAttribute('name');
    const ports=[...h.querySelectorAll('port')].map(p=>({
      portid: p.getAttribute('portid'),
      protocol: p.getAttribute('protocol')||'tcp',
      state: p.querySelector('state')?.getAttribute('state')||'',
      service: p.querySelector('service')?.getAttribute('name')||''
    }));
    const type=guessType(ports);
    const id=`nmap-${ip.replace(/[:\.]/g,'-')}`;
    if(Core.state.data.nodes.some(n=>n.id===id)) return;
    const zone = ip?.startsWith(ipPrefix) ? 'lan-home' : null;
    const node={id,label:name||ip,type,ip,zone,nmap:{ports}};
    Core.state.data.nodes.push(node);
    added.push(node);
  });
  addNodes();
  return added;
}

// file input wiring
const input = document.createElement('input');
input.type='file';
input.accept='.xml';
input.style.display='none';
document.body.appendChild(input);

document.getElementById('btnLoadXml').onclick = ()=> input.click();
document.getElementById('btnReplace').onclick = (e)=> e.currentTarget.classList.toggle('active');

input.addEventListener('change', async (ev)=>{
  const f=ev.target.files[0];
  if(!f) return;
  const txt=await f.text();
  const replace=document.getElementById('btnReplace').classList.contains('active');
  const nodes=importXml(txt,{replace});
  alert(`Importé ${nodes.length} hôtes.`);
});
