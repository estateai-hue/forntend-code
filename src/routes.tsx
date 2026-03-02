import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/components/common/ProtectedRoute";
import DashboardLayout from "../src/components/layout/DashboardLayout";

import Login from "../src/features/auth/pages/Login";
import SuperAdminDashboard from "../src/features/dashboard/SuperAdminDashboard";
import AgentDashboard from "../src/features/dashboard/AgentDashboard";
import UserDashboard from "../src/features/dashboard/UserDashboard";
import CompaniesPage from "./features/company/CompaniesPage";
import Agents from "./features/agents/Agents";
import LeadPage from "./features/leads/LeadPage";
import Register from "./features/auth/pages/Register";
import PropertyPage from "./features/property/PropertyPage";
import CompanyRegister from "./features/company/CreateCompany";
import UpdateCompany from "./features/company/UpdateCompany";
import UpdateAgent from "./features/agents/UpdateAgent";
import CreateAgent from "./features/agents/CreateAgent";
import CreateProperty from "./features/property/CreatePorperty";
import PropertyDetail from "./features/property/PropertyDetail";
import CreateLeads from "./features/leads/CreateLeads";
import AssignedLeads from "./features/leads/AssignedLeads";

const AppRoutes = () => {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Superadmin */}
      <Route element={<ProtectedRoute allowedRoles={["superadmin"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/superadmin" element={<SuperAdminDashboard />} />
          <Route path="/superadmin/companies" element={<CompaniesPage/>}/>
          <Route path="/superadmin/agents" element={<Agents/>}/>
          <Route path="/superadmin/leads" element={<LeadPage/>}/>
          <Route path="/superadmin/create-leads" element={<CreateLeads/>}/>
          <Route path="/superadmin/properties" element={<PropertyPage/>}/>
          <Route path="/superadmin/create-company" element={<CompanyRegister/>}/>
          <Route path="/superadmin/edit-company/:id" element={<UpdateCompany/>}/>
          <Route path="/superadmin/create-agent" element={<CreateAgent/>}/>
          <Route path="/superadmin/edit-agent/:id" element={<UpdateAgent/>}/>
          <Route path="/superadmin/create-property" element={<CreateProperty/>}/>
          <Route path="/superadmin/property/:id" element={<PropertyDetail/>}/>
        </Route>
      </Route>

      {/* Agent */}
      <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/agent/leads" element={<AssignedLeads/>}/>
          <Route path="/agent/properties" element={<PropertyPage/>}/>
        </Route>
      </Route>

      {/* User */}
      <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
        <Route element={<DashboardLayout />}>
          <Route path="/user" element={<UserDashboard />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;