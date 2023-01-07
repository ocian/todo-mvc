import * as T from "../types";

const setLocalStorage = (source) => {
  localStorage.setItem("todo_list", JSON.stringify(source));
};
const getLocalStorage = () => {
  const target = localStorage.getItem("todo_list");
  return target ? JSON.parse(target) : {};
};

export const getStore = ({ onUpdate }: T.store.GetStoreParams) => {
  const list = new Proxy<T.store.ItemKeyList>(
    { ...getLocalStorage() },
    {
      set: (target, p, newValue, receiver) => {
        Reflect.set(target, p, newValue, receiver);
        setLocalStorage(target);
        onUpdate?.(target);
        return true;
      },
    }
  );

  const add: T.store.AddFn = ({ content }) => {
    const stamp = Date.now();
    list["" + stamp] = { id: stamp, content };
  };

  const update: T.store.UpdateFn = ({ id, content }) => {
    const target = list[id];
    if (!target)
      return new Error(
        JSON.stringify({ code: -1001, message: "id not exists" })
      );
    return (list["" + id] = { ...list["" + id], content });
  };

  const del: T.store.DelFn = ({ id }) => {
    const target = list[id];
    if (!target)
      return new Error(
        JSON.stringify({ code: -1002, message: "id not found" })
      );
    delete list["" + id];
    return id;
  };

  const getList: T.store.GetListFn = () => {
    return Object.entries(list).map(([_, value]) => value);
  };

  return {
    list,
    add,
    update,
    del,
    getList,
  };
};
