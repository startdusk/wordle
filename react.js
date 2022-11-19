import { createRoot } from "react-dom/client";
import Wordle from "./Wordle.js";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Wordle />);
