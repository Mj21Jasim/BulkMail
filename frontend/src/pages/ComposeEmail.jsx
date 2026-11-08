import { useState } from 'react';
import axios from 'axios';
import {
  Mail,
  Users,
  Send,
  X,
  Plus,
  FileText
} from 'lucide-react';

function ComposeEmail() {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [recipientInput, setRecipientInput] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const addRecipient = () => {
    const email = recipientInput.trim().replace(/,$/, '');

    if (!email) return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }

    if (recipients.includes(email)) {
      setMessage('This email address is already added.');
      return;
    }

    setRecipients([...recipients, email]);
    setRecipientInput('');
    setMessage('');
  };

  const removeRecipient = (email) => {
    setRecipients(recipients.filter(item => item !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim() || recipients.length === 0) {
      setMessage('Please complete all fields and add recipients.');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const response = await axios.post(
        'https://bulkmail-i72u.onrender.com/api/emails/send',
        {
          subject,
          body,
          recipients
        }
      );

      setMessage(response.data.message);

      setSubject('');
      setBody('');
      setRecipients([]);
      setRecipientInput('');

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Unable to send email. Please check your backend connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="compose-page">

      <div className="welcome-section">
        <div>
          <h1>Compose Email</h1>
          <p>Create and send emails to multiple recipients.</p>
        </div>
      </div>

      <div className="compose-card">

        <div className="compose-heading">
          <div className="compose-heading-icon">
            <Mail size={23} />
          </div>

          <div>
            <h2>New Message</h2>
            <p>Fill in the details below to send your email.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Subject */}
          <div className="form-group">
            <label>
              <FileText size={17} />
              Email Subject
            </label>

            <input
              type="text"
              placeholder="Enter your email subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Recipients */}
          <div className="form-group">

            <label>
              <Users size={17} />
              Recipients

              <span className="recipient-count">
                {recipients.length} added
              </span>
            </label>

            <div className="recipient-input">

              <input
                type="email"
                placeholder="Enter recipient email"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ',') {
                    e.preventDefault();
                    addRecipient();
                  }
                }}
              />

              <button
                type="button"
                className="add-recipient-btn"
                onClick={addRecipient}
              >
                <Plus size={17} />
                Add
              </button>

            </div>

            <p className="input-hint">
              Press Enter or click Add to include an email address.
            </p>

            <div className="recipient-list">
              {recipients.map((email) => (
                <div className="recipient-tag" key={email}>
                  <span>{email}</span>

                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    aria-label={`Remove ${email}`}
                  >
                    <X size={15} />
                  </button>
                </div>
              ))}
            </div>

          </div>

          {/* Email Body */}
          <div className="form-group">

            <label>
              <Mail size={17} />
              Email Message
            </label>

            <textarea
              rows="9"
              maxLength="5000"
              placeholder="Write your email message here..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />

            <div className="character-count">
              {body.length}/5000 characters
            </div>

          </div>

          {/* Status Message */}
          {message && (
            <div className="form-message" role="status">
              {message}
            </div>
          )}

          {/* Buttons */}
          <div className="compose-actions">

            <button
              type="button"
              className="clear-btn"
              disabled={loading}
              onClick={() => {
                setSubject('');
                setBody('');
                setRecipients([]);
                setRecipientInput('');
                setMessage('');
              }}
            >
              Clear Form
            </button>

            <button
              type="submit"
              className="primary-btn"
              disabled={loading}
            >
              <Send size={17} />
              {loading ? 'Sending...' : 'Send Email'}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ComposeEmail;
