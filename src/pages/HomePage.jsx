import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif',
            paddingTop: '80px'
        }}>
            {/* Hero Section */}
            <div style={{
                maxWidth: '900px',
                margin: '0 auto',
                padding: '80px 24px 60px',
                textAlign: 'center'
            }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    marginBottom: '16px',
                    background: 'linear-gradient(90deg, #667eea, #764ba2)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    Welcome Home
                </h1>
                <p style={{
                    fontSize: '1.25rem',
                    color: '#94a3b8',
                    marginBottom: '48px',
                    lineHeight: 1.6
                }}>
                    Static homepage for flow testing — choose a landing page version below.
                </p>
            </div>

            {/* Navigation Cards */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 24px 80px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '24px'
            }}>
                {/* New LP Card */}
                <Link to="/new-lp" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '32px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '12px'
                        }}>✨</div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#fff',
                            marginBottom: '8px'
                        }}>New Landing Page</h2>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                        }}>
                            Latest design with CallToAction, SVG overlays, and refined animations.
                        </p>
                        <div style={{
                            marginTop: '16px',
                            color: '#667eea',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            Visit /new-lp →
                        </div>
                    </div>
                </Link>

                {/* Old LP Card */}
                <Link to="/old-lp" style={{ textDecoration: 'none' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        padding: '32px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.borderColor = '#764ba2';
                            e.currentTarget.style.transform = 'translateY(-4px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{
                            fontSize: '2rem',
                            marginBottom: '12px'
                        }}>📸</div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: '#fff',
                            marginBottom: '8px'
                        }}>Old Landing Page</h2>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                        }}>
                            Snapshot from the "pricing 2.0" commit with MorphingCTA and skip-animation toggle.
                        </p>
                        <div style={{
                            marginTop: '16px',
                            color: '#764ba2',
                            fontWeight: 600,
                            fontSize: '0.9rem'
                        }}>
                            Visit /old-lp →
                        </div>
                    </div>
                </Link>
            </div>

            {/* Quick Links */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '0 24px 80px',
                textAlign: 'center'
            }}>
                <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    marginBottom: '20px'
                }}>Quick Links</h3>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '12px',
                    justifyContent: 'center'
                }}>
                    {[
                        { to: '/login', label: 'Login' },
                        { to: '/register', label: 'Register' },
                        { to: '/dashboard', label: 'Dashboard' },
                        { to: '/resources', label: 'Resources' },
                        { to: '/partners', label: 'Partners' },
                        { to: '/pitch-hub', label: 'Pitch Hub' },
                    ].map(link => (
                        <Link key={link.to} to={link.to} style={{
                            padding: '8px 20px',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.15)',
                            color: '#cbd5e1',
                            textDecoration: 'none',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s ease'
                        }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#667eea';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                                e.currentTarget.style.color = '#cbd5e1';
                            }}
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
