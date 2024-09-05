// import ForwardRef from "@/components/forwardRef"
import Counter from "@/components/counter"
// import Race from "@/components/race"
// import Suspense from "@/components/suspense/index7"
// import TodoList from "@/components/todoList"
// import Test from "@/components/context/test"

// import RenderList from "@/components/render-list/NoKey";
// import RenderList from "@/components/render-list/RandomKey";
// import RenderList from "@/components/render-list/ReorderKey";

// import SchedulerApp from "@/components/schedule";
// import Virtualized from "@/components/virtualized";

import TodoList from "@/components/todoList/NoKey"
// import TodoList from "@/components/todoList/WithKey"

function App() {
  // return <Test />
  return (
    <div id="app">
      {/* <Race /> */}
      {/* <Suspense /> */}
      <Counter />
      {/* <RenderList /> */}
      {/* <SchedulerApp /> */}
      {/* <Virtualized /> */}
      {/* <TodoList /> */}
    </div>
  );
}

export default App;
