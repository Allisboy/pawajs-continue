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
    if(attr.value === '') attr.value=true;
    const value=new Function(...keys,`
      return ()=>{
        try{
      const prop= ${replaceTemplateOperators(attr.value)};
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
              setPawaDevError({
                  message:`error from ${el._componentName} prop :${attr.name} ${error.message}`,
                  error:error,
                  template:this._template
                })
            }
}
