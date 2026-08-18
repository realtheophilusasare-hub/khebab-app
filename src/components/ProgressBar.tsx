import type { BuilderStep } from '../types';
import { STEP_FLOW, STEP_LABELS } from '../types';
import '../styles/ProgressBar.css';

interface Props {
  currentStep: BuilderStep;
  onStepClick: (step: BuilderStep) => void;
  completedSteps: BuilderStep[];
}

export function StepIndicator({ currentStep, onStepClick, completedSteps }: Props) {
  const currentIdx = STEP_FLOW.indexOf(currentStep);

  return (
    <div className="step-indicator">
      {STEP_FLOW.map((step, idx) => {
        const isComplete = completedSteps.includes(step);
        const isCurrent = step === currentStep;
        const isClickable = idx <= currentIdx;

        return (
          <div key={step} className="step-item">
            <button
              className={`step-button ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''} ${!isClickable ? 'disabled' : ''}`}
              onClick={() => isClickable && onStepClick(step)}
              disabled={!isClickable}
            >
              <span className="step-number">{isComplete ? '✓' : idx + 1}</span>
              <span className="step-label">{STEP_LABELS[step]}</span>
            </button>
            {idx < STEP_FLOW.length - 1 && (
              <div className={`step-connector ${idx < currentIdx ? 'active' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface BuildProgressProps {
  progress: number;
}

export function BuildProgressBar({ progress }: BuildProgressProps) {
  return (
    <div className="build-progress">
      <div className="build-progress-info">
        <span className="build-progress-label">Building your khebab...</span>
        <span className="build-progress-percent">{progress}%</span>
      </div>
      <div className="build-progress-bar">
        <div className="build-progress-fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
