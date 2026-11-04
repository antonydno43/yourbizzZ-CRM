-- Migration: Create Row-Level Security (RLS) Policies
-- Up

-- Enable RLS on all tables

-- ============================================
-- USERS AND AUTHENTICATION
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- WORKSPACES
-- ============================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;

-- Users can see workspaces they own or are members of
CREATE POLICY "Users can view their workspaces"
  ON workspaces FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspaces.id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
    OR owner_id = auth.uid()
  );

-- Users can insert workspaces (they own)
CREATE POLICY "Users can create workspaces"
  ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- Users can update workspaces they own
CREATE POLICY "Users can update their workspaces"
  ON workspaces FOR UPDATE
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Users can delete workspaces they own
CREATE POLICY "Users can delete their workspaces"
  ON workspaces FOR DELETE
  USING (owner_id = auth.uid());

-- ============================================
-- WORKSPACE MEMBERS
-- ============================================
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;

-- Users can see their own workspace memberships
CREATE POLICY "Users can view their workspace memberships"
  ON workspace_members FOR SELECT
  USING (user_id = auth.uid() OR invited_by = auth.uid());

-- Users can invite members to workspaces they own
CREATE POLICY "Workspace owners can invite members"
  ON workspace_members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspaces 
      WHERE workspaces.id = workspace_id 
      AND workspaces.owner_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- Users can update their own membership
CREATE POLICY "Users can update their own membership"
  ON workspace_members FOR UPDATE
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM workspace_members wm
      WHERE wm.workspace_id = workspace_members.workspace_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- WEBSITES AND PAGES
-- ============================================
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Users can see websites in their workspaces
CREATE POLICY "Users can view websites in their workspaces"
  ON websites FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = websites.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
    OR owner_id = auth.uid()
  );

-- Users can create websites in their workspaces
CREATE POLICY "Users can create websites in their workspaces"
  ON websites FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
    OR owner_id = auth.uid()
  );

-- Users can update websites in their workspaces
CREATE POLICY "Users can update websites in their workspaces"
  ON websites FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
    OR owner_id = auth.uid()
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
    OR owner_id = auth.uid()
  );

-- Users can delete websites in their workspaces
CREATE POLICY "Users can delete websites in their workspaces"
  ON websites FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
    OR owner_id = auth.uid()
  );

ALTER TABLE pages ENABLE ROW LEVEL SECURITY;

-- Users can see pages in websites they have access to
CREATE POLICY "Users can view pages in their websites"
  ON pages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE w.id = pages.website_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
    )
    OR EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = pages.website_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can create pages in their websites
CREATE POLICY "Users can create pages in their websites"
  ON pages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE w.id = website_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = website_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can update pages in their websites
CREATE POLICY "Users can update pages in their websites"
  ON pages FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE w.id = website_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = website_id
      AND w.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE w.id = website_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = website_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can delete pages in their websites
CREATE POLICY "Users can delete pages in their websites"
  ON pages FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE w.id = website_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin')
    )
    OR EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = website_id
      AND w.owner_id = auth.uid()
    )
  );

ALTER TABLE elements ENABLE ROW LEVEL SECURITY;

-- Users can see elements on pages they have access to
CREATE POLICY "Users can view elements on their pages"
  ON elements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE p.id = elements.page_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
    )
    OR EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = elements.page_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can create elements on their pages
CREATE POLICY "Users can create elements on their pages"
  ON elements FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE p.id = page_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = page_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can update elements on their pages
CREATE POLICY "Users can update elements on their pages"
  ON elements FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE p.id = page_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = page_id
      AND w.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE p.id = page_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = page_id
      AND w.owner_id = auth.uid()
    )
  );

-- Users can delete elements on their pages
CREATE POLICY "Users can delete elements on their pages"
  ON elements FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      JOIN workspace_members wm ON w.workspace_id = wm.workspace_id
      WHERE p.id = page_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = page_id
      AND w.owner_id = auth.uid()
    )
  );

-- ============================================
-- CRM MODULE
-- ============================================
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can see contacts in their workspaces
CREATE POLICY "Users can view contacts in their workspaces"
  ON contacts FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = contacts.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

-- Users can create contacts in their workspaces
CREATE POLICY "Users can create contacts in their workspaces"
  ON contacts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- Users can update contacts in their workspaces
CREATE POLICY "Users can update contacts in their workspaces"
  ON contacts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- Users can delete contacts in their workspaces
CREATE POLICY "Users can delete contacts in their workspaces"
  ON contacts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Similar policies for companies
CREATE POLICY "Users can view companies in their workspaces"
  ON companies FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = companies.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create companies in their workspaces"
  ON companies FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update companies in their workspaces"
  ON companies FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can delete companies in their workspaces"
  ON companies FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

ALTER TABLE pipelines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view pipelines in their workspaces"
  ON pipelines FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = pipelines.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create pipelines in their workspaces"
  ON pipelines FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update pipelines in their workspaces"
  ON pipelines FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view deals in their workspaces"
  ON deals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = deals.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create deals in their workspaces"
  ON deals FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update deals in their workspaces"
  ON deals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view activities in their workspaces"
  ON activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = activities.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create activities in their workspaces"
  ON activities FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- BOOKING MODULE
-- ============================================
ALTER TABLE booking_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view booking services in their workspaces"
  ON booking_services FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = booking_services.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create booking services in their workspaces"
  ON booking_services FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update booking services in their workspaces"
  ON booking_services FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE booking_staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view booking staff in their workspaces"
  ON booking_staff FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = booking_staff.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create booking staff in their workspaces"
  ON booking_staff FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE booking_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view booking availability in their workspaces"
  ON booking_availability FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = booking_availability.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage their own availability"
  ON booking_availability FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM booking_staff 
      WHERE booking_staff.id = staff_id 
      AND booking_staff.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM booking_staff 
      WHERE booking_staff.id = staff_id 
      AND booking_staff.user_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Public can view their own appointments (for customer portal)
