import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faUserTie,
  faHome,
  faArrowTrendUp,
} from "@fortawesome/free-solid-svg-icons";

interface Stats {
  totalLeads: number;
  totalAgents: number;
  activePortfolio: number;
  newInquiries: number;
}

const DashboardStats = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalLeads: 0,
    totalAgents: 0,
    activePortfolio: 0,
    newInquiries: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/admin/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className="bg-[#f3f4f6] min-h-screen py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* CARD */}
        <StatCard
          title="TOTAL LEADS"
          value={stats.totalLeads}
          icon={faChartLine}
          iconBg="bg-indigo-100"
          iconColor="text-indigo-600"
        />

        <StatCard
          title="REGISTERED AGENTS"
          value={stats.totalAgents}
          icon={faUserTie}
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
        />

        <StatCard
          title="ACTIVE PORTFOLIO"
          value={stats.activePortfolio}
          icon={faHome}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
        />

        <StatCard
          title="NEW INQUIRIES"
          value={stats.newInquiries}
          icon={faArrowTrendUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

      </div>
    </div>
  );
};

interface CardProps {
  title: string;
  value: number;
  icon: any;
  iconBg: string;
  iconColor: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBg,
  iconColor,
}: CardProps) => {
  return (
    <div className="bg-white rounded-3xl p-8 flex items-center gap-6 shadow-md hover:shadow-lg transition-all duration-300">

      {/* Icon Box */}
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-2xl ${iconBg}`}
      >
        <FontAwesomeIcon icon={icon} className={`${iconColor} text-xl`} />
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-semibold tracking-widest text-gray-400 uppercase">
          {title}
        </p>
        <h2 className="text-4xl font-extrabold text-gray-900 mt-1">
          {value}
        </h2>
      </div>
    </div>
  );
};

export default DashboardStats;