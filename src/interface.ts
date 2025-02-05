import { KeyInput } from 'puppeteer'
import { ActionType } from './const'

export interface INode {
  id: string
  action: ActionType
  options: object
  successNode: string
  failNode: string
}

export interface INewTabNode extends INode {
  options: {
    url: string
  }
}

export interface IActivateTabNode extends INode {
  options: {
    tabNumber: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOpenUrlNode extends INewTabNode {}

export interface ICloseTabNode extends INode {
  options: {
    closeType: 'current' | 'custom'
    tabNumber: number
  }
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IReloadPageNode extends INode {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IGoBackNode extends INode {}

export interface IClickNode extends INode {
  options: {
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
  options: {
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
  options: {
    key: KeyInput[]
  }
}
