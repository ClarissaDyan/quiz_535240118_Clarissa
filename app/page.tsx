'use client';

import Link from 'next/link';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

export default function Home() {
  return (
   <Container fluid className="p-4">
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', background: '#fff5f7' }}>
            <Card.Body className="p-5 text-center">
              <h1 style={{ fontSize: '42px', fontWeight: '700', color: '#ff85a8', marginBottom: '10px' }}>
                Quiz Front End
              </h1>
              <h2 style={{ fontSize: '28px', color: '#ff6b94', marginBottom: '15px' }}>
                Daily Habit Tracker Dashboard
              </h2>
              <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
                Lacak kebiasaan harian Anda dengan mudah dan menyenangkan! 
                Bangun rutinitas yang lebih baik setiap hari.
              </p>
              <Link href="/habits">
                <Button className="btn-primary">
                  <i className="bi bi-rocket-takeoff me-2"></i>
                  Mulai Sekarang
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm" style={{ borderRadius: '15px', background: '#fff5f7' }}>
            <Card.Body className="p-3 text-center">
              <p style={{ fontSize: '16px', color: '#666', margin: 0 }}>
                Made by: <strong style={{ color: '#ff85a8' }}>Clarissa Dyan Widjaja</strong> - <strong style={{ color: '#ff85a8' }}>535240118</strong> - <strong style={{ color: '#ff85a8' }}>Daily Habit Tracker</strong>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}