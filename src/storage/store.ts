import * as T from "../types";

export const getSource = () => ({});

export const add: T.store.AddFn = ({ content, checked }, source) => {
  const stamp = Date.now();
  const target = {
    ...source,
    ["" + stamp]: { id: stamp, content, checked, created_at: stamp },
  };
  return target;
};

export const update: T.store.UpdateFn = ({ id, content, checked }, source) => {
  const current = source[id];
  if (!current)
    return new Error(JSON.stringify({ code: -1001, message: "id not exists" }));
  const target = {
    ...source,
    [id]: Object.assign(
      { ...source[id] },
      content !== undefined && { content },
      typeof checked === "boolean" && { checked }
    ),
  };
  return target;
};

export const del: T.store.DelFn = ({ id }, source) => {
  const current = source[id];
  if (!current)
    return new Error(JSON.stringify({ code: -1002, message: "id not found" }));
  const target = { ...source };
  delete target[id];
  return target;
};

export const getList: T.store.GetListFn = (source, options) => {
  let list = Object.entries(source).map(([_, value]) => value);

  switch (options?.filter) {
    case "checked":
      list = list.filter((i) => i.checked);
      break;
    case "unchecked":
      list = list.filter((i) => !i.checked);
      break;
    default:
  }

  return list.sort((l, r) => r.created_at - l.created_at);
};
