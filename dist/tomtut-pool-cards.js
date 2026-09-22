const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,r=Symbol(),i=new WeakMap;let s=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==r)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const r=this.t;if(t&&void 0===e){const t=void 0!==r&&1===r.length;t&&(e=i.get(r)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&i.set(r,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,r,i)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+e[i+1],e[0]);return new s(i,e,r)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const r of e.cssRules)t+=r.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,r))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,_=u.trustedTypes,m=_?_.emptyScript:"",f=u.reactiveElementPolyfillSupport,g=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?m:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let r=e;switch(t){case Boolean:r=null!==e;break;case Number:r=null===e?null:Number(e);break;case Object:case Array:try{r=JSON.parse(e)}catch(e){r=null}}return r}},w=(e,t)=>!a(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const r=Symbol(),i=this.getPropertyDescriptor(e,r,t);void 0!==i&&l(this.prototype,e,i)}}static getPropertyDescriptor(e,t,r){const{get:i,set:s}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:i,set(t){const n=i?.call(this);s?.call(this,t),this.requestUpdate(e,n,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const r of t)this.createProperty(r,e[r])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,r]of t)this.elementProperties.set(e,r)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const r=this._$Eu(e,t);void 0!==r&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const r=new Set(e.flat(1/0).reverse());for(const e of r)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const r=t.attribute;return!1===r?void 0:"string"==typeof r?r:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const r of t.keys())this.hasOwnProperty(r)&&(e.set(r,this[r]),delete this[r]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const r=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((r,i)=>{if(t)r.adoptedStyleSheets=i.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of i){const i=document.createElement("style"),s=e.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=t.cssText,r.appendChild(i)}})(r,this.constructor.elementStyles),r}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,r){this._$AK(e,r)}_$ET(e,t){const r=this.constructor.elementProperties.get(e),i=this.constructor._$Eu(e,r);if(void 0!==i&&!0===r.reflect){const s=(void 0!==r.converter?.toAttribute?r.converter:b).toAttribute(t,r.type);this._$Em=e,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(e,t){const r=this.constructor,i=r._$Eh.get(e);if(void 0!==i&&this._$Em!==i){const e=r.getPropertyOptions(i),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=i;const n=s.fromAttribute(t,e.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(e,t,r,i=!1,s){if(void 0!==e){const n=this.constructor;if(!1===i&&(s=this[e]),r??=n.getPropertyOptions(e),!((r.hasChanged??w)(s,t)||r.useDefault&&r.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,r))))return;this.C(e,t,r)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:r,reflect:i,wrapped:s},n){r&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==s||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||r||(t=void 0),this._$AL.set(e,t)),!0===i&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,r]of e){const{wrapped:e}=r,i=this[t];!0!==e||this._$AL.has(t)||void 0===i||this.C(t,void 0,r,i)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[g("elementProperties")]=new Map,v[g("finalized")]=new Map,f?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");const y=globalThis,x=e=>e,k=y.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,P=`<${E}>`,B=document,C=()=>B.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,L="[ \t\n\f\r]",N=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,V=/-->/g,O=/>/g,D=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,R=/"/g,H=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...r)=>({_$litType$:e,strings:t,values:r}))(1),U=Symbol.for("lit-noChange"),K=Symbol.for("lit-nothing"),F=new WeakMap,G=B.createTreeWalker(B,129);function j(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Z=(e,t)=>{const r=e.length-1,i=[];let s,n=2===t?"<svg>":3===t?"<math>":"",o=N;for(let t=0;t<r;t++){const r=e[t];let a,l,c=-1,h=0;for(;h<r.length&&(o.lastIndex=h,l=o.exec(r),null!==l);)h=o.lastIndex,o===N?"!--"===l[1]?o=V:void 0!==l[1]?o=O:void 0!==l[2]?(H.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=s??N,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?D:'"'===l[3]?R:W):o===R||o===W?o=D:o===V||o===O?o=N:(o=D,s=void 0);const d=o===D&&e[t+1].startsWith("/>")?" ":"";n+=o===N?r+P:c>=0?(i.push(a),r.slice(0,c)+z+r.slice(c)+A+d):r+A+(-2===c?t:d)}return[j(e,n+(e[r]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),i]};class Q{constructor({strings:e,_$litType$:t},r){let i;this.parts=[];let s=0,n=0;const o=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=Q.createElement(l,r),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(i=G.nextNode())&&a.length<o;){if(1===i.nodeType){if(i.hasAttributes())for(const e of i.getAttributeNames())if(e.endsWith(z)){const t=c[n++],r=i.getAttribute(e).split(A),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:o[2],strings:r,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?re:Y}),i.removeAttribute(e)}else e.startsWith(A)&&(a.push({type:6,index:s}),i.removeAttribute(e));if(H.test(i.tagName)){const e=i.textContent.split(A),t=e.length-1;if(t>0){i.textContent=k?k.emptyScript:"";for(let r=0;r<t;r++)i.append(e[r],C()),G.nextNode(),a.push({type:2,index:++s});i.append(e[t],C())}}}else if(8===i.nodeType)if(i.data===E)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=i.data.indexOf(A,e+1));)a.push({type:7,index:s}),e+=A.length-1}s++}}static createElement(e,t){const r=B.createElement("template");return r.innerHTML=e,r}}function X(e,t,r=e,i){if(t===U)return t;let s=void 0!==i?r._$Co?.[i]:r._$Cl;const n=T(t)?void 0:t._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(e),s._$AT(e,r,i)),void 0!==i?(r._$Co??=[])[i]=s:r._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,i)),t}class q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:r}=this._$AD,i=(e?.creationScope??B).importNode(t,!0);G.currentNode=i;let s=G.nextNode(),n=0,o=0,a=r[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new J(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new ie(s,this,e)),this._$AV.push(t),a=r[++o]}n!==a?.index&&(s=G.nextNode(),n++)}return G.currentNode=B,i}p(e){let t=0;for(const r of this._$AV)void 0!==r&&(void 0!==r.strings?(r._$AI(e,r,t),t+=r.strings.length-2):r._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,r,i){this.type=2,this._$AH=K,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=r,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),T(e)?e===K||null==e||""===e?(this._$AH!==K&&this._$AR(),this._$AH=K):e!==this._$AH&&e!==U&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==K&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:r}=e,i="number"==typeof r?this._$AC(e):(void 0===r.el&&(r.el=Q.createElement(j(r.h,r.h[0]),this.options)),r);if(this._$AH?._$AD===i)this._$AH.p(t);else{const e=new q(i,this),r=e.u(this.options);e.p(t),this.T(r),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new Q(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let r,i=0;for(const s of e)i===t.length?t.push(r=new J(this.O(C()),this.O(C()),this,this.options)):r=t[i],r._$AI(s),i++;i<t.length&&(this._$AR(r&&r._$AB.nextSibling,i),t.length=i)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,r,i,s){this.type=1,this._$AH=K,this._$AN=void 0,this.element=e,this.name=t,this._$AM=i,this.options=s,r.length>2||""!==r[0]||""!==r[1]?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=K}_$AI(e,t=this,r,i){const s=this.strings;let n=!1;if(void 0===s)e=X(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==U,n&&(this._$AH=e);else{const i=e;let o,a;for(e=s[0],o=0;o<s.length-1;o++)a=X(this,i[r+o],t,o),a===U&&(a=this._$AH[o]),n||=!T(a)||a!==this._$AH[o],a===K?e=K:e!==K&&(e+=(a??"")+s[o+1]),this._$AH[o]=a}n&&!i&&this.j(e)}j(e){e===K?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===K?void 0:e}}class te extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==K)}}class re extends Y{constructor(e,t,r,i,s){super(e,t,r,i,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??K)===U)return;const r=this._$AH,i=e===K&&r!==K||e.capture!==r.capture||e.once!==r.once||e.passive!==r.passive,s=e!==K&&(r===K||i);i&&this.element.removeEventListener(this.name,this,r),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ie{constructor(e,t,r){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const se=y.litHtmlPolyfillSupport;se?.(Q,J),(y.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class oe extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,r)=>{const i=r?.renderBefore??t;let s=i._$litPart$;if(void 0===s){const e=r?.renderBefore??null;i._$litPart$=s=new J(t.insertBefore(C(),e),e,void 0,r??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}}oe._$litElement$=!0,oe.finalized=!0,ne.litElementHydrateSupport?.({LitElement:oe});const ae=ne.litElementPolyfillSupport;ae?.({LitElement:oe}),(ne.litElementVersions??=[]).push("4.2.2");const le=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],ce=e=>le.includes(String(e).toLowerCase()),he=e=>{if(null==e)return null;const t=String(e).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(t))return null;const r=Number(t);return isFinite(r)?r:null},de=(e,t=0)=>{const r=Number(e);return isFinite(r)?r.toFixed(t).replace(".",","):"—"},pe=e=>{if(!e)return null;const t=he(e.state);if(null===t)return null;return"kw"===String(e.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*t:t},ue=(e,t=Date.now())=>{if(!e)return"";const r=Date.parse(e);if(isNaN(r))return"";const i=Math.max(0,(t-r)/1e3);if(i<60)return`seit ${Math.floor(i)} Sek`;const s=i/60;if(s<60)return`seit ${Math.floor(s)} Min`;const n=s/60;if(n<24)return`seit ${Math.floor(n)} Std`;const o=Math.floor(n/24);return o<=1?"seit 1 Tag":`seit ${o} Tagen`},_e=(e,t=Date.now())=>{if(!e)return"";const r=Date.parse(e);if(isNaN(r))return"";const i=Math.floor(Math.max(0,t-r)/6e4);if(i<1)return"seit < 1 Min";if(i<60)return`seit ${i} Min`;if(i<1440){const e=Math.floor(i/60),t=i%60;return t?`seit ${e} Std ${t} Min`:`seit ${e} Std`}const s=Math.floor(i/1440);return s<=1?"seit 1 Tag":`seit ${s} Tagen`},me=e=>String(e||"").split(".")[0],fe=(e,t)=>e?.attributes?.friendly_name||String(t||"").split(".")[1]||String(t||""),ge=(e,{decimals:t}={})=>{const r=he(e?.state);if(null===r)return"—";const i=t??(Number.isInteger(r)?0:1),s=e.attributes?.unit_of_measurement;return de(r,Math.min(i,1))+(s?" "+s:"")},be={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},we="oval",$e=e=>be[String(e||"").toLowerCase()]||be[we],ve={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},ye={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1}},xe={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},ke={heatpump:988/725,pump:1126/756,uv:947/384,solar:1001/710},Se={in:"pfeil_blau.png",out:"pfeil_rot.png"},ze="1.0.0-af12a067",Ae=ze.startsWith("__")?"dev":ze,Ee=e=>"/local/community/tomtut-pool-cards/"+e+"?v="+encodeURIComponent(Ae),Pe=e=>ke[e]||1,Be={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},Ce="#8a8f98",Te={hero:"#12a4b8"},Me=e=>Be[e]?.farbe||Te[e]||Ce,Le=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],Ne=()=>{const e=new Set(Le.flatMap(e=>e.keys)),t=Object.keys(Be).filter(t=>!e.has(t)&&!1!==Be[t].waehlbar),r=e=>({value:e,label:Be[e].label+(!1===Be[e].ready?" (folgt)":"")}),i=[];for(const e of Le){e.trenner&&i.push({trenner:!0,label:e.trenner});for(const t of e.keys)Be[t]&&i.push(r(t))}for(const e of t)i.push(r(e));return i},Ve=e=>{const t=Number(e);return isFinite(t)?(Math.round(t)%360+360)%360:0},Oe=e=>Math.abs(e)<1e-9?0:Math.abs(e),De=(e,t)=>{const r=Number(t)>0?Number(t):1,i=Ve(e)*Math.PI/180,s=Oe(Math.cos(i)),n=Oe(Math.sin(i));return Math.min(1,r/(r*s+n),1/(r*n+s))},We=30,Re=100,He=e=>{const t=Number(e);return isFinite(t)?Math.min(Re,Math.max(30,t))/100:1},Ie=(e,t,r,i=100)=>{const s=Ve(e),n=(e=>Math.round(1e3*e)/1e3)(De(s,r)*He(i)),o=[];return s&&o.push(`rotate(${s}deg)`),n<1&&o.push(`scale(${n})`),!0===t&&o.push("scaleX(-1)"),o.length?`transform:${o.join(" ")};`:""},Ue='<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>',Ke='fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"',Fe=(e,t,r="")=>Array.from({length:t},(i,s)=>{const n=Math.round(360/t*s*100)/100;return`<path d="${e}" ${Ke}${r}${n?` transform="rotate(${n} 20 20)"`:""}/>`}).join(""),Ge=(e=3.2)=>`<circle cx="20" cy="20" r="${e}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`,je={klassisch:{label:"Klassisch (4 Blätter)",svg:Ue},drei:{label:"3 Blätter, breit",svg:Fe("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z",3)+Ge(3.6)},fuenf:{label:"5 Blätter, schlank",svg:Fe("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z",5)+Ge(3)},sichel:{label:"Sichel / Turbine",svg:Fe("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z",7)+'<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>'+Ge(3.4)},propeller:{label:"Propeller",svg:Fe("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z",2)+'<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>'},batman:{label:"Batman",svg:'<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" '+Ke+"/>"}},Ze="klassisch";class Qe extends oe{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this._confirmOpen=!1}get defaults(){return{}}_v(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}_ent(e){return e?this.hass?.states?.[e]:void 0}_isOn(e){const t=this._ent(e);return!!t&&ce(t.state)}_watt(e){return pe(this._ent(e))}_call(e,t,r={}){e&&this.hass&&this.hass.callService(me(e),t,{entity_id:e,...r})}_moreInfo(e){const t=e?.currentTarget?.dataset?.entity;t&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0})))}get _frameClasses(){const e=this.frame||{},t=["transparent","weiss","schwarz"].includes(e.fill)?e.fill:"transparent";return`slot ${!1===e.enabled?"":"framed"} fill-${t}`}renderSlot(e){return I`<div class="${this._frameClasses}">${e}</div>`}renderGeraeteBild({kind:e,variante:t,alt:r,rotate:i=0,mirror:s=!1,groesse:n=100,inhalt:o=K}){const a=Pe(e);return I`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*a)/1e4};">
        <div class="bild" style="${Ie(i,s,a,n)}">
          <img src="${((e,t)=>Ee(xe[e]?.[t]||ve[e]||""))(e,t)}" alt="${r}" />
          ${o}
        </div>
      </div>
    `}renderFan({active:e,top:t,left:r,size:i,ratio:s,dur:n,inactive:o,round:a=!1,design:l,farbe:c}){const h=e?"spinning":"hidden"===o?"hidden":"idle",d=a?1:Number(s)||1,p=l?(e=>(je[e]||je[Ze]).svg)(l):Ue;return I`
      <div
        class="fan-overlay ${h} ${a?"round":""} design-${l&&je[l]?l:Ze}"
        style="top:${t}%; left:${r}%; width:${i}%; --fan-dur:${n}s; --fan-ratio:${d};${c?` --tt-fan-color:${c};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${a?"xMidYMid meet":"none"}">
          <g .innerHTML="${p}"></g>
        </svg>
      </div>
    `}renderPowerButton({on:e,top:t,left:r,scale:i}){return I`
      <div
        class="power-badge ${e?"on":"off"}"
        style="top:${t}%; left:${r}%; transform:scale(${(i??100)/100});"
        title="${e?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `}renderValueBox({value:e,unit:t,top:r,bottom:i,left:s,scale:n,box:o,entity:a}){return I`
      <div
        class="value-box ${!1===o?"no-bg":""}"
        style="${void 0===i?`top:${r}%;`:`bottom:${i}%;`} left:${s}%; transform:translateX(-50%) scale(${(n??100)/100});"
        data-entity="${a||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${e}</span>
        ${t?I`<span class="unit">${t}</span>`:K}
      </div>
    `}renderThermo({value:e,top:t,left:r,scale:i,entity:s}){return I`
      <div
        class="thermo"
        style="top:${t}%; left:${r}%; --thermo-size:${(i??100)/100*3.6}em;"
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
        ${e?I`<span class="thermo-val">${e}</span>`:K}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}get confirmDefault(){return!0}get fragtNach(){const e=this.config?.confirm_off;return null==e||""===e?this.confirmDefault:!1!==e}_onPowerClick(e){e?.stopPropagation();const t=this.powerEntityId;t&&(this._isOn(t)?this.fragtNach?this._confirmOpen=!0:this._call(t,"turn_off"):this._call(t,"turn_on"))}_confirmOff(e){e?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(e){e?.stopPropagation(),this._confirmOpen=!1}renderConfirm(e="Wirklich stromlos schalten?"){return this._confirmOpen?I`
      <div class="confirm-overlay" @click="${this._cancelOff}">
        <div class="confirm-panel" @click="${e=>e.stopPropagation()}">
          <h3><ha-icon icon="mdi:alert"></ha-icon> ${e}</h3>
          <p>${this.powerConfirmText}</p>
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._cancelOff}">Abbrechen</button>
            <button class="btn danger" @click="${this._confirmOff}">Trotzdem ausschalten</button>
          </div>
        </div>
      </div>
    `:K}wattText(e,t=0){const r=this._watt(e);return null===r?"—":de(r,t)}}const Xe=n`
  /*
   * Eigener Stacking-Context je Card/Slot.
   *
   * Ohne ihn steigen die z-index-Werte der Overlays (Kaestchen, Thermometer,
   * Powerbutton, Sprites, Pfeile) in den Stapel der Home-Assistant-Oberflaeche
   * auf und legen sich beim Scrollen ueber die Kopfleiste. isolation:isolate
   * sperrt sie ein: innen zaehlt die Reihenfolge 1-5, nach aussen ist die
   * ganze Card ein einziges Element auf z-index 0 — unter der Kopfleiste.
   */
  :host {
    display: block;
    height: 100%;
    position: relative;
    isolation: isolate;
    z-index: 0;
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
`,qe=n`
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
    background: var(--tt-soft);
    border: 1px solid var(--tt-line);
    transform-origin: top left;
    z-index: 5;
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
    background: var(--tt-box-bg);
    color: var(--tt-box-fg);
    border-radius: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    letter-spacing: 0.5px;
    line-height: 1.3;
    pointer-events: none;
    white-space: nowrap;
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
`,Je={top:8,left:11},Ye={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:ye.skimmer.groesse,inlet_size:ye.einlauf.groesse,drain_size:ye.drain.groesse},et=e=>{const t=$e(e),r={};for(const e of Object.values(ye)){const i=t[e.anker];i&&(r[`${e.anker}_top`]=i.top,r[`${e.anker}_left`]=i.left)}return{...Ye,thermo_top:t.thermo.top,thermo_left:t.thermo.left,ph_top:t.ph.top,ph_left:t.ph.left,rx_top:t.rx.top,rx_left:t.rx.left,...r,inlet_temp_top:(t.inlet?.top??12)+Je.top,inlet_temp_left:(t.inlet?.left??66)+Je.left,label_top:t.label_anker?.top??Ye.label_top,label_left:t.label_anker?.left??Ye.label_left}};class tt extends Qe{get defaults(){return{...et(this.config?.shape),inlet_temp_top:this._anchor("inlet","top")+Je.top,inlet_temp_left:this._anchor("inlet","left")+Je.left}}_spriteAn(e){const t=Object.values(ye).find(t=>t.anker===e),r=this.config?.[`show_${e}`];return null==r?!!t?.standard:!1!==r}get shape(){return $e(this.config?.shape)}_anchor(e,t){const r=`${e}_${t}`,i=this.config?.[r];return null!=i&&""!==i?Number(i):this.shape[e]?.[t]??50}render(){const e=this.config||{},t=this.shape,r=!0===e.framed,i=!1!==e.show_thermo&&!!e.temp_entity,s=!1!==e.show_ph&&!!e.ph_entity,n=!1!==e.show_rx&&!!e.rx_entity,o=!!e.inlet_temp_entity&&this._spriteAn("inlet"),a=I`
      <div class="img-wrap">
        <img src="${Ee(t.file)}" alt="Pool ${t.label}" />
        ${this._sprites()}

        ${i?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:e.temp_entity}):K}
        ${s?this._chemBox("pH",e.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):K}
        ${n?this._chemBox("RX",e.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):K}
        ${o?this._chemBox("Zulauf",e.inlet_temp_entity,this._v("inlet_temp_top"),this._v("inlet_temp_left"),"inlet-temp"):K}
        ${e.label_text?I`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
            >
              ${e.label_text}
            </div>`:K}
      </div>
    `;return r?this.renderSlot(a):I`<div class="${this._frameClasses} bare">${a}</div>`}_sprites(){return Object.values(ye).map(e=>{if(!this._spriteAn(e.anker))return K;const t=Number(this._v(`${e.anker}_size`)),r=t>0?t:e.groesse;return I`<img
        class="hero-sprite sprite-${e.anker}"
        src="${Ee(e.file)}"
        alt=""
        style="top:${this._anchor(e.anker,"top")}%; left:${this._anchor(e.anker,"left")}%; width:${r}%;"
      />`})}_chemBox(e,t,r,i,s=""){const n=this._ent(t);return I`
      <div
        class="chem-box ${s}"
        style="top:${r}%; left:${i}%;"
        data-entity="${t}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${e}</span>
        <span class="chem-val">${ge(n)}</span>
      </div>
    `}static styles=[Xe,qe,n`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",tt);const rt={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30,stage_from_power:!0,stage_watt_1:20,stage_watt_2:150,stage_watt_3:500},it=(e,t=[20,150,500],r=3)=>{const i=Number(e);if(null==e||!isFinite(i)||r<1)return null;let s=null;return t.slice(0,3).forEach((e,t)=>{const r=Number(e);isFinite(r)&&i>r&&(s=t)}),null===s?null:Math.min(s,r-1)},st=10,nt=e=>{const t=Math.min(st,Math.max(1,Number(e)||1)),r=4*Math.pow(.125,(t-1)/9);return Math.round(100*r)/100};class ot extends Qe{static properties={...Qe.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return rt}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const e=this.config?.stage_entities;return(Array.isArray(e)?e:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const e=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((t,r)=>e[r]||`N${r+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}get _wattStufeAktiv(){return!1!==this._v("stage_from_power")&&!!this.config?.power_entity}_wattStufe(){if(!this._wattStufeAktiv)return;const e=this._watt(this.config.power_entity);if(null===e)return;const t=[1,2,3].map(e=>this._v(`stage_watt_${e}`));return it(e,t,Math.max(1,this.stages.length))}_derive(){const e=this._deriveSchalter(),t=this._wattStufe();if(void 0===t)return e;if(null===t)return{active:null,stopped:!0,since:e.stopped?e.since:null};return{active:t,stopped:!1,since:e.active!==t||e.stopped?null:e.since,ausLeistung:!0}}_deriveSchalter(){if("latching"===this.mode){let e=null;if(this.stages.forEach((t,r)=>{const i=this._ent(t);if(!i||!ce(i.state))return;const s=Date.parse(i.last_changed||0)||0;(!e||s>e.t)&&(e={i:r,t:s,since:i.last_changed})}),!e){const e=this._ent(this.stopEntity);return{active:null,stopped:!0,since:e?.last_changed||null}}return{active:e.i,stopped:!1,since:e.since}}const e=this.stages.map((e,t)=>({id:e,i:t}));this.stopEntity&&e.push({id:this.stopEntity,i:-1});let t=null;for(const r of e){const e=this._ent(r.id);if(!e||!e.last_changed)continue;const i=Date.parse(e.last_changed);isNaN(i)||(!t||i>t.t)&&(t={...r,t:i,since:e.last_changed})}return t?-1===t.i?{active:null,stopped:!0,since:t.since}:{active:t.i,stopped:!1,since:t.since}:{active:null,stopped:!1,since:null}}get state(){const e=this._derive(),t=this._optimistic;if(t&&Date.now()-t.t<6e3){if(-1===t.i&&!e.stopped)return{active:null,stopped:!0,since:null};if(t.i>=0&&e.active!==t.i)return{active:t.i,stopped:!1,since:null}}return e}get running(){const e=this.state;if(this.blockedByMain)return!1;if(e.stopped||null===e.active)return!1;if(e.ausLeistung)return!0;const t=Number(this._v("idle_watt")),r=this._watt(this.config?.power_entity);return!(null!==r&&isFinite(t)&&r<t)}_clickStage(e){if(this.blockedByMain)return;const t=this.stages[e];t&&(this._optimistic={i:e,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((t,r)=>{r!==e&&this._call(t,"turn_off")}),this._call(t,"turn_on")):this._call(t,"turn_on"))}_clickStop(){this.blockedByMain||(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(e=>this._call(e,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const e=this.config||{},t=((e={})=>!!(Array.isArray(e.stage_entities)&&e.stage_entities.filter(Boolean).length||e.main_entity))(e),r=this.state,i=["fan_speed_1","fan_speed_2","fan_speed_3"][r.active??0]||"fan_speed_1",s=!1!==e.show_power&&!!e.power_entity,n=!1!==e.show_temp&&!!e.temp_entity,o=!1!==e.show_power_button&&!!e.main_entity,a=!1!==e.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:K}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===e.show_fan?K:this.renderFan({active:t&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:nt(this._v(i)),inactive:this._v("fan_inactive"),round:!0})}
          ${o?this.renderPowerButton({on:this._isOn(e.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):K}
          ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):K}
          ${n?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):K}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${a?I`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((e,t)=>I`
                    <button
                      class="stage-btn ${r.active!==t||r.stopped?"":"active"}"
                      @click="${()=>this._clickStage(t)}"
                      title="${this.stageLabels[t]}"
                    >
                      <span class="stage-name">${this.stageLabels[t]}</span>
                      ${r.active===t&&!r.stopped&&r.since?I`<span class="stage-since">${ue(r.since)}</span>`:K}
                    </button>
                  `)}
                ${this._showStop?I`
                      <button
                        class="stage-btn stop ${r.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${r.stopped&&r.since?I`<span class="stage-since">${ue(r.since)}</span>`:K}
                      </button>
                    `:K}
              </div>
            `:K}
      </div>
      ${t?K:I`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[Xe,qe,n`
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
    `]}customElements.define("tomtut-pool-slot-pump",ot);const at={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,fan_design:"klassisch",fan_color_mode:"neutral",mode_speed_heiz_silent:3,mode_speed_heiz_smart:5,mode_speed_heiz_auto:6,mode_speed_heiz_boost:9,mode_speed_kuehl_silent:3,mode_speed_kuehl_smart:5,mode_speed_kuehl_auto:6,mode_speed_kuehl_boost:9,power_btn_top:5,power_btn_left:3,power_btn_scale:139,release_top:84,release_left:24,release_scale:100,show_release_since:!1,mode_top:86,mode_left:64,mode_scale:100,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},lt=[{key:"heiz_silent",label:"Heizen Silent",art:"heizen",zustaende:["Heizen Silent","heat_silent","heating_silent","silent_heat"]},{key:"heiz_smart",label:"Heizen Smart",art:"heizen",zustaende:["Heizen Smart","heat_smart","heating_smart","smart_heat"]},{key:"heiz_auto",label:"Heizen Auto",art:"heizen",zustaende:["Heizen Auto","heat_auto","heating_auto","auto_heat"]},{key:"heiz_boost",label:"Heizen Boost",art:"heizen",zustaende:["Heizen Boost","heat_boost","heating_boost","boost_heat","heat_turbo","heat_powerful"]},{key:"kuehl_silent",label:"Kühlen Silent",art:"kuehlen",zustaende:["Kühlen Silent","cool_silent","cooling_silent","silent_cool"]},{key:"kuehl_smart",label:"Kühlen Smart",art:"kuehlen",zustaende:["Kühlen Smart","cool_smart","cooling_smart","smart_cool"]},{key:"kuehl_auto",label:"Kühlen Auto",art:"kuehlen",zustaende:["Kühlen Auto","cool_auto","cooling_auto","auto_cool"]},{key:"kuehl_boost",label:"Kühlen Boost",art:"kuehlen",zustaende:["Kühlen Boost","cool_boost","cooling_boost","boost_cool","cool_turbo","cool_powerful"]}],ct={heizen:"#e0452c",kuehlen:"#2f7fd0"},ht=e=>String(e??"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[\s_-]+/g," ").trim(),dt=[["heizen",/heiz|heat/],["kuehlen",/kuehl|cool/]],pt=[["silent",/silent|leise|quiet|mute/],["smart",/smart|eco/],["boost",/boost|power|turbo|max|strong/],["auto",/auto/]],ut=e=>{const t=ht(e);if(!t)return null;const r=dt.filter(([,e])=>e.test(t)).map(([e])=>e);if(1!==r.length)return null;const i=pt.find(([,e])=>e.test(t));if(!i)return null;const s=`${"heizen"===r[0]?"heiz":"kuehl"}_${i[0]}`;return lt.find(e=>e.key===s)||null},_t=(e,t={})=>{const r=ht(e);if(!r)return null;const i=lt.find(e=>((e={},t)=>{const r=e[`mode_map_${t.key}`];return"string"==typeof r&&r.trim()?r.split(",").map(e=>e.trim()).filter(Boolean):Array.isArray(r)&&r.length?r.map(String):t.zustaende})(t,e).some(e=>ht(e)===r));if(i)return i;const s=ut(e);return s&&!((e,t)=>{const r=e?.[`mode_map_${t.key}`];return"string"==typeof r&&!!r.trim()||Array.isArray(r)&&r.length>0})(t,s)?s:null},mt={off:"Aus",aus:"Aus",heat:"Heizen",heating:"Heizen",heizen:"Heizen",cool:"Kühlen",cooling:"Kühlen",kuehlen:"Kühlen","kühlen":"Kühlen",auto:"Auto","heat cool":"Heizen/Kühlen",dry:"Entfeuchten","fan only":"Nur Lüfter",idle:"Bereit",standby:"Standby",silent:"Silent",smart:"Smart",boost:"Boost",turbo:"Turbo",powerful:"Power",eco:"Eco",comfort:"Komfort",away:"Abwesend",sleep:"Nacht",home:"Zuhause",activity:"Aktiv"},ft={off:"aus",aus:"aus",heat:"heizen",heating:"heizen",heizen:"heizen",cool:"kuehlen",cooling:"kuehlen",kuehlen:"kuehlen","kühlen":"kuehlen"},gt=e=>["","unknown","unavailable","none"].includes(ht(e)),bt=e=>{const t=ht(e);return Object.prototype.hasOwnProperty.call(mt,t)?mt[t]:String(e??"").trim()},wt=(e,t={})=>{if(!e)return null;const r=String(t.mode_attribute||"").trim(),i=r?e.attributes?.[r]:e.state,s=_t(i,t);if(s)return{text:s.label,art:s.art};let n=i,o=null;if(!String(t.mode_entity||"").startsWith("climate.")||r&&"preset_mode"!==r||(n=e.state,o=r?i:e.attributes?.preset_mode),gt(n)&&gt(o))return{text:"—",art:null};const a=ft[ht(n)]||null;if("aus"===a)return{text:"Aus",art:a};if(!gt(n)&&!gt(o)){const e=_t(`${n} ${o}`,t);if(e)return{text:e.label,art:e.art}}const l=[n,o].filter(e=>!gt(e)).map(bt);return{text:l.join(" · "),art:a}};class $t extends Qe{static properties={...Qe.properties,_tick:{state:!0}};get defaults(){return at}get _seitAn(){const e=this.config||{};return!0===e.show_release_since&&!1!==e.show_release&&!!e.release_entity}_seitTimerPruefen(){const e=this.isConnected&&this._seitAn;e&&!this._seitTimer?(this._seitTimer=setInterval(()=>{this._tick=Date.now()},6e4),"function"==typeof this._seitTimer?.unref&&this._seitTimer.unref()):!e&&this._seitTimer&&(clearInterval(this._seitTimer),this._seitTimer=void 0)}connectedCallback(){super.connectedCallback(),this._seitTimerPruefen()}disconnectedCallback(){clearInterval(this._seitTimer),this._seitTimer=void 0,super.disconnectedCallback()}updated(e){super.updated?.(e),this._seitTimerPruefen()}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _freigabe(){const e=this.config||{};if(!1===e.show_release||!e.release_entity)return null;const t=this._ent(e.release_entity);if(!t)return null;const r=String(t.state).toLowerCase();return"unknown"===r||"unavailable"===r||""===r?null:ce(r)}get _releaseSchaltbar(){const e=this.config?.release_entity;return!!e&&!String(e).startsWith("binary_sensor.")}_onReleaseClick(e){e?.stopPropagation(),this._releaseSchaltbar&&this._call(this.config.release_entity,"toggle")}_renderRelease(){const e=this._freigabe,t=!1===e,r=null===e?"unbekannt":t?"gesperrt":"frei",i=this._releaseSchaltbar,s=null===e?"Freigabekontakt — Zustand unbekannt":i?t?"Freigabe geben (Kontakt schließen)":"Freigabe entziehen (Kontakt öffnen)":t?"Freigabekontakt offen — die Wärmepumpe ist gesperrt (nur Anzeige)":"Freigabekontakt geschlossen — die Wärmepumpe ist freigegeben (nur Anzeige)";return I`
      <div
        class="release-badge ${r} ${i?"schaltbar":"nur-anzeige"}"
        style="top:${this._v("release_top")}%; left:${this._v("release_left")}%; transform:translateX(-50%) scale(${(this._v("release_scale")??100)/100});"
        title="${s}"
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
        ${this._seitAn&&null!==e?I`<span class="release-seit"
              >${_e(this._ent(this.config.release_entity)?.last_changed)}</span
            >`:K}
      </div>
    `}get _target(){const e=this.config.target_entity,t=this._ent(e);if(!t)return null;const r=String(e).startsWith("climate."),i=he(r?t.attributes?.temperature:t.state);if(null===i)return null;const s=t.attributes||{};return{climate:r,value:i,min:r?s.min_temp??5:s.min??5,max:r?s.max_temp??40:s.max??40,step:this.config.target_step??(r?s.target_temp_step??.5:s.step??.5),unit:r?this.hass?.config?.unit_system?.temperature??"°C":s.unit_of_measurement??"°C"}}get _current(){const e=this.config.current_entity,t=this._ent(e);if(!t)return null;const r=String(e).startsWith("climate."),i=he(r?t.attributes?.current_temperature:t.state);return null===i?null:{value:i,unit:r?this.hass?.config?.unit_system?.temperature??"°C":t.attributes?.unit_of_measurement??"°C"}}get _modus(){const e=this.config||{};if(!1===e.show_mode||!e.mode_entity)return null;const t=this._ent(e.mode_entity);if(!t)return null;const r=String(e.mode_attribute||"").trim(),i=r?t.attributes?.[r]:t.state;return _t(i,e)}get _modusBadge(){const e=this.config||{};return!1!==e.show_mode&&!1!==e.show_mode_badge&&e.mode_entity?wt(this._ent(e.mode_entity),e)||{text:"—",art:null}:null}_renderModeBadge(e){const t=ct[e.art]||"";return I`
      <div
        class="mode-badge ${e.art||"neutral"}"
        style="top:${this._v("mode_top")}%; left:${this._v("mode_left")}%; transform:translateX(-50%) scale(${(this._v("mode_scale")??100)/100});${t?` --tt-mode-farbe:${t};`:""}"
        title="Betriebsmodus: ${e.text}"
      >
        <span class="mode-punkt"></span>
        <span class="val">${e.text}</span>
      </div>
    `}get _fanDur(){const e=this._modus;if(e)return nt(this._v(`mode_speed_${e.key}`));const t=Number(this._v("fan_speed"))||0;return t<=0?0:Math.max(.2,4-t/100*3.6)}get _fanFarbe(){if("modus"!==this._v("fan_color_mode"))return"";const e=this._modus;return e?ct[e.art]:""}get _fanActive(){if(!1===this._freigabe)return!1;const e=this.config.switch_entity;if(e&&this._ent(e)&&!this._isOn(e))return!1;const t=this.config.fan_source??"auto",r=this._ent(this.config.fan_entity);if("power"!==t&&r){const e=String(r.state).toLowerCase();if(ce(e))return!0;const t=he(e);return null!==t&&t>0}if("entity"===t)return!1;const i=this._watt(this.config.power_entity);return null!==i&&i>=Number(this._v("fan_power_threshold"))}_stepTarget(e){const t=this._target;if(!t||!this.hass)return;let r=Math.round((t.value+e*t.step)/t.step)*t.step;r=Math.min(t.max,Math.max(t.min,r)),r=Math.round(100*r)/100,r!==t.value&&(t.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:r}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:r}))}_targetUp(e){e?.stopPropagation(),this._stepTarget(1)}_targetDown(e){e?.stopPropagation(),this._stepTarget(-1)}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.target_entity||e.current_entity||e.release_entity))(e),r=!1!==e.show_fan,i=!1!==e.show_power_button&&!!e.switch_entity,s=!1!==e.show_release&&!!e.release_entity,n=!1!==e.show_power&&!!e.power_entity,o=!1!==e.show_target&&!!e.target_entity,a=!1!==e.show_current&&!!e.current_entity,l=e.label_text||"",c=this._modusBadge,h=this._fanDur,d=this._target,p=this._current;return this.renderSlot(I`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${r?this.renderFan({active:t&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:h,inactive:this._v("fan_inactive"),design:this._v("fan_design"),farbe:this._fanFarbe}):K}
        ${i?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):K}
        ${s?this._renderRelease():K}
        ${c?this._renderModeBadge(c):K}
        ${n?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):K}
        ${a?this.renderValueBox({value:null===p?"—":de(p.value,1)+" "+p.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:e.current_entity}):K}
        ${o?I`
              <div
                class="value-box target ${!1===this._v("target_box")?"no-bg":""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v("target_left")}%; transform:translateX(-50%) scale(${(this._v("target_scale")??100)/100});"
              >
                <div class="target-row">
                  <button
                    class="step"
                    ?disabled="${null===d}"
                    @click="${this._targetDown}"
                    title="Soll-Temperatur senken"
                  >
                    −
                  </button>
                  <div class="target-val">
                    <span class="val"
                      >${null===d?"—":de(d.value,1)+" "+d.unit}</span
                    >
                    ${!1===this._v("target_label")?K:I`<span class="unit">Soll</span>`}
                  </div>
                  <button
                    class="step"
                    ?disabled="${null===d}"
                    @click="${this._targetUp}"
                    title="Soll-Temperatur anheben"
                  >
                    +
                  </button>
                </div>
              </div>
            `:K}
        ${l?I`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
              >
                ${l}
              </div>
            `:K}
        ${this.renderConfirm("Wirklich stromlos schalten?")}
      </div>
      ${t?K:I`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[Xe,qe,n`
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
        background: var(--tt-box-bg);
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
        background: var(--tt-box-bg);
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
        background: var(--tt-box-bg);
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
    `]}customElements.define("tomtut-pool-slot-heatpump",$t);const vt={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80,glow_pulse:40},yt=300,xt=e=>{const t=Math.min(300,Math.max(0,isFinite(Number(e))?Number(e):0));return{puls:Math.min(1,t/100),boost:t>100?Math.round((t-100)/200*1e3)/1e3:0}};class kt extends Qe{get defaults(){return vt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const e=Number(this._v("glow_size"))||0,t=Number(this._v("glow_thickness"))||0;if(e<=0||t<=0)return K;const r=Math.round(e*Pe("uv")/t*1e3)/1e3,i=Number(this._v("glow_intensity")),s=Math.min(100,Math.max(0,isFinite(i)?i:80))/100,{puls:n,boost:o}=xt(this._v("glow_pulse")),a=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${e}%`,`aspect-ratio:${r}`,`opacity:${s}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`,"--glow-pulse:"+Math.round(100*n)/100,...o>0?[`--glow-boost:${o}`]:[]].join("; ");return I`<div class="glow ${n>0?"wabert":"ruhig"}" style="${a};"></div>`}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.temp_entity))(e),r=!1!==e.show_glow,i=!1!==e.show_power_button&&!!e.switch_entity,s=!1!==e.show_power&&!!e.power_entity,n=!1!==e.show_temp&&!!e.temp_entity;return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:K}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:r&&t&&this.leuchtet?this.renderGlow():K})}

        ${i?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):K}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):K}
        ${n?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):K}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${t?K:I`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[Xe,qe,n`
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
        inset: calc(-18% - var(--glow-boost, 0) * 45%) calc(-8% - var(--glow-boost, 0) * 8%);
        background: radial-gradient(
          ellipse at center,
          rgba(190, 160, 255, 0.75) 0%,
          rgba(130, 120, 255, 0.35) 45%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(calc(0.5em + var(--glow-boost, 0) * 0.5em))
          saturate(calc(1 + var(--glow-boost, 0) * 1.5));
        /* Zusatz-Schein nur mit Boost — bei 0 ist er unsichtbar (Radius und
           Deckkraft 0), der alte Look bleibt also exakt */
        box-shadow: 0 0 calc(var(--glow-boost, 0) * 0.9em) calc(var(--glow-boost, 0) * 0.15em)
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
            calc(0.97 - var(--glow-boost, 0) * 0.07),
            calc(0.94 - var(--glow-boost, 0) * 0.09)
          );
        }
        55% {
          opacity: calc(var(--glow-pulse, 0) * (0.7 + var(--glow-boost, 0) * 0.3));
          transform: scale(
            calc(1.03 + var(--glow-boost, 0) * 0.12),
            calc(1.08 + var(--glow-boost, 0) * 0.17)
          );
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * (0.95 + var(--glow-boost, 0) * 0.05));
          transform: scale(
            calc(1.06 + var(--glow-boost, 0) * 0.22),
            calc(1.14 + var(--glow-boost, 0) * 0.31)
          );
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .glow.wabert::before,
        .glow.wabert::after {
          animation: none;
        }
      }
    `]}customElements.define("tomtut-pool-slot-uv",kt);const St={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:86,arrow_in_left:8,arrow_in_size:12,arrow_out_top:12.5,arrow_out_left:91,arrow_out_size:12,temp_in_top:70,temp_in_left:14,temp_in_scale:105,temp_out_top:25,temp_out_left:72,temp_out_scale:105,power_bottom:8,power_left:42,power_scale:100,power_box:!0,power_label:!0};class zt extends Qe{get defaults(){return St}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(e){const t=Number(this._v(`arrow_${e}_size`));return t>0?I`<img
      class="flow-arrow flow-${e}"
      src="${Ee(Se[e])}"
      alt=""
      style="top:${this._v(`arrow_${e}_top`)}%; left:${this._v(`arrow_${e}_left`)}%; width:${t}%;"
    />`:K}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.temp_in_entity||e.temp_out_entity||e.power_entity))(e),r=!1!==e.show_power_button&&!!e.switch_entity,i=!1!==e.show_temp_in&&!!e.temp_in_entity,s=!1!==e.show_temp_out&&!!e.temp_out_entity,n=!1!==e.show_power&&!!e.power_entity,o=!1!==e.show_arrows;return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:K}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${o?I`${this.renderPfeil("in")}${this.renderPfeil("out")}`:K}

        ${r?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):K}
        ${i?this.renderThermo({value:ge(this._ent(e.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:e.temp_in_entity}):K}
        ${s?this.renderThermo({value:ge(this._ent(e.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:e.temp_out_entity}):K}
        ${n?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):K}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${t?K:I`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[Xe,qe,n`
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
    `]}customElements.define("tomtut-pool-slot-solar",zt);const At=["switch","light","input_boolean","fan","siren"];class Et extends Qe{get confirmDefault(){return!1}get powerEntityId(){return this._wartet?.entity||null}get powerConfirmText(){return`„${this._wartet?.label||fe(this._ent(this._wartet?.entity),this._wartet?.entity)}" wird ausgeschaltet.`}get _entries(){return(Array.isArray(this.config?.entries)?this.config.entries:[]).slice(0,3).filter(e=>e&&(e.entity||e.text||e.label))}get _align(){const e=this.config?.align;return["oben","mitte","unten"].includes(e)?e:"mitte"}_toggle(e){const t=e.entity;if(t&&At.includes(me(t)))return!0===e.confirm_off&&this._isOn(t)?(this._wartet=e,void(this._confirmOpen=!0)):void this._call(t,"toggle")}_renderEntry(e){const t=e.kind||(e.entity?"entity":"text");if("text"===t)return I`<div class="entry text">${e.text||e.label||""}</div>`;const r=this._ent(e.entity);if("button"===t){const t=!!r&&ce(r.state);return I`
        <button class="entry btn-entry ${t?"on":""}" @click="${()=>this._toggle(e)}">
          ${e.icon?I`<ha-icon icon="${e.icon}"></ha-icon>`:K}
          <span>${e.label||fe(r,e.entity)}</span>
        </button>
      `}return I`
      <div class="entry value" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${e.label||fe(r,e.entity)}</span>
        <span class="entry-value">${(e=>{if(!e)return"—";const t=he(e.state),r=e.attributes?.unit_of_measurement;return null!==t?de(t,Number.isInteger(t)?0:1)+(r?" "+r:""):String(e.state)+(r?" "+r:"")})(r)}</span>
      </div>
    `}render(){const e=this.config||{},t=this._entries;return this.renderSlot(I`
      <div class="custom align-${this._align}">
        ${e.title?I`<h3 class="slot-title">${e.title}</h3>`:K}
        ${t.length?t.map(e=>this._renderEntry(e)):I`<p class="slot-hint">Noch keine Einträge — im Editor bis zu drei hinzufügen.</p>`}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `)}static styles=[Xe,qe,n`
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
    `]}customElements.define("tomtut-pool-slot-custom",Et);class Pt extends Qe{static properties={...Qe.properties,slotType:{attribute:!1}};render(){const e=this.config||{},t=Be[this.slotType]||{},r=!1===t.ready?t.hint:e.hint||"";return this.renderSlot(I`
      ${e.title||e.label?I`<h3 class="slot-title">${e.title||e.label}</h3>`:K}
      ${r?I`<p class="slot-hint">${r}</p>`:K}
    `)}static styles=[Xe,qe]}customElements.define("tomtut-pool-slot-frame",Pt);const Bt={enabled:!0,fill:"transparent"};class Ct extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(e){if(!e||"object"!=typeof e)throw new Error("Ungültige Konfiguration");if(void 0!==e.slots&&!Array.isArray(e.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==e.hero&&("object"!=typeof e.hero||Array.isArray(e.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==e.version&&1!==Number(e.version))throw new Error(`Unbekannte Config-Version ${e.version} — diese Card kennt Version 1`);this._config={version:1,...e,hero:{enabled:!0,shape:we,...e.hero||{}},frame:{...Bt,...e.frame||{}},slots:Array.isArray(e.slots)?e.slots:[]}}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:we},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const e=this._config||{},t=(e.slots||[]).filter(e=>"hidden"!==(e?.type||"frame"));return(!1===e.hero?.enabled?0:6)+5*Math.ceil(t.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(e=>({...e||{},type:String(e?.type||"frame").toLowerCase()})).filter(e=>"hidden"!==e.type)}render(){if(!this._config)return K;const e=this._config,t=!1!==e.hero?.enabled,r=this.visibleSlots;return I`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${t?I`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${e.hero}"
                  .frame="${e.frame}"
                ></tomtut-pool-hero>`:K}
            ${r.map(e=>this._renderSlot(e))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(e){const t=this._config.frame;switch(Be[e.type]?.ready?e.type:"frame"){case"heatpump":return I`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return I`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-pump>`;case"uv":return I`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-uv>`;case"solar":return I`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-solar>`;case"custom":return I`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-custom>`;default:return I`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
          .slotType="${e.type}"
        ></tomtut-pool-slot-frame>`}}static styles=n`
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
  `}customElements.define("tomtut-pool-dashboard",Ct);const Tt=["ha-entity-picker","ha-icon-picker"];let Mt=null;const Lt=()=>"undefined"!=typeof customElements&&Tt.every(e=>!!customElements.get(e)),Nt=e=>"undefined"!=typeof customElements&&!!customElements.get(e);class Vt{constructor({hass:e,config:t,defaults:r={},update:i,idPrefix:s="f",stash:n=null}){this.hass=e,this.config=t||{},this.defaults=r,this.update=i,this.idPrefix=s,this.stash=n}val(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}raw(e){const t=this.config?.[e];return null==t?"":t}shown(e,t=!0){const r=this.config?.[e];return null==r?t:!1!==r}element(e,t,r=[],i=!0){const s=this.shown(t,i);return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${s}"
          @change="${e=>this._toggleElement(t,r,i,e.target.checked)}"
        />
      </div>
    `}_toggleElement(e,t,r,i){const s={},n=this.stash;if(i){s[e]=!0!==r||void 0;const t=n?.[`${this.idPrefix}:${e}`];t&&(Object.assign(s,t),delete n[`${this.idPrefix}:${e}`])}else{s[e]=!1;const r={};for(const e of t)void 0!==this.config?.[e]&&(r[e]=this.config[e]),s[e]=void 0;n&&Object.keys(r).length&&(n[`${this.idPrefix}:${e}`]=r)}this.update(s)}text(e,t,r="",i=""){return I`
      <label
        >${e}
        <input
          type="text"
          data-key="${t}"
          .value="${String(this.raw(t))}"
          placeholder="${i}"
          @input="${e=>this.update({[t]:e.target.value})}"
        />
        ${r?I`<small>${r}</small>`:K}
      </label>
    `}_entityOptions(e){const t=this.hass?.states??{};return Object.keys(t).filter(t=>!e.length||e.some(e=>t.startsWith(e+"."))).sort()}entity(e,t,r="",...i){return this._entityInput({label:e,hint:r,domains:i,value:String(this.raw(t)),dataKey:t,listId:`${this.idPrefix}-${t}`,onChange:e=>this.update({[t]:e||void 0})})}entityAt(e,t,r,i="",...s){const n=Array.isArray(this.config?.[t])?this.config[t]:[];return this._entityInput({label:e,hint:i,domains:s,value:String(n[r]??""),dataKey:`${t}.${r}`,listId:`${this.idPrefix}-${t}-${r}`,onChange:e=>this._updateList(t,r,e)})}_entityInput({label:e,hint:t,domains:r,value:i,dataKey:s,listId:n,onChange:o}){return Nt("ha-entity-picker")?I`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${i}"
          .label="${e}"
          .helper="${t}"
          .includeDomains="${r.length?r:void 0}"
          data-key="${s}"
          allow-custom-entity
          @value-changed="${e=>{e.stopPropagation(),o(e.detail?.value??"")}}"
        ></ha-entity-picker>
      `:I`
      <label
        >${e}
        <input
          type="text"
          list="${n}"
          data-key="${s}"
          .value="${i}"
          placeholder="${"Entity auswählen …"}"
          @input="${e=>o(e.target.value)}"
          @change="${e=>o(e.target.value)}"
        />
        <datalist id="${n}">
          ${this._entityOptions(r).map(e=>I`<option value="${e}"></option>`)}
        </datalist>
        ${t?I`<small>${t}</small>`:K}
      </label>
    `}_updateList(e,t,r){const i=Array.isArray(this.config?.[e])?[...this.config[e]]:[];for(;i.length<=t;)i.push("");for(i[t]=r;i.length&&!i[i.length-1];)i.pop();this.update({[e]:i.length?i:void 0})}icon(e,t,r=""){return Nt("ha-icon-picker")?I`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(t))}"
          .label="${e}"
          .helper="${r}"
          data-key="${t}"
          @value-changed="${e=>{e.stopPropagation(),this.update({[t]:e.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(e,t,r,"mdi:lightbulb")}select(e,t,r,i){const s=this.config?.[t]??i;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <select data-key="${t}" @change="${e=>this.update({[t]:e.target.value})}">
          ${r.map(([e,t])=>I`<option value="${e}" ?selected="${s===e}">${t}</option>`)}
        </select>
      </div>
    `}slider(e,t,r,i,s="%",n=1){const o=this.val(t),a=null==o||""===o?r:o;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="range"
          min="${r}"
          max="${i}"
          step="${n}"
          data-key="${t}"
          .value="${String(a)}"
          @input="${e=>this.update({[t]:parseFloat(e.target.value)})}"
        />
        <span class="row-val">${a}${s}</span>
      </div>
    `}toggle(e,t,r){const i=this.config?.[t]??r;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${i}"
          @change="${e=>this.update({[t]:e.target.checked})}"
        />
      </div>
    `}}const Ot=(e,t,r=!1)=>I`
  <details class="section" ?open="${r}">
    <summary>${e}</summary>
    <div class="section-body">${t}</div>
  </details>
`,Dt=e=>I`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${e}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`,Wt=n`
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
`,Rt=["switch","input_boolean","light"],Ht=["sensor","input_number"],It=["sensor","input_number","number"],Ut=["climate","number","input_number","sensor"],Kt=["sensor","select","input_select","climate"],Ft=["switch","input_boolean","binary_sensor"],Gt=(e,t=!0,r="Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung.")=>I`
  ${e.toggle("Vor dem Ausschalten nachfragen","confirm_off",t)}
  <small>${r}</small>
`,jt=(e,t,r,i,s)=>e.shown(i,s)?Ot(`${t} — Größe und Lage`,I`
          ${e.slider("Größe",`${r}_size`,2,30,"%",.5)}
          ${e.slider("Von oben",`${r}_top`,0,100,"%",.5)}
          ${e.slider("Von links",`${r}_left`,0,100,"%",.5)}
          <small>Die Größe ist die Breite in Prozent der Beckenbreite.</small>
        `):K,Zt=e=>{const t=((e,t={})=>{const r=t.mode_entity,i=r?e?.states?.[r]:null;if(!i)return null;const s=String(t.mode_attribute||"").trim(),n=s?i.attributes?.[s]:i.state,o=i.attributes||{},a=Array.isArray(o.options)?o.options:"preset_mode"===s&&Array.isArray(o.preset_modes)?o.preset_modes:!s&&Array.isArray(o.hvac_modes)?o.hvac_modes:[];return{roh:n??"",modus:_t(n,t),optionen:a.map(e=>({wert:String(e),modus:_t(e,t)}))}})(e.hass,e.config),r=t?I`<div class="modus-befund ${t.modus?"ok":"nein"}">
        Deine Pumpe meldet gerade: <b>${String(t.roh)||"—"}</b> →
        ${t.modus?I`erkannt als <b>${t.modus.label}</b> ✓`:I`nicht erkannt ✗ – bitte unten zuordnen`}
      </div>`:I`<div class="modus-befund">Wähle oben die Modus-Entity — dann steht hier, was sie meldet.</div>`,i=t&&t.optionen.length?I`<div class="modus-optionen">
          <small>Die Entity kennt diese Werte (automatisch zugeordnet):</small>
          <ul>
            ${t.optionen.map(e=>I`<li class="${e.modus?"ok":"nein"}">
                  ${e.wert} → ${e.modus?I`${e.modus.label} ✓`:I`nicht erkannt ✗`}
                </li>`)}
          </ul>
        </div>`:K;return Ot("Erweitert: Modus-Namen anpassen",I`
      ${r} ${i}
      ${lt.map(t=>e.text(t.label,`mode_map_${t.key}`,"",t.zustaende.join(", ")))}
      <small>
        Normalerweise nicht nötig: Werte mit Heizen/Kühlen und einer Stufe (Silent, Smart/Eco,
        Auto, Boost/Power/Turbo) erkennt die Card selbst, auch ohne Umlaute geschrieben. Nur
        wenn oben etwas „nicht erkannt" ist: hier die Zustände als Kommaliste eintragen. Eine
        eigene Liste ersetzt für diesen Modus Vorgabe und Automatik. Leer = Vorgabe (grau).
      </small>
    `,!!t&&!t.modus&&""!==String(t.roh)&&!["unknown","unavailable"].includes(String(t.roh)))},Qt={heatpump:at,pump:rt,uv:vt,solar:St},Xt=(e,t)=>{const r={...e||{}};for(const[e,i]of Object.entries(t||{}))void 0===i?delete r[e]:r[e]=i;return r};class qt extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),(Lt()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(Mt||(Mt=(async()=>{try{const e=await window.loadCardHelpers(),t=await(e?.createCardElement?.({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",e?.message||e)}return Lt()})()),Mt)).then(e=>{e&&this.requestUpdate()})}setConfig(e){this._config={version:1,hero:{enabled:!0,shape:we},frame:{enabled:!0,fill:"transparent"},slots:[],...e||{}}}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_updateHero(e){this._emit({...this._config,hero:Xt(this._config.hero,e)})}_updateFrame(e){this._emit({...this._config,frame:Xt(this._config.frame,e)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_updateSlot(e,t){const r=this._slots().map((r,i)=>i===e?Xt(r,t):r);this._emit({...this._config,slots:r})}_updateEntry(e,t,r){const i=this._slots()[e]||{},s=Array.isArray(i.entries)?[...i.entries]:[];for(;s.length<=t;)s.push({});s[t]=Xt(s[t],r),this._updateSlot(e,{entries:s})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(e){this._emit({...this._config,slots:this._slots().filter((t,r)=>r!==e)})}_moveSlot(e,t){const r=[...this._slots()],i=e+t;if(i<0||i>=r.length)return;const[s]=r.splice(e,1);r.splice(i,0,s),this._emit({...this._config,slots:r})}_fieldsFor(e){const t=this._slots()[e]||{};return new Vt({hass:this.hass,config:t,defaults:Qt[t.type]||{},update:t=>this._updateSlot(e,t),idPrefix:`slot${e}`,stash:this._stash})}_altTypOption(e){const t=Be[e];return t&&!1===t.waehlbar?I`<option value="${e}" selected>${t.label}</option>`:K}_slotKopf(e,t){const r=Be[e?.type]?.label||Be.frame.label,i=String(e?.label||e?.label_text||e?.title||"").trim();return`Kasten ${t+1} · ${r}${i?` · ${i}`:""}`}_slotBody(e){const t=this._slots()[e]||{},r=this._fieldsFor(e);switch(t.type){case"heatpump":return(e=>I`
  ${Dt(I`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("🔌 Freigabekontakt","show_release",["release_entity","release_top","release_left","release_scale","show_release_since"],!1)}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_top","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Ist-Temperatur","show_current",["current_entity","current_bottom","current_left","current_scale","current_box","current_label"])}
    ${e.element("🎚 Soll-Temperatur","show_target",["target_entity","target_bottom","target_left","target_scale","target_step","target_box","target_label"])}
    ${e.element("🌀 Lüfter","show_fan",["fan_source","fan_entity","fan_power_threshold","fan_speed","fan_top","fan_left","fan_size","fan_ratio","fan_inactive","fan_design","fan_color_mode"])}
    ${e.element("🔁 Betriebsmodus","show_mode",["mode_entity","mode_attribute","show_mode_badge","mode_top","mode_left","mode_scale",...lt.flatMap(e=>[`mode_speed_${e.key}`,`mode_map_${e.key}`])],!1)}
  `)}
  ${e.shown("show_power_button")?I`
        ${e.entity("Powerbutton — Schalter","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",...Rt)}
        ${Gt(e)}
        ${Ot("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_release",!1)?I`
        ${e.entity("Freigabekontakt — Entity","release_entity","Der potentialfreie Eingang der Wärmepumpe: offen = sie darf nicht laufen, geschlossen = freigegeben.",...Ft)}
        <small>
          Damit sperrt oder gibt man die Wärmepumpe von außen frei (PV-Überschuss, Zeitfenster) —
          ohne an ihren eigenen Einstellungen zu drehen. Ist der Kontakt offen, zeigt die Karte
          „Gesperrt" und der Lüfter steht still, auch wenn der Schalter an ist. Ein binary_sensor
          wird nur angezeigt, switch und input_boolean schalten per Klick um.
        </small>
        ${Ot("Freigabekontakt — Position",I`
            ${e.slider("Von oben","release_top",0,100,"%",.5)}
            ${e.slider("Von links","release_left",0,100,"%",.5)}
            ${e.slider("Größe","release_scale",50,200)}
          `)}
        ${e.toggle("Zeit seit dem letzten Wechsel anzeigen","show_release_since",!1)}
        <small>Klein unter dem Badge, z.B. „seit 2 Std 10 Min" — läuft minütlich mit.</small>
      `:K}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch — Sensor","power_entity","Leistungssensor in W oder kW (z.B. Shelly).",...Ht)}
        ${Ot("Stromverbrauch — Darstellung",I`
            ${e.slider("Von oben","power_top",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:K}
  ${e.shown("show_current")?I`
        ${e.entity("Ist-Temperatur","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.",...Ut)}
        ${Ot("Ist-Temperatur — Darstellung",I`
            ${e.slider("Von unten","current_bottom",0,100)}
            ${e.slider("Von links","current_left",0,100)}
            ${e.slider("Größe","current_scale",50,150)}
            ${e.toggle("Box anzeigen","current_box",!0)}
            ${e.toggle("Label anzeigen","current_label",!0)}
          `)}
      `:K}
  ${e.shown("show_target")?I`
        ${e.entity("Soll-Temperatur","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",...Ut)}
        ${Ot("Soll-Temperatur — Darstellung",I`
            ${e.slider("Von unten","target_bottom",0,100)}
            ${e.slider("Von links","target_left",0,100)}
            ${e.slider("Größe","target_scale",50,150)}
            ${e.slider("Schrittweite","target_step",.1,5,"",.1)}
            ${e.toggle("Box anzeigen","target_box",!0)}
            ${e.toggle("Label anzeigen","target_label",!0)}
          `)}
      `:K}
  ${e.shown("show_fan")?I`
        ${Ot("Lüfter — wann dreht er?",I`
            ${e.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
            ${e.entity("Lüfter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
            ${e.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
            ${e.slider("Drehgeschwindigkeit","fan_speed",0,100)}
            <small>
              Ist der Schalter der Wärmepumpe aus, steht der Lüfter immer. Mit erkanntem
              Betriebsmodus gilt statt der Drehgeschwindigkeit das Tempo des Modus.
            </small>
          `,!0)}
        ${Ot("Lüfter — Aussehen",I`
            ${e.select("Blatt-Design","fan_design",Object.entries(je).map(([e,t])=>[e,t.label]),"klassisch")}
            ${e.select("Farbe","fan_color_mode",[["neutral","Schwarz/Weiß (wie die Schrift)"],["modus","Nach Modus: Heizen rot, Kühlen blau"]],"neutral")}
            <small>Die Färbung nach Modus braucht einen erkannten Betriebsmodus.</small>
          `)}
        ${Ot("Lüfter — Position",I`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Breite","fan_size",5,80,"%",.5)}
            ${e.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          `)}
      `:K}
  ${e.shown("show_mode",!1)?I`
        ${e.entity("Betriebsmodus — Entity","mode_entity","sensor, select, input_select oder climate — liefert den Modus der Wärmepumpe.",...Kt)}
        ${e.text("Attribut (optional)","mode_attribute","Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.","z.B. preset_mode")}
        ${Ot("Betriebsmodus — Anzeige auf der Card",I`
            ${e.toggle("Modus als Badge anzeigen","show_mode_badge",!0)}
            ${e.slider("Von oben","mode_top",0,100,"%",.5)}
            ${e.slider("Von links","mode_left",0,100,"%",.5)}
            ${e.slider("Größe","mode_scale",50,200)}
            <small>
              Klartext wie Heizen, Kühlen, Auto, Aus — bei climate.* mit Preset (z.B.
              Heizen · Eco). Unbekannte Werte erscheinen unübersetzt. Farbe wie das Rad.
            </small>
          `)}
        ${Ot("Betriebsmodus — Tempo je Modus",I`
            ${lt.map(t=>e.slider(t.label,`mode_speed_${t.key}`,1,st,"",1))}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${Zt(e)}
      `:K}
  ${e.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Wärmepumpe")}
  ${Ot("Freitext — Darstellung",I`
      ${e.slider("Von oben","label_top",0,100)}
      ${e.slider("Von links","label_left",0,100)}
      ${e.slider("Größe","label_scale",50,200)}
      ${e.toggle("Box anzeigen","label_box",!0)}
    `)}
`)(r);case"pump":return(e=>I`
  ${Dt(I`
    ${e.element("🎚 Stufen-Taster","show_stages",["stage_mode","stage_entities","stop_entity","stage_labels"])}
    ${e.element("⏻ Powerbutton","show_power_button",["main_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label","stage_from_power","stage_watt_1","stage_watt_2","stage_watt_3"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("🌀 Laufrad","show_fan",["fan_top","fan_left","fan_size","fan_speed_1","fan_speed_2","fan_speed_3","fan_inactive","idle_watt"])}
  `)}
  ${e.text("Überschrift (optional)","label","","z.B. Poolpumpe")}
  ${e.shown("show_stages")?I`
        ${e.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
        ${e.entityAt("Stufe 1 (N1)","stage_entities",0,"",...Rt)}
        ${e.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"",...Rt)}
        ${e.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"",...Rt)}
        ${e.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...Rt)}
      `:K}
  ${e.shown("show_power_button")?I`
        ${e.entity("Hauptschalter","main_entity","Steckdose/Relais der Pumpe — Powerbutton.",...Rt)}
        ${Gt(e)}
        ${Ot("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...Ht)}
        ${Ot("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
        ${e.raw("power_entity")?Ot("Stufe aus Leistung erkennen",I`
                ${e.toggle("Stufe aus Leistung erkennen","stage_from_power",!0)}
                ${!1!==e.val("stage_from_power")?I`
                      ${e.slider("N1 ab mehr als","stage_watt_1",0,300," W",1)}
                      ${e.slider("N2 ab mehr als","stage_watt_2",0,1500," W",5)}
                      ${e.slider("N3 ab mehr als","stage_watt_3",0,3e3," W",5)}
                    `:K}
                <small>
                  Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon
                  nichts — die Leistung schon. Unter der N1-Schwelle gilt die Pumpe als aus.
                  Die erkannte Stufe leuchtet und bestimmt das Tempo des Laufrads; die
                  Taster bleiben bedienbar.
                </small>
              `):K}
      `:K}
  ${e.shown("show_temp")?I`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...It)}
        ${Ot("Thermometer — Position",I`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_fan")?I`
        ${Ot("Laufrad — Tempo",I`
            ${e.slider("Tempo N1","fan_speed_1",1,st,"",1)}
            ${e.slider("Tempo N2","fan_speed_2",1,st,"",1)}
            ${e.slider("Tempo N3","fan_speed_3",1,st,"",1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${Ot("Laufrad — Position",I`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Größe","fan_size",3,60,"%",.5)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `)}
        ${Ot("Wann steht die Pumpe?",I`
            ${e.slider("Ruhewatt","idle_watt",0,200," W",1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).
              Bei „Stufe aus Leistung erkennen" gilt stattdessen die N1-Schwelle.</small>
          `)}
      `:K}
`)(r);case"uv":return(e=>I`
  ${Dt(I`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("💡 Glüheffekt","show_glow",["glow_top","glow_left","glow_size","glow_thickness","glow_angle","glow_intensity","glow_pulse"])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${e.text("Überschrift (optional)","label","","z.B. UV-C-Lampe")}
  ${e.shown("show_power_button")?I`
        ${e.entity("Powerbutton — Schalter","switch_entity","Steckdose/Relais der Lampe.",...Rt)}
        ${Gt(e)}
        ${Ot("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...Ht)}
        ${Ot("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:K}
  ${e.shown("show_temp")?I`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...It)}
        ${Ot("Thermometer — Position",I`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_glow")?Ot("Glüheffekt — Lage auf dem Rohr",I`
          ${e.slider("Von oben","glow_top",0,100,"%",.5)}
          ${e.slider("Von links","glow_left",0,100,"%",.5)}
          ${e.slider("Länge","glow_size",5,100,"%",.5)}
          ${e.slider("Dicke","glow_thickness",2,60,"%",.5)}
          ${e.slider("Neigung","glow_angle",-90,90,"°",1)}
          ${e.slider("Leuchtstärke","glow_intensity",10,100)}
          ${e.slider("Wabern / Glimmen","glow_pulse",0,300)}
          <small>
            Leuchtet nur, solange der Schalter an ist. „Wabern" lässt den Schein sanft
            atmen — 0 = ruhig und statisch, bis 100 sanft, darüber bis 300 richtig kräftig
            (größerer Hof, schnellerer Puls). Wer im System „Bewegung reduzieren" eingestellt
            hat, sieht ihn immer ruhig.
          </small>
        `):K}
  ${Ot("Bild — Drehen, Spiegeln, Größe, Anschlussvariante",I`
      ${e.slider("Drehen","rotate",0,359,"°",1)}
      ${e.toggle("Waagrecht spiegeln","mirror",!1)}
      ${e.slider("Größe","uv_size",30,Re)}
      ${e.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `)}
`)(r);case"solar":return(e=>I`
  ${Dt(I`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("🌡 Vorlauf (oben, ins Feld)","show_temp_in",["temp_in_entity","temp_in_top","temp_in_left","temp_in_scale"])}
    ${e.element("🌡 Rücklauf (unten, ins Becken)","show_temp_out",["temp_out_entity","temp_out_top","temp_out_left","temp_out_scale"])}
    ${e.element("➡ Richtungspfeile","show_arrows",["arrow_in_top","arrow_in_left","arrow_in_size","arrow_out_top","arrow_out_left","arrow_out_size"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
  `)}
  <small>
    Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
    Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt. Das Bild zeigt ein Feld aus
    drei Absorbern; der blaue Pfeil links unten ist der Zulauf, der rote rechts oben der Rücklauf.
  </small>
  ${e.text("Überschrift (optional)","label","","z.B. Solarheizung")}
  ${e.shown("show_power_button")?I`
        ${e.entity("Powerbutton — Ventil oder Pumpe","switch_entity","Solarventil oder Solarpumpe.",...Rt)}
        ${Gt(e)}
        ${Ot("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_temp_in")?I`
        ${e.entity("Vorlauf-Temperatur","temp_in_entity","Wasser, das zum Absorber läuft — Zulauf links unten (blauer Pfeil).",...It)}
        ${Ot("Vorlauf — Position",I`
            ${e.slider("Von oben","temp_in_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_in_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_in_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_temp_out")?I`
        ${e.entity("Rücklauf-Temperatur","temp_out_entity","Wasser, das zurück ins Becken läuft — Ablauf rechts oben (roter Pfeil).",...It)}
        ${Ot("Rücklauf — Position",I`
            ${e.slider("Von oben","temp_out_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_out_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_out_scale",50,200)}
          `)}
      `:K}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","Solarpumpe in W oder kW.",...Ht)}
        ${Ot("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:K}
  ${e.shown("show_arrows")?Ot("Richtungspfeile — Lage",I`
          ${e.slider("Zulauf (blau) — Von oben","arrow_in_top",0,100,"%",.5)}
          ${e.slider("Zulauf (blau) — Von links","arrow_in_left",0,100,"%",.5)}
          ${e.slider("Zulauf (blau) — Größe","arrow_in_size",2,20,"%",.5)}
          ${e.slider("Rücklauf (rot) — Von oben","arrow_out_top",0,100,"%",.5)}
          ${e.slider("Rücklauf (rot) — Von links","arrow_out_left",0,100,"%",.5)}
          ${e.slider("Rücklauf (rot) — Größe","arrow_out_size",2,20,"%",.5)}
          <small>
            Beide Pfeile zeigen nach rechts: links unten läuft kaltes Wasser ins Feld, rechts
            oben warmes heraus. Sie sind reine Beschriftung und ändern sich nie.
          </small>
        `):K}
`)(r);case"custom":return((e,t)=>I`
  ${e.text("Überschrift (optional)","title","","z.B. Wetter")}
  ${e.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"mitte")}
  ${[0,1,2].map(e=>Ot(`Eintrag ${e+1}`,t(e),0===e))}
`)(r,r=>(e=>I`
  ${e.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===e.config?.kind?e.text("Text","text","","z.B. Sommerbetrieb"):I`
        ${e.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate")}
        ${e.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===e.config?.kind?e.icon("Icon (optional)","icon"):K}
        ${"button"===e.config?.kind?Gt(e,!1,"An = vor dem Ausschalten kommt eine Rückfrage."):K}
      `}
`)(new Vt({hass:this.hass,config:(Array.isArray(t.entries)?t.entries:[])[r]||{},update:t=>this._updateEntry(e,r,t),idPrefix:`slot${e}e${r}`,stash:this._stash})));case"hidden":return I`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;default:return(e=>I`
  ${e.text("Überschrift (optional)","title","","z.B. Platzhalter")}
  ${e.text("Hinweistext (optional)","hint","","")}
`)(r)}}render(){if(!this._config)return K;const e=this._config.hero||{},t=this._config.frame||{},r=new Vt({hass:this.hass,config:e,defaults:et(e.shape),update:e=>this._updateHero(e),idPrefix:"hero",stash:this._stash}),i=new Vt({hass:this.hass,config:t,update:e=>this._updateFrame(e),idPrefix:"frame",stash:this._stash}),s=this._slots();return I`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        <div class="slot-block becken-block" style="--slot-farbe:${Me("hero")};">
          <div class="slot-ueberschrift">Becken</div>
          <div class="slot-card becken-card">
            ${r.toggle("Becken anzeigen","enabled",!0)}
            ${!1===e.enabled?K:(e=>I`
  ${Dt(I`
    ${e.element("🌡 Thermometer","show_thermo",["temp_entity","thermo_scale","thermo_top","thermo_left"])}
    ${e.element("🧪 pH-Kästchen","show_ph",["ph_entity","ph_top","ph_left"])}
    ${e.element("⚗ Redox / RX-Kästchen","show_rx",["rx_entity","rx_top","rx_left"])}
    ${e.element("🛟 Skimmer","show_skimmer",["skimmer_size","skimmer_top","skimmer_left"])}
    ${e.element("💦 Einlaufdüse","show_inlet",["inlet_size","inlet_top","inlet_left","inlet_temp_entity","inlet_temp_top","inlet_temp_left"])}
    ${e.element("⚓ Bodenablauf","show_drain",["drain_size","drain_top","drain_left"],!1)}
  `)}
  ${e.select("Beckenform","shape",Object.entries(be).map(([e,t])=>[e,t.label]),"oval")}
  ${e.shown("show_thermo")?I`
        ${e.entity("Wassertemperatur","temp_entity","Zeigt das Thermometer auf der Wasserfläche.",...It)}
        ${Ot("Thermometer — Position",I`
            ${e.slider("Größe","thermo_scale",50,200)}
            ${e.slider("Von oben","thermo_top",0,100,"%",.5)}
            ${e.slider("Von links","thermo_left",0,100,"%",.5)}
          `)}
      `:K}
  ${e.shown("show_ph")?I`
        ${e.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...It)}
        ${Ot("pH — Position",I`
            ${e.slider("Von oben","ph_top",0,100,"%",.5)}
            ${e.slider("Von links","ph_left",0,100,"%",.5)}
          `)}
      `:K}
  ${e.shown("show_rx")?I`
        ${e.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...It)}
        ${Ot("RX — Position",I`
            ${e.slider("Von oben","rx_top",0,100,"%",.5)}
            ${e.slider("Von links","rx_left",0,100,"%",.5)}
          `)}
      `:K}
  ${jt(e,"Skimmer","skimmer","show_skimmer",!0)}
  ${jt(e,"Einlaufdüse","inlet","show_inlet",!0)}
  ${e.shown("show_inlet",!0)?I`
        ${e.entity("Temperatur am Einlauf (optional)","inlet_temp_entity","Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",...It)}
        ${e.raw("inlet_temp_entity")?Ot("Einlauf-Temperatur — Position",I`
                ${e.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
                ${e.slider("Von links","inlet_temp_left",0,100,"%",.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `):K}
      `:K}
  ${jt(e,"Bodenablauf","drain","show_drain",!1)}
  ${e.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${e.raw("label_text")?Ot("Freitext — Darstellung",I`
          ${e.slider("Größe","label_scale",50,200)}
          ${e.slider("Von oben","label_top",0,100,"%",.5)}
          ${e.slider("Von links","label_left",0,100,"%",.5)}
        `):K}
  ${e.toggle("Becken mit Rahmen","framed",!1)}
`)(r)}
          </div>
        </div>

        <div class="step-head">Schritt 2 — Geräte</div>
        ${s.map((e,t)=>I`
            <div class="slot-block" style="--slot-farbe:${Me(e.type)};">
              <div class="slot-ueberschrift">${this._slotKopf(e,t)}</div>
              <div class="slot-card">
                <div class="slot-head">
                  <div class="row">
                    <span class="row-label">Typ</span>
                    <select
                      data-key="type"
                      @change="${e=>this._updateSlot(t,{type:e.target.value})}"
                    >
                      ${this._altTypOption(e.type)}
                      ${Ne().map(t=>t.trenner?I`<option disabled data-trenner>${t.label}</option>`:I`
                              <option
                                value="${t.value}"
                                ?selected="${(e.type||"frame")===t.value}"
                              >
                                ${t.label}
                              </option>
                            `)}
                    </select>
                  </div>
                  <button
                    class="icon-btn"
                    title="nach oben"
                    @click="${()=>this._moveSlot(t,-1)}"
                  >
                    ↑
                  </button>
                  <button class="icon-btn" title="nach unten" @click="${()=>this._moveSlot(t,1)}">
                    ↓
                  </button>
                  <button
                    class="icon-btn danger"
                    title="entfernen"
                    @click="${()=>this._removeSlot(t)}"
                  >
                    ✕
                  </button>
                </div>
                ${this._slotBody(t)}
              </div>
            </div>
          `)}
        <button class="add-btn" @click="${()=>this._addSlot()}">+ Slot hinzufügen</button>

        <div class="step-head">Schritt 3 — Optik</div>
        ${i.toggle("Rahmen um die Slots","enabled",!0)}
        ${i.select("Füllung","fill",[["transparent","Transparent (Theme)"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        <small>
          Die Füllung gilt für den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und
          Schriftfarbe. Transparent nimmt den Hintergrund des HA-Themes.
        </small>
      </div>
    `}static styles=[Wt]}customElements.define("tomtut-pool-dashboard-editor",qt),
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
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{Ae as ASSET_VERSION,Te as BLOCK_FARBEN,ve as DEVICE_IMAGES,ke as DEVICE_RATIOS,xe as DEVICE_VARIANTS,je as FAN_DESIGNS,Ze as FAN_DESIGN_DEFAULT,Se as FLOW_MARKERS,yt as GLOW_PULSE_MAX,Re as GROESSE_MAX,We as GROESSE_MIN,at as HEATPUMP_DEFAULTS,Ye as HERO_DEFAULTS,ye as HERO_SPRITES,lt as HP_MODES,Je as INLET_TEMP_VERSATZ,ct as MODE_FARBEN,mt as MODE_WOERTER,rt as PUMP_DEFAULTS,be as SHAPES,Ce as SLOT_GRAU,Be as SLOT_TYPES,Le as SLOT_TYPE_GROUPS,St as SOLAR_DEFAULTS,Ct as TomtutPoolDashboardCard,qt as TomtutPoolDashboardEditor,vt as UV_DEFAULTS,Xt as applyPatch,Ie as bildTransform,nt as fanDuration,xt as glowPulsWerte,He as groesseFaktor,et as heroDefaultsFor,Ee as imagePath,ut as modeAuto,wt as modeBadge,_t as modeFromState,bt as modeWort,Ve as normGrad,he as numOf,ge as numText,De as passFaktor,ue as seit,_e as seitMinuten,Me as slotFarbe,Ne as slotTypeOptions,it as stageFromWatt,pe as toWatt};
