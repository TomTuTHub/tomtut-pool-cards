const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const s=e=>new r("string"==typeof e?e:e+"",void 0,i),a=(e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new r(n,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return s(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:p,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,g=m?m.emptyScript:"",b=f.reactiveElementPolyfillSupport,_=(e,t)=>e,v={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},k=(e,t)=>!l(e,t),w={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:k};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=w){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const s=n?.call(this);r?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??w}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const e=this.properties,t=[...p(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:v;this._$Em=n;const s=r.fromAttribute(t,e.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const s=this.constructor;if(!1===n&&(r=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??k)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[_("elementProperties")]=new Map,y[_("finalized")]=new Map,b?.({ReactiveElement:y}),(f.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,x=e=>e,z=$.trustedTypes,S=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",B=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+B,T=`<${E}>`,M=document,C=()=>M.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,W="[ \t\n\f\r]",K=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,N=/>/g,R=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,F=/"/g,D=/^(?:script|style|textarea|title)$/i,H=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),G=Symbol.for("lit-nothing"),U=new WeakMap,Z=M.createTreeWalker(M,129);function V(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const q=(e,t)=>{const i=e.length-1,n=[];let r,s=2===t?"<svg>":3===t?"<math>":"",a=K;for(let t=0;t<i;t++){const i=e[t];let o,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===K?"!--"===l[1]?a=L:void 0!==l[1]?a=N:void 0!==l[2]?(D.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=r??K,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?R:'"'===l[3]?F:I):a===F||a===I?a=R:a===L||a===N?a=K:(a=R,r=void 0);const p=a===R&&e[t+1].startsWith("/>")?" ":"";s+=a===K?i+T:c>=0?(n.push(o),i.slice(0,c)+A+i.slice(c)+B+p):i+B+(-2===c?t:p)}return[V(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,s=0;const a=e.length-1,o=this.parts,[l,c]=q(e,t);if(this.el=Q.createElement(l,i),Z.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Z.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(A)){const t=c[s++],i=n.getAttribute(e).split(B),a=/([.?@])?(.*)/.exec(t);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(B)&&(o.push({type:6,index:r}),n.removeAttribute(e));if(D.test(n.tagName)){const e=n.textContent.split(B),t=e.length-1;if(t>0){n.textContent=z?z.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],C()),Z.nextNode(),o.push({type:2,index:++r});n.append(e[t],C())}}}else if(8===n.nodeType)if(n.data===E)o.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(B,e+1));)o.push({type:7,index:r}),e+=B.length-1}r++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,n){if(t===j)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const s=P(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,n)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??M).importNode(t,!0);Z.currentNode=n;let r=Z.nextNode(),s=0,a=0,o=i[0];for(;void 0!==o;){if(s===o.index){let t;2===o.type?t=new Y(r,r.nextSibling,this,e):1===o.type?t=new o.ctor(r,o.name,o.strings,this,e):6===o.type&&(t=new re(r,this,e)),this._$AV.push(t),o=i[++a]}s!==o?.index&&(r=Z.nextNode(),s++)}return Z.currentNode=M,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=G,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),P(e)?e===G||null==e||""===e?(this._$AH!==G&&this._$AR(),this._$AH=G):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==G&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new J(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=U.get(e.strings);return void 0===t&&U.set(e.strings,t=new Q(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new Y(this.O(C()),this.O(C()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=G,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=G}_$AI(e,t=this,i,n){const r=this.strings;let s=!1;if(void 0===r)e=X(this,e,t,0),s=!P(e)||e!==this._$AH&&e!==j,s&&(this._$AH=e);else{const n=e;let a,o;for(e=r[0],a=0;a<r.length-1;a++)o=X(this,n[i+a],t,a),o===j&&(o=this._$AH[a]),s||=!P(o)||o!==this._$AH[a],o===G?e=G:e!==G&&(e+=(o??"")+r[a+1]),this._$AH[a]=o}s&&!n&&this.j(e)}j(e){e===G?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===G?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==G)}}class ne extends ee{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??G)===j)return;const i=this._$AH,n=e===G&&i!==G||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==G&&(i===G||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const se=$.litHtmlPolyfillSupport;se?.(Q,Y),($.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class oe extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new Y(t.insertBefore(C(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const le=ae.litElementPolyfillSupport;le?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");const ce=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],de=e=>ce.includes(String(e).toLowerCase()),pe=e=>{if(null==e)return null;const t=String(e).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(t))return null;const i=Number(t);return isFinite(i)?i:null},he=(e,t=0)=>{const i=Number(e);if(!isFinite(i))return"—";const[n,r]=i.toFixed(t).split("."),s=n.replace("-",""),a=s.length>4?s.replace(/\B(?=(\d{3})+(?!\d))/g,"."):s;return(n.startsWith("-")?"-":"")+a+(r?","+r:"")},ue=e=>{if(!e)return null;const t=pe(e.state);if(null===t)return null;return"kw"===String(e.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*t:t},fe=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const n=Math.max(0,(t-i)/1e3);if(n<60)return"gerade eben";const r=n/60;if(r<60)return`seit ${Math.floor(r)} Min`;const s=r/60;if(s<24)return`seit ${Math.floor(s)} Std`;const a=Math.floor(s/24);return a<=1?"seit 1 Tag":`seit ${a} Tagen`},me=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const n=Math.floor(Math.max(0,t-i)/6e4);if(n<1)return"gerade eben";if(n<60)return`seit ${n} Min`;if(n<1440){const e=Math.floor(n/60),t=n%60;return t?`seit ${e} Std ${t} Min`:`seit ${e} Std`}const r=Math.floor(n/1440);return r<=1?"seit 1 Tag":`seit ${r} Tagen`},ge=["","unknown","unavailable","none"],be=e=>ge.includes(String(e??"").trim().toLowerCase()),_e=/\b(aus|off|bypass|zu|closed|geschlossen|inaktiv|inactive|stop|stopp|idle|standby|false)\b/,ve=/\b(an|ein|heizen|heizt|heating|heat|aktiv|active|läuft|laeuft|running|run|offen|open|auf|solar|true)\b/,ke=e=>{const t=String(e??"").trim().toLowerCase();return!be(t)&&(!!de(t)||!_e.test(t)&&ve.test(t))},we=e=>String(e||"").split(".")[0],ye=(e,t)=>e?.attributes?.friendly_name||String(t||"").split(".")[1]||String(t||""),$e=(e,{decimals:t}={})=>{const i=pe(e?.state);if(null===i)return"—";const n=t??(Number.isInteger(i)?0:1),r=e.attributes?.unit_of_measurement;return he(i,Math.min(n,1))+(r?" "+r:"")},xe=e=>{if(!e)return"—";const t=pe(e.state),i=e.attributes?.unit_of_measurement;return null!==t?he(t,Number.isInteger(t)?0:1)+(i?" "+i:""):String(e.state)+(i?" "+i:"")},ze={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},Se="oval",Ae={nierenform:"niere",kreis:"rund",acht:"achtform",rechteckig:"rechteck",freiformbecken:"freiform"},Be=e=>{const t=String(e||"").trim().toLowerCase();return ze[t]?t:Ae[t]||null},Ee=e=>ze[Be(e)]||ze[Se],Te={"poolbecken_oval.png":1090/389,"poolbecken_rechteck.png":1280/544,"poolbecken_achtform.png":1280/542,"poolbecken_rund.png":1280/716,"poolbecken_nierenform.png":1280/547,"poolbecken_freiform.png":1280/543},Me=e=>Te[Ee(e).file]||2.5,Ce={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},Pe={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0,ratio:640/465},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0,ratio:503/342},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1,ratio:640/529}},Oe={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},We={heatpump:988/725,pump:1126/756,uv:947/384,solar:1001/710},Ke={in:"pfeil_blau.png",out:"pfeil_rot.png"},Le="1.0.0-a51d66cd",Ne=Le.startsWith("__")?"dev":Le,Re=e=>"/local/community/tomtut-pool-cards/"+e+"?v="+encodeURIComponent(Ne),Ie=(e,t)=>Re(Oe[e]?.[t]||Ce[e]||""),Fe=e=>We[e]||1,De={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},He="#8a8f98",je={hero:"#12a4b8"},Ge=e=>De[e]?.farbe||je[e]||He,Ue=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],Ze=()=>{const e=new Set(Ue.flatMap(e=>e.keys)),t=Object.keys(De).filter(t=>!e.has(t)&&!1!==De[t].waehlbar),i=e=>({value:e,label:De[e].label+(!1===De[e].ready?" (folgt)":"")}),n=[];for(const e of Ue){e.trenner&&n.push({trenner:!0,label:e.trenner});for(const t of e.keys)De[t]&&n.push(i(t))}for(const e of t)n.push(i(e));return n},Ve=e=>{const t=Number(e);return isFinite(t)?(Math.round(t)%360+360)%360:0},qe=e=>Math.abs(e)<1e-9?0:Math.abs(e),Qe=(e,t)=>{const i=Number(t)>0?Number(t):1,n=Ve(e)*Math.PI/180,r=qe(Math.cos(n)),s=qe(Math.sin(n));return Math.min(1,i/(i*r+s),1/(i*s+r))},Xe=30,Je=100,Ye=e=>{const t=Number(e);return isFinite(t)?Math.min(Je,Math.max(30,t))/100:1},et=(e,t,i,n=100)=>{const r=Ve(e),s=(e=>Math.round(1e3*e)/1e3)(Qe(r,i)*Ye(n)),a=[];return r&&a.push(`rotate(${r}deg)`),s<1&&a.push(`scale(${s})`),!0===t&&a.push("scaleX(-1)"),a.length?`transform:${a.join(" ")};`:""},tt='<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>',it='fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"',nt=(e,t,i="")=>Array.from({length:t},(n,r)=>{const s=Math.round(360/t*r*100)/100;return`<path d="${e}" ${it}${i}${s?` transform="rotate(${s} 20 20)"`:""}/>`}).join(""),rt=(e=3.2)=>`<circle cx="20" cy="20" r="${e}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`,st={klassisch:{label:"Klassisch (4 Blätter)",svg:tt},drei:{label:"3 Blätter, breit",svg:nt("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z",3)+rt(3.6)},fuenf:{label:"5 Blätter, schlank",svg:nt("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z",5)+rt(3)},sichel:{label:"Sichel / Turbine",svg:nt("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z",7)+'<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>'+rt(3.4)},propeller:{label:"Propeller",svg:nt("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z",2)+'<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>'},batman:{label:"Batman",svg:'<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" '+it+"/>"}},at="klassisch",ot=e=>(st[e]||st[at]).svg,lt=H`<svg viewBox="0 0 24 60" aria-hidden="true">
  <rect x="8" y="3" width="8" height="38" rx="4" fill="#ffffff" stroke="#111" stroke-width="1.6" />
  <circle cx="12" cy="48" r="8" fill="#e8483c" stroke="#111" stroke-width="1.6" />
  <rect x="10" y="20" width="4" height="26" fill="#e8483c" />
  <g stroke="#111" stroke-width="1.2" stroke-linecap="round">
    <line x1="16" y1="10" x2="20" y2="10" />
    <line x1="16" y1="16" x2="20" y2="16" />
    <line x1="16" y1="22" x2="20" y2="22" />
    <line x1="16" y1="28" x2="20" y2="28" />
  </g>
</svg>`,ct=(e={})=>String(e?.label||e?.label_text||e?.title||"").trim();let dt=null;class pt extends oe{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},kiosk:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this.kiosk=!1,this._confirmOpen=!1,this._frage=null,this._esc=e=>{"Escape"===e.key&&this._dialogOffen&&(e.preventDefault(),e.stopPropagation(),this._dialogeSchliessen())}}get _dialogOffen(){return!0===this._confirmOpen}_dialogeSchliessen(){this._confirmOpen=!1,this._frage=null}_alsOffenMelden(){dt&&dt!==this&&dt._dialogeSchliessen(),dt=this}updated(e){super.updated?.(e);const t=this._dialogOffen&&this.bedienbar;if(t&&!this._escAn&&"undefined"!=typeof window?(window.addEventListener("keydown",this._esc,!0),this._escAn=!0):!t&&this._escAn&&(window.removeEventListener("keydown",this._esc,!0),this._escAn=!1,dt===this&&(dt=null)),this._klemmen(),this._klemmBeobachter(),!this._nachgemessen&&"function"==typeof setTimeout){this._nachgemessen=!0;for(const e of[300,1500]){const t=setTimeout(()=>this.isConnected&&this._klemmen(),e);"function"==typeof t?.unref&&t.unref()}document?.fonts?.ready?.then?.(()=>this.isConnected&&this._klemmen())}}disconnectedCallback(){this._escAn&&window.removeEventListener("keydown",this._esc,!0),this._escAn=!1,dt===this&&(dt=null),this._ro?.disconnect(),this._ro=null,super.disconnectedCallback()}_klemmen(){const e=this.renderRoot?.querySelector?.(".img-wrap"),t=this.renderRoot?.querySelector?.(".slot");if(!e?.getBoundingClientRect||!t?.getBoundingClientRect)return;const i=t.getBoundingClientRect();if(!i.width||!i.height||!e.getBoundingClientRect().height)return;this._vorKlemmen(e);const n="function"==typeof getComputedStyle?getComputedStyle(t):null,r=e=>parseFloat(n?.[`border${e}Width`])||0,s=i.left+r("Left"),a=i.right-r("Right"),o=i.top+r("Top"),l=i.bottom-r("Bottom");for(const t of e.querySelectorAll(".power-badge, .value-box, .thermo, .label-badge, .chem-box, .release-badge, .mode-badge")){t.style.translate="";const e=t.getBoundingClientRect();if(!e.width&&!e.height)continue;const i={left:e.left,top:e.top,right:e.right,bottom:e.bottom};for(const e of t.querySelectorAll(".release-seit")){const t=e.getBoundingClientRect();i.left=Math.min(i.left,t.left),i.right=Math.max(i.right,t.right),i.bottom=Math.max(i.bottom,t.bottom)}const n=i.left<s?s-i.left:i.right>a?a-i.right:0,r=i.top<o?o-i.top:i.bottom>l?l-i.bottom:0;(Math.abs(n)>=.5||Math.abs(r)>=.5)&&(t.style.translate=`${Math.round(10*n)/10}px ${Math.round(10*r)/10}px`)}}_vorKlemmen(){}_klemmBeobachter(){const e=this.renderRoot?.querySelector?.(".img-wrap");if(!e||"undefined"==typeof ResizeObserver)return;const t=[e,...e.querySelectorAll(".power-badge, .label-badge")];if(!this._roZiele||t.length!==this._roZiele.length||!t.every((e,t)=>e===this._roZiele[t])){this._ro?.disconnect(),this._ro=new ResizeObserver(()=>this._klemmen());for(const e of t)this._ro.observe(e);this._roZiele=t}}get defaults(){return{}}_v(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}_ent(e){return e?this.hass?.states?.[e]:void 0}_isOn(e){const t=this._ent(e);return!!t&&de(t.state)}_watt(e){return ue(this._ent(e))}get bedienbar(){return!0!==this.kiosk}_call(e,t,i={}){this.bedienbar&&e&&this.hass&&this.hass.callService(we(e),t,{entity_id:e,...i})}_moreInfo(e){if(!this.bedienbar)return;const t=e?.currentTarget?.dataset?.entity;t&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0})))}get _frameClasses(){const e=this.frame||{},t=["transparent","weiss","schwarz"].includes(e.fill)?e.fill:"transparent";return`slot ${!1===e.enabled?"":"framed"} fill-${t}${this.bedienbar?"":" kiosk"}`}renderSlot(e){return H`<div class="${this._frameClasses}">${e}</div>`}renderGeraeteBild({kind:e,variante:t,alt:i,rotate:n=0,mirror:r=!1,groesse:s=100,inhalt:a=G}){const o=Fe(e);return H`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*o)/1e4};">
        <div class="bild" style="${et(n,r,o,s)}">
          <img src="${Ie(e,t)}" alt="${i}" />
          ${a}
        </div>
      </div>
    `}renderFan({active:e,top:t,left:i,size:n,ratio:r,dur:s,inactive:a,round:o=!1,design:l,farbe:c}){const d=e?"spinning":"hidden"===a?"hidden":"idle",p=o?1:Number(r)||1,h=l?ot(l):tt;return H`
      <div
        class="fan-overlay ${d} ${o?"round":""} design-${l&&st[l]?l:at}"
        style="top:${t}%; left:${i}%; width:${n}%; --fan-dur:${s}s; --fan-ratio:${p};${c?` --tt-fan-color:${c};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${o?"xMidYMid meet":"none"}">
          <g .innerHTML="${h}"></g>
        </svg>
      </div>
    `}get _powerUnbekannt(){const e=this.powerEntityId;if(!e)return!1;const t=String(this._ent(e)?.state??"").toLowerCase();return["","unknown","unavailable"].includes(t)}renderPowerButton({on:e,top:t,left:i,scale:n,standby:r=!1,hinweis:s=null}){const a=s||{oben:"Strom an",unten:"WP aus",titel:"Steckdose an, Wärmepumpe aus (Standby) — Steckdose ausschalten (mit Rückfrage)"},o=!e&&this._powerUnbekannt;return H`
      <div
        class="power-badge ${e?"on":o?"unbekannt":"off"} ${r?"standby":""}"
        style="top:${t}%; left:${i}%; transform:scale(${(n??100)/100});"
        title="${r?a.titel:o?"Zustand unbekannt — Einschalten":e?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
        ${r?H`<span class="power-hinweis ${a.lage||""}"><b>${a.oben}</b><span>${a.unten}</span></span>`:G}
      </div>
    `}renderValueBox({value:e,unit:t,top:i,bottom:n,left:r,scale:s,box:a,entity:o}){return H`
      <div
        class="value-box ${!1===a?"no-bg":""}"
        style="${void 0===n?`top:${i}%;`:`bottom:${n}%;`} left:${r}%; transform:translateX(-50%) scale(${(s??100)/100});"
        data-entity="${o||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${e}</span>
        ${t?H`<span class="unit">${t}</span>`:G}
      </div>
    `}renderThermo({value:e,top:t,left:i,scale:n,entity:r}){return H`
      <div
        class="thermo"
        style="top:${t}%; left:${i}%; --thermo-size:${(n??100)/100*3.6}em;"
        data-entity="${r||""}"
        @click="${this._moreInfo}"
      >
        ${lt}
        ${e?H`<span class="thermo-val">${e}</span>`:G}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}get confirmDefault(){return!0}get fragtNach(){const e=this.config?.confirm_off;return null==e||""===e?this.confirmDefault:!1!==e}_onPowerClick(e){if(e?.stopPropagation(),!this.bedienbar)return;const t=this.powerEntityId;t&&(this._isOn(t)?this.fragtNach?this._fragen(null):this._call(t,"turn_off"):this._call(t,"turn_on"))}_fragen(e){this._alsOffenMelden(),this._frage=e,this._confirmOpen=!0}_confirmOff(e){e?.stopPropagation();const t=this._frage;this._dialogeSchliessen(),t?.aktion?t.aktion():this._call(this.powerEntityId,"turn_off")}_cancelOff(e){e?.stopPropagation(),this._dialogeSchliessen()}renderConfirm(e="Wirklich stromlos schalten?"){if(!this._confirmOpen||!this.bedienbar)return G;const t=this._frage||{};return H`
      <div class="confirm-overlay" @click="${this._cancelOff}">
        <div class="confirm-panel" role="alertdialog" @click="${e=>e.stopPropagation()}">
          <h3><ha-icon icon="mdi:alert"></ha-icon> ${t.titel||e}</h3>
          <p>${t.text||this.powerConfirmText}</p>
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._cancelOff}">Abbrechen</button>
            <button class="btn danger" @click="${this._confirmOff}">${t.knopf||"Trotzdem ausschalten"}</button>
          </div>
        </div>
      </div>
    `}wattText(e,t=0){const i=this._watt(e);return null===i?"—":he(i,t)}}const ht=a`
  .slot {
    --tt-bg: transparent;
    --tt-fg: var(--primary-text-color, #111);
    --tt-line: rgba(127, 127, 127, 0.55);
    --tt-soft: rgba(127, 127, 127, 0.16);
    --tt-box-bg: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.92)));
    --tt-box-fg: var(--primary-text-color, #111);
    --tt-deck: transparent;
    /* STOP-Rot (Iteration 22): dunkles Rot auf heller, helles auf dunkler Schrift-
       umgebung — sonst verschwindet STOP auf dunkler Füllung */
    --tt-stop: #c62828;
  }
  @supports (color: rgb(from red r g b)) {
    .slot {
      --tt-stop: rgb(from var(--tt-fg) calc(198 + r * 0.224) calc(40 + g * 0.263) calc(40 + b * 0.263));
    }
  }
  /*
   * Dunkles Theme, fill transparent (Iteration 16, Kiosk-Flur): viele Themes
   * haben einen halbtransparenten Kartenhintergrund (Glas-Look). Als
   * Kästchen-Hintergrund scheint dann das Gerätebild durch, die helle Zahl
   * säuft ab, der Powerbutton verschwindet. --tt-deck legt eine deckende
   * Fläche darunter — abgeleitet aus der Schriftfarbe: Kehrwert der Farbe
   * (helle Schrift -> dunkle Fläche), Deckkraft 1 bei heller, 0 bei dunkler
   * Schrift. Helles Theme bleibt dadurch pixelgleich (Render-Test).
   * Ohne relative Farbsyntax (alte Browser) bleibt alles wie bisher.
   */
  @supports (color: rgb(from red r g b)) {
    .slot.fill-transparent {
      --tt-deck: rgb(
        from var(--tt-box-fg) calc(255 - r * 0.88) calc(255 - g * 0.88) calc(255 - b * 0.88) /
          clamp(0, calc((r + g + b) / 765 * 4 - 2), 1)
      );
    }
  }
  .slot.fill-weiss {
    --tt-bg: #ffffff;
    --tt-fg: #111111;
    --tt-line: rgba(0, 0, 0, 0.55);
    --tt-soft: rgba(0, 0, 0, 0.08);
    --tt-box-bg: rgba(255, 255, 255, 0.92);
    --tt-box-fg: #111111;
    --tt-stop: #c62828;
  }
  .slot.fill-schwarz {
    --tt-bg: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.45);
    --tt-soft: rgba(255, 255, 255, 0.12);
    --tt-box-bg: rgba(30, 30, 30, 0.9);
    --tt-box-fg: #ffffff;
    --tt-stop: #ff6b6b;
  }
`,ut=a`
  /*
   * Eigener Stacking-Context je Card/Slot.
   *
   * Ohne ihn steigen die z-index-Werte der Overlays (Kaestchen, Thermometer,
   * Powerbutton, Sprites, Pfeile) in den Stapel der Home-Assistant-Oberflaeche
   * auf und legen sich beim Scrollen ueber die Kopfleiste. isolation:isolate
   * sperrt sie ein: innen zaehlt die Reihenfolge 1-5, nach aussen ist die
   * ganze Card ein einziges Element auf z-index 0 — unter der Kopfleiste.
   */
  /*
   * container-type (Iteration 22, Bug A1): der Kasten selbst ist der
   * Bezugsrahmen der Overlay-Schrift (.img-wrap, 3.2cqw). Vorher war es die
   * ganze Card — im 2-/3-Spalten-Raster behielten die Kästchen ihre Größe,
   * der Kasten wurde schmaler, und Watt/Ist/Soll/Freigabe lagen aufeinander.
   * In einer Spalte ist Kasten = Card: dort bleibt alles pixelgleich.
   */
  :host {
    display: block;
    height: 100%;
    position: relative;
    isolation: isolate;
    z-index: 0;
    container-type: inline-size;
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
  }
  ${ht}
  .slot.framed {
    border-color: var(--tt-line);
  }
  /*
   * Kiosk-Modus (Iteration 15): gleicher Look, aber tot für Zeiger — kein
   * Hand-Cursor, kein Hover-/Klick-Feedback. Die eigentliche Sperre sitzt
   * im JS (SlotBase.bedienbar); das hier ist nur die Optik dazu.
   */
  .slot.kiosk,
  .slot.kiosk * {
    cursor: default !important;
  }
  .slot.kiosk * {
    pointer-events: none !important;
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
`,ft=a`
  .img-wrap {
    position: relative;
    width: 100%;
    line-height: 0;
    /* Alle Overlays skalieren mit der Breite des Kastens (cqw bezieht sich
       auf den nächsten Container darüber = :host, s. frameStyles) — dadurch
       sieht der Slot in einer schmalen Spalte genauso aus wie in voller
       Dashboard-Breite, auch im 2-/3-Spalten-Raster. */
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
    z-index: 2;
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
    /* deckend wie die Werte-Kästchen (Iteration 22, Kontrast): vorher
       --tt-soft, auf dem Motor der Pumpe und im Glas-Look kaum zu sehen */
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    border: 1.5px solid var(--tt-line);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    transform-origin: top left;
    z-index: 5;
  }
  .power-badge.on {
    color: #4caf50;
    box-shadow: 0 0 10px rgba(76, 175, 80, 0.55);
  }
  .power-badge.off {
    color: #e53935;
  }
  .power-badge:hover {
    filter: brightness(1.2);
  }
  /* Zustand unbekannt (Iteration 18b): grau, nicht rot */
  .power-badge.unbekannt {
    color: #9e9e9e;
    opacity: 0.85;
  }
  /* Steckdose an, Gerät aus (Iteration 18) */
  .power-badge.standby {
    color: #ffb300;
    box-shadow: 0 0 8px rgba(255, 179, 0, 0.45);
  }
  .power-hinweis {
    position: absolute;
    left: calc(100% + 0.35em);
    /* unter der Knopfmitte: so bleibt er unter dem Freitext-Label oben
       mittig, auch wenn das in schmalen Spalten wächst */
    top: 58%;
    display: flex;
    flex-direction: column;
    padding: 0.2em 0.45em;
    border-radius: 0.45em;
    border: 1px solid var(--tt-line);
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    font-size: 0.62em;
    line-height: 1.2;
    white-space: nowrap;
    pointer-events: none;
  }
  .power-hinweis.mitte {
    top: 50%;
    transform: translateY(-50%);
  }
  .power-hinweis b {
    color: inherit;
  }

  /* Wertefelder auf dem Bild */
  .value-box {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1px solid var(--tt-line);
    border-radius: 0.7em;
    padding: 0.4em 1em;
    min-width: 5.2em;
    line-height: 1.2;
    backdrop-filter: blur(4px);
    cursor: default;
    z-index: 3;
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
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border-radius: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.3;
    pointer-events: none;
    white-space: nowrap;
    /* lange Texte (Iteration 22, Bug A4): nie breiter als der Kasten —
       max-width kommt als Inline-Stil (hängt an Lage und Größe) */
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
    z-index: 4;
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
    z-index: 4;
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
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
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
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
    color: var(--tt-box-fg);
    border: 1.5px solid var(--tt-line);
    line-height: 1.15;
    z-index: 4;
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
    z-index: 10;
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
`,mt={top:2,left:-2.5},gt=2,bt=40,_t=e=>null!=e&&""!==e&&isFinite(Number(e))?Number(e):null,vt=(e,t,i)=>Math.min(i,Math.max(t,e)),kt=(e={},t,i="voll")=>{const n=e||{},r=t.anker,s=Ee(n.shape),a=e=>_t(n[`${r}_${e}`])??s[r]?.[e]??50,o=e=>"mini"===i?_t(n[`mini_${r}_${e}`])??a(e):a(e),l="mini"===i?_t(n[`mini_${r}_size`])??_t(n[`${r}_size`]):_t(n[`${r}_size`]),c=vt(null!==l&&l>0?l:t.groesse,2,40),d=c*Me(n.shape)/(t.ratio||1),p=e=>Math.round(100*e)/100;return{left:p(vt(o("left"),c/2,100-c/2)),top:p(vt(o("top"),Math.min(50,d/2),Math.max(50,100-d/2))),breite:p(c)}},wt={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:Pe.skimmer.groesse,inlet_size:Pe.einlauf.groesse,drain_size:Pe.drain.groesse},yt=e=>{const t=Ee(e),i={};for(const e of Object.values(Pe)){const n=t[e.anker];n&&(i[`${e.anker}_top`]=n.top,i[`${e.anker}_left`]=n.left)}return{...wt,thermo_top:t.thermo.top,thermo_left:t.thermo.left,ph_top:t.ph.top,ph_left:t.ph.left,rx_top:t.rx.top,rx_left:t.rx.left,...i,inlet_temp_top:(t.inlet?.top??12)+17,inlet_temp_left:(t.inlet?.left??66)+mt.left,label_top:t.label_anker?.top??wt.label_top,label_left:t.label_anker?.left??wt.label_left}};class $t extends pt{get defaults(){return yt(this.config?.shape)}_einlaufLage(){const e=this.config||{},t=t=>void 0===e[t]||null===e[t]||""===e[t]?null:Number(e[t]),i=kt(e,Pe.einlauf,"voll"),n=i.breite*Me(e.shape)/(Pe.einlauf.ratio||1)/2,r=t("inlet_temp_top"),s=t("inlet_temp_left");return{unter:null===r,top:r??Math.round(100*(i.top+n+mt.top))/100,left:s??Math.round(100*(i.left+mt.left))/100}}_spriteAn(e){const t=Object.values(Pe).find(t=>t.anker===e),i=this.config?.[`show_${e}`];return null==i?!!t?.standard:!1!==i}get shape(){return Ee(this.config?.shape)}_anchor(e,t){const i=`${e}_${t}`,n=this.config?.[i];return null!=n&&""!==n?Number(n):this.shape[e]?.[t]??50}render(){const e=this.config||{},t=this.shape,i=!0===e.framed,n=!1!==e.show_thermo&&!!e.temp_entity,r=!1!==e.show_ph&&!!e.ph_entity,s=!1!==e.show_rx&&!!e.rx_entity,a=!!e.inlet_temp_entity&&this._spriteAn("inlet"),o=H`
      <div class="img-wrap">
        <img src="${Re(t.file)}" alt="Pool ${t.label}" />
        ${this._sprites()}

        ${n?this.renderThermo({value:$e(this._ent(e.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:e.temp_entity}):G}
        ${r?this._chemBox("pH",e.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):G}
        ${s?this._chemBox("RX",e.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):G}
        ${a?this._einlaufBox():G}
        ${ct(e)?H`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100}); max-width:${this._labelMax()}%;"
              title="${ct(e)}"
            >
              ${ct(e)}
            </div>`:G}
      </div>
    `;return i?this.renderSlot(o):H`<div class="${this._frameClasses} bare">${o}</div>`}_labelMax(){const e=(Number(this._v("label_scale"))||100)/100,t=Math.min(100,Math.max(0,Number(this._v("label_left"))||0));return Math.max(10,Math.round((2*Math.min(t,100-t)-2)/e*10)/10)}_sprites(){return Object.values(Pe).map(e=>{if(!this._spriteAn(e.anker))return G;const t=kt(this.config,e,"voll");return H`<img
        class="hero-sprite sprite-${e.anker}"
        src="${Re(e.file)}"
        alt=""
        style="top:${t.top}%; left:${t.left}%; width:${t.breite}%;"
      />`})}_einlaufBox(){const e=this._einlaufLage();return this._chemBox("Zulauf",this.config.inlet_temp_entity,e.top,e.left,"inlet-temp"+(e.unter?" unter-duese":""))}_chemBox(e,t,i,n,r=""){const s=this._ent(t);return H`
      <div
        class="chem-box ${r}"
        style="top:${i}%; left:${n}%;"
        data-entity="${t}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${e}</span>
        <span class="chem-val">${$e(s)}</span>
      </div>
    `}static styles=[ut,ft,a`
      .slot.bare {
        border: none;
        padding: 0;
      }
      /* Oberkante an der Düse statt Mitte (Iteration 22, Bug A9) */
      .chem-box.inlet-temp.unter-duese {
        transform: translate(-50%, 0);
      }
    `]}customElements.define("tomtut-pool-hero",$t);const xt="becken",zt=e=>String(e??"").trim().toLowerCase(),St=e=>/^\d+$/.test(zt(e)),At=(e=[])=>{const t=new Set(e.map(zt));for(;;){const e="k"+Math.random().toString(36).slice(2,7);if(!t.has(e))return e}},Bt=(e,t)=>e?.id?String(e.id):t,Et=(e={})=>[...!1===e.hero?.enabled?[]:[xt],...(Array.isArray(e.slots)?e.slots:[]).map((e,t)=>(e=>"hidden"===String(e?.type||"frame").toLowerCase())(e)?null:Bt(e,t+1)).filter(e=>null!==e)],Tt=(e={},t,i=null)=>{if(!0!==e?.kiosk)return!1;if(!Array.isArray(e.kiosk_slots))return!0;const n=i?.id?zt(i.id):null;return e.kiosk_slots.some(e=>zt(e)===zt(t)||null!==n&&zt(e)===n)},Mt=(e={})=>{const t=e?.kiosk_slots;if(!Array.isArray(t)||!t.some(St))return e;const i=Array.isArray(e.slots)?e.slots.map(e=>({...e||{}})):[],n=i.map(e=>e.id).filter(Boolean),r=[];for(const e of t){if(!St(e)){r.push(e);continue}const t=i[Number(zt(e))-1];t&&(t.id||(t.id=At(n),n.push(t.id)),r.some(e=>zt(e)===zt(t.id))||r.push(t.id))}return{...e,slots:i,kiosk_slots:r}},Ct={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30,stage_from_power:!0,stage_watt_1:20,stage_watt_2:150,stage_watt_3:500},Pt=(e,t=[20,150,500],i=3)=>{const n=Number(e);if(null==e||!isFinite(n)||i<1)return null;let r=null;return t.slice(0,3).forEach((e,t)=>{const i=Number(e);isFinite(i)&&n>i&&(r=t)}),null===r?null:Math.min(r,i-1)},Ot=10,Wt=e=>{const t=Math.min(Ot,Math.max(1,Number(e)||1)),i=4*Math.pow(.125,(t-1)/9);return Math.round(100*i)/100},Kt=(e={})=>{const t=e?.stage_entities;return(Array.isArray(t)?t:"string"==typeof t&&t.trim()?[t.trim()]:[]).filter(Boolean).slice(0,3)},Lt=["switch","input_boolean","light","button","input_button","script"],Nt=(e={})=>!(!Kt(e).length&&!e.main_entity);class Rt extends pt{static properties={...pt.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return Ct}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,clearTimeout(this._optiTimer),super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){return Kt(this.config)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const e=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((t,i)=>e[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}get _wattStufeAktiv(){return!1!==this._v("stage_from_power")&&!!this.config?.power_entity}_wattStufe(){if(!this._wattStufeAktiv)return;const e=this._watt(this.config.power_entity);if(null===e)return;const t=[1,2,3].map(e=>this._v(`stage_watt_${e}`));return Pt(e,t,Math.max(1,this.stages.length))}_derive(){const e=this._deriveSchalter(),t=this._wattStufe();if(void 0===t)return e;if(null===t)return{active:null,stopped:!0,since:e.stopped?e.since:null};return{active:t,stopped:!1,since:e.active!==t||e.stopped?null:e.since,ausLeistung:!0}}_deriveSchalter(){if("latching"===this.mode){let e=null;if(this.stages.forEach((t,i)=>{const n=this._ent(t);if(!n||!de(n.state))return;const r=Date.parse(n.last_changed||0)||0;(!e||r>e.t)&&(e={i:i,t:r,since:n.last_changed})}),!e){let e=null;for(const t of this.stages){const i=this._ent(t);if(!i||be(i.state))continue;const n=Date.parse(i.last_changed||0)||0;(!e||n>e.t)&&(e={t:n,since:i.last_changed})}return{active:null,stopped:!0,since:e?.since||null}}return{active:e.i,stopped:!1,since:e.since}}const e=this.stages.map((e,t)=>({id:e,i:t}));this.stopEntity&&e.push({id:this.stopEntity,i:-1});let t=null;for(const i of e){const e=this._ent(i.id);if(!e||!e.last_changed)continue;if(be(e.state)||!Lt.includes(we(i.id)))continue;const n=Date.parse(e.last_changed);isNaN(n)||(!t||n>t.t)&&(t={...i,t:n,since:e.last_changed})}return t?-1===t.i?{active:null,stopped:!0,since:t.since}:{active:t.i,stopped:!1,since:t.since}:{active:null,stopped:!1,since:null}}_optimistischSetzen(e){this._optimistic={i:e,t:Date.now()},clearTimeout(this._optiTimer),this._optiTimer=setTimeout(()=>this.requestUpdate(),6050),"function"==typeof this._optiTimer?.unref&&this._optiTimer.unref(),this.requestUpdate()}get state(){const e=this._derive(),t=this._optimistic;if(t&&Date.now()-t.t<6e3){if(-1===t.i&&!e.stopped)return{active:null,stopped:!0,since:null};if(t.i>=0&&e.active!==t.i)return{active:t.i,stopped:!1,since:null}}return e}get running(){const e=this.state;if(this.blockedByMain)return!1;if(e.stopped||null===e.active)return!1;if(e.ausLeistung)return!0;const t=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(t)&&i<t)}_clickStage(e){if(!this.bedienbar||this.blockedByMain)return;const t=this.stages[e];t&&(this._optimistischSetzen(e),"latching"===this.mode?(this.stages.forEach((t,i)=>{i!==e&&this._call(t,"turn_off")}),this._call(t,"turn_on")):this._call(t,"turn_on"))}_clickStop(){this.bedienbar&&!this.blockedByMain&&(this._optimistischSetzen(-1),"latching"===this.mode?this.stages.forEach(e=>this._call(e,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const e=this.config||{},t=Nt(e),i=this.state,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1",r=!1!==e.show_power&&!!e.power_entity,s=!1!==e.show_temp&&!!e.temp_entity,a=!1!==e.show_power_button&&!!e.main_entity,o=!1!==e.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(H`
      ${ct(e)?H`<h3 class="slot-title">${ct(e)}</h3>`:G}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===e.show_fan?G:this.renderFan({active:t&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:Wt(this._v(n)),inactive:this._v("fan_inactive"),round:!0})}
          ${a?this.renderPowerButton({on:this._isOn(e.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):G}
          ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):G}
          ${s?this.renderThermo({value:$e(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):G}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${o?H`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((e,t)=>H`
                    <button
                      class="stage-btn ${i.active!==t||i.stopped?"":"active"}"
                      @click="${()=>this._clickStage(t)}"
                      title="${this.stageLabels[t]}"
                    >
                      <span class="stage-name">${this.stageLabels[t]}</span>
                      ${i.active===t&&!i.stopped&&i.since?H`<span class="stage-since">${fe(i.since)}</span>`:G}
                    </button>
                  `)}
                ${this._showStop?H`
                      <button
                        class="stage-btn stop ${i.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${i.stopped&&i.since?H`<span class="stage-since">${fe(i.since)}</span>`:G}
                      </button>
                    `:G}
              </div>
            `:G}
      </div>
      ${t?G:H`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[ut,ft,a`
      /* Laufrad dunkel (Iteration 22, Befund D): das Pumpenbild ist in jeder
         Füllung hell gezeichnet — ein weißes Rad (Schrift auf Schwarz)
         verschwand darauf */
      .fan-overlay.round {
        color: var(--tt-fan-color, #1f2d38);
      }
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
      /* Hauptschalter aus: gesperrt, aber lesbar (Iteration 22, Befund D —
         im Glas-Look waren die Taster vorher dunkelblau auf blau) */
      .stages.disabled .stage-btn {
        opacity: 0.6;
        border-style: dashed;
        filter: grayscale(1);
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
        background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-soft);
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
        color: var(--tt-stop, #c62828);
        border-color: var(--tt-stop, #c62828);
        font-weight: 800;
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
    `]}customElements.define("tomtut-pool-slot-pump",Rt);const It={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,fan_design:"klassisch",fan_color_mode:"neutral",mode_speed_heiz_silent:3,mode_speed_heiz_smart:5,mode_speed_heiz_auto:6,mode_speed_heiz_boost:9,mode_speed_kuehl_silent:3,mode_speed_kuehl_smart:5,mode_speed_kuehl_auto:6,mode_speed_kuehl_boost:9,power_btn_top:5,power_btn_left:3,power_btn_scale:139,release_top:84,release_left:24,release_scale:100,show_release_since:!1,mode_top:86,mode_left:64,mode_scale:100,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},Ft=[{key:"heiz_silent",label:"Heizen Silent",art:"heizen",zustaende:["Heizen Silent","heat_silent","heating_silent","silent_heat"]},{key:"heiz_smart",label:"Heizen Smart",art:"heizen",zustaende:["Heizen Smart","heat_smart","heating_smart","smart_heat"]},{key:"heiz_auto",label:"Heizen Auto",art:"heizen",zustaende:["Heizen Auto","heat_auto","heating_auto","auto_heat"]},{key:"heiz_boost",label:"Heizen Boost",art:"heizen",zustaende:["Heizen Boost","heat_boost","heating_boost","boost_heat","heat_turbo","heat_powerful"]},{key:"kuehl_silent",label:"Kühlen Silent",art:"kuehlen",zustaende:["Kühlen Silent","cool_silent","cooling_silent","silent_cool"]},{key:"kuehl_smart",label:"Kühlen Smart",art:"kuehlen",zustaende:["Kühlen Smart","cool_smart","cooling_smart","smart_cool"]},{key:"kuehl_auto",label:"Kühlen Auto",art:"kuehlen",zustaende:["Kühlen Auto","cool_auto","cooling_auto","auto_cool"]},{key:"kuehl_boost",label:"Kühlen Boost",art:"kuehlen",zustaende:["Kühlen Boost","cool_boost","cooling_boost","boost_cool","cool_turbo","cool_powerful"]}],Dt={heizen:"#e0452c",kuehlen:"#2f7fd0"},Ht=e=>String(e??"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[\s_-]+/g," ").trim(),jt=[["heizen",/heiz|heat/],["kuehlen",/kuehl|cool/]],Gt=[["silent",/silent|leise|quiet|mute/],["smart",/smart|eco/],["boost",/boost|power|turbo|max|strong/],["auto",/auto/]],Ut=e=>{const t=Ht(e);if(!t)return null;const i=jt.filter(([,e])=>e.test(t)).map(([e])=>e);if(1!==i.length)return null;const n=Gt.find(([,e])=>e.test(t));if(!n)return null;const r=`${"heizen"===i[0]?"heiz":"kuehl"}_${n[0]}`;return Ft.find(e=>e.key===r)||null},Zt=e=>!!e&&"object"==typeof e&&!Array.isArray(e),Vt=(e,t={})=>{if(!Zt(t?.mode_map))return;const i=Ht(e);for(const[e,n]of Object.entries(t.mode_map))if(Ht(e)===i)return n&&Ft.find(e=>e.key===n)||null},qt=(e,t={})=>{if(!Zt(t?.mode_names))return"";const i=Ht(e),n=Object.entries(t.mode_names).find(([e,t])=>Ht(e)===i&&String(t||"").trim());return n?String(n[1]).trim():""},Qt=(e,t={})=>{const i=Ht(e);if(!i)return null;const n=Vt(e,t);if(void 0!==n)return n;const r=Ft.find(e=>((e={},t)=>{const i=e[`mode_map_${t.key}`];return"string"==typeof i&&i.trim()?i.split(",").map(e=>e.trim()).filter(Boolean):Array.isArray(i)&&i.length?i.map(String):t.zustaende})(t,e).some(e=>Ht(e)===i));if(r)return r;const s=Ut(e);return s&&!((e,t)=>{const i=e?.[`mode_map_${t.key}`];return"string"==typeof i&&!!i.trim()||Array.isArray(i)&&i.length>0})(t,s)?s:null},Xt={off:"Aus",aus:"Aus",heat:"Heizen",heating:"Heizen",heizen:"Heizen",cool:"Kühlen",cooling:"Kühlen",kuehlen:"Kühlen","kühlen":"Kühlen",auto:"Auto","heat cool":"Heizen/Kühlen",dry:"Entfeuchten","fan only":"Nur Lüfter",idle:"Bereit",standby:"Standby",silent:"Silent",smart:"Smart",boost:"Boost",turbo:"Turbo",powerful:"Power",eco:"Eco",comfort:"Komfort",away:"Abwesend",sleep:"Nacht",home:"Zuhause",activity:"Aktiv"},Jt={off:"aus",aus:"aus",heat:"heizen",heating:"heizen",heizen:"heizen",cool:"kuehlen",cooling:"kuehlen",kuehlen:"kuehlen","kühlen":"kuehlen"},Yt=e=>["","unknown","unavailable","none"].includes(Ht(e)),ei=e=>Object.prototype.hasOwnProperty.call(Xt,Ht(e)),ti=e=>{const t=Ht(e);return Object.prototype.hasOwnProperty.call(Xt,t)?Xt[t]:String(e??"").trim()},ii=["sensor","select","input_select","climate"],ni=(e,t={})=>{if(!e)return null;if(!ii.includes(we(t.mode_entity)))return{text:"—",art:null};const i=String(t.mode_attribute||"").trim(),n=i?e.attributes?.[i]:e.state,r=Qt(n,t);if(r)return{text:r.label,art:r.art};let s=n,a=null;if(!String(t.mode_entity||"").startsWith("climate.")||i&&"preset_mode"!==i||(s=e.state,a=i?n:e.attributes?.preset_mode),Yt(s)&&Yt(a))return{text:"—",art:null};const o=Jt[Ht(s)]||null;if("aus"===o)return{text:"Aus",art:o};if(!Yt(s)&&!Yt(a)){const e=Qt(`${s} ${a}`,t);if(e)return{text:e.label,art:e.art}}const l=[s,a].filter(e=>!Yt(e)).map(e=>qt(e,t)||ti(e));return{text:l.join(" · "),art:o}},ri=e=>"none"===Ht(e),si=(e,t)=>ri(e)?"Kein Preset":Qt(e,t)?.label||qt(e,t)||ti(e),ai=(e,t={})=>{const i=t.mode_entity;if(!e||!i)return[];const n=we(i),r=e.attributes||{},s=String(t.mode_attribute||"").trim(),a=(e,i,n,r,s,a)=>Array.isArray(s)&&s.length?[{titel:e,domain:i,service:n,feld:r,optionen:s.map(e=>({wert:String(e),text:si(e,t),aktiv:!ri(e)&&Ht(e)===Ht(a)}))}]:[];if(("select"===n||"input_select"===n)&&!s)return a("Betriebsmodus",n,"select_option","option",r.options,e.state);if("climate"===n){if("preset_mode"===s)return a("Betriebsmodus","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode);if(!s)return[...a("Betriebsart","climate","set_hvac_mode","hvac_mode",r.hvac_modes,e.state),...a("Stufe / Preset","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode)]}return[]},oi=(e={},t)=>[e.mode_entity,e.target_entity,e.current_entity].find(e=>String(e||"").startsWith("climate.")&&!!t?.states?.[e])||null,li=(e={},t)=>{const i=oi(e,t);return!!i&&"off"===String(t.states[i].state).toLowerCase()},ci=(e={})=>!!(e.switch_entity||e.power_entity||e.target_entity||e.current_entity||e.release_entity),di=["switch","input_boolean","binary_sensor","light"];class pi extends pt{static properties={...pt.properties,_tick:{state:!0},_modusWahlOffen:{state:!0},_modusFehler:{state:!0}};get defaults(){return It}get _seitAn(){const e=this.config||{};return!0===e.show_release_since&&!1!==e.show_release&&!!e.release_entity}_seitTimerPruefen(){const e=this.isConnected&&this._seitAn;e&&!this._seitTimer?(this._seitTimer=setInterval(()=>{this._tick=Date.now()},6e4),"function"==typeof this._seitTimer?.unref&&this._seitTimer.unref()):!e&&this._seitTimer&&(clearInterval(this._seitTimer),this._seitTimer=void 0)}connectedCallback(){super.connectedCallback(),this._seitTimerPruefen()}disconnectedCallback(){clearInterval(this._seitTimer),this._seitTimer=void 0,super.disconnectedCallback()}updated(e){super.updated?.(e),this._seitTimerPruefen()}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _freigabe(){const e=this.config||{};if(!1===e.show_release||!e.release_entity)return null;if(!di.includes(we(e.release_entity)))return null;const t=this._ent(e.release_entity);if(!t)return null;const i=String(t.state).toLowerCase();return"unknown"===i||"unavailable"===i||""===i?null:de(i)}get _releaseSchaltbar(){const e=this.config?.release_entity;return!!e&&["switch","input_boolean","light"].includes(we(e))}_onReleaseClick(e){if(e?.stopPropagation(),!this.bedienbar||!this._releaseSchaltbar)return;const t=this.config.release_entity,i=()=>this._call(t,"toggle");if(!this.fragtNach)return void i();const n=!1!==this._freigabe;this._fragen(n?{titel:"Wärmepumpe sperren?",text:"Der Freigabekontakt wird geöffnet: die Wärmepumpe darf dann nicht mehr laufen und\n              schaltet ab, egal was an ihrem Bedienteil eingestellt ist.",knopf:"Sperren",aktion:i}:{titel:"Wärmepumpe freigeben?",text:"Der Freigabekontakt wird geschlossen: die Wärmepumpe darf wieder laufen und startet\n              nach ihrer eigenen Logik (Kompressor-Anlauf).",knopf:"Freigeben",aktion:i})}_renderRelease(){const e=this._freigabe,t=!1===e,i=null===e?"unbekannt":t?"gesperrt":"frei",n=this._releaseSchaltbar,r=null===e?"Freigabekontakt — Zustand unbekannt":n?t?"Freigabe geben (Kontakt schließen, mit Rückfrage)":"Freigabe entziehen (Kontakt öffnen, mit Rückfrage)":t?"Freigabekontakt offen — die Wärmepumpe ist gesperrt (nur Anzeige)":"Freigabekontakt geschlossen — die Wärmepumpe ist freigegeben (nur Anzeige)";return H`
      <div
        class="release-badge ${i} ${n?"schaltbar":"nur-anzeige"}"
        style="top:${this._v("release_top")}%; left:${this._v("release_left")}%; transform:translateX(-50%) scale(${(this._v("release_scale")??100)/100});"
        title="${r}"
        @click="${this._onReleaseClick}"
      >
        <svg viewBox="0 0 34 20" aria-hidden="true">
          <line x1="1.5" y1="15" x2="8" y2="15" />
          <line x1="26" y1="15" x2="32.5" y2="15" />
          <line x1="8" y1="15" x2="${t?24:26}" y2="${t?3.5:15}" />
          <circle cx="8" cy="15" r="2.4" />
          <circle cx="26" cy="15" r="2.4" />
        </svg>
        <span class="release-text">
          <span class="val">${null===e?"—":t?"Gesperrt":"Frei"}</span>
          <span class="unit">Freigabe</span>
        </span>
        ${this._seitAn&&null!==e?H`<span class="release-seit"
              >${me(this._ent(this.config.release_entity)?.last_changed)}</span
            >`:G}
      </div>
    `}get _target(){const e=this.config.target_entity,t=this._ent(e);if(!t)return null;const i=we(e),n="climate"===i,r=pe(n?t.attributes?.temperature:t.state);if(null===r)return null;const s=t.attributes||{};return{climate:n,domain:i,schreibbar:["climate","number","input_number"].includes(i),value:r,min:n?s.min_temp??5:s.min??5,max:n?s.max_temp??40:s.max??40,step:this.config.target_step??(n?s.target_temp_step??.5:s.step??.5),unit:n?this.hass?.config?.unit_system?.temperature??"°C":s.unit_of_measurement??"°C"}}get _current(){const e=this.config.current_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),n=pe(i?t.attributes?.current_temperature:t.state);return null===n?null:{value:n,unit:i?this.hass?.config?.unit_system?.temperature??"°C":t.attributes?.unit_of_measurement??"°C"}}get _modus(){const e=this.config||{};if(!1===e.show_mode||!e.mode_entity)return null;const t=this._ent(e.mode_entity);if(!t)return null;const i=String(e.mode_attribute||"").trim(),n=i?t.attributes?.[i]:t.state;return Qt(n,e)}get _klimaAus(){return li(this.config||{},this.hass)}get _standby(){const e=this.config?.switch_entity;return this._klimaAus&&!!e&&this._isOn(e)}get _modusBadge(){const e=this.config||{};return!1!==e.show_mode&&!1!==e.show_mode_badge&&e.mode_entity?this._klimaAus?{text:"Aus",art:"aus"}:ni(this._ent(e.mode_entity),e)||{text:"—",art:null}:null}get _modusGruppen(){const e=this.config||{};return ai(this._ent(e.mode_entity),e)}_onModeClick(e){e?.stopPropagation(),this.bedienbar&&this._modusGruppen.length&&(this._alsOffenMelden(),this._modusFehler="",this._modusWahlOffen=!0)}_modusSchliessen(e){e?.stopPropagation(),this._modusWahlOffen=!1,this._modusFehler=""}get _dialogOffen(){return!0===this._confirmOpen||!0===this._modusWahlOffen}_dialogeSchliessen(){super._dialogeSchliessen(),this._modusWahlOffen=!1,this._modusFehler=""}async _modusSetzen(e,t,i){if(i?.stopPropagation(),this.bedienbar&&this.hass){this._modusFehler="";try{await this.hass.callService(e.domain,e.service,{entity_id:this.config.mode_entity,[e.feld]:t.wert}),this._modusWahlOffen=!1}catch(e){const i=e?.message||e?.error?.message||String(e);console.error("tomtut-pool-cards: Modus setzen fehlgeschlagen",e),this._modusFehler=`Umschalten auf „${t.text}“ fehlgeschlagen: ${i}`}}}_renderModusWahl(){if(!this._modusWahlOffen||!this.bedienbar)return G;const e=this._modusGruppen;return H`
      <div class="confirm-overlay modus-overlay" @click="${this._modusSchliessen}">
        <div class="confirm-panel modus-panel" @click="${e=>e.stopPropagation()}">
          <h3 class="modus-kopf">Betriebsmodus wählen</h3>
          ${e.map(t=>H`
              ${e.length>1?H`<div class="modus-gruppe">${t.titel}</div>`:G}
              <div class="modus-optionen">
                ${t.optionen.map(e=>H`<button
                    class="modus-option ${e.aktiv?"aktiv":""}"
                    data-wert="${e.wert}"
                    aria-pressed="${e.aktiv?"true":"false"}"
                    @click="${i=>this._modusSetzen(t,e,i)}"
                  >
                    <span class="modus-haken">${e.aktiv?"✓":""}</span>${e.text}
                  </button>`)}
              </div>
            `)}
          ${this._modusFehler?H`<div class="modus-fehler" role="alert">${this._modusFehler}</div>`:G}
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._modusSchliessen}">Schließen</button>
          </div>
        </div>
      </div>
    `}_renderModeBadge(e){const t=Dt[e.art]||"",i=this.bedienbar&&this._modusGruppen.length>0;return H`
      <div
        class="mode-badge ${e.art||"neutral"} ${i?"waehlbar":""}"
        style="top:${this._v("mode_top")}%; left:${this._v("mode_left")}%; transform:translateX(-50%) scale(${(this._v("mode_scale")??100)/100});${t?` --tt-mode-farbe:${t};`:""}"
        title="Betriebsmodus: ${e.text}${i?" — tippen zum Ändern":""}"
        @click="${this._onModeClick}"
      >
        <span class="mode-punkt"></span>
        <span class="val">${e.text}</span>
      </div>
    `}get _fanDur(){const e=this._modus;if(e)return Wt(this._v(`mode_speed_${e.key}`));const t=Number(this._v("fan_speed"))||0;return t<=0?0:Math.max(.2,4-t/100*3.6)}get _fanFarbe(){if("modus"!==this._v("fan_color_mode"))return"";const e=this._modus;return e?Dt[e.art]:""}get _fanActive(){if(!1===this._freigabe)return!1;if(this._klimaAus)return!1;const e=this.config.switch_entity;if(e&&this._ent(e)&&!this._isOn(e))return!1;const t=this.config.fan_source??"auto",i=this._ent(this.config.fan_entity);if("power"!==t&&i){const e=String(i.state).toLowerCase();if(de(e))return!0;const t=pe(e);return null!==t&&t>0}if("entity"===t)return!1;const n=this._watt(this.config.power_entity);return null!==n&&n>=Number(this._v("fan_power_threshold"))}_stepTarget(e){const t=this._target;if(!(this.bedienbar&&t&&t.schreibbar&&this.hass))return;let i=Math.round((t.value+e*t.step)/t.step)*t.step;i=Math.min(t.max,Math.max(t.min,i)),i=Math.round(100*i)/100,i!==t.value&&(t.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("input_number"===t.domain?"input_number":"number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(e){e?.stopPropagation(),this._stepTarget(1)}_targetDown(e){e?.stopPropagation(),this._stepTarget(-1)}_vorKlemmen(e){const t=e.querySelector(".label-badge");if(!t)return;t.style.removeProperty("--label-frei");const i=e.querySelector(".power-badge");if(!i)return;const n=t.getBoundingClientRect(),r=i.getBoundingClientRect(),s=e.getBoundingClientRect();if(!(n.top<r.bottom&&r.top<n.bottom)||n.left>=r.right+2||n.right<=r.left-2)return;const a=(n.left+n.right)/2,o=Math.min(a-r.right,s.right-a)-4,l=(Number(this._v("label_scale"))||100)/100;t.style.setProperty("--label-frei",`${Math.max(16,Math.floor(2*o/l))}px`)}render(){const e=this.config||{},t=ci(e),i=!1!==e.show_fan,n=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_release&&!!e.release_entity,s=!1!==e.show_power&&!!e.power_entity,a=!1!==e.show_target&&!!e.target_entity,o=!1!==e.show_current&&!!e.current_entity,l=ct(e),c=this._modusBadge,d=this._fanDur,p=this._target,h=this._current,u=this.bedienbar&&!String(e.target_entity||"").startsWith("sensor."),f=(Number(this._v("label_scale"))||100)/100,m=Math.min(100,Math.max(0,Number(this._v("label_left"))||0)),g=Math.round((2*Math.min(m,100-m)-2)/f*10)/10;return this.renderSlot(H`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${i?this.renderFan({active:t&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:d,inactive:this._v("fan_inactive"),design:this._v("fan_design"),farbe:this._fanFarbe}):G}
        ${n?this.renderPowerButton({on:this._isOn(e.switch_entity),standby:this._standby,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):G}
        ${r?this._renderRelease():G}
        ${c?this._renderModeBadge(c):G}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):G}
        ${o?this.renderValueBox({value:null===h?"—":he(h.value,1)+" "+h.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:e.current_entity}):G}
        ${a?H`
              <div
                class="value-box target ${!1===this._v("target_box")?"no-bg":""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v("target_left")}%; transform:translateX(-50%) scale(${(this._v("target_scale")??100)/100});"
              >
                <div class="target-row">
                  ${u?H`<button
                        class="step"
                        ?disabled="${null===p}"
                        @click="${this._targetDown}"
                        title="Soll-Temperatur senken"
                      >
                        −
                      </button>`:G}
                  <div class="target-val">
                    <span class="val"
                      >${null===p?"—":he(p.value,1)+" "+p.unit}</span
                    >
                    ${!1===this._v("target_label")?G:H`<span class="unit">Soll</span>`}
                  </div>
                  ${u?H`<button
                        class="step"
                        ?disabled="${null===p}"
                        @click="${this._targetUp}"
                        title="Soll-Temperatur anheben"
                      >
                        +
                      </button>`:G}
                </div>
              </div>
            `:G}
        ${l?H`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100}); max-width:min(${Math.max(10,g)}%, var(--label-frei, 100%));"
                title="${l}"
              >
                ${l}
              </div>
            `:G}
        ${this.renderConfirm("Wirklich stromlos schalten?")} ${this._renderModusWahl()}
      </div>
      ${t?G:H`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[ut,ft,a`
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

      /*
       * Freigabekontakt (Iteration 12). Zwei Zustände, sofort erkennbar:
       * geschlossener Kontakt + grün = frei, abgehobener Hebel + rot =
       * gesperrt. Der Kasten sitzt in derselben z-index-Leiter wie die
       * übrigen Overlays (4, nie über 10 — s. shared/styles.js).
       */
      .release-badge {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 0.45em;
        padding: 0.3em 0.6em;
        border-radius: 0.7em;
        background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
        color: var(--tt-box-fg);
        border: 1.5px solid var(--tt-line);
        line-height: 1.15;
        white-space: nowrap;
        backdrop-filter: blur(4px);
        cursor: default;
        transition: border-color 0.3s, box-shadow 0.3s;
        z-index: 4;
      }
      .release-badge.schaltbar {
        cursor: pointer;
      }
      .release-badge.schaltbar:hover {
        filter: brightness(1.15);
      }
      .release-badge svg {
        width: 2.3em;
        height: auto;
        display: block;
        fill: none;
        stroke: currentColor;
        stroke-width: 2.2;
        stroke-linecap: round;
        color: #9e9e9e;
      }
      .release-badge svg circle {
        fill: currentColor;
        stroke: none;
      }
      .release-badge .release-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      }
      .release-badge .val {
        font-size: 1.05em;
      }
      .release-badge .unit {
        margin-top: 0;
      }
      .release-badge.frei {
        border-color: #4caf50;
      }
      .release-badge.frei svg,
      .release-badge.frei .val {
        color: #4caf50;
      }
      .release-badge.gesperrt {
        border-color: #ef5350;
        box-shadow: 0 0 9px rgba(244, 67, 54, 0.45);
      }
      .release-badge.gesperrt svg,
      .release-badge.gesperrt .val {
        color: #ef5350;
      }

      /* "seit …" klein unter dem Freigabe-Badge (Iteration 14) */
      .release-badge .release-seit {
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        margin-top: 0.15em;
        padding: 0.05em 0.45em;
        border-radius: 0.5em;
        background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
        color: var(--tt-box-fg);
        font-size: 0.72em;
        font-weight: 600;
        white-space: nowrap;
      }

      /*
       * Betriebsmodus-Badge (Iteration 14). Gleicher Kasten wie der
       * Freigabekontakt; Rand, Punkt und Wort nehmen die Modusfarbe des
       * Rads an (--tt-mode-farbe aus MODE_FARBEN). Ohne Farbe: Box-Look.
       */
      .mode-badge {
        position: absolute;
        display: flex;
        align-items: center;
        gap: 0.45em;
        padding: 0.35em 0.7em;
        border-radius: 0.7em;
        background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-box-bg);
        color: var(--tt-box-fg);
        border: 1.5px solid var(--tt-mode-farbe, var(--tt-line));
        line-height: 1.15;
        white-space: nowrap;
        backdrop-filter: blur(4px);
        pointer-events: none;
        z-index: 4;
      }
      .mode-badge .mode-punkt {
        width: 0.75em;
        height: 0.75em;
        border-radius: 50%;
        background: var(--tt-mode-farbe, var(--tt-line));
        flex: none;
      }
      .mode-badge .val {
        font-size: 1.05em;
        color: var(--tt-mode-farbe, inherit);
      }
      .mode-badge .unit {
        margin-top: 0;
      }
      .mode-badge.aus {
        opacity: 0.75;
      }
      /* Iteration 15: mit wählbarer Entity ist das Badge ein Knopf */
      .mode-badge.waehlbar {
        pointer-events: auto;
        cursor: pointer;
      }
      .mode-badge.waehlbar:hover {
        filter: brightness(1.12);
      }

      /* Modus-Auswahl — sitzt in der Dialog-Stufe (confirm-overlay, z 10) */
      .modus-panel {
        padding: 14px 16px;
      }
      .modus-panel .modus-kopf {
        color: var(--primary-text-color, inherit);
        margin-bottom: 6px;
      }
      .modus-gruppe {
        margin: 6px 0 4px;
        font-size: 0.8em;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        opacity: 0.7;
      }
      .modus-optionen {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(9.5em, 1fr));
        gap: 6px;
        margin-bottom: 8px;
      }
      .modus-option {
        display: flex;
        align-items: center;
        gap: 0.4em;
        padding: 0.4em 0.6em;
        border-radius: 10px;
        border: 1.5px solid var(--divider-color, var(--tt-line));
        background: transparent;
        color: inherit;
        font: inherit;
        font-weight: 600;
        text-align: left;
        cursor: pointer;
      }
      .modus-option:hover {
        filter: brightness(1.15);
      }
      .modus-option.aktiv {
        border-color: var(--primary-color, currentColor);
        background: var(--tt-soft);
      }
      .modus-haken {
        width: 1em;
        color: var(--primary-color, currentColor);
      }
      .modus-fehler {
        margin: 0 0 12px;
        padding: 8px 10px;
        border-radius: 8px;
        border: 1px solid var(--error-color, currentColor);
        color: var(--error-color, inherit);
        font-size: 0.9em;
      }
    `]}customElements.define("tomtut-pool-slot-heatpump",pi);const hi={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80,glow_pulse:40},ui=300,fi=e=>{const t=Math.min(300,Math.max(0,isFinite(Number(e))?Number(e):0));return{puls:Math.min(1,t/100),boost:t>100?Math.round((t-100)/200*1e3)/1e3:0}};class mi extends pt{get defaults(){return hi}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const e=Number(this._v("glow_size"))||0,t=Number(this._v("glow_thickness"))||0;if(e<=0||t<=0)return G;const i=Math.round(e*Fe("uv")/t*1e3)/1e3,n=Number(this._v("glow_intensity")),r=Math.min(100,Math.max(0,isFinite(n)?n:80))/100,{puls:s,boost:a}=fi(this._v("glow_pulse")),o=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${e}%`,`aspect-ratio:${i}`,`opacity:${r}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`,"--glow-pulse:"+Math.round(100*s)/100,...a>0?[`--glow-boost:${a}`]:[]].join("; ");return H`<div class="glow ${s>0?"wabert":"ruhig"}" style="${o};"></div>`}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.temp_entity))(e),i=!1!==e.show_glow,n=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_power&&!!e.power_entity,s=!1!==e.show_temp&&!!e.temp_entity;return this.renderSlot(H`
      ${ct(e)?H`<h3 class="slot-title">${ct(e)}</h3>`:G}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:i&&t&&this.leuchtet?this.renderGlow():G})}

        ${n?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):G}
        ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):G}
        ${s?this.renderThermo({value:$e(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):G}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${t?G:H`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[ut,ft,a`
      /*
       * Der Schein besteht aus drei Lagen:
       *   .glow         Kern — exakt der Verlauf von vorher (Deckkraft über
       *                 den Inline-Stil = Leuchtstärke)
       *   .glow::before derselbe Kern noch einmal, glimmt auf und ab
       *   .glow::after  weicher Hof, größer, wabert mit anderer Periode
       * Zwei ungleiche Perioden (5,3 s / 3,7 s) überlagern sich zu einem
       * Muster, das sich erst nach Minuten wiederholt — organisch statt
       * Metronom. Die Stärke kommt aus --glow-pulse (0..1).
       *
       * Iteration 14: --glow-boost (0..1, nur bei Regler > 100) legt oben
       * drauf — Hof größer und weicher, Amplituden bis zur vollen Deckkraft,
       * mehr Skalierung, bis 2,5× schnellerer Puls, satteres Violett plus
       * violetter Zusatz-Schein (box-shadow).
       * Jede Formel ist so gebaut, dass boost = 0 exakt die alten Werte ergibt.
       */
      .glow {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        background: radial-gradient(
          ellipse at center,
          rgba(203, 178, 255, 0.95) 0%,
          rgba(150, 140, 255, 0.72) 35%,
          rgba(104, 128, 255, 0.32) 65%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.35em);
      }
      .glow.wabert::before,
      .glow.wabert::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 50%;
        pointer-events: none;
      }
      .glow.wabert::before {
        background: inherit;
        opacity: 0;
        animation: uvGlimmen 5.3s ease-in-out infinite;
        animation-duration: calc(5.3s / (1 + var(--glow-boost, 0) * 1.5));
      }
      .glow.wabert::after {
        inset: calc(-18% - var(--glow-boost, 0) * 22%) calc(-8% - var(--glow-boost, 0) * 4%);
        background: radial-gradient(
          ellipse at center,
          rgba(190, 160, 255, 0.75) 0%,
          rgba(130, 120, 255, 0.35) 45%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(calc(0.5em + var(--glow-boost, 0) * 0.3em))
          saturate(calc(1 + var(--glow-boost, 0) * 1.8));
        /* Zusatz-Schein nur mit Boost — bei 0 ist er unsichtbar (Radius und
           Deckkraft 0), der alte Look bleibt also exakt */
        box-shadow: 0 0 calc(var(--glow-boost, 0) * 0.6em) 0
          rgba(140, 100, 255, calc(var(--glow-boost, 0) * 0.8));
        opacity: 0;
        animation: uvWabern 3.7s ease-in-out infinite alternate;
        animation-duration: calc(3.7s / (1 + var(--glow-boost, 0) * 1.5));
      }
      @keyframes uvGlimmen {
        0% {
          opacity: calc(var(--glow-pulse, 0) * (0.55 + var(--glow-boost, 0) * 0.45));
        }
        23% {
          opacity: calc(var(--glow-pulse, 0) * 0.15);
        }
        41% {
          opacity: calc(var(--glow-pulse, 0) * (0.45 + var(--glow-boost, 0) * 0.55));
        }
        67% {
          opacity: 0;
        }
        84% {
          opacity: calc(var(--glow-pulse, 0) * (0.35 + var(--glow-boost, 0) * 0.55));
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * (0.55 + var(--glow-boost, 0) * 0.45));
        }
      }
      @keyframes uvWabern {
        0% {
          opacity: calc(var(--glow-pulse, 0) * 0.2 * (1 - var(--glow-boost, 0)));
          transform: scale(
            calc(0.97 - var(--glow-boost, 0) * 0.05),
            calc(0.94 - var(--glow-boost, 0) * 0.08)
          );
        }
        55% {
          opacity: calc(var(--glow-pulse, 0) * (0.7 + var(--glow-boost, 0) * 0.3));
          transform: scale(
            calc(1.03 + var(--glow-boost, 0) * 0.05),
            calc(1.08 + var(--glow-boost, 0) * 0.07)
          );
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * (0.95 + var(--glow-boost, 0) * 0.05));
          transform: scale(
            calc(1.06 + var(--glow-boost, 0) * 0.08),
            calc(1.14 + var(--glow-boost, 0) * 0.1)
          );
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .glow.wabert::before,
        .glow.wabert::after {
          animation: none;
        }
      }
    `]}customElements.define("tomtut-pool-slot-uv",mi);const gi={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:86,arrow_in_left:8,arrow_in_size:12,arrow_out_top:12.5,arrow_out_left:91,arrow_out_size:12,temp_in_top:70,temp_in_left:14,temp_in_scale:105,temp_out_top:25,temp_out_left:72,temp_out_scale:105,power_bottom:8,power_left:42,power_scale:100,power_box:!0,power_label:!0},bi=(e={},t)=>{for(const i of[e.active_entity,e.switch_entity]){if(!i)continue;const n=t?.states?.[i],r=String(n?.state??"").toLowerCase();return!n||["","unknown","unavailable"].includes(r)?null:i===e.active_entity?ke(r):de(r)}return null},_i=(e={},t)=>{const i=bi(e,t),n=t?.states?.[e.switch_entity],r=!!n&&de(String(n.state).toLowerCase());return{aktiv:i,bypass:!!e.active_entity&&r&&!1===i}};class vi extends pt{get defaults(){return gi}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(e){const t=Number(this._v(`arrow_${e}_size`));return t>0?H`<img
      class="flow-arrow flow-${e}"
      src="${Re(Ke[e])}"
      alt=""
      style="top:${this._v(`arrow_${e}_top`)}%; left:${this._v(`arrow_${e}_left`)}%; width:${t}%;"
    />`:G}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.temp_in_entity||e.temp_out_entity||e.power_entity))(e),i=!1!==e.show_power_button&&!!e.switch_entity,n=!1!==e.show_temp_in&&!!e.temp_in_entity,r=!1!==e.show_temp_out&&!!e.temp_out_entity,s=!1!==e.show_power&&!!e.power_entity,a=!1!==e.show_arrows,o=_i(e,this.hass),l=!1===o.aktiv;return this.renderSlot(H`
      ${ct(e)?H`<h3 class="slot-title">${ct(e)}</h3>`:G}
      <div class="img-wrap ${l?"ruht":""} ${o.bypass?"bypass":""}">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${a?H`${this.renderPfeil("in")}${this.renderPfeil("out")}`:G}

        ${i?this.renderPowerButton({on:this._isOn(e.switch_entity),standby:o.bypass,hinweis:{oben:"Steuerung an",unten:"Bypass",lage:"mitte",titel:"Solarsteuerung an, Wasser läuft aber nicht übers Feld (Bypass) — Steuerung ausschalten (mit Rückfrage)"},top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):G}
        ${n?this.renderThermo({value:$e(this._ent(e.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:e.temp_in_entity}):G}
        ${r?this.renderThermo({value:$e(this._ent(e.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:e.temp_out_entity}):G}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):G}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${t?G:H`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[ut,ft,a`
      /* Die Breite steht im Inline-Stil (Prozent der Bildbreite) und schlägt
         die 100 % der allgemeinen Bildregel; die Höhe folgt dem Motiv. */
      .img-wrap > img.flow-arrow {
        position: absolute;
        height: auto;
        max-width: none;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 2;
      }
      /* Iteration 19c: Solarheizung läuft nicht (aus/Bypass) */
      .img-wrap.ruht .bild-flaeche img {
        filter: grayscale(0.7);
        opacity: 0.7;
      }
      .img-wrap.ruht > img.flow-arrow {
        opacity: 0.22;
        filter: grayscale(1);
      }
    `]}customElements.define("tomtut-pool-slot-solar",vi);const ki=["ha-entity-picker","ha-icon-picker"];let wi=null;const yi=()=>"undefined"!=typeof customElements&&ki.every(e=>!!customElements.get(e)),$i=e=>"undefined"!=typeof customElements&&!!customElements.get(e),xi=8,zi=["klassisch","liste","kacheln"],Si="klassisch",Ai=["switch","light","input_boolean","fan","siren"],Bi={switch:"mdi:toggle-switch-variant",input_boolean:"mdi:toggle-switch-outline",light:"mdi:lightbulb",fan:"mdi:fan",siren:"mdi:bullhorn",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-blank-circle-outline",climate:"mdi:thermostat",number:"mdi:ray-vertex",input_number:"mdi:ray-vertex"},Ei=e=>(Array.isArray(e?.entries)?e.entries:[]).filter(e=>e&&(e.entity||e.text||e.label)),Ti=e=>zi.includes(e?.layout)?e.layout:Si;class Mi extends pt{get confirmDefault(){return!1}get powerEntityId(){return this._wartet?.entity||null}get powerConfirmText(){return`„${this._wartet?.label||ye(this._ent(this._wartet?.entity),this._wartet?.entity)}" wird ausgeschaltet.`}get _entries(){return Ei(this.config).slice(0,8)}get _ausgeblendet(){return Math.max(0,Ei(this.config).length-8)}get _layout(){return Ti(this.config)}get _align(){const e=this.config?.align;return["oben","mitte","unten"].includes(e)?e:"klassisch"===this._layout?"mitte":"oben"}get _frameClasses(){return`${super._frameClasses} layout-${this._layout}`}_kind(e){return e.kind||(e.entity?"entity":"text")}_schaltbar(e){return Ai.includes(we(e.entity))}_toggle(e){const t=e.entity;if(t&&this.bedienbar&&this._schaltbar(e))return!0===e.confirm_off&&this._isOn(t)?(this._wartet=e,void this._fragen(null)):void this._call(t,"toggle")}_zustand(e){if(!e)return"—";try{const t=this.hass?.formatEntityState?.(e);if(t)return t}catch(e){console.warn("tomtut-pool-cards: formatEntityState —",e?.message||e)}return xe(e)}_icon(e,t){if(e.icon)return H`<ha-icon icon="${e.icon}"></ha-icon>`;if(t&&$i("ha-state-icon"))return H`<ha-state-icon .hass="${this.hass}" .stateObj="${t}"></ha-state-icon>`;const i=t?.attributes?.icon||Bi[we(e.entity)]||"mdi:circle-medium";return H`<ha-icon icon="${i}"></ha-icon>`}_renderEntry(e){const t=this._kind(e);if("text"===t)return H`<div class="entry text">${e.text||e.label||""}</div>`;const i=this._ent(e.entity);if("button"===t){const t=!!i&&de(i.state);return H`
        <button class="entry btn-entry ${t?"on":""}" @click="${()=>this._toggle(e)}">
          ${e.icon?H`<ha-icon icon="${e.icon}"></ha-icon>`:G}
          <span>${e.label||ye(i,e.entity)}</span>
        </button>
      `}return H`
      <div class="entry value" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${e.label||ye(i,e.entity)}</span>
        <span class="entry-value">${xe(i)}</span>
      </div>
    `}_renderZeile(e){const t=this._kind(e);if("text"===t)return H`<div class="entry zeile text"><span class="z-text">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),n=e.label||ye(i,e.entity),r=!i||["unavailable","unknown"].includes(i.state);if("button"===t&&this._schaltbar(e)){const t=!!i&&de(i.state);return H`
        <button
          class="entry zeile schaltbar ${t?"on":"off"} ${r?"weg":""}"
          role="switch"
          aria-checked="${t?"true":"false"}"
          title="${n}: ${t?"an":"aus"}"
          @click="${()=>this._toggle(e)}"
        >
          <span class="z-icon">${this._icon(e,i)}</span>
          <span class="z-name">${n}</span>
          <span class="schalter" aria-hidden="true"><span class="knopf"></span></span>
        </button>
      `}return H`
      <div class="entry zeile wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="z-icon">${this._icon(e,i)}</span>
        <span class="z-name">${n}</span>
        <span class="z-wert">${this._zustand(i)}</span>
      </div>
    `}_renderKachel(e){const t=this._kind(e);if("text"===t)return H`<div class="entry kachel text"><span class="k-name">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),n=e.label||ye(i,e.entity);if("button"===t&&this._schaltbar(e)){const t=!!i&&de(i.state);return H`
        <button
          class="entry kachel schaltbar ${t?"on":"off"}"
          role="switch"
          aria-checked="${t?"true":"false"}"
          @click="${()=>this._toggle(e)}"
        >
          <span class="k-icon">${this._icon(e,i)}</span>
          <span class="k-text">
            <span class="k-name">${n}</span>
            <span class="k-zustand">${t?"An":"Aus"}</span>
          </span>
        </button>
      `}return H`
      <div class="entry kachel wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="k-icon">${this._icon(e,i)}</span>
        <span class="k-text">
          <span class="k-name">${n}</span>
          <span class="k-zustand">${this._zustand(i)}</span>
        </span>
      </div>
    `}render(){const e=this.config||{},t=this._entries,i=this._layout,n=this._ausgeblendet;let r;return r=t.length?"liste"===i?H`<div class="zeilen">${t.map(e=>this._renderZeile(e))}</div>`:"kacheln"===i?H`<div class="kacheln">${t.map(e=>this._renderKachel(e))}</div>`:t.map(e=>this._renderEntry(e)):H`<p class="slot-hint">Noch keine Einträge — im Editor bis zu ${8} hinzufügen.</p>`,this.renderSlot(H`
      <div class="custom layout-${i} align-${this._align}">
        ${ct(e)?H`<h3 class="slot-title">${ct(e)}</h3>`:G}
        ${r}
        ${n?H`<p class="slot-hint mehr">+${n} weitere ${1===n?"Eintrag":"Einträge"} ausgeblendet (höchstens ${8})</p>`:G}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `)}static styles=[ut,ft,a`
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
      .slot-hint.mehr {
        font-size: 12px;
        color: var(--warning-color, #ff9800);
        opacity: 1;
      }

      /*
       * Liste + Kacheln (Iteration 16).
       *
       * Ohne Rahmenfüllung (fill transparent) trägt der Kasten den
       * Karten-Hintergrund des HA-Themes und dessen Schriftfarben — so ist er
       * auf hellem wie dunklem Theme lesbar und sieht aus wie die übrigen
       * Karten daneben. weiss/schwarz bleiben, was sie sind.
       * Maße in px statt em: die Höhe (Titel + 4 Zeilen <= 268 px bei 384 px
       * Breite) ist per Render-Test zugesagt und darf nicht an der
       * Schriftgröße der Umgebung hängen.
       */
      .slot.layout-liste,
      .slot.layout-kacheln {
        justify-content: flex-start;
        gap: 0;
        padding: 10px 14px;
        border-radius: var(--ha-card-border-radius, 12px);
        --tt-on: #00b36b;
        --tt-fg2: var(--secondary-text-color, rgba(127, 127, 127, 0.95));
        --tt-icon: var(--state-icon-color, var(--tt-fg2));
      }
      .slot.layout-liste.fill-transparent,
      .slot.layout-kacheln.fill-transparent {
        --tt-bg: var(--ha-card-background, var(--card-background-color, #ffffff));
        box-shadow: var(--ha-card-box-shadow, none);
      }
      .slot.fill-weiss.layout-liste,
      .slot.fill-weiss.layout-kacheln {
        --tt-fg2: rgba(0, 0, 0, 0.6);
        --tt-icon: rgba(0, 0, 0, 0.6);
      }
      .slot.fill-schwarz.layout-liste,
      .slot.fill-schwarz.layout-kacheln {
        --tt-fg2: rgba(255, 255, 255, 0.7);
        --tt-icon: rgba(255, 255, 255, 0.75);
      }
      .custom.layout-liste,
      .custom.layout-kacheln {
        align-items: stretch;
        text-align: left;
        gap: 0;
      }
      .layout-liste .slot-title,
      .layout-kacheln .slot-title {
        text-align: left;
        font-size: 21px;
        font-weight: 500;
        letter-spacing: 0;
        line-height: 28px;
        padding: 2px 2px 4px;
      }
      .zeilen {
        display: flex;
        flex-direction: column;
      }
      .zeile {
        box-sizing: border-box;
        display: grid;
        grid-template-columns: 36px minmax(0, 1fr) auto;
        align-items: center;
        column-gap: 10px;
        width: 100%;
        min-height: 48px;
        padding: 0 4px 0 2px;
        margin: 0;
        border: none;
        border-radius: 10px;
        background: none;
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 15px;
        line-height: 1.25;
        text-align: left;
      }
      .zeile.schaltbar {
        cursor: pointer;
      }
      .zeile.schaltbar:hover {
        background: var(--tt-soft);
      }
      .zeile.text {
        display: flex;
        min-height: 36px;
        color: var(--tt-fg2);
      }
      .z-icon,
      .k-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--tt-icon);
        --mdc-icon-size: 24px;
        transition: color 0.2s;
      }
      .zeile.on .z-icon,
      .kachel.on .k-icon {
        color: var(--tt-on);
      }
      .z-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .z-wert {
        white-space: nowrap;
        font-weight: 500;
        justify-self: end;
      }
      .zeile.weg {
        opacity: 0.5;
      }
      /* Schalter: aus = graue Bahn, Knopf links · an = grüne Bahn, Knopf rechts */
      .schalter {
        position: relative;
        box-sizing: border-box;
        width: 42px;
        height: 24px;
        border-radius: 12px;
        background: rgba(127, 127, 127, 0.38);
        border: 1px solid var(--tt-line);
        transition: background 0.2s, border-color 0.2s;
      }
      .knopf {
        position: absolute;
        top: 2px;
        left: 2px;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #ffffff;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
        transition: left 0.2s;
      }
      .zeile.on .schalter {
        background: var(--tt-on);
        border-color: var(--tt-on);
        box-shadow: 0 0 8px rgba(0, 179, 107, 0.45);
      }
      .zeile.on .knopf {
        left: 20px;
      }

      .kacheln {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
        padding-top: 4px;
      }
      .kachel {
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
        min-height: 56px;
        padding: 8px 10px;
        margin: 0;
        border-radius: 14px;
        border: 1px solid var(--tt-line);
        background: var(--tt-soft);
        color: var(--tt-fg);
        font-family: inherit;
        font-size: 14px;
        line-height: 1.2;
        text-align: left;
      }
      .kachel.schaltbar {
        cursor: pointer;
      }
      .kachel.schaltbar:hover {
        filter: brightness(1.06);
      }
      .kachel.on {
        background: linear-gradient(145deg, #00c878, #00a064);
        color: #ffffff;
        border-color: rgba(255, 255, 255, 0.28);
        box-shadow: 0 0 10px rgba(0, 200, 120, 0.4);
      }
      .kachel.on .k-icon {
        color: #ffffff;
      }
      .kachel.text {
        grid-column: span 2;
        min-height: 36px;
        color: var(--tt-fg2);
        background: none;
        border-style: dashed;
      }
      .k-text {
        display: flex;
        flex-direction: column;
        min-width: 0;
      }
      .k-name {
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .k-zustand {
        font-size: 12px;
        opacity: 0.8;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    `]}customElements.define("tomtut-pool-slot-custom",Mi);class Ci extends pt{static properties={...pt.properties,slotType:{attribute:!1}};render(){const e=this.config||{},t=De[this.slotType]||{},i=!1===t.ready?t.hint:e.hint||"";return this.renderSlot(H`
      ${ct(e)?H`<h3 class="slot-title">${ct(e)}</h3>`:G}
      ${i?H`<p class="slot-hint">${i}</p>`:G}
    `)}static styles=[ut,ft]}customElements.define("tomtut-pool-slot-frame",Ci);const Pi=["voll","mini"],Oi="voll",Wi=e=>"mini"===String(e?.view??"").trim().toLowerCase()?"mini":Oi,Ki=["heatpump","pump","uv","solar","custom"],Li="–",Ni=[["schwarz","Schwarz"],["weiss","Weiß"],["transparent","Transparent (nur Rand)"]],Ri=(e={})=>Ni.some(([t])=>t===e?.mini_tile_fill)?e.mini_tile_fill:"schwarz",Ii=[["theme","Theme (HA-Card)"],["schwarz","Schwarz"],["weiss","Weiß"],["transparent","Transparent"]],Fi=(e={})=>Ii.some(([t])=>t===e?.mini_card_fill)?e.mini_card_fill:"theme",Di=5,Hi=e=>{const t=Math.max(1,Math.floor(Number(e)||0));return t<=5?t:Math.ceil(t/2)},ji=["","unknown","unavailable","none"],Gi=e=>null==e||""===e||"—"===e?Li:e,Ui=(e,t)=>Gi($e(e?.states?.[t])),Zi=(e,t)=>{const i=ue(e?.states?.[t]);return null===i?Li:`${he(i,0)} W`},Vi=(e,t,i)=>{const n=new e;return n.config=t||{},n.hass=i,n},qi=e=>String(e?.label||e?.label_text||e?.title||"").trim()||De[e?.type]?.label||"Kasten",Qi=e=>({src:Ie(e),ratio:Fe(e)}),Xi={pump:[["stufe","Stufe"],["watt","Watt"],["temp","Temperatur"],["status","Status an/aus"]],heatpump:[["modus","Modus"],["watt","Watt"],["ist","Ist-Temperatur"],["soll","Soll-Temperatur"],["freigabe","Freigabe"],["status","Status an/aus"]],solar:[["vorlauf","Vorlauf"],["ruecklauf","Rücklauf"],["watt","Watt"],["status","Status an/aus"]],uv:[["status","Status an/aus"],["watt","Watt"],["temp","Temperatur"]],hero:[["temp","Temperatur"],["ph","pH"],["rx","RX"],["zulauf","Zulauf"]]},Ji={stufe:"Stufe",watt:"Watt",temp:"Temp",status:"Status",modus:"Modus",ist:"Ist",soll:"Soll",freigabe:"Freigabe",vorlauf:"Vorlauf",ruecklauf:"Rücklauf"},Yi=3,en={pump:{stufe:e=>Nt(e)||!!e.power_entity,watt:e=>!!e.power_entity,temp:e=>!!e.temp_entity},heatpump:{modus:()=>!0,watt:e=>!!e.power_entity,ist:e=>!!e.current_entity,soll:e=>!!e.target_entity,freigabe:e=>!!e.release_entity},solar:{vorlauf:e=>!!e.temp_in_entity,ruecklauf:e=>!!e.temp_out_entity,watt:e=>!!e.power_entity},uv:{watt:e=>!!e.power_entity,temp:e=>!!e.temp_entity},hero:{temp:e=>!!e.temp_entity&&!1!==e.show_thermo,ph:e=>!!e.ph_entity&&!1!==e.show_ph,rx:e=>!!e.rx_entity&&!1!==e.show_rx,zulauf:e=>!!e.inlet_temp_entity}},tn=(e,t)=>String(e?.label||e?.text||e?.entity||"").trim()||`Eintrag ${t+1}`,nn=(e={},t=String(e?.type||"frame").toLowerCase())=>{const i=e||{};let n;if("custom"===t)n=Ei(i).map((e,t)=>[String(t+1),tn(e,t)]);else{const e=en[t]||{};n=(Xi[t]||[]).filter(([t])=>!e[t]||e[t](i))}const r=e=>n.some(([t])=>t===e);let s;switch(t){case"pump":s=[r("stufe")?"stufe":"status",r("watt")?"watt":r("temp")?"temp":null];break;case"heatpump":s=["modus",r("watt")?"watt":null];break;case"solar":s=r("vorlauf")||r("ruecklauf")?["vorlauf","ruecklauf"].filter(r):["status",r("watt")?"watt":null];break;case"uv":s=["status",r("watt")?"watt":r("temp")?"temp":null];break;case"custom":s=n.length?["1"]:[];break;case"hero":s=n.map(([e])=>e);break;default:s=[]}s=s.filter(e=>e&&r(e));const a=Array.isArray(i.mini_show),o=a?i.mini_show.map(e=>String(e).trim().toLowerCase()):s,l=n.map(([e])=>e).filter(e=>o.includes(e));return{verfuegbar:n,standard:s,gewaehlt:l,eigen:a}},rn=(e={})=>Ki.includes(String(e?.type||"").toLowerCase())&&!0!==e?.mini_hidden,sn=e=>e?`${he(e.value,Number.isInteger(e.value)?0:1)} ${e.unit}`:Li,an=(e={},t)=>{const i=String(e?.type||"frame").toLowerCase(),n={...e||{},type:i},r={typ:i,name:qi(n),bild:null,icon:null,zustand:"neutral",gesperrt:!1,zeilen:[]},s=(e,t={})=>({text:Gi(e),...t}),a=e=>!!e&&!!t?.states?.[e],o=e=>de(t?.states?.[e]?.state),l=()=>"an"===r.zustand?"An":"aus"===r.zustand?"Aus":"gesperrt"===r.zustand?"Gesperrt":Li,{gewaehlt:c}=nn(n,i);let d={};switch(i){case"pump":{const e=Vi(Rt,n,t);r.bild=Qi("pump");const i=e.state;let a=null;if(e.blockedByMain?(a="Aus",r.zustand="aus"):Nt(n)&&e.running?(a=e.stageLabels[i.active]||`N${(i.active??0)+1}`,r.zustand="an"):e.stages.length||n.power_entity||!n.main_entity?(Nt(n)||n.power_entity)&&(a="Stopp",r.zustand="aus"):(a=o(n.main_entity)?"An":"Aus",r.zustand=o(n.main_entity)?"an":"aus"),!1!==n.show_fan){const t="an"===r.zustand,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1";r.rad={top:Number(e._v("fan_top")),left:Number(e._v("fan_left")),size:Math.max(1.9*Number(e._v("fan_size")),38),ratio:1,rund:!0,dreht:t,dur:Wt(e._v(n)),svg:tt}}d={stufe:()=>s(a),watt:()=>s(Zi(t,n.power_entity)),temp:()=>s(Ui(t,n.temp_entity)),status:()=>s(l())};break}case"heatpump":{const e=Vi(pi,n,t);r.bild=Qi("heatpump");const i=e._freigabe;r.gesperrt=!1===i;const p=n.switch_entity,h=e._klimaAus,u=h||[n.mode_entity,n.target_entity,n.current_entity].some(e=>String(e||"").startsWith("climate.")),f=!h&&(a(p)?o(p):e._fanActive);r.zustand=r.gesperrt?"gesperrt":f?"an":p||n.power_entity||n.fan_entity||u?"aus":"neutral",!1!==n.show_fan&&(r.rad={top:Number(e._v("fan_top")),left:Number(e._v("fan_left")),size:Number(e._v("fan_size")),ratio:Number(e._v("fan_ratio"))||1,rund:!1,dreht:e._fanActive&&!!ci(n),dur:e._fanDur,farbe:e._fanFarbe,svg:ot(e._v("fan_design"))}),d={modus:()=>{if(a(p)&&!o(p)||h)return s("Aus");const t=e._modusBadge;return t?s(t.text,"heizen"===t.art||"kuehlen"===t.art?{punkt:t.art}:{}):s(f?"An":"Aus")},watt:()=>s(Zi(t,n.power_entity)),ist:()=>s(sn(e._current),{name:"Ist"}),soll:()=>s(sn(e._target),{name:"Soll"}),freigabe:()=>{const e=null===i?null:i?"frei":"gesperrt",t=null===e?null:c.length>=3?e:`Freigabe ${e}`;return s(t,{...!1===i?{warn:!0}:{},umbruch:c.length<3})},status:()=>s(l(),r.gesperrt?{warn:!0}:{})};break}case"uv":{r.bild=Qi("uv");const e=n.switch_entity;a(e)&&(r.zustand=o(e)?"an":"aus"),d={status:()=>s(l()),watt:()=>s(Zi(t,n.power_entity)),temp:()=>s(Ui(t,n.temp_entity))};break}case"solar":{r.bild=Qi("solar");const e=_i(n,t);null!==e.aktiv&&(r.zustand=e.aktiv?"an":"aus"),d={vorlauf:()=>s(Ui(t,n.temp_in_entity),{pfeil:"in"}),ruecklauf:()=>s(Ui(t,n.temp_out_entity),{pfeil:"out"}),watt:()=>s(Zi(t,n.power_entity)),status:()=>s(l())};break}case"custom":{const e=Ei(n),i=e[Number(c[0])-1]||e[0],a=e=>{if("text"===(e.kind||(e.entity?"entity":"text"))||!e.entity)return{text:e.text||e.label,icon:e.icon||"mdi:text"};const i=t?.states?.[e.entity],n=we(e.entity),r=e.icon||i?.attributes?.icon||Bi[n]||"mdi:circle-medium";if(!i||ji.includes(String(i.state).toLowerCase()))return{text:null,icon:r,name:e.label||ye(i,e.entity)};const s=e.label||ye(i,e.entity);if(Ai.includes(n))return{text:de(i.state)?"An":"Aus",icon:r,name:s,schalter:de(i.state)};if(null!==pe(i.state))return{text:xe(i),icon:r,name:s};try{return{text:t?.formatEntityState?.(i)||xe(i),icon:r,name:s}}catch(e){return console.warn("tomtut-pool-cards: formatEntityState —",e?.message||e),{text:xe(i),icon:r,name:s}}};if(!i)return r.icon="mdi:form-textbox",r.zeilen.push(s(n.title||"Freifeld")),r;const o=a(i);if(r.icon=o.icon,void 0!==o.schalter&&(r.zustand=o.schalter?"an":"aus"),1===c.length){r.zeilen.push(s(o.text));const e=o.name||n.title;return e&&r.zeilen.push(s(e)),r}for(const t of c){const i=e[Number(t)-1];if(!i)continue;const n=a(i);r.zeilen.push(s(n.text,n.name?{name:n.name}:{}))}return r}default:return r.zeilen.push(s(null)),r}for(const e of c){if(!d[e])continue;const t=d[e]();c.length>=3&&!t.punkt&&(t.name=Ji[e]||t.name),r.zeilen.push(t)}return r},on=(e={},t)=>{const i=Vi($t,e||{},t),n=Ee(e?.shape),{gewaehlt:r}=nn(e||{},"hero"),s=e=>r.includes(e),a=[];s("ph")&&a.push({key:"pH",text:Ui(t,e.ph_entity),entity:e.ph_entity}),s("rx")&&a.push({key:"RX",text:Ui(t,e.rx_entity),entity:e.rx_entity}),s("zulauf")&&a.push({key:"Zulauf",text:Ui(t,e.inlet_temp_entity),entity:e.inlet_temp_entity});const o=Object.values(Pe).filter(e=>i._spriteAn(e.anker)).map(t=>({anker:t.anker,src:Re(t.file),...kt(e||{},t,"mini")}));return{bild:Re(n.file),ratio:Me(e?.shape),label:n.label,temp:s("temp")?Ui(t,e.temp_entity):null,chips:a,sprites:o}},ln=e=>t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e())},cn=e=>["transparent","weiss","schwarz"].includes(e?.frame?.fill)?e.frame.fill:"transparent",dn=e=>e<=2?"normal":"raster",pn=(e,t,i)=>H`
  <div
    class="kachel ${t.zustand} typ-${t.typ} dichte-${dn(t.zeilen.length)} ${t.zeilen.length>=5?"viele":""}"
    role="button"
    tabindex="0"
    data-mini="${i}"
    title="${t.name} — tippen für den vollen Kasten"
    aria-label="${t.name}: ${t.zeilen.map(e=>e.name?`${e.name} ${e.text}`:e.text).join(", ")}"
    @click="${()=>e._miniOeffnen(i)}"
    @keydown="${ln(()=>e._miniOeffnen(i))}"
  >
    <span class="k-status" title="${{an:"an",aus:"aus",gesperrt:"gesperrt"}[t.zustand]||"unbekannt"}"></span>
    <div class="k-innen">
      <div class="k-bild">
        ${t.bild?H`<div class="k-bildbox" style="--r:${Math.round(1e3*t.bild.ratio)/1e3};">
              <img src="${t.bild.src}" alt="${t.name}" />${(e=>e?H`<div
        class="k-rad ${e.dreht&&e.dur>0?"dreht":"steht"} ${e.rund?"rund":""}"
        style="top:${e.top}%; left:${e.left}%; width:${e.size}%; --k-rad-ratio:${e.ratio}; --k-rad-dur:${e.dur}s;${e.farbe?` --k-rad-farbe:${e.farbe};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${e.rund?"xMidYMid meet":"none"}">
          <g .innerHTML="${e.svg}"></g>
        </svg>
      </div>`:G)(t.rad)}
            </div>`:H`<ha-icon icon="${t.icon||"mdi:circle-medium"}"></ha-icon>`}
        ${t.gesperrt&&!t.zeilen.some(e=>e.warn)?H`<span class="k-sperre">Gesperrt</span>`:G}
      </div>
      ${t.zeilen.length?H`<div class="k-werte">${t.zeilen.map((e,i)=>((e,t,i=!1)=>H`<span
  class="k-zeile ${t?"neben":"haupt"} ${e.punkt?`badge ${e.punkt}`:""} ${e.warn?"warn":""} ${i?"breit":""} ${e.umbruch?"umbruch":""}"
  >${e.pfeil?H`<img
        class="k-pfeil"
        src="${Re(Ke[e.pfeil])}"
        alt="${"in"===e.pfeil?"Vorlauf":"Rücklauf"}"
      />`:G}${e.name?H`<span class="k-name">${e.name}</span>`:G}<span class="k-text"
    >${e.text}</span
  ></span
>`)(e,i,((e,t)=>{const i=e.map((e,t)=>e.punkt?-1:t).filter(e=>e>=0);return e.length>=3&&i.length%2==1&&i[i.length-1]===t})(t.zeilen,i)))}</div>`:G}
    </div>
  </div>
`,hn=e=>{const t=e._config,i=e.hass,n=!1!==t.hero?.enabled&&!0!==t.hero?.mini_hidden,r=e._slotsMitNummer.filter(({slot:e})=>rn(e));return H`
    <ha-card
      class="mini-karte slot fill-${cn(t)} ${!1===t.frame?.enabled?"":"framed"} aussen-${Fi(t)}"
    >
      <div class="mini kacheln-${Ri(t)}" style="--m-spalten:${Hi(r.length)};">
        ${n?((e,t)=>H`
  <div
    class="m-kopf"
    role="button"
    tabindex="0"
    data-mini="${xt}"
    title="Becken — tippen für den vollen Kasten"
    @click="${()=>e._miniOeffnen(xt)}"
    @keydown="${ln(()=>e._miniOeffnen(xt))}"
  >
    <div class="m-becken" style="--r:${Math.round(1e3*t.ratio)/1e3};">
      <img class="m-becken-bild" src="${t.bild}" alt="Pool ${t.label}" />
      ${t.sprites.map(e=>H`<img
          class="m-sprite sprite-${e.anker}"
          src="${e.src}"
          alt=""
          style="top:${e.top}%; left:${e.left}%; width:${e.breite}%;"
        />`)}
    </div>
    <div class="m-werte">
      ${null===t.temp?G:t.temp===Li?H`<div class="m-temp leer" title="Wassertemperatur: kein Wert">
            ${lt}<span class="m-temp-leer"><span class="m-temp-key">Wasser</span>${Li}</span>
          </div>`:H`<div class="m-temp">${lt}<span class="m-temp-wert">${t.temp}</span></div>`}
      ${t.chips.length?H`<div class="m-chips">
            ${t.chips.map(e=>H`<span class="m-chip" data-entity="${e.entity}"
                ><span class="m-chip-key">${e.key}</span><span class="m-chip-wert">${e.text}</span></span
              >`)}
          </div>`:G}
    </div>
  </div>
`)(e,on(t.hero,i)):G}
        ${r.length?H`<div class="m-kacheln">
              ${r.map(({slot:t,nr:n})=>pn(e,an(t,i),n))}
            </div>`:G}
        ${n||r.length?G:H`<p class="m-leer">Noch nichts zu zeigen — im Editor das Becken einschalten oder ein Gerät hinzufügen.</p>`}
      </div>
      ${(e=>{const t=e._miniOffen;if(null==t)return G;const i=e._config;let n,r,s;if(t===xt){if(!1===i.hero?.enabled)return G;n="Becken",r=Tt(i,xt),s=H`<tomtut-pool-hero
      .hass="${e.hass}"
      .config="${i.hero}"
      .frame="${i.frame}"
      .kiosk="${r}"
    ></tomtut-pool-hero>`}else{const a=e._slotsMitNummer.find(e=>e.nr===t);if(!a)return G;n=qi(a.slot),r=Tt(i,a.nr,a.slot),s=e._renderSlot({...a.slot,label:"",label_text:"",title:""},r)}return H`
    <dialog
      class="m-dialog slot fill-${cn(i)}"
      data-mini-dialog="${t}"
      aria-label="${n}"
      @click="${t=>e._miniBackdrop(t)}"
      @close="${()=>e._miniZu()}"
    >
      <div class="m-dialog-kopf">
        <span class="m-dialog-titel"
          >${n}${r?H` <small class="m-nur-anzeige">nur Anzeige</small>`:G}</span
        >
        <button class="m-zu" type="button" title="Schließen" aria-label="Schließen" @click="${()=>e._miniZu()}">
          ✕
        </button>
      </div>
      <div class="m-dialog-inhalt" @hass-more-info="${()=>e._miniZu()}">${s}</div>
    </dialog>
  `})(e)}
    </ha-card>
  `},un=a`
  ha-card.mini-karte {
    display: block;
    box-sizing: border-box;
    background: var(--ha-card-background, var(--card-background-color, transparent));
    border-radius: var(--ha-card-border-radius, 12px);
    border: var(--ha-card-border-width, 1px) solid var(--ha-card-border-color, var(--divider-color, transparent));
    box-shadow: var(--ha-card-box-shadow, none);
    backdrop-filter: var(--ha-card-backdrop-filter, none);
    color: var(--tt-fg);
  }
  ha-card.mini-karte.fill-weiss,
  ha-card.mini-karte.fill-schwarz {
    background: var(--tt-bg);
  }
  /* mini_card_fill (Iteration 21) — nur wenn gesetzt; "theme" = oben */
  ha-card.mini-karte.aussen-schwarz {
    --tt-bg: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.3);
    background: #1e1e1e;
    color: #ffffff;
  }
  ha-card.mini-karte.aussen-weiss {
    --tt-bg: #ffffff;
    --tt-fg: #111111;
    --tt-line: rgba(0, 0, 0, 0.28);
    background: #ffffff;
    color: #111111;
  }
  ha-card.mini-karte.aussen-transparent {
    background: transparent;
    border: none;
    box-shadow: none;
    backdrop-filter: none;
  }
  /* Innenabstand wächst mit dem Eckradius des Themes (Liquid Glass: 34 px),
     damit keine Kachel-Ecke in der Rundung der Card hängt */
  .mini {
    container-type: inline-size;
    box-sizing: border-box;
    padding: clamp(8px, calc(var(--ha-card-border-radius, 12px) * 0.3), 14px);
    display: flex;
    flex-direction: column;
    gap: 8px;
    line-height: 1.2;
  }

  /* ---- Kopf: Becken + Werte (Iteration 18: Becken größer, Werte füllen
     die Spalte — Temperatur als breiter Block, pH/RX/Zulauf als 2er-Raster) ---- */
  .m-kopf {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    border-radius: 10px;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .m-becken {
    position: relative;
    flex: 0 0 auto;
    width: min(62%, calc(150px * var(--r)));
    aspect-ratio: var(--r);
  }
  .m-becken > img {
    position: absolute;
    display: block;
    pointer-events: none;
  }
  .m-becken > .m-becken-bild {
    inset: 0;
    width: 100%;
    height: 100%;
  }
  .m-becken > .m-sprite {
    height: auto;
    transform: translate(-50%, -50%);
  }
  .m-werte {
    flex: 1 1 auto;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    gap: 5px;
  }
  .m-temp {
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1;
    min-width: 0;
  }
  .m-temp svg {
    flex: none;
    height: clamp(28px, 7.6cqw, 36px);
    width: auto;
    display: block;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
  }
  .m-temp-wert {
    flex: 1 1 auto;
    text-align: center;
    font-size: clamp(18px, 5cqw, 24px);
    font-weight: 800;
    white-space: nowrap;
    padding: 0.1em 0.3em;
    border-radius: 0.4em;
    /* folgt mini_tile_fill wie die Kacheln (Iteration 21) */
    background: var(--k-bg);
    color: var(--k-fg);
    border: 1px solid var(--k-line);
    font-variant-numeric: tabular-nums;
  }
  /* kein Wert: dezent, ohne großen leeren Kasten */
  .m-temp.leer svg {
    height: clamp(26px, 7cqw, 34px);
    opacity: 0.75;
  }
  .m-temp-leer {
    display: inline-flex;
    align-items: baseline;
    gap: 6px;
    font-size: 16px;
    font-weight: 700;
    color: var(--tt-fg);
  }
  .m-temp-key {
    font-size: 12px;
    font-weight: 700;
    opacity: 0.75;
  }
  /* Werte als kleine Tabelle untereinander: Schlüssel links, Wert rechts */
  .m-chips {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 3px;
  }
  .m-chip {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 4px;
    min-width: 0;
    padding: 2px 9px;
    border-radius: 7px;
    border: 1px solid var(--k-line);
    background: var(--k-bg);
    color: var(--k-fg);
    line-height: 1.15;
    white-space: nowrap;
  }
  .m-chip-key {
    font-size: 11px;
    font-weight: 700;
    opacity: 0.75;
  }
  .m-chip-wert {
    font-size: 14px;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  /* ---- Kacheln ---- */
  .m-kacheln {
    display: grid;
    gap: 8px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @container (min-width: 440px) {
    .m-kacheln {
      grid-template-columns: repeat(var(--m-spalten, 4), minmax(0, 1fr));
    }
  }
  .kachel {
    container-type: inline-size;
    position: relative;
    min-width: 0;
    box-sizing: border-box;
    border-radius: 12px;
    border: 1.5px solid transparent;
    background: var(--k-bg);
    color: var(--k-fg);
    cursor: pointer;
    transition: filter 0.15s, transform 0.1s;
    -webkit-tap-highlight-color: transparent;
  }
  /* Kachel-Hintergrund (mini_tile_fill): Farben je Füllung, lesbar in
     hellem und dunklem Theme; transparent = nur Rand, Karte scheint durch */
  .mini.kacheln-schwarz {
    --k-bg: #1e1e1e;
    --k-fg: #ffffff;
    --k-line: rgba(255, 255, 255, 0.22);
  }
  .mini.kacheln-weiss {
    --k-bg: #ffffff;
    --k-fg: #111111;
    --k-line: rgba(0, 0, 0, 0.22);
  }
  .mini.kacheln-transparent {
    --k-bg: transparent;
    --k-fg: var(--tt-fg);
    --k-line: var(--tt-line);
  }
  .mini.kacheln-transparent .kachel {
    border-color: var(--k-line);
  }
  .mini-karte.framed .kachel {
    border-color: var(--k-line);
  }
  .kachel:hover {
    filter: brightness(1.05);
  }
  .kachel:active {
    transform: scale(0.98);
  }
  .kachel:focus-visible,
  .m-kopf:focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }
  .k-innen {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 7px;
  }
  .k-bild {
    --kb-h: 60px;
    position: relative;
    width: 100%;
    height: var(--kb-h);
    display: flex;
    align-items: center;
    justify-content: center;
    --mdc-icon-size: 34px;
  }
  .k-bild > img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
  /* Bildbox im echten Seitenverhältnis: das Rad sitzt prozentgenau wie
     im vollen Kasten */
  .k-bildbox {
    position: relative;
    width: min(100%, calc(var(--kb-h) * var(--r)));
    aspect-ratio: var(--r);
  }
  .k-bildbox > img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
  }
  .kachel.aus .k-bild img,
  .kachel.gesperrt .k-bild img {
    filter: grayscale(0.85);
    opacity: 0.6;
  }
  /* Laufrad / Lüfter (Iteration 19): dreht mit dem Tempo aus dem vollen
     Kasten, steht bei Stillstand */
  .k-rad {
    position: absolute;
    aspect-ratio: 1 / var(--k-rad-ratio, 1);
    transform: translate(-50%, -50%);
    color: var(--k-rad-farbe, #263238);
    pointer-events: none;
  }
  .k-rad.rund {
    color: var(--k-rad-farbe, #1565c0);
    background: rgba(255, 255, 255, 0.92);
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
    padding: 1px;
    box-sizing: border-box;
  }
  .k-rad svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  .k-rad svg g {
    transform-box: view-box;
    transform-origin: 50% 50%;
  }
  .k-rad.dreht svg g {
    animation: kRad var(--k-rad-dur, 1s) linear infinite;
  }
  .k-rad.steht {
    opacity: 0.55;
    filter: grayscale(1);
  }
  @keyframes kRad {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .k-rad.dreht svg g {
      animation: none;
    }
  }
  .k-werte {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    min-width: 0;
    max-width: 100%;
  }
  .k-zeile {
    display: flex;
    align-items: center;
    gap: 4px;
    max-width: 100%;
    white-space: nowrap;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.2;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.1px;
  }
  .k-zeile.neben {
    font-size: 13px;
    font-weight: 600;
  }
  /* kleiner Vorsatz vor dem Wert ("Ist", "Soll", Name eines Eintrags) */
  .k-name {
    flex: none;
    font-size: 0.78em;
    font-weight: 700;
    opacity: 0.72;
    letter-spacing: 0.3px;
  }
  .k-zeile.warn .k-text {
    padding: 0 5px;
    border-radius: 5px;
    background: #c62828;
    color: #ffffff;
  }
  /* ab 3 Werten: 2 Spalten × n Zeilen unter dem Bild (Iteration 19) —
     Modus-Pille über die volle Breite, Name ("Ist") darf über den Wert
     umbrechen, abgeschnitten wird nie */
  /* Raster (It19c): Bild kleiner, dafür Werte ≥ 12 px und Namen ≥ 9 px —
     auf dem Tablet lesbar */
  .kachel.dichte-raster .k-bild {
    --kb-h: 40px;
  }
  .kachel.dichte-raster .k-innen {
    padding: 6px 4px 7px;
  }
  /* Raster (It19b): 2 Spalten, jede Zelle gleich — Name klein oben, Wert
     darunter; Pille und eine übrige letzte Zelle über die volle Breite */
  .kachel.dichte-raster .k-werte {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-auto-rows: auto;
    gap: 2px 2px;
    width: 100%;
    align-items: stretch;
  }
  .kachel.dichte-raster .k-zeile,
  .kachel.dichte-raster .k-zeile.neben {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    column-gap: 3px;
    row-gap: 0;
    min-width: 0;
    font-size: 12.5px;
    font-weight: 700;
    letter-spacing: -0.2px;
    line-height: 1.1;
  }
  /* Name klein oben über die ganze Zelle, darunter (Pfeil +) Wert */
  .kachel.dichte-raster .k-zeile .k-name {
    order: -1;
    flex: 0 0 100%;
    text-align: center;
    font-size: 10px;
    line-height: 1.05;
    opacity: 0.75;
    letter-spacing: 0.1px;
  }
  .kachel.dichte-raster .k-zeile .k-pfeil {
    width: 13px;
  }
  .kachel.dichte-raster .k-zeile.breit,
  .kachel.dichte-raster .k-zeile.badge {
    grid-column: 1 / -1;
  }
  .kachel.dichte-raster .k-zeile.badge {
    display: flex;
    justify-content: center;
  }
  .kachel.dichte-raster .k-text,
  .kachel.dichte-raster .k-name {
    white-space: nowrap;
  }
  .kachel.dichte-raster .k-zeile.badge .k-text {
    white-space: normal;
  }
  /* ab 5 Werten: Bild noch etwas kleiner */
  .kachel.dichte-raster.viele .k-bild {
    --kb-h: 36px;
  }
  /* "Freigabe gesperrt" darf zweizeilig werden statt abgeschnitten */
  .k-zeile.umbruch {
    white-space: normal;
    text-align: center;
  }
  .k-zeile.umbruch .k-text {
    white-space: normal;
  }
  .k-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Modus-Badge ("Kühlen Silent") ist das längste Wort der Kacheln: es darf
     am Leerzeichen umbrechen statt abgeschnitten zu werden */
  .k-zeile.badge {
    white-space: normal;
    align-items: center;
  }
  .k-zeile.badge .k-text {
    overflow-wrap: normal;
    text-align: center;
  }
  /* Modus als getönte Pille in der Farbe des Rads (heizen rot, kühlen
     blau) — bleibt auch zweizeilig ein ruhiger Block */
  .k-zeile.heizen {
    --k-modus: ${s(Dt.heizen)};
  }
  .k-zeile.kuehlen {
    --k-modus: ${s(Dt.kuehlen)};
  }
  .k-zeile.badge {
    font-size: 12.5px;
  }
  .k-zeile.badge .k-text {
    padding: 1px 5px;
    border-radius: 7px;
    background: color-mix(in srgb, var(--k-modus) 26%, transparent);
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--k-modus) 75%, transparent);
  }
  .k-pfeil {
    flex: none;
    width: 16px;
    height: auto;
    display: block;
  }
  .k-status {
    position: absolute;
    top: 6px;
    right: 6px;
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .kachel.an .k-status {
    background: #4caf50;
    box-shadow: 0 0 6px rgba(76, 175, 80, 0.8);
  }
  .kachel.aus .k-status {
    background: #f44336;
    opacity: 0.8;
  }
  .kachel.gesperrt .k-status {
    background: #c62828;
  }
  .kachel.neutral .k-status {
    background: #9e9e9e;
  }
  .k-sperre {
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    padding: 1px 6px;
    border-radius: 6px;
    background: #c62828;
    color: #ffffff;
    font-size: 10.5px;
    font-weight: 800;
    letter-spacing: 0.3px;
    line-height: 1.3;
    white-space: nowrap;
  }
  /* breite Kachel (schmale Card, 2er-Raster): Bild links, Werte rechts */
  @container (min-width: 165px) {
    .k-innen {
      flex-direction: row;
      gap: 8px;
      padding: 6px 8px;
    }
    .k-bild {
      --kb-h: 54px;
      flex: 0 0 42%;
      width: 42%;
    }
    /* Raster bleibt auch in breiten Kacheln unter dem Bild */
    .kachel.dichte-raster .k-innen {
      flex-direction: column;
      gap: 4px;
      padding: 6px 8px 7px;
    }
    .kachel.dichte-raster .k-bild {
      --kb-h: 40px;
      flex: none;
      width: 100%;
    }
    .k-werte {
      flex: 1 1 auto;
      align-items: flex-start;
    }
    .k-zeile.badge .k-text {
      text-align: left;
    }
  }

  /* ---- Dialog (Top-Layer, kein z-index) ---- */
  /* leere Mini-Card (Iteration 22, Bug A16) */
  .m-leer {
    margin: 0;
    padding: 12px;
    font-size: 13px;
    opacity: 0.75;
    text-align: center;
  }
  dialog.m-dialog {
    padding: 0;
    border: none;
    box-sizing: border-box;
    width: min(94vw, 560px);
    max-width: 94vw;
    max-height: 92vh;
    overflow: auto;
    border-radius: var(--ha-dialog-border-radius, 20px);
    background: linear-gradient(var(--card-background-color, transparent), var(--card-background-color, transparent)),
      var(--primary-background-color, #fafafa);
    color: var(--primary-text-color, #111);
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
  }
  dialog.m-dialog.fill-weiss,
  dialog.m-dialog.fill-schwarz {
    background: var(--tt-bg);
    color: var(--tt-fg);
  }
  dialog.m-dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(3px);
  }
  .m-dialog-kopf {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 10px 10px 0 16px;
  }
  .m-dialog-titel {
    font-size: 17px;
    font-weight: 700;
  }
  .m-nur-anzeige {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.75;
    margin-left: 6px;
  }
  .m-zu {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid var(--tt-line);
    background: transparent;
    color: inherit;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    font-family: inherit;
  }
  .m-dialog-inhalt {
    padding: 8px 12px 14px;
  }
`,fn=e=>String(e??"").trim(),mn=(e,t)=>""!==fn(e)&&!t.includes(fn(e).toLowerCase()),gn=(e={})=>{const t=e||{},i=[],n=t.hero?.shape;return fn(n)&&!Be(n)&&i.push(`Beckenform „${fn(n)}“ gibt es nicht — es gilt Oval. Möglich: ${Object.keys(ze).join(", ")}.`),mn(t.view,["voll","mini"])&&i.push(`Ansicht „${fn(t.view)}“ gibt es nicht — es gilt Voll.`),mn(t.frame?.fill,["transparent","weiss","schwarz"])&&i.push(`Füllung „${fn(t.frame.fill)}“ gibt es nicht — es gilt Transparent.`),mn(t.mini_tile_fill,["schwarz","weiss","transparent"])&&i.push(`Kachel-Hintergrund „${fn(t.mini_tile_fill)}“ gibt es nicht — es gilt Schwarz.`),mn(t.mini_card_fill,["theme","schwarz","weiss","transparent"])&&i.push(`Außen-Hintergrund „${fn(t.mini_card_fill)}“ gibt es nicht — es gilt Theme.`),(Array.isArray(t.slots)?t.slots:[]).forEach((e,t)=>{const n=fn(e?.type||"frame").toLowerCase();De[n]||i.push(`Kasten ${t+1}: Typ „${fn(e?.type)}“ gibt es nicht — er erscheint als leerer Rahmen.`),"custom"===n&&mn(e.layout,["klassisch","liste","kacheln"])&&i.push(`Kasten ${t+1}: Darstellung „${fn(e.layout)}“ gibt es nicht — es gilt Klassisch.`),"pump"===n&&mn(e.stage_mode,["momentary","latching"])&&i.push(`Kasten ${t+1}: Schaltmodell „${fn(e.stage_mode)}“ gibt es nicht — es gilt Impulstaster.`)}),i},bn={enabled:!0,fill:"transparent"};class _n extends oe{static properties={hass:{attribute:!1},_config:{state:!0},_miniOffen:{state:!0}};constructor(){super(),this._miniOffen=null}setConfig(e){if(!e||"object"!=typeof e)throw new Error("Ungültige Konfiguration");if(void 0!==e.slots&&!Array.isArray(e.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==e.hero&&("object"!=typeof e.hero||Array.isArray(e.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==e.version&&1!==Number(e.version))throw new Error(`Unbekannte Config-Version ${e.version} — diese Card kennt Version 1`);this._config={version:1,...e,hero:{enabled:!0,shape:Se,...e.hero||{}},frame:{...bn,...e.frame||{}},slots:Array.isArray(e.slots)?e.slots:[]},this._miniOffen=null;const t=gn(this._config).join(" | ");t&&t!==this._gemeldet&&console.warn("tomtut-pool-cards:",t),this._gemeldet=t}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:Se},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const e=this._config||{};if("mini"===Wi(e)){const t=(e.slots||[]).filter(e=>Ki.includes(String(e?.type||"").toLowerCase())).length;return(!1===e.hero?.enabled?0:3)+(t?2:0)||2}const t=(e.slots||[]).filter(e=>"hidden"!==(e?.type||"frame"));return(!1===e.hero?.enabled?0:6)+5*Math.ceil(t.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(e=>({...e||{},type:String(e?.type||"frame").toLowerCase()})).filter(e=>"hidden"!==e.type)}get _slotsMitNummer(){return(this._config?.slots||[]).map((e,t)=>({slot:{...e||{},type:String(e?.type||"frame").toLowerCase()},nr:t+1})).filter(({slot:e})=>"hidden"!==e.type)}_miniOeffnen(e){this._miniOffen=e}_miniZu(){null!==this._miniOffen&&(this._miniOffen=null)}_miniBackdrop(e){e?.target===e?.currentTarget&&this._miniZu()}updated(e){super.updated?.(e);const t=this.renderRoot?.querySelector?.("dialog.m-dialog");if(t&&!t.open)try{"function"==typeof t.showModal?t.showModal():t.setAttribute("open","")}catch(e){console.warn("tomtut-pool-cards: Dialog ohne showModal —",e?.message||e),t.setAttribute("open","")}}render(){if(!this._config)return G;const e=this._config;if("mini"===Wi(e))return hn(this);const t=!1!==e.hero?.enabled;return H`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${t?H`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${e.hero}"
                  .frame="${e.frame}"
                  .kiosk="${Tt(e,xt)}"
                ></tomtut-pool-hero>`:G}
            ${this._slotsMitNummer.map(({slot:t,nr:i})=>this._renderSlot(t,Tt(e,i,t)))}
          </div>
          ${t||this._slotsMitNummer.length?G:H`<p class="leer-hinweis">
                TomTuT Pool Dashboard: noch nichts zu zeigen — im Editor das Becken einschalten oder
                einen Kasten hinzufügen.
              </p>`}
        </div>
      </ha-card>
    `}_renderSlot(e,t=!1){const i=this._config.frame;switch(De[e.type]?.ready?e.type:"frame"){case"heatpump":return H`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return H`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-pump>`;case"uv":return H`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-uv>`;case"solar":return H`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-solar>`;case"custom":return H`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-custom>`;default:return H`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
          .slotType="${e.type}"
        ></tomtut-pool-slot-frame>`}}static styles=[a`
    /*
     * Der aeussere Riegel gegen das Durchschlagen in die HA-Oberflaeche:
     * Host und ha-card bilden je einen eigenen Stacking-Context. Alles,
     * was in den Slots an z-index vergeben wird (1-10, s. shared/styles.js),
     * bleibt damit innerhalb der Card — beim Scrollen verschwindet sie unter
     * der Kopfleiste, statt darueber zu liegen.
     */
    :host {
      display: block;
      position: relative;
      isolation: isolate;
      z-index: 0;
    }
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      overflow: visible;
      position: relative;
      isolation: isolate;
      z-index: 0;
    }
    /* Container-Queries statt Media-Queries: es zählt die Breite der Card,
       nicht die des Fensters — sonst bricht das Raster in Sections-Views. */
    .wrap {
      container-type: inline-size;
      width: 100%;
    }
    /* leere Card (Iteration 22, Bug A16): statt 0 px ein Hinweis */
    .leer-hinweis {
      margin: 0;
      padding: 16px;
      border: 1.5px dashed var(--divider-color, rgba(127, 127, 127, 0.5));
      border-radius: 12px;
      color: var(--secondary-text-color, #777);
      font-size: 14px;
      text-align: center;
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
  `,ht,un]}customElements.define("tomtut-pool-dashboard",_n);class vn{constructor({hass:e,config:t,defaults:i={},update:n,idPrefix:r="f"}){this.hass=e,this.config=t||{},this.defaults=i,this.update=n,this.idPrefix=r}val(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}raw(e){const t=this.config?.[e];return null==t?"":t}shown(e,t=!0){const i=this.config?.[e];return null==i?t:!1!==i}zeigen(e,t,i=!0){const n=this.shown(t,i);return H`
      <label class="haken">
        <input
          type="checkbox"
          data-key="${t}"
          .checked="${n}"
          @change="${e=>this.update({[t]:e.target.checked===i?void 0:e.target.checked})}"
        />
        <span>${e}</span>
      </label>
    `}text(e,t,i="",n=""){return H`
      <label
        >${e}
        <input
          type="text"
          data-key="${t}"
          .value="${String(this.raw(t))}"
          placeholder="${n}"
          @input="${e=>this.update({[t]:e.target.value||void 0})}"
        />
        ${i?H`<small>${i}</small>`:G}
      </label>
    `}_entityOptions(e){const t=this.hass?.states??{};return Object.keys(t).filter(t=>!e.length||e.some(e=>t.startsWith(e+"."))).sort()}entity(e,t,i="",...n){return this._entityInput({label:e,hint:i,domains:n,value:String(this.raw(t)),dataKey:t,listId:`${this.idPrefix}-${t}`,onChange:e=>this.update({[t]:e||void 0})})}entityAt(e,t,i,n="",...r){const s=this.config?.[t],a=Array.isArray(s)?s:"string"==typeof s&&s?[s]:[];return this._entityInput({label:e,hint:n,domains:r,value:String(a[i]??""),dataKey:`${t}.${i}`,listId:`${this.idPrefix}-${t}-${i}`,onChange:e=>this._updateList(t,i,e)})}_entityInput({label:e,hint:t,domains:i,value:n,dataKey:r,listId:s,onChange:a}){return $i("ha-entity-picker")?H`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${n}"
          .label="${e}"
          .helper="${t}"
          .includeDomains="${i.length?i:void 0}"
          data-key="${r}"
          allow-custom-entity
          @value-changed="${e=>{e.stopPropagation(),a(e.detail?.value??"")}}"
        ></ha-entity-picker>
      `:H`
      <label
        >${e}
        <input
          type="text"
          list="${s}"
          data-key="${r}"
          .value="${n}"
          placeholder="${"Entity auswählen …"}"
          @input="${e=>a(e.target.value)}"
          @change="${e=>a(e.target.value)}"
        />
        <datalist id="${s}">
          ${this._entityOptions(i).map(e=>H`<option value="${e}"></option>`)}
        </datalist>
        ${t?H`<small>${t}</small>`:G}
      </label>
    `}_updateList(e,t,i){const n=this.config?.[e],r=Array.isArray(n)?[...n]:"string"==typeof n&&n?[n]:[];for(;r.length<=t;)r.push("");for(r[t]=i;r.length&&!r[r.length-1];)r.pop();this.update({[e]:r.length?r:void 0})}vorschlag(e,t){return t&&Object.keys(t).length?H`<button
      type="button"
      class="vorschlag"
      data-vorschlag="${Object.keys(t).join(",")}"
      @click="${()=>this.update(t)}"
    >
      ↳ ${e}
    </button>`:G}icon(e,t,i=""){return $i("ha-icon-picker")?H`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(t))}"
          .label="${e}"
          .helper="${i}"
          data-key="${t}"
          @value-changed="${e=>{e.stopPropagation(),this.update({[t]:e.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(e,t,i,"mdi:lightbulb")}select(e,t,i,n){const r=this.config?.[t]??n;return H`
      <div class="row">
        <span class="row-label">${e}</span>
        <select data-key="${t}" @change="${e=>this.update({[t]:e.target.value})}">
          ${i.map(([e,t])=>H`<option value="${e}" ?selected="${String(r)===String(e)}">${t}</option>`)}
        </select>
      </div>
    `}slider(e,t,i,n,r="%",s=1,{anzeige:a=e=>e,zurueck:o=e=>e}={}){const l=this.val(t),c=null==l||""===l?o(i):l,d=a(Number(c));return H`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="range"
          min="${i}"
          max="${n}"
          step="${s}"
          data-key="${t}"
          .value="${String(d)}"
          @input="${e=>this._gedrosselt(t,o(parseFloat(e.target.value)))}"
          @change="${e=>this._gedrosselt(t,o(parseFloat(e.target.value)),!0)}"
        />
        <span class="row-val">${(e=>{const t=Number(e);if(!isFinite(t))return String(e??"");const i=Math.round(10*t)/10;return String(i).replace(".",",")})(d)}${r}</span>
      </div>
    `}_gedrosselt(e,t,i=!1){const n=vn._drossel||={},r=`${this.idPrefix}:${e}`,s=n[r]||={zuletzt:0,timer:null,wert:null};s.wert=t;const a=Date.now(),o=()=>{s.zuletzt=Date.now(),s.timer=null,this.update({[e]:s.wert})};clearTimeout(s.timer),i||a-s.zuletzt>=80?o():s.timer=setTimeout(o,80-(a-s.zuletzt))}toggle(e,t,i){const n=this.config?.[t]??i;return H`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${n}"
          .checked="${!!n}"
          @change="${e=>this.update({[t]:e.target.checked})}"
        />
      </div>
    `}}const kn=(e,t,i=!1)=>H`
  <details class="section" ?open="${i}">
    <summary>${e}</summary>
    <div class="section-body">${t}</div>
  </details>
`,wn={pflicht:"Grunddaten",anaus:"Ein / Aus",anzeige:"Anzeige",optik:"Aussehen"},yn=(e,t)=>t===G||null==t?G:H`<div class="abschnitt" data-abschnitt="${e}">
        <div class="abschnitt-titel">${wn[e]||e}</div>
        ${t}
      </div>`,$n=(...e)=>H`
  <details class="section advanced" data-abschnitt="erweitert">
    <summary>Erweitert</summary>
    <div class="section-body">${e}</div>
  </details>
`,xn=(e,t)=>t===G?G:H`<div class="gruppe"><div class="gruppe-titel">${e}</div>${t}</div>`,zn=a`
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
  /* Limit überschritten (Iteration 16, Freifeld mit mehr als 8 Einträgen) */
  .limit-warnung {
    padding: 8px 10px;
    border-radius: 8px;
    border: 2px solid var(--warning-color, #ff9800);
    background: rgba(255, 152, 0, 0.1);
    color: var(--primary-text-color, #111);
    font-size: 13px;
    font-weight: 600;
    line-height: 1.4;
  }
  /* Kiosk-Modus (Iteration 15) — ganz oben im Editor */
  /* Kopfzeile des Editors (Iteration 17): Ansicht + Kiosk nebeneinander,
     auf schmalen Editoren untereinander */
  .kopf-reihe {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: stretch;
  }
  .kopf-reihe > * {
    flex: 1 1 220px;
    min-width: 0;
  }
  .ansicht-block {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ansicht-block.mini {
    border-color: var(--primary-color, #03a9f4);
  }
  .ansicht-titel {
    font-size: 17px;
    font-weight: 800;
  }
  .ansicht-wahl {
    display: inline-flex;
    align-self: flex-start;
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 10px;
    overflow: hidden;
  }
  .ansicht-knopf {
    padding: 8px 18px;
    border: none;
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  .ansicht-knopf + .ansicht-knopf {
    border-left: 1px solid var(--divider-color, #ccc);
  }
  .ansicht-knopf.aktiv {
    background: var(--primary-color, #03a9f4);
    color: var(--text-primary-color, #fff);
  }
  /* Positionen der Becken-Teile für Voll / Mini (Iteration 20) */
  .teile-pos {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    padding: 6px 0;
  }
  .teil-reset {
    display: block;
    margin: 4px 0 6px;
    padding: 6px 12px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    cursor: pointer;
  }
  /* "In Mini anzeigen" je Kasten (Iteration 17) */
  .mini-wahl {
    text-align: left;
    border: 1.5px dashed var(--primary-color, #03a9f4);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .mini-wahl-titel {
    font-weight: 800;
  }
  .mini-wahl-werte {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 4px 16px;
  }
  .mini-wahl-zeile {
    display: inline-flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    align-items: center;
    gap: 6px;
    font-weight: 400;
    cursor: pointer;
  }
  .mini-wahl-warnung {
    color: var(--warning-color, #ff9800);
    font-weight: 600;
    font-size: 0.9em;
  }
  .kiosk-block {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .kiosk-block.an {
    border-color: var(--warning-color, #ff9800);
  }
  .kiosk-schalter {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    align-items: center;
    gap: 12px;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
  }
  .kiosk-schalter input {
    width: 26px;
    height: 26px;
    margin: 0;
  }
  .kiosk-liste {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 4px;
  }
  .kiosk-kasten {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    text-align: left;
    font-weight: 400;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }
  /* Modus-Zuordnung je Gerätewert (Iteration 19) */
  .modus-zeilen {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .modus-zeile {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1.3fr);
    align-items: center;
    gap: 4px 8px;
    padding: 4px 8px;
    border-radius: 8px;
    border-left: 4px solid var(--success-color, #2e7d32);
    background: rgba(127, 127, 127, 0.08);
  }
  .modus-zeile.nein {
    border-left-color: var(--error-color, #c62828);
    background: rgba(198, 40, 40, 0.1);
  }
  .modus-zeile.klar {
    border-left-color: var(--info-color, #039be5);
  }
  .oder-einzeln {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-left: 10px;
    border-left: 2px dashed var(--divider-color, #ccc);
  }
  .modus-zeile.nein .modus-wert {
    color: var(--error-color, #c62828);
  }
  .modus-wert {
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .modus-zeile select {
    min-width: 0;
    width: 100%;
  }
  .modus-name {
    grid-column: 1 / -1;
  }
  /* Modus-Erkennung live (Iteration 14) */
  .modus-befund {
    padding: 8px 10px;
    border-radius: 8px;
    border: 1px solid var(--divider-color, rgba(127, 127, 127, 0.4));
    font-size: 0.95em;
  }
  .modus-befund.ok {
    border-color: var(--success-color, #43a047);
  }
  .modus-befund.nein {
    border-color: var(--error-color, #db4437);
  }
  .modus-optionen ul {
    margin: 4px 0 0;
    padding-left: 18px;
  }
  .modus-optionen li.nein {
    color: var(--error-color, #db4437);
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
  .add-btn.klein {
    padding: 6px 12px;
    font-size: 13px;
  }

  /* ---------------- Iteration 23: Akkordeon-Editor ---------------- */

  .editor {
    gap: 8px;
  }
  .block-titel {
    font-size: 15px;
    font-weight: 800;
  }
  /* Darstellung: der globale Block ganz oben */
  .darstellung {
    text-align: left;
    border: 2px solid var(--divider-color, #ccc);
    border-radius: 12px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .darstellung.mini {
    border-color: var(--primary-color, #03a9f4);
  }
  .darstellung .ansicht-block {
    border: none;
    padding: 0;
    gap: 6px;
  }
  /* Ein Kasten = eine Zeile, bis man ihn aufklappt */
  .slot-block.kasten,
  .kiosk-block.slot-block {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    border: 1px solid var(--divider-color, #ccc);
    border-left: 5px solid var(--slot-farbe, var(--divider-color, #ccc));
    border-radius: 10px;
    background: rgba(127, 127, 127, 0.04);
    background: color-mix(in srgb, var(--slot-farbe, transparent) 7%, transparent);
    gap: 0;
  }
  .kasten-kopf {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: 44px;
    padding: 0 6px 0 0;
  }
  .kasten-auf {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border: none;
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    text-align: left;
    cursor: pointer;
  }
  .kasten-auf .slot-ueberschrift,
  .kasten-auf .eintrag-titel {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.25;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .kasten-auf .eintrag-titel {
    font-size: 13px;
    font-weight: 600;
  }
  /* Kopf: Nummer · Name, Typ klein in Kennfarbe (Iteration 24) */
  .kasten-auf .slot-ueberschrift {
    display: flex;
    align-items: baseline;
    gap: 6px;
    min-width: 0;
  }
  .kasten-nr {
    flex: none;
    color: var(--secondary-text-color, #888);
  }
  .kasten-nr::after {
    content: " ·";
  }
  .kasten-name {
    flex: 0 0 auto;
    max-width: 100%;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .kasten-typ {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 12px;
    font-weight: 700;
    padding: 1px 6px;
    border-radius: 8px;
    color: var(--slot-farbe, var(--secondary-text-color, #888));
    border: 1px solid var(--slot-farbe, var(--divider-color, #ccc));
  }
  .typ-zeile select {
    flex: 0 1 auto;
    min-width: 0;
    padding: 4px 6px;
  }
  .pfeil {
    flex: none;
    font-size: 10px;
    color: var(--slot-farbe, var(--secondary-text-color, #888));
    transition: transform 0.15s;
  }
  .pfeil.auf {
    transform: rotate(90deg);
  }
  .kasten-knoepfe {
    display: flex;
    gap: 3px;
    flex: none;
  }
  .kasten-knoepfe .icon-btn {
    min-width: 30px;
    height: 30px;
    font-size: 14px;
    padding: 0;
  }
  .icon-btn[disabled] {
    opacity: 0.3;
    cursor: default;
  }
  .kasten-body {
    padding: 4px 12px 12px;
  }
  .slot-block.kasten .slot-card {
    border: none;
    border-radius: 0;
    background: none;
    padding: 4px 12px 12px;
  }
  .loesch-frage {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin: 0 10px 10px;
    padding: 8px 10px;
    border-radius: 8px;
    border: 1.5px solid var(--error-color, #d32f2f);
    font-size: 13px;
    font-weight: 600;
  }
  .loesch-frage span {
    flex: 1 1 100%;
  }
  .knopf-gefahr,
  .knopf-leise {
    padding: 6px 14px;
    border-radius: 8px;
    font: inherit;
    font-weight: 700;
    cursor: pointer;
  }
  .knopf-gefahr {
    border: 1px solid var(--error-color, #d32f2f);
    background: var(--error-color, #d32f2f);
    color: #fff;
  }
  .knopf-leise {
    border: 1px solid var(--divider-color, #ccc);
    background: transparent;
    color: var(--primary-text-color, #111);
  }
  /* Abschnitte im Kasten: Grunddaten -> Ein/Aus -> Anzeige -> Aussehen */
  .abschnitt {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .abschnitt-titel,
  .gruppe-titel {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: var(--secondary-text-color, #888);
    margin-top: 4px;
  }
  .gruppe {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-bottom: 6px;
    border-bottom: 1px dashed var(--divider-color, #ccc);
  }
  .gruppe:last-child {
    border-bottom: none;
  }
  .unter-gruppe {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .unter-titel {
    font-size: 13px;
    font-weight: 600;
  }
  .haken-reihe {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 16px;
  }
  label.haken {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
    font-weight: 400;
    cursor: pointer;
  }
  .vorschlag {
    align-self: flex-start;
    margin-top: -4px;
    padding: 4px 10px;
    border-radius: 14px;
    border: 1px dashed var(--primary-color, #03a9f4);
    background: transparent;
    color: var(--primary-color, #03a9f4);
    font: inherit;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    text-align: left;
    overflow-wrap: anywhere;
  }
  .getrennt {
    margin-top: -4px;
  }
  .stufen-namen input {
    width: 3.6em;
    flex: none;
  }
  /* Neu-Anlage: Typ-Kacheln mit Gerätebild */
  .typ-wahl {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    border: 2px dashed var(--primary-color, #03a9f4);
    border-radius: 12px;
  }
  .typ-kacheln {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(104px, 1fr));
    gap: 8px;
  }
  .typ-kachel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    min-height: 92px;
    padding: 8px 6px;
    border-radius: 10px;
    border: 1px solid var(--divider-color, #ccc);
    border-bottom: 4px solid var(--slot-farbe, var(--divider-color, #ccc));
    background: transparent;
    color: var(--primary-text-color, #111);
    font: inherit;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }
  .typ-kachel:hover {
    background: rgba(127, 127, 127, 0.1);
  }
  .typ-kachel img {
    height: 48px;
    max-width: 100%;
    object-fit: contain;
  }
  .typ-kachel ha-icon {
    --mdc-icon-size: 40px;
    color: var(--slot-farbe);
  }
  /* Freifeld-Einträge */
  .eintraege {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .eintrag {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 8px;
  }
  .eintrag-kopf {
    min-height: 36px;
  }
  .eintrag-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 4px 10px 10px;
  }
  .kiosk-block.slot-block {
    padding: 0;
  }
  .kiosk-block.slot-block.an {
    border-color: var(--warning-color, #ff9800);
  }
  .kiosk-kopf,
  .kiosk-block .kasten-kopf {
    gap: 8px;
  }
  .kiosk-block .kiosk-schalter {
    font-size: 14px;
    gap: 6px;
  }
  .kiosk-block .kiosk-schalter input {
    width: 22px;
    height: 22px;
  }
  .kiosk-block .kasten-body {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .kiosk-block .kasten-body[hidden],
  .kasten-body[hidden],
  .eintrag-body[hidden] {
    display: none;
  }
  .hinweise {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-weight: 500;
  }
`,Sn=(e={},t,i=null)=>{const n=e||{};if("hidden"===t||"hidden"===String(n.type||""))return{...n,type:t};const r=ct(n),s=i?{...i}:{};delete s.label_text,delete s.title;const a={...s,type:t};return n.id?a.id=n.id:delete a.id,r?a.label=r:delete a.label,!0===n.mini_hidden?a.mini_hidden=!0:delete a.mini_hidden,a},An=["switch","input_boolean","light"],Bn=["sensor","input_number"],En=["sensor","input_number","number"],Tn=["climate","number","input_number"],Mn=["climate","sensor","input_number","number"],Cn=["sensor","select","input_select","climate"],Pn=["switch","input_boolean","binary_sensor"],On=["sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate","input_select","select","cover","script","fan"],Wn=(e,t=!0,i="Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung.")=>H`
  ${e.toggle("Vor dem Ausschalten nachfragen","confirm_off",t)}
  <small>${i}</small>
`,Kn=(e,t,i)=>H`
  <label class="label-feld"
    >${t}
    <input
      type="text"
      data-key="label"
      .value="${ct(e.config)}"
      placeholder="${i}"
      @input="${t=>e.update({label:t.target.value||void 0,label_text:void 0,title:void 0})}"
    />
  </label>
`,Ln=(e,t)=>!!t&&!!e.hass?.states?.[t],Nn=(e,t,i)=>{const n=((e,t)=>{const i=e.config?.[t];if(!i||e.config?.power_entity)return null;const n=String(i).split(".")[1]||"",r=[n,n.replace(/_(schalter|switch|haupt|main|steckdose|relay|relais|plug)$/i,"")];for(const t of r)for(const i of["sensor","input_number"])for(const n of["_power","_leistung","_watt","_current_power","_power_consumption"])if(Ln(e,`${i}.${t}${n}`))return`${i}.${t}${n}`;return null})(e,t);return H`
    ${e.entity("Stromverbrauch","power_entity",i,...Bn)}
    ${n?e.vorschlag(`${n} übernehmen`,{power_entity:n}):G}
  `},Rn=(e,t,i,n,r)=>{if(!e.shown(n,r))return G;const s="mini"===e.teilePos,a=e=>`${s?"mini_":""}${i}_${e}`,o=["top","left","size"].some(t=>""!==e.raw(`mini_${i}_${t}`));return H`
    <div class="unter-gruppe" data-teil="${i}" data-teil-pos="${s?"mini":"voll"}">
      <div class="unter-titel">${t} (${s?"Mini":"Voll"})</div>
      ${e.slider("Größe",a("size"),2,40,"%",.5)}
      ${e.slider("Von links",a("left"),0,100,"%",.5)}
      ${e.slider("Von oben",a("top"),0,100,"%",.5)}
      ${s&&o?H`<button
            type="button"
            class="teil-reset"
            data-teil-reset="${i}"
            @click="${()=>e.update({[`mini_${i}_top`]:void 0,[`mini_${i}_left`]:void 0,[`mini_${i}_size`]:void 0})}"
          >
            Mini-Werte zurücksetzen (wie Voll)
          </button>`:G}
    </div>
  `},In=e=>e.setTeilePos?H`<div class="teile-pos" role="group" aria-label="Positionen für">
        <span class="row-label">Positionen der Becken-Teile für</span>
        <div class="ansicht-wahl">
          ${["voll","mini"].map(t=>H`<button
              type="button"
              class="ansicht-knopf ${e.teilePos===t?"aktiv":""}"
              data-teile-pos="${t}"
              aria-pressed="${e.teilePos===t?"true":"false"}"
              @click="${()=>e.setTeilePos(t)}"
            >
              ${"voll"===t?"Voll":"Mini"}
            </button>`)}
        </div>
      </div>`:G,Fn=(e,t={})=>{const i=t.mode_entity,n=i?e?.states?.[i]:null;if(!n)return null;const r=String(t.mode_attribute||"").trim(),s=r?n.attributes?.[r]:n.state,a=n.attributes||{},o=Array.isArray(a.options)?a.options:"preset_mode"===r&&Array.isArray(a.preset_modes)?a.preset_modes:!r&&Array.isArray(a.hvac_modes)?a.hvac_modes:[],l=Qt(s,t);return{roh:s??"",modus:l,klartext:!l&&ei(s)?ti(s):"",optionen:o.map(e=>({wert:String(e),modus:Qt(e,t)}))}},Dn=(e,t)=>{const i=String(t).toLowerCase();return Object.fromEntries(Object.entries(e||{}).filter(([e])=>e.toLowerCase()!==i))},Hn=e=>{const t=e.config||{},i=Fn(e.hass,t),n=i?H`<div class="modus-befund ${i.modus||i.klartext?"ok":"nein"}">
        Meldet gerade <b>${String(i.roh)||"—"}</b> →
        ${i.modus?H`<b>${i.modus.label}</b> ✓`:i.klartext?H`<b>${i.klartext}</b> ✓ <small>(ohne Stufe — Rad im normalen Tempo)</small>`:H`nicht zugeordnet ✗`}
      </div>`:H`<div class="modus-befund">Erst die Modus-Entity wählen.</div>`,r=((e,t={})=>{const i=Fn(e,t);return i&&i.optionen.length?i.optionen.map(({wert:e})=>{const i=Qt(e,(e=>{const t={...e||{}};return delete t.mode_map,t})(t)),n=Vt(e,t),r=void 0!==n?n?.key||"":i?.key||"";return{wert:e,auto:i?.key||"",aktuell:r,name:String(t.mode_names?.[e]??""),klartext:!r&&ei(e)?ti(e):""}}):[]})(e.hass,t),s=r.length?H`<div class="modus-zeilen">
        ${r.map(i=>H`<div
            class="modus-zeile ${i.aktuell?"ok":i.klartext?"klar":"nein"}"
            data-modus-wert="${i.wert}"
            title="${i.klartext?`Card zeigt „${i.klartext}“`:""}"
          >
            <span class="modus-wert">${i.wert}</span>
            <span class="modus-pfeil">→</span>
            <select
              data-modus-select="${i.wert}"
              @change="${n=>((i,n,r)=>{const s=Dn(t.mode_map,i);r!==n&&(s[i]=r);const a={mode_map:Object.keys(s).length?s:void 0};if(r){const e=Dn(t.mode_names,i);a.mode_names=Object.keys(e).length?e:void 0}e.update(a)})(i.wert,i.auto,n.target.value)}"
            >
              <option value="" ?selected="${!i.aktuell}">— nicht zuordnen —</option>
              ${Ft.map(e=>H`<option value="${e.key}" ?selected="${i.aktuell===e.key}">${e.label}</option>`)}
            </select>
            ${i.aktuell?G:H`<input
                  type="text"
                  class="modus-name"
                  data-modus-name="${i.wert}"
                  .value="${i.name}"
                  placeholder="Anzeigename (sonst „${i.klartext||i.wert}“)"
                  @change="${n=>((i,n)=>{const r=Dn(t.mode_names,i);String(n).trim()&&(r[i]=String(n).trim()),e.update({mode_names:Object.keys(r).length?r:void 0})})(i.wert,n.target.value)}"
                />`}
          </div>`)}
      </div>`:H`${Ft.map(i=>{const n=`mode_map_${i.key}`,r=i.zustaende.join(", "),s=t[n],a=Array.isArray(s)?s.join(", "):String(s??"").trim()?String(s):r;return H`<label
            >${i.label}
            <input
              type="text"
              data-key="${n}"
              .value="${a}"
              @change="${t=>{const i=t.target.value.trim();e.update({[n]:i&&i!==r?i:void 0})}}"
            />
          </label>`})}
        <small>Kommaliste der Gerätezustände je Modus. Leeren = Vorgabe.</small>`;return kn("Modus-Zuordnung",H`${n} ${s}`,!(!i||i.modus||i.klartext||""===String(i.roh)||["unknown","unavailable"].includes(String(i.roh))))},jn=e=>{const t=String(e.raw("target_entity")),i=String(e.raw("current_entity")),n=!!t&&t===i;return H`
    ${e._entityInput({label:"Klima-Entity (Soll + Ist)",hint:"climate.* der Wärmepumpe — füllt Soll- und Ist-Temperatur in einem.",domains:["climate"],value:n?t:"",dataKey:"klima",listId:`${e.idPrefix}-klima`,onChange:t=>e.update({target_entity:t||void 0,current_entity:t||void 0})})}
    <div class="oder-einzeln" data-oder-einzeln>
      <div class="unter-titel">oder einzeln (ohne Klima-Entity)</div>
      ${e.entity("Soll-Temperatur","target_entity","number.* oder input_number.* — mit +/−.",...Tn)}
      ${e.entity("Ist-Temperatur","current_entity","sensor.*, input_number.* oder number.*.",...Mn)}
    </div>
  `},Gn=e=>{const t=e.hass?.states?.[e.config?.target_entity],i=t?"climate"===we(e.config.target_entity)?pe(t.attributes?.target_temp_step)??.5:pe(t.attributes?.step)??.5:null,n=e.config?.target_step,r=null==n||""===n;return H`
    <div class="row">
      <span class="row-label">Schrittweite +/−</span>
      <select
        data-key="target_step"
        @change="${t=>e.update({target_step:"auto"===t.target.value?void 0:Number(t.target.value)})}"
      >
        <option value="auto" ?selected="${r}">
          Automatisch${null!==i?` (aus der Entity: ${String(i).replace(".",",")})`:""}
        </option>
        ${[.1,.2,.5,1].map(e=>H`<option value="${e}" ?selected="${!r&&Number(n)===e}">
              ${String(e).replace(".",",")} °C
            </option>`)}
      </select>
    </div>
  `},Un=[["gray","Grau + stehend"],["hidden","Ausblenden"]],Zn=e=>{const t=e.config||{},i=(e=>{const t=Kt(e.config),i=t[0];if(!i)return{};const n=/^(.*?)(\d)$/.exec(i);if(!n||"1"!==n[2])return{};const r=n[1],s={},a=[...t];for(const[t,i]of[[1,"2"],[2,"3"]])!a[t]&&a.length===t&&Ln(e,r+i)&&(a[t]=r+i);if(a.length!==t.length&&(s.stage_entities=a),!e.config?.stop_entity){const t=r.replace(/_?n$/i,""),i=[r+"stopp",r+"stop",`${t}_stopp`,`${t}_stop`,r+"0"].find(t=>Ln(e,t));i&&(s.stop_entity=i)}return s})(e),n=!!t.power_entity&&!1!==e.val("stage_from_power"),r=Array.isArray(t.stage_labels)?t.stage_labels:[],s=[...(i.stage_entities||[]).slice(Kt(t).length),i.stop_entity].filter(Boolean).join(" · ");return{pflicht:H`
      ${e.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
      ${e.entityAt("Stufe N1","stage_entities",0,"",...An)}
      ${s?e.vorschlag(`übernehmen: ${s}`,i):G}
      ${e.entityAt("Stufe N2 (optional)","stage_entities",1,"",...An)}
      ${e.entityAt("Stufe N3 (optional)","stage_entities",2,"",...An)}
      ${e.entity("STOP","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...An)}
    `,anaus:H`
      ${e.entity("Hauptschalter (Powerbutton)","main_entity","Steckdose/Relais der Pumpe.",...An)}
      ${t.main_entity?Wn(e):G}
    `,anzeige:H`
      ${Nn(e,"main_entity","W oder kW.")}
      ${t.power_entity?H`${e.toggle("Stufe aus Leistung erkennen","stage_from_power",!0)}
            <small
              >Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon nichts — die
              Leistung schon. Die erkannte Stufe leuchtet; die Taster bleiben bedienbar.</small
            >`:G}
      ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...En)}
    `,optik:H`
      <div class="row stufen-namen">
        <span class="row-label">Beschriftung der Taster</span>
        ${[0,1,2].map(t=>H`<input
            type="text"
            data-key="stage_labels.${t}"
            .value="${String(r[t]||"")}"
            placeholder="N${t+1}"
            @input="${i=>((t,i)=>{const n=[0,1,2].map(e=>e===t?i:r[e]||"");for(;n.length&&!n[n.length-1];)n.pop();e.update({stage_labels:n.length?n:void 0})})(t,i.target.value)}"
          />`)}
      </div>
    `,erweitert:[n?xn("Stufe aus Leistung — Schwellen",H`
              ${e.slider("N1 ab mehr als","stage_watt_1",0,300," W",1)}
              ${e.slider("N2 ab mehr als","stage_watt_2",0,1500," W",5)}
              ${e.slider("N3 ab mehr als","stage_watt_3",0,3e3," W",5)}
              <small>Unter der N1-Schwelle gilt die Pumpe als aus.</small>
            `):xn("Wann steht die Pumpe?",H`
              ${e.slider("Ruhewatt","idle_watt",0,200," W",1)}
              <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).</small>
            `),xn("Laufrad — Tempo",H`
          ${e.slider("Tempo N1","fan_speed_1",1,Ot,"",1)}
          ${e.slider("Tempo N2","fan_speed_2",1,Ot,"",1)}
          ${e.slider("Tempo N3","fan_speed_3",1,Ot,"",1)}
          <small>1 = langsam, 10 = schnell.</small>
          ${e.select("Bei Stillstand","fan_inactive",Un,"gray")}
        `),xn("Position und Größe",H`
          ${e.slider("Powerbutton — Größe","power_btn_scale",50,200)}
          ${e.slider("Powerbutton — von oben","power_btn_top",0,100)}
          ${e.slider("Powerbutton — von links","power_btn_left",0,100)}
          ${e.slider("Watt — von unten","power_bottom",0,100)}
          ${e.slider("Watt — von links","power_left",0,100)}
          ${e.slider("Watt — Größe","power_scale",50,150)}
          ${e.slider("Thermometer — von oben","temp_top",0,100)}
          ${e.slider("Thermometer — von links","temp_left",0,100)}
          ${e.slider("Thermometer — Größe","temp_scale",50,200)}
          ${e.slider("Laufrad — von oben","fan_top",0,100,"%",.5)}
          ${e.slider("Laufrad — von links","fan_left",0,100,"%",.5)}
          ${e.slider("Laufrad — Größe","fan_size",3,60,"%",.5)}
          <small>Die Vorgaben sind am Bild vermessen. Das Laufrad bleibt immer kreisrund.</small>
        `),xn("Kästchen",H`<div class="haken-reihe">
          ${e.zeigen("Watt mit Box","power_box")} ${e.zeigen("Watt mit Einheit","power_label")}
        </div>`),xn("Ausblenden",H`<div class="haken-reihe">
          ${e.zeigen("Stufen-Taster","show_stages")} ${e.zeigen("Powerbutton","show_power_button")}
          ${e.zeigen("Watt","show_power")} ${e.zeigen("Thermometer","show_temp")}
          ${e.zeigen("Laufrad","show_fan")}
        </div>`)]}},Vn={heatpump:It,pump:Ct,uv:hi,solar:gi},qn=[{typ:"heatpump",bild:"heatpump"},{typ:"pump",bild:"pump"},{typ:"uv",bild:"uv"},{typ:"solar",bild:"solar"},{typ:"custom",icon:"mdi:form-select"},{typ:"frame",icon:"mdi:crop-square"}],Qn={heatpump:"z.B. Wärmepumpe",pump:"z.B. Poolpumpe",uv:"z.B. UV-C-Lampe",solar:"z.B. Solarheizung",custom:"z.B. Poolschalter",frame:"z.B. Platzhalter"},Xn=(e,t)=>{const i={...e||{}};for(const[e,n]of Object.entries(t||{}))void 0===n?delete i[e]:i[e]=n;return i};class Jn extends oe{static properties={hass:{attribute:!1},_config:{state:!0},_teilePos:{state:!0},_offen:{state:!0},_typWahl:{state:!0},_loeschFrage:{state:!0},_eintragOffen:{state:!0},_kioskOffen:{state:!0}};constructor(){super(),this._typWahl=!1,this._loeschFrage=null,this._eintragOffen=new Set,this._kioskOffen=!1,this._typStash={}}connectedCallback(){super.connectedCallback(),(yi()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(wi||(wi=(async()=>{try{const e=await window.loadCardHelpers(),t=await(e?.createCardElement?.({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",e?.message||e)}return yi()})()),wi)).then(e=>{e&&this.requestUpdate()})}setConfig(e){this._config={version:1,hero:{enabled:!0,shape:Se},frame:{enabled:!0,fill:"transparent"},slots:[],...e||{}},void 0===this._offen&&(this._offen=new Set(((e={})=>!(Array.isArray(e.slots)&&e.slots.length||["temp_entity","ph_entity","rx_entity","inlet_temp_entity"].some(t=>e.hero?.[t])))(this._config)?["becken"]:[]))}updated(e){if(super.updated?.(e),!this._scrollZiel)return;const t=this.renderRoot?.querySelector?.(this._scrollZiel);this._scrollZiel=null,"function"==typeof t?.scrollIntoView&&t.scrollIntoView({block:"start",behavior:"smooth"})}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_updateHero(e){this._emit({...this._config,hero:Xn(this._config.hero,e)})}_updateFrame(e){this._emit({...this._config,frame:Xn(this._config.frame,e)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_istOffen(e){return!0===this._offen?.has(String(e))}_umschalten(e){const t=new Set(this._offen);t.has(String(e))?t.delete(String(e)):t.add(String(e)),this._offen=t}_offenUmrechnen(e){const t=new Set;for(const i of this._offen||[]){if(!/^\d+$/.test(i)){t.add(i);continue}const n=e(Number(i));null!==n&&t.add(String(n))}this._offen=t,this._eintragOffen=new Set([...this._eintragOffen].map(t=>{const[i,n]=t.split(":").map(Number),r=e(i);return null===r?null:`${r}:${n}`}).filter(Boolean))}_setAnsicht(e){Wi(this._config)!==e&&this._emit(Xn(this._config,{view:"mini"===e?"mini":void 0}))}_renderDarstellung(e){const t="mini"===Wi(this._config),i=(e,i)=>H`<button
      type="button"
      class="ansicht-knopf ${"mini"===e===t?"aktiv":""}"
      data-ansicht="${e}"
      aria-pressed="${"mini"===e===t?"true":"false"}"
      @click="${()=>this._setAnsicht(e)}"
    >
      ${i}
    </button>`;return H`
      <div class="darstellung ${t?"mini":""}" data-block="darstellung">
        <div class="block-titel">Darstellung</div>
        <div class="row">
          <span class="row-label">Ansicht</span>
          <div class="ansicht-wahl" role="group" aria-label="Ansicht">
            ${i("voll","Voll")} ${i("mini","Mini")}
          </div>
        </div>
        ${e.toggle("Rahmen um die Kästen","enabled",!0)}
        ${e.select("Füllung","fill",[["transparent","Transparent (Theme)"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        ${t?H`<div class="ansicht-block mini">
              <div class="row">
                <span class="row-label">Kachel-Hintergrund</span>
                <select
                  data-key="mini_tile_fill"
                  @change="${e=>this._emit(Xn(this._config,{mini_tile_fill:"schwarz"===e.target.value?void 0:e.target.value}))}"
                >
                  ${Ni.map(([e,t])=>H`<option value="${e}" ?selected="${Ri(this._config)===e}">${t}</option>`)}
                </select>
              </div>
              <div class="row">
                <span class="row-label">Außen-Hintergrund</span>
                <select
                  data-key="mini_card_fill"
                  @change="${e=>this._emit(Xn(this._config,{mini_card_fill:"theme"===e.target.value?void 0:e.target.value}))}"
                >
                  ${Ii.map(([e,t])=>H`<option value="${e}" ?selected="${Fi(this._config)===e}">${t}</option>`)}
                </select>
              </div>
            </div>`:G}
        <small>
          ${t?"Mini: die ganze Anlage kompakt — Becken oben, Geräte als Kacheln; Tipp öffnet den vollen Kasten.":"Die Füllung gilt für jeden Kasten: Hintergrund, Kästchen, Knöpfe und Schrift. Transparent = Theme."}
        </small>
      </div>
    `}_renderMiniWahl(e,t,i){if("mini"!==Wi(this._config))return G;const n=String(t||"").toLowerCase();if("hero"!==n&&!Ki.includes(n))return G;const r=nn(e||{},n),s="hero"!==n&&!0===e?.mini_hidden;return H`
      <div class="mini-wahl" data-mini-wahl="${n}">
        <div class="mini-wahl-titel">In Mini anzeigen</div>
        ${"hero"===n?G:H`<label class="mini-wahl-zeile">
              <input
                type="checkbox"
                data-mini-hidden
                .checked="${!s}"
                @change="${e=>i({mini_hidden:!e.target.checked||void 0})}"
              />
              <span>Als Kachel zeigen</span>
            </label>`}
        ${s?G:H`
              <div class="mini-wahl-werte">
                ${r.verfuegbar.map(([e,t])=>H`<label class="mini-wahl-zeile">
                    <input
                      type="checkbox"
                      data-mini-show="${e}"
                      .checked="${r.gewaehlt.includes(e)}"
                      @change="${t=>((e,t)=>{const n=r.verfuegbar.map(([e])=>e).filter(i=>i===e?t:r.gewaehlt.includes(i)),s=n.length===r.standard.length&&n.every((e,t)=>e===r.standard[t]);i({mini_show:s?void 0:n})})(e,t.target.checked)}"
                    />
                    <span>${t}</span>
                  </label>`)}
              </div>
              ${0===r.verfuegbar.length?H`<small>Noch keine Werte — erst die Entities wählen.</small>`:G}
            `}
      </div>
    `}_setKiosk(e){e&&(this._kioskOffen=!0),this._emit(Xn(this._config,e?{kiosk:!0}:{kiosk:void 0,kiosk_slots:void 0}))}_setKioskKasten(e,t){const i=Mt(this._config),n=this._slotsMitIds(i,e),r={...i,slots:n,kiosk:!0},s=Et(r),a=null===e?xt:Bt(n[e],e+1),o=s.filter(e=>String(e)===String(a)?t:Tt(r,e,"string"==typeof e?n.find(t=>t.id===e):null));this._emit(Xn({...i,slots:n},{kiosk_slots:o.length===s.length?void 0:o}))}_slotsMitIds(e,t=void 0){const i=(Array.isArray(e.slots)?e.slots:[]).map(e=>({...e||{}})),n=i.map(e=>e.id).filter(Boolean);return i.forEach((e,i)=>{e.id||"hidden"===String(e.type||"frame")||null!=t&&i!==t||(e.id=At(n),n.push(e.id))}),i}_renderKiosk(){const e=!0===this._config?.kiosk,t=!0===this._kioskOffen,i=Et(this._config),n=this._slots();return H`
      <div class="kiosk-block slot-block ${e?"an":""}" data-block="kiosk">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="kiosk"
            aria-expanded="${t?"true":"false"}"
            @click="${()=>this._kioskOffen=!t}"
          >
            <span class="pfeil ${t?"auf":""}">▶</span>
            <span class="slot-ueberschrift">Kiosk (nur anzeigen)</span>
          </button>
          <label class="kiosk-schalter">
            <input
              type="checkbox"
              data-key="kiosk"
              .checked="${e}"
              @change="${e=>this._setKiosk(e.target.checked)}"
            />
            <span>${e?"an":"aus"}</span>
          </label>
        </div>
        <div class="kasten-body" ?hidden="${!t}">
          <small>
            Für ein Wand-Tablet o.ä.: die gewählten Kästen zeigen alles an, lassen sich aber nicht
            bedienen — kein Schalten, kein Modus-Wählen, keine Detail-Dialoge. Dieselbe Card kann
            woanders ohne Kiosk normal bedienbar stehen.
          </small>
          ${e?H`<div class="kiosk-liste">
                ${i.map(e=>{const t=e===xt?null:n.findIndex((t,i)=>Bt(t,i+1)===e),i=null===t?"Becken":this._slotKopf(n[t],t);return H`<label class="kiosk-kasten">
                    <input
                      type="checkbox"
                      data-kiosk-slot="${null===t?e:t+1}"
                      .checked="${Tt(this._config,null===t?e:t+1,null===t?null:n[t])}"
                      @change="${e=>this._setKioskKasten(t,e.target.checked)}"
                    />
                    <span>${i}</span>
                  </label>`})}
              </div>`:G}
        </div>
      </div>
    `}_updateSlot(e,t){const i=this._slots().map((i,n)=>n===e?Xn(i,t):i);this._emit({...this._config,slots:i})}_updateEntry(e,t,i){const n=this._slots()[e]||{},r=Array.isArray(n.entries)?[...n.entries]:[];for(;r.length<=t;)r.push({});r[t]=Xn(r[t],i),this._updateSlot(e,{entries:r})}_addSlot(e="frame"){const t="custom"===e?{type:"custom",entries:[{}]}:{type:e},i=this._slots().length;this._typWahl=!1,this._offen=new Set([String(i)]),this._scrollZiel=`[data-kasten="${i}"]`,"custom"===e&&(this._eintragOffen=new Set([...this._eintragOffen,`${i}:0`])),this._emit({...this._config,slots:[...this._slots(),t]})}_removeSlot(e){const t=Mt(this._config),i=t.slots?.[e]?.id,n=(t.slots||[]).filter((t,i)=>i!==e);let r=t.kiosk_slots;Array.isArray(r)&&i&&(r=r.filter(e=>String(e)!==String(i))),this._loeschFrage=null,this._offenUmrechnen(t=>t===e?null:t>e?t-1:t),this._emit(Xn({...t,slots:n},{kiosk_slots:r}))}_moveSlot(e,t){const i=Mt(this._config),n=[...i.slots||[]],r=e+t;if(r<0||r>=n.length)return;const[s]=n.splice(e,1);n.splice(r,0,s),this._offenUmrechnen(t=>t===e?r:t===r?e:t),this._emit({...i,slots:n})}_duplicateSlot(e){const t=this._slots()[e];if(!t)return;const i=JSON.parse(JSON.stringify(t));delete i.id;const n=ct(t);n&&(i.label=`${n} (Kopie)`,delete i.label_text,delete i.title);const r=[...this._slots()];r.splice(e+1,0,i),this._offenUmrechnen(t=>t>e?t+1:t),this._offen=new Set([String(e+1)]),this._scrollZiel=`[data-kasten="${e+1}"]`,this._emit({...this._config,slots:r})}_setTyp(e,t){const i=this._slots()[e]||{},n=Sn(i,t,this._typStash[`${e}:${t}`]);this._typStash[`${e}:${String(i.type||"frame")}`]=i;const r=this._slots().map((t,i)=>i===e?n:t);this._emit({...this._config,slots:r})}_eintraegeSetzen(e,t,i){i&&(this._eintragOffen=new Set(i)),this._updateSlot(e,{entries:t.length?t:void 0})}_eintragNeu(e){const t=[...this._slots()[e]?.entries||[]];t.length>=8||(t.push({}),this._eintraegeSetzen(e,t,[...this._eintragOffen,`${e}:${t.length-1}`]))}_eintragWeg(e,t){const i=[...this._slots()[e]?.entries||[]];i.splice(t,1);const n=[...this._eintragOffen].map(i=>{const[n,r]=i.split(":").map(Number);return n!==e?i:r===t?null:r>t?`${n}:${r-1}`:i}).filter(Boolean);this._eintraegeSetzen(e,i,n)}_eintragSchieben(e,t,i){const n=[...this._slots()[e]?.entries||[]],r=t+i;if(r<0||r>=n.length)return;[n[t],n[r]]=[n[r],n[t]];const s=[...this._eintragOffen].map(i=>{const[n,s]=i.split(":").map(Number);return n!==e?i:s===t?`${n}:${r}`:s===r?`${n}:${t}`:i});this._eintraegeSetzen(e,n,s)}_eintragUmschalten(e){const t=new Set(this._eintragOffen);t.has(e)?t.delete(e):t.add(e),this._eintragOffen=t}_renderEintraege(e){const t=this._slots()[e]||{},i=Array.isArray(t.entries)?t.entries:[],n={entity:"Wert",button:"Button",text:"Freitext"};return H`
      <div class="eintraege">
        ${i.map((t,r)=>{const s=`${e}:${r}`,a=this._eintragOffen.has(s),o=t?.kind||(t?.entity?"entity":t?.text?"text":"entity"),l=String(t?.label||t?.text||t?.entity||"").trim();return H`<div class="eintrag ${a?"offen":""}" data-eintrag="${r}">
            <div class="kasten-kopf eintrag-kopf">
              <button
                type="button"
                class="kasten-auf"
                data-auf="eintrag"
                aria-expanded="${a?"true":"false"}"
                @click="${()=>this._eintragUmschalten(s)}"
              >
                <span class="pfeil ${a?"auf":""}">▶</span>
                <span class="eintrag-titel">Eintrag ${r+1} · ${n[o]||o}${l?` · ${l}`:""}</span>
              </button>
              <div class="kasten-knoepfe">
                <button type="button" class="icon-btn" data-aktion="eintrag-hoch" title="nach oben" ?disabled="${0===r}" @click="${()=>this._eintragSchieben(e,r,-1)}">↑</button>
                <button type="button" class="icon-btn" data-aktion="eintrag-runter" title="nach unten" ?disabled="${r===i.length-1}" @click="${()=>this._eintragSchieben(e,r,1)}">↓</button>
                <button type="button" class="icon-btn danger" data-aktion="eintrag-weg" title="Eintrag löschen" @click="${()=>this._eintragWeg(e,r)}">✕</button>
              </div>
            </div>
            <div class="eintrag-body" ?hidden="${!a}">
              ${(e=>H`
  ${e.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===e.config?.kind?e.text("Text","text","","z.B. Sommerbetrieb"):H`
        ${e.entity("Entity","entity","",...On)}
        ${e.text("Beschriftung","label","","leer = Name der Entity")}
        ${e.icon("Icon","icon","Leer = Icon der Entity (Liste/Kacheln); klassisch nur bei Buttons.")}
        ${"button"===e.config?.kind?Wn(e,!1,"An = vor dem Ausschalten kommt eine Rückfrage."):G}
      `}
`)(new vn({hass:this.hass,config:t||{},update:t=>this._updateEntry(e,r,t),idPrefix:`slot${e}e${r}`}))}
            </div>
          </div>`})}
        ${i.length<8?H`<button type="button" class="add-btn klein" data-aktion="eintrag-neu" @click="${()=>this._eintragNeu(e)}">
              + Eintrag
            </button>`:H`<small>Höchstens ${8} Einträge je Kasten.</small>`}
      </div>
    `}_fieldsFor(e){const t=this._slots()[e]||{};return new vn({hass:this.hass,config:t,defaults:Vn[t.type]||{},update:t=>this._updateSlot(e,t),idPrefix:`slot${e}`})}_altTypOption(e){const t=De[e];return t&&!1===t.waehlbar?H`<option value="${e}" selected>${t.label}</option>`:G}_typFeld(e){const t=this._slots()[e]||{};return H`
      <div class="row typ-zeile" data-typ-zeile>
        <span class="row-label">Typ</span>
        <select data-key="type" @change="${t=>this._setTyp(e,t.target.value)}">
          ${this._altTypOption(t.type)}
          ${Ze().map(e=>e.trenner?H`<option disabled data-trenner>${e.label}</option>`:H`<option value="${e.value}" ?selected="${(t.type||"frame")===e.value}">${e.label}</option>`)}
        </select>
      </div>
    `}_typKurz(e){return(De[e?.type]?.label||De.frame.label).replace(" (benutzerdefiniert)","")}_slotKopf(e,t){const i=this._typKurz(e),n=ct(e);return`Kasten ${t+1} · ${i}${n&&n!==i?` · ${n}`:""}`}_kopfInhalt(e,t){const i=this._typKurz(e),n=ct(e);return H`<span class="kasten-nr">${t+1}</span
      ><span class="kasten-name">${n||i}</span
      >${n&&n!==i?H`<span class="kasten-typ">${i}</span>`:G}`}_teile(e){const t=this._slots()[e]||{},i=this._fieldsFor(e);switch(t.type){case"heatpump":return(e=>{const t=e.config||{},i=!!Fn(e.hass,t)?.modus;return{pflicht:jn(e),anaus:H`
      ${e.entity("Schalter (Powerbutton)","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",...An)}
      ${t.switch_entity?Wn(e):G}
    `,anzeige:H`
      ${Nn(e,"switch_entity","Leistungssensor in W oder kW (z.B. Shelly).")}
      ${e.entity("Betriebsmodus","mode_entity","sensor, select, input_select oder climate — Heizen/Kühlen/Stufe als Badge; tippen wählt den Modus.",...Cn)}
      ${t.mode_entity?e.toggle("Modus als Badge anzeigen","show_mode_badge",!0):G}
      ${e.entity("Freigabekontakt","release_entity","Potentialfreier Eingang: offen = gesperrt, geschlossen = frei. switch/input_boolean schalten (mit Rückfrage), binary_sensor ist nur Anzeige.",...Pn)}
      ${t.release_entity?e.toggle("„seit …“ unter der Freigabe","show_release_since",!1):G}
    `,optik:H`
      ${e.select("Blatt-Design","fan_design",Object.entries(st).map(([e,t])=>[e,t.label]),"klassisch")}
      ${e.select("Farbe des Rads","fan_color_mode",[["neutral","Schwarz/Weiß (wie die Schrift)"],["modus","Nach Modus: Heizen rot, Kühlen blau"]],"neutral")}
    `,erweitert:[xn("Soll-Temperatur",Gn(e)),xn("Lüfter",H`
          ${e.select("Dreht, wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
          ${e.entity("Lüfter-Entity","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
          ${e.slider("Ab Leistung","fan_power_threshold",0,2e3," W",10)}
          ${i?H`<small>Das Tempo kommt aus dem erkannten Betriebsmodus („Tempo je Modus“).</small>`:e.slider("Tempo","fan_speed",0,10,"",.5,{anzeige:e=>e/10,zurueck:e=>Math.round(10*e)})}
          ${e.select("Bei Stillstand","fan_inactive",Un,"gray")}
        `),t.mode_entity?xn("Betriebsmodus",H`
              ${e.text("Attribut","mode_attribute","Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.","z.B. preset_mode")}
              ${Hn(e)}
              ${kn("Tempo je Modus",H`
                  ${Ft.map(t=>e.slider(t.label,`mode_speed_${t.key}`,1,Ot,"",1))}
                  <small>1 = langsam, 10 = schnell — dieselbe Skala wie das Laufrad der Poolpumpe.</small>
                `)}
            `):G,xn("Position und Größe",H`
          ${e.slider("Powerbutton — Größe","power_btn_scale",50,200)}
          ${e.slider("Powerbutton — von oben","power_btn_top",0,100)}
          ${e.slider("Powerbutton — von links","power_btn_left",0,100)}
          ${e.slider("Watt — von oben","power_top",0,100)}
          ${e.slider("Watt — von links","power_left",0,100)}
          ${e.slider("Watt — Größe","power_scale",50,150)}
          ${e.slider("Ist — von unten","current_bottom",0,100)}
          ${e.slider("Ist — von links","current_left",0,100)}
          ${e.slider("Ist — Größe","current_scale",50,150)}
          ${e.slider("Soll — von unten","target_bottom",0,100)}
          ${e.slider("Soll — von links","target_left",0,100)}
          ${e.slider("Soll — Größe","target_scale",50,150)}
          ${e.slider("Freigabe — von oben","release_top",0,100,"%",.5)}
          ${e.slider("Freigabe — von links","release_left",0,100,"%",.5)}
          ${e.slider("Freigabe — Größe","release_scale",50,200)}
          ${e.slider("Modus — von oben","mode_top",0,100,"%",.5)}
          ${e.slider("Modus — von links","mode_left",0,100,"%",.5)}
          ${e.slider("Modus — Größe","mode_scale",50,200)}
          ${e.slider("Freitext — von oben","label_top",0,100)}
          ${e.slider("Freitext — von links","label_left",0,100)}
          ${e.slider("Freitext — Größe","label_scale",50,200)}
          ${e.slider("Lüfterrad — von oben","fan_top",0,100,"%",.5)}
          ${e.slider("Lüfterrad — von links","fan_left",0,100,"%",.5)}
          ${e.slider("Lüfterrad — Breite","fan_size",5,80,"%",.5)}
          ${e.slider("Lüfterrad — Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
          <small>Die Vorgaben sind am Bild vermessen — nur ändern, wenn etwas nicht passt.</small>
        `),xn("Kästchen",H`<div class="haken-reihe">
          ${e.zeigen("Watt mit Box","power_box")} ${e.zeigen("Watt mit Einheit","power_label")}
          ${e.zeigen("Ist mit Box","current_box")} ${e.zeigen("Ist mit „Ist“","current_label")}
          ${e.zeigen("Soll mit Box","target_box")} ${e.zeigen("Soll mit „Soll“","target_label")}
          ${e.zeigen("Freitext mit Box","label_box")}
        </div>`),xn("Ausblenden",H`<div class="haken-reihe">
          ${e.zeigen("Powerbutton","show_power_button")} ${e.zeigen("Watt","show_power")}
          ${e.zeigen("Ist","show_current")} ${e.zeigen("Soll","show_target")}
          ${e.zeigen("Freigabe","show_release")} ${e.zeigen("Betriebsmodus","show_mode")}
          ${e.zeigen("Lüfterrad","show_fan")}
        </div>`)]}})(i);case"pump":return Zn(i);case"uv":return(e=>{const t=e.config||{};return{anaus:H`
      ${e.entity("Schalter (Powerbutton)","switch_entity","Steckdose/Relais der Lampe.",...An)}
      ${t.switch_entity?Wn(e):G}
      <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
    `,anzeige:H`
      ${Nn(e,"switch_entity","W oder kW.")}
      ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...En)}
    `,optik:H`
      ${e.zeigen("Glühen, solange die Lampe an ist","show_glow")}
      ${e.shown("show_glow")?e.slider("Wabern / Glimmen","glow_pulse",0,300,""):G}
      ${e.slider("Größe","uv_size",30,Je)}
      ${e.slider("Drehen","rotate",0,359,"°",1)}
      ${e.toggle("Waagrecht spiegeln","mirror",!1)}
      ${e.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben aufrecht.
        Der Kasten bleibt in jeder Lage gleich groß. Wabern: 0 = ruhig, bis 100 sanft, darüber
        kräftig.
      </small>
    `,erweitert:[xn("Glühen — Lage auf dem Rohr",H`
          ${e.slider("Von oben","glow_top",0,100,"%",.5)}
          ${e.slider("Von links","glow_left",0,100,"%",.5)}
          ${e.slider("Länge","glow_size",5,100,"%",.5)}
          ${e.slider("Dicke","glow_thickness",2,60,"%",.5)}
          ${e.slider("Neigung","glow_angle",-90,90,"°",1)}
          ${e.slider("Leuchtstärke","glow_intensity",10,100)}
        `),xn("Position und Größe",H`
          ${e.slider("Powerbutton — Größe","power_btn_scale",50,200)}
          ${e.slider("Powerbutton — von oben","power_btn_top",0,100)}
          ${e.slider("Powerbutton — von links","power_btn_left",0,100)}
          ${e.slider("Watt — von unten","power_bottom",0,100)}
          ${e.slider("Watt — von links","power_left",0,100)}
          ${e.slider("Watt — Größe","power_scale",50,150)}
          ${e.slider("Thermometer — von oben","temp_top",0,100)}
          ${e.slider("Thermometer — von links","temp_left",0,100)}
          ${e.slider("Thermometer — Größe","temp_scale",50,200)}
        `),xn("Kästchen",H`<div class="haken-reihe">
          ${e.zeigen("Watt mit Box","power_box")} ${e.zeigen("Watt mit Einheit","power_label")}
        </div>`),xn("Ausblenden",H`<div class="haken-reihe">
          ${e.zeigen("Powerbutton","show_power_button")} ${e.zeigen("Watt","show_power")}
          ${e.zeigen("Thermometer","show_temp")}
        </div>`)]}})(i);case"solar":return(e=>{const t=e.config||{};return{pflicht:H`
      ${e.entity("Vorlauf (links unten, ins Feld)","temp_in_entity","Wasser, das zum Absorber läuft — am blauen Pfeil links unten.",...En)}
      ${e.entity("Rücklauf (rechts oben, ins Becken)","temp_out_entity","Wasser, das zurück ins Becken läuft — am roten Pfeil rechts oben.",...En)}
      <small>
        Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
        Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt.
      </small>
    `,anaus:H`
      ${e.entity("Ventil oder Pumpe (Powerbutton)","switch_entity","Solarventil oder Solarpumpe.",...An)}
      ${t.switch_entity?Wn(e):G}
    `,anzeige:H`
      ${e.entity("Läuft gerade?","active_entity","Z.B. Ventil-Rückmeldung „AN“ oder ein Status wie Heizen/Bypass. Ohne Angabe zählt der Schalter.","binary_sensor","switch","input_boolean","sensor","input_select","select")}
      ${Nn(e,"switch_entity","Solarpumpe in W oder kW.")}
    `,optik:e.zeigen("Richtungspfeile (blau hinein, rot hinaus)","show_arrows"),erweitert:[xn("Richtungspfeile",H`
          ${e.slider("Blau — von oben","arrow_in_top",0,100,"%",.5)}
          ${e.slider("Blau — von links","arrow_in_left",0,100,"%",.5)}
          ${e.slider("Blau — Größe","arrow_in_size",2,20,"%",.5)}
          ${e.slider("Rot — von oben","arrow_out_top",0,100,"%",.5)}
          ${e.slider("Rot — von links","arrow_out_left",0,100,"%",.5)}
          ${e.slider("Rot — Größe","arrow_out_size",2,20,"%",.5)}
          <small
            >Beide Pfeile zeigen nach rechts: links unten läuft kaltes Wasser ins Feld, rechts oben
            warmes heraus.</small
          >
        `),xn("Position und Größe",H`
          ${e.slider("Powerbutton — Größe","power_btn_scale",50,200)}
          ${e.slider("Powerbutton — von oben","power_btn_top",0,100)}
          ${e.slider("Powerbutton — von links","power_btn_left",0,100)}
          ${e.slider("Vorlauf — von oben","temp_in_top",0,100,"%",.5)}
          ${e.slider("Vorlauf — von links","temp_in_left",0,100,"%",.5)}
          ${e.slider("Vorlauf — Größe","temp_in_scale",50,200)}
          ${e.slider("Rücklauf — von oben","temp_out_top",0,100,"%",.5)}
          ${e.slider("Rücklauf — von links","temp_out_left",0,100,"%",.5)}
          ${e.slider("Rücklauf — Größe","temp_out_scale",50,200)}
          ${e.slider("Watt — von unten","power_bottom",0,100)}
          ${e.slider("Watt — von links","power_left",0,100)}
          ${e.slider("Watt — Größe","power_scale",50,150)}
        `),xn("Kästchen",H`<div class="haken-reihe">
          ${e.zeigen("Watt mit Box","power_box")} ${e.zeigen("Watt mit Einheit","power_label")}
        </div>`),xn("Ausblenden",H`<div class="haken-reihe">
          ${e.zeigen("Powerbutton","show_power_button")} ${e.zeigen("Vorlauf","show_temp_in")}
          ${e.zeigen("Rücklauf","show_temp_out")} ${e.zeigen("Watt","show_power")}
        </div>`)]}})(i);case"custom":return((e,t)=>{const i=Ei(e.config).length,n=Ti(e.config);return{pflicht:H`
      ${t}
      ${i>8?H`<div class="limit-warnung" role="alert">
            ⚠ ${i} Einträge eingetragen — der Kasten zeigt höchstens ${8}.
            Einträge ${9}–${i} werden ausgeblendet. Bitte entfernen oder
            auf einen zweiten Kasten verteilen.
          </div>`:G}
    `,anzeige:H`
      ${e.select("Darstellung","layout",[["klassisch","Klassisch (mittig gestapelt)"],["liste","Liste (Zeilen mit Schalter, wie HA-Entities)"],["kacheln","Kacheln (2 Spalten)"]],Si)}
      ${"liste"===n&&i>4?H`<small class="limit-hinweis">
            Ab 5 Zeilen wird der Kasten höher als eine Standard-Karte (Titel + 4 Zeilen).
          </small>`:G}
    `,erweitert:[xn("Ausrichtung",e.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"klassisch"===n?"mitte":"oben"))]}})(i,this._renderEintraege(e));case"hidden":return null;default:return(e=>({pflicht:e.text("Hinweistext","hint","",""),erweitert:[]}))(i)}}_slotBody(e){const t=this._slots()[e]||{},i=this._teile(e);if(!i)return H`
        <small>Dieser Kasten wird nicht angezeigt; die anderen rücken nach. Zum Zeigen wieder einen Typ wählen.</small>
        ${this._typFeld(e)}
      `;const n=this._fieldsFor(e),r=String(t.type||"frame");return H`
      ${this._typFeld(e)} ${Kn(n,"Überschrift",Qn[r]||"")}
      ${yn("pflicht",i.pflicht)} ${yn("anaus",i.anaus)} ${yn("anzeige",i.anzeige)}
      ${yn("optik",i.optik)}
      ${this._renderMiniWahl(t,t.type,t=>this._updateSlot(e,t))}
      ${$n(...i.erweitert||[])}
    `}_renderKasten(e,t,i){const n=this._istOffen(t);return H`
      <div class="slot-block kasten ${n?"offen":""}" data-kasten="${t}" style="--slot-farbe:${Ge(e.type)};">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="${t}"
            aria-expanded="${n?"true":"false"}"
            @click="${()=>this._umschalten(t)}"
          >
            <span class="pfeil ${n?"auf":""}">▶</span>
            <span class="slot-ueberschrift" title="${this._slotKopf(e,t)}">${this._kopfInhalt(e,t)}</span>
          </button>
          <div class="kasten-knoepfe">
            <button type="button" class="icon-btn" data-aktion="hoch" title="nach oben" ?disabled="${0===t}" @click="${()=>this._moveSlot(t,-1)}">↑</button>
            <button type="button" class="icon-btn" data-aktion="runter" title="nach unten" ?disabled="${t===i-1}" @click="${()=>this._moveSlot(t,1)}">↓</button>
            <button type="button" class="icon-btn" data-aktion="duplizieren" title="Duplizieren" @click="${()=>this._duplicateSlot(t)}">⧉</button>
            <button type="button" class="icon-btn danger" data-aktion="loeschen" title="Löschen" @click="${()=>this._loeschFrage=t}">✕</button>
          </div>
        </div>
        ${this._loeschFrage===t?H`<div class="loesch-frage" role="alertdialog">
              <span>„${this._slotKopf(e,t)}“ löschen?</span>
              <button type="button" class="knopf-gefahr" data-aktion="loeschen-ja" @click="${()=>this._removeSlot(t)}">Löschen</button>
              <button type="button" class="knopf-leise" data-aktion="loeschen-nein" @click="${()=>this._loeschFrage=null}">Abbrechen</button>
            </div>`:G}
        <div class="slot-card kasten-body" ?hidden="${!n}">${this._slotBody(t)}</div>
      </div>
    `}_renderBecken(e){const t=this._config.hero||{},i=this._istOffen("becken"),n=!1!==t.enabled,r=(e=>({pflicht:H`
    ${e.select("Beckenform","shape",Object.entries(ze).map(([e,t])=>[e,t.label]),"oval")}
    ${e.entity("Wassertemperatur","temp_entity","Thermometer auf der Wasserfläche.",...En)}
  `,anzeige:H`
    ${e.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...En)}
    ${e.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...En)}
    ${e.entity("Temperatur am Einlauf","inlet_temp_entity","Kleines Kästchen unter der Einlaufdüse — zeigt, was gerade ins Becken läuft.",...En)}
  `,optik:H`
    <div class="haken-reihe">
      ${e.zeigen("Skimmer","show_skimmer",!0)} ${e.zeigen("Einlaufdüse","show_inlet",!0)}
      ${e.zeigen("Bodenablauf","show_drain",!1)}
    </div>
    ${e.toggle("Becken mit Rahmen","framed",!1)}
  `,erweitert:[xn("Thermometer, pH, RX",H`
        ${e.slider("Thermometer — Größe","thermo_scale",50,200)}
        ${e.slider("Thermometer — von oben","thermo_top",0,100,"%",.5)}
        ${e.slider("Thermometer — von links","thermo_left",0,100,"%",.5)}
        ${e.slider("pH — von oben","ph_top",0,100,"%",.5)}
        ${e.slider("pH — von links","ph_left",0,100,"%",.5)}
        ${e.slider("RX — von oben","rx_top",0,100,"%",.5)}
        ${e.slider("RX — von links","rx_left",0,100,"%",.5)}
      `),e.raw("inlet_temp_entity")?xn("Einlauf-Temperatur",H`
            ${e.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
            ${e.slider("Von links","inlet_temp_left",0,100,"%",.5)}
            <small>Ohne eigene Werte hängt das Kästchen unter der Düse und wandert mit ihr.</small>
          `):G,xn("Becken-Teile (Skimmer, Düse, Bodenablauf)",H`
        ${In(e)} ${Rn(e,"Skimmer","skimmer","show_skimmer",!0)}
        ${Rn(e,"Einlaufdüse","inlet","show_inlet",!0)}
        ${Rn(e,"Bodenablauf","drain","show_drain",!1)}
        <small>Größe = Breite in % der Beckenbreite. Jedes Teil bleibt immer ganz im Beckenbild.</small>
      `),ct(e.config)?xn("Freitext",H`
            ${e.slider("Größe","label_scale",50,200)}
            ${e.slider("Von oben","label_top",0,100,"%",.5)}
            ${e.slider("Von links","label_left",0,100,"%",.5)}
          `):G,xn("Ausblenden",H`<div class="haken-reihe">
        ${e.zeigen("Thermometer","show_thermo")} ${e.zeigen("pH","show_ph")} ${e.zeigen("RX","show_rx")}
      </div>`)]}))(e),s=ct(t);return H`
      <div class="slot-block kasten becken-block ${i?"offen":""}" data-kasten="becken" style="--slot-farbe:${Ge("hero")};">
        <div class="kasten-kopf">
          <button
            type="button"
            class="kasten-auf"
            data-auf="becken"
            aria-expanded="${i?"true":"false"}"
            @click="${()=>this._umschalten("becken")}"
          >
            <span class="pfeil ${i?"auf":""}">▶</span>
            <span class="slot-ueberschrift"
              >Becken · ${n?Ee(t.shape).label:"aus"}${n&&s?` · ${s}`:""}</span
            >
          </button>
        </div>
        <div class="slot-card becken-card kasten-body" ?hidden="${!i}">
          ${e.toggle("Becken anzeigen","enabled",!0)}
          ${n?H`
                ${Kn(e,"Freitext auf dem Becken","z.B. Pool")}
                ${yn("pflicht",r.pflicht)} ${yn("anzeige",r.anzeige)} ${yn("optik",r.optik)}
                ${this._renderMiniWahl(t,"hero",e=>this._updateHero(e))}
                ${$n(...r.erweitert)}
              `:G}
        </div>
      </div>
    `}_renderNeu(){return this._typWahl?H`
      <div class="typ-wahl" data-block="typ-wahl">
        <div class="block-titel">Welcher Kasten?</div>
        <div class="typ-kacheln">
          ${qn.map(e=>H`<button
              type="button"
              class="typ-kachel"
              data-typ="${e.typ}"
              style="--slot-farbe:${Ge(e.typ)};"
              @click="${()=>this._addSlot(e.typ)}"
            >
              ${e.bild?H`<img src="${Ie(e.bild)}" alt="" />`:H`<ha-icon icon="${e.icon}"></ha-icon>`}
              <span>${De[e.typ].label.replace(" (benutzerdefiniert)","")}</span>
            </button>`)}
        </div>
        <button type="button" class="knopf-leise" data-aktion="neu-abbrechen" @click="${()=>this._typWahl=!1}">
          Abbrechen
        </button>
      </div>
    `:H`<button
        type="button"
        class="add-btn"
        data-aktion="neu"
        @click="${()=>{this._typWahl=!0,this._scrollZiel='[data-block="typ-wahl"]'}}"
      >
        + Kasten hinzufügen
      </button>`}render(){if(!this._config)return G;const e=this._config.hero||{},t=this._config.frame||{},i=new vn({hass:this.hass,config:e,defaults:{...yt(e.shape),...Object.fromEntries(Object.values(Pe).flatMap(t=>{const i=kt(e,t,"voll");return[[`mini_${t.anker}_top`,i.top],[`mini_${t.anker}_left`,i.left],[`mini_${t.anker}_size`,i.breite]]}))},update:e=>this._updateHero(e),idPrefix:"hero"});i.teilePos=this._teilePos||Wi(this._config),i.setTeilePos=e=>{this._teilePos=e};const n=new vn({hass:this.hass,config:t,update:e=>this._updateFrame(e),idPrefix:"frame"}),r=this._slots(),s=gn(this._config);return H`
      <div class="editor">
        ${s.length?H`<div class="limit-warnung hinweise" role="status">
              ${s.map(e=>H`<div>⚠ ${e}</div>`)}
            </div>`:G}
        ${this._renderDarstellung(n)} ${this._renderBecken(i)}
        ${r.map((e,t)=>this._renderKasten(e||{},t,r.length))} ${this._renderNeu()}
        ${this._renderKiosk()}
      </div>
    `}static styles=[zn]}customElements.define("tomtut-pool-dashboard-editor",Jn),
/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung für Pool-Dashboards
 *
 * Card-Typ:
 *   custom:tomtut-pool-dashboard  — Becken-Hero + frei bestückbare Geräte-Slots
 *
 * Keine Integration nötig: alle Werte kommen aus frei konfigurierbaren
 * Entities. Die Bilder liegen im Repo unter dist/ und werden von HACS nach
 * www/community/tomtut-pool-cards/ kopiert.
 */
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{Pi as ANSICHTEN,Oi as ANSICHT_DEFAULT,Ne as ASSET_VERSION,Te as BECKEN_RATIOS,je as BLOCK_FARBEN,zi as CUSTOM_LAYOUTS,Si as CUSTOM_LAYOUT_DEFAULT,xi as CUSTOM_MAX_ENTRIES,Ce as DEVICE_IMAGES,We as DEVICE_RATIOS,Oe as DEVICE_VARIANTS,st as FAN_DESIGNS,at as FAN_DESIGN_DEFAULT,Ke as FLOW_MARKERS,di as FREIGABE_DOMAINS,ui as GLOW_PULSE_MAX,Je as GROESSE_MAX,Xe as GROESSE_MIN,It as HEATPUMP_DEFAULTS,wt as HERO_DEFAULTS,Pe as HERO_SPRITES,Ft as HP_MODES,mt as INLET_TEMP_VERSATZ,xt as KIOSK_BECKEN,Ii as MINI_CARD_FILLS,Ni as MINI_KACHEL_FILLS,Li as MINI_LEER,Di as MINI_MAX_SPALTEN,Ki as MINI_TYPEN,Xi as MINI_WERTE,Yi as MINI_WERTE_EMPFOHLEN,Ji as MINI_WERT_NAMEN,Dt as MODE_FARBEN,Xt as MODE_WOERTER,ii as MODUS_DOMAINS,Ct as PUMP_DEFAULTS,ze as SHAPES,Ae as SHAPE_ALIASE,He as SLOT_GRAU,De as SLOT_TYPES,Ue as SLOT_TYPE_GROUPS,gi as SOLAR_DEFAULTS,Lt as TASTER_DOMAINS,bt as TEIL_GROESSE_MAX,gt as TEIL_GROESSE_MIN,_n as TomtutPoolDashboardCard,Jn as TomtutPoolDashboardEditor,hi as UV_DEFAULTS,Wi as ansichtVon,Xn as applyPatch,et as bildTransform,gn as configHinweise,Ei as customEintraege,Ti as customLayout,Wt as fanDuration,he as fmt,fi as glowPulsWerte,Ye as groesseFaktor,yt as heroDefaultsFor,Re as imagePath,ke as istAktivText,be as istTot,qi as kachelName,Bt as kastenSchluessel,Tt as kioskGilt,Mt as kioskMigrieren,Et as kioskSchluessel,li as klimaAus,oi as klimaEntity,on as miniBecken,Fi as miniCardFill,dn as miniDichte,an as miniKachel,Ri as miniKachelFill,rn as miniSichtbar,Hi as miniSpalten,nn as miniWahl,Ut as modeAuto,ni as modeBadge,Qt as modeFromState,ti as modeWort,ei as modeWortBekannt,qt as modusName,ai as modusWahl,At as neueKastenId,Ve as normGrad,pe as numOf,$e as numText,Vt as optionZuordnung,Qe as passFaktor,fe as seit,me as seitMinuten,Be as shapeKey,Me as shapeRatio,Ge as slotFarbe,ct as slotLabel,Ze as slotTypeOptions,bi as solarAktiv,_i as solarZustand,Pt as stageFromWatt,Kt as stufenListe,kt as teilLage,ue as toWatt,Sn as typWechsel};
