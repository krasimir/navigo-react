import React, { useRef, useEffect, useState } from "react";
import Navigo, { Match } from "navigo";

let router: Navigo | undefined;

function getRouter(root?: string): Navigo {
  if (router) {
    return router;
  }
  router = new Navigo(root || "/", { strategy: "ALL" });
  // @ts-ignore
  window.router = router;
  return router;
}
function nextTick(callback: Function) {
  setTimeout(() => callback(), 0);
}

export function configureRouter(root: string) {
  return getRouter(root);
}
export function reset() {
  if (router) {
    router.destroy();
    router = undefined;
  }
}

export function useRoute(path: string): [false | Match] {
  const [match, setMatch] = useState<false | Match>(false);
  const handler = useRef((match: false | Match) => {
    setMatch(match);
    nextTick(() => getRouter().updatePageLinks());
  });

  useEffect(() => {
    // @ts-ignore
    getRouter()
      .on(path, handler.current, {
        leave: (done, match) => {
          setMatch(false);
          done();
        },
      })
      .updatePageLinks();
    nextTick(() => getRouter().resolve());
    return () => {
      getRouter().off(handler.current);
    };
  }, []);

  return [match];
}
export function useRouter(): [Navigo] {
  return [getRouter()];
}
export function Route({ path, children }: { path: string; children: any }) {
  const [match] = useRoute(path);
  if (match) {
    return children;
  }
  return null;
}
