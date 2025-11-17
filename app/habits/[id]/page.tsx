'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Alert,
  Badge,
  Table,
} from 'react-bootstrap';

interface Habit {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  completedDays: number;
}

export default function HabitDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchHabit = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      console.log('Fetching habit with ID:', id);
      
      const res = await fetch(`/api/habits/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('Response status:', res.status);

      if (res.status === 404) {
        setNotFound(true);
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || 'Gagal mengambil data habit');
      }

      const data: Habit = await res.json();
      console.log('Fetched habit:', data);
      setHabit(data);
    } catch (err: any) {
      console.error('Error fetching habit:', err);
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabit();
  }, [id]);

  // Fungsi untuk increment completedDays
  const completeToday = async () => {
    if (!habit) return;

    if (!confirm('Tandai habit ini sebagai selesai hari ini?')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: habit.name,
          description: habit.description,
          completedDays: habit.completedDays + 1,
        })
      });

      if (response.ok) {
        await fetchHabit(); // Refresh data
        alert('✅ Habit berhasil diselesaikan untuk hari ini!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Gagal menandai habit: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error completing habit:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  // Fungsi untuk reset streak
  const resetStreak = async () => {
    if (!habit) return;

    if (!confirm('Yakin ingin reset streak ke 0?')) {
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(`/api/habits/${habit.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: habit.name,
          description: habit.description,
          completedDays: 0,
        })
      });

      if (response.ok) {
        await fetchHabit(); // Refresh data
        alert('✅ Streak berhasil direset ke 0');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert(`❌ Gagal reset streak: ${errorData.error}`);
      }
    } catch (error: any) {
      console.error('Error resetting streak:', error);
      alert(`❌ Terjadi kesalahan: ${error.message}`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <Container fluid className="p-4">
        <p>Memuat data habit...</p>
      </Container>
    );
  }

  if (notFound || !habit) {
    return (
      <Container fluid className="p-4">
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Card
              className="text-center"
              style={{
                borderRadius: '25px',
                border: 'none',
                background: '#FFD1E8',
                padding: '40px',
              }}
            >
              <Card.Body>
                <div
                  style={{
                    fontSize: '50px',
                    color: '#FF1493',
                    marginBottom: '20px',
                  }}
                >
                  <i className="bi bi-exclamation-triangle-fill" />
                </div>
                <Card.Title
                  style={{
                    fontSize: '28px',
                    fontWeight: 700,
                    marginBottom: '10px',
                  }}
                >
                  Habit Tidak Ditemukan
                </Card.Title>
                <Card.Text style={{ fontSize: '16px', color: '#555' }}>
                  Habit dengan ID tersebut tidak ada di sistem.
                </Card.Text>
                <Link href="/habits">
                  <Button
                    style={{
                      marginTop: '20px',
                      padding: '12px 24px',
                      borderRadius: '30px',
                      backgroundColor: '#FF69B4',
                      border: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    ← Kembali ke Dashboard
                  </Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      <div className="mb-4">
        <Link href="/habits">
          <Button
            variant="outline-secondary"
            style={{
              borderRadius: '15px',
              borderColor: '#FFB6D9',
              color: '#FF1493',
            }}
          >
            <i className="bi bi-arrow-left me-2" />
            Kembali ke Dashboard
          </Button>
        </Link>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Row>
        <Col md={8}>
          <Card
            style={{
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <Card.Title
                    style={{ fontSize: '26px', fontWeight: 'bold' }}
                  >
                    {habit.name}
                  </Card.Title>
                  <Card.Subtitle style={{ color: '#888' }}>
                    Dibuat pada{' '}
                    {new Date(habit.createdAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Card.Subtitle>
                </div>

                <Badge
                  bg="info"
                  pill
                  style={{
                    fontSize: '14px',
                    padding: '8px 14px',
                    backgroundColor: '#FFB6D9',
                    color: '#880E4F',
                  }}
                >
                  {habit.completedDays} hari tercapai
                </Badge>
              </div>

              <Card.Text style={{ fontSize: '16px', marginTop: '15px' }}>
                {habit.description || (
                  <span style={{ color: '#999' }}>
                    Tidak ada deskripsi.
                  </span>
                )}
              </Card.Text>

              <hr />

              {/* Action Buttons */}
              <div className="d-grid gap-2 mt-4">
                <Button
                  variant="success"
                  size="lg"
                  onClick={completeToday}
                  disabled={actionLoading}
                >
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {actionLoading ? 'Menyimpan...' : 'Selesai Hari Ini'}
                </Button>

                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={resetStreak}
                  disabled={actionLoading}
                >
                  <i className="bi bi-arrow-counterclockwise me-2"></i>
                  Reset Streak
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card
            style={{
              borderRadius: '20px',
              border: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
            }}
          >
            <Card.Body>
              <Card.Title
                style={{ fontWeight: 'bold', marginBottom: '15px' }}
              >
                Progress Singkat
              </Card.Title>
              <Table borderless responsive>
                <tbody>
                  <tr>
                    <td>Total hari tercapai</td>
                    <td className="text-end">
                      <strong>{habit.completedDays}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>ID Habit</td>
                    <td className="text-end">
                      <strong>{habit.id}</strong>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}