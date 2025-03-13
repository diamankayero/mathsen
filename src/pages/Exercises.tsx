import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';

interface Exercise {
  id: string;
  title: string;
  content: string;
  solution: string;
  topic_id: string;
  difficulty: string;
}

interface Topic {
  id: string;
  name: string;
}

export default function Exercises() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [showSolution, setShowSolution] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchTopics();
    fetchExercises();
  }, []);

  async function fetchTopics() {
    const { data, error } = await supabase.from('topics').select('*');
    if (error) {
      console.error('Error fetching topics:', error);
    } else {
      setTopics(data);
    }
  }

  async function fetchExercises() {
    const { data, error } = await supabase.from('exercises').select('*');
    if (error) {
      console.error('Error fetching exercises:', error);
    } else {
      setExercises(data);
    }
  }

  const filteredExercises = exercises.filter((exercise) => {
    const matchesTopic = !selectedTopic || exercise.topic_id === selectedTopic;
    const matchesDifficulty = !selectedDifficulty || exercise.difficulty === selectedDifficulty;
    return matchesTopic && matchesDifficulty;
  });

  const toggleSolution = (id: string) => {
    setShowSolution((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Exercices</h1>
      
      <div className="flex gap-4 mb-8">
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Toutes les matières</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id}>
              {topic.name}
            </option>
          ))}
        </select>

        <select
          value={selectedDifficulty}
          onChange={(e) => setSelectedDifficulty(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Toutes les difficultés</option>
          <option value="facile">Facile</option>
          <option value="moyen">Moyen</option>
          <option value="difficile">Difficile</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredExercises.map((exercise) => (
          <div key={exercise.id} className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-2">{exercise.title}</h3>
            <div className="flex gap-2 mb-4">
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {topics.find((t) => t.id === exercise.topic_id)?.name}
              </span>
              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {exercise.difficulty}
              </span>
            </div>
            <div className="prose max-w-none mb-4">
              <ReactMarkdown>{exercise.content}</ReactMarkdown>
            </div>
            <button
              onClick={() => toggleSolution(exercise.id)}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              {showSolution[exercise.id] ? 'Masquer la solution' : 'Voir la solution'}
            </button>
            {showSolution[exercise.id] && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg prose max-w-none">
                <ReactMarkdown>{exercise.solution}</ReactMarkdown>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}