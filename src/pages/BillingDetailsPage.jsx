import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const BillingDetailsPage = () => {
  const { orgId } = useParams();
  const [billingDetails, setBillingDetails] = useState(null);

  useEffect(() => {
    const fetchBillingDetails = async () => {
      try {
        const { data } = await API.get(`/organisations/billing/${orgId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setBillingDetails(data.billingDetails || {});
      } catch (err) {
        console.error(err);
      }
    };

    fetchBillingDetails();
  }, [orgId]);

  if (!billingDetails) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Billing Details</h1>
      <p>Package: {billingDetails.monetisationDetails?.package || 'N/A'}</p>
      <p>Status: {billingDetails.monetisationDetails?.active ? 'Active' : 'Inactive'}</p>
      <p>Expiry: {billingDetails.monetisationDetails?.expiry || 'N/A'}</p>
      <h2 className="text-2xl font-semibold mt-6">Payment History</h2>
      {billingDetails.payments?.length > 0 ? (
        <ul className="mt-4">
          {billingDetails.payments.map((payment, index) => (
            <li key={index} className="p-4 border rounded mb-4">
              <p>Amount: ₹{payment.amount}</p>
              <p>Date: {new Date(payment.date).toLocaleDateString()}</p>
              <p>Method: {payment.method}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No payment history available.</p>
      )}
    </div>
  );
};

export default BillingDetailsPage;
