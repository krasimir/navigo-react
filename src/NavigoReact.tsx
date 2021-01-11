import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import Navigo, { Match, RouteHooks } from "navigo";

import { RouteProps, Path, NotFoundRouteProps, NavigoSwitchContextType, NavigoRouting } from "../index.d";

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as NavigoRouting);
let SwitchContext = React.createContext({ isInSwitch: false, switchMatch: false } as NavigoSwitchContextType);

export function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  router = new Navigo(root || "/", { strategy: "ALL", noMatchWarning: true });
  // @ts-ignore
  window.router = router;
  return router;
}
function nextTick(callback: Function) {
  setTimeout(() => callback(), 0);
}

// utils
export function configureRouter(root: string) {
  return getRouter(root);
}
export function reset() {
  if (router) {
    router.destroy();
    router = undefined;
  }
}

// components
export function Route({ path, children, loose, before }: RouteProps) {
  const [context, setContext] = useReducer(
    (state: NavigoRouting, action: NavigoRouting) => {
      return { ...state, ...action };
    },
    { match: false }
  );
  const handler = useRef((match: false | Match) => {
    setContext({ match });
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    const router = getRouter();
    // creating the route
    router.on(path, handler.current);
    // before hooking
    if (before) {
      router.addBeforeHook(path, (done: Function) => {
        (before as Function)((result: any) => {
          if (typeof result === "boolean") {
            done(result);
          } else if (typeof result === "object" && result !== null) {
            Object.keys(result).forEach((key) => {
              context[key] = result[key];
            });
            setContext(context);
          }
        });
      });
    }
    // adding the service leave hook
    router.addLeaveHook(path, (done: Function) => {
      setContext({ match: false });
      done();
    });
    // initial resolving
    router.resolve();
    // initial data-navigo set up
    router.updatePageLinks();
    return () => {
      router.off(handler.current);
    };
  }, []);
  const switchContext = useContext(SwitchContext);
  const { isInSwitch, switchMatch } = switchContext;
  const renderChild = () => <Context.Provider value={context}>{children}</Context.Provider>;

  if (loose) {
    return renderChild();
  } else if (isInSwitch && context.match) {
    if (switchMatch) {
      if (switchMatch && context.match.route.path === (switchMatch as Match).route.path) {
        return renderChild();
      }
    } else {
      switchContext.switchMatch = context.match;
      return renderChild();
    }
  } else if (context.match) {
    return renderChild();
  }
  return null;
}
export function Base({ path }: Path) {
  getRouter(path);
  return null;
}
export function Switch({ children }: { children: any }) {
  useRoute("*"); // just so we can re-render when the route changes
  return <SwitchContext.Provider value={{ switchMatch: false, isInSwitch: true }}>{children}</SwitchContext.Provider>;
}
export function NotFound({ children, hooks }: NotFoundRouteProps) {
  const match = useNotFound(hooks);

  if (match) {
    return <Context.Provider value={{ match }}>{children}</Context.Provider>;
  }
  return null;
}
export function Redirect({ path }: Path) {
  useEffect(() => {
    getRouter().navigate(path);
  }, []);
  return null;
}

// hooks
export function useNavigo(): NavigoRouting {
  return useContext(Context);
}
export function useLocation(): Match {
  return getRouter().getCurrentLocation();
}

// internal hooks
function useNotFound(hooks?: RouteHooks | undefined): false | Match {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    const router = getRouter();
    router.notFound(handler.current, hooks);
    router.addLeaveHook("__NOT_FOUND__", (done: Function) => {
      setMatch(false);
      done();
    });
    router.resolve();
    router.updatePageLinks();
    return () => {
      router.off(handler.current);
    };
  }, []);

  return match;
}
