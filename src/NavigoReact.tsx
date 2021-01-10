import React, { useRef, useEffect, useState, useContext } from "react";
import Navigo, { Match, RouteHooks } from "navigo";

import { RouteProps, NavigoContextType, Path, NotFoundRouteProps, NavigoSwitchContextType } from "../index.d";

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as NavigoContextType);
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
export function Route({ path, children, loose }: RouteProps) {
  const switchContext = useContext(SwitchContext);
  const { isInSwitch, switchMatch } = switchContext;
  const match = useRoute(path);
  const renderChild = () => <Context.Provider value={{ match }}>{children}</Context.Provider>;

  if (loose) {
    return renderChild();
  } else if (isInSwitch && match) {
    if (switchMatch) {
      if (switchMatch && match.route.path === (switchMatch as Match).route.path) {
        return renderChild();
      }
    } else {
      switchContext.switchMatch = match;
      return renderChild();
    }
  } else if (match) {
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
export function useMatch(): false | Match {
  return useContext(Context).match;
}
export function useLocation(): Match {
  return getRouter().getCurrentLocation();
}

// internal hooks
function useRoute(path: string): false | Match {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    const router = getRouter();
    router.on(path, handler.current);
    router.addLeaveHook(path, (done: Function) => {
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
