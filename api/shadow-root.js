var setShadowOf=(host,{adoptedStyleSheets=[],innerHTML="<slot>",...init})=>Object.assign(host.attachShadow(init),{adoptedStyleSheets,innerHTML});export{setShadowOf}