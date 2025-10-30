import React from 'react';

interface BlitzModeSettingsProps {
  settings: {
    pomodoro: boolean;
    workSprint: number;
    breakTime: number;
    defaultBreak: number;
    scrollingTitle: boolean;
  };
  onChange: (newSettings: BlitzModeSettingsProps['settings']) => void;
}

const BlitzModeSettings: React.FC<BlitzModeSettingsProps> = ({ settings, onChange }) => {
  return (
    <div id="blitz-mode" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Blitz Mode (Focus Session)</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="pomodoro" className="flex-grow">Pomodoro</label>
          <input
            type="checkbox"
            id="pomodoro"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.pomodoro}
            onChange={(e) => onChange({ ...settings, pomodoro: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="work-sprint" className="flex-grow">Work sprint time</label>
          <input
            type="number"
            id="work-sprint"
            className="form-input bg-gray-700 text-white w-24"
            value={settings.workSprint}
            onChange={(e) => onChange({ ...settings, workSprint: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="break-time" className="flex-grow">Break time</label>
          <input
            type="number"
            id="break-time"
            className="form-input bg-gray-700 text-white w-24"
            value={settings.breakTime}
            onChange={(e) => onChange({ ...settings, breakTime: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="default-break" className="flex-grow">Default Break Length</label>
          <input
            type="number"
            id="default-break"
            className="form-input bg-gray-700 text-white w-24"
            value={settings.defaultBreak}
            onChange={(e) => onChange({ ...settings, defaultBreak: parseInt(e.target.value) })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="scrolling-title" className="flex-grow">Scrolling title on live timer</label>
          <input
            type="checkbox"
            id="scrolling-title"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.scrollingTitle}
            onChange={(e) => onChange({ ...settings, scrollingTitle: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default BlitzModeSettings;
