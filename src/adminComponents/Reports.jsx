import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import CustomDropdown from "../designingComponents/CustomDropdown";
import { FileText } from "lucide-react";
import favPng from "../assets/fav.png";
import * as XLSX2 from "xlsx-js-style";

const API_BASE = "http://localhost:8081/api";
const rowsPerPage = 10;

const toBase64 = (url) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = url;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = (err) => reject(err);
  });


const resolveStaffName = (r, staffList) => {

  if (r.staffName && String(r.staffName).trim())
    return String(r.staffName).trim();
  if (r.employeeName && String(r.employeeName).trim())
    return String(r.employeeName).trim();
  if (r.staff && r.staff.name && String(r.staff.name).trim())
    return String(r.staff.name).trim();

  
  const id = r.staffId ?? (r.staff && r.staff.id) ?? null;
  if (id != null) {
    const s = staffList.find((x) => String(x.id) === String(id));
    if (s) {
      if (s.name && String(s.name).trim()) return String(s.name).trim();
      const combined = `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
      if (combined) return combined;
    }
  }

  
  return id != null ? `(${id})` : "(unknown)";
};


const computeStatus = (r) => {
  
  if (r.status && String(r.status).trim()) {
    const s = String(r.status).trim().toLowerCase();
    if (
      s.includes("reliev") ||
      s.includes("resign") ||
      s.includes("left") ||
      s === "inactive"
    )
      return "Relieved";
    if (s === "active" || s === "working" || s === "employed") return "Active";
    
    return String(r.status).charAt(0).toUpperCase() + String(r.status).slice(1);
  }

  
  const relivedKeys = [
    "relived",
    "relieved",
    "relivedAt",
    "relievedAt",
    "relivedDate",
  ];
  for (const k of relivedKeys) {
    if (Object.prototype.hasOwnProperty.call(r, k)) {

      const v = r[k];
      if (v == null || v === "") return "Active";
      return "Relieved";
    }
  }


  return "Unknown";
};

export default function Reports() {
  const [staffList, setStaffList] = useState([]);
  const [reportType, setReportType] = useState("");
  const [selectedStaff, setSelectedStaff] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [reports, setReports] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get(`${API_BASE}/staff`)
      .then((res) => setStaffList(res.data || []))
      .catch((err) => {
        console.error("Failed to load staff:", err);
        setStaffList([]);
      });
  }, []);

  const fetchReports = async () => {
    let url = "";

    switch (reportType) {
      case "All Staff - All Months":
        url = `${API_BASE}/salary-transactions`;
        break;
      case "All Staff - Specific Month":
        if (!selectedMonth) {
          alert("Please choose a month.");
          return;
        }
        url = `${API_BASE}/salary-transactions/month?month=${selectedMonth}`;
        break;
      case "All Staff - Latest Month":
        url = `${API_BASE}/salary-transactions/latest`;
        break;
      case "Specific Staff - All Months":
        if (!selectedStaff) {
          alert("Please choose a staff.");
          return;
        }
        url = `${API_BASE}/salary-transactions/staff/${selectedStaff}/all`;
        break;
      case "Specific Staff - Specific Month":
        if (!selectedStaff || !selectedMonth) {
          alert("Please choose staff and month.");
          return;
        }
        url = `${API_BASE}/salary-transactions/staff/${selectedStaff}/month?month=${selectedMonth}`;
        break;
      case "Specific Staff - Latest Month":
        if (!selectedStaff) {
          alert("Please choose a staff.");
          return;
        }
        url = `${API_BASE}/salary-transactions/staff/${selectedStaff}/latest`;
        break;
      default:
        alert("Please select a valid report type.");
        return;
    }

    try {
      const res = await axios.get(url);
      const data = res.data;
      setReports(Array.isArray(data) ? data : data ? [data] : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching reports:", err);
      alert("Error fetching reports. See console.");
    }
  };

  

    function formatAmount(val) {
      if (val == null) return "";
      return "Rs. " + new Intl.NumberFormat("en-IN").format(val);
    }

 
  const downloadPayslip = async (report) => {
  let url = `http://localhost:8081/api/staff/${report.staffId}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch employee details");

  const userDetails = await res.json();

  try {
    if (!report) {
      alert("Invalid report data.");
      return;
    }

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40;
    let y = 40;

  
const logoBase64 = await toBase64(favPng); 

autoTable(doc, {
  startY: y,
  body: [
    [
      { 
        content: report.companyName ?? "SalaryGen",
        styles: { halign: "center", fontStyle: "bold", fontSize: 14 }
      },
      { 
        content: `Name: ${report.staffName ?? "-"}`,
        styles: { halign: "left", fontSize: 11 }
      }
    ],
    [
      { 
        content: `Salary Slip for ${report.salaryMonth ?? "-"}`,
        styles: { halign: "center", fontSize: 12 }
      },
      { 
        content: `Emp. No: ${report.staffId ?? "-"}`,
        styles: { halign: "left", fontSize: 11 }
      }
    ]
  ],
  theme: "grid", 
  styles: { fontSize: 11, cellPadding: 4, valign: "middle" },
  columnStyles: {
    0: { cellWidth: pageWidth * 0.5 }, 
    1: { cellWidth: pageWidth * 0.37 }, 
  },
  didDrawCell: function (data) {
   
    if (data.row.index === 0 && data.column.index === 0 && logoBase64) {
      const textWidth = doc.getTextWidth(report.companyName ?? "SalaryGen");
      const logoSize = 12;
      doc.addImage(
        logoBase64,
        "PNG",
        data.cell.x + (data.cell.width / 2) + (textWidth / 2) + 5, 
        data.cell.y + 5,
        logoSize,
        logoSize
      );
    }
  }
});

y = doc.lastAutoTable.finalY + 20; 

    autoTable(doc, {
      startY: y,
      head: [
        [
          "Department",
          "Joining Date",
          "Relieved Date",
          "Bank Name",
          "IFSC Code",
          "Account Number"
        ],
      ],
      body: [
        [
          userDetails.department ?? "-",
          userDetails.joiningDate ?? "-",
          userDetails.relievedDate ?? "Working",
          userDetails.salaryDetails?.bankName ?? "-",
          userDetails.salaryDetails?.ifscCode ?? "-",
          userDetails.salaryDetails?.bankAccountNumber ?? "-",
        ],
      ],
      theme: "grid",
      styles: { fontSize: 11, halign: "center", cellPadding: 5 },
      headStyles: { fillColor: [220, 220, 220], textColor: 0 },
      columnStyles: {
        6: { halign: "center" }, 
      },
    });

    y = doc.lastAutoTable.finalY + 20;

    const earnings = [];
    const deductions = [];

    if (report.basicPay != null)
      earnings.push(["Basic Salary", formatAmount(report.basicPay)]);

    if (report.componentBreakdown) {
      Object.entries(report.componentBreakdown).forEach(([key, val]) => {
        if (val == null) return;
        const upperKey = key.toUpperCase();
        if (["PF", "PT", "ESI", "TDS", "INSURANCE","OTHER_DEDUCTIONS"].includes(upperKey)) {
          deductions.push([key, formatAmount(val)]);
        } else {
          earnings.push([key, formatAmount(val)]);
        }
      });
    }

    const maxRows = Math.max(earnings.length, deductions.length);
    const bodyRows = [];
    for (let i = 0; i < maxRows; i++) {
      bodyRows.push([
        earnings[i]?.[0] ?? "",
        earnings[i]?.[1] ?? "",
        deductions[i]?.[0] ?? "",
        deductions[i]?.[1] ?? "",
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Earnings", "Amount", "Deductions", "Amount"]],
      body: bodyRows,
      theme: "grid",
      styles: { fontSize: 11, halign: "center", cellPadding: 5 },
      columnStyles: {
        1: { halign: "right" },
        3: { halign: "right" },
      },
      headStyles: { fillColor: [200, 200, 200], textColor: 0 },
    });

    const summaryY = doc.lastAutoTable.finalY + 10;
    autoTable(doc, {
      startY: summaryY,
      body: [
        ["Gross Salary", formatAmount(report.grossSalary)],
        ["Total Deductions", formatAmount(report.totalDeductions)],
        ["Net Pay", formatAmount(report.netSalary)],
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 5 },
      columnStyles: {
        0: { halign: "left", fontStyle: "bold" },
        1: { halign: "right" },
      },
    });


    function toWords(num) {
      if (num === 0) return "Zero";

      const a = [
        "",
        "One",
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
      ];
      const b = [
        "",
        "",
        "Twenty",
        "Thirty",
        "Forty",
        "Fifty",
        "Sixty",
        "Seventy",
        "Eighty",
        "Ninety",
      ];

      function inWords(n) {
        if (n < 20) return a[n];
        if (n < 100)
          return (
            b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "")
          );
        if (n < 1000)
          return (
            a[Math.floor(n / 100)] +
            " Hundred" +
            (n % 100 ? " " + inWords(n % 100) : "")
          );
        if (n < 100000)
          return (
            inWords(Math.floor(n / 1000)) +
            " Thousand" +
            (n % 1000 ? " " + inWords(n % 1000) : "")
          );
        if (n < 10000000)
          return (
            inWords(Math.floor(n / 100000)) +
            " Lakh" +
            (n % 100000 ? " " + inWords(n % 100000) : "")
          );
        return (
          inWords(Math.floor(n / 10000000)) +
          " Crore" +
          (n % 10000000 ? " " + inWords(n % 10000000) : "")
        );
      }

      return (inWords(num) + " Rupees Only /-").trim();
    }


    const wordsY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(11);
    doc.text(
      `Amount in Words: ${toWords(report.netSalary) ?? "-"}`,
      marginX,
      wordsY
    );

    
    const footerY = wordsY + 40;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(
      "This is a system-generated payslip and does not require a signature.",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
    doc.text("Generated by SalaryGen", pageWidth / 2, footerY + 14, {
      align: "center",
    });


    const fileName = `Payslip_${report.staffId ?? "Staff"}_${
      report.salaryMonth ?? "Month"
    }.pdf`;
    doc.save(fileName);
  } catch (err) {
    console.error("Failed to generate payslip:", err);
    alert("Failed to generate payslip. See console.");
  }
};


const exportAllToExcel = () => {
  if (!reports || reports.length === 0) {
    alert("No reports to export!");
    return;
  }

  const headers = [
    "Employee Name",
    "Employee ID",
    "Salary Month",
    "Basic Salary",
    "Allowances",
    "Deductions",
    "Net Salary",
  ];

  const data = reports.map(r => ({
    "Employee Name": r.staffName ?? "-",
    "Employee ID": r.staffId ?? "-",
    "Salary Month": r.salaryMonth ?? "-",
    "Basic Salary": r.basicPay ?? 0,
    "Allowances": (r.grossSalary ?? 0) - (r.basicPay ?? 0),
    "Deductions": r.totalDeductions ?? 0,
    "Net Salary": r.netSalary ?? ((r.grossSalary ?? 0) - (r.totalDeductions ?? 0)),
  }));

  const worksheet = XLSX2.utils.json_to_sheet(data, { header: headers });

  
  worksheet["!cols"] = [
    { wch: 20 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
    { wch: 15 }, 
  ];


  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };


  Object.keys(worksheet).forEach(cell => {
    if (cell[0] === "!") return;

    const colIndex = XLSX2.utils.decode_cell(cell).c;


    worksheet[cell].s = {
      alignment: { horizontal: "center", vertical: "center" },
    };

  
    if (colIndex >= 3) {
      worksheet[cell].s = {
        alignment: { horizontal: "center", vertical: "center" },
        numFmt: '"₹"#,##0.00',
      };
    }
  });

  headers.forEach((header, i) => {
    const cellRef = XLSX2.utils.encode_cell({ r: 0, c: i });
    if (worksheet[cellRef]) {
      worksheet[cellRef].s = {
        font: { bold: true, sz: 12 },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  });

  const workbook = XLSX2.utils.book_new();
  XLSX2.utils.book_append_sheet(workbook, worksheet, "Reports");
  XLSX2.writeFile(workbook, "SalaryReports.xlsx");
};


  const enriched = useMemo(
    () =>
      (reports || []).map((r) => ({
        ...r,
        staffName: resolveStaffName(r, staffList),
        normalizedStatus: computeStatus(r),
        netSalary: r.netSalary ?? r.amount ?? null,
      })),
    [reports, staffList]
  );

  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return enriched;
    return enriched.filter((r) => {
      return (
        String(r.staffName || "")
          .toLowerCase()
          .includes(q) ||
        String(r.staffId || "")
          .toLowerCase()
          .includes(q) ||
        String(r.salaryMonth || "")
          .toLowerCase()
          .includes(q) ||
        String(r.normalizedStatus || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [enriched, searchQuery]);


  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let aVal, bVal;
      switch (sortField) {
        case "staffName":
          aVal = String(a.staffName || "").toLowerCase();
          bVal = String(b.staffName || "").toLowerCase();
          break;
        case "netSalary":
          aVal = Number(a.netSalary ?? 0);
          bVal = Number(b.netSalary ?? 0);
          break;
        case "salaryMonth":
          aVal = String(a.salaryMonth || "");
          bVal = String(b.salaryMonth || "");
          break;
        case "id":
        default:
          aVal = a.id ?? 0;
          bVal = b.id ?? 0;
      }
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [filtered, sortField, sortOrder]);


  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sorted.slice(start, start + rowsPerPage);
  }, [sorted, currentPage]);

  const handleSort = (field) => {
    if (sortField === field)
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const staffOptionLabel = (s) => {
    const nm = s.name ?? `${s.firstName ?? ""} ${s.lastName ?? ""}`.trim();
    return `${nm || "(No Name)"} (${s.id})`;
  };
  const parseStaffIdFromOption = (opt) => {
    if (!opt) return "";
    const m = opt.match(/\(([^)]+)\)\s*$/);
    return m ? m[1] : opt;
  };

  return (
    <div className="p-6 grid gap-6">

      <div className="p-6 rounded-xl shadow-lg bg-slate-900 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-slate-200">
          Generate Salary Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <CustomDropdown
            label="Report Type"
            value={reportType}
            onChange={(v) => {
              setReportType(v);
              setSelectedStaff("");
              setSelectedMonth("");
            }}
            options={[
              "All Staff - All Months",
              "All Staff - Specific Month",
              "All Staff - Latest Month",
              "Specific Staff - All Months",
              "Specific Staff - Specific Month",
              "Specific Staff - Latest Month",
            ]}
            placeholder="Select Report Type"
          />

          {reportType.includes("Specific Month") && (
            <div>
              <label className="block text-sm text-slate-300 mb-1">Month</label>
              <input
                type="text"
                placeholder="YYYY-MM"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 text-slate-200 p-2 focus:border-teal-500 focus:outline-none"
              />
            </div>
          )}

          {reportType.includes("Specific Staff") && (
            <div>
              <CustomDropdown
                label="Select Staff"
                value={
                  staffList.find((s) => String(s.id) === String(selectedStaff))
                    ? staffOptionLabel(
                        staffList.find(
                          (s) => String(s.id) === String(selectedStaff)
                        )
                      )
                    : ""
                }
                onChange={(val) => {
                  const id = parseStaffIdFromOption(val);
                  setSelectedStaff(id);
                }}
                options={staffList.map((s) => staffOptionLabel(s))}
                placeholder="Choose Staff"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-5 items-center">
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
          >
            Fetch Report
          </button>

          <button
            onClick={exportAllToExcel}
            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg hover:bg-slate-600 shadow-md"
          >
            Export All to Excel
          </button>

          <div className="ml-auto text-sm text-slate-400 self-center">
            {reports.length} results available
          </div>
        </div>
      </div>

      <div className="p-6 rounded-xl shadow-lg bg-slate-900 border border-slate-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by staff name, id, month or status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-4/5 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <div className="text-slate-400 text-sm">
            Showing {Math.min(sorted.length, currentPage * rowsPerPage) || 0} of{" "}
            {sorted.length} filtered
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center text-slate-200">
            <thead>
              <tr className="bg-slate-900">
                <th
                  className="p-3 cursor-pointer uppercase tracking-wider text-teal-400 hover:text-white transition"
                  onClick={() => handleSort("id")}
                >
                  ID {sortField === "id" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 cursor-pointer uppercase tracking-wider text-teal-400 hover:text-white transition"
                  onClick={() => handleSort("staffName")}
                >
                  Staff{" "}
                  {sortField === "staffName" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 cursor-pointer uppercase tracking-wider text-teal-400 hover:text-white transition"
                  onClick={() => handleSort("salaryMonth")}
                >
                  Month{" "}
                  {sortField === "salaryMonth" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th
                  className="p-3 cursor-pointer uppercase tracking-wider text-teal-400 hover:text-white transition"
                  onClick={() => handleSort("netSalary")}
                >
                  Net Salary{" "}
                  {sortField === "netSalary" &&
                    (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-3 uppercase tracking-wider text-teal-400">
                  Status
                </th>
                <th className="p-3 uppercase tracking-wider text-teal-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {paginated.length > 0 ? (
                paginated.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-slate-700 hover:bg-slate-800 transition duration-200"
                  >
                  
                    <td className="p-3 font-semibold text-slate-400">{r.id}</td>

                  
                    <td className="p-3 font-medium text-white">
                      <span className="text-lg">{r.staffName}</span>
                      <span className="text-xs text-teal-400 ml-1">
                        ({r.staffId})
                      </span>
                    </td>

                  
                    <td className="p-3 font-mono text-blue-300">
                      {r.salaryMonth}
                    </td>

                    <td className="p-3 font-bold text-emerald-400 drop-shadow-md">
                      {r.netSalary ? `₹${r.netSalary}` : "N/A"}
                    </td>

                  
                    <td className="p-3">
                      {r.active === false ? (
                        <span className="font-semibold text-slate-300 italic">
                          Relieved
                        </span>
                      ) : r.active === true ? (
                        <span className="font-bold text-yellow-500">
                          Active
                        </span>
                      ) : (
                        <span className="font-medium text-slate-500">
                          Unknown
                        </span>
                      )}
                    </td>

                  
                     {console.log(r)}
                    <td className="p-3">
                      {r.staffId && r.salaryMonth ? (
                        <button
                          onClick={() => downloadPayslip(r)}
                          className="p-2 rounded-full hover:bg-slate-700 transition"
                          title="Download Payslip"
                        >
                          <FileText className="w-5 h-5 text-cyan-400" />
                        </button>
                      ) : (
                        <span className="text-slate-500 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-3 text-slate-400 italic" colSpan="6">
                    No reports fetched yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

     
        <div className="flex items-center justify-between mt-4">
          <div className="text-slate-400 text-sm">
            Page {currentPage} of {totalPages}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-slate-700 text-slate-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].slice(0, 10).map((_, i) => {
              const page = i + 1;
              const isActive = page === currentPage;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    isActive
                      ? "bg-teal-600 text-white"
                      : "bg-slate-700 text-slate-200"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="px-3 py-1 bg-slate-700 text-slate-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
