import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";
import moment from "moment";
import { useNavigate } from "react-router-dom";

interface Complaint {
  id: string;
  createdAt: string;
  ComplaintType: {
    name: string;
  };
  Locality: {
    name: string;
  };
  Country: {
    name: string;
  };
  status: "RESOLU" | "NON_RESOLU";
}

export default function RecentOrders() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);


  const navigate = useNavigate();
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axiosInstance.get("/complaints", {
          params: { limit: 5, page: 1 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setComplaints(res.data.data.data || []);
      } catch (err) {
        console.error("Erreur lors du chargement des plaintes", err);
      }
    };

    fetchComplaints();
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Plaintes en temps réel
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/complaints")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Filtre
          </button>
          <button
            onClick={() => navigate("/complaints")}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Tout voir
          </button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Dates
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Types d'entrave
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Région
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400">
                Statuts
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell className="py-3">
                  <div className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                    {moment(complaint.createdAt).format("ddd DD/MM/YYYY")}
                  </div>
                </TableCell>
                <TableCell className="py-3 text-theme-sm">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {complaint.ComplaintType?.name ?? "N/A"}
                  </p>
                </TableCell>
                <TableCell className="py-3 text-theme-sm">
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {complaint.Locality?.name ?? "N/A"}
                  </p>
                  <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                    {complaint.Country?.name ?? "N/A"}
                  </span>
                </TableCell>
                <TableCell className="py-3 text-theme-sm">
                  <Badge
                    size="sm"
                    color={
                      complaint.status === "RESOLU"
                        ? "success"
                        : "error"
                    }
                  >
                    {complaint.status === "RESOLU" ? "Résolue" : "Non Résolue"}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
