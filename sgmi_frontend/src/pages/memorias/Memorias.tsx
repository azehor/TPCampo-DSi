import { useLocation } from "react-router"

export default function Memorias() {
  const state = useLocation().state
  console.log(state)
  return <h2>Memorias del grupo {state.grupo}– En construcción</h2>;
}
