import { resumer } from "../index.js"
import { getComponentGraph } from "pawajs/src/component"
import { initializer } from "pawajs/src/control-flow/key"

export const key=(hydrate,graph,context)=>{
    const getStore=document.querySelector(`[p\\:store="${hydrate.id}"]`)
    getStore.remove()
    const keyElement=getStore?.content.querySelector('[key]') 
    const comment=document.createComment('key')
    graph.nodeType='key'
    graph.control=comment
    const attr={
        name:'key',
        value:keyElement.getAttribute('key')
    }
    for (const child of Array.from(hydrate.children)) {
        resumer(child,graph,context)
    }
const componentGraph=getComponentGraph()
   const {evaluate}= initializer(keyElement,attr,context,graph,graph.render,componentGraph,comment,{enter:true,key:hydrate.key})
   evaluate()
}