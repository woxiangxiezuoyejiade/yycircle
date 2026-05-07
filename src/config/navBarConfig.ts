import type {
	NavBarConfig,
	NavBarSearchConfig,
} from "../types/config";
import { NavBarSearchMethod } from "../types/config";
import { blogNavigation } from "./moclabSite";

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

export const navBarConfig: NavBarConfig = {
	links: blogNavigation,
};
