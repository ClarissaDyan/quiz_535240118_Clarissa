'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Alert, Badge, Table} from 'react-bootstrap';

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
  completedDays: number;
}

export default function HabitDetailPage() {
  const params = useParams();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const habits: Habit[] = JSON.parse(savedHabits);
      const foundHabit = habits.find(h => h.id === Number(params.id));
      
      if (foundHabit) {
        setHabit(foundHabit);
      }
    }
    setLoading(false);
  }, [params.id]);

  const markAsCompleted = () => {
    if (!habit) return;

    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      const habits: Habit[] = JSON.parse(savedHabits);
      const updatedHabits = habits.map(h => {
        if (h.id === habit.id) {
          return { ...h, completedDays: h.completedDays + 1 };
        }
        return h;
      });
      
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      setHabit({ ...habit, completedDays: habit.completedDays + 1 });
      
      alert('🎉 Selamat! Habit berhasil diselesaikan hari ini!');
    }
  };

  const resetProgress = () => {
    if (!habit) return;

    if (confirm('Apakah Anda yakin ingin reset progress?')) {
      const savedHabits = localStorage.getItem('habits');
      if (savedHabits) {
        const habits: Habit[] = JSON.parse(savedHabits);
        const updatedHabits = habits.map(h => {
          if (h.id === habit.id) {
            return { ...h, completedDays: 0 };
          }
          return h;
        });
        
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        setHabit({ ...habit, completedDays: 0 });
      }
    }
  };

  if (!habit) {
    return (
      <Container fluid className="p-4">
        <Alert variant="danger" className="card-pink border-0 shadow" style={{ borderRadius: '25px' }}>
          <div className="text-center p-4">
            <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '64px', color: '#FF1493' }}></i>
            <h4 className="text-pink mt-3 mb-2">Habit Tidak Ditemukan</h4>
            <p className="text-muted">Habit dengan ID tersebut tidak ada di sistem.</p>
            <Link href="/habits">
              <Button className="btn-pink mt-3">
                <i className="bi bi-arrow-left me-2"></i>
                Kembali ke Dashboard
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  const progressToGoal = Math.min((habit.completedDays / 21) * 100, 100);

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <Link href="/habits">
          <Button 
            variant="outline-secondary" 
            style={{ borderRadius: '15px', borderColor: '#FFB6D9', color: '#FF1493' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      <Row className="mb-4">
        <Col>
          <Card 
            className="border-0 shadow-lg" 
            style={{ 
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
              color: 'white'
            }}
          >
            <Card.Body className="p-5">
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-3">
                    <div style={{ fontSize: '48px', marginRight: '20px' }}>✨</div>
                    <div>
                      <h1 className="fw-bold mb-2">{habit.name}</h1>
                      <p className="mb-0" style={{ fontSize: '18px', opacity: 0.9 }}>
                        {habit.description || 'Tidak ada deskripsi'}
                      </p>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="text-center">
                  <div style={{ 
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '20px',
                    padding: '20px'
                  }}>
                    <div style={{ fontSize: '48px', fontWeight: 'bold' }}>
                      {habit.completedDays}
                    </div>
                    <div style={{ fontSize: '16px' }}>Hari Berhasil</div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mb-4">
          <Card className="card-purple border-0 shadow mb-4" style={{ borderRadius: '25px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4" style={{ color: '#9D4EDD' }}>
                <i className="bi bi-info-circle-fill me-2"></i>
                Informasi Habit
              </h5>
              
              <Table borderless className="mb-0">
                <tbody>
                  <tr>
                    <td>
                      <Badge bg="" className="badge-purple">
                        {habit.frequency === 'daily' ? 'Setiap Hari' : 
                         habit.frequency === 'weekly' ? 'Setiap Minggu' : 
                         'Setiap Bulan'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold" style={{ color: '#9D4EDD' }}>
                      <i className="bi bi-calendar-plus me-2"></i>
                      Dibuat pada
                    </td>
                    <td>{habit.createdAt}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold" style={{ color: '#9D4EDD' }}>
                      <i className="bi bi-fire me-2"></i>
                      Streak Saat Ini
                    </td>
                    <td>
                      <Badge bg="danger" className="fs-6">
                        🔥 {habit.completedDays} hari
                      </Badge>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card 
            className="border-0 shadow-lg mb-4" 
            style={{ 
              borderRadius: '25px',
              background: 'linear-gradient(135deg, #FFF0F5 0%, #FFE4E9 100%)'
            }}
          >
            <Card.Body className="text-center p-5">
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>
                {habit.completedDays >= 21 ? '🏆' : habit.completedDays >= 7 ? '🌟' : '💪'}
              </div>
              <div style={{ fontSize: '72px', fontWeight: 'bold', color: '#FF1493', marginBottom: '10px' }}>
                {habit.completedDays}
              </div>
              <p className="lead fw-bold text-pink mb-4">Hari Berhasil Diselesaikan</p>
              
              {habit.completedDays >= 21 && (
                <Alert variant="success" className="border-0 shadow-sm">
                  <i className="bi bi-trophy-fill me-2"></i>
                  <strong>Achievement Unlocked!</strong> Kamu sudah konsisten 21 hari!
                </Alert>
              )}
              
              {habit.completedDays >= 7 && habit.completedDays < 21 && (
                <Alert variant="info" className="border-0 shadow-sm" style={{ background: '#E6B0FF', border: 'none' }}>
                  <i className="bi bi-star-fill me-2"></i>
                  <strong>Keep Going!</strong> Kamu sudah 1 minggu konsisten!
                </Alert>
              )}

              {habit.completedDays < 7 && habit.completedDays > 0 && (
                <Alert variant="" className="card-blue border-0 shadow-sm">
                  <i className="bi bi-emoji-smile-fill me-2"></i>
                  <strong>Great Start!</strong> Terus pertahankan ya!
                </Alert>
              )}
            </Card.Body>
          </Card>

          <Card className="card-pink border-0 shadow" style={{ borderRadius: '25px' }}>
            <Card.Body className="p-4">
              <h5 className="text-pink fw-bold mb-4">
                <i className="bi bi-lightning-charge-fill me-2"></i>
                Actions
              </h5>
              <div className="d-grid gap-3">
                <Button 
                  size="lg"
                  onClick={markAsCompleted}
                  style={{
                    background: 'linear-gradient(135deg, #4CAF50 0%, #45A049 100%)',
                    border: 'none',
                    borderRadius: '15px',
                    color: 'white',
                    padding: '15px',
                    fontWeight: 'bold'
                  }}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Tandai Selesai Hari Ini
                </Button>
                <Button 
                  variant="outline-warning"
                  size="lg"
                  onClick={resetProgress}
                  style={{
                    borderRadius: '15px',
                    borderWidth: '2px',
                    padding: '15px',
                    fontWeight: 'bold'
                  }}
                >
                  <i className="bi bi-arrow-clockwise me-2"></i>
                  Reset Progress
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}