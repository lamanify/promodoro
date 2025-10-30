import React from 'react';

interface BlitzPanelSettingsProps {
  settings: {
    screen: string;
    panelSide: string;
  };
  onChange: (newSettings: BlitzPanelSettingsProps['settings']) => void;
}

const BlitzPanelSettings: React.FC<BlitzPanelSettingsProps> = ({ settings, onChange }) => {
  return (
    <div id="blitz-panel" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Blitz Panel Side</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="screen-select" className="flex-grow">Screen for your Focus Panel</label>
          <select
            id="screen-select"
            className="form-select bg-gray-700 text-white"
            value={settings.screen}
            onChange={(e) => onChange({ ...settings, screen: e.target.value })}
          >
            <option>Main Screen</option>
            <option>Second Screen</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="panel-side" className="flex-grow">Focus Panel side</label>
          <select
            id="panel-side"
            className="form-select bg-gray-700 text-white"
            value={settings.panelSide}
            onChange={(e) => onChange({ ...settings, panelSide: e.target.value })}
          >
            <option>Left</option>
            <option>Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default BlitzPanelSettings;
