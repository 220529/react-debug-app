// import ForwardRef from "@/components/forwardRef"
// import Counter from "@/components/counter"
// import Race from "@/components/race"
// import Suspense from "@/components/suspense/index7"
// import TodoList from "@/components/todoList"
// import Test from "@/components/context/test"

// import RenderList from "@/components/render-list/NoKey";
import RenderList from "@/components/render-list/RandomKey";
// import RenderList from "@/components/render-list/ReorderKey";

function App() {
  // return <Test />
  return (
    <div id="app">
      {/* <Race /> */}
      {/* <Suspense /> */}
      {/* <Counter /> */}
      <RenderList />
    </div>
  );
}

export default App;
