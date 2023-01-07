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
      <div className="mt-12 p-4 flex-auto flex flex-col overflow-hidden">
        <div className="flex gap-4 flex-none">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-2 mr-10 w-60 flex-auto"
            placeholder="What are you want to do?"
          />
          <button
            className={clsx("border px-6 rounded-lg", {
              "border-blue-500": store.filter === "unchecked",
              "border-blue-200": store.filter !== "unchecked",
            })}
            onClick={() =>
              store.filter !== "unchecked" && store.setFilter("unchecked")
            }
          >
            unchecked
          </button>
          <button
            className={clsx("border px-6 rounded-lg", {
              "border-blue-500": store.filter === "checked",
              "border-blue-200": store.filter !== "checked",
            })}
            onClick={() =>
              store.filter !== "checked" && store.setFilter("checked")
            }
          >
            checked
          </button>
          <button
            className={clsx("border px-6 rounded-lg", {
              "border-blue-500": store.filter === "all",
              "border-blue-200": store.filter !== "all",
            })}
            onClick={() => store.filter !== "all" && store.setFilter("all")}
          >
            all
          </button>
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
                className="cursor-pointer flex-none text-red-500 ml-2 w-8 h-8 overflow-hidden flex justify-center align-middle"
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
