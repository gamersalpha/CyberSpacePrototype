import { Core } from './core.js';

const btnFit = document.getElementById('btnFit');
const btnLabels = document.getElementById('btnToggleLabels');
const btnSpread = document.getElementById('btnSpread');

btnFit.onclick = ()=>{ Core.state.controls.target.set(0,0,0); };
btnLabels.onclick = ()=>{
  Core.state.labelsEnabled = !Core.state.labelsEnabled;
  btnLabels.textContent = Core.state.labelsEnabled ? 'Masquer labels' : 'Afficher labels';
  Core.state.groups.nodes.children.forEach(m=>{
    const s=m.children.find(c=>c.type==='Sprite');
    if(s) s.visible = Core.state.labelsEnabled;
  });
};
btnSpread.onclick = ()=>{
  const { data, zoneVisuals, nodeMap } = Core.state;
  data.zones.forEach(z=>{
    const members = data.nodes.filter(n=>n.zone===z.id);
    const center = zoneVisuals.get(z.id).userData.center;
    const radius = Math.max(2, 1.2*Math.sqrt(Math.max(1,members.length))) + 1.6;
    members.forEach((n,i)=>{
      const a=(i/members.length)*Math.PI*2;
      const p = center.clone().add({x:Math.cos(a)*radius, y:.15, z:Math.sin(a)*radius});
      const m=nodeMap.get(n.id);
      m.position.set(p.x,p.y,p.z);
    });
  });
};
