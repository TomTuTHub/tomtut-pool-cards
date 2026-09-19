const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const n=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:d}=Object,u=globalThis,f=u.trustedTypes,g=f?f.emptyScript:"",m=u.reactiveElementPolyfillSupport,_=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},$=(t,e)=>!a(t,e),y={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:$};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=y){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const n=s?.call(this);r?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??y}static _$Ei(){if(this.hasOwnProperty(_("elementProperties")))return;const t=d(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(_("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(_("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=s;const n=r.fromAttribute(e,t.type);this[s]=n??this._$Ej?.get(s)??n,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const n=this.constructor;if(!1===s&&(r=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??$)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==r||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[_("elementProperties")]=new Map,v[_("finalized")]=new Map,m?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,x=t=>t,S=w.trustedTypes,k=S?S.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+E,C=`<${z}>`,P=document,T=()=>P.createComment(""),B=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,O="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,M=/-->/g,L=/>/g,H=RegExp(`>|${O}(?:([^\\s"'>=/]+)(${O}*=${O}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,W=/"/g,D=/^(?:script|style|textarea|title)$/i,V=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),I=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,G=P.createTreeWalker(P,129);function Q(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==k?k.createHTML(e):e}const Z=(t,e)=>{const i=t.length-1,s=[];let r,n=2===e?"<svg>":3===e?"<math>":"",o=U;for(let e=0;e<i;e++){const i=t[e];let a,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===U?"!--"===l[1]?o=M:void 0!==l[1]?o=L:void 0!==l[2]?(D.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=H):void 0!==l[3]&&(o=H):o===H?">"===l[0]?(o=r??U,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?H:'"'===l[3]?W:R):o===W||o===R?o=H:o===M||o===L?o=U:(o=H,r=void 0);const p=o===H&&t[e+1].startsWith("/>")?" ":"";n+=o===U?i+C:c>=0?(s.push(a),i.slice(0,c)+A+i.slice(c)+E+p):i+E+(-2===c?e:p)}return[Q(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class K{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,n=0;const o=t.length-1,a=this.parts,[l,c]=Z(t,e);if(this.el=K.createElement(l,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=G.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(A)){const e=c[n++],i=s.getAttribute(t).split(E),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Y}),s.removeAttribute(t)}else t.startsWith(E)&&(a.push({type:6,index:r}),s.removeAttribute(t));if(D.test(s.tagName)){const t=s.textContent.split(E),e=t.length-1;if(e>0){s.textContent=S?S.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],T()),G.nextNode(),a.push({type:2,index:++r});s.append(t[e],T())}}}else if(8===s.nodeType)if(s.data===z)a.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(E,t+1));)a.push({type:7,index:r}),t+=E.length-1}r++}}static createElement(t,e){const i=P.createElement("template");return i.innerHTML=t,i}}function q(t,e,i=t,s){if(e===I)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const n=B(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),void 0===n?r=void 0:(r=new n(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=q(t,r._$AS(t,e.values),r,s)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??P).importNode(e,!0);G.currentNode=s;let r=G.nextNode(),n=0,o=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new J(r,r.nextSibling,this,t):1===a.type?e=new a.ctor(r,a.name,a.strings,this,t):6===a.type&&(e=new st(r,this,t)),this._$AV.push(e),a=i[++o]}n!==a?.index&&(r=G.nextNode(),n++)}return G.currentNode=P,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=q(this,t,e),B(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&B(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=K.createElement(Q(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new X(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new K(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new J(this.O(T()),this.O(T()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=x(t).nextSibling;x(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Y{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,s){const r=this.strings;let n=!1;if(void 0===r)t=q(this,t,e,0),n=!B(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const s=t;let o,a;for(t=r[0],o=0;o<r.length-1;o++)a=q(this,s[i+o],e,o),a===I&&(a=this._$AH[o]),n||=!B(a)||a!==this._$AH[o],a===j?t=j:t!==j&&(t+=(a??"")+r[o+1]),this._$AH[o]=a}n&&!s&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class et extends Y{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class it extends Y{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=q(this,t,e,0)??j)===I)return;const i=this._$AH,s=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==j&&(i===j||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){q(this,t)}}const rt=w.litHtmlPolyfillSupport;rt?.(K,J),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;class ot extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new J(e.insertBefore(T(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}}ot._$litElement$=!0,ot.finalized=!0,nt.litElementHydrateSupport?.({LitElement:ot});const at=nt.litElementPolyfillSupport;at?.({LitElement:ot}),(nt.litElementVersions??=[]).push("4.2.2");const lt=["on","true","heat","cool","heating","cooling","auto","dry","fan_only","open","home","playing"],ct=t=>lt.includes(String(t).toLowerCase()),ht=(t,e=0)=>{const i=Number(t);return isFinite(i)?i.toFixed(e).replace(".",","):"—"},pt=(t,e=Date.now())=>{if(!t)return"";const i=Date.parse(t);if(isNaN(i))return"";const s=Math.max(0,(e-i)/1e3);if(s<60)return`seit ${Math.floor(s)} Sek`;const r=s/60;if(r<60)return`seit ${Math.floor(r)} Min`;const n=r/60;if(n<24)return`seit ${Math.floor(n)} Std`;const o=Math.floor(n/24);return o<=1?"seit 1 Tag":`seit ${o} Tagen`},dt=t=>String(t||"").split(".")[0],ut=(t,e)=>t?.attributes?.friendly_name||String(e||"").split(".")[1]||String(e||""),ft=t=>{if(!t)return"—";const e=t.attributes?.unit_of_measurement,i=parseFloat(t.state);if(!isNaN(i)&&""!==String(t.state).trim()){const t=Math.abs(i)>=100||Number.isInteger(i)?0:1;return ht(i,t)+(e?" "+e:"")}return String(t.state)+(e?" "+e:"")};class gt extends ot{static properties={hass:{attribute:!1},config:{attribute:!1},frame:{attribute:!1},_confirmOpen:{state:!0}};constructor(){super(),this.config={},this.frame={enabled:!0,fill:"transparent"},this._confirmOpen=!1}get defaults(){return{}}_v(t){const e=this.config?.[t];return null==e||""===e?this.defaults[t]:e}_ent(t){return t?this.hass?.states?.[t]:void 0}_isOn(t){const e=this._ent(t);return!!e&&ct(e.state)}_watt(t){return(t=>{if(!t)return null;const e=parseFloat(t.state);return isNaN(e)?null:"kw"===String(t.attributes?.unit_of_measurement||"W").toLowerCase()?1e3*e:e})(this._ent(t))}_call(t,e,i={}){t&&this.hass&&this.hass.callService(dt(t),e,{entity_id:t,...i})}_moreInfo(t){const e=t?.currentTarget?.dataset?.entity;e&&(t.stopPropagation(),this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:e},bubbles:!0,composed:!0})))}get _frameClasses(){const t=this.frame||{},e=["transparent","weiss","schwarz"].includes(t.fill)?t.fill:"transparent";return`slot ${!1===t.enabled?"":"framed"} fill-${e}`}renderSlot(t){return V`<div class="${this._frameClasses}">${t}</div>`}renderFan({active:t,top:e,left:i,size:s,ratio:r,dur:n,color:o,inactive:a}){return V`
      <div
        class="fan-overlay ${t?"spinning":"hidden"===a?"hidden":"idle"}"
        style="top:${e}%; left:${i}%; width:${s}%; --fan-dur:${n}s; --fan-color:${"white"===o?"#ffffff":"#111111"}; --fan-ratio:${r};"
      >
        <svg viewBox="0 0 40 40" preserveAspectRatio="none">
          <g .innerHTML="${'<circle cx="20" cy="20" r="3" fill="currentColor"/><path d="M20,17 Q20,6 12,6 Q4,6 6,14 Q8,17 20,17 Z" fill="currentColor" opacity="0.85"/><path d="M23,20 Q34,20 34,12 Q34,4 26,6 Q23,8 23,20 Z" fill="currentColor" opacity="0.85"/><path d="M20,23 Q20,34 28,34 Q36,34 34,26 Q32,23 20,23 Z" fill="currentColor" opacity="0.85"/><path d="M17,20 Q6,20 6,28 Q6,36 14,34 Q17,32 17,20 Z" fill="currentColor" opacity="0.85"/>'}"></g>
        </svg>
      </div>
    `}renderPowerButton({on:t,top:e,left:i,scale:s}){return V`
      <div
        class="power-badge ${t?"on":"off"}"
        style="top:${e}%; left:${i}%; transform:scale(${(s??100)/100});"
        title="${t?"Ausschalten (mit Rueckfrage)":"Einschalten"}"
        @click="${this._onPowerClick}"
      >
        <ha-icon icon="mdi:power"></ha-icon>
      </div>
    `}renderValueBox({value:t,unit:e,top:i,bottom:s,left:r,scale:n,box:o,color:a,entity:l}){return V`
      <div
        class="value-box ${!1===o?"no-bg":""}"
        style="${void 0===s?`top:${i}%;`:`bottom:${s}%;`} left:${r}%; transform:translateX(-50%) scale(${(n??100)/100}); --val-color:${"black"===a?"#111":"#fff"};"
        data-entity="${l||""}"
        @click="${this._moreInfo}"
      >
        <span class="val">${t}</span>
        ${e?V`<span class="unit">${e}</span>`:j}
      </div>
    `}renderThermo({value:t,top:e,left:i,scale:s,entity:r}){return V`
      <div
        class="thermo"
        style="top:${e}%; left:${i}%; --thermo-size:${(s??100)/100*3.6}em;"
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
        ${t?V`<span class="thermo-val">${t}</span>`:j}
      </div>
    `}get powerEntityId(){return null}get powerConfirmText(){return"Das Geraet wird hart vom Netz getrennt. Wirklich ausschalten?"}_onPowerClick(t){t?.stopPropagation();const e=this.powerEntityId;e&&(this._isOn(e)?this._confirmOpen=!0:this._call(e,"turn_on"))}_confirmOff(t){t?.stopPropagation(),this._confirmOpen=!1,this._call(this.powerEntityId,"turn_off")}_cancelOff(t){t?.stopPropagation(),this._confirmOpen=!1}renderConfirm(t="Wirklich stromlos schalten?"){return this._confirmOpen?V`
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
    `:j}wattText(t,e=0){const i=this._watt(t);return null===i?"—":ht(i,e)}}const mt=n`
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
    color: var(--tt-fg);
    --tt-fg: var(--primary-text-color, #111);
    --tt-line: rgba(0, 0, 0, 0.55);
    --tt-soft: rgba(0, 0, 0, 0.08);
  }
  .slot.fill-weiss {
    background: #ffffff;
    --tt-fg: #111111;
    --tt-line: rgba(0, 0, 0, 0.55);
    --tt-soft: rgba(0, 0, 0, 0.08);
  }
  .slot.fill-schwarz {
    background: #1e1e1e;
    --tt-fg: #ffffff;
    --tt-line: rgba(255, 255, 255, 0.45);
    --tt-soft: rgba(255, 255, 255, 0.12);
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
  }
`,_t=n`
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

  /* Drehendes Rad (Luefter / Laufrad) */
  .fan-overlay {
    position: absolute;
    aspect-ratio: 1 / var(--fan-ratio, 1);
    pointer-events: none;
    transform: translate(-50%, -50%);
    color: var(--fan-color, #111);
    opacity: 0.3;
    filter: grayscale(1);
    transition: opacity 0.3s, filter 0.3s;
  }
  .fan-overlay svg {
    width: 100%;
    height: 100%;
    overflow: visible;
  }
  .fan-overlay svg g {
    transform-box: fill-box;
    transform-origin: center;
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
    background: rgba(0, 0, 0, 0.45);
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
    background: rgba(0, 0, 0, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.15);
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
  }
  .val {
    font-size: 1.4em;
    font-weight: 700;
    color: var(--val-color, #fff);
    white-space: nowrap;
  }
  .unit {
    font-size: 0.8em;
    font-weight: 600;
    color: var(--val-color, #fff);
    opacity: 0.7;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 2px;
  }

  /* Freitext-Badge */
  .label-badge {
    position: absolute;
    padding: 0.15em 0.55em;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 0.3em;
    font-size: 0.8em;
    font-weight: 700;
    color: #fff;
    letter-spacing: 0.5px;
    line-height: 1.3;
    pointer-events: none;
    white-space: nowrap;
    z-index: 5;
  }
  .label-badge.no-bg {
    background: none;
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
    background: var(--thermo-bg, rgba(255, 255, 255, 0.92));
    color: var(--thermo-fg, #111);
    border: 1px solid rgba(0, 0, 0, 0.35);
  }

  /* pH-/RX-Kaestchen auf der Beckenwand */
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
    background: var(--thermo-bg, rgba(255, 255, 255, 0.92));
    color: var(--thermo-fg, #111);
    border: 1.5px solid rgba(0, 0, 0, 0.6);
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

  /* Bestaetigungs-Dialog */
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
`,bt={oval:{label:"Oval",file:"poolbecken_oval.png",thermo:{left:32.5,top:24.3},ph:{left:27.8,top:68.6},rx:{left:53.7,top:68.6},drain:{left:87.4,top:51.2}},rechteck:{label:"Rechteck",file:"poolbecken_rechteck.png",thermo:{left:31.3,top:28.8},ph:{left:26.1,top:73},rx:{left:54.4,top:73},drain:{left:91.2,top:59.2}},achtform:{label:"Achtform",file:"poolbecken_achtform.png",thermo:{left:30.8,top:26.9},ph:{left:25.7,top:71.7},rx:{left:53.9,top:71.7},drain:{left:90.7,top:59.2}},rund:{label:"Rund",file:"poolbecken_rund.png",thermo:{left:31.8,top:24.9},ph:{left:26.9,top:71},rx:{left:53.9,top:71},drain:{left:89.2,top:55.3}},niere:{label:"Nierenform",file:"poolbecken_nierenform.png",thermo:{left:32.1,top:28.8},ph:{left:27.2,top:69.7},rx:{left:54.2,top:69.7},drain:{left:89.4,top:54.5}},freiform:{label:"Freiform",file:"poolbecken_freiform.png",thermo:{left:31.7,top:27.9},ph:{left:26.4,top:74.3},rx:{left:55.3,top:74.3},drain:{left:92.9,top:61.9}}},$t="oval",yt={heatpump:{transparent:"waermepumpe_transparent.png",weiss:"waermepumpe_weiss.png",schwarz:"waermepumpe_schwarz.png"},pump:{transparent:"poolpumpe_transparent.png",weiss:"poolpumpe_weiss.png",schwarz:"poolpumpe_schwarz.png"}},vt=t=>"/local/community/tomtut-pool-cards/"+t,wt=(t,e={})=>{if(e.image_url)return e.image_url;const i=yt[t]||{},s=e.image_variant||"transparent";return vt(i[s]||i.transparent||"")},xt={heatpump:{label:"Waermepumpe",ready:!0},pump:{label:"Poolpumpe",ready:!0},custom:{label:"Werte / Buttons",ready:!0},frame:{label:"Leerer Rahmen",ready:!0},hidden:{label:"Ausgeblendet",ready:!0},uv:{label:"UV-C-Lampe",ready:!1,hint:"UV-C-Lampe folgt in einer spaeteren Version."},solar:{label:"Solarheizung",ready:!1,hint:"Solarheizung folgt in einer spaeteren Version."},inlet:{label:"Einlaufduese",ready:!1,hint:"Einlaufduese folgt in einer spaeteren Version."}},St={thermo_scale:100,box_color:"weiss"};class kt extends gt{get defaults(){return St}get shape(){return t=this.config?.shape,bt[String(t||"").toLowerCase()]||bt[$t];var t}_anchor(t,e){const i=`${t}_${e}`,s=this.config?.[i];return null!=s&&""!==s?Number(s):this.shape[t]?.[e]??50}render(){const t=this.config||{},e=this.shape,i=!0===t.framed,s="schwarz"===this._v("box_color"),r=V`
      <div class="img-wrap" style="${s?"--thermo-bg:rgba(30,30,30,0.9); --thermo-fg:#fff;":"--thermo-bg:rgba(255,255,255,0.92); --thermo-fg:#111;"}">
        <img src="${vt(e.file)}" alt="Pool ${e.label}" />

        ${t.temp_entity?this.renderThermo({value:ft(this._ent(t.temp_entity)),top:this._anchor("thermo","top"),left:this._anchor("thermo","left"),scale:this._v("thermo_scale"),entity:t.temp_entity}):j}
        ${t.ph_entity?this._chemBox("pH",t.ph_entity,this._anchor("ph","top"),this._anchor("ph","left")):j}
        ${t.rx_entity?this._chemBox("RX",t.rx_entity,this._anchor("rx","top"),this._anchor("rx","left")):j}
        ${t.label_text?V`<div
              class="label-badge"
              style="top:${t.label_top??3}%; left:${t.label_left??50}%; transform:translateX(-50%);"
            >
              ${t.label_text}
            </div>`:j}
      </div>
    `;return i?this.renderSlot(r):V`<div class="slot bare">${r}</div>`}_chemBox(t,e,i,s){const r=this._ent(e);return V`
      <div
        class="chem-box"
        style="top:${i}%; left:${s}%;"
        data-entity="${e}"
        @click="${this._moreInfo}"
      >
        <span class="chem-key">${t}</span>
        <span class="chem-val">${ft(r)}</span>
      </div>
    `}static styles=[mt,_t,n`
      .slot.bare {
        border: none;
        background: none;
        padding: 0;
      }
    `]}customElements.define("tomtut-pool-hero",kt);const At={fan_top:50,fan_left:26,fan_size:42,fan_ratio:1.14,fan_speed:60,fan_color:"black",fan_inactive:"gray",fan_power_threshold:100,power_btn_top:20,power_btn_left:54,power_btn_scale:100,power_top:20,power_left:74,power_scale:95,power_box:!0,power_color:"white",power_label:!0,power_decimals:0,current_bottom:40,current_left:70,current_scale:100,current_box:!0,current_color:"white",current_label:!0,target_bottom:16,target_left:70,target_scale:100,target_box:!0,target_color:"white",target_label:!0,target_step:.5,label_top:4,label_left:50,label_scale:100,label_box:!0,label_color:"white"},Et=(t={})=>!!(t.switch_entity||t.power_entity||t.target_entity||t.current_entity);class zt extends gt{get defaults(){return At}get powerEntityId(){return this.config?.switch_entity||null}get powerConfirmText(){return"Eine laufende Waermepumpe sollte erst am Geraet bzw. ueber den Betriebsmodus\n      ausgeschaltet werden — nicht einfach den Stecker ziehen! Hartes Trennen im Betrieb\n      kann Kompressor und Elektronik schaden."}get _target(){const t=this.config.target_entity,e=this._ent(t);if(!e)return null;const i=String(t).startsWith("climate."),s=i?e.attributes?.temperature:parseFloat(e.state);if(null==s||isNaN(s))return null;const r=e.attributes||{};return{climate:i,value:Number(s),min:i?r.min_temp??5:r.min??5,max:i?r.max_temp??40:r.max??40,step:this.config.target_step??(i?r.target_temp_step??.5:r.step??.5),unit:i?this.hass?.config?.unit_system?.temperature??"°C":r.unit_of_measurement??"°C"}}get _current(){const t=this.config.current_entity,e=this._ent(t);if(!e)return null;const i=String(t).startsWith("climate."),s=i?e.attributes?.current_temperature:parseFloat(e.state);return null==s||isNaN(s)?null:{value:Number(s),unit:i?this.hass?.config?.unit_system?.temperature??"°C":e.attributes?.unit_of_measurement??"°C"}}get _fanActive(){const t=this.config.fan_source??"auto",e=this._ent(this.config.fan_entity);if("power"!==t&&e){const t=String(e.state).toLowerCase();if(ct(t))return!0;const i=parseFloat(t);return!isNaN(i)&&i>0}if("entity"===t)return!1;const i=this._watt(this.config.power_entity);return null!==i&&i>=Number(this._v("fan_power_threshold"))}_stepTarget(t){const e=this._target;if(!e||!this.hass)return;let i=Math.round((e.value+t*e.step)/e.step)*e.step;i=Math.min(e.max,Math.max(e.min,i)),i=Math.round(100*i)/100,i!==e.value&&(e.climate?this.hass.callService("climate","set_temperature",{entity_id:this.config.target_entity,temperature:i}):this.hass.callService("number","set_value",{entity_id:this.config.target_entity,value:i}))}_targetUp(t){t?.stopPropagation(),this._stepTarget(1)}_targetDown(t){t?.stopPropagation(),this._stepTarget(-1)}render(){const t=this.config||{};if(!this.hass)return this.renderSlot(j);if(!Et(t))return this.renderSlot(V`<p class="slot-hint">
          Waermepumpe: bitte mindestens eine Entity waehlen (Schalter, Leistung, Soll oder Ist).
        </p>`);const e=!1!==t.show_fan,i=!1!==t.show_power_button&&!!t.switch_entity,s=!1!==t.show_power&&!!t.power_entity,r=!1!==t.show_target&&!!t.target_entity,n=!1!==t.show_current&&!!t.current_entity,o=t.label_text||"",a=Number(this._v("fan_speed"))||0,l=a<=0?0:Math.max(.2,4-a/100*3.6),c=this._target,h=this._current;return this.renderSlot(V`
      <div class="img-wrap">
        <img src="${wt("heatpump",t)}" alt="Waermepumpe" />

        ${e?this.renderFan({active:this._fanActive,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:l,color:this._v("fan_color"),inactive:this._v("fan_inactive")}):j}
        ${i?this.renderPowerButton({on:this._isOn(t.switch_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):j}
        ${s?this.renderValueBox({value:this.wattText(t.power_entity,Number(this._v("power_decimals"))||0),unit:!1===this._v("power_label")?"":"Watt",top:this._v("power_top"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),color:this._v("power_color"),entity:t.power_entity}):j}
        ${n?this.renderValueBox({value:null===h?"—":ht(h.value,1)+" "+h.unit,unit:!1===this._v("current_label")?"":"Ist",bottom:this._v("current_bottom"),left:this._v("current_left"),scale:this._v("current_scale"),box:this._v("current_box"),color:this._v("current_color"),entity:t.current_entity}):j}
        ${r?V`
              <div
                class="value-box target ${!1===this._v("target_box")?"no-bg":""}"
                style="bottom:${this._v("target_bottom")}%; left:${this._v("target_left")}%; transform:translateX(-50%) scale(${(this._v("target_scale")??100)/100}); --val-color:${"black"===this._v("target_color")?"#111":"#fff"};"
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
                      >${null===c?"—":ht(c.value,1)+" "+c.unit}</span
                    >
                    ${!1===this._v("target_label")?j:V`<span class="unit">Soll</span>`}
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
            `:j}
        ${o?V`
              <div
                class="label-badge ${!1===this._v("label_box")?"no-bg":""}"
                style="top:${this._v("label_top")}%; left:${this._v("label_left")}%; transform:translateX(-50%) scale(${(this._v("label_scale")??100)/100}); color:${"black"===this._v("label_color")?"#111":"#fff"};"
              >
                ${o}
              </div>
            `:j}
        ${this.renderConfirm("Wirklich stromlos schalten?")}
      </div>
    `)}static styles=[mt,_t,n`
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
        background: rgba(255, 255, 255, 0.12);
        color: var(--val-color, #fff);
        border: 1px solid rgba(255, 255, 255, 0.2);
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
        background: rgba(255, 255, 255, 0.24);
      }
      .step:active {
        transform: scale(0.92);
      }
      .step[disabled] {
        opacity: 0.35;
        cursor: not-allowed;
      }
    `]}customElements.define("tomtut-pool-slot-heatpump",zt);const Ct={fan_top:55,fan_left:60,fan_size:18,fan_ratio:2,fan_color:"black",fan_inactive:"gray",fan_dur_1:3,fan_dur_2:1.5,fan_dur_3:.7,power_btn_top:45,power_btn_left:47,power_btn_scale:100,power_bottom:6,power_left:30,power_scale:95,power_box:!0,power_color:"white",power_label:!0,power_decimals:0,temp_top:16,temp_left:86,temp_scale:85,idle_watt:5};class Pt extends gt{static properties={...gt.properties,_tick:{state:!0}};constructor(){super(),this._tick=0,this._optimistic=null}get defaults(){return Ct}connectedCallback(){super.connectedCallback(),this._timer=setInterval(()=>{this._tick=Date.now()},3e4),this._timer&&"function"==typeof this._timer.unref&&this._timer.unref()}disconnectedCallback(){clearInterval(this._timer),this._timer=void 0,super.disconnectedCallback()}get powerEntityId(){return this.config?.main_entity||null}get powerConfirmText(){return"Die Poolpumpe wird hart vom Netz getrennt. Laeuft sie gerade, sollte sie erst\n      ueber STOP bzw. die Stufensteuerung heruntergefahren werden — sonst kann die Anlage\n      Schaden nehmen (Druckschlag, trockenlaufende Gleitringdichtung)."}get stages(){const t=this.config?.stage_entities;return(Array.isArray(t)?t:[]).filter(Boolean).slice(0,3)}get stopEntity(){return this.config?.stop_entity||""}get mode(){return"latching"===this.config?.stage_mode?"latching":"momentary"}get stageLabels(){const t=Array.isArray(this.config?.stage_labels)?this.config.stage_labels:[];return this.stages.map((e,i)=>t[i]||`N${i+1}`)}get blockedByMain(){return!!this.config?.main_entity&&!this._isOn(this.config.main_entity)}_derive(){if("latching"===this.mode){let t=null;if(this.stages.forEach((e,i)=>{const s=this._ent(e);if(!s||!ct(s.state))return;const r=Date.parse(s.last_changed||0)||0;(!t||r>t.t)&&(t={i:i,t:r,since:s.last_changed})}),!t){const t=this._ent(this.stopEntity);return{active:null,stopped:!0,since:t?.last_changed||null}}return{active:t.i,stopped:!1,since:t.since}}const t=this.stages.map((t,e)=>({id:t,i:e}));this.stopEntity&&t.push({id:this.stopEntity,i:-1});let e=null;for(const i of t){const t=this._ent(i.id);if(!t||!t.last_changed)continue;const s=Date.parse(t.last_changed);isNaN(s)||(!e||s>e.t)&&(e={...i,t:s,since:t.last_changed})}return e?-1===e.i?{active:null,stopped:!0,since:e.since}:{active:e.i,stopped:!1,since:e.since}:{active:null,stopped:!1,since:null}}get state(){const t=this._derive(),e=this._optimistic;if(e&&Date.now()-e.t<6e3){if(-1===e.i&&!t.stopped)return{active:null,stopped:!0,since:null};if(e.i>=0&&t.active!==e.i)return{active:e.i,stopped:!1,since:null}}return t}get running(){const t=this.state;if(this.blockedByMain)return!1;if(t.stopped||null===t.active)return!1;const e=Number(this._v("idle_watt")),i=this._watt(this.config?.power_entity);return!(null!==i&&isFinite(e)&&i<e)}_clickStage(t){if(this.blockedByMain)return;const e=this.stages[t];e&&(this._optimistic={i:t,t:Date.now()},this.requestUpdate(),"latching"===this.mode?(this.stages.forEach((e,i)=>{i!==t&&this._call(e,"turn_off")}),this._call(e,"turn_on")):this._call(e,"turn_on"))}_clickStop(){this.blockedByMain||(this._optimistic={i:-1,t:Date.now()},this.requestUpdate(),"latching"===this.mode?this.stages.forEach(t=>this._call(t,"turn_off")):this.stopEntity&&this._call(this.stopEntity,"turn_on"))}get _showStop(){return!!this.stopEntity||"latching"===this.mode}render(){const t=this.config||{};if(!this.hass)return this.renderSlot(j);if(!((t={})=>!!(Array.isArray(t.stage_entities)&&t.stage_entities.filter(Boolean).length||t.main_entity))(t))return this.renderSlot(V`<p class="slot-hint">
          Poolpumpe: bitte mindestens eine Stufen-Entity oder den Hauptschalter waehlen.
        </p>`);const e=this.state,i=this.running,s=["fan_dur_1","fan_dur_2","fan_dur_3"][e.active??0]||"fan_dur_1",r=this._ent(t.temp_entity),n=!1!==t.show_power&&!!t.power_entity,o=!1!==t.show_temp&&!!t.temp_entity,a=!1!==t.show_power_button&&!!t.main_entity;return this.renderSlot(V`
      ${t.label?V`<h3 class="slot-title">${t.label}</h3>`:j}
      <div class="pump">
        <div class="img-wrap">
          <img src="${wt("pump",t)}" alt="Poolpumpe" />
          ${!1===t.show_fan?j:this.renderFan({active:i,top:this._v("fan_top"),left:this._v("fan_left"),size:this._v("fan_size"),ratio:this._v("fan_ratio"),dur:Number(this._v(s))||1.5,color:this._v("fan_color"),inactive:this._v("fan_inactive")})}
          ${a?this.renderPowerButton({on:this._isOn(t.main_entity),top:this._v("power_btn_top"),left:this._v("power_btn_left"),scale:this._v("power_btn_scale")}):j}
          ${n?this.renderValueBox({value:this.wattText(t.power_entity,Number(this._v("power_decimals"))||0),unit:!1===this._v("power_label")?"":"Watt",bottom:this._v("power_bottom"),left:this._v("power_left"),scale:this._v("power_scale"),box:this._v("power_box"),color:this._v("power_color"),entity:t.power_entity}):j}
          ${o?this.renderThermo({value:ft(r),top:this._v("temp_top"),left:this._v("temp_left"),scale:this._v("temp_scale"),entity:t.temp_entity}):j}
          ${this.renderConfirm("Poolpumpe stromlos schalten?")}
        </div>

        <div class="stages ${this.blockedByMain?"disabled":""}">
          ${this.stages.map((t,i)=>V`
              <button
                class="stage-btn ${e.active!==i||e.stopped?"":"active"}"
                @click="${()=>this._clickStage(i)}"
                title="${this.stageLabels[i]}"
              >
                <span class="stage-name">${this.stageLabels[i]}</span>
                ${e.active===i&&!e.stopped&&e.since?V`<span class="stage-since">${pt(e.since)}</span>`:j}
              </button>
            `)}
          ${this._showStop?V`
                <button
                  class="stage-btn stop ${e.stopped?"active":""}"
                  @click="${()=>this._clickStop()}"
                  title="Pumpe stoppen"
                >
                  <span class="stage-name">STOP</span>
                  ${e.stopped&&e.since?V`<span class="stage-since">${pt(e.since)}</span>`:j}
                </button>
              `:j}
        </div>
      </div>
    `)}static styles=[mt,_t,n`
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
    `]}customElements.define("tomtut-pool-slot-pump",Pt);const Tt=["switch","light","input_boolean","fan","siren"];class Bt extends gt{get _entries(){return(Array.isArray(this.config?.entries)?this.config.entries:[]).slice(0,3).filter(t=>t&&(t.entity||t.text||t.label))}get _align(){const t=this.config?.align;return["oben","mitte","unten"].includes(t)?t:"mitte"}_toggle(t){const e=t.entity;if(!e)return;const i=dt(e),s=(Tt.includes(i),"toggle");this._call(e,s)}_renderEntry(t){const e=t.kind||(t.entity?"entity":"text");if("text"===e)return V`<div class="entry text">${t.text||t.label||""}</div>`;const i=this._ent(t.entity);if("button"===e){const e=!!i&&ct(i.state);return V`
        <button class="entry btn-entry ${e?"on":""}" @click="${()=>this._toggle(t)}">
          ${t.icon?V`<ha-icon icon="${t.icon}"></ha-icon>`:j}
          <span>${t.label||ut(i,t.entity)}</span>
        </button>
      `}return V`
      <div class="entry value" data-entity="${t.entity||""}" @click="${this._moreInfo}">
        <span class="entry-label">${t.label||ut(i,t.entity)}</span>
        <span class="entry-value">${ft(i)}</span>
      </div>
    `}render(){const t=this.config||{},e=this._entries;return this.renderSlot(V`
      <div class="custom align-${this._align}">
        ${t.title?V`<h3 class="slot-title">${t.title}</h3>`:j}
        ${e.length?e.map(t=>this._renderEntry(t)):V`<p class="slot-hint">Noch keine Eintraege — im Editor bis zu drei hinzufuegen.</p>`}
      </div>
    `)}static styles=[mt,_t,n`
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
    `]}customElements.define("tomtut-pool-slot-custom",Bt);class Nt extends gt{static properties={...gt.properties,slotType:{attribute:!1}};render(){const t=this.config||{},e=xt[this.slotType]||{},i=!1===e.ready?e.hint:t.hint||"";return this.renderSlot(V`
      ${t.title||t.label?V`<h3 class="slot-title">${t.title||t.label}</h3>`:j}
      ${i?V`<p class="slot-hint">${i}</p>`:j}
    `)}static styles=[mt,_t]}customElements.define("tomtut-pool-slot-frame",Nt);const Ot={enabled:!0,fill:"transparent"};class Ut extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){if(!t||"object"!=typeof t)throw new Error("Ungueltige Konfiguration");if(void 0!==t.slots&&!Array.isArray(t.slots))throw new Error("`slots` muss eine Liste sein");if(void 0!==t.hero&&("object"!=typeof t.hero||Array.isArray(t.hero)))throw new Error("`hero` muss ein Objekt sein");if(void 0!==t.version&&1!==Number(t.version))throw new Error(`Unbekannte Config-Version ${t.version} — diese Card kennt Version 1`);this._config={version:1,...t,hero:{enabled:!0,shape:$t,...t.hero||{}},frame:{...Ot,...t.frame||{}},slots:Array.isArray(t.slots)?t.slots:[]}}static getConfigElement(){return document.createElement("tomtut-pool-dashboard-editor")}static getStubConfig(){return{version:1,hero:{enabled:!0,shape:$t},frame:{enabled:!0,fill:"transparent"},slots:[]}}getCardSize(){const t=this._config||{},e=(t.slots||[]).filter(t=>"hidden"!==(t?.type||"frame"));return(!1===t.hero?.enabled?0:6)+5*Math.ceil(e.length/3)||3}get visibleSlots(){return(this._config?.slots||[]).map(t=>({...t||{},type:String(t?.type||"frame").toLowerCase()})).filter(t=>"hidden"!==t.type)}render(){if(!this._config)return j;const t=this._config,e=!1!==t.hero?.enabled,i=this.visibleSlots;return V`
      <ha-card>
        <div class="wrap">
          <div class="grid">
            ${e?V`<tomtut-pool-hero
                  class="hero"
                  .hass="${this.hass}"
                  .config="${t.hero}"
                  .frame="${t.frame}"
                ></tomtut-pool-hero>`:j}
            ${i.map(t=>this._renderSlot(t))}
          </div>
        </div>
      </ha-card>
    `}_renderSlot(t){const e=this._config.frame;switch(xt[t.type]?.ready?t.type:"frame"){case"heatpump":return V`<tomtut-pool-slot-heatpump
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-heatpump>`;case"pump":return V`<tomtut-pool-slot-pump
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-pump>`;case"custom":return V`<tomtut-pool-slot-custom
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
        ></tomtut-pool-slot-custom>`;default:return V`<tomtut-pool-slot-frame
          .hass="${this.hass}"
          .config="${t}"
          .frame="${e}"
          .slotType="${t.type}"
        ></tomtut-pool-slot-frame>`}}static styles=n`
    ha-card {
      background: transparent;
      border: none;
      box-shadow: none;
      padding: 0;
      overflow: visible;
    }
    /* Container-Queries statt Media-Queries: es zaehlt die Breite der Card,
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
  `}customElements.define("tomtut-pool-dashboard",Ut);class Mt extends Ut{setConfig(t){if(!t||"object"!=typeof t)throw new Error("Ungueltige Konfiguration");if(!Et(t))throw new Error("Mindestens eine Entity noetig: switch_entity, power_entity, target_entity oder current_entity");const{type:e,...i}=t;this._aliasConfig={...t},super.setConfig({version:1,hero:{enabled:!1},frame:{enabled:!1,fill:"transparent"},slots:[{type:"heatpump",...i}]})}static getConfigElement(){return document.createElement("tomtut-pool-heatpump-card-editor")}static getStubConfig(){return{image_variant:"transparent",switch_entity:"",power_entity:"",target_entity:"",current_entity:"",label_text:"Pool-Waermepumpe"}}getCardSize(){return 6}}customElements.define("tomtut-pool-heatpump-card",Mt);class Lt{constructor({hass:t,config:e,defaults:i={},update:s,idPrefix:r="f"}){this.hass=t,this.config=e||{},this.defaults=i,this.update=s,this.idPrefix=r}val(t){const e=this.config?.[t];return null==e||""===e?this.defaults[t]:e}raw(t){const e=this.config?.[t];return null==e?"":e}_entityOptions(t){const e=this.hass?.states??{};return Object.keys(e).filter(e=>!t.length||t.some(t=>e.startsWith(t+"."))).sort()}text(t,e,i="",s=""){return V`
      <label
        >${t}
        <input
          type="text"
          .value="${String(this.raw(e))}"
          placeholder="${s}"
          @input="${t=>this.update({[e]:t.target.value})}"
        />
        ${i?V`<small>${i}</small>`:j}
      </label>
    `}entity(t,e,i="",...s){const r=`${this.idPrefix}-${e}`;return V`
      <label
        >${t}
        <input
          type="text"
          list="${r}"
          data-key="${e}"
          .value="${String(this.raw(e))}"
          placeholder="${(s[0]||"sensor")+".beispiel"}"
          @input="${t=>this.update({[e]:t.target.value})}"
          @change="${t=>this.update({[e]:t.target.value})}"
        />
        <datalist id="${r}">
          ${this._entityOptions(s).map(t=>V`<option value="${t}"></option>`)}
        </datalist>
        ${i?V`<small>${i}</small>`:j}
      </label>
    `}entityAt(t,e,i,s="",...r){const n=`${this.idPrefix}-${e}-${i}`,o=Array.isArray(this.config?.[e])?this.config[e]:[];return V`
      <label
        >${t}
        <input
          type="text"
          list="${n}"
          data-key="${e}.${i}"
          .value="${String(o[i]??"")}"
          placeholder="${(r[0]||"switch")+".beispiel"}"
          @input="${t=>this._updateList(e,i,t.target.value)}"
          @change="${t=>this._updateList(e,i,t.target.value)}"
        />
        <datalist id="${n}">
          ${this._entityOptions(r).map(t=>V`<option value="${t}"></option>`)}
        </datalist>
        ${s?V`<small>${s}</small>`:j}
      </label>
    `}_updateList(t,e,i){const s=Array.isArray(this.config?.[t])?[...this.config[t]]:[];for(;s.length<=e;)s.push("");for(s[e]=i;s.length&&!s[s.length-1];)s.pop();this.update({[t]:s})}select(t,e,i,s){const r=this.config?.[e]??s;return V`
      <div class="row">
        <span class="row-label">${t}</span>
        <select data-key="${e}" @change="${t=>this.update({[e]:t.target.value})}">
          ${i.map(([t,e])=>V`<option value="${t}" ?selected="${r===t}">${e}</option>`)}
        </select>
      </div>
    `}slider(t,e,i,s,r="%",n=1){const o=this.val(e)??i;return V`
      <div class="row">
        <span class="row-label">${t}</span>
        <input
          type="range"
          min="${i}"
          max="${s}"
          step="${n}"
          data-key="${e}"
          .value="${String(o)}"
          @input="${t=>this.update({[e]:parseFloat(t.target.value)})}"
        />
        <span class="row-val">${o}${r}</span>
      </div>
    `}toggle(t,e,i){const s=this.config?.[e]??i;return V`
      <div class="row">
        <span class="row-label">${t}</span>
        <input
          type="checkbox"
          data-key="${e}"
          ?checked="${s}"
          @change="${t=>this.update({[e]:t.target.checked})}"
        />
      </div>
    `}colorSelect(t,e){return this.select(t,e,[["white","Weiß"],["black","Schwarz"]],this.val(e)??"white")}}const Ht=(t,e,i=!1)=>V`
  <details class="section" ?open="${i}">
    <summary>${t}</summary>
    <div class="section-body">${e}</div>
  </details>
`,Rt=n`
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
  .slot-card {
    border: 1px solid var(--divider-color, #ccc);
    border-radius: 10px;
    padding: 10px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
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
`,Wt=[["transparent","Transparent (Standard)"],["weiss","Weiß"],["schwarz","Schwarz"]],Dt=t=>V`
  ${t.entity("Powerbutton — Schalter (optional)","switch_entity","z.B. die Shelly-Steckdose der Waermepumpe. Ausschalten fragt immer nach.","switch","input_boolean","light")}
  ${t.entity("Stromverbrauch — Sensor (optional)","power_entity","Leistungssensor in W oder kW (z.B. Shelly).","sensor")}
  ${t.entity("Soll-Temperatur — climate oder number","target_entity","climate.* nutzt die Zieltemperatur, number.* den Wert direkt.","climate","number")}
  ${t.entity("Ist-Temperatur — climate oder sensor","current_entity","climate.* nutzt current_temperature, sensor.* den Zustand.","climate","sensor")}
  ${t.text("Freitext auf der Card (optional)","label_text","","z.B. Pool-Waermepumpe")}
  ${t.select("Bildvariante","image_variant",Wt,"transparent")}
  ${t.text("Eigenes Bild (optional)","image_url","Leer = mitgeliefertes Bild aus dem Card-Ordner.","/local/meine_waermepumpe.png")}
  ${Ht("Luefter-Animation",V`
      ${t.select("Aktiv wenn …","fan_source",[["auto","Automatisch (Entity, sonst Leistung)"],["entity","Nur Entity"],["power","Nur Leistung"]],"auto")}
      ${t.entity("Luefter-Entity (optional)","fan_entity","an/aus oder Zahlenwert > 0 = Luefter dreht.","binary_sensor","switch","sensor","fan","climate")}
      ${t.slider("Leistungs-Schwelle","fan_power_threshold",0,2e3," W",10)}
      ${t.slider("Drehgeschwindigkeit","fan_speed",0,100)}
      ${t.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
      ${t.colorSelect("Farbe","fan_color")}
    `)}
  ${Ht("Elemente anzeigen",V`
      ${t.toggle("⏻ Powerbutton","show_power_button",!0)}
      ${t.toggle("⚡ Stromverbrauch","show_power",!0)}
      ${t.toggle("🌡 Ist-Temperatur","show_current",!0)}
      ${t.toggle("🎚 Soll-Temperatur","show_target",!0)}
      ${t.toggle("🌀 Luefter","show_fan",!0)}
    `)}
  ${Vt(t)}
`,Vt=t=>V`
  <details class="section advanced">
    <summary>Erweiterte Einstellungen</summary>
    <div class="section-body">
      ${Ht("Luefter — Position",V`
          ${t.slider("Von oben","fan_top",0,100,"%",.5)}
          ${t.slider("Von links","fan_left",0,100,"%",.5)}
          ${t.slider("Breite","fan_size",5,80,"%",.5)}
          ${t.slider("Höhe/Breite","fan_ratio",.5,2.5,"",.02)}
        `)}
      ${Ht("Powerbutton — Position",V`
          ${t.slider("Von oben","power_btn_top",0,100)}
          ${t.slider("Von links","power_btn_left",0,100)}
          ${t.slider("Größe","power_btn_scale",50,200)}
        `)}
      ${Ht("Stromverbrauch — Darstellung",V`
          ${t.slider("Von oben","power_top",0,100)}
          ${t.slider("Von links","power_left",0,100)}
          ${t.slider("Größe","power_scale",50,150)}
          ${t.slider("Nachkommastellen","power_decimals",0,2,"",1)}
          ${t.colorSelect("Schriftfarbe","power_color")}
          ${t.toggle("Box anzeigen","power_box",!0)}
          ${t.toggle("Einheit anzeigen","power_label",!0)}
        `)}
      ${Ht("Ist-Temperatur — Darstellung",V`
          ${t.slider("Von unten","current_bottom",0,100)}
          ${t.slider("Von links","current_left",0,100)}
          ${t.slider("Größe","current_scale",50,150)}
          ${t.colorSelect("Schriftfarbe","current_color")}
          ${t.toggle("Box anzeigen","current_box",!0)}
          ${t.toggle("Label anzeigen","current_label",!0)}
        `)}
      ${Ht("Soll-Temperatur — Darstellung",V`
          ${t.slider("Von unten","target_bottom",0,100)}
          ${t.slider("Von links","target_left",0,100)}
          ${t.slider("Größe","target_scale",50,150)}
          ${t.slider("Schrittweite","target_step",.1,5,"",.1)}
          ${t.colorSelect("Schriftfarbe","target_color")}
          ${t.toggle("Box anzeigen","target_box",!0)}
          ${t.toggle("Label anzeigen","target_label",!0)}
        `)}
      ${Ht("Freitext — Darstellung",V`
          ${t.slider("Von oben","label_top",0,100)}
          ${t.slider("Von links","label_left",0,100)}
          ${t.slider("Größe","label_scale",50,200)}
          ${t.colorSelect("Schriftfarbe","label_color")}
          ${t.toggle("Box anzeigen","label_box",!0)}
        `)}
    </div>
  </details>
`,It={heatpump:At,pump:Ct};class jt extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){this._config={version:1,hero:{enabled:!0,shape:$t},frame:{enabled:!0,fill:"transparent"},slots:[],...t||{}}}_emit(t){this._config=t,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:t}}))}_updateHero(t){this._emit({...this._config,hero:{...this._config.hero||{},...t}})}_updateFrame(t){this._emit({...this._config,frame:{...this._config.frame||{},...t}})}_slots(){return Array.isArray(this._config?.slots)?this._config.slots:[]}_updateSlot(t,e){const i=this._slots().map((i,s)=>s===t?{...i,...e}:i);this._emit({...this._config,slots:i})}_updateEntry(t,e,i){const s=this._slots()[t]||{},r=Array.isArray(s.entries)?[...s.entries]:[];for(;r.length<=e;)r.push({});r[e]={...r[e],...i},this._updateSlot(t,{entries:r})}_addSlot(){this._emit({...this._config,slots:[...this._slots(),{type:"frame"}]})}_removeSlot(t){this._emit({...this._config,slots:this._slots().filter((e,i)=>i!==t)})}_moveSlot(t,e){const i=[...this._slots()],s=t+e;if(s<0||s>=i.length)return;const[r]=i.splice(t,1);i.splice(s,0,r),this._emit({...this._config,slots:i})}_fieldsFor(t){const e=this._slots()[t]||{};return new Lt({hass:this.hass,config:e,defaults:It[e.type]||{},update:e=>this._updateSlot(t,e),idPrefix:`slot${t}`})}_slotBody(t){const e=this._slots()[t]||{},i=this._fieldsFor(t);switch(e.type){case"heatpump":return Dt(i);case"pump":return(t=>V`
  ${t.text("Ueberschrift (optional)","label","","z.B. Poolpumpe")}
  ${t.select("Schaltmodell","stage_mode",[["momentary","Impulstaster (Shelly & Co.) — zuletzt gedrueckt gilt"],["latching","Dauerrelais je Stufe — Zustand ist an/aus"]],"momentary")}
  ${t.entityAt("Stufe 1 (N1)","stage_entities",0,"","switch","input_boolean","script")}
  ${t.entityAt("Stufe 2 (N2, optional)","stage_entities",1,"","switch","input_boolean","script")}
  ${t.entityAt("Stufe 3 (N3, optional)","stage_entities",2,"","switch","input_boolean","script")}
  ${t.entity("STOP-Taster (optional)","stop_entity","Bei Impulstastern der eigene STOP-Kanal.","switch","input_boolean","script")}
  ${t.entity("Hauptschalter (optional)","main_entity","Steckdose/Relais der Pumpe — Powerbutton mit Rueckfrage.","switch","input_boolean","light")}
  ${t.entity("Stromverbrauch (optional)","power_entity","W oder kW.","sensor")}
  ${t.entity("Temperaturfuehler (optional)","temp_entity","Zeigt das Thermometer.","sensor","number")}
  ${t.select("Bildvariante","image_variant",Wt,"transparent")}
  ${t.text("Eigenes Bild (optional)","image_url","Leer = mitgeliefertes Bild aus dem Card-Ordner.","/local/meine_pumpe.png")}
  ${Ht("Elemente anzeigen",V`
      ${t.toggle("⏻ Powerbutton","show_power_button",!0)}
      ${t.toggle("⚡ Stromverbrauch","show_power",!0)}
      ${t.toggle("🌡 Temperatur","show_temp",!0)}
      ${t.toggle("🌀 Laufrad","show_fan",!0)}
    `)}
  <details class="section advanced">
    <summary>Erweiterte Einstellungen</summary>
    <div class="section-body">
      ${Ht("Laufrad — Position & Tempo",V`
          ${t.slider("Von oben","fan_top",0,100,"%",.5)}
          ${t.slider("Von links","fan_left",0,100,"%",.5)}
          ${t.slider("Breite","fan_size",3,60,"%",.5)}
          ${t.slider("Höhe/Breite","fan_ratio",.5,3,"",.05)}
          ${t.slider("Umlaufzeit N1","fan_dur_1",.2,6," s",.1)}
          ${t.slider("Umlaufzeit N2","fan_dur_2",.2,6," s",.1)}
          ${t.slider("Umlaufzeit N3","fan_dur_3",.2,6," s",.1)}
          ${t.select("Bei Stillstand","fan_inactive",[["gray","Grau + stehend"],["hidden","Ausblenden"]],"gray")}
          ${t.colorSelect("Farbe","fan_color")}
        `)}
      ${Ht("Powerbutton — Position",V`
          ${t.slider("Von oben","power_btn_top",0,100)}
          ${t.slider("Von links","power_btn_left",0,100)}
          ${t.slider("Größe","power_btn_scale",50,200)}
        `)}
      ${Ht("Stromverbrauch — Darstellung",V`
          ${t.slider("Von unten","power_bottom",0,100)}
          ${t.slider("Von links","power_left",0,100)}
          ${t.slider("Größe","power_scale",50,150)}
          ${t.slider("Nachkommastellen","power_decimals",0,2,"",1)}
          ${t.colorSelect("Schriftfarbe","power_color")}
          ${t.toggle("Box anzeigen","power_box",!0)}
          ${t.toggle("Einheit anzeigen","power_label",!0)}
        `)}
      ${Ht("Thermometer — Position",V`
          ${t.slider("Von oben","temp_top",0,100)}
          ${t.slider("Von links","temp_left",0,100)}
          ${t.slider("Größe","temp_scale",50,200)}
        `)}
      ${Ht("Plausibilitaet",V`${t.slider("Laufrad steht unter …","idle_watt",0,200," W",1)}`)}
    </div>
  </details>
`)(i);case"custom":return((t,e)=>V`
  ${t.text("Ueberschrift (optional)","title","","z.B. Wetter")}
  ${t.select("Ausrichtung","align",[["oben","Oben"],["mitte","Mitte"],["unten","Unten"]],"mitte")}
  ${[0,1,2].map(t=>Ht(`Eintrag ${t+1}`,e(t),0===t))}
`)(i,i=>(t=>V`
  ${t.select("Art","kind",[["entity","Entity mit Wert"],["button","Button (schaltet)"],["text","Freitext"]],"entity")}
  ${"text"===t.config?.kind?t.text("Text","text","","z.B. Sommerbetrieb"):V`
        ${t.entity("Entity","entity","","sensor","binary_sensor","switch","light","input_boolean","number","climate")}
        ${t.text("Beschriftung (optional)","label","","leer = Name der Entity")}
        ${"button"===t.config?.kind?t.text("Icon (optional)","icon","","mdi:lightbulb"):j}
      `}
`)(new Lt({hass:this.hass,config:(Array.isArray(e.entries)?e.entries:[])[i]||{},update:e=>this._updateEntry(t,i,e),idPrefix:`slot${t}e${i}`})));case"hidden":return V`<small>Dieser Slot wird nicht angezeigt; die anderen ruecken nach.</small>`;default:return(t=>V`
  ${t.text("Ueberschrift (optional)","title","","z.B. Platzhalter")}
  ${t.text("Hinweistext (optional)","hint","","")}
`)(i)}}render(){if(!this._config)return j;const t=this._config.hero||{},e=this._config.frame||{},i=new Lt({hass:this.hass,config:t,defaults:St,update:t=>this._updateHero(t),idPrefix:"hero"}),s=new Lt({hass:this.hass,config:e,update:t=>this._updateFrame(t),idPrefix:"frame"}),r=this._slots();return V`
      <div class="editor">
        <div class="step-head">Schritt 1 — Becken</div>
        ${i.toggle("Becken anzeigen","enabled",!0)}
        ${!1===t.enabled?j:(t=>V`
  ${t.select("Beckenform","shape",Object.entries(bt).map(([t,e])=>[t,e.label]),"oval")}
  ${t.entity("Wassertemperatur (optional)","temp_entity","Zeigt das Thermometer auf der Wasserflaeche.","sensor","climate","number")}
  ${t.entity("pH-Wert (optional)","ph_entity","Kaestchen auf der Beckenwand.","sensor","number")}
  ${t.entity("Redox / RX (optional)","rx_entity","Kaestchen auf der Beckenwand.","sensor","number")}
  ${t.text("Freitext auf dem Becken (optional)","label_text","","z.B. Pool")}
  ${Ht("Feinheiten",V`
      ${t.toggle("Bodenablauf anzeigen (Grafik folgt)","show_drain",!1)}
      ${t.toggle("Becken mit Rahmen","framed",!1)}
      ${t.select("Kaestchen-Farbe","box_color",[["weiss","Hell"],["schwarz","Dunkel"]],"weiss")}
      ${t.slider("Thermometer-Groesse","thermo_scale",50,200)}
      ${t.slider("Thermometer von oben","thermo_top",0,100,"%",.5)}
      ${t.slider("Thermometer von links","thermo_left",0,100,"%",.5)}
      ${t.slider("pH von oben","ph_top",0,100,"%",.5)}
      ${t.slider("pH von links","ph_left",0,100,"%",.5)}
      ${t.slider("RX von oben","rx_top",0,100,"%",.5)}
      ${t.slider("RX von links","rx_left",0,100,"%",.5)}
    `)}
`)(i)}

        <div class="step-head">Schritt 2 — Geraete</div>
        ${r.map((t,e)=>V`
            <div class="slot-card">
              <div class="slot-head">
                <div class="row">
                  <span class="row-label">Slot ${e+1}</span>
                  <select
                    data-key="type"
                    @change="${t=>this._updateSlot(e,{type:t.target.value})}"
                  >
                    ${Object.entries(xt).map(([e,i])=>V`
                        <option value="${e}" ?selected="${(t.type||"frame")===e}">
                          ${i.label}${!1===i.ready?" (folgt)":""}
                        </option>
                      `)}
                  </select>
                </div>
                <button class="icon-btn" title="nach oben" @click="${()=>this._moveSlot(e,-1)}">
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
          `)}
        <button class="add-btn" @click="${()=>this._addSlot()}">+ Slot hinzufuegen</button>

        <div class="step-head">Schritt 3 — Optik</div>
        ${s.toggle("Rahmen um die Slots","enabled",!0)}
        ${s.select("Fuellung","fill",[["transparent","Transparent"],["weiss","Weiß"],["schwarz","Schwarz"]],"transparent")}
        <small>Die Schriftfarbe folgt der Fuellung automatisch.</small>
      </div>
    `}static styles=[Rt]}customElements.define("tomtut-pool-dashboard-editor",jt);class Ft extends ot{static properties={hass:{attribute:!1},_config:{state:!0}};setConfig(t){this._config={...t||{}}}_update(t){const e={...this._config,...t};this._config=e,this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:e}}))}render(){if(!this._config)return j;const t=new Lt({hass:this.hass,config:this._config,defaults:At,update:t=>this._update(t),idPrefix:"hp"});return V`<div class="editor">${Dt(t)}</div>`}static styles=[Rt]}customElements.define("tomtut-pool-heatpump-card-editor",Ft),
/*!
 * tomtut-pool-cards.js — Lovelace-Sammlung fuer Pool-Dashboards
 *
 * Enthaelt zwei Card-Typen aus einem Bundle:
 *   custom:tomtut-pool-dashboard      — Becken-Hero + frei bestueckbare Geraete-Slots
 *   custom:tomtut-pool-heatpump-card  — Alias fuer bestehende Waermepumpen-Karten
 *
 * Keine Integration noetig: alle Werte kommen aus frei konfigurierbaren
 * Entities. Die Bilder liegen im Repo unter dist/ und werden von HACS nach
 * www/community/tomtut-pool-cards/ kopiert.
 */
window.customCards=window.customCards||[],window.customCards.push({type:"tomtut-pool-dashboard",name:"TomTuT Pool Dashboard",description:"Pool-Becken mit Live-Werten plus Kaesten fuer Waermepumpe, Poolpumpe und eigene Werte — beliebige Entities, keine Integration noetig",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"},{type:"tomtut-pool-heatpump-card",name:"TomTuT Pool Heatpump",description:"Generische Card fuer Pool-Waermepumpen: Soll-/Ist-Temperatur, Stromverbrauch, Powerbutton mit Rueckfrage und animierter Luefter",preview:!0,documentationURL:"https://github.com/TomTuTHub/tomtut-pool-cards"});export{Ut as TomtutPoolDashboardCard,jt as TomtutPoolDashboardEditor,Mt as TomtutPoolHeatpumpCard,Ft as TomtutPoolHeatpumpCardEditor};
