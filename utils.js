import {setPawaDevError,replaceTemplateOperators,checkKeywordsExistence} from 'pawajs/utils.js'
export const setProps=(context,attr,props,el)=>{
  if(checkKeywordsExistence(el._staticContext,attr.value)){
    return {
      static:true
    }
  }
    try {
           const keys = Object.keys(context);
    const resolvePath = (path, obj) => {
      return path.split('.').reduce((acc, key) => acc?.[key], obj);
    };
    const values = keys.map((key) => resolvePath(key, context));
    if (attr.name.startsWith(':')) {
      attr.name = attr.name.slice(1);
      let value=attr.value
                  if (value.includes('@{')) {
                         const regex = /@{([^}]*)}/g;
                         let isStatic=false
                          value.replace(regex, (match, expression) => {
                               if (checkKeywordsExistence(el._staticContext, expression)) {
                                   isStatic=true
                                   return expression
                               } })
                         const getValue=()=>{
                           value = attr.value.replace(regex, (match, expression) => {
                                   const res = new Function(...keys,`return ${expression}`)(...values)
                                   return res
                                });
                                return value
                         }

                            props[attr.name]=getValue
                            return{
                              static:isStatic
                            }
                       }else if( attr.name.startsWith('on-') || attr.name.startsWith('out-') || attr.name === 'ref'){
                        let name=attr.name
                        name=name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                        const res=new Function(...keys,`return (e)=>{
                          ${attr.value}
                        }`)(...values)
                        props[name]=()=>res
                        return {
                       static:false
                      } 
                       }else{
                        props[attr.name]=()=>attr.value
                        return {
                       static:false
                      } 
                       }    
                       
    }
    if(attr.value === '') attr.value=true;
    const value=new Function(...keys,`
      return ()=>{
        try{
      const prop= ${attr.value};
      if(prop === '')return prop
      return prop
      }catch(error){
        console.error(error.message,error.stack)
       }
    }
    `)(...values)
    props[attr.name]=value
    return {
      static:false
    }
            } catch (error) {
              console.error(error.message,error.stack,el,'at props')
              setPawaDevError({
                  message:`error from ${el._componentName} prop :${attr.name} ${error.message}`,
                  error:error,
                  template:el?._template
                })
            }
}
