-- Migration: Create booking module tables
-- Up

-- Booking Services
CREATE TABLE IF NOT EXISTS booking_services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INTEGER NOT NULL,
  duration_unit VARCHAR(20) DEFAULT 'minutes' CHECK (duration_unit IN ('minutes', 'hours', 'days')),
  price NUMERIC(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  category VARCHAR(100),
  color VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  buffer_time INTEGER,
  max_participants INTEGER,
  requires_approval BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_booking_services_workspace ON booking_services(workspace_id);
CREATE INDEX IF NOT EXISTS idx_booking_services_category ON booking_services(category);
CREATE INDEX IF NOT EXISTS idx_booking_services_active ON booking_services(is_active);

-- Trigger for booking_services
CREATE TRIGGER update_booking_services_updated_at
  BEFORE UPDATE ON booking_services
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Booking Staff/Providers
CREATE TABLE IF NOT EXISTS booking_staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  bio TEXT,
  avatar_url TEXT,
  services UUID[],
  working_hours JSONB DEFAULT '{}'::jsonb,
  timezone VARCHAR(50) DEFAULT 'UTC',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_staff_workspace ON booking_staff(workspace_id);
CREATE INDEX IF NOT EXISTS idx_booking_staff_user ON booking_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_staff_active ON booking_staff(is_active);

-- Trigger for booking_staff
CREATE TRIGGER update_booking_staff_updated_at
  BEFORE UPDATE ON booking_staff
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Booking Availability
CREATE TABLE IF NOT EXISTS booking_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id UUID NOT NULL REFERENCES booking_staff(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(staff_id, day_of_week, date)
);

CREATE INDEX IF NOT EXISTS idx_booking_availability_staff ON booking_availability(staff_id);
CREATE INDEX IF NOT EXISTS idx_booking_availability_workspace ON booking_availability(workspace_id);
CREATE INDEX IF NOT EXISTS idx_booking_availability_date ON booking_availability(date);

-- Trigger for booking_availability
CREATE TRIGGER update_booking_availability_updated_at
  BEFORE UPDATE ON booking_availability
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Booking Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES booking_services(id) ON DELETE CASCADE,
  staff_id UUID REFERENCES booking_staff(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER,
  status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed', 'no-show', 'rescheduled')),
  notes TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  location TEXT,
  is_online BOOLEAN DEFAULT FALSE,
  meeting_link TEXT,
  price NUMERIC(10, 2),
  currency VARCHAR(10) DEFAULT 'USD',
  payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed', NULL)),
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_appointments_workspace ON appointments(workspace_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_staff ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_customer ON appointments(customer_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);

-- Trigger for appointments
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Booking Holidays/Blackout Dates
CREATE TABLE IF NOT EXISTS booking_holidays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  end_date DATE,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_pattern VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_booking_holidays_workspace ON booking_holidays(workspace_id);
CREATE INDEX IF NOT EXISTS idx_booking_holidays_date ON booking_holidays(date);

-- Trigger for booking_holidays
CREATE TRIGGER update_booking_holidays_updated_at
  BEFORE UPDATE ON booking_holidays
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Booking Settings
CREATE TABLE IF NOT EXISTS booking_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  setting_key VARCHAR(255) NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(workspace_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_booking_settings_workspace ON booking_settings(workspace_id);

-- Trigger for booking_settings
CREATE TRIGGER update_booking_settings_updated_at
  BEFORE UPDATE ON booking_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
