import React, { useMemo, useRef, useState } from "react";
import { useStore } from "../hooks/useStore";
import * as T from "../types";
import clsx from "clsx";

export default () => {
  const [input, setInput] = useState<string>("");
  // const [filter, setFilter] = useState<"all" | "checked" | "unchecked">("all");

  const store = useStore();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      store?.add?.({ checked: false, content: input });
      setInput("");
    }
  };

  const del = ({ id }: T.store.DelParams) => {
    store.del({ id });
  };

  const update = (params: T.store.UpdateParams) => {
    store.update(params);
  };

  return (
    <div className="container mx-auto h-screen flex flex-col">
      <div className="mt-4 text-3xl text-center flex-none">todos</div>
      <div className="mt-4 md:mt-12 p-4 flex-auto flex flex-col overflow-hidden">
        <div className="flex flex-none flex-wrap gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full md:w-80 border p-2"
            placeholder="What are you want to do?"
          />
          <div className="flex-auto"></div>
          <div className="flex-none flex items-center gap-4 md:ml-10">
            <button
              className={clsx("border px-4 md:px-6 rounded-lg h-10", {
                "border-blue-500": store.filter === "unchecked",
                "border-gray-500": store.filter !== "unchecked",
              })}
              onClick={() =>
                store.filter !== "unchecked" && store.setFilter("unchecked")
              }
            >
              unchecked
            </button>
            <button
              className={clsx("border px-4 md:px-6 rounded-lg h-10", {
                "border-blue-500": store.filter === "checked",
                "border-gray-500": store.filter !== "checked",
              })}
              onClick={() =>
                store.filter !== "checked" && store.setFilter("checked")
              }
            >
              checked
            </button>
            <button
              className={clsx("border px-4 md:px-6 rounded-lg h-10", {
                "border-blue-500": store.filter === "all",
                "border-gray-500": store.filter !== "all",
              })}
              onClick={() => store.filter !== "all" && store.setFilter("all")}
            >
              all
            </button>
          </div>
        </div>
        <ul className="mt-4 p-4 flex-auto shadow-lg overflow-auto">
          {store.list?.map((i) => (
            <li key={i.id} className="flex leading-8">
              <div className="mr-2 flex-none h-8">
                <input
                  type="checkbox"
                  defaultChecked={i.checked}
                  onClick={(e) => {
                    update({
                      id: i.id,
                      checked: e.target.checked,
                    });
                  }}
                />
              </div>
              <span className="flex-auto break-all">{i.content}</span>
              <div
                onClick={() => del({ id: i.id })}
                className="cursor-pointer flex-none text-red-500 ml-2 w-8 h-8 overflow-hidden flex justify-center items-center"
              >
                <div className="rotate-45 origin-center">+</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
