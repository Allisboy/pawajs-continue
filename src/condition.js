import { resumer } from "../index.js"
import { getComponentGraph, ifInitializer as initialize, setChained } from "pawajs"

export const condition=(hydrate,graph,context)=>{
    const getStore=document.querySelector(`[p\\:store="${hydrate.id}"]`)
    const ifElement=getStore?.content.querySelector('[if]') 
    const chained=[{
        exp:ifElement.getAttribute('if'),
        condition:'if',element:ifElement}]
    const chainMap= setChained(ifElement,chained)    
    graph.nodeType = "condition";
    const componentGraph=getComponentGraph()
    const comment = document.createComment('condition')
    graph.control = comment;
  
        getStore.replaceWith(comment)
    
    for (const child of Array.from(hydrate.children)) {
        resumer(child,graph,context)
    }
    const {evaluate}=initialize(ifElement,context,chained,chainMap,comment,graph.render,graph,componentGraph,{id:hydrate.current.id,enter:true})
    evaluate()
}