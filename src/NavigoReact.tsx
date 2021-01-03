import React, { useRef, useEffect, useState, useContext } from "react";
import Navigo, { Match, RouteHooks } from "navigo";

import { RouteProps, NavigoContextType, Path, NotFoundRouteProps } from "../index.d";

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as NavigoContextType);

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
export function Route({ path, children, hooks }: RouteProps) {
  const match = useRoute(path, hooks);

  if (match) {
    return <Context.Provider value={{ match }}>{children}</Context.Provider>;
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
