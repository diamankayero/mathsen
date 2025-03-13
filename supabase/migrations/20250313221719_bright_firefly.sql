/*
  # Initial Schema Setup for MathPrepa

  1. New Tables
    - users (handled by Supabase Auth)
    - topics
      - id (uuid, primary key)
      - name (text)
      - description (text)
      - created_at (timestamp)
    - exercises
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - solution (text)
      - topic_id (uuid, foreign key)
      - difficulty (text)
      - created_at (timestamp)
    - forum_posts
      - id (uuid, primary key)
      - title (text)
      - content (text)
      - user_id (uuid, foreign key)
      - created_at (timestamp)
    - forum_replies
      - id (uuid, primary key)
      - content (text)
      - post_id (uuid, foreign key)
      - user_id (uuid, foreign key)
      - created_at (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Topics table
CREATE TABLE topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Topics are viewable by everyone"
  ON topics
  FOR SELECT
  TO public
  USING (true);

-- Exercises table
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  solution text NOT NULL,
  topic_id uuid REFERENCES topics(id),
  difficulty text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Exercises are viewable by everyone"
  ON exercises
  FOR SELECT
  TO public
  USING (true);

-- Forum posts table
CREATE TABLE forum_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum posts"
  ON forum_posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create forum posts"
  ON forum_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Forum replies table
CREATE TABLE forum_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  post_id uuid REFERENCES forum_posts(id),
  user_id uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view forum replies"
  ON forum_replies
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create forum replies"
  ON forum_replies
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert initial topics
INSERT INTO topics (name, description) VALUES
  ('Analyse', 'Limites, continuité, dérivation, intégration...'),
  ('Algèbre', 'Espaces vectoriels, matrices, groupes...'),
  ('Probabilités', 'Probabilités, variables aléatoires, statistiques...');

-- Insert example exercises
INSERT INTO exercises (title, content, solution, topic_id, difficulty) VALUES
  -- Analyse exercises
  (
    'Étude de fonction',
    'Étudier la fonction f(x) = x³ - 3x² + 2 sur ℝ. Déterminer ses variations, ses extremums et sa limite en ±∞.',
    'La dérivée f''(x) = 3x² - 6x = 3x(x-2). Les points critiques sont en x=0 et x=2.\nf''(x) < 0 sur ]0,2[ et f''(x) > 0 sur ]-∞,0[ ∪ ]2,+∞[.\nDonc f admet un maximum local en x=0 (f(0)=2) et un minimum local en x=2 (f(2)=-2).\nlim(x→±∞) f(x) = ±∞',
    (SELECT id FROM topics WHERE name = 'Analyse'),
    'moyen'
  ),
  (
    'Intégrale impropre',
    'Étudier la convergence de l''intégrale ∫(0,+∞) (e^(-x²))dx.',
    'On peut montrer que cette intégrale converge et sa valeur est √(π)/2.\nPreuve : utiliser le changement de variable u=x² puis identifier la fonction de densité de la loi normale centrée réduite.',
    (SELECT id FROM topics WHERE name = 'Analyse'),
    'difficile'
  ),
  -- Algèbre exercises
  (
    'Diagonalisation',
    'Soit A = [[2,1],[1,2]]. Déterminer si A est diagonalisable et, si oui, calculer P et D telles que A = PDP⁻¹.',
    'Le polynôme caractéristique est (2-λ)² - 1 = λ² - 4λ + 3 = (λ-1)(λ-3).\nValeurs propres : λ₁=1, λ₂=3\nVecteurs propres : v₁=[1,-1], v₂=[1,1]\nD = [[1,0],[0,3]], P = [[1,1],[−1,1]]',
    (SELECT id FROM topics WHERE name = 'Algèbre'),
    'moyen'
  ),
  (
    'Groupe cyclique',
    'Déterminer tous les sous-groupes du groupe cyclique ℤ/12ℤ.',
    'Les sous-groupes de ℤ/12ℤ sont les groupes cycliques d''ordre d où d divise 12.\nLes diviseurs de 12 sont : 1, 2, 3, 4, 6, 12\nDonc les sous-groupes sont : <0>, <6>, <4>, <3>, <2>, <1>',
    (SELECT id FROM topics WHERE name = 'Algèbre'),
    'difficile'
  ),
  -- Probabilités exercises
  (
    'Loi binomiale',
    'On lance une pièce équilibrée 10 fois. Quelle est la probabilité d''obtenir exactement 6 faces ?',
    'Il s''agit d''une loi binomiale B(10,1/2).\nP(X=6) = C(10,6) × (1/2)¹⁰\nP(X=6) = (10!/(6!(10-6)!)) × (1/2)¹⁰\nP(X=6) = 210/1024 ≈ 0.205',
    (SELECT id FROM topics WHERE name = 'Probabilités'),
    'moyen'
  ),
  (
    'Chaîne de Markov',
    'Soit une chaîne de Markov à 2 états avec matrice de transition P = [[0.7,0.3],[0.4,0.6]]. Calculer la distribution stationnaire.',
    'La distribution stationnaire π vérifie πP = π et π₁ + π₂ = 1\nDonne le système :\n0.7π₁ + 0.4π₂ = π₁\n0.3π₁ + 0.6π₂ = π₂\nπ₁ + π₂ = 1\nRésolution : π₁ = 4/7, π₂ = 3/7',
    (SELECT id FROM topics WHERE name = 'Probabilités'),
    'difficile'
  );