import { useEffect, useMemo, useState } from "react";
import * as store from "../storage/store";
import * as T from "../types";

const setLocalStorage = (source) => {
  localStorage.setItem("todo_list", JSON.stringify(source));
};
const getLocalStorage = () => {
  const target = localStorage.getItem("todo_list");
  return target ? JSON.parse(target) : {};
};

export const useStore = () => {
  const [keyList, setKeyList] = useState<T.store.ItemKeyList>(
    getLocalStorage()
  );

  const [filter, setFilter] = useState<"all" | "checked" | "unchecked">(
    "unchecked"
  );

  useEffect(() => {
    setLocalStorage(keyList);
  }, [keyList]);

  const add = (params: T.store.AddParams) => {
    setKeyList(store.add(params, keyList));
  };
  const update = (params: T.store.UpdateParams) => {
    try {
      const target = store.update(params, keyList);
      if (!(target instanceof Error)) setKeyList(target);
    } catch (e) {}
  };
  const del = (params: T.store.DelParams) => {
    try {
      const target = store.del(params, keyList);
      if (!(target instanceof Error)) setKeyList(target);
    } catch (e) {}
  };
  const list = useMemo(
    () => store.getList(keyList, { filter }),
    [keyList, filter]
  );

  return { list, add, update, del, filter, setFilter };
};
