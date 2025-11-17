import 'bootstrap/dist/css/bootstrap.min.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daily Habit Tracker',
  description: 'Track your daily habits and build better routines',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.11.3/font/bootstrap-icons.min.css"
        />
        <style>{`
          body {
            background-color: #ffe4e9;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 250px;
            background: linear-gradient(to bottom, #ff85a8, #ffb6c8);
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            z-index: 1000;
          }
          
          .sidebar-header {
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid rgba(255,255,255,0.3);
          }
          
          .sidebar-title {
            color: white;
            font-size: 22px;
            font-weight: 600;
            margin: 10px 0 5px 0;
          }
          
          .sidebar-subtitle {
            color: rgba(255,255,255,0.9);
            font-size: 13px;
            margin: 0;
          }
          
          .sidebar-menu {
            padding: 20px 0;
          }
          
          .sidebar-item {
            display: flex;
            align-items: center;
            padding: 14px 25px;
            color: white;
            text-decoration: none;
            transition: background 0.2s;
          }
          
          .sidebar-item:hover {
            background: rgba(255,255,255,0.2);
            color: white;
          }
          
          .sidebar-item i {
            font-size: 20px;
            margin-right: 12px;
            width: 20px;
          }
          
          .main-content {
            margin-left: 250px;
            min-height: 100vh;
            padding: 0;
          }
          
          .card {
            border-radius: 15px;
            border: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          }
          
          .btn-primary {
            background-color: #ff85a8;
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
          }
          
          .btn-primary:hover {
            background-color: #ff6b94;
          }
          
          .form-control, .form-select {
            border-radius: 8px;
            border: 1px solid #ddd;
            padding: 10px 15px;
          }
          
          .form-control:focus, .form-select:focus {
            border-color: #ff85a8;
            box-shadow: 0 0 0 0.15rem rgba(255, 133, 168, 0.25);
          }
          
          .badge {
            padding: 6px 12px;
            border-radius: 6px;
            font-weight: 500;
          }
        `}</style>
      </head>
      <body>
        <div className="sidebar">
          <div className="sidebar-header">
            <div style={{ fontSize: '40px' }}>📝</div>
            <h1 className="sidebar-title">Habit Tracker</h1>
            <p className="sidebar-subtitle">Track your daily habits</p>
          </div>
          
          <div className="sidebar-menu">
            <a href="/" className="sidebar-item">
              <i className="bi bi-house-door"></i>
              <span>Home</span>
            </a>
            <a href="/habits" className="sidebar-item">
              <i className="bi bi-list-check"></i>
              <span>My Habits</span>
            </a>
            <a href="/habits" className="sidebar-item">
              <i className="bi bi-plus-circle"></i>
              <span>Add Habit</span>
            </a>
          </div>
        </div>
        
        <div className="main-content">
          {children}
        </div>
      </body>
    </html>
  );
}