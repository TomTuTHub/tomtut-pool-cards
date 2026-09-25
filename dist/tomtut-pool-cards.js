const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(e,t,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=s.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&s.set(i,e))}return e}toString(){return this.cssText}};const n=(e,...t)=>{const s=1===e.length?e[0]:t.reduce((t,i,s)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[s+1],e[0]);return new r(s,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new r("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,m=u.trustedTypes,f=m?m.emptyScript:"",_=u.reactiveElementPolyfillSupport,g=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!a(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(e,i,t);void 0!==s&&l(this.prototype,e,s)}}static getPropertyDescriptor(e,t,i){const{get:s,set:r}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:s,set(t){const n=s?.call(this);r?.call(this,t),this.requestUpdate(e,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...h(e),...d(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(t)i.adoptedStyleSheets=s.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of s){const s=document.createElement("style"),r=e.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=t.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),s=this.constructor._$Eu(e,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,s=i._$Eh.get(e);if(void 0!==s&&this._$Em!==s){const e=i.getPropertyOptions(s),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=s;const n=r.fromAttribute(t,e.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(e,t,i,s=!1,r){if(void 0!==e){const n=this.constructor;if(!1===s&&(r=this[e]),i??=n.getPropertyOptions(e),!((i.hasChanged??w)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(n._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,n??t??this[e]),!0!==r||void 0!==n)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===s&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,s=this[t];!0!==e||this._$AL.has(t)||void 0===s||this.C(t,void 0,i,s)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[g("elementProperties")]=new Map,v[g("finalized")]=new Map,_?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");const y=globalThis,k=e=>e,x=y.trustedTypes,z=x?x.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,B=`<${E}>`,P=document,C=()=>P.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,L="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,W=/-->/g,N=/>/g,D=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,K=/"/g,H=/^(?:script|style|textarea|title)$/i,R=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),I=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),U=new WeakMap,G=P.createTreeWalker(P,129);function j(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,s=[];let r,n=2===t?"<svg>":3===t?"<math>":"",o=O;for(let t=0;t<i;t++){const i=e[t];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===O?"!--"===l[1]?o=W:void 0!==l[1]?o=N:void 0!==l[2]?(H.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=r??O,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?D:'"'===l[3]?K:V):o===K||o===V?o=D:o===W||o===N?o=O:(o=D,r=void 0);const d=o===D&&e[t+1].startsWith("/>")?" ":"";n+=o===O?i+B:c>=0?(s.push(a),i.slice(0,c)+S+i.slice(c)+A+d):i+A+(-2===c?t:d)}return[j(e,n+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),s]};class Q{constructor({strings:e,_$litType$:t},i){let s;this.parts=[];let r=0,n=0;const o=e.length-1,a=this.parts,[l,c]=Z(e,t);if(this.el=Q.createElement(l,i),G.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const e of s.getAttributeNames())if(e.endsWith(S)){const t=c[n++],i=s.getAttribute(e).split(A),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?ie:Y}),s.removeAttribute(e)}else e.startsWith(A)&&(a.push({type:6,index:r}),s.removeAttribute(e));if(H.test(s.tagName)){const e=s.textContent.split(A),t=e.length-1;if(t>0){s.textContent=x?x.emptyScript:"";for(let i=0;i<t;i++)s.append(e[i],C()),G.nextNode(),a.push({type:2,index:++r});s.append(e[t],C())}}}else if(8===s.nodeType)if(s.data===E)a.push({type:2,index:r});else{let e=-1;for(;-1!==(e=s.data.indexOf(A,e+1));)a.push({type:7,index:r}),e+=A.length-1}r++}}static createElement(e,t){const i=P.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,s){if(t===I)return t;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=T(t)?void 0:t._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(e),r._$AT(e,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(t=X(e,r._$AS(e,t.values),r,s)),t}class q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,s=(e?.creationScope??P).importNode(t,!0);G.currentNode=s;let r=G.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let t;2===a.type?t=new J(r,r.nextSibling,this,e):1===a.type?t=new a.ctor(r,a.name,a.strings,this,e):6===a.type&&(t=new se(r,this,e)),this._$AV.push(t),a=i[++o]}n!==a?.index&&(r=G.nextNode(),n++)}return G.currentNode=P,s}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),T(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==I&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(P.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,s="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(j(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(t);else{const e=new q(s,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=U.get(e.strings);return void 0===t&&U.set(e.strings,t=new Q(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,s=0;for(const r of e)s===t.length?t.push(i=new J(this.O(C()),this.O(C()),this,this.options)):i=t[s],i._$AI(r),s++;s<t.length&&(this._$AR(i&&i._$AB.nextSibling,s),t.length=s)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,s,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,s){const r=this.strings;let n=!1;if(void 0===r)e=X(this,e,t,0),n=!T(e)||e!==this._$AH&&e!==I,n&&(this._$AH=e);else{const s=e;let o,a;for(e=r[0],o=0;o<r.length-1;o++)a=X(this,s[i+o],t,o),a===I&&(a=this._$AH[o]),n||=!T(a)||a!==this._$AH[o],a===F?e=F:e!==F&&(e+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class te extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ie extends Y{constructor(e,t,i,s,r){super(e,t,i,s,r),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??F)===I)return;const i=this._$AH,s=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class se{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const re=y.litHtmlPolyfillSupport;re?.(Q,J),(y.litHtmlVersions??=[]).push("3.3.3");const ne=globalThis;class oe extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const s=i?.renderBefore??t;let r=s._$litPart$;if(void 0===r){const e=i?.renderBefore??null;s._$litPart$=r=new J(t.insertBefore(C(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}oe._$litElement$=!0,oe.finalized=!0,ne.litElementHydrateSupport?.({LitElement:oe});const ae=ne.litElementPolyfillSupport;ae?.({LitElement:oe}),(ne.litElementVersions??=[]).push("4.2.2");const le=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],ce=e=>le.includes(String(e).toLowerCase()),he=e=>{if(null==e)return null;const t=String(e).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(t))return null;const i=Number(t);return isFinite(i)?i:null},de=(e,t=0)=>{const i=Number(e);return isFinite(i)?i.toFixed(t).replace(".",","):"—"},pe=e=>{if(!e)return null;const t=he(e.state);if(null===t)return null;return"kw"===String(e.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*t:t},ue=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const s=Math.max(0,(t-i)/1e3);if(s<60)return`seit ${Math.floor(s)} Sek`;const r=s/60;if(r<60)return`seit ${Math.floor(r)} Min`;const n=r/60;if(n<24)return`seit ${Math.floor(n)} Std`;const o=Math.floor(n/24);return o<=1?"seit 1 Tag":`seit ${o} Tagen`},me=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const s=Math.floor(Math.max(0,t-i)/6e4);if(s<1)return"seit < 1 Min";if(s<60)return`seit ${s} Min`;if(s<1440){const e=Math.floor(s/60),t=s%60;return t?`seit ${e} Std ${t} Min`:`seit ${e} Std`}const r=Math.floor(s/1440);return r<=1?"seit 1 Tag":`seit ${r} Tagen`},fe=e=>String(e||"").split(".")[0],_e=(e,t)=>e?.attributes?.friendly_name||String(t||"").split(".")[1]||String(t||""),ge=(e,{decimals:t}={})=>{const i=he(e?.state);if(null===i)return"—";const s=t??(Number.isInteger(i)?0:1),r=e.attributes?.unit_of_measurement;return de(i,Math.min(s,1))+(r?" "+r:"")},be=e=>{if(!e)return"—";const t=he(e.state),i=e.attributes?.unit_of_measurement;return null!==t?de(t,Number.isInteger(t)?0:1)+(i?" "+i:""):String(e.state)+(i?" "+i:"")},we={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},$e="oval",ve=e=>we[String(e||"").toLowerCase()]||we[$e],ye={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},ke={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1}},xe={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},ze={heatpump:988/725,pump:1126/756,uv:947/384,solar:1001/710},Se={in:"pfeil_blau.png",out:"pfeil_rot.png"},Ae="1.0.0-a51d66cd",Ee=Ae.startsWith("__")?"dev":Ae,Be=e=>"/local/community/tomtut-pool-cards/"+e+"?v="+encodeURIComponent(Ee),Pe=e=>ze[e]||1,Ce={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},Te="#8a8f98",Me={hero:"#12a4b8"},Le=e=>Ce[e]?.farbe||Me[e]||Te,Oe=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],We=()=>{const e=new Set(Oe.flatMap(e=>e.keys)),t=Object.keys(Ce).filter(t=>!e.has(t)&&!1!==Ce[t].waehlbar),i=e=>({value:e,label:Ce[e].label+(!1===Ce[e].ready?" (folgt)":"")}),s=[];for(const e of Oe){e.trenner&&s.push({trenner:!0,label:e.trenner});for(const t of e.keys)Ce[t]&&s.push(i(t))}for(const e of t)s.push(i(e));return s},Ne=e=>{const t=Number(e);return isFinite(t)?(Math.round(t)%360+360)%360:0},De=e=>Math.abs(e)<1e-9?0:Math.abs(e),Ve=(e,t)=>{const i=Number(t)>0?Number(t):1,s=Ne(e)*Math.PI/180,r=De(Math.cos(s)),n=De(Math.sin(s));return Math.min(1,i/(i*r+n),1/(i*n+r))},Ke=30,He=100,Re=e=>{const t=Number(e);return isFinite(t)?Math.min(He,Math.max(30,t))/100:1},Ie=(e,t,i,s=100)=>{const r=Ne(e),n=(e=>Math.round(1e3*e)/1e3)(Ve(r,i)*Re(s)),o=[];return r&&o.push(`rotate(${r}deg)`),n<1&&o.push(`scale(${n})`),!0===t&&o.push("scaleX(-1)"),o.length?`transform:${o.join(" ")};`:""},Fe='<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>',Ue='fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"',Ge=(e,t,i="")=>Array.from({length:t},(s,r)=>{const n=Math.round(360/t*r*100)/100;return`<path d="${e}" ${Ue}${i}${n?` transform="rotate(${n} 20 20)"`:""}/>`}).join(""),je=(e=3.2)=>`<circle cx="20" cy="20" r="${e}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`,Ze={klassisch:{label:"Klassisch (4 Blätter)",svg:Fe},drei:{label:"3 Blätter, breit",svg:Ge("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z",3)+je(3.6)},fuenf:{label:"5 Blätter, schlank",svg:Ge("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z",5)+je(3)},sichel:{label:"Sichel / Turbine",svg:Ge("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z",7)+'<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>'+je(3.4)},propeller:{label:"Propeller",svg:Ge("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z",2)+'<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>'},batman:{label:"Batman",svg:'<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" '+Ue+"/>"}},Qe="klassisch";class Xe extends oe{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},kiosk:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this.kiosk=!1,this._confirmOpen=!1}get defaults(){return{}}_v(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}_ent(e){return e?this.hass?.states?.[e]:void 0}_isOn(e){const t=this._ent(e);return!!t&&ce(t.state)}_watt(e){return pe(this._ent(e))}get bedienbar(){return!0!==this.kiosk}_call(e,t,i={}){this.bedienbar&&e&&this.hass&&this.hass.callService(fe(e),t,{entity_id:e,...i})}_moreInfo(e){if(!this.bedienbar)return;const t=e?.currentTarget?.dataset?.entity;t&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0})))}get _frameClasses(){const e=this.frame||{},t=["transparent","weiss","schwarz"].includes(e.fill)?e.fill:"transparent";return`slot ${!1===e.enabled?"":"framed"} fill-${t}${this.bedienbar?"":" kiosk"}`}renderSlot(e){return R`<div class="${this._frameClasses}">${e}</div>`}renderGeraeteBild({kind:e,variante:t,alt:i,rotate:s=0,mirror:r=!1,groesse:n=100,inhalt:o=F}){const a=Pe(e);return R`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*a)/1e4};">
        <div class="bild" style="${Ie(s,r,a,n)}">
          <img src="${((e,t)=>Be(xe[e]?.[t]||ye[e]||""))(e,t)}" alt="${i}" />
          ${o}
        </div>
      </div>
    `}renderFan({active:e,top:t,left:i,size:s,ratio:r,dur:n,inactive:o,round:a=!1,design:l,farbe:c}){const h=e?"spinning":"hidden"===o?"hidden":"idle",d=a?1:Number(r)||1,p=l?(e=>(Ze[e]||Ze[Qe]).svg)(l):Fe;return R`
      <div
        class="fan-overlay ${h} ${a?"round":""} design-${l&&Ze[l]?l:Qe}"
        style="top:${t}%; left:${i}%; width:${s}%; --fan-dur:${n}s; --fan-ratio:${d};${c?` --tt-fan-color:${c};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${a?"xMidYMid meet":"none"}">
          <g .innerHTML="${p}"></g>
        </svg>
      </div>
    `}renderPowerButton({on:e,top:t,left:i,scale:s}){return R`
      <div
        class="power-badge ${e?"on":"off"}"
        style="top:${t}%; left:${i}%; transform:scale(${(s??100)/100});"
        title="${e?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `}renderValueBox({value:e,unit:t,top:i,bottom:s,left:r,scale:n,box:o,entity:a}){return R`
      <div
        class="value-box ${!1===o?"no-bg":""}"
        style="${void 0===s?`top:${i}%;`:`bottom:${s}%;`} left:${r}%; transform:translateX(-50%) scale(${(n??100)/100});"
        data-entity="${a||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${e}</span>
        ${t?R`<span class="unit">${t}</span>`:F}
      </div>
    `}renderThermo({value:e,top:t,left:i,scale:s,entity:r}){return R`
      <div
        class="thermo"
        style="top:${t}%; left:${i}%; --thermo-size:${(s??100)/100*3.6}em;"
        data-entity="${r||""}"
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
        ${e?R`<span class="thermo-val">${e}</span>`:F}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}get confirmDefault(){return!0}get fragtNach(){const e=this.config?.confirm_off;return null==e||""===e?this.confirmDefault:!1!==e}_onPowerClick(e){if(e?.stopPropagation(),!this.bedienbar)return;const t=this.powerEntityId;t&&(this._isOn(t)?this.fragtNach?this._confirmOpen=!0:this._call(t,"turn_off"):this._call(t,"turn_on"))}_confirmOff(e){e?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(e){e?.stopPropagation(),this._confirmOpen=!1}renderConfirm(e="Wirklich stromlos schalten?"){return this._confirmOpen&&this.bedienbar?R`
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
    `:F}wattText(e,t=0){const i=this._watt(e);return null===i?"—":de(i,t)}}const qe=n`
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
`,Je=n`
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
`,Ye={top:8,left:11},et={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:ke.skimmer.groesse,inlet_size:ke.einlauf.groesse,drain_size:ke.drain.groesse},tt=e=>{const t=ve(e),i={};for(const e of Object.values(ke)){const s=t[e.anker];s&&(i[`${e.anker}_top`]=s.top,i[`${e.anker}_left`]=s.left)}return{...et,thermo_top:t.thermo.top,thermo_left:t.thermo.left,ph_top:t.ph.top,ph_left:t.ph.left,rx_top:t.rx.top,rx_left:t.rx.left,...i,inlet_temp_top:(t.inlet?.top??12)+Ye.top,inlet_temp_left:(t.inlet?.left??66)+Ye.left,label_top:t.label_anker?.top??et.label_top,label_left:t.label_anker?.left??et.label_left}};class it extends Xe{get defaults(){return{...tt(this.config?.shape),inlet_temp_top:this._anchor("inlet","top")+Ye.top,inlet_temp_left:this._anchor("inlet","left")+Ye.left}}_spriteAn(e){const t=Object.values(ke).find(t=>t.anker===e),i=this.config?.[`show_${e}`];return null==i?!!t?.standard:!1!==i}get shape(){return ve(this.config?.shape)}_anchor(e,t){const i=`${e}_${t}`,s=this.config?.[i];return null!=s&&""!==s?Number(s):this.shape[e]?.[t]??50}render(){const e=this.config||{},t=this.shape,i=!0===e.framed,s=!1!==e.show_thermo&&!!e.temp_entity,r=!1!==e.show_ph&&!!e.ph_entity,n=!1!==e.show_rx&&!!e.rx_entity,o=!!e.inlet_temp_entity&&this._spriteAn("inlet"),a=R`
      <div class="img-wrap">
        <img src="${Be(t.file)}" alt="Pool ${t.label}" />
        ${this._sprites()}

        ${s?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:e.temp_entity}):F}
        ${r?this._chemBox("pH",e.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):F}
        ${n?this._chemBox("RX",e.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):F}
        ${o?this._chemBox("Zulauf",e.inlet_temp_entity,this._v("inlet_temp_top"),this._v("inlet_temp_left"),"inlet-temp"):F}
        ${e.label_text?R`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
            >
              ${e.label_text}
            </div>`:F}
      </div>
    `;return i?this.renderSlot(a):R`<div class="${this._frameClasses} bare">${a}</div>`}_sprites(){return Object.values(ke).map(e=>{if(!this._spriteAn(e.anker))return F;const t=Number(this._v(`${e.anker}_size`)),i=t>0?t:e.groesse;return R`<img
        class="hero-sprite sprite-${e.anker}"
        src="${Be(e.file)}"
        alt=""
        style="top:${this._anchor(e.anker,"top")}%; left:${this._anchor(e.anker,"left")}%; width:${i}%;"
      />`})}_chemBox(e,t,i,s,r=""){const n=this._ent(t);return R`
      <div
        class="chem-box ${r}"
        style="top:${i}%; left:${s}%;"
        data-entity="${t}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${e}</span>
        <span class="chem-val">${ge(n)}</span>
      </div>
    `}static styles=[qe,Je,n`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",it);const st="becken",rt=e=>String(e??"").trim().toLowerCase(),nt=(e={})=>[...!1===e.hero?.enabled?[]:[st],...(Array.isArray(e.slots)?e.slots:[]).map((e,t)=>"hidden"===String(e?.type||"frame").toLowerCase()?null:t+1).filter(e=>null!==e)],ot=(e={},t)=>!0===e?.kiosk&&(!Array.isArray(e.kiosk_slots)||e.kiosk_slots.some(e=>rt(e)===rt(t))),at={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30,stage_from_power:!0,stage_watt_1:20,stage_watt_2:150,stage_watt_3:500},lt=(e,t=[20,150,500],i=3)=>{const s=Number(e);if(null==e||!isFinite(s)||i<1)return null;let r=null;return t.slice(0,3).forEach((e,t)=>{const i=Number(e);isFinite(i)&&s>i&&(r=t)}),null===r?null:Math.min(r,i-1)},ct=10,ht=e=>{const t=Math.min(ct,Math.max(1,Number(e)||1)),i=4*Math.pow(.125,(t-1)/9);return Math.round(100*i)/100};class dt extends Xe{static properties={...Xe.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return at}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const e=this.config?.stage_entities;return(Array.isArray(e)?e:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const e=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((t,i)=>e[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}get _wattStufeAktiv(){return!1!==this._v("stage_from_power")&&!!this.config?.power_entity}_wattStufe(){if(!this._wattStufeAktiv)return;const e=this._watt(this.config.power_entity);if(null===e)return;const t=[1,2,3].map(e=>this._v(`stage_watt_${e}`));return lt(e,t,Math.max(1,this.stages.length))}_derive(){const e=this._deriveSchalter(),t=this._wattStufe();if(void 0===t)return e;if(null===t)return{active:null,stopped:!0,since:e.stopped?e.since:null};return{active:t,stopped:!1,since:e.active!==t||e.stopped?null:e.since,ausLeistung:!0}}_deriveSchalter(){if("latching"===this.mode){let e=null;if(this.stages.forEach((t,i)=>{const s=this._ent(t);if(!s||!ce(s.state))return;const r=Date.parse(s.last_changed||0)||0;(!e||r>e.t)&&(e={i:i,t:r,since:s.last_changed})}),!e){const e=this._ent(this.stopEntity);return{active:null,stopped:!0,since:e?.last_changed||null}}return{active:e.i,stopped:!1,since:e.since}}const e=this.stages.map((e,t)=>({id:e,i:t}));this.stopEntity&&e.push({id:this.stopEntity,i:-1});let t=null;for(const i of e){const e=this._ent(i.id);if(!e||!e.last_changed)continue;const s=Date.parse(e.last_changed);isNaN(s)||(!t||s>t.t)&&(t={...i,t:s,since:e.last_changed})}return t?-1===t.i?{active:null,stopped:!0,since:t.since}:{active:t.i,stopped:!1,since:t.since}:{active:null,stopped:!1,since:null}}get state(){const e=this._derive(),t=this._optimistic;if(t&&Date.now()-t.t<6e3){if(-1===t.i&&!e.stopped)return{active:null,stopped:!0,since:null};if(t.i>=0&&e.active!==t.i)return{active:t.i,stopped:!1,since:null}}return e}get running(){const e=this.state;if(this.blockedByMain)return!1;if(e.stopped||null===e.active)return!1;if(e.ausLeistung)return!0;const t=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(t)&&i<t)}_clickStage(e){if(!this.bedienbar||this.blockedByMain)return;const t=this.stages[e];t&&(this._optimistic={i:e,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((t,i)=>{i!==e&&this._call(t,"turn_off")}),this._call(t,"turn_on")):this._call(t,"turn_on"))}_clickStop(){this.bedienbar&&!this.blockedByMain&&(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(e=>this._call(e,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const e=this.config||{},t=((e={})=>!!(Array.isArray(e.stage_entities)&&e.stage_entities.filter(Boolean).length||e.main_entity))(e),i=this.state,s=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1",r=!1!==e.show_power&&!!e.power_entity,n=!1!==e.show_temp&&!!e.temp_entity,o=!1!==e.show_power_button&&!!e.main_entity,a=!1!==e.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(R`
      ${e.label?R`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===e.show_fan?F:this.renderFan({active:t&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:ht(this._v(s)),inactive:this._v("fan_inactive"),round:!0})}
          ${o?this.renderPowerButton({on:this._isOn(e.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
          ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
          ${n?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):F}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${a?R`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((e,t)=>R`
                    <button
                      class="stage-btn ${i.active!==t||i.stopped?"":"active"}"
                      @click="${()=>this._clickStage(t)}"
                      title="${this.stageLabels[t]}"
                    >
                      <span class="stage-name">${this.stageLabels[t]}</span>
                      ${i.active===t&&!i.stopped&&i.since?R`<span class="stage-since">${ue(i.since)}</span>`:F}
                    </button>
                  `)}
                ${this._showStop?R`
                      <button
                        class="stage-btn stop ${i.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${i.stopped&&i.since?R`<span class="stage-since">${ue(i.since)}</span>`:F}
                      </button>
                    `:F}
              </div>
            `:F}
      </div>
      ${t?F:R`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[qe,Je,n`
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
    `]}customElements.define("tomtut-pool-slot-pump",dt);const pt={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,fan_design:"klassisch",fan_color_mode:"neutral",mode_speed_heiz_silent:3,mode_speed_heiz_smart:5,mode_speed_heiz_auto:6,mode_speed_heiz_boost:9,mode_speed_kuehl_silent:3,mode_speed_kuehl_smart:5,mode_speed_kuehl_auto:6,mode_speed_kuehl_boost:9,power_btn_top:5,power_btn_left:3,power_btn_scale:139,release_top:84,release_left:24,release_scale:100,show_release_since:!1,mode_top:86,mode_left:64,mode_scale:100,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},ut=[{key:"heiz_silent",label:"Heizen Silent",art:"heizen",zustaende:["Heizen Silent","heat_silent","heating_silent","silent_heat"]},{key:"heiz_smart",label:"Heizen Smart",art:"heizen",zustaende:["Heizen Smart","heat_smart","heating_smart","smart_heat"]},{key:"heiz_auto",label:"Heizen Auto",art:"heizen",zustaende:["Heizen Auto","heat_auto","heating_auto","auto_heat"]},{key:"heiz_boost",label:"Heizen Boost",art:"heizen",zustaende:["Heizen Boost","heat_boost","heating_boost","boost_heat","heat_turbo","heat_powerful"]},{key:"kuehl_silent",label:"Kühlen Silent",art:"kuehlen",zustaende:["Kühlen Silent","cool_silent","cooling_silent","silent_cool"]},{key:"kuehl_smart",label:"Kühlen Smart",art:"kuehlen",zustaende:["Kühlen Smart","cool_smart","cooling_smart","smart_cool"]},{key:"kuehl_auto",label:"Kühlen Auto",art:"kuehlen",zustaende:["Kühlen Auto","cool_auto","cooling_auto","auto_cool"]},{key:"kuehl_boost",label:"Kühlen Boost",art:"kuehlen",zustaende:["Kühlen Boost","cool_boost","cooling_boost","boost_cool","cool_turbo","cool_powerful"]}],mt={heizen:"#e0452c",kuehlen:"#2f7fd0"},ft=e=>String(e??"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[\s_-]+/g," ").trim(),_t=[["heizen",/heiz|heat/],["kuehlen",/kuehl|cool/]],gt=[["silent",/silent|leise|quiet|mute/],["smart",/smart|eco/],["boost",/boost|power|turbo|max|strong/],["auto",/auto/]],bt=e=>{const t=ft(e);if(!t)return null;const i=_t.filter(([,e])=>e.test(t)).map(([e])=>e);if(1!==i.length)return null;const s=gt.find(([,e])=>e.test(t));if(!s)return null;const r=`${"heizen"===i[0]?"heiz":"kuehl"}_${s[0]}`;return ut.find(e=>e.key===r)||null},wt=(e,t={})=>{const i=ft(e);if(!i)return null;const s=ut.find(e=>((e={},t)=>{const i=e[`mode_map_${t.key}`];return"string"==typeof i&&i.trim()?i.split(",").map(e=>e.trim()).filter(Boolean):Array.isArray(i)&&i.length?i.map(String):t.zustaende})(t,e).some(e=>ft(e)===i));if(s)return s;const r=bt(e);return r&&!((e,t)=>{const i=e?.[`mode_map_${t.key}`];return"string"==typeof i&&!!i.trim()||Array.isArray(i)&&i.length>0})(t,r)?r:null},$t={off:"Aus",aus:"Aus",heat:"Heizen",heating:"Heizen",heizen:"Heizen",cool:"Kühlen",cooling:"Kühlen",kuehlen:"Kühlen","kühlen":"Kühlen",auto:"Auto","heat cool":"Heizen/Kühlen",dry:"Entfeuchten","fan only":"Nur Lüfter",idle:"Bereit",standby:"Standby",silent:"Silent",smart:"Smart",boost:"Boost",turbo:"Turbo",powerful:"Power",eco:"Eco",comfort:"Komfort",away:"Abwesend",sleep:"Nacht",home:"Zuhause",activity:"Aktiv"},vt={off:"aus",aus:"aus",heat:"heizen",heating:"heizen",heizen:"heizen",cool:"kuehlen",cooling:"kuehlen",kuehlen:"kuehlen","kühlen":"kuehlen"},yt=e=>["","unknown","unavailable","none"].includes(ft(e)),kt=e=>{const t=ft(e);return Object.prototype.hasOwnProperty.call($t,t)?$t[t]:String(e??"").trim()},xt=(e,t={})=>{if(!e)return null;const i=String(t.mode_attribute||"").trim(),s=i?e.attributes?.[i]:e.state,r=wt(s,t);if(r)return{text:r.label,art:r.art};let n=s,o=null;if(!String(t.mode_entity||"").startsWith("climate.")||i&&"preset_mode"!==i||(n=e.state,o=i?s:e.attributes?.preset_mode),yt(n)&&yt(o))return{text:"—",art:null};const a=vt[ft(n)]||null;if("aus"===a)return{text:"Aus",art:a};if(!yt(n)&&!yt(o)){const e=wt(`${n} ${o}`,t);if(e)return{text:e.label,art:e.art}}const l=[n,o].filter(e=>!yt(e)).map(kt);return{text:l.join(" · "),art:a}},zt=(e,t)=>wt(e,t)?.label||kt(e),St=(e,t={})=>{const i=t.mode_entity;if(!e||!i)return[];const s=fe(i),r=e.attributes||{},n=String(t.mode_attribute||"").trim(),o=(e,i,s,r,n,o)=>Array.isArray(n)&&n.length?[{titel:e,domain:i,service:s,feld:r,optionen:n.map(e=>({wert:String(e),text:zt(e,t),aktiv:ft(e)===ft(o)}))}]:[];if(("select"===s||"input_select"===s)&&!n)return o("Betriebsmodus",s,"select_option","option",r.options,e.state);if("climate"===s){if("preset_mode"===n)return o("Betriebsmodus","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode);if(!n)return[...o("Betriebsart","climate","set_hvac_mode","hvac_mode",r.hvac_modes,e.state),...o("Stufe / Preset","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode)]}return[]};class At extends Xe{static properties={...Xe.properties,_tick:{state:!0},_modusWahlOffen:{state:!0},_modusFehler:{state:!0}};get defaults(){return pt}get _seitAn(){const e=this.config||{};return!0===e.show_release_since&&!1!==e.show_release&&!!e.release_entity}_seitTimerPruefen(){const e=this.isConnected&&this._seitAn;e&&!this._seitTimer?(this._seitTimer=setInterval(()=>{this._tick=Date.now()},6e4),"function"==typeof this._seitTimer?.unref&&this._seitTimer.unref()):!e&&this._seitTimer&&(clearInterval(this._seitTimer),this._seitTimer=void 0)}connectedCallback(){super.connectedCallback(),this._seitTimerPruefen()}disconnectedCallback(){clearInterval(this._seitTimer),this._seitTimer=void 0,super.disconnectedCallback()}updated(e){super.updated?.(e),this._seitTimerPruefen()}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _freigabe(){const e=this.config||{};if(!1===e.show_release||!e.release_entity)return null;const t=this._ent(e.release_entity);if(!t)return null;const i=String(t.state).toLowerCase();return"unknown"===i||"unavailable"===i||""===i?null:ce(i)}get _releaseSchaltbar(){const e=this.config?.release_entity;return!!e&&!String(e).startsWith("binary_sensor.")}_onReleaseClick(e){e?.stopPropagation(),this.bedienbar&&this._releaseSchaltbar&&this._call(this.config.release_entity,"toggle")}_renderRelease(){const e=this._freigabe,t=!1===e,i=null===e?"unbekannt":t?"gesperrt":"frei",s=this._releaseSchaltbar,r=null===e?"Freigabekontakt — Zustand unbekannt":s?t?"Freigabe geben (Kontakt schließen)":"Freigabe entziehen (Kontakt öffnen)":t?"Freigabekontakt offen — die Wärmepumpe ist gesperrt (nur Anzeige)":"Freigabekontakt geschlossen — die Wärmepumpe ist freigegeben (nur Anzeige)";return R`
      <div
        class="release-badge ${i} ${s?"schaltbar":"nur-anzeige"}"
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
        ${this._seitAn&&null!==e?R`<span class="release-seit"
              >${me(this._ent(this.config.release_entity)?.last_changed)}</span
            >`:F}
      </div>
    `}get _target(){const e=this.config.target_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),s=he(i?t.attributes?.temperature:t.state);if(null===s)return null;const r=t.attributes||{};return{climate:i,value:s,min:i?r.min_temp??5:r.min??5,max:i?r.max_temp??40:r.max??40,step:this.config.target_step??(i?r.target_temp_step??.5:r.step??.5),unit:i?this.hass?.config?.unit_system?.temperature??"°C":r.unit_of_measurement??"°C"}}get _current(){const e=this.config.current_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),s=he(i?t.attributes?.current_temperature:t.state);return null===s?null:{value:s,unit:i?this.hass?.config?.unit_system?.temperature??"°C":t.attributes?.unit_of_measurement??"°C"}}get _modus(){const e=this.config||{};if(!1===e.show_mode||!e.mode_entity)return null;const t=this._ent(e.mode_entity);if(!t)return null;const i=String(e.mode_attribute||"").trim(),s=i?t.attributes?.[i]:t.state;return wt(s,e)}get _modusBadge(){const e=this.config||{};return!1!==e.show_mode&&!1!==e.show_mode_badge&&e.mode_entity?xt(this._ent(e.mode_entity),e)||{text:"—",art:null}:null}get _modusGruppen(){const e=this.config||{};return St(this._ent(e.mode_entity),e)}_onModeClick(e){e?.stopPropagation(),this.bedienbar&&this._modusGruppen.length&&(this._modusFehler="",this._modusWahlOffen=!0)}_modusSchliessen(e){e?.stopPropagation(),this._modusWahlOffen=!1,this._modusFehler=""}async _modusSetzen(e,t,i){if(i?.stopPropagation(),this.bedienbar&&this.hass){this._modusFehler="";try{await this.hass.callService(e.domain,e.service,{entity_id:this.config.mode_entity,[e.feld]:t.wert}),this._modusWahlOffen=!1}catch(e){const i=e?.message||e?.error?.message||String(e);console.error("tomtut-pool-cards: Modus setzen fehlgeschlagen",e),this._modusFehler=`Umschalten auf „${t.text}“ fehlgeschlagen: ${i}`}}}_renderModusWahl(){if(!this._modusWahlOffen||!this.bedienbar)return F;const e=this._modusGruppen;return R`
      <div class="confirm-overlay modus-overlay" @click="${this._modusSchliessen}">
        <div class="confirm-panel modus-panel" @click="${e=>e.stopPropagation()}">
          <h3 class="modus-kopf">Betriebsmodus wählen</h3>
          ${e.map(t=>R`
              ${e.length>1?R`<div class="modus-gruppe">${t.titel}</div>`:F}
              <div class="modus-optionen">
                ${t.optionen.map(e=>R`<button
                    class="modus-option ${e.aktiv?"aktiv":""}"
                    data-wert="${e.wert}"
                    aria-pressed="${e.aktiv?"true":"false"}"
                    @click="${i=>this._modusSetzen(t,e,i)}"
                  >
                    <span class="modus-haken">${e.aktiv?"✓":""}</span>${e.text}
                  </button>`)}
              </div>
            `)}
          ${this._modusFehler?R`<div class="modus-fehler" role="alert">${this._modusFehler}</div>`:F}
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._modusSchliessen}">Schließen</button>
          </div>
        </div>
      </div>
    `}_renderModeBadge(e){const t=mt[e.art]||"",i=this.bedienbar&&this._modusGruppen.length>0;return R`
      <div
        class="mode-badge ${e.art||"neutral"} ${i?"waehlbar":""}"
        style="top:${this._v("mode_top")}%; left:${this._v("mode_left")}%; transform:translateX(-50%) scale(${(this._v("mode_scale")??100)/100});${t?` --tt-mode-farbe:${t};`:""}"
        title="Betriebsmodus: ${e.text}${i?" — tippen zum Ändern":""}"
        @click="${this._onModeClick}"
      >
        <span class="mode-punkt"></span>
        <span class="val">${e.text}</span>
      </div>
    `}get _fanDur(){const e=this._modus;if(e)return ht(this._v(`mode_speed_${e.key}`));const t=Number(this._v("fan_speed"))||0;return t<=0?0:Math.max(.2,4-t/100*3.6)}get _fanFarbe(){if("modus"!==this._v("fan_color_mode"))return"";const e=this._modus;return e?mt[e.art]:""}get _fanActive(){if(!1===this._freigabe)return!1;const e=this.config.switch_entity;if(e&&this._ent(e)&&!this._isOn(e))return!1;const t=this.config.fan_source??"auto",i=this._ent(this.config.fan_entity);if("power"!==t&&i){const e=String(i.state).toLowerCase();if(ce(e))return!0;const t=he(e);return null!==t&&t>0}if("entity"===t)return!1;const s=this._watt(this.config.power_entity);return null!==s&&s>=Number(this._v("fan_power_threshold"))}_stepTarget(e){const t=this._target;if(!this.bedienbar||!t||!this.hass)return;let i=Math.round((t.value+e*t.step)/t.step)*t.step;i=Math.min(t.max,Math.max(t.min,i)),i=Math.round(100*i)/100,i!==t.value&&(t.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(e){e?.stopPropagation(),this._stepTarget(1)}_targetDown(e){e?.stopPropagation(),this._stepTarget(-1)}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.target_entity||e.current_entity||e.release_entity))(e),i=!1!==e.show_fan,s=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_release&&!!e.release_entity,n=!1!==e.show_power&&!!e.power_entity,o=!1!==e.show_target&&!!e.target_entity,a=!1!==e.show_current&&!!e.current_entity,l=e.label_text||"",c=this._modusBadge,h=this._fanDur,d=this._target,p=this._current;return this.renderSlot(R`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${i?this.renderFan({active:t&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:h,inactive:this._v("fan_inactive"),design:this._v("fan_design"),farbe:this._fanFarbe}):F}
        ${s?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${r?this._renderRelease():F}
        ${c?this._renderModeBadge(c):F}
        ${n?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${a?this.renderValueBox({value:null===p?"—":de(p.value,1)+" "+p.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:e.current_entity}):F}
        ${o?R`
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
                    ${!1===this._v("target_label")?F:R`<span class="unit">Soll</span>`}
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
            `:F}
        ${l?R`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
              >
                ${l}
              </div>
            `:F}
        ${this.renderConfirm("Wirklich stromlos schalten?")} ${this._renderModusWahl()}
      </div>
      ${t?F:R`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[qe,Je,n`
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
    `]}customElements.define("tomtut-pool-slot-heatpump",At);const Et={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80,glow_pulse:40},Bt=300,Pt=e=>{const t=Math.min(300,Math.max(0,isFinite(Number(e))?Number(e):0));return{puls:Math.min(1,t/100),boost:t>100?Math.round((t-100)/200*1e3)/1e3:0}};class Ct extends Xe{get defaults(){return Et}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const e=Number(this._v("glow_size"))||0,t=Number(this._v("glow_thickness"))||0;if(e<=0||t<=0)return F;const i=Math.round(e*Pe("uv")/t*1e3)/1e3,s=Number(this._v("glow_intensity")),r=Math.min(100,Math.max(0,isFinite(s)?s:80))/100,{puls:n,boost:o}=Pt(this._v("glow_pulse")),a=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${e}%`,`aspect-ratio:${i}`,`opacity:${r}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`,"--glow-pulse:"+Math.round(100*n)/100,...o>0?[`--glow-boost:${o}`]:[]].join("; ");return R`<div class="glow ${n>0?"wabert":"ruhig"}" style="${a};"></div>`}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.temp_entity))(e),i=!1!==e.show_glow,s=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_power&&!!e.power_entity,n=!1!==e.show_temp&&!!e.temp_entity;return this.renderSlot(R`
      ${e.label?R`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:i&&t&&this.leuchtet?this.renderGlow():F})}

        ${s?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${n?this.renderThermo({value:ge(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):F}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${t?F:R`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[qe,Je,n`
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
    `]}customElements.define("tomtut-pool-slot-uv",Ct);const Tt={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:86,arrow_in_left:8,arrow_in_size:12,arrow_out_top:12.5,arrow_out_left:91,arrow_out_size:12,temp_in_top:70,temp_in_left:14,temp_in_scale:105,temp_out_top:25,temp_out_left:72,temp_out_scale:105,power_bottom:8,power_left:42,power_scale:100,power_box:!0,power_label:!0};class Mt extends Xe{get defaults(){return Tt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(e){const t=Number(this._v(`arrow_${e}_size`));return t>0?R`<img
      class="flow-arrow flow-${e}"
      src="${Be(Se[e])}"
      alt=""
      style="top:${this._v(`arrow_${e}_top`)}%; left:${this._v(`arrow_${e}_left`)}%; width:${t}%;"
    />`:F}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.temp_in_entity||e.temp_out_entity||e.power_entity))(e),i=!1!==e.show_power_button&&!!e.switch_entity,s=!1!==e.show_temp_in&&!!e.temp_in_entity,r=!1!==e.show_temp_out&&!!e.temp_out_entity,n=!1!==e.show_power&&!!e.power_entity,o=!1!==e.show_arrows;return this.renderSlot(R`
      ${e.label?R`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${o?R`${this.renderPfeil("in")}${this.renderPfeil("out")}`:F}

        ${i?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${s?this.renderThermo({value:ge(this._ent(e.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:e.temp_in_entity}):F}
        ${r?this.renderThermo({value:ge(this._ent(e.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:e.temp_out_entity}):F}
        ${n?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${t?F:R`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[qe,Je,n`
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
    `]}customElements.define("tomtut-pool-slot-solar",Mt);const Lt=["ha-entity-picker","ha-icon-picker"];let Ot=null;const Wt=()=>"undefined"!=typeof customElements&&Lt.every(e=>!!customElements.get(e)),Nt=e=>"undefined"!=typeof customElements&&!!customElements.get(e),Dt=8,Vt=["klassisch","liste","kacheln"],Kt="klassisch",Ht=["switch","light","input_boolean","fan","siren"],Rt={switch:"mdi:toggle-switch-variant",input_boolean:"mdi:toggle-switch-outline",light:"mdi:lightbulb",fan:"mdi:fan",siren:"mdi:bullhorn",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-blank-circle-outline",climate:"mdi:thermostat",number:"mdi:ray-vertex",input_number:"mdi:ray-vertex"},It=e=>(Array.isArray(e?.entries)?e.entries:[]).filter(e=>e&&(e.entity||e.text||e.label)),Ft=e=>Vt.includes(e?.layout)?e.layout:Kt;class Ut extends Xe{get confirmDefault(){return!1}get powerEntityId(){return this._wartet?.entity||null}get powerConfirmText(){return`„${this._wartet?.label||_e(this._ent(this._wartet?.entity),this._wartet?.entity)}" wird ausgeschaltet.`}get _entries(){return It(this.config).slice(0,8)}get _ausgeblendet(){return Math.max(0,It(this.config).length-8)}get _layout(){return Ft(this.config)}get _align(){const e=this.config?.align;return["oben","mitte","unten"].includes(e)?e:"klassisch"===this._layout?"mitte":"oben"}get _frameClasses(){return`${super._frameClasses} layout-${this._layout}`}_kind(e){return e.kind||(e.entity?"entity":"text")}_schaltbar(e){return Ht.includes(fe(e.entity))}_toggle(e){const t=e.entity;if(t&&this.bedienbar&&this._schaltbar(e))return!0===e.confirm_off&&this._isOn(t)?(this._wartet=e,void(this._confirmOpen=!0)):void this._call(t,"toggle")}_zustand(e){if(!e)return"—";try{const t=this.hass?.formatEntityState?.(e);if(t)return t}catch(e){console.warn("tomtut-pool-cards: formatEntityState —",e?.message||e)}return be(e)}_icon(e,t){if(e.icon)return R`<ha-icon icon="${e.icon}"></ha-icon>`;if(t&&Nt("ha-state-icon"))return R`<ha-state-icon .hass="${this.hass}" .stateObj="${t}"></ha-state-icon>`;const i=t?.attributes?.icon||Rt[fe(e.entity)]||"mdi:circle-medium";return R`<ha-icon icon="${i}"></ha-icon>`}_renderEntry(e){const t=this._kind(e);if("text"===t)return R`<div class="entry text">${e.text||e.label||""}</div>`;const i=this._ent(e.entity);if("button"===t){const t=!!i&&ce(i.state);return R`
        <button class="entry btn-entry ${t?"on":""}" @click="${()=>this._toggle(e)}">
          ${e.icon?R`<ha-icon icon="${e.icon}"></ha-icon>`:F}
          <span>${e.label||_e(i,e.entity)}</span>
        </button>
      `}return R`
      <div class="entry value" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${e.label||_e(i,e.entity)}</span>
        <span class="entry-value">${be(i)}</span>
      </div>
    `}_renderZeile(e){const t=this._kind(e);if("text"===t)return R`<div class="entry zeile text"><span class="z-text">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),s=e.label||_e(i,e.entity),r=!i||["unavailable","unknown"].includes(i.state);if("button"===t&&this._schaltbar(e)){const t=!!i&&ce(i.state);return R`
        <button
          class="entry zeile schaltbar ${t?"on":"off"} ${r?"weg":""}"
          role="switch"
          aria-checked="${t?"true":"false"}"
          title="${s}: ${t?"an":"aus"}"
          @click="${()=>this._toggle(e)}"
        >
          <span class="z-icon">${this._icon(e,i)}</span>
          <span class="z-name">${s}</span>
          <span class="schalter" aria-hidden="true"><span class="knopf"></span></span>
        </button>
      `}return R`
      <div class="entry zeile wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="z-icon">${this._icon(e,i)}</span>
        <span class="z-name">${s}</span>
        <span class="z-wert">${this._zustand(i)}</span>
      </div>
    `}_renderKachel(e){const t=this._kind(e);if("text"===t)return R`<div class="entry kachel text"><span class="k-name">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),s=e.label||_e(i,e.entity);if("button"===t&&this._schaltbar(e)){const t=!!i&&ce(i.state);return R`
        <button
          class="entry kachel schaltbar ${t?"on":"off"}"
          role="switch"
          aria-checked="${t?"true":"false"}"
          @click="${()=>this._toggle(e)}"
        >
          <span class="k-icon">${this._icon(e,i)}</span>
          <span class="k-text">
            <span class="k-name">${s}</span>
            <span class="k-zustand">${t?"An":"Aus"}</span>
          </span>
        </button>
      `}return R`
      <div class="entry kachel wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="k-icon">${this._icon(e,i)}</span>
        <span class="k-text">
          <span class="k-name">${s}</span>
          <span class="k-zustand">${this._zustand(i)}</span>
        </span>
      </div>
    `}render(){const e=this.config||{},t=this._entries,i=this._layout,s=this._ausgeblendet;let r;return r=t.length?"liste"===i?R`<div class="zeilen">${t.map(e=>this._renderZeile(e))}</div>`:"kacheln"===i?R`<div class="kacheln">${t.map(e=>this._renderKachel(e))}</div>`:t.map(e=>this._renderEntry(e)):R`<p class="slot-hint">Noch keine Einträge — im Editor bis zu ${8} hinzufügen.</p>`,this.renderSlot(R`
      <div class="custom layout-${i} align-${this._align}">
        ${e.title?R`<h3 class="slot-title">${e.title}</h3>`:F}
        ${r}
        ${s?R`<p class="slot-hint mehr">+${s} weitere ${1===s?"Eintrag":"Einträge"} ausgeblendet (höchstens ${8})</p>`:F}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `)}static styles=[qe,Je,n`
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
    `]}customElements.define("tomtut-pool-slot-custom",Ut);class Gt extends Xe{static properties={...Xe.properties,slotType:{attribute:!1}};render(){const e=this.config||{},t=Ce[this.slotType]||{},i=!1===t.ready?t.hint:e.hint||"";return this.renderSlot(R`
      ${e.title||e.label?R`<h3 class="slot-title">${e.title||e.label}</h3>`:F}
      ${i?R`<p class="slot-hint">${i}</p>`:F}
    `)}static styles=[qe,Je]}customElements.define("tomtut-pool-slot-frame",Gt);const jt={enabled:!0,fill:"transparent"};class Zt extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(e){if(!e||"object"!=typeof e)throw new Error("Ungültige Konfiguration");if(void 0!==e.slots&&!Array.isArray(e.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==e.hero&&("object"!=typeof e.hero||Array.isArray(e.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==e.version&&1!==Number(e.version))throw new Error(`Unbekannte Config-Version ${e.version} — diese Card kennt Version 1`);this._config={version:1,...e,hero:{enabled:!0,shape:$e,...e.hero||{}},frame:{...jt,...e.frame||{}},slots:Array.isArray(e.slots)?e.slots:[]}}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:$e},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const e=this._config||{},t=(e.slots||[]).filter(e=>"hidden"!==(e?.type||"frame"));return(!1===e.hero?.enabled?0:6)+5*Math.ceil(t.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(e=>({...e||{},type:String(e?.type||"frame").toLowerCase()})).filter(e=>"hidden"!==e.type)}get _slotsMitNummer(){return(this._config?.slots||[]).map((e,t)=>({slot:{...e||{},type:String(e?.type||"frame").toLowerCase()},nr:t+1})).filter(({slot:e})=>"hidden"!==e.type)}render(){if(!this._config)return F;const e=this._config,t=!1!==e.hero?.enabled;return R`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${t?R`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${e.hero}"
                  .frame="${e.frame}"
                  .kiosk="${ot(e,st)}"
                ></tomtut-pool-hero>`:F}
            ${this._slotsMitNummer.map(({slot:t,nr:i})=>this._renderSlot(t,ot(e,i)))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(e,t=!1){const i=this._config.frame;switch(Ce[e.type]?.ready?e.type:"frame"){case"heatpump":return R`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return R`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-pump>`;case"uv":return R`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-uv>`;case"solar":return R`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-solar>`;case"custom":return R`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-custom>`;default:return R`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
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
  `}customElements.define("tomtut-pool-dashboard",Zt);class Qt{constructor({hass:e,config:t,defaults:i={},update:s,idPrefix:r="f",stash:n=null}){this.hass=e,this.config=t||{},this.defaults=i,this.update=s,this.idPrefix=r,this.stash=n}val(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}raw(e){const t=this.config?.[e];return null==t?"":t}shown(e,t=!0){const i=this.config?.[e];return null==i?t:!1!==i}element(e,t,i=[],s=!0){const r=this.shown(t,s);return R`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${r}"
          @change="${e=>this._toggleElement(t,i,s,e.target.checked)}"
        />
      </div>
    `}_toggleElement(e,t,i,s){const r={},n=this.stash;if(s){r[e]=!0!==i||void 0;const t=n?.[`${this.idPrefix}:${e}`];t&&(Object.assign(r,t),delete n[`${this.idPrefix}:${e}`])}else{r[e]=!1;const i={};for(const e of t)void 0!==this.config?.[e]&&(i[e]=this.config[e]),r[e]=void 0;n&&Object.keys(i).length&&(n[`${this.idPrefix}:${e}`]=i)}this.update(r)}text(e,t,i="",s=""){return R`
      <label
        >${e}
        <input
          type="text"
          data-key="${t}"
          .value="${String(this.raw(t))}"
          placeholder="${s}"
          @input="${e=>this.update({[t]:e.target.value})}"
        />
        ${i?R`<small>${i}</small>`:F}
      </label>
    `}_entityOptions(e){const t=this.hass?.states??{};return Object.keys(t).filter(t=>!e.length||e.some(e=>t.startsWith(e+"."))).sort()}entity(e,t,i="",...s){return this._entityInput({label:e,hint:i,domains:s,value:String(this.raw(t)),dataKey:t,listId:`${this.idPrefix}-${t}`,onChange:e=>this.update({[t]:e||void 0})})}entityAt(e,t,i,s="",...r){const n=Array.isArray(this.config?.[t])?this.config[t]:[];return this._entityInput({label:e,hint:s,domains:r,value:String(n[i]??""),dataKey:`${t}.${i}`,listId:`${this.idPrefix}-${t}-${i}`,onChange:e=>this._updateList(t,i,e)})}_entityInput({label:e,hint:t,domains:i,value:s,dataKey:r,listId:n,onChange:o}){return Nt("ha-entity-picker")?R`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${s}"
          .label="${e}"
          .helper="${t}"
          .includeDomains="${i.length?i:void 0}"
          data-key="${r}"
          allow-custom-entity
          @value-changed="${e=>{e.stopPropagation(),o(e.detail?.value??"")}}"
        ></ha-entity-picker>
      `:R`
      <label
        >${e}
        <input
          type="text"
          list="${n}"
          data-key="${r}"
          .value="${s}"
          placeholder="${"Entity auswählen …"}"
          @input="${e=>o(e.target.value)}"
          @change="${e=>o(e.target.value)}"
        />
        <datalist id="${n}">
          ${this._entityOptions(i).map(e=>R`<option value="${e}"></option>`)}
        </datalist>
        ${t?R`<small>${t}</small>`:F}
      </label>
    `}_updateList(e,t,i){const s=Array.isArray(this.config?.[e])?[...this.config[e]]:[];for(;s.length<=t;)s.push("");for(s[t]=i;s.length&&!s[s.length-1];)s.pop();this.update({[e]:s.length?s:void 0})}icon(e,t,i=""){return Nt("ha-icon-picker")?R`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(t))}"
          .label="${e}"
          .helper="${i}"
          data-key="${t}"
          @value-changed="${e=>{e.stopPropagation(),this.update({[t]:e.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(e,t,i,"mdi:lightbulb")}select(e,t,i,s){const r=this.config?.[t]??s;return R`
      <div class="row">
        <span class="row-label">${e}</span>
        <select data-key="${t}" @change="${e=>this.update({[t]:e.target.value})}">
          ${i.map(([e,t])=>R`<option value="${e}" ?selected="${r===e}">${t}</option>`)}
        </select>
      </div>
    `}slider(e,t,i,s,r="%",n=1){const o=this.val(t),a=null==o||""===o?i:o;return R`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="range"
          min="${i}"
          max="${s}"
          step="${n}"
          data-key="${t}"
          .value="${String(a)}"
          @input="${e=>this.update({[t]:parseFloat(e.target.value)})}"
        />
        <span class="row-val">${a}${r}</span>
      </div>
    `}toggle(e,t,i){const s=this.config?.[t]??i;return R`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${s}"
          @change="${e=>this.update({[t]:e.target.checked})}"
        />
      </div>
    `}}const Xt=(e,t,i=!1)=>R`
  <details class="section" ?open="${i}">
    <summary>${e}</summary>
    <div class="section-body">${t}</div>
  </details>
`,qt=e=>R`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${e}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`,Jt=n`
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
`,Yt=["switch","input_boolean","light"],ei=["sensor","input_number"],ti=["sensor","input_number","number"],ii=["climate","number","input_number","sensor"],si=["sensor","select","input_select","climate"],ri=["switch","input_boolean","binary_sensor"],ni=(e,t=!0,i="Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung.")=>R`
  ${e.toggle("Vor dem Ausschalten nachfragen","confirm_off",t)}
  <small>${i}</small>
`,oi=(e,t,i,s,r)=>e.shown(s,r)?Xt(`${t} — Größe und Lage`,R`
          ${e.slider("Größe",`${i}_size`,2,30,"%",.5)}
          ${e.slider("Von oben",`${i}_top`,0,100,"%",.5)}
          ${e.slider("Von links",`${i}_left`,0,100,"%",.5)}
          <small>Die Größe ist die Breite in Prozent der Beckenbreite.</small>
        `):F,ai=e=>{const t=((e,t={})=>{const i=t.mode_entity,s=i?e?.states?.[i]:null;if(!s)return null;const r=String(t.mode_attribute||"").trim(),n=r?s.attributes?.[r]:s.state,o=s.attributes||{},a=Array.isArray(o.options)?o.options:"preset_mode"===r&&Array.isArray(o.preset_modes)?o.preset_modes:!r&&Array.isArray(o.hvac_modes)?o.hvac_modes:[];return{roh:n??"",modus:wt(n,t),optionen:a.map(e=>({wert:String(e),modus:wt(e,t)}))}})(e.hass,e.config),i=t?R`<div class="modus-befund ${t.modus?"ok":"nein"}">
        Deine Pumpe meldet gerade: <b>${String(t.roh)||"—"}</b> →
        ${t.modus?R`erkannt als <b>${t.modus.label}</b> ✓`:R`nicht erkannt ✗ – bitte unten zuordnen`}
      </div>`:R`<div class="modus-befund">Wähle oben die Modus-Entity — dann steht hier, was sie meldet.</div>`,s=t&&t.optionen.length?R`<div class="modus-optionen">
          <small>Die Entity kennt diese Werte (automatisch zugeordnet):</small>
          <ul>
            ${t.optionen.map(e=>R`<li class="${e.modus?"ok":"nein"}">
                  ${e.wert} → ${e.modus?R`${e.modus.label} ✓`:R`nicht erkannt ✗`}
                </li>`)}
          </ul>
        </div>`:F;return Xt("Erweitert: Modus-Namen anpassen",R`
      ${i} ${s}
      ${ut.map(t=>e.text(t.label,`mode_map_${t.key}`,"",t.zustaende.join(", ")))}
      <small>
        Normalerweise nicht nötig: Werte mit Heizen/Kühlen und einer Stufe (Silent, Smart/Eco,
        Auto, Boost/Power/Turbo) erkennt die Card selbst, auch ohne Umlaute geschrieben. Nur
        wenn oben etwas „nicht erkannt" ist: hier die Zustände als Kommaliste eintragen. Eine
        eigene Liste ersetzt für diesen Modus Vorgabe und Automatik. Leer = Vorgabe (grau).
      </small>
    `,!!t&&!t.modus&&""!==String(t.roh)&&!["unknown","unavailable"].includes(String(t.roh)))},li={heatpump:pt,pump:at,uv:Et,solar:Tt},ci=(e,t)=>{const i={...e||{}};for(const[e,s]of Object.entries(t||{}))void 0===s?delete i[e]:i[e]=s;return i};class hi extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),(Wt()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(Ot||(Ot=(async()=>{try{const e=await window.loadCardHelpers(),t=await(e?.createCardElement?.({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",e?.message||e)}return Wt()})()),Ot)).then(e=>{e&&this.requestUpdate()})}setConfig(e){this._config={version:1,hero:{enabled:!0,shape:$e},frame:{enabled:!0,fill:"transparent"},slots:[],...e||{}}}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_updateHero(e){this._emit({...this._config,hero:ci(this._config.hero,e)})}_updateFrame(e){this._emit({...this._config,frame:ci(this._config.frame,e)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_setKiosk(e){this._emit(ci(this._config,e?{kiosk:!0}:{kiosk:void 0,kiosk_slots:void 0}))}_setKioskKasten(e,t){const i=nt(this._config),s=i.filter(i=>String(i)===String(e)?t:ot({...this._config,kiosk:!0},i));this._emit(ci(this._config,{kiosk_slots:s.length===i.length?void 0:s}))}_renderKiosk(){const e=!0===this._config?.kiosk,t=nt(this._config),i=this._slots();return R`
      <div class="kiosk-block ${e?"an":""}">
        <label class="kiosk-schalter">
          <input
            type="checkbox"
            data-key="kiosk"
            ?checked="${e}"
            @change="${e=>this._setKiosk(e.target.checked)}"
          />
          <span>Kiosk-Modus (nur anzeigen)</span>
        </label>
        <small>
          Für ein Wand-Tablet o.ä.: die gewählten Kästen zeigen alles an, lassen sich aber nicht
          bedienen — kein Schalten, kein Modus-Wählen, keine Detail-Dialoge. Dieselbe Card kann
          woanders ohne Kiosk normal bedienbar stehen.
        </small>
        ${e?R`<div class="kiosk-liste">
              ${t.map(e=>{const t=e===st?"Becken":this._slotKopf(i[e-1],e-1);return R`<label class="kiosk-kasten">
                  <input
                    type="checkbox"
                    data-kiosk-slot="${e}"
                    ?checked="${ot(this._config,e)}"
                    @change="${t=>this._setKioskKasten(e,t.target.checked)}"
                  />
                  <span>${t}</span>
                </label>`})}
            </div>`:F}
      </div>
    `}_updateSlot(e,t){const i=this._slots().map((i,s)=>s===e?ci(i,t):i);this._emit({...this._config,slots:i})}_updateEntry(e,t,i){const s=this._slots()[e]||{},r=Array.isArray(s.entries)?[...s.entries]:[];for(;r.length<=t;)r.push({});r[t]=ci(r[t],i),this._updateSlot(e,{entries:r})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(e){this._emit({...this._config,slots:this._slots().filter((t,i)=>i!==e)})}_moveSlot(e,t){const i=[...this._slots()],s=e+t;if(s<0||s>=i.length)return;const[r]=i.splice(e,1);i.splice(s,0,r),this._emit({...this._config,slots:i})}_fieldsFor(e){const t=this._slots()[e]||{};return new Qt({hass:this.hass,config:t,defaults:li[t.type]||{},update:t=>this._updateSlot(e,t),idPrefix:`slot${e}`,stash:this._stash})}_altTypOption(e){const t=Ce[e];return t&&!1===t.waehlbar?R`<option value="${e}" selected>${t.label}</option>`:F}_slotKopf(e,t){const i=Ce[e?.type]?.label||Ce.frame.label,s=String(e?.label||e?.label_text||e?.title||"").trim();return`Kasten ${t+1} · ${i}${s?` · ${s}`:""}`}_slotBody(e){const t=this._slots()[e]||{},i=this._fieldsFor(e);switch(t.type){case"heatpump":return(e=>R`
  ${qt(R`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("🔌 Freigabekontakt","show_release",["release_entity","release_top","release_left","release_scale","show_release_since"],!1)}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_top","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Ist-Temperatur","show_current",["current_entity","current_bottom","current_left","current_scale","current_box","current_label"])}
    ${e.element("🎚 Soll-Temperatur","show_target",["target_entity","target_bottom","target_left","target_scale","target_step","target_box","target_label"])}
    ${e.element("🌀 Lüfter","show_fan",["fan_source","fan_entity","fan_power_threshold","fan_speed","fan_top","fan_left","fan_size","fan_ratio","fan_inactive","fan_design","fan_color_mode"])}
    ${e.element("🔁 Betriebsmodus","show_mode",["mode_entity","mode_attribute","show_mode_badge","mode_top","mode_left","mode_scale",...ut.flatMap(e=>[`mode_speed_${e.key}`,`mode_map_${e.key}`])],!1)}
  `)}
  ${e.shown("show_power_button")?R`
        ${e.entity("Powerbutton — Schalter","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",...Yt)}
        ${ni(e)}
        ${Xt("Powerbutton — Position",R`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_release",!1)?R`
        ${e.entity("Freigabekontakt — Entity","release_entity","Der potentialfreie Eingang der Wärmepumpe: offen = sie darf nicht laufen, geschlossen = freigegeben.",...ri)}
        <small>
          Damit sperrt oder gibt man die Wärmepumpe von außen frei (PV-Überschuss, Zeitfenster) —
          ohne an ihren eigenen Einstellungen zu drehen. Ist der Kontakt offen, zeigt die Karte
          „Gesperrt" und der Lüfter steht still, auch wenn der Schalter an ist. Ein binary_sensor
          wird nur angezeigt, switch und input_boolean schalten per Klick um.
        </small>
        ${Xt("Freigabekontakt — Position",R`
            ${e.slider("Von oben","release_top",0,100,"%",.5)}
            ${e.slider("Von links","release_left",0,100,"%",.5)}
            ${e.slider("Größe","release_scale",50,200)}
          `)}
        ${e.toggle("Zeit seit dem letzten Wechsel anzeigen","show_release_since",!1)}
        <small>Klein unter dem Badge, z.B. „seit 2 Std 10 Min" — läuft minütlich mit.</small>
      `:F}
  ${e.shown("show_power")?R`
        ${e.entity("Stromverbrauch — Sensor","power_entity","Leistungssensor in W oder kW (z.B. Shelly).",...ei)}
        ${Xt("Stromverbrauch — Darstellung",R`
            ${e.slider("Von oben","power_top",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_current")?R`
        ${e.entity("Ist-Temperatur","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.",...ii)}
        ${Xt("Ist-Temperatur — Darstellung",R`
            ${e.slider("Von unten","current_bottom",0,100)}
            ${e.slider("Von links","current_left",0,100)}
            ${e.slider("Größe","current_scale",50,150)}
            ${e.toggle("Box anzeigen","current_box",!0)}
            ${e.toggle("Label anzeigen","current_label",!0)}
          `)}
      `:F}
  ${e.shown("show_target")?R`
        ${e.entity("Soll-Temperatur","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",...ii)}
        ${Xt("Soll-Temperatur — Darstellung",R`
            ${e.slider("Von unten","target_bottom",0,100)}
            ${e.slider("Von links","target_left",0,100)}
            ${e.slider("Größe","target_scale",50,150)}
            ${e.slider("Schrittweite","target_step",.1,5,"",.1)}
            ${e.toggle("Box anzeigen","target_box",!0)}
            ${e.toggle("Label anzeigen","target_label",!0)}
          `)}
      `:F}
  ${e.shown("show_fan")?R`
        ${Xt("Lüfter — wann dreht er?",R`
            ${e.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
            ${e.entity("Lüfter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
            ${e.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
            ${e.slider("Drehgeschwindigkeit","fan_speed",0,100)}
            <small>
              Ist der Schalter der Wärmepumpe aus, steht der Lüfter immer. Mit erkanntem
              Betriebsmodus gilt statt der Drehgeschwindigkeit das Tempo des Modus.
            </small>
          `,!0)}
        ${Xt("Lüfter — Aussehen",R`
            ${e.select("Blatt-Design","fan_design",Object.entries(Ze).map(([e,t])=>[e,t.label]),"klassisch")}
            ${e.select("Farbe","fan_color_mode",[["neutral","Schwarz/Weiß (wie die Schrift)"],["modus","Nach Modus: Heizen rot, Kühlen blau"]],"neutral")}
            <small>Die Färbung nach Modus braucht einen erkannten Betriebsmodus.</small>
          `)}
        ${Xt("Lüfter — Position",R`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Breite","fan_size",5,80,"%",.5)}
            ${e.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          `)}
      `:F}
  ${e.shown("show_mode",!1)?R`
        ${e.entity("Betriebsmodus — Entity","mode_entity","sensor, select, input_select oder climate — liefert den Modus der Wärmepumpe.",...si)}
        ${e.text("Attribut (optional)","mode_attribute","Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.","z.B. preset_mode")}
        ${Xt("Betriebsmodus — Anzeige auf der Card",R`
            ${e.toggle("Modus als Badge anzeigen","show_mode_badge",!0)}
            ${e.slider("Von oben","mode_top",0,100,"%",.5)}
            ${e.slider("Von links","mode_left",0,100,"%",.5)}
            ${e.slider("Größe","mode_scale",50,200)}
            <small>
              Klartext wie Heizen, Kühlen, Auto, Aus — bei climate.* mit Preset (z.B.
              Heizen · Eco). Unbekannte Werte erscheinen unübersetzt. Farbe wie das Rad.
            </small>
          `)}
        ${Xt("Betriebsmodus — Tempo je Modus",R`
            ${ut.map(t=>e.slider(t.label,`mode_speed_${t.key}`,1,ct,"",1))}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${ai(e)}
      `:F}
  ${e.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Wärmepumpe")}
  ${Xt("Freitext — Darstellung",R`
      ${e.slider("Von oben","label_top",0,100)}
      ${e.slider("Von links","label_left",0,100)}
      ${e.slider("Größe","label_scale",50,200)}
      ${e.toggle("Box anzeigen","label_box",!0)}
    `)}
`)(i);case"pump":return(e=>R`
  ${qt(R`
    ${e.element("🎚 Stufen-Taster","show_stages",["stage_mode","stage_entities","stop_entity","stage_labels"])}
    ${e.element("⏻ Powerbutton","show_power_button",["main_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label","stage_from_power","stage_watt_1","stage_watt_2","stage_watt_3"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("🌀 Laufrad","show_fan",["fan_top","fan_left","fan_size","fan_speed_1","fan_speed_2","fan_speed_3","fan_inactive","idle_watt"])}
  `)}
  ${e.text("Überschrift (optional)","label","","z.B. Poolpumpe")}
  ${e.shown("show_stages")?R`
        ${e.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
        ${e.entityAt("Stufe 1 (N1)","stage_entities",0,"",...Yt)}
        ${e.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"",...Yt)}
        ${e.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"",...Yt)}
        ${e.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...Yt)}
      `:F}
  ${e.shown("show_power_button")?R`
        ${e.entity("Hauptschalter","main_entity","Steckdose/Relais der Pumpe — Powerbutton.",...Yt)}
        ${ni(e)}
        ${Xt("Powerbutton — Position",R`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?R`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...ei)}
        ${Xt("Stromverbrauch — Darstellung",R`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
        ${e.raw("power_entity")?Xt("Stufe aus Leistung erkennen",R`
                ${e.toggle("Stufe aus Leistung erkennen","stage_from_power",!0)}
                ${!1!==e.val("stage_from_power")?R`
                      ${e.slider("N1 ab mehr als","stage_watt_1",0,300," W",1)}
                      ${e.slider("N2 ab mehr als","stage_watt_2",0,1500," W",5)}
                      ${e.slider("N3 ab mehr als","stage_watt_3",0,3e3," W",5)}
                    `:F}
                <small>
                  Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon
                  nichts — die Leistung schon. Unter der N1-Schwelle gilt die Pumpe als aus.
                  Die erkannte Stufe leuchtet und bestimmt das Tempo des Laufrads; die
                  Taster bleiben bedienbar.
                </small>
              `):F}
      `:F}
  ${e.shown("show_temp")?R`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...ti)}
        ${Xt("Thermometer — Position",R`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_fan")?R`
        ${Xt("Laufrad — Tempo",R`
            ${e.slider("Tempo N1","fan_speed_1",1,ct,"",1)}
            ${e.slider("Tempo N2","fan_speed_2",1,ct,"",1)}
            ${e.slider("Tempo N3","fan_speed_3",1,ct,"",1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${Xt("Laufrad — Position",R`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Größe","fan_size",3,60,"%",.5)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `)}
        ${Xt("Wann steht die Pumpe?",R`
            ${e.slider("Ruhewatt","idle_watt",0,200," W",1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).
              Bei „Stufe aus Leistung erkennen" gilt stattdessen die N1-Schwelle.</small>
          `)}
      `:F}
`)(i);case"uv":return(e=>R`
  ${qt(R`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("💡 Glüheffekt","show_glow",["glow_top","glow_left","glow_size","glow_thickness","glow_angle","glow_intensity","glow_pulse"])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${e.text("Überschrift (optional)","label","","z.B. UV-C-Lampe")}
  ${e.shown("show_power_button")?R`
        ${e.entity("Powerbutton — Schalter","switch_entity","Steckdose/Relais der Lampe.",...Yt)}
        ${ni(e)}
        ${Xt("Powerbutton — Position",R`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?R`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...ei)}
        ${Xt("Stromverbrauch — Darstellung",R`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_temp")?R`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...ti)}
        ${Xt("Thermometer — Position",R`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_glow")?Xt("Glüheffekt — Lage auf dem Rohr",R`
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
        `):F}
  ${Xt("Bild — Drehen, Spiegeln, Größe, Anschlussvariante",R`
      ${e.slider("Drehen","rotate",0,359,"°",1)}
      ${e.toggle("Waagrecht spiegeln","mirror",!1)}
      ${e.slider("Größe","uv_size",30,He)}
      ${e.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `)}
`)(i);case"solar":return(e=>R`
  ${qt(R`
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
  ${e.shown("show_power_button")?R`
        ${e.entity("Powerbutton — Ventil oder Pumpe","switch_entity","Solarventil oder Solarpumpe.",...Yt)}
        ${ni(e)}
        ${Xt("Powerbutton — Position",R`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_temp_in")?R`
        ${e.entity("Vorlauf-Temperatur","temp_in_entity","Wasser, das zum Absorber läuft — Zulauf links unten (blauer Pfeil).",...ti)}
        ${Xt("Vorlauf — Position",R`
            ${e.slider("Von oben","temp_in_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_in_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_in_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_temp_out")?R`
        ${e.entity("Rücklauf-Temperatur","temp_out_entity","Wasser, das zurück ins Becken läuft — Ablauf rechts oben (roter Pfeil).",...ti)}
        ${Xt("Rücklauf — Position",R`
            ${e.slider("Von oben","temp_out_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_out_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_out_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?R`
        ${e.entity("Stromverbrauch","power_entity","Solarpumpe in W oder kW.",...ei)}
        ${Xt("Stromverbrauch — Darstellung",R`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_arrows")?Xt("Richtungspfeile — Lage",R`
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
        `):F}
`)(i);case"custom":return((e,t)=>{const i=Array.isArray(e.config?.entries)?e.config.entries:[],s=It(e.config).length,r=Math.min(8,Math.max(3,i.length+1)),n=Ft(e.config);return R`
    ${e.text("Überschrift (optional)","title","","z.B. Wetter")}
    ${e.select("Darstellung","layout",[["klassisch","Klassisch (mittig gestapelt)"],["liste","Liste (Zeilen mit Schalter, wie HA-Entities)"],["kacheln","Kacheln (2 Spalten)"]],Kt)}
    ${e.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"klassisch"===n?"mitte":"oben")}
    ${s>8?R`<div class="limit-warnung" role="alert">
          ⚠ ${s} Einträge eingetragen — der Kasten zeigt höchstens ${8}.
          Einträge ${9}–${s} werden ausgeblendet. Bitte entfernen oder
          auf einen zweiten Kasten verteilen.
        </div>`:F}
    ${"liste"===n&&s>4?R`<small class="limit-hinweis">
          Ab 5 Zeilen wird der Kasten höher als eine Standard-Karte (Titel + 4 Zeilen).
        </small>`:F}
    ${Array.from({length:r},(e,i)=>Xt(`Eintrag ${i+1}`,t(i),0===i))}
    <small>Bis zu ${8} Einträge. Leere Einträge werden nicht angezeigt.</small>
  `})(i,i=>(e=>R`
  ${e.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===e.config?.kind?e.text("Text","text","","z.B. Sommerbetrieb"):R`
        ${e.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate")}
        ${e.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===e.config?.kind?e.icon("Icon (optional)","icon"):F}
        ${"button"===e.config?.kind?ni(e,!1,"An = vor dem Ausschalten kommt eine Rückfrage."):F}
      `}
`)(new Qt({hass:this.hass,config:(Array.isArray(t.entries)?t.entries:[])[i]||{},update:t=>this._updateEntry(e,i,t),idPrefix:`slot${e}e${i}`,stash:this._stash})));case"hidden":return R`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;default:return(e=>R`
  ${e.text("Überschrift (optional)","title","","z.B. Platzhalter")}
  ${e.text("Hinweistext (optional)","hint","","")}
`)(i)}}render(){if(!this._config)return F;const e=this._config.hero||{},t=this._config.frame||{},i=new Qt({hass:this.hass,config:e,defaults:tt(e.shape),update:e=>this._updateHero(e),idPrefix:"hero",stash:this._stash}),s=new Qt({hass:this.hass,config:t,update:e=>this._updateFrame(e),idPrefix:"frame",stash:this._stash}),r=this._slots();return R`
      <div class="editor">
        ${this._renderKiosk()}
        <div class="step-head">Schritt 1 — Becken</div>
        <div class="slot-block becken-block" style="--slot-farbe:${Le("hero")};">
          <div class="slot-ueberschrift">Becken</div>
          <div class="slot-card becken-card">
            ${i.toggle("Becken anzeigen","enabled",!0)}
            ${!1===e.enabled?F:(e=>R`
  ${qt(R`
    ${e.element("🌡 Thermometer","show_thermo",["temp_entity","thermo_scale","thermo_top","thermo_left"])}
    ${e.element("🧪 pH-Kästchen","show_ph",["ph_entity","ph_top","ph_left"])}
    ${e.element("⚗ Redox / RX-Kästchen","show_rx",["rx_entity","rx_top","rx_left"])}
    ${e.element("🛟 Skimmer","show_skimmer",["skimmer_size","skimmer_top","skimmer_left"])}
    ${e.element("💦 Einlaufdüse","show_inlet",["inlet_size","inlet_top","inlet_left","inlet_temp_entity","inlet_temp_top","inlet_temp_left"])}
    ${e.element("⚓ Bodenablauf","show_drain",["drain_size","drain_top","drain_left"],!1)}
  `)}
  ${e.select("Beckenform","shape",Object.entries(we).map(([e,t])=>[e,t.label]),"oval")}
  ${e.shown("show_thermo")?R`
        ${e.entity("Wassertemperatur","temp_entity","Zeigt das Thermometer auf der Wasserfläche.",...ti)}
        ${Xt("Thermometer — Position",R`
            ${e.slider("Größe","thermo_scale",50,200)}
            ${e.slider("Von oben","thermo_top",0,100,"%",.5)}
            ${e.slider("Von links","thermo_left",0,100,"%",.5)}
          `)}
      `:F}
  ${e.shown("show_ph")?R`
        ${e.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...ti)}
        ${Xt("pH — Position",R`
            ${e.slider("Von oben","ph_top",0,100,"%",.5)}
            ${e.slider("Von links","ph_left",0,100,"%",.5)}
          `)}
      `:F}
  ${e.shown("show_rx")?R`
        ${e.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...ti)}
        ${Xt("RX — Position",R`
            ${e.slider("Von oben","rx_top",0,100,"%",.5)}
            ${e.slider("Von links","rx_left",0,100,"%",.5)}
          `)}
      `:F}
  ${oi(e,"Skimmer","skimmer","show_skimmer",!0)}
  ${oi(e,"Einlaufdüse","inlet","show_inlet",!0)}
  ${e.shown("show_inlet",!0)?R`
        ${e.entity("Temperatur am Einlauf (optional)","inlet_temp_entity","Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",...ti)}
        ${e.raw("inlet_temp_entity")?Xt("Einlauf-Temperatur — Position",R`
                ${e.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
                ${e.slider("Von links","inlet_temp_left",0,100,"%",.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `):F}
      `:F}
  ${oi(e,"Bodenablauf","drain","show_drain",!1)}
  ${e.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${e.raw("label_text")?Xt("Freitext — Darstellung",R`
          ${e.slider("Größe","label_scale",50,200)}
          ${e.slider("Von oben","label_top",0,100,"%",.5)}
          ${e.slider("Von links","label_left",0,100,"%",.5)}
        `):F}
  ${e.toggle("Becken mit Rahmen","framed",!1)}
`)(i)}
          </div>
        </div>

        <div class="step-head">Schritt 2 — Geräte</div>
        ${r.map((e,t)=>R`
            <div class="slot-block" style="--slot-farbe:${Le(e.type)};">
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
                      ${We().map(t=>t.trenner?R`<option disabled data-trenner>${t.label}</option>`:R`
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
        ${s.toggle("Rahmen um die Slots","enabled",!0)}
        ${s.select("Füllung","fill",[["transparent","Transparent (Theme)"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        <small>
          Die Füllung gilt für den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und
          Schriftfarbe. Transparent nimmt den Hintergrund des HA-Themes.
        </small>
      </div>
    `}static styles=[Jt]}customElements.define("tomtut-pool-dashboard-editor",hi),
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
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{Ee as ASSET_VERSION,Me as BLOCK_FARBEN,Vt as CUSTOM_LAYOUTS,Kt as CUSTOM_LAYOUT_DEFAULT,Dt as CUSTOM_MAX_ENTRIES,ye as DEVICE_IMAGES,ze as DEVICE_RATIOS,xe as DEVICE_VARIANTS,Ze as FAN_DESIGNS,Qe as FAN_DESIGN_DEFAULT,Se as FLOW_MARKERS,Bt as GLOW_PULSE_MAX,He as GROESSE_MAX,Ke as GROESSE_MIN,pt as HEATPUMP_DEFAULTS,et as HERO_DEFAULTS,ke as HERO_SPRITES,ut as HP_MODES,Ye as INLET_TEMP_VERSATZ,st as KIOSK_BECKEN,mt as MODE_FARBEN,$t as MODE_WOERTER,at as PUMP_DEFAULTS,we as SHAPES,Te as SLOT_GRAU,Ce as SLOT_TYPES,Oe as SLOT_TYPE_GROUPS,Tt as SOLAR_DEFAULTS,Zt as TomtutPoolDashboardCard,hi as TomtutPoolDashboardEditor,Et as UV_DEFAULTS,ci as applyPatch,Ie as bildTransform,It as customEintraege,Ft as customLayout,ht as fanDuration,Pt as glowPulsWerte,Re as groesseFaktor,tt as heroDefaultsFor,Be as imagePath,ot as kioskGilt,nt as kioskSchluessel,bt as modeAuto,xt as modeBadge,wt as modeFromState,kt as modeWort,St as modusWahl,Ne as normGrad,he as numOf,ge as numText,Ve as passFaktor,ue as seit,me as seitMinuten,Le as slotFarbe,We as slotTypeOptions,lt as stageFromWatt,pe as toWatt};
