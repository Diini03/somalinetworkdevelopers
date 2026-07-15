
TRUNCATE TABLE public.candidates RESTART IDENTITY CASCADE;

INSERT INTO public.candidates
  (name, title, photo, skills, expected_salary_min, expected_salary_max, email, location, qualification, bio, availability, linkedin, github, portfolio, experience, certifications, ai_score)
VALUES
('Ayaan Mohamed', 'Senior Frontend Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Ayaan', ARRAY['React','TypeScript','Next.js','Tailwind','GraphQL'], 60000, 90000, 'ayaan@example.com', 'Mogadishu', 'BSc Computer Science', 'Interface engineer focused on performance and design systems. Six years across fintech and edtech.', 'Open to work', 'https://linkedin.com/in/ayaan','https://github.com/ayaan',NULL,
  '[{"startYear":2022,"endYear":null,"company":"Hormuud Digital","description":"Led design-system rebuild across web + mobile."},{"startYear":2019,"endYear":2022,"company":"Somtel","description":"Built customer portal in React + TypeScript."}]'::jsonb, ARRAY[]::text[], 92),

('Ibrahim Yusuf', 'Backend Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Ibrahim', ARRAY['Go','PostgreSQL','AWS','gRPC','Redis'], 65000, 95000, 'ibrahim@example.com', 'Hargeisa', 'BSc Software Engineering', 'API and infra engineer. Builds boring, correct systems that don''t page you at 3am.', 'Open to work', 'https://linkedin.com/in/ibrahim','https://github.com/ibrahim',NULL,
  '[{"startYear":2021,"endYear":null,"company":"Dahabshiil Tech","description":"Owns payments API and reconciliation service."},{"startYear":2018,"endYear":2021,"company":"Freelance","description":"Backend consulting for NGOs and startups."}]'::jsonb, ARRAY[]::text[], 88),

('Fadumo Ali', 'Mobile Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Fadumo', ARRAY['Flutter','Kotlin','Firebase','Dart'], 45000, 70000, 'fadumo@example.com', 'Nairobi', 'BSc IT', 'Cross-platform mobile developer shipping consumer apps used by 200k+ people across East Africa.', 'Passive · 1 month notice', 'https://linkedin.com/in/fadumo',NULL,'https://fadumo.dev',
  '[{"startYear":2020,"endYear":null,"company":"M-Kopa","description":"Flutter apps for solar financing customers."}]'::jsonb, ARRAY[]::text[], 81),

('Hassan Farah', 'Staff Platform Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Hassan', ARRAY['Kubernetes','Rust','Go','Terraform','eBPF'], 130000, 180000, 'hassan@example.com', 'Remote', 'MSc Distributed Systems', 'Platform engineer with 10 years across infra and low-level systems. Currently building multi-region K8s tooling.', 'Passive · open to intros', 'https://linkedin.com/in/hassanfarah','https://github.com/hfarah','https://hfarah.io',
  '[{"startYear":2023,"endYear":null,"company":"Cloudflare","description":"Platform team, edge compute."},{"startYear":2019,"endYear":2023,"company":"Datadog","description":"Ingest infra, Rust services."}]'::jsonb, ARRAY[]::text[], 96),

('Naima Warsame', 'Data Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Naima', ARRAY['Python','Spark','dbt','Snowflake','Airflow'], 70000, 100000, 'naima@example.com', 'Addis Ababa', 'BSc Statistics', 'Builds analytical pipelines from raw log to trusted metric. Loves clean data more than clean code.', 'Open to work', 'https://linkedin.com/in/naima',NULL,NULL,
  '[{"startYear":2021,"endYear":null,"company":"Safaricom Ethiopia","description":"Data platform, dbt models, warehouse governance."}]'::jsonb, ARRAY[]::text[], 84),

('Abdi Jama', 'DevOps Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Abdi', ARRAY['Terraform','AWS','Kubernetes','GitHub Actions','Ansible'], 55000, 85000, 'abdi@example.com', 'Djibouti', 'BSc Computer Engineering', 'Automates infra so teams ship on Friday without fear.', 'Open to work', 'https://linkedin.com/in/abdijama','https://github.com/abdijama',NULL,
  '[{"startYear":2020,"endYear":null,"company":"Djibouti Telecom","description":"Cloud migration and CI/CD for internal apps."}]'::jsonb, ARRAY[]::text[], 79),

