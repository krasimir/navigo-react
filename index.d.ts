import Navigo, { Match, RouteHooks } from "navigo";

export type RouteProps = {
  path: string;
  children: any;
  loose?: boolean;
  before?: Function;
};
export type NotFoundRouteProps = {
  children: any;
  hooks?: RouteHooks;
};
export type NavigoSwitchContextType = {
  isInSwitch: boolean;
  switchMatch: false | Match;
  setSwitchMatch: Function;
};
export type Path = { path: string };
export type NavigoRouting = {
  match: false | Match;
  [key: string]: Any;
};

// utils
export function configureRouter(root: string): Navigo;
export function reset(): void;
export function getRouter(): Navigo;

// components
export function Base(props: Path);
export function Route(props: RouteProps);
export function NotFound(props: NotFoundRouteProps);
export function Redirect(props: Path);
export function Switch(props: { children: any });

// hooks
export function useNavigo(): NavigoRouting;
export function useLocation(): Match;
