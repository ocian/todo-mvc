export interface Item {
  id: number;
  content: string;
}

export interface ItemKeyList {
  [key: string]: Item;
}

export interface GetStoreParams {
  onUpdate?: (newValue: ItemKeyList) => void;
}

export interface AddParams {
  content: string;
}

export interface UpdateParams {
  id: number;
  content: string;
}

export interface DelParams {
  id: number;
}

export type AddFn = (params: AddParams) => void;
export type UpdateFn = (params: UpdateParams) => Error | Item;
export type DelFn = (params: DelParams) => Error | number;
export type GetListFn = () => Item[];
