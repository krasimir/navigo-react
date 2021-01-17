# navigo-react

[Navigo](https://github.com/krasimir/navigo) router for React.

- [navigo-react](#navigo-react)
  - [Quick example](#quick-example)
  - [Components](#components)
    - [Route](#route)
      - [Route lifecycle functions](#route-lifecycle-functions)
    - [Switch](#switch)
    - [Base](#base)
    - [NotFound](#notfound)
    - [Redirect](#redirect)
  - [Hooks](#hooks)
    - [useNavigo](#usenavigo)
    - [useLocation](#uselocation)
  - [Other functions](#other-functions)
    - [configureRouter](#configurerouter)
    - [reset](#reset)
  - [Examples](#examples)
    - [Basic example](#basic-example)
    - [Accessing URL and GET parameters](#accessing-url-and-get-parameters)
    - [Using the `loose` property](#using-the-loose-property)
    - [Redirecting](#redirecting)
    - [Get data required by a Route](#get-data-required-by-a-route)
    - [Block opening a route](#block-opening-a-route)
    - [Handling transitions](#handling-transitions)

## Quick example

```jsx
import { Switch, Route } from "navigo-react";

export default function App() {
  return (
    <>
      <nav>
        <a href="/" data-navigo>Home</a>
        <a href="/package" data-navigo>Package</a>
      </nav>
      <Switch>
        <Route path="/package">
          <ul>
            <li>Size: ~15KB</li>
            <li>Dependencies: no</li>
            <li>
              Documentation: <a href="https://github.com/krasimir/navigo-react">here</a>
            </li>
          </ul>
        </Route>
        <Route path="/">
          NavigoReact is a router for React applications based on Navigo project.
        </Route>
      </Switch>
    </>
  );
}
```

Live demo here [https://codesandbox.io/s/navigo-react-example-w9l1d](https://codesandbox.io/s/navigo-react-example-w9l1d).

## Components

### Route

```jsx
<Route
  path="/user/:id"
  loose="false"
  before={ (cb) => {} }
  after={ (cb) => {} }
  already={ (cb) => {} }
  leave={ (cb) => {} }>
  <p>Hey</p>
</Route>
```

The basic building block. Shortly, it's a component that renders its children based on the `path` prop.

| Prop | type | required | Description |
| ---- | ---- | -------- | ----------- |
| **path** | string | yes | Specifies the path for which the children will be rendered. URL parameters are supported with the well known syntax `/users/:id/:action`. You can access the values via the [useNavigo](#usenavigo) hook |
| loose | boolean | no | By default is `false` and if you provide `true` will always render its children. This is useful when you want to render stuff in case a specific route is NOT matching. Check out the [example below](#using-the-loos-property). |
| before | function | no | It sets a function that is executed before the route gets switched. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| after | function | no | It sets a function that is executed after the route gets switched. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| already | function | no | It sets a function that is executed the current route is equal to the one specified. Or in other words - in case you land on the same route again. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| leave | function | no | It sets a function that is executed when the user is about to leave the route. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |

#### Route lifecycle functions

The `before`, `after`, `already` and `leave` are functions that execute during the route resolving. They give you the opportunity to hook some logic to each one of this moments and even pause/reject some of them. Each of this functions receive a callback. You fire the callback with an object, key-value pairs. Those pairs could be accessed via the `useNavigo` hook. For example:

```jsx
function Print() {
  const { fact, loading } = useNavigo();

  if (loading) return <p>Loading ...</p>;
  if (fact) return <p>{fact}</p>;
  return null;
}

// Somewhere above
<Route
  path="/cats"
  loose
  before={async (cb) => {
    cb({ loading: true });
    const res = await (await fetch("https://catfact.ninja/fact")).json();
    cb({ fact: res.fact, loading: false });
    cb(true);
  }}
>
  <Print />
</Route>
```

Every `cb` call is basically re-rendering the `<Print>` component and `useNavigo` hook returns whatever we passed as argument. At the end when we are ready we call `cb` with `true` which indicates to the router that our job is done. Full example [here](#get-data-required-by-a-route).

We may block the routing to specific paths if we call `cb` with `false`. For example:

```jsx
export default function App() {
  const [authorized, loggedIn] = useState(false);
  const before = (cb) => {
    if (!authorized) {
      cb(false);
    } else {
      cb(true);
    }
  };

  return (
    <>
      <Route path="/user" before={before}>
        <User />
      </Route>
    </>
  );
}
```
(Full example [here](#block-opening-a-route))

### Switch

```jsx
<Switch>
  <Route path="/about">About</Route>
  <Route path="/products">Products</Route>
  <Route path="*">Home</Route>
</Switch>
```

It forces the router to pick only one of the routes. Without this component multiple matches are possible. Like in the example above, if there is no `<Switch>` the `"Home"` string will be rendered no mather what because `*` matches every route.

### Base

```jsx
<Base path="/my/app" />
```

It specifies the root of your application. If you deploy you code at specific path you have to either use this component or [`configureRouter`](#configurerouter) to tell Navigo where to start from.

| Prop | type | required | Description |
| ---- | ---- | -------- | ----------- |
| **path** | string | yes | The root of your application. |

### NotFound

```jsx
<NotFound>I'm 404 page.</NotFound>
```

It renders its content in case of a no match is found.

### Redirect

```jsx
<Redirect path="/a/new/place" />
```

It indirectly calls the `navigate` method of the router. Checkout [redirecting](#redirecting) example below.

| Prop | type | required | Description |
| ---- | ---- | -------- | ----------- |
| **path** | string | yes | The path where you want to go to. |

## Hooks

### useNavigo

`useNavigo` is a hook that gives you access to a [Match](https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match) object. You have to use it in a component that is somewhere below a `<Route>` component. Then `match` has a value and you can pull information for the matched route. For example:

```js
import { Route, useNavigo } from "navigo-react";

function User() {
  const { match } = useNavigo();

  return (
    <p>
      {match.params.action} user with id {match.data.id}
    </p>
  );
}

export default function App() {
  return (
    <>
      <a href="/user/xxx?action=save" data-navigo>
        Click me
      </a>
      <Route path="/user/:id">
        <User />
      </Route>
    </>
  );
}
```

`useNavigo` has one other function. It gives you access to the props that you send via the router [lifecycle functions](#route-lifecycle-functions). Here are a two examples that demonstrate the idea:

* [Get data required by a Route](#get-data-required-by-a-route)
* [Block opening a route](#block-opening-a-route)

### useLocation

`useLocation` gives you a [Match](https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match) object that represents the current URL of the browser.

```js
const match = useLocation();
```

## Other functions

### configureRouter

`configureRouter` could be used outside React and its purpose is to set the base root path of the router. Same as [`<Base>`](#base) component.

```js
configureRouter('/my/app');
```

### reset

Calling this function means flushing all the registered routes.

## Examples

### Basic example

```jsx
import { Switch, Route } from "navigo-react";

export default function App() {
  return (
    <>
      <nav>
        <a href="/" data-navigo>Home</a>
        <a href="/package" data-navigo>Package</a>
      </nav>
      <Switch>
        <Route path="/package">
          <ul>
            <li>Size: ~15KB</li>
            <li>Dependencies: no</li>
            <li>
              Documentation: <a href="https://github.com/krasimir/navigo-react">here</a>
            </li>
          </ul>
        </Route>
        <Route path="/">
          NavigoReact is a router for React applications based on Navigo project.
        </Route>
      </Switch>
    </>
  );
}
```

https://codesandbox.io/s/navigo-react-example-w9l1d

### Accessing URL and GET parameters

```jsx
import { Route, useNavigo } from "navigo-react";

function User() {
  const { match } = useNavigo();

  return (
    <p>
      {match.params.action} user with id {match.data.id}
    </p>
  );
}

export default function App() {
  return (
    <>
      <a href="/user/xxx?action=save" data-navigo>
        Click me
      </a>
      <Route path="/user/:id">
        <User />
      </Route>
    </>
  );
}
```

https://codesandbox.io/s/navigo-url-and-get-parameters-5few6

### Using the `loose` property

### Redirecting

### Get data required by a Route

```jsx
import { Route, useNavigo } from "navigo-react";

function Print() {
  const { fact, loading } = useNavigo();

  if (loading) {
    return <p>Loading ...</p>;
  }
  if (fact) {
    return <p>{fact}</p>;
  }
  return null;
}

export default function App() {
  return (
    <>
      <nav>
        <a href="/cats" data-navigo>
          Get a cat fact
        </a>
      </nav>
      <Route
        path="/cats"
        loose
        before={async (cb) => {
          cb({ loading: true });
          const res = await (await fetch("https://catfact.ninja/fact")).json();
          cb({ fact: res.fact, loading: false });
          cb(true);
        }}
      >
        <Print />
      </Route>
    </>
  );
}
```

https://codesandbox.io/s/navigo-before-lifecycle-function-hgeld

### Block opening a route

The user can't go to `/user` route before the `authorized` becomes `true`.

```jsx
import { Route, useNavigo } from "navigo-react";

function User() {
  const { match } = useNavigo();
  if (match) {
    return <p>I'm a user</p>;
  }
  return null;
}

export default function App() {
  const [authorized, loggedIn] = useState(false);
  const before = (cb) => cb(authorized);

  return (
    <>
      <nav>
        <a href="/user" data-navigo>
          Access user
        </a>
        {!authorized && <button onClick={() => loggedIn(true)}>Sign in</button>}
      </nav>
      <Route path="/user" loose before={before}>
        <User />
      </Route>
    </>
  );
}
```

https://codesandbox.io/s/navigo-block-routing-e2qvw

### Handling transitions

```jsx
import { Route, Switch, useNavigo } from "navigo-react";

const delay = (time) => new Promise((done) => setTimeout(done, time));

function Card({ children, bgColor }) {
  const { leaving } = useNavigo();
  const animation = `${
    leaving ? "out" : "in"
  } 1000ms cubic-bezier(1, -0.28, 0.28, 1.49)`;

  return (
    <div
      className={`card ${leaving ? "leaving" : ""}`}
      style={{ backgroundColor: bgColor, animation }}
    >
      <p>{children}</p>
    </div>
  );
}

const leaveHook = async (done) => {
  done({ leaving: true });
  await delay(900);
  done(true);
};

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/card-two" leave={leaveHook}>
          <Card bgColor="#254c6a">
            Card #2.
            <a href="/" data-navigo>Click here</a>
            to go back
          </Card>
        </Route>
        <Route path="/" leave={leaveHook}>
          <Card bgColor="#1f431f">
            Welcome to the transition example.
            <a href="/card-two" data-navigo>Click here</a>{" "}
            to open the other card.
          </Card>
        </Route>
      </Switch>
    </>
  );
}
```

https://codesandbox.io/s/navigo-handling-transitions-ipprc