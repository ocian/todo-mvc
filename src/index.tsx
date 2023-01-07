import { createRoot } from "react-dom/client";
// import "./styles/base.scss";
// import ViewTodo from "./views/todo";
import "./styles/base.css";
import ViewTodo from "./views/todo_2023.01.07";

const root = createRoot(document.querySelector("#root"));
root.render(<ViewTodo />);
