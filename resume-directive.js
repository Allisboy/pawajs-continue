import {$state} from 'pawajs/index.js'


export const resume_state=(el,attr,isResume)=>{
    if(el._running)return
    const name=attr.name.split('-')[2]
    el.removeAttribute(attr.name)
    try{
    const keys = Object.keys(el._context);
            const resolvePath = (path, obj) => {
                return path.split('.').reduce((acc, key) => acc?.[key], obj);
            };
            const values = keys.map((key) => resolvePath(key, el._context));
            const val = new Function(...keys, `
        try{
        return ${attr.value}
        }catch(error){
        console.log(error.message,error.stack)
        }
        `)(...values)
            el._context[name] = null
            el._context[name] = $state(val)
    
            el.removeAttribute(attr.name)
        } catch (error) {
            setPawaDevError({
                message: `Error from State directive ${error.message}`,
                error: error,
                template: el._template
            })
        }
}