import {atom} from "jotai";
import {AppShellViewsConstants} from "@/app/atomConstantType/constants";

export const appShellViewState = atom(AppShellViewsConstants.AppShellViewLogin);
export const refreshHomeScreenDataAtom = atom(false);
export const loggedIn = atom(true)