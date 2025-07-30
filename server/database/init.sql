-- CoinKrazy Database Schema
-- This script initializes the complete database schema for the CoinKrazy platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'staff', 'moderator')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_verification')),
    kyc_status VARCHAR(20) DEFAULT 'none' CHECK (kyc_status IN ('none', 'pending', 'approved', 'rejected')),
    password_hash VARCHAR(255),
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"theme": "dark", "notifications_enabled": true, "sound_enabled": true, "auto_play_enabled": false, "currency_preference": "GC", "language": "en", "timezone": "UTC"}',
    oauth_providers TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Wallets table
CREATE TABLE IF NOT EXISTS wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    gold_coins DECIMAL(15,2) DEFAULT 0.00,
    sweeps_coins DECIMAL(15,2) DEFAULT 0.00,
    total_deposits DECIMAL(15,2) DEFAULT 0.00,
    total_withdrawals DECIMAL(15,2) DEFAULT 0.00,
    pending_withdrawals DECIMAL(15,2) DEFAULT 0.00,
    last_transaction TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'win', 'bet', 'bonus', 'refund')),
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('GC', 'SC')),
    amount DECIMAL(15,2) NOT NULL,
    balance_before DECIMAL(15,2) NOT NULL,
    balance_after DECIMAL(15,2) NOT NULL,
    description TEXT,
    reference_id UUID,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('system', 'admin', 'staff', 'ai_assistant', 'user')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'promotion', 'alert')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    read BOOLEAN DEFAULT FALSE,
    action_url TEXT,
    action_label VARCHAR(100),
    expires_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_name VARCHAR(100) NOT NULL,
    sender_type VARCHAR(20) NOT NULL CHECK (sender_type IN ('user', 'admin', 'staff', 'ai_assistant', 'system')),
    message TEXT NOT NULL,
    reply_to UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    channel VARCHAR(20) DEFAULT 'global' CHECK (channel IN ('global', 'support', 'vip', 'admin')),
    is_private BOOLEAN DEFAULT FALSE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin alerts table
CREATE TABLE IF NOT EXISTS admin_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(30) NOT NULL CHECK (type IN ('approval_needed', 'security_alert', 'system_issue', 'financial_alert', 'user_report')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'resolved', 'dismissed')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    related_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    related_entity_type VARCHAR(50),
    related_entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Game sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    game_type VARCHAR(20) NOT NULL CHECK (game_type IN ('slot', 'table', 'poker', 'bingo', 'sportsbook')),
    game_id VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    end_time TIMESTAMP WITH TIME ZONE,
    total_bet DECIMAL(15,2) DEFAULT 0.00,
    total_win DECIMAL(15,2) DEFAULT 0.00,
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('GC', 'SC')),
    spins_count INTEGER DEFAULT 0,
    bonus_rounds INTEGER DEFAULT 0,
    max_win DECIMAL(15,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'abandoned')),
    metadata JSONB
);

-- Sports events table
CREATE TABLE IF NOT EXISTS sports_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sport VARCHAR(50) NOT NULL,
    league VARCHAR(100) NOT NULL,
    home_team VARCHAR(100) NOT NULL,
    away_team VARCHAR(100) NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished', 'cancelled', 'postponed')),
    home_score INTEGER DEFAULT 0,
    away_score INTEGER DEFAULT 0,
    odds JSONB NOT NULL,
    live_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sports markets table
CREATE TABLE IF NOT EXISTS sports_markets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES sports_events(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('moneyline', 'spread', 'total', 'prop')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'settled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sports options table
CREATE TABLE IF NOT EXISTS sports_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    market_id UUID REFERENCES sports_markets(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    odds DECIMAL(8,2) NOT NULL,
    line DECIMAL(8,2),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'won', 'lost', 'push'))
);

-- Sports bets table
CREATE TABLE IF NOT EXISTS sports_bets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES sports_events(id) ON DELETE RESTRICT,
    market_id UUID REFERENCES sports_markets(id) ON DELETE RESTRICT,
    option_id UUID REFERENCES sports_options(id) ON DELETE RESTRICT,
    stake DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) NOT NULL CHECK (currency IN ('GC', 'SC')),
    odds DECIMAL(8,2) NOT NULL,
    potential_win DECIMAL(15,2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void', 'cashed_out')),
    placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settled_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_chat_messages_channel ON chat_messages(channel);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_status ON admin_alerts(status);
CREATE INDEX IF NOT EXISTS idx_admin_alerts_priority ON admin_alerts(priority);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_game_type ON game_sessions(game_type);
CREATE INDEX IF NOT EXISTS idx_sports_events_status ON sports_events(status);
CREATE INDEX IF NOT EXISTS idx_sports_events_start_time ON sports_events(start_time);
CREATE INDEX IF NOT EXISTS idx_sports_bets_user_id ON sports_bets(user_id);
CREATE INDEX IF NOT EXISTS idx_sports_bets_status ON sports_bets(status);

-- Create triggers for updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sports_events_updated_at BEFORE UPDATE ON sports_events 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (
    email, 
    username, 
    first_name, 
    last_name, 
    role, 
    status, 
    kyc_status,
    password_hash,
    preferences
) VALUES (
    'admin@coinkrazy.com',
    'admin',
    'CoinKrazy',
    'Admin',
    'admin',
    'active',
    'approved',
    '$2b$10$defaulthashedpassword', -- In production, use proper bcrypt hash
    '{"theme": "dark", "notifications_enabled": true, "sound_enabled": true, "auto_play_enabled": false, "currency_preference": "SC", "language": "en", "timezone": "UTC"}'
) ON CONFLICT (email) DO NOTHING;

-- Create admin wallet
INSERT INTO wallets (
    user_id,
    gold_coins,
    sweeps_coins,
    total_deposits,
    total_withdrawals,
    pending_withdrawals,
    last_transaction
) SELECT 
    id,
    1000000.00,
    10000.00,
    0.00,
    0.00,
    0.00,
    NOW()
FROM users WHERE email = 'admin@coinkrazy.com'
ON CONFLICT DO NOTHING;

-- Create some sample notifications
INSERT INTO notifications (
    user_id,
    sender_type,
    title,
    message,
    type,
    priority
) SELECT 
    u.id,
    'system',
    'Welcome to CoinKrazy!',
    'Your admin account has been set up successfully. You now have access to all platform features.',
    'success',
    'high'
FROM users u WHERE u.email = 'admin@coinkrazy.com'
ON CONFLICT DO NOTHING;

-- Create sample admin alert
INSERT INTO admin_alerts (
    type,
    title,
    description,
    priority,
    status
) VALUES (
    'system_issue',
    'Database Initialized',
    'CoinKrazy database has been successfully initialized with all required tables and default data.',
    'medium',
    'resolved'
) ON CONFLICT DO NOTHING;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO coinkrazy_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO coinkrazy_user;
