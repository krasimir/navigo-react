import _extends from "@babel/runtime/helpers/extends";
import React, { useRef, useEffect, useState, useContext, useReducer } from "react";
import Navigo from "navigo"; // import Navigo, { Match as NavigoMatch, RouteHooks as NavigoHooks, Route as NavigoRoute } from "../../navigo";

var router;
var Context = React.createContext({
  match: false
});
var SwitchContext = React.createContext({
  isInSwitch: false,
  switchMatch: false
}); // types

export function getRouter(root) {
  if (router) {
    return router;
  } // @ts-ignore


  router = window.R = new Navigo(root || "/", {
    strategy: "ALL",
    noMatchWarning: true
  }); // @ts-ignore

  window.router = router;
  return router;
}

function nextTick(callback) {
  setTimeout(function () {
    return callback();
  }, 0);
} // utils


export function configureRouter(root) {
  return getRouter(root);
}
export function reset() {
  if (router) {
    router.destroy();
    router = undefined;
  }
} // components

export function Route(_ref) {
  var path = _ref.path,
      children = _ref.children,
      before = _ref.before,
      after = _ref.after,
      already = _ref.already,
      leave = _ref.leave,
      name = _ref.name;
  var route = useRef(undefined);

  var _useReducer = useReducer(function (state, action) {
    return _extends({}, state, action);
  }, {
    match: false
  }),
      context = _useReducer[0],
      setContext = _useReducer[1];

  var switchContext = useContext(SwitchContext);

  var renderChild = function renderChild() {
    return /*#__PURE__*/React.createElement(Context.Provider, {
      value: context
    }, children);
  };

  var noneBlockingHook = function noneBlockingHook(func) {
    return function (match) {
      func({
        render: function render(result) {
          return setContext(_extends({}, result, {
            match: match
          }));
        },
        match: match
      });
    };
  };

  var blockingHook = function blockingHook(func) {
    return function (done, match) {
      func({
        render: function render(result) {
          return setContext(_extends({}, result, {
            match: match,
            __allowRender: true
          }));
        },
        done: done,
        match: match
      });
    };
  }; // creating the route + attaching hooks


  useEffect(function () {
    var isMounted = true;
    var router = getRouter();

    var handler = function handler(match) {
      if (isMounted) {
        setContext({
          match: match
        });
      }

      nextTick(function () {
        return getRouter().updatePageLinks();
      });
    }; // creating the route


    router.on(path, handler);
    var navigoRoute = route.current = router.getRoute(handler);

    if (navigoRoute && name) {
      navigoRoute.name = name;
    } // hooking


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
    } // adding the service leave hook


    router.addLeaveHook(navigoRoute, function (done) {
      if (isMounted) {
        setContext({
          match: false
        });
      }

      done();
    }); // initial resolving

    router.resolve(); // initial data-navigo set up

    router.updatePageLinks();
    return function () {
      isMounted = false;
      router.off(handler);
    };
  }, []); // make sure that the lifecycle funcs have access to the latest local state values

  useEffect(function () {
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
    } // @ts-ignore


    if (leave && route.current && route.current.hooks.leave.length === 2) {
      // @ts-ignore
      route.current.hooks.leave[0] = blockingHook(leave);
    }
  }, [before, after, already, leave]);

  if (context.__allowRender) {
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
export function Base(_ref2) {
  var path = _ref2.path;
  getRouter(path);
  return null;
}
export function Switch(_ref3) {
  var children = _ref3.children;

  var _useState = useState(false),
      match = _useState[0],
      setMatch = _useState[1];

  useEffect(function () {
    function switchHandler(match) {
      setMatch(match);
    }

    getRouter().on("*", switchHandler);
    return function () {
      getRouter().off(switchHandler);
    };
  }, []);
  return /*#__PURE__*/React.createElement(SwitchContext.Provider, {
    value: {
      switchMatch: false,
      isInSwitch: true
    },
    key: match ? match.url : "switch" + new Date().getTime()
  }, children);
}
export function NotFound(_ref4) {
  var children = _ref4.children,
      hooks = _ref4.hooks;
  var match = useNotFound(hooks);

  if (match) {
    return /*#__PURE__*/React.createElement(Context.Provider, {
      value: {
        match: match
      }
    }, children);
  }

  return null;
}
export function Redirect(_ref5) {
  var path = _ref5.path;
  useEffect(function () {
    getRouter().navigate(path);
  }, []);
  return null;
} // hooks

export function useNavigo() {
  return useContext(Context);
}
export function useLocation() {
  return getRouter().getCurrentLocation();
} // internal hooks

function useNotFound(hooks) {
  var _useState2 = useState(false),
      match = _useState2[0],
      setMatch = _useState2[1];

  var handler = useRef(function (match) {
    setMatch(match);
    nextTick(function () {
      return getRouter().updatePageLinks();
    });
  });
  useEffect(function () {
    // @ts-ignore
    var router = getRouter();
    router.notFound(handler.current, hooks);
    router.addLeaveHook("__NOT_FOUND__", function (done) {
      setMatch(false);
      done();
    });
    router.resolve();
    router.updatePageLinks();
    return function () {
      router.off(handler.current);
    };
  }, []);
  return match;
}

var API = {
  getRouter: getRouter,
  configureRouter: configureRouter,
  reset: reset,
  Route: Route,
  Base: Base,
  Switch: Switch,
  NotFound: NotFound,
  Redirect: Redirect,
  useNavigo: useNavigo,
  useLocation: useLocation
};
export default API;