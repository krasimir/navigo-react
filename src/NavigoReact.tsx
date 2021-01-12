import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import Navigo, { Match, RouteHooks } from "navigo";

import { RouteProps, Path, NotFoundRouteProps, NavigoSwitchContextType, NavigoRouting } from "../index.d";
import { loadPartialConfig } from "@babel/core";

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
export function Route({ path, children, loose, before, after, already, leave }: RouteProps) {
  const [context, setContext] = useReducer((state: NavigoRouting, action: NavigoRouting) => ({ ...state, ...action }), {
    match: false,
  });
  const switchContext = useContext(SwitchContext);
  const handler = useRef((match: false | Match) => {
    setContext({ match });
    nextTick(() => getRouter().updatePageLinks());
  });
  const renderChild = () => <Context.Provider value={context}>{children}</Context.Provider>;
  const noneBlockingHook = (func: Function) => (match: Match) => {
    func((result: any) => {
      if (typeof result === "object" && result !== null) {
        setContext(result);
      }
    }, match);
  };
  const blockingHook = (func: Function) => (done: Function, match: Match) => {
    func((result: any) => {
      if (typeof result === "boolean") {
        done(result);
      } else if (typeof result === "object" && result !== null) {
        setContext(result);
      }
    }, match);
  };

  useEffect(() => {
    const router = getRouter();
    // creating the route
    router.on(path, handler.current);
    const navigoRoute = router.getRoute(handler.current);
    // hooking
    if (before) {
      router.addBeforeHook(navigoRoute, blockingHook(before));
    }
    if (after) {
      router.addAfterHook(navigoRoute, noneBlockingHook(after));
    }
    if (already) {
      router.addAlreadyHook(navigoRoute, noneBlockingHook(already));
    }
    if (leave) {
      router.addLeaveHook(navigoRoute, blockingHook(leave));
    }
    // adding the service leave hook
    router.addLeaveHook(navigoRoute, (done: Function) => {
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
