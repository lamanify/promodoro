import React, { useState, useEffect } from 'react';
import Header from '@/components/preferences/Header';
import Sidebar from '@/components/preferences/Sidebar';
import GeneralSettings from '@/components/preferences/GeneralSettings';
import BlitzPanelSettings from '@/components/preferences/BlitzPanelSettings';
import BlitzModeSettings from '@/components/preferences/BlitzModeSettings';
import AlertSettings from '@/components/preferences/AlertSettings';
import CelebrationSettings from '@/components/preferences/CelebrationSettings';
import { useNavigate } from 'react-router-dom';

const Preferences = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('blitzit-settings');
    return savedSettings ? JSON.parse(savedSettings) : {
      general: { wakeOnLogin: false, hideTimes: false },
      blitzPanel: { screen: 'Main Screen', panelSide: 'Left' },
      blitzMode: { pomodoro: false, workSprint: 25, breakTime: 5, defaultBreak: 15, scrollingTitle: false },
      alerts: { timedAlerts: false, alertSound: 'Default' },
      celebration: { showSuccess: false, funGif: false, successSound: false },
    };
  });

  const handleSave = () => {
    localStorage.setItem('blitzit-settings', JSON.stringify(settings));
    // You might want to show a toast notification here
    navigate('/');
  };

  const handleClose = () => {
    navigate('/');
  };

  const handleSettingChange = (category, newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [category]: newSettings,
    }));
  };

  return (
    <div className="h-screen bg-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 p-6">
        <Header onSave={handleSave} onClose={handleClose} />
        <main>
          <GeneralSettings
            settings={settings.general}
            onChange={(newSettings) => handleSettingChange('general', newSettings)}
          />
          <BlitzPanelSettings
            settings={settings.blitzPanel}
            onChange={(newSettings) => handleSettingChange('blitzPanel', newSettings)}
          />
          <BlitzModeSettings
            settings={settings.blitzMode}
            onChange={(newSettings) => handleSettingChange('blitzMode', newSettings)}
          />
          <AlertSettings
            settings={settings.alerts}
            onChange={(newSettings) => handleSettingChange('alerts', newSettings)}
          />
          <CelebrationSettings
            settings={settings.celebration}
            onChange={(newSettings) => handleSettingChange('celebration', newSettings)}
          />
        </main>
      </div>
    </div>
  );
};

export default Preferences;
