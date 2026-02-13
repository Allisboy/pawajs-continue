import { createEffect } from 'pawajs/reactive.js';
import { PawaComment, PawaElement } from 'pawajs/pawaElement.js';
import { processNode, pawaWayRemover, safeEval, getEvalValues, setPawaDevError, getComment,getEndComment, checkKeywordsExistence } from 'pawajs/utils.js';
import { merger_for } from 'pawajs/merger/for.js';
/**
 * @param {HTMLElement | PawaElement} el
 * @param {{value:string,name:string}} attr,
 * @param {{...any}} stateContext
 * @param {{comment:Comment,endComment:Comment,id:string,children:[],dataComment:Comment}} arg
 */
export const resume_for=(el,attr,stateContext,{comment,endComment,id,children,dataElement})=>{
    const element=dataElement.content.firstElementChild
    if(checkKeywordsExistence(el._staticContext,element.getAttribute('for-each'))) return
    PawaElement.Element(element,el._context)
    element._out = true
            const parent = endComment.parentElement
            element._deCompositionElement = true
            element._isKill = true
            element._kill = () => {
                pawaWayRemover(comment, endComment)
                comment.remove(), endComment.remove();
            }
            const keyOrders=new Map()
            PawaComment.Element(comment)
            comment._setCoveringElement(element)
            element._underControl = comment
            const context = element._context
            const insertIndex = new Map()
            const elementArray = new Set()
            let index=0
            let isCurrentComment
            PawaElement.Element(element,el._context)
            const value=element.getAttribute('for-each')         
            const exp = new WeakMap()
                const primitive = { key: value }
                let firstEnter = true
                const split = value.split(' in ')
                const arrayName = split[1]
                const arrayItems = split[0].split(',')
                const arrayItem = arrayItems[0]
                const indexes = arrayItems[1]
                element._underControl = comment
                el._deCompositionElement = true
        element._isKill = true
        element._kill = () => {
            pawaWayRemover(comment, endComment)
            comment.remove(), endComment.remove();
        }
        
            const getKeyComment=(comments)=>{
                if(comments === endComment) return
     const current=comments?.data?.split('@-$@-$@') || []
     if(current[1] === id && current[0] === 'forKey'){
        comments.data=`for-key ${current[2]}`
        PawaComment.Element(comments)
        comments._index = index
        keyOrders.set(index,{comment:comments})
        comments._setKey(current[2])
        isCurrentComment=comments
        elementArray.add(comments)
        insertIndex.set(index, current[2])
        index++
       getKeyComment(comments.nextSibling)
     }else if(current[0] === 'endForKey' && current[1] === id && isCurrentComment){
        isCurrentComment._endComment = comments
        comments.data=`end -for-key ${current[2]}`
        getKeyComment(comments.nextSibling)
    }else{
         getKeyComment(comments.nextSibling)
     }
    }
    
    const unique=id
    let evalFunc
    getKeyComment(comment)
    const att={name:'for-each',value:element.getAttribute('for-each')}
   const evaluate=merger_for(element,stateContext,att,arrayName,arrayItem,indexes,true,
    {comment,endComment,unique,elementArray,insertIndex,keyOrders})   
    createEffect(()=>{
        evaluate()
    })
}