import { PawaRender } from "pawajs/src/graph"
import { awaits } from "./src/await"
import { component } from "./src/component"
import { condition } from "./src/condition"
import { forEach } from "./src/for"
import { key } from "./src/key"
import { state } from "./src/state"
import { template } from "./src/template"
import { reportContinueError } from "./src/dev"

export const resumer=(hydrate,graph,context)=>{
    const contexts={...context}
    
    const control={stop:false}
    const {renderGraph}=hydrate.type !== 'state' && hydrate.type !== 'for-key'?PawaRender(graph,contexts):{renderGraph:null,render:null}
    let proceed=true
        try {
            if (hydrate.type === 'state') {
                state(contexts,hydrate,graph)
            }else if(hydrate.type === 'condition'){
                condition(hydrate,renderGraph,contexts)
            }else if(hydrate.type === 'template'){
                template(hydrate,renderGraph,contexts)
            }else if(hydrate.type === 'for'){
                forEach(hydrate,renderGraph,contexts)
            }else if(hydrate.type === 'key'){
                key(hydrate,renderGraph,contexts)
            }else if(hydrate.type === 'await'){
                proceed=awaits(hydrate,renderGraph,contexts)
            }else if(hydrate.type === 'component'){
                proceed=component(hydrate,renderGraph,contexts)
            }
        } catch (error) {
            reportContinueError(error, {
                effect: hydrate.type,
                ref: hydrate.ref || hydrate.id,
            })
            return false
        }
    const elements=document.querySelectorAll(`[p\\:id="${hydrate.id}"]`)
    if(!proceed)return
    if (renderGraph) {
        if (hydrate.ref === 'ref') {
            renderGraph.ref=renderGraph.children[0]
            // console.log('has ref',hydrate);
            
        }else{
            if (elements) {
                renderGraph.ref=elements[0]
            }
        }

         for (const element of Array.from(elements)) {
        element.removeAttribute('p:id')
        let render=false
        if (element.hasAttribute('on-client')) {
            render=true
        }
       renderGraph.render(element,render)  
    }
    }else{
       if (hydrate.type === 'for-key') {
        graph.ref=elements[0]
       } 
    for (const element of Array.from(elements)) {
        element.removeAttribute('p:id')
        // graph.setContext(contexts)
        let render=false
        if (element.hasAttribute('on-client')) {
            render=true
        }
       graph.render(element,render)  
    }
    }
}
export const PawaContinue=(json)=>{
    let hydrateTree
    try {
        hydrateTree=JSON.parse(json) ?? {children:[]}
    } catch (error) {
        reportContinueError(error, { effect: 'hydrate-json' })
        return
    }
    const context={}
    const {renderGraph,render}=PawaRender(null,context)
    if (Array.isArray(hydrateTree.children)) {
        for (const item of hydrateTree.children) {
            resumer(item,renderGraph,{})
        }
    }
    const elements=document.querySelectorAll(`[p\\:id="${hydrateTree.id}"]`)
    renderGraph.ref=elements[0]
    for (const element of Array.from(elements)) {
        element.removeAttribute('p:id')
        render(element,false)  
    }
    

}