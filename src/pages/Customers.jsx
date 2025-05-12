import { useState, useEffect } from "react";
import axiosInstance from "../utils/axios";

import React from "react";
import LoadingSpinner from "../component/common/LoadingSpinner";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: "",
    city: "",
    gender: "",
  });

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axiosInstance.get("/customer/");
        console.log(response.data.data);
        setCustomers(response.data.data);
        setFilteredCustomers(response.data.data);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    const filtered = customers.filter((customer) => {
      return (
        customer.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        (filters.city === "" ||
          customer.address?.city
            ?.toLowerCase()
            .includes(filters.city.toLowerCase())) &&
        (filters.gender === "" ||
          customer.demographics?.gender?.toLowerCase() ===
            filters.gender.toLowerCase())
      );
    });
    setFilteredCustomers(filtered);
  }, [filters, customers]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <LoadingSpinner label="Loading Customers..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-black-900)] mb-6">
          Customer Management
        </h1>

        {/* Filter Section */}
        <div className="bg-[var(--bg-black-100)] p-4 rounded-lg shadow-sm border border-[var(--bg-black-50)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-black-900)] mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={filters.name}
                onChange={handleFilterChange}
                placeholder="Search by name"
                className="w-full text-[var(--text-black-900)] px-3 py-2 border border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
              />
            </div>

            <div>
              <label className="block text-[var(--text-black-900)] text-sm font-medium  mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="Filter by city"
                className="w-full px-3 py-2 text-[var(--text-black-900)] border border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--text-black-900)] mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={filters.gender}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border text-[var(--text-black-900)] border-[var(--bg-black-50)] rounded-md focus:ring-[var(--skin-color)] focus:border-[var(--skin-color)]"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-[var(--bg-black-100)] rounded-lg shadow-sm border border-[var(--bg-black-50)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[var(--bg-black-50)]">
            <thead className="bg-[var(--bg-black-50)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                  Stats
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bg-black-50)]">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr
                    key={customer._id}
                    className="hover:bg-[var(--bg-black-50)]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--skin-color)] flex items-center justify-center text-white">
                          {customer.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[var(--text-black-900)]">
                            {customer.name}
                          </div>
                          <div className="text-sm text-[var(--text-black-700)]">
                            {customer.demographics?.occupation}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-black-900)]">
                        {customer.email}
                      </div>
                      <div className="text-sm text-[var(--text-black-700)]">
                        {customer.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-black-900)]">
                        {customer.address?.city}, {customer.address?.state}
                      </div>
                      <div className="text-sm text-[var(--text-black-700)]">
                        {customer.address?.country}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[var(--text-black-900)]">
                        ₹{customer.stats?.total_spent?.toLocaleString() || 0}
                      </div>
                      <div className="text-sm text-[var(--text-black-700)]">
                        {customer.stats?.order_count || 0} orders
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-700)]">
                      <button className="text-[var(--skin-color)] hover:text-[var(--skin-color)] mr-3">
                        View
                      </button>
                      <button className="text-[var(--skin-color)] hover:text-[var(--skin-color)]">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-sm text-[var(--text-black-700)]"
                  >
                    No customers found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Customers;
