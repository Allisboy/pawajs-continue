import { resumer } from "..";

export const awaits=(hydrate,graph,context)=>{
    const inLoadingState=!hydrate.resolved
    hydrate.resolved=false
    const id=hydrate.id
    graph.nodeType="await"
    const run=(hy,streamed=false)=>{
        if (streamed) {
        replaceIn(hy)
        return
       }
         const con=hy?.context || {} 
        const itemContext={
            ...context,
            ...con
        }
        graph.setContext(itemContext)
        for (const child of hy.children) {
        resumer(child,graph,itemContext)
    }
       
    const elements=document.querySelectorAll(`[p\\:id="${hydrate.id}"]`)
    if (elements) {
        for (const element of Array.from(elements)) {
            
                if (!streamed && element.hasAttribute('stream-id')) {
                    break;
                }
                element.removeAttribute('p:id')
                let render=false
        if (element.hasAttribute('on-client')) {
            render=true
        }
                graph.render(element,render)
            
        }
    }
}
 const replaceIn=(hy)=>{
        const getStreamed=document.querySelector(`[stream-id="${hydrate.id}"]`)
        const getLoader=document.querySelector(`[await-id="${hydrate.id}"]`)
        setTimeout(() => {
            const comment=document.createComment('replace')
            getLoader.parentElement.insertBefore(comment, getLoader)
            graph.remove().then(()=>{
                comment.parentElement.insertBefore(getStreamed, comment)
                getStreamed.removeAttribute('hidden')
                getStreamed.removeAttribute('stream-id')
                getLoader.remove()
                run(hy)
            })
            
        }, 200);
    }
    run(hydrate)
    if (window.awaits?.[id] && typeof window.awaits[id] !== 'function') {
        const resolvedHydrate=window.awaits[id]
        delete window.awaits[id]
        run(resolvedHydrate,true)
    }
    if (inLoadingState) {
        window.awaits[id]=run 
    }
   
    return false
}