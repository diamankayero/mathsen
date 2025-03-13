import React from 'react';
import { BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="flex justify-center mb-8">
          <BrainCircuit className="w-20 h-20 text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenue sur MathPrepa
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Une plateforme gratuite pour les étudiants en classes préparatoires et à l'université
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Exercices</h2>
            <p className="text-gray-600">
              Accédez à une large collection d'exercices corrigés en analyse, algèbre et probabilités
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Forum</h2>
            <p className="text-gray-600">
              Échangez avec d'autres étudiants et posez vos questions mathématiques
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Gratuit</h2>
            <p className="text-gray-600">
              Tous nos contenus sont gratuits et accessibles à tous les étudiants
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}