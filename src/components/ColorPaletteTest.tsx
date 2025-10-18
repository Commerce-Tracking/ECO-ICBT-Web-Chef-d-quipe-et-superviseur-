import React from 'react';

const ColorPaletteTest: React.FC = () => {
  const colorGroups = [
    {
      name: 'Vert Principal (Brand)',
      colors: [
        { name: '25', hex: '#f0f7f2', class: 'bg-brand-25' },
        { name: '50', hex: '#e1f0e6', class: 'bg-brand-50' },
        { name: '100', hex: '#c3e1cd', class: 'bg-brand-100' },
        { name: '200', hex: '#a7d2b5', class: 'bg-brand-200' },
        { name: '300', hex: '#8bc39d', class: 'bg-brand-300' },
        { name: '400', hex: '#6fb485', class: 'bg-brand-400' },
        { name: '500', hex: '#1A6C30', class: 'bg-brand-500' },
        { name: '600', hex: '#155a28', class: 'bg-brand-600' },
        { name: '700', hex: '#104820', class: 'bg-brand-700' },
        { name: '800', hex: '#0c3618', class: 'bg-brand-800' },
        { name: '900', hex: '#082410', class: 'bg-brand-900' },
        { name: '950', hex: '#041208', class: 'bg-brand-950' },
      ]
    },
    {
      name: 'Jaune (Warning)',
      colors: [
        { name: '25', hex: '#fffbf0', class: 'bg-warning-25' },
        { name: '50', hex: '#fff7e1', class: 'bg-warning-50' },
        { name: '100', hex: '#ffefc3', class: 'bg-warning-100' },
        { name: '200', hex: '#ffe7a7', class: 'bg-warning-200' },
        { name: '300', hex: '#ffdf8b', class: 'bg-warning-300' },
        { name: '400', hex: '#ffd76f', class: 'bg-warning-400' },
        { name: '500', hex: '#FFC200', class: 'bg-warning-500' },
        { name: '600', hex: '#e6ae00', class: 'bg-warning-600' },
        { name: '700', hex: '#cc9a00', class: 'bg-warning-700' },
        { name: '800', hex: '#b38600', class: 'bg-warning-800' },
        { name: '900', hex: '#997200', class: 'bg-warning-900' },
        { name: '950', hex: '#805e00', class: 'bg-warning-950' },
      ]
    },
    {
      name: 'Bleu (Info)',
      colors: [
        { name: '25', hex: '#f0f2f7', class: 'bg-info-25' },
        { name: '50', hex: '#e1e5f0', class: 'bg-info-50' },
        { name: '100', hex: '#c3cae1', class: 'bg-info-100' },
        { name: '200', hex: '#a7b0d2', class: 'bg-info-200' },
        { name: '300', hex: '#8b96c3', class: 'bg-info-300' },
        { name: '400', hex: '#6f7cb4', class: 'bg-info-400' },
        { name: '500', hex: '#00277F', class: 'bg-info-500' },
        { name: '600', hex: '#00206b', class: 'bg-info-600' },
        { name: '700', hex: '#001957', class: 'bg-info-700' },
        { name: '800', hex: '#001243', class: 'bg-info-800' },
        { name: '900', hex: '#000c2f', class: 'bg-info-900' },
        { name: '950', hex: '#00061b', class: 'bg-info-950' },
      ]
    },
    {
      name: 'Gris',
      colors: [
        { name: '100', hex: '#f0f2f5', class: 'bg-gray-100' },
        { name: '200', hex: '#e1e5ea', class: 'bg-gray-200' },
        { name: '300', hex: '#c3c9d1', class: 'bg-gray-300' },
        { name: '400', hex: '#a7b0b8', class: 'bg-gray-400' },
        { name: '500', hex: '#8b969f', class: 'bg-gray-500' },
        { name: '600', hex: '#6f7c86', class: 'bg-gray-600' },
        { name: '700', hex: '#53626d', class: 'bg-gray-700' },
        { name: '800', hex: '#374854', class: 'bg-gray-800' },
        { name: '900', hex: '#1b2e3b', class: 'bg-gray-900' },
        { name: '950', hex: '#0d171f', class: 'bg-gray-950' },
      ]
    }
  ];

  return (
    <div className="p-8 bg-white dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 font-dm-sans">
          🎨 Palette de Couleurs - Commerce Tracking
        </h1>
        
        <div className="space-y-8">
          {colorGroups.map((group) => (
            <div key={group.name} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-dm-sans">
                {group.name}
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4">
                {group.colors.map((color) => (
                  <div key={color.name} className="text-center">
                    <div 
                      className={`w-full h-20 rounded-lg border border-gray-200 dark:border-gray-700 mb-2 ${color.class}`}
                      title={`${color.name}: ${color.hex}`}
                    ></div>
                    <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      {color.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {color.hex}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-dm-sans">
            🔤 Typographie - DM Sans
          </h2>
          
          <div className="space-y-4">
            <div className="text-title-2xl font-bold text-brand-500">
              Titre 2XL - 72px - Vert Principal
            </div>
            <div className="text-title-xl font-bold text-info-500">
              Titre XL - 60px - Bleu Principal
            </div>
            <div className="text-title-lg font-bold text-warning-500">
              Titre LG - 48px - Jaune Principal
            </div>
            <div className="text-title-md font-semibold text-gray-700 dark:text-gray-300">
              Titre MD - 36px - Gris
            </div>
            <div className="text-title-sm font-medium text-gray-600 dark:text-gray-400">
              Titre SM - 30px - Gris moyen
            </div>
            <div className="text-theme-xl text-gray-800 dark:text-gray-200">
              Texte XL - 20px - Texte principal
            </div>
            <div className="text-theme-sm text-gray-700 dark:text-gray-300">
              Texte SM - 14px - Texte secondaire
            </div>
            <div className="text-theme-xs text-gray-600 dark:text-gray-400">
              Texte XS - 12px - Légendes
            </div>
          </div>
        </div>

        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 font-dm-sans">
            🎯 Exemples d'Utilisation
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <button className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Bouton Principal (Vert)
              </button>
              <button className="w-full bg-info-500 hover:bg-info-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Bouton Secondaire (Bleu)
              </button>
              <button className="w-full bg-warning-500 hover:bg-warning-600 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Bouton Avertissement (Jaune)
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-brand-50 border border-brand-200 text-brand-700 px-4 py-3 rounded-lg">
                Message de succès avec vert
              </div>
              <div className="bg-info-50 border border-info-200 text-info-700 px-4 py-3 rounded-lg">
                Message d'information avec bleu
              </div>
              <div className="bg-warning-50 border border-warning-200 text-warning-700 px-4 py-3 rounded-lg">
                Message d'avertissement avec jaune
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPaletteTest; 