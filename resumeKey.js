import { createEffect } from 'pawajs/reactive.js';
import { PawaComment, PawaElement } from 'pawajs/pawaElement.js';
import {  pawaWayRemover, safeEval, getEvalValues, setPawaDevError } from 'pawajs/utils.js';
import { merger_key } from 'pawajs/merger/key.js';
export const resume_key=(el,attr,stateContext,{comment,endComment,id,children})=>{
    let dataElement
  dataElement=document.querySelector(`[p\\:store-key="${id}"]`);
   const element=dataElement.content.firstElementChild
   dataElement.remove()
    PawaElement.Element(element,el._context)
        element._out = true
                const parent = endComment.parentElement
                element._deCompositionElement = true
                element._isKill = true
                element._kill = () => {
                    pawaWayRemover(comment, endComment)
                    comment.remove(), endComment.remove();
                  }
                  PawaComment.Element(comment)
                  comment._setCoveringElement(element)
                  element._underControl = comment
                  const context = element._context
                  comment._controlComponent = true
            el.removeAttribute(attr.name)
            const att={name:'key',value:element.getAttribute('key')}
            let key
            try {
                key=new Function(`return ${attr.value}`)()    
            } catch (error) {
                key=''
            }
            
          const evaluate=merger_key(element,att,stateContext,true,
            {comment,endComment,children,old:key})
          createEffect(()=>{
            evaluate()
          },element)
}