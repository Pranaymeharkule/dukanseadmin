import React from "react";

const AccountIcon = () => (
  <svg
    width="30"
    height="30"
    viewBox="0 0 30 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="15" cy="15" r="15" fill="#FEBC1D" />
    <path
      d="M8.59961 19.6746C8.59961 17.1575 10.7025 15.1171 14.9996 15.1171C19.2968 15.1171 21.3996 17.1575 21.3996 19.6746C21.3996 20.075 21.1075 20.3996 20.7471 20.3996H9.25216C8.89177 20.3996 8.59961 20.075 8.59961 19.6746Z"
      stroke="#EC2D01"
      strokeWidth="1.5"
    />
    <path
      d="M17.3996 9.99961C17.3996 11.3251 16.3251 12.3996 14.9996 12.3996C13.6741 12.3996 12.5996 11.3251 12.5996 9.99961C12.5996 8.67413 13.6741 7.59961 14.9996 7.59961C16.3251 7.59961 17.3996 8.67413 17.3996 9.99961Z"
      stroke="#EC2D01"
      strokeWidth="1.5"
    />
  </svg>
);

const RiskMonitoring = () => {
  const riskData = [
    {
      id: 1,
      accountId: "Rajesh Mittal",
      riskLevel: "High",
      suspiciousActivity: "Unusual referral spike",
      action: "Review Required",
      recentReferrals: 45,
    },
    {
      id: 2,
      accountId: "Rajesh Mittal",
      riskLevel: "High",
      suspiciousActivity: "Unusual referral spike",
      action: "Review Required",
      recentReferrals: 45,
    },
    {
      id: 3,
      accountId: "Rajesh Mittal",
      riskLevel: "High",
      suspiciousActivity: "Unusual referral spike",
      action: "Review Required",
      recentReferrals: 45,
    },
    {
      id: 4,
      accountId: "Rajesh Mittal",
      riskLevel: "High",
      suspiciousActivity: "Unusual referral spike",
      action: "Review Required",
      recentReferrals: 45,
    },
  ];

  return (
    <div className="p-2 sm:p-4 md:p-6 bg-gray-100 min-h-screen flex flex-col">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-sm mb-3 sm:mb-4 md:mb-6">
        <div className="p-3 sm:p-4 md:p-6">
          <h1 className="text-lg text-gray-800 font-medium">
            Risk Monitoring
          </h1>
        </div>
      </div>

      {/* Table wrapper fills remaining space */}
      <div className="flex-1 bg-white rounded-lg shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[600px] sm:min-w-[700px]">
            <thead className="bg-brandYellow text-white text-center">
              <tr className="text-black text-sm">
                <th className="py-3 px-4 text-base text-left">
                  Account ID
                </th>
                <th className="py-3 px-4 text-base text-left">
                  Suspicious Activity
                </th>
                <th className="py-3 px-4 text-base text-left">
                  Action
                </th>
                <th className="py-3 px-4 text-base text-left">
                  Recent Referrals
                </th>
                <th className="py-3 px-4 text-base text-left">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riskData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <AccountIcon className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                      </div>
                      <div className="ml-1 sm:ml-2 md:ml-3">
                        <div className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.accountId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.suspiciousActivity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.action}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.recentReferrals}
                  </td>
                  <td className="px-2 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-2 md:py-3 whitespace-nowrap text-left">
                    <span className="font-poppins font-medium text-[9px] sm:text-[10px] md:text-[12px] leading-none tracking-wide text-[#EC2D01]">
                      {item.riskLevel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RiskMonitoring;