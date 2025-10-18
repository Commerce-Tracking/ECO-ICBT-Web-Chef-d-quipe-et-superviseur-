// Fichier commenté - Composant StatisticsChart désactivé
// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";

// export default function StatisticsChart() {
//   const options: ApexOptions = {
//     legend: {
//       show: false, // Hide legend
//       position: "top",
//       horizontalAlign: "left",
//     },
//     colors: ["#1A6C30", "#FFC200"], // Define line colors - Vert principal et Jaune
//     chart: {
//       fontFamily: "DM Sans, sans-serif",
//       height: 310,
//       type: "line", // Set the chart type to 'line'
//       toolbar: {
//         show: false, // Hide chart toolbar
//       },
//     },
//     stroke: {
//       curve: "smooth", // Make the line smooth
//       width: 2, // Set line width
//     },
//     grid: {
//       borderColor: "#e1e5ea", // Set grid border color
//       strokeDashArray: 5, // Set grid line style
//     },
//     xaxis: {
//       axisBorder: {
//         show: false, // Hide x-axis border
//       },
//       axisTicks: {
//         show: false, // Hide x-axis ticks
//       },
//       categories: [
//         "Jan",
//         "Fév",
//         "Mar",
//         "Avr",
//         "Mai",
//         "Jun",
//         "Jul",
//         "Aoû",
//         "Sep",
//         "Oct",
//         "Nov",
//         "Déc",
//       ],
//       labels: {
//         style: {
//           colors: "#6b7280", // Set x-axis label color
//           fontSize: "12px",
//           fontFamily: "DM Sans, sans-serif",
//         },
//       },
//     },
//     yaxis: {
//       labels: {
//         style: {
//           colors: "#6b7280", // Set y-axis label color
//           fontSize: "12px",
//           fontFamily: "DM Sans, sans-serif",
//         },
//       },
//     },
//     tooltip: {
//       theme: "light", // Set tooltip theme
//       style: {
//         fontSize: "12px",
//         fontFamily: "DM Sans, sans-serif",
//       },
//     },
//   };

//   const series = [
//     {
//       name: "Collectes",
//       data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 100, 80, 90],
//     },
//     {
//       name: "Validations",
//       data: [20, 30, 25, 40, 39, 50, 60, 81, 105, 80, 60, 70],
//     },
//   ];

//   return (
//     <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//       <div className="mb-4 flex items-center justify-between">
//         <div>
//           <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
//             Statistiques des collectes
//           </h3>
//           <p className="text-sm text-gray-500 dark:text-gray-400">
//             Évolution mensuelle des collectes et validations
//           </p>
//         </div>
//       </div>
//       <div className="h-[310px] w-full">
//         <Chart options={options} series={series} type="line" height={310} />
//       </div>
//     </div>
//   );
// }
