(()=>{var e={};e.id=3512,e.ids=[3512],e.modules={2934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},4580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},5869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},4770:e=>{"use strict";e.exports=require("crypto")},2502:(e,r,t)=>{"use strict";t.r(r),t.d(r,{GlobalError:()=>n.a,__next_app__:()=>g,originalPathname:()=>m,pages:()=>d,routeModule:()=>u,tree:()=>c}),t(8855),t(969),t(5866);var s=t(3191),a=t(8716),i=t(7922),n=t.n(i),o=t(5231),l={};for(let e in o)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>o[e]);t.d(r,l);let c=["",{children:["test-diagram",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(t.bind(t,8855)),"/Users/nee/Documents/Documents/interview/src/app/test-diagram/page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(t.bind(t,969)),"/Users/nee/Documents/Documents/interview/src/app/layout.tsx"],"not-found":[()=>Promise.resolve().then(t.t.bind(t,5866,23)),"next/dist/client/components/not-found-error"]}],d=["/Users/nee/Documents/Documents/interview/src/app/test-diagram/page.tsx"],m="/test-diagram/page",g={require:t,loadChunk:()=>Promise.resolve()},u=new s.AppPageRouteModule({definition:{kind:a.x.APP_PAGE,page:"/test-diagram/page",pathname:"/test-diagram",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},1809:(e,r,t)=>{Promise.resolve().then(t.t.bind(t,2994,23)),Promise.resolve().then(t.t.bind(t,6114,23)),Promise.resolve().then(t.t.bind(t,9727,23)),Promise.resolve().then(t.t.bind(t,9671,23)),Promise.resolve().then(t.t.bind(t,1868,23)),Promise.resolve().then(t.t.bind(t,4759,23))},4864:(e,r,t)=>{Promise.resolve().then(t.bind(t,5997))},4111:(e,r,t)=>{Promise.resolve().then(t.bind(t,4786))},4786:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>i});var s=t(326),a=t(4896);function i(){return(0,s.jsxs)("div",{style:{padding:"2rem",maxWidth:"1200px",margin:"0 auto"},children:[s.jsx("h1",{style:{marginBottom:"2rem"},children:"Diagram Component Test Page"}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"1. Simple Flowchart"}),s.jsx(a.S,{title:"Basic Flowchart Example",children:`graph TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B
    C --> E[End]`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"2. Sequence Diagram"}),s.jsx(a.S,{title:"User Authentication Flow",caption:"Figure 1: Typical authentication sequence",children:`sequenceDiagram
    participant User
    participant Client
    participant Server
    participant Database
    
    User->>Client: Enter credentials
    Client->>Server: POST /login
    Server->>Database: Verify credentials
    Database-->>Server: User data
    Server-->>Client: JWT token
    Client-->>User: Login successful`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"3. Architecture Diagram"}),s.jsx(a.S,{title:"System Architecture",children:`graph LR
    subgraph "Frontend"
        A[React App]
        B[Next.js]
    end
    
    subgraph "Backend"
        C[API Gateway]
        D[Microservices]
        E[Database]
    end
    
    A --> B
    B --> C
    C --> D
    D --> E`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"4. Class Diagram"}),s.jsx(a.S,{title:"Object-Oriented Design",children:`classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    
    class Dog {
        +String breed
        +bark()
    }
    
    class Cat {
        +String color
        +meow()
    }
    
    Animal <|-- Dog
    Animal <|-- Cat`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"5. State Diagram"}),s.jsx(a.S,{title:"Order Processing States",children:`stateDiagram-v2
    [*] --> Pending
    Pending --> Processing: Payment Confirmed
    Processing --> Shipped: Items Packed
    Shipped --> Delivered: Received
    Delivered --> [*]
    
    Processing --> Cancelled: Payment Failed
    Pending --> Cancelled: User Cancelled
    Cancelled --> [*]`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"6. Error Handling Test"}),s.jsx(a.S,{title:"Invalid Diagram Syntax",children:`this is not valid mermaid syntax
    it should show an error`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"7. Git Flow Diagram"}),s.jsx(a.S,{title:"Git Branching Strategy",caption:"Figure 2: Feature branch workflow",children:`gitGraph
    commit
    branch develop
    checkout develop
    commit
    branch feature
    checkout feature
    commit
    commit
    checkout develop
    merge feature
    checkout main
    merge develop
    commit`})]}),(0,s.jsxs)("section",{style:{marginBottom:"3rem"},children:[s.jsx("h2",{children:"8. Entity Relationship Diagram"}),s.jsx(a.S,{title:"Database Schema",children:`erDiagram
    USER ||--o{ ORDER : places
    USER {
        string id
        string name
        string email
    }
    ORDER ||--|{ ORDER_ITEM : contains
    ORDER {
        string id
        date orderDate
        string status
    }
    PRODUCT ||--o{ ORDER_ITEM : "ordered in"
    PRODUCT {
        string id
        string name
        decimal price
    }
    ORDER_ITEM {
        int quantity
        decimal price
    }`})]})]})}},4896:(e,r,t)=>{"use strict";t.d(r,{S:()=>o});var s=t(326),a=t(7577);t(1813);var i=t(9655),n=t.n(i);function o({children:e,type:r="mermaid",title:t,caption:i,className:o=""}){let l=(0,a.useRef)(null),[c,d]=(0,a.useState)(""),[m,g]=(0,a.useState)(!0),[u,h]=(0,a.useState)("");return(0,a.useRef)(`mermaid-${Math.random().toString(36).substr(2,9)}`),(0,s.jsxs)("div",{className:`${n().container} ${o}`,children:[t&&s.jsx("div",{className:n().title,children:t}),(0,s.jsxs)("div",{className:n().wrapper,children:[m&&(0,s.jsxs)("div",{className:n().loading,children:[s.jsx("div",{className:n().spinner}),s.jsx("span",{children:"Rendering diagram..."})]}),c&&(0,s.jsxs)("div",{className:n().error,children:[s.jsx("div",{className:n().errorIcon,children:"⚠️"}),(0,s.jsxs)("div",{className:n().errorContent,children:[s.jsx("div",{className:n().errorTitle,children:"Diagram Rendering Error"}),s.jsx("div",{className:n().errorMessage,children:c}),(0,s.jsxs)("details",{className:n().errorDetails,children:[s.jsx("summary",{children:"View diagram source"}),s.jsx("pre",{className:n().errorSource,children:e})]})]})]}),!m&&!c&&s.jsx("div",{ref:l,className:n().content,dangerouslySetInnerHTML:{__html:u}})]}),i&&!c&&s.jsx("div",{className:n().caption,children:i})]})}},5997:(e,r,t)=>{"use strict";t.d(r,{LocaleProvider:()=>n,useLocale:()=>o});var s=t(326),a=t(7577);let i=(0,a.createContext)(void 0);function n({children:e}){let[r,t]=(0,a.useState)("en"),[n,o]=(0,a.useState)(!1);return n?s.jsx(i.Provider,{value:{locale:r,setLocale:e=>{t(e),"undefined"!=typeof document&&(document.documentElement.lang=e)}},children:e}):null}function o(){let e=(0,a.useContext)(i);if(!e)throw Error("useLocale must be used within a LocaleProvider");return e}},9655:e=>{e.exports={container:"Diagram_container__XwPck",title:"Diagram_title___9xhE",wrapper:"Diagram_wrapper__xZ_Fu",loading:"Diagram_loading__cDyOe",spinner:"Diagram_spinner__dARO8",spin:"Diagram_spin__OidFa",content:"Diagram_content__aRjC2",error:"Diagram_error__7p4y6",errorIcon:"Diagram_errorIcon__NbVD1",errorContent:"Diagram_errorContent__qip4B",errorTitle:"Diagram_errorTitle__ldxdN",errorMessage:"Diagram_errorMessage__e5R6S",errorDetails:"Diagram_errorDetails__FgBgZ",errorSource:"Diagram_errorSource__NwAbJ",caption:"Diagram_caption__unC9I"}},969:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>l,metadata:()=>o});var s=t(9510),a=t(8570);let i=(0,a.createProxy)(String.raw`/Users/nee/Documents/Documents/interview/src/lib/i18n/LocaleContext.tsx#LocaleProvider`);(0,a.createProxy)(String.raw`/Users/nee/Documents/Documents/interview/src/lib/i18n/LocaleContext.tsx#useLocale`);class n{static{this.glossaryData=null}static async initialize(e){this.glossaryData=e}static getTerm(e){return this.glossaryData&&this.glossaryData.terms[e]||null}static findTerm(e,r="en"){if(!this.glossaryData)return null;let t=e.toLowerCase().trim();for(let e of Object.values(this.glossaryData.terms))if(e.term.toLowerCase()===t)return e;return null}static getTermsByCategory(e){return this.glossaryData&&this.glossaryData.index.byCategory[e]?this.glossaryData.index.byCategory[e].map(e=>this.glossaryData.terms[e]).filter(e=>void 0!==e):[]}static getTermsByInitial(e){return this.glossaryData&&this.glossaryData.index.byInitial[e]?this.glossaryData.index.byInitial[e].map(e=>this.glossaryData.terms[e]).filter(e=>void 0!==e):[]}static getAllTerms(){return this.glossaryData?Object.values(this.glossaryData.terms):[]}static searchTerms(e,r="en"){if(!this.glossaryData||!e.trim())return[];let t=e.toLowerCase().trim();return Object.values(this.glossaryData.terms).filter(e=>{let s=e.term.toLowerCase().includes(t),a=e.definition[r].toLowerCase().includes(t);return s||a})}static getRelatedTerms(e){let r=this.getTerm(e);return r&&r.relatedTerms?r.relatedTerms.map(e=>this.getTerm(e)).filter(e=>null!==e):[]}static getCategories(){return this.glossaryData?Object.keys(this.glossaryData.index.byCategory):[]}static formatTerm(e,r){return"vi"===r?`${e.term} (${e.definition.vi})`:`${e.term} (${e.definition.en})`}static extractTermsFromContent(e){if(!this.glossaryData)return[];let r=[],t=e.toLowerCase();for(let e of Object.values(this.glossaryData.terms))t.includes(e.term.toLowerCase())&&r.push(e.id);return r}}t(5023);let o={title:"Frontend Interview Guide",description:"Comprehensive bilingual frontend interview preparation platform"};function l({children:e}){return s.jsx("html",{lang:"en",children:s.jsx("body",{children:s.jsx(i,{children:e})})})}},8855:(e,r,t)=>{"use strict";t.r(r),t.d(r,{default:()=>s});let s=(0,t(8570).createProxy)(String.raw`/Users/nee/Documents/Documents/interview/src/app/test-diagram/page.tsx#default`)},5023:()=>{}};var r=require("../../webpack-runtime.js");r.C(e);var t=e=>r(r.s=e),s=r.X(0,[5819,3866,1813],()=>t(2502));module.exports=s})();