import { resumer } from "../index.js";
import { getComponentGraph } from "pawajs";
import { initializer } from "pawajs/src/control-flow/for.js";
import { PawaRender } from "pawajs/src/graph/index.js";
import { safeEval } from "pawajs/src/utils.js";

export const forEach=(hydrate,graph,context)=>{
    const getStore=document.querySelector(`[p\\:store="${hydrate.id}"]`)
    const element=getStore?.firstElementChild ?? getStore.content.firstElementChild
    const attr={name:'for-each',value:element.getAttribute('for-each')}
    graph.nodeType='for-each'
    const comment=document.createComment('for-each')
    graph.control=comment
    getStore.parentElement.insertBefore(comment, getStore)
    getStore.remove()
    const arrayName=hydrate.arrayName
    const forKey=hydrate.forkey
    const arrayItem=hydrate.arrayItem
    const indexes=hydrate?.indexes
    const componentGraph=getComponentGraph()
    element.removeAttribute('for-each')
    const array=safeEval(arrayName,context,true)
    let children=hydrate.children
    const hydrateChild=children.filter((c)=>typeof c !== 'string' && typeof c !== 'number')
    const hydrateString=children.filter((c)=> typeof c === 'string' || typeof c === 'number')
    children=hydrateString.length > 0?hydrateString :hydrateChild
    
    for (let i=children.length-1; i>=0; i--) {
        
        const forKeyHydrate={
            id:'',
            ref:'',
            type:'for-key',
            children:hydrateChild[i]?[hydrateChild[i]]:[]
        }
        const itemContext={
            ...context,
            [arrayItem]:array[i],
            [indexes]:i
        }
        const child=children[i]
        
        
        const {renderGraph}=PawaRender(graph,itemContext)
        renderGraph.nodeType='for-key'
        if (typeof child === 'string' || typeof child === 'number') {
            renderGraph.key=child.replace(`${hydrate.id}-`, '')
            forKeyHydrate.ref=''
            forKeyHydrate.type="for-key"
            forKeyHydrate.id=child
            resumer(forKeyHydrate,renderGraph,itemContext)
            //find if any hydrate children object carries this same forkey then they are part 
            
               const findkey=hydrateChild.filter(c=> c.forkey === child) 
               for (const forKeyHy of findkey) {
                
                   resumer(forKeyHy,renderGraph,itemContext)
               }
            
        }else{
            renderGraph.key=child.forkey.replace(`${hydrate.id}-`, '')
            resumer(child,renderGraph,itemContext)
        }
    }
    hydrate.children=children
    hydrate.ref='ref'
    const {evaluate}=initializer(element,attr,context,comment,graph,componentGraph,arrayName,arrayItem,indexes,forKey,{enter:true})
    evaluate()
    const ref=graph.children[0]
    const el=ref.getElement()
    
    el.after(comment)
}