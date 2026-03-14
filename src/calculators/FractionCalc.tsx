import React, { useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { ResultItem } from '../components/ResultItem';
import { PillToggle } from '../components/PillToggle';
import { useLocalStorage } from '../hooks/useLocalStorage';
import './FractionCalc.css';

type Mode = 'toFraction' | 'toDecimal';

interface FractionState {
  mode: Mode;
  decimal: string;
  wholeNumber: string;
  numerator: string;
  denominator: string;
}

// Generate fractions table (64ths)
const fractionsTable = Array.from({ length: 64 }, (_, i) => {
  const num = i + 1;
  const decimal = num / 64;

  // Simplify the fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(num, 64);
  const simplifiedNum = num / divisor;
  const simplifiedDen = 64 / divisor;

  return {
    decimal: decimal.toFixed(6),
    fraction: `${simplifiedNum}/${simplifiedDen}`,
    original: `${num}/64`
  };
});

export const FractionCalc: React.FC = () => {
  const [state, setState] = useLocalStorage<FractionState>('fraction-calc', {
    mode: 'toFraction',
    decimal: '0.375',
    wholeNumber: '0',
    numerator: '3',
    denominator: '8'
  });

  const [showTable, setShowTable] = useState(false);

  // Decimal to fraction conversion
  const fractionResult = useMemo(() => {
    if (state.mode !== 'toFraction') return null;

    const decimal = parseFloat(state.decimal);
    if (isNaN(decimal) || decimal < 0) return null;

    // Find nearest 64th
    const wholePart = Math.floor(decimal);
    const fractionalPart = decimal - wholePart;
    const nearest64th = Math.round(fractionalPart * 64);

    if (nearest64th === 0) {
      return {
        whole: wholePart,
        fraction: null,
        decimal: wholePart.toFixed(6)
      };
    }

    if (nearest64th === 64) {
      return {
        whole: wholePart + 1,
        fraction: null,
        decimal: (wholePart + 1).toFixed(6)
      };
    }

    // Simplify fraction
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(nearest64th, 64);
    const numerator = nearest64th / divisor;
    const denominator = 64 / divisor;

    const exactDecimal = wholePart + nearest64th / 64;

    return {
      whole: wholePart,
      fraction: { numerator, denominator },
      decimal: exactDecimal.toFixed(6),
      original64: `${nearest64th}/64`
    };
  }, [state.mode, state.decimal]);

  // Fraction to decimal conversion
  const decimalResult = useMemo(() => {
    if (state.mode !== 'toDecimal') return null;

    const whole = parseInt(state.wholeNumber) || 0;
    const num = parseInt(state.numerator) || 0;
    const den = parseInt(state.denominator) || 1;

    if (den === 0) return null;

    const decimal = whole + num / den;

    return {
      decimal: decimal.toFixed(6),
      mm: (decimal * 25.4).toFixed(3)
    };
  }, [state.mode, state.wholeNumber, state.numerator, state.denominator]);

  return (
    <div className="fraction-calc">
      <Card title="Decimal ↔ Fraction" icon="🔢">
        <div className="form-group">
          <label>Convert</label>
          <PillToggle
            options={[
              { value: 'toFraction', label: 'Decimal → Fraction' },
              { value: 'toDecimal', label: 'Fraction → Decimal' }
            ]}
            value={state.mode}
            onChange={(v) => setState({ ...state, mode: v })}
            fullWidth
          />
        </div>

        {state.mode === 'toFraction' ? (
          <div className="form-group">
            <label>Decimal Value</label>
            <input
              type="number"
              value={state.decimal}
              onChange={(e) => setState({ ...state, decimal: e.target.value })}
              placeholder="e.g. 0.375"
              step="0.001"
            />
          </div>
        ) : (
          <div className="fraction-inputs">
            <div className="form-group whole-input">
              <label>Whole</label>
              <input
                type="number"
                value={state.wholeNumber}
                onChange={(e) => setState({ ...state, wholeNumber: e.target.value })}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="fraction-group">
              <div className="form-group">
                <label>Numerator</label>
                <input
                  type="number"
                  value={state.numerator}
                  onChange={(e) => setState({ ...state, numerator: e.target.value })}
                  placeholder="1"
                  min="0"
                />
              </div>
              <span className="fraction-slash">/</span>
              <div className="form-group">
                <label>Denominator</label>
                <input
                  type="number"
                  value={state.denominator}
                  onChange={(e) => setState({ ...state, denominator: e.target.value })}
                  placeholder="8"
                  min="1"
                />
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Results */}
      {state.mode === 'toFraction' && fractionResult && (
        <Card title="Result" icon="📊">
          <div className="fraction-result">
            {fractionResult.whole > 0 && (
              <span className="result-whole">{fractionResult.whole}</span>
            )}
            {fractionResult.fraction && (
              <span className="result-fraction">
                <sup>{fractionResult.fraction.numerator}</sup>
                <span className="fraction-bar">/</span>
                <sub>{fractionResult.fraction.denominator}</sub>
              </span>
            )}
            {!fractionResult.fraction && fractionResult.whole === 0 && (
              <span className="result-whole">0</span>
            )}
          </div>

          <div className="results-row">
            <ResultItem label="Exact Decimal" value={fractionResult.decimal} variant="accent2" />
            {fractionResult.original64 && (
              <ResultItem label="As 64ths" value={fractionResult.original64} variant="default" />
            )}
          </div>
        </Card>
      )}

      {state.mode === 'toDecimal' && decimalResult && (
        <Card title="Result" icon="📊">
          <div className="decimal-result">
            <ResultItem label="Decimal (inches)" value={decimalResult.decimal} variant="accent" size="large" />
            <ResultItem label="Metric (mm)" value={decimalResult.mm} unit="mm" variant="accent2" />
          </div>
        </Card>
      )}

      {/* Quick Reference Table */}
      <Card title="64ths Reference" icon="📋">
        <button
          className="btn-secondary table-toggle"
          onClick={() => setShowTable(!showTable)}
        >
          {showTable ? 'Hide Table' : 'Show Reference Table'}
        </button>

        {showTable && (
          <div className="fraction-table-wrapper">
            <table className="fraction-table">
              <thead>
                <tr>
                  <th>Fraction</th>
                  <th>64ths</th>
                  <th>Decimal</th>
                </tr>
              </thead>
              <tbody>
                {fractionsTable.map((row, i) => (
                  <tr
                    key={i}
                    onClick={() => setState({
                      ...state,
                      mode: 'toFraction',
                      decimal: row.decimal
                    })}
                    className="clickable"
                  >
                    <td className="fraction-col">{row.fraction}</td>
                    <td className="sixty-col">{row.original}</td>
                    <td className="decimal-col">{row.decimal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
