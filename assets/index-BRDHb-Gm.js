var Ee=Object.defineProperty;var Ce=(t,e,n)=>e in t?Ee(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var O=(t,e,n)=>Ce(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();var Yt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Kt={};/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */var Vt;function Pe(){if(Vt)return Kt;Vt=1;var t;return function(e){(function(n){var r=typeof globalThis=="object"?globalThis:typeof Yt=="object"?Yt:typeof self=="object"?self:typeof this=="object"?this:y(),a=c(e);typeof r.Reflect<"u"&&(a=c(r.Reflect,a)),n(a,r),typeof r.Reflect>"u"&&(r.Reflect=e);function c(C,w){return function(_,m){Object.defineProperty(C,_,{configurable:!0,writable:!0,value:m}),w&&w(_,m)}}function d(){try{return Function("return this;")()}catch{}}function v(){try{return(0,eval)("(function() { return this; })()")}catch{}}function y(){return d()||v()}})(function(n,r){var a=Object.prototype.hasOwnProperty,c=typeof Symbol=="function",d=c&&typeof Symbol.toPrimitive<"u"?Symbol.toPrimitive:"@@toPrimitive",v=c&&typeof Symbol.iterator<"u"?Symbol.iterator:"@@iterator",y=typeof Object.create=="function",C={__proto__:[]}instanceof Array,w=!y&&!C,_={create:y?function(){return _t(Object.create(null))}:C?function(){return _t({__proto__:null})}:function(){return _t({})},has:w?function(i,o){return a.call(i,o)}:function(i,o){return o in i},get:w?function(i,o){return a.call(i,o)?i[o]:void 0}:function(i,o){return i[o]}},m=Object.getPrototypeOf(Function),K=typeof Map=="function"&&typeof Map.prototype.entries=="function"?Map:_e(),rt=typeof Set=="function"&&typeof Set.prototype.entries=="function"?Set:Le(),st=typeof WeakMap=="function"?WeakMap:Oe(),L=c?Symbol.for("@reflect-metadata:registry"):void 0,R=Me(),B=xe(R);function j(i,o,s,f){if(b(s)){if(!Gt(i))throw new TypeError;if(!Ut(o))throw new TypeError;return ht(i,o)}else{if(!Gt(i))throw new TypeError;if(!$(o))throw new TypeError;if(!$(f)&&!b(f)&&!it(f))throw new TypeError;return it(f)&&(f=void 0),s=X(s),mt(i,o,s,f)}}n("decorate",j);function W(i,o){function s(f,g){if(!$(f))throw new TypeError;if(!b(g)&&!be(g))throw new TypeError;Ht(i,o,f,g)}return s}n("metadata",W);function A(i,o,s,f){if(!$(s))throw new TypeError;return b(f)||(f=X(f)),Ht(i,o,s,f)}n("defineMetadata",A);function H(i,o,s){if(!$(o))throw new TypeError;return b(s)||(s=X(s)),nt(i,o,s)}n("hasMetadata",H);function Q(i,o,s){if(!$(o))throw new TypeError;return b(s)||(s=X(s)),k(i,o,s)}n("hasOwnMetadata",Q);function T(i,o,s){if(!$(o))throw new TypeError;return b(s)||(s=X(s)),J(i,o,s)}n("getMetadata",T);function Mt(i,o,s){if(!$(o))throw new TypeError;return b(s)||(s=X(s)),jt(i,o,s)}n("getOwnMetadata",Mt);function ut(i,o){if(!$(i))throw new TypeError;return b(o)||(o=X(o)),Rt(i,o)}n("getMetadataKeys",ut);function lt(i,o){if(!$(i))throw new TypeError;return b(o)||(o=X(o)),Bt(i,o)}n("getOwnMetadataKeys",lt);function pt(i,o,s){if(!$(o))throw new TypeError;if(b(s)||(s=X(s)),!$(o))throw new TypeError;b(s)||(s=X(s));var f=ct(o,s,!1);return b(f)?!1:f.OrdinaryDeleteMetadata(i,o,s)}n("deleteMetadata",pt);function ht(i,o){for(var s=i.length-1;s>=0;--s){var f=i[s],g=f(o);if(!b(g)&&!it(g)){if(!Ut(g))throw new TypeError;o=g}}return o}function mt(i,o,s,f){for(var g=i.length-1;g>=0;--g){var P=i[g],D=P(o,s,f);if(!b(D)&&!it(D)){if(!$(D))throw new TypeError;f=D}}return f}function nt(i,o,s){var f=k(i,o,s);if(f)return!0;var g=St(o);return it(g)?!1:nt(i,g,s)}function k(i,o,s){var f=ct(o,s,!1);return b(f)?!1:Ft(f.OrdinaryHasOwnMetadata(i,o,s))}function J(i,o,s){var f=k(i,o,s);if(f)return jt(i,o,s);var g=St(o);if(!it(g))return J(i,g,s)}function jt(i,o,s){var f=ct(o,s,!1);if(!b(f))return f.OrdinaryGetOwnMetadata(i,o,s)}function Ht(i,o,s,f){var g=ct(s,f,!0);g.OrdinaryDefineOwnMetadata(i,o,s,f)}function Rt(i,o){var s=Bt(i,o),f=St(i);if(f===null)return s;var g=Rt(f,o);if(g.length<=0)return s;if(s.length<=0)return g;for(var P=new rt,D=[],x=0,u=s;x<u.length;x++){var l=u[x],p=P.has(l);p||(P.add(l),D.push(l))}for(var h=0,S=g;h<S.length;h++){var l=S[h],p=P.has(l);p||(P.add(l),D.push(l))}return D}function Bt(i,o){var s=ct(i,o,!1);return s?s.OrdinaryOwnMetadataKeys(i,o):[]}function zt(i){if(i===null)return 1;switch(typeof i){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return i===null?1:6;default:return 6}}function b(i){return i===void 0}function it(i){return i===null}function me(i){return typeof i=="symbol"}function $(i){return typeof i=="object"?i!==null:typeof i=="function"}function ve(i,o){switch(zt(i)){case 0:return i;case 1:return i;case 2:return i;case 3:return i;case 4:return i;case 5:return i}var s="string",f=Wt(i,d);if(f!==void 0){var g=f.call(i,s);if($(g))throw new TypeError;return g}return ge(i)}function ge(i,o){var s,f,g;{var P=i.toString;if(vt(P)){var f=P.call(i);if(!$(f))return f}var s=i.valueOf;if(vt(s)){var f=s.call(i);if(!$(f))return f}}throw new TypeError}function Ft(i){return!!i}function ye(i){return""+i}function X(i){var o=ve(i);return me(o)?o:ye(o)}function Gt(i){return Array.isArray?Array.isArray(i):i instanceof Object?i instanceof Array:Object.prototype.toString.call(i)==="[object Array]"}function vt(i){return typeof i=="function"}function Ut(i){return typeof i=="function"}function be(i){switch(zt(i)){case 3:return!0;case 4:return!0;default:return!1}}function xt(i,o){return i===o||i!==i&&o!==o}function Wt(i,o){var s=i[o];if(s!=null){if(!vt(s))throw new TypeError;return s}}function qt(i){var o=Wt(i,v);if(!vt(o))throw new TypeError;var s=o.call(i);if(!$(s))throw new TypeError;return s}function Jt(i){return i.value}function Zt(i){var o=i.next();return o.done?!1:o}function Qt(i){var o=i.return;o&&o.call(i)}function St(i){var o=Object.getPrototypeOf(i);if(typeof i!="function"||i===m||o!==m)return o;var s=i.prototype,f=s&&Object.getPrototypeOf(s);if(f==null||f===Object.prototype)return o;var g=f.constructor;return typeof g!="function"||g===i?o:g}function we(){var i;!b(L)&&typeof r.Reflect<"u"&&!(L in r.Reflect)&&typeof r.Reflect.defineMetadata=="function"&&(i=Se(r.Reflect));var o,s,f,g=new st,P={registerProvider:D,getProvider:u,setProvider:p};return P;function D(h){if(!Object.isExtensible(P))throw new Error("Cannot add provider to a frozen registry.");switch(!0){case i===h:break;case b(o):o=h;break;case o===h:break;case b(s):s=h;break;case s===h:break;default:f===void 0&&(f=new rt),f.add(h);break}}function x(h,S){if(!b(o)){if(o.isProviderFor(h,S))return o;if(!b(s)){if(s.isProviderFor(h,S))return o;if(!b(f))for(var E=qt(f);;){var I=Zt(E);if(!I)return;var Z=Jt(I);if(Z.isProviderFor(h,S))return Qt(E),Z}}}if(!b(i)&&i.isProviderFor(h,S))return i}function u(h,S){var E=g.get(h),I;return b(E)||(I=E.get(S)),b(I)&&(I=x(h,S),b(I)||(b(E)&&(E=new K,g.set(h,E)),E.set(S,I))),I}function l(h){if(b(h))throw new TypeError;return o===h||s===h||!b(f)&&f.has(h)}function p(h,S,E){if(!l(E))throw new Error("Metadata provider not registered.");var I=u(h,S);if(I!==E){if(!b(I))return!1;var Z=g.get(h);b(Z)&&(Z=new K,g.set(h,Z)),Z.set(S,E)}return!0}}function Me(){var i;return!b(L)&&$(r.Reflect)&&Object.isExtensible(r.Reflect)&&(i=r.Reflect[L]),b(i)&&(i=we()),!b(L)&&$(r.Reflect)&&Object.isExtensible(r.Reflect)&&Object.defineProperty(r.Reflect,L,{enumerable:!1,configurable:!1,writable:!1,value:i}),i}function xe(i){var o=new st,s={isProviderFor:function(l,p){var h=o.get(l);return b(h)?!1:h.has(p)},OrdinaryDefineOwnMetadata:D,OrdinaryHasOwnMetadata:g,OrdinaryGetOwnMetadata:P,OrdinaryOwnMetadataKeys:x,OrdinaryDeleteMetadata:u};return R.registerProvider(s),s;function f(l,p,h){var S=o.get(l),E=!1;if(b(S)){if(!h)return;S=new K,o.set(l,S),E=!0}var I=S.get(p);if(b(I)){if(!h)return;if(I=new K,S.set(p,I),!i.setProvider(l,p,s))throw S.delete(p),E&&o.delete(l),new Error("Wrong provider for target.")}return I}function g(l,p,h){var S=f(p,h,!1);return b(S)?!1:Ft(S.has(l))}function P(l,p,h){var S=f(p,h,!1);if(!b(S))return S.get(l)}function D(l,p,h,S){var E=f(h,S,!0);E.set(l,p)}function x(l,p){var h=[],S=f(l,p,!1);if(b(S))return h;for(var E=S.keys(),I=qt(E),Z=0;;){var Xt=Zt(I);if(!Xt)return h.length=Z,h;var Ae=Jt(Xt);try{h[Z]=Ae}catch(ke){try{Qt(I)}finally{throw ke}}Z++}}function u(l,p,h){var S=f(p,h,!1);if(b(S)||!S.delete(l))return!1;if(S.size===0){var E=o.get(p);b(E)||(E.delete(h),E.size===0&&o.delete(E))}return!0}}function Se(i){var o=i.defineMetadata,s=i.hasOwnMetadata,f=i.getOwnMetadata,g=i.getOwnMetadataKeys,P=i.deleteMetadata,D=new st,x={isProviderFor:function(u,l){var p=D.get(u);return!b(p)&&p.has(l)?!0:g(u,l).length?(b(p)&&(p=new rt,D.set(u,p)),p.add(l),!0):!1},OrdinaryDefineOwnMetadata:o,OrdinaryHasOwnMetadata:s,OrdinaryGetOwnMetadata:f,OrdinaryOwnMetadataKeys:g,OrdinaryDeleteMetadata:P};return x}function ct(i,o,s){var f=R.getProvider(i,o);if(!b(f))return f;if(s){if(R.setProvider(i,o,B))return B;throw new Error("Illegal state.")}}function _e(){var i={},o=[],s=function(){function x(u,l,p){this._index=0,this._keys=u,this._values=l,this._selector=p}return x.prototype["@@iterator"]=function(){return this},x.prototype[v]=function(){return this},x.prototype.next=function(){var u=this._index;if(u>=0&&u<this._keys.length){var l=this._selector(this._keys[u],this._values[u]);return u+1>=this._keys.length?(this._index=-1,this._keys=o,this._values=o):this._index++,{value:l,done:!1}}return{value:void 0,done:!0}},x.prototype.throw=function(u){throw this._index>=0&&(this._index=-1,this._keys=o,this._values=o),u},x.prototype.return=function(u){return this._index>=0&&(this._index=-1,this._keys=o,this._values=o),{value:u,done:!0}},x}(),f=function(){function x(){this._keys=[],this._values=[],this._cacheKey=i,this._cacheIndex=-2}return Object.defineProperty(x.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),x.prototype.has=function(u){return this._find(u,!1)>=0},x.prototype.get=function(u){var l=this._find(u,!1);return l>=0?this._values[l]:void 0},x.prototype.set=function(u,l){var p=this._find(u,!0);return this._values[p]=l,this},x.prototype.delete=function(u){var l=this._find(u,!1);if(l>=0){for(var p=this._keys.length,h=l+1;h<p;h++)this._keys[h-1]=this._keys[h],this._values[h-1]=this._values[h];return this._keys.length--,this._values.length--,xt(u,this._cacheKey)&&(this._cacheKey=i,this._cacheIndex=-2),!0}return!1},x.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=i,this._cacheIndex=-2},x.prototype.keys=function(){return new s(this._keys,this._values,g)},x.prototype.values=function(){return new s(this._keys,this._values,P)},x.prototype.entries=function(){return new s(this._keys,this._values,D)},x.prototype["@@iterator"]=function(){return this.entries()},x.prototype[v]=function(){return this.entries()},x.prototype._find=function(u,l){if(!xt(this._cacheKey,u)){this._cacheIndex=-1;for(var p=0;p<this._keys.length;p++)if(xt(this._keys[p],u)){this._cacheIndex=p;break}}return this._cacheIndex<0&&l&&(this._cacheIndex=this._keys.length,this._keys.push(u),this._values.push(void 0)),this._cacheIndex},x}();return f;function g(x,u){return x}function P(x,u){return u}function D(x,u){return[x,u]}}function Le(){var i=function(){function o(){this._map=new K}return Object.defineProperty(o.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),o.prototype.has=function(s){return this._map.has(s)},o.prototype.add=function(s){return this._map.set(s,s),this},o.prototype.delete=function(s){return this._map.delete(s)},o.prototype.clear=function(){this._map.clear()},o.prototype.keys=function(){return this._map.keys()},o.prototype.values=function(){return this._map.keys()},o.prototype.entries=function(){return this._map.entries()},o.prototype["@@iterator"]=function(){return this.keys()},o.prototype[v]=function(){return this.keys()},o}();return i}function Oe(){var i=16,o=_.create(),s=f();return function(){function u(){this._key=f()}return u.prototype.has=function(l){var p=g(l,!1);return p!==void 0?_.has(p,this._key):!1},u.prototype.get=function(l){var p=g(l,!1);return p!==void 0?_.get(p,this._key):void 0},u.prototype.set=function(l,p){var h=g(l,!0);return h[this._key]=p,this},u.prototype.delete=function(l){var p=g(l,!1);return p!==void 0?delete p[this._key]:!1},u.prototype.clear=function(){this._key=f()},u}();function f(){var u;do u="@@WeakMap@@"+x();while(_.has(o,u));return o[u]=!0,u}function g(u,l){if(!a.call(u,s)){if(!l)return;Object.defineProperty(u,s,{value:_.create()})}return u[s]}function P(u,l){for(var p=0;p<l;++p)u[p]=Math.random()*255|0;return u}function D(u){if(typeof Uint8Array=="function"){var l=new Uint8Array(u);return typeof crypto<"u"?crypto.getRandomValues(l):typeof msCrypto<"u"?msCrypto.getRandomValues(l):P(l,u),l}return P(new Array(u),u)}function x(){var u=D(i);u[6]=u[6]&79|64,u[8]=u[8]&191|128;for(var l="",p=0;p<i;++p){var h=u[p];(p===4||p===6||p===8)&&(l+="-"),h<16&&(l+="0"),l+=h.toString(16).toLowerCase()}return l}}function _t(i){return i.__=void 0,delete i.__,i}})}(t||(t={})),Kt}Pe();var $t=(t=>(t.Consumable="consumable",t.Equipment="equipment",t))($t||{}),tt=(t=>(t[t.Common=0]="Common",t[t.Rare=1]="Rare",t[t.Epic=2]="Epic",t[t.Legendary=3]="Legendary",t))(tt||{}),kt=(t=>(t.None="",t.Big="巨大的",t.Smelly="野兽先辈的",t))(kt||{}),Et=(t=>(t.Head="head",t.Body="body",t.Hand="hand",t.Foot="foot",t.Accessory="accessory",t))(Et||{}),N=(t=>(t.Attack="attack",t.Defend="defend",t.Dodge="dodge",t.DexAction="dexAction",t.StrAction="strAction",t.IntAction="intAction",t.ConAction="conAction",t.SizAction="sizAction",t.AppAction="appAction",t.NoAction="noAction",t))(N||{}),V=(t=>(t.Success="success",t.Fail="fail",t.Miss="miss",t))(V||{}),se=(t=>(t.Poison="poison",t.Sleep="sleep",t.Stun="stun",t.Confuse="confuse",t.Paralyze="paralyze",t.Pain="pain",t))(se||{}),U=(t=>(t.Dazed="Dazed",t.Attack="Attack",t.PowerfulDigAttack="PowerfulDigAttack",t.HorizontalSlash="HorizontalSlash",t.Bite="Bite",t.Capture="Capture",t))(U||{});const te={Dazed:{name:"失神",description:"来不及反应",category:N.NoAction,coeff:{str:0,int:0,con:0,siz:0,app:0,dex:0},messageGenerator:(t,e,n)=>`${t.name} 来不及反应`},Attack:{name:"攻击",description:"用拳头或者用武器进行一般通过攻击",category:N.Attack,coeff:{str:1,int:0,con:0,siz:.5,app:0,dex:.5},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}攻击了${e.name}`:`${t.name}攻击了${e.name}，但是失败了`},PowerfulDigAttack:{name:"狠狠地撅",description:"1！1！4！5！1！4！",category:N.Attack,coeff:{str:10,int:0,con:0,siz:10,app:10,dex:0},extraEffect:(t,e)=>{e.status.push({type:se.Pain,duration:10})},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}狠狠地撅了${e.name}一下，${e.name}痛苦难耐
// 哼哼啊啊啊啊啊啊啊啊啊啊 `:`${e.name}躲过了${t.name}的撅`},HorizontalSlash:{name:"横劈",description:"以迅猛之势横劈出一刀",category:N.Attack,coeff:{str:4,int:0,con:0,siz:0,app:0,dex:2},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}以迅猛之势横劈出一刀`:`${e.name}躲过了${t.name}的横劈`},Bite:{name:"撕咬",description:"用嘴撕咬，一种原始的攻击方式",category:N.Attack,coeff:{str:2,int:0,con:0,siz:1,app:0,dex:1},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}冲过来咬了${e.name}一口`:`${e.name}躲过了${t.name}的撕咬`},Capture:{name:"尝试捕捉",description:"这不是神奇宝贝，你得用绞技而不是精灵球",category:N.Attack,coeff:{str:1,int:0,con:0,siz:0,app:0,dex:0},extraEffect:(t,e)=>{if(!(t instanceof gt))return;if(e.health<1){t.addLog(`${e.name}已经死了，无法捕获`);return}const n=t.ability.dex/e.ability.dex*(t.ability.siz/e.ability.siz)/(10*e.health/e.maxHealth),r=t.ability.str/e.ability.str*(t.ability.siz/e.ability.siz)/(10*e.health/e.maxHealth);Math.random()<r&&Math.random()<n?(e.health=.9,t.capturedMonster.push(e),t.addLog(`你成功捕获了${e.name}`)):t.addLog(`你尝试捕获${e.name}，但是失败了`)},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}尝试通过绞住${e.name}，让${e.name}失去行动力`:`${e.name}躲过了${t.name}的绞技`}};var Dt=(t=>(t.Sword="Sword",t.Katana="Katana",t))(Dt||{});const Ct={Sword:{name:"剑",description:"一把剑,平平无奇的武器",rarity:tt.Common,position:Et.Hand,extraActions:[],ability:{},actionCoeff:{[N.Attack]:{plus:1,multiply:1}}},Katana:{name:"太刀",description:"太好了，有了这个，你就可以做虾头太刀侠了",rarity:tt.Rare,position:Et.Hand,extraActions:[{actionType:U.HorizontalSlash,weight:1}],ability:{str:1,dex:-1},actionCoeff:{[N.Attack]:{plus:2,multiply:1},[N.Dodge]:{plus:-2,multiply:1},[N.DexAction]:{plus:-2,multiply:1}}}};class ce{constructor(e,n,r,a,c,d){O(this,"name");O(this,"uuid");O(this,"category");O(this,"type");O(this,"rarity");O(this,"description");this.name=e,this.uuid=n,this.category=r,this.type=a,this.rarity=c,this.description=d}}const z=[];for(let t=0;t<256;++t)z.push((t+256).toString(16).slice(1));function Ie(t,e=0){return(z[t[e+0]]+z[t[e+1]]+z[t[e+2]]+z[t[e+3]]+"-"+z[t[e+4]]+z[t[e+5]]+"-"+z[t[e+6]]+z[t[e+7]]+"-"+z[t[e+8]]+z[t[e+9]]+"-"+z[t[e+10]]+z[t[e+11]]+z[t[e+12]]+z[t[e+13]]+z[t[e+14]]+z[t[e+15]]).toLowerCase()}let Lt;const Te=new Uint8Array(16);function Ne(){if(!Lt){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");Lt=crypto.getRandomValues.bind(crypto)}return Lt(Te)}const $e=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),ee={randomUUID:$e};function de(t,e,n){var a;if(ee.randomUUID&&!t)return ee.randomUUID();t=t||{};const r=t.random??((a=t.rng)==null?void 0:a.call(t))??Ne();if(r.length<16)throw new Error("Random bytes length must be >= 16");return r[6]=r[6]&15|64,r[8]=r[8]&63|128,Ie(r)}class fe extends ce{constructor(n){n=n||Dt.Sword;const r=Ct[n];super(r.name,de(),$t.Equipment,n,r.rarity,r.description);O(this,"position");O(this,"extraActions");O(this,"ability");O(this,"actionCoeff");O(this,"prefix");this.position=r.position,this.extraActions=r.extraActions,this.ability=r.ability,this.actionCoeff=r.actionCoeff,this.prefix=De()}}function De(){return Object.values(kt)[Math.floor(Math.random()*Object.values(kt).length)]}function je(t){const e=Object.keys(Ct).filter(a=>Ct[a].rarity===t),n=Math.floor(Math.random()*e.length),r=e[n];return new fe(r)}function ne(t,e){return je(e)}var et=(t=>(t.Unknown="Unknown",t.BrokenChest="BrokenChest",t.SilverChest="SilverChest",t))(et||{});const re={BrokenChest:{name:"破烂的宝箱",rarity:tt.Common,description:"一个破烂的宝箱，里面可能会有一些有用的东西",effect:t=>{t.pack.push(ne(1,tt.Common))}},SilverChest:{name:"银宝箱",rarity:tt.Rare,description:"一个银宝箱，里面可能会有一些有用的东西",effect:t=>{t.pack.push(ne(1,tt.Rare))}},Unknown:{name:"未知",rarity:tt.Common,description:"未知",effect:t=>{}}};var q=(t=>(t.Player="Player",t.Player114514="Player114514",t.Slime="Slime",t.Dragon="Dragon",t.Wolf="Wolf",t))(q||{});const dt={Player:{typeName:"人类",description:"你",abilityCoeff:{str:{base:10,growth:1},int:{base:10,growth:1},con:{base:10,growth:1},siz:{base:10,growth:0},app:{base:10,growth:0},dex:{base:10,growth:1},armor:{base:0,growth:0}},actions:[{actionType:U.Attack,weight:1},{actionType:U.Capture,weight:.1}],dropItems:[]},Player114514:{typeName:"野兽仙贝",description:"114514",abilityCoeff:{str:{base:10,growth:1},int:{base:10,growth:0},con:{base:15,growth:2},siz:{base:10,growth:1},app:{base:15,growth:0},dex:{base:10,growth:0},armor:{base:0,growth:0}},actions:[{actionType:U.PowerfulDigAttack,weight:.1},{actionType:U.Attack,weight:.9},{actionType:U.Capture,weight:.1}],dropItems:[]},Slime:{typeName:"史莱姆",description:"一种行动缓慢的软体生物，武器打上去没有什么手感",abilityCoeff:{str:{base:10,growth:1},int:{base:1,growth:0},con:{base:10,growth:1},siz:{base:5,growth:0},app:{base:1,growth:0},dex:{base:1,growth:1},armor:{base:50,growth:1}},actions:[{actionType:U.Attack,weight:1},{actionType:U.Dazed,weight:2}],dropItems:[{type:et.BrokenChest,weight:1},{type:et.SilverChest,weight:.2}]},Dragon:{typeName:"龙",description:"森林食物链的顶端",abilityCoeff:{str:{base:100,growth:10},int:{base:10,growth:1},con:{base:100,growth:10},siz:{base:100,growth:10},app:{base:10,growth:1},dex:{base:10,growth:5},armor:{base:50,growth:10}},actions:[{actionType:U.Attack,weight:1}],dropItems:[{type:et.SilverChest,weight:1}]},Wolf:{typeName:"孤狼",description:"一匹行动敏捷的孤狼，对于普通人来说，它是一种危险的生物",abilityCoeff:{str:{base:15,growth:2},int:{base:3,growth:1},con:{base:10,growth:1},siz:{base:10,growth:1},app:{base:5,growth:0},dex:{base:20,growth:3},armor:{base:0,growth:1}},actions:[{actionType:U.Bite,weight:1},{actionType:U.Dazed,weight:.5}],dropItems:[{type:et.BrokenChest,weight:.5},{type:et.SilverChest,weight:.5}]}};class ue{constructor(e,n,r,a){O(this,"name");O(this,"type");O(this,"level");O(this,"individualStrength");O(this,"maxHealth");O(this,"health");O(this,"ability");O(this,"status",[]);O(this,"pack",[]);O(this,"actions");this.name=e,this.type=n,this.level=r,this.individualStrength=a;const c=dt[this.type].abilityCoeff,d=(v,y,C)=>{const w=Math.random()**.5;return v.base+v.growth*y*C*w};this.ability={str:d(c.str,r,a),int:d(c.int,r,a),con:d(c.con,r,a),siz:d(c.siz,r,a),app:d(c.app,r,a),dex:d(c.dex,r,a),armor:d(c.armor,r,a)},this.health=this.ability.con*10+this.ability.siz*5,this.maxHealth=this.health,this.actions=dt[this.type].actions}getRandomAction(){const e=Math.random(),n=this.actions.reduce((a,c)=>a+c.weight,0);let r=0;for(const a of this.actions)if(r+=a.weight,e<r/n)return te[a.actionType];return te[U.Dazed]}}class gt extends ue{constructor(n,r){n=n||"吴田所",r=r||q.Player;super(n,r,0,1);O(this,"log",[]);O(this,"tempLog",[]);O(this,"capturedMonster",[]);O(this,"isAtHome",!0)}getHealthDisplay(){return`hp: ${this.health.toFixed(2)} / ${this.maxHealth.toFixed(0)} + ${(1/100*this.maxHealth).toFixed(2)}/s`}updateHealthDisplay(){const n=document.getElementById("health-display");n&&(n.innerText=this.getHealthDisplay())}recoverHealth(n){this.health=Math.min(this.health+n,this.maxHealth)}levelup(){this.level++}addLog(n){this.log.push(n)}getLogs(){return this.log.join("<br>")}getLastNLog(n){return this.log.slice(-n).join("<br>")}addTempLog(n){this.tempLog.push(n)}getTempLogs(){return this.tempLog.join("<br>")}clearTempLogs(){this.tempLog=[]}joinTempLogs(){this.log.push(this.tempLog.join("<br>")),this.tempLog=[]}}function Y(){const t=document.getElementById("app");if(!t)throw new Error("无法找到挂载点 #app");return t}class Pt extends ce{constructor(e){e=e||et.Unknown;const n=re[e];super(n.name,de(),$t.Consumable,e,n.rarity,n.description)}useItem(e){re[this.type].effect(e),e.pack=e.pack.filter(n=>n.uuid!==this.uuid)}}function He(t){if(t in et)return new Pt(t);if(t in Dt)return new fe(t);throw new Error("Invalid item type")}class Re extends ue{constructor(n,r,a,c){n=n||"怪物",r=r||q.Slime,a=a||1,c=c||1;super(n,r,a,c);O(this,"description");O(this,"dropItems");this.dropItems=dt[r].dropItems,this.description=dt[r].description}randomDropItem(){const n=this.dropItems[Math.floor(Math.random()*this.dropItems.length)].type;return He(n)}}function It(t,e){return(t.str*e.str+t.dex*e.dex+t.int*e.int+t.con*e.con+t.siz*e.siz+t.app*e.app)*Math.random()}function Tt(t,e){return t*(25/(e+25))}function Be(t,e,n,r){const a=It(n.coeff,t.ability),c=It(r.coeff,e.ability);if(t.addTempLog(t.name+"使用了"+n.name+'掷出了<span style="color: blue;">'+Math.round(a)+"</span>，"+e.name+"使用了"+r.name+'掷出了<span style="color: orange;">'+Math.round(c)+"</span>"),a>=c){const d=Tt(a,e.ability.armor);e.health-=d,t.addTempLog(t.name+"使用了"+n.name+"弹开了"+e.name+"的"+r.name+"(attack vs attack)"),t.addTempLog(n.messageGenerator(t,e,V.Success)+'造成了<span style="color: red;">'+Math.round(d)+"</span>点伤害"),n.extraEffect&&n.extraEffect(t,e)}else{const d=Tt(c,t.ability.armor);t.health-=d,t.addTempLog(e.name+"使用了"+r.name+"弹开了"+t.name+"的"+n.name+"(attack vs attack)"),t.addTempLog(r.messageGenerator(e,t,V.Success)+'造成了<span style="color: red;">'+Math.round(d)+"</span>点伤害"),r.extraEffect&&r.extraEffect(e,t)}}function ze(t,e,n,r){let a,c,d;r.category===N.NoAction?(a=t,c=e,d=n):(a=e,c=t,d=r);const v=It(d.coeff,a.ability);t.addTempLog(a.name+"使用了"+d.name+'掷出了<span style="color: blue;">'+Math.round(v)+"</span>"),t.addTempLog(c.name+"被打了个措手不及(attack vs none)");const y=Tt(v,c.ability.armor);c.health-=y,t.addTempLog(d.messageGenerator(a,c,V.Success)+'造成了<span style="color: red;">'+Math.round(y)+"</span>点伤害"),d.extraEffect&&d.extraEffect(a,c)}function Fe(t,e,n,r){n.category===N.Attack&&r.category===N.Attack&&Be(t,e,n,r),(n.category===N.Attack&&r.category===N.NoAction||n.category===N.NoAction&&r.category===N.Attack)&&ze(t,e,n,r)}function Ge(t,e){return t.health<=0?(t.addLog(t.name+"撑不住了"),"die"):e.health<1?(t.addLog(t.name+"击败了"+e.name),"win"):"continue"}function le(t,e,n){function r(a,c){return c.category===N.Attack?a.name+"看起来要"+c.name+"了":c.category===N.NoAction?a.name+"看起来还没反应过来":a.name+"看起来要"+c.name+"了"}return Math.random()*t.ability.dex>Math.random()*e.ability.dex?Math.random()*t.ability.int>Math.random()*e.ability.int?r(e,n):r(e,e.getRandomAction()):"你来不及观察"+e.name+"的行动"}var M;(function(t){t[t.PLAIN_TO_CLASS=0]="PLAIN_TO_CLASS",t[t.CLASS_TO_PLAIN=1]="CLASS_TO_PLAIN",t[t.CLASS_TO_CLASS=2]="CLASS_TO_CLASS"})(M||(M={}));var Ue=function(){function t(){this._typeMetadatas=new Map,this._transformMetadatas=new Map,this._exposeMetadatas=new Map,this._excludeMetadatas=new Map,this._ancestorsMap=new Map}return t.prototype.addTypeMetadata=function(e){this._typeMetadatas.has(e.target)||this._typeMetadatas.set(e.target,new Map),this._typeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.addTransformMetadata=function(e){this._transformMetadatas.has(e.target)||this._transformMetadatas.set(e.target,new Map),this._transformMetadatas.get(e.target).has(e.propertyName)||this._transformMetadatas.get(e.target).set(e.propertyName,[]),this._transformMetadatas.get(e.target).get(e.propertyName).push(e)},t.prototype.addExposeMetadata=function(e){this._exposeMetadatas.has(e.target)||this._exposeMetadatas.set(e.target,new Map),this._exposeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.addExcludeMetadata=function(e){this._excludeMetadatas.has(e.target)||this._excludeMetadatas.set(e.target,new Map),this._excludeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.findTransformMetadatas=function(e,n,r){return this.findMetadatas(this._transformMetadatas,e,n).filter(function(a){return!a.options||a.options.toClassOnly===!0&&a.options.toPlainOnly===!0?!0:a.options.toClassOnly===!0?r===M.CLASS_TO_CLASS||r===M.PLAIN_TO_CLASS:a.options.toPlainOnly===!0?r===M.CLASS_TO_PLAIN:!0})},t.prototype.findExcludeMetadata=function(e,n){return this.findMetadata(this._excludeMetadatas,e,n)},t.prototype.findExposeMetadata=function(e,n){return this.findMetadata(this._exposeMetadatas,e,n)},t.prototype.findExposeMetadataByCustomName=function(e,n){return this.getExposedMetadatas(e).find(function(r){return r.options&&r.options.name===n})},t.prototype.findTypeMetadata=function(e,n){return this.findMetadata(this._typeMetadatas,e,n)},t.prototype.getStrategy=function(e){var n=this._excludeMetadatas.get(e),r=n&&n.get(void 0),a=this._exposeMetadatas.get(e),c=a&&a.get(void 0);return r&&c||!r&&!c?"none":r?"excludeAll":"exposeAll"},t.prototype.getExposedMetadatas=function(e){return this.getMetadata(this._exposeMetadatas,e)},t.prototype.getExcludedMetadatas=function(e){return this.getMetadata(this._excludeMetadatas,e)},t.prototype.getExposedProperties=function(e,n){return this.getExposedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?n===M.CLASS_TO_CLASS||n===M.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?n===M.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},t.prototype.getExcludedProperties=function(e,n){return this.getExcludedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?n===M.CLASS_TO_CLASS||n===M.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?n===M.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},t.prototype.clear=function(){this._typeMetadatas.clear(),this._exposeMetadatas.clear(),this._excludeMetadatas.clear(),this._ancestorsMap.clear()},t.prototype.getMetadata=function(e,n){var r=e.get(n),a;r&&(a=Array.from(r.values()).filter(function(_){return _.propertyName!==void 0}));for(var c=[],d=0,v=this.getAncestors(n);d<v.length;d++){var y=v[d],C=e.get(y);if(C){var w=Array.from(C.values()).filter(function(_){return _.propertyName!==void 0});c.push.apply(c,w)}}return c.concat(a||[])},t.prototype.findMetadata=function(e,n,r){var a=e.get(n);if(a){var c=a.get(r);if(c)return c}for(var d=0,v=this.getAncestors(n);d<v.length;d++){var y=v[d],C=e.get(y);if(C){var w=C.get(r);if(w)return w}}},t.prototype.findMetadatas=function(e,n,r){var a=e.get(n),c;a&&(c=a.get(r));for(var d=[],v=0,y=this.getAncestors(n);v<y.length;v++){var C=y[v],w=e.get(C);w&&w.has(r)&&d.push.apply(d,w.get(r))}return d.slice().reverse().concat((c||[]).slice().reverse())},t.prototype.getAncestors=function(e){if(!e)return[];if(!this._ancestorsMap.has(e)){for(var n=[],r=Object.getPrototypeOf(e.prototype.constructor);typeof r.prototype<"u";r=Object.getPrototypeOf(r.prototype.constructor))n.push(r);this._ancestorsMap.set(e,n)}return this._ancestorsMap.get(e)},t}(),F=new Ue;function We(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof window<"u")return window;if(typeof self<"u")return self}function qe(t){return t!==null&&typeof t=="object"&&typeof t.then=="function"}var ie=function(t,e,n){if(n||arguments.length===2)for(var r=0,a=e.length,c;r<a;r++)(c||!(r in e))&&(c||(c=Array.prototype.slice.call(e,0,r)),c[r]=e[r]);return t.concat(c||Array.prototype.slice.call(e))};function Je(t){var e=new t;return!(e instanceof Set)&&!("push"in e)?[]:e}var ot=function(){function t(e,n){this.transformationType=e,this.options=n,this.recursionStack=new Set}return t.prototype.transform=function(e,n,r,a,c,d){var v=this;if(d===void 0&&(d=0),Array.isArray(n)||n instanceof Set){var y=a&&this.transformationType===M.PLAIN_TO_CLASS?Je(a):[];return n.forEach(function(L,R){var B=e?e[R]:void 0;if(!v.options.enableCircularCheck||!v.isCircular(L)){var j=void 0;if(typeof r!="function"&&r&&r.options&&r.options.discriminator&&r.options.discriminator.property&&r.options.discriminator.subTypes){if(v.transformationType===M.PLAIN_TO_CLASS){j=r.options.discriminator.subTypes.find(function(Q){return Q.name===L[r.options.discriminator.property]});var W={newObject:y,object:L,property:void 0},A=r.typeFunction(W);j===void 0?j=A:j=j.value,r.options.keepDiscriminatorProperty||delete L[r.options.discriminator.property]}v.transformationType===M.CLASS_TO_CLASS&&(j=L.constructor),v.transformationType===M.CLASS_TO_PLAIN&&(L[r.options.discriminator.property]=r.options.discriminator.subTypes.find(function(Q){return Q.value===L.constructor}).name)}else j=r;var H=v.transform(B,L,j,void 0,L instanceof Map,d+1);y instanceof Set?y.add(H):y.push(H)}else v.transformationType===M.CLASS_TO_CLASS&&(y instanceof Set?y.add(L):y.push(L))}),y}else{if(r===String&&!c)return n==null?n:String(n);if(r===Number&&!c)return n==null?n:Number(n);if(r===Boolean&&!c)return n==null?n:!!n;if((r===Date||n instanceof Date)&&!c)return n instanceof Date?new Date(n.valueOf()):n==null?n:new Date(n);if(We().Buffer&&(r===Buffer||n instanceof Buffer)&&!c)return n==null?n:Buffer.from(n);if(qe(n)&&!c)return new Promise(function(L,R){n.then(function(B){return L(v.transform(void 0,B,r,void 0,void 0,d+1))},R)});if(!c&&n!==null&&typeof n=="object"&&typeof n.then=="function")return n;if(typeof n=="object"&&n!==null){!r&&n.constructor!==Object&&(!Array.isArray(n)&&n.constructor===Array||(r=n.constructor)),!r&&e&&(r=e.constructor),this.options.enableCircularCheck&&this.recursionStack.add(n);var C=this.getKeys(r,n,c),w=e||{};!e&&(this.transformationType===M.PLAIN_TO_CLASS||this.transformationType===M.CLASS_TO_CLASS)&&(c?w=new Map:r?w=new r:w={});for(var _=function(L){if(L==="__proto__"||L==="constructor")return"continue";var R=L,B=L,j=L;if(!m.options.ignoreDecorators&&r){if(m.transformationType===M.PLAIN_TO_CLASS){var W=F.findExposeMetadataByCustomName(r,L);W&&(j=W.propertyName,B=W.propertyName)}else if(m.transformationType===M.CLASS_TO_PLAIN||m.transformationType===M.CLASS_TO_CLASS){var W=F.findExposeMetadata(r,L);W&&W.options&&W.options.name&&(B=W.options.name)}}var A=void 0;m.transformationType===M.PLAIN_TO_CLASS?A=n[R]:n instanceof Map?A=n.get(R):n[R]instanceof Function?A=n[R]():A=n[R];var H=void 0,Q=A instanceof Map;if(r&&c)H=r;else if(r){var T=F.findTypeMetadata(r,j);if(T){var Mt={newObject:w,object:n,property:j},ut=T.typeFunction?T.typeFunction(Mt):T.reflectedType;T.options&&T.options.discriminator&&T.options.discriminator.property&&T.options.discriminator.subTypes?n[R]instanceof Array?H=T:(m.transformationType===M.PLAIN_TO_CLASS&&(H=T.options.discriminator.subTypes.find(function(J){if(A&&A instanceof Object&&T.options.discriminator.property in A)return J.name===A[T.options.discriminator.property]}),H===void 0?H=ut:H=H.value,T.options.keepDiscriminatorProperty||A&&A instanceof Object&&T.options.discriminator.property in A&&delete A[T.options.discriminator.property]),m.transformationType===M.CLASS_TO_CLASS&&(H=A.constructor),m.transformationType===M.CLASS_TO_PLAIN&&A&&(A[T.options.discriminator.property]=T.options.discriminator.subTypes.find(function(J){return J.value===A.constructor}).name)):H=ut,Q=Q||T.reflectedType===Map}else if(m.options.targetMaps)m.options.targetMaps.filter(function(J){return J.target===r&&!!J.properties[j]}).forEach(function(J){return H=J.properties[j]});else if(m.options.enableImplicitConversion&&m.transformationType===M.PLAIN_TO_CLASS){var lt=Reflect.getMetadata("design:type",r.prototype,j);lt&&(H=lt)}}var pt=Array.isArray(n[R])?m.getReflectedType(r,j):void 0,ht=e?e[R]:void 0;if(w.constructor.prototype){var mt=Object.getOwnPropertyDescriptor(w.constructor.prototype,B);if((m.transformationType===M.PLAIN_TO_CLASS||m.transformationType===M.CLASS_TO_CLASS)&&(mt&&!mt.set||w[B]instanceof Function))return"continue"}if(!m.options.enableCircularCheck||!m.isCircular(A)){var nt=m.transformationType===M.PLAIN_TO_CLASS?B:L,k=void 0;m.transformationType===M.CLASS_TO_PLAIN?(k=n[nt],k=m.applyCustomTransformations(k,r,nt,n,m.transformationType),k=n[nt]===k?A:k,k=m.transform(ht,k,H,pt,Q,d+1)):A===void 0&&m.options.exposeDefaultValues?k=w[B]:(k=m.transform(ht,A,H,pt,Q,d+1),k=m.applyCustomTransformations(k,r,nt,n,m.transformationType)),(k!==void 0||m.options.exposeUnsetFields)&&(w instanceof Map?w.set(B,k):w[B]=k)}else if(m.transformationType===M.CLASS_TO_CLASS){var k=A;k=m.applyCustomTransformations(k,r,L,n,m.transformationType),(k!==void 0||m.options.exposeUnsetFields)&&(w instanceof Map?w.set(B,k):w[B]=k)}},m=this,K=0,rt=C;K<rt.length;K++){var st=rt[K];_(st)}return this.options.enableCircularCheck&&this.recursionStack.delete(n),w}else return n}},t.prototype.applyCustomTransformations=function(e,n,r,a,c){var d=this,v=F.findTransformMetadatas(n,r,this.transformationType);return this.options.version!==void 0&&(v=v.filter(function(y){return y.options?d.checkVersion(y.options.since,y.options.until):!0})),this.options.groups&&this.options.groups.length?v=v.filter(function(y){return y.options?d.checkGroups(y.options.groups):!0}):v=v.filter(function(y){return!y.options||!y.options.groups||!y.options.groups.length}),v.forEach(function(y){e=y.transformFn({value:e,key:r,obj:a,type:c,options:d.options})}),e},t.prototype.isCircular=function(e){return this.recursionStack.has(e)},t.prototype.getReflectedType=function(e,n){if(e){var r=F.findTypeMetadata(e,n);return r?r.reflectedType:void 0}},t.prototype.getKeys=function(e,n,r){var a=this,c=F.getStrategy(e);c==="none"&&(c=this.options.strategy||"exposeAll");var d=[];if((c==="exposeAll"||r)&&(n instanceof Map?d=Array.from(n.keys()):d=Object.keys(n)),r)return d;if(this.options.ignoreDecorators&&this.options.excludeExtraneousValues&&e){var v=F.getExposedProperties(e,this.transformationType),y=F.getExcludedProperties(e,this.transformationType);d=ie(ie([],v,!0),y,!0)}if(!this.options.ignoreDecorators&&e){var v=F.getExposedProperties(e,this.transformationType);this.transformationType===M.PLAIN_TO_CLASS&&(v=v.map(function(_){var m=F.findExposeMetadata(e,_);return m&&m.options&&m.options.name?m.options.name:_})),this.options.excludeExtraneousValues?d=v:d=d.concat(v);var C=F.getExcludedProperties(e,this.transformationType);C.length>0&&(d=d.filter(function(_){return!C.includes(_)})),this.options.version!==void 0&&(d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options?!0:a.checkVersion(m.options.since,m.options.until)})),this.options.groups&&this.options.groups.length?d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options?!0:a.checkGroups(m.options.groups)}):d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options||!m.options.groups||!m.options.groups.length})}return this.options.excludePrefixes&&this.options.excludePrefixes.length&&(d=d.filter(function(w){return a.options.excludePrefixes.every(function(_){return w.substr(0,_.length)!==_})})),d=d.filter(function(w,_,m){return m.indexOf(w)===_}),d},t.prototype.checkVersion=function(e,n){var r=!0;return r&&e&&(r=this.options.version>=e),r&&n&&(r=this.options.version<n),r},t.prototype.checkGroups=function(e){return e?this.options.groups.some(function(n){return e.includes(n)}):!0},t}(),at={enableCircularCheck:!1,enableImplicitConversion:!1,excludeExtraneousValues:!1,excludePrefixes:void 0,exposeDefaultValues:!1,exposeUnsetFields:!0,groups:void 0,ignoreDecorators:!1,strategy:void 0,targetMaps:void 0,version:void 0},G=function(){return G=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},G.apply(this,arguments)},Ze=function(){function t(){}return t.prototype.instanceToPlain=function(e,n){var r=new ot(M.CLASS_TO_PLAIN,G(G({},at),n));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},t.prototype.classToPlainFromExist=function(e,n,r){var a=new ot(M.CLASS_TO_PLAIN,G(G({},at),r));return a.transform(n,e,void 0,void 0,void 0,void 0)},t.prototype.plainToInstance=function(e,n,r){var a=new ot(M.PLAIN_TO_CLASS,G(G({},at),r));return a.transform(void 0,n,e,void 0,void 0,void 0)},t.prototype.plainToClassFromExist=function(e,n,r){var a=new ot(M.PLAIN_TO_CLASS,G(G({},at),r));return a.transform(e,n,void 0,void 0,void 0,void 0)},t.prototype.instanceToInstance=function(e,n){var r=new ot(M.CLASS_TO_CLASS,G(G({},at),n));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},t.prototype.classToClassFromExist=function(e,n,r){var a=new ot(M.CLASS_TO_CLASS,G(G({},at),r));return a.transform(n,e,void 0,void 0,void 0,void 0)},t.prototype.serialize=function(e,n){return JSON.stringify(this.instanceToPlain(e,n))},t.prototype.deserialize=function(e,n,r){var a=JSON.parse(n);return this.plainToInstance(e,a,r)},t.prototype.deserializeArray=function(e,n,r){var a=JSON.parse(n);return this.plainToInstance(e,a,r)},t}(),pe=new Ze;function Qe(t,e){return pe.instanceToPlain(t,e)}function Xe(t,e,n){return pe.plainToInstance(t,e,n)}let Ot=-1,At=-1;function Nt(t){Ot!==-1&&clearInterval(Ot),At!==-1&&clearInterval(At),Ot=setInterval(()=>{t.isAtHome&&(t.recoverHealth(1/100*t.maxHealth),t.updateHealthDisplay())},1e3),At=setInterval(()=>{t.isAtHome&&ft(t)},1e4)}function ft(t){const e=Qe(t);localStorage.setItem("playerData",JSON.stringify(e))}function Ye(){const t=localStorage.getItem("playerData");if(!t)throw new Error("No player data found");const e=JSON.parse(t),n=Xe(gt,e,{enableImplicitConversion:!0});return Nt(n),n}function Ke(t,e){var v,y;const n=Y(),r=e.getRandomAction(),a=le(t,e,r),c=t.getRandomAction(),d=t.getRandomAction();n.innerHTML=`
  <div class="container mt-4">
    <h2 class="text-center mb-3">战斗</h2>

    <!-- 敌人信息 -->
    <div class="card mb-3">
      <div class="card-header bg-danger text-white">
        <h4 class="mb-0">${e.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text fst-italic">"${e.description}"</p>
        <p class="card-text">${a}</p>
        <p class="card-text">HP: <strong>${Math.ceil(e.health)}</strong></p>
      </div>
    </div>

    <!-- 分割线 -->
    <hr>

    <!-- 玩家信息 -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white">
        <h4 class="mb-0">${t.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text">HP: <strong>${Math.ceil(t.health)}</strong></p>
      </div>
    </div>

    <!-- 动作选择 -->
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${c.name}</h5>
            <p class="card-text">${c.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${d.name}</h5>
            <p class="card-text">${d.description}</p>
          </div>
        </div>
      </div>
    </div>

`,(v=document.getElementById("action1-btn"))==null||v.addEventListener("click",()=>{yt(t,e,c,r)}),(y=document.getElementById("action2-btn"))==null||y.addEventListener("click",()=>{yt(t,e,d,r)})}function yt(t,e,n,r){var C,w;const a=Y();Fe(t,e,n,r);const c=Ge(t,e);if(c==="die"){oe(t,e,!1);return}else if(c==="win"){oe(t,e,!0);return}r=e.getRandomAction();const d=le(t,e,r),v=t.getRandomAction(),y=t.getRandomAction();a.innerHTML=`
  <div class="container mt-4">
    <h2 class="text-center mb-3">战斗</h2>

    <!-- 敌人信息 -->
    <div class="card mb-3">
      <div class="card-header bg-danger text-white">
        <h4 class="mb-0">${e.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text fst-italic">"${e.description}"</p>
        <p class="card-text">${d}</p>
        <p class="card-text">HP: <strong>${Math.ceil(e.health)}</strong></p>
      </div>
    </div>

    <!-- 分割线 -->
    <hr>

    <!-- 玩家信息 -->
    <div class="card mb-4">
      <div class="card-header bg-success text-white">
        <h4 class="mb-0">${t.name}</h4>
      </div>
      <div class="card-body">
        <p class="card-text">HP: <strong>${Math.ceil(t.health)}</strong></p>
      </div>
    </div>

    <!-- 动作选择 -->
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${v.name}</h5>
            <p class="card-text">${v.description}</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">${y.name}</h5>
            <p class="card-text">${y.description}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 战斗记录 -->
    <div class="card">
      <div class="card-header">
        记录
      </div>
      <div class="card-body" id="log" style="max-height: 200px; overflow-y: auto;">
        ${t.getTempLogs()}
      </div>
    </div>
  </div>
`,(C=document.getElementById("action1-btn"))==null||C.addEventListener("click",()=>{yt(t,e,v,r)}),(w=document.getElementById("action2-btn"))==null||w.addEventListener("click",()=>{yt(t,e,y,r)})}function oe(t,e,n){var a;const r=Y();if(n){const c=e.randomDropItem();t.addLog(e.name+"掉落了<span style='color: gold;'>"+c.name+"</span>"),t.pack.push(c)}else t.health=1,t.addLog(t.name+"拼死从"+e.name+"的手中逃了出来，拖着残破的身躯，回到了城镇");r.innerHTML=`
  <div class="container mt-4">
    <div class="card text-center shadow">
      <div class="card-header bg-dark text-white">
        <h2 class="mb-0">战斗结束</h2>
      </div>
      <div class="card-body">
        <h4 class="card-title">
          ${t.name}
          ${n?'<span class="text-success">胜利</span>':'<span class="text-danger">失败</span>'}
        </h4>
        <hr>
        <h5>记录</h5>
        <div id="log" class="border rounded p-3" style="max-height: 250px; overflow-y: auto;">
          ${t.getTempLogs()}
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-primary" id="main-menu-btn">返回主菜单</button>
      </div>
    </div>
  </div>
`,t.clearTempLogs(),ft(t),(a=document.getElementById("main-menu-btn"))==null||a.addEventListener("click",()=>{wt(t)})}function Ve(t){let e=Object.values(q)[Math.floor(Math.random()*Object.values(q).length)];(e===q.Player||e===q.Player114514)&&(e=q.Wolf);const n=Math.floor(Math.random()*10)+1,r=Math.random()*2,a=new Re(dt[e].typeName,e,n,r);Ke(t,a)}function tn(){var e,n;const t=Y();t.innerHTML=`
    <h1>你是谁？</h1>
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" id="action1-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">普通人</h5>
            <p class="card-text">你是一个正准备去上班/上学的普通人</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" id="action2-btn" style="cursor: pointer;">
          <div class="card-body text-center">
            <h5 class="card-title">野兽仙贝</h5>
            <p class="card-text">你是野兽先辈，一番劳累过后，正准备返回自家天台晒日光浴</p>
          </div>
        </div>
      </div>
    </div>
  `,(e=document.getElementById("action1-btn"))==null||e.addEventListener("click",()=>{const r=new gt("吴田所",q.Player);Nt(r),bt(r)}),(n=document.getElementById("action2-btn"))==null||n.addEventListener("click",()=>{const r=new gt("田所*二",q.Player114514);Nt(r),bt(r)})}function bt(t){var a,c;const e=Y(),n=Math.floor(Math.random()*4);let r="";switch(n){case 0:r="<p>车 →→→ 你</p>";break;case 1:r="<p>你 ←←← 车</p>";break;case 2:r=`
      <p style="text-align: center;">  车</p>
      <p style="text-align: center;">  ↓</p>
      <p style="text-align: center;">  你</p>`;break;case 3:r=`
      <p style="text-align: center;">  你</p>
      <p style="text-align: center;">  ↑</p>
      <p style="text-align: center;">  车</p>`;break}e.innerHTML=`
  <h1>躲避大卡车</h1>
  <p>一辆卡车正在向你快速驶来，请选择躲避方向</p>
  ${r}
  <button id="left-btn">向左躲避</button>
  <button id="right-btn">向右躲避</button>
`,(a=document.getElementById("left-btn"))==null||a.addEventListener("click",()=>{Math.random()>.3?bt(t):ae(t)}),(c=document.getElementById("right-btn"))==null||c.addEventListener("click",()=>{Math.random()>.3?bt(t):ae(t)})}function ae(t){var n;const e=Y();e.innerHTML=`
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{en(t)})}function en(t){var n;const e=Y();e.innerHTML=`
    <h1>???</h1>
    <p>请输入你的名字</p>
    <input type="text" id="name-input" placeholder="${t.name}">
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{const a=document.getElementById("name-input").value.trim();a?(t.name=a,nn(t)):alert("请输入你的名字！")})}function nn(t){var n;const e=Y();e.innerHTML=`
    <h1>???</h1>
    <p>你睁开了眼睛，发现自己好像身处森林之中</p>
    <p>周围的一切都显得那么陌生，充满了异世界风情</p>
    <p>看着远处地上缓慢蠕动的史莱姆，你总算相信自己穿越了</p>
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{ft(t),wt(t)})}function wt(t){var n,r,a;const e=Y();t.isAtHome=!0,ft(t),console.log(t),e.innerHTML=`
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h2>${t.name} lv ${t.level}</h2>
      <div>${t.type===q.Player114514?"野兽":"人类"}</div>
      <div id="health-display" class="fs-4 mb-3">${t.getHealthDisplay()}</div>
    </div>
  </div>
  <div class="container mt-4">
    <h2 class="text-center mb-4">主菜单</h2>
    <div class="row g-3 justify-content-center">
      <div class="col-12 col-md-4">
        <button id="battle-btn" class="btn btn-primary w-100 py-3">${t.type===q.Player114514?"救世啊！":"战斗"}</button>
      </div>
      <div class="col-12 col-md-4">
        <button id="status-btn" class="btn btn-success w-100 py-3">状态</button>
      </div>
      <div class="col-12 col-md-4">
        <button id="restart-btn" class="btn btn-danger w-100 py-3">秽土转生</button>
      </div>
    </div>
    <div class="text-center mt-4">
      <button class="btn btn-info" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasRight" aria-controls="offcanvasRight">
        查看记录
      </button>
    </div>
  </div>

  <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasRight" aria-labelledby="offcanvasRightLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasRightLabel">记录</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
    </div>
    <div class="offcanvas-body">
      <div style="max-height: 60vh; overflow-y: auto;">
        <p>${t.getLastNLog(20)}</p>
      </div>
    </div>
  </div>
`,(n=document.getElementById("battle-btn"))==null||n.addEventListener("click",()=>{t.isAtHome=!1,Ve(t)}),(r=document.getElementById("status-btn"))==null||r.addEventListener("click",()=>{he(t)}),(a=document.getElementById("restart-btn"))==null||a.addEventListener("click",()=>{window.confirm("你确定要remake吗?")&&(localStorage.clear(),window.location.reload())})}function he(t){var n,r;const e=Y();e.innerHTML=`
  <div class="container mt-4">
    <h2 class="text-center mb-4">状态</h2>

    <!-- 宠物区域 -->
    <div class="row mb-4">
      <div class="col">
        <h4>${t.name} 的宠物</h4>
        <div id="pet" class="border rounded p-3 bg-light">
          ${t.capturedMonster.length>0?t.capturedMonster.map(a=>`
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold">${a.name}</span>
                  <span class="text-muted">Lv. ${a.level}</span>
                </div>
              `).join(""):'<p class="text-muted">暂无宠物</p>'}
        </div>
      </div>
    </div>

    <!-- 背包区域 -->
    <div class="row mb-4">
      <div class="col">
        <h4>${t.name} 的背包</h4>
        <div id="pack" class="d-flex flex-wrap gap-2">
          ${t.pack.length>0?t.pack.map(a=>{const c=a instanceof Pt?"btn-success":"btn-secondary";return`<button id="use-btn${a.uuid}" class="btn ${c}">${a.name}</button>`}).join(""):'<p class="text-muted">背包为空</p>'}
        </div>
      </div>
    </div>

    <!-- 返回主菜单按钮 -->
    <div class="text-center">
      <button id="back-btn" class="btn btn-primary">返回主菜单</button>
    </div>
  </div>
`,(n=document.getElementById("back-btn"))==null||n.addEventListener("click",()=>{wt(t)});for(const a of t.pack)a instanceof Pt&&((r=document.getElementById(`use-btn${a.uuid}`))==null||r.addEventListener("click",()=>{a.useItem(t),t.addLog(t.name+"使用了"+a.name),ft(t),he(t)}))}document.addEventListener("DOMContentLoaded",()=>{let t;try{t=Ye()}catch(e){console.log(e),localStorage.clear(),tn();return}wt(t)});
