import React from 'react';

interface AlertSettingsProps {
  settings: {
    timedAlerts: boolean;
    alertSound: string;
  };
  onChange: (newSettings: AlertSettingsProps['settings']) => void;
}

const AlertSettings: React.FC<AlertSettingsProps> = ({ settings, onChange }) => {
  return (
    <div id="alerts" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Alert Settings</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="timed-alerts" className="flex-grow">Timed alerts during a task</label>
          <input
            type="checkbox"
            id="timed-alerts"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.timedAlerts}
            onChange={(e) => onChange({ ...settings, timedAlerts: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="alert-sound" className="flex-grow">Notification alerts</label>
          <select
            id="alert-sound"
            className="form-select bg-gray-700 text-white"
            value={settings.alertSound}
            onChange={(e) => onChange({ ...settings, alertSound: e.target.value })}
          >
            <option>Default</option>
            <option>None</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AlertSettings;
