import { useState } from "react";

export default function PracticePage() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <h3>Increment Signal {count}</h3>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
