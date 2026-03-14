import React from 'react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import './InstallBanner.css';

export const InstallBanner: React.FC = () => {
  const { isInstallable, promptInstall, dismissInstall } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="install-banner">
      <div className="install-content">
        <div className="install-icon">📲</div>
        <div className="install-text">
          <strong>Install C&B Machinist</strong>
          <span>Add to home screen for offline access</span>
        </div>
      </div>
      <div className="install-actions">
        <button className="install-dismiss" onClick={dismissInstall}>
          Later
        </button>
        <button className="install-button" onClick={promptInstall}>
          Install
        </button>
      </div>
    </div>
  );
};
