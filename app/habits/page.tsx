'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Container, Row, Col, Card, Button, Form, Alert, Modal } from 'react-bootstrap';

interface Habit {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  completedDays: number;
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [newHabitDescription, setNewHabitDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHabit, setEditHabit] = useState<Habit | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const fetchHabits = async () => {
    try {
      setFetchError(null);
      console.log('Fetching habits from /api/habits...');
      
      const response = await fetch('/api/habits', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched habits:', data);
      setHabits(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('Error fetching habits:', error);
      setFetchError(error.message || 'Gagal mengambil data habits');
      setHabits([]);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const addHabit = async () => {
    if (newHabitName.trim() === '') {
      alert('Nama habit tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      console.log('Creating habit:', { name: newHabitName, description: newHabitDescription });
      
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newHabitName,
          description: newHabitDescription,
        })
      });

      console.log('Create response status:', response.status);

      if (response.ok) {
        const newHabit = await response.json();
        console.log('Created habit:', newHabit);
        setNewHabitName('');
        setNewHabitDescription('');
        await fetchHabits(); 
        alert('✅ Habit berhasil ditambahkan!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Gagal menambahkan habit: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error adding habit:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const deleteHabit = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus habit ini?')) {
      return;
    }

    try {
      console.log('Deleting habit:', id);
      
      const response = await fetch(`/api/habits/${id}`, {
        method: 'DELETE'
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        await fetchHabits(); 
        alert('✅ Habit berhasil dihapus!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Gagal menghapus habit: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error deleting habit:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    }
  };

  const openEditModal = (habit: Habit) => {
    setEditHabit(habit);
    setEditName(habit.name);
    setEditDescription(habit.description || '');
    setShowEditModal(true);
  };

  const saveEdit = async () => {
    if (!editHabit || editName.trim() === '') {
      alert('Nama habit tidak boleh kosong!');
      return;
    }

    setLoading(true);
    try {
      console.log('Updating habit:', editHabit.id, { name: editName, description: editDescription });
      
      const response = await fetch(`/api/habits/${editHabit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
        })
      });

      console.log('Update response status:', response.status);

      if (response.ok) {
        setShowEditModal(false);
        await fetchHabits(); 
        alert('✅ Habit berhasil diupdate!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Gagal mengupdate habit: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error updating habit:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getCardColor = (index: number) => {
    const colors = ['card-pink', 'card-purple', 'card-yellow', 'card-blue'];
    return colors[index % colors.length];
  };

  const totalHabits = habits.length;
  const totalCompletedDays = habits.reduce((sum, habit) => sum + habit.completedDays, 0);
  const avgCompletedDays = totalHabits > 0 ? Math.round(totalCompletedDays / totalHabits) : 0;

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center">
            <i className="bi bi-stars text-pink me-3" style={{ fontSize: '48px', color: '#ff85a8' }}></i>
            <div>
              <h1 style={{ color: '#ff85a8', fontWeight: 'bold', marginBottom: '5px' }}>My Habit Dashboard</h1>
              <p className="text-muted mb-0">Kelola dan track semua habit kamu di sini!</p>
            </div>
          </div>
        </Col>
      </Row>

      {fetchError && (
        <Alert variant="danger" className="mb-4">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Error:</strong> {fetchError}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={fetchHabits}>
              <i className="bi bi-arrow-clockwise me-1"></i>
              Coba Lagi
            </Button>
          </div>
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center p-4" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #FF69B4 0%, #FF1493 100%)', color: 'white', minHeight: '150px' }}>
            <i className="bi bi-heart-fill" style={{ fontSize: '40px' }}></i>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{totalHabits}</div>
            <div style={{ fontSize: '16px' }}>Total Habits</div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center p-4" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #C77DFF 0%, #9D4EDD 100%)', color: 'white', minHeight: '150px' }}>
            <i className="bi bi-calendar-check-fill" style={{ fontSize: '40px' }}></i>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{totalCompletedDays}</div>
            <div style={{ fontSize: '16px' }}>Days Completed</div>
          </div>
        </Col>
        <Col lg={4} md={6} className="mb-3">
          <div className="stat-card d-flex flex-column align-items-center justify-content-center p-4" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #FFD98E 0%, #FFC857 100%)', color: 'white', minHeight: '150px' }}>
            <i className="bi bi-trophy-fill" style={{ fontSize: '40px' }}></i>
            <div style={{ fontSize: '36px', fontWeight: 'bold', margin: '10px 0' }}>{avgCompletedDays}</div>
            <div style={{ fontSize: '16px' }}>Average Streak</div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={5} className="mb-4">
          <Card className="border-0 shadow-lg" style={{ borderRadius: '25px', background: '#FFF0F5' }}>
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
                  <h4 style={{ color: '#ff85a8', fontWeight: 'bold', marginBottom: 0 }}>Tambah Habit Baru</h4>
                  <small className="text-muted">Buat habit baru untuk dicapai</small>
                </div>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontWeight: 'bold', color: '#ff85a8' }}>
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
                  <Form.Label style={{ fontWeight: 'bold', color: '#ff85a8' }}>
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
              
              <Button 
                size="lg" 
                className="w-100" 
                onClick={addHabit}
                disabled={loading}
                style={{ 
                  backgroundColor: '#ff85a8', 
                  border: 'none',
                  borderRadius: '10px'
                }}
              >
                <i className="bi bi-plus-circle-fill me-2"></i>
                {loading ? 'Menyimpan...' : 'Tambah Habit'}
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          <div className="mb-3">
            <h4 style={{ color: '#ff85a8', fontWeight: 'bold' }}>
              <i className="bi bi-list-ul me-2"></i>
              Daftar Habits ({habits.length})
            </h4>
          </div>

          {habits.length === 0 && !fetchError ? (
            <Alert className="border-0 shadow" style={{ borderRadius: '20px', background: '#E6D5FF' }}>
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
                  <Card className="border-0 shadow h-100" style={{ borderRadius: '20px', background: '#FFF0F5' }}>
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 style={{ color: '#ff85a8', fontWeight: 'bold', marginBottom: 0 }}>{habit.name}</h5>
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
                          variant="outline-warning"
                          size="sm"
                          className="w-100"
                          onClick={() => openEditModal(habit)}
                          style={{ borderRadius: '15px', borderColor: '#FFD98E', color: '#D4A04C' }}
                        >
                          <i className="bi bi-pencil-fill me-2"></i>
                          Edit
                        </Button>
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

      {/* Modal Edit */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton style={{ background: '#FFF0F5', borderBottom: '2px solid #FFB6D9' }}>
          <Modal.Title style={{ color: '#ff85a8', fontWeight: 'bold' }}>
            <i className="bi bi-pencil-square me-2"></i>
            Edit Habit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#FFF0F5' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#ff85a8' }}>
                <i className="bi bi-tag-fill me-2"></i>
                Nama Habit
              </Form.Label>
              <Form.Control
                type="text"
                size="lg"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontWeight: 'bold', color: '#ff85a8' }}>
                <i className="bi bi-text-paragraph me-2"></i>
                Deskripsi
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: '#FFF0F5', borderTop: '2px solid #FFB6D9' }}>
          <Button 
            variant="secondary" 
            onClick={() => setShowEditModal(false)}
            style={{ borderRadius: '15px' }}
          >
            Batal
          </Button>
          <Button 
            onClick={saveEdit} 
            disabled={loading}
            style={{ 
              borderRadius: '15px',
              backgroundColor: '#ff85a8',
              border: 'none'
            }}
          >
            <i className="bi bi-check-circle-fill me-2"></i>
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}