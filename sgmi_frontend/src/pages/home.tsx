import { Button } from "@mui/material";
import { login } from "../services/authService.ts"

export default function Home() {
    return (
    <div style={{ padding: 20 }}>
      <Button variant="contained" color="primary" onClick={() => { login("admin@utn.com", "123456") }}>
        Este es un botoncito material
      </Button>
    </div>
  );
}
