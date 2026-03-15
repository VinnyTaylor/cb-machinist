import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UnitSystem = 'imperial' | 'metric';

interface UnitContextType {
  units: UnitSystem;
  setUnits: (units: UnitSystem) => void;
  toggleUnits: () => void;
  // Conversion helpers
  convertLength: (value: number, toMetric?: boolean) => number;
  convertSpeed: (sfm: number, toMetric?: boolean) => number;
  formatLength: (inches: number, decimals?: number) => string;
  formatSpeed: (sfm: number, decimals?: number) => string;
  lengthUnit: string;
  speedUnit: string;
}

const UnitContext = createContext<UnitContextType | undefined>(undefined);

const MM_PER_INCH = 25.4;
const M_PER_FOOT = 0.3048;

export const UnitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [units, setUnits] = useState<UnitSystem>(() => {
    const stored = localStorage.getItem('cb-units');
    return (stored === 'metric' || stored === 'imperial') ? stored : 'imperial';
  });

  useEffect(() => {
    localStorage.setItem('cb-units', units);
  }, [units]);

  const toggleUnits = () => {
    setUnits(prev => prev === 'imperial' ? 'metric' : 'imperial');
  };

  // Convert length (inches to mm or vice versa)
  const convertLength = (value: number, toMetric?: boolean): number => {
    const convertToMetric = toMetric ?? (units === 'metric');
    return convertToMetric ? value * MM_PER_INCH : value;
  };

  // Convert surface speed (SFM to m/min or vice versa)
  const convertSpeed = (sfm: number, toMetric?: boolean): number => {
    const convertToMetric = toMetric ?? (units === 'metric');
    return convertToMetric ? sfm * M_PER_FOOT : sfm;
  };

  // Format length with unit
  const formatLength = (inches: number, decimals: number = 4): string => {
    if (units === 'metric') {
      return `${(inches * MM_PER_INCH).toFixed(decimals > 2 ? decimals - 1 : decimals)} mm`;
    }
    return `${inches.toFixed(decimals)}"`;
  };

  // Format speed with unit
  const formatSpeed = (sfm: number, decimals: number = 0): string => {
    if (units === 'metric') {
      return `${(sfm * M_PER_FOOT).toFixed(decimals)} m/min`;
    }
    return `${sfm.toFixed(decimals)} SFM`;
  };

  const lengthUnit = units === 'metric' ? 'mm' : 'in';
  const speedUnit = units === 'metric' ? 'm/min' : 'SFM';

  return (
    <UnitContext.Provider value={{
      units,
      setUnits,
      toggleUnits,
      convertLength,
      convertSpeed,
      formatLength,
      formatSpeed,
      lengthUnit,
      speedUnit
    }}>
      {children}
    </UnitContext.Provider>
  );
};

export const useUnits = (): UnitContextType => {
  const context = useContext(UnitContext);
  if (!context) {
    throw new Error('useUnits must be used within a UnitProvider');
  }
  return context;
};