('Sagal Osman', 'Design Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Sagal', ARRAY['Figma','React','CSS','Framer Motion','TypeScript'], 75000, 110000, 'sagal@example.com', 'London', 'BA Interaction Design', 'Bridges design and engineering. Turns Figma into production components without losing the details.', 'Passive · open to intros', 'https://linkedin.com/in/sagal',NULL,'https://sagal.design',
  '[{"startYear":2022,"endYear":null,"company":"Linear","description":"Design engineering, onboarding + marketing surfaces."}]'::jsonb, ARRAY[]::text[], 90),

('Mohamed Barre', 'Full-stack Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Mohamed', ARRAY['Node.js','React','PostgreSQL','tRPC','Tailwind'], 55000, 80000, 'mohamed@example.com', 'Mogadishu', 'Self-taught', 'Ships end-to-end features weekly for early-stage founders. Contract-friendly.', 'Open to work', 'https://linkedin.com/in/mbarre','https://github.com/mbarre',NULL,
  '[{"startYear":2021,"endYear":null,"company":"Freelance","description":"Full-stack contracts for 8 startups."}]'::jsonb, ARRAY[]::text[], 76),

('Khadija Hussein', 'ML Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Khadija', ARRAY['PyTorch','LLMs','Python','Ray','LangChain'], 90000, 140000, 'khadija@example.com', 'Nairobi', 'MSc AI', 'Applied ML engineer. Building retrieval and evaluation stacks for East-African languages.', 'Open to work', 'https://linkedin.com/in/khadija','https://github.com/khadija','https://khadija.ai',
  '[{"startYear":2022,"endYear":null,"company":"Turing Labs","description":"LLM fine-tuning for legal document workflows."}]'::jsonb, ARRAY[]::text[], 93),

('Yusuf Aden', 'iOS Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Yusuf', ARRAY['Swift','SwiftUI','Combine','Core Data'], 85000, 120000, 'yusuf@example.com', 'Toronto', 'BSc CS', 'iOS craftsman. Cares about typography, haptics, and animations that don''t stutter.', 'Passive · 2 month notice', 'https://linkedin.com/in/yusufaden','https://github.com/yusufaden',NULL,
  '[{"startYear":2020,"endYear":null,"company":"Shopify","description":"Merchant iOS app, checkout flows."}]'::jsonb, ARRAY[]::text[], 82),

('Amina Abdi', 'Junior Frontend Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Amina', ARRAY['React','Tailwind','TypeScript','Vite'], 25000, 40000, 'amina@example.com', 'Hargeisa', 'BSc CS student', 'Recent grad shipping side projects and open source. Hungry, curious, mentor-ready.', 'Open to work', 'https://linkedin.com/in/aminaabdi','https://github.com/aminaabdi',NULL,
  '[{"startYear":2024,"endYear":null,"company":"iRise Hub","description":"Frontend intern on community platform."}]'::jsonb, ARRAY[]::text[], 68),

('Ali Mohamud', 'Security Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Ali', ARRAY['Rust','eBPF','Linux','Wireshark','Threat modeling'], 100000, 150000, 'ali@example.com', 'Remote', 'BSc Cybersecurity', 'Detection and response engineer. Reads syscall traces for fun.', 'Passive · open to intros', 'https://linkedin.com/in/alimohamud','https://github.com/alimohamud',NULL,
  '[{"startYear":2021,"endYear":null,"company":"Elastic","description":"Endpoint security research."}]'::jsonb, ARRAY[]::text[], 87),

('Halima Guled', 'QA Automation Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Halima', ARRAY['Playwright','TypeScript','Cypress','Postman'], 40000, 65000, 'halima@example.com', 'Nairobi', 'BSc IT', 'Automated test suites for regulated fintech products. Zero-flake ambitions.', 'Open to work', 'https://linkedin.com/in/halima',NULL,NULL,
  '[{"startYear":2021,"endYear":null,"company":"Cellulant","description":"QA lead, payments platform."}]'::jsonb, ARRAY[]::text[], 74),

('Omar Elmi', 'Site Reliability Engineer', 'https://api.dicebear.com/7.x/notionists-neutral/svg?seed=Omar', ARRAY['Go','Prometheus','Grafana','Kubernetes','SLOs'], 95000, 135000, 'omar@example.com', 'Frankfurt', 'BSc CS', 'SRE with a decade running high-traffic APIs. Wrote the runbook you copy-pasted last week.', 'Open to work', 'https://linkedin.com/in/omarelmi','https://github.com/omarelmi',NULL,
  '[{"startYear":2019,"endYear":null,"company":"N26","description":"SRE, banking core reliability."}]'::jsonb, ARRAY[]::text[], 89);
