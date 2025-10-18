import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import axiosInstance from "../../../api/axios";
import moment from "moment";
import {useTranslation} from "react-i18next";


interface UserRole {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export default function UsersRolesTableOne() {
  const [tableData, setTableData] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);


  const { t, i18n } = useTranslation();
            
                const changeLanguage = (lng: string) => {
                    i18n.changeLanguage(lng);
                };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const { data } = await axiosInstance.get("/admin/roles");
        const transformedData: UserRole[] = data.map((item: any) => ({
          // id: item.id,
          name: item.name,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setTableData(transformedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Une erreur est survenue");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewDetails = (role: UserRole) => {
    setSelectedUserRole(role);
    setTimeout(() => setIsModalVisible(true), 10);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => setSelectedUserRole(null), 300); // Attendre la fin de l'animation (300ms)
  };

  if (isLoading) {
    return <div>{t('load')}</div>;
  }

  if (error) {
    return <div>Erreur : {error}</div>;
  }

    

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
            <TableRow>
              {/* <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                ID
              </TableCell> */}
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
        {t('roles')}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
               {t('date_creation')}
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
              >
                {t('actions')}
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {tableData.length === 0 ? (
              <TableRow>
                {/*@ts-ignore*/}
                <TableCell colSpan={4} className="px-5 py-4 text-center">
                 {t('data')}
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((role) => (
                <TableRow key={role.id}>
                  {/* <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      {role.id && role.id.length > 6 ? `${role.id.substring(0, 6)}...` : role.id}
                    </span>
                  </TableCell> */}
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {role.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {moment(role.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <button
                      onClick={() => handleViewDetails(role)}
                      className="px-3 py-1 text-sm text-white bg-blue-900 rounded"
                    >
                      Voir détails
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modale pour afficher les détails */}
      {selectedUserRole && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className={`bg-white dark:bg-white/[0.03] rounded-lg p-6 max-w-md w-full shadow-lg transition-all duration-700 ease-in-out ${
              isModalVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-lg font-medium text-gray-800 dark:text-white/90 mb-4">
             {t('role_details')}
            </h3>
            <div className="space-y-2">
              {/* <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">ID :</span> {selectedUser.id}
              </p> */}
              <p className="text-gray-600 dark:text-gray-400">
                {/* <span className="font-medium">ID: </span> {selectedUserRole.id} */}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t('roles')} :</span> {selectedUserRole.name}
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <span className="font-medium">{t('date_creation')} :</span> {moment(selectedUserRole.createdAt).format("DD/MM/YYYY HH:mm:ss")}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCloseModal}
                className="px-3 py-1 text-sm text-white bg-blue-900 rounded"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}