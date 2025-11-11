import { useState } from "react";

export default function CaseModal({ data, onClose, onUpdate }) {
  const [status, setStatus] = useState(data.status);
  const [note, setNote] = useState("");
  const [callInProgress, setCallInProgress] = useState(false);

  const addNote = () => {
    const updated = {
      ...data,
      status,
      history: [
        ...data.history,
        { stage: status, note, date: new Date().toLocaleDateString() },
      ],
    };

    const actionDetails = {
      action: "updated",
      details: `Updated case ${data.id} status to ${status}${note ? `: ${note}` : ""}`,
    };

    onUpdate(updated, actionDetails);
    setNote("");
    alert("Case updated successfully (mock API)");
  };

  const initiateCall = () => {
    setCallInProgress(true);
    // Simulate call initiation
    const callLog = {
      stage: "CALL_INITIATED",
      note: `Call initiated to ${data.customer} at ${new Date().toLocaleTimeString()}`,
      date: new Date().toLocaleDateString(),
    };

    const updated = {
      ...data,
      history: [...data.history, callLog],
    };

    const actionDetails = {
      action: "updated",
      details: `Initiated call to ${data.customer} for case ${data.id}`,
    };

    onUpdate(updated, actionDetails);

    // Simulate call ending after 5 seconds
    setTimeout(() => {
      setCallInProgress(false);
      alert("Call ended. Add follow-up notes below.");
    }, 5000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-[600px] max-h-[90vh] overflow-y-auto relative">
        <div className="sticky top-0 bg-white border-b p-6 pb-3">
          <button
            onClick={onClose}
            className="absolute right-3 top-3 text-gray-500 text-xl hover:text-gray-700"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold">Case Details</h2>
        </div>
        <div className="p-6 pt-3">
        <p className="text-gray-600 mb-2">
          <strong>Loan ID:</strong> {data.id}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Customer:</strong> {data.customer}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Amount:</strong> ₹{data.amount.toLocaleString()}
        </p>

        {/* Call Customer Button */}
        <div className="mb-4">
          <button
            onClick={initiateCall}
            disabled={callInProgress}
            className={`w-full py-2 rounded font-semibold ${
              callInProgress
                ? "bg-green-500 text-white cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {callInProgress ? "📞 Call in Progress..." : "📞 Call Customer"}
          </button>
        </div>

        {/* Payment History */}
        <h3 className="font-semibold mb-2">Payment History</h3>
        <div className="border rounded p-3 mb-4 max-h-40 overflow-y-auto bg-gray-50">
          {data.paymentHistory && data.paymentHistory.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2">Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {data.paymentHistory.map((payment, i) => (
                  <tr key={i} className="border-b last:border-none">
                    <td className="py-2">{payment.date}</td>
                    <td>₹{payment.amount.toLocaleString()}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          payment.status === "Received"
                            ? "bg-green-100 text-green-600"
                            : "bg-yellow-100 text-yellow-600"
                        }`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td>{payment.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No payment history available</p>
          )}
        </div>

        <h3 className="font-semibold mb-2">Case Timeline</h3>
        <ul className="border rounded p-2 mb-4 max-h-40 overflow-y-auto bg-gray-50">
          {data.history.map((h, i) => (
            <li key={i} className="text-sm border-b last:border-none py-1">
              <strong>{h.stage}</strong> — {h.note} ({h.date})
            </li>
          ))}
        </ul>

        <h3 className="font-semibold mb-2">Update Status</h3>
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <select
            className="border rounded px-3 py-2 w-full sm:w-auto"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["ASSIGNED", "FOLLOW_UP", "RESOLVED", "CLOSED"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <input
            className="border rounded px-3 py-2 flex-1"
            placeholder="Add note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
            onClick={addNote}
          >
            Save
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
