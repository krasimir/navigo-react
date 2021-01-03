import Navigo, { Match, RouteHooks } from "navigo";

export type RouteProps = {
  path: string;
  children: any;
  hooks?: RouteHooks;
};
export type NotFoundRouteProps = {
  children: any;
  hooks?: RouteHooks;
};
export type NavigoContextType = {
  match: false | Match;
};
export type Path = { path: string };

// utils
export function configureRouter(root: string): Navigo;
export function reset(): void;

// components
export function Base(props: Path);
export function Route(props: RouteProps);
export function NotFound(props: NotFoundRouteProps);
export function Redirect(props: Path);

// hooks
export function useRoute(path: string, hooks?: RouteHooks | undefined): false | Match;
export function useRouter(): Navigo;
export function useMatch(): false | Match;
export function useNotFound(hooks?: RouteHooks | undefined): false | Match;
export function useLocation(): Match;
