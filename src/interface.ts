import { ActionType } from "./const";

export interface INode {
  id: string;
  action: ActionType;
  options: {};
  successNode: string;
  failNode: string;
}

export interface INewTabNode extends INode {
  options: {
    url: string;
  };
}

export interface IActivateTabNode extends INode {
  options: {
    tabNumber: number;
  };
}

export interface IOpenUrlNode extends INewTabNode {}

export interface ICloseTabNode extends INode {
  options: {
    closeType: "current" | "custom";
    tabNumber: number;
  };
}

export interface IReloadPageNode extends INode {}

export interface IGoBackNode extends INode {}
