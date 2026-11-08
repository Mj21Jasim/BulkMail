import { useEffect, useState } from 'react';
import axios from 'axios';

import {
  Mail,
  Send,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  ArrowUpRight,
  TrendingUp,
  Inbox
} from 'lucide-react';

import { Link } from 'react-router-dom';

function Dashboard() {

  const [stats, setStats] = useState({
    totalEmails: 0,
    totalRecipients: 0,
    successfulEmails: 0,
    failedEmails: 0,
    recentEmails: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        'http://localhost:5000/api/emails/stats'
      );

      setStats({
        totalEmails: response.data.totalEmails || 0,
        totalRecipients: response.data.totalRecipients || 0,
        successfulEmails: response.data.successfulEmails || 0,
        failedEmails: response.data.failedEmails || 0,
        recentEmails: Array.isArray(response.data.recentEmails)
          ? response.data.recentEmails
          : []
      });

      setLastUpdated(new Date());

    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Unable to load dashboard statistics. Please try again.');

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Calculate success rate
  const successRate = stats.totalEmails > 0
    ? Math.round(
        (stats.successfulEmails / stats.totalEmails) * 100
      )
    : 0;

  // Format numbers
  const formatNumber = (number) => {
    return Number(number).toLocaleString();
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'Date unavailable';

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Statistics cards
  const statistics = [
    {
      title: 'Total Emails',
      value: stats.totalEmails,
      icon: <Mail size={22} />,
      color: 'purple',
      description: 'Total campaigns created'
    },
    {
      title: 'Successful Emails',
      value: stats.successfulEmails,
      icon: <CheckCircle size={22} />,
      color: 'green',
      description: 'Accepted by mail server'
    },
    {
      title: 'Total Recipients',
      value: stats.totalRecipients,
      icon: <Users size={22} />,
      color: 'orange',
      description: 'Across all campaigns'
    },
    {
      title: 'Failed Emails',
      value: stats.failedEmails,
      icon: <AlertCircle size={22} />,
      color: 'blue',
      description: 'Campaigns that failed'
    }
  ];

  // Status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={14} />;

      case 'failed':
        return <AlertCircle size={14} />;

      case 'pending':
        return <Clock size={14} />;

      case 'partial':
        return <Inbox size={14} />;

      default:
        return <Mail size={14} />;
    }
  };

  return (
    <div className="dashboard">

      {/* Dashboard Header */}

      <div className="dashboard-header">

        <div>
          <span className="dashboard-eyebrow">
            OVERVIEW
          </span>

          <h1>Welcome back, Admin!</h1>

          <p>
            Here's what's happening with your email campaigns.
          </p>
        </div>

        <div className="dashboard-header-actions">

          <button
            className="refresh-btn"
            onClick={fetchDashboardStats}
            disabled={loading}
          >
            <RefreshCw
              size={16}
              className={loading ? 'refresh-spinning' : ''}
            />

            Refresh
          </button>

          <Link to="/compose" className="primary-btn">
            <Send size={17} />
            Compose Email
          </Link>

        </div>

      </div>

      {/* Loading State */}

      {loading && !lastUpdated ? (

        <div className="dashboard-message">
          <RefreshCw className="refresh-spinning" size={24} />
          <p>Loading your dashboard...</p>
        </div>

      ) : error ? (

        /* Error State */

        <div className="dashboard-error">

          <AlertCircle size={28} />

          <h3>Something went wrong</h3>

          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={fetchDashboardStats}
          >
            Try Again
          </button>

        </div>

      ) : (

        <>

          {/* Statistics */}

          <div className="stats-grid">

            {statistics.map((item) => (

              <div className="stat-card" key={item.title}>

                <div className={`stat-icon ${item.color}`}>
                  {item.icon}
                </div>

                <div className="stat-information">

                  <p>{item.title}</p>

                  <h2>
                    {formatNumber(item.value)}
                  </h2>

                  <span>{item.description}</span>

                </div>

                <ArrowUpRight
                  className="stat-arrow"
                  size={18}
                />

              </div>

            ))}

          </div>

          {/* Campaign Performance */}

          <div className="performance-card">

            <div className="performance-heading">

              <div className="performance-icon">
                <TrendingUp size={21} />
              </div>

              <div>
                <h2>Campaign Performance</h2>
                <p>Overall email campaign success rate</p>
              </div>

            </div>

            <div className="performance-details">

              <div className="performance-rate">
                <h2>{successRate}%</h2>
                <span>Success rate</span>
              </div>

              <div className="performance-progress">

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${successRate}%` }}
                  />
                </div>

                <p>
                  {stats.successfulEmails} successful out of{' '}
                  {stats.totalEmails} campaigns
                </p>

              </div>

            </div>

          </div>

          {/* Recent Activity + Quick Action */}

          <div className="dashboard-content">

            {/* Recent Activity */}

            <div className="activity-card">

              <div className="section-heading">

                <div>
                  <h2>Recent Activity</h2>
                  <p>Your latest email campaigns</p>
                </div>

                <Link to="/history" className="text-link">
                  View All <ArrowUpRight size={15} />
                </Link>

              </div>

              {stats.recentEmails.length === 0 ? (

                <div className="empty-activity">

                  <div className="empty-activity-icon">
                    <Mail size={30} />
                  </div>

                  <h3>No campaigns yet</h3>

                  <p>
                    Your recent email activity will appear here.
                  </p>

                  <Link to="/compose" className="text-link">
                    Create your first campaign
                  </Link>

                </div>

              ) : (

                <div className="recent-email-list">

                  {stats.recentEmails.map((email) => (

                    <div
                      className="recent-email-item"
                      key={email._id}
                    >

                      <div className="recent-email-icon">
                        <Mail size={20} />
                      </div>

                      <div className="recent-email-details">

                        <h3>
                          {email.subject || 'Untitled Campaign'}
                        </h3>

                        <p>
                          <Users size={14} />

                          {email.recipients?.length || 0}{' '}
                          {(email.recipients?.length || 0) === 1
                            ? 'recipient'
                            : 'recipients'}
                        </p>

                        <span>
                          <Clock size={13} />
                          {formatDate(email.createdAt)}
                        </span>

                      </div>

                      <span
                        className={`email-status ${email.status}`}
                      >
                        {getStatusIcon(email.status)}
                        {email.status}
                      </span>

                    </div>

                  ))}

                </div>

              )}

              {lastUpdated && (
                <div className="last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}

            </div>

            {/* Quick Compose */}

            <div className="quick-card">

              <div className="quick-icon">
                <Send size={25} />
              </div>

              <span className="quick-label">
                QUICK ACTION
              </span>

              <h2>
                Ready to reach your audience?
              </h2>

              <p>
                Create your next email campaign and connect
                with multiple recipients from one place.
              </p>

              <Link to="/compose" className="primary-btn">
                <Send size={16} />
                Compose New Email
              </Link>

              <div className="quick-footer">
                <CheckCircle size={15} />
                Simple. Fast. Reliable.
              </div>

            </div>

          </div>

        </>

      )}

    </div>
  );
}

export default Dashboard;
