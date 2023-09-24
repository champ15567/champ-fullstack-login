import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { AlertProps } from "@mui/material/Alert";

interface Props {
  open: boolean;
  onClose: () => void;
  severity: AlertProps["severity"];
  messages: string[];
}

const AlertComponent: React.FC<Props> = ({
  open,
  onClose,
  severity,
  messages,
}) => {
  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={1500}
      onClose={onClose}
    >
      <Alert severity={severity} onClose={onClose}>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;
