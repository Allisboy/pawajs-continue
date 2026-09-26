import { resumer } from "../index.js"
import { getComponentGraph } from "pawajs/src/component"
import { initialize } from "pawajs/src/control-flow/if"
import { setChained } from "pawajs/src/control-flow/utils"

export const condition=(hydrate,graph,context)=>{
    const getStore=document.querySelector(`[p\\:store="${hydrate.id}"]`)
    getStore.remove()
    const ifElement=getStore?.content.querySelector('[if]') 
    const chained=[{
        exp:ifElement.getAttribute('if'),
        condition:'if',element:ifElement}]
    const chainMap= setChained(ifElement,chained)    
    graph.nodeType = "condition";
    const componentGraph=getComponentGraph()
    const comment = document.createComment('condition')
    graph.control = comment;
    const inplaceElement=document.querySelector(`[p\\:id="${hydrate.id}"]`)
    if (inplaceElement) {
        inplaceElement.parentElement.insertBefore(comment, inplaceElement)
    }
    for (const child of Array.from(hydrate.children)) {
        resumer(child,graph,context)
    }
    const {evaluate}=initialize(ifElement,context,chained,chainMap,comment,graph.render,graph,componentGraph,{id:hydrate.current.id,enter:true})
    evaluate()
}