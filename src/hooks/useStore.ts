import { useEffect, useState } from "react";
import { getStore } from "../storage/store";
import * as T from "../types";

export const useStore = () => {
  const [list, setList] = useState<{
    [key: string]: { id: number; content: string };
  }>();
  const [handler, setHandler] = useState<{
    add: T.store.AddFn;
    update: T.store.UpdateFn;
    del: T.store.DelFn;
    getList: T.store.GetListFn;
  }>(null);

  useEffect(() => {
    const { add, update, del, getList } = getStore({
      onUpdate(newValue) {
        setList(newValue);
      },
    });
    setHandler({
      add,
      update,
      del,
      getList,
    });
  }, []);

  return { list, ...(handler || {}) };
};
