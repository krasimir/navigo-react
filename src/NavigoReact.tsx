import React, { useRef, useEffect, useState, useContext } from "react";
import Navigo, { Match } from "navigo";

type ContextType = {
  match: false | Match;
};

let router: Navigo | undefined;
let Context = React.createContext({ match: false } as ContextType);

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
export function Route({ path, children }: { path: string; children: any }) {
  const match = useRoute(path);

  if (match) {
    return <Context.Provider value={{ match }}>{children}</Context.Provider>;
  }
  return null;
}

// hooks
export function useRoute(path: string): false | Match {
  const [match, setMatch] = useState<false | Match>(getRouter().matchLocation(path));
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    getRouter().on(path, handler.current, {
      leave: (done, match) => {
        setMatch(false);
        done();
      },
    });
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
