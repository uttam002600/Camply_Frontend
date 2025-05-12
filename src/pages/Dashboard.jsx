import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axios";
import { toast } from "react-hot-toast";
import Pagination from "../component/dashboard/Pagination";
import Modal from "../component/dashboard/Modal";
import Tooltip from "../component/dashboard/Tooltip";
import LoadingSpinner from "../component/common/LoadingSpinner";
import {
  FiEye,
  FiMail,
  FiUsers,
  FiInfo,
  FiSearch,
  FiPlus,
} from "react-icons/fi";

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [campaignsPerPage] = useState(10);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [selectedLogs, setSelectedLogs] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [logsLoading, setLogsLoading] = useState(false);
  const [segmentLoading, setSegmentLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch campaigns with stats
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/user/get-campaign");
      setCampaigns(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Get current campaigns for pagination
  const indexOfLastCampaign = currentPage * campaignsPerPage;
  const indexOfFirstCampaign = indexOfLastCampaign - campaignsPerPage;
  const currentCampaigns = campaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  // Fetch segment details with loading state
  const fetchSegmentDetails = async (segmentId) => {
    try {
      setSegmentLoading(true);
      const response = await axiosInstance.get(`/user/get-segment`, {
        params: { id: segmentId._id },
      });
      setSelectedSegment(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch segment details"
      );
    } finally {
      setSegmentLoading(false);
    }
  };

  // Fetch communication logs with loading state
  const fetchCommunicationLogs = async (campaignId) => {
    try {
      setLogsLoading(true);
      const response = await axiosInstance.get(
        `/user/get-log?campaignId=${campaignId}`
      );
      setSelectedLogs(response.data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch communication logs"
      );
    } finally {
      setLogsLoading(false);
    }
  };

  // Calculate success percentage from campaign stats
  const calculateSuccessRate = (campaign) => {
    if (!campaign.stats || campaign.stats.total_recipients === 0) return 0;
    return Math.round(
      (campaign.stats.sent / campaign.stats.total_recipients) * 100
    );
  };

  // Truncate text with ellipsis
  const truncateText = (text, length = 30) => {
    return text?.length > length ? `${text.substring(0, length)}...` : text;
  };

  if (loading) {
    return <LoadingSpinner label="Loading Dashboard..." />;
  }

  return (
    <div className="container  m-auto py-8 bg-[var(--bg-black-900)]">
      <h1 className="text-2xl font-bold text-[var(--text-black-900)] mb-6">
        Your Campaigns
      </h1>

      {campaigns.length === 0 ? (
        <div className="bg-[var(--bg-black-100)] p-8 rounded-lg shadow-lg text-center">
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-[var(--text-black-900)] mb-4">
              No Campaigns Found
            </h2>
            <p className="text-[var(--text-black-700)] mb-6">
              Get started by creating your first campaign
            </p>
            <button
              onClick={() => navigate("/campaigns")}
              className="px-6 py-3 bg-[var(--skin-color)] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center mx-auto"
            >
              <FiPlus className="mr-2" />
              Create Campaign
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow-lg">
            <table className="min-w-full bg-[var(--bg-black-100)]">
              <thead className="bg-[var(--bg-black-50)]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Segment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Logs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--bg-black-50)]">
                {currentCampaigns.map((campaign) => (
                  <tr
                    key={campaign._id}
                    className="hover:bg-[var(--bg-black-50)]"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                      {campaign.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                      <button
                        onClick={() => fetchSegmentDetails(campaign.segment_id)}
                        className="flex items-center space-x-1 text-[var(--skin-color)] hover:text-[var(--text-black-900)]"
                        disabled={segmentLoading}
                      >
                        <FiUsers className="inline" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                      <Tooltip content={campaign.template.subject}>
                        <button
                          onClick={() =>
                            setSelectedSubject(campaign.template.subject)
                          }
                          className="text-left"
                        >
                          {truncateText(campaign.template.subject, 20)}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--text-black-900)]">
                      <Tooltip content={campaign.template.body}>
                        <button
                          onClick={() =>
                            setSelectedMessage(campaign.template.body)
                          }
                          className="text-left"
                        >
                          {truncateText(campaign.template.body, 30)}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                      <button
                        onClick={() => fetchCommunicationLogs(campaign._id)}
                        className="flex items-center space-x-1 text-[var(--skin-color)] hover:text-[var(--text-black-900)]"
                        disabled={logsLoading}
                      >
                        <FiMail className="inline" />
                        <span>View</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                      <div className="flex items-center">
                        <div className="w-16 mr-2">
                          <div className="h-2 bg-[var(--bg-black-900)] rounded-full">
                            <div
                              className="h-2 bg-[var(--skin-color)] rounded-full"
                              style={{
                                width: `${calculateSuccessRate(campaign)}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                        <span>
                          {calculateSuccessRate(campaign)}% (
                          {campaign.stats?.sent || 0}/
                          {campaign.stats?.total_recipients || 0})
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            itemsPerPage={campaignsPerPage}
            totalItems={campaigns.length}
            paginate={(pageNumber) => setCurrentPage(pageNumber)}
            currentPage={currentPage}
          />
        </>
      )}

      {/* Segment Details Modal */}
      <Modal
        isOpen={!!selectedSegment}
        onClose={() => setSelectedSegment(null)}
        title="Segment Details"
        blurBackground={false}
      >
        {segmentLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          selectedSegment && <SegmentDetails segment={selectedSegment} />
        )}
      </Modal>

      {/* Communication Logs Modal */}
      <Modal
        isOpen={!!selectedLogs}
        onClose={() => setSelectedLogs(null)}
        title="Communication Logs"
        size="xl"
        blurBackground={false}
      >
        {logsLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        ) : (
          selectedLogs && <CommunicationLogs logs={selectedLogs} />
        )}
      </Modal>

      {/* Message Modal */}
      <Modal
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
        title="Full Message"
        blurBackground={false}
      >
        <div className="whitespace-pre-wrap p-4 bg-[var(--bg-black-50)] text-[var(--text-black-700)] rounded">
          {selectedMessage}
        </div>
      </Modal>

      {/* Subject Modal */}
      <Modal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        title="Full Subject"
        blurBackground={false}
      >
        <div className="p-4 bg-[var(--bg-black-50)] text-[var(--text-black-700)] rounded">
          {selectedSubject}
        </div>
      </Modal>
    </div>
  );
};

// Segment Details Component
const SegmentDetails = ({ segment }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium text-[var(--text-black-900)]">
          {segment.name}
        </h3>
        <p className="text-sm text-[var(--text-black-700)]">
          {segment.description}
        </p>
      </div>

      <div>
        <h4 className="font-medium text-[var(--text-black-900)] mb-2">Rules</h4>
        <div className="bg-[var(--bg-black-900)] p-4 rounded-lg">
          <pre className="text-sm text-[var(--text-black-700)] overflow-x-auto">
            {JSON.stringify(segment.rules, null, 2)}
          </pre>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-[var(--text-black-700)]">
          <span className="font-medium">Estimated Size:</span>{" "}
          {segment.estimated_count}
        </div>
        <div className="text-sm text-[var(--text-black-700)]">
          <span className="font-medium">Created:</span>{" "}
          {new Date(segment.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

// Communication Logs Component
const CommunicationLogs = ({ logs }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredLogs = logs.filter((log) => {
    if (filter !== "all" && log.status !== filter) return false;
    if (
      search &&
      !(
        log.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        log.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
        log.status?.toLowerCase().includes(search.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const statusColors = {
    sent: "bg-green-500",
    delivered: "bg-blue-500",
    failed: "bg-red-500",
    queued: "bg-yellow-500",
    opened: "bg-purple-500",
    clicked: "bg-indigo-500",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search by customer or status..."
            className="w-full pl-10 pr-4 py-2 bg-[var(--bg-black-900)] border border-[var(--bg-black-50)] rounded-lg text-[var(--text-black-900)] focus:outline-none focus:ring-1 focus:ring-[var(--skin-color)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FiSearch className="absolute left-3 top-3 text-[var(--text-black-700)]" />
        </div>

        <select
          className="px-4 py-2 bg-[var(--bg-black-900)] border border-[var(--bg-black-50)] rounded-lg text-[var(--text-black-900)] focus:outline-none focus:ring-1 focus:ring-[var(--skin-color)]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="opened">Opened</option>
          <option value="clicked">Clicked</option>
          <option value="failed">Failed</option>
          <option value="queued">Queued</option>
        </select>
      </div>

      <div className="overflow-x-auto max-h-[60vh]">
        <table className="min-w-full divide-y divide-[var(--bg-black-50)]">
          <thead className="bg-[var(--bg-black-50)] sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                Sent At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-black-700)] uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--bg-black-50)]">
            {filteredLogs.map((log) => (
              <tr key={log._id} className="hover:bg-[var(--bg-black-50)]">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[var(--bg-black-900)] flex items-center justify-center">
                      <span className="text-[var(--text-black-900)]">
                        {log.customer?.name?.charAt(0) || "C"}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-[var(--text-black-900)]">
                        {log.customer?.name || "Unknown Customer"}
                      </div>
                      <div className="text-sm text-[var(--text-black-700)]">
                        {log.customer?.phone || "No phone"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                  {log.customer?.email || "No email"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      statusColors[log.status] || "bg-gray-500"
                    } text-white`}
                  >
                    {log.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                  {log.sent_at
                    ? new Date(log.sent_at).toLocaleString()
                    : "Not sent"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-black-900)]">
                  <button
                    onClick={() => {
                      /* Implement details view */
                    }}
                    className="text-[var(--skin-color)] hover:text-[var(--text-black-900)]"
                  >
                    <FiInfo className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
