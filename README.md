# navigo-react

[Navigo](https://github.com/krasimir/navigo) router for React.

- [navigo-react](#navigo-react)
  - [Quick example](#quick-example)
  - [Navigating between routes](#navigating-between-routes)
  - [Components](#components)
    - [Route](#route)
      - [Route lifecycle functions](#route-lifecycle-functions)
      - [Navigating using named routes](#navigating-using-named-routes)
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
    - [getRouter](#getrouter)
  - [Examples](#examples)
    - [Basic example](#basic-example)
    - [Accessing URL and GET parameters](#accessing-url-and-get-parameters)
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
          Package documentation <a href="https://github.com/krasimir/navigo-react">here</a>.
        </Route>
        <Route path="/">
          NavigoReact is a router for React applications based on Navigo
          project.
        </Route>
      </Switch>
    </>
  );
}
```

Live demo here [https://codesandbox.io/s/navigo-react-example-w9l1d](https://codesandbox.io/s/navigo-react-example-w9l1d).

## Navigating between routes

The navigation in Navigo happens in two ways:

* Via `<a>` tags. The only requirement is to add `data-navigo` attribute to the link. For example `<a href="/users/list" data-navigo>View users</a>`. For more details on the exact API check out [this page](https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#augment-your-a-tags).
* Via the `navigate` or `navigateByName` methods. First you have to access the router with `getRouter()` and then use one of these two methods. For example:
```js
import { getRouter } from 'navigo-react';

// Somewhere in your React components
<button onClick={() => getRouter().navigate('/users/list')}>
  View users
</button>

// or if you have a named route like
<Route path="/users/:id/:action" name="user">
  ...
</Route>

// Somewhere in your React components
<button
  onClick={
    () => getRouter().navigateByName('name', { id: 'xxx', action: 'view' })
  }>
  View users
</button>
```

## Components

### Route

```jsx
<Route
  path="/user/:id"
  name="my-route-name"
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
| name | string | no | Sets a name of the route so we can later navigate to it easily. Check out [this section](#navigating-using-named-routes) for an example |
| before | function | no | It sets a function that is executed before the route gets switched. Checkout [Hooking to the routing lifecycle](#route-lifecycle-functions) section to see how to use it. |
| after | function | no | It sets a function that is executed after the route gets switched. Checkout [Hooking to the routing lifecycle](#route-lifecycle-functions) section to see how to use it. |
| already | function | no | It sets a function that is executed the current route is equal to the one specified. Or in other words - in case you land on the same route again. Checkout [Hooking to the routing lifecycle](#route-lifecycle-functions) section to see how to use it. |
| leave | function | no | It sets a function that is executed when the user is about to leave the route. Checkout [Hooking to the routing lifecycle](#route-lifecycle-functions) section to see how to use it. |

#### Route lifecycle functions

The `before`, `after`, `already` and `leave` are functions that execute during the route resolving. They give you the opportunity to hook some logic to each one of this moments and pause/reject some of them. Each of this functions receive an object:

| function | example |
| -------- | ------- |
| before | `function handleBefore({ render, done, match }) {...}` |
| after | `function handleBefore({ render, match }) {...}` |
| already | `function handleBefore({ render, match }) {...}` |
| leave | `function handleBefore({ render, done, match }) {...}` |

Where `render` gives you an opportunity to render the children of the `<Route>` by setting data into the Navigo context. For example:

```jsx
import { Route, useNavigo } from "navigo-react";

function Print() {
  const { pic } = useNavigo();

  if (pic === null) {
    return <p>Loading ...</p>;
  }
  return <img src={pic} width="200" />;
}

export default function App() {
  async function before({ render, done }) {
    render({ pic: null });
    const res = await (
      await fetch("https://api.thecatapi.com/v1/images/search")
    ).json();
    render({ pic: res[0].url });
    done();
  }
  return (
    <>
      <nav>
        <a href="/cat" data-navigo>
          Get a cat fact
        </a>
      </nav>
      <Route path="/cat" before={before}>
        <Print />
      </Route>
    </>
  );
}
```

Pay attention to the `before` function inside the `<App>` component. `render` calls trigger rendering of the `<Print>` component with specific context which we can access via the `useNavigo` hook. Finally when we are ready we call `done()` to indicate that the routing could be fully resolved. Which means changing the browser's URL and potentially executing `after` or `already` lifecycle methods.

We can completely block the routing to specific place by calling `done(false)`. For example:

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

#### Navigating using named routes

Sometimes we need to construct a URL based on some data. The library offers an imperative API for that:

```jsx
import { getRouter, Route } from "navigo-react";

export default function App() {
  return (
    <>
      <button
        onClick={() => {
          getRouter().navigateByName("my-user", { id: "xxx" });
        }}
      >
        Click me
      </button>
      <Route path="/user/:id" name="my-user">
        I'm a user
      </Route>
    </>
  );
}
```

https://codesandbox.io/s/navigo-react-named-routes-0h2bh

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

`useNavigo` is a hook that gives you access to the Navigo context. The main role of the context is to pass a [Match](https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md#match) object. It gives you access to the matched URL, URL and GET parameters. For example:

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

The Navigo context also gives you access to key-value paris that we send via the router [lifecycle functions](#route-lifecycle-functions). Check out this example [Get data required by a Route](#get-data-required-by-a-route).

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

### getRouter

It gives you access to the [Navigo](https://github.com/krasimir/navigo/blob/master/DOCUMENTATION.md) router. Mostly you'll be using `navigate` and `navigateByName` functions. For example:

```js
getRouter().navigate('/users/list');
```

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

### Redirecting

```jsx
import { Route, Switch, Redirect } from "navigo-react";

export default function App() {
  return (
    <>
      <nav>
        <a href="/user" data-navigo>
          View user
        </a>
      </nav>
      <Switch>
        <Route path="/user">
          <Redirect path="/foobar" />
        </Route>
        <Route path="/foobar">Hey user!</Route>
      </Switch>
    </>
  );
}
```

https://codesandbox.io/s/navigo-redirecting-cxzbb

### Get data required by a Route

```jsx
import { Route, useNavigo } from "navigo-react";

function Print() {
  const { pic } = useNavigo();

  if (pic === null) {
    return <p>Loading ...</p>;
  }
  return <img src={pic} width="200" />;
}

export default function App() {
  async function before({ render, done }) {
    render({ pic: null });
    const res = await (
      await fetch("https://api.thecatapi.com/v1/images/search")
    ).json();
    render({ pic: res[0].url });
    done();
  }
  return (
    <>
      <nav>
        <a href="/cat" data-navigo>
          Get a cat fact
        </a>
      </nav>
      <Route path="/cat" before={before}>
        <Print />
      </Route>
    </>
  );
}
```

https://codesandbox.io/s/navigo-before-lifecycle-function-hgeld

### Block opening a route

The user can't go to `/user` route.

```jsx
import { Route } from "navigo-react";

export default function App() {
  const before = ({ done }) => {
    done(false);
  };

  return (
    <>
      <nav>
        <a href="/user" data-navigo>
          Access user
        </a>
      </nav>
      <Route path="/user" before={before}>
        Hey user!!!
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

const leaveHook = async ({ render, done }) => {
  render({ leaving: true });
  await delay(900);
  done();
};

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

export default function App() {
  return (
    <>
      <Switch>
        <Route path="/card-two" leave={leaveHook}>
          <Card bgColor="#254c6a">
            Card #2.
            <br />
            <a href="/" data-navigo>
              Click here
            </a>{" "}
            to go back
          </Card>
        </Route>
        <Route path="/" leave={leaveHook}>
          <Card bgColor="#1f431f">
            Welcome to the transition example.{" "}
            <a href="/card-two" data-navigo>
              Click here
            </a>{" "}
            to open the other card.
          </Card>
        </Route>
      </Switch>
    </>
  );
}
```

https://codesandbox.io/s/navigo-handling-transitions-ipprc