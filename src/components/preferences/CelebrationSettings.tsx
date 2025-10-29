import React from 'react';

interface CelebrationSettingsProps {
  settings: {
    showSuccess: boolean;
    funGif: boolean;
    successSound: boolean;
  };
  onChange: (newSettings: CelebrationSettingsProps['settings']) => void;
}

const CelebrationSettings: React.FC<CelebrationSettingsProps> = ({ settings, onChange }) => {
  return (
    <div id="celebration" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Celebration Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="show-success" className="flex-grow">Show success screen</label>
          <input
            type="checkbox"
            id="show-success"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.showSuccess}
            onChange={(e) => onChange({ ...settings, showSuccess: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="fun-gif" className="flex-grow">Fun gif</label>
          <input
            type="checkbox"
            id="fun-gif"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.funGif}
            onChange={(e) => onChange({ ...settings, funGif: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="success-sound" className="flex-geo">Success sound effect</label>
          <input
            type="checkbox"
            id="success-sound"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.successSound}
            onChange={(e) => onChange({ ...settings, successSound: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default CelebrationSettings;
