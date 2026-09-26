import { resumer } from ".."
import { $state } from "pawajs"

export const state=(context,hydrate,graph)=>{
    const states=hydrate
    const contexts={
        ...context
    }
    
    for (const item of states.values) {
        contexts[item.name]=$state(item.value)
    }
    
    graph.setContext(contexts)
    for (const item of states.children) {
        resumer(item,graph,contexts)
    }
    
}