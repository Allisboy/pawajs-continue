import { resumer } from "../index.js"

export const template=(hydrate,graph,context)=>{
    graph.nodeType='template'
    const allChildren=document.querySelectorAll(`[temp="${hydrate.id}"]`)
    
    
    for (const element of Array.from(allChildren || [])) {
        element.removeAttribute('temp')
    }
    for (const child of Array.from(hydrate.children)) {
        resumer(child,graph,context)
    }
    graph.children=[...graph.children,...allChildren]
    
    
}