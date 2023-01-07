export interface Item {
  id: number;
  content: string;
  checked: boolean;
  created_at: number;
}

export interface ItemKeyList {
  [key: string]: Item;
}

export interface AddParams {
  content: string;
  checked: boolean;
}

export interface UpdateParams {
  id: number;
  content?: string;
  checked?: boolean;
}

export interface DelParams {
  id: number;
}

export type AddFn = (params: AddParams, source: ItemKeyList) => ItemKeyList;

export type UpdateFn = (
  params: UpdateParams,
  list: ItemKeyList
) => Error | ItemKeyList;

export type DelFn = (
  params: DelParams,
  source: ItemKeyList
) => Error | ItemKeyList;

export type GetListFn = (
  source: ItemKeyList,
  options?: { filter?: "all" | "checked" | "unchecked" }
) => Item[];
