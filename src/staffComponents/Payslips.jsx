import { useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import favPng from "../assets/fav.png"; 
import useApi from "../customHooks/useApi";

const rowsPerPage = 8;

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

export default function Payslips() {
  const staffId = 4; // later  i will replace with localStorage.getItem("id")
  const backendUrl = "http://localhost:8081";
  const { get } = useApi(backendUrl);

  const [mode, setMode] = useState("latest"); 
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

 
 const fetchData = async () => {
  setLoading(true);
  try {
    let endpoint = "";

    if (mode === "latest") {
      endpoint = `/api/salary-transactions/staff/${staffId}/latest`;
    } else if (mode === "month") {
      if (!month) {
        alert("Please select a month first");
        setLoading(false);
        return;
      }

      const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;
      if (!monthRegex.test(month)) {
        alert("Invalid month format. Please select a valid month.");
        setLoading(false);
        return;
      }

      endpoint = `/api/salary-transactions/staff/${staffId}/month?month=${month}`;
    } else if (mode === "all") {
      endpoint = `/api/salary-transactions/staff/${staffId}/all`;
    }

    const response = await get(endpoint);
    const data = Array.isArray(response) ? response : response ? [response] : [];

    if (data.length === 0) {
      if (mode === "month") {
        alert(`No salary found for ${month}`);
      } else {
        alert("No salary records found.");
      }
    }

    setReports(data);
    setCurrentPage(1);
  } catch (err) {
    console.error("Error fetching salary data:", err);
    alert("Failed to fetch salary data. Please try again later.");
  } finally {
    setLoading(false);
  }
};

  function formatAmount(val) {
    if (val == null) return "";
    return "₹ " + new Intl.NumberFormat("en-IN").format(val);
  }

  const downloadPayslip = async (report) => {
  if (!report) {
    alert("Invalid report data.");
    return;
  }

  try {
    const url = `http://localhost:8081/api/staff/${report.staffId}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch employee details");
    const userDetails = await res.json();

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const marginX = 40;
    let y = 40;

    const logoBase64 = await toBase64(favPng);

    const formatAmount = (num) => num != null ? num.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "-";

   
    autoTable(doc, {
      startY: y,
      body: [
        [
          { content: report.companyName ?? "SalaryGen", styles: { halign: "center", fontStyle: "bold", fontSize: 14 } },
          { content: `Name: ${report.staffName ?? "-"}`, styles: { halign: "left", fontSize: 11 } }
        ],
        [
          { content: `Salary Slip for ${report.salaryMonth ?? "-"}`, styles: { halign: "center", fontSize: 12 } },
          { content: `Emp. No: ${report.staffId ?? "-"}`, styles: { halign: "left", fontSize: 11 } }
        ]
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6, valign: "middle", lineColor: [0,0,0], lineWidth: 0.5 },
      columnStyles: { 0: { cellWidth: pageWidth * 0.4 }, 1: { cellWidth: pageWidth * 0.45 } },
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
      head: [["Dept", "Join-Date", "Relieved Date", "Bank Name", "IFSC Code", "AC_NUM"]],
      body: [[
        userDetails.department ?? "-",
        userDetails.joiningDate ?? "-",
        userDetails.relievedDate ?? "Working",
        userDetails.salaryDetails?.bankName ?? "-",
        userDetails.salaryDetails?.ifscCode ?? "-",
        userDetails.salaryDetails?.bankAccountNumber ?? "-"
      ]],
      theme: "grid",
      styles: { fontSize: 10, cellPadding: 6, halign: "center", valign: "middle", lineColor: [0,0,0], lineWidth: 0.4 },
      headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold" },
      columnStyles: {
        0: { cellWidth: pageWidth * 0.13 },
        1: { cellWidth: pageWidth * 0.14 },
        2: { cellWidth: pageWidth * 0.14 },
        3: { cellWidth: pageWidth * 0.14 },
        4: { cellWidth: pageWidth * 0.15 },
        5: { cellWidth: pageWidth * 0.15 }
      }
    });

    y = doc.lastAutoTable.finalY + 20;

    const earnings = [];
    const deductions = [];

    if (report.basicPay != null) earnings.push(["Basic Salary", formatAmount(report.basicPay)]);
    if (report.componentBreakdown) {
      Object.entries(report.componentBreakdown).forEach(([key, val]) => {
        if (val == null) return;
        const upperKey = key.toUpperCase();
        if (["PF", "PT", "ESI", "TDS", "INSURANCE", "OTHER_DEDUCTIONS"].includes(upperKey)) {
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
        deductions[i]?.[1] ?? ""
      ]);
    }

    autoTable(doc, {
      startY: y,
      head: [["Earnings", "Amount", "Deductions", "Amount"]],
      body: bodyRows,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6, valign: "middle", lineColor: [0,0,0], lineWidth: 0.3 },
      headStyles: { fillColor: [200, 200, 200], textColor: 0, fontStyle: "bold" },
      columnStyles: { 1: { halign: "right" }, 3: { halign: "right" } },
      didParseCell: (data) => {
        if (data.row.index % 2 === 0 && data.row.section === "body") {
          data.cell.styles.fillColor = [245, 245, 245];
        }
      }
    });

    y = doc.lastAutoTable.finalY + 10;

    
    autoTable(doc, {
      startY: y,
      body: [
        ["Gross Salary", formatAmount(report.grossSalary)],
        ["Total Deductions", formatAmount(report.totalDeductions)],
        ["Net Pay", formatAmount(report.netSalary)]
      ],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6, valign: "middle", lineColor: [0,0,0], lineWidth: 0.3 },
      columnStyles: {
        0: { fontStyle: "bold", halign: "left" },
        1: { halign: "right", fontStyle: "bold" }
      }
    });

    y = doc.lastAutoTable.finalY + 10;

    const toWords = (num) => {
      if (!num) return "Zero";
      const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
        "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
      const b = ["","", "Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
      function inWords(n){
        if(n<20) return a[n];
        if(n<100) return b[Math.floor(n/10)] + (n%10? " "+a[n%10]:"");
        if(n<1000) return a[Math.floor(n/100)]+" Hundred"+(n%100? " "+inWords(n%100):"");
        if(n<100000) return inWords(Math.floor(n/1000))+" Thousand"+(n%1000? " "+inWords(n%1000):"");
        if(n<10000000) return inWords(Math.floor(n/100000))+" Lakh"+(n%100000? " "+inWords(n%100000):"");
        return inWords(Math.floor(n/10000000))+" Crore"+(n%10000000? " "+inWords(n%10000000):"");
      }
      return (inWords(num)+" Rupees Only /-").trim();
    };

    autoTable(doc, {
      startY: y,
      body: [[`Amount in Words: ${toWords(report.netSalary) ?? "-"}`]],
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6, lineColor: [0,0,0], lineWidth: 0.3 },
      columnStyles: { 0: { cellWidth: pageWidth - 2 * marginX } }
    });

  
    const footerY = doc.lastAutoTable.finalY + 20;
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text("This is a system-generated payslip and does not require a signature.", pageWidth / 2, footerY, { align: "center" });
    doc.text("Generated by SalaryGen", pageWidth / 2, footerY + 14, { align: "center" });

    const fileName = `Payslip_${report.staffId ?? "Staff"}_${report.salaryMonth ?? "Month"}.pdf`;
    doc.save(fileName);

  } catch (err) {
    console.error("Failed to generate payslip:", err);
    alert("Failed to generate payslip. See console.");
  }
};

  
  const filtered = useMemo(() => {
    const q = (searchQuery || "").toLowerCase().trim();
    if (!q) return reports;
    return reports.filter((r) => {
      return (
        String(r.staffName || "").toLowerCase().includes(q) ||
        String(r.salaryMonth || "").toLowerCase().includes(q) ||
        String(r.netSalary || "").toLowerCase().includes(q)
      );
    });
  }, [reports, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage]);

  return (
    <div className="p-6 grid gap-6">

      <div className="p-6 rounded-xl shadow-lg bg-slate-900 border border-slate-700">
        <h2 className="text-xl font-semibold mb-4 text-teal-400">My Salary Reports</h2>

        <div className="flex flex-wrap gap-3 items-center">
          <button
            onClick={() => setMode("latest")}
            className={`px-3 py-2 rounded ${mode === "latest" ? "bg-teal-600" : "bg-slate-700"}`}
          >
            Latest
          </button>
          <button
            onClick={() => setMode("month")}
            className={`px-3 py-2 rounded ${mode === "month" ? "bg-teal-600" : "bg-slate-700"}`}
          >
            Specific Month
          </button>
          <button
            onClick={() => setMode("all")}
            className={`px-3 py-2 rounded ${mode === "all" ? "bg-teal-600" : "bg-slate-700"}`}
          >
            All
          </button>

          {mode === "month" && (
            <input
              type="text"
              placeholder="YYYY-MM"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white px-3 py-2 rounded"
            />
          )}

          <button
            className="px-4 py-2 rounded bg-indigo-600 text-white"
            onClick={fetchData}
            disabled={loading}
          >
            {loading ? "Fetching..." : "Fetch"}
          </button>
        </div>
      </div>

      
      <div className="p-6 rounded-xl shadow-lg bg-slate-900 border border-slate-700">
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-4">
          <input
            type="text"
            placeholder="Search by name, month, or salary..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full md:w-3/5 px-3 py-2 rounded-lg border border-slate-600 bg-slate-800 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
          <div className="text-slate-400 text-sm">
            Showing {Math.min(filtered.length, currentPage * rowsPerPage) || 0} of{" "}
            {filtered.length} results
          </div>
        </div>

      
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-center text-slate-200">
            <thead>
              <tr className="bg-slate-800 text-slate-300">
                <th className="px-3 py-2">Month</th>
                <th className="px-3 py-2">Gross</th>
                <th className="px-3 py-2">Deductions</th>
                <th className="px-3 py-2">Net</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((r) => (
                <tr key={r.id} className="border-t border-slate-700">
                  <td className="px-3 py-2">{r.salaryMonth}</td>
                  <td className="px-3 py-2">{formatAmount(r.grossSalary)}</td>
                  <td className="px-3 py-2">{formatAmount(r.totalDeductions)}</td>
                  <td className="px-3 py-2 font-semibold text-teal-400">{formatAmount(r.netSalary)}</td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => downloadPayslip(r)}
                      className="px-3 py-1 rounded bg-teal-600 hover:bg-teal-700"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-4 text-slate-500">
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

       
        <div className="flex justify-center mt-4 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-slate-300 self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
