import {setResumer} from 'pawajs/resumer.js'
import {resume_state} from './resume-directive.js'
import {resume_if} from './resumeIf.js'
import {resume_for} from './resumeFor.js'
import {resume_key} from './resumeKey.js'
import {resume_component} from './component.js'
import {createEffect} from 'pawajs/reactive.js'
import {checkKeywordsExistence,setPawaDevError} from 'pawajs/utils.js'
import { resume_switch } from './resumeSwitch.js'
export const resume_text=(el,attr,isName)=>{
       if (el._running) {
          return
        }
        el.removeAttribute('c-t')
        el._checkStatic()
        let textNodes
        el.childNodes.forEach((value, index) => {
          if(value.nodeType === 8 && value.data.startsWith('textEvaluator-')){
           textNodes=value.data.slice(14)
          }
        })
        const evaluate = () => {
          try {
              // Always use original content from map for evaluation
              let value = textNodes
              const regex = /@{([^}]*)}/g;
                const keys = Object.keys(el._context);
                const resolvePath = (path, obj) => {
                  return path.split('.').reduce((acc, key) => acc?.[key], obj);
                };
                const values = keys.map((key) => resolvePath(key, el._context));
                if(!value)return
                value = value.replace(regex, (match, expression) => {
                  if (checkKeywordsExistence(el._staticContext,expression)) {
                    return ''
                  }else{
    
                    el._textContent[expression]=value
                    const func = new Function(...keys, `return ${expression}`);
                    return String(func(...values));
                  }
                });
                if (el.tagName === 'TEXTAREA') {
                  el.value=value
                }else{
                  el.textContent=value;
                }
              
          
          } catch (error) {
            // console.warn(`error at ${el} textcontent`)
            setPawaDevError({
              message:`error at TextContent ${error.message}`,
              error:error,
              template:el._template
            })
          }
        };
      
        createEffect(() => {
          evaluate();
        },el);
}

export const resume_attribute=(el,attr,isName)=>{
      if(el._running) return
      // Store original attribute value
      
      if (el._componentName) {
        return
      }
      el.removeAttribute(attr.name)
      const attrName=attr.name.slice(5)
      const attrValue=attr.value
      el._preRenderAvoid.push(attrName)
      // A set of attributes that are treated as booleans and are best controlled via properties.
      const booleanAttributes = new Set(['checked', 'selected', 'disabled', 'readonly', 'required', 'multiple']);
      el._mainAttribute[attrName]=attr.value
      el._checkStatic()
      el.removeAttribute(attr.name)
      const evaluate = () => {
        
        try{
          // Always use original value from map for evaluation
        let value = attrValue;
        let isBoolean
        const regex = /@{([^}]*)}/g;
          const keys = Object.keys(el._context);
          const resolvePath = (path, obj) => {
            return path.split('.').reduce((acc, key) => acc?.[key], obj);
          };
          const values = keys.map((key) => resolvePath(key, el._context));
          
          value = value.replace(regex, (match, expression) => {
            if(checkKeywordsExistence(el._staticContext,expression)){
              return ''
            }else{
              const func = new Function(...keys, `return ${expression}`);
              const result = func(...values);
              isBoolean = result; // Assuming one expression for boolean attributes.
              return result;
            }
          });

        if (booleanAttributes.has(attrName)) {
            // If there was no expression, the presence of the attribute means true, unless its value is 'false'.
            const boolValue = regex.test(attrValue) ? !!isBoolean : attrValue.toLowerCase() !== 'false';
            regex.lastIndex = 0; // Reset regex state after .test()

            // Map attribute name to property name where they differ (e.g., 'readonly' -> 'readOnly')
            const propName = attrName === 'readonly' ? 'readOnly' : attrName;

            if (propName in el) {
                el[propName] = boolValue;
            }

            // Also update the attribute for consistency and for CSS selectors.
            if (boolValue) {
                el.setAttribute(attrName, '');
            } else {
                el.removeAttribute(attrName);
            }
        } else if (attrName === 'value' && 'value' in el) {
            el.value = value;
        } else {
          el.setAttribute(attrName, value);
        }
        }catch(error){
          console.warn(`failed at attribute ${attrName}`,el)
          setPawaDevError({
            message:`error at attribute ${error.message}`,
            error:error,
            template:el._template
          })
        }
      };

      createEffect(()=>{
        evaluate()
      })
}

export const initiateResumer=()=>{
  setResumer({
    resume_attribute,
    resume_text,
    resume_state,
    resume_if,
    resume_for,
    resume_switch,
    resume_component,
    resume_key
  })
}