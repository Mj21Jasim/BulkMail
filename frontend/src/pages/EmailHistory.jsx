import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Mail,
  Search,
  Users,
  CalendarDays,
  Clock,
  RefreshCw
} from 'lucide-react';

function EmailHistory() {

  const [emails, setEmails] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await axios.get(
        'https://bulkmail-i72u.onrender.com/api/emails/history'
      );

      setEmails(response.data.emails);

    } catch (err) {
      setError('Unable to load email history. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const filteredEmails = emails.filter((email) =>
    email.subject.toLowerCase().includes(search.toLowerCase()) ||
    email.recipients.some((recipient) =>
      recipient.toLowerCase().includes(search.toLowerCase())
    )
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="history-page">

      <div className="welcome-section">
        <div>
          <h1>Email History</h1>
          <p>View and manage your previously saved emails.</p>
        </div>

        <button
          className="primary-btn"
          onClick={fetchEmails}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      <div className="history-stats">

        <div className="history-stat-card">
          <Mail size={22} />
          <div>
            <h3>{emails.length}</h3>
            <p>Total Emails</p>
          </div>
        </div>

        <div className="history-stat-card">
          <Users size={22} />
          <div>
            <h3>
              {emails.reduce(
                (total, email) => total + email.recipients.length,
                0
              )}
            </h3>
            <p>Total Recipients</p>
          </div>
        </div>

      </div>

      <div className="history-card">

        <div className="history-header">
          <div>
            <h2>All Emails</h2>
            <p>Your saved email records from MongoDB.</p>
          </div>

          <div className="history-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search subject or recipient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (

          <div className="history-empty">
            Loading email history...
          </div>

        ) : error ? (

          <div className="history-empty">
            {error}
          </div>

        ) : filteredEmails.length === 0 ? (

          <div className="history-empty">
            <Mail size={35} />
            <h3>No emails found</h3>
            <p>
              {search
                ? 'Try searching with a different keyword.'
                : 'Your saved emails will appear here.'}
            </p>
          </div>

        ) : (

          <div className="email-history-list">

            {filteredEmails.map((email) => (

              <div className="email-history-item" key={email._id}>

                <div className="email-history-icon">
                  <Mail size={21} />
                </div>

                <div className="email-history-content">

                  <div className="email-history-top">
                    <h3>{email.subject}</h3>

                    <span className={`email-status ${email.status}`}>
                      {email.status}
                    </span>
                  </div>

                  <p className="email-preview">
                    {email.body.length > 120
                      ? `${email.body.substring(0, 120)}...`
                      : email.body}
                  </p>

                  <div className="email-history-meta">

                    <span>
                      <Users size={15} />
                      {email.recipients.length} Recipients
                    </span>

                    <span>
                      <CalendarDays size={15} />
                      {formatDate(email.createdAt)}
                    </span>

                    <span>
                      <Clock size={15} />
                      {email.status}
                    </span>

                  </div>

                  <div className="history-recipients">
                    {email.recipients.join(', ')}
                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default EmailHistory;
