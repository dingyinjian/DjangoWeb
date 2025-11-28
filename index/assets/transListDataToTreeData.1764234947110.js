function e(a){const c=[],n={};return a.forEach(r=>{n[r.id]=r,r.children=[]}),a.forEach(r=>{n[r.parent]?n[r.parent].children.push(r):c.push(r)}),c}export{e as t};
