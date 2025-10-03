import React from "react";

const organizations = [
  {
    name: "Commissionerate of Health Services, National Health Mission",
    telephone: "022-22620235",
    email: "commissioner.health@maharashtra.gov.in",
    address:
      "8th Floor, Arogya Bhavan, St. George's Hospital Compound, P. D. Mello Road, Mumbai-400 001, Maharashtra",
    description:
      "Commissionerate of Health Services, National Health Mission Office Name: Commissionerate of Health Services, National Health…",
  },
  {
    name: "Maharashtra Medical Goods Procurement Authority (MMGPA)",
    telephone: "022-22679044",
    email: "maha.mmppa2023@gmail.com",
    address:
      "1st Floor, Arogya Bhavan, St. Georges Hospital Compound, Mumbai, 400001",
    description:
      "Maharashtra Medical Goods Procurement Authority (MMGPA) Name: Mr. Chandrakant Dange (IAS), Chief Executive Officer Phone:…",
  },
  {
    name: "Maharashtra State AIDS Control Society",
    telephone: "022-24113097",
    email: "pd@mahasacs.org",
    address:
      "AckWorth Leprosy Compound Hospital, R. A. Kidwai Marg, Wadala (West), Mumbai- 400031",
    description:
      "Maharashtra State AIDS Control Society Office Name: Commissionerate of Health Services, National Health Mission Officer-in-charge:…",
  },
  {
    name: "State Health Assurance Society",
    telephone: "022-65543901",
    email: "ceo@jeevandayee.gov.in",
    address:
      "Jeevandayee Bhavan, ESIC Hospital Compound, Near Worli Naka, Behind Poddar Hospital, Ganpat Jadhav Marg, Worli, Mumbai – 400018",
    description:
      "State Health Assurance Society Office Name: State Health Assurance Society Name: Mr. Aannasaheb Chavan (IAS),…",
  },
  {
    name: "Employee State Insurance Society",
    telephone: "022-24915187",
    email: "bo_lowerparel.mh@esic.nic.in",
    address:
      "ESIS Corporation, Panchedeep Bhavan 108, N. M. Joshi Marg Lower Parel- Mumbai -400013",
    description: "",
  },
  {
    name: "State Blood Transfusion Council",
    telephone: "022-22830216",
    email: "sbtc@mahasbtc.com",
    address:
      "Ravindra Annexe, 5th Floor, Dinshaw Vacha Road, 194, Churchgate Reclamation, Mumbai: 400020",
    description: "",
  },
];

const OrganizationCard = ({ org }) => (
  <div className="border rounded-2xl shadow-md p-5 bg-white hover:shadow-lg transition">
    <h2 className="text-lg font-semibold mb-2">{org.name}</h2>
    <p>
      <strong>Telephone:</strong> {org.telephone}
    </p>
    <p>
      <strong>Email:</strong>{" "}
      <a href={`mailto:${org.email}`} className="text-blue-600">
        {org.email}
      </a>
    </p>
    <p>
      <strong>Address:</strong> {org.address}
    </p>
    {org.description && (
      <p className="text-gray-600 mt-2 text-sm">{org.description}</p>
    )}
  </div>
);

const Organisation = () => {
  return (
    <div className="p-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">
        Attached Offices
      </h1>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {organizations.map((org, index) => (
          <OrganizationCard key={index} org={org} />
        ))}
      </div>
    </div>
  );
};

export default Organisation;
