import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import Navigo, { Match as NavigoMatch, RouteHooks as NavigoHooks, Route as NavigoRoute } from "navigo";
// import Navigo, { Match as NavigoMatch, RouteHooks as NavigoHooks, Route as NavigoRoute } from "../../navigo";

import { RouteProps, Path, NotFoundRouteProps, NavigoSwitchContextType, NavigoRouting } from "../index.d";

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as NavigoRouting);
let SwitchContext = React.createContext({ isInSwitch: false, switchMatch: false } as NavigoSwitchContextType);

// types
export type Match = NavigoMatch;
export type RouteHooks = NavigoHooks;

export function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  // @ts-ignore
  router = window.R = new Navigo(root || "/", { strategy: "ALL", noMatchWarning: true });
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
export function Route({ path, children, loose, before, after, already, leave }: RouteProps) {
  const route = useRef<NavigoRoute | undefined>(undefined);
  const [context, setContext] = useReducer((state: NavigoRouting, action: NavigoRouting) => ({ ...state, ...action }), {
    match: false,
  });
  const switchContext = useContext(SwitchContext);
  const renderChild = () => <Context.Provider value={context}>{children}</Context.Provider>;
  const noneBlockingHook = (func: Function) => (match: Match) => {
    func((result: any) => {
      if (typeof result === "object" && result !== null) {
        setContext(result);
      }
    }, match);
  };
  const blockingHook = (func: Function) => (done: Function, match: Match) => {
    // @ts-ignore
    func((result: any) => {
      if (typeof result === "boolean") {
        done(result);
      } else if (typeof result === "object" && result !== null) {
        setContext(result);
      }
    }, match);
  };

  useEffect(() => {
    let isMounted = true;
    const router = getRouter();
    const handler = (match: false | Match) => {
      if (isMounted) {
        setContext({ match });
      }
      nextTick(() => getRouter().updatePageLinks());
    };
    // creating the route
    router.on(path, handler);
    const navigoRoute = (route.current = router.getRoute(handler));
    // hooking
    if (before) {
      router.addBeforeHook(navigoRoute as NavigoRoute, blockingHook(before));
    }
    if (after) {
      router.addAfterHook(navigoRoute as NavigoRoute, noneBlockingHook(after));
    }
    if (already) {
      router.addAlreadyHook(navigoRoute as NavigoRoute, noneBlockingHook(already));
    }
    if (leave) {
      router.addLeaveHook(navigoRoute as NavigoRoute, blockingHook(leave));
    }
    // adding the service leave hook
    router.addLeaveHook(navigoRoute as NavigoRoute, (done: Function) => {
      if (isMounted) {
        setContext({ match: false });
      }
      done();
    });
    // initial resolving
    router.resolve();
    // initial data-navigo set up
    router.updatePageLinks();
    return () => {
      isMounted = false;
      router.off(handler);
    };
  }, []);

  // make sure that the lifecycle funcs have access to the latest local state values
  useEffect(() => {
    if (before && route.current && route.current.hooks.before && route.current.hooks.before[0]) {
      // @ts-ignore
      route.current.hooks.before[0] = blockingHook(before);
    }
    if (after && route.current && route.current.hooks.after && route.current.hooks.after[0]) {
      // @ts-ignore
      route.current.hooks.after[0] = noneBlockingHook(after);
    }
    if (already && route.current && route.current.hooks.already && route.current.hooks.already[0]) {
      // @ts-ignore
      route.current.hooks.already[0] = noneBlockingHook(already);
    }
    // @ts-ignore
    if (leave && route.current && route.current.hooks.leave.length === 2) {
      // @ts-ignore
      route.current.hooks.leave[0] = blockingHook(leave);
    }
  }, [before, after, already, leave]);

  if (loose) {
    return renderChild();
  } else if (switchContext.isInSwitch && context.match) {
    if (switchContext.switchMatch) {
      if (switchContext.switchMatch.route.path === context.match.route.path) {
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
  const [match, setMatch] = useState<Match | false>(false);
  useEffect(() => {
    function switchHandler(match: Match) {
      setMatch(match);
    }
    getRouter().on("*", switchHandler);
    return () => {
      getRouter().off(switchHandler);
    };
  }, []);
  return (
    <SwitchContext.Provider
      value={{ switchMatch: false, isInSwitch: true }}
      key={match ? match.url : `switch${new Date().getTime()}`}
    >
      {children}
    </SwitchContext.Provider>
  );
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

const API = {
  getRouter,
  configureRouter,
  reset,
  Route,
  Base,
  Switch,
  NotFound,
  Redirect,
  useNavigo,
  useLocation,
};

export default API;
