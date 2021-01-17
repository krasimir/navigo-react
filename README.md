# navigo-react

[Navigo](https://github.com/krasimir/navigo) router for React.

- [navigo-react](#navigo-react)
  - [Quick example](#quick-example)
  - [Components](#components)
    - [Route](#route)
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
  - [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle)
  - [Examples](#examples)
    - [Basic example](#basic-example)
    - [URL parameters](#url-parameters)
    - [Using the `loos` property](#using-the-loos-property)

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

```
<Route
  path="/user/:id"
  loose="false"
  before={ (done) => {} }
  after={ (done) => {} }
  already={ (done) => {} }
  leave={ (done) => {} }>
  <p>Hey</p>
</Route>
```

| Prop | type | required | Description |
| ---- | ---- | -------- | ----------- |
| **path** | string | yes | Specifies the path for which the children will be rendered. URL parameters are supported with the well known syntax `/users/:id/:action`. You can access the values via the [useNavigo](#usenavigo) hook |
| loose | boolean | no | By default is `false` and if you provide `true` will always render its children. This is useful when you want to render stuff in case a specific route is NOT matching. Check out the [example below](#using-the-loos-property). |
| before | function | no | It sets a function that is executed before the route gets switched. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| after | function | no | It sets a function that is executed after the route gets switched. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| already | function | no | It sets a function that is executed the current route is equal to the one specified. Or in other words - in case you land on the same route again. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |
| leave | function | no | It sets a function that is executed when the user is about to leave the route. Checkout [Hooking to the routing lifecycle](#hooking-to-the-routing-lifecycle) section to see how to use it. |

### Switch

### Base

### NotFound

### Redirect

## Hooks

### useNavigo

### useLocation

## Other functions

### configureRouter

### reset

## Hooking to the routing lifecycle

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

[https://codesandbox.io/s/navigo-react-example-w9l1d](https://codesandbox.io/s/navigo-react-example-w9l1d).

### URL parameters

### Using the `loos` property

