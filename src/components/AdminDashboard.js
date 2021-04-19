import React, { useState } from "react";
import {
  List,
  ListItem,
  Divider,
  ListItemIcon,
  Typography,
  Grid,
  Chip,
  ListItemText,
  LinearProgress,
  Paper,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  TextField,
  FormHelperText,
  InputLabel,
  Tabs,
  Tab,
} from "@material-ui/core";

import AdminEmployeeSection from "./AdminEmployeeSection";
import AdminRevenueSection from "./AdminRevenueSection";

const AdminDashboard = () => {
  const [value, setValue] = useState(0);

  const handleTabChange = (e, value) => {
    setValue(value);
  };

  const TabPanel = (props) => {
    const { children, value, index } = props;
    return <>{value === index && { children }}</>;
  };

  return (
    <div style={{ padding: "10px" }}>
      <Tabs value={value} onChange={handleTabChange}>
        <Tab label="Employees" />
        <Tab label="Revenue" />
      </Tabs>
      {value === 0 && <AdminEmployeeSection />}
      {value === 1 && <AdminRevenueSection />}
    </div>
  );
};

export default AdminDashboard;
