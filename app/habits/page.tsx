'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Form, Alert, Badge } from 'react-bootstrap';

interface Habit {
  id: number;
  name: string;
  description: string;
  frequency: string;
  createdAt: string;
  completedDays: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [newHabitFrequency, setNewHabitFrequency] = useState('daily');

  useEffect(() => {
    const savedHabits = localStorage.getItem('habits');
    if (savedHabits) {
      setHabits(JSON.parse(savedHabits));
    }
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits));
    }
  }, [habits]);

  const addHabit = () => {
    if (newHabitName.trim() === '') {
      alert('Nama habit tidak boleh kosong!');
      return;
    }

    const newHabit: Habit = {
      id: Date.now(),
      name: newHabitName,
      description: newHabitDescription,
      frequency: newHabitFrequency,
      createdAt: new Date().toLocaleDateString('id-ID'),
      completedDays: 0,
    };

    setHabits([...habits, newHabit]);
    setNewHabitName('');
    setNewHabitDescription('');
    setNewHabitFrequency('daily');
  };

  const deleteHabit = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
      const updatedHabits = habits.filter(habit => habit.id !== id);
      setHabits(updatedHabits);
      
      if (updatedHabits.length === 0) {
        localStorage.removeItem('habits');
      } else {
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
      }
    }
  };

  const getCardColor = (index: number) => {
    const colors = ['card-pink', 'card-purple', 'card-yellow', 'card-blue'];
    return colors[index % colors.length];
  };

  const getBadgeColor = (frequency: string) => {
    switch(frequency) {
      case 'daily': return 'badge-pink';
      case 'weekly': return 'badge-purple';
      case 'monthly': return 'badge-yellow';
      default: return 'badge-pink';
    }
  };

  const totalHabits = habits.length;
  const totalCompletedDays = habits.reduce((sum, habit) => sum + habit.completedDays, 0);
  const avgCompletedDays = totalHabits > 0 ? Math.round(totalCompletedDays / totalHabits) : 0;

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <i className="bi bi-stars text-pink me-3" style={{ fontSize: '48px' }}></i>
            <div>
              <h1 className="text-pink fw-bold mb-1">My Habit Dashboard</h1>
              <p className="text-muted mb-0">Kelola dan track semua habit kamu di sini!</p>
            </div>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)' }}>
            <i className="bi bi-heart-fill" style={{ fontSize: '40px' }}></i>
            <div className="stat-number">{totalHabits}</div>
            <div>Total Habits</div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #C77DFF 0%, #9D4EDD 100%)' }}>
            <i className="bi bi-calendar-check-fill" style={{ fontSize: '40px' }}></i>
            <div className="stat-number">{totalCompletedDays}</div>
            <div>Days Completed</div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #FFD98E 0%, #FFC857 100%)' }}>
            <i className="bi bi-trophy-fill" style={{ fontSize: '40px' }}></i>
            <div className="stat-number">{avgCompletedDays}</div>
            <div>Average Streak</div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={5} className="mb-4">
          <Card className="card-pink border-0 shadow-lg" style={{ borderRadius: '25px' }}>
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-4">
                <div style={{ 
                  width: '50px', 
                  height: '50px', 
                  borderRadius: '15px',
                  background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px'
                }}>
                  <i className="bi bi-plus-lg text-white" style={{ fontSize: '24px' }}></i>
                </div>
                <div>
                  <h4 className="text-pink fw-bold mb-0">Tambah Habit Baru</h4>
                  <small className="text-muted">Buat habit baru untuk dicapai</small>
                </div>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-pink">
                    <i className="bi bi-tag-fill me-2"></i>
                    Nama Habit
                  </Form.Label>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="Contoh: Olahraga pagi"
                    value={newHabitName}
                    onChange={(e) => setNewHabitName(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold text-pink">
                    <i className="bi bi-text-paragraph me-2"></i>
                    Deskripsi
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Ceritakan tentang habit ini..."
                    value={newHabitDescription}
                    onChange={(e) => setNewHabitDescription(e.target.value)}
                  />
                </Form.Group>
              </Form>
              
              <Button size="lg" className="btn-pink w-100" onClick={addHabit}>
                <i className="bi bi-plus-circle-fill me-2"></i>
                Tambah Habit
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <div className="mb-3">
            <h4 className="text-pink fw-bold">
              <i className="bi bi-list-ul me-2"></i>
              Daftar Habits ({habits.length})
            </h4>
          </div>

          {habits.length === 0 ? (
            <Alert className="card-purple border-0 shadow" style={{ borderRadius: '20px' }}>
              <div className="text-center p-4">
                <i className="bi bi-inbox" style={{ fontSize: '64px', color: '#C77DFF' }}></i>
                <h5 className="mt-3 mb-2" style={{ color: '#9D4EDD' }}>Belum Ada Habit</h5>
                <p className="mb-0 text-muted">Mulai tambahkan habit pertama kamu menggunakan form di sebelah kiri!</p>
              </div>
            </Alert>
          ) : (
            <Row>
              {habits.map((habit, index) => (
                <Col key={habit.id} md={6} className="mb-3">
                  <Card className={`${getCardColor(index)} border-0 shadow h-100`}>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="text-pink fw-bold mb-0">{habit.name}</h5>
                      </div>
                      
                      <p className="text-muted mb-3" style={{ fontSize: '14px' }}>
                        {habit.description || 'Tidak ada deskripsi'}
                      </p>

                      <div className="d-flex align-items-center mb-3 p-2 rounded" style={{ background: 'rgba(255,255,255,0.5)' }}>
                        <i className="bi bi-fire text-danger me-2" style={{ fontSize: '20px' }}></i>
                        <div>
                          <small className="text-muted d-block" style={{ fontSize: '11px' }}>Streak</small>
                          <strong style={{ fontSize: '16px', color: '#FF1493' }}>{habit.completedDays} hari</strong>
                        </div>
                      </div>

                      <div className="d-grid gap-2">
                        <Link href={`/habits/${habit.id}`}>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="w-100"
                            style={{ borderRadius: '15px', borderColor: '#FF69B4', color: '#FF1493' }}
                          >
                            <i className="bi bi-eye-fill me-2"></i>
                            Lihat Detail
                          </Button>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => deleteHabit(habit.id)}
                          style={{ borderRadius: '15px', borderColor: '#FF69B4', color: '#FF1493' }}
                        >
                          <i className="bi bi-trash-fill me-2"></i>
                          Hapus
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Col>
      </Row>
    </Container>
  );
}