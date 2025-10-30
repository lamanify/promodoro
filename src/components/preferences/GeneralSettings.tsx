import React from 'react';

interface GeneralSettingsProps {
  settings: {
    wakeOnLogin: boolean;
    hideTimes: boolean;
  };
  onChange: (newSettings: GeneralSettingsProps['settings']) => void;
}

const GeneralSettings: React.FC<GeneralSettingsProps> = ({ settings, onChange }) => {
  return (
    <div id="general" className="mb-8">
      <h2 className="text-2xl font-bold mb-4">General</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label htmlFor="wake-login" className="flex-grow">Open/show Blitzit on wake and login</label>
          <input
            type="checkbox"
            id="wake-login"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.wakeOnLogin}
            onChange={(e) => onChange({ ...settings, wakeOnLogin: e.target.checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <label htmlFor="hide-times" className="flex-grow">Hide EST/Done Times on tasks</label>
          <input
            type="checkbox"
            id="hide-times"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={settings.hideTimes}
            onChange={(e) => onChange({ ...settings, hideTimes: e.target.checked })}
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralSettings;
