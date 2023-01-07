import { createRoot } from "react-dom/client";
import "./styles/base.scss";
import ViewTodo from "./views/todo";

const root = createRoot(document.querySelector("#root"));
root.render(<ViewTodo />);
