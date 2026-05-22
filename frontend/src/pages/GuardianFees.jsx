import { useEffect, useState } from "react";
import API from "../services/api";
import PageHeader from "../components/PageHeader";

export default function GuardianFees() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    const fetchFees = async () => {
      const res = await API.get("/parent/dashboard");
      setFees(res.data.fees || []);
    };

    fetchFees();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Fee Details"
        subtitle="View fee payment history, pending dues, and payment status."
        gradient="from-emerald-700 to-green-600"
      />

      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-900">
            Fee Payment History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left">Fee Type</th>
                <th className="px-6 py-4 text-left">Total</th>
                <th className="px-6 py-4 text-left">Paid</th>
                <th className="px-6 py-4 text-left">Pending</th>
                <th className="px-6 py-4 text-left">Due Date</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {fees.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-slate-500">
                    No fee records found
                  </td>
                </tr>
              ) : (
                fees.map((fee) => {
                  const pending = fee.totalAmount - fee.paidAmount;

                  return (
                    <tr key={fee._id}>
                      <td className="px-6 py-4 font-semibold">{fee.feeType}</td>
                      <td className="px-6 py-4">₹{fee.totalAmount}</td>
                      <td className="px-6 py-4 text-green-600 font-semibold">
                        ₹{fee.paidAmount}
                      </td>
                      <td className="px-6 py-4 text-red-600 font-semibold">
                        ₹{pending}
                      </td>
                      <td className="px-6 py-4">
                        {new Date(fee.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{fee.status}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}