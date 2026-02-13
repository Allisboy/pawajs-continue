import { createEffect } from 'pawajs/reactive.js';
import { PawaComment, PawaElement } from 'pawajs/pawaElement.js';
import {  pawaWayRemover, safeEval, getEvalValues, setPawaDevError } from 'pawajs/utils.js';
import { merger_if} from 'pawajs/merger/if.js'
export const resume_if=(el,attr,stateContext,{comment,endComment,id,children,number})=>{
    const dataElement=document.querySelector(`[p\\:store-if="${id}"]`);
    dataElement.remove()
    const element=dataElement.content.firstElementChild
    // console.log(id,element,el._attributes)
    const chained=[{
      exp:element.getAttribute('if'),
      condition:'if',
      element:element
    }]
    const nextSiblings=element.nextElementSibling || null
    const chainMap=new Map()
    chainMap.set(element.getAttribute('if'),{condition:'if',element:element})
    const getChained=(nextSibling)=>{
                    if (nextSibling !== null) {
                        if (nextSibling && nextSibling.getAttribute('else') === '' || nextSibling.getAttribute('else-if')) {
                            // console.log(true,'it has',nextSibling.getAttribute('else'))
                            if (nextSibling.getAttribute('else-if')) {
                                chained.push({
                                    exp:nextSibling.getAttribute('else-if'),
                                    condition:'else-if',
                                    element:nextSibling
                                })
                                chainMap.set(nextSibling.getAttribute('else-if'),{condition:'else-if',element:nextSibling})
                                getChained(nextSibling.nextElementSibling)
                                nextSibling.remove()
                            }else if (nextSibling.getAttribute('else') === '') {
                                chained.push({
                                    exp:'false',
                                    condition:'else',
                                    element:nextSibling
                                })
                                chainMap.set('else',{condition:'else',element:nextSibling})
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
          const evaluate=merger_if(element,attr,stateContext,true,
            {comment,endComment,children,chained,chainMap}
          )
            createEffect(()=>{
                evaluate()
            },element)
    
}