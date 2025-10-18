import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";
import {
  Earth,
  IdCardLanyard,
  LocationEditIcon,
  SettingsIcon,
  Truck,
} from "lucide-react";
import {
  ChevronDownIcon,
  DocsIcon,
  FileIcon,
  FolderIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  ListIcon,
  PencilIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { BiExport, BiSupport } from "react-icons/bi";
import { GrLocation } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const AppSidebar: React.FC = () => {
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const dashboardItems: NavItem[] = [
    {
      icon: <GridIcon />,
      name: t("dashboard"),
      path: "/",
    },
  ];

  const navItems: NavItem[] = [
    {
      icon: <ListIcon />,
      name: t("obstacle_list"),
      path: "/complaints",
    },
    {
      icon: <DocsIcon />,
      name: t("obstacle_types"),
      path: "/complaints-types",
    },
  ];

  const usersItems: NavItem[] = [
    {
      name:
        userInfo?.role_id === 5
          ? t("assigned_team_managers")
          : t("assigned_agents"),
      icon: <GroupIcon />,
      path: "/users",
    },
    {
      icon: <PencilIcon />,
      name: t("livestock_collections"),
      path: "/create-user",
    },
    {
      icon: <PencilIcon />,
      name: t("agricultural_collections"),
      path: "/agricultural-collections",
    },
    // {
    //   icon: <UserCircleIcon />,
    //   name: t("role_management"),
    //   path: "/role-managment",
    // },
  ];

  const reportingItems: NavItem[] = [
    {
      icon: <FileIcon />,
      name: t("generate_reports"),
      path: "/reportings",
    },
    {
      icon: <TableIcon />,
      name: t("view_reports"),
      path: "/reportings/list",
    },
    {
      icon: <PieChartIcon />,
      name: t("statistics"),
      path: "/statistics",
    },
  ];

  const localities: NavItem[] = [
    {
      icon: <IdCardLanyard />,
      name: t("entity_list"),
      path: "/entity/list",
    },
    {
      icon: <IdCardLanyard />,
      name: t("add_entity"),
      path: "/entity",
    },
    {
      icon: <Earth />,
      name: t("country_list"),
      path: "/countries",
    },
    {
      icon: <Earth />,
      name: t("add_country"),
      path: "/pays",
    },
    {
      icon: <GrLocation />,
      name: t("locality_list"),
      path: "/localities/list",
    },
    {
      icon: <LocationEditIcon />,
      name: t("add_locality"),
      path: "/localities",
    },
  ];

  const transports: NavItem[] = [
    {
      icon: <Truck />,
      name: t("transport_list"),
      path: "/transports",
    },
  ];

  const othersItems: NavItem[] = [
    {
      icon: <FolderIcon />,
      name: t("content_center"),
      path: "/types",
    },
    {
      icon: <SettingsIcon />,
      name: t("preferences"),
      path: "/types",
    },
    {
      icon: <BiExport />,
      name: t("export_data"),
      path: "/types",
    },
    {
      icon: <BiSupport />,
      name: t("customer_support"),
      path: "/types",
    },
  ];

  const [openSubmenu, setOpenSubmenu] = useState<{
    type:
      | "dashboard"
      | "complaints"
      | "users"
      | "reporting"
      | "transports"
      | "localities"
      | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    [
      "complaints",
      "users",
      "reporting",
      "transports",
      "localities",
      "others",
    ].forEach((menuType) => {
      const items = menuType === "complaints" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as NonNullable<typeof openSubmenu>["type"],
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: NonNullable<typeof openSubmenu>["type"]
  ) => {
    setOpenSubmenu((prevOpenSubmenu) =>
      prevOpenSubmenu &&
      prevOpenSubmenu.type === menuType &&
      prevOpenSubmenu.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuSection = (
    label: string,
    items: NavItem[],
    menuType: NonNullable<typeof openSubmenu>["type"]
  ) => (
    <div>
      <h2
        className={`sidebar-section-title mb-4 w-[290px] ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
          t(label)
        ) : (
          <HorizontaLDots className="size-6" />
        )}
      </h2>
      {renderMenuItems(items, menuType)}
    </div>
  );

  const renderMenuItems = (
    items: NavItem[],
    menuType: NonNullable<typeof openSubmenu>["type"]
  ) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`sidebar-menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "sidebar-menu-item-active"
                  : "sidebar-menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500 dark:text-brand-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`sidebar-menu-item group ${
                  isActive(nav.path)
                    ? "sidebar-menu-item-active"
                    : "sidebar-menu-item-inactive"
                }`}
              >
                <span className="sidebar-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`sidebar-container fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 text-gray-800 dark:text-gray-200 h-screen transition-all duration-300 ease-in-out z-50 ${
        isExpanded || isMobileOpen
          ? "w-[290px]"
          : isHovered
          ? "w-[290px]"
          : "w-[90px]"
      } ${
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`pt-6 pb-3 flex ${
          !isExpanded && !isHovered
            ? "lg:justify-center lg:items-center"
            : "justify-start"
        }`}
      >
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <img
                className="dark:hidden"
                src="/images/logo/Plan de travail 1.png"
                alt="Logo"
                width={120}
                height={30}
              />
              <img
                className="hidden dark:block"
                src="/images/logo/Plan de travail 1.svg"
                alt="Logo"
                width={150}
                height={30}
              />
            </>
          ) : (
            <img
              src="/images/logo/Plan de travail 1.png"
              alt="Logo"
              width={50}
              height={50}
              className="mx-auto"
            />
          )}
        </Link>
      </div>

      <div className="sidebar-nav flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="sidebar-menu-group">
          <div className="flex flex-col gap-4">
            {renderMenuSection("dashboard", dashboardItems, "dashboard")}
            {/* {renderMenuSection("complaints_management", navItems, "complaints")} */}
            {renderMenuSection("collect_management", usersItems, "users")}
            {/* {renderMenuSection("reporting", reportingItems, "reporting")} */}
            {/* {renderMenuSection("transports", transports, "transports")} */}
            {/* {renderMenuSection(
              "entities_and_localities",
              localities,
              "localities"
            )} */}
            {/* {renderMenuSection("others", othersItems, "others")} */}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
