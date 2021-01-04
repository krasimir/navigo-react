import React, { useRef, useEffect, useState, useContext } from "react";
import Navigo, { Match, RouteHooks } from "navigo";

import { RouteProps, NavigoContextType, Path, NotFoundRouteProps, NavigoSwitchContextType } from "../index.d";
import { render } from "react-dom";

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as NavigoContextType);
let SwitchContext = React.createContext({ isInSwitch: false, switchMatch: false } as NavigoSwitchContextType);

function getRouter(root?: string): Navigo {
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
function composeRouteHooks(onLeave: Function, userHooks?: RouteHooks): RouteHooks {
  if (!userHooks) {
    return {
      leave: (done) => {
        onLeave();
        done();
      },
    };
  } else {
    return Object.assign({}, userHooks, {
      leave: (done: Function, match: Match) => {
        if (userHooks.leave) {
          userHooks.leave((res: boolean) => {
            if (typeof res === "undefined" || res === false) {
              onLeave();
            }
            done(res);
          }, match);
        } else {
          onLeave();
          done();
        }
      },
    });
  }
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
export function Base({ path }: Path) {
  getRouter(path);
  return null;
}
export function Switch({ children }: { children: any }) {
  useRoute("*"); // just so we can re-render when the route changes
  return <SwitchContext.Provider value={{ switchMatch: false, isInSwitch: true }}>{children}</SwitchContext.Provider>;
}
export function Route({ path, children, hooks }: RouteProps) {
  const switchContext = useContext(SwitchContext);
  const { isInSwitch, switchMatch } = switchContext;
  const match = useRoute(path, hooks);
  const renderChild = () => <Context.Provider value={{ match }}>{children}</Context.Provider>;

  if (isInSwitch && match) {
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
export function NotFound({ children, hooks }: NotFoundRouteProps) {
  const match = useNotFound(hooks);

  if (match) {
    return <Context.Provider value={{ match }}>{children}</Context.Provider>;
  }
  return null;
}
export function Redirect({ path }: Path) {
  useEffect(() => {
    useRouter().navigate(path);
  }, []);
  return null;
}

// hooks
export function useRoute(path: string, hooks?: RouteHooks | undefined): false | Match {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    getRouter().on(
      path,
      handler.current,
      composeRouteHooks(() => setMatch(false), hooks)
    );
    getRouter().resolve();
    getRouter().updatePageLinks();
    return () => {
      getRouter().off(handler.current);
    };
  }, []);

  return match;
}
export function useRouter(): Navigo {
  return getRouter();
}
export function useMatch(): false | Match {
  return useContext(Context).match;
}
export function useNotFound(hooks?: RouteHooks | undefined): false | Match {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    getRouter().notFound(
      handler.current,
      composeRouteHooks(() => setMatch(false), hooks)
    );
    getRouter().resolve();
    getRouter().updatePageLinks();
    return () => {
      getRouter().off(handler.current);
    };
  }, []);

  return match;
}
export function useLocation(): Match {
  return getRouter().getCurrentLocation();
}
