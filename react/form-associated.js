import{FormAssociatedElement}from"../elements/form-associated.js";import{customElements}from"../api/dom.js";import{createElement,useCallback}from"react";customElements.define("a-form-associated",FormAssociatedElement);var FormAssociatedComponent=({ref,...props})=>createElement("a-form-associated",{...props,ref:useCallback((current)=>{if(typeof ref==="function")ref(current);else if(ref&&"current"in ref)ref.current=current},[ref])});export{FormAssociatedComponent}