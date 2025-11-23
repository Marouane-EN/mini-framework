import { startTransition } from "../main.js";
import { render } from "./render.js";

const routes = {};
export function addRoute(path, callback) {
    if (routes[path]) return
    
    routes[path] = callback
    startTransition();
}

export function handleRouteChange() {
    const route = window.location.hash.slice(1) || '/';
    if (routes[route]) {
        render(routes[route]);
    }
}
