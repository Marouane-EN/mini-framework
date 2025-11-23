import { useState, useEffect } from "./core/hooks.js";
import { jsx } from "./core/jsx.js";
import { addRoute } from "./core/route.js";
import {handleRouteChange}  from "./core/route.js"

export function startTransition() {
    
    window.addEventListener('hashchange', handleRouteChange);
    handleRouteChange();
}
export { useState, useEffect, jsx, addRoute };
