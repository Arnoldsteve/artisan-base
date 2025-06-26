// packages/ui/src/components/PrimaryButton.tsx
import { Button } from "@mui/material";

export const PrimaryButton = ({ children }: { children: React.ReactNode }) => (
  <Button variant="contained" color="success">
    {children}
  </Button>
);
