import { components,keepContext,render,getCurrentContext } from "pawajs/index.js"
import { PawaElement, PawaComment } from "pawajs/pawaElement.js"
import  PawaComponent  from "pawajs/pawaComponent.js"
import { createEffect } from "pawajs/reactive.js"
import { setProps } from "./utils.js"
import {propsValidator} from 'pawajs/utils.js'
export const resume_component=(el,attr,setStateContext,mapsPlugin,formerStateContext,
  pawaContext,stateWatch,{comment,endComment,children,name,id,serialized})=>{
el.removeAttribute(attr.name)
el._running=true  
    let appContext={
        _transportContext:{},
        _formerContext:formerStateContext,
        _reactiveProps:{},
        _template:'',
        _transportContext:{},
        _elementContext:{},
        _hasRun:false,
        _static:[],
        _serializedData:{}
    }
    /**
     * @param {HTMLElement} node
     */
    try{
const oldState=getCurrentContext()
        
        PawaComment.Element(comment)
        const compo=components.get(name)
        const binary = atob(serialized.replace(/-/g, '+'));
        const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
        const json = new TextDecoder('utf-8').decode(bytes);
      
        const props = JSON.parse(json);
        const prop={
            children:props.children
    }
    /**
     * @type {PawaElement | HTMLElement}
     */
    const element=document.createElement(name)
    PawaElement.Element(element,el._context)
    element._underControl=comment
        comment._componentElement=element
        comment._controlComponent=true
        comment._endComment=endComment
        if(props?.data){
          Object.assign(element._context,props.data)
        }
        comment.data=`<${name}>`
        endComment.data=`</${name}>`
    if(!compo){
      
        const fakeComponent=new PawaComponent(()=>null)
         const stateContexts=setStateContext(fakeComponent)
         stateContexts._resume=true
        stateContexts._prop={children:'',...props._props}
        stateContexts._static=[...stateContexts._static,...props.context]
        if(props?.data){
          Object.assign(element._context,props.data)
        }
        stateContexts._elementContext={...element._context}
            const number={notRender:null,index:null}
        children.forEach((value, index) => {
          number.index = index
            if (number.notRender !== null && index <= number.notRender) return
          render(value,element._context,number,attr.name)
        })
        stateContexts._hasRun=true
        keepContext(stateContexts._formerContext)
        return
      }
    // props setter 
    let isStatic=false
    for (const [key,value] of Object.entries(props.props)) {
        const attr={
            name:key,
            value:value
        }
        if(!isStatic){
            const resStatic=setProps(el._context,attr,prop,element)
            isStatic=resStatic.static
        }
    }
    if(isStatic){
        const fakeComponent=new PawaComponent(()=>null)
         const stateContexts=setStateContext(fakeComponent)
         stateContexts._resume=true
          if(props?.data){
          Object.assign(element._context,props.data)
        }
         stateContexts._prop={children:'',...props._props}
            stateContexts._elementContext={...element._context}
            stateContexts._static=[...stateContexts._static,...props.context]
        const number={notRender:null,index:null}
        
        children.forEach((value, index) => {
          number.index = index
            if (number.notRender !== null && index <= number.notRender) return
          render(value,element._context,number)
        })
        stateContexts._hasRun=true
            keepContext(stateContexts._formerContext)
        return
    }
    for (const [key,value] of Object.entries(props.slots)) {
        prop[key]=()=>value
    }
    el._isKill=true
            el._kill=()=>{
               pawaWayRemover(comment,endComment)
              comment.remove(),endComment.remove();
             }
    element._props=prop
    let isIndex=0
    //props setter
    const validprops=element._component.validPropRule
    let done=true
    if(validprops && Object.entries(validprops).length > 0){
      done= propsValidator(validprops,{...element._props},element._componentName,element._template,element)
    }
    element._componentTerminate=() => {
      comment._terminateByComponent(endComment)
    }
    const apps={
        children:prop.children,
        ...element._props
    }
        const component =element._component
        const stateContexts=setStateContext(component)
        stateContexts._resume=true
        stateContexts._prop={children:props.children,...element._props}
            stateContexts._elementContext={...element._context}
            stateContexts._name=element._componentName
            stateContexts._template=element._template
            stateContexts._recallEffect=()=>{
              
            }
            stateContexts._serializedData=props.data
            let isAwait=false
            if(done){
                const compoCall=component.component(apps)
                 isAwait=compoCall instanceof Promise
            if( isAwait){
              const storeContext=stateContexts
              compoCall.then((res)=>{
                if (storeContext._hasRun) {
                    storeContext._hasRun = false
                  }
                  keepContext(storeContext)
                  if (storeContext?._insert) {
                    Object.assign(element._context,storeContext._insert)
                }
                childInsert()
                lifeCircle()
                storeContext._hasRun=true
              })
            }else{
              Object.assign(element._context,stateContexts._insert)
            }
          }
          if (component?._insert) {
            
            Object.assign(element._context,component._insert)
            // console.log(el,el._context)
          }
            const childInsert=()=>{
              element._component?._hook?.beforeMount?.forEach((bfm) => {
             const result= bfm(comment)
             if (typeof result === 'function') {
               element._unMountFunctions.push(result)
             }
            })
            
            element._component?._hook?.isMount.forEach((hook) => {
                element._MountFunctions.push(hook)
            })
            element._component?._hook?.isUnMount.forEach((hook) => {
                element._unMountFunctions.push(hook)
            })
            const number={notRender:null,index:null}
        children.forEach((value, index) => {
          isIndex++
          if(value.hasAttribute(attr.name)) value.removeAttribute(attr.name);
          number.index = index
            if (number.notRender !== null && index <= number.notRender) return
          render(value,element._context,number,attr.name)
        })
            }
            if(!isAwait){
              childInsert()
            }
            const lifeCircle=()=>{
              Promise.resolve().then(()=>{
              element._component?._hook?.effect.forEach((hook) => {
                if(hook?.done) return
                hook.done=true
                const result=stateWatch(hook.effect,hook.deps)
                if (typeof result === 'function') {
                  element._unMountFunctions.push(result)
                }
              })
                
              if (element._component?._hook?.reactiveEffect) {
                element._component?._hook?.reactiveEffect.forEach((hook) => {
                  if(hook?.done) return
                  hook.done=true
                  const effect=hook.effect(comment)
                  if (hook.deps?.component) {
                    createEffect(() => {
                      return effect()
                    },element) 
                  } else {
                    createEffect(() => {
                      return effect()
                    },hook.deps.value)
                  }
                })
              }
              element._MountFunctions.forEach((func) => {
                func.done=true
                const result=func(comment)
                if (typeof result === 'function') {
                  element._unMountFunctions.push(result)
                }
              })
              
            })
            }
            if(!isAwait){
              lifeCircle()
            }
            stateContexts._hasRun=true
            
            keepContext(stateContexts._formerContext)
            if (stateContexts._transportContext) {
              let contextId = stateContexts._transportContext
              delete pawaContext[contextId]
            }
            __pawaDev.totalComponent++
               
        
    }catch(error){
        console.log(error.message,error.stack)
        console.error(error.message,error.stack)
    }
   
}
