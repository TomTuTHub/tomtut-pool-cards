const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=n.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&n.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new s(n,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:d}=Object,u=globalThis,_=u.trustedTypes,f=_?_.emptyScript:"",m=u.reactiveElementPolyfillSupport,g=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),w={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=w){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&l(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const r=n?.call(this);s?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??w}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...c(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(e)i.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of n){const n=document.createElement("style"),s=t.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=e.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=n;const r=s.fromAttribute(e,t.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const r=this.constructor;if(!1===n&&(s=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??$)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==s||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,m?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const v=globalThis,x=t=>t,k=v.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,P=`<${z}>`,C=document,T=()=>C.createComment(""),B=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,V="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,N=/>/g,R=RegExp(`>|${V}(?:([^\\s"'>=/]+)(${V}*=${V}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,U=/"/g,W=/^(?:script|style|textarea|title)$/i,H=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),G=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),j=new WeakMap,F=C.createTreeWalker(C,129);function K(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,n=[];let s,r=2===e?"<svg>":3===e?"<math>":"",o=O;for(let e=0;e<i;e++){const i=t[e];let a,l,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===O?"!--"===l[1]?o=L:void 0!==l[1]?o=N:void 0!==l[2]?(W.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=R):void 0!==l[3]&&(o=R):o===R?">"===l[0]?(o=s??O,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?R:'"'===l[3]?U:D):o===U||o===D?o=R:o===L||o===N?o=O:(o=R,s=void 0);const p=o===R&&t[e+1].startsWith("/>")?" ":"";r+=o===O?i+P:h>=0?(n.push(a),i.slice(0,h)+A+i.slice(h)+E+p):i+E+(-2===h?e:p)}return[K(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class Q{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,r=0;const o=t.length-1,a=this.parts,[l,h]=Z(t,e);if(this.el=Q.createElement(l,i),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=F.nextNode())&&a.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(A)){const e=h[r++],i=n.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Y}),n.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:s}),n.removeAttribute(t));if(W.test(n.tagName)){const t=n.textContent.split(E),e=t.length-1;if(e>0){n.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],T()),F.nextNode(),a.push({type:2,index:++s});n.append(t[e],T())}}}else if(8===n.nodeType)if(n.data===z)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(E,t+1));)a.push({type:7,index:s}),t+=E.length-1}s++}}static createElement(t,e){const i=C.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,n){if(e===G)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=B(e)?void 0:e._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=q(t,s._$AS(t,e.values),s,n)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??C).importNode(e,!0);F.currentNode=n;let s=F.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new J(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new nt(s,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(s=F.nextNode(),r++)}return F.currentNode=C,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),B(t)?t===I||null==t||""===t?(this._$AH!==I&&this._$AR(),this._$AH=I):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==I&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(C.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Q.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new X(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=j.get(t.strings);return void 0===e&&j.set(t.strings,e=new Q(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new J(this.O(T()),this.O(T()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=I,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=I}_$AI(t,e=this,i,n){const s=this.strings;let r=!1;if(void 0===s)t=q(this,t,e,0),r=!B(t)||t!==this._$AH&&t!==G,r&&(this._$AH=t);else{const n=t;let o,a;for(t=s[0],o=0;o<s.length-1;o++)a=q(this,n[i+o],e,o),a===G&&(a=this._$AH[o]),r||=!B(a)||a!==this._$AH[o],a===I?t=I:t!==I&&(t+=(a??"")+s[o+1]),this._$AH[o]=a}r&&!n&&this.j(t)}j(t){t===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===I?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==I)}}class it extends Y{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??I)===G)return;const i=this._$AH,n=t===I&&i!==I||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==I&&(i===I||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class nt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const st=v.litHtmlPolyfillSupport;st?.(Q,J),(v.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class ot extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new J(e.insertBefore(T(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const lt=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],ht=t=>lt.includes(String(t).toLowerCase()),ct=t=>{if(null==t)return null;const e=String(t).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(e))return null;const i=Number(e);return isFinite(i)?i:null},pt=(t,e=0)=>{const i=Number(t);return isFinite(i)?i.toFixed(e).replace(".",","):"—"},dt=t=>{if(!t)return null;const e=ct(t.state);if(null===e)return null;return"kw"===String(t.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*e:e},ut=(t,e=Date.now())=>{if(!t)return"";const i=Date.parse(t);if(isNaN(i))return"";const n=Math.max(0,(e-i)/1e3);if(n<60)return`seit ${Math.floor(n)} Sek`;const s=n/60;if(s<60)return`seit ${Math.floor(s)} Min`;const r=s/60;if(r<24)return`seit ${Math.floor(r)} Std`;const o=Math.floor(r/24);return o<=1?"seit 1 Tag":`seit ${o} Tagen`},_t=t=>String(t||"").split(".")[0],ft=(t,e)=>t?.attributes?.friendly_name||String(e||"").split(".")[1]||String(e||""),mt=(t,{decimals:e}={})=>{const i=ct(t?.state);if(null===i)return"—";const n=e??(Number.isInteger(i)?0:1),s=t.attributes?.unit_of_measurement;return pt(i,Math.min(n,1))+(s?" "+s:"")},gt={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},bt="oval",$t=t=>gt[String(t||"").toLowerCase()]||gt[bt],wt={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},yt={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1}},vt={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},xt={heatpump:988/725,pump:1126/756,uv:947/384,solar:1001/710},kt={in:"pfeil_blau.png",out:"pfeil_rot.png"},St=t=>"/local/community/tomtut-pool-cards/"+t,At=t=>xt[t]||1,Et={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},zt="#8a8f98",Pt=t=>Et[t]?.farbe||zt,Ct=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],Tt=()=>{const t=new Set(Ct.flatMap(t=>t.keys)),e=Object.keys(Et).filter(e=>!t.has(e)&&!1!==Et[e].waehlbar),i=t=>({value:t,label:Et[t].label+(!1===Et[t].ready?" (folgt)":"")}),n=[];for(const t of Ct){t.trenner&&n.push({trenner:!0,label:t.trenner});for(const e of t.keys)Et[e]&&n.push(i(e))}for(const t of e)n.push(i(t));return n},Bt=t=>{const e=Number(t);return isFinite(e)?(Math.round(e)%360+360)%360:0},Mt=t=>Math.abs(t)<1e-9?0:Math.abs(t),Vt=(t,e)=>{const i=Number(e)>0?Number(e):1,n=Bt(t)*Math.PI/180,s=Mt(Math.cos(n)),r=Mt(Math.sin(n));return Math.min(1,i/(i*s+r),1/(i*r+s))},Ot=30,Lt=100,Nt=t=>{const e=Number(t);return isFinite(e)?Math.min(Lt,Math.max(30,e))/100:1},Rt=(t,e,i,n=100)=>{const s=Bt(t),r=(t=>Math.round(1e3*t)/1e3)(Vt(s,i)*Nt(n)),o=[];return s&&o.push(`rotate(${s}deg)`),r<1&&o.push(`scale(${r})`),!0===e&&o.push("scaleX(-1)"),o.length?`transform:${o.join(" ")};`:""};class Dt extends ot{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this._confirmOpen=!1}get defaults(){return{}}_v(t){const e=this.config?.[t];return null==e||""===e?this.defaults[t]:e}_ent(t){return t?this.hass?.states?.[t]:void 0}_isOn(t){const e=this._ent(t);return!!e&&ht(e.state)}_watt(t){return dt(this._ent(t))}_call(t,e,i={}){t&&this.hass&&this.hass.callService(_t(t),e,{entity_id:t,...i})}_moreInfo(t){const e=t?.currentTarget?.dataset?.entity;e&&(t.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0})))}get _frameClasses(){const t=this.frame||{},e=["transparent","weiss","schwarz"].includes(t.fill)?t.fill:"transparent";return`slot ${!1===t.enabled?"":"framed"} fill-${e}`}renderSlot(t){return H`<div class="${this._frameClasses}">${t}</div>`}renderGeraeteBild({kind:t,variante:e,alt:i,rotate:n=0,mirror:s=!1,groesse:r=100,inhalt:o=I}){const a=At(t);return H`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*a)/1e4};">
        <div class="bild" style="${Rt(n,s,a,r)}">
          <img src="${((t,e)=>St(vt[t]?.[e]||wt[t]||""))(t,e)}" alt="${i}" />
          ${o}
        </div>
      </div>
    `}renderFan({active:t,top:e,left:i,size:n,ratio:s,dur:r,inactive:o,round:a=!1}){const l=t?"spinning":"hidden"===o?"hidden":"idle",h=a?1:Number(s)||1;return H`
      <div
        class="fan-overlay ${l} ${a?"round":""}"
        style="top:${e}%; left:${i}%; width:${n}%; --fan-dur:${r}s; --fan-ratio:${h};"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${a?"xMidYMid meet":"none"}">
          <g .innerHTML="${'<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>'}"></g>
        </svg>
      </div>
    `}renderPowerButton({on:t,top:e,left:i,scale:n}){return H`
      <div
        class="power-badge ${t?"on":"off"}"
        style="top:${e}%; left:${i}%; transform:scale(${(n??100)/100});"
        title="${t?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `}renderValueBox({value:t,unit:e,top:i,bottom:n,left:s,scale:r,box:o,entity:a}){return H`
      <div
        class="value-box ${!1===o?"no-bg":""}"
        style="${void 0===n?`top:${i}%;`:`bottom:${n}%;`} left:${s}%; transform:translateX(-50%) scale(${(r??100)/100});"
        data-entity="${a||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${t}</span>
        ${e?H`<span class="unit">${e}</span>`:I}
      </div>
    `}renderThermo({value:t,top:e,left:i,scale:n,entity:s}){return H`
      <div
        class="thermo"
        style="top:${e}%; left:${i}%; --thermo-size:${(n??100)/100*3.6}em;"
        data-entity="${s||""}"
        @click="${this._moreInfo}"
      >
        <svg viewBox="0 0 24 60" aria-hidden="true">
          <rect x="8" y="3" width="8" height="38" rx="4" fill="#ffffff" stroke="#111" stroke-width="1.6" />
          <circle cx="12" cy="48" r="8" fill="#e8483c" stroke="#111" stroke-width="1.6" />
          <rect x="10" y="20" width="4" height="26" fill="#e8483c" />
          <g stroke="#111" stroke-width="1.2" stroke-linecap="round">
            <line x1="16" y1="10" x2="20" y2="10" />
            <line x1="16" y1="16" x2="20" y2="16" />
            <line x1="16" y1="22" x2="20" y2="22" />
            <line x1="16" y1="28" x2="20" y2="28" />
          </g>
        </svg>
        ${t?H`<span class="thermo-val">${t}</span>`:I}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}_onPowerClick(t){t?.stopPropagation();const e=this.powerEntityId;e&&(this._isOn(e)?this._confirmOpen=!0:this._call(e,"turn_on"))}_confirmOff(t){t?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(t){t?.stopPropagation(),this._confirmOpen=!1}renderConfirm(t="Wirklich stromlos schalten?"){return this._confirmOpen?H`
      <div class="confirm-overlay" @click="${this._cancelOff}">
        <div class="confirm-panel" @click="${t=>t.stopPropagation()}">
          <h3><ha-icon icon="mdi:alert"></ha-icon> ${t}</h3>
          <p>${this.powerConfirmText}</p>
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._cancelOff}">Abbrechen</button>
            <button class="btn danger" @click="${this._confirmOff}">Trotzdem ausschalten</button>
          </div>
        </div>
      </div>
    `:I}wattText(t,e=0){const i=this._watt(t);return null===i?"—":pt(i,e)}}const Ut=r`
  :host {
    display: block;
    height: 100%;
  }
  .slot {
    position: relative;
    box-sizing: border-box;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    padding: 10px;
    border-radius: 18px;
    border: 2px solid transparent;
    background: var(--tt-bg);
    color: var(--tt-fg);
    --tt-bg: transparent;
    --tt-fg: var(--primary-text-color, #111);
    --tt-line: rgba(127, 127, 127, 0.55);
    --tt-soft: rgba(127, 127, 127, 0.16);
    --tt-box-bg: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.92)));
    --tt-box-fg: var(--primary-text-color, #111);
  }
  .slot.fill-weiss {
    --tt-bg: #ffffff;
    --tt-fg: #111111;
    --tt-line: rgba(0, 0, 0, 0.55);
    --tt-soft: rgba(0, 0, 0, 0.08);
    --tt-box-bg: rgba(255, 255, 255, 0.92);
    --tt-box-fg: #111111;
  }
  .slot.fill-schwarz {
    --tt-bg: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.45);
    --tt-soft: rgba(255, 255, 255, 0.12);
    --tt-box-bg: rgba(30, 30, 30, 0.9);
    --tt-box-fg: #ffffff;
  }
  .slot.framed {
    border-color: var(--tt-line);
  }
  .slot-title {
    font-size: 0.95em;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-align: center;
    color: var(--tt-fg);
    line-height: 1.2;
    margin: 0;
  }
  .slot-hint {
    font-size: 0.85em;
    opacity: 0.7;
    text-align: center;
    line-height: 1.35;
    margin: 0;
  }
`,Wt=r`
  .img-wrap {
    position: relative;
    width: 100%;
    line-height: 0;
    /* Alle Overlays skalieren mit der Bildbreite — dadurch sieht der Slot in
       einer schmalen Spalte genauso aus wie in voller Dashboard-Breite. */
    container-type: inline-size;
    font-size: clamp(8px, 3.2cqw, 15px);
  }
  .img-wrap > img {
    width: 100%;
    height: auto;
    display: block;
  }

  /*
   * Bildbereich eines Geräte-Slots (shared/slot-base.js: renderGeraeteBild).
   *
   * Die Höhe kommt aus der Regel aspect-ratio im Inline-Stil, nicht aus dem Bild:
   * der Kasten steht schon vor dem Laden und ist für jeden Slot-Typ nach
   * derselben Regel gebaut. overflow:hidden ist die harte Grenze — der
   * innere Wrapper .bild darf gedreht und gespiegelt werden, hinaus kommt
   * er nie. Gedreht wird um die Mitte.
   */
  .bild-flaeche {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .bild-flaeche > .bild {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    line-height: 0;
    transform-origin: center center;
  }
  .bild-flaeche > .bild > img {
    width: 100%;
    height: 100%;
    display: block;
  }

  /*
   * Zubehör-Sprites auf dem Becken (Skimmer, Einlaufdüse, Bodenablauf).
   * Die Breite steht im Inline-Stil (Prozent der Beckenbreite) und schlägt
   * die 100 % der Regel darüber; die Höhe folgt dem Seitenverhältnis.
   * Sie liegen über dem Wasser, aber unter Thermometer, pH/RX und Freitext.
   */
  .img-wrap > img.hero-sprite {
    position: absolute;
    height: auto;
    max-width: none;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 3;
  }

  /*
   * Drehendes Rad (Läufer / Lüfter).
   *
   * Das Laufrad der Poolpumpe ist rund und muss rund bleiben: feste 1:1-Box
   * (--fan-ratio 1) und preserveAspectRatio="xMidYMid meet" im SVG. Nur der
   * Lüfter der Wärmepumpe darf über --fan-ratio elliptisch werden, weil das
   * Gitter im Artwork perspektivisch verzerrt gezeichnet ist.
   * Gedreht wird um die Mitte der viewBox (= Nabe), nicht um den Schwerpunkt
   * der Flächen — sonst eiert das Rad.
   */
  .fan-overlay {
    position: absolute;
    aspect-ratio: 1 / var(--fan-ratio, 1);
    pointer-events: none;
    transform: translate(-50%, -50%);
    color: var(--tt-fan-color, var(--tt-fg));
    opacity: 0.3;
    filter: grayscale(1);
    transition: opacity 0.3s, filter 0.3s;
  }
  .fan-overlay svg {
    width: 100%;
    height: 100%;
    overflow: visible;
    display: block;
  }
  .fan-overlay svg g {
    transform-box: view-box;
    transform-origin: 50% 50%;
  }
  .fan-overlay.hidden {
    opacity: 0;
  }
  .fan-overlay.spinning {
    opacity: 0.9;
    filter: none;
  }
  .fan-overlay.spinning svg g {
    animation: fanSpin var(--fan-dur, 1s) linear infinite;
  }
  @keyframes fanSpin {
    to {
      transform: rotate(360deg);
    }
  }

  /* Powerbutton */
  .power-badge {
    position: absolute;
    cursor: pointer;
    padding: 0.35em;
    border-radius: 50%;
    --mdc-icon-size: 1.75em;
    transition: box-shadow 0.3s, color 0.3s, opacity 0.3s;
    line-height: 0;
    background: var(--tt-soft);
    border: 1px solid var(--tt-line);
    transform-origin: top left;
    z-index: 6;
  }
  .power-badge.on {
    color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.55);
  }
  .power-badge.off {
    color: #f44336;
    opacity: 0.75;
  }
  .power-badge:hover {
    filter: brightness(1.2);
  }

  /* Wertefelder auf dem Bild */
  .value-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
    border-radius: 0.7em;
    padding: 0.4em 1em;
    min-width: 5.2em;
    line-height: 1.2;
    backdrop-filter: blur(4px);
    cursor: default;
    z-index: 4;
  }
  .value-box.no-bg {
    background: none;
    border: none;
    backdrop-filter: none;
    padding: 0.15em 0.4em;
    color: var(--tt-fg);
  }
  .val {
    font-size: 1.4em;
    font-weight: 700;
    color: inherit;
    white-space: nowrap;
  }
  .unit {
    font-size: 0.8em;
    font-weight: 600;
    color: inherit;
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Freitext-Badge */
  .label-badge {
    position: absolute;
    padding: 0.15em 0.55em;
    background: var(--tt-box-bg);
    color: var(--tt-box-fg);
    border-radius: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.3;
    pointer-events: none;
    white-space: nowrap;
    z-index: 5;
  }
  .label-badge.no-bg {
    background: none;
    color: var(--tt-fg);
  }

  /* Thermometer (Skizzen-Look wie das Artwork) */
  .thermo {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    z-index: 5;
    cursor: default;
  }
  .thermo svg {
    height: var(--thermo-size, 3.6em);
    width: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }
  .thermo .thermo-val {
    font-size: 1.05em;
    font-weight: 700;
    padding: 0.2em 0.55em;
    border-radius: 0.55em;
    white-space: nowrap;
    background: var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
  }

  /* pH-/RX-Kästchen auf der Beckenwand */
  .chem-box {
    position: absolute;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-width: 15%;
    padding: 0.3em 0.7em;
    border-radius: 0.7em;
    background: var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1.5px solid var(--tt-line);
    line-height: 1.15;
    z-index: 5;
  }
  .chem-box .chem-key {
    font-size: 0.72em;
    font-weight: 700;
    opacity: 0.65;
    letter-spacing: 0.5px;
  }
  .chem-box .chem-val {
    font-size: 1.05em;
    font-weight: 700;
    white-space: nowrap;
  }

  /* Bestätigungs-Dialog */
  .confirm-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    line-height: normal;
    border-radius: 16px;
    animation: fadeIn 0.15s ease-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  .confirm-panel {
    background: var(--card-background-color, #1e1e1e);
    color: var(--primary-text-color, #fff);
    border-radius: 16px;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
    padding: 18px 20px;
    width: min(92%, 420px);
    max-height: 92%;
    overflow-y: auto;
    border: 1px solid rgba(255, 255, 255, 0.08);
  }
  .confirm-panel h3 {
    margin: 0 0 10px 0;
    font-size: 1.05em;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--warning-color, #ff9800);
    --mdc-icon-size: 22px;
  }
  .confirm-panel p {
    margin: 0 0 16px 0;
    font-size: 0.9em;
    line-height: 1.45;
  }
  .confirm-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
  }
  .btn {
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 0.9em;
    font-weight: 600;
    cursor: pointer;
    border: 1px solid var(--divider-color, #555);
    background: transparent;
    color: var(--primary-text-color, #fff);
    font-family: inherit;
  }
  .btn.cancel:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .btn.danger {
    background: #d32f2f;
    border-color: #d32f2f;
    color: #fff;
  }
  .btn.danger:hover {
    background: #b71c1c;
  }
`,Ht={top:8,left:11},Gt={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:yt.skimmer.groesse,inlet_size:yt.einlauf.groesse,drain_size:yt.drain.groesse},It=t=>{const e=$t(t),i={};for(const t of Object.values(yt)){const n=e[t.anker];n&&(i[`${t.anker}_top`]=n.top,i[`${t.anker}_left`]=n.left)}return{...Gt,thermo_top:e.thermo.top,thermo_left:e.thermo.left,ph_top:e.ph.top,ph_left:e.ph.left,rx_top:e.rx.top,rx_left:e.rx.left,...i,inlet_temp_top:(e.inlet?.top??12)+Ht.top,inlet_temp_left:(e.inlet?.left??66)+Ht.left,label_top:e.label_anker?.top??Gt.label_top,label_left:e.label_anker?.left??Gt.label_left}};class jt extends Dt{get defaults(){return{...It(this.config?.shape),inlet_temp_top:this._anchor("inlet","top")+Ht.top,inlet_temp_left:this._anchor("inlet","left")+Ht.left}}_spriteAn(t){const e=Object.values(yt).find(e=>e.anker===t),i=this.config?.[`show_${t}`];return null==i?!!e?.standard:!1!==i}get shape(){return $t(this.config?.shape)}_anchor(t,e){const i=`${t}_${e}`,n=this.config?.[i];return null!=n&&""!==n?Number(n):this.shape[t]?.[e]??50}render(){const t=this.config||{},e=this.shape,i=!0===t.framed,n=!1!==t.show_thermo&&!!t.temp_entity,s=!1!==t.show_ph&&!!t.ph_entity,r=!1!==t.show_rx&&!!t.rx_entity,o=!!t.inlet_temp_entity&&this._spriteAn("inlet"),a=H`
      <div class="img-wrap">
        <img src="${St(e.file)}" alt="Pool ${e.label}" />
        ${this._sprites()}

        ${n?this.renderThermo({value:mt(this._ent(t.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:t.temp_entity}):I}
        ${s?this._chemBox("pH",t.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):I}
        ${r?this._chemBox("RX",t.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):I}
        ${o?this._chemBox("Zulauf",t.inlet_temp_entity,this._v("inlet_temp_top"),this._v("inlet_temp_left"),"inlet-temp"):I}
        ${t.label_text?H`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
            >
              ${t.label_text}
            </div>`:I}
      </div>
    `;return i?this.renderSlot(a):H`<div class="${this._frameClasses} bare">${a}</div>`}_sprites(){return Object.values(yt).map(t=>{if(!this._spriteAn(t.anker))return I;const e=Number(this._v(`${t.anker}_size`)),i=e>0?e:t.groesse;return H`<img
        class="hero-sprite sprite-${t.anker}"
        src="${St(t.file)}"
        alt=""
        style="top:${this._anchor(t.anker,"top")}%; left:${this._anchor(t.anker,"left")}%; width:${i}%;"
      />`})}_chemBox(t,e,i,n,s=""){const r=this._ent(e);return H`
      <div
        class="chem-box ${s}"
        style="top:${i}%; left:${n}%;"
        data-entity="${e}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${t}</span>
        <span class="chem-val">${mt(r)}</span>
      </div>
    `}static styles=[Ut,Wt,r`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",jt);const Ft={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,power_btn_top:5,power_btn_left:3,power_btn_scale:139,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},Kt=(t={})=>!!(t.switch_entity||t.power_entity||t.target_entity||t.current_entity);class Zt extends Dt{get defaults(){return Ft}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _target(){const t=this.config.target_entity,e=this._ent(t);if(!e)return null;const i=String(t).startsWith("climate."),n=ct(i?e.attributes?.temperature:e.state);if(null===n)return null;const s=e.attributes||{};return{climate:i,value:n,min:i?s.min_temp??5:s.min??5,max:i?s.max_temp??40:s.max??40,step:this.config.target_step??(i?s.target_temp_step??.5:s.step??.5),unit:i?this.hass?.config?.unit_system?.temperature??"°C":s.unit_of_measurement??"°C"}}get _current(){const t=this.config.current_entity,e=this._ent(t);if(!e)return null;const i=String(t).startsWith("climate."),n=ct(i?e.attributes?.current_temperature:e.state);return null===n?null:{value:n,unit:i?this.hass?.config?.unit_system?.temperature??"°C":e.attributes?.unit_of_measurement??"°C"}}get _fanActive(){const t=this.config.fan_source??"auto",e=this._ent(this.config.fan_entity);if("power"!==t&&e){const t=String(e.state).toLowerCase();if(ht(t))return!0;const i=ct(t);return null!==i&&i>0}if("entity"===t)return!1;const i=this._watt(this.config.power_entity);return null!==i&&i>=Number(this._v("fan_power_threshold"))}_stepTarget(t){const e=this._target;if(!e||!this.hass)return;let i=Math.round((e.value+t*e.step)/e.step)*e.step;i=Math.min(e.max,Math.max(e.min,i)),i=Math.round(100*i)/100,i!==e.value&&(e.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(t){t?.stopPropagation(),this._stepTarget(1)}_targetDown(t){t?.stopPropagation(),this._stepTarget(-1)}render(){const t=this.config||{},e=Kt(t),i=!1!==t.show_fan,n=!1!==t.show_power_button&&!!t.switch_entity,s=!1!==t.show_power&&!!t.power_entity,r=!1!==t.show_target&&!!t.target_entity,o=!1!==t.show_current&&!!t.current_entity,a=t.label_text||"",l=Number(this._v("fan_speed"))||0,h=l<=0?0:Math.max(.2,4-l/100*3.6),c=this._target,p=this._current;return this.renderSlot(H`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${i?this.renderFan({active:e&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:h,inactive:this._v("fan_inactive")}):I}
        ${n?this.renderPowerButton({on:this._isOn(t.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${s?this.renderValueBox({value:this.wattText(t.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:t.power_entity}):I}
        ${o?this.renderValueBox({value:null===p?"—":pt(p.value,1)+" "+p.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:t.current_entity}):I}
        ${r?H`
              <div
                class="value-box target ${!1===this._v("target_box")?"no-bg":""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v("target_left")}%; transform:translateX(-50%) scale(${(this._v("target_scale")??100)/100});"
              >
                <div class="target-row">
                  <button
                    class="step"
                    ?disabled="${null===c}"
                    @click="${this._targetDown}"
                    title="Soll-Temperatur senken"
                  >
                    −
                  </button>
                  <div class="target-val">
                    <span class="val"
                      >${null===c?"—":pt(c.value,1)+" "+c.unit}</span
                    >
                    ${!1===this._v("target_label")?I:H`<span class="unit">Soll</span>`}
                  </div>
                  <button
                    class="step"
                    ?disabled="${null===c}"
                    @click="${this._targetUp}"
                    title="Soll-Temperatur anheben"
                  >
                    +
                  </button>
                </div>
              </div>
            `:I}
        ${a?H`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
              >
                ${a}
              </div>
            `:I}
        ${this.renderConfirm("Wirklich stromlos schalten?")}
      </div>
      ${e?I:H`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[Ut,Wt,r`
      .value-box.target {
        padding: 0.35em 0.5em;
      }
      .target-row {
        display: flex;
        align-items: center;
        gap: 0.5em;
      }
      .target-val {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .step {
        background: var(--tt-soft);
        color: inherit;
        border: 1px solid var(--tt-line);
        border-radius: 0.5em;
        width: 1.9em;
        height: 1.9em;
        font-size: 1.15em;
        font-weight: 700;
        line-height: 1;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, transform 0.1s;
      }
      .step:hover {
        filter: brightness(1.15);
      }
      .step:active {
        transform: scale(0.92);
      }
      .step[disabled] {
        opacity: 0.35;
        cursor: not-allowed;
      }
    `]}customElements.define("tomtut-pool-slot-heatpump",Zt);const Qt={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30},qt=t=>{const e=Math.min(10,Math.max(1,Number(t)||1)),i=4*Math.pow(.125,(e-1)/9);return Math.round(100*i)/100};class Xt extends Dt{static properties={...Dt.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return Qt}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const t=this.config?.stage_entities;return(Array.isArray(t)?t:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const t=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((e,i)=>t[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}_derive(){if("latching"===this.mode){let t=null;if(this.stages.forEach((e,i)=>{const n=this._ent(e);if(!n||!ht(n.state))return;const s=Date.parse(n.last_changed||0)||0;(!t||s>t.t)&&(t={i:i,t:s,since:n.last_changed})}),!t){const t=this._ent(this.stopEntity);return{active:null,stopped:!0,since:t?.last_changed||null}}return{active:t.i,stopped:!1,since:t.since}}const t=this.stages.map((t,e)=>({id:t,i:e}));this.stopEntity&&t.push({id:this.stopEntity,i:-1});let e=null;for(const i of t){const t=this._ent(i.id);if(!t||!t.last_changed)continue;const n=Date.parse(t.last_changed);isNaN(n)||(!e||n>e.t)&&(e={...i,t:n,since:t.last_changed})}return e?-1===e.i?{active:null,stopped:!0,since:e.since}:{active:e.i,stopped:!1,since:e.since}:{active:null,stopped:!1,since:null}}get state(){const t=this._derive(),e=this._optimistic;if(e&&Date.now()-e.t<6e3){if(-1===e.i&&!t.stopped)return{active:null,stopped:!0,since:null};if(e.i>=0&&t.active!==e.i)return{active:e.i,stopped:!1,since:null}}return t}get running(){const t=this.state;if(this.blockedByMain)return!1;if(t.stopped||null===t.active)return!1;const e=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(e)&&i<e)}_clickStage(t){if(this.blockedByMain)return;const e=this.stages[t];e&&(this._optimistic={i:t,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((e,i)=>{i!==t&&this._call(e,"turn_off")}),this._call(e,"turn_on")):this._call(e,"turn_on"))}_clickStop(){this.blockedByMain||(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(t=>this._call(t,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const t=this.config||{},e=((t={})=>!!(Array.isArray(t.stage_entities)&&t.stage_entities.filter(Boolean).length||t.main_entity))(t),i=this.state,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1",s=!1!==t.show_power&&!!t.power_entity,r=!1!==t.show_temp&&!!t.temp_entity,o=!1!==t.show_power_button&&!!t.main_entity,a=!1!==t.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(H`
      ${t.label?H`<h3 class="slot-title">${t.label}</h3>`:I}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===t.show_fan?I:this.renderFan({active:e&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:qt(this._v(n)),inactive:this._v("fan_inactive"),round:!0})}
          ${o?this.renderPowerButton({on:this._isOn(t.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
          ${s?this.renderValueBox({value:this.wattText(t.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:t.power_entity}):I}
          ${r?this.renderThermo({value:mt(this._ent(t.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:t.temp_entity}):I}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${a?H`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((t,e)=>H`
                    <button
                      class="stage-btn ${i.active!==e||i.stopped?"":"active"}"
                      @click="${()=>this._clickStage(e)}"
                      title="${this.stageLabels[e]}"
                    >
                      <span class="stage-name">${this.stageLabels[e]}</span>
                      ${i.active===e&&!i.stopped&&i.since?H`<span class="stage-since">${ut(i.since)}</span>`:I}
                    </button>
                  `)}
                ${this._showStop?H`
                      <button
                        class="stage-btn stop ${i.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${i.stopped&&i.since?H`<span class="stage-since">${ut(i.since)}</span>`:I}
                      </button>
                    `:I}
              </div>
            `:I}
      </div>
      ${e?I:H`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[Ut,Wt,r`
      .pump {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      .pump .img-wrap {
        flex: 1 1 auto;
        min-width: 0;
      }
      .stages {
        flex: 0 0 clamp(72px, 30%, 124px);
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .stages.disabled .stage-btn {
        opacity: 0.4;
        pointer-events: none;
      }
      .stage-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 6px 8px;
        border-radius: 22px;
        border: 1px solid var(--tt-line);
        background: var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        cursor: pointer;
        transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
      }
      .stage-btn:hover {
        filter: brightness(1.06);
      }
      .stage-btn:active {
        transform: scale(0.97);
      }
      .stage-btn.active {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.45);
      }
      .stage-btn.stop {
        color: #c62828;
        border-color: rgba(198, 40, 40, 0.5);
      }
      .stage-btn.stop.active {
        background: linear-gradient(145deg, #ff5a5a, #c62828);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(255, 60, 60, 0.4);
      }
      .stage-name {
        font-size: 0.95em;
        font-weight: 700;
        line-height: 1.1;
      }
      .stage-since {
        font-size: 0.68em;
        opacity: 0.8;
        margin-top: 2px;
        line-height: 1.1;
        white-space: nowrap;
      }
    `]}customElements.define("tomtut-pool-slot-pump",Xt);const Jt={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80};class Yt extends Dt{get defaults(){return Jt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const t=Number(this._v("glow_size"))||0,e=Number(this._v("glow_thickness"))||0;if(t<=0||e<=0)return I;const i=Math.round(t*At("uv")/e*1e3)/1e3,n=Number(this._v("glow_intensity")),s=Math.min(100,Math.max(0,isFinite(n)?n:80))/100,r=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${t}%`,`aspect-ratio:${i}`,`opacity:${s}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`].join("; ");return H`<div class="glow" style="${r};"></div>`}render(){const t=this.config||{},e=((t={})=>!!(t.switch_entity||t.power_entity||t.temp_entity))(t),i=!1!==t.show_glow,n=!1!==t.show_power_button&&!!t.switch_entity,s=!1!==t.show_power&&!!t.power_entity,r=!1!==t.show_temp&&!!t.temp_entity;return this.renderSlot(H`
      ${t.label?H`<h3 class="slot-title">${t.label}</h3>`:I}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:i&&e&&this.leuchtet?this.renderGlow():I})}

        ${n?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${s?this.renderValueBox({value:this.wattText(t.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:t.power_entity}):I}
        ${r?this.renderThermo({value:mt(this._ent(t.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:t.temp_entity}):I}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${e?I:H`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[Ut,Wt,r`
      .glow {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(
          ellipse at center,
          rgba(203, 178, 255, 0.95) 0%,
          rgba(150, 140, 255, 0.72) 35%,
          rgba(104, 128, 255, 0.32) 65%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.35em);
      }
    `]}customElements.define("tomtut-pool-slot-uv",Yt);const te={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:20,arrow_in_left:11,arrow_in_size:6.5,arrow_out_top:86,arrow_out_left:82,arrow_out_size:6.5,temp_in_top:21,temp_in_left:32,temp_in_scale:105,temp_out_top:79,temp_out_left:66,temp_out_scale:105,power_bottom:8,power_left:33,power_scale:100,power_box:!0,power_label:!0};class ee extends Dt{get defaults(){return te}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(t){const e=Number(this._v(`arrow_${t}_size`));return e>0?H`<img
      class="flow-arrow flow-${t}"
      src="${St(kt[t])}"
      alt=""
      style="top:${this._v(`arrow_${t}_top`)}%; left:${this._v(`arrow_${t}_left`)}%; width:${e}%;"
    />`:I}render(){const t=this.config||{},e=((t={})=>!!(t.switch_entity||t.temp_in_entity||t.temp_out_entity||t.power_entity))(t),i=!1!==t.show_power_button&&!!t.switch_entity,n=!1!==t.show_temp_in&&!!t.temp_in_entity,s=!1!==t.show_temp_out&&!!t.temp_out_entity,r=!1!==t.show_power&&!!t.power_entity,o=!1!==t.show_arrows;return this.renderSlot(H`
      ${t.label?H`<h3 class="slot-title">${t.label}</h3>`:I}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${o?H`${this.renderPfeil("in")}${this.renderPfeil("out")}`:I}

        ${i?this.renderPowerButton({on:this._isOn(t.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${n?this.renderThermo({value:mt(this._ent(t.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:t.temp_in_entity}):I}
        ${s?this.renderThermo({value:mt(this._ent(t.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:t.temp_out_entity}):I}
        ${r?this.renderValueBox({value:this.wattText(t.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:t.power_entity}):I}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${e?I:H`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[Ut,Wt,r`
      /* Die Breite steht im Inline-Stil (Prozent der Bildbreite) und schlägt
         die 100 % der allgemeinen Bildregel; die Höhe folgt dem Motiv. */
      .img-wrap > img.flow-arrow {
        position: absolute;
        height: auto;
        max-width: none;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3;
      }
    `]}customElements.define("tomtut-pool-slot-solar",ee);const ie=["switch","light","input_boolean","fan","siren"];class ne extends Dt{get _entries(){return(Array.isArray(this.config?.entries)?this.config.entries:[]).slice(0,3).filter(t=>t&&(t.entity||t.text||t.label))}get _align(){const t=this.config?.align;return["oben","mitte","unten"].includes(t)?t:"mitte"}_toggle(t){const e=t.entity;e&&ie.includes(_t(e))&&this._call(e,"toggle")}_renderEntry(t){const e=t.kind||(t.entity?"entity":"text");if("text"===e)return H`<div class="entry text">${t.text||t.label||""}</div>`;const i=this._ent(t.entity);if("button"===e){const e=!!i&&ht(i.state);return H`
        <button class="entry btn-entry ${e?"on":""}" @click="${()=>this._toggle(t)}">
          ${t.icon?H`<ha-icon icon="${t.icon}"></ha-icon>`:I}
          <span>${t.label||ft(i,t.entity)}</span>
        </button>
      `}return H`
      <div class="entry value" data-entity="${t.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${t.label||ft(i,t.entity)}</span>
        <span class="entry-value">${(t=>{if(!t)return"—";const e=ct(t.state),i=t.attributes?.unit_of_measurement;return null!==e?pt(e,Number.isInteger(e)?0:1)+(i?" "+i:""):String(t.state)+(i?" "+i:"")})(i)}</span>
      </div>
    `}render(){const t=this.config||{},e=this._entries;return this.renderSlot(H`
      <div class="custom align-${this._align}">
        ${t.title?H`<h3 class="slot-title">${t.title}</h3>`:I}
        ${e.length?e.map(t=>this._renderEntry(t)):H`<p class="slot-hint">Noch keine Einträge — im Editor bis zu drei hinzufügen.</p>`}
      </div>
    `)}static styles=[Ut,Wt,r`
      .custom {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        height: 100%;
        text-align: center;
      }
      .custom.align-oben {
        justify-content: flex-start;
      }
      .custom.align-mitte {
        justify-content: center;
      }
      .custom.align-unten {
        justify-content: flex-end;
      }
      .entry {
        display: flex;
        flex-direction: column;
        align-items: center;
        line-height: 1.25;
        max-width: 100%;
      }
      .entry.value {
        cursor: default;
      }
      .entry-label {
        font-size: 0.78em;
        opacity: 0.7;
        letter-spacing: 0.3px;
      }
      .entry-value {
        font-size: 1.35em;
        font-weight: 700;
        white-space: nowrap;
      }
      .entry.text {
        font-size: 0.95em;
        opacity: 0.9;
      }
      .btn-entry {
        flex-direction: row;
        gap: 8px;
        min-height: 44px;
        padding: 8px 16px;
        border-radius: 22px;
        border: 1px solid var(--tt-line);
        background: var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 0.95em;
        font-weight: 600;
        cursor: pointer;
        --mdc-icon-size: 20px;
      }
      .btn-entry:hover {
        filter: brightness(1.06);
      }
      .btn-entry.on {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.4);
      }
    `]}customElements.define("tomtut-pool-slot-custom",ne);class se extends Dt{static properties={...Dt.properties,slotType:{attribute:!1}};render(){const t=this.config||{},e=Et[this.slotType]||{},i=!1===e.ready?e.hint:t.hint||"";return this.renderSlot(H`
      ${t.title||t.label?H`<h3 class="slot-title">${t.title||t.label}</h3>`:I}
      ${i?H`<p class="slot-hint">${i}</p>`:I}
    `)}static styles=[Ut,Wt]}customElements.define("tomtut-pool-slot-frame",se);const re={enabled:!0,fill:"transparent"};class oe extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){if(!t||"object"!=typeof t)throw new Error("Ungültige Konfiguration");if(void 0!==t.slots&&!Array.isArray(t.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==t.hero&&("object"!=typeof t.hero||Array.isArray(t.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==t.version&&1!==Number(t.version))throw new Error(`Unbekannte Config-Version ${t.version} — diese Card kennt Version 1`);this._config={version:1,...t,hero:{enabled:!0,shape:bt,...t.hero||{}},frame:{...re,...t.frame||{}},slots:Array.isArray(t.slots)?t.slots:[]}}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:bt},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const t=this._config||{},e=(t.slots||[]).filter(t=>"hidden"!==(t?.type||"frame"));return(!1===t.hero?.enabled?0:6)+5*Math.ceil(e.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(t=>({...t||{},type:String(t?.type||"frame").toLowerCase()})).filter(t=>"hidden"!==t.type)}render(){if(!this._config)return I;const t=this._config,e=!1!==t.hero?.enabled,i=this.visibleSlots;return H`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${e?H`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${t.hero}"
                  .frame="${t.frame}"
                ></tomtut-pool-hero>`:I}
            ${i.map(t=>this._renderSlot(t))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(t){const e=this._config.frame;switch(Et[t.type]?.ready?t.type:"frame"){case"heatpump":return H`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return H`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-pump>`;case"uv":return H`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-uv>`;case"solar":return H`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-solar>`;case"custom":return H`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-custom>`;default:return H`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
          .slotType="${t.type}"
        ></tomtut-pool-slot-frame>`}}static styles=r`
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      overflow: visible;
    }
    /* Container-Queries statt Media-Queries: es zählt die Breite der Card,
       nicht die des Fensters — sonst bricht das Raster in Sections-Views. */
    .wrap {
      container-type: inline-size;
      width: 100%;
    }
    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 14px;
      align-items: stretch;
    }
    @container (min-width: 620px) {
      .grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .hero {
        grid-column: span 2;
      }
    }
    @container (min-width: 980px) {
      .grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }
      .hero {
        grid-column: span 2;
      }
    }
  `}customElements.define("tomtut-pool-dashboard",oe);class ae extends oe{setConfig(t){if(!t||"object"!=typeof t)throw new Error("Ungültige Konfiguration");if(!Kt(t))throw new Error("Mindestens eine Entity nötig: switch_entity, power_entity, target_entity oder current_entity");const{type:e,...i}=t;this._aliasConfig={...t},super.setConfig({version:1,hero:{enabled:!1},frame:{enabled:!1,fill:"transparent"},slots:[{type:"heatpump",...i}]})}static getConfigElement(){return document.createElement("tomtut-pool-heatpump-card-editor")}static getStubConfig(){return{switch_entity:"",power_entity:"",target_entity:"",current_entity:"",label_text:"Pool-Wärmepumpe"}}getCardSize(){return 6}}customElements.define("tomtut-pool-heatpump-card",ae);const le=["ha-entity-picker","ha-icon-picker"];let he=null;const ce=()=>"undefined"!=typeof customElements&&le.every(t=>!!customElements.get(t)),pe=t=>"undefined"!=typeof customElements&&!!customElements.get(t),de=()=>ce()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(he||(he=(async()=>{try{const t=await window.loadCardHelpers(),e=await(t?.createCardElement?.({type:"entities",entities:[]}));await(e?.constructor?.getConfigElement?.())}catch(t){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",t?.message||t)}return ce()})()),he);class ue{constructor({hass:t,config:e,defaults:i={},update:n,idPrefix:s="f",stash:r=null}){this.hass=t,this.config=e||{},this.defaults=i,this.update=n,this.idPrefix=s,this.stash=r}val(t){const e=this.config?.[t];return null==e||""===e?this.defaults[t]:e}raw(t){const e=this.config?.[t];return null==e?"":e}shown(t,e=!0){const i=this.config?.[t];return null==i?e:!1!==i}element(t,e,i=[],n=!0){const s=this.shown(e,n);return H`
      <div class="row">
        <span class="row-label">${t}</span>
        <input
          type="checkbox"
          data-key="${e}"
          ?checked="${s}"
          @change="${t=>this._toggleElement(e,i,n,t.target.checked)}"
        />
      </div>
    `}_toggleElement(t,e,i,n){const s={},r=this.stash;if(n){s[t]=!0!==i||void 0;const e=r?.[`${this.idPrefix}:${t}`];e&&(Object.assign(s,e),delete r[`${this.idPrefix}:${t}`])}else{s[t]=!1;const i={};for(const t of e)void 0!==this.config?.[t]&&(i[t]=this.config[t]),s[t]=void 0;r&&Object.keys(i).length&&(r[`${this.idPrefix}:${t}`]=i)}this.update(s)}text(t,e,i="",n=""){return H`
      <label
        >${t}
        <input
          type="text"
          data-key="${e}"
          .value="${String(this.raw(e))}"
          placeholder="${n}"
          @input="${t=>this.update({[e]:t.target.value})}"
        />
        ${i?H`<small>${i}</small>`:I}
      </label>
    `}_entityOptions(t){const e=this.hass?.states??{};return Object.keys(e).filter(e=>!t.length||t.some(t=>e.startsWith(t+"."))).sort()}entity(t,e,i="",...n){return this._entityInput({label:t,hint:i,domains:n,value:String(this.raw(e)),dataKey:e,listId:`${this.idPrefix}-${e}`,onChange:t=>this.update({[e]:t||void 0})})}entityAt(t,e,i,n="",...s){const r=Array.isArray(this.config?.[e])?this.config[e]:[];return this._entityInput({label:t,hint:n,domains:s,value:String(r[i]??""),dataKey:`${e}.${i}`,listId:`${this.idPrefix}-${e}-${i}`,onChange:t=>this._updateList(e,i,t)})}_entityInput({label:t,hint:e,domains:i,value:n,dataKey:s,listId:r,onChange:o}){return pe("ha-entity-picker")?H`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${n}"
          .label="${t}"
          .helper="${e}"
          .includeDomains="${i.length?i:void 0}"
          data-key="${s}"
          allow-custom-entity
          @value-changed="${t=>{t.stopPropagation(),o(t.detail?.value??"")}}"
        ></ha-entity-picker>
      `:H`
      <label
        >${t}
        <input
          type="text"
          list="${r}"
          data-key="${s}"
          .value="${n}"
          placeholder="${"Entity auswählen …"}"
          @input="${t=>o(t.target.value)}"
          @change="${t=>o(t.target.value)}"
        />
        <datalist id="${r}">
          ${this._entityOptions(i).map(t=>H`<option value="${t}"></option>`)}
        </datalist>
        ${e?H`<small>${e}</small>`:I}
      </label>
    `}_updateList(t,e,i){const n=Array.isArray(this.config?.[t])?[...this.config[t]]:[];for(;n.length<=e;)n.push("");for(n[e]=i;n.length&&!n[n.length-1];)n.pop();this.update({[t]:n.length?n:void 0})}icon(t,e,i=""){return pe("ha-icon-picker")?H`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(e))}"
          .label="${t}"
          .helper="${i}"
          data-key="${e}"
          @value-changed="${t=>{t.stopPropagation(),this.update({[e]:t.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(t,e,i,"mdi:lightbulb")}select(t,e,i,n){const s=this.config?.[e]??n;return H`
      <div class="row">
        <span class="row-label">${t}</span>
        <select data-key="${e}" @change="${t=>this.update({[e]:t.target.value})}">
          ${i.map(([t,e])=>H`<option value="${t}" ?selected="${s===t}">${e}</option>`)}
        </select>
      </div>
    `}slider(t,e,i,n,s="%",r=1){const o=this.val(e),a=null==o||""===o?i:o;return H`
      <div class="row">
        <span class="row-label">${t}</span>
        <input
          type="range"
          min="${i}"
          max="${n}"
          step="${r}"
          data-key="${e}"
          .value="${String(a)}"
          @input="${t=>this.update({[e]:parseFloat(t.target.value)})}"
        />
        <span class="row-val">${a}${s}</span>
      </div>
    `}toggle(t,e,i){const n=this.config?.[e]??i;return H`
      <div class="row">
        <span class="row-label">${t}</span>
        <input
          type="checkbox"
          data-key="${e}"
          ?checked="${n}"
          @change="${t=>this.update({[e]:t.target.checked})}"
        />
      </div>
    `}}const _e=(t,e,i=!1)=>H`
  <details class="section" ?open="${i}">
    <summary>${t}</summary>
    <div class="section-body">${e}</div>
  </details>
`,fe=t=>H`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${t}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`,me=r`
  .editor {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }
  label {
    display: flex;
    flex-direction: column;
    font-weight: 500;
    gap: 4px;
    font-size: 14px;
  }
  input[type="text"],
  select {
    padding: 8px;
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 4px;
    font-size: 14px;
    font-family: inherit;
    background: var(--card-background-color, #fff);
    color: var(--primary-text-color, #111);
  }
  ha-entity-picker,
  ha-icon-picker {
    display: block;
    width: 100%;
  }
  small {
    color: var(--secondary-text-color, #888);
    font-weight: 400;
  }
  .section {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 8px;
    overflow: hidden;
  }
  .section summary {
    padding: 10px 14px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    color: var(--primary-text-color);
    background: var(--card-background-color, rgba(0, 0, 0, 0.05));
    list-style: none;
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  .section summary::-webkit-details-marker {
    display: none;
  }
  .section summary::before {
    content: "▶";
    font-size: 10px;
    transition: transform 0.2s;
  }
  .section[open] summary::before {
    transform: rotate(90deg);
  }
  .section-body {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
  }
  .section.elements {
    border-color: var(--primary-color, #03a9f4);
  }
  .section.elements > summary {
    color: var(--primary-color, #03a9f4);
    background: rgba(3, 169, 244, 0.08);
  }
  .section.advanced {
    border-color: var(--warning-color, #ff9800);
  }
  .section.advanced > summary {
    font-size: 13px;
    color: var(--warning-color, #ff9800);
    background: rgba(255, 152, 0, 0.08);
  }
  .step-head {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color, #888);
    margin-top: 4px;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .row-label {
    flex: 1;
    font-size: 13px;
    color: var(--primary-text-color);
  }
  .row input[type="range"] {
    flex: 2;
  }
  .row select {
    flex: 2;
    padding: 6px;
    font-size: 13px;
  }
  .row select option[disabled] {
    font-style: italic;
    color: var(--secondary-text-color, #888);
  }
  .row-val {
    width: 54px;
    text-align: right;
    font-size: 13px;
    font-weight: 600;
    color: var(--primary-color);
  }
  .row input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
  /*
   * Ein Slot-Block im Editor: Trennlinie, große Überschrift, darunter die
   * Karte mit den Feldern. Die Kennfarbe des Slot-Typs (shared/assets.js)
   * kommt als --slot-farbe von außen und wird hier zweimal benutzt:
   * als schmaler Balken links und als sehr dezente Tönung des Blocks.
   * Weil die Tönung aus derselben Farbe gemischt wird, trägt sie in hellen
   * wie in dunklen Themes; die erste Regel ist der Rückfall für Browser
   * ohne color-mix.
   */
  .slot-block {
    display: flex;
    flex-direction: column;
    margin-top: 18px;
    padding-top: 10px;
    border-top: 2px solid var(--slot-farbe, var(--divider-color, #ccc));
  }
  .slot-ueberschrift {
    font-size: 17px;
    font-weight: 800;
    line-height: 1.25;
    margin: 0 0 10px;
    color: var(--primary-text-color);
  }
  .slot-card {
    border: 1px solid var(--divider-color, #ccc);
    border-left: 5px solid var(--slot-farbe, var(--divider-color, #ccc));
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: rgba(127, 127, 127, 0.05);
    background: color-mix(in srgb, var(--slot-farbe, transparent) 9%, transparent);
  }
  .slot-head {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .slot-head .row {
    flex: 1;
  }
  .icon-btn {
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color);
    border-radius: 6px;
    min-width: 32px;
    height: 32px;
    cursor: pointer;
    font-size: 15px;
    line-height: 1;
    font-family: inherit;
  }
  .icon-btn:hover {
    background: rgba(127, 127, 127, 0.15);
  }
  .icon-btn.danger {
    color: var(--error-color, #d32f2f);
    border-color: var(--error-color, #d32f2f);
  }
  .add-btn {
    align-self: flex-start;
    padding: 8px 14px;
    border-radius: 8px;
    border: 1px solid var(--primary-color, #03a9f4);
    color: var(--primary-color, #03a9f4);
    background: transparent;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    font-family: inherit;
  }
  .add-btn:hover {
    background: rgba(3, 169, 244, 0.1);
  }
`,ge=["switch","input_boolean","light"],be=["sensor","input_number"],$e=["sensor","input_number","number"],we=["climate","number","input_number","sensor"],ye=(t,e,i,n,s)=>t.shown(n,s)?_e(`${e} — Größe und Lage`,H`
          ${t.slider("Größe",`${i}_size`,2,30,"%",.5)}
          ${t.slider("Von oben",`${i}_top`,0,100,"%",.5)}
          ${t.slider("Von links",`${i}_left`,0,100,"%",.5)}
          <small>Die Größe ist die Breite in Prozent der Beckenbreite.</small>
        `):I,ve=t=>H`
  ${fe(H`
    ${t.element("⏻ Powerbutton","show_power_button",["switch_entity","power_btn_top","power_btn_left","power_btn_scale"])}
    ${t.element("⚡ Stromverbrauch","show_power",["power_entity","power_top","power_left","power_scale","power_box","power_label"])}
    ${t.element("🌡 Ist-Temperatur","show_current",["current_entity","current_bottom","current_left","current_scale","current_box","current_label"])}
    ${t.element("🎚 Soll-Temperatur","show_target",["target_entity","target_bottom","target_left","target_scale","target_step","target_box","target_label"])}
    ${t.element("🌀 Lüfter","show_fan",["fan_source","fan_entity","fan_power_threshold","fan_speed","fan_top","fan_left","fan_size","fan_ratio","fan_inactive"])}
  `)}
  ${t.shown("show_power_button")?H`
        ${t.entity("Powerbutton — Schalter","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ausschalten fragt immer nach.",...ge)}
        ${_e("Powerbutton — Position",H`
            ${t.slider("Von oben","power_btn_top",0,100)}
            ${t.slider("Von links","power_btn_left",0,100)}
            ${t.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_power")?H`
        ${t.entity("Stromverbrauch — Sensor","power_entity","Leistungssensor in W oder kW (z.B. Shelly).",...be)}
        ${_e("Stromverbrauch — Darstellung",H`
            ${t.slider("Von oben","power_top",0,100)}
            ${t.slider("Von links","power_left",0,100)}
            ${t.slider("Größe","power_scale",50,150)}
            ${t.toggle("Box anzeigen","power_box",!0)}
            ${t.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${t.shown("show_current")?H`
        ${t.entity("Ist-Temperatur","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.",...we)}
        ${_e("Ist-Temperatur — Darstellung",H`
            ${t.slider("Von unten","current_bottom",0,100)}
            ${t.slider("Von links","current_left",0,100)}
            ${t.slider("Größe","current_scale",50,150)}
            ${t.toggle("Box anzeigen","current_box",!0)}
            ${t.toggle("Label anzeigen","current_label",!0)}
          `)}
      `:I}
  ${t.shown("show_target")?H`
        ${t.entity("Soll-Temperatur","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",...we)}
        ${_e("Soll-Temperatur — Darstellung",H`
            ${t.slider("Von unten","target_bottom",0,100)}
            ${t.slider("Von links","target_left",0,100)}
            ${t.slider("Größe","target_scale",50,150)}
            ${t.slider("Schrittweite","target_step",.1,5,"",.1)}
            ${t.toggle("Box anzeigen","target_box",!0)}
            ${t.toggle("Label anzeigen","target_label",!0)}
          `)}
      `:I}
  ${t.shown("show_fan")?H`
        ${_e("Lüfter — wann dreht er?",H`
            ${t.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
            ${t.entity("Lüfter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
            ${t.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
            ${t.slider("Drehgeschwindigkeit","fan_speed",0,100)}
          `,!0)}
        ${_e("Lüfter — Position",H`
            ${t.slider("Von oben","fan_top",0,100,"%",.5)}
            ${t.slider("Von links","fan_left",0,100,"%",.5)}
            ${t.slider("Breite","fan_size",5,80,"%",.5)}
            ${t.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
            ${t.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          `)}
      `:I}
  ${t.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Wärmepumpe")}
  ${_e("Freitext — Darstellung",H`
      ${t.slider("Von oben","label_top",0,100)}
      ${t.slider("Von links","label_left",0,100)}
      ${t.slider("Größe","label_scale",50,200)}
      ${t.toggle("Box anzeigen","label_box",!0)}
    `)}
`,xe={heatpump:Ft,pump:Qt,uv:Jt,solar:te},ke=(t,e)=>{const i={...t||{}};for(const[t,n]of Object.entries(e||{}))void 0===n?delete i[t]:i[t]=n;return i};class Se extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),de().then(t=>{t&&this.requestUpdate()})}setConfig(t){this._config={version:1,hero:{enabled:!0,shape:bt},frame:{enabled:!0,fill:"transparent"},slots:[],...t||{}}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_updateHero(t){this._emit({...this._config,hero:ke(this._config.hero,t)})}_updateFrame(t){this._emit({...this._config,frame:ke(this._config.frame,t)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_updateSlot(t,e){const i=this._slots().map((i,n)=>n===t?ke(i,e):i);this._emit({...this._config,slots:i})}_updateEntry(t,e,i){const n=this._slots()[t]||{},s=Array.isArray(n.entries)?[...n.entries]:[];for(;s.length<=e;)s.push({});s[e]=ke(s[e],i),this._updateSlot(t,{entries:s})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(t){this._emit({...this._config,slots:this._slots().filter((e,i)=>i!==t)})}_moveSlot(t,e){const i=[...this._slots()],n=t+e;if(n<0||n>=i.length)return;const[s]=i.splice(t,1);i.splice(n,0,s),this._emit({...this._config,slots:i})}_fieldsFor(t){const e=this._slots()[t]||{};return new ue({hass:this.hass,config:e,defaults:xe[e.type]||{},update:e=>this._updateSlot(t,e),idPrefix:`slot${t}`,stash:this._stash})}_altTypOption(t){const e=Et[t];return e&&!1===e.waehlbar?H`<option value="${t}" selected>${e.label}</option>`:I}_slotKopf(t,e){const i=Et[t?.type]?.label||Et.frame.label,n=String(t?.label||t?.label_text||t?.title||"").trim();return`Kasten ${e+1} · ${i}${n?` · ${n}`:""}`}_slotBody(t){const e=this._slots()[t]||{},i=this._fieldsFor(t);switch(e.type){case"heatpump":return ve(i);case"pump":return(t=>H`
  ${fe(H`
    ${t.element("🎚 Stufen-Taster","show_stages",["stage_mode","stage_entities","stop_entity","stage_labels"])}
    ${t.element("⏻ Powerbutton","show_power_button",["main_entity","power_btn_top","power_btn_left","power_btn_scale"])}
    ${t.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${t.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${t.element("🌀 Laufrad","show_fan",["fan_top","fan_left","fan_size","fan_speed_1","fan_speed_2","fan_speed_3","fan_inactive","idle_watt"])}
  `)}
  ${t.text("Überschrift (optional)","label","","z.B. Poolpumpe")}
  ${t.shown("show_stages")?H`
        ${t.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
        ${t.entityAt("Stufe 1 (N1)","stage_entities",0,"",...ge)}
        ${t.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"",...ge)}
        ${t.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"",...ge)}
        ${t.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...ge)}
      `:I}
  ${t.shown("show_power_button")?H`
        ${t.entity("Hauptschalter","main_entity","Steckdose/Relais der Pumpe — Powerbutton mit Rückfrage.",...ge)}
        ${_e("Powerbutton — Position",H`
            ${t.slider("Von oben","power_btn_top",0,100)}
            ${t.slider("Von links","power_btn_left",0,100)}
            ${t.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_power")?H`
        ${t.entity("Stromverbrauch","power_entity","W oder kW.",...be)}
        ${_e("Stromverbrauch — Darstellung",H`
            ${t.slider("Von unten","power_bottom",0,100)}
            ${t.slider("Von links","power_left",0,100)}
            ${t.slider("Größe","power_scale",50,150)}
            ${t.toggle("Box anzeigen","power_box",!0)}
            ${t.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${t.shown("show_temp")?H`
        ${t.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...$e)}
        ${_e("Thermometer — Position",H`
            ${t.slider("Von oben","temp_top",0,100)}
            ${t.slider("Von links","temp_left",0,100)}
            ${t.slider("Größe","temp_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_fan")?H`
        ${_e("Laufrad — Tempo",H`
            ${t.slider("Tempo N1","fan_speed_1",1,10,"",1)}
            ${t.slider("Tempo N2","fan_speed_2",1,10,"",1)}
            ${t.slider("Tempo N3","fan_speed_3",1,10,"",1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${_e("Laufrad — Position",H`
            ${t.slider("Von oben","fan_top",0,100,"%",.5)}
            ${t.slider("Von links","fan_left",0,100,"%",.5)}
            ${t.slider("Größe","fan_size",3,60,"%",.5)}
            ${t.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `)}
        ${_e("Wann steht die Pumpe?",H`
            ${t.slider("Ruhewatt","idle_watt",0,200," W",1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).</small>
          `)}
      `:I}
`)(i);case"uv":return(t=>H`
  ${fe(H`
    ${t.element("⏻ Powerbutton","show_power_button",["switch_entity","power_btn_top","power_btn_left","power_btn_scale"])}
    ${t.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${t.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${t.element("💡 Glüheffekt","show_glow",["glow_top","glow_left","glow_size","glow_thickness","glow_angle","glow_intensity"])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${t.text("Überschrift (optional)","label","","z.B. UV-C-Lampe")}
  ${t.shown("show_power_button")?H`
        ${t.entity("Powerbutton — Schalter","switch_entity","Steckdose/Relais der Lampe. Ausschalten fragt immer nach.",...ge)}
        ${_e("Powerbutton — Position",H`
            ${t.slider("Von oben","power_btn_top",0,100)}
            ${t.slider("Von links","power_btn_left",0,100)}
            ${t.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_power")?H`
        ${t.entity("Stromverbrauch","power_entity","W oder kW.",...be)}
        ${_e("Stromverbrauch — Darstellung",H`
            ${t.slider("Von unten","power_bottom",0,100)}
            ${t.slider("Von links","power_left",0,100)}
            ${t.slider("Größe","power_scale",50,150)}
            ${t.toggle("Box anzeigen","power_box",!0)}
            ${t.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${t.shown("show_temp")?H`
        ${t.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...$e)}
        ${_e("Thermometer — Position",H`
            ${t.slider("Von oben","temp_top",0,100)}
            ${t.slider("Von links","temp_left",0,100)}
            ${t.slider("Größe","temp_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_glow")?_e("Glüheffekt — Lage auf dem Rohr",H`
          ${t.slider("Von oben","glow_top",0,100,"%",.5)}
          ${t.slider("Von links","glow_left",0,100,"%",.5)}
          ${t.slider("Länge","glow_size",5,100,"%",.5)}
          ${t.slider("Dicke","glow_thickness",2,60,"%",.5)}
          ${t.slider("Neigung","glow_angle",-90,90,"°",1)}
          ${t.slider("Leuchtstärke","glow_intensity",10,100)}
          <small>Leuchtet nur, solange der Schalter an ist — ohne Animation.</small>
        `):I}
  ${_e("Bild — Drehen, Spiegeln, Größe, Anschlussvariante",H`
      ${t.slider("Drehen","rotate",0,359,"°",1)}
      ${t.toggle("Waagrecht spiegeln","mirror",!1)}
      ${t.slider("Größe","uv_size",30,Lt)}
      ${t.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `)}
`)(i);case"solar":return(t=>H`
  ${fe(H`
    ${t.element("⏻ Powerbutton","show_power_button",["switch_entity","power_btn_top","power_btn_left","power_btn_scale"])}
    ${t.element("🌡 Vorlauf (oben, ins Feld)","show_temp_in",["temp_in_entity","temp_in_top","temp_in_left","temp_in_scale"])}
    ${t.element("🌡 Rücklauf (unten, ins Becken)","show_temp_out",["temp_out_entity","temp_out_top","temp_out_left","temp_out_scale"])}
    ${t.element("⬇ Richtungspfeile","show_arrows",["arrow_in_top","arrow_in_left","arrow_in_size","arrow_out_top","arrow_out_left","arrow_out_size"])}
    ${t.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
  `)}
  <small>
    Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
    Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt. Das Bild zeigt ein Feld aus
    drei Absorbern; der blaue Pfeil oben ist der Zulauf, der rote unten der Rücklauf.
  </small>
  ${t.text("Überschrift (optional)","label","","z.B. Solarheizung")}
  ${t.shown("show_power_button")?H`
        ${t.entity("Powerbutton — Ventil oder Pumpe","switch_entity","Solarventil oder Solarpumpe. Abschalten fragt immer nach.",...ge)}
        ${_e("Powerbutton — Position",H`
            ${t.slider("Von oben","power_btn_top",0,100)}
            ${t.slider("Von links","power_btn_left",0,100)}
            ${t.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_temp_in")?H`
        ${t.entity("Vorlauf-Temperatur","temp_in_entity","Wasser, das zum Absorber läuft — oberer Anschluss (blauer Pfeil).",...$e)}
        ${_e("Vorlauf — Position",H`
            ${t.slider("Von oben","temp_in_top",0,100,"%",.5)}
            ${t.slider("Von links","temp_in_left",0,100,"%",.5)}
            ${t.slider("Größe","temp_in_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_temp_out")?H`
        ${t.entity("Rücklauf-Temperatur","temp_out_entity","Wasser, das zurück ins Becken läuft — unterer Anschluss (roter Pfeil).",...$e)}
        ${_e("Rücklauf — Position",H`
            ${t.slider("Von oben","temp_out_top",0,100,"%",.5)}
            ${t.slider("Von links","temp_out_left",0,100,"%",.5)}
            ${t.slider("Größe","temp_out_scale",50,200)}
          `)}
      `:I}
  ${t.shown("show_power")?H`
        ${t.entity("Stromverbrauch","power_entity","Solarpumpe in W oder kW.",...be)}
        ${_e("Stromverbrauch — Darstellung",H`
            ${t.slider("Von unten","power_bottom",0,100)}
            ${t.slider("Von links","power_left",0,100)}
            ${t.slider("Größe","power_scale",50,150)}
            ${t.toggle("Box anzeigen","power_box",!0)}
            ${t.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${t.shown("show_arrows")?_e("Richtungspfeile — Lage",H`
          ${t.slider("Zulauf (blau) — Von oben","arrow_in_top",0,100,"%",.5)}
          ${t.slider("Zulauf (blau) — Von links","arrow_in_left",0,100,"%",.5)}
          ${t.slider("Zulauf (blau) — Größe","arrow_in_size",2,20,"%",.5)}
          ${t.slider("Rücklauf (rot) — Von oben","arrow_out_top",0,100,"%",.5)}
          ${t.slider("Rücklauf (rot) — Von links","arrow_out_left",0,100,"%",.5)}
          ${t.slider("Rücklauf (rot) — Größe","arrow_out_size",2,20,"%",.5)}
          <small>
            Beide Pfeile zeigen nach unten: oben läuft kaltes Wasser ins Feld, unten warmes
            heraus. Sie sind reine Beschriftung und ändern sich nie.
          </small>
        `):I}
`)(i);case"custom":return((t,e)=>H`
  ${t.text("Überschrift (optional)","title","","z.B. Wetter")}
  ${t.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"mitte")}
  ${[0,1,2].map(t=>_e(`Eintrag ${t+1}`,e(t),0===t))}
`)(i,i=>(t=>H`
  ${t.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===t.config?.kind?t.text("Text","text","","z.B. Sommerbetrieb"):H`
        ${t.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate")}
        ${t.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===t.config?.kind?t.icon("Icon (optional)","icon"):I}
      `}
`)(new ue({hass:this.hass,config:(Array.isArray(e.entries)?e.entries:[])[i]||{},update:e=>this._updateEntry(t,i,e),idPrefix:`slot${t}e${i}`,stash:this._stash})));case"hidden":return H`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;default:return(t=>H`
  ${t.text("Überschrift (optional)","title","","z.B. Platzhalter")}
  ${t.text("Hinweistext (optional)","hint","","")}
`)(i)}}render(){if(!this._config)return I;const t=this._config.hero||{},e=this._config.frame||{},i=new ue({hass:this.hass,config:t,defaults:It(t.shape),update:t=>this._updateHero(t),idPrefix:"hero",stash:this._stash}),n=new ue({hass:this.hass,config:e,update:t=>this._updateFrame(t),idPrefix:"frame",stash:this._stash}),s=this._slots();return H`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        ${i.toggle("Becken anzeigen","enabled",!0)}
        ${!1===t.enabled?I:(t=>H`
  ${fe(H`
    ${t.element("🌡 Thermometer","show_thermo",["temp_entity","thermo_scale","thermo_top","thermo_left"])}
    ${t.element("🧪 pH-Kästchen","show_ph",["ph_entity","ph_top","ph_left"])}
    ${t.element("⚗ Redox / RX-Kästchen","show_rx",["rx_entity","rx_top","rx_left"])}
    ${t.element("🛟 Skimmer","show_skimmer",["skimmer_size","skimmer_top","skimmer_left"])}
    ${t.element("💦 Einlaufdüse","show_inlet",["inlet_size","inlet_top","inlet_left","inlet_temp_entity","inlet_temp_top","inlet_temp_left"])}
    ${t.element("⚓ Bodenablauf","show_drain",["drain_size","drain_top","drain_left"],!1)}
  `)}
  ${t.select("Beckenform","shape",Object.entries(gt).map(([t,e])=>[t,e.label]),"oval")}
  ${t.shown("show_thermo")?H`
        ${t.entity("Wassertemperatur","temp_entity","Zeigt das Thermometer auf der Wasserfläche.",...$e)}
        ${_e("Thermometer — Position",H`
            ${t.slider("Größe","thermo_scale",50,200)}
            ${t.slider("Von oben","thermo_top",0,100,"%",.5)}
            ${t.slider("Von links","thermo_left",0,100,"%",.5)}
          `)}
      `:I}
  ${t.shown("show_ph")?H`
        ${t.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...$e)}
        ${_e("pH — Position",H`
            ${t.slider("Von oben","ph_top",0,100,"%",.5)}
            ${t.slider("Von links","ph_left",0,100,"%",.5)}
          `)}
      `:I}
  ${t.shown("show_rx")?H`
        ${t.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...$e)}
        ${_e("RX — Position",H`
            ${t.slider("Von oben","rx_top",0,100,"%",.5)}
            ${t.slider("Von links","rx_left",0,100,"%",.5)}
          `)}
      `:I}
  ${ye(t,"Skimmer","skimmer","show_skimmer",!0)}
  ${ye(t,"Einlaufdüse","inlet","show_inlet",!0)}
  ${t.shown("show_inlet",!0)?H`
        ${t.entity("Temperatur am Einlauf (optional)","inlet_temp_entity","Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",...$e)}
        ${t.raw("inlet_temp_entity")?_e("Einlauf-Temperatur — Position",H`
                ${t.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
                ${t.slider("Von links","inlet_temp_left",0,100,"%",.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `):I}
      `:I}
  ${ye(t,"Bodenablauf","drain","show_drain",!1)}
  ${t.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${t.raw("label_text")?_e("Freitext — Darstellung",H`
          ${t.slider("Größe","label_scale",50,200)}
          ${t.slider("Von oben","label_top",0,100,"%",.5)}
          ${t.slider("Von links","label_left",0,100,"%",.5)}
        `):I}
  ${t.toggle("Becken mit Rahmen","framed",!1)}
`)(i)}

        <div class="step-head">Schritt 2 — Geräte</div>
        ${s.map((t,e)=>H`
            <div class="slot-block" style="--slot-farbe:${Pt(t.type)};">
              <div class="slot-ueberschrift">${this._slotKopf(t,e)}</div>
              <div class="slot-card">
                <div class="slot-head">
                  <div class="row">
                    <span class="row-label">Typ</span>
                    <select
                      data-key="type"
                      @change="${t=>this._updateSlot(e,{type:t.target.value})}"
                    >
                      ${this._altTypOption(t.type)}
                      ${Tt().map(e=>e.trenner?H`<option disabled data-trenner>${e.label}</option>`:H`
                              <option
                                value="${e.value}"
                                ?selected="${(t.type||"frame")===e.value}"
                              >
                                ${e.label}
                              </option>
                            `)}
                    </select>
                  </div>
                  <button
                    class="icon-btn"
                    title="nach oben"
                    @click="${()=>this._moveSlot(e,-1)}"
                  >
                    ↑
                  </button>
                  <button class="icon-btn" title="nach unten" @click="${()=>this._moveSlot(e,1)}">
                    ↓
                  </button>
                  <button
                    class="icon-btn danger"
                    title="entfernen"
                    @click="${()=>this._removeSlot(e)}"
                  >
                    ✕
                  </button>
                </div>
                ${this._slotBody(e)}
              </div>
            </div>
          `)}
        <button class="add-btn" @click="${()=>this._addSlot()}">+ Slot hinzufügen</button>

        <div class="step-head">Schritt 3 — Optik</div>
        ${n.toggle("Rahmen um die Slots","enabled",!0)}
        ${n.select("Füllung","fill",[["transparent","Transparent (Theme)"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        <small>
          Die Füllung gilt für den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und
          Schriftfarbe. Transparent nimmt den Hintergrund des HA-Themes.
        </small>
      </div>
    `}static styles=[me]}customElements.define("tomtut-pool-dashboard-editor",Se);class Ae extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),de().then(t=>{t&&this.requestUpdate()})}setConfig(t){this._config={...t||{}}}_update(t){const e=ke(this._config,t);this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}render(){if(!this._config)return I;const t=new ue({hass:this.hass,config:this._config,defaults:Ft,update:t=>this._update(t),idPrefix:"hp",stash:this._stash});return H`<div class="editor">${ve(t)}</div>`}static styles=[me]}customElements.define("tomtut-pool-heatpump-card-editor",Ae),
/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung für Pool-Dashboards
 *
 * Enthält zwei Card-Typen aus einem Bundle:
 *   custom:tomtut-pool-dashboard      — Becken-Hero + frei bestückbare Geräte-Slots
 *   custom:tomtut-pool-heatpump-card  — Alias für bestehende Wärmepumpen-Karten
 *
 * Keine Integration nötig: alle Werte kommen aus frei konfigurierbaren
 * Entities. Die Bilder liegen im Repo unter dist/ und werden von HACS nach
 * www/community/tomtut-pool-cards/ kopiert.
 */
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"},{type:"tomtut-pool-heatpump-card",name:"TomTuT Pool Heatpump",description:"Generische Card für Pool-Wärmepumpen: Soll-/Ist-Temperatur, Stromverbrauch, Powerbutton mit Rückfrage und animierter Lüfter",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{wt as DEVICE_IMAGES,xt as DEVICE_RATIOS,vt as DEVICE_VARIANTS,kt as FLOW_MARKERS,Lt as GROESSE_MAX,Ot as GROESSE_MIN,Ft as HEATPUMP_DEFAULTS,Gt as HERO_DEFAULTS,yt as HERO_SPRITES,Ht as INLET_TEMP_VERSATZ,Qt as PUMP_DEFAULTS,gt as SHAPES,zt as SLOT_GRAU,Et as SLOT_TYPES,Ct as SLOT_TYPE_GROUPS,te as SOLAR_DEFAULTS,oe as TomtutPoolDashboardCard,Se as TomtutPoolDashboardEditor,ae as TomtutPoolHeatpumpCard,Ae as TomtutPoolHeatpumpCardEditor,Jt as UV_DEFAULTS,ke as applyPatch,Rt as bildTransform,qt as fanDuration,Nt as groesseFaktor,It as heroDefaultsFor,Bt as normGrad,ct as numOf,mt as numText,Vt as passFaktor,Pt as slotFarbe,Tt as slotTypeOptions,dt as toWatt};
