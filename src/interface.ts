import { ActionEnum } from "./enum";

export interface INode {
  id: string;
  action: ActionEnum;
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
