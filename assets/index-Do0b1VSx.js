var _e=Object.defineProperty;var Ae=(t,e,n)=>e in t?_e(t,e,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[e]=n;var L=(t,e,n)=>Ae(t,typeof e!="symbol"?e+"":e,n);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const c of a)if(c.type==="childList")for(const d of c.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&r(d)}).observe(document,{childList:!0,subtree:!0});function n(a){const c={};return a.integrity&&(c.integrity=a.integrity),a.referrerPolicy&&(c.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?c.credentials="include":a.crossOrigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function r(a){if(a.ep)return;a.ep=!0;const c=n(a);fetch(a.href,c)}})();var Gt=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},Ut={};/*! *****************************************************************************
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
***************************************************************************** */var Wt;function Le(){if(Wt)return Ut;Wt=1;var t;return function(e){(function(n){var r=typeof globalThis=="object"?globalThis:typeof Gt=="object"?Gt:typeof self=="object"?self:typeof this=="object"?this:g(),a=c(e);typeof r.Reflect<"u"&&(a=c(r.Reflect,a)),n(a,r),typeof r.Reflect>"u"&&(r.Reflect=e);function c(C,w){return function(_,m){Object.defineProperty(C,_,{configurable:!0,writable:!0,value:m}),w&&w(_,m)}}function d(){try{return Function("return this;")()}catch{}}function v(){try{return(0,eval)("(function() { return this; })()")}catch{}}function g(){return d()||v()}})(function(n,r){var a=Object.prototype.hasOwnProperty,c=typeof Symbol=="function",d=c&&typeof Symbol.toPrimitive<"u"?Symbol.toPrimitive:"@@toPrimitive",v=c&&typeof Symbol.iterator<"u"?Symbol.iterator:"@@iterator",g=typeof Object.create=="function",C={__proto__:[]}instanceof Array,w=!g&&!C,_={create:g?function(){return St(Object.create(null))}:C?function(){return St({__proto__:null})}:function(){return St({})},has:w?function(i,o){return a.call(i,o)}:function(i,o){return o in i},get:w?function(i,o){return a.call(i,o)?i[o]:void 0}:function(i,o){return i[o]}},m=Object.getPrototypeOf(Function),X=typeof Map=="function"&&typeof Map.prototype.entries=="function"?Map:be(),et=typeof Set=="function"&&typeof Set.prototype.entries=="function"?Set:we(),ot=typeof WeakMap=="function"?WeakMap:xe(),A=c?Symbol.for("@reflect-metadata:registry"):void 0,D=ve(),H=ye(D);function j(i,o,s,f){if(b(s)){if(!$t(i))throw new TypeError;if(!jt(o))throw new TypeError;return ut(i,o)}else{if(!$t(i))throw new TypeError;if(!N(o))throw new TypeError;if(!N(f)&&!b(f)&&!nt(f))throw new TypeError;return nt(f)&&(f=void 0),s=Z(s),lt(i,o,s,f)}}n("decorate",j);function W(i,o){function s(f,y){if(!N(f))throw new TypeError;if(!b(y)&&!he(y))throw new TypeError;Ct(i,o,f,y)}return s}n("metadata",W);function O(i,o,s,f){if(!N(s))throw new TypeError;return b(f)||(f=Z(f)),Ct(i,o,s,f)}n("defineMetadata",O);function R(i,o,s){if(!N(o))throw new TypeError;return b(s)||(s=Z(s)),tt(i,o,s)}n("hasMetadata",R);function K(i,o,s){if(!N(o))throw new TypeError;return b(s)||(s=Z(s)),k(i,o,s)}n("hasOwnMetadata",K);function T(i,o,s){if(!N(o))throw new TypeError;return b(s)||(s=Z(s)),q(i,o,s)}n("getMetadata",T);function wt(i,o,s){if(!N(o))throw new TypeError;return b(s)||(s=Z(s)),It(i,o,s)}n("getOwnMetadata",wt);function ct(i,o){if(!N(i))throw new TypeError;return b(o)||(o=Z(o)),Et(i,o)}n("getMetadataKeys",ct);function dt(i,o){if(!N(i))throw new TypeError;return b(o)||(o=Z(o)),Pt(i,o)}n("getOwnMetadataKeys",dt);function ft(i,o,s){if(!N(o))throw new TypeError;if(b(s)||(s=Z(s)),!N(o))throw new TypeError;b(s)||(s=Z(s));var f=at(o,s,!1);return b(f)?!1:f.OrdinaryDeleteMetadata(i,o,s)}n("deleteMetadata",ft);function ut(i,o){for(var s=i.length-1;s>=0;--s){var f=i[s],y=f(o);if(!b(y)&&!nt(y)){if(!jt(y))throw new TypeError;o=y}}return o}function lt(i,o,s,f){for(var y=i.length-1;y>=0;--y){var E=i[y],$=E(o,s,f);if(!b($)&&!nt($)){if(!N($))throw new TypeError;f=$}}return f}function tt(i,o,s){var f=k(i,o,s);if(f)return!0;var y=Mt(o);return nt(y)?!1:tt(i,y,s)}function k(i,o,s){var f=at(o,s,!1);return b(f)?!1:Nt(f.OrdinaryHasOwnMetadata(i,o,s))}function q(i,o,s){var f=k(i,o,s);if(f)return It(i,o,s);var y=Mt(o);if(!nt(y))return q(i,y,s)}function It(i,o,s){var f=at(o,s,!1);if(!b(f))return f.OrdinaryGetOwnMetadata(i,o,s)}function Ct(i,o,s,f){var y=at(s,f,!0);y.OrdinaryDefineOwnMetadata(i,o,s,f)}function Et(i,o){var s=Pt(i,o),f=Mt(i);if(f===null)return s;var y=Et(f,o);if(y.length<=0)return s;if(s.length<=0)return y;for(var E=new et,$=[],M=0,u=s;M<u.length;M++){var l=u[M],p=E.has(l);p||(E.add(l),$.push(l))}for(var h=0,S=y;h<S.length;h++){var l=S[h],p=E.has(l);p||(E.add(l),$.push(l))}return $}function Pt(i,o){var s=at(i,o,!1);return s?s.OrdinaryOwnMetadataKeys(i,o):[]}function Tt(i){if(i===null)return 1;switch(typeof i){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return i===null?1:6;default:return 6}}function b(i){return i===void 0}function nt(i){return i===null}function fe(i){return typeof i=="symbol"}function N(i){return typeof i=="object"?i!==null:typeof i=="function"}function ue(i,o){switch(Tt(i)){case 0:return i;case 1:return i;case 2:return i;case 3:return i;case 4:return i;case 5:return i}var s="string",f=Rt(i,d);if(f!==void 0){var y=f.call(i,s);if(N(y))throw new TypeError;return y}return le(i)}function le(i,o){var s,f,y;{var E=i.toString;if(pt(E)){var f=E.call(i);if(!N(f))return f}var s=i.valueOf;if(pt(s)){var f=s.call(i);if(!N(f))return f}}throw new TypeError}function Nt(i){return!!i}function pe(i){return""+i}function Z(i){var o=ue(i);return fe(o)?o:pe(o)}function $t(i){return Array.isArray?Array.isArray(i):i instanceof Object?i instanceof Array:Object.prototype.toString.call(i)==="[object Array]"}function pt(i){return typeof i=="function"}function jt(i){return typeof i=="function"}function he(i){switch(Tt(i)){case 3:return!0;case 4:return!0;default:return!1}}function xt(i,o){return i===o||i!==i&&o!==o}function Rt(i,o){var s=i[o];if(s!=null){if(!pt(s))throw new TypeError;return s}}function Dt(i){var o=Rt(i,v);if(!pt(o))throw new TypeError;var s=o.call(i);if(!N(s))throw new TypeError;return s}function Ht(i){return i.value}function Bt(i){var o=i.next();return o.done?!1:o}function zt(i){var o=i.return;o&&o.call(i)}function Mt(i){var o=Object.getPrototypeOf(i);if(typeof i!="function"||i===m||o!==m)return o;var s=i.prototype,f=s&&Object.getPrototypeOf(s);if(f==null||f===Object.prototype)return o;var y=f.constructor;return typeof y!="function"||y===i?o:y}function me(){var i;!b(A)&&typeof r.Reflect<"u"&&!(A in r.Reflect)&&typeof r.Reflect.defineMetadata=="function"&&(i=ge(r.Reflect));var o,s,f,y=new ot,E={registerProvider:$,getProvider:u,setProvider:p};return E;function $(h){if(!Object.isExtensible(E))throw new Error("Cannot add provider to a frozen registry.");switch(!0){case i===h:break;case b(o):o=h;break;case o===h:break;case b(s):s=h;break;case s===h:break;default:f===void 0&&(f=new et),f.add(h);break}}function M(h,S){if(!b(o)){if(o.isProviderFor(h,S))return o;if(!b(s)){if(s.isProviderFor(h,S))return o;if(!b(f))for(var I=Dt(f);;){var P=Bt(I);if(!P)return;var J=Ht(P);if(J.isProviderFor(h,S))return zt(I),J}}}if(!b(i)&&i.isProviderFor(h,S))return i}function u(h,S){var I=y.get(h),P;return b(I)||(P=I.get(S)),b(P)&&(P=M(h,S),b(P)||(b(I)&&(I=new X,y.set(h,I)),I.set(S,P))),P}function l(h){if(b(h))throw new TypeError;return o===h||s===h||!b(f)&&f.has(h)}function p(h,S,I){if(!l(I))throw new Error("Metadata provider not registered.");var P=u(h,S);if(P!==I){if(!b(P))return!1;var J=y.get(h);b(J)&&(J=new X,y.set(h,J)),J.set(S,I)}return!0}}function ve(){var i;return!b(A)&&N(r.Reflect)&&Object.isExtensible(r.Reflect)&&(i=r.Reflect[A]),b(i)&&(i=me()),!b(A)&&N(r.Reflect)&&Object.isExtensible(r.Reflect)&&Object.defineProperty(r.Reflect,A,{enumerable:!1,configurable:!1,writable:!1,value:i}),i}function ye(i){var o=new ot,s={isProviderFor:function(l,p){var h=o.get(l);return b(h)?!1:h.has(p)},OrdinaryDefineOwnMetadata:$,OrdinaryHasOwnMetadata:y,OrdinaryGetOwnMetadata:E,OrdinaryOwnMetadataKeys:M,OrdinaryDeleteMetadata:u};return D.registerProvider(s),s;function f(l,p,h){var S=o.get(l),I=!1;if(b(S)){if(!h)return;S=new X,o.set(l,S),I=!0}var P=S.get(p);if(b(P)){if(!h)return;if(P=new X,S.set(p,P),!i.setProvider(l,p,s))throw S.delete(p),I&&o.delete(l),new Error("Wrong provider for target.")}return P}function y(l,p,h){var S=f(p,h,!1);return b(S)?!1:Nt(S.has(l))}function E(l,p,h){var S=f(p,h,!1);if(!b(S))return S.get(l)}function $(l,p,h,S){var I=f(h,S,!0);I.set(l,p)}function M(l,p){var h=[],S=f(l,p,!1);if(b(S))return h;for(var I=S.keys(),P=Dt(I),J=0;;){var Ft=Bt(P);if(!Ft)return h.length=J,h;var Me=Ht(Ft);try{h[J]=Me}catch(Se){try{zt(P)}finally{throw Se}}J++}}function u(l,p,h){var S=f(p,h,!1);if(b(S)||!S.delete(l))return!1;if(S.size===0){var I=o.get(p);b(I)||(I.delete(h),I.size===0&&o.delete(I))}return!0}}function ge(i){var o=i.defineMetadata,s=i.hasOwnMetadata,f=i.getOwnMetadata,y=i.getOwnMetadataKeys,E=i.deleteMetadata,$=new ot,M={isProviderFor:function(u,l){var p=$.get(u);return!b(p)&&p.has(l)?!0:y(u,l).length?(b(p)&&(p=new et,$.set(u,p)),p.add(l),!0):!1},OrdinaryDefineOwnMetadata:o,OrdinaryHasOwnMetadata:s,OrdinaryGetOwnMetadata:f,OrdinaryOwnMetadataKeys:y,OrdinaryDeleteMetadata:E};return M}function at(i,o,s){var f=D.getProvider(i,o);if(!b(f))return f;if(s){if(D.setProvider(i,o,H))return H;throw new Error("Illegal state.")}}function be(){var i={},o=[],s=function(){function M(u,l,p){this._index=0,this._keys=u,this._values=l,this._selector=p}return M.prototype["@@iterator"]=function(){return this},M.prototype[v]=function(){return this},M.prototype.next=function(){var u=this._index;if(u>=0&&u<this._keys.length){var l=this._selector(this._keys[u],this._values[u]);return u+1>=this._keys.length?(this._index=-1,this._keys=o,this._values=o):this._index++,{value:l,done:!1}}return{value:void 0,done:!0}},M.prototype.throw=function(u){throw this._index>=0&&(this._index=-1,this._keys=o,this._values=o),u},M.prototype.return=function(u){return this._index>=0&&(this._index=-1,this._keys=o,this._values=o),{value:u,done:!0}},M}(),f=function(){function M(){this._keys=[],this._values=[],this._cacheKey=i,this._cacheIndex=-2}return Object.defineProperty(M.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),M.prototype.has=function(u){return this._find(u,!1)>=0},M.prototype.get=function(u){var l=this._find(u,!1);return l>=0?this._values[l]:void 0},M.prototype.set=function(u,l){var p=this._find(u,!0);return this._values[p]=l,this},M.prototype.delete=function(u){var l=this._find(u,!1);if(l>=0){for(var p=this._keys.length,h=l+1;h<p;h++)this._keys[h-1]=this._keys[h],this._values[h-1]=this._values[h];return this._keys.length--,this._values.length--,xt(u,this._cacheKey)&&(this._cacheKey=i,this._cacheIndex=-2),!0}return!1},M.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=i,this._cacheIndex=-2},M.prototype.keys=function(){return new s(this._keys,this._values,y)},M.prototype.values=function(){return new s(this._keys,this._values,E)},M.prototype.entries=function(){return new s(this._keys,this._values,$)},M.prototype["@@iterator"]=function(){return this.entries()},M.prototype[v]=function(){return this.entries()},M.prototype._find=function(u,l){if(!xt(this._cacheKey,u)){this._cacheIndex=-1;for(var p=0;p<this._keys.length;p++)if(xt(this._keys[p],u)){this._cacheIndex=p;break}}return this._cacheIndex<0&&l&&(this._cacheIndex=this._keys.length,this._keys.push(u),this._values.push(void 0)),this._cacheIndex},M}();return f;function y(M,u){return M}function E(M,u){return u}function $(M,u){return[M,u]}}function we(){var i=function(){function o(){this._map=new X}return Object.defineProperty(o.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),o.prototype.has=function(s){return this._map.has(s)},o.prototype.add=function(s){return this._map.set(s,s),this},o.prototype.delete=function(s){return this._map.delete(s)},o.prototype.clear=function(){this._map.clear()},o.prototype.keys=function(){return this._map.keys()},o.prototype.values=function(){return this._map.keys()},o.prototype.entries=function(){return this._map.entries()},o.prototype["@@iterator"]=function(){return this.keys()},o.prototype[v]=function(){return this.keys()},o}();return i}function xe(){var i=16,o=_.create(),s=f();return function(){function u(){this._key=f()}return u.prototype.has=function(l){var p=y(l,!1);return p!==void 0?_.has(p,this._key):!1},u.prototype.get=function(l){var p=y(l,!1);return p!==void 0?_.get(p,this._key):void 0},u.prototype.set=function(l,p){var h=y(l,!0);return h[this._key]=p,this},u.prototype.delete=function(l){var p=y(l,!1);return p!==void 0?delete p[this._key]:!1},u.prototype.clear=function(){this._key=f()},u}();function f(){var u;do u="@@WeakMap@@"+M();while(_.has(o,u));return o[u]=!0,u}function y(u,l){if(!a.call(u,s)){if(!l)return;Object.defineProperty(u,s,{value:_.create()})}return u[s]}function E(u,l){for(var p=0;p<l;++p)u[p]=Math.random()*255|0;return u}function $(u){if(typeof Uint8Array=="function"){var l=new Uint8Array(u);return typeof crypto<"u"?crypto.getRandomValues(l):typeof msCrypto<"u"?msCrypto.getRandomValues(l):E(l,u),l}return E(new Array(u),u)}function M(){var u=$(i);u[6]=u[6]&79|64,u[8]=u[8]&191|128;for(var l="",p=0;p<i;++p){var h=u[p];(p===4||p===6||p===8)&&(l+="-"),h<16&&(l+="0"),l+=h.toString(16).toLowerCase()}return l}}function St(i){return i.__=void 0,delete i.__,i}})}(t||(t={})),Ut}Le();var U=(t=>(t[t.Common=0]="Common",t[t.Rare=1]="Rare",t[t.Epic=2]="Epic",t[t.Legendary=3]="Legendary",t))(U||{}),ht=(t=>(t.None="",t.Big="巨大的",t.Smelly="野兽先辈的",t))(ht||{}),Ot=(t=>(t.Head="head",t.Body="body",t.Hand="hand",t.Foot="foot",t))(Ot||{}),Y=(t=>(t.Player="player",t.Player114514="player114514",t.Slime="slime",t.Dragon="dragon",t.Wolf="wolf",t))(Y||{});const st={player:{typeName:"人类",description:"你",abilityCoeff:{str:{base:10,growth:1},int:{base:10,growth:1},con:{base:10,growth:1},siz:{base:10,growth:0},app:{base:10,growth:0},dex:{base:10,growth:1},armor:{base:0,growth:0}},actions:[{actionKey:"attackAction",weight:1},{actionKey:"captureAction",weight:.1}],dropItems:[]},player114514:{typeName:"野兽仙贝",description:"114514",abilityCoeff:{str:{base:10,growth:1},int:{base:10,growth:0},con:{base:15,growth:2},siz:{base:10,growth:1},app:{base:15,growth:0},dex:{base:10,growth:0},armor:{base:0,growth:0}},actions:[{actionKey:"powerfulDigAttackAction",weight:.1},{actionKey:"attackAction",weight:.9},{actionKey:"captureAction",weight:.1}],dropItems:[]},slime:{typeName:"史莱姆",description:"一种行动缓慢的软体生物，武器打上去没有什么手感",abilityCoeff:{str:{base:10,growth:1},int:{base:1,growth:0},con:{base:10,growth:1},siz:{base:5,growth:0},app:{base:1,growth:0},dex:{base:1,growth:1},armor:{base:50,growth:1}},actions:[{actionKey:"attackAction",weight:1},{actionKey:"dazedAction",weight:2}],dropItems:[{key:{category:"consumable",rarity:U.Common,key:"brokenChest"},weight:1},{key:{category:"consumable",rarity:U.Rare,key:"silverChest"},weight:.2}]},dragon:{typeName:"龙",description:"森林食物链的顶端",abilityCoeff:{str:{base:100,growth:10},int:{base:10,growth:1},con:{base:100,growth:10},siz:{base:100,growth:10},app:{base:10,growth:1},dex:{base:10,growth:5},armor:{base:50,growth:10}},actions:[{actionKey:"attackAction",weight:1}],dropItems:[{key:{category:"consumable",rarity:U.Rare,key:"silverChest"},weight:1}]},wolf:{typeName:"孤狼",description:"一匹行动敏捷的孤狼，对于普通人来说，它是一种危险的生物",abilityCoeff:{str:{base:15,growth:2},int:{base:3,growth:1},con:{base:10,growth:1},siz:{base:10,growth:1},app:{base:5,growth:0},dex:{base:20,growth:3},armor:{base:0,growth:1}},actions:[{actionKey:"biteAction",weight:1},{actionKey:"dazedAction",weight:.5}],dropItems:[{key:{category:"consumable",rarity:U.Common,key:"brokenChest"},weight:.5},{key:{category:"consumable",rarity:U.Rare,key:"silverChest"},weight:.5}]}};var Xt=(t=>(t.Poison="poison",t.Sleep="sleep",t.Stun="stun",t.Confuse="confuse",t.Paralyze="paralyze",t.Pain="pain",t))(Xt||{}),z=(t=>(t.Attack="attack",t.Defend="defend",t.Dodge="dodge",t.DexAction="dexAction",t.StrAction="strAction",t.IntAction="intAction",t.ConAction="conAction",t.SizAction="sizAction",t.AppAction="appAction",t.NoAction="noAction",t))(z||{}),V=(t=>(t.Success="success",t.Fail="fail",t.Miss="miss",t))(V||{});const Oe={dazedAction:{name:"失神",description:"愣了一下",type:z.NoAction,coeff:{str:0,int:0,con:0,siz:0,app:0,dex:0},messageGenerator:(t,e,n)=>`${t.name} 愣了一下，什么也没做`},attackAction:{name:"攻击",description:"用拳头或者用武器进行一般通过攻击",type:z.Attack,coeff:{str:1,int:0,con:0,siz:.5,app:0,dex:.5},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}攻击了${e.name}`:`${t.name}攻击了${e.name}，但是失败了`},powerfulDigAttackAction:{name:"狠狠地撅",description:"1！1！4！5！1！4！",type:z.Attack,coeff:{str:10,int:0,con:0,siz:10,app:10,dex:0},extraEffect:(t,e)=>{e.status.push({type:Xt.Pain,duration:10})},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}狠狠地撅了${e.name}一下，${e.name}痛苦难耐
// 哼哼啊啊啊啊啊啊啊啊啊啊 `:`${e.name}躲过了${t.name}的撅`},horizontalSlashAction:{name:"横劈",description:"以迅猛之势横劈出一刀",type:z.Attack,coeff:{str:4,int:0,con:0,siz:0,app:0,dex:2},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}以迅猛之势横劈出一刀`:`${e.name}躲过了${t.name}的横劈`},biteAction:{name:"撕咬",description:"用嘴撕咬，一种原始的攻击方式",type:z.Attack,coeff:{str:2,int:0,con:0,siz:1,app:0,dex:1},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}冲过来咬了${e.name}一口`:`${e.name}躲过了${t.name}的撕咬`},captureAction:{name:"尝试捕捉",description:"这不是神奇宝贝，你得用绞技而不是精灵球",type:z.Attack,coeff:{str:1,int:0,con:0,siz:0,app:0,dex:0},extraEffect:(t,e)=>{if(!(t instanceof mt))return;if(e.health<1){t.addLog(`${e.name}已经死了，无法捕获`);return}const n=t.ability.dex/e.ability.dex*(t.ability.siz/e.ability.siz)/(10*e.health/e.maxHealth),r=t.ability.str/e.ability.str*(t.ability.siz/e.ability.siz)/(10*e.health/e.maxHealth);Math.random()<r&&Math.random()<n?(e.health=.9,t.capturedMonster.push({name:e.name,level:e.level}),t.addLog(`你成功捕获了${e.name}`)):t.addLog(`你尝试捕获${e.name}，但是失败了`)},messageGenerator:(t,e,n)=>n===V.Success?`${t.name}尝试通过绞住${e.name}，让${e.name}失去行动力`:`${e.name}躲过了${t.name}的绞技`}};function qt(t){return Oe[t]}class Yt{constructor(e,n,r,a){L(this,"name");L(this,"type");L(this,"level");L(this,"individualStrength");L(this,"maxHealth");L(this,"health");L(this,"ability");L(this,"status",[]);L(this,"pack",[]);L(this,"actions");this.name=e,this.type=n,this.level=r,this.individualStrength=a;const c=st[this.type].abilityCoeff,d=(v,g,C)=>{const w=Math.random()**.5;return v.base+v.growth*g*C*w};this.ability={str:d(c.str,r,a),int:d(c.int,r,a),con:d(c.con,r,a),siz:d(c.siz,r,a),app:d(c.app,r,a),dex:d(c.dex,r,a),armor:d(c.armor,r,a)},this.health=this.ability.con*10+this.ability.siz*5,this.maxHealth=this.health,this.actions=st[this.type].actions}getRandomAction(){const e=Math.random(),n=this.actions.reduce((a,c)=>a+c.weight,0);let r=0;for(const a of this.actions)if(r+=a.weight,e<r/n)return qt(a.actionKey);return qt("dazedAction")}}var x;(function(t){t[t.PLAIN_TO_CLASS=0]="PLAIN_TO_CLASS",t[t.CLASS_TO_PLAIN=1]="CLASS_TO_PLAIN",t[t.CLASS_TO_CLASS=2]="CLASS_TO_CLASS"})(x||(x={}));var ke=function(){function t(){this._typeMetadatas=new Map,this._transformMetadatas=new Map,this._exposeMetadatas=new Map,this._excludeMetadatas=new Map,this._ancestorsMap=new Map}return t.prototype.addTypeMetadata=function(e){this._typeMetadatas.has(e.target)||this._typeMetadatas.set(e.target,new Map),this._typeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.addTransformMetadata=function(e){this._transformMetadatas.has(e.target)||this._transformMetadatas.set(e.target,new Map),this._transformMetadatas.get(e.target).has(e.propertyName)||this._transformMetadatas.get(e.target).set(e.propertyName,[]),this._transformMetadatas.get(e.target).get(e.propertyName).push(e)},t.prototype.addExposeMetadata=function(e){this._exposeMetadatas.has(e.target)||this._exposeMetadatas.set(e.target,new Map),this._exposeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.addExcludeMetadata=function(e){this._excludeMetadatas.has(e.target)||this._excludeMetadatas.set(e.target,new Map),this._excludeMetadatas.get(e.target).set(e.propertyName,e)},t.prototype.findTransformMetadatas=function(e,n,r){return this.findMetadatas(this._transformMetadatas,e,n).filter(function(a){return!a.options||a.options.toClassOnly===!0&&a.options.toPlainOnly===!0?!0:a.options.toClassOnly===!0?r===x.CLASS_TO_CLASS||r===x.PLAIN_TO_CLASS:a.options.toPlainOnly===!0?r===x.CLASS_TO_PLAIN:!0})},t.prototype.findExcludeMetadata=function(e,n){return this.findMetadata(this._excludeMetadatas,e,n)},t.prototype.findExposeMetadata=function(e,n){return this.findMetadata(this._exposeMetadatas,e,n)},t.prototype.findExposeMetadataByCustomName=function(e,n){return this.getExposedMetadatas(e).find(function(r){return r.options&&r.options.name===n})},t.prototype.findTypeMetadata=function(e,n){return this.findMetadata(this._typeMetadatas,e,n)},t.prototype.getStrategy=function(e){var n=this._excludeMetadatas.get(e),r=n&&n.get(void 0),a=this._exposeMetadatas.get(e),c=a&&a.get(void 0);return r&&c||!r&&!c?"none":r?"excludeAll":"exposeAll"},t.prototype.getExposedMetadatas=function(e){return this.getMetadata(this._exposeMetadatas,e)},t.prototype.getExcludedMetadatas=function(e){return this.getMetadata(this._excludeMetadatas,e)},t.prototype.getExposedProperties=function(e,n){return this.getExposedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?n===x.CLASS_TO_CLASS||n===x.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?n===x.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},t.prototype.getExcludedProperties=function(e,n){return this.getExcludedMetadatas(e).filter(function(r){return!r.options||r.options.toClassOnly===!0&&r.options.toPlainOnly===!0?!0:r.options.toClassOnly===!0?n===x.CLASS_TO_CLASS||n===x.PLAIN_TO_CLASS:r.options.toPlainOnly===!0?n===x.CLASS_TO_PLAIN:!0}).map(function(r){return r.propertyName})},t.prototype.clear=function(){this._typeMetadatas.clear(),this._exposeMetadatas.clear(),this._excludeMetadatas.clear(),this._ancestorsMap.clear()},t.prototype.getMetadata=function(e,n){var r=e.get(n),a;r&&(a=Array.from(r.values()).filter(function(_){return _.propertyName!==void 0}));for(var c=[],d=0,v=this.getAncestors(n);d<v.length;d++){var g=v[d],C=e.get(g);if(C){var w=Array.from(C.values()).filter(function(_){return _.propertyName!==void 0});c.push.apply(c,w)}}return c.concat(a||[])},t.prototype.findMetadata=function(e,n,r){var a=e.get(n);if(a){var c=a.get(r);if(c)return c}for(var d=0,v=this.getAncestors(n);d<v.length;d++){var g=v[d],C=e.get(g);if(C){var w=C.get(r);if(w)return w}}},t.prototype.findMetadatas=function(e,n,r){var a=e.get(n),c;a&&(c=a.get(r));for(var d=[],v=0,g=this.getAncestors(n);v<g.length;v++){var C=g[v],w=e.get(C);w&&w.has(r)&&d.push.apply(d,w.get(r))}return d.slice().reverse().concat((c||[]).slice().reverse())},t.prototype.getAncestors=function(e){if(!e)return[];if(!this._ancestorsMap.has(e)){for(var n=[],r=Object.getPrototypeOf(e.prototype.constructor);typeof r.prototype<"u";r=Object.getPrototypeOf(r.prototype.constructor))n.push(r);this._ancestorsMap.set(e,n)}return this._ancestorsMap.get(e)},t}(),F=new ke;function Ie(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof window<"u")return window;if(typeof self<"u")return self}function Ce(t){return t!==null&&typeof t=="object"&&typeof t.then=="function"}var Jt=function(t,e,n){if(n||arguments.length===2)for(var r=0,a=e.length,c;r<a;r++)(c||!(r in e))&&(c||(c=Array.prototype.slice.call(e,0,r)),c[r]=e[r]);return t.concat(c||Array.prototype.slice.call(e))};function Ee(t){var e=new t;return!(e instanceof Set)&&!("push"in e)?[]:e}var rt=function(){function t(e,n){this.transformationType=e,this.options=n,this.recursionStack=new Set}return t.prototype.transform=function(e,n,r,a,c,d){var v=this;if(d===void 0&&(d=0),Array.isArray(n)||n instanceof Set){var g=a&&this.transformationType===x.PLAIN_TO_CLASS?Ee(a):[];return n.forEach(function(A,D){var H=e?e[D]:void 0;if(!v.options.enableCircularCheck||!v.isCircular(A)){var j=void 0;if(typeof r!="function"&&r&&r.options&&r.options.discriminator&&r.options.discriminator.property&&r.options.discriminator.subTypes){if(v.transformationType===x.PLAIN_TO_CLASS){j=r.options.discriminator.subTypes.find(function(K){return K.name===A[r.options.discriminator.property]});var W={newObject:g,object:A,property:void 0},O=r.typeFunction(W);j===void 0?j=O:j=j.value,r.options.keepDiscriminatorProperty||delete A[r.options.discriminator.property]}v.transformationType===x.CLASS_TO_CLASS&&(j=A.constructor),v.transformationType===x.CLASS_TO_PLAIN&&(A[r.options.discriminator.property]=r.options.discriminator.subTypes.find(function(K){return K.value===A.constructor}).name)}else j=r;var R=v.transform(H,A,j,void 0,A instanceof Map,d+1);g instanceof Set?g.add(R):g.push(R)}else v.transformationType===x.CLASS_TO_CLASS&&(g instanceof Set?g.add(A):g.push(A))}),g}else{if(r===String&&!c)return n==null?n:String(n);if(r===Number&&!c)return n==null?n:Number(n);if(r===Boolean&&!c)return n==null?n:!!n;if((r===Date||n instanceof Date)&&!c)return n instanceof Date?new Date(n.valueOf()):n==null?n:new Date(n);if(Ie().Buffer&&(r===Buffer||n instanceof Buffer)&&!c)return n==null?n:Buffer.from(n);if(Ce(n)&&!c)return new Promise(function(A,D){n.then(function(H){return A(v.transform(void 0,H,r,void 0,void 0,d+1))},D)});if(!c&&n!==null&&typeof n=="object"&&typeof n.then=="function")return n;if(typeof n=="object"&&n!==null){!r&&n.constructor!==Object&&(!Array.isArray(n)&&n.constructor===Array||(r=n.constructor)),!r&&e&&(r=e.constructor),this.options.enableCircularCheck&&this.recursionStack.add(n);var C=this.getKeys(r,n,c),w=e||{};!e&&(this.transformationType===x.PLAIN_TO_CLASS||this.transformationType===x.CLASS_TO_CLASS)&&(c?w=new Map:r?w=new r:w={});for(var _=function(A){if(A==="__proto__"||A==="constructor")return"continue";var D=A,H=A,j=A;if(!m.options.ignoreDecorators&&r){if(m.transformationType===x.PLAIN_TO_CLASS){var W=F.findExposeMetadataByCustomName(r,A);W&&(j=W.propertyName,H=W.propertyName)}else if(m.transformationType===x.CLASS_TO_PLAIN||m.transformationType===x.CLASS_TO_CLASS){var W=F.findExposeMetadata(r,A);W&&W.options&&W.options.name&&(H=W.options.name)}}var O=void 0;m.transformationType===x.PLAIN_TO_CLASS?O=n[D]:n instanceof Map?O=n.get(D):n[D]instanceof Function?O=n[D]():O=n[D];var R=void 0,K=O instanceof Map;if(r&&c)R=r;else if(r){var T=F.findTypeMetadata(r,j);if(T){var wt={newObject:w,object:n,property:j},ct=T.typeFunction?T.typeFunction(wt):T.reflectedType;T.options&&T.options.discriminator&&T.options.discriminator.property&&T.options.discriminator.subTypes?n[D]instanceof Array?R=T:(m.transformationType===x.PLAIN_TO_CLASS&&(R=T.options.discriminator.subTypes.find(function(q){if(O&&O instanceof Object&&T.options.discriminator.property in O)return q.name===O[T.options.discriminator.property]}),R===void 0?R=ct:R=R.value,T.options.keepDiscriminatorProperty||O&&O instanceof Object&&T.options.discriminator.property in O&&delete O[T.options.discriminator.property]),m.transformationType===x.CLASS_TO_CLASS&&(R=O.constructor),m.transformationType===x.CLASS_TO_PLAIN&&O&&(O[T.options.discriminator.property]=T.options.discriminator.subTypes.find(function(q){return q.value===O.constructor}).name)):R=ct,K=K||T.reflectedType===Map}else if(m.options.targetMaps)m.options.targetMaps.filter(function(q){return q.target===r&&!!q.properties[j]}).forEach(function(q){return R=q.properties[j]});else if(m.options.enableImplicitConversion&&m.transformationType===x.PLAIN_TO_CLASS){var dt=Reflect.getMetadata("design:type",r.prototype,j);dt&&(R=dt)}}var ft=Array.isArray(n[D])?m.getReflectedType(r,j):void 0,ut=e?e[D]:void 0;if(w.constructor.prototype){var lt=Object.getOwnPropertyDescriptor(w.constructor.prototype,H);if((m.transformationType===x.PLAIN_TO_CLASS||m.transformationType===x.CLASS_TO_CLASS)&&(lt&&!lt.set||w[H]instanceof Function))return"continue"}if(!m.options.enableCircularCheck||!m.isCircular(O)){var tt=m.transformationType===x.PLAIN_TO_CLASS?H:A,k=void 0;m.transformationType===x.CLASS_TO_PLAIN?(k=n[tt],k=m.applyCustomTransformations(k,r,tt,n,m.transformationType),k=n[tt]===k?O:k,k=m.transform(ut,k,R,ft,K,d+1)):O===void 0&&m.options.exposeDefaultValues?k=w[H]:(k=m.transform(ut,O,R,ft,K,d+1),k=m.applyCustomTransformations(k,r,tt,n,m.transformationType)),(k!==void 0||m.options.exposeUnsetFields)&&(w instanceof Map?w.set(H,k):w[H]=k)}else if(m.transformationType===x.CLASS_TO_CLASS){var k=O;k=m.applyCustomTransformations(k,r,A,n,m.transformationType),(k!==void 0||m.options.exposeUnsetFields)&&(w instanceof Map?w.set(H,k):w[H]=k)}},m=this,X=0,et=C;X<et.length;X++){var ot=et[X];_(ot)}return this.options.enableCircularCheck&&this.recursionStack.delete(n),w}else return n}},t.prototype.applyCustomTransformations=function(e,n,r,a,c){var d=this,v=F.findTransformMetadatas(n,r,this.transformationType);return this.options.version!==void 0&&(v=v.filter(function(g){return g.options?d.checkVersion(g.options.since,g.options.until):!0})),this.options.groups&&this.options.groups.length?v=v.filter(function(g){return g.options?d.checkGroups(g.options.groups):!0}):v=v.filter(function(g){return!g.options||!g.options.groups||!g.options.groups.length}),v.forEach(function(g){e=g.transformFn({value:e,key:r,obj:a,type:c,options:d.options})}),e},t.prototype.isCircular=function(e){return this.recursionStack.has(e)},t.prototype.getReflectedType=function(e,n){if(e){var r=F.findTypeMetadata(e,n);return r?r.reflectedType:void 0}},t.prototype.getKeys=function(e,n,r){var a=this,c=F.getStrategy(e);c==="none"&&(c=this.options.strategy||"exposeAll");var d=[];if((c==="exposeAll"||r)&&(n instanceof Map?d=Array.from(n.keys()):d=Object.keys(n)),r)return d;if(this.options.ignoreDecorators&&this.options.excludeExtraneousValues&&e){var v=F.getExposedProperties(e,this.transformationType),g=F.getExcludedProperties(e,this.transformationType);d=Jt(Jt([],v,!0),g,!0)}if(!this.options.ignoreDecorators&&e){var v=F.getExposedProperties(e,this.transformationType);this.transformationType===x.PLAIN_TO_CLASS&&(v=v.map(function(_){var m=F.findExposeMetadata(e,_);return m&&m.options&&m.options.name?m.options.name:_})),this.options.excludeExtraneousValues?d=v:d=d.concat(v);var C=F.getExcludedProperties(e,this.transformationType);C.length>0&&(d=d.filter(function(_){return!C.includes(_)})),this.options.version!==void 0&&(d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options?!0:a.checkVersion(m.options.since,m.options.until)})),this.options.groups&&this.options.groups.length?d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options?!0:a.checkGroups(m.options.groups)}):d=d.filter(function(_){var m=F.findExposeMetadata(e,_);return!m||!m.options||!m.options.groups||!m.options.groups.length})}return this.options.excludePrefixes&&this.options.excludePrefixes.length&&(d=d.filter(function(w){return a.options.excludePrefixes.every(function(_){return w.substr(0,_.length)!==_})})),d=d.filter(function(w,_,m){return m.indexOf(w)===_}),d},t.prototype.checkVersion=function(e,n){var r=!0;return r&&e&&(r=this.options.version>=e),r&&n&&(r=this.options.version<n),r},t.prototype.checkGroups=function(e){return e?this.options.groups.some(function(n){return e.includes(n)}):!0},t}(),it={enableCircularCheck:!1,enableImplicitConversion:!1,excludeExtraneousValues:!1,excludePrefixes:void 0,exposeDefaultValues:!1,exposeUnsetFields:!0,groups:void 0,ignoreDecorators:!1,strategy:void 0,targetMaps:void 0,version:void 0},G=function(){return G=Object.assign||function(t){for(var e,n=1,r=arguments.length;n<r;n++){e=arguments[n];for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a])}return t},G.apply(this,arguments)},Pe=function(){function t(){}return t.prototype.instanceToPlain=function(e,n){var r=new rt(x.CLASS_TO_PLAIN,G(G({},it),n));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},t.prototype.classToPlainFromExist=function(e,n,r){var a=new rt(x.CLASS_TO_PLAIN,G(G({},it),r));return a.transform(n,e,void 0,void 0,void 0,void 0)},t.prototype.plainToInstance=function(e,n,r){var a=new rt(x.PLAIN_TO_CLASS,G(G({},it),r));return a.transform(void 0,n,e,void 0,void 0,void 0)},t.prototype.plainToClassFromExist=function(e,n,r){var a=new rt(x.PLAIN_TO_CLASS,G(G({},it),r));return a.transform(e,n,void 0,void 0,void 0,void 0)},t.prototype.instanceToInstance=function(e,n){var r=new rt(x.CLASS_TO_CLASS,G(G({},it),n));return r.transform(void 0,e,void 0,void 0,void 0,void 0)},t.prototype.classToClassFromExist=function(e,n,r){var a=new rt(x.CLASS_TO_CLASS,G(G({},it),r));return a.transform(n,e,void 0,void 0,void 0,void 0)},t.prototype.serialize=function(e,n){return JSON.stringify(this.instanceToPlain(e,n))},t.prototype.deserialize=function(e,n,r){var a=JSON.parse(n);return this.plainToInstance(e,a,r)},t.prototype.deserializeArray=function(e,n,r){var a=JSON.parse(n);return this.plainToInstance(e,a,r)},t}(),Vt=new Pe;function Te(t,e){return Vt.instanceToPlain(t,e)}function Ne(t,e,n){return Vt.plainToInstance(t,e,n)}function gt(t){const e=Te(t);localStorage.setItem("playerData",JSON.stringify(e))}function $e(){const t=localStorage.getItem("playerData");if(!t)throw new Error("No player data found");const e=JSON.parse(t);return console.log(e),Ne(mt,e,{enableImplicitConversion:!0})}class mt extends Yt{constructor(n,r){n===void 0&&(n="吴田所"),r===void 0&&(r=Y.Player);super(n,r,0,1);L(this,"log",[]);L(this,"tempLog",[]);L(this,"autoRecoverIntervalId",-1);L(this,"autoSaveIntervalId",-1);L(this,"capturedMonster",[])}getHealthDisplay(){return`hp: ${this.health.toFixed(2)} / ${this.maxHealth.toFixed(0)} + ${(1/100*this.maxHealth).toFixed(2)}/s`}updateHealthDisplay(){const n=document.getElementById("health-display");n&&(n.innerText=this.getHealthDisplay())}recoverHealth(n){this.health=Math.min(this.health+n,this.maxHealth)}startAdventure(){clearInterval(this.autoRecoverIntervalId),clearInterval(this.autoSaveIntervalId),this.autoRecoverIntervalId=-1,this.autoSaveIntervalId=-1}backToTown(){clearInterval(this.autoRecoverIntervalId),clearInterval(this.autoSaveIntervalId),this.autoRecoverIntervalId=setInterval(()=>{this.recoverHealth(1/100*this.maxHealth),this.updateHealthDisplay()},1e3),this.autoSaveIntervalId=setInterval(()=>{gt(this)},1e4)}levelup(){this.level++}addLog(n){this.log.push(n)}getLogs(){return this.log.join("<br>")}addTempLog(n){this.tempLog.push(n)}getTempLogs(){return this.tempLog.join("<br>")}clearTempLogs(){this.tempLog=[]}joinTempLogs(){this.log.push(this.tempLog.join("<br>")),this.tempLog=[]}getLastNLog(n){return this.log.slice(-n).join("<br>")}}function Q(){const t=document.getElementById("app");if(!t)throw new Error("无法找到挂载点 #app");return t}class te{constructor(e){L(this,"name");L(this,"description");L(this,"identifier");this.identifier=e,this.name="",this.description=""}}const ee={sword:{name:"剑",description:"一把剑,平平无奇的武器",position:Ot.Hand,extraActions:[],ability:{},actionCoeff:{[z.Attack]:{plus:1,multiply:1}}}},ne={katana:{name:"太刀",description:"太好了，有了这个，你就可以做虾头太刀侠了",position:Ot.Hand,extraActions:[{actionKey:"horizontalSlashAction",weight:1}],ability:{str:1,dex:-1},actionCoeff:{[z.Attack]:{plus:2,multiply:1},[z.Dodge]:{plus:-2,multiply:1}}}},B=[];for(let t=0;t<256;++t)B.push((t+256).toString(16).slice(1));function je(t,e=0){return(B[t[e+0]]+B[t[e+1]]+B[t[e+2]]+B[t[e+3]]+"-"+B[t[e+4]]+B[t[e+5]]+"-"+B[t[e+6]]+B[t[e+7]]+"-"+B[t[e+8]]+B[t[e+9]]+"-"+B[t[e+10]]+B[t[e+11]]+B[t[e+12]]+B[t[e+13]]+B[t[e+14]]+B[t[e+15]]).toLowerCase()}let _t;const Re=new Uint8Array(16);function De(){if(!_t){if(typeof crypto>"u"||!crypto.getRandomValues)throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");_t=crypto.getRandomValues.bind(crypto)}return _t(Re)}const He=typeof crypto<"u"&&crypto.randomUUID&&crypto.randomUUID.bind(crypto),Kt={randomUUID:He};function kt(t,e,n){var a;if(Kt.randomUUID&&!t)return Kt.randomUUID();t=t||{};const r=t.random??((a=t.rng)==null?void 0:a.call(t))??De();if(r.length<16)throw new Error("Random bytes length must be >= 16");return r[6]=r[6]&15|64,r[8]=r[8]&63|128,je(r)}function re(){return Object.values(ht)[Math.floor(Math.random()*Object.values(ht).length)]}function Be(t){const e=t===U.Common?ee:ne,n=Object.keys(e),r=Math.floor(Math.random()*n.length),a=n[r];return{type:{category:"equipment",rarity:t,key:a},prefix:re(),id:kt()}}function ze(t){return{id:kt(),type:t,prefix:re()}}function ie(t,e){return Be(e)}const Fe={brokenChest:{name:"破烂的宝箱",description:"一个破烂的宝箱，里面可能会有一些有用的东西",effect:t=>{t.pack.push(ie(1,U.Common))}}},Ge={silverChest:{name:"银宝箱",description:"一个银宝箱，里面可能会有一些有用的东西",effect:t=>{t.pack.push(ie(1,U.Rare))}}};class oe extends te{constructor(n){super(n);L(this,"effect");let r;switch(n.type.rarity){case U.Common:r=Fe[n.type.key];break;case U.Rare:r=Ge[n.type.key];break;default:throw new Error("Invalid rarity")}this.effect=r.effect,this.name=r.name,this.description=r.description}useItem(n){this.effect(n),n.pack=n.pack.filter(r=>r.id!==this.identifier.id)}}class Ue extends te{constructor(n){super(n);L(this,"position");L(this,"extraActions");L(this,"ability");L(this,"actionCoeff");L(this,"prefix");let r;switch(n.type.rarity){case U.Common:r=ee[n.type.key];break;case U.Rare:r=ne[n.type.key];break;default:throw new Error("Invalid rarity")}this.name=n.prefix?n.prefix+r.name:r.name,this.description=r.description,this.position=r.position,this.extraActions=r.extraActions,this.ability=r.ability,this.actionCoeff=r.actionCoeff,this.prefix=n.prefix||ht.None}}function We(t){switch(t.category){case"consumable":return{id:kt(),type:t};case"equipment":return ze(t)}}function ae(t){if(t.type.category==="consumable")return new oe(t);if(t.type.category==="equipment")return new Ue(t);throw new Error("Invalid item category")}class qe extends Yt{constructor(n,r,a,c){super(n,r,a,c);L(this,"description");L(this,"dropItems");this.dropItems=st[r].dropItems,this.description=st[r].description}randomDropItem(){const n=this.dropItems[Math.floor(Math.random()*this.dropItems.length)].key;return We(n)}}function At(t,e){return(t.str*e.str+t.dex*e.dex+t.int*e.int+t.con*e.con+t.siz*e.siz+t.app*e.app)*Math.random()}function Lt(t,e){return t*(25/(e+25))}function Je(t,e,n,r){const a=At(n.coeff,t.ability),c=At(r.coeff,e.ability);if(t.addTempLog(t.name+"使用了"+n.name+'掷出了<span style="color: blue;">'+Math.round(a)+"</span>，"+e.name+"使用了"+r.name+'掷出了<span style="color: orange;">'+Math.round(c)+"</span>"),a>=c){const d=Lt(a,e.ability.armor);e.health-=d,t.addTempLog(t.name+"使用了"+n.name+"弹开了"+e.name+"的"+r.name+"(attack vs attack)"),t.addTempLog(n.messageGenerator(t,e,V.Success)+'造成了<span style="color: red;">'+Math.round(d)+"</span>点伤害"),n.extraEffect&&n.extraEffect(t,e)}else{const d=Lt(c,t.ability.armor);t.health-=d,t.addTempLog(e.name+"使用了"+r.name+"弹开了"+t.name+"的"+n.name+"(attack vs attack)"),t.addTempLog(r.messageGenerator(e,t,V.Success)+'造成了<span style="color: red;">'+Math.round(d)+"</span>点伤害"),r.extraEffect&&r.extraEffect(e,t)}}function Ke(t,e,n,r){let a,c,d;r.type===z.NoAction?(a=t,c=e,d=n):(a=e,c=t,d=r);const v=At(d.coeff,a.ability);t.addTempLog(a.name+"使用了"+d.name+'掷出了<span style="color: blue;">'+Math.round(v)+"</span>)"),t.addTempLog(c.name+"被打了个措手不及(attack vs none)");const g=Lt(v,c.ability.armor);c.health-=g,t.addTempLog(d.messageGenerator(a,c,V.Success)+'造成了<span style="color: red;">'+Math.round(g)+"</span>点伤害"),d.extraEffect&&d.extraEffect(a,c)}function Ze(t,e,n,r){n.type===z.Attack&&r.type===z.Attack&&Je(t,e,n,r),(n.type===z.Attack&&r.type===z.NoAction||n.type===z.NoAction&&r.type===z.Attack)&&Ke(t,e,n,r)}function Qe(t,e){return t.health<=0?(t.addLog(t.name+"撑不住了"),"die"):e.health<1?(t.addLog(t.name+"击败了"+e.name),"win"):"continue"}function se(t,e,n){return Math.random()*t.ability.dex>Math.random()*e.ability.dex?Math.random()*t.ability.int>Math.random()*e.ability.int?e.name+"看起来要"+n.name+"了":e.name+"看起来要"+e.getRandomAction().name+"了":"你来不及观察"+e.name+"的行动"}function Xe(t,e){var v,g;const n=Q(),r=e.getRandomAction(),a=se(t,e,r),c=t.getRandomAction(),d=t.getRandomAction();n.innerHTML=`
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

`,(v=document.getElementById("action1-btn"))==null||v.addEventListener("click",()=>{vt(t,e,c,r)}),(g=document.getElementById("action2-btn"))==null||g.addEventListener("click",()=>{vt(t,e,d,r)})}function vt(t,e,n,r){var C,w;const a=Q();Ze(t,e,n,r);const c=Qe(t,e);if(c==="die"){Zt(t,e,!1);return}else if(c==="win"){Zt(t,e,!0);return}r=e.getRandomAction();const d=se(t,e,r),v=t.getRandomAction(),g=t.getRandomAction();a.innerHTML=`
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
            <h5 class="card-title">${g.name}</h5>
            <p class="card-text">${g.description}</p>
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
`,(C=document.getElementById("action1-btn"))==null||C.addEventListener("click",()=>{vt(t,e,v,r)}),(w=document.getElementById("action2-btn"))==null||w.addEventListener("click",()=>{vt(t,e,g,r)})}function Zt(t,e,n){var c;const r=Q();let a;if(n){const d=e.randomDropItem();a=ae(d),t.addLog(e.name+"掉落了<span style='color: gold;'>"+a.name+"</span>"),t.pack.push(d)}else t.health=1,t.addLog(t.name+"拼死从"+e.name+"的手中逃了出来，拖着残破的身躯，回到了城镇");r.innerHTML=`
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
`,t.clearTempLogs(),gt(t),(c=document.getElementById("main-menu-btn"))==null||c.addEventListener("click",()=>{bt(t)})}function Ye(t){let e=Object.values(Y)[Math.floor(Math.random()*Object.values(Y).length)];(e===Y.Player||e===Y.Player114514)&&(e=Y.Wolf);const n=Math.floor(Math.random()*10)+1,r=Math.random()*2,a=new qe(st[e].typeName,e,n,r);Xe(t,a)}function ce(){var e,n;const t=Q();t.innerHTML=`
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
  `,(e=document.getElementById("action1-btn"))==null||e.addEventListener("click",()=>{const r=new mt("吴田所",Y.Player);yt(r)}),(n=document.getElementById("action2-btn"))==null||n.addEventListener("click",()=>{const r=new mt("田所*二",Y.Player114514);yt(r)})}function yt(t){var a,c;const e=Q(),n=Math.floor(Math.random()*4);let r="";switch(n){case 0:r="<p>车 →→→ 你</p>";break;case 1:r="<p>你 ←←← 车</p>";break;case 2:r=`
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
`,(a=document.getElementById("left-btn"))==null||a.addEventListener("click",()=>{Math.random()>.3?yt(t):Qt(t)}),(c=document.getElementById("right-btn"))==null||c.addEventListener("click",()=>{Math.random()>.3?yt(t):Qt(t)})}function Qt(t){var n;const e=Q();e.innerHTML=`
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{Ve(t)})}function Ve(t){var n;const e=Q();e.innerHTML=`
    <h1>???</h1>
    <p>请输入你的名字</p>
    <input type="text" id="name-input" placeholder="${t.name}">
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{const a=document.getElementById("name-input").value.trim();a?(t.name=a,tn(t)):alert("请输入你的名字！")})}function tn(t){var n;const e=Q();e.innerHTML=`
    <h1>???</h1>
    <p>你睁开了眼睛，发现自己好像身处森林之中</p>
    <p>周围的一切都显得那么陌生，充满了异世界风情</p>
    <p>看着远处地上缓慢蠕动的史莱姆，你总算相信自己穿越了</p>
    <button id="continue-btn">继续</button>
  `,(n=document.getElementById("continue-btn"))==null||n.addEventListener("click",()=>{gt(t),bt(t)})}function bt(t){var n,r,a;const e=Q();t.backToTown(),console.log(t),e.innerHTML=`
  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div>
      <h2>${t.name} lv ${t.level}</h2>
      <div id="health-display" class="fs-4 mb-3">${t.getHealthDisplay()}</div>
    </div>
  </div>
  <div class="container mt-4">
    <h2 class="text-center mb-4">主菜单</h2>
    <div class="row g-3 justify-content-center">
      <div class="col-12 col-md-4">
        <button id="battle-btn" class="btn btn-primary w-100 py-3">战斗</button>
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
`,(n=document.getElementById("battle-btn"))==null||n.addEventListener("click",()=>{t.startAdventure(),Ye(t)}),(r=document.getElementById("status-btn"))==null||r.addEventListener("click",()=>{de(t)}),(a=document.getElementById("restart-btn"))==null||a.addEventListener("click",()=>{window.confirm("你确定要remake吗?")&&(localStorage.removeItem("playerData"),ce())})}function de(t){var r,a;const e=Q(),n=t.pack.map(c=>ae(c));e.innerHTML=`
  <div class="container mt-4">
    <h2 class="text-center mb-4">状态</h2>

    <!-- 宠物区域 -->
    <div class="row mb-4">
      <div class="col">
        <h4>${t.name} 的宠物</h4>
        <div id="pet" class="border rounded p-3 bg-light">
          ${t.capturedMonster.length>0?t.capturedMonster.map(c=>`
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="fw-bold">${c.name}</span>
                  <span class="text-muted">Lv. ${c.level}</span>
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
          ${n.length>0?n.map(c=>{const d=c.identifier.type.category==="consumable"?"btn-success":"btn-secondary";return`<button id="use-btn${c.identifier.id}" class="btn ${d}">${c.name}</button>`}).join(""):'<p class="text-muted">背包为空</p>'}
        </div>
      </div>
    </div>

    <!-- 返回主菜单按钮 -->
    <div class="text-center">
      <button id="back-btn" class="btn btn-primary">返回主菜单</button>
    </div>
  </div>
`,(r=document.getElementById("back-btn"))==null||r.addEventListener("click",()=>{bt(t)});for(const c of n)c instanceof oe&&((a=document.getElementById(`use-btn${c.identifier.id}`))==null||a.addEventListener("click",()=>{c.useItem(t),t.addLog(t.name+"使用了"+c.name),gt(t),de(t)}))}document.addEventListener("DOMContentLoaded",()=>{let t;try{t=$e()}catch(e){console.log(e),localStorage.removeItem("playerData"),ce();return}bt(t)});
