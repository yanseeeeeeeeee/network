import React, {useState} from 'react';

export default function AdminPush() {
  const [secret, setSecret] = useState('');
  const [title, setTitle] = useState('Проверка');
  const [message, setMessage] = useState('Пуш с сайта работает');
  const [status, setStatus] = useState('');

  const sendPush = async () => {
    setStatus('Отправка...');

    try {
      const response = await fetch('/api/send-push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-push-secret': secret.trim(),
        },
        body: JSON.stringify({
          userId: 'default-user',
          title: title.trim(),
          message: message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setStatus(`Ошибка: ${data.error || 'неизвестная ошибка'}`);
        return;
      }

      setStatus('Уведомление отправлено');
    } catch (error) {
      setStatus(`Ошибка: ${error.message}`);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Отправка push</h1>

        <label style={styles.label}>PUSH_SECRET</label>
        <input
          style={styles.input}
          type="password"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          placeholder="Введи secret из Vercel"
        />

        <label style={styles.label}>Заголовок</label>
        <input
          style={styles.input}
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Заголовок уведомления"
        />

        <label style={styles.label}>Сообщение</label>
        <textarea
          style={styles.textarea}
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Текст уведомления"
        />

        <button style={styles.button} onClick={sendPush}>
          Отправить уведомление
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#111827',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#1f2937',
    borderRadius: 16,
    padding: 24,
    color: 'white',
    boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
  },
  title: {
    marginTop: 0,
    marginBottom: 20,
    fontSize: 26,
  },
  label: {
    display: 'block',
    marginBottom: 6,
    marginTop: 14,
    color: '#d1d5db',
  },
  input: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 12,
    borderRadius: 10,
    border: '1px solid #374151',
    background: '#111827',
    color: 'white',
    fontSize: 15,
  },
  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    minHeight: 100,
    padding: 12,
    borderRadius: 10,
    border: '1px solid #374151',
    background: '#111827',
    color: 'white',
    fontSize: 15,
    resize: 'vertical',
  },
  button: {
    width: '100%',
    marginTop: 20,
    padding: 14,
    borderRadius: 10,
    border: 'none',
    background: '#2563eb',
    color: 'white',
    fontSize: 16,
    cursor: 'pointer',
  },
  status: {
    marginTop: 16,
    color: '#93c5fd',
  },
};