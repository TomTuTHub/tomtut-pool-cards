const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),n=new WeakMap;let r=class{constructor(e,t,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=n.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&n.set(i,e))}return e}toString(){return this.cssText}};const s=e=>new r("string"==typeof e?e:e+"",void 0,i),a=(e,...t)=>{const n=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new r(n,e,i)},o=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return s(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,b=(e,t)=>e,w={toAttribute(e,t){switch(t){case Boolean:e=e?g:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:w,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let k=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:r}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const s=n?.call(this);r?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=u(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...h(e),...p(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(o(e))}else void 0!==e&&t.push(o(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,n)=>{if(t)i.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of n){const n=document.createElement("style"),r=e.litNonce;void 0!==r&&n.setAttribute("nonce",r),n.textContent=t.cssText,i.appendChild(n)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:w).toAttribute(t,i.type);this._$Em=e,null==r?this.removeAttribute(n):this.setAttribute(n,r),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),r="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:w;this._$Em=n;const s=r.fromAttribute(t,e.type);this[n]=s??this._$Ej?.get(n)??s,this._$Em=null}}requestUpdate(e,t,i,n=!1,r){if(void 0!==e){const s=this.constructor;if(!1===n&&(r=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??v)(r,t)||i.useDefault&&i.reflect&&r===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:r},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==r||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};k.elementStyles=[],k.shadowRootOptions={mode:"open"},k[b("elementProperties")]=new Map,k[b("finalized")]=new Map,_?.({ReactiveElement:k}),(m.reactiveElementVersions??=[]).push("2.1.2");const y=globalThis,x=e=>e,z=y.trustedTypes,S=z?z.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,B="?"+E,P=`<${B}>`,C=document,M=()=>C.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,L=Array.isArray,W="[ \t\n\f\r]",O=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,K=/-->/g,N=/>/g,R=RegExp(`>|${W}(?:([^\\s"'>=/]+)(${W}*=${W}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,D=/"/g,H=/^(?:script|style|textarea|title)$/i,I=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),G=new WeakMap,U=C.createTreeWalker(C,129);function Z(e,t){if(!L(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const Q=(e,t)=>{const i=e.length-1,n=[];let r,s=2===t?"<svg>":3===t?"<math>":"",a=O;for(let t=0;t<i;t++){const i=e[t];let o,l,c=-1,d=0;for(;d<i.length&&(a.lastIndex=d,l=a.exec(i),null!==l);)d=a.lastIndex,a===O?"!--"===l[1]?a=K:void 0!==l[1]?a=N:void 0!==l[2]?(H.test(l[2])&&(r=RegExp("</"+l[2],"g")),a=R):void 0!==l[3]&&(a=R):a===R?">"===l[0]?(a=r??O,c=-1):void 0===l[1]?c=-2:(c=a.lastIndex-l[2].length,o=l[1],a=void 0===l[3]?R:'"'===l[3]?D:V):a===D||a===V?a=R:a===K||a===N?a=O:(a=R,r=void 0);const h=a===R&&e[t+1].startsWith("/>")?" ":"";s+=a===O?i+P:c>=0?(n.push(o),i.slice(0,c)+A+i.slice(c)+E+h):i+E+(-2===c?t:h)}return[Z(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class X{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let r=0,s=0;const a=e.length-1,o=this.parts,[l,c]=Q(e,t);if(this.el=X.createElement(l,i),U.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=U.nextNode())&&o.length<a;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(A)){const t=c[s++],i=n.getAttribute(e).split(E),a=/([.?@])?(.*)/.exec(t);o.push({type:1,index:r,name:a[2],strings:i,ctor:"."===a[1]?te:"?"===a[1]?ie:"@"===a[1]?ne:ee}),n.removeAttribute(e)}else e.startsWith(E)&&(o.push({type:6,index:r}),n.removeAttribute(e));if(H.test(n.tagName)){const e=n.textContent.split(E),t=e.length-1;if(t>0){n.textContent=z?z.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],M()),U.nextNode(),o.push({type:2,index:++r});n.append(e[t],M())}}}else if(8===n.nodeType)if(n.data===B)o.push({type:2,index:r});else{let e=-1;for(;-1!==(e=n.data.indexOf(E,e+1));)o.push({type:7,index:r}),e+=E.length-1}r++}}static createElement(e,t){const i=C.createElement("template");return i.innerHTML=e,i}}function q(e,t,i=e,n){if(t===j)return t;let r=void 0!==n?i._$Co?.[n]:i._$Cl;const s=T(t)?void 0:t._$litDirective$;return r?.constructor!==s&&(r?._$AO?.(!1),void 0===s?r=void 0:(r=new s(e),r._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=r:i._$Cl=r),void 0!==r&&(t=q(e,r._$AS(e,t.values),r,n)),t}class J{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??C).importNode(t,!0);U.currentNode=n;let r=U.nextNode(),s=0,a=0,o=i[0];for(;void 0!==o;){if(s===o.index){let t;2===o.type?t=new Y(r,r.nextSibling,this,e):1===o.type?t=new o.ctor(r,o.name,o.strings,this,e):6===o.type&&(t=new re(r,this,e)),this._$AV.push(t),o=i[++a]}s!==o?.index&&(r=U.nextNode(),s++)}return U.currentNode=C,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=q(this,e,t),T(e)?e===F||null==e||""===e?(this._$AH!==F&&this._$AR(),this._$AH=F):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>L(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==F&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(C.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=X.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new J(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=G.get(e.strings);return void 0===t&&G.set(e.strings,t=new X(e)),t}k(e){L(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const r of e)n===t.length?t.push(i=new Y(this.O(M()),this.O(M()),this,this.options)):i=t[n],i._$AI(r),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=x(e).nextSibling;x(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ee{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,r){this.type=1,this._$AH=F,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(e,t=this,i,n){const r=this.strings;let s=!1;if(void 0===r)e=q(this,e,t,0),s=!T(e)||e!==this._$AH&&e!==j,s&&(this._$AH=e);else{const n=e;let a,o;for(e=r[0],a=0;a<r.length-1;a++)o=q(this,n[i+a],t,a),o===j&&(o=this._$AH[a]),s||=!T(o)||o!==this._$AH[a],o===F?e=F:e!==F&&(e+=(o??"")+r[a+1]),this._$AH[a]=o}s&&!n&&this.j(e)}j(e){e===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class te extends ee{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===F?void 0:e}}class ie extends ee{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==F)}}class ne extends ee{constructor(e,t,i,n,r){super(e,t,i,n,r),this.type=5}_$AI(e,t=this){if((e=q(this,e,t,0)??F)===j)return;const i=this._$AH,n=e===F&&i!==F||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,r=e!==F&&(i===F||n);n&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){q(this,e)}}const se=y.litHtmlPolyfillSupport;se?.(X,Y),(y.litHtmlVersions??=[]).push("3.3.3");const ae=globalThis;class oe extends k{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let r=n._$litPart$;if(void 0===r){const e=i?.renderBefore??null;n._$litPart$=r=new Y(t.insertBefore(M(),e),e,void 0,i??{})}return r._$AI(e),r})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}oe._$litElement$=!0,oe.finalized=!0,ae.litElementHydrateSupport?.({LitElement:oe});const le=ae.litElementPolyfillSupport;le?.({LitElement:oe}),(ae.litElementVersions??=[]).push("4.2.2");const ce=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],de=e=>ce.includes(String(e).toLowerCase()),he=e=>{if(null==e)return null;const t=String(e).trim().replace(",",".");if(!/^[+-]?(\d+(\.\d+)?|\.\d+)([eE][+-]?\d+)?$/.test(t))return null;const i=Number(t);return isFinite(i)?i:null},pe=(e,t=0)=>{const i=Number(e);return isFinite(i)?i.toFixed(t).replace(".",","):"—"},ue=e=>{if(!e)return null;const t=he(e.state);if(null===t)return null;return"kw"===String(e.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*t:t},me=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const n=Math.max(0,(t-i)/1e3);if(n<60)return`seit ${Math.floor(n)} Sek`;const r=n/60;if(r<60)return`seit ${Math.floor(r)} Min`;const s=r/60;if(s<24)return`seit ${Math.floor(s)} Std`;const a=Math.floor(s/24);return a<=1?"seit 1 Tag":`seit ${a} Tagen`},fe=(e,t=Date.now())=>{if(!e)return"";const i=Date.parse(e);if(isNaN(i))return"";const n=Math.floor(Math.max(0,t-i)/6e4);if(n<1)return"seit < 1 Min";if(n<60)return`seit ${n} Min`;if(n<1440){const e=Math.floor(n/60),t=n%60;return t?`seit ${e} Std ${t} Min`:`seit ${e} Std`}const r=Math.floor(n/1440);return r<=1?"seit 1 Tag":`seit ${r} Tagen`},ge=e=>String(e||"").split(".")[0],_e=(e,t)=>e?.attributes?.friendly_name||String(t||"").split(".")[1]||String(t||""),be=(e,{decimals:t}={})=>{const i=he(e?.state);if(null===i)return"—";const n=t??(Number.isInteger(i)?0:1),r=e.attributes?.unit_of_measurement;return pe(i,Math.min(n,1))+(r?" "+r:"")},we=e=>{if(!e)return"—";const t=he(e.state),i=e.attributes?.unit_of_measurement;return null!==t?pe(t,Number.isInteger(t)?0:1)+(i?" "+i:""):String(e.state)+(i?" "+i:"")},ve={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:16.1,top:28.2},ph:{left:34.1,top:69.5},rx:{left:63.9,top:69.5},drain:{left:78,top:30.9},skimmer:{left:22.3,top:19.3},inlet:{left:65.5,top:11.6},label_anker:{left:49.8,top:1.3}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:13.3,top:31.2},ph:{left:32.6,top:68.5},rx:{left:64.5,top:68.5},drain:{left:79.6,top:33.4},skimmer:{left:20,top:24.1},inlet:{left:66.2,top:14.6},label_anker:{left:49.4,top:13.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:13,top:34},ph:{left:32.7,top:68.2},rx:{left:65.1,top:68.2},drain:{left:80.4,top:34.8},skimmer:{left:19.8,top:23.8},inlet:{left:66.7,top:12.1},label_anker:{left:49.7,top:15.6}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:14.7,top:25.6},ph:{left:33.5,top:72.4},rx:{left:64.5,top:72.4},drain:{left:79.3,top:39.1},skimmer:{left:21.3,top:13.5},inlet:{left:66.2,top:12.6},label_anker:{left:49.8,top:1}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:15.9,top:31.6},ph:{left:34.4,top:65.3},rx:{left:65,top:65.3},drain:{left:79.5,top:35.7},skimmer:{left:22.3,top:21.8},inlet:{left:66.6,top:15.3},label_anker:{left:50.5,top:10.2}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:13.4,top:38.3},ph:{left:33.4,top:75.4},rx:{left:66.6,top:75.4},drain:{left:82.3,top:47.1},skimmer:{left:20.4,top:28.6},inlet:{left:68.4,top:14.8},label_anker:{left:50.9,top:6.7}}},$e="oval",ke=e=>ve[String(e||"").toLowerCase()]||ve[$e],ye={"poolbecken_oval.png":1090/389,"poolbecken_rechteck.png":1280/544,"poolbecken_achtform.png":1280/542,"poolbecken_rund.png":1280/716,"poolbecken_nierenform.png":1280/547,"poolbecken_freiform.png":1280/543},xe=e=>ye[ke(e).file]||2.5,ze={heatpump:"waermepumpe_transparent.png",pump:"poolpumpe_transparent.png",uv:"uv_lampe_transparent.png",solar:"solar_transparent.png"},Se={skimmer:{file:"skimmer_transparent.png",anker:"skimmer",groesse:10,standard:!0,ratio:640/465},einlauf:{file:"einlaufduese_transparent.png",anker:"inlet",groesse:6.5,standard:!0,ratio:503/342},drain:{file:"bodenablauf_transparent.png",anker:"drain",groesse:9,standard:!1,ratio:640/529}},Ae={uv:{seite:"uv_lampe_transparent.png",oben:"uv_lampe_transparent_2.png"}},Ee={heatpump:988/725,pump:1126/756,uv:947/384,solar:1001/710},Be={in:"pfeil_blau.png",out:"pfeil_rot.png"},Pe="1.0.0-a51d66cd",Ce=Pe.startsWith("__")?"dev":Pe,Me=e=>"/local/community/tomtut-pool-cards/"+e+"?v="+encodeURIComponent(Ce),Te=(e,t)=>Me(Ae[e]?.[t]||ze[e]||""),Le=e=>Ee[e]||1,We={heatpump:{label:"Wärmepumpe",ready:!0,farbe:"#e07b28"},pump:{label:"Poolpumpe",ready:!0,farbe:"#2f7fd0"},custom:{label:"Freifeld (benutzerdefiniert)",ready:!0,farbe:"#2fa25f"},frame:{label:"Leerer Rahmen",ready:!0,farbe:"#8a8f98"},hidden:{label:"Ausgeblendet",ready:!0,farbe:"#8a8f98"},uv:{label:"UV-C-Lampe",ready:!0,farbe:"#8b5cf6"},solar:{label:"Solarheizung",ready:!0,farbe:"#d9a71c"},inlet:{label:"Einlaufdüse (entfällt)",ready:!1,waehlbar:!1,farbe:"#8a8f98",hint:"Einlaufdüse ist jetzt Teil des Beckens"}},Oe="#8a8f98",Ke={hero:"#12a4b8"},Ne=e=>We[e]?.farbe||Ke[e]||Oe,Re=[{trenner:null,keys:["custom","hidden","frame"]},{trenner:"— Geräte —",keys:["heatpump","pump","uv","solar"]}],Ve=()=>{const e=new Set(Re.flatMap(e=>e.keys)),t=Object.keys(We).filter(t=>!e.has(t)&&!1!==We[t].waehlbar),i=e=>({value:e,label:We[e].label+(!1===We[e].ready?" (folgt)":"")}),n=[];for(const e of Re){e.trenner&&n.push({trenner:!0,label:e.trenner});for(const t of e.keys)We[t]&&n.push(i(t))}for(const e of t)n.push(i(e));return n},De=e=>{const t=Number(e);return isFinite(t)?(Math.round(t)%360+360)%360:0},He=e=>Math.abs(e)<1e-9?0:Math.abs(e),Ie=(e,t)=>{const i=Number(t)>0?Number(t):1,n=De(e)*Math.PI/180,r=He(Math.cos(n)),s=He(Math.sin(n));return Math.min(1,i/(i*r+s),1/(i*s+r))},je=30,Fe=100,Ge=e=>{const t=Number(e);return isFinite(t)?Math.min(Fe,Math.max(30,t))/100:1},Ue=(e,t,i,n=100)=>{const r=De(e),s=(e=>Math.round(1e3*e)/1e3)(Ie(r,i)*Ge(n)),a=[];return r&&a.push(`rotate(${r}deg)`),s<1&&a.push(`scale(${s})`),!0===t&&a.push("scaleX(-1)"),a.length?`transform:${a.join(" ")};`:""},Ze='<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>',Qe='fill="currentColor" fill-opacity="0.8" stroke="currentColor" stroke-width="0.7" stroke-linejoin="round"',Xe=(e,t,i="")=>Array.from({length:t},(n,r)=>{const s=Math.round(360/t*r*100)/100;return`<path d="${e}" ${Qe}${i}${s?` transform="rotate(${s} 20 20)"`:""}/>`}).join(""),qe=(e=3.2)=>`<circle cx="20" cy="20" r="${e}" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>`,Je={klassisch:{label:"Klassisch (4 Blätter)",svg:Ze},drei:{label:"3 Blätter, breit",svg:Xe("M20,20 C21.5,14.5 25,7 31.5,7.2 C36.5,7.6 35.2,13.5 30.5,16.2 C27,18.2 23,19.4 20,20 Z",3)+qe(3.6)},fuenf:{label:"5 Blätter, schlank",svg:Xe("M20,20 C20.6,14.2 22.8,6.4 27.2,5.6 C31.2,5.2 30.6,10.6 27.6,14 C25.4,16.6 22.4,18.6 20,20 Z",5)+qe(3)},sichel:{label:"Sichel / Turbine",svg:Xe("M20.6,17.2 Q29.5,15.2 33.6,5.8 Q35.2,14.8 22.4,20.8 Z",7)+'<circle cx="20" cy="20" r="17.2" fill="none" stroke="currentColor" stroke-width="1.1" stroke-dasharray="7 1.2 11 0.9"/>'+qe(3.4)},propeller:{label:"Propeller",svg:Xe("M20,20 C17.6,14.4 17.4,6.2 19.4,2.6 C20.3,1.9 21.4,2.2 22,3.4 C23.4,7.4 22.6,14.6 20,20 Z",2)+'<ellipse cx="20" cy="20" rx="3.4" ry="4.2" fill="currentColor" stroke="currentColor" stroke-width="0.7"/>'},batman:{label:"Batman",svg:'<path d="M20,27.5 Q23,22 26,26 Q29,21.5 32,24.5 Q39,20 37.5,11 Q31,15.5 24,14.5 Q23,16 22.5,16 L21.7,12.3 L21,15.6 L19,15.6 L18.3,12.3 L17.5,16 Q17,16 16,14.5 Q9,15.5 2.5,11 Q1,20 8,24.5 Q11,21.5 14,26 Q17,22 20,27.5 Z" '+Qe+"/>"}},Ye="klassisch",et=e=>(Je[e]||Je[Ye]).svg,tt=I`<svg viewBox="0 0 24 60" aria-hidden="true">
  <rect x="8" y="3" width="8" height="38" rx="4" fill="#ffffff" stroke="#111" stroke-width="1.6" />
  <circle cx="12" cy="48" r="8" fill="#e8483c" stroke="#111" stroke-width="1.6" />
  <rect x="10" y="20" width="4" height="26" fill="#e8483c" />
  <g stroke="#111" stroke-width="1.2" stroke-linecap="round">
    <line x1="16" y1="10" x2="20" y2="10" />
    <line x1="16" y1="16" x2="20" y2="16" />
    <line x1="16" y1="22" x2="20" y2="22" />
    <line x1="16" y1="28" x2="20" y2="28" />
  </g>
</svg>`;class it extends oe{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},kiosk:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this.kiosk=!1,this._confirmOpen=!1}get defaults(){return{}}_v(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}_ent(e){return e?this.hass?.states?.[e]:void 0}_isOn(e){const t=this._ent(e);return!!t&&de(t.state)}_watt(e){return ue(this._ent(e))}get bedienbar(){return!0!==this.kiosk}_call(e,t,i={}){this.bedienbar&&e&&this.hass&&this.hass.callService(ge(e),t,{entity_id:e,...i})}_moreInfo(e){if(!this.bedienbar)return;const t=e?.currentTarget?.dataset?.entity;t&&(e.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0})))}get _frameClasses(){const e=this.frame||{},t=["transparent","weiss","schwarz"].includes(e.fill)?e.fill:"transparent";return`slot ${!1===e.enabled?"":"framed"} fill-${t}${this.bedienbar?"":" kiosk"}`}renderSlot(e){return I`<div class="${this._frameClasses}">${e}</div>`}renderGeraeteBild({kind:e,variante:t,alt:i,rotate:n=0,mirror:r=!1,groesse:s=100,inhalt:a=F}){const o=Le(e);return I`
      <div class="bild-flaeche" style="aspect-ratio:${Math.round(1e4*o)/1e4};">
        <div class="bild" style="${Ue(n,r,o,s)}">
          <img src="${Te(e,t)}" alt="${i}" />
          ${a}
        </div>
      </div>
    `}renderFan({active:e,top:t,left:i,size:n,ratio:r,dur:s,inactive:a,round:o=!1,design:l,farbe:c}){const d=e?"spinning":"hidden"===a?"hidden":"idle",h=o?1:Number(r)||1,p=l?et(l):Ze;return I`
      <div
        class="fan-overlay ${d} ${o?"round":""} design-${l&&Je[l]?l:Ye}"
        style="top:${t}%; left:${i}%; width:${n}%; --fan-dur:${s}s; --fan-ratio:${h};${c?` --tt-fan-color:${c};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${o?"xMidYMid meet":"none"}">
          <g .innerHTML="${p}"></g>
        </svg>
      </div>
    `}get _powerUnbekannt(){const e=this.powerEntityId;if(!e)return!1;const t=String(this._ent(e)?.state??"").toLowerCase();return["","unknown","unavailable"].includes(t)}renderPowerButton({on:e,top:t,left:i,scale:n,standby:r=!1,hinweis:s=null}){const a=s||{oben:"Strom an",unten:"WP aus",titel:"Steckdose an, Wärmepumpe aus (Standby) — Steckdose ausschalten (mit Rückfrage)"},o=!e&&this._powerUnbekannt;return I`
      <div
        class="power-badge ${e?"on":o?"unbekannt":"off"} ${r?"standby":""}"
        style="top:${t}%; left:${i}%; transform:scale(${(n??100)/100});"
        title="${r?a.titel:o?"Zustand unbekannt — Einschalten":e?"Ausschalten (mit Rückfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
        ${r?I`<span class="power-hinweis ${a.lage||""}"><b>${a.oben}</b><span>${a.unten}</span></span>`:F}
      </div>
    `}renderValueBox({value:e,unit:t,top:i,bottom:n,left:r,scale:s,box:a,entity:o}){return I`
      <div
        class="value-box ${!1===a?"no-bg":""}"
        style="${void 0===n?`top:${i}%;`:`bottom:${n}%;`} left:${r}%; transform:translateX(-50%) scale(${(s??100)/100});"
        data-entity="${o||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${e}</span>
        ${t?I`<span class="unit">${t}</span>`:F}
      </div>
    `}renderThermo({value:e,top:t,left:i,scale:n,entity:r}){return I`
      <div
        class="thermo"
        style="top:${t}%; left:${i}%; --thermo-size:${(n??100)/100*3.6}em;"
        data-entity="${r||""}"
        @click="${this._moreInfo}"
      >
        ${tt}
        ${e?I`<span class="thermo-val">${e}</span>`:F}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Gerät wird hart vom Netz getrennt. Wirklich ausschalten?"}get confirmDefault(){return!0}get fragtNach(){const e=this.config?.confirm_off;return null==e||""===e?this.confirmDefault:!1!==e}_onPowerClick(e){if(e?.stopPropagation(),!this.bedienbar)return;const t=this.powerEntityId;t&&(this._isOn(t)?this.fragtNach?this._confirmOpen=!0:this._call(t,"turn_off"):this._call(t,"turn_on"))}_confirmOff(e){e?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(e){e?.stopPropagation(),this._confirmOpen=!1}renderConfirm(e="Wirklich stromlos schalten?"){return this._confirmOpen&&this.bedienbar?I`
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
    `:F}wattText(e,t=0){const i=this._watt(e);return null===i?"—":pe(i,t)}}const nt=a`
  .slot {
    --tt-bg: transparent;
    --tt-fg: var(--primary-text-color, #111);
    --tt-line: rgba(127, 127, 127, 0.55);
    --tt-soft: rgba(127, 127, 127, 0.16);
    --tt-box-bg: var(--ha-card-background, var(--card-background-color, rgba(255, 255, 255, 0.92)));
    --tt-box-fg: var(--primary-text-color, #111);
    --tt-deck: transparent;
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
  }
  .slot.fill-schwarz {
    --tt-bg: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.45);
    --tt-soft: rgba(255, 255, 255, 0.12);
    --tt-box-bg: rgba(30, 30, 30, 0.9);
    --tt-box-fg: #ffffff;
  }
`,rt=a`
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
  }
  ${nt}
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
`,st=a`
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
    background: linear-gradient(var(--tt-deck), var(--tt-deck)), var(--tt-soft);
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
`,at={top:8,left:11},ot=2,lt=40,ct=e=>null!=e&&""!==e&&isFinite(Number(e))?Number(e):null,dt=(e,t,i)=>Math.min(i,Math.max(t,e)),ht=(e={},t,i="voll")=>{const n=e||{},r=t.anker,s=ke(n.shape),a=e=>ct(n[`${r}_${e}`])??s[r]?.[e]??50,o=e=>"mini"===i?ct(n[`mini_${r}_${e}`])??a(e):a(e),l="mini"===i?ct(n[`mini_${r}_size`])??ct(n[`${r}_size`]):ct(n[`${r}_size`]),c=dt(null!==l&&l>0?l:t.groesse,2,40),d=c*xe(n.shape)/(t.ratio||1),h=e=>Math.round(100*e)/100;return{left:h(dt(o("left"),c/2,100-c/2)),top:h(dt(o("top"),Math.min(50,d/2),Math.max(50,100-d/2))),breite:h(c)}},pt={thermo_scale:133,label_scale:100,label_top:3,label_left:50,skimmer_size:Se.skimmer.groesse,inlet_size:Se.einlauf.groesse,drain_size:Se.drain.groesse},ut=e=>{const t=ke(e),i={};for(const e of Object.values(Se)){const n=t[e.anker];n&&(i[`${e.anker}_top`]=n.top,i[`${e.anker}_left`]=n.left)}return{...pt,thermo_top:t.thermo.top,thermo_left:t.thermo.left,ph_top:t.ph.top,ph_left:t.ph.left,rx_top:t.rx.top,rx_left:t.rx.left,...i,inlet_temp_top:(t.inlet?.top??12)+at.top,inlet_temp_left:(t.inlet?.left??66)+at.left,label_top:t.label_anker?.top??pt.label_top,label_left:t.label_anker?.left??pt.label_left}};class mt extends it{get defaults(){return{...ut(this.config?.shape),inlet_temp_top:this._anchor("inlet","top")+at.top,inlet_temp_left:this._anchor("inlet","left")+at.left}}_spriteAn(e){const t=Object.values(Se).find(t=>t.anker===e),i=this.config?.[`show_${e}`];return null==i?!!t?.standard:!1!==i}get shape(){return ke(this.config?.shape)}_anchor(e,t){const i=`${e}_${t}`,n=this.config?.[i];return null!=n&&""!==n?Number(n):this.shape[e]?.[t]??50}render(){const e=this.config||{},t=this.shape,i=!0===e.framed,n=!1!==e.show_thermo&&!!e.temp_entity,r=!1!==e.show_ph&&!!e.ph_entity,s=!1!==e.show_rx&&!!e.rx_entity,a=!!e.inlet_temp_entity&&this._spriteAn("inlet"),o=I`
      <div class="img-wrap">
        <img src="${Me(t.file)}" alt="Pool ${t.label}" />
        ${this._sprites()}

        ${n?this.renderThermo({value:be(this._ent(e.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:e.temp_entity}):F}
        ${r?this._chemBox("pH",e.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):F}
        ${s?this._chemBox("RX",e.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):F}
        ${a?this._chemBox("Zulauf",e.inlet_temp_entity,this._v("inlet_temp_top"),this._v("inlet_temp_left"),"inlet-temp"):F}
        ${e.label_text?I`<div
              class="label-badge"
              style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
            >
              ${e.label_text}
            </div>`:F}
      </div>
    `;return i?this.renderSlot(o):I`<div class="${this._frameClasses} bare">${o}</div>`}_sprites(){return Object.values(Se).map(e=>{if(!this._spriteAn(e.anker))return F;const t=ht(this.config,e,"voll");return I`<img
        class="hero-sprite sprite-${e.anker}"
        src="${Me(e.file)}"
        alt=""
        style="top:${t.top}%; left:${t.left}%; width:${t.breite}%;"
      />`})}_chemBox(e,t,i,n,r=""){const s=this._ent(t);return I`
      <div
        class="chem-box ${r}"
        style="top:${i}%; left:${n}%;"
        data-entity="${t}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${e}</span>
        <span class="chem-val">${be(s)}</span>
      </div>
    `}static styles=[rt,st,a`
      .slot.bare {
        border: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",mt);const ft="becken",gt=e=>String(e??"").trim().toLowerCase(),_t=(e={})=>[...!1===e.hero?.enabled?[]:[ft],...(Array.isArray(e.slots)?e.slots:[]).map((e,t)=>"hidden"===String(e?.type||"frame").toLowerCase()?null:t+1).filter(e=>null!==e)],bt=(e={},t)=>!0===e?.kiosk&&(!Array.isArray(e.kiosk_slots)||e.kiosk_slots.some(e=>gt(e)===gt(t))),wt={fan_top:60,fan_left:61,fan_size:18,fan_inactive:"gray",fan_speed_1:3,fan_speed_2:5,fan_speed_3:8,power_btn_top:62,power_btn_left:80,power_btn_scale:110,power_bottom:9,power_left:24,power_scale:98,power_box:!0,power_label:!0,temp_top:11,temp_left:38,temp_scale:119,idle_watt:30,stage_from_power:!0,stage_watt_1:20,stage_watt_2:150,stage_watt_3:500},vt=(e,t=[20,150,500],i=3)=>{const n=Number(e);if(null==e||!isFinite(n)||i<1)return null;let r=null;return t.slice(0,3).forEach((e,t)=>{const i=Number(e);isFinite(i)&&n>i&&(r=t)}),null===r?null:Math.min(r,i-1)},$t=10,kt=e=>{const t=Math.min($t,Math.max(1,Number(e)||1)),i=4*Math.pow(.125,(t-1)/9);return Math.round(100*i)/100},yt=(e={})=>!!(Array.isArray(e.stage_entities)&&e.stage_entities.filter(Boolean).length||e.main_entity);class xt extends it{static properties={...it.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return wt}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Läuft sie gerade, sollte sie erst\n      über STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const e=this.config?.stage_entities;return(Array.isArray(e)?e:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const e=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((t,i)=>e[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}get _wattStufeAktiv(){return!1!==this._v("stage_from_power")&&!!this.config?.power_entity}_wattStufe(){if(!this._wattStufeAktiv)return;const e=this._watt(this.config.power_entity);if(null===e)return;const t=[1,2,3].map(e=>this._v(`stage_watt_${e}`));return vt(e,t,Math.max(1,this.stages.length))}_derive(){const e=this._deriveSchalter(),t=this._wattStufe();if(void 0===t)return e;if(null===t)return{active:null,stopped:!0,since:e.stopped?e.since:null};return{active:t,stopped:!1,since:e.active!==t||e.stopped?null:e.since,ausLeistung:!0}}_deriveSchalter(){if("latching"===this.mode){let e=null;if(this.stages.forEach((t,i)=>{const n=this._ent(t);if(!n||!de(n.state))return;const r=Date.parse(n.last_changed||0)||0;(!e||r>e.t)&&(e={i:i,t:r,since:n.last_changed})}),!e){const e=this._ent(this.stopEntity);return{active:null,stopped:!0,since:e?.last_changed||null}}return{active:e.i,stopped:!1,since:e.since}}const e=this.stages.map((e,t)=>({id:e,i:t}));this.stopEntity&&e.push({id:this.stopEntity,i:-1});let t=null;for(const i of e){const e=this._ent(i.id);if(!e||!e.last_changed)continue;const n=Date.parse(e.last_changed);isNaN(n)||(!t||n>t.t)&&(t={...i,t:n,since:e.last_changed})}return t?-1===t.i?{active:null,stopped:!0,since:t.since}:{active:t.i,stopped:!1,since:t.since}:{active:null,stopped:!1,since:null}}get state(){const e=this._derive(),t=this._optimistic;if(t&&Date.now()-t.t<6e3){if(-1===t.i&&!e.stopped)return{active:null,stopped:!0,since:null};if(t.i>=0&&e.active!==t.i)return{active:t.i,stopped:!1,since:null}}return e}get running(){const e=this.state;if(this.blockedByMain)return!1;if(e.stopped||null===e.active)return!1;if(e.ausLeistung)return!0;const t=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(t)&&i<t)}_clickStage(e){if(!this.bedienbar||this.blockedByMain)return;const t=this.stages[e];t&&(this._optimistic={i:e,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((t,i)=>{i!==e&&this._call(t,"turn_off")}),this._call(t,"turn_on")):this._call(t,"turn_on"))}_clickStop(){this.bedienbar&&!this.blockedByMain&&(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(e=>this._call(e,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const e=this.config||{},t=yt(e),i=this.state,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1",r=!1!==e.show_power&&!!e.power_entity,s=!1!==e.show_temp&&!!e.temp_entity,a=!1!==e.show_power_button&&!!e.main_entity,o=!1!==e.show_stages&&(this.stages.length>0||this._showStop);return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="pump">
        <div class="img-wrap">
          ${this.renderGeraeteBild({kind:"pump",alt:"Poolpumpe"})}
          ${!1===e.show_fan?F:this.renderFan({active:t&&this.running,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),dur:kt(this._v(n)),inactive:this._v("fan_inactive"),round:!0})}
          ${a?this.renderPowerButton({on:this._isOn(e.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
          ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
          ${s?this.renderThermo({value:be(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):F}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        ${o?I`
              <div class="stages ${this.blockedByMain?"disabled":""}">
                ${this.stages.map((e,t)=>I`
                    <button
                      class="stage-btn ${i.active!==t||i.stopped?"":"active"}"
                      @click="${()=>this._clickStage(t)}"
                      title="${this.stageLabels[t]}"
                    >
                      <span class="stage-name">${this.stageLabels[t]}</span>
                      ${i.active===t&&!i.stopped&&i.since?I`<span class="stage-since">${me(i.since)}</span>`:F}
                    </button>
                  `)}
                ${this._showStop?I`
                      <button
                        class="stage-btn stop ${i.stopped?"active":""}"
                        @click="${()=>this._clickStop()}"
                        title="Pumpe stoppen"
                      >
                        <span class="stage-name">STOP</span>
                        ${i.stopped&&i.since?I`<span class="stage-since">${me(i.since)}</span>`:F}
                      </button>
                    `:F}
              </div>
            `:F}
      </div>
      ${t?F:I`<p class="slot-hint">
            Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter wählen.
          </p>`}
    `)}static styles=[rt,st,a`
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
    `]}customElements.define("tomtut-pool-slot-pump",xt);const zt={fan_top:49.5,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_inactive:"gray",fan_power_threshold:100,fan_design:"klassisch",fan_color_mode:"neutral",mode_speed_heiz_silent:3,mode_speed_heiz_smart:5,mode_speed_heiz_auto:6,mode_speed_heiz_boost:9,mode_speed_kuehl_silent:3,mode_speed_kuehl_smart:5,mode_speed_kuehl_auto:6,mode_speed_kuehl_boost:9,power_btn_top:5,power_btn_left:3,power_btn_scale:139,release_top:84,release_left:24,release_scale:100,show_release_since:!1,mode_top:86,mode_left:64,mode_scale:100,power_top:22,power_left:62,power_scale:100,power_box:!0,power_label:!0,current_bottom:40,current_left:62,current_scale:100,current_box:!0,current_label:!0,target_bottom:16,target_left:63,target_scale:119,target_box:!0,target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:180,label_box:!0},St=[{key:"heiz_silent",label:"Heizen Silent",art:"heizen",zustaende:["Heizen Silent","heat_silent","heating_silent","silent_heat"]},{key:"heiz_smart",label:"Heizen Smart",art:"heizen",zustaende:["Heizen Smart","heat_smart","heating_smart","smart_heat"]},{key:"heiz_auto",label:"Heizen Auto",art:"heizen",zustaende:["Heizen Auto","heat_auto","heating_auto","auto_heat"]},{key:"heiz_boost",label:"Heizen Boost",art:"heizen",zustaende:["Heizen Boost","heat_boost","heating_boost","boost_heat","heat_turbo","heat_powerful"]},{key:"kuehl_silent",label:"Kühlen Silent",art:"kuehlen",zustaende:["Kühlen Silent","cool_silent","cooling_silent","silent_cool"]},{key:"kuehl_smart",label:"Kühlen Smart",art:"kuehlen",zustaende:["Kühlen Smart","cool_smart","cooling_smart","smart_cool"]},{key:"kuehl_auto",label:"Kühlen Auto",art:"kuehlen",zustaende:["Kühlen Auto","cool_auto","cooling_auto","auto_cool"]},{key:"kuehl_boost",label:"Kühlen Boost",art:"kuehlen",zustaende:["Kühlen Boost","cool_boost","cooling_boost","boost_cool","cool_turbo","cool_powerful"]}],At={heizen:"#e0452c",kuehlen:"#2f7fd0"},Et=e=>String(e??"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[\s_-]+/g," ").trim(),Bt=[["heizen",/heiz|heat/],["kuehlen",/kuehl|cool/]],Pt=[["silent",/silent|leise|quiet|mute/],["smart",/smart|eco/],["boost",/boost|power|turbo|max|strong/],["auto",/auto/]],Ct=e=>{const t=Et(e);if(!t)return null;const i=Bt.filter(([,e])=>e.test(t)).map(([e])=>e);if(1!==i.length)return null;const n=Pt.find(([,e])=>e.test(t));if(!n)return null;const r=`${"heizen"===i[0]?"heiz":"kuehl"}_${n[0]}`;return St.find(e=>e.key===r)||null},Mt=e=>!!e&&"object"==typeof e&&!Array.isArray(e),Tt=(e,t={})=>{if(!Mt(t?.mode_map))return;const i=Et(e);for(const[e,n]of Object.entries(t.mode_map))if(Et(e)===i)return n&&St.find(e=>e.key===n)||null},Lt=(e,t={})=>{if(!Mt(t?.mode_names))return"";const i=Et(e),n=Object.entries(t.mode_names).find(([e,t])=>Et(e)===i&&String(t||"").trim());return n?String(n[1]).trim():""},Wt=(e,t={})=>{const i=Et(e);if(!i)return null;const n=Tt(e,t);if(void 0!==n)return n;const r=St.find(e=>((e={},t)=>{const i=e[`mode_map_${t.key}`];return"string"==typeof i&&i.trim()?i.split(",").map(e=>e.trim()).filter(Boolean):Array.isArray(i)&&i.length?i.map(String):t.zustaende})(t,e).some(e=>Et(e)===i));if(r)return r;const s=Ct(e);return s&&!((e,t)=>{const i=e?.[`mode_map_${t.key}`];return"string"==typeof i&&!!i.trim()||Array.isArray(i)&&i.length>0})(t,s)?s:null},Ot={off:"Aus",aus:"Aus",heat:"Heizen",heating:"Heizen",heizen:"Heizen",cool:"Kühlen",cooling:"Kühlen",kuehlen:"Kühlen","kühlen":"Kühlen",auto:"Auto","heat cool":"Heizen/Kühlen",dry:"Entfeuchten","fan only":"Nur Lüfter",idle:"Bereit",standby:"Standby",silent:"Silent",smart:"Smart",boost:"Boost",turbo:"Turbo",powerful:"Power",eco:"Eco",comfort:"Komfort",away:"Abwesend",sleep:"Nacht",home:"Zuhause",activity:"Aktiv"},Kt={off:"aus",aus:"aus",heat:"heizen",heating:"heizen",heizen:"heizen",cool:"kuehlen",cooling:"kuehlen",kuehlen:"kuehlen","kühlen":"kuehlen"},Nt=e=>["","unknown","unavailable","none"].includes(Et(e)),Rt=e=>{const t=Et(e);return Object.prototype.hasOwnProperty.call(Ot,t)?Ot[t]:String(e??"").trim()},Vt=(e,t={})=>{if(!e)return null;const i=String(t.mode_attribute||"").trim(),n=i?e.attributes?.[i]:e.state,r=Wt(n,t);if(r)return{text:r.label,art:r.art};let s=n,a=null;if(!String(t.mode_entity||"").startsWith("climate.")||i&&"preset_mode"!==i||(s=e.state,a=i?n:e.attributes?.preset_mode),Nt(s)&&Nt(a))return{text:"—",art:null};const o=Kt[Et(s)]||null;if("aus"===o)return{text:"Aus",art:o};if(!Nt(s)&&!Nt(a)){const e=Wt(`${s} ${a}`,t);if(e)return{text:e.label,art:e.art}}const l=[s,a].filter(e=>!Nt(e)).map(e=>Lt(e,t)||Rt(e));return{text:l.join(" · "),art:o}},Dt=(e,t)=>Wt(e,t)?.label||Lt(e,t)||Rt(e),Ht=(e,t={})=>{const i=t.mode_entity;if(!e||!i)return[];const n=ge(i),r=e.attributes||{},s=String(t.mode_attribute||"").trim(),a=(e,i,n,r,s,a)=>Array.isArray(s)&&s.length?[{titel:e,domain:i,service:n,feld:r,optionen:s.map(e=>({wert:String(e),text:Dt(e,t),aktiv:Et(e)===Et(a)}))}]:[];if(("select"===n||"input_select"===n)&&!s)return a("Betriebsmodus",n,"select_option","option",r.options,e.state);if("climate"===n){if("preset_mode"===s)return a("Betriebsmodus","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode);if(!s)return[...a("Betriebsart","climate","set_hvac_mode","hvac_mode",r.hvac_modes,e.state),...a("Stufe / Preset","climate","set_preset_mode","preset_mode",r.preset_modes,r.preset_mode)]}return[]},It=(e={},t)=>[e.mode_entity,e.target_entity,e.current_entity].find(e=>String(e||"").startsWith("climate.")&&!!t?.states?.[e])||null,jt=(e={},t)=>{const i=It(e,t);return!!i&&"off"===String(t.states[i].state).toLowerCase()},Ft=(e={})=>!!(e.switch_entity||e.power_entity||e.target_entity||e.current_entity||e.release_entity);class Gt extends it{static properties={...it.properties,_tick:{state:!0},_modusWahlOffen:{state:!0},_modusFehler:{state:!0}};get defaults(){return zt}get _seitAn(){const e=this.config||{};return!0===e.show_release_since&&!1!==e.show_release&&!!e.release_entity}_seitTimerPruefen(){const e=this.isConnected&&this._seitAn;e&&!this._seitTimer?(this._seitTimer=setInterval(()=>{this._tick=Date.now()},6e4),"function"==typeof this._seitTimer?.unref&&this._seitTimer.unref()):!e&&this._seitTimer&&(clearInterval(this._seitTimer),this._seitTimer=void 0)}connectedCallback(){super.connectedCallback(),this._seitTimerPruefen()}disconnectedCallback(){clearInterval(this._seitTimer),this._seitTimer=void 0,super.disconnectedCallback()}updated(e){super.updated?.(e),this._seitTimerPruefen()}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Wärmepumpe sollte erst am Gerät bzw. über den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _freigabe(){const e=this.config||{};if(!1===e.show_release||!e.release_entity)return null;const t=this._ent(e.release_entity);if(!t)return null;const i=String(t.state).toLowerCase();return"unknown"===i||"unavailable"===i||""===i?null:de(i)}get _releaseSchaltbar(){const e=this.config?.release_entity;return!!e&&!String(e).startsWith("binary_sensor.")}_onReleaseClick(e){e?.stopPropagation(),this.bedienbar&&this._releaseSchaltbar&&this._call(this.config.release_entity,"toggle")}_renderRelease(){const e=this._freigabe,t=!1===e,i=null===e?"unbekannt":t?"gesperrt":"frei",n=this._releaseSchaltbar,r=null===e?"Freigabekontakt — Zustand unbekannt":n?t?"Freigabe geben (Kontakt schließen)":"Freigabe entziehen (Kontakt öffnen)":t?"Freigabekontakt offen — die Wärmepumpe ist gesperrt (nur Anzeige)":"Freigabekontakt geschlossen — die Wärmepumpe ist freigegeben (nur Anzeige)";return I`
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
        ${this._seitAn&&null!==e?I`<span class="release-seit"
              >${fe(this._ent(this.config.release_entity)?.last_changed)}</span
            >`:F}
      </div>
    `}get _target(){const e=this.config.target_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),n=he(i?t.attributes?.temperature:t.state);if(null===n)return null;const r=t.attributes||{};return{climate:i,value:n,min:i?r.min_temp??5:r.min??5,max:i?r.max_temp??40:r.max??40,step:this.config.target_step??(i?r.target_temp_step??.5:r.step??.5),unit:i?this.hass?.config?.unit_system?.temperature??"°C":r.unit_of_measurement??"°C"}}get _current(){const e=this.config.current_entity,t=this._ent(e);if(!t)return null;const i=String(e).startsWith("climate."),n=he(i?t.attributes?.current_temperature:t.state);return null===n?null:{value:n,unit:i?this.hass?.config?.unit_system?.temperature??"°C":t.attributes?.unit_of_measurement??"°C"}}get _modus(){const e=this.config||{};if(!1===e.show_mode||!e.mode_entity)return null;const t=this._ent(e.mode_entity);if(!t)return null;const i=String(e.mode_attribute||"").trim(),n=i?t.attributes?.[i]:t.state;return Wt(n,e)}get _klimaAus(){return jt(this.config||{},this.hass)}get _standby(){const e=this.config?.switch_entity;return this._klimaAus&&!!e&&this._isOn(e)}get _modusBadge(){const e=this.config||{};return!1!==e.show_mode&&!1!==e.show_mode_badge&&e.mode_entity?this._klimaAus?{text:"Aus",art:"aus"}:Vt(this._ent(e.mode_entity),e)||{text:"—",art:null}:null}get _modusGruppen(){const e=this.config||{};return Ht(this._ent(e.mode_entity),e)}_onModeClick(e){e?.stopPropagation(),this.bedienbar&&this._modusGruppen.length&&(this._modusFehler="",this._modusWahlOffen=!0)}_modusSchliessen(e){e?.stopPropagation(),this._modusWahlOffen=!1,this._modusFehler=""}async _modusSetzen(e,t,i){if(i?.stopPropagation(),this.bedienbar&&this.hass){this._modusFehler="";try{await this.hass.callService(e.domain,e.service,{entity_id:this.config.mode_entity,[e.feld]:t.wert}),this._modusWahlOffen=!1}catch(e){const i=e?.message||e?.error?.message||String(e);console.error("tomtut-pool-cards: Modus setzen fehlgeschlagen",e),this._modusFehler=`Umschalten auf „${t.text}“ fehlgeschlagen: ${i}`}}}_renderModusWahl(){if(!this._modusWahlOffen||!this.bedienbar)return F;const e=this._modusGruppen;return I`
      <div class="confirm-overlay modus-overlay" @click="${this._modusSchliessen}">
        <div class="confirm-panel modus-panel" @click="${e=>e.stopPropagation()}">
          <h3 class="modus-kopf">Betriebsmodus wählen</h3>
          ${e.map(t=>I`
              ${e.length>1?I`<div class="modus-gruppe">${t.titel}</div>`:F}
              <div class="modus-optionen">
                ${t.optionen.map(e=>I`<button
                    class="modus-option ${e.aktiv?"aktiv":""}"
                    data-wert="${e.wert}"
                    aria-pressed="${e.aktiv?"true":"false"}"
                    @click="${i=>this._modusSetzen(t,e,i)}"
                  >
                    <span class="modus-haken">${e.aktiv?"✓":""}</span>${e.text}
                  </button>`)}
              </div>
            `)}
          ${this._modusFehler?I`<div class="modus-fehler" role="alert">${this._modusFehler}</div>`:F}
          <div class="confirm-actions">
            <button class="btn cancel" @click="${this._modusSchliessen}">Schließen</button>
          </div>
        </div>
      </div>
    `}_renderModeBadge(e){const t=At[e.art]||"",i=this.bedienbar&&this._modusGruppen.length>0;return I`
      <div
        class="mode-badge ${e.art||"neutral"} ${i?"waehlbar":""}"
        style="top:${this._v("mode_top")}%; left:${this._v("mode_left")}%; transform:translateX(-50%) scale(${(this._v("mode_scale")??100)/100});${t?` --tt-mode-farbe:${t};`:""}"
        title="Betriebsmodus: ${e.text}${i?" — tippen zum Ändern":""}"
        @click="${this._onModeClick}"
      >
        <span class="mode-punkt"></span>
        <span class="val">${e.text}</span>
      </div>
    `}get _fanDur(){const e=this._modus;if(e)return kt(this._v(`mode_speed_${e.key}`));const t=Number(this._v("fan_speed"))||0;return t<=0?0:Math.max(.2,4-t/100*3.6)}get _fanFarbe(){if("modus"!==this._v("fan_color_mode"))return"";const e=this._modus;return e?At[e.art]:""}get _fanActive(){if(!1===this._freigabe)return!1;if(this._klimaAus)return!1;const e=this.config.switch_entity;if(e&&this._ent(e)&&!this._isOn(e))return!1;const t=this.config.fan_source??"auto",i=this._ent(this.config.fan_entity);if("power"!==t&&i){const e=String(i.state).toLowerCase();if(de(e))return!0;const t=he(e);return null!==t&&t>0}if("entity"===t)return!1;const n=this._watt(this.config.power_entity);return null!==n&&n>=Number(this._v("fan_power_threshold"))}_stepTarget(e){const t=this._target;if(!this.bedienbar||!t||!this.hass)return;let i=Math.round((t.value+e*t.step)/t.step)*t.step;i=Math.min(t.max,Math.max(t.min,i)),i=Math.round(100*i)/100,i!==t.value&&(t.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(e){e?.stopPropagation(),this._stepTarget(1)}_targetDown(e){e?.stopPropagation(),this._stepTarget(-1)}render(){const e=this.config||{},t=Ft(e),i=!1!==e.show_fan,n=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_release&&!!e.release_entity,s=!1!==e.show_power&&!!e.power_entity,a=!1!==e.show_target&&!!e.target_entity,o=!1!==e.show_current&&!!e.current_entity,l=e.label_text||"",c=this._modusBadge,d=this._fanDur,h=this._target,p=this._current;return this.renderSlot(I`
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"heatpump",alt:"Wärmepumpe"})}

        ${i?this.renderFan({active:t&&this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:d,inactive:this._v("fan_inactive"),design:this._v("fan_design"),farbe:this._fanFarbe}):F}
        ${n?this.renderPowerButton({on:this._isOn(e.switch_entity),standby:this._standby,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${r?this._renderRelease():F}
        ${c?this._renderModeBadge(c):F}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${o?this.renderValueBox({value:null===p?"—":pe(p.value,1)+" "+p.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),entity:e.current_entity}):F}
        ${a?I`
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
                    ${!1===this._v("target_label")?F:I`<span class="unit">Soll</span>`}
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
            `:F}
        ${l?I`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100});"
              >
                ${l}
              </div>
            `:F}
        ${this.renderConfirm("Wirklich stromlos schalten?")} ${this._renderModusWahl()}
      </div>
      ${t?F:I`<p class="slot-hint">
            Wärmepumpe: bitte mindestens eine Entity wählen (Schalter, Leistung, Soll oder Ist).
          </p>`}
    `)}static styles=[rt,st,a`
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
    `]}customElements.define("tomtut-pool-slot-heatpump",Gt);const Ut={anschluss:"seite",rotate:0,mirror:!1,uv_size:100,power_btn_top:30,power_btn_left:11,power_btn_scale:120,power_bottom:9,power_left:76,power_scale:100,power_box:!0,power_label:!0,temp_top:19,temp_left:40,temp_scale:110,glow_top:35,glow_left:56,glow_size:40,glow_thickness:13,glow_angle:-15,glow_intensity:80,glow_pulse:40},Zt=300,Qt=e=>{const t=Math.min(300,Math.max(0,isFinite(Number(e))?Number(e):0));return{puls:Math.min(1,t/100),boost:t>100?Math.round((t-100)/200*1e3)/1e3:0}};class Xt extends it{get defaults(){return Ut}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Ein UV-C-Strahler altert vor allem beim Schalten: jeder Start kostet Brennstunden,\n      häufiges Ein und Aus mehr als Durchlauf. Und nach dem Einschalten braucht die Lampe\n      einige Minuten, bis sie wieder volle Leistung bringt."}get leuchtet(){return this._isOn(this.config?.switch_entity)}renderGlow(){const e=Number(this._v("glow_size"))||0,t=Number(this._v("glow_thickness"))||0;if(e<=0||t<=0)return F;const i=Math.round(e*Le("uv")/t*1e3)/1e3,n=Number(this._v("glow_intensity")),r=Math.min(100,Math.max(0,isFinite(n)?n:80))/100,{puls:s,boost:a}=Qt(this._v("glow_pulse")),o=[`top:${this._v("glow_top")}%`,`left:${this._v("glow_left")}%`,`width:${e}%`,`aspect-ratio:${i}`,`opacity:${r}`,`transform:translate(-50%, -50%) rotate(${Number(this._v("glow_angle"))||0}deg)`,"--glow-pulse:"+Math.round(100*s)/100,...a>0?[`--glow-boost:${a}`]:[]].join("; ");return I`<div class="glow ${s>0?"wabert":"ruhig"}" style="${o};"></div>`}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.power_entity||e.temp_entity))(e),i=!1!==e.show_glow,n=!1!==e.show_power_button&&!!e.switch_entity,r=!1!==e.show_power&&!!e.power_entity,s=!1!==e.show_temp&&!!e.temp_entity;return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="img-wrap">
        ${this.renderGeraeteBild({kind:"uv",variante:this._v("anschluss"),alt:"UV-C-Lampe",rotate:this._v("rotate"),mirror:!0===this._v("mirror"),groesse:this._v("uv_size"),inhalt:i&&t&&this.leuchtet?this.renderGlow():F})}

        ${n?this.renderPowerButton({on:this.leuchtet,top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${r?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${s?this.renderThermo({value:be(this._ent(e.temp_entity)),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:e.temp_entity}):F}
        ${this.renderConfirm("UV-C-Lampe ausschalten?")}
      </div>
      ${t?F:I`<p class="slot-hint">
            UV-C-Lampe: bitte mindestens eine Entity wählen (Schalter, Leistung oder Temperatur).
          </p>`}
    `)}static styles=[rt,st,a`
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
    `]}customElements.define("tomtut-pool-slot-uv",Xt);const qt={power_btn_top:45,power_btn_left:8,power_btn_scale:110,arrow_in_top:86,arrow_in_left:8,arrow_in_size:12,arrow_out_top:12.5,arrow_out_left:91,arrow_out_size:12,temp_in_top:70,temp_in_left:14,temp_in_scale:105,temp_out_top:25,temp_out_left:72,temp_out_scale:105,power_bottom:8,power_left:42,power_scale:100,power_box:!0,power_label:!0},Jt=(e={},t)=>{for(const i of[e.active_entity,e.switch_entity]){if(!i)continue;const e=t?.states?.[i],n=String(e?.state??"").toLowerCase();return!e||["","unknown","unavailable"].includes(n)?null:de(n)}return null},Yt=(e={},t)=>{const i=Jt(e,t),n=t?.states?.[e.switch_entity],r=!!n&&de(String(n.state).toLowerCase());return{aktiv:i,bypass:!!e.active_entity&&r&&!1===i}};class ei extends it{get defaults(){return qt}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Die Solarheizung wird abgeschaltet — das Beckenwasser läuft dann nicht mehr über\n      die Absorber. Bei voller Sonne steht das Wasser im abgesperrten Absorber und wird sehr\n      heiß; nach dem Wiedereinschalten kommt kurz ein Schwall davon ins Becken."}renderPfeil(e){const t=Number(this._v(`arrow_${e}_size`));return t>0?I`<img
      class="flow-arrow flow-${e}"
      src="${Me(Be[e])}"
      alt=""
      style="top:${this._v(`arrow_${e}_top`)}%; left:${this._v(`arrow_${e}_left`)}%; width:${t}%;"
    />`:F}render(){const e=this.config||{},t=((e={})=>!!(e.switch_entity||e.temp_in_entity||e.temp_out_entity||e.power_entity))(e),i=!1!==e.show_power_button&&!!e.switch_entity,n=!1!==e.show_temp_in&&!!e.temp_in_entity,r=!1!==e.show_temp_out&&!!e.temp_out_entity,s=!1!==e.show_power&&!!e.power_entity,a=!1!==e.show_arrows,o=Yt(e,this.hass),l=!1===o.aktiv;return this.renderSlot(I`
      ${e.label?I`<h3 class="slot-title">${e.label}</h3>`:F}
      <div class="img-wrap ${l?"ruht":""} ${o.bypass?"bypass":""}">
        ${this.renderGeraeteBild({kind:"solar",alt:"Solarheizung"})}
        ${a?I`${this.renderPfeil("in")}${this.renderPfeil("out")}`:F}

        ${i?this.renderPowerButton({on:this._isOn(e.switch_entity),standby:o.bypass,hinweis:{oben:"Steuerung an",unten:"Bypass",lage:"mitte",titel:"Solarsteuerung an, Wasser läuft aber nicht übers Feld (Bypass) — Steuerung ausschalten (mit Rückfrage)"},top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):F}
        ${n?this.renderThermo({value:be(this._ent(e.temp_in_entity)),top:this._v("temp_in_top"),left:this._v("temp_in_left"),scale:this._v("temp_in_scale"),entity:e.temp_in_entity}):F}
        ${r?this.renderThermo({value:be(this._ent(e.temp_out_entity)),top:this._v("temp_out_top"),left:this._v("temp_out_left"),scale:this._v("temp_out_scale"),entity:e.temp_out_entity}):F}
        ${s?this.renderValueBox({value:this.wattText(e.power_entity),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),entity:e.power_entity}):F}
        ${this.renderConfirm("Solarheizung abschalten?")}
      </div>
      ${t?F:I`<p class="slot-hint">
            Solarheizung: bitte mindestens eine Entity wählen (Ventil/Pumpe, Vorlauf, Rücklauf
            oder Leistung).
          </p>`}
    `)}static styles=[rt,st,a`
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
    `]}customElements.define("tomtut-pool-slot-solar",ei);const ti=["ha-entity-picker","ha-icon-picker"];let ii=null;const ni=()=>"undefined"!=typeof customElements&&ti.every(e=>!!customElements.get(e)),ri=e=>"undefined"!=typeof customElements&&!!customElements.get(e),si=8,ai=["klassisch","liste","kacheln"],oi="klassisch",li=["switch","light","input_boolean","fan","siren"],ci={switch:"mdi:toggle-switch-variant",input_boolean:"mdi:toggle-switch-outline",light:"mdi:lightbulb",fan:"mdi:fan",siren:"mdi:bullhorn",sensor:"mdi:eye",binary_sensor:"mdi:checkbox-blank-circle-outline",climate:"mdi:thermostat",number:"mdi:ray-vertex",input_number:"mdi:ray-vertex"},di=e=>(Array.isArray(e?.entries)?e.entries:[]).filter(e=>e&&(e.entity||e.text||e.label)),hi=e=>ai.includes(e?.layout)?e.layout:oi;class pi extends it{get confirmDefault(){return!1}get powerEntityId(){return this._wartet?.entity||null}get powerConfirmText(){return`„${this._wartet?.label||_e(this._ent(this._wartet?.entity),this._wartet?.entity)}" wird ausgeschaltet.`}get _entries(){return di(this.config).slice(0,8)}get _ausgeblendet(){return Math.max(0,di(this.config).length-8)}get _layout(){return hi(this.config)}get _align(){const e=this.config?.align;return["oben","mitte","unten"].includes(e)?e:"klassisch"===this._layout?"mitte":"oben"}get _frameClasses(){return`${super._frameClasses} layout-${this._layout}`}_kind(e){return e.kind||(e.entity?"entity":"text")}_schaltbar(e){return li.includes(ge(e.entity))}_toggle(e){const t=e.entity;if(t&&this.bedienbar&&this._schaltbar(e))return!0===e.confirm_off&&this._isOn(t)?(this._wartet=e,void(this._confirmOpen=!0)):void this._call(t,"toggle")}_zustand(e){if(!e)return"—";try{const t=this.hass?.formatEntityState?.(e);if(t)return t}catch(e){console.warn("tomtut-pool-cards: formatEntityState —",e?.message||e)}return we(e)}_icon(e,t){if(e.icon)return I`<ha-icon icon="${e.icon}"></ha-icon>`;if(t&&ri("ha-state-icon"))return I`<ha-state-icon .hass="${this.hass}" .stateObj="${t}"></ha-state-icon>`;const i=t?.attributes?.icon||ci[ge(e.entity)]||"mdi:circle-medium";return I`<ha-icon icon="${i}"></ha-icon>`}_renderEntry(e){const t=this._kind(e);if("text"===t)return I`<div class="entry text">${e.text||e.label||""}</div>`;const i=this._ent(e.entity);if("button"===t){const t=!!i&&de(i.state);return I`
        <button class="entry btn-entry ${t?"on":""}" @click="${()=>this._toggle(e)}">
          ${e.icon?I`<ha-icon icon="${e.icon}"></ha-icon>`:F}
          <span>${e.label||_e(i,e.entity)}</span>
        </button>
      `}return I`
      <div class="entry value" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${e.label||_e(i,e.entity)}</span>
        <span class="entry-value">${we(i)}</span>
      </div>
    `}_renderZeile(e){const t=this._kind(e);if("text"===t)return I`<div class="entry zeile text"><span class="z-text">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),n=e.label||_e(i,e.entity),r=!i||["unavailable","unknown"].includes(i.state);if("button"===t&&this._schaltbar(e)){const t=!!i&&de(i.state);return I`
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
      `}return I`
      <div class="entry zeile wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="z-icon">${this._icon(e,i)}</span>
        <span class="z-name">${n}</span>
        <span class="z-wert">${this._zustand(i)}</span>
      </div>
    `}_renderKachel(e){const t=this._kind(e);if("text"===t)return I`<div class="entry kachel text"><span class="k-name">${e.text||e.label||""}</span></div>`;const i=this._ent(e.entity),n=e.label||_e(i,e.entity);if("button"===t&&this._schaltbar(e)){const t=!!i&&de(i.state);return I`
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
      `}return I`
      <div class="entry kachel wert" data-entity="${e.entity||""}" @click="${this._moreInfo}">
        <span class="k-icon">${this._icon(e,i)}</span>
        <span class="k-text">
          <span class="k-name">${n}</span>
          <span class="k-zustand">${this._zustand(i)}</span>
        </span>
      </div>
    `}render(){const e=this.config||{},t=this._entries,i=this._layout,n=this._ausgeblendet;let r;return r=t.length?"liste"===i?I`<div class="zeilen">${t.map(e=>this._renderZeile(e))}</div>`:"kacheln"===i?I`<div class="kacheln">${t.map(e=>this._renderKachel(e))}</div>`:t.map(e=>this._renderEntry(e)):I`<p class="slot-hint">Noch keine Einträge — im Editor bis zu ${8} hinzufügen.</p>`,this.renderSlot(I`
      <div class="custom layout-${i} align-${this._align}">
        ${e.title?I`<h3 class="slot-title">${e.title}</h3>`:F}
        ${r}
        ${n?I`<p class="slot-hint mehr">+${n} weitere ${1===n?"Eintrag":"Einträge"} ausgeblendet (höchstens ${8})</p>`:F}
      </div>
      ${this.renderConfirm("Wirklich ausschalten?")}
    `)}static styles=[rt,st,a`
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
    `]}customElements.define("tomtut-pool-slot-custom",pi);class ui extends it{static properties={...it.properties,slotType:{attribute:!1}};render(){const e=this.config||{},t=We[this.slotType]||{},i=!1===t.ready?t.hint:e.hint||"";return this.renderSlot(I`
      ${e.title||e.label?I`<h3 class="slot-title">${e.title||e.label}</h3>`:F}
      ${i?I`<p class="slot-hint">${i}</p>`:F}
    `)}static styles=[rt,st]}customElements.define("tomtut-pool-slot-frame",ui);const mi=["voll","mini"],fi="voll",gi=e=>"mini"===String(e?.view??"").trim().toLowerCase()?"mini":fi,_i=["heatpump","pump","uv","solar","custom"],bi="–",wi=[["schwarz","Schwarz"],["weiss","Weiß"],["transparent","Transparent (nur Rand)"]],vi=(e={})=>wi.some(([t])=>t===e?.mini_tile_fill)?e.mini_tile_fill:"schwarz",$i=[["theme","Theme (HA-Card)"],["schwarz","Schwarz"],["weiss","Weiß"],["transparent","Transparent"]],ki=(e={})=>$i.some(([t])=>t===e?.mini_card_fill)?e.mini_card_fill:"theme",yi=5,xi=e=>{const t=Math.max(1,Math.floor(Number(e)||0));return t<=5?t:Math.ceil(t/2)},zi=["","unknown","unavailable","none"],Si=e=>null==e||""===e||"—"===e?bi:e,Ai=(e,t)=>Si(be(e?.states?.[t])),Ei=(e,t)=>{const i=ue(e?.states?.[t]);return null===i?bi:`${pe(i,0)} W`},Bi=(e,t,i)=>{const n=new e;return n.config=t||{},n.hass=i,n},Pi=e=>String(e?.label||e?.label_text||e?.title||"").trim()||We[e?.type]?.label||"Kasten",Ci=e=>({src:Te(e),ratio:Le(e)}),Mi={pump:[["stufe","Stufe"],["watt","Watt"],["temp","Temperatur"],["status","Status an/aus"]],heatpump:[["modus","Modus"],["watt","Watt"],["ist","Ist-Temperatur"],["soll","Soll-Temperatur"],["freigabe","Freigabe"],["status","Status an/aus"]],solar:[["vorlauf","Vorlauf"],["ruecklauf","Rücklauf"],["watt","Watt"],["status","Status an/aus"]],uv:[["status","Status an/aus"],["watt","Watt"],["temp","Temperatur"]],hero:[["temp","Temperatur"],["ph","pH"],["rx","RX"],["zulauf","Zulauf"]]},Ti={stufe:"Stufe",watt:"Watt",temp:"Temp",status:"Status",modus:"Modus",ist:"Ist",soll:"Soll",freigabe:"Freigabe",vorlauf:"Vorlauf",ruecklauf:"Rücklauf"},Li=3,Wi={pump:{stufe:e=>yt(e)||!!e.power_entity,watt:e=>!!e.power_entity,temp:e=>!!e.temp_entity},heatpump:{modus:()=>!0,watt:e=>!!e.power_entity,ist:e=>!!e.current_entity,soll:e=>!!e.target_entity,freigabe:e=>!!e.release_entity},solar:{vorlauf:e=>!!e.temp_in_entity,ruecklauf:e=>!!e.temp_out_entity,watt:e=>!!e.power_entity},uv:{watt:e=>!!e.power_entity,temp:e=>!!e.temp_entity},hero:{temp:e=>!!e.temp_entity&&!1!==e.show_thermo,ph:e=>!!e.ph_entity&&!1!==e.show_ph,rx:e=>!!e.rx_entity&&!1!==e.show_rx,zulauf:e=>!!e.inlet_temp_entity}},Oi=(e,t)=>String(e?.label||e?.text||e?.entity||"").trim()||`Eintrag ${t+1}`,Ki=(e={},t=String(e?.type||"frame").toLowerCase())=>{const i=e||{};let n;if("custom"===t)n=di(i).map((e,t)=>[String(t+1),Oi(e,t)]);else{const e=Wi[t]||{};n=(Mi[t]||[]).filter(([t])=>!e[t]||e[t](i))}const r=e=>n.some(([t])=>t===e);let s;switch(t){case"pump":s=[r("stufe")?"stufe":"status",r("watt")?"watt":r("temp")?"temp":null];break;case"heatpump":s=["modus",r("watt")?"watt":null];break;case"solar":s=r("vorlauf")||r("ruecklauf")?["vorlauf","ruecklauf"].filter(r):["status",r("watt")?"watt":null];break;case"uv":s=["status",r("watt")?"watt":r("temp")?"temp":null];break;case"custom":s=n.length?["1"]:[];break;case"hero":s=n.map(([e])=>e);break;default:s=[]}s=s.filter(e=>e&&r(e));const a=Array.isArray(i.mini_show),o=a?i.mini_show.map(e=>String(e).trim().toLowerCase()):s,l=n.map(([e])=>e).filter(e=>o.includes(e));return{verfuegbar:n,standard:s,gewaehlt:l,eigen:a}},Ni=(e={})=>_i.includes(String(e?.type||"").toLowerCase())&&!0!==e?.mini_hidden,Ri=e=>e?`${pe(e.value,Number.isInteger(e.value)?0:1)} ${e.unit}`:bi,Vi=(e={},t)=>{const i=String(e?.type||"frame").toLowerCase(),n={...e||{},type:i},r={typ:i,name:Pi(n),bild:null,icon:null,zustand:"neutral",gesperrt:!1,zeilen:[]},s=(e,t={})=>({text:Si(e),...t}),a=e=>!!e&&!!t?.states?.[e],o=e=>de(t?.states?.[e]?.state),l=()=>"an"===r.zustand?"An":"aus"===r.zustand?"Aus":"gesperrt"===r.zustand?"Gesperrt":bi,{gewaehlt:c}=Ki(n,i);let d={};switch(i){case"pump":{const e=Bi(xt,n,t);r.bild=Ci("pump");const i=e.state;let a=null;if(e.blockedByMain?(a="Aus",r.zustand="aus"):yt(n)&&e.running?(a=e.stageLabels[i.active]||`N${(i.active??0)+1}`,r.zustand="an"):e.stages.length||n.power_entity||!n.main_entity?(yt(n)||n.power_entity)&&(a="Stopp",r.zustand="aus"):(a=o(n.main_entity)?"An":"Aus",r.zustand=o(n.main_entity)?"an":"aus"),!1!==n.show_fan){const t="an"===r.zustand,n=["fan_speed_1","fan_speed_2","fan_speed_3"][i.active??0]||"fan_speed_1";r.rad={top:Number(e._v("fan_top")),left:Number(e._v("fan_left")),size:Math.max(1.9*Number(e._v("fan_size")),38),ratio:1,rund:!0,dreht:t,dur:kt(e._v(n)),svg:Ze}}d={stufe:()=>s(a),watt:()=>s(Ei(t,n.power_entity)),temp:()=>s(Ai(t,n.temp_entity)),status:()=>s(l())};break}case"heatpump":{const e=Bi(Gt,n,t);r.bild=Ci("heatpump");const i=e._freigabe;r.gesperrt=!1===i;const h=n.switch_entity,p=e._klimaAus,u=p||[n.mode_entity,n.target_entity,n.current_entity].some(e=>String(e||"").startsWith("climate.")),m=!p&&(a(h)?o(h):e._fanActive);r.zustand=r.gesperrt?"gesperrt":m?"an":h||n.power_entity||n.fan_entity||u?"aus":"neutral",!1!==n.show_fan&&(r.rad={top:Number(e._v("fan_top")),left:Number(e._v("fan_left")),size:Number(e._v("fan_size")),ratio:Number(e._v("fan_ratio"))||1,rund:!1,dreht:e._fanActive&&!!Ft(n),dur:e._fanDur,farbe:e._fanFarbe,svg:et(e._v("fan_design"))}),d={modus:()=>{if(a(h)&&!o(h)||p)return s("Aus");const t=e._modusBadge;return t?s(t.text,"heizen"===t.art||"kuehlen"===t.art?{punkt:t.art}:{}):s(m?"An":"Aus")},watt:()=>s(Ei(t,n.power_entity)),ist:()=>s(Ri(e._current),{name:"Ist"}),soll:()=>s(Ri(e._target),{name:"Soll"}),freigabe:()=>{const e=null===i?null:i?"frei":"gesperrt",t=null===e?null:c.length>=3?e:`Freigabe ${e}`;return s(t,{...!1===i?{warn:!0}:{},umbruch:c.length<3})},status:()=>s(l(),r.gesperrt?{warn:!0}:{})};break}case"uv":{r.bild=Ci("uv");const e=n.switch_entity;a(e)&&(r.zustand=o(e)?"an":"aus"),d={status:()=>s(l()),watt:()=>s(Ei(t,n.power_entity)),temp:()=>s(Ai(t,n.temp_entity))};break}case"solar":{r.bild=Ci("solar");const e=Yt(n,t);null!==e.aktiv&&(r.zustand=e.aktiv?"an":"aus"),d={vorlauf:()=>s(Ai(t,n.temp_in_entity),{pfeil:"in"}),ruecklauf:()=>s(Ai(t,n.temp_out_entity),{pfeil:"out"}),watt:()=>s(Ei(t,n.power_entity)),status:()=>s(l())};break}case"custom":{const e=di(n),i=e[Number(c[0])-1]||e[0],a=e=>{if("text"===(e.kind||(e.entity?"entity":"text"))||!e.entity)return{text:e.text||e.label,icon:e.icon||"mdi:text"};const i=t?.states?.[e.entity],n=ge(e.entity),r=e.icon||i?.attributes?.icon||ci[n]||"mdi:circle-medium";if(!i||zi.includes(String(i.state).toLowerCase()))return{text:null,icon:r,name:e.label||_e(i,e.entity)};const s=e.label||_e(i,e.entity);if(li.includes(n))return{text:de(i.state)?"An":"Aus",icon:r,name:s,schalter:de(i.state)};if(null!==he(i.state))return{text:we(i),icon:r,name:s};try{return{text:t?.formatEntityState?.(i)||we(i),icon:r,name:s}}catch(e){return console.warn("tomtut-pool-cards: formatEntityState —",e?.message||e),{text:we(i),icon:r,name:s}}};if(!i)return r.icon="mdi:form-textbox",r.zeilen.push(s(n.title||"Freifeld")),r;const o=a(i);if(r.icon=o.icon,void 0!==o.schalter&&(r.zustand=o.schalter?"an":"aus"),1===c.length){r.zeilen.push(s(o.text));const e=o.name||n.title;return e&&r.zeilen.push(s(e)),r}for(const t of c){const i=e[Number(t)-1];if(!i)continue;const n=a(i);r.zeilen.push(s(n.text,n.name?{name:n.name}:{}))}return r}default:return r.zeilen.push(s(null)),r}for(const e of c){if(!d[e])continue;const t=d[e]();c.length>=3&&!t.punkt&&(t.name=Ti[e]||t.name),r.zeilen.push(t)}return r},Di=(e={},t)=>{const i=Bi(mt,e||{},t),n=ke(e?.shape),{gewaehlt:r}=Ki(e||{},"hero"),s=e=>r.includes(e),a=[];s("ph")&&a.push({key:"pH",text:Ai(t,e.ph_entity),entity:e.ph_entity}),s("rx")&&a.push({key:"RX",text:Ai(t,e.rx_entity),entity:e.rx_entity}),s("zulauf")&&a.push({key:"Zulauf",text:Ai(t,e.inlet_temp_entity),entity:e.inlet_temp_entity});const o=Object.values(Se).filter(e=>i._spriteAn(e.anker)).map(t=>({anker:t.anker,src:Me(t.file),...ht(e||{},t,"mini")}));return{bild:Me(n.file),ratio:xe(e?.shape),label:n.label,temp:s("temp")?Ai(t,e.temp_entity):null,chips:a,sprites:o}},Hi=e=>t=>{"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),e())},Ii=e=>["transparent","weiss","schwarz"].includes(e?.frame?.fill)?e.frame.fill:"transparent",ji=e=>e<=2?"normal":"raster",Fi=(e,t,i)=>I`
  <div
    class="kachel ${t.zustand} typ-${t.typ} dichte-${ji(t.zeilen.length)} ${t.zeilen.length>=5?"viele":""}"
    role="button"
    tabindex="0"
    data-mini="${i}"
    title="${t.name} — tippen für den vollen Kasten"
    aria-label="${t.name}: ${t.zeilen.map(e=>e.name?`${e.name} ${e.text}`:e.text).join(", ")}"
    @click="${()=>e._miniOeffnen(i)}"
    @keydown="${Hi(()=>e._miniOeffnen(i))}"
  >
    <span class="k-status" title="${{an:"an",aus:"aus",gesperrt:"gesperrt"}[t.zustand]||"unbekannt"}"></span>
    <div class="k-innen">
      <div class="k-bild">
        ${t.bild?I`<div class="k-bildbox" style="--r:${Math.round(1e3*t.bild.ratio)/1e3};">
              <img src="${t.bild.src}" alt="${t.name}" />${(e=>e?I`<div
        class="k-rad ${e.dreht&&e.dur>0?"dreht":"steht"} ${e.rund?"rund":""}"
        style="top:${e.top}%; left:${e.left}%; width:${e.size}%; --k-rad-ratio:${e.ratio}; --k-rad-dur:${e.dur}s;${e.farbe?` --k-rad-farbe:${e.farbe};`:""}"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="${e.rund?"xMidYMid meet":"none"}">
          <g .innerHTML="${e.svg}"></g>
        </svg>
      </div>`:F)(t.rad)}
            </div>`:I`<ha-icon icon="${t.icon||"mdi:circle-medium"}"></ha-icon>`}
        ${t.gesperrt?I`<span class="k-sperre">Gesperrt</span>`:F}
      </div>
      ${t.zeilen.length?I`<div class="k-werte">${t.zeilen.map((e,i)=>((e,t,i=!1)=>I`<span
  class="k-zeile ${t?"neben":"haupt"} ${e.punkt?`badge ${e.punkt}`:""} ${e.warn?"warn":""} ${i?"breit":""} ${e.umbruch?"umbruch":""}"
  >${e.pfeil?I`<img
        class="k-pfeil"
        src="${Me(Be[e.pfeil])}"
        alt="${"in"===e.pfeil?"Vorlauf":"Rücklauf"}"
      />`:F}${e.name?I`<span class="k-name">${e.name}</span>`:F}<span class="k-text"
    >${e.text}</span
  ></span
>`)(e,i,((e,t)=>{const i=e.map((e,t)=>e.punkt?-1:t).filter(e=>e>=0);return e.length>=3&&i.length%2==1&&i[i.length-1]===t})(t.zeilen,i)))}</div>`:F}
    </div>
  </div>
`,Gi=e=>{const t=e._config,i=e.hass,n=!1!==t.hero?.enabled&&!0!==t.hero?.mini_hidden,r=e._slotsMitNummer.filter(({slot:e})=>Ni(e));return I`
    <ha-card
      class="mini-karte slot fill-${Ii(t)} ${!1===t.frame?.enabled?"":"framed"} aussen-${ki(t)}"
    >
      <div class="mini kacheln-${vi(t)}" style="--m-spalten:${xi(r.length)};">
        ${n?((e,t)=>I`
  <div
    class="m-kopf"
    role="button"
    tabindex="0"
    data-mini="${ft}"
    title="Becken — tippen für den vollen Kasten"
    @click="${()=>e._miniOeffnen(ft)}"
    @keydown="${Hi(()=>e._miniOeffnen(ft))}"
  >
    <div class="m-becken" style="--r:${Math.round(1e3*t.ratio)/1e3};">
      <img class="m-becken-bild" src="${t.bild}" alt="Pool ${t.label}" />
      ${t.sprites.map(e=>I`<img
          class="m-sprite sprite-${e.anker}"
          src="${e.src}"
          alt=""
          style="top:${e.top}%; left:${e.left}%; width:${e.breite}%;"
        />`)}
    </div>
    <div class="m-werte">
      ${null===t.temp?F:t.temp===bi?I`<div class="m-temp leer" title="Wassertemperatur: kein Wert">
            ${tt}<span class="m-temp-leer"><span class="m-temp-key">Wasser</span>${bi}</span>
          </div>`:I`<div class="m-temp">${tt}<span class="m-temp-wert">${t.temp}</span></div>`}
      ${t.chips.length?I`<div class="m-chips">
            ${t.chips.map(e=>I`<span class="m-chip" data-entity="${e.entity}"
                ><span class="m-chip-key">${e.key}</span><span class="m-chip-wert">${e.text}</span></span
              >`)}
          </div>`:F}
    </div>
  </div>
`)(e,Di(t.hero,i)):F}
        ${r.length?I`<div class="m-kacheln">
              ${r.map(({slot:t,nr:n})=>Fi(e,Vi(t,i),n))}
            </div>`:F}
      </div>
      ${(e=>{const t=e._miniOffen;if(null==t)return F;const i=e._config;let n,r,s;if(t===ft){if(!1===i.hero?.enabled)return F;n="Becken",r=bt(i,ft),s=I`<tomtut-pool-hero
      .hass="${e.hass}"
      .config="${i.hero}"
      .frame="${i.frame}"
      .kiosk="${r}"
    ></tomtut-pool-hero>`}else{const a=e._slotsMitNummer.find(e=>e.nr===t);if(!a)return F;n=Pi(a.slot),r=bt(i,a.nr),s=e._renderSlot(a.slot,r)}return I`
    <dialog
      class="m-dialog slot fill-${Ii(i)}"
      data-mini-dialog="${t}"
      aria-label="${n}"
      @click="${t=>e._miniBackdrop(t)}"
      @close="${()=>e._miniZu()}"
    >
      <div class="m-dialog-kopf">
        <span class="m-dialog-titel"
          >${n}${r?I` <small class="m-nur-anzeige">nur Anzeige</small>`:F}</span
        >
        <button class="m-zu" type="button" title="Schließen" aria-label="Schließen" @click="${()=>e._miniZu()}">
          ✕
        </button>
      </div>
      <div class="m-dialog-inhalt" @hass-more-info="${()=>e._miniZu()}">${s}</div>
    </dialog>
  `})(e)}
    </ha-card>
  `},Ui=a`
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
    --k-modus: ${s(At.heizen)};
  }
  .k-zeile.kuehlen {
    --k-modus: ${s(At.kuehlen)};
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
`,Zi={enabled:!0,fill:"transparent"};class Qi extends oe{static properties={hass:{attribute:!1},_config:{state:!0},_miniOffen:{state:!0}};constructor(){super(),this._miniOffen=null}setConfig(e){if(!e||"object"!=typeof e)throw new Error("Ungültige Konfiguration");if(void 0!==e.slots&&!Array.isArray(e.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==e.hero&&("object"!=typeof e.hero||Array.isArray(e.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==e.version&&1!==Number(e.version))throw new Error(`Unbekannte Config-Version ${e.version} — diese Card kennt Version 1`);this._config={version:1,...e,hero:{enabled:!0,shape:$e,...e.hero||{}},frame:{...Zi,...e.frame||{}},slots:Array.isArray(e.slots)?e.slots:[]},this._miniOffen=null}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:$e},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const e=this._config||{};if("mini"===gi(e)){const t=(e.slots||[]).filter(e=>_i.includes(String(e?.type||"").toLowerCase())).length;return(!1===e.hero?.enabled?0:3)+(t?2:0)||2}const t=(e.slots||[]).filter(e=>"hidden"!==(e?.type||"frame"));return(!1===e.hero?.enabled?0:6)+5*Math.ceil(t.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(e=>({...e||{},type:String(e?.type||"frame").toLowerCase()})).filter(e=>"hidden"!==e.type)}get _slotsMitNummer(){return(this._config?.slots||[]).map((e,t)=>({slot:{...e||{},type:String(e?.type||"frame").toLowerCase()},nr:t+1})).filter(({slot:e})=>"hidden"!==e.type)}_miniOeffnen(e){this._miniOffen=e}_miniZu(){null!==this._miniOffen&&(this._miniOffen=null)}_miniBackdrop(e){e?.target===e?.currentTarget&&this._miniZu()}updated(e){super.updated?.(e);const t=this.renderRoot?.querySelector?.("dialog.m-dialog");if(t&&!t.open)try{"function"==typeof t.showModal?t.showModal():t.setAttribute("open","")}catch(e){console.warn("tomtut-pool-cards: Dialog ohne showModal —",e?.message||e),t.setAttribute("open","")}}render(){if(!this._config)return F;const e=this._config;if("mini"===gi(e))return Gi(this);const t=!1!==e.hero?.enabled;return I`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${t?I`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${e.hero}"
                  .frame="${e.frame}"
                  .kiosk="${bt(e,ft)}"
                ></tomtut-pool-hero>`:F}
            ${this._slotsMitNummer.map(({slot:t,nr:i})=>this._renderSlot(t,bt(e,i)))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(e,t=!1){const i=this._config.frame;switch(We[e.type]?.ready?e.type:"frame"){case"heatpump":return I`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return I`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-pump>`;case"uv":return I`<tomtut-pool-slot-uv
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-uv>`;case"solar":return I`<tomtut-pool-slot-solar
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-solar>`;case"custom":return I`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${e}"
          .frame="${i}"
          .kiosk="${t}"
        ></tomtut-pool-slot-custom>`;default:return I`<tomtut-pool-slot-frame
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
  `,nt,Ui]}customElements.define("tomtut-pool-dashboard",Qi);class Xi{constructor({hass:e,config:t,defaults:i={},update:n,idPrefix:r="f",stash:s=null}){this.hass=e,this.config=t||{},this.defaults=i,this.update=n,this.idPrefix=r,this.stash=s}val(e){const t=this.config?.[e];return null==t||""===t?this.defaults[e]:t}raw(e){const t=this.config?.[e];return null==t?"":t}shown(e,t=!0){const i=this.config?.[e];return null==i?t:!1!==i}element(e,t,i=[],n=!0){const r=this.shown(t,n);return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${r}"
          @change="${e=>this._toggleElement(t,i,n,e.target.checked)}"
        />
      </div>
    `}_toggleElement(e,t,i,n){const r={},s=this.stash;if(n){r[e]=!0!==i||void 0;const t=s?.[`${this.idPrefix}:${e}`];t&&(Object.assign(r,t),delete s[`${this.idPrefix}:${e}`])}else{r[e]=!1;const i={};for(const e of t)void 0!==this.config?.[e]&&(i[e]=this.config[e]),r[e]=void 0;s&&Object.keys(i).length&&(s[`${this.idPrefix}:${e}`]=i)}this.update(r)}text(e,t,i="",n=""){return I`
      <label
        >${e}
        <input
          type="text"
          data-key="${t}"
          .value="${String(this.raw(t))}"
          placeholder="${n}"
          @input="${e=>this.update({[t]:e.target.value})}"
        />
        ${i?I`<small>${i}</small>`:F}
      </label>
    `}_entityOptions(e){const t=this.hass?.states??{};return Object.keys(t).filter(t=>!e.length||e.some(e=>t.startsWith(e+"."))).sort()}entity(e,t,i="",...n){return this._entityInput({label:e,hint:i,domains:n,value:String(this.raw(t)),dataKey:t,listId:`${this.idPrefix}-${t}`,onChange:e=>this.update({[t]:e||void 0})})}entityAt(e,t,i,n="",...r){const s=Array.isArray(this.config?.[t])?this.config[t]:[];return this._entityInput({label:e,hint:n,domains:r,value:String(s[i]??""),dataKey:`${t}.${i}`,listId:`${this.idPrefix}-${t}-${i}`,onChange:e=>this._updateList(t,i,e)})}_entityInput({label:e,hint:t,domains:i,value:n,dataKey:r,listId:s,onChange:a}){return ri("ha-entity-picker")?I`
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
      `:I`
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
          ${this._entityOptions(i).map(e=>I`<option value="${e}"></option>`)}
        </datalist>
        ${t?I`<small>${t}</small>`:F}
      </label>
    `}_updateList(e,t,i){const n=Array.isArray(this.config?.[e])?[...this.config[e]]:[];for(;n.length<=t;)n.push("");for(n[t]=i;n.length&&!n[n.length-1];)n.pop();this.update({[e]:n.length?n:void 0})}icon(e,t,i=""){return ri("ha-icon-picker")?I`
        <ha-icon-picker
          .hass="${this.hass}"
          .value="${String(this.raw(t))}"
          .label="${e}"
          .helper="${i}"
          data-key="${t}"
          @value-changed="${e=>{e.stopPropagation(),this.update({[t]:e.detail?.value||void 0})}}"
        ></ha-icon-picker>
      `:this.text(e,t,i,"mdi:lightbulb")}select(e,t,i,n){const r=this.config?.[t]??n;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <select data-key="${t}" @change="${e=>this.update({[t]:e.target.value})}">
          ${i.map(([e,t])=>I`<option value="${e}" ?selected="${r===e}">${t}</option>`)}
        </select>
      </div>
    `}slider(e,t,i,n,r="%",s=1){const a=this.val(t),o=null==a||""===a?i:a;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="range"
          min="${i}"
          max="${n}"
          step="${s}"
          data-key="${t}"
          .value="${String(o)}"
          @input="${e=>this.update({[t]:parseFloat(e.target.value)})}"
        />
        <span class="row-val">${o}${r}</span>
      </div>
    `}toggle(e,t,i){const n=this.config?.[t]??i;return I`
      <div class="row">
        <span class="row-label">${e}</span>
        <input
          type="checkbox"
          data-key="${t}"
          ?checked="${n}"
          @change="${e=>this.update({[t]:e.target.checked})}"
        />
      </div>
    `}}const qi=(e,t,i=!1)=>I`
  <details class="section" ?open="${i}">
    <summary>${e}</summary>
    <div class="section-body">${t}</div>
  </details>
`,Ji=e=>I`
  <details class="section elements" open>
    <summary>Elemente anzeigen</summary>
    <div class="section-body">
      ${e}
      <small>Nur angehakte Elemente haben Felder — und landen in der Konfiguration.</small>
    </div>
  </details>
`,Yi=a`
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
`,en=["switch","input_boolean","light"],tn=["sensor","input_number"],nn=["sensor","input_number","number"],rn=["climate","number","input_number","sensor"],sn=["sensor","select","input_select","climate"],an=["switch","input_boolean","binary_sensor"],on=(e,t=!0,i="Aus = ein Tippen auf den Powerbutton schaltet sofort ab, ohne Warnung.")=>I`
  ${e.toggle("Vor dem Ausschalten nachfragen","confirm_off",t)}
  <small>${i}</small>
`,ln=(e,t,i,n,r)=>{if(!e.shown(n,r))return F;const s="mini"===e.teilePos,a=e=>`${s?"mini_":""}${i}_${e}`,o=["top","left","size"].some(t=>""!==e.raw(`mini_${i}_${t}`));return qi(`${t} — Größe und Lage (${s?"Mini":"Voll"})`,I`
      <div data-teil="${i}" data-teil-pos="${s?"mini":"voll"}">
        ${e.slider("Größe",a("size"),2,40,"%",.5)}
        ${e.slider("Links ↔ rechts",a("left"),0,100,"%",.5)}
        ${e.slider("Oben ↕ unten",a("top"),0,100,"%",.5)}
        ${s&&o?I`<button
              type="button"
              class="teil-reset"
              data-teil-reset="${i}"
              @click="${()=>e.update({[`mini_${i}_top`]:void 0,[`mini_${i}_left`]:void 0,[`mini_${i}_size`]:void 0})}"
            >
              Mini-Werte zurücksetzen (wie Voll)
            </button>`:F}
        <small>
          Größe = Breite in % der Beckenbreite. Das Teil bleibt immer ganz im Beckenbild.
          ${s?"Ohne eigene Mini-Werte gilt die Lage der vollen Ansicht.":""}
        </small>
      </div>
    `)},cn=e=>I`
  ${Ji(I`
    ${e.element("🌡 Thermometer","show_thermo",["temp_entity","thermo_scale","thermo_top","thermo_left"])}
    ${e.element("🧪 pH-Kästchen","show_ph",["ph_entity","ph_top","ph_left"])}
    ${e.element("⚗ Redox / RX-Kästchen","show_rx",["rx_entity","rx_top","rx_left"])}
    ${e.element("🛟 Skimmer","show_skimmer",["skimmer_size","skimmer_top","skimmer_left"])}
    ${e.element("💦 Einlaufdüse","show_inlet",["inlet_size","inlet_top","inlet_left","inlet_temp_entity","inlet_temp_top","inlet_temp_left"])}
    ${e.element("⚓ Bodenablauf","show_drain",["drain_size","drain_top","drain_left"],!1)}
  `)}
  ${e.select("Beckenform","shape",Object.entries(ve).map(([e,t])=>[e,t.label]),"oval")}
  ${e.shown("show_thermo")?I`
        ${e.entity("Wassertemperatur","temp_entity","Zeigt das Thermometer auf der Wasserfläche.",...nn)}
        ${qi("Thermometer — Position",I`
            ${e.slider("Größe","thermo_scale",50,200)}
            ${e.slider("Von oben","thermo_top",0,100,"%",.5)}
            ${e.slider("Von links","thermo_left",0,100,"%",.5)}
          `)}
      `:F}
  ${e.shown("show_ph")?I`
        ${e.entity("pH-Wert","ph_entity","Kästchen auf der Beckenwand.",...nn)}
        ${qi("pH — Position",I`
            ${e.slider("Von oben","ph_top",0,100,"%",.5)}
            ${e.slider("Von links","ph_left",0,100,"%",.5)}
          `)}
      `:F}
  ${e.shown("show_rx")?I`
        ${e.entity("Redox / RX","rx_entity","Kästchen auf der Beckenwand.",...nn)}
        ${qi("RX — Position",I`
            ${e.slider("Von oben","rx_top",0,100,"%",.5)}
            ${e.slider("Von links","rx_left",0,100,"%",.5)}
          `)}
      `:F}
  ${(e=>e.setTeilePos?I`<div class="teile-pos" role="group" aria-label="Positionen für">
        <span class="row-label">Positionen der Becken-Teile für</span>
        <div class="ansicht-wahl">
          ${["voll","mini"].map(t=>I`<button
              type="button"
              class="ansicht-knopf ${e.teilePos===t?"aktiv":""}"
              data-teile-pos="${t}"
              aria-pressed="${e.teilePos===t?"true":"false"}"
              @click="${()=>e.setTeilePos(t)}"
            >
              ${"voll"===t?"Voll":"Mini"}
            </button>`)}
        </div>
      </div>`:F)(e)}
  ${ln(e,"Skimmer","skimmer","show_skimmer",!0)}
  ${ln(e,"Einlaufdüse","inlet","show_inlet",!0)}
  ${e.shown("show_inlet",!0)?I`
        ${e.entity("Temperatur am Einlauf (optional)","inlet_temp_entity","Kleines Kästchen neben der Düse — zeigt, was gerade ins Becken läuft.",...nn)}
        ${e.raw("inlet_temp_entity")?qi("Einlauf-Temperatur — Position",I`
                ${e.slider("Von oben","inlet_temp_top",0,100,"%",.5)}
                ${e.slider("Von links","inlet_temp_left",0,100,"%",.5)}
                <small>Ohne eigene Werte sitzt das Kästchen automatisch neben der Düse.</small>
              `):F}
      `:F}
  ${ln(e,"Bodenablauf","drain","show_drain",!1)}
  ${e.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${e.raw("label_text")?qi("Freitext — Darstellung",I`
          ${e.slider("Größe","label_scale",50,200)}
          ${e.slider("Von oben","label_top",0,100,"%",.5)}
          ${e.slider("Von links","label_left",0,100,"%",.5)}
        `):F}
  ${e.toggle("Becken mit Rahmen","framed",!1)}
`,dn=(e,t={})=>{const i=t.mode_entity,n=i?e?.states?.[i]:null;if(!n)return null;const r=String(t.mode_attribute||"").trim(),s=r?n.attributes?.[r]:n.state,a=n.attributes||{},o=Array.isArray(a.options)?a.options:"preset_mode"===r&&Array.isArray(a.preset_modes)?a.preset_modes:!r&&Array.isArray(a.hvac_modes)?a.hvac_modes:[];return{roh:s??"",modus:Wt(s,t),optionen:o.map(e=>({wert:String(e),modus:Wt(e,t)}))}},hn=(e,t)=>{const i=String(t).toLowerCase();return Object.fromEntries(Object.entries(e||{}).filter(([e])=>e.toLowerCase()!==i))},pn=e=>{const t=e.config||{},i=dn(e.hass,t),n=i?I`<div class="modus-befund ${i.modus?"ok":"nein"}">
        Meldet gerade <b>${String(i.roh)||"—"}</b> →
        ${i.modus?I`<b>${i.modus.label}</b> ✓`:I`nicht zugeordnet ✗`}
      </div>`:I`<div class="modus-befund">Erst oben die Modus-Entity wählen.</div>`,r=((e,t={})=>{const i=dn(e,t);return i&&i.optionen.length?i.optionen.map(({wert:e})=>{const i=Wt(e,(e=>{const t={...e||{}};return delete t.mode_map,t})(t)),n=Tt(e,t),r=void 0!==n?n?.key||"":i?.key||"";return{wert:e,auto:i?.key||"",aktuell:r,name:String(t.mode_names?.[e]??"")}}):[]})(e.hass,t),s=r.length?I`<div class="modus-zeilen">
        ${r.map(i=>I`<div class="modus-zeile ${i.aktuell?"ok":"nein"}" data-modus-wert="${i.wert}">
            <span class="modus-wert">${i.wert}</span>
            <span class="modus-pfeil">→</span>
            <select
              data-modus-select="${i.wert}"
              @change="${n=>((i,n,r)=>{const s=hn(t.mode_map,i);r!==n&&(s[i]=r);const a={mode_map:Object.keys(s).length?s:void 0};if(r){const e=hn(t.mode_names,i);a.mode_names=Object.keys(e).length?e:void 0}e.update(a)})(i.wert,i.auto,n.target.value)}"
            >
              <option value="" ?selected="${!i.aktuell}">— nicht zuordnen —</option>
              ${St.map(e=>I`<option value="${e.key}" ?selected="${i.aktuell===e.key}">${e.label}</option>`)}
            </select>
            ${i.aktuell?F:I`<input
                  type="text"
                  class="modus-name"
                  data-modus-name="${i.wert}"
                  .value="${i.name}"
                  placeholder="Anzeigename (sonst „${i.wert}“)"
                  @change="${n=>((i,n)=>{const r=hn(t.mode_names,i);String(n).trim()&&(r[i]=String(n).trim()),e.update({mode_names:Object.keys(r).length?r:void 0})})(i.wert,n.target.value)}"
                />`}
          </div>`)}
      </div>`:I`${St.map(i=>{const n=`mode_map_${i.key}`,r=i.zustaende.join(", "),s=t[n],a=Array.isArray(s)?s.join(", "):String(s??"").trim()?String(s):r;return I`<label
          >${i.label}
          <input
            type="text"
            data-key="${n}"
            .value="${a}"
            @change="${t=>{const i=t.target.value.trim();e.update({[n]:i&&i!==r?i:void 0})}}"
          />
        </label>`})}
      <small>Kommaliste der Gerätezustände je Modus. Leeren = Vorgabe.</small>`;return qi("Modus-Zuordnung",I`${n} ${s}`,!!i&&!i.modus&&""!==String(i.roh)&&!["unknown","unavailable"].includes(String(i.roh)))},un={heatpump:zt,pump:wt,uv:Ut,solar:qt},mn=(e,t)=>{const i={...e||{}};for(const[e,n]of Object.entries(t||{}))void 0===n?delete i[e]:i[e]=n;return i};class fn extends oe{static properties={hass:{attribute:!1},_config:{state:!0},_teilePos:{state:!0}};constructor(){super(),this._stash={}}connectedCallback(){super.connectedCallback(),(ni()?Promise.resolve(!0):"undefined"==typeof window||"function"!=typeof window.loadCardHelpers?Promise.resolve(!1):(ii||(ii=(async()=>{try{const e=await window.loadCardHelpers(),t=await(e?.createCardElement?.({type:"entities",entities:[]}));await(t?.constructor?.getConfigElement?.())}catch(e){console.warn("tomtut-pool-cards: HA-Eingabefelder nicht ladbar —",e?.message||e)}return ni()})()),ii)).then(e=>{e&&this.requestUpdate()})}setConfig(e){this._config={version:1,hero:{enabled:!0,shape:$e},frame:{enabled:!0,fill:"transparent"},slots:[],...e||{}}}_emit(e){this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}_updateHero(e){this._emit({...this._config,hero:mn(this._config.hero,e)})}_updateFrame(e){this._emit({...this._config,frame:mn(this._config.frame,e)})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_setAnsicht(e){gi(this._config)!==e&&this._emit(mn(this._config,{view:"mini"===e?"mini":void 0}))}_renderAnsicht(){const e="mini"===gi(this._config),t=(t,i)=>I`<button
      type="button"
      class="ansicht-knopf ${"mini"===t===e?"aktiv":""}"
      data-ansicht="${t}"
      aria-pressed="${"mini"===t===e?"true":"false"}"
      @click="${()=>this._setAnsicht(t)}"
    >
      ${i}
    </button>`;return I`
      <div class="ansicht-block ${e?"mini":""}">
        <span class="ansicht-titel">Ansicht</span>
        <div class="ansicht-wahl" role="group" aria-label="Ansicht">
          ${t("voll","Voll")} ${t("mini","Mini")}
        </div>
        ${e?I`<div class="row">
              <span class="row-label">Kachel-Hintergrund</span>
              <select
                data-key="mini_tile_fill"
                @change="${e=>this._emit(mn(this._config,{mini_tile_fill:"schwarz"===e.target.value?void 0:e.target.value}))}"
              >
                ${wi.map(([e,t])=>I`<option value="${e}" ?selected="${vi(this._config)===e}">${t}</option>`)}
              </select>
            </div>
            <div class="row">
              <span class="row-label">Außen-Hintergrund</span>
              <select
                data-key="mini_card_fill"
                @change="${e=>this._emit(mn(this._config,{mini_card_fill:"theme"===e.target.value?void 0:e.target.value}))}"
              >
                ${$i.map(([e,t])=>I`<option value="${e}" ?selected="${ki(this._config)===e}">${t}</option>`)}
              </select>
            </div>`:F}
        <small>
          Mini: die ganze Anlage kompakt in einer Card (z.B. kleines Tablet) — Becken oben, Geräte als
          Kacheln. Tipp auf eine Kachel öffnet den vollen Kasten. Dieselbe Einrichtung wie Voll.
        </small>
      </div>
    `}_renderMiniWahl(e,t,i){if("mini"!==gi(this._config))return F;const n=String(t||"").toLowerCase();if("hero"!==n&&!_i.includes(n))return F;const r=Ki(e||{},n),s="hero"!==n&&!0===e?.mini_hidden;return I`
      <div class="mini-wahl" data-mini-wahl="${n}">
        <div class="mini-wahl-titel">In Mini anzeigen</div>
        ${"hero"===n?F:I`<label class="mini-wahl-zeile">
              <input
                type="checkbox"
                data-mini-hidden
                .checked="${!s}"
                @change="${e=>i({mini_hidden:!e.target.checked||void 0})}"
              />
              <span>Als Kachel zeigen</span>
            </label>`}
        ${s?F:I`
              <div class="mini-wahl-werte">
                ${r.verfuegbar.map(([e,t])=>I`<label class="mini-wahl-zeile">
                    <input
                      type="checkbox"
                      data-mini-show="${e}"
                      .checked="${r.gewaehlt.includes(e)}"
                      @change="${t=>((e,t)=>{const n=r.verfuegbar.map(([e])=>e).filter(i=>i===e?t:r.gewaehlt.includes(i)),s=n.length===r.standard.length&&n.every((e,t)=>e===r.standard[t]);i({mini_show:s?void 0:n})})(e,t.target.checked)}"
                    />
                    <span>${t}</span>
                  </label>`)}
              </div>
              ${0===r.verfuegbar.length?I`<small>Noch keine Werte — erst oben die Entities wählen.</small>`:F}

            `}
      </div>
    `}_setKiosk(e){this._emit(mn(this._config,e?{kiosk:!0}:{kiosk:void 0,kiosk_slots:void 0}))}_setKioskKasten(e,t){const i=_t(this._config),n=i.filter(i=>String(i)===String(e)?t:bt({...this._config,kiosk:!0},i));this._emit(mn(this._config,{kiosk_slots:n.length===i.length?void 0:n}))}_renderKiosk(){const e=!0===this._config?.kiosk,t=_t(this._config),i=this._slots();return I`
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
        ${e?I`<div class="kiosk-liste">
              ${t.map(e=>{const t=e===ft?"Becken":this._slotKopf(i[e-1],e-1);return I`<label class="kiosk-kasten">
                  <input
                    type="checkbox"
                    data-kiosk-slot="${e}"
                    ?checked="${bt(this._config,e)}"
                    @change="${t=>this._setKioskKasten(e,t.target.checked)}"
                  />
                  <span>${t}</span>
                </label>`})}
            </div>`:F}
      </div>
    `}_updateSlot(e,t){const i=this._slots().map((i,n)=>n===e?mn(i,t):i);this._emit({...this._config,slots:i})}_updateEntry(e,t,i){const n=this._slots()[e]||{},r=Array.isArray(n.entries)?[...n.entries]:[];for(;r.length<=t;)r.push({});r[t]=mn(r[t],i),this._updateSlot(e,{entries:r})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(e){this._emit({...this._config,slots:this._slots().filter((t,i)=>i!==e)})}_moveSlot(e,t){const i=[...this._slots()],n=e+t;if(n<0||n>=i.length)return;const[r]=i.splice(e,1);i.splice(n,0,r),this._emit({...this._config,slots:i})}_fieldsFor(e){const t=this._slots()[e]||{};return new Xi({hass:this.hass,config:t,defaults:un[t.type]||{},update:t=>this._updateSlot(e,t),idPrefix:`slot${e}`,stash:this._stash})}_altTypOption(e){const t=We[e];return t&&!1===t.waehlbar?I`<option value="${e}" selected>${t.label}</option>`:F}_slotKopf(e,t){const i=We[e?.type]?.label||We.frame.label,n=String(e?.label||e?.label_text||e?.title||"").trim();return`Kasten ${t+1} · ${i}${n?` · ${n}`:""}`}_slotBody(e){const t=this._slots()[e]||{},i=this._fieldsFor(e);switch(t.type){case"heatpump":return(e=>I`
  ${Ji(I`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("🔌 Freigabekontakt","show_release",["release_entity","release_top","release_left","release_scale","show_release_since"],!1)}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_top","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Ist-Temperatur","show_current",["current_entity","current_bottom","current_left","current_scale","current_box","current_label"])}
    ${e.element("🎚 Soll-Temperatur","show_target",["target_entity","target_bottom","target_left","target_scale","target_step","target_box","target_label"])}
    ${e.element("🌀 Lüfter","show_fan",["fan_source","fan_entity","fan_power_threshold","fan_speed","fan_top","fan_left","fan_size","fan_ratio","fan_inactive","fan_design","fan_color_mode"])}
    ${e.element("🔁 Betriebsmodus","show_mode",["mode_entity","mode_attribute","show_mode_badge","mode_top","mode_left","mode_scale",...St.flatMap(e=>[`mode_speed_${e.key}`,`mode_map_${e.key}`]),"mode_map","mode_names"],!1)}
  `)}
  ${e.shown("show_power_button")?I`
        ${e.entity("Powerbutton — Schalter","switch_entity","z.B. die Shelly-Steckdose der Wärmepumpe. Ist er aus, steht der Lüfter immer.",...en)}
        ${on(e)}
        ${qi("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_release",!1)?I`
        ${e.entity("Freigabekontakt — Entity","release_entity","Der potentialfreie Eingang der Wärmepumpe: offen = sie darf nicht laufen, geschlossen = freigegeben.",...an)}
        <small>
          Damit sperrt oder gibt man die Wärmepumpe von außen frei (PV-Überschuss, Zeitfenster) —
          ohne an ihren eigenen Einstellungen zu drehen. Ist der Kontakt offen, zeigt die Karte
          „Gesperrt" und der Lüfter steht still, auch wenn der Schalter an ist. Ein binary_sensor
          wird nur angezeigt, switch und input_boolean schalten per Klick um.
        </small>
        ${qi("Freigabekontakt — Position",I`
            ${e.slider("Von oben","release_top",0,100,"%",.5)}
            ${e.slider("Von links","release_left",0,100,"%",.5)}
            ${e.slider("Größe","release_scale",50,200)}
          `)}
        ${e.toggle("Zeit seit dem letzten Wechsel anzeigen","show_release_since",!1)}
        <small>Klein unter dem Badge, z.B. „seit 2 Std 10 Min" — läuft minütlich mit.</small>
      `:F}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch — Sensor","power_entity","Leistungssensor in W oder kW (z.B. Shelly).",...tn)}
        ${qi("Stromverbrauch — Darstellung",I`
            ${e.slider("Von oben","power_top",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_current")?I`
        ${e.entity("Ist-Temperatur","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.",...rn)}
        ${qi("Ist-Temperatur — Darstellung",I`
            ${e.slider("Von unten","current_bottom",0,100)}
            ${e.slider("Von links","current_left",0,100)}
            ${e.slider("Größe","current_scale",50,150)}
            ${e.toggle("Box anzeigen","current_box",!0)}
            ${e.toggle("Label anzeigen","current_label",!0)}
          `)}
      `:F}
  ${e.shown("show_target")?I`
        ${e.entity("Soll-Temperatur","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.",...rn)}
        ${qi("Soll-Temperatur — Darstellung",I`
            ${e.slider("Von unten","target_bottom",0,100)}
            ${e.slider("Von links","target_left",0,100)}
            ${e.slider("Größe","target_scale",50,150)}
            ${e.slider("Schrittweite","target_step",.1,5,"",.1)}
            ${e.toggle("Box anzeigen","target_box",!0)}
            ${e.toggle("Label anzeigen","target_label",!0)}
          `)}
      `:F}
  ${e.shown("show_fan")?I`
        ${qi("Lüfter — wann dreht er?",I`
            ${e.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
            ${e.entity("Lüfter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Lüfter dreht.","binary_sensor","switch","sensor","fan","climate")}
            ${e.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
            ${e.slider("Drehgeschwindigkeit","fan_speed",0,100)}
            <small>
              Ist der Schalter der Wärmepumpe aus, steht der Lüfter immer. Mit erkanntem
              Betriebsmodus gilt statt der Drehgeschwindigkeit das Tempo des Modus.
            </small>
          `,!0)}
        ${qi("Lüfter — Aussehen",I`
            ${e.select("Blatt-Design","fan_design",Object.entries(Je).map(([e,t])=>[e,t.label]),"klassisch")}
            ${e.select("Farbe","fan_color_mode",[["neutral","Schwarz/Weiß (wie die Schrift)"],["modus","Nach Modus: Heizen rot, Kühlen blau"]],"neutral")}
            <small>Die Färbung nach Modus braucht einen erkannten Betriebsmodus.</small>
          `)}
        ${qi("Lüfter — Position",I`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Breite","fan_size",5,80,"%",.5)}
            ${e.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          `)}
      `:F}
  ${e.shown("show_mode",!1)?I`
        ${e.entity("Betriebsmodus — Entity","mode_entity","sensor, select, input_select oder climate — liefert den Modus der Wärmepumpe.",...sn)}
        ${e.text("Attribut (optional)","mode_attribute","Leer = Zustand der Entity. Bei climate.* z.B. preset_mode.","z.B. preset_mode")}
        ${qi("Betriebsmodus — Anzeige auf der Card",I`
            ${e.toggle("Modus als Badge anzeigen","show_mode_badge",!0)}
            ${e.slider("Von oben","mode_top",0,100,"%",.5)}
            ${e.slider("Von links","mode_left",0,100,"%",.5)}
            ${e.slider("Größe","mode_scale",50,200)}
            <small>
              Klartext wie Heizen, Kühlen, Auto, Aus — bei climate.* mit Preset (z.B.
              Heizen · Eco). Unbekannte Werte erscheinen unübersetzt. Farbe wie das Rad.
            </small>
          `)}
        ${qi("Betriebsmodus — Tempo je Modus",I`
            ${St.map(t=>e.slider(t.label,`mode_speed_${t.key}`,1,$t,"",1))}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${pn(e)}
      `:F}
  ${e.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Wärmepumpe")}
  ${qi("Freitext — Darstellung",I`
      ${e.slider("Von oben","label_top",0,100)}
      ${e.slider("Von links","label_left",0,100)}
      ${e.slider("Größe","label_scale",50,200)}
      ${e.toggle("Box anzeigen","label_box",!0)}
    `)}
`)(i);case"pump":return(e=>I`
  ${Ji(I`
    ${e.element("🎚 Stufen-Taster","show_stages",["stage_mode","stage_entities","stop_entity","stage_labels"])}
    ${e.element("⏻ Powerbutton","show_power_button",["main_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label","stage_from_power","stage_watt_1","stage_watt_2","stage_watt_3"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("🌀 Laufrad","show_fan",["fan_top","fan_left","fan_size","fan_speed_1","fan_speed_2","fan_speed_3","fan_inactive","idle_watt"])}
  `)}
  ${e.text("Überschrift (optional)","label","","z.B. Poolpumpe")}
  ${e.shown("show_power_button")?I`
        ${e.entity("Hauptschalter","main_entity","Steckdose/Relais der Pumpe — Powerbutton.",...en)}
        ${on(e)}
      `:F}
  ${e.shown("show_stages")?I`
        ${e.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrückt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
        ${e.entityAt("Stufe 1 (N1)","stage_entities",0,"",...en)}
        ${e.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"",...en)}
        ${e.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"",...en)}
        ${e.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.",...en)}
      `:F}
  ${e.shown("show_power_button")?I`
        ${qi("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...tn)}
        ${qi("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
        ${e.raw("power_entity")?qi("Stufe aus Leistung erkennen",I`
                ${e.toggle("Stufe aus Leistung erkennen","stage_from_power",!0)}
                ${!1!==e.val("stage_from_power")?I`
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
  ${e.shown("show_temp")?I`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...nn)}
        ${qi("Thermometer — Position",I`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_fan")?I`
        ${qi("Laufrad — Tempo",I`
            ${e.slider("Tempo N1","fan_speed_1",1,$t,"",1)}
            ${e.slider("Tempo N2","fan_speed_2",1,$t,"",1)}
            ${e.slider("Tempo N3","fan_speed_3",1,$t,"",1)}
            <small>Links langsam, rechts schnell (1–10, ohne Einheit).</small>
          `,!0)}
        ${qi("Laufrad — Position",I`
            ${e.slider("Von oben","fan_top",0,100,"%",.5)}
            ${e.slider("Von links","fan_left",0,100,"%",.5)}
            ${e.slider("Größe","fan_size",3,60,"%",.5)}
            ${e.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
            <small>Das Laufrad bleibt immer kreisrund.</small>
          `)}
        ${qi("Wann steht die Pumpe?",I`
            ${e.slider("Ruhewatt","idle_watt",0,200," W",1)}
            <small>Unter diesem Verbrauch gilt die Pumpe als stehend (Laufrad grau).
              Bei „Stufe aus Leistung erkennen" gilt stattdessen die N1-Schwelle.</small>
          `)}
      `:F}
`)(i);case"uv":return(e=>I`
  ${Ji(I`
    ${e.element("⏻ Powerbutton","show_power_button",["switch_entity","confirm_off","power_btn_top","power_btn_left","power_btn_scale"])}
    ${e.element("⚡ Stromverbrauch","show_power",["power_entity","power_bottom","power_left","power_scale","power_box","power_label"])}
    ${e.element("🌡 Temperatur","show_temp",["temp_entity","temp_top","temp_left","temp_scale"])}
    ${e.element("💡 Glüheffekt","show_glow",["glow_top","glow_left","glow_size","glow_thickness","glow_angle","glow_intensity","glow_pulse"])}
  `)}
  <small>Die UV-Lampe läuft üblicherweise per Zeitschaltuhr parallel zur Poolpumpe.</small>
  ${e.text("Überschrift (optional)","label","","z.B. UV-C-Lampe")}
  ${e.shown("show_power_button")?I`
        ${e.entity("Powerbutton — Schalter","switch_entity","Steckdose/Relais der Lampe.",...en)}
        ${on(e)}
        ${qi("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","W oder kW.",...tn)}
        ${qi("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_temp")?I`
        ${e.entity("Temperaturfühler","temp_entity","Zeigt das Thermometer.",...nn)}
        ${qi("Thermometer — Position",I`
            ${e.slider("Von oben","temp_top",0,100)}
            ${e.slider("Von links","temp_left",0,100)}
            ${e.slider("Größe","temp_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_glow")?qi("Glüheffekt — Lage auf dem Rohr",I`
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
  ${qi("Bild — Drehen, Spiegeln, Größe, Anschlussvariante",I`
      ${e.slider("Drehen","rotate",0,359,"°",1)}
      ${e.toggle("Waagrecht spiegeln","mirror",!1)}
      ${e.slider("Größe","uv_size",30,Fe)}
      ${e.select("Anschlussvariante","anschluss",[["seite","Anschlussvariante 1"],["oben","Anschlussvariante 2"]],"seite")}
      <small>
        Gedreht wird das Bild samt Glühen; Thermometer, Watt-Box und Powerbutton bleiben
        aufrecht. Der Kasten bleibt in jeder Lage gleich groß — das gedrehte Bild wird so
        weit verkleinert, dass es hineinpasst. 100 % Größe ist genau das; kleiner stellt das
        Bild zusätzlich ein Stück zurück, ohne dass etwas herausragen kann.
      </small>
    `)}
`)(i);case"solar":return(e=>I`
  ${Ji(I`
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
        ${e.entity("Powerbutton — Ventil oder Pumpe","switch_entity","Solarventil oder Solarpumpe.",...en)}
        ${on(e)}
      `:F}
  ${e.entity("Läuft gerade? (optional)","active_entity","Z.B. Ventil-Rückmeldung „AN“: an = Wasser läuft übers Feld. Bestimmt den Zustand in der Mini-Ansicht; ohne Angabe zählt der Schalter.","binary_sensor","switch","input_boolean","sensor")}
  ${e.shown("show_power_button")?I`
        ${qi("Powerbutton — Position",I`
            ${e.slider("Von oben","power_btn_top",0,100)}
            ${e.slider("Von links","power_btn_left",0,100)}
            ${e.slider("Größe","power_btn_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_temp_in")?I`
        ${e.entity("Vorlauf-Temperatur","temp_in_entity","Wasser, das zum Absorber läuft — Zulauf links unten (blauer Pfeil).",...nn)}
        ${qi("Vorlauf — Position",I`
            ${e.slider("Von oben","temp_in_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_in_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_in_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_temp_out")?I`
        ${e.entity("Rücklauf-Temperatur","temp_out_entity","Wasser, das zurück ins Becken läuft — Ablauf rechts oben (roter Pfeil).",...nn)}
        ${qi("Rücklauf — Position",I`
            ${e.slider("Von oben","temp_out_top",0,100,"%",.5)}
            ${e.slider("Von links","temp_out_left",0,100,"%",.5)}
            ${e.slider("Größe","temp_out_scale",50,200)}
          `)}
      `:F}
  ${e.shown("show_power")?I`
        ${e.entity("Stromverbrauch","power_entity","Solarpumpe in W oder kW.",...tn)}
        ${qi("Stromverbrauch — Darstellung",I`
            ${e.slider("Von unten","power_bottom",0,100)}
            ${e.slider("Von links","power_left",0,100)}
            ${e.slider("Größe","power_scale",50,150)}
            ${e.toggle("Box anzeigen","power_box",!0)}
            ${e.toggle("Einheit anzeigen","power_label",!0)}
          `)}
      `:F}
  ${e.shown("show_arrows")?qi("Richtungspfeile — Lage",I`
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
`)(i);case"custom":return((e,t)=>{const i=Array.isArray(e.config?.entries)?e.config.entries:[],n=di(e.config).length,r=Math.min(8,Math.max(3,i.length+1)),s=hi(e.config);return I`
    ${e.text("Überschrift (optional)","title","","z.B. Wetter")}
    ${e.select("Darstellung","layout",[["klassisch","Klassisch (mittig gestapelt)"],["liste","Liste (Zeilen mit Schalter, wie HA-Entities)"],["kacheln","Kacheln (2 Spalten)"]],oi)}
    ${e.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"klassisch"===s?"mitte":"oben")}
    ${n>8?I`<div class="limit-warnung" role="alert">
          ⚠ ${n} Einträge eingetragen — der Kasten zeigt höchstens ${8}.
          Einträge ${9}–${n} werden ausgeblendet. Bitte entfernen oder
          auf einen zweiten Kasten verteilen.
        </div>`:F}
    ${"liste"===s&&n>4?I`<small class="limit-hinweis">
          Ab 5 Zeilen wird der Kasten höher als eine Standard-Karte (Titel + 4 Zeilen).
        </small>`:F}
    ${Array.from({length:r},(e,i)=>qi(`Eintrag ${i+1}`,t(i),0===i))}
    <small>Bis zu ${8} Einträge. Leere Einträge werden nicht angezeigt.</small>
  `})(i,i=>(e=>I`
  ${e.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===e.config?.kind?e.text("Text","text","","z.B. Sommerbetrieb"):I`
        ${e.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","input_number","number","climate")}
        ${e.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===e.config?.kind?e.icon("Icon (optional)","icon"):F}
        ${"button"===e.config?.kind?on(e,!1,"An = vor dem Ausschalten kommt eine Rückfrage."):F}
      `}
`)(new Xi({hass:this.hass,config:(Array.isArray(t.entries)?t.entries:[])[i]||{},update:t=>this._updateEntry(e,i,t),idPrefix:`slot${e}e${i}`,stash:this._stash})));case"hidden":return I`<small>Dieser Slot wird nicht angezeigt; die anderen rücken nach.</small>`;default:return(e=>I`
  ${e.text("Überschrift (optional)","title","","z.B. Platzhalter")}
  ${e.text("Hinweistext (optional)","hint","","")}
`)(i)}}render(){if(!this._config)return F;const e=this._config.hero||{},t=this._config.frame||{},i=new Xi({hass:this.hass,config:e,defaults:{...ut(e.shape),...Object.fromEntries(Object.values(Se).flatMap(t=>{const i=ht(e,t,"voll");return[[`mini_${t.anker}_top`,i.top],[`mini_${t.anker}_left`,i.left],[`mini_${t.anker}_size`,i.breite]]}))},update:e=>this._updateHero(e),idPrefix:"hero",stash:this._stash});i.teilePos=this._teilePos||gi(this._config),i.setTeilePos=e=>{this._teilePos=e,this.requestUpdate()};const n=new Xi({hass:this.hass,config:t,update:e=>this._updateFrame(e),idPrefix:"frame",stash:this._stash}),r=this._slots();return I`
      <div class="editor">
        <div class="kopf-reihe">${this._renderAnsicht()} ${this._renderKiosk()}</div>
        <div class="step-head">Schritt 1 — Becken</div>
        <div class="slot-block becken-block" style="--slot-farbe:${Ne("hero")};">
          <div class="slot-ueberschrift">Becken</div>
          <div class="slot-card becken-card">
            ${i.toggle("Becken anzeigen","enabled",!0)}
            ${!1===e.enabled?F:this._renderMiniWahl(e,"hero",e=>this._updateHero(e))}
            ${!1===e.enabled?F:cn(i)}
          </div>
        </div>

        <div class="step-head">Schritt 2 — Geräte</div>
        ${r.map((e,t)=>I`
            <div class="slot-block" style="--slot-farbe:${Ne(e.type)};">
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
                      ${Ve().map(t=>t.trenner?I`<option disabled data-trenner>${t.label}</option>`:I`
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
                ${this._renderMiniWahl(e,e.type,e=>this._updateSlot(t,e))}
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
    `}static styles=[Yi]}customElements.define("tomtut-pool-dashboard-editor",fn),
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
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kästen für Wärmepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration nötig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{mi as ANSICHTEN,fi as ANSICHT_DEFAULT,Ce as ASSET_VERSION,ye as BECKEN_RATIOS,Ke as BLOCK_FARBEN,ai as CUSTOM_LAYOUTS,oi as CUSTOM_LAYOUT_DEFAULT,si as CUSTOM_MAX_ENTRIES,ze as DEVICE_IMAGES,Ee as DEVICE_RATIOS,Ae as DEVICE_VARIANTS,Je as FAN_DESIGNS,Ye as FAN_DESIGN_DEFAULT,Be as FLOW_MARKERS,Zt as GLOW_PULSE_MAX,Fe as GROESSE_MAX,je as GROESSE_MIN,zt as HEATPUMP_DEFAULTS,pt as HERO_DEFAULTS,Se as HERO_SPRITES,St as HP_MODES,at as INLET_TEMP_VERSATZ,ft as KIOSK_BECKEN,$i as MINI_CARD_FILLS,wi as MINI_KACHEL_FILLS,bi as MINI_LEER,yi as MINI_MAX_SPALTEN,_i as MINI_TYPEN,Mi as MINI_WERTE,Li as MINI_WERTE_EMPFOHLEN,Ti as MINI_WERT_NAMEN,At as MODE_FARBEN,Ot as MODE_WOERTER,wt as PUMP_DEFAULTS,ve as SHAPES,Oe as SLOT_GRAU,We as SLOT_TYPES,Re as SLOT_TYPE_GROUPS,qt as SOLAR_DEFAULTS,lt as TEIL_GROESSE_MAX,ot as TEIL_GROESSE_MIN,Qi as TomtutPoolDashboardCard,fn as TomtutPoolDashboardEditor,Ut as UV_DEFAULTS,gi as ansichtVon,mn as applyPatch,Ue as bildTransform,di as customEintraege,hi as customLayout,kt as fanDuration,Qt as glowPulsWerte,Ge as groesseFaktor,ut as heroDefaultsFor,Me as imagePath,Pi as kachelName,bt as kioskGilt,_t as kioskSchluessel,jt as klimaAus,It as klimaEntity,Di as miniBecken,ki as miniCardFill,ji as miniDichte,Vi as miniKachel,vi as miniKachelFill,Ni as miniSichtbar,xi as miniSpalten,Ki as miniWahl,Ct as modeAuto,Vt as modeBadge,Wt as modeFromState,Rt as modeWort,Lt as modusName,Ht as modusWahl,De as normGrad,he as numOf,be as numText,Tt as optionZuordnung,Ie as passFaktor,me as seit,fe as seitMinuten,xe as shapeRatio,Ne as slotFarbe,Ve as slotTypeOptions,Jt as solarAktiv,Yt as solarZustand,vt as stageFromWatt,ht as teilLage,ue as toWatt};
