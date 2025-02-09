import { Browser, KeyInput, Page } from 'puppeteer'
import { ActionType, SelectorType } from './const'

export interface Proxy {
  user: string
  password: string
  host: string
  port: string
}
export interface ActionParams {
  nodeID: string | null
  nodes: INode[]
  browser: Browser
  pages: Page[]
  activePage: number
  proxy?: string
  variables: IVar[]
}

export interface IVar {
  name: string
  value: number
}

export interface INode {
  id: string
  action: ActionType
  options: {
    nodeSleep: number
    nodeTimeout: number
    description?: string
  }
  successNode: string
  failNode: string
}

export interface INewTabNode extends INode {
  options: INode['options'] & {
    url: string
  }
}

export interface IActivateTabNode extends INode {
  options: INode['options'] & {
    tabNumber: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOpenUrlNode extends INewTabNode {}

export interface ICloseTabNode extends INode {
  options: INode['options'] & {
    closeType: 'current' | 'custom'
    tabNumber: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IReloadPageNode extends INode {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGoBackNode extends INode {}

export interface IClickNode extends INode {
  options: INode['options'] & {
    buttonType: 'left' | 'right' | 'center'
    selectorBy: 'selector' | 'coordinates'
    selectorType: 'xpath' | 'css' | 'text' | null
    selector: string
    x: number
    y: number
    clickCount: number
  }
}

export interface ITypeTextNode extends INode {
  options: INode['options'] & {
    selectorType: 'xpath' | 'css' | 'text' | null
    selector: string
    x: number
    y: number
    typeSpeed: number
    typeAsHuman: boolean
    text: string
  }
}

export interface IPressKeyNode extends INode {
  options: INode['options'] & {
    key: KeyInput[]
  }
}

export interface IMouseMoveNode extends INode {
  options: INode['options'] & {
    x: number
    y: number
  }
}

export interface IScrollNode extends INode {
  options: INode['options'] & {
    x: number
    y: number
    scrollBy: 'coordinates' | 'selector'
    scrollDirection: 'Down' | 'Up'
    scrollSpeed: number
    selector: string
    selectorType: SelectorType
  }
}
export interface ILoopNode extends INode {
  options: INode['options'] & {
    loopType: 'While' | 'For'
    forFrom: string
    forTo: string
    forEachFrom: string
    forEachValue: string
    whileLeftOperand: string
    whileOperator: null
    whileRightperand: string
    leftOperand: string
    operator: '=' | '<' | '>' | '!=' | '>=' | '<='
    rightOperand: number
  }
  startLoopNode: string
}

export interface ISetVariablesNode extends INode {
  options: INode['options'] & {
    variableName: string
    setOperator: '='
    variableValue: number
  }
}

export interface IIfNode extends INode {
  options: INode['options'] & {
    leftOperand: string
    rightOperand: number
    operator: '=' | '<' | '>' | '!=' | '>=' | '<='
  }
}
