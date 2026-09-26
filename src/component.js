import { resumer } from "../index.js";
import { getDevelopment } from "pawajs";
import {
  getComponentGraph,
  setComponentGraph,
} from "pawajs/src/component";
import { propsValidator } from "pawajs/src/component/utils";
import { addLazyComponentElement, components, hmrComponentsMap, lazyComponents, snapshotInsert } from "pawajs/src/global";
import { triggerLazyLoad } from "pawajs/src/hooks/registerComponent";
import { createEffect } from "pawajs/src/reactive";
import { safeEval, splitAndAdd } from "pawajs/src/utils";
import { reportContinueError } from "./dev.js";

export const component = (hydrate, graph, context) => {
  const Initialize = () => {
    const former = getComponentGraph();
    graph.former = former;
    setComponentGraph(graph);
    graph.nodeType = "component";
    
    graph.rest = {};
    graph.id=hydrate.id
    Object.assign(graph.transport, former?.transport || {});
    //setProps here
    
    const mainProps = {};
    const firstCompoBoundray = hydrate.pass;
    const prop = {};
    if (firstCompoBoundray) {
      const props = hydrate.props || {};
      for (const key in props) {
        prop[key] =()=> props[key];
        mainProps[key] = (c) => {
          if (typeof c === "function") {
            graph.reProps.push({ key, key, call: c });
          }
          return props[key];
        };
      }
    } else {
      const props = hydrate.props || {};
      for (const key in props) {
        const value = props[key];
        if (
          !key.startsWith("-") &&
          !key.startsWith("@") &&
          !key.startsWith("on-") &&
          key !== "ref"
        ) {
          if (!key.startsWith(':')) {
            const toProp = () => {
              let values=value
              if (value.includes("@{") && !key.startsWith('$')) {
                try {
                  const regex = /@{([^}]*)}/g;
                  values = values.replace(regex, (match, expression) => {
                    const result = safeEval(expression, context, true);
                    return result;
                  });
                } catch (error) {
                  reportContinueError(error, {
                    effect: hydrate.name,
                    ref: graph,
                    exp: `[${key}]:[${value}] at Prop`,
                  });
                  throw {
                    msg: error.message,
                    effect: hydrate.name,
                    ref: graph,
                    exp: `[${key}]:[${value}] at Prop`,
                  };
                }
                return values
              }else{
                return values
              }
            }
              let name = key.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
              if(key.startsWith('$'))name=name.slice(0)
              if (!prop[name]) {
                if (name === "class") prop["className"] = toProp;
                if (name === "default") prop["defaultValue"] = toProp;
                if (name !== "class" && name !== "default") {
                  prop[name] = toProp;
                }
              
            };
          }else if (key.startsWith(':')) {
            let newValue=value
             if(value === '') newValue="true";
             const propsName=key.slice(1) 
        try {
            const values=safeEval(`()=>{
                const prop=${newValue}
                return prop
            }
                `,context,true)
                if (values) {
          let name=propsName
                if(name.includes('-')){
                     name=name.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                }
          prop[name]=values
          
        }
        } catch (error) {
            reportContinueError(error, {
              effect: hydrate.name,
              ref: graph,
              exp: `[${key}]:[${value}] at Prop`,
            });
            throw {
                msg:error.message,
                effect:hydrate.name,
                ref:graph,
                exp:`[${key}]:[${value}] at Prop`
            }
        }
          }
        }
      }
       for (const key in prop) {
        mainProps[key] = (c) => {
          if (typeof c === "function") {
            graph.reProps.push({ key, key, call: c });
          }
          return prop[key]();
        };
      }
    }
    
    const compo = components.get(splitAndAdd(hydrate.name.toUpperCase()));
    if (typeof compo !== "function") {
      
      throw new Error(
        `Must be A functional Component or Check your Registration Area, seems it is not found at the module ${hydrate.name}`
      );
    }
    if (compo?.validateProps) {
      const validate = compo.validateProps;
      
      try {
        propsValidator(
          validate,
          { ...prop },
          hydrate.name,
          "",
          mainProps,
        );
      } catch (error) {
        reportContinueError(error, {
          effect: hydrate.name,
          ref: graph,
          exp: 'validateProps',
        });
      }
    }
    const call = compo(mainProps);
    for (const effect of graph.beforeMount) {
            const result=effect()
            if(typeof result === 'function')graph.unMount.push(result)
        }
    graph.setContext({ ...context,...graph.context });
    const newContext = {
      ...context,
      ...graph.context,
    };
    graph.context={}
    for (const child of hydrate.children) {
      resumer(child, graph, newContext);
    }
    const elements = document.querySelectorAll(`[p\\:id="${hydrate.id}"]`);
    
    graph.name=hydrate.name
    if (hydrate.ref === "ref") {
      graph.ref = graph.children[0];
      // console.log('has ref',hydrate);
    } else {
      if (elements) {
        graph.ref = elements[0];
      }
    }
    const componentName=splitAndAdd(hydrate.name)
          if (getDevelopment()) {
          const hrmElement=document.querySelector(`[hmr="${hydrate.id}"]`)
          const content=hrmElement?.content?.firstElementChild
          hrmElement?.remove?.()
          const id=Date.now() + Math.random()
          const removeFromHmrMap = () => {
          const array = hmrComponentsMap.get(hydrate.name)
          if (!array) return
                
          const index = array.findIndex((item) => item.id === id)
          if (index !== -1) {
            array.splice(index, 1)
          }
        
          if (array.length === 0) {
            hmrComponentsMap.delete(splitAndAdd(hydrate.name))
          }
        }
          if (hmrComponentsMap.has(splitAndAdd(hydrate.name))) {
            hmrComponentsMap.get(splitAndAdd(hydrate.name)).push({id:id,element:content,former:former,remove:()=>{
              removeFromHmrMap()
              graph.hmr=true
              graph.remove()
              graph.fromParent()
            },render:graph.render,graph:graph,hrmInitial:snapshotInsert(graph.context),context})
          }else{
            hmrComponentsMap.set(splitAndAdd(hydrate.name),[{id:id,element:content,former:former,remove:()=>{
              removeFromHmrMap()
              graph.hmr=true
              graph.remove()
              graph.fromParent()
            },render:graph.render,graph:graph,hrmInitial:snapshotInsert(graph.context),context}])
          }
        }
    for (const element of Array.from(elements)) {
      element.removeAttribute("p:id");
      let render=false
        if (element.hasAttribute('on-client')) {
            render=true
        }
      graph.render(element, render);
    }

    graph.firstTime = false;
    Promise.resolve().then(() => {
      for (const effect of graph.arrayEffect) {
        const result = stateWatch(effect.effect, effect.deps);
        if (typeof result === "function") graph.unMount.push(result);
      }
      for (const effect of graph.readOnlyffect) {
        const result = createEffect(effect.effect, graph, effect?.update);
        if (typeof result === "function") graph.unMount.push(result);
      }
      for (const effect of graph.mount) {
        const result = effect();
        if (typeof result === "function") graph.unMount.push(result);
      }
    });
    setComponentGraph(former);
  };
  
  if (lazyComponents.has(splitAndAdd(hydrate.name.toUpperCase()))) {
              addLazyComponentElement(splitAndAdd(hydrate.name.toUpperCase()),()=>Initialize()) 
              triggerLazyLoad(splitAndAdd(hydrate.name.toUpperCase()))
          }else
  Initialize();
};
