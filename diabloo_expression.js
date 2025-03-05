class ExpressionFilter{#a=[];getTokens(){return this.#a}constructor(e={}){this.filterDefinitions=e.filterDefinitions||[],this.textEvaluator=e.textEvaluator||((e,t)=>e.toString().toLowerCase().includes(t.toLowerCase())),this.operatorPrecedence={or:1,and:2,"!":3},this.logicalOperators=["and","or","!"]}parse(e){this.#a=[];let t="",s=!1,r="";for(let o=0;o<e.length;o++){let i=e[o];s?(t+=i,i===r&&(s=!1)):'"'===i||"'"===i?(s=!0,r=i,t+=i):"("===i||")"===i?(""!==t.trim()&&(this.#a.push(...this.tokenizeSegment(t)),t=""),this.#a.push({type:"group",value:i})):/\s/.test(i)?""!==t.trim()&&(this.#a.push(...this.tokenizeSegment(t)),t=""):t+=i}return""!==t.trim()&&this.#a.push(...this.tokenizeSegment(t)),this.#a}tokenizeSegment(e){let t=[];for(;e.startsWith("!");)t.push({type:"operator",value:"!"}),e=e.substring(1);if(!e)return t;let s=e.indexOf(":");if(s>-1){let r=e.substring(0,s).toLowerCase(),o=e.substring(s+1),i=o.split(","),n=i[0].replace(/^['"]|['"]$/g,"");t.push({type:"filter",key:r,value:n,original:i[0]!==n?i[0]:void 0});for(let l=1;l<i.length;l++){let a=i[l].replace(/^['"]|['"]$/g,""),u=!1,p=this.filterDefinitions.find(e=>e.key.toLowerCase()===r);p&&p.hasOwnProperty("arguments")&&Array.isArray(p.arguments)&&(u=0===p.arguments.length||p.arguments.some(e=>e.toLowerCase()===a.toLowerCase())),t.push({type:"argument",value:a,valid:u})}}else"and"===e.toLowerCase()||"or"===e.toLowerCase()?t.push({type:"operator",value:e.toLowerCase()}):t.push({type:"text",value:e});return t}evaluateExpression(e,t){if(!e||0===e.length)return!0;let s=[];for(let r=0;r<e.length;r++){let o=e[r];if("filter"===o.type){let i={...o},n=[];for(;r+1<e.length&&"argument"===e[r+1].type;)n.push(e[r+1]),r++;n.length>0&&(i.argument=n),s.push(i)}else"argument"!==o.type&&s.push(o)}let l=[],a=[],u=this.operatorPrecedence;for(s.forEach(e=>{if("text"===e.type)l.push(this.textEvaluator(t,e.value));else if("filter"===e.type){let s=this.filterDefinitions.find(t=>t.key===e.key),r=!1,o=e.value,i=[];if(e.argument&&Array.isArray(e.argument)){let n=e.argument.every(e=>e.valid);if(!n){l.push(!1);return}i=e.argument.map(e=>e.value)}r=!!s&&"function"==typeof s.filter&&s.filter(t,o,...i),l.push(r)}else if("operator"===e.type){for(;a.length>0&&"("!==a[a.length-1]&&u[a[a.length-1]]>=u[e.value];)l.push(a.pop());a.push(e.value)}else if("group"===e.type&&"("===e.value)a.push(e.value);else if("group"===e.type&&")"===e.value){for(;a.length>0&&"("!==a[a.length-1];)l.push(a.pop());a.length>0&&"("===a[a.length-1]&&a.pop()}});a.length>0;)l.push(a.pop());let p=[];return l.forEach(e=>{if("boolean"==typeof e)p.push(e);else if("!"===e){let t=p.pop();p.push(!t)}else if("and"===e){let s=p.pop(),r=p.pop();p.push(r&&s)}else if("or"===e){let o=p.pop(),i=p.pop();p.push(i||o)}}),!(p.length>0)||p[0]}evaluate(e){return this.evaluateExpression(this.#a,e)}generateSuggestions(e){let t=[],s=e.split(/\s+/),r=s.pop()||"",o="";if(r.startsWith("!")&&(o="!",r=r.substring(1)),r.includes(":")){let[i,n]=r.split(":",2),l=this.filterDefinitions.find(e=>e.key.toLowerCase()===i.toLowerCase());if(n.includes(",")){let a=n.split(","),u=a[0],p=a.slice(1,a.length-1),h=a[a.length-1];if(l&&l.hasOwnProperty("arguments")&&Array.isArray(l.arguments)&&l.arguments.length>0){let g=l.arguments.filter(e=>e.toLowerCase().includes(h.toLowerCase()));g.forEach(e=>{t.push({suggestion:`${o}${i}:${u}${p.length?","+p.join(","):""},${e}`,description:`Argument for ${i}: ${e}`})})}}else if(l&&Array.isArray(l.values)&&n.length>0){let f=l.values.filter(e=>e.toLowerCase().includes(n.toLowerCase()));f.forEach(e=>{e.toLowerCase()!==n.toLowerCase()&&t.push({suggestion:`${o}${i}:${e}`,description:l.description})})}}else if(r){let c=this.filterDefinitions.filter(e=>e.key.toLowerCase().includes(r.toLowerCase())),d=["and","or"].filter(e=>e.toLowerCase().includes(r.toLowerCase()));c.forEach(e=>{t.push({suggestion:`${o}${e.key}:`,description:e.description})}),d.forEach(e=>{t.push({suggestion:e,description:`Logical operator: ${e}`})})}let y=r.toLowerCase();return t.sort((e,t)=>{let s=e.suggestion.toLowerCase().indexOf(y),r=t.suggestion.toLowerCase().indexOf(y);return -1===s&&(s=1e3),-1===r&&(r=1e3),s-r}),t}}"undefined"!=typeof module&&module.exports?module.exports=ExpressionFilter:window.ExpressionFilter=ExpressionFilter;