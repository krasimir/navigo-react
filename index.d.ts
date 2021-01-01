import Navigo, { Match } from "navigo";

export type RouteProps = {
  path: string;
  children: any;
};

export function configureRouter(root: string): Navigo;
export function reset(): void;
export function useRoute(path: string): [false | Match];
export function useRouter(): [Navigo];
export function Route(props: RouteProps);
