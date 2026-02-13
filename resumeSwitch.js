import { createEffect } from 'pawajs/reactive.js';
import { PawaComment, PawaElement } from 'pawajs/pawaElement.js';
import {  pawaWayRemover, safeEval, getEvalValues, setPawaDevError } from 'pawajs/utils.js';
import { merger_switch } from 'pawajs/merger/switch.js';
export const resume_switch=(el,attr,stateContext,{comment,endComment,id,children})=>{
    let dataElement
    dataElement=document.querySelector(`[p\\:store-switch="${id}"]`);
    const element=dataElement.content.firstElementChild
    dataElement.remove()
    const att={name:'switch',value:element.getAttribute('switch')}
    element.removeAttribute('switch')
    const chained=[{
      exp:element.getAttribute('case'),
      condition:'case',
      element:element
    }]
    const nextSiblings=element.nextElementSibling || null
    const chainMap=new Map()
    chainMap.set(element.getAttribute('case'),{condition:'case',element:element})
    const getChained=(nextSibling)=>{
                    if (nextSibling !== null) {
                        if (nextSibling && nextSibling.getAttribute('case') || nextSibling.getAttribute('default') === '') {
                            // console.log(true,'it has',nextSibling.getAttribute('else'))
                            if (nextSibling.getAttribute('case')) {
                                chained.push({
                                    exp:nextSibling.getAttribute('case'),
                                    condition:'case',
                                    element:nextSibling
                                })
                                chainMap.set(nextSibling.getAttribute('case'),{condition:'case',element:nextSibling})
                                getChained(nextSibling.nextElementSibling)
                                nextSibling.remove()
                            }else if (nextSibling.getAttribute('default') === '') {
                                chained.push({
                                    exp:'false',
                                    condition:'default',
                                    element:nextSibling
                                })
                                chainMap.set('default',{condition:'default',element:nextSibling})
                                nextSibling.remove()
                            }
                        }
                    }
                }
             getChained(nextSiblings)

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
        /**
         * endComment,comment,func(a function to set func),firstEnter,getFirst,stateContext
         */
          const evaluate=merger_switch(element,att,stateContext,true,
            {comment,endComment,children,chained,chainMap,caseValue:attr}
          )
          
            createEffect(()=>{
                evaluate()
            },element)
    
}