CREATE POLICY "Users can view their own appointments"
  ON appointments FOR SELECT
  USING (
    customer_email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = appointments.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

-- Users can create appointments
CREATE POLICY "Users can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM booking_services 
      WHERE booking_services.id = service_id 
      AND booking_services.workspace_id = workspace_id
    )
  );

-- Users can update appointments in their workspaces
CREATE POLICY "Users can update appointments in their workspaces"
  ON appointments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
    OR customer_email = auth.jwt() ->> 'email'
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
    OR customer_email = auth.jwt() ->> 'email'
  );

-- ============================================
-- FORMS MODULE
-- ============================================
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view forms in their workspaces"
  ON forms FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = forms.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create forms in their workspaces"
  ON forms FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update forms in their workspaces"
  ON forms FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Public can submit forms
CREATE POLICY "Public can submit forms"
  ON form_submissions FOR INSERT
  WITH CHECK (TRUE);

-- Users can view form submissions in their workspaces
CREATE POLICY "Users can view form submissions in their workspaces"
  ON form_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM forms f
      JOIN workspace_members wm ON f.workspace_id = wm.workspace_id
      WHERE f.id = form_id
      AND wm.user_id = auth.uid()
      AND wm.is_active = TRUE
    )
  );

-- ============================================
-- E-COMMERCE MODULE
-- ============================================
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view product categories in their workspaces"
  ON product_categories FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = product_categories.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage product categories in their workspaces"
  ON product_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can view active products
CREATE POLICY "Public can view active products"
  ON products FOR SELECT
  USING (is_active = TRUE);

-- Users can view all products in their workspaces
CREATE POLICY "Users can view products in their workspaces"
  ON products FOR SELECT
  USING (
    is_active = TRUE
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = products.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can create products in their workspaces"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

CREATE POLICY "Users can update products in their workspaces"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

ALTER TABLE cart ENABLE ROW LEVEL SECURITY;

-- Users can access their own cart
CREATE POLICY "Users can access their own cart"
  ON cart FOR ALL
  USING (
    user_id = auth.uid() OR session_id = auth.jwt() ->> 'session_id'
  )
  WITH CHECK (
    user_id = auth.uid() OR session_id = auth.jwt() ->> 'session_id'
  );

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON orders FOR SELECT
  USING (
    user_id = auth.uid()
    OR customer_email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = orders.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid()
      AND is_active = TRUE
    )
    OR workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- ============================================
-- INVENTORY MODULE
-- ============================================
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view inventory in their workspaces"
  ON inventory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = inventory.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage inventory in their workspaces"
  ON inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- ASSETS
-- ============================================
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Public can view assets from published websites
CREATE POLICY "Public can view published assets"
  ON assets FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id IN (
        SELECT website_id FROM pages p
        JOIN elements e ON p.id = e.page_id
        WHERE e.id = assets.id
      )
      AND w.is_published = TRUE
    )
    OR EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = assets.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage assets in their workspaces"
  ON assets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- SETTINGS, AUDIT LOGS, EMAIL TEMPLATES
-- ============================================
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view settings in their workspaces"
  ON settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = settings.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can update settings in their workspaces"
  ON settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view audit logs in their workspaces"
  ON audit_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = audit_logs.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view email templates in their workspaces"
  ON email_templates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = email_templates.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage email templates in their workspaces"
  ON email_templates FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

-- ============================================
-- NOTIFICATIONS
-- ============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "System can create notifications"
  ON notifications FOR INSERT
  WITH CHECK (TRUE);

-- ============================================
-- WEBHOOKS
-- ============================================
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view webhooks in their workspaces"
  ON webhooks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = webhooks.workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
    )
  );

CREATE POLICY "Users can manage webhooks in their workspaces"
  ON webhooks FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members 
      WHERE workspace_members.workspace_id = workspace_id 
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.is_active = TRUE
      AND workspace_members.role IN ('owner', 'admin')
    )
  );

-- ============================================
-- ADDITIONAL POLICIES FOR PUBLIC ACCESS
-- ============================================

-- Public can view published websites
CREATE POLICY "Public can view published websites"
  ON websites FOR SELECT
  USING (is_published = TRUE);

-- Public can view published pages
CREATE POLICY "Public can view published pages"
  ON pages FOR SELECT
  USING (
    is_published = TRUE
    AND EXISTS (
      SELECT 1 FROM websites w
      WHERE w.id = pages.website_id
      AND w.is_published = TRUE
    )
  );

-- Public can view published elements
CREATE POLICY "Public can view published elements"
  ON elements FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN websites w ON p.website_id = w.id
      WHERE p.id = elements.page_id
      AND p.is_published = TRUE
      AND w.is_published = TRUE
    )
  );

-- Public can view active booking services
CREATE POLICY "Public can view active booking services"
  ON booking_services FOR SELECT
  USING (is_active = TRUE);

-- Public can view active booking staff
CREATE POLICY "Public can view active booking staff"
  ON booking_staff FOR SELECT
  USING (is_active = TRUE);

-- Public can view booking availability
CREATE POLICY "Public can view booking availability"
  ON booking_availability FOR SELECT
  USING (is_available = TRUE);

-- Public can view active categories
CREATE POLICY "Public can view active categories"
  ON product_categories FOR SELECT
  USING (is_active = TRUE);
