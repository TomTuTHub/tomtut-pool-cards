const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let s=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new s(n,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new s("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:a,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:c,getOwnPropertySymbols:p,getPrototypeOf:d}=Object,u=globalThis,_=u.trustedTypes,f=_?_.emptyScript:"",m=u.reactiveElementPolyfillSupport,g=(e,t)=>e,b={toAttribute(e,t){switch(t){case Boolean:e=e?f:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},w=(e,t)=>!a(e,t),$={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:w};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let y=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&l(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:s}=h(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const r=n?.call(this);s?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=d(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...c(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of n){const n=document.createElement("style"),s=e.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(t,i.type);this._$Em=e,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),s="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:b;this._$Em=n;const r=s.fromAttribute(t,e.type);this[n]=r??this._$Ej?.get(n)??r,this._$Em=null}}requestUpdate(e,t,i,n=!1,s){if(void 0!==e){const r=this.constructor;if(!1===n&&(s=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??w)(s,t)||i.useDefault&&i.reflect&&s===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:s},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==s||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};y.elementStyles=[],y.shadowRootOptions={mode:"open"},y[g("elementProperties")]=new Map,y[g("finalized")]=new Map,m?.({ReactiveElement:y}),(u.reactiveElementVersions??=[]).push("2.1.2");const v=globalThis,x=e=>e,k=v.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,z="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,P=`<${E}>`,B=document,C=()=>B.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,M=Array.isArray,L="[ \t\n\f\r]",V=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,O=/>/g,D=RegExp(`>|${L}(?:([^\\s"'>=/]+)(${L}*=${L}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),W=/'/g,H=/"/g,R=/^(?:script|style|textarea|title)$/i,U=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),G=Symbol.for("lit-noChange"),I=Symbol.for("lit-nothing"),j=new WeakMap,K=B.createTreeWalker(B,129);function F(e,t){if(!M(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Z=(e,t)=>{const i=e.length-1,n=[];let s,r=2===t?"<svg>":3===t?"<math>":"",o=V;for(let t=0;t<i;t++){const i=e[t];let a,l,h=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===V?"!--"===l[1]?o=N:void 0!==l[1]?o=O:void 0!==l[2]?(R.test(l[2])&&(s=RegExp("</"+l[2],"g")),o=D):void 0!==l[3]&&(o=D):o===D?">"===l[0]?(o=s??V,h=-1):void 0===l[1]?h=-2:(h=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?D:'"'===l[3]?H:W):o===H||o===W?o=D:o===N||o===O?o=V:(o=D,s=void 0);const p=o===D&&e[t+1].startsWith("/>")?" ":"";r+=o===V?i+P:h>=0?(n.push(a),i.slice(0,h)+z+i.slice(h)+A+p):i+A+(-2===h?t:p)}return[F(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class Q{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let s=0,r=0;const o=e.length-1,a=this.parts,[l,h]=Z(e,t);if(this.el=Q.createElement(l,i),K.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=K.nextNode())&&a.length<o;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(z)){const t=h[r++],i=n.getAttribute(e).split(A),o=/([.?@])?(.*)/.exec(t);a.push({type:1,index:s,name:o[2],strings:i,ctor:"."===o[1]?ee:"?"===o[1]?te:"@"===o[1]?ie:Y}),n.removeAttribute(e)}else e.startsWith(A)&&(a.push({type:6,index:s}),n.removeAttribute(e));if(R.test(n.tagName)){const e=n.textContent.split(A),t=e.length-1;if(t>0){n.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],C()),K.nextNode(),a.push({type:2,index:++s});n.append(e[t],C())}}}else if(8===n.nodeType)if(n.data===E)a.push({type:2,index:s});else{let e=-1;for(;-1!==(e=n.data.indexOf(A,e+1));)a.push({type:7,index:s}),e+=A.length-1}s++}}static createElement(e,t){const i=B.createElement("template");return i.innerHTML=e,i}}function X(e,t,i=e,n){if(t===G)return t;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const r=T(t)?void 0:t._$litDirective$;return s?.constructor!==r&&(s?._$AO?.(!1),void 0===r?s=void 0:(s=new r(e),s._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(t=X(e,s._$AS(e,t.values),s,n)),t}class q{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??B).importNode(t,!0);K.currentNode=n;let s=K.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let t;2===a.type?t=new J(s,s.nextSibling,this,e):1===a.type?t=new a.ctor(s,a.name,a.strings,this,e):6===a.type&&(t=new ne(s,this,e)),this._$AV.push(t),a=i[++o]}r!==a?.index&&(s=K.nextNode(),r++)}return K.currentNode=B,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=I,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=X(this,e,t),T(e)?e===I||null==e||""===e?(this._$AH!==I&&this._$AR(),this._$AH=I):e!==this._$AH&&e!==G&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>M(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==I&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(B.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=Q.createElement(F(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new q(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=j.get(e.strings);return void 0===t&&j.set(e.strings,t=new Q(e)),t}k(e){M(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const s of e)n===t.length?t.push(i=new J(this.O(C()),this.O(C()),this,this.options)):i=t[n],i._$AI(s),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,s){this.type=1,this._$AH=I,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=I}_$AI(e,t=this,i,n){const s=this.strings;let r=!1;if(void 0===s)e=X(this,e,t,0),r=!T(e)||e!==this._$AH&&e!==G,r&&(this._$AH=e);else{const n=e;let o,a;for(e=s[0],o=0;o<s.length-1;o++)a=X(this,n[i+o],t,o),a===G&&(a=this._$AH[o]),r||=!T(a)||a!==this._$AH[o],a===I?e=I:e!==I&&(e+=(a??"")+s[o+1]),this._$AH[o]=a}r&&!n&&this.j(e)}j(e){e===I?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends Y{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===I?void 0:e}}class te extends Y{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==I)}}class ie extends Y{constructor(e,t,i,n,s){super(e,t,i,n,s),this.type=5}_$AI(e,t=this){if((e=X(this,e,t,0)??I)===G)return;const i=this._$AH,n=e===I&&i!==I||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,s=e!==I&&(i===I||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ne{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){X(this,e)}}const se=v.litHtmlPolyfillSupport;se?.(Q,J),(v.litHtmlVersions??=[]).push("3.3.3");const re=globalThis;class oe extends y{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let s=n._$litPart$;if(void 0===s){const e=i?.renderBefore??null;n._$litPart$=s=new J(t.insertBefore(C(),e),e,void 0,i??{})}return s._$AI(e),s})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}oe._$litElement$=!0,oe.finalized=!0,re.litElementHydrateSupport?.({LitElement:oe});const ae=re.litElementPolyfillSupport;ae?.({LitElement:oe}),(re.litElementVersions??=[]).push("4.2.2");const le=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],he=e=>le.includes(String(e).toLowerCase()),ce=e=>{if(null==e)return null;const t=String(e).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(t))return null;const i=Number(t);return isFinite(i)?i:null},pe=(e,t=0)=>{const i=Number(e);return isFinite(i)?i.toFixed(t).replace(".",","):"—"},de=e=>{if(!e)return null;const t=ce(e.state);if(null===t)return null;return"kw"===String(e.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*t:t},ue=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const n=Math.max(0,(t-i)/1e3);if(n<60)return`seit ${Math.floor(n)} Sek`;const s=n/60;if(s<60)return`seit ${Math.floor(s)} Min`;const r=s/60;if(r<24)return`seit ${Math.floor(r)} Std`;const o=Math.floor(r/24);return o<=1?"seit 1 Tag":`seit ${o} Tagen`},_e=e=>String(e||"").split(".")[0],fe=(e,t)=>e?.attributes?.friendly_name||String(t||"").split(".")[1]||String(t||""),me=(e,{decimals:t}={})=>{const i=ce(e?.state);if(null===i)return"—";const n=t??(Number.isInteger(i)?0:1),s=e.attributes?.unit_of_measurement;return pe(i,Math.min(n,1))+(s?" "+s:"")},ge={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},be="oval",we=e=>ge[String(e||"").toLowerCase()]||ge[be],$e={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},ye={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1}},ve={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},xe={heatpump:988/725,pump:1126/756,uv:947/384,solar:1198/852},ke={in:"pfeil_blau.png",out:"pfeil_rot.png"},Se=e=>"/local/community/tomtut-pool-cards/"+e,ze=e=>xe[e]||1,Ae={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},Ee="#8a8f98",Pe=e=>Ae[e]?.farbe||Ee,Be=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],Ce=()=>{const e=new Set(Be.flatMap(e=>e.keys)),t=Object.keys(Ae).filter(t=>!e.has(t)&&!1!==Ae[t].waehlbar),i=e=>({value:e,label:Ae[e].label+(!1===Ae[e].ready?" (folgt)":"")}),n=[];for(const e of Be){e.trenner&&n.push({trenner:!0,label:e.trenner});for(const t of e.keys)Ae[t]&&n.push(i(t))}for(const e of t)n.push(i(e));return n},Te=e=>{const t=Number(e);return isFinite(t)?(Math.round(t)%360+360)%360:0},Me=e=>Math.abs(e)<1e-9?0:Math.abs(e),Le=(e,t)=>{const i=Number(t)>0?Number(t):1,n=Te(e)*Math.PI/180,s=Me(Math.cos(n)),r=Me(Math.sin(n));return Math.min(1,i/(i*s+r),1/(i*r+s))},Ve=30,Ne=100,Oe=e=>{const t=Number(e);return isFinite(t)?Math.min(Ne,Math.max(30,t))/100:1},De=(e,t,i,n=100)=>{const s=Te(e),r=(e=>Math.round(1e3*e)/1e3)(Le(s,i)*Oe(n)),o=[];return s&&o.push(`rotate(${s}deg)`),r<1&&o.push(`scale(${r})`),!0===t&&o.push("scaleX(-1)"),o.length?`transform:${o.join(" ")};`:""},We='<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>',He='fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"',Re=(e,t,i="")=>Array.from({length:t},(n,s)=>{const r=Math.round(360/t*s*100)/100;return`<path d="${e}" ${He}${i}${r?` transform="rotate(${r} 20 20)"`:""}/>`}).join(""),Ue=(e=3.2)=>`<circle cx="20" cy="20" r="${e}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`,Ge={klassisch:{label:"Klassisch (4 Blätter)",svg:We},drei:{label:"3 Blätter, breit",svg:Re("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z",3)+Ue(3.6)},fuenf:{label:"5 Blätter, schlank",svg:Re("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z",5)+Ue(3)},sichel:{label:"Sichel / Turbine",svg:Re("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z",7)+'<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>'+Ue(3.4)},propeller:{label:"Propeller",svg:Re("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z",2)+'<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>'},batman:{label:"Batman",svg:'<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" '+He+"/>"}},Ie="klassisch";class je extends oe{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this._confirmOpen=!1}get defaults(){return{}}_v(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}_ent(e){return e?this.hass?.states?.[e]:void 0}_isOn(e){const t=this._ent(e);return!!t&&he(t.state)}_watt(e){return de(this._ent(e))}_call(e,t,i={}){e&&this.hass&&this.hass.callService(_e(e),t,{entity_id:e,...i})}_moreInfo(e){const t=e?.currentTarget?.dataset?.entity;t&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0})))}get _frameClasses(){const e=this.frame||{},t=["transparent","weiss","schwarz"].includes(e.fill)?e.fill:"transparent";return`slot ${!1===e.enabled?"":"framed"} fill-${t}`}renderSlot(e){return U`<div class="${this._frameClasses}">${e}</div>`}renderGeraeteBild({kind:e,variante:t,alt:i,rotate:n=0,mirror:s=!1,groesse:r=100,inhalt:o=I}){const a=ze(e);return U`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*a)/1e4};">
        <div class="bild" style="${De(n,s,a,r)}">
          <img src="${((e,t)=>Se(ve[e]?.[t]||$e[e]||""))(e,t)}" alt="${i}" />
          ${o}
        </div>
      </div>
    `}renderFan({active:e,top:t,left:i,size:n,ratio:s,dur:r,inactive:o,round:a=!1,design:l,farbe:h}){const c=e?"spinning":"hidden"===o?"hidden":"idle",p=a?1:Number(s)||1,d=l?(e=>(Ge[e]||Ge[Ie]).svg)(l):We;return U`
      <div
        class="fan-overlay ${c} ${a?"round":""} design-${l&&Ge[l]?l:Ie}"
        style="top:${t}%; left:${i}%; width:${n}%; --fan-dur:${r}s; --fan-ratio:${p};${h?` --tt-fan-color:${h};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${a?"xMidYMid meet":"none"}">
          <g .innerHTML="${d}"></g>
        </svg>
      </div>
    `}renderPowerButton({on:e,top:t,left:i,scale:n}){return U`
      <div
        class="power-badge ${e?"on":"off"}"
        style="top:${t}%; left:${i}%; transform:scale(${(n??100)/100});"
        title="${e?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `}renderValueBox({value:e,unit:t,top:i,bottom:n,left:s,scale:r,box:o,entity:a}){return U`
      <div
        class="value-box ${!1===o?"no-bg":""}"
        style="${void 0===n?`top:${i}%;`:`bottom:${n}%;`} left:${s}%; transform:translateX(-50%) scale(${(r??100)/100});"
        data-entity="${a||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${e}</span>
        ${t?U`<span class="unit">${t}</span>`:I}
      </div>
    `}renderThermo({value:e,top:t,left:i,scale:n,entity:s}){return U`
      <div
        class="thermo"
        style="top:${t}%; left:${i}%; --thermo-size:${(n??100)/100*3.6}em;"
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
        ${e?U`<span class="thermo-val">${e}</span>`:I}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}get confirmDefault(){return!0}get fragtNach(){const e=this.config?.confirm_off;return null==e||""===e?this.confirmDefault:!1!==e}_onPowerClick(e){e?.stopPropagation();const t=this.powerEntityId;t&&(this._isOn(t)?this.fragtNach?this._confirmOpen=!0:this._call(t,"turn_off"):this._call(t,"turn_on"))}_confirmOff(e){e?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(e){e?.stopPropagation(),this._confirmOpen=!1}renderConfirm(e="Wirklich stromlos schalten?"){return this._confirmOpen?U`
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
    `:I}wattText(e,t=0){const i=this._watt(e);return null===i?"—":pe(i,t)}}const Ke=r`
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
`,Fe=r`
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
`,Ze={top:8,left:11},Qe={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:ye.skimmer.groesse,inlet_size:ye.einlauf.groesse,drain_size:ye.drain.groesse},Xe=e=>{const t=we(e),i={};for(const e of Object.values(ye)){const n=t[e.anker];n&&(i[`${e.anker}_top`]=n.top,i[`${e.anker}_left`]=n.left)}return{...Qe,thermo_top:t.thermo.top,thermo_left:t.thermo.left,ph_top:t.ph.top,ph_left:t.ph.left,rx_top:t.rx.top,rx_left:t.rx.left,...i,inlet_temp_top:(t.inlet?.top??12)+Ze.top,inlet_temp_left:(t.inlet?.left??66)+Ze.left,label_top:t.label_anker?.top??Qe.label_top,label_left:t.label_anker?.left??Qe.label_left}};class qe extends je{get defaults(){return{...Xe(this.config?.shape),inlet_temp_top:this._anchor("inlet","top")+Ze.top,inlet_temp_left:this._anchor("inlet","left")+Ze.left}}_spriteAn(e){const t=Object.values(ye).find(t=>t.anker===e),i=this.config?.[`show_${e}`];return null==i?!!t?.standard:!1!==i}get shape(){return we(this.config?.shape)}_anchor(e,t){const i=`${e}_${t}`,n=this.config?.[i];return null!=n&&""!==n?Number(n):this.shape[e]?.[t]??50}render(){const e=this.config||{},t=this.shape,i=!0===e.framed,n=!1!==e.show_thermo&&!!e.temp_entity,s=!1!==e.show_ph&&!!e.ph_entity,r=!1!==e.show_rx&&!!e.rx_entity,o=!!e.inlet_temp_entity&&this._spriteAn("inlet"),a=U`
      <div class="img-wrap">
        <img src="${Se(t.file)}" alt="Pool ${t.label}" />
        ${this._sprites()}

        ${n?this.renderThermo({value:me(this._ent(e.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:e.temp_entity}):I}
        ${s?this._chemBox("pH",e.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):I}
        ${r?this._chemBox("RX",e.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):I}
        ${o?this._chemBox("Zulauf",e.inlet_temp_entity,this._v("inlet_temp_top"),this._v("inlet_temp_left"),"inlet-temp"):I}
        ${e.label_text?U`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
            >
              ${e.label_text}
            </div>`:I}
      </div>
    `;return i?this.renderSlot(a):U`<div class="${this._frameClasses} bare">${a}</div>`}_sprites(){return Object.values(ye).map(e=>{if(!this._spriteAn(e.anker))return I;const t=Number(this._v(`${e.anker}_size`)),i=t>0?t:e.groesse;return U`<img
        class="hero-sprite sprite-${e.anker}"
        src="${Se(e.file)}"
        alt=""
        style="top:${this._anchor(e.anker,"top")}%; left:${this._anchor(e.anker,"left")}%; width:${i}%;"
      />`})}_chemBox(e,t,i,n,s=""){const r=this._ent(t);return U`
      <div
        class="chem-box ${s}"
        style="top:${i}%; left:${n}%;"
        data-entity="${t}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${e}</span>
        <span class="chem-val">${me(r)}</span>
      </div>
    `}static styles=[Ke,Fe,r`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",qe);const Je={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30,stage_from_power:!0,stage_watt_1:20,stage_watt_2:300,stage_watt_3:500},Ye=(e,t=[20,300,500],i=3)=>{const n=Number(e);if(null==e||!isFinite(n)||i<1)return null;let s=null;return t.slice(0,3).forEach((e,t)=>{const i=Number(e);isFinite(i)&&n>i&&(s=t)}),null===s?null:Math.min(s,i-1)},et=10,tt=e=>{const t=Math.min(et,Math.max(1,Number(e)||1)),i=4*Math.pow(.125,(t-1)/9);return Math.round(100*i)/100};class it extends je{static properties={...je.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return Je}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const e=this.config?.stage_entities;return(Array.isArray(e)?e:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const e=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((t,i)=>e[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}get _wattStufeAktiv(){return!1!==this._v("stage_from_power")&&!!this.config?.power_entity}_wattStufe(){if(!this._wattStufeAktiv)return;const e=this._watt(this.config.power_entity);if(null===e)return;const t=[1,2,3].map(e=>this._v(`stage_watt_${e}`));return Ye(e,t,Math.max(1,this.stages.length))}_derive(){const e=this._deriveSchalter(),t=this._wattStufe();if(void 0===t)return e;if(null===t)return{active:null,stopped:!0,since:e.stopped?e.since:null};return{active:t,stopped:!1,since:e.active!==t||e.stopped?null:e.since,ausLeistung:!0}}_deriveSchalter(){if("latching"===this.mode){let e=null;if(this.stages.forEach((t,i)=>{const n=this._ent(t);if(!n||!he(n.state))return;const s=Date.parse(n.last_changed||0)||0;(!e||s>e.t)&&(e={i:i,t:s,since:n.last_changed})}),!e){const e=this._ent(this.stopEntity);return{active:null,stopped:!0,since:e?.last_changed||null}}return{active:e.i,stopped:!1,since:e.since}}const e=this.stages.map((e,t)=>({id:e,i:t}));this.stopEntity&&e.push({id:this.stopEntity,i:-1});let t=null;for(const i of e){const e=this._ent(i.id);if(!e||!e.last_changed)continue;const n=Date.parse(e.last_changed);isNaN(n)||(!t||n>t.t)&&(t={...i,t:n,since:e.last_changed})}return t?-1===t.i?{active:null,stopped:!0,since:t.since}:{active:t.i,stopped:!1,since:t.since}:{active:null,stopped:!1,since:null}}get state(){const e=this._derive(),t=this._optimistic;if(t&&Date.now()-t.t<6e3){if(-1===t.i&&!e.stopped)return{active:null,stopped:!0,since:null};if(t.i>=0&&e.active!==t.i)return{active:t.i,stopped:!1,since:null}}return e}get running(){const e=this.state;if(this.blockedByMain)return!1;if(e.stopped||null===e.active)return!1;if(e.ausLeistung)return!0;const t=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(t)&&i<t)}_clickStage(e){if(this.blockedByMain)return;const t=this.stages[e];t&&(this._optimistic={i:e,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((t,i)=>{i!==e&&this._call(t,"turn_off")}),this._call(t,"turn_on")):this._call(t,"turn_on"))}_clickStop(){this.blockedByMain||(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(e=>this._call(e,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const e=this.config||{},t=((e={})=>!!(Array.isArray(e.stage_entities)&&e.stage_entities.filter(Boolean).length||e.main_entity))(e),i=this.state,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1",s=!1!==e.show_power&&!!e.power_entity,r=!1!==e.show_temp&&!!e.temp_entity,o=!1!==e.show_power_button&&!!e.main_entity,a=!1!==e.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(U`
      ${e.label?U`<h3 class="slot-title">${e.label}</h3>`:I}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===e.show_fan?I:this.renderFan({active:t&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:tt(this._v(n)),inactive:this._v("fan_inactive"),round:!0})}
          ${o?this.renderPowerButton({on:this._isOn(e.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
          ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):I}
          ${r?this.renderThermo({value:me(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):I}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${a?U`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((e,t)=>U`
                    <button
                      class="stage-btn ${i.active!==t||i.stopped?"":"active"}"
                      @click="${()=>this._clickStage(t)}"
                      title="${this.stageLabels[t]}"
                    >
                      <span class="stage-name">${this.stageLabels[t]}</span>
                      ${i.active===t&&!i.stopped&&i.since?U`<span class="stage-since">${ue(i.since)}</span>`:I}
                    </button>
                  `)}
                ${this._showStop?U`
                      <button
                        class="stage-btn stop ${i.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${i.stopped&&i.since?U`<span class="stage-since">${ue(i.since)}</span>`:I}
                      </button>
                    `:I}
              </div>
            `:I}
      </div>
      ${t?I:U`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[Ke,Fe,r`
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
    `]}customElements.define("tomtut-pool-slot-pump",it);const nt={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,fan_design:"klassisch",fan_color_mode:"neutral",mode_speed_heiz_silent:3,mode_speed_heiz_smart:5,mode_speed_heiz_auto:6,mode_speed_heiz_boost:9,mode_speed_kuehl_silent:3,mode_speed_kuehl_smart:5,mode_speed_kuehl_auto:6,mode_speed_kuehl_boost:9,power_btn_top:5,power_btn_left:3,power_btn_scale:139,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},st=[{key:"heiz_silent",label:"Heizen Silent",art:"heizen",zustaende:["Heizen Silent","heat_silent","heating_silent","silent_heat"]},{key:"heiz_smart",label:"Heizen Smart",art:"heizen",zustaende:["Heizen Smart","heat_smart","heating_smart","smart_heat"]},{key:"heiz_auto",label:"Heizen Auto",art:"heizen",zustaende:["Heizen Auto","heat_auto","heating_auto","auto_heat"]},{key:"heiz_boost",label:"Heizen Boost",art:"heizen",zustaende:["Heizen Boost","heat_boost","heating_boost","boost_heat","heat_turbo","heat_powerful"]},{key:"kuehl_silent",label:"Kühlen Silent",art:"kuehlen",zustaende:["Kühlen Silent","cool_silent","cooling_silent","silent_cool"]},{key:"kuehl_smart",label:"Kühlen Smart",art:"kuehlen",zustaende:["Kühlen Smart","cool_smart","cooling_smart","smart_cool"]},{key:"kuehl_auto",label:"Kühlen Auto",art:"kuehlen",zustaende:["Kühlen Auto","cool_auto","cooling_auto","auto_cool"]},{key:"kuehl_boost",label:"Kühlen Boost",art:"kuehlen",zustaende:["Kühlen Boost","cool_boost","cooling_boost","boost_cool","cool_turbo","cool_powerful"]}],rt={heizen:"#e0452c",kuehlen:"#2f7fd0"},ot=e=>String(e??"").toLowerCase().replace(/[\s_-]+/g," ").trim(),at=(e,t={})=>{const i=ot(e);return i&&st.find(e=>((e={},t)=>{const i=e[`mode_map_${t.key}`];return"string"==typeof i&&i.trim()?i.split(",").map(e=>e.trim()).filter(Boolean):Array.isArray(i)&&i.length?i.map(String):t.zustaende})(t,e).some(e=>ot(e)===i))||null};class lt extends je{get defaults(){return nt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _target(){const e=this.config.target_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),n=ce(i?t.attributes?.temperature:t.state);if(null===n)return null;const s=t.attributes||{};return{climate:i,value:n,min:i?s.min_temp??5:s.min??5,max:i?s.max_temp??40:s.max??40,step:this.config.target_step??(i?s.target_temp_step??.5:s.step??.5),unit:i?this.hass?.config?.unit_system?.temperature??"°C":s.unit_of_measurement??"°C"}}get _current(){const e=this.config.current_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),n=ce(i?t.attributes?.current_temperature:t.state);return null===n?null:{value:n,unit:i?this.hass?.config?.unit_system?.temperature??"°C":t.attributes?.unit_of_measurement??"°C"}}get _modus(){const e=this.config||{};if(!1===e.show_mode||!e.mode_entity)return null;const t=this._ent(e.mode_entity);if(!t)return null;const i=String(e.mode_attribute||"").trim(),n=i?t.attributes?.[i]:t.state;return at(n,e)}get _fanDur(){const e=this._modus;if(e)return tt(this._v(`mode_speed_${e.key}`));const t=Number(this._v("fan_speed"))||0;return t<=0?0:Math.max(.2,4-t/100*3.6)}get _fanFarbe(){if("modus"!==this._v("fan_color_mode"))return"";const e=this._modus;return e?rt[e.art]:""}get _fanActive(){const e=this.config.switch_entity;if(e&&this._ent(e)&&!this._isOn(e))return!1;const t=this.config.fan_source??"auto",i=this._ent(this.config.fan_entity);if("power"!==t&&i){const e=String(i.state).toLowerCase();if(he(e))return!0;const t=ce(e);return null!==t&&t>0}if("entity"===t)return!1;const n=this._watt(this.config.power_entity);return null!==n&&n>=Number(this._v("fan_power_threshold"))}_stepTarget(e){const t=this._target;if(!t||!this.hass)return;let i=Math.round((t.value+e*t.step)/t.step)*t.step;i=Math.min(t.max,Math.max(t.min,i)),i=Math.round(100*i)/100,i!==t.value&&(t.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(e){e?.stopPropagation(),this._stepTarget(1)}_targetDown(e){e?.stopPropagation(),this._stepTarget(-1)}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.target_entity||e.current_entity))(e),i=!1!==e.show_fan,n=!1!==e.show_power_button&&!!e.switch_entity,s=!1!==e.show_power&&!!e.power_entity,r=!1!==e.show_target&&!!e.target_entity,o=!1!==e.show_current&&!!e.current_entity,a=e.label_text||"",l=this._fanDur,h=this._target,c=this._current;return this.renderSlot(U`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${i?this.renderFan({active:t&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:l,inactive:this._v("fan_inactive"),design:this._v("fan_design"),farbe:this._fanFarbe}):I}
        ${n?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):I}
        ${o?this.renderValueBox({value:null===c?"—":pe(c.value,1)+" "+c.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:e.current_entity}):I}
        ${r?U`
              <div
                class="value-box target ${!1===this._v("target_box")?"no-bg":""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v("target_left")}%; transform:translateX(-50%) scale(${(this._v("target_scale")??100)/100});"
              >
                <div class="target-row">
                  <button
                    class="step"
                    ?disabled="${null===h}"
                    @click="${this._targetDown}"
                    title="Soll-Temperatur senken"
                  >
                    −
                  </button>
                  <div class="target-val">
                    <span class="val"
                      >${null===h?"—":pe(h.value,1)+" "+h.unit}</span
                    >
                    ${!1===this._v("target_label")?I:U`<span class="unit">Soll</span>`}
                  </div>
                  <button
                    class="step"
                    ?disabled="${null===h}"
                    @click="${this._targetUp}"
                    title="Soll-Temperatur anheben"
                  >
                    +
                  </button>
                </div>
              </div>
            `:I}
        ${a?U`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
              >
                ${a}
              </div>
            `:I}
        ${this.renderConfirm("Wirklich stromlos schalten?")}
      </div>
      ${t?I:U`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[Ke,Fe,r`
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
    `]}customElements.define("tomtut-pool-slot-heatpump",lt);const ht={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80,glow_pulse:40};class ct extends je{get defaults(){return ht}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const e=Number(this._v("glow_size"))||0,t=Number(this._v("glow_thickness"))||0;if(e<=0||t<=0)return I;const i=Math.round(e*ze("uv")/t*1e3)/1e3,n=Number(this._v("glow_intensity")),s=Math.min(100,Math.max(0,isFinite(n)?n:80))/100,r=Number(this._v("glow_pulse")),o=Math.min(100,Math.max(0,isFinite(r)?r:0))/100,a=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${e}%`,`aspect-ratio:${i}`,`opacity:${s}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`,"--glow-pulse:"+Math.round(100*o)/100].join("; ");return U`<div class="glow ${o>0?"wabert":"ruhig"}" style="${a};"></div>`}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.temp_entity))(e),i=!1!==e.show_glow,n=!1!==e.show_power_button&&!!e.switch_entity,s=!1!==e.show_power&&!!e.power_entity,r=!1!==e.show_temp&&!!e.temp_entity;return this.renderSlot(U`
      ${e.label?U`<h3 class="slot-title">${e.label}</h3>`:I}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:i&&t&&this.leuchtet?this.renderGlow():I})}

        ${n?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):I}
        ${r?this.renderThermo({value:me(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):I}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${t?I:U`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[Ke,Fe,r`
      /*
       * Der Schein besteht aus drei Lagen:
       *   .glow         Kern — exakt der Verlauf von vorher (Deckkraft über
       *                 den Inline-Stil = Leuchtstärke)
       *   .glow::before derselbe Kern noch einmal, glimmt auf und ab
       *   .glow::after  weicher Hof, größer, wabert mit anderer Periode
       * Zwei ungleiche Perioden (5,3 s / 3,7 s) überlagern sich zu einem
       * Muster, das sich erst nach Minuten wiederholt — organisch statt
       * Metronom. Die Stärke kommt aus --glow-pulse (0..1).
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
      }
      .glow.wabert::after {
        inset: -18% -8%;
        background: radial-gradient(
          ellipse at center,
          rgba(190, 160, 255, 0.75) 0%,
          rgba(130, 120, 255, 0.35) 45%,
          rgba(104, 128, 255, 0) 100%
        );
        filter: blur(0.5em);
        opacity: 0;
        animation: uvWabern 3.7s ease-in-out infinite alternate;
      }
      @keyframes uvGlimmen {
        0% {
          opacity: calc(var(--glow-pulse, 0) * 0.55);
        }
        23% {
          opacity: calc(var(--glow-pulse, 0) * 0.15);
        }
        41% {
          opacity: calc(var(--glow-pulse, 0) * 0.45);
        }
        67% {
          opacity: 0;
        }
        84% {
          opacity: calc(var(--glow-pulse, 0) * 0.35);
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * 0.55);
        }
      }
      @keyframes uvWabern {
        0% {
          opacity: calc(var(--glow-pulse, 0) * 0.2);
          transform: scale(0.97, 0.94);
        }
        55% {
          opacity: calc(var(--glow-pulse, 0) * 0.7);
          transform: scale(1.03, 1.08);
        }
        100% {
          opacity: calc(var(--glow-pulse, 0) * 0.95);
          transform: scale(1.06, 1.14);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .glow.wabert::before,
        .glow.wabert::after {
          animation: none;
        }
      }
    `]}customElements.define("tomtut-pool-slot-uv",ct);const pt={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:20,arrow_in_left:11,arrow_in_size:6.5,arrow_out_top:86,arrow_out_left:82,arrow_out_size:6.5,temp_in_top:21,temp_in_left:32,temp_in_scale:105,temp_out_top:79,temp_out_left:66,temp_out_scale:105,power_bottom:8,power_left:33,power_scale:100,power_box:!0,power_label:!0};class dt extends je{get defaults(){return pt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(e){const t=Number(this._v(`arrow_${e}_size`));return t>0?U`<img
      class="flow-arrow flow-${e}"
      src="${Se(ke[e])}"
      alt=""
      style="top:${this._v(`arrow_${e}_top`)}%; left:${this._v(`arrow_${e}_left`)}%; width:${t}%;"
    />`:I}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.temp_in_entity||e.temp_out_entity||e.power_entity))(e),i=!1!==e.show_power_button&&!!e.switch_entity,n=!1!==e.show_temp_in&&!!e.temp_in_entity,s=!1!==e.show_temp_out&&!!e.temp_out_entity,r=!1!==e.show_power&&!!e.power_entity,o=!1!==e.show_arrows;return this.renderSlot(U`
      ${e.label?U`<h3 class="slot-title">${e.label}</h3>`:I}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${o?U`${this.renderPfeil("in")}${this.renderPfeil("out")}`:I}

        ${i?this.renderPowerButton({on:this._isOn(e.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):I}
        ${n?this.renderThermo({value:me(this._ent(e.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:e.temp_in_entity}):I}
        ${s?this.renderThermo({value:me(this._ent(e.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:e.temp_out_entity}):I}
        ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):I}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${t?I:U`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[Ke,Fe,r`
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
    `]}customElements.define("tomtut-pool-slot-solar",dt);const ut=["switch","light","input_boolean","fan","siren"];class _t extends je{get confirmDefault(){return!1}get powerEntityId(){return this._wartet?.entity||null}get powerConfirmText(){return`„${this._wartet?.label||fe(this._ent(this._wartet?.entity),this._wartet?.entity)}" wird ausgeschaltet.`}get _entries(){return(Array.isArray(this.config?.entries)?this.config.entries:[]).slice(0,3).filter(e=>e&&(e.entity||e.text||e.label))}get _align(){const e=this.config?.align;return["oben","mitte","unten"].includes(e)?e:"mitte"}_toggle(e){const t=e.entity;if(t&&ut.includes(_e(t)))return!0===e.confirm_off&&this._isOn(t)?(this._wartet=e,void(this._confirmOpen=!0)):void this._call(t,"toggle")}_renderEntry(e){const t=e.kind||(e.entity?"entity":"text");if("text"===t)return U`<div class="entry text">${e.text||e.label||""}</div>`;const i=this._ent(e.entity);if("button"===t){const t=!!i&&he(i.state);return U`
        <button class="entry btn-entry ${t?"on":""}" @click="${()=>this._toggle(e)}">
          ${e.icon?U`<ha-icon icon="${e.icon}"></ha-icon>`:I}
          <span>${e.label||fe(i,e.entity)}</span>
        </button>
      `}return U`
      <div class="entry value" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${e.label||fe(i,e.entity)}</span>
        <span class="entry-value">${(e=>{if(!e)return"—";const t=ce(e.state),i=e.attributes?.unit_of_measurement;return null!==t?pe(t,Number.isInteger(t)?0:1)+(i?" "+i:""):String(e.state)+(i?" "+i:"")})(i)}</span>
      </div>
    `}render(){const e=this.config||{},t=this._entries;return this.renderSlot(U`
      <div class="custom align-${this._align}">
        ${e.title?U`<h3 class="slot-title">${e.title}</h3>`:I}
        ${t.length?t.map(e=>this._renderEntry(e)):U`<p class="slot-hint">Noch keine Einträge — im Editor bis zu drei hinzufügen.</p>`}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `)}static styles=[Ke,Fe,r`
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
    `]}customElements.define("tomtut-pool-slot-custom",_t);class ft extends je{static properties={...je.properties,slotType:{attribute:!1}};render(){const e=this.config||{},t=Ae[this.slotType]||{},i=!1===t.ready?t.hint:e.hint||"";return this.renderSlot(U`
      ${e.title||e.label?U`<h3 class="slot-title">${e.title||e.label}</h3>`:I}
      ${i?U`<p class="slot-hint">${i}</p>`:I}
    `)}static styles=[Ke,Fe]}customElements.define("tomtut-pool-slot-frame",ft);const mt={enabled:!0,fill:"transparent"};class gt extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(e){if(!e||"object"!=typeof e)throw new Error("Ungültige Konfiguration");if(void 0!==e.slots&&!Array.isArray(e.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==e.hero&&("object"!=typeof e.hero||Array.isArray(e.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==e.version&&1!==Number(e.version))throw new Error(`Unbekannte Config-Version ${e.version} — diese Card kennt Version 1`);this._config={version:1,...e,hero:{enabled:!0,shape:be,...e.hero||{}},frame:{...mt,...e.frame||{}},slots:Array.isArray(e.slots)?e.slots:[]}}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:be},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const e=this._config||{},t=(e.slots||[]).filter(e=>"hidden"!==(e?.type||"frame"));return(!1===e.hero?.enabled?0:6)+5*Math.ceil(t.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(e=>({...e||{},type:String(e?.type||"frame").toLowerCase()})).filter(e=>"hidden"!==e.type)}render(){if(!this._config)return I;const e=this._config,t=!1!==e.hero?.enabled,i=this.visibleSlots;return U`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${t?U`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${e.hero}"
                  .frame="${e.frame}"
                ></tomtut-pool-hero>`:I}
            ${i.map(e=>this._renderSlot(e))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(e){const t=this._config.frame;switch(Ae[e.type]?.ready?e.type:"frame"){case"heatpump":return U`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return U`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-pump>`;case"uv":return U`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-uv>`;case"solar":return U`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-solar>`;case"custom":return U`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
        ></tomtut-pool-slot-custom>`;default:return U`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${e}"
          .frame="${t}"
          .slotType="${e.type}"
        ></tomtut-pool-slot-frame>`}}static styles=r`
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
  `}customElements.define("tomtut-pool-dashboard",gt);const bt=["ha-entity-picker","ha-icon-picker"];let wt=null;const $t=()=>"undefined"!=typeof customElements&&bt.every(e=>!!customElements.get(e)),yt=e=>"undefined"!=typeof customElements&&!!customElements.get(e);class vt{constructor({hass:e,config:t,defaults:i={},update:n,idPrefix:s="f",stash:r=null}){this.hass=e,this.config=t||{},this.defaults=i,this.update=n,this.idPrefix=s,this.stash=r}val(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}raw(e){const t=this.config?.[e];return null==t?"":t}shown(e,t=!0){const i=this.config?.[e];return null==i?t:!1!==i}element(e,t,i=[],n=!0){const s=this.shown(t,n);return U`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${s}"
          @change="${e=>this._toggleElement(t,i,n,e.target.checked)}"
        />
      </div>
    `}_toggleElement(e,t,i,n){const s={},r=this.stash;if(n){s[e]=!0!==i||void 0;const t=r?.[`${this.idPrefix}:${e}`];t&&(Object.assign(s,t),delete r[`${this.idPrefix}:${e}`])}else{s[e]=!1;const i={};for(const e of t)void 0!==this.config?.[e]&&(i[e]=this.config[e]),s[e]=void 0;r&&Object.keys(i).length&&(r[`${this.idPrefix}:${e}`]=i)}this.update(s)}text(e,t,i="",n=""){return U`
      <label
        >${e}
        <input
          type="text"
          data-key="${t}"
          .value="${String(this.raw(t))}"
          placeholder="${n}"
          @input="${e=>this.update({[t]:e.target.value})}"
        />
        ${i?U`<small>${i}</small>`:I}
      </label>
    `}_entityOptions(e){const t=this.hass?.states??{};return Object.keys(t).filter(t=>!e.length||e.some(e=>t.startsWith(e+"."))).sort()}entity(e,t,i="",...n){return this._entityInput({label:e,hint:i,domains:n,value:String(this.raw(t)),dataKey:t,listId:`${this.idPrefix}-${t}`,onChange:e=>this.update({[t]:e||void 0})})}entityAt(e,t,i,n="",...s){const r=Array.isArray(this.config?.[t])?this.config[t]:[];return this._entityInput({label:e,hint:n,domains:s,value:String(r[i]??""),dataKey:`${t}.${i}`,listId:`${this.idPrefix}-${t}-${i}`,onChange:e=>this._updateList(t,i,e)})}_entityInput({label:e,hint:t,domains:i,value:n,dataKey:s,listId:r,onChange:o}){return yt("ha-entity-picker")?U`
        <ha-entity-picker
          .hass="${this.hass}"
          .value="${n}"
          .label="${e}"
          .helper="${t}"
          .includeDomains="${i.length?i:void 0}"
          data-key="${s}"
          allow-custom-entity
          @value-changed="${e=>{e.stopPropagation(),o(e.detail?.value??"")}}"
        ></ha-entity-picker>
      `:U`
      <label
        >${e}
        <input
          type="text"
          list="${r}"
          data-key="${s}"
          .value="${n}"
          placeholder="${"Entity auswählen …"}"
          @input="${e=>o(e.target.value)}"
          @change="${e=>o(e.target.value)}"
        />
        <datalist id="${r}">
          ${this._entityOptions(i).map(e=>U`<option value="${e}"></option>`)}
        </datalist>
        ${t?U`<small>${t}</small>`:I}
      </label>
    `}_updateList(e,t,i){const n=Array.isArray(this.config?.[e])?[...this.config[e]]:[];for(;n.length<=t;)n.push("");for(n[t]=i;n.length&&!n[n.length-1];)n.pop();this.update({[e]:n.length?n:void 0})}icon(e,t,i=""){return yt("ha-icon-picker")?U`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(t))}"
          .label="${e}"
          .helper="${i}"
          data-key="${t}"
          @value-changed="${e=>{e.stopPropagation(),this.update({[t]:e.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(e,t,i,"mdi:lightbulb")}select(e,t,i,n){const s=this.config?.[t]??n;return U`
      <div class="row">
        <span class="row-label">${e}</span>
        <select data-key="${t}" @change="${e=>this.update({[t]:e.target.value})}">
          ${i.map(([e,t])=>U`<option value="${e}" ?selected="${s===e}">${t}</option>`)}
        </select>
      </div>
    `}slider(e,t,i,n,s="%",r=1){const o=this.val(t),a=null==o||""===o?i:o;return U`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="range"
          min="${i}"
          max="${n}"
          step="${r}"
          data-key="${t}"
          .value="${String(a)}"
          @input="${e=>this.update({[t]:parseFloat(e.target.value)})}"
        />
        <span class="row-val">${a}${s}</span>
      </div>
    `}toggle(e,t,i){const n=this.config?.[t]??i;return U`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${n}"
          @change="${e=>this.update({[t]:e.target.checked})}"
        />
      </div>
    `}}const xt=(e,t,i=!1)=>U`
  <details class="section" ?open="${i}">
    <summary>${e}</summary>
    <div class="section-body">${t}</div>
  </details>
`,kt=e=>U`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${e}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`,St=r`
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
`,zt=["switch","input_boolean","light"],At=["sensor","input_number"],Et=["sensor","input_number","number"],Pt=["climate","number","input_number","sensor"],Bt=["sensor","select","input_select","climate"],Ct=(e,t=!0,i="Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung.")=>U`
  ${e.toggle("Vor dem Ausschalten nachfragen","confirm_off",t)}
  <small>${i}</small>
`,Tt=(e,t,i,n,s)=>e.shown(n,s)?xt(`${t} — Größe und Lage`,U`
          ${e.slider("Größe",`${i}_size`,2,30,"%",.5)}
          ${e.slider("Von oben",`${i}_top`,0,100,"%",.5)}
          ${e.slider("Von links",`${i}_left`,0,100,"%",.5)}
          <small>Die Größe ist die Breite in Prozent der Beckenbreite.</small>
        `):I,Mt={heatpump:nt,pump:Je,uv:ht,solar:pt},Lt=(e,t)=>{const i={...e||{}};for(const[e,n]of Object.entries(t||{}))void 0===n?delete i[e]:i[e]=n;return i};class Vt extends oe{static properties={hass:{attribute:!1},_config:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),($t()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(wt||(wt=(async()=>{try{const e=await window.loadCardHelpers(),t=await(e?.createCardElement?.({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",e?.message||e)}return $t()})()),wt)).then(e=>{e&&this.requestUpdate()})}setConfig(e){this._config={version:1,hero:{enabled:!0,shape:be},frame:{enabled:!0,fill:"transparent"},slots:[],...e||{}}}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_updateHero(e){this._emit({...this._config,hero:Lt(this._config.hero,e)})}_updateFrame(e){this._emit({...this._config,frame:Lt(this._config.frame,e)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_updateSlot(e,t){const i=this._slots().map((i,n)=>n===e?Lt(i,t):i);this._emit({...this._config,slots:i})}_updateEntry(e,t,i){const n=this._slots()[e]||{},s=Array.isArray(n.entries)?[...n.entries]:[];for(;s.length<=t;)s.push({});s[t]=Lt(s[t],i),this._updateSlot(e,{entries:s})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(e){this._emit({...this._config,slots:this._slots().filter((t,i)=>i!==e)})}_moveSlot(e,t){const i=[...this._slots()],n=e+t;if(n<0||n>=i.length)return;const[s]=i.splice(e,1);i.splice(n,0,s),this._emit({...this._config,slots:i})}_fieldsFor(e){const t=this._slots()[e]||{};return new vt({hass:this.hass,config:t,defaults:Mt[t.type]||{},update:t=>this._updateSlot(e,t),idPrefix:`slot${e}`,stash:this._stash})}_altTypOption(e){const t=Ae[e];return t&&!1===t.waehlbar?U`<option value="${e}" selected>${t.label}</option>`:I}_slotKopf(e,t){const i=Ae[e?.type]?.label||Ae.frame.label,n=String(e?.label||e?.label_text||e?.title||"").trim();return`Kasten ${t+1} · ${i}${n?` · ${n}`:""}`}_slotBody(e){const t=this._slots()[e]||{},i=this._fieldsFor(e);switch(t.type){case"heatpump":return(e=>U`
  ${kt(U`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_top","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Ist-Temperatur","show_current",["current_entity","current_bottom","current_left","current_scale","current_box","current_label"])}
    ${e.element("🎚 Soll-Temperatur","show_target",["target_entity","target_bottom","target_left","target_scale","target_step","target_box","target_label"])}
    ${e.element("🌀 Lüfter","show_fan",["fan_source","fan_entity","fan_power_threshold","fan_speed","fan_top","fan_left","fan_size","fan_ratio","fan_inactive","fan_design","fan_color_mode"])}
    ${e.element("🔁 Betriebsmodus","show_mode",["mode_entity","mode_attribute",...st.flatMap(e=>[`mode_speed_${e.key}`,`mode_map_${e.key}`])],!1)}
  `)}
  ${e.shown("show_power_button")?U`
        ${e.entity("Powerbutton — Schalter","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",...zt)}
        ${Ct(e)}
        ${xt("Powerbutton — Position",U`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_power")?U`
        ${e.entity("Stromverbrauch — Sensor","power_entity","Leistungssensor in W oder kW (z.B. Shelly).",...At)}
        ${xt("Stromverbrauch — Darstellung",U`
            ${e.slider("Von oben","power_top",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${e.shown("show_current")?U`
        ${e.entity("Ist-Temperatur","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.",...Pt)}
        ${xt("Ist-Temperatur — Darstellung",U`
            ${e.slider("Von unten","current_bottom",0,100)}
            ${e.slider("Von links","current_left",0,100)}
            ${e.slider("Größe","current_scale",50,150)}
            ${e.toggle("Box anzeigen","current_box",!0)}
            ${e.toggle("Label anzeigen","current_label",!0)}
          `)}
      `:I}
  ${e.shown("show_target")?U`
        ${e.entity("Soll-Temperatur","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",...Pt)}
        ${xt("Soll-Temperatur — Darstellung",U`
            ${e.slider("Von unten","target_bottom",0,100)}
            ${e.slider("Von links","target_left",0,100)}
            ${e.slider("Größe","target_scale",50,150)}
            ${e.slider("Schrittweite","target_step",.1,5,"",.1)}
            ${e.toggle("Box anzeigen","target_box",!0)}
            ${e.toggle("Label anzeigen","target_label",!0)}
          `)}
      `:I}
  ${e.shown("show_fan")?U`
        ${xt("Lüfter — wann dreht er?",U`
            ${e.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
            ${e.entity("Lüfter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
            ${e.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
            ${e.slider("Drehgeschwindigkeit","fan_speed",0,100)}
            <small>
              Ist der Schalter der Wärmepumpe aus, steht der Lüfter immer. Mit erkanntem
              Betriebsmodus gilt statt der Drehgeschwindigkeit das Tempo des Modus.
            </small>
          `,!0)}
        ${xt("Lüfter — Aussehen",U`
            ${e.select("Blatt-Design","fan_design",Object.entries(Ge).map(([e,t])=>[e,t.label]),"klassisch")}
            ${e.select("Farbe","fan_color_mode",[["neutral","Schwarz/Weiß (wie die Schrift)"],["modus","Nach Modus: Heizen rot, Kühlen blau"]],"neutral")}
            <small>Die Färbung nach Modus braucht einen erkannten Betriebsmodus.</small>
          `)}
        ${xt("Lüfter — Position",U`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Breite","fan_size",5,80,"%",.5)}
            ${e.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          `)}
      `:I}
  ${e.shown("show_mode",!1)?U`
        ${e.entity("Betriebsmodus — Entity","mode_entity","sensor, select, input_select oder climate — liefert den Modus der Wärmepumpe.",...Bt)}
        ${e.text("Attribut (optional)","mode_attribute","Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.","z.B. preset_mode")}
        ${xt("Betriebsmodus — Tempo je Modus",U`
            ${st.map(t=>e.slider(t.label,`mode_speed_${t.key}`,1,et,"",1))}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${xt("Betriebsmodus — Zuordnung Gerätezustand → Modus",U`
            ${st.map(t=>e.text(t.label,`mode_map_${t.key}`,"",t.zustaende.join(", ")))}
            <small>
              Kommaliste der Zustände, die dieser Modus heißt. Leer = Vorgabe (grau).
              Groß-/Kleinschreibung, Leerzeichen und _ sind egal.
            </small>
          `)}
      `:I}
  ${e.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Wärmepumpe")}
  ${xt("Freitext — Darstellung",U`
      ${e.slider("Von oben","label_top",0,100)}
      ${e.slider("Von links","label_left",0,100)}
      ${e.slider("Größe","label_scale",50,200)}
      ${e.toggle("Box anzeigen","label_box",!0)}
    `)}
`)(i);case"pump":return(e=>U`
  ${kt(U`
    ${e.element("🎚 Stufen-Taster","show_stages",["stage_mode","stage_entities","stop_entity","stage_labels"])}
    ${e.element("⏻ Powerbutton","show_power_button",["main_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label","stage_from_power","stage_watt_1","stage_watt_2","stage_watt_3"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("🌀 Laufrad","show_fan",["fan_top","fan_left","fan_size","fan_speed_1","fan_speed_2","fan_speed_3","fan_inactive","idle_watt"])}
  `)}
  ${e.text("Überschrift (optional)","label","","z.B. Poolpumpe")}
  ${e.shown("show_stages")?U`
        ${e.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
        ${e.entityAt("Stufe 1 (N1)","stage_entities",0,"",...zt)}
        ${e.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"",...zt)}
        ${e.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"",...zt)}
        ${e.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...zt)}
      `:I}
  ${e.shown("show_power_button")?U`
        ${e.entity("Hauptschalter","main_entity","Steckdose/Relais der Pumpe — Powerbutton.",...zt)}
        ${Ct(e)}
        ${xt("Powerbutton — Position",U`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_power")?U`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...At)}
        ${xt("Stromverbrauch — Darstellung",U`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
        ${e.raw("power_entity")?xt("Stufe aus Leistung erkennen",U`
                ${e.toggle("Stufe aus Leistung erkennen","stage_from_power",!0)}
                ${!1!==e.val("stage_from_power")?U`
                      ${e.slider("N1 ab mehr als","stage_watt_1",0,300," W",1)}
                      ${e.slider("N2 ab mehr als","stage_watt_2",0,1500," W",5)}
                      ${e.slider("N3 ab mehr als","stage_watt_3",0,3e3," W",5)}
                    `:I}
                <small>
                  Wird die Stufe direkt an der Pumpe umgestellt, weiß Home Assistant davon
                  nichts — die Leistung schon. Unter der N1-Schwelle gilt die Pumpe als aus.
                  Die erkannte Stufe leuchtet und bestimmt das Tempo des Laufrads; die
                  Taster bleiben bedienbar.
                </small>
              `):I}
      `:I}
  ${e.shown("show_temp")?U`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...Et)}
        ${xt("Thermometer — Position",U`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_fan")?U`
        ${xt("Laufrad — Tempo",U`
            ${e.slider("Tempo N1","fan_speed_1",1,et,"",1)}
            ${e.slider("Tempo N2","fan_speed_2",1,et,"",1)}
            ${e.slider("Tempo N3","fan_speed_3",1,et,"",1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${xt("Laufrad — Position",U`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Größe","fan_size",3,60,"%",.5)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `)}
        ${xt("Wann steht die Pumpe?",U`
            ${e.slider("Ruhewatt","idle_watt",0,200," W",1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).
              Bei „Stufe aus Leistung erkennen" gilt stattdessen die N1-Schwelle.</small>
          `)}
      `:I}
`)(i);case"uv":return(e=>U`
  ${kt(U`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("💡 Glüheffekt","show_glow",["glow_top","glow_left","glow_size","glow_thickness","glow_angle","glow_intensity","glow_pulse"])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${e.text("Überschrift (optional)","label","","z.B. UV-C-Lampe")}
  ${e.shown("show_power_button")?U`
        ${e.entity("Powerbutton — Schalter","switch_entity","Steckdose/Relais der Lampe.",...zt)}
        ${Ct(e)}
        ${xt("Powerbutton — Position",U`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_power")?U`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...At)}
        ${xt("Stromverbrauch — Darstellung",U`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${e.shown("show_temp")?U`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...Et)}
        ${xt("Thermometer — Position",U`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_glow")?xt("Glüheffekt — Lage auf dem Rohr",U`
          ${e.slider("Von oben","glow_top",0,100,"%",.5)}
          ${e.slider("Von links","glow_left",0,100,"%",.5)}
          ${e.slider("Länge","glow_size",5,100,"%",.5)}
          ${e.slider("Dicke","glow_thickness",2,60,"%",.5)}
          ${e.slider("Neigung","glow_angle",-90,90,"°",1)}
          ${e.slider("Leuchtstärke","glow_intensity",10,100)}
          ${e.slider("Wabern / Glimmen","glow_pulse",0,100)}
          <small>
            Leuchtet nur, solange der Schalter an ist. „Wabern" lässt den Schein sanft
            atmen — 0 = ruhig und statisch. Wer im System „Bewegung reduzieren" eingestellt
            hat, sieht ihn immer ruhig.
          </small>
        `):I}
  ${xt("Bild — Drehen, Spiegeln, Größe, Anschlussvariante",U`
      ${e.slider("Drehen","rotate",0,359,"°",1)}
      ${e.toggle("Waagrecht spiegeln","mirror",!1)}
      ${e.slider("Größe","uv_size",30,Ne)}
      ${e.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `)}
`)(i);case"solar":return(e=>U`
  ${kt(U`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("🌡 Vorlauf (oben, ins Feld)","show_temp_in",["temp_in_entity","temp_in_top","temp_in_left","temp_in_scale"])}
    ${e.element("🌡 Rücklauf (unten, ins Becken)","show_temp_out",["temp_out_entity","temp_out_top","temp_out_left","temp_out_scale"])}
    ${e.element("⬇ Richtungspfeile","show_arrows",["arrow_in_top","arrow_in_left","arrow_in_size","arrow_out_top","arrow_out_left","arrow_out_size"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
  `)}
  <small>
    Die Solarheizung heizt nicht selbst — sie gibt nur den Weg über die Absorber frei. Der
    Vergleich Vorlauf/Rücklauf zeigt, ob sie gerade etwas bringt. Das Bild zeigt ein Feld aus
    drei Absorbern; der blaue Pfeil oben ist der Zulauf, der rote unten der Rücklauf.
  </small>
  ${e.text("Überschrift (optional)","label","","z.B. Solarheizung")}
  ${e.shown("show_power_button")?U`
        ${e.entity("Powerbutton — Ventil oder Pumpe","switch_entity","Solarventil oder Solarpumpe.",...zt)}
        ${Ct(e)}
        ${xt("Powerbutton — Position",U`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_temp_in")?U`
        ${e.entity("Vorlauf-Temperatur","temp_in_entity","Wasser, das zum Absorber läuft — oberer Anschluss (blauer Pfeil).",...Et)}
        ${xt("Vorlauf — Position",U`
            ${e.slider("Von oben","temp_in_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_in_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_in_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_temp_out")?U`
        ${e.entity("Rücklauf-Temperatur","temp_out_entity","Wasser, das zurück ins Becken läuft — unterer Anschluss (roter Pfeil).",...Et)}
        ${xt("Rücklauf — Position",U`
            ${e.slider("Von oben","temp_out_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_out_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_out_scale",50,200)}
          `)}
      `:I}
  ${e.shown("show_power")?U`
        ${e.entity("Stromverbrauch","power_entity","Solarpumpe in W oder kW.",...At)}
        ${xt("Stromverbrauch — Darstellung",U`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:I}
  ${e.shown("show_arrows")?xt("Richtungspfeile — Lage",U`
          ${e.slider("Zulauf (blau) — Von oben","arrow_in_top",0,100,"%",.5)}
          ${e.slider("Zulauf (blau) — Von links","arrow_in_left",0,100,"%",.5)}
          ${e.slider("Zulauf (blau) — Größe","arrow_in_size",2,20,"%",.5)}
          ${e.slider("Rücklauf (rot) — Von oben","arrow_out_top",0,100,"%",.5)}
          ${e.slider("Rücklauf (rot) — Von links","arrow_out_left",0,100,"%",.5)}
          ${e.slider("Rücklauf (rot) — Größe","arrow_out_size",2,20,"%",.5)}
          <small>
            Beide Pfeile zeigen nach unten: oben läuft kaltes Wasser ins Feld, unten warmes
            heraus. Sie sind reine Beschriftung und ändern sich nie.
          </small>
        `):I}
`)(i);case"custom":return((e,t)=>U`
  ${e.text("Überschrift (optional)","title","","z.B. Wetter")}
  ${e.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"mitte")}
  ${[0,1,2].map(e=>xt(`Eintrag ${e+1}`,t(e),0===e))}
`)(i,i=>(e=>U`
  ${e.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===e.config?.kind?e.text("Text","text","","z.B. Sommerbetrieb"):U`
        ${e.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate")}
        ${e.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===e.config?.kind?e.icon("Icon (optional)","icon"):I}
        ${"button"===e.config?.kind?Ct(e,!1,"An = vor dem Ausschalten kommt eine Rückfrage."):I}
      `}
`)(new vt({hass:this.hass,config:(Array.isArray(t.entries)?t.entries:[])[i]||{},update:t=>this._updateEntry(e,i,t),idPrefix:`slot${e}e${i}`,stash:this._stash})));case"hidden":return U`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;default:return(e=>U`
  ${e.text("Überschrift (optional)","title","","z.B. Platzhalter")}
  ${e.text("Hinweistext (optional)","hint","","")}
`)(i)}}render(){if(!this._config)return I;const e=this._config.hero||{},t=this._config.frame||{},i=new vt({hass:this.hass,config:e,defaults:Xe(e.shape),update:e=>this._updateHero(e),idPrefix:"hero",stash:this._stash}),n=new vt({hass:this.hass,config:t,update:e=>this._updateFrame(e),idPrefix:"frame",stash:this._stash}),s=this._slots();return U`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        ${i.toggle("Becken anzeigen","enabled",!0)}
        ${!1===e.enabled?I:(e=>U`
  ${kt(U`
    ${e.element("🌡 Thermometer","show_thermo",["temp_entity","thermo_scale","thermo_top","thermo_left"])}
    ${e.element("🧪 pH-Kästchen","show_ph",["ph_entity","ph_top","ph_left"])}
    ${e.element("⚗ Redox / RX-Kästchen","show_rx",["rx_entity","rx_top","rx_left"])}
    ${e.element("🛟 Skimmer","show_skimmer",["skimmer_size","skimmer_top","skimmer_left"])}
    ${e.element("💦 Einlaufdüse","show_inlet",["inlet_size","inlet_top","inlet_left","inlet_temp_entity","inlet_temp_top","inlet_temp_left"])}
    ${e.element("⚓ Bodenablauf","show_drain",["drain_size","drain_top","drain_left"],!1)}
  `)}
  ${e.select("Beckenform","shape",Object.entries(ge).map(([e,t])=>[e,t.label]),"oval")}
  ${e.shown("show_thermo")?U`
        ${e.entity("Wassertemperatur","temp_entity","Zeigt das Thermometer auf der Wasserfläche.",...Et)}
        ${xt("Thermometer — Position",U`
            ${e.slider("Größe","thermo_scale",50,200)}
            ${e.slider("Von oben","thermo_top",0,100,"%",.5)}
            ${e.slider("Von links","thermo_left",0,100,"%",.5)}
          `)}
      `:I}
  ${e.shown("show_ph")?U`
        ${e.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...Et)}
        ${xt("pH — Position",U`
            ${e.slider("Von oben","ph_top",0,100,"%",.5)}
            ${e.slider("Von links","ph_left",0,100,"%",.5)}
          `)}
      `:I}
  ${e.shown("show_rx")?U`
        ${e.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...Et)}
        ${xt("RX — Position",U`
            ${e.slider("Von oben","rx_top",0,100,"%",.5)}
            ${e.slider("Von links","rx_left",0,100,"%",.5)}
          `)}
      `:I}
  ${Tt(e,"Skimmer","skimmer","show_skimmer",!0)}
  ${Tt(e,"Einlaufdüse","inlet","show_inlet",!0)}
  ${e.shown("show_inlet",!0)?U`
        ${e.entity("Temperatur am Einlauf (optional)","inlet_temp_entity","Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",...Et)}
        ${e.raw("inlet_temp_entity")?xt("Einlauf-Temperatur — Position",U`
                ${e.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
                ${e.slider("Von links","inlet_temp_left",0,100,"%",.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `):I}
      `:I}
  ${Tt(e,"Bodenablauf","drain","show_drain",!1)}
  ${e.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${e.raw("label_text")?xt("Freitext — Darstellung",U`
          ${e.slider("Größe","label_scale",50,200)}
          ${e.slider("Von oben","label_top",0,100,"%",.5)}
          ${e.slider("Von links","label_left",0,100,"%",.5)}
        `):I}
  ${e.toggle("Becken mit Rahmen","framed",!1)}
`)(i)}

        <div class="step-head">Schritt 2 — Geräte</div>
        ${s.map((e,t)=>U`
            <div class="slot-block" style="--slot-farbe:${Pe(e.type)};">
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
                      ${Ce().map(t=>t.trenner?U`<option disabled data-trenner>${t.label}</option>`:U`
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
        ${n.toggle("Rahmen um die Slots","enabled",!0)}
        ${n.select("Füllung","fill",[["transparent","Transparent (Theme)"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        <small>
          Die Füllung gilt für den ganzen Kasten: Hintergrund, Bild, Kästchen, Buttons und
          Schriftfarbe. Transparent nimmt den Hintergrund des HA-Themes.
        </small>
      </div>
    `}static styles=[St]}customElements.define("tomtut-pool-dashboard-editor",Vt),
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
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{$e as DEVICE_IMAGES,xe as DEVICE_RATIOS,ve as DEVICE_VARIANTS,Ge as FAN_DESIGNS,Ie as FAN_DESIGN_DEFAULT,ke as FLOW_MARKERS,Ne as GROESSE_MAX,Ve as GROESSE_MIN,nt as HEATPUMP_DEFAULTS,Qe as HERO_DEFAULTS,ye as HERO_SPRITES,st as HP_MODES,Ze as INLET_TEMP_VERSATZ,rt as MODE_FARBEN,Je as PUMP_DEFAULTS,ge as SHAPES,Ee as SLOT_GRAU,Ae as SLOT_TYPES,Be as SLOT_TYPE_GROUPS,pt as SOLAR_DEFAULTS,gt as TomtutPoolDashboardCard,Vt as TomtutPoolDashboardEditor,ht as UV_DEFAULTS,Lt as applyPatch,De as bildTransform,tt as fanDuration,Oe as groesseFaktor,Xe as heroDefaultsFor,at as modeFromState,Te as normGrad,ce as numOf,me as numText,Le as passFaktor,Pe as slotFarbe,Ce as slotTypeOptions,Ye as stageFromWatt,de as toWatt};
