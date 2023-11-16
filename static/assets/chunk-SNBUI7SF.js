import{A as Ie,B as R,C as Le,D as U,E as ne,a as N,b as F,c as C,f as ye,g as re,h as xe,i as D,j as u,k as y,l as z,m as v,n as ke,o as Ne,p as l,q as k,r as w,s as V,t as x,u as W,v as S,w as A,x as B,y as I,z as T}from"./chunk-EM767CKZ.js";import{J as $,X as ge,ca as ee}from"./chunk-Y2SMFNMK.js";var xr="\0",j="\0",Ce="",b=class{constructor(r={}){this._isDirected=l(r,"directed")?r.directed:!0,this._isMultigraph=l(r,"multigraph")?r.multigraph:!1,this._isCompound=l(r,"compound")?r.compound:!1,this._label=void 0,this._defaultNodeLabelFn=N(void 0),this._defaultEdgeLabelFn=N(void 0),this._nodes={},this._isCompound&&(this._parent={},this._children={},this._children[j]={}),this._in={},this._preds={},this._out={},this._sucs={},this._edgeObjs={},this._edgeLabels={}}isDirected(){return this._isDirected}isMultigraph(){return this._isMultigraph}isCompound(){return this._isCompound}setGraph(r){return this._label=r,this}graph(){return this._label}setDefaultNodeLabel(r){return $(r)||(r=N(r)),this._defaultNodeLabelFn=r,this}nodeCount(){return this._nodeCount}nodes(){return F(this._nodes)}sources(){var r=this;return y(this.nodes(),function(n){return ee(r._in[n])})}sinks(){var r=this;return y(this.nodes(),function(n){return ee(r._out[n])})}setNodes(r,n){var t=arguments,i=this;return u(r,function(o){t.length>1?i.setNode(o,n):i.setNode(o)}),this}setNode(r,n){return l(this._nodes,r)?(arguments.length>1&&(this._nodes[r]=n),this):(this._nodes[r]=arguments.length>1?n:this._defaultNodeLabelFn(r),this._isCompound&&(this._parent[r]=j,this._children[r]={},this._children[j][r]=!0),this._in[r]={},this._preds[r]={},this._out[r]={},this._sucs[r]={},++this._nodeCount,this)}node(r){return this._nodes[r]}hasNode(r){return l(this._nodes,r)}removeNode(r){var n=this;if(l(this._nodes,r)){var t=function(i){n.removeEdge(n._edgeObjs[i])};delete this._nodes[r],this._isCompound&&(this._removeFromParentsChildList(r),delete this._parent[r],u(this.children(r),function(i){n.setParent(i)}),delete this._children[r]),u(F(this._in[r]),t),delete this._in[r],delete this._preds[r],u(F(this._out[r]),t),delete this._out[r],delete this._sucs[r],--this._nodeCount}return this}setParent(r,n){if(!this._isCompound)throw new Error("Cannot set parent in a non-compound graph");if(w(n))n=j;else{n+="";for(var t=n;!w(t);t=this.parent(t))if(t===r)throw new Error("Setting "+n+" as parent of "+r+" would create a cycle");this.setNode(n)}return this.setNode(r),this._removeFromParentsChildList(r),this._parent[r]=n,this._children[n][r]=!0,this}_removeFromParentsChildList(r){delete this._children[this._parent[r]][r]}parent(r){if(this._isCompound){var n=this._parent[r];if(n!==j)return n}}children(r){if(w(r)&&(r=j),this._isCompound){var n=this._children[r];if(n)return F(n)}else{if(r===j)return this.nodes();if(this.hasNode(r))return[]}}predecessors(r){var n=this._preds[r];if(n)return F(n)}successors(r){var n=this._sucs[r];if(n)return F(n)}neighbors(r){var n=this.predecessors(r);if(n)return Le(n,this.successors(r))}isLeaf(r){var n;return this.isDirected()?n=this.successors(r):n=this.neighbors(r),n.length===0}filterNodes(r){var n=new this.constructor({directed:this._isDirected,multigraph:this._isMultigraph,compound:this._isCompound});n.setGraph(this.graph());var t=this;u(this._nodes,function(a,s){r(s)&&n.setNode(s,a)}),u(this._edgeObjs,function(a){n.hasNode(a.v)&&n.hasNode(a.w)&&n.setEdge(a,t.edge(a))});var i={};function o(a){var s=t.parent(a);return s===void 0||n.hasNode(s)?(i[a]=s,s):s in i?i[s]:o(s)}return this._isCompound&&u(n.nodes(),function(a){n.setParent(a,o(a))}),n}setDefaultEdgeLabel(r){return $(r)||(r=N(r)),this._defaultEdgeLabelFn=r,this}edgeCount(){return this._edgeCount}edges(){return k(this._edgeObjs)}setPath(r,n){var t=this,i=arguments;return T(r,function(o,a){return i.length>1?t.setEdge(o,a,n):t.setEdge(o,a),a}),this}setEdge(){var r,n,t,i,o=!1,a=arguments[0];typeof a=="object"&&a!==null&&"v"in a?(r=a.v,n=a.w,t=a.name,arguments.length===2&&(i=arguments[1],o=!0)):(r=a,n=arguments[1],t=arguments[3],arguments.length>2&&(i=arguments[2],o=!0)),r=""+r,n=""+n,w(t)||(t=""+t);var s=q(this._isDirected,r,n,t);if(l(this._edgeLabels,s))return o&&(this._edgeLabels[s]=i),this;if(!w(t)&&!this._isMultigraph)throw new Error("Cannot set a named edge when isMultigraph = false");this.setNode(r),this.setNode(n),this._edgeLabels[s]=o?i:this._defaultEdgeLabelFn(r,n,t);var f=kr(this._isDirected,r,n,t);return r=f.v,n=f.w,Object.freeze(f),this._edgeObjs[s]=f,Te(this._preds[n],r),Te(this._sucs[r],n),this._in[n][s]=f,this._out[r][s]=f,this._edgeCount++,this}edge(r,n,t){var i=arguments.length===1?te(this._isDirected,arguments[0]):q(this._isDirected,r,n,t);return this._edgeLabels[i]}hasEdge(r,n,t){var i=arguments.length===1?te(this._isDirected,arguments[0]):q(this._isDirected,r,n,t);return l(this._edgeLabels,i)}removeEdge(r,n,t){var i=arguments.length===1?te(this._isDirected,arguments[0]):q(this._isDirected,r,n,t),o=this._edgeObjs[i];return o&&(r=o.v,n=o.w,delete this._edgeLabels[i],delete this._edgeObjs[i],Re(this._preds[n],r),Re(this._sucs[r],n),delete this._in[n][i],delete this._out[r][i],this._edgeCount--),this}inEdges(r,n){var t=this._in[r];if(t){var i=k(t);return n?y(i,function(o){return o.v===n}):i}}outEdges(r,n){var t=this._out[r];if(t){var i=k(t);return n?y(i,function(o){return o.w===n}):i}}nodeEdges(r,n){var t=this.inEdges(r,n);if(t)return t.concat(this.outEdges(r,n))}};b.prototype._nodeCount=0;b.prototype._edgeCount=0;function Te(e,r){e[r]?e[r]++:e[r]=1}function Re(e,r){--e[r]||delete e[r]}function q(e,r,n,t){var i=""+r,o=""+n;if(!e&&i>o){var a=i;i=o,o=a}return i+Ce+o+Ce+(w(t)?xr:t)}function kr(e,r,n,t){var i=""+r,o=""+n;if(!e&&i>o){var a=i;i=o,o=a}var s={v:i,w:o};return t&&(s.name=t),s}function te(e,r){return q(e,r.v,r.w,r.name)}function L(e,r,n,t){var i;do i=U(t);while(e.hasNode(i));return n.dummy=r,e.setNode(i,n),i}function Se(e){var r=new b().setGraph(e.graph());return u(e.nodes(),function(n){r.setNode(n,e.node(n))}),u(e.edges(),function(n){var t=r.edge(n.v,n.w)||{weight:0,minlen:1},i=e.edge(n);r.setEdge(n.v,n.w,{weight:t.weight+i.weight,minlen:Math.max(t.minlen,i.minlen)})}),r}function K(e){var r=new b({multigraph:e.isMultigraph()}).setGraph(e.graph());return u(e.nodes(),function(n){e.children(n).length||r.setNode(n,e.node(n))}),u(e.edges(),function(n){r.setEdge(n,e.edge(n))}),r}function ie(e,r){var n=e.x,t=e.y,i=r.x-n,o=r.y-t,a=e.width/2,s=e.height/2;if(!i&&!o)throw new Error("Not possible to find intersection inside of the rectangle");var f,d;return Math.abs(o)*a>Math.abs(i)*s?(o<0&&(s=-s),f=s*i/o,d=s):(i<0&&(a=-a),f=a,d=a*o/i),{x:n+f,y:t+d}}function M(e){var r=v(I(ae(e)+1),function(){return[]});return u(e.nodes(),function(n){var t=e.node(n),i=t.rank;w(i)||(r[i][t.order]=n)}),r}function Me(e){var r=S(v(e.nodes(),function(n){return e.node(n).rank}));u(e.nodes(),function(n){var t=e.node(n);l(t,"rank")&&(t.rank-=r)})}function Pe(e){var r=S(v(e.nodes(),function(o){return e.node(o).rank})),n=[];u(e.nodes(),function(o){var a=e.node(o).rank-r;n[a]||(n[a]=[]),n[a].push(o)});var t=0,i=e.graph().nodeRankFactor;u(n,function(o,a){w(o)&&a%i!==0?--t:t&&u(o,function(s){e.node(s).rank+=t})})}function oe(e,r,n,t){var i={width:0,height:0};return arguments.length>=4&&(i.rank=n,i.order=t),L(e,"border",i,r)}function ae(e){return x(v(e.nodes(),function(r){var n=e.node(r).rank;if(!w(n))return n}))}function Oe(e,r){var n={lhs:[],rhs:[]};return u(e,function(t){r(t)?n.lhs.push(t):n.rhs.push(t)}),n}function Fe(e,r){var n=re();try{return r()}finally{console.log(e+" time: "+(re()-n)+"ms")}}function De(e,r){return r()}function Ge(e){function r(n){var t=e.children(n),i=e.node(n);if(t.length&&u(t,r),l(i,"minRank")){i.borderLeft=[],i.borderRight=[];for(var o=i.minRank,a=i.maxRank+1;o<a;++o)je(e,"borderLeft","_bl",n,i,o),je(e,"borderRight","_br",n,i,o)}}u(e.children(),r)}function je(e,r,n,t,i,o){var a={width:0,height:0,rank:o,borderType:r},s=i[r][o-1],f=L(e,"border",a,n);i[r][o]=f,e.setParent(f,t),s&&e.setEdge(s,f,{weight:1})}function Ae(e){var r=e.graph().rankdir.toLowerCase();(r==="lr"||r==="rl")&&Ue(e)}function Be(e){var r=e.graph().rankdir.toLowerCase();(r==="bt"||r==="rl")&&Nr(e),(r==="lr"||r==="rl")&&(Ir(e),Ue(e))}function Ue(e){u(e.nodes(),function(r){Ve(e.node(r))}),u(e.edges(),function(r){Ve(e.edge(r))})}function Ve(e){var r=e.width;e.width=e.height,e.height=r}function Nr(e){u(e.nodes(),function(r){se(e.node(r))}),u(e.edges(),function(r){var n=e.edge(r);u(n.points,se),l(n,"y")&&se(n)})}function se(e){e.y=-e.y}function Ir(e){u(e.nodes(),function(r){ue(e.node(r))}),u(e.edges(),function(r){var n=e.edge(r);u(n.points,ue),l(n,"x")&&ue(n)})}function ue(e){var r=e.x;e.x=e.y,e.y=r}var J=class{constructor(){var r={};r._next=r._prev=r,this._sentinel=r}dequeue(){var r=this._sentinel,n=r._prev;if(n!==r)return Ye(n),n}enqueue(r){var n=this._sentinel;r._prev&&r._next&&Ye(r),r._next=n._next,n._next._prev=r,n._next=r,r._prev=n}toString(){for(var r=[],n=this._sentinel,t=n._prev;t!==n;)r.push(JSON.stringify(t,Cr)),t=t._prev;return"["+r.join(", ")+"]"}};function Ye(e){e._prev._next=e._next,e._next._prev=e._prev,delete e._next,delete e._prev}function Cr(e,r){if(e!=="_next"&&e!=="_prev")return r}var Tr=N(1);function ze(e,r){if(e.nodeCount()<=1)return[];var n=Sr(e,r||Tr),t=Rr(n.graph,n.buckets,n.zeroIdx);return C(v(t,function(i){return e.outEdges(i.v,i.w)}))}function Rr(e,r,n){for(var t=[],i=r[r.length-1],o=r[0],a;e.nodeCount();){for(;a=o.dequeue();)fe(e,r,n,a);for(;a=i.dequeue();)fe(e,r,n,a);if(e.nodeCount()){for(var s=r.length-2;s>0;--s)if(a=r[s].dequeue(),a){t=t.concat(fe(e,r,n,a,!0));break}}}return t}function fe(e,r,n,t,i){var o=i?[]:void 0;return u(e.inEdges(t.v),function(a){var s=e.edge(a),f=e.node(a.v);i&&o.push({v:a.v,w:a.w}),f.out-=s,de(r,n,f)}),u(e.outEdges(t.v),function(a){var s=e.edge(a),f=a.w,d=e.node(f);d.in-=s,de(r,n,d)}),e.removeNode(t.v),o}function Sr(e,r){var n=new b,t=0,i=0;u(e.nodes(),function(s){n.setNode(s,{v:s,in:0,out:0})}),u(e.edges(),function(s){var f=n.edge(s.v,s.w)||0,d=r(s),h=f+d;n.setEdge(s.v,s.w,h),i=Math.max(i,n.node(s.v).out+=d),t=Math.max(t,n.node(s.w).in+=d)});var o=I(i+t+3).map(function(){return new J}),a=t+1;return u(n.nodes(),function(s){de(o,a,n.node(s))}),{graph:n,buckets:o,zeroIdx:a}}function de(e,r,n){n.out?n.in?e[n.out-n.in+r].enqueue(n):e[e.length-1].enqueue(n):e[0].enqueue(n)}function We(e){var r=e.graph().acyclicer==="greedy"?ze(e,n(e)):Mr(e);u(r,function(t){var i=e.edge(t);e.removeEdge(t),i.forwardName=t.name,i.reversed=!0,e.setEdge(t.w,t.v,i,U("rev"))});function n(t){return function(i){return t.edge(i).weight}}}function Mr(e){var r=[],n={},t={};function i(o){l(t,o)||(t[o]=!0,n[o]=!0,u(e.outEdges(o),function(a){l(n,a.w)?r.push(a):i(a.w)}),delete n[o])}return u(e.nodes(),i),r}function qe(e){u(e.edges(),function(r){var n=e.edge(r);if(n.reversed){e.removeEdge(r);var t=n.forwardName;delete n.reversed,delete n.forwardName,e.setEdge(r.w,r.v,n,t)}})}function He(e){e.graph().dummyChains=[],u(e.edges(),function(r){Pr(e,r)})}function Pr(e,r){var n=r.v,t=e.node(n).rank,i=r.w,o=e.node(i).rank,a=r.name,s=e.edge(r),f=s.labelRank;if(o!==t+1){e.removeEdge(r);var d,h,c;for(c=0,++t;t<o;++c,++t)s.points=[],h={width:0,height:0,edgeLabel:s,edgeObj:r,rank:t},d=L(e,"edge",h,"_d"),t===f&&(h.width=s.width,h.height=s.height,h.dummy="edge-label",h.labelpos=s.labelpos),e.setEdge(n,d,{weight:s.weight},a),c===0&&e.graph().dummyChains.push(d),n=d;e.setEdge(n,i,{weight:s.weight},a)}}function Ke(e){u(e.graph().dummyChains,function(r){var n=e.node(r),t=n.edgeLabel,i;for(e.setEdge(n.edgeObj,t);n.dummy;)i=e.successors(r)[0],e.removeNode(r),t.points.push({x:n.x,y:n.y}),n.dummy==="edge-label"&&(t.x=n.x,t.y=n.y,t.width=n.width,t.height=n.height),r=i,n=e.node(r)})}function X(e){var r={};function n(t){var i=e.node(t);if(l(r,t))return i.rank;r[t]=!0;var o=S(v(e.outEdges(t),function(a){return n(a.w)-e.edge(a).minlen}));return(o===Number.POSITIVE_INFINITY||o===void 0||o===null)&&(o=0),i.rank=o}u(e.sources(),n)}function G(e,r){return e.node(r.w).rank-e.node(r.v).rank-e.edge(r).minlen}function Q(e){var r=new b({directed:!1}),n=e.nodes()[0],t=e.nodeCount();r.setNode(n,{});for(var i,o;Or(r,e)<t;)i=Fr(r,e),o=r.hasNode(i.v)?G(e,i):-G(e,i),Dr(r,e,o);return r}function Or(e,r){function n(t){u(r.nodeEdges(t),function(i){var o=i.v,a=t===o?i.w:o;!e.hasNode(a)&&!G(r,i)&&(e.setNode(a,{}),e.setEdge(t,a,{}),n(a))})}return u(e.nodes(),n),e.nodeCount()}function Fr(e,r){return A(r.edges(),function(n){if(e.hasNode(n.v)!==e.hasNode(n.w))return G(r,n)})}function Dr(e,r,n){u(e.nodes(),function(t){r.node(t).rank+=n})}var at=N(1);var lt=N(1);he.CycleException=H;function he(e){var r={},n={},t=[];function i(o){if(l(n,o))throw new H;l(r,o)||(n[o]=!0,r[o]=!0,u(e.predecessors(o),i),delete n[o],t.push(o))}if(u(e.sinks(),i),Ie(r)!==e.nodeCount())throw new H;return t}function H(){}H.prototype=new Error;function Z(e,r,n){ge(r)||(r=[r]);var t=(e.isDirected()?e.successors:e.neighbors).bind(e),i=[],o={};return u(r,function(a){if(!e.hasNode(a))throw new Error("Graph does not have node: "+a);Qe(e,a,n==="post",o,t,i)}),i}function Qe(e,r,n,t,i,o){l(t,r)||(t[r]=!0,n||o.push(r),u(i(r),function(a){Qe(e,a,n,t,i,o)}),n&&o.push(r))}function ce(e,r){return Z(e,r,"post")}function le(e,r){return Z(e,r,"pre")}O.initLowLimValues=_e;O.initCutValues=pe;O.calcCutValue=$e;O.leaveEdge=rr;O.enterEdge=nr;O.exchangeEdges=tr;function O(e){e=Se(e),X(e);var r=Q(e);_e(r),pe(r,e);for(var n,t;n=rr(r);)t=nr(r,e,n),tr(r,e,n,t)}function pe(e,r){var n=ce(e,e.nodes());n=n.slice(0,n.length-1),u(n,function(t){Br(e,r,t)})}function Br(e,r,n){var t=e.node(n),i=t.parent;e.edge(n,i).cutvalue=$e(e,r,n)}function $e(e,r,n){var t=e.node(n),i=t.parent,o=!0,a=r.edge(n,i),s=0;return a||(o=!1,a=r.edge(i,n)),s=a.weight,u(r.nodeEdges(n),function(f){var d=f.v===n,h=d?f.w:f.v;if(h!==i){var c=d===o,p=r.edge(f).weight;if(s+=c?p:-p,Yr(e,n,h)){var _=e.edge(n,h).cutvalue;s+=c?-_:_}}}),s}function _e(e,r){arguments.length<2&&(r=e.nodes()[0]),er(e,{},1,r)}function er(e,r,n,t,i){var o=n,a=e.node(t);return r[t]=!0,u(e.neighbors(t),function(s){l(r,s)||(n=er(e,r,n,s,t))}),a.low=o,a.lim=n++,i?a.parent=i:delete a.parent,n}function rr(e){return z(e.edges(),function(r){return e.edge(r).cutvalue<0})}function nr(e,r,n){var t=n.v,i=n.w;r.hasEdge(t,i)||(t=n.w,i=n.v);var o=e.node(t),a=e.node(i),s=o,f=!1;o.lim>a.lim&&(s=a,f=!0);var d=y(r.edges(),function(h){return f===Ze(e,e.node(h.v),s)&&f!==Ze(e,e.node(h.w),s)});return A(d,function(h){return G(r,h)})}function tr(e,r,n,t){var i=n.v,o=n.w;e.removeEdge(i,o),e.setEdge(t.v,t.w,{}),_e(e),pe(e,r),Ur(e,r)}function Ur(e,r){var n=z(e.nodes(),function(i){return!r.node(i).parent}),t=le(e,n);t=t.slice(1),u(t,function(i){var o=e.node(i).parent,a=r.edge(i,o),s=!1;a||(a=r.edge(o,i),s=!0),r.node(i).rank=r.node(o).rank+(s?a.minlen:-a.minlen)})}function Yr(e,r,n){return e.hasEdge(r,n)}function Ze(e,r,n){return n.low<=r.lim&&r.lim<=n.lim}function me(e){switch(e.graph().ranker){case"network-simplex":ir(e);break;case"tight-tree":Wr(e);break;case"longest-path":zr(e);break;default:ir(e)}}var zr=X;function Wr(e){X(e),Q(e)}function ir(e){O(e)}function or(e){var r=L(e,"root",{},"_root"),n=qr(e),t=x(k(n))-1,i=2*t+1;e.graph().nestingRoot=r,u(e.edges(),function(a){e.edge(a).minlen*=i});var o=Xr(e)+1;u(e.children(),function(a){ar(e,r,i,o,t,n,a)}),e.graph().nodeRankFactor=i}function ar(e,r,n,t,i,o,a){var s=e.children(a);if(!s.length){a!==r&&e.setEdge(r,a,{weight:0,minlen:n});return}var f=oe(e,"_bt"),d=oe(e,"_bb"),h=e.node(a);e.setParent(f,a),h.borderTop=f,e.setParent(d,a),h.borderBottom=d,u(s,function(c){ar(e,r,n,t,i,o,c);var p=e.node(c),_=p.borderTop?p.borderTop:c,m=p.borderBottom?p.borderBottom:c,g=p.borderTop?t:2*t,Y=_!==m?1:i-o[a]+1;e.setEdge(f,_,{weight:g,minlen:Y,nestingEdge:!0}),e.setEdge(m,d,{weight:g,minlen:Y,nestingEdge:!0})}),e.parent(a)||e.setEdge(r,f,{weight:0,minlen:i+o[a]})}function qr(e){var r={};function n(t,i){var o=e.children(t);o&&o.length&&u(o,function(a){n(a,i+1)}),r[t]=i}return u(e.children(),function(t){n(t,1)}),r}function Xr(e){return T(e.edges(),function(r,n){return r+e.edge(n).weight},0)}function sr(e){var r=e.graph();e.removeNode(r.nestingRoot),delete r.nestingRoot,u(e.edges(),function(n){var t=e.edge(n);t.nestingEdge&&e.removeEdge(n)})}function ur(e,r,n){var t={},i;u(n,function(o){for(var a=e.parent(o),s,f;a;){if(s=e.parent(a),s?(f=t[s],t[s]=a):(f=i,i=a),f&&f!==a){r.setEdge(f,a);return}a=s}})}function fr(e,r,n){var t=Kr(e),i=new b({compound:!0}).setGraph({root:t}).setDefaultNodeLabel(function(o){return e.node(o)});return u(e.nodes(),function(o){var a=e.node(o),s=e.parent(o);(a.rank===r||a.minRank<=r&&r<=a.maxRank)&&(i.setNode(o),i.setParent(o,s||t),u(e[n](o),function(f){var d=f.v===o?f.w:f.v,h=i.edge(d,o),c=w(h)?0:h.weight;i.setEdge(d,o,{weight:e.edge(f).weight+c})}),l(a,"minRank")&&i.setNode(o,{borderLeft:a.borderLeft[r],borderRight:a.borderRight[r]}))}),i}function Kr(e){for(var r;e.hasNode(r=U("_root")););return r}function dr(e,r){for(var n=0,t=1;t<r.length;++t)n+=Jr(e,r[t-1],r[t]);return n}function Jr(e,r,n){for(var t=ne(n,v(n,function(d,h){return h})),i=C(v(r,function(d){return R(v(e.outEdges(d),function(h){return{pos:t[h.w],weight:e.edge(h).weight}}),"pos")})),o=1;o<n.length;)o<<=1;var a=2*o-1;o-=1;var s=v(new Array(a),function(){return 0}),f=0;return u(i.forEach(function(d){var h=d.pos+o;s[h]+=d.weight;for(var c=0;h>0;)h%2&&(c+=s[h+1]),h=h-1>>1,s[h]+=d.weight;f+=d.weight*c})),f}function hr(e){var r={},n=y(e.nodes(),function(s){return!e.children(s).length}),t=x(v(n,function(s){return e.node(s).rank})),i=v(I(t+1),function(){return[]});function o(s){if(!l(r,s)){r[s]=!0;var f=e.node(s);i[f.rank].push(s),u(e.successors(s),o)}}var a=R(n,function(s){return e.node(s).rank});return u(a,o),i}function cr(e,r){return v(r,function(n){var t=e.inEdges(n);if(t.length){var i=T(t,function(o,a){var s=e.edge(a),f=e.node(a.v);return{sum:o.sum+s.weight*f.order,weight:o.weight+s.weight}},{sum:0,weight:0});return{v:n,barycenter:i.sum/i.weight,weight:i.weight}}else return{v:n}})}function lr(e,r){var n={};u(e,function(i,o){var a=n[i.v]={indegree:0,in:[],out:[],vs:[i.v],i:o};w(i.barycenter)||(a.barycenter=i.barycenter,a.weight=i.weight)}),u(r.edges(),function(i){var o=n[i.v],a=n[i.w];!w(o)&&!w(a)&&(a.indegree++,o.out.push(n[i.w]))});var t=y(n,function(i){return!i.indegree});return Qr(t)}function Qr(e){var r=[];function n(o){return function(a){a.merged||(w(a.barycenter)||w(o.barycenter)||a.barycenter>=o.barycenter)&&Zr(o,a)}}function t(o){return function(a){a.in.push(o),--a.indegree===0&&e.push(a)}}for(;e.length;){var i=e.pop();r.push(i),u(i.in.reverse(),n(i)),u(i.out,t(i))}return v(y(r,function(o){return!o.merged}),function(o){return B(o,["vs","i","barycenter","weight"])})}function Zr(e,r){var n=0,t=0;e.weight&&(n+=e.barycenter*e.weight,t+=e.weight),r.weight&&(n+=r.barycenter*r.weight,t+=r.weight),e.vs=r.vs.concat(e.vs),e.barycenter=n/t,e.weight=t,e.i=Math.min(r.i,e.i),r.merged=!0}function _r(e,r){var n=Oe(e,function(h){return l(h,"barycenter")}),t=n.lhs,i=R(n.rhs,function(h){return-h.i}),o=[],a=0,s=0,f=0;t.sort($r(!!r)),f=pr(o,i,f),u(t,function(h){f+=h.vs.length,o.push(h.vs),a+=h.barycenter*h.weight,s+=h.weight,f=pr(o,i,f)});var d={vs:C(o)};return s&&(d.barycenter=a/s,d.weight=s),d}function pr(e,r,n){for(var t;r.length&&(t=D(r)).i<=n;)r.pop(),e.push(t.vs),n++;return n}function $r(e){return function(r,n){return r.barycenter<n.barycenter?-1:r.barycenter>n.barycenter?1:e?n.i-r.i:r.i-n.i}}function ve(e,r,n,t){var i=e.children(r),o=e.node(r),a=o?o.borderLeft:void 0,s=o?o.borderRight:void 0,f={};a&&(i=y(i,function(m){return m!==a&&m!==s}));var d=cr(e,i);u(d,function(m){if(e.children(m.v).length){var g=ve(e,m.v,n,t);f[m.v]=g,l(g,"barycenter")&&rn(m,g)}});var h=lr(d,n);en(h,f);var c=_r(h,t);if(a&&(c.vs=C([a,c.vs,s]),e.predecessors(a).length)){var p=e.node(e.predecessors(a)[0]),_=e.node(e.predecessors(s)[0]);l(c,"barycenter")||(c.barycenter=0,c.weight=0),c.barycenter=(c.barycenter*c.weight+p.order+_.order)/(c.weight+2),c.weight+=2}return c}function en(e,r){u(e,function(n){n.vs=C(n.vs.map(function(t){return r[t]?r[t].vs:t}))})}function rn(e,r){w(e.barycenter)?(e.barycenter=r.barycenter,e.weight=r.weight):(e.barycenter=(e.barycenter*e.weight+r.barycenter*r.weight)/(e.weight+r.weight),e.weight+=r.weight)}function Er(e){var r=ae(e),n=mr(e,I(1,r+1),"inEdges"),t=mr(e,I(r-1,-1,-1),"outEdges"),i=hr(e);vr(e,i);for(var o=Number.POSITIVE_INFINITY,a,s=0,f=0;f<4;++s,++f){nn(s%2?n:t,s%4>=2),i=M(e);var d=dr(e,i);d<o&&(f=0,a=ye(i),o=d)}vr(e,a)}function mr(e,r,n){return v(r,function(t){return fr(e,t,n)})}function nn(e,r){var n=new b;u(e,function(t){var i=t.graph().root,o=ve(t,i,n,r);u(o.vs,function(a,s){t.node(a).order=s}),ur(t,n,o.vs)})}function vr(e,r){u(r,function(n){u(n,function(t,i){e.node(t).order=i})})}function wr(e){var r=on(e);u(e.graph().dummyChains,function(n){for(var t=e.node(n),i=t.edgeObj,o=tn(e,r,i.v,i.w),a=o.path,s=o.lca,f=0,d=a[f],h=!0;n!==i.w;){if(t=e.node(n),h){for(;(d=a[f])!==s&&e.node(d).maxRank<t.rank;)f++;d===s&&(h=!1)}if(!h){for(;f<a.length-1&&e.node(d=a[f+1]).minRank<=t.rank;)f++;d=a[f]}e.setParent(n,d),n=e.successors(n)[0]}})}function tn(e,r,n,t){var i=[],o=[],a=Math.min(r[n].low,r[t].low),s=Math.max(r[n].lim,r[t].lim),f,d;f=n;do f=e.parent(f),i.push(f);while(f&&(r[f].low>a||s>r[f].lim));for(d=f,f=t;(f=e.parent(f))!==d;)o.push(f);return{path:i.concat(o.reverse()),lca:d}}function on(e){var r={},n=0;function t(i){var o=n;u(e.children(i),t),r[i]={low:o,lim:n++}}return u(e.children(),t),r}function an(e,r){var n={};function t(i,o){var a=0,s=0,f=i.length,d=D(o);return u(o,function(h,c){var p=un(e,h),_=p?e.node(p).order:f;(p||h===d)&&(u(o.slice(s,c+1),function(m){u(e.predecessors(m),function(g){var Y=e.node(g),be=Y.order;(be<a||_<be)&&!(Y.dummy&&e.node(m).dummy)&&br(n,g,m)})}),s=c+1,a=_)}),o}return T(r,t),n}function sn(e,r){var n={};function t(o,a,s,f,d){var h;u(I(a,s),function(c){h=o[c],e.node(h).dummy&&u(e.predecessors(h),function(p){var _=e.node(p);_.dummy&&(_.order<f||_.order>d)&&br(n,p,h)})})}function i(o,a){var s=-1,f,d=0;return u(a,function(h,c){if(e.node(h).dummy==="border"){var p=e.predecessors(h);p.length&&(f=e.node(p[0]).order,t(a,d,c,s,f),d=c,s=f)}t(a,d,a.length,f,o.length)}),a}return T(r,i),n}function un(e,r){if(e.node(r).dummy)return z(e.predecessors(r),function(n){return e.node(n).dummy})}function br(e,r,n){if(r>n){var t=r;r=n,n=t}var i=e[r];i||(e[r]=i={}),i[n]=!0}function fn(e,r,n){if(r>n){var t=r;r=n,n=t}return l(e[r],n)}function dn(e,r,n,t){var i={},o={},a={};return u(r,function(s){u(s,function(f,d){i[f]=f,o[f]=f,a[f]=d})}),u(r,function(s){var f=-1;u(s,function(d){var h=t(d);if(h.length){h=R(h,function(g){return a[g]});for(var c=(h.length-1)/2,p=Math.floor(c),_=Math.ceil(c);p<=_;++p){var m=h[p];o[d]===d&&f<a[m]&&!fn(n,d,m)&&(o[m]=d,o[d]=i[d]=i[m],f=a[m])}}})}),{root:i,align:o}}function hn(e,r,n,t,i){var o={},a=cn(e,r,n,i),s=i?"borderLeft":"borderRight";function f(c,p){for(var _=a.nodes(),m=_.pop(),g={};m;)g[m]?c(m):(g[m]=!0,_.push(m),_=_.concat(p(m))),m=_.pop()}function d(c){o[c]=a.inEdges(c).reduce(function(p,_){return Math.max(p,o[_.v]+a.edge(_))},0)}function h(c){var p=a.outEdges(c).reduce(function(m,g){return Math.min(m,o[g.w]-a.edge(g))},Number.POSITIVE_INFINITY),_=e.node(c);p!==Number.POSITIVE_INFINITY&&_.borderType!==s&&(o[c]=Math.max(o[c],p))}return f(d,a.predecessors.bind(a)),f(h,a.successors.bind(a)),u(t,function(c){o[c]=o[n[c]]}),o}function cn(e,r,n,t){var i=new b,o=e.graph(),a=mn(o.nodesep,o.edgesep,t);return u(r,function(s){var f;u(s,function(d){var h=n[d];if(i.setNode(h),f){var c=n[f],p=i.edge(c,h);i.setEdge(c,h,Math.max(a(e,d,f),p||0))}f=d})}),i}function ln(e,r){return A(k(r),function(n){var t=Number.NEGATIVE_INFINITY,i=Number.POSITIVE_INFINITY;return ke(n,function(o,a){var s=vn(e,a)/2;t=Math.max(o+s,t),i=Math.min(o-s,i)}),t-i})}function pn(e,r){var n=k(r),t=S(n),i=x(n);u(["u","d"],function(o){u(["l","r"],function(a){var s=o+a,f=e[s],d;if(f!==r){var h=k(f);d=a==="l"?t-S(h):i-x(h),d&&(e[s]=V(f,function(c){return c+d}))}})})}function _n(e,r){return V(e.ul,function(n,t){if(r)return e[r.toLowerCase()][t];var i=R(v(e,t));return(i[1]+i[2])/2})}function gr(e){var r=M(e),n=W(an(e,r),sn(e,r)),t={},i;u(["u","d"],function(a){i=a==="u"?r:k(r).reverse(),u(["l","r"],function(s){s==="r"&&(i=v(i,function(c){return k(c).reverse()}));var f=(a==="u"?e.predecessors:e.successors).bind(e),d=dn(e,i,n,f),h=hn(e,i,d.root,d.align,s==="r");s==="r"&&(h=V(h,function(c){return-c})),t[a+s]=h})});var o=ln(e,t);return pn(t,o),_n(t,e.graph().align)}function mn(e,r,n){return function(t,i,o){var a=t.node(i),s=t.node(o),f=0,d;if(f+=a.width/2,l(a,"labelpos"))switch(a.labelpos.toLowerCase()){case"l":d=-a.width/2;break;case"r":d=a.width/2;break}if(d&&(f+=n?d:-d),d=0,f+=(a.dummy?r:e)/2,f+=(s.dummy?r:e)/2,f+=s.width/2,l(s,"labelpos"))switch(s.labelpos.toLowerCase()){case"l":d=s.width/2;break;case"r":d=-s.width/2;break}return d&&(f+=n?d:-d),d=0,f}}function vn(e,r){return e.node(r).width}function yr(e){e=K(e),En(e),Ne(gr(e),function(r,n){e.node(n).x=r})}function En(e){var r=M(e),n=e.graph().ranksep,t=0;u(r,function(i){var o=x(v(i,function(a){return e.node(a).height}));u(i,function(a){e.node(a).y=t+o/2}),t+=o+n})}function wn(e,r){var n=r&&r.debugTiming?Fe:De;n("layout",function(){var t=n("  buildLayoutGraph",function(){return Rn(e)});n("  runLayout",function(){bn(t,n)}),n("  updateInputGraph",function(){gn(e,t)})})}function bn(e,r){r("    makeSpaceForEdgeLabels",function(){Sn(e)}),r("    removeSelfEdges",function(){An(e)}),r("    acyclic",function(){We(e)}),r("    nestingGraph.run",function(){or(e)}),r("    rank",function(){me(K(e))}),r("    injectEdgeLabelProxies",function(){Mn(e)}),r("    removeEmptyRanks",function(){Pe(e)}),r("    nestingGraph.cleanup",function(){sr(e)}),r("    normalizeRanks",function(){Me(e)}),r("    assignRankMinMax",function(){Pn(e)}),r("    removeEdgeLabelProxies",function(){On(e)}),r("    normalize.run",function(){He(e)}),r("    parentDummyChains",function(){wr(e)}),r("    addBorderSegments",function(){Ge(e)}),r("    order",function(){Er(e)}),r("    insertSelfEdges",function(){Bn(e)}),r("    adjustCoordinateSystem",function(){Ae(e)}),r("    position",function(){yr(e)}),r("    positionSelfEdges",function(){Un(e)}),r("    removeBorderNodes",function(){Vn(e)}),r("    normalize.undo",function(){Ke(e)}),r("    fixupEdgeLabelCoords",function(){jn(e)}),r("    undoCoordinateSystem",function(){Be(e)}),r("    translateGraph",function(){Fn(e)}),r("    assignNodeIntersects",function(){Dn(e)}),r("    reversePoints",function(){Gn(e)}),r("    acyclic.undo",function(){qe(e)})}function gn(e,r){u(e.nodes(),function(n){var t=e.node(n),i=r.node(n);t&&(t.x=i.x,t.y=i.y,r.children(n).length&&(t.width=i.width,t.height=i.height))}),u(e.edges(),function(n){var t=e.edge(n),i=r.edge(n);t.points=i.points,l(i,"x")&&(t.x=i.x,t.y=i.y)}),e.graph().width=r.graph().width,e.graph().height=r.graph().height}var yn=["nodesep","edgesep","ranksep","marginx","marginy"],xn={ranksep:50,edgesep:20,nodesep:50,rankdir:"tb"},kn=["acyclicer","ranker","rankdir","align"],Nn=["width","height"],In={width:0,height:0},Ln=["minlen","weight","width","height","labeloffset"],Cn={minlen:1,weight:1,width:0,height:0,labeloffset:10,labelpos:"r"},Tn=["labelpos"];function Rn(e){var r=new b({multigraph:!0,compound:!0}),n=we(e.graph());return r.setGraph(W({},xn,Ee(n,yn),B(n,kn))),u(e.nodes(),function(t){var i=we(e.node(t));r.setNode(t,xe(Ee(i,Nn),In)),r.setParent(t,e.parent(t))}),u(e.edges(),function(t){var i=we(e.edge(t));r.setEdge(t,W({},Cn,Ee(i,Ln),B(i,Tn)))}),r}function Sn(e){var r=e.graph();r.ranksep/=2,u(e.edges(),function(n){var t=e.edge(n);t.minlen*=2,t.labelpos.toLowerCase()!=="c"&&(r.rankdir==="TB"||r.rankdir==="BT"?t.width+=t.labeloffset:t.height+=t.labeloffset)})}function Mn(e){u(e.edges(),function(r){var n=e.edge(r);if(n.width&&n.height){var t=e.node(r.v),i=e.node(r.w),o={rank:(i.rank-t.rank)/2+t.rank,e:r};L(e,"edge-proxy",o,"_ep")}})}function Pn(e){var r=0;u(e.nodes(),function(n){var t=e.node(n);t.borderTop&&(t.minRank=e.node(t.borderTop).rank,t.maxRank=e.node(t.borderBottom).rank,r=x(r,t.maxRank))}),e.graph().maxRank=r}function On(e){u(e.nodes(),function(r){var n=e.node(r);n.dummy==="edge-proxy"&&(e.edge(n.e).labelRank=n.rank,e.removeNode(r))})}function Fn(e){var r=Number.POSITIVE_INFINITY,n=0,t=Number.POSITIVE_INFINITY,i=0,o=e.graph(),a=o.marginx||0,s=o.marginy||0;function f(d){var h=d.x,c=d.y,p=d.width,_=d.height;r=Math.min(r,h-p/2),n=Math.max(n,h+p/2),t=Math.min(t,c-_/2),i=Math.max(i,c+_/2)}u(e.nodes(),function(d){f(e.node(d))}),u(e.edges(),function(d){var h=e.edge(d);l(h,"x")&&f(h)}),r-=a,t-=s,u(e.nodes(),function(d){var h=e.node(d);h.x-=r,h.y-=t}),u(e.edges(),function(d){var h=e.edge(d);u(h.points,function(c){c.x-=r,c.y-=t}),l(h,"x")&&(h.x-=r),l(h,"y")&&(h.y-=t)}),o.width=n-r+a,o.height=i-t+s}function Dn(e){u(e.edges(),function(r){var n=e.edge(r),t=e.node(r.v),i=e.node(r.w),o,a;n.points?(o=n.points[0],a=n.points[n.points.length-1]):(n.points=[],o=i,a=t),n.points.unshift(ie(t,o)),n.points.push(ie(i,a))})}function jn(e){u(e.edges(),function(r){var n=e.edge(r);if(l(n,"x"))switch((n.labelpos==="l"||n.labelpos==="r")&&(n.width-=n.labeloffset),n.labelpos){case"l":n.x-=n.width/2+n.labeloffset;break;case"r":n.x+=n.width/2+n.labeloffset;break}})}function Gn(e){u(e.edges(),function(r){var n=e.edge(r);n.reversed&&n.points.reverse()})}function Vn(e){u(e.nodes(),function(r){if(e.children(r).length){var n=e.node(r),t=e.node(n.borderTop),i=e.node(n.borderBottom),o=e.node(D(n.borderLeft)),a=e.node(D(n.borderRight));n.width=Math.abs(a.x-o.x),n.height=Math.abs(i.y-t.y),n.x=o.x+n.width/2,n.y=t.y+n.height/2}}),u(e.nodes(),function(r){e.node(r).dummy==="border"&&e.removeNode(r)})}function An(e){u(e.edges(),function(r){if(r.v===r.w){var n=e.node(r.v);n.selfEdges||(n.selfEdges=[]),n.selfEdges.push({e:r,label:e.edge(r)}),e.removeEdge(r)}})}function Bn(e){var r=M(e);u(r,function(n){var t=0;u(n,function(i,o){var a=e.node(i);a.order=o+t,u(a.selfEdges,function(s){L(e,"selfedge",{width:s.label.width,height:s.label.height,rank:a.rank,order:o+ ++t,e:s.e,label:s.label},"_se")}),delete a.selfEdges})})}function Un(e){u(e.nodes(),function(r){var n=e.node(r);if(n.dummy==="selfedge"){var t=e.node(n.e.v),i=t.x+t.width/2,o=t.y,a=n.x-i,s=t.height/2;e.setEdge(n.e,n.label),e.removeNode(r),n.label.points=[{x:i+2*a/3,y:o-s},{x:i+5*a/6,y:o-s},{x:i+a,y:o},{x:i+5*a/6,y:o+s},{x:i+2*a/3,y:o+s}],n.label.x=n.x,n.label.y=n.y}})}function Ee(e,r){return V(B(e,r),Number)}function we(e){var r={};return u(e,function(n,t){r[t.toLowerCase()]=n}),r}export{b as a,wn as b};